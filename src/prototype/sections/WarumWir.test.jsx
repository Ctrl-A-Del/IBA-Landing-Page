/**
 * Tests for ticket 07 — Warum wir: the three service points in plain, honest German.
 *
 * SEAM: the rendered `<WarumWir />` component, observed through the DOM a visitor (or a screen
 * reader) gets: roles, accessible names, text and the SVG attributes lucide renders. No Tailwind
 * class string is asserted. The light background and the 1 / 3 column layout cannot be observed in
 * jsdom and are verified in the browser pass recorded in the ticket.
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import WarumWir from "./WarumWir";

let originalGetComputedStyle;

// Same shim as `Verfahren.test.jsx`: jsdom 16 logs "Not implemented" whenever `getByRole(..., {
// name })` asks for a pseudo-element's computed style. No pseudo-element here carries text, so the
// element's own style is an honest answer. It changes no assertion.
beforeAll(() => {
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const renderSection = () => {
  const utils = render(<WarumWir />);
  const section = utils.container.querySelector("section#warum");
  return { ...utils, section };
};

test("renders the #warum section, labelled by its heading", () => {
  const { section } = renderSection();

  expect(section).not.toBeNull();
  const heading = section.querySelector("h2");
  expect(heading).toHaveTextContent(/\S/);
  // A <section> with an accessible name is exposed as a region; its name is the H2.
  expect(screen.getByRole("region", { name: heading.textContent })).toBe(section);
});

// The three Services points from data.json (DESIGN_PLAN.md §1.6). Their names are kept verbatim;
// only the body text is rewritten (§4 row 5).
const POINT_NAMES = ["Schneller vorankommen", "Ressourcen effizient nutzen", "Fachkräfte entlasten"];

const getPoints = (section) => {
  const list = within(section).getByRole("list");
  return within(list).getAllByRole("listitem");
};

test("lists the three points in order, each named by its own heading with a body line", () => {
  const { section } = renderSection();

  const items = getPoints(section);
  expect(items).toHaveLength(3);
  items.forEach((item, i) => {
    expect(item.querySelector("h3")).toHaveTextContent(POINT_NAMES[i]);
    const body = item.querySelector("p");
    expect(body).not.toBeNull();
    expect(body.textContent.length).toBeGreaterThan(40);
  });
});

// C2: the machine is a development project. These are the ticket's honesty criteria, written as
// the words that would break them. The source of truth is the ticket, not the component's copy.
const HEDGE = /\bsoll(en|te|ten)?\b/i;
const CLAIM = new RegExp(
  [
    "%",
    "prozent",
    "mal (so )?(schnell|viel)",
    "tagesleistung", // the old comparative performance promise
    "\\bals (klassische|herkömmliche|bisherige)", // any "better than X" ratio
    "zertifi",
    "referenz",
    "bewährt",
    "garantier",
    "im einsatz",
    "realisiert",
    "abgeschlossen",
  ].join("|"),
  "i"
);
// Hedging resolved, not deleted: each point states openly that it is a goal of a machine being built.
const INTENT = /\b(ziel|ausgelegt|entwickeln|entwickelt|geplant|planen)\b/i;

test("the copy is plain German without 'sollen' hedging, and says the machine is in development", () => {
  const { section } = renderSection();

  expect(section.textContent).not.toMatch(HEDGE);
  expect(section.textContent).toMatch(/\bEntwicklung\b/);
  getPoints(section).forEach((item) => {
    expect(item.querySelector("p").textContent).toMatch(INTENT);
  });
});

test("no claim of measured performance, a ratio, a delivered project, a certification or a count", () => {
  const { section } = renderSection();

  expect(section.textContent).not.toMatch(CLAIM);
  // Counts and ratios need numerals; the section has none at all.
  expect(section.textContent).not.toMatch(/\d/);
});

test("each point carries one decorative lucide icon, all at the same stroke width, and no emoji", () => {
  const { section } = renderSection();

  const strokeWidths = getPoints(section).map((item) => {
    const icons = item.querySelectorAll("svg");
    expect(icons).toHaveLength(1);
    const [icon] = icons;
    expect(icon.getAttribute("class")).toMatch(/\blucide\b/);
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    return icon.getAttribute("stroke-width");
  });
  expect(strokeWidths[0]).toMatch(/\S/);
  expect(new Set(strokeWidths).size).toBe(1);

  expect(section.textContent).not.toMatch(/\p{Extended_Pictographic}/u);
});
