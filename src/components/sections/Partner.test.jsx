/**
 * Tests for the Partner section ("Partner gesucht", ticket 03 of partner-recruiting): two Partnerrollen,
 * each with a quiet pre-addressed email action.
 *
 * SEAM: the rendered `<Partner />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the anchor, the heading hierarchy, link targets and accessible names. No Tailwind class string
 * is asserted; "not the orange primary" is checked by comparison with the shared `CTA` primitive
 * rendered on its own. The light backdrop, the side-by-side layout and the visible focus outline cannot
 * be observed in jsdom and are verified in the browser pass.
 */
import React from "react";
import { render, within } from "@testing-library/react";
import Partner from "./Partner";
import CTA from "../ui/CTA";
import { TONES } from "../ui/Section";
import { EMAIL } from "./email";

let originalGetComputedStyle;

beforeAll(() => {
  // Same jsdom 16 pseudo-element workaround as the other section tests.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const renderSection = () => {
  const utils = render(<Partner />);
  const section = utils.container.querySelector("section#partner");
  return { ...utils, section };
};

// Written out independently of the content file (the owner's approved copy).
const ROLES = [
  {
    title: "Anwender & Pilotpartner",
    description: "Baustellenanforderungen und Einsatzbedingungen gemeinsam mit Anwendern validieren.",
    action: "Als Pilotpartner melden",
    subject: "Anfrage Pilotpartner",
  },
  {
    title: "Entwicklungspartner",
    description: "Maschinenbau, Komponenten und Prototyp gemeinsam entwickeln und validieren.",
    action: "Als Entwicklungspartner melden",
    subject: "Anfrage Entwicklungspartner",
  },
];

test("renders the #partner section on the light tone, named by the H2 'Gemeinsam arbeiten'", () => {
  const { section, getByRole } = renderSection();

  expect(section).not.toBeNull();
  TONES.light.split(" ").forEach((cls) => expect(section).toHaveClass(cls));
  const heading = section.querySelector("h2");
  expect(heading).toHaveTextContent("Gemeinsam arbeiten");
  expect(getByRole("region", { name: "Gemeinsam arbeiten" })).toBe(section);
});

test("eyebrow, H2 and intro come first, in that order", () => {
  const { section } = renderSection();

  const eyebrow = within(section).getByText("Partner gesucht");
  const heading = section.querySelector("h2");
  const intro = within(section).getByText(
    "Wir entwickeln die Grabenfräse gemeinsam mit Partnern aus Bau und Industrie."
  );
  const after = (a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING;
  expect(after(eyebrow, heading)).toBeTruthy();
  expect(after(heading, intro)).toBeTruthy();
});

test("two H3s follow the H2, one per Partnerrolle in order, each with its description; no sector label", () => {
  const { section } = renderSection();

  const h3s = [...section.querySelectorAll("h3")];
  expect(h3s.map((h) => h.textContent)).toEqual(ROLES.map((r) => r.title));
  const h2 = section.querySelector("h2");
  h3s.forEach((h3) => expect(h2.compareDocumentPosition(h3) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy());
  ROLES.forEach((r) => expect(within(section).getByText(r.description)).toBeInTheDocument());
  expect(section).not.toHaveTextContent("Bau & Infrastruktur");
  expect(section).not.toHaveTextContent("Industrie & Entwicklung");
});

test("each action is a mailto: link to the company address with the role's URI-encoded subject", () => {
  const { section } = renderSection();

  const links = within(section).getAllByRole("link");
  expect(links.map((a) => a.getAttribute("href"))).toEqual(
    ROLES.map((r) => `mailto:${EMAIL}?subject=${encodeURIComponent(r.subject)}`)
  );
  // Written out too, so the encoding is not only compared with the code's own call.
  expect(links[0].getAttribute("href")).toBe(
    "mailto:info@ingenieurbuero-auner.com?subject=Anfrage%20Pilotpartner"
  );
});

test("each link's accessible name identifies its role, so the two are never both just 'melden'", () => {
  const { section } = renderSection();

  ROLES.forEach((r) => {
    expect(within(section).getByRole("link", { name: r.action })).toBeInTheDocument();
  });
});

test("the actions are quiet: they share no class with the orange primary CTA", () => {
  const { section } = renderSection();
  const { container } = render(<CTA href="tel:+490">x</CTA>);
  const primary = [...container.querySelector("a").classList].filter((c) => /signal/.test(c));
  expect(primary.length).toBeGreaterThan(0);

  within(section)
    .getAllByRole("link")
    .forEach((a) => primary.forEach((cls) => expect(a).not.toHaveClass(cls)));
});

test("there is no form, and the section never speaks of Stelle, Karriere or Bewerbung", () => {
  const { section } = renderSection();

  expect(section.querySelector("form, input, textarea")).toBeNull();
  expect(section.textContent).not.toMatch(/\b(Stelle|Karriere|Bewerb)/i);
});
