/**
 * Ticket 12 — the approved copy lives in `src/data/data.json` and the page renders it unchanged.
 *
 * SEAMS: the page as `src/App.jsx` mounts it, observed through its DOM, and the content file itself.
 * The source of truth is `src/__fixtures__/prototype-copy.json`, captured from the approved prototype
 * (commit 84ce708) before anything was moved or deleted — an independent golden, not a value this
 * test derives from the code under test.
 *
 * The golden was edited by hand once, for the "Das Unternehmen" section (Über uns, then Team: layout verdict C, 2026-10-21) and the
 * single machine name "Grabenfräse": the company owner approved that copy in the 2026-10-20 session
 * (`.scratch/unternehmen-section/spec.md`). It was edited by hand a second time for the "Partner gesucht"
 * section (eyebrow, H2, intro, both Partnerrollen with description and action label, and the two
 * encoded `mailto:` subjects): the company owner approved that copy in the 2026-10-21 session
 * (`.scratch/partner-recruiting/spec.md`; the sector labels in the spec were dropped by the layout
 * verdict of ticket 01 and are not in the golden). It was edited by hand a third time for the nav (ticket 04): the "Partner" link label between
 * "Unternehmen" and "Kontakt" and the hamburger button's accessible name "Menü" (an `aria-label`, no
 * visible text), both approved with the nav verdicts of tickets 06 and 07. Nothing else in it has been changed.
 *
 * The content file also feeds the Legal pages (ADR 0003), so the "approved" check also accepts the
 * Legal page fixtures and the Legal page titles written out below, and the "used" check searches the
 * landing page and every Legal page, document titles included. The "hardcoded" check stays on the
 * landing page: the Legal text wording is meant to be hardcoded.
 */
import fs from "fs";
import path from "path";
import React from "react";
import { render } from "@testing-library/react";
import { captureCopy } from "./__fixtures__/captureCopy";
import App from "./App";
import GOLDEN from "./__fixtures__/prototype-copy.json";

const DATA_FILE = path.resolve(__dirname, "data/data.json");

let originalGetComputedStyle;
beforeAll(() => {
  // jsdom 16 pseudo-element workaround, as in the section tests.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});
afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const leaves = (value) =>
  typeof value === "string"
    ? [value]
    : Object.values(value).flatMap((child) => leaves(child));

const mapLeaves = (value, fn) => {
  if (typeof value === "string") return fn(value);
  if (Array.isArray(value)) return value.map((child) => mapLeaves(child, fn));
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapLeaves(v, fn)]));
};

// A tel: href strips the spaces of the stored international number (C16), so a string also counts
// as present in its whitespace-free form.
const forms = (s) => [s, s.replace(/\s+/g, "")];

const OPEN = "⟦";
const CLOSE = "⟧";
const mark = (s) => `${OPEN}${s}${CLOSE}`;

/**
 * Loads App and the capture helpers against a substituted data.json. A fresh module registry gets
 * its own React, so the renderer and the capture helper come from the same registry as the App.
 */
const loadAppWith = async (content) => {
  vi.resetModules();
  vi.doMock("./data/data.json", () => ({ default: content }));
  const IsolatedReact = await import("react");
  const { default: IsolatedApp } = await import("./App");
  const helpers = await import("./__fixtures__/captureCopy");
  return { page: IsolatedReact.createElement(IsolatedApp), ...helpers };
};

/**
 * Renders App against a data.json whose every string is wrapped in ⟦…⟧: the landing page (`copy`,
 * for the hardcoded check) and every Legal page. `haystack` is everything the site shows, landing
 * page and Legal pages alike, document titles included (for the used check).
 *
 * A marked slug (`⟦impressum⟧`) names no Legal page, so the Legal pages are rendered from a second
 * copy that is marked everywhere except the `LegalPages` slugs. The slugs still have to be found
 * marked: the landing pass, fully marked, shows them in the footer's Legal page links.
 */
const renderWithMarkedData = async () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const marked = mapLeaves(data, mark);
  const routable = {
    ...marked,
    LegalPages: marked.LegalPages.map((page, i) => ({ ...page, slug: data.LegalPages[i].slug })),
  };
  // jsdom's document has no <title> unless one is added, and then ignores `document.title = ...`.
  if (!document.querySelector("title")) document.head.appendChild(document.createElement("title"));
  const originalScrollTo = window.scrollTo;
  window.scrollTo = () => {}; // jsdom does not implement it; Legal pages open at the top
  let copy;
  let pages;
  try {
    window.history.pushState({}, "", "/");
    const landing = await loadAppWith(marked);
    copy = await landing.captureCopy(landing.page);
    pages = [landing.captureStatic(landing.page)];
    const legal = await loadAppWith(routable);
    for (const { path: pathname } of LEGAL_PAGES) {
      window.history.pushState({}, "", pathname);
      pages.push(legal.captureStatic(legal.page));
    }
  } finally {
    window.history.pushState({}, "", "/");
    window.scrollTo = originalScrollTo;
    vi.doUnmock("./data/data.json");
    vi.resetModules();
  }
  const haystack = [
    ...Object.values(copy.status),
    ...pages.flatMap(({ blocks, attrs, sources, title }) => [
      blocks.join(""),
      ...attrs.map((a) => decodeURIComponent(a)),
      ...sources,
      title,
    ]),
  ].join("\n");
  return { data, copy, haystack };
};

