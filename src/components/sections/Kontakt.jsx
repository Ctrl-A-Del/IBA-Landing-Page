import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Copy, Mail, Phone } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import CTA from "../ui/CTA";
import { CALL_ARIA_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";
import { EMAIL, MAIL_HREF } from "./email";
import { FOCUS_ON_DARK } from "./focus";
import data from "../../data/data.json";

/**
 * Ticket 09 — Kontakt (DESIGN_PLAN.md §4 row 8, decisions C5, C11, C12, C15–C17, C21).
 *
 * The call is the page's one real goal, so it gets a named person beside it: Marcus Auner. There is
 * no portrait here any more (C15 amended) — his face already appears once, directly above, in Unternehmen
 * — so the section carries only his name and role, in the same two-line pattern Unternehmen's caption uses.
 *
 * NAVY SURFACE, TWO COLUMNS (C12 re-amended by C21, C17): the section is on the navy tone again and
 * runs straight into the navy footer with no divider between them. From `md` up it is two columns —
 * eyebrow/H2/intro on the left, the contact block (name, role, call, email, copy) on the right.
 * Below `md` the columns stack in DOM order, heading first, so the "Kontakt" nav anchor lands on the
 * heading and the call sits near the top of the screen.
 *
 * ON-NAVY COLOURS: text and rules use the `mist` ramp (the navy-surface tokens in
 * `tailwind.config.js`), and links/buttons use `FOCUS_ON_DARK`, whose white outline clears 16.8:1
 * on navy. The orange call CTA is unchanged.
 *
 * PHONE FIRST: the call is the only orange `CTA` in the section and the first action in reading
 * and tab order. The `CTA` primitive locks navy-on-orange, so white text on orange is
 * unreachable (§1.9). Email is deliberately secondary: a plain link plus a quiet copy button.
 *
 * EMAIL WITHOUT A FORM (C5): a `mailto:` with a pre-filled, URI-encoded subject (`./email`), and a
 * copy button. No form, no third-party processor — that would force an edit to the Datenschutzerklärung
 * Legal text, which only the company changes.
 *
 * COPY TO CLIPBOARD degrades in three steps:
 *   1. `navigator.clipboard.writeText` (secure contexts, modern browsers);
 *   2. otherwise, or if that is refused: reveal a plain copy of the address BELOW the link, focus
 *      and select it, and try the legacy `document.execCommand("copy")`;
 *   3. if that also fails, the address STAYS SELECTED and the status line says how to finish: the
 *      keyboard shortcut, or press-and-hold on a touch screen. The selection is deliberately not
 *      inside the mailto `<a>`: a long-press there opens the link menu, not the copy menu.
 * The outcome is written into a `role="status"` live region that is mounted empty from the start
 * (a region inserted together with its message is not reliably announced). It is visible text too.
 * Only the success message clears itself; the fallback guidance stays until the next click.
 *
 * MOBILE CALL BAR: nothing in this section is fixed or sticky. Below `md` the bar is fixed to the
 * bottom and ticket 03's Nav reserves its height as `<body>` bottom padding, so this in-flow section
 * can always scroll clear of it.
 *
 * COPY: `data.json` `Kontakt` (eyebrow, H2, intro, the contact person's name and role, the
 * copy-button label and the two status messages); number and email come from `data.json`
 * `Contact` via `./phone` and `./email`.
 */
const {
  eyebrow: EYEBROW,
  heading: HEADING,
  intro: INTRO,
  person: PERSON,
  copyLabel: COPY_LABEL,
} = data.Kontakt;

// Status messages keyed by outcome ("copied", "selected"); the "idle" state has none.
const STATUS = data.Kontakt.status;
const STATUS_CLEAR_MS = 5000;

const HEADING_ID = "kontakt-heading";

const selectContents = (node) => {
  const selection = window.getSelection && window.getSelection();
  if (!selection || !node) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Resolves to "copied" or "selected"; never rejects. `revealFallback` must synchronously render the
 * plain address and return its node, so it can be focused and selected before the legacy copy.
 */
const copyAddress = async (revealFallback) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(EMAIL);
      return "copied";
    }
  } catch (e) {
    // Refused (permissions, insecure context): fall through to the selection route.
  }

  const addressNode = revealFallback();
  if (addressNode) addressNode.focus();
  selectContents(addressNode);
  try {
    if (typeof document.execCommand === "function" && document.execCommand("copy")) {
      return "copied";
    }
  } catch (e) {
    // Some browsers throw instead of returning false.
  }
  return "selected";
};

const Kontakt = () => {
  const fallbackRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [fallbackShown, setFallbackShown] = useState(false);

  // Clear the success message after a while, so a second click is announced again. The fallback
  // guidance is NOT cleared: the visitor still has to act on it.
  useEffect(() => {
    if (status !== "copied") return undefined;
    const id = setTimeout(() => setStatus("idle"), STATUS_CLEAR_MS);
    return () => clearTimeout(id);
  }, [status]);

  const revealFallback = () => {
    flushSync(() => setFallbackShown(true));
    return fallbackRef.current;
  };

  const handleCopy = async () => {
    const outcome = await copyAddress(revealFallback);
    if (outcome === "copied") setFallbackShown(false);
    setStatus(outcome);
  };

  return (
    <Section id="kontakt" tone="navy" aria-labelledby={HEADING_ID}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <Reveal className="max-w-2xl">
          <p className="text-eyebrow text-mist-400">{EYEBROW}</p>
          <h2 id={HEADING_ID} className="mt-3 text-display-lg text-mist-100">
            {HEADING}
          </h2>
          <p className="mt-5 text-body-lg">{INTRO}</p>
        </Reveal>

        <Reveal className="max-w-md">
          {/* Name and role on two lines, the same pattern as Unternehmen's caption (C15 amended). */}
          <p className="font-heading text-display-md font-bold text-mist-100">{PERSON.name}</p>
          <p className="mt-1 text-body-sm text-mist-400">{PERSON.role}</p>

          <CTA href={PHONE_HREF} aria-label={CALL_ARIA_LABEL} className="mt-6 w-full px-8 py-4 sm:w-auto">
            <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
            <span>{PHONE_DISPLAY}</span>
          </CTA>

          <div className="mt-10 border-t border-mist-500/30 pt-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={MAIL_HREF}
                className={`inline-flex min-w-0 items-center gap-3 rounded-edge py-1 text-body text-mist-100 underline decoration-mist-500 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-mist-200 ${FOCUS_ON_DARK}`}
              >
                <Mail aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                <span className="break-all">{EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 rounded-edge border border-mist-500 px-3 py-2 text-body-sm font-semibold text-mist-200 transition-colors duration-150 hover:border-mist-300 hover:text-mist-100 ${FOCUS_ON_DARK}`}
              >
                <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
                <span>{COPY_LABEL}</span>
              </button>
            </div>
            {/* Copy fallback: the plain address, outside the link, so a long-press selects text
                instead of opening the link menu. Revealed, focused and selected only when the
                browser refuses to copy for us. */}
            <p hidden={!fallbackShown} className="mt-3">
              <span
                ref={fallbackRef}
                tabIndex={-1}
                className={`inline-block select-all break-all rounded-edge border border-mist-500 px-3 py-2 text-body-sm text-mist-100 ${FOCUS_ON_DARK}`}
              >
                {EMAIL}
              </span>
            </p>
            <p role="status" aria-atomic="true" className="mt-3 min-h-[1.5em] text-body-sm text-mist-300">
              {STATUS[status]}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

export default Kontakt;
