/**
 * Ticket 11 — integration QA guards for the assembled page.
 *
 * SEAM: the whole page as `src/App.jsx` mounts it (`<Prototype />`), observed only through the DOM a
 * visitor gets, plus the files CRA ships verbatim from `public/`. These are the acceptance boxes
 * of ticket 11 that can be decided without layout: anchors, image references, the navy-on-orange
 * rule, the tel:/mailto: formats, the no-fabricated-content audit and the untouched legal pages.
 * Everything that needs layout, focus or motion (widths, tab order, lightbox, reduced motion, anchor
 * landing under the fixed nav) is verified in a real browser; the evidence is in the ticket.
 *
 * THE PAGE: the `nav`, `main` and `footer` landmarks plus the mobile call bar, and nothing after
 * the footer (ticket 02's dev-only token showcase was removed from the shell in ticket 11's review
 * follow-up; "page composition" below keeps it out). The content audits read exactly that.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import React from "react";
import { render } from "@testing-library/react";
import Prototype from "./Prototype";

const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const DATA = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/data.json"), "utf8").replace(/^﻿/, "")
);

const renderPage = () => {
  const utils = render(<Prototype />);
  const { container } = utils;
  const nav = container.querySelector("nav");
  const main = container.querySelector("main");
  const footer = container.querySelector("footer");
  // The mobile call bar is Nav's fixed sibling; it is the element that follows the <nav>.
  const callBar = nav.nextElementSibling;
  const page = [nav, callBar, main, footer];
  const pageQueryAll = (selector) => page.flatMap((root) => [...root.querySelectorAll(selector)]);
  const pageText = page.map((root) => root.textContent).join("\n");
  return { ...utils, nav, main, footer, callBar, pageQueryAll, pageText };
};

describe("page composition", () => {
  test("the footer is the last landmark and nothing renders after it", () => {
    const { container, footer } = renderPage();
    const landmarks = [...container.querySelectorAll("nav, main, footer")].filter(
      (el) => !el.parentElement.closest("nav, main, footer")
    );
    expect(landmarks.map((el) => el.tagName)).toEqual(["NAV", "MAIN", "FOOTER"]);
    expect(container.lastElementChild).toBe(footer);
  });
});

describe("internal anchors", () => {
  test("every in-page link resolves to a section inside <main>, and the nav reaches all four §4 sections", () => {
    const { container, main, pageQueryAll } = renderPage();
    const hashLinks = pageQueryAll('a[href^="#"]');
    expect(hashLinks.length).toBeGreaterThan(0);

    hashLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      const target = container.querySelector(`[id="${id}"]`);
      expect({ href: link.getAttribute("href"), found: Boolean(target) }).toEqual({
        href: link.getAttribute("href"),
        found: true,
      });
      expect(target.tagName).toBe("SECTION");
      expect(main.contains(target)).toBe(true);
    });

    const navTargets = [...container.querySelectorAll("nav a[href^='#']")].map((a) =>
      a.getAttribute("href")
    );
    expect(navTargets).toEqual(["#start", "#verfahren", "#einsatzbereiche", "#team", "#kontakt"]);
  });

  test("the six §4.1 anchors exist exactly once each, in page order", () => {
    const { main } = renderPage();
    const ids = [...main.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual(["start", "verfahren", "einsatzbereiche", "warum", "team", "kontakt"]);
  });
});

describe("image references", () => {
  test("every <img> on the page (including the lightbox copy) names a file shipped in public/", () => {
    const { container } = renderPage();
    const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(sources.length).toBeGreaterThan(0);

    sources.forEach((src) => {
      // PUBLIC_URL is "" under Jest, so both "img/x.png" and "/img/x.png" resolve from public/.
      const file = path.join(PUBLIC_DIR, src.replace(/^\//, ""));
      expect({ src, shipped: fs.existsSync(file) }).toEqual({ src, shipped: true });
    });
  });
});

describe("signal colour", () => {
  test("every orange fill carries navy text, and nothing white sits on or inside it", () => {
    const { pageQueryAll } = renderPage();
    const orange = pageQueryAll("*").filter((el) =>
      [...el.classList].some((c) => /(^|:|!)bg-signal/.test(c))
    );
    expect(orange.length).toBeGreaterThan(0);

    orange.forEach((el) => {
      expect([...el.classList]).toContain("!text-brand");
      [el, ...el.querySelectorAll("*")].forEach((node) => {
        const white = [...node.classList].filter((c) => /text-white/.test(c));
        expect(white).toEqual([]);
      });
    });
  });
});

describe("contact details", () => {
  const PHONE_INTERNATIONAL = DATA.Contact.phone; // "+49 176 618 77 599"
  const DISPLAY = "0176 618 77 599"; // C16 local format, written out independently

  test("every tel: link dials the data.json number and is named with the C16 local format", () => {
    const { pageQueryAll } = renderPage();
    const calls = pageQueryAll('a[href^="tel:"]');
    // nav CTA, mobile call bar, hero, Kontakt.
    expect(calls).toHaveLength(4);
    calls.forEach((a) => {
      expect(a.getAttribute("href")).toBe(`tel:${PHONE_INTERNATIONAL.replace(/\s+/g, "")}`);
      expect(a.getAttribute("aria-label")).toBe(`Anrufen: ${DISPLAY}`);
      expect(a.textContent).toContain(DISPLAY);
    });
  });

  test("the mailto: goes to the data.json address with a sensible, correctly encoded subject", () => {
    const { pageQueryAll } = renderPage();
    const mails = pageQueryAll('a[href^="mailto:"]');
    expect(mails).toHaveLength(1);
    const href = mails[0].getAttribute("href");
    const [address, query] = href.replace(/^mailto:/, "").split("?");
    expect(address).toBe(DATA.Contact.email);
    expect(mails[0].textContent).toContain(DATA.Contact.email);
    const params = new URLSearchParams(query);
    expect([...params.keys()]).toEqual(["subject"]);
    expect(params.get("subject")).toBe("Anfrage zur Grabenfräse");
    // The raw href is percent-encoded: no literal space or umlaut for a mail client to choke on.
    expect(href).not.toMatch(/[\sä]/);
  });
});

describe("no fabricated content (C2, C7, §2.7)", () => {
  const visibleCopy = (utils) => {
    const attrs = utils
      .pageQueryAll("[alt], [aria-label]")
      .map((el) => `${el.getAttribute("alt") || ""} ${el.getAttribute("aria-label") || ""}`);
    return `${utils.pageText}\n${attrs.join("\n")}`;
  };

  test("the only digits on the page are the phone number, the module numerals 01–04 and '3D'", () => {
    // textContent runs "01" straight into "Fräsmodul", so digit lookarounds, not \b.
    const copy = visibleCopy(renderPage())
      .split("0176 618 77 599")
      .join(" ")
      .replace(/(?<!\d)0[1-4](?!\d)/g, " ")
      .replace(/\b3D-/g, " ");
    expect(copy.match(/\d+/g)).toBeNull();
  });

  test("no references, testimonials, certifications, completed projects or performance promises", () => {
    const copy = visibleCopy(renderPage());
    const BANNED = [
      /referenz/i, /kunde/i, /testimonial/i, /bewertung/i, /erfahrungsbericht/i,
      /zertifi/i, /\bISO\b/, /TÜV/, /\bDIN\b/, /DEKRA/, /ausgezeichnet/i, /preis(träger|gekrönt)/i,
      /projekte?\s+(abgeschlossen|realisiert|umgesetzt)/i, /realisiert/i, /im einsatz/i, /bewährt/i,
      /garantier/i, /marktführ/i, /führende/i, /jahre(n)? erfahrung/i,
      /%|prozent/i, /tagesleistung/i, /meter pro/i, /x-?mal/i, /\bbis zu\b/i,
      /zufriedene/i, /partner/i,
    ];
    const hits = BANNED.filter((re) => re.test(copy)).map(String);
    expect(hits).toEqual([]);
  });
});

describe("legal pages and page head", () => {
  // SHA-256 of master's files (e5ffdd6), line endings normalised to LF so a CRLF checkout matches.
  const MASTER = {
    "impressum.html": "764535de8acf3d5f0304187f2bb6a4ddb0b463fe414bb36bd29fbd5f5d9747c7",
    "datenschutz.html": "28e0e37b78cebd7c9feedb1b8a5f1fb6aa4cdedad399e2e8efb4d3db65231d62",
  };

  test.each(Object.keys(MASTER))("%s is unchanged from master and linked from the footer", (file) => {
    const text = fs.readFileSync(path.join(PUBLIC_DIR, file), "utf8").replace(/\r\n/g, "\n");
    expect(crypto.createHash("sha256").update(text, "utf8").digest("hex")).toBe(MASTER[file]);
    const { footer } = renderPage();
    const hrefs = [...footer.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain(`/${file}`);
  });

  test("public/index.html (the build's HTML template) references none of the four missing favicons", () => {
    const html = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8");
    // Only attribute values count; the explanatory HTML comment may name the old paths.
    const refs = [...html.matchAll(/(?:href|content|src)="([^"]*)"/g)].map((m) => m[1]);
    const ICONS = ["favicon.ico", "apple-touch-icon.png", "apple-touch-icon-72x72.png", "apple-touch-icon-114x114.png"];
    expect(refs.filter((ref) => ICONS.some((icon) => ref.endsWith(icon)))).toEqual([]);
  });
});
