/**
 * Tests for ticket 03 — the sticky nav and the mobile call bar.
 *
 * SEAM: the rendered `<Nav />` component, observed through the DOM a visitor (or a screen reader)
 * gets: link targets, accessible names, visible text and the nav's `data-state`. Nothing here
 * asserts a Tailwind class string — breakpoint visibility (`md:hidden`
 * bar) cannot be observed in jsdom and is verified in the browser pass recorded in the ticket.
 */
import React from "react";
import { render, fireEvent, act, within } from "@testing-library/react";
import Nav from "./Nav";

const setScrollY = (y) => {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
};

beforeEach(() => setScrollY(0));

test("links to the five sections in the agreed order", () => {
  const { getByRole } = render(<Nav />);
  const nav = getByRole("navigation");
  const sectionLinks = Array.from(nav.querySelectorAll('a[href^="#"]'))
    .map((a) => [a.textContent, a.getAttribute("href")])
    .filter(([, href]) => href !== "#start");

  expect(sectionLinks).toEqual([
    ["Verfahren", "#verfahren"],
    ["Einsatzbereiche", "#einsatzbereiche"],
    ["Unternehmen", "#unternehmen"],
    ["Partner", "#partner"],
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
  // The header button shows the number at every width it is shown (C16); the verb lives in the
  // accessible name and in the call bar below `md`.
  expect(cta).toHaveTextContent("0176 618 77 599");
  expect(cta).not.toHaveTextContent("Anrufen");
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

describe("the hamburger menu", () => {
  const setup = () => {
    const utils = render(<Nav />);
    const nav = utils.getByRole("navigation");
    const button = within(nav).getByRole("button", { name: "Menü" });
    return { ...utils, nav, button };
  };

  test("is a real button, collapsed at first, that controls the list of the five links", () => {
    const { nav, button } = setup();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    const panel = nav.querySelector(`[id="${button.getAttribute("aria-controls")}"]`);
    expect(panel).not.toBeNull();
    // One list serves both layouts (a row from lg, the dropdown below), so the links exist once.
    expect(within(panel).getAllByRole("link").map((a) => a.textContent)).toEqual([
      "Verfahren",
      "Einsatzbereiche",
      "Unternehmen",
      "Partner",
      "Kontakt",
    ]);
  });

  test("opens and closes on the button; the scroll state (B9) is not touched by it", () => {
    const { nav, button } = setup();
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(nav).toHaveAttribute("data-state", "transparent");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("the dim backdrop sits outside the nav landmark (so it cannot dim the bar) and closes the menu", () => {
    const { container, nav, button } = setup();
    expect(container.querySelector('[data-testid="nav-backdrop"]')).toBeNull();
    fireEvent.click(button);
    const backdrop = container.querySelector('[data-testid="nav-backdrop"]');
    expect(backdrop).not.toBeNull();
    expect(nav.contains(backdrop)).toBe(false);
    fireEvent.click(backdrop);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("Esc closes it and returns focus to the button", () => {
    const { nav, button } = setup();
    fireEvent.click(button);
    within(nav).getByRole("link", { name: "Kontakt" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  test("Esc leaves focus alone while the menu is closed", () => {
    const { nav, button } = setup();
    const link = within(nav).getByRole("link", { name: "Verfahren" });
    link.focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(link).toHaveFocus();
    expect(button).not.toHaveFocus();
  });

  test("picking a link closes it", () => {
    const { nav, button } = setup();
    fireEvent.click(button);
    fireEvent.click(within(nav).getByRole("link", { name: "Partner" }));
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("on a Legal page the same list leads to the landing page", () => {
    const { getByRole } = render(<Nav onLanding={false} />);
    const links = within(getByRole("navigation")).getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(links).toContain("/#partner");
  });
});
