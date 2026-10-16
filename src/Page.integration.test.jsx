/**
 * Ticket 11 — integration QA guards for the assembled page (moved from `src/prototype/` and
 * extended with the image-pruning guards in ticket 12).
 *
 * SEAM: the whole page as `src/App.jsx` mounts it (`<App />`), observed only through the DOM a
 * visitor gets, plus the files CRA ships verbatim from `public/`. These are the acceptance boxes
 * of ticket 11 that can be decided without layout: anchors, image references, the navy-on-orange
 * rule, the tel:/mailto: formats, the no-fabricated-content audit and the untouched legal pages.
 * Everything that needs layout, focus or motion (widths, tab order, lightbox, reduced motion, anchor
 * landing under the fixed nav) is verified in a real browser; the evidence is in the ticket.
 *
 * THE PAGE: the `nav`, `main` and `footer` landmarks plus the mobile call bar, and nothing after
 * the footer ("page composition" below keeps it that way). The content audits read exactly that.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import React from "react";
import { render, within } from "@testing-library/react";
import App from "./App";
import CTA from "./components/ui/CTA";

const PUBLIC_DIR = path.resolve(__dirname, "../public");
// Read raw, with no byte-order-mark stripping: ticket 12 keeps the file BOM-free (App.copy.test).
const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, "data/data.json"), "utf8"));

let originalGetComputedStyle;

beforeAll(() => {
  // Same jsdom 16 pseudo-element workaround as the section tests: `getAllByRole(..., { name })`
  // asks for ::before/::after styles, which jsdom does not implement.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const DISPLAY = "0176 618 77 599"; // C16 local format, written out independently
const CALL_NAME = `Anrufen: ${DISPLAY}`;

// Every text node under `root`, joined with spaces. `textContent` glues adjacent elements together
// ("01" + "Fräsmodul" -> "01Fräsmodul", "bis" + "zu" -> "biszu"), which can both hide a banned
// phrase that spans two elements and invent words that are not on the page.
const textOf = (root) => {
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const parts = [];
  while (walker.nextNode()) parts.push(walker.currentNode.nodeValue);
  return parts.join(" ").replace(/\s+/g, " ");
};

const renderPage = () => {
  const utils = render(<App />);
  const { container } = utils;
  const nav = container.querySelector("nav");
  const main = container.querySelector("main");
  const footer = container.querySelector("footer");
  // The mobile call bar: the one call link outside every landmark (a fixed overlay, not part of the
  // nav). The bar is that link's top-level ancestor.
  const barCalls = within(container)
    .getAllByRole("link", { name: CALL_NAME })
    .filter((a) => !a.closest("nav, main, footer"));
  expect(barCalls).toHaveLength(1);
  let callBar = barCalls[0];
  while (callBar.parentElement !== container) callBar = callBar.parentElement;
  const page = [nav, callBar, main, footer];
  const pageQueryAll = (selector) => page.flatMap((root) => [...root.querySelectorAll(selector)]);
  const pageText = page.map(textOf).join("\n");
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
  test("every in-page link resolves to a section inside <main>, and the nav links the page top plus the four §4 nav sections", () => {
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

describe("shipped images (ticket 12 pruning, D4)", () => {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    });

  test("public/img holds exactly the five images the v2 page uses: no template leftovers", () => {
    const shipped = walk(path.join(PUBLIC_DIR, "img"))
      .map((file) => path.relative(PUBLIC_DIR, file).split(path.sep).join("/"))
      .sort();
    expect(shipped).toEqual([
      "img/fraese.png",
      "img/jan.png",
      "img/klaus.png",
      "img/logo.jpg",
      "img/marcus.png",
    ]);
  });

  test("every image and icon the page head references still exists after pruning", () => {
    const head = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8");
    const refs = [
      ...head.matchAll(/<(?:meta|link)\b[^>]*?(?:content|href)="([^"]+\.(?:png|jpe?g|ico|svg|webp))"/g),
    ].map((m) => m[1].replace(/^https:\/\/ingenieurbuero-auner\.com\//, "").replace(/^\//, ""));
    // og:image and twitter:image (no favicon exists, see ticket 01).
    expect(refs.length).toBeGreaterThanOrEqual(2);
    refs.forEach((ref) => {
      expect({ ref, shipped: fs.existsSync(path.join(PUBLIC_DIR, ref)) }).toEqual({ ref, shipped: true });
    });
  });
});

describe("one face, one brand mark (B6, C15, C18)", () => {
  test("Marcus Auner's portrait appears exactly once on the page, in Team", () => {
    const { container } = renderPage();
    const portraits = [...container.querySelectorAll("img")].filter((img) =>
      /(^|\/)img\/marcus\.png$/.test(img.getAttribute("src"))
    );
    expect(portraits).toHaveLength(1);
    expect(portraits[0].closest("section").id).toBe("team");
  });

  test("the full logo plate is never shown whole: every logo.jpg sits inside a round emblem crop", () => {
    const { container } = renderPage();
    const logos = [...container.querySelectorAll("img")].filter((img) =>
      /\/img\/logo\.jpg$/.test(img.getAttribute("src"))
    );
    // Nav and footer.
    expect(logos).toHaveLength(2);
    logos.forEach((img) => {
      // Inside the shared emblem's round crop wrapper, never free-standing as the plate.
      expect(img.parentElement).toHaveAttribute("data-emblem");
      // Decorative crop: no alt naming the company (the name is text where it is needed).
      expect(img).toHaveAttribute("alt", "");
    });
    expect(container.querySelector('img[alt="Ingenieurbüro-Auner GmbH"]')).toBeNull();
  });

  test("the footer names the company and carries a copyright line with the current year, but no tel:/mailto:", () => {
    const { footer } = renderPage();
    const year = new Date().getFullYear();
    expect(textOf(footer)).toContain("Ingenieurbüro-Auner GmbH");
    expect(textOf(footer)).toContain(`© ${year} Ingenieurbüro-Auner GmbH`);
    expect(footer.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')).toHaveLength(0);
  });
});

describe("signal colour", () => {
  // WHY CLASSES: jsdom loads no Tailwind CSS and computes no colours, so the class contract is the
  // only seam it offers. As in Kontakt.test and Team.test, the expected classes come from a
  // reference render of the locked primitive, not a hand-written list. The computed-colour check
  // (every text/SVG node on an orange background is navy) is done in the real browser; see the ticket.
  test("every orange fill is the locked CTA primitive (navy text), and nothing white sits on or inside it", () => {
    const { pageQueryAll } = renderPage();
    const { container: reference } = render(<CTA href="tel:x">x</CTA>);
    const ctaClasses = [...reference.querySelector("a").classList];
    const orange = pageQueryAll("*").filter((el) =>
      [...el.classList].some((c) => /(^|:|!)bg-signal/.test(c))
    );
    expect(orange.length).toBeGreaterThan(0);

    orange.forEach((el) => {
      expect(ctaClasses.filter((cls) => !el.classList.contains(cls))).toEqual([]);
      [el, ...el.querySelectorAll("*")].forEach((node) => {
        const white = [...node.classList].filter((c) => /text-white/.test(c));
        expect(white).toEqual([]);
      });
    });
  });
});

describe("contact details", () => {
  const PHONE_INTERNATIONAL = DATA.Contact.phone; // "+49 176 618 77 599"

  test("every tel: link dials the data.json number and is named with the C16 local format", () => {
    const { pageQueryAll } = renderPage();
    const calls = pageQueryAll('a[href^="tel:"]');
    // nav CTA, mobile call bar, hero, Kontakt.
    expect(calls).toHaveLength(4);
    calls.forEach((a) => {
      expect(a.getAttribute("href")).toBe(`tel:${PHONE_INTERNATIONAL.replace(/\s+/g, "")}`);
      expect(a.getAttribute("aria-label")).toBe(CALL_NAME);
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

  test("the only digits on the page are the phone number, the module numerals 01–04, '3D' and the copyright year", () => {
    // The year comes from the same clock the footer reads, never a hardcoded literal.
    const year = String(new Date().getFullYear());
    // Digit lookarounds, not \b, so "01" is caught whatever text sits next to it.
    const copy = visibleCopy(renderPage())
      .split("0176 618 77 599")
      .join(" ")
      .split(`© ${year}`)
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

  // SOURCE GUARD ONLY: this checks what goes into the build (the HTML template and every source
  // file). The build output itself (a grep over the built directory, plus the network log for
  // 404s) is checked by the build and browser pass recorded in the ticket, not here.
  test("neither public/index.html nor any file in src/ references the four missing favicons", () => {
    const ICONS = ["favicon.ico", "apple-touch-icon.png", "apple-touch-icon-72x72.png", "apple-touch-icon-114x114.png"];
    // Quoted values only, single or double quotes: prose in a comment may name the old paths.
    const iconRefs = (text) =>
      [...text.matchAll(/(["'])([^"'\n]*)\1/g)]
        .map((m) => m[2])
        .filter((value) => ICONS.some((icon) => value.endsWith(icon)));

    const SRC_DIR = __dirname;
    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
      });
    // Test files are skipped: this one has to name the icons to look for them.
    const sources = walk(SRC_DIR).filter(
      (file) => /\.(jsx?|css|html)$/.test(file) && !/\.test\.jsx?$/.test(file)
    );
    expect(sources.length).toBeGreaterThan(0);

    const hits = [path.join(PUBLIC_DIR, "index.html"), ...sources].flatMap((file) =>
      iconRefs(fs.readFileSync(file, "utf8")).map((ref) => `${path.basename(file)}: ${ref}`)
    );
    expect(hits).toEqual([]);
  });
});
