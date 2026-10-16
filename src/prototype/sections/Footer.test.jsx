/**
 * Tests for ticket 10 — Footer: brand plate and legal links on the alternate dark background.
 *
 * SEAM: the rendered `<Footer />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the footer landmark, its links and the logo image. Link targets are additionally resolved
 * against `public/`, the directory CRA serves verbatim, so "the link resolves" means "the file the
 * href names is shipped". No Tailwind class string is asserted: the `brand.alt` backdrop, the plate's
 * rendered aspect ratio and the clearance above the mobile call bar cannot be observed in jsdom and
 * are verified in the browser pass recorded in the ticket.
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

test("shows the full framed logo plate, at its intrinsic 540x935 ratio", () => {
  const { footer } = renderFooter();
  const plate = within(footer).getByRole("img", { name: "Ingenieurbüro-Auner GmbH" });

  expect(plate.getAttribute("src")).toMatch(/\/img\/logo\.jpg$/);
  // The intrinsic size lets the browser reserve the plate's true ratio before the JPEG loads and
  // keeps `h-auto` scaling proportional (the plate is never cropped like the nav emblem).
  expect(plate).toHaveAttribute("width", "540");
  expect(plate).toHaveAttribute("height", "935");
});

test("does not repeat the contact details owned by the Kontakt section", () => {
  const { footer } = renderFooter();
  expect(footer.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')).toHaveLength(0);
});
