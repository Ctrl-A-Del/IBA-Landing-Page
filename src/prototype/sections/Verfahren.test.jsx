/**
 * Tests for ticket 05 — Verfahren: the machine render, its four modules and the lightbox.
 *
 * SEAM: the rendered `<Verfahren />` component, observed through the DOM a visitor (or a screen
 * reader) gets: roles, accessible names, text, `open` on the dialog and `document.activeElement`.
 * No Tailwind class string is asserted. Layout (full width, "as large as the viewport allows",
 * the navy backdrop) cannot be observed in jsdom and is verified in the browser pass recorded in
 * the ticket.
 *
 * PLATFORM STUB: jsdom 16 has `HTMLDialogElement` but no `showModal()` / `close()`. The stub below
 * stands in for the browser and does only what the HTML spec says the UA does: `showModal()` sets
 * `open`, `close()` clears it and fires `close`, and Escape on an open modal fires a cancelable
 * `cancel` followed by `close()`. Focus trapping and `::backdrop` are browser features and are
 * verified in the browser, not here.
 */
import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import Verfahren from "./Verfahren";

const MODULES = [
  ["01", "Fräsmodul", "Zwei Arme, gegenläufige Fräsköpfe"],
  ["02", "Aufnahmemodul", "Nimmt das gelöste Material auf"],
  ["03", "Fördermodul", "Kontinuierlicher Austrag, beidseitig"],
  ["04", "Antriebsmodul", "Energie, Hydraulik, Steuerung"],
];

const CAPTION = "Fräsmodul, Aufnahme-, Förder- und Antriebsmodul";

let originalShowModal;
let originalClose;
let originalGetComputedStyle;

beforeAll(() => {
  // jsdom 16 logs "Not implemented" whenever `getByRole(..., { name })` asks for the computed
  // style of a ::before/::after pseudo-element. Pseudo-elements carry no text on this page, so the
  // element's own style is an honest answer and keeps the test output readable.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);

  const proto = window.HTMLDialogElement.prototype;
  originalShowModal = proto.showModal;
  originalClose = proto.close;

  proto.showModal = function showModal() {
    this.open = true;
  };
  proto.close = function close() {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
  const proto = window.HTMLDialogElement.prototype;
  proto.showModal = originalShowModal;
  proto.close = originalClose;
});

// What the browser does when Escape is pressed inside an open modal dialog.
const pressEscapeIn = (dialog) => {
  const cancel = new Event("cancel", { cancelable: true });
  if (dialog.dispatchEvent(cancel)) dialog.close();
};

const renderSection = () => {
  const utils = render(<Verfahren />);
  const section = utils.container.querySelector("section#verfahren");
  return { ...utils, section };
};

test("renders the #verfahren section with the machine render", () => {
  const { section } = renderSection();

  expect(section).not.toBeNull();
  const render = within(section).getAllByRole("img")[0];
  expect(render.getAttribute("src")).toBe("img/fraese.png");
  expect(render.getAttribute("alt")).toMatch(/\S/);
});

test("lists the four modules as real text, numbered 01–04, in order", () => {
  const { section } = renderSection();

  const list = within(section).getByRole("list", { name: /module/i });
  const items = within(list).getAllByRole("listitem");

  expect(items).toHaveLength(4);
  items.forEach((item, i) => {
    const [numeral, name, line] = MODULES[i];
    expect(item).toHaveTextContent(numeral);
    expect(item).toHaveTextContent(name);
    expect(item).toHaveTextContent(line);
  });
});

test("the labelled 'Größer ansehen' button opens the render in a modal dialog named by its caption", () => {
  const { section, getByRole } = renderSection();
  const dialog = section.querySelector("dialog");
  expect(dialog.open).toBe(false);

  fireEvent.click(within(section).getByRole("button", { name: "Größer ansehen" }));

  expect(dialog.open).toBe(true);
  expect(getByRole("dialog", { name: CAPTION })).toBe(dialog);
  const enlarged = within(dialog).getByRole("img");
  expect(enlarged.getAttribute("src")).toBe("img/fraese.png");
  expect(enlarged.closest("figure").querySelector("figcaption")).toHaveTextContent(CAPTION);
});

const openWithButton = () => {
  const utils = renderSection();
  const trigger = within(utils.section).getByRole("button", { name: "Größer ansehen" });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = utils.section.querySelector("dialog");
  return { ...utils, trigger, dialog };
};

test("the explicit close button closes the dialog and returns focus to the trigger", () => {
  const { trigger, dialog } = openWithButton();
  const closeButton = within(dialog).getByRole("button", { name: "Schließen" });
  closeButton.focus();

  fireEvent.click(closeButton);

  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

test("Escape closes the dialog and returns focus to the trigger", () => {
  const { trigger, dialog } = openWithButton();
  within(dialog).getByRole("button", { name: "Schließen" }).focus();

  pressEscapeIn(dialog);

  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

test("a click on the backdrop closes the dialog and returns focus; a click on the render does not", () => {
  const { trigger, dialog } = openWithButton();
  within(dialog).getByRole("button", { name: "Schließen" }).focus();

  fireEvent.click(within(dialog).getByRole("img"));
  expect(dialog.open).toBe(true);

  fireEvent.click(within(dialog).getByText(CAPTION));
  expect(dialog.open).toBe(true);

  // A click on `::backdrop` is reported by the browser with the <dialog> itself as the target.
  fireEvent.click(dialog);
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

test("pointer users can click the render itself; focus returns to it, and it adds no tab stop", () => {
  const { section } = renderSection();
  const dialog = section.querySelector("dialog");
  const [sectionRender] = within(section).getAllByRole("img");

  // The labelled button stays the one accessible affordance: the render is not in the tab order
  // and is not exposed as a second button.
  expect(sectionRender.tabIndex).toBeLessThan(0);
  expect(
    within(section)
      .getAllByRole("button")
      .filter((b) => !dialog.contains(b))
  ).toHaveLength(1);

  fireEvent.click(sectionRender);
  expect(dialog.open).toBe(true);

  fireEvent.click(within(dialog).getByRole("button", { name: "Schließen" }));
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(sectionRender);
});
