/**
 * Tests for ticket 10 — Footer: brand block and legal links on the navy background.
 * Rewritten in 11.1 (R6): the full logo plate is gone, replaced by the emblem crop, the company
 * name as text, and a copyright line.
 *
 * SEAM: the rendered `<Footer />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the footer landmark, its links, the emblem image and the text. Link targets are additionally
 * resolved against `public/`, the directory CRA serves verbatim, so "the link resolves" means "the
 * file the href names is shipped". No Tailwind class string is asserted: the navy backdrop and the
 * clearance above the mobile call bar cannot be observed in jsdom and are verified in the browser
 * pass recorded in the ticket.
 */
import fs from "fs";
import path from "path";
import React from "react";
import { render, within } from "@testing-library/react";
import Footer from "./Footer";

const PUBLIC_DIR = path.resolve(__dirname, "../../../public");

let originalGetComputedStyle;

beforeAll(() => {
  // Same jsdom 16 pseudo-element workaround as Verfahren.test.jsx / Team.test.jsx: `getByRole(...,
  // { name })` asks for ::before/::after styles, which jsdom does not implement.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const renderFooter = () => {
  const utils = render(<Footer />);
  const footer = utils.getByRole("contentinfo");
  return { ...utils, footer };
};

test("renders the page's footer landmark", () => {
  const { footer } = renderFooter();
  expect(footer.tagName).toBe("FOOTER");
});

test.each([
  ["Impressum", "impressum.html"],
  ["Datenschutzerklärung", "datenschutz.html"],
])("links to the %s page, and the linked file is shipped in public/", (label, file) => {
  const { footer } = renderFooter();
  const link = within(footer).getByRole("link", { name: label });
  const href = link.getAttribute("href");

  expect(href).toBe(`/${file}`);
  expect(fs.existsSync(path.join(PUBLIC_DIR, href))).toBe(true);
});

test("the emblem is decorative: the company name sits beside it as text, not as alt", () => {
  const { footer } = renderFooter();

  const emblem = footer.querySelector("img");
  expect(emblem.getAttribute("src")).toMatch(/\/img\/emblem\.png$/);
  expect(emblem).toHaveAttribute("alt", "");
  // Named once, as text — not a second time via alt (that would announce it twice).
  expect(within(footer).getAllByText("Ingenieurbüro-Auner GmbH")).toHaveLength(1);
});

test("does not repeat the contact details owned by the Kontakt section", () => {
  const { footer } = renderFooter();
  expect(footer.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')).toHaveLength(0);
});

test.each([
  ["2031-05-01T12:00:00Z", "2031"],
  ["2040-07-01T12:00:00Z", "2040"],
])("the copyright line shows the year the system clock reads (%s)", (now, year) => {
  jest.useFakeTimers();
  try {
    jest.setSystemTime(new Date(now));
    const { footer } = renderFooter();
    expect(footer).toHaveTextContent(`© ${year} Ingenieurbüro-Auner GmbH`);
  } finally {
    jest.useRealTimers();
  }
});
