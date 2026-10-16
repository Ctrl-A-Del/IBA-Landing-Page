/**
 * Tests for ticket 03 — the sticky nav and the mobile call bar.
 *
 * SEAM: the rendered `<Nav />` component, observed through the DOM a visitor (or a screen reader)
 * gets: link targets, accessible names, visible text and the nav's `data-state`. Nothing here
 * asserts a Tailwind class string — breakpoint visibility (`lg:` number vs "Anrufen", `md:hidden`
 * bar) cannot be observed in jsdom and is verified in the browser pass recorded in the ticket.
 */
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Nav from "./Nav";

const setScrollY = (y) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
};

beforeEach(() => setScrollY(0));

test("links to the four sections in the agreed order", () => {
  const { getByRole } = render(<Nav />);
  const nav = getByRole("navigation");
  const sectionLinks = Array.from(nav.querySelectorAll('a[href^="#"]'))
    .map((a) => [a.textContent, a.getAttribute("href")])
    .filter(([, href]) => href !== "#start");

  expect(sectionLinks).toEqual([
    ["Verfahren", "#verfahren"],
    ["Einsatzbereiche", "#einsatzbereiche"],
    ["Team", "#team"],
    ["Kontakt", "#kontakt"],
  ]);
});

test("the nav's phone CTA dials the international number and names the local one", () => {
  const { getByRole } = render(<Nav />);
  const nav = getByRole("navigation");
  const telLinks = Array.from(nav.querySelectorAll('a[href^="tel:"]'));

  expect(telLinks).toHaveLength(1);
  const [cta] = telLinks;
  expect(cta.getAttribute("href")).toBe("tel:+4917661877599");
  // Both breakpoint labels are in the DOM; CSS shows one of them (C16). The accessible name
  // carries the verb and the local number at every width.
  expect(cta).toHaveTextContent("0176 618 77 599");
  expect(cta).toHaveTextContent("Anrufen");
  expect(cta.getAttribute("aria-label")).toBe("Anrufen: 0176 618 77 599");
});

test("is transparent at the top of the page and turns solid once scrolled", () => {
  const { getByRole } = render(<Nav />);
  const nav = getByRole("navigation");
  expect(nav).toHaveAttribute("data-state", "transparent");

  act(() => {
    setScrollY(120);
    fireEvent.scroll(window);
  });
  expect(nav).toHaveAttribute("data-state", "solid");

  act(() => {
    setScrollY(0);
    fireEvent.scroll(window);
  });
  expect(nav).toHaveAttribute("data-state", "transparent");
});

test("is already solid when the page is restored mid-scroll", () => {
  setScrollY(900);
  const { getByRole } = render(<Nav />);
  expect(getByRole("navigation")).toHaveAttribute("data-state", "solid");
});

test("renders a call bar beside the nav that dials the same number on first render", () => {
  const { container, getByRole } = render(<Nav />);
  const nav = getByRole("navigation");
  const barLinks = Array.from(container.querySelectorAll('a[href^="tel:"]')).filter(
    (a) => !nav.contains(a)
  );

  expect(barLinks).toHaveLength(1);
  const [bar] = barLinks;
  expect(bar.getAttribute("href")).toBe("tel:+4917661877599");
  expect(bar).toHaveTextContent("Anrufen");
  expect(bar).toHaveTextContent("0176 618 77 599");
  // The two visible spans sit side by side with no text node between them, so screen readers get
  // the verb and the number from the label, not from the run-together text.
  expect(bar.getAttribute("aria-label")).toBe("Anrufen: 0176 618 77 599");
});

test("offers no WhatsApp or other unpublished contact channel", () => {
  const { container } = render(<Nav />);
  const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));

  hrefs.forEach((href) => expect(href).toMatch(/^(#|tel:\+4917661877599$)/));
  expect(container.textContent).not.toMatch(/whatsapp/i);
});