test("the page renders exactly the approved prototype copy, character for character", async () => {
  expect(await captureCopy(<App />)).toEqual(GOLDEN);
});

test("the content file has no byte-order mark and parses as plain JSON", () => {
  const bytes = fs.readFileSync(DATA_FILE);
  expect([...bytes.subarray(0, 3)]).not.toEqual([0xef, 0xbb, 0xbf]);
  expect(() => JSON.parse(bytes.toString("utf8"))).not.toThrow();
});

// The Legal pages, written out here as an independent golden: path, verbatim fixture, tab title.
const LEGAL_PAGES = [
  { path: "/impressum/", fixture: "impressum.html", title: "Impressum – Ingenieurbüro Auner" },
  {
    path: "/datenschutz/",
    fixture: "datenschutz.html",
    title: "Datenschutzerklärung – Ingenieurbüro Auner",
  },
];

// A Legal page fixture approves its visible text (whitespace collapsed, as a reader sees it) and
// its link targets.
const fixtureCopy = (file) => {
  const holder = document.createElement("div");
  holder.innerHTML = fs.readFileSync(path.join(__dirname, "__fixtures__", file), "utf8");
  holder.querySelectorAll("br, p, h1, h2, h3, h4, h5, h6, li").forEach((el) => el.after(" "));
  return [
    holder.textContent.replace(/\s+/g, " "),
    ...[...holder.querySelectorAll("a")].map((a) => a.getAttribute("href")),
  ];
};

const APPROVED = [
  GOLDEN.blocks.join(""),
  ...GOLDEN.attrs.map((a) => decodeURIComponent(a)),
  ...Object.values(GOLDEN.status),
  ...LEGAL_PAGES.flatMap(({ fixture }) => fixtureCopy(fixture)),
  ...LEGAL_PAGES.map(({ title }) => title),
].join("\n");

/** The strings that are not approved copy. Image paths are exempt: `src` is not copy. */
const unapproved = (strings) =>
  strings
    .filter((s) => !forms(s).some((f) => APPROVED.includes(f)))
    .filter((s) => !/^img\/[\w-]+\.(png|jpg)$/.test(s));

describe("the approved check", () => {
  test("accepts a string found only in a Legal page fixture", () => {
    expect(unapproved(["Tulpenweg 12", "Registernummer: HRB 23617"])).toEqual([]);
  });

  test("accepts today's Legal page titles", () => {
    expect(
      unapproved(["Impressum – Ingenieurbüro Auner", "Datenschutzerklärung – Ingenieurbüro Auner"])
    ).toEqual([]);
  });

  test("rejects a string found in no approval source", () => {
    expect(unapproved(["Nirgends freigegebener Satz"])).toEqual(["Nirgends freigegebener Satz"]);
  });
});

test("every string in the content file is approved copy (or a path/anchor the page uses)", () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  expect(unapproved(leaves(data))).toEqual([]);
});

test("all page copy comes from the content file, and every string in it is used", async () => {
  const { data, copy, haystack } = await renderWithMarkedData();

  // Every visible text block and every non-empty alt / aria-label carries a marker, so none of it
  // is hardcoded in a component.
  const hardcoded = [
    ...copy.blocks,
    ...copy.attrs.filter((a) => /@(alt|aria-label)=./.test(a)),
    ...Object.values(copy.status),
  ].filter((text) => !text.includes(OPEN) && !text.includes(CLOSE));
  expect(hardcoded).toEqual([]);

  // Every string in the file reaches the site: no dead keys left over from the legacy layout.
  const unused = leaves(data).filter((s) => !forms(s).some((f) => haystack.includes(mark(f))));
  expect(unused).toEqual([]);
});

test("the used check searches every Legal page's copy and tab title", async () => {
  const { haystack } = await renderWithMarkedData();
  expect(haystack).toContain("Tulpenweg 12"); // Impressum only
  expect(haystack).toContain("Datenschutzerklärung – Ingenieurbüro Auner"); // tab title only
});
