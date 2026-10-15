import { Phone } from "lucide-react";
import CTA from "../ui/CTA";
import Section from "../ui/Section";
import { CALL_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";

/**
 * Ticket 04 — Hero (DESIGN_PLAN.md §4 row 2, decisions B8, C2, C8).
 *
 * TYPOGRAPHIC ON PURPOSE: no image. The machine render is held back for the Verfahren section
 * (§4 row 3), so the first screen is the tagline, one subline naming the field, the call, and the
 * trust line `Maschinenbau aus NRW` (moved here from the old Team heading, §4.1 "Key moves").
 *
 * CLEARING THE FIXED NAV: ticket 03's nav is `position: fixed`, `h-nav` (5rem) tall and transparent
 * over this section, so it overlays the top 5rem of it. `Section`'s top padding is `py-20` = 5rem at
 * the smallest width and larger from `sm` up, so the content box always starts at or below the nav's
 * bottom edge. The vertical centring below can only push content further DOWN, never up into the
 * nav. Do not trim this section's top padding (ticket 03, raised item 2).
 *
 * HEIGHT: at least one small-viewport height (`svh`, so mobile browser chrome can't push the CTA
 * below the fold), content centred in it. Bottom padding (5rem+) is taller than the mobile call bar
 * (4.5rem), so the trust line is never under the bar on the first screen.
 *
 * NO REVEAL: this is the first paint. A scroll reveal would start the H1 at opacity 0.
 *
 * COPY (C8, flagged for diffing against `data.json`):
 *   H1         = data.json `Header.title`, verbatim — U+2013 EN DASH, never a hyphen.
 *   subline    = NEW prototype copy. Honest register (C2): "entwickeln", no performance claim.
 *   trust line = moved from the hardcoded Team heading in the legacy `Team.jsx`.
 *   CTA        = the C16 number formats from `./phone`.
 */
const Hero = () => (
  <Section
    id="start"
    tone="navy"
    className="flex min-h-svh flex-col justify-center"
  >
    {/* `normal-case` is restated even though `src/index.css` sets it on every heading: B8 says the
        H1 is never uppercase, and this keeps that true wherever the heading is read in isolation.
        "wir fräsen" never splits, so on wide screens the line breaks at the dash instead of
        stranding "fräsen" alone on line 2. The text content is unchanged by the span. */}
    <h1 className="max-w-5xl text-display-xl normal-case text-mist-100">
      Wir schaufeln nicht – <span className="whitespace-nowrap">wir fräsen</span>
    </h1>
    <p className="mt-6 max-w-2xl text-body-lg font-light text-mist-300 sm:mt-8">
      Wir entwickeln Grabenfräsen für den Energie- und Versorgungsnetzausbau.
    </p>

    <div className="mt-10 sm:mt-12">
      <CTA href={PHONE_HREF} aria-label={CALL_LABEL}>
        <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
        <span>{PHONE_DISPLAY}</span>
      </CTA>
    </div>

    {/* Trust line: a 1px rule and a letter-spaced line in sentence case (B8 — `eyebrow` is never
        uppercased). A paragraph, not a heading: it is a credential, not a section title. */}
    <p className="mt-12 max-w-2xl border-t border-mist-500/40 pt-6 text-eyebrow text-mist-400 sm:mt-16">
      Maschinenbau aus NRW
    </p>
  </Section>
);

export default Hero;
