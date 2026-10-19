/**
 * Legal pages in the site theme (spec: .scratch/legal-pages/spec.md, ticket 01).
 *
 * SEAM: the whole mounted app (`<App />`) with the browser location set to a path, observed only
 * through the DOM a visitor gets. The Legal text is guarded against a verbatim fixture copied from
 * the original HTML (`src/__fixtures__/*.html`): visible text, link targets and heading levels.
 */
import fs from "fs";
import path from "path";
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

const fixture = (file) => {
  const holder = document.createElement("div");
  holder.innerHTML = fs.readFileSync(path.join(__dirname, "__fixtures__", file), "utf8");
  return holder;
};

const normalise = (text) => text.replace(/\s+/g, " ").trim();
// Visible text: a line break or the end of a block is whitespace to the reader, so it is one here.
// Nothing else is normalised: a missing or extra word, letter or punctuation mark still fails.
const visibleText = (root) => {
  const copy = root.cloneNode(true);
  copy.querySelectorAll("br, p, h1, h2, h3, h4, h5, h6, li").forEach((el) => {
    el.after(" ");
  });
  return normalise(copy.textContent);
};
// The Impressum fixture is h2-only; LegalPage adds a visually hidden h1 for it (spec story 12).
// That added h1 is not Legal text, so the comparison leaves it out explicitly.
const withoutAddedH1 = (root) => {
  const copy = root.cloneNode(true);
  copy.querySelectorAll("h1.sr-only").forEach((h) => h.remove());
  return copy;
};
const facts = (root) => ({
  text: visibleText(root),
  links: [...root.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.getAttribute("rel")]),
  headings: [...root.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => [
    h.tagName,
    normalise(h.textContent),
  ]),
});

const renderAt = (pathname) => {
  window.history.pushState({}, "", pathname);
  return render(<App />);
};

beforeEach(() => {
  // jsdom's document has no <title> unless one is added, and then ignores `document.title = ...`.
  if (!document.querySelector("title")) document.head.appendChild(document.createElement("title"));
});
beforeEach(() => {
  window.scrollTo = vi.fn(); // jsdom does not implement it
});
afterEach(() => window.history.pushState({}, "", "/"));

describe.each(["/impressum", "/impressum/"])("the Impressum at %s", (pathname) => {
  test("shows the Legal text word for word: text, link targets and heading levels", () => {
    const { container } = renderAt(pathname);
    const main = container.querySelector("main");
    expect(facts(withoutAddedH1(main))).toEqual(facts(fixture("impressum.html")));
  });

  test("carries the corrected address line", () => {
    const { container } = renderAt(pathname);
    expect(container.querySelector("main").textContent).toContain("41366 Schwalmtal");
  });
});

describe.each(["/impressum/", "/datenschutz/"])("the headings at %s", (pathname) => {
  test("has exactly one h1, and the lower levels equal the fixture's", () => {
    const { container } = renderAt(pathname);
    const main = container.querySelector("main");
    expect(main.querySelectorAll("h1")).toHaveLength(1);
    const lower = (root) =>
      [...root.querySelectorAll("h2, h3, h4, h5, h6")].map((h) => [h.tagName, normalise(h.textContent)]);
    const file = pathname.includes("impressum") ? "impressum.html" : "datenschutz.html";
    expect(lower(main)).toEqual(lower(fixture(file)));
  });
});

describe.each(["/datenschutz", "/datenschutz/"])("the Datenschutzerklärung at %s", (pathname) => {
  test("shows the Legal text word for word: text, link targets and heading levels", () => {
    const { container } = renderAt(pathname);
    const main = container.querySelector("main");
    expect(facts(main)).toEqual(facts(fixture("datenschutz.html")));
  });

  test("has the nav and footer chrome, a solid nav and the Datenschutz tab title, opened at the top", () => {
    document.title = "Ingenieurbüro Auner";
    const { container, unmount } = renderAt(pathname);
    expect(container.querySelector("nav")).toHaveAttribute("data-state", "solid");
    expect(container.querySelector("footer")).not.toBeNull();
    expect(document.title).toBe("Datenschutzerklärung – Ingenieurbüro Auner");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    unmount();
    expect(document.title).toBe("Ingenieurbüro Auner");
  });
});

describe.each(["/", "/impressum/", "/datenschutz/"])("the footer legal links at %s", (pathname) => {
  test("lead to /impressum/ and /datenschutz/", () => {
    const { container } = renderAt(pathname);
    const links = [...container.querySelectorAll("footer a")].map((a) => [
      a.textContent,
      a.getAttribute("href"),
    ]);
    expect(links).toEqual([
      ["Impressum", "/impressum/"],
      ["Datenschutzerklärung", "/datenschutz/"],
    ]);
  });
});

describe("the Impressum chrome and head", () => {
  const CALL_NAME = "Anrufen: 0176 618 77 599";

  test("has the nav and footer landmarks and the mobile call bar", () => {
    const { container, getAllByRole } = renderAt("/impressum/");
    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelector("footer")).not.toBeNull();
    const bar = getAllByRole("link", { name: CALL_NAME }).filter(
      (a) => !a.closest("nav, main, footer")
    );
    expect(bar).toHaveLength(1);
  });

  test("nav section links lead to the landing page's sections, not to dead same-page anchors", () => {
    const { container } = renderAt("/impressum/");
    const hrefs = [...container.querySelectorAll("nav a")]
      .map((a) => a.getAttribute("href"))
      .filter((href) => href.includes("#"));
    expect(hrefs).toEqual(["/#start", "/#verfahren", "/#einsatzbereiche", "/#team", "/#kontakt"]);
  });

  test("the nav is solid although the page has no hero and is not scrolled", () => {
    const { container } = renderAt("/impressum/");
    expect(container.querySelector("nav")).toHaveAttribute("data-state", "solid");
  });

  test("the tab title names the page, and the landing title is restored once it is left", () => {
    document.title = "Ingenieurbüro Auner";
    const { unmount } = renderAt("/impressum");
    expect(document.title).toBe("Impressum – Ingenieurbüro Auner");
    unmount();
    expect(document.title).toBe("Ingenieurbüro Auner");
  });

  test("opens scrolled to the top", () => {
    renderAt("/impressum/");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

test("the landing title is restored when navigating from a Legal page back to the landing page", () => {
  document.title = "Ingenieurbüro Auner";
  const legal = renderAt("/impressum/");
  expect(document.title).toBe("Impressum – Ingenieurbüro Auner");
  legal.unmount();
  const landing = renderAt("/");
  expect(landing.container.querySelector("main section#start")).not.toBeNull();
  expect(document.title).toBe("Ingenieurbüro Auner");
});

describe.each(["/", "/gibt-es-nicht", "/impressum-nicht"])("the landing page at %s", (pathname) => {
  test("renders the landing page with its own title untouched", () => {
    document.title = "Ingenieurbüro Auner";
    const { container } = renderAt(pathname);
    expect([...container.querySelectorAll("main section[id]")].map((s) => s.id)).toEqual([
      "start",
      "verfahren",
      "einsatzbereiche",
      "warum",
      "team",
      "kontakt",
    ]);
    expect(container.querySelector("nav a[href='#verfahren']")).not.toBeNull();
    expect(document.title).toBe("Ingenieurbüro Auner");
  });
});
