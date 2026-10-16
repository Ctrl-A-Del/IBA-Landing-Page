/**
 * Tests for ticket 09 — Kontakt: Marcus Auner beside the call, email without a form.
 *
 * SEAMS
 *   1. The rendered `<Kontakt />`, observed through the DOM a visitor (or a screen reader) gets:
 *      anchor, heading, link targets, accessible names, the live region. Same seam as 03–08.
 *   2. The browser clipboard (`navigator.clipboard`, `document.execCommand`) — the one external
 *      boundary, so it is the one thing stubbed. Nothing internal is mocked.
 * No Tailwind class string is asserted. The navy backdrop, visible focus against navy and the
 * clearance above the fixed mobile call bar cannot be observed in jsdom; see the ticket.
 * "Same framed card / same CTA as the rest of the page" is checked by comparison with the shared
 * primitives rendered on their own, not by restating their classes.
 */
import React from "react";
import { act, fireEvent, render, within } from "@testing-library/react";
import Kontakt from "./Kontakt";
import PortraitCard from "../ui/PortraitCard";
import CTA from "../ui/CTA";

const EMAIL = "info@ingenieurbuero-auner.com";

let originalGetComputedStyle;

beforeAll(() => {
  // Same jsdom 16 pseudo-element workaround as Verfahren/Team/WarumWir tests.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const renderSection = () => {
  const utils = render(<Kontakt />);
  const section = utils.container.querySelector("section#kontakt");
  return { ...utils, section };
};

test("renders the #kontakt section, named by its heading", () => {
  const { section, getByRole } = renderSection();

  expect(section).not.toBeNull();
  const heading = within(section).getByRole("heading", { level: 2 });
  expect(heading).toHaveTextContent(/\S/);
  expect(getByRole("region", { name: heading.textContent })).toBe(section);
});

test("names Marcus Auner as 'Marcus Auner · Geschäftsführung' in the page's shared framed card", () => {
  const { section } = renderSection();

  const frames = section.querySelectorAll("figure");
  expect(frames).toHaveLength(1);
  const [frame] = frames;
  // The label reads as one line, joined by a U+00B7 MIDDLE DOT. PortraitCard's caption stacks name
  // and role in two spans and cannot render that line, so the label lives beside the call instead.
  const label = within(section).getByText("Marcus Auner · Geschäftsführung");
  expect(label.tagName).toBe("P");
  // His existing Team portrait, not a new asset; the label names him, so the alt stays empty.
  const img = frame.querySelector("img");
  expect(img.getAttribute("src")).toBe("img/marcus.png");
  expect(img).toHaveAttribute("alt", "");

  // Same crop as Team, because it is the same primitive: compared as a class set, not restated.
  const { container: reference } = render(<PortraitCard src="img/reference.png" alt="" />);  const referenceImage = reference.querySelector("figure img");
  expect([...img.classList].sort()).toEqual([...referenceImage.classList].sort());
});

test("the call is the primary action: the first action, dialling the international number, showing the local one", () => {
  const { section } = renderSection();

  const telLinks = section.querySelectorAll('a[href^="tel:"]');
  expect(telLinks).toHaveLength(1);
  const [call] = telLinks;
  expect(call.getAttribute("href")).toBe("tel:+4917661877599");
  expect(call).toHaveTextContent("0176 618 77 599");
  expect(call.getAttribute("aria-label")).toBe("Anrufen: 0176 618 77 599");

  // Primary = first in reading and tab order, before any email action.
  const actions = section.querySelectorAll("a[href], button");
  expect(actions[0]).toBe(call);
});

test("the call uses the page's one CTA appearance, so it can never be white text on orange", () => {
  const { section } = renderSection();
  const call = section.querySelector('a[href^="tel:"]');
  const { container: reference } = render(<CTA href="tel:x">x</CTA>);
  const referenceClasses = [...reference.querySelector("a").classList];

  // Every class of the locked primitive is present (the caller may only add layout classes) ...
  referenceClasses.forEach((cls) => expect(call).toHaveClass(cls));
  // ... and no caller class tries to recolour the text white.
  expect([...call.querySelectorAll("*"), call].some((el) => el.matches("[class*='text-white']"))).toBe(
    false
  );
  // It is the only orange CTA in the section: email is secondary.
  const ctas = [...section.querySelectorAll("a, button")].filter((el) =>
    referenceClasses.every((cls) => el.classList.contains(cls))
  );
  expect(ctas).toEqual([call]);
});

test("email: one mailto to the company address, carrying a pre-filled subject", () => {
  const { section } = renderSection();

  const mailLinks = section.querySelectorAll('a[href^="mailto:"]');
  expect(mailLinks).toHaveLength(1);
  const [mail] = mailLinks;
  const [address, query = ""] = mail.getAttribute("href").slice("mailto:".length).split("?");
  expect(address).toBe(EMAIL);
  const subject = new URLSearchParams(query).get("subject");
  expect(subject).toMatch(/\S/);
  // Encoded properly: a raw space or umlaut in an href is not a valid URI.
  expect(mail.getAttribute("href")).not.toMatch(/[\s\u0080-￿]/);
  // The address itself is readable on the page, not only hidden in the href.
  expect(mail).toHaveTextContent(EMAIL);
});

describe("copy the email address", () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  const originalExecCommand = document.execCommand;

  const stubClipboard = (value) =>
    Object.defineProperty(navigator, "clipboard", { value, configurable: true });

  afterEach(() => {
    if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
    else delete navigator.clipboard;
    document.execCommand = originalExecCommand;
    window.getSelection().removeAllRanges();
  });

  const clickCopy = async () => {
    const utils = renderSection();
    const button = within(utils.section).getByRole("button", { name: /kopieren/i });
    // The live region exists, empty, before anything happens — a region that is inserted together
    // with its message is not reliably announced.
    const status = within(utils.section).getByRole("status");
    expect(status).toHaveTextContent(/^$/);
    await act(async () => {
      fireEvent.click(button);
    });
    return { ...utils, button, status };
  };

  test("copies the address with the clipboard API and announces success in a live region", async () => {
    const writeText = jest.fn(() => Promise.resolve());
    stubClipboard({ writeText });

    const { status } = await clickCopy();

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(status).toHaveTextContent(/kopiert/i);
  });

  test("without the clipboard API it falls back to the legacy copy command", async () => {
    stubClipboard(undefined);
    document.execCommand = jest.fn(() => true);

    const { status } = await clickCopy();

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(status).toHaveTextContent(/kopiert/i);
  });

  test("where copying is impossible, it selects the address and tells the visitor to copy it", async () => {
    stubClipboard(undefined);
    document.execCommand = undefined;

    const { status } = await clickCopy();

    expect(window.getSelection().toString()).toBe(EMAIL);
    expect(status).not.toHaveTextContent(/kopiert\b/i);
    expect(status).toHaveTextContent(/markiert/i);
  });

  test("a refused clipboard permission degrades the same way", async () => {
    stubClipboard({ writeText: jest.fn(() => Promise.reject(new Error("denied"))) });
    document.execCommand = jest.fn(() => false);

    const { status } = await clickCopy();

    expect(window.getSelection().toString()).toBe(EMAIL);
    expect(status).toHaveTextContent(/markiert/i);
  });
});

test("no contact form and no third-party processor: no form, input, iframe or external action", () => {
  const { section } = renderSection();

  expect(section.querySelector("form, input, textarea, select, iframe, script")).toBeNull();
  section.querySelectorAll("a[href]").forEach((a) => {
    expect(a.getAttribute("href")).toMatch(/^(tel|mailto):/);
  });
});
