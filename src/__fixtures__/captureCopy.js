import { act, fireEvent, render, within } from "@testing-library/react/pure";

/**
 * Captures every piece of German copy a rendered page exposes, in document order (ticket 12).
 *
 * Used twice with the SAME algorithm: once against the approved prototype before the migration
 * (which produced `prototype-copy.json`), and from then on against `src/App.jsx`, so the migrated
 * page is proven character-identical to what the user approved.
 *
 * - `blocks`: for each element, the concatenation of its OWN text nodes (not its descendants'),
 *   skipping whitespace-only results. Per-element rather than per-node, so `{"­"}` written as
 *   its own JSX child and the same character inside one data string compare equal.
 * - `attrs`: every `alt`, `aria-label` and `href` value, as `tag@attr=value`.
 * - `status`: the copy-to-clipboard live-region messages, which only appear after interaction.
 *
 * The current year is replaced with `{year}`, so the fixture does not expire on New Year's Day.
 */
const YEAR = String(new Date().getFullYear());
const normalise = (s) => s.split(YEAR).join("{year}");

const ATTRS = ["alt", "aria-label", "href"];

const blocksOf = (container) =>
  [...container.querySelectorAll("*")]
    .map((el) =>
      [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.nodeValue)
        .join("")
    )
    .filter((text) => text.trim() !== "")
    .map(normalise);

const attrsOf = (container) =>
  [...container.querySelectorAll("*")].flatMap((el) =>
    ATTRS.filter((a) => el.hasAttribute(a)).map(
      (a) => `${el.tagName.toLowerCase()}@${a}=${normalise(el.getAttribute(a))}`
    )
  );

const statusAfterCopy = async (element, { clipboard, execCommand }) => {
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  const originalExecCommand = document.execCommand;
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
  document.execCommand = execCommand;
  try {
    const { container, unmount } = render(element);
    const kontakt = container.querySelector("section#kontakt");
    await act(async () => {
      fireEvent.click(within(kontakt).getByRole("button", { name: /kopieren/i }));
    });
    const text = within(kontakt).getByRole("status").textContent;
    unmount();
    return text;
  } finally {
    if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
    else delete navigator.clipboard;
    document.execCommand = originalExecCommand;
    window.getSelection().removeAllRanges();
  }
};

/**
 * The `blocks` and `attrs` of a rendered page, plus the `src` of every image and the document title
 * while it is mounted. For pages without Kontakt (the Legal pages), which have no `status`.
 */
export const captureStatic = (element) => {
  const { container, unmount } = render(element);
  const blocks = blocksOf(container);
  const attrs = attrsOf(container);
  const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
  const title = document.title;
  unmount();
  return { blocks, attrs, sources, title };
};

export const captureCopy = async (element) => {
  const { blocks, attrs } = captureStatic(element);

  const status = {
    copied: await statusAfterCopy(element, {
      clipboard: { writeText: () => Promise.resolve() },
      execCommand: undefined,
    }),
    selected: await statusAfterCopy(element, { clipboard: undefined, execCommand: undefined }),
  };

  return { blocks, attrs, status };
};
