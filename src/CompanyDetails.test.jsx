/**
 * The single-source test (ADR 0003, spec story 20): every Company detail is kept once, in the content
 * file, and every place that shows it reads it from there.
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
  const { render } = await import("@testing-library/react/pure");
  const { default: App } = await import("./App");
  const at = (pathname, pick) => {
    window.history.pushState({}, "", pathname);
    const { container, unmount } = render(React.createElement(App));
    const text = pick(container);
    unmount();
    return text;
  };
  return {
    footer: at("/", (c) => c.querySelector("footer").textContent),
    impressum: at("/impressum/", (c) => `${document.title}\n${c.textContent}`),
  };
};

// Each Company field, its value today, a changed value, and the places that show it.
const FIELDS = [
  ["name", "Ingenieurbüro-Auner GmbH", "Beispielwerk Fräsen AG", ["footer", "impressum"]],
  ["street", "Tulpenweg 12", "Ahornallee 7", ["impressum"]],
  ["postalCode", "41366", "50667", ["impressum"]],
  ["city", "Schwalmtal", "Viersen", ["impressum"]],
  ["representative", "Marcus Auner", "Erika Mustermann", ["impressum"]],
  ["registerCourt", "Mönchengladbach", "Krefeld", ["impressum"]],
  ["registerNumber", "HRB 23617", "HRB 98765", ["impressum"]],
];

describe.each(FIELDS)("changing Company.%s", (field, oldValue, newValue, shownIn) => {
  test(`shows the new value in the ${shownIn.join(" and ")}, and the old value nowhere there`, async () => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    expect(data.Company[field]).toBe(oldValue);
    const places = await placesWith({ ...data, Company: { ...data.Company, [field]: newValue } });
    for (const place of shownIn) {
      expect(places[place]).toContain(newValue);
      expect(places[place]).not.toContain(oldValue);
    }
  });
});
