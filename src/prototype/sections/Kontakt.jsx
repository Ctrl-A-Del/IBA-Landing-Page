import { useEffect, useRef, useState } from "react";
import { Copy, Mail, Phone } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import PortraitCard from "../ui/PortraitCard";
import CTA from "../ui/CTA";
import { CALL_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";

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
 * EMAIL WITHOUT A FORM (C5): a `mailto:` with a pre-filled, URI-encoded subject, and a copy button.
 * No form, no third-party processor — that would force an edit to `datenschutz.html` (out of scope).
 *
 * COPY TO CLIPBOARD degrades in three steps:
 *   1. `navigator.clipboard.writeText` (secure contexts, modern browsers);
 *   2. otherwise, or if that is refused: select the visible address and try the legacy
 *      `document.execCommand("copy")`;
 *   3. if that also fails, the address STAYS SELECTED and the status line says so, so Ctrl+C /
 *      long-press copy finishes the job. The mailto link works throughout.
 * The outcome is written into a `role="status"` live region that is mounted empty from the start
 * (a region inserted together with its message is not reliably announced). It is visible text too.
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

const EMAIL = "info@ingenieurbuero-auner.com";
// C8-NEW
const MAIL_SUBJECT = "Anfrage zur Grabenfräse";
const MAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;

// C8-NEW
const STATUS = {
  idle: "",
  copied: "E-Mail-Adresse kopiert.",
  selected: "Adresse markiert – bitte mit Strg+C (Mac: ⌘+C) kopieren.",
};
const STATUS_CLEAR_MS = 5000;

const HEADING_ID = "kontakt-heading";

// Visible keyboard focus on navy: a white outline, 16.8:1 against #0a1f2e. Outline (not ring) so it
// survives forced-colours mode. Same recipe as Nav's FOCUS_ON_NAVY (not imported: Nav is ticket
// 03's file and does not export it).
const FOCUS_ON_NAVY =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const selectContents = (node) => {
  const selection = window.getSelection && window.getSelection();
  if (!selection || !node) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
};

/** Resolves to "copied" or "selected"; never rejects. */
const copyAddress = async (addressNode) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(EMAIL);
      return "copied";
    }
  } catch (e) {
    // Refused (permissions, insecure context): fall through to the selection route.
  }

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
  const addressRef = useRef(null);
  const [status, setStatus] = useState("idle");

  // Clear the message after a while, so a second click is announced again.
  useEffect(() => {
    if (status === "idle") return undefined;
    const id = setTimeout(() => setStatus("idle"), STATUS_CLEAR_MS);
    return () => clearTimeout(id);
  }, [status]);

  const handleCopy = async () => {
    const outcome = await copyAddress(addressRef.current);
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
                className={`inline-flex min-w-0 items-center gap-3 rounded-edge py-1 text-body text-mist-100 underline decoration-mist-500 underline-offset-4 transition-colors duration-150 hover:text-white hover:decoration-mist-200 ${FOCUS_ON_NAVY}`}
              >
                <Mail aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                <span ref={addressRef} className="break-all">
                  {EMAIL}
                </span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-2 rounded-edge border border-mist-500/60 px-3 py-2 text-body-sm font-semibold text-mist-200 transition-colors duration-150 hover:border-mist-300 hover:text-white ${FOCUS_ON_NAVY}`}
              >
                <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
                {/* C8-NEW */}
                <span>Adresse kopieren</span>
              </button>
            </div>
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
