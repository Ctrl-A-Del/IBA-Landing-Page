/**
 * SEAM: the rendered `<Section />` primitive. Only the tone fallback is asserted here: an unknown
 * tone must render the default (light) surface rather than an `undefined` class.
 */
import React from "react";
import { render } from "@testing-library/react";
import Section from "./Section";

test("an unknown tone falls back to the default light tone", () => {
  const { container } = render(<Section id="x" tone="nope" />);
  const { container: light } = render(<Section id="y" />);
  const section = container.querySelector("section");
  expect(section.className).not.toMatch(/undefined/);
  expect(section.className).toBe(light.querySelector("section").className);
});
