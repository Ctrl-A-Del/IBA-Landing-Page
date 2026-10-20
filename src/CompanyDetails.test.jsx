/**
 * The single-source test (ADR 0003, spec story 20): every Company detail (the `Company` entry, and
 * the phone and email in `Contact`) is kept once, in the content file, and every place that shows it
 * reads it from there.
 *
 * SEAM: the mounted app (`<App />`) at a path, with the content file substituted through the module
 * mock (prior art: `src/App.copy.test.jsx`), observed through the DOM and the document title. For each
 * field, one value is changed; the new value must appear wherever that field is shown, and the old
 * value nowhere on those pages.
 *
 * The old values are written out below as an independent golden, not read from the content file.
 */
import fs from "fs";
import path from "path";

const DATA_FILE = path.resolve(__dirname, "data/data.json");

let originalGetComputedStyle;
let originalScrollTo;
beforeAll(() => {
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => originalGetComputedStyle(elt);
  originalScrollTo = window.scrollTo;
  window.scrollTo = () => {}; // jsdom does not implement it; Legal pages open at the top
  // jsdom's document has no <title> unless one is added, and then ignores `document.title = ...`.
  if (!document.querySelector("title")) document.head.appendChild(document.createElement("title"));
});
afterAll(() => {
  window.getComputedStyle = originalGetComputedStyle;
  window.scrollTo = originalScrollTo;
  window.history.pushState({}, "", "/");
  vi.doUnmock("./data/data.json");
  vi.resetModules();
});

/**
 * Renders App at each path against a substituted content file and returns, per place, the text a
 * visitor sees there. A fresh module registry gets its own React, so the renderer comes from the
 * same registry as the App.
 */
const placesWith = async (content) => {
  vi.resetModules();
  vi.doMock("./data/data.json", () => ({ default: content }));
  const React = await import("react");
  const { render, fireEvent } = await import("@testing-library/react/pure");
  const { default: App } = await import("./App");
  const at = (pathname, pick) => {
    window.history.pushState({}, "", pathname);
    const { container, unmount } = render(React.createElement(App));
    const text = pick(container);
    unmount();
    return text;
  };
  // Kontakt: its text, its link targets, and what its copy button puts on the clipboard. The
  // clipboard write never settles, so the button sets no state after the page is unmounted.
  const kontakt = (c) => {
    const section = c.querySelector("#kontakt");
    const copied = [];
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: (text) => (copied.push(text), new Promise(() => {})) },
    });
    try {
      fireEvent.click(section.querySelector("button"));
    } finally {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: originalClipboard });
    }
    const hrefs = [...section.querySelectorAll("a")].map((a) => decodeURIComponent(a.href));
    return [section.textContent, ...hrefs, ...copied].join("\n");
  };
  return {
    kontakt: at("/", kontakt),
    footer: at("/", (c) => c.querySelector("footer").textContent),
    impressum: at("/impressum/", (c) => `${document.title}\n${c.textContent}`),
    // The Legal text only: the nav above it shows the phone number too.
    datenschutz: at("/datenschutz/", (c) => c.querySelector("main").textContent),
  };
};

// Each Company detail (content file entry and field), its value today, a changed value, and the
// places that show it. "Marcus Auner" is also Team's and Kontakt's contact person, a separate entry,
// so the representative is checked on the Impressum only.
const FIELDS = [
  ["Company", "name", "Ingenieurbüro-Auner GmbH", "Beispielwerk Fräsen AG", ["footer", "impressum", "datenschutz"]],
  ["Company", "street", "Tulpenweg 12", "Ahornallee 7", ["impressum", "datenschutz"]],
  ["Company", "postalCode", "41366", "50667", ["impressum", "datenschutz"]],
  ["Company", "city", "Schwalmtal", "Viersen", ["impressum", "datenschutz"]],
  ["Company", "website", "ingenieurbuero-auner.com", "beispielwerk-fraesen.de", ["datenschutz"]],
  ["Company", "representative", "Marcus Auner", "Erika Mustermann", ["impressum"]],
  ["Company", "registerCourt", "Mönchengladbach", "Krefeld", ["impressum"]],
  ["Company", "registerNumber", "HRB 23617", "HRB 98765", ["impressum"]],
  ["Contact", "phoneDisplay", "0176 618 77 599", "0211 555 01 23", ["kontakt", "datenschutz"]],
  ["Contact", "email", "info@ingenieurbuero-auner.com", "post@beispielwerk-fraesen.de", ["kontakt", "datenschutz"]],
];

// The old value as a value of its own: the old website is also the domain of the (unchanged) email
// address, so a match right after "@", ".", "-" or a word character is part of something else.
const standalone = (value) =>
  new RegExp(`(?<![\\w@.-])${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);

describe.each(FIELDS)("changing %s.%s", (entry, field, oldValue, newValue, shownIn) => {
  test(`shows the new value in ${shownIn.join(", ")}, and the old value nowhere there`, async () => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    expect(data[entry][field]).toBe(oldValue);
    const places = await placesWith({ ...data, [entry]: { ...data[entry], [field]: newValue } });
    for (const place of shownIn) {
      expect(places[place]).toContain(newValue);
      expect(places[place]).not.toMatch(standalone(oldValue));
    }
  });
});
