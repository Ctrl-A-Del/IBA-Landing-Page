/**
 * Tests for ticket 08 — Team: the three people in framed light cards on navy.
 *
 * SEAM: the rendered `<Team />` component, observed through the DOM a visitor (or a screen reader)
 * gets: the anchor, the heading, the list of people, each portrait's figure, image and caption.
 * No Tailwind class string is asserted. The navy backdrop, the 3:4 crop and the 1 → 3 column
 * layout cannot be observed in jsdom and are verified in the browser pass recorded in the ticket.
 * "Same framed card as the rest of the page" is checked by comparison with the shared
 * `PortraitCard` primitive rendered on its own, not by restating its classes.
 */
import React from "react";
import { render, within } from "@testing-library/react";
import Team from "./Team";
import PortraitCard from "../ui/PortraitCard";

const PEOPLE = [
  ["Marcus Auner", "Geschäftsführung", "img/marcus.png"],
  ["Klaus Auner", "Einkauf", "img/klaus.png"],
  ["Jan Hönninger", "Technischer Leiter", "img/jan.png"],
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
  const utils = render(<Team />);
  const section = utils.container.querySelector("section#team");
  return { ...utils, section };
};

test("renders the #team section, named by a heading that is not the hero's trust line", () => {
  const { section, getByRole } = renderSection();

  expect(section).not.toBeNull();
  const heading = within(section).getByRole("heading", { level: 2 });
  expect(heading).toHaveTextContent(/\S/);
  expect(heading).not.toHaveTextContent(HERO_TRUST_LINE);
  expect(getByRole("region", { name: heading.textContent })).toBe(section);
});

test("no line of the section repeats the hero's trust line verbatim", () => {
  const { section } = renderSection();

  expect(section).not.toHaveTextContent(HERO_TRUST_LINE);
});

test("lists all three people in order, each with their name, role and portrait", () => {
  const { section } = renderSection();

  const list = within(section).getByRole("list", { name: /team/i });
  const items = within(list).getAllByRole("listitem");

  expect(items).toHaveLength(3);
  items.forEach((item, i) => {
    const [name, role, src] = PEOPLE[i];
    const caption = item.querySelector("figcaption");
    expect(caption).toHaveTextContent(name);
    expect(caption).toHaveTextContent(role);
    const portrait = within(item).getByRole("img", { name });
    expect(portrait.getAttribute("src")).toBe(src);
  });
});

test("every portrait uses the page's shared framed card, with identical framing and crop", () => {
  const { section } = renderSection();
  const { container: reference } = render(
    <PortraitCard src="img/reference.png" alt="Referenz" name="Referenz" role="Rolle" />
  );
  const referenceFrame = reference.querySelector("figure");
  const referenceImage = referenceFrame.querySelector("img");

  const frames = section.querySelectorAll("li > figure");
  expect(frames).toHaveLength(3);
  frames.forEach((frame) => {
    // Comparison, not a restated class list: if the primitive changes, Team follows it.
    expect(frame.className).toBe(referenceFrame.className);
    expect(frame.querySelector("img").className).toBe(referenceImage.className);
  });
});
