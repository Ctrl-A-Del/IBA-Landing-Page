/**
 * Ticket 12 — the approved copy lives in `src/data/data.json` and the page renders it unchanged.
 *
 * SEAMS: the page as `src/App.jsx` mounts it, observed through its DOM, and the content file itself.
 * The source of truth is `src/__fixtures__/prototype-copy.json`, captured from the approved prototype
 * (commit 84ce708) before anything was moved or deleted — an independent golden, not a value this
 * test derives from the code under test.
 */
import fs from "fs";
import path from "path";
import React from "react";
import { render } from "@testing-library/react";
import { captureCopy } from "./__fixtures__/captureCopy";
import App from "./App";
import GOLDEN from "./__fixtures__/prototype-copy.json";

const DATA_FILE = path.resolve(__dirname, "data/data.json");

let originalGetComputedStyle;
beforeAll(() => {
  // jsdom 16 pseudo-element workaround, as in the section tests.
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
});
afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
});

const leaves = (value) =>
  typeof value === "string"
    ? [value]
    : Object.values(value).flatMap((child) => leaves(child));

const mapLeaves = (value, fn) => {
  if (typeof value === "string") return fn(value);
  if (Array.isArray(value)) return value.map((child) => mapLeaves(child, fn));
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapLeaves(v, fn)]));
};

// A tel: href strips the spaces of the stored international number (C16), so a string also counts
// as present in its whitespace-free form.
const forms = (s) => [s, s.replace(/\s+/g, "")];

const OPEN = "⟦";
const CLOSE = "⟧";
const mark = (s) => `${OPEN}${s}${CLOSE}`;

/** Renders App against a data.json whose every string is wrapped in ⟦…⟧. */
const renderWithMarkedData = async () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const marked = mapLeaves(data, mark);
  // A fresh module registry gets its own React, so the renderer and the capture helper are loaded
  // from the same registry as the App under test.
  vi.resetModules();
  vi.doMock("./data/data.json", () => ({ default: marked }));
  const IsolatedReact = await import("react");
  const { default: IsolatedApp } = await import("./App");
  const page = IsolatedReact.createElement(IsolatedApp);
  const isolated = {
    render: (await import("@testing-library/react/pure")).render,
    captureCopy: (await import("./__fixtures__/captureCopy")).captureCopy,
  };
  const copy = await isolated.captureCopy(page);
  const { container, unmount } = isolated.render(page);
  const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
  unmount();
  vi.doUnmock("./data/data.json");
  vi.resetModules();
  return { data, copy, sources };
};

test("the page renders exactly the approved prototype copy, character for character", async () => {
  expect(await captureCopy(<App />)).toEqual(GOLDEN);
});

test("the content file has no byte-order mark and parses as plain JSON", () => {
  const bytes = fs.readFileSync(DATA_FILE);
  expect([...bytes.subarray(0, 3)]).not.toEqual([0xef, 0xbb, 0xbf]);
  expect(() => JSON.parse(bytes.toString("utf8"))).not.toThrow();
});

test("every string in the content file is approved prototype copy (or a path/anchor the page uses)", async () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const golden = [
    GOLDEN.blocks.join(""),
    ...GOLDEN.attrs.map((a) => decodeURIComponent(a)),
    ...Object.values(GOLDEN.status),
  ].join("\n");
  const notInPrototype = leaves(data).filter((s) => !forms(s).some((f) => golden.includes(f)));
  // Only image paths may be absent from the golden copy: `src` is not copy, so it was not captured.
  expect(notInPrototype.filter((s) => !/^img\/[\w-]+\.(png|jpg)$/.test(s))).toEqual([]);
});

test("all page copy comes from the content file, and every string in it is used", async () => {
  const { data, copy, sources } = await renderWithMarkedData();

  // Every visible text block and every non-empty alt / aria-label carries a marker, so none of it
  // is hardcoded in a component.
  const hardcoded = [
    ...copy.blocks,
    ...copy.attrs.filter((a) => /@(alt|aria-label)=./.test(a)),
    ...Object.values(copy.status),
  ].filter((text) => !text.includes(OPEN) && !text.includes(CLOSE));
  expect(hardcoded).toEqual([]);

  // Every string in the file reaches the page: no dead keys left over from the legacy layout.
  const haystack = [
    copy.blocks.join(""),
    ...copy.attrs.map((a) => decodeURIComponent(a)),
    ...Object.values(copy.status),
    ...sources,
  ].join("\n");
  const unused = leaves(data).filter((s) => !forms(s).some((f) => haystack.includes(mark(f))));
  expect(unused).toEqual([]);
});
