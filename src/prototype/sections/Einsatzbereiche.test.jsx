/**
 * Tests for ticket 06 — Einsatzbereiche: the four application areas on navy.
 *
 * SEAM: the rendered `<Einsatzbereiche />` component, observed through the DOM a visitor (or a
 * screen reader) gets: the anchor id, headings, list structure, text and the reveal state exposed by
 * the shared `Reveal` primitive (`data-revealed`). Same seam as tickets 03–05. No Tailwind class
 * string is asserted: the navy background, the hard-edged 1 px rules, the 1/2/4 column layout and
 * the contrast cannot be observed in jsdom and are verified in the browser pass in the ticket.
 */
import React from "react";
import { render, within } from "@testing-library/react";
import Einsatzbereiche from "./Einsatzbereiche";

// @testing-library/dom 6.x ignores the `level` option of `*ByRole`, so headings are filtered by tag.
const headingsAt = (root, level) =>
  within(root)
    .getAllByRole("heading")
    .filter((heading) => heading.tagName === `H${level}`);

// DESIGN_PLAN.md §1.5 / data.json `About` — written out here as the independent source of truth.
const EXPECTED_AREAS = [
  ["Stromtrassen", "Erdkabel und Energieübertragung"],
  ["Wasserstoff & Fernwärme", "Neue Leitungsnetze der Energiewende"],
  ["Wasser & Abwasser", "Großformatige Versorgungsgräben"],
  ["Weitere Infrastruktur", "Gas-, Drainage- und industrielle Leitungstrassen"],
];

test("is the #einsatzbereiche anchor, named by its H2", () => {
  const { container } = render(<Einsatzbereiche />);

  const section = container.querySelector("section#einsatzbereiche");
  expect(section).not.toBeNull();

  const h2s = headingsAt(section, 2);
  expect(h2s).toHaveLength(1);
  const [h2] = h2s;
  // A soft hyphen (U+00AD) may sit inside the long compound; it is invisible unless the line breaks.
  expect(h2.textContent.replace(/\u00AD/g, "")).toBe(
    "Entwickelt für den Energie- und Versorgungsnetzausbau"
  );
  expect(section.getAttribute("aria-labelledby")).toBe(h2.id);
});

test("lists the four areas in order, each an H3 heading with its description, verbatim", () => {
  const { getByRole } = render(<Einsatzbereiche />);

  const list = getByRole("list", { name: "Die vier Einsatzbereiche" });
  const items = within(list).getAllByRole("listitem");
  expect(items).toHaveLength(EXPECTED_AREAS.length);

  items.forEach((item, index) => {
    const [heading, description] = EXPECTED_AREAS[index];
    const h3s = headingsAt(item, 3);
    expect(h3s).toHaveLength(1);
    const [h3] = h3s;
    // textContent, not a regex: `&` and `ß` must arrive as literal characters, not entities.
    expect(h3.textContent).toBe(heading);
    expect(within(item).getByText(description).tagName).toBe("P");
  });
});

describe("under prefers-reduced-motion: reduce", () => {
  const originalMatchMedia = window.matchMedia;
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    // Browser APIs jsdom lacks — a real system boundary, stubbed as in `useReveal.test.js`.
    window.matchMedia = jest.fn((media) => ({
      matches: media === "(prefers-reduced-motion: reduce)",
      media,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    // An observer that never fires: if anything waited on it, the content would stay hidden.
    window.IntersectionObserver = jest.fn(function IntersectionObserverStub() {
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
      this.takeRecords = () => [];
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.IntersectionObserver = originalIntersectionObserver;
  });

  test("everything is revealed from the first render and no observer is started", () => {
    const { container } = render(<Einsatzbereiche />);

    const reveals = Array.from(container.querySelectorAll("[data-revealed]"));
    expect(reveals.length).toBeGreaterThan(0);
    reveals.forEach((element) => expect(element.getAttribute("data-revealed")).toBe("true"));
    // The heading and every area sit inside a reveal, so none of them can be left hidden.
    container.querySelectorAll("h2, li").forEach((element) => {
      expect(element.closest('[data-revealed="true"]')).not.toBeNull();
    });
    expect(window.IntersectionObserver).not.toHaveBeenCalled();
  });
});

test("makes no performance promise, completed-project claim or invented reference", () => {
  const { container } = render(<Einsatzbereiche />);
  const copy = container.textContent;

  // C2 / §2.7: no figures, superlatives or track-record wording.
  expect(copy).not.toMatch(/\d/);
  expect(copy).not.toMatch(
    /schneller|effizienter|leistungsfähig|garantiert|bewährt|erfolgreich|Projekte|Referenz|Kunden|%|Meter/i
  );
});
