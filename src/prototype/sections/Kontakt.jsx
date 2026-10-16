import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Copy, Mail, Phone } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import PortraitCard from "../ui/PortraitCard";
import CTA from "../ui/CTA";
import { CALL_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";
import { EMAIL, MAIL_HREF } from "./email";
import { FOCUS_ON_DARK } from "./focus";

/**
 * Ticket 09 — Kontakt (DESIGN_PLAN.md §4 row 7, decisions C5, C11, C15, C16).
 *
 * The call is the page's one real goal, so it gets a named person beside it: Marcus Auner, with
 * his Team portrait in the SAME shared `PortraitCard` (consumed as-is — the 3:4 crop and
 * `object-top` live inside the primitive, so his crop here cannot drift from Team's).
 *
 * THE LABEL "Marcus Auner · Geschäftsführung" (C15) is a single line, which PortraitCard's caption
 * cannot render (it stacks name and role in two spans). So the card is framed without a caption,
 * and the label sits in the text column directly above the call — the name is literally beside
 * the number. The portrait's alt is empty for the same reason as in Team: the adjacent label
 * already names him, and an alt of his name would be announced twice.
 *
 * PHONE FIRST: the call is the only orange `CTA` in the section and the first action in reading
 * and tab order. The `CTA` primitive locks navy-on-orange, so white text on orange is
 * unreachable (§1.9). Email is deliberately secondary: a plain link plus a quiet copy button.
 *
 * EMAIL WITHOUT A FORM (C5): a `mailto:` with a pre-filled, URI-encoded subject (`./email`), and a
 * copy button. No form, no third-party processor — that would force an edit to `datenschutz.html`
 * (out of scope).
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
 * COPY (C8, flagged for diffing against `data.json`):
 *   number, email = data.json `Contact`, hardcoded per parallelisation.md §3 (number via `./phone`).
 *   intro         = legacy `contact.jsx` subtitle, verbatim.
 *   name, role    = data.json `Team[0]`, joined with U+00B7 as C15 specifies.
 *   eyebrow, H2, mail subject, copy-button and status texts = C8-NEW.
 */

// C8-NEW
const STATUS = {
  idle: "",
  copied: "E-Mail-Adresse kopiert.",
  selected:
    "Adresse unten markiert – mit Strg+C (Mac: ⌘+C) kopieren oder auf dem Handy gedrückt halten und „Kopieren“ wählen.",
};
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
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-16">
        {/* Portrait capped on phones so it does not push the call a full screen down. */}
        <Reveal>
          <PortraitCard
            src="img/marcus.png"
            alt=""
            className="mx-auto max-w-[14rem] md:max-w-none"
          />
        </Reveal>

        <Reveal className="max-w-2xl">
          {/* C8-NEW */}
          <p className="text-eyebrow text-mist-400">Kontakt</p>
          {/* C8-NEW */}
          <h2 id={HEADING_ID} className="mt-3 text-display-lg text-mist-100">
            Sprechen Sie direkt mit uns
          </h2>
          {/* Legacy contact.jsx subtitle, verbatim. */}
          <p className="mt-5 text-body-lg">
            Lassen Sie uns über den Grabenaushub von morgen sprechen.
          </p>

          <p className="mt-10 font-heading text-display-md font-bold text-mist-100">
            Marcus Auner · Geschäftsführung
          </p>
          <CTA href={PHONE_HREF} aria-label={CALL_LABEL} className="mt-4 w-full px-8 py-4 sm:w-auto">
            <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
            <span>{PHONE_DISPLAY}</span>
          </CTA>

          <div className="mt-10 border-t border-mist-500/40 pt-6">
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
                className={`inline-flex items-center gap-2 rounded-edge border border-mist-500/60 px-3 py-2 text-body-sm font-semibold text-mist-200 transition-colors duration-150 hover:border-mist-300 hover:text-white ${FOCUS_ON_DARK}`}
              >
                <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
                {/* C8-NEW */}
                <span>Adresse kopieren</span>
              </button>
            </div>
            {/* Copy fallback: the plain address, outside the link, so a long-press selects text
                instead of opening the link menu. Revealed, focused and selected only when the
                browser refuses to copy for us. */}
            <p hidden={!fallbackShown} className="mt-3">
              <span
                ref={fallbackRef}
                tabIndex={-1}
                className={`inline-block select-all break-all rounded-edge border border-mist-500/60 px-3 py-2 text-body-sm text-mist-100 ${FOCUS_ON_DARK}`}
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
