/**
 * Tests for the Unternehmen section (formerly Team): the three people in framed light cards on navy.
 *
 * SEAM: the rendered `<Unternehmen />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the anchor, the heading, the list of people, each portrait's figure, image and caption.
 * No Tailwind class string is asserted. The navy backdrop, the 3:4 crop and the 1 → 3 column
 * layout cannot be observed in jsdom and are verified in the browser pass recorded in the ticket.
 * "Same framed card as the rest of the page" is checked by comparison with the shared
 * `PortraitCard` primitive rendered on its own, not by restating its classes.
 */
import React from "react";
import { render, within } from "@testing-library/react";
import Unternehmen from "./Unternehmen";
import PortraitCard from "../ui/PortraitCard";

const PEOPLE = [
  { img: "img/marcus.png", name: "Marcus Auner", role: "Geschäftsführung" },
  { img: "img/klaus.png", name: "Klaus Auner", role: "Einkauf" },
  { img: "img/jan.png", name: "Jan Hönninger", role: "Technischer Leiter" },
];

const HERO_TRUST_LINE = "Maschinenbau aus NRW";

let originalGetComputedStyle;

beforeAll(() => {
  // Same jsdom 16 pseudo-element workaround as Verfahren.test.jsx: `getByRole(..., { name })`
  // asks for ::before/::after styles, which jsdom does not implement.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});

afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const renderSection = () => {
  const utils = render(<Unternehmen />);
  const section = utils.container.querySelector("section#unternehmen");
  return { ...utils, section };
};

test("renders the #unternehmen section, named by a heading that is not the hero's trust line", () => {
  const { section, getByRole } = renderSection();

  expect(section).not.toBeNull();
  const heading = section.querySelector("h2");
  expect(heading).toHaveTextContent("Wer hinter der Grabenfräse steht");
  expect(getByRole("region", { name: heading.textContent })).toBe(section);
});

test("the Team part has its own H3 before the intro line and the portrait list", () => {
  const { section } = renderSection();

  const h3s = [...section.querySelectorAll("h3")];
  expect(h3s.map((h) => h.textContent)).toEqual(["Team"]);
  const list = within(section).getByRole("list", { name: "Das Team" });
  expect(h3s[0].compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("no line of the section repeats the hero's trust line verbatim", () => {
  const { section } = renderSection();

  expect(section).not.toHaveTextContent(HERO_TRUST_LINE);
});

test("lists all three people in order, each with their name, role and portrait", () => {
  const { section } = renderSection();

  const list = within(section).getByRole("list", { name: "Das Team" });
  const items = within(list).getAllByRole("listitem");

  expect(items).toHaveLength(3);
  items.forEach((item, i) => {
    const { img, name, role } = PEOPLE[i];
    const caption = item.querySelector("figcaption");
    expect(caption).toHaveTextContent(name);
    expect(caption).toHaveTextContent(role);
    expect(item.querySelector("img").getAttribute("src")).toBe(img);
  });
});

test("each name is announced once: the caption names the person, the portrait does not repeat it", () => {
  const { section } = renderSection();

  const items = within(section).getAllByRole("listitem");
  items.forEach((item, i) => {
    const { name } = PEOPLE[i];
    // The figcaption is the one place the name is spoken ...
    expect(item.querySelector("figcaption")).toHaveTextContent(name);
    // ... so the portrait carries an empty alt (decorative to assistive tech) instead of repeating it.
    expect(item.querySelector("img")).toHaveAttribute("alt", "");
  });
});

test("every portrait uses the page's shared framed card, with identical crop", () => {
  const { section } = renderSection();
  const { container: reference } = render(
    <PortraitCard src="img/reference.png" alt="" name="Referenz" role="Rolle" fill />
  );
  const referenceFrame = reference.querySelector("figure");
  const referenceImage = referenceFrame.querySelector("img");
  // The primitive's own crop/ratio classes; the caller's width `className` lands on the figure
  // only, so it cannot make this comparison brittle.
  const referenceCrop = [...referenceImage.classList].sort();

  const frames = section.querySelectorAll("li > figure");
  expect(frames).toHaveLength(3);
  frames.forEach((frame) => {
    // Same structure as the primitive: one image, then one caption with name and role.
    expect([...frame.children].map((el) => el.tagName)).toEqual(
      [...referenceFrame.children].map((el) => el.tagName)
    );
    expect(frame.querySelector("figcaption").children).toHaveLength(
      referenceFrame.querySelector("figcaption").children.length
    );
    // Same crop as the primitive, compared as a set rather than a restated class string.
    expect([...frame.querySelector("img").classList].sort()).toEqual(referenceCrop);
  });
});

test("every card opts into the fill option, so the three cards share one height per row (C19)", () => {
  const { section } = renderSection();

  const frames = section.querySelectorAll("li > figure");
  expect(frames).toHaveLength(3);
  frames.forEach((frame) => expect(frame).toHaveAttribute("data-fill", "true"));
});
