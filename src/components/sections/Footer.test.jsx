/**
 * Tests for ticket 10 — Footer: brand block and legal links on the navy background.
 * Rewritten in 11.1 (R6): the Logo plate is gone, replaced by the Emblem, the company
 * name as text, and a copyright line.
 *
 * SEAM: the rendered `<Footer />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the footer landmark, its links, the emblem image and the text. The Legal pages are routes of
 * the app (`src/App.jsx`, tested in `src/LegalPages.test.jsx`), so only the hrefs are asserted here.
 * No Tailwind class string is asserted: the navy backdrop and the
 * clearance above the mobile call bar cannot be observed in jsdom and are verified in the browser
 * pass recorded in the ticket.
 */
import React from "react";
import { render, within } from "@testing-library/react";
import Footer from "./Footer";

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

test("lists exactly the Impressum and Datenschutzerklärung links, at the Legal pages' addresses", () => {
  const { footer } = renderFooter();
  const links = within(footer)
    .getAllByRole("link")
    .map((a) => [a.textContent, a.getAttribute("href")]);
  // PUBLIC_URL is "" under Jest.
  expect(links).toEqual([
    ["Impressum", "/impressum/"],
    ["Datenschutzerklärung", "/datenschutz/"],
  ]);
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
