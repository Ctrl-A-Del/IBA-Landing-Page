/**
 * Tests for ticket 04 — the hero.
 *
 * SEAM: the rendered `<Hero />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the anchor id, the heading, visible text, link targets and accessible names. Same seam as
 * ticket 03. Nothing here asserts a Tailwind class string — fluid sizing, sentence-case rendering
 * and clearance under the fixed nav cannot be observed in jsdom and are verified in the browser
 * pass recorded in the ticket.
 */
import React from "react";
import { render } from "@testing-library/react";
import Hero from "./Hero";

test("is the #start anchor and carries the tagline as the page's H1, en dash intact", () => {
  const { container, getByRole } = render(<Hero />);

  const section = container.querySelector("section#start");
  expect(section).not.toBeNull();

  const h1 = getByRole("heading", { level: 1 });
  expect(section).toContainElement(h1);
  // U+2013 EN DASH, written as an escape so an editor can't silently turn it into a hyphen.
  expect(h1.textContent).toBe("Wir schaufeln nicht – wir fräsen");
});

test("offers the call: one phone CTA dialling the international number, showing the local one", () => {
  const { container } = render(<Hero />);
  const telLinks = Array.from(container.querySelectorAll('a[href^="tel:"]'));

  expect(telLinks).toHaveLength(1);
  const [cta] = telLinks;
  expect(cta.getAttribute("href")).toBe("tel:+4917661877599");
  expect(cta).toHaveTextContent("0176 618 77 599");
  expect(cta.getAttribute("aria-label")).toBe("Anrufen: 0176 618 77 599");
});

test("a subline under the H1 names the field: trench milling for energy and utility networks", () => {
  const { getByRole } = render(<Hero />);
  const h1 = getByRole("heading", { level: 1 });
  const subline = h1.nextElementSibling;

  expect(subline).not.toBeNull();
  expect(subline.tagName).toBe("P");
  expect(subline.textContent).toMatch(/fräs/i);
  expect(subline.textContent).toMatch(/Energie- und Versorgungsnetzausbau/);
});

test("carries 'Maschinenbau aus NRW' as a trust line, not as a heading", () => {
  const { getByText, getAllByRole } = render(<Hero />);
  const trust = getByText("Maschinenbau aus NRW");

  expect(trust.closest("h1, h2, h3, h4, h5, h6")).toBeNull();
  // The H1 is the hero's only heading.
  expect(getAllByRole("heading")).toHaveLength(1);
});

test("is typographic: the machine render is held back for Verfahren", () => {
  const { container } = render(<Hero />);

  expect(container.querySelector("img, picture, svg[role='img']")).toBeNull();
  expect(container.innerHTML).not.toMatch(/fraese/i);
});

test("makes no performance promise, completed-project claim or invented reference", () => {
  const { container } = render(<Hero />);
  const copy = container.textContent;

  // Figures (beyond the phone number), superlatives and track-record wording are all out (C2).
  expect(copy.replace("0176 618 77 599", "")).not.toMatch(/\d/);
  expect(copy).not.toMatch(
    /schneller|effizienter|leistungsfähig|garantiert|bewährt|erfolgreich|Projekte|Referenz|Kunden|Tagesleistung|%|Meter/i
  );
});
