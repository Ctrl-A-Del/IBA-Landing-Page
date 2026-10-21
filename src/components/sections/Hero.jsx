import { Phone } from "lucide-react";
import CTA from "../ui/CTA";
import Section from "../ui/Section";
import data from "../../data/data.json";
import { CALL_ARIA_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";

/**
 * Ticket 04 — Hero (DESIGN_PLAN.md §4 row 2, decisions B8, C2, C8).
 *
 * TYPOGRAPHIC ON PURPOSE: no image. The machine render is held back for the Verfahren section
 * (§4 row 3), so the first screen is the tagline, one subline naming the field, the call, and the
 * trust line `Maschinenbau aus NRW` (moved here from the old Team section heading, §4.1 "Key moves").
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
 * COPY: `data.json` `Hero` (the title in two parts, the lead ending in its U+2013 EN DASH and a
 * space; subline; trust line); the CTA uses the C16 number formats from `./phone`.
 *
 * The title is stored split so "wir fräsen" never splits: on wide screens the line breaks after the
 * dash instead of stranding "fräsen" alone on line 2, because the tail sits in a no-wrap span.
 */
const {
  titleLead: TITLE_LEAD,
  titleTail: TITLE_TAIL,
  subline: SUBLINE,
  trustLine: TRUST_LINE,
} = data.Hero;

const Hero = () => (
  <Section
    id="start"
    tone="navy"
    className="flex min-h-svh flex-col justify-center"
  >
    {/* `normal-case` is restated even though `src/index.css` sets it on every heading: B8 says the
        H1 is never uppercase, and this keeps that true wherever the heading is read in isolation.
        The text content is unchanged by the no-wrap span. */}
    <h1 className="max-w-5xl text-display-xl normal-case text-mist-100">
      {TITLE_LEAD}
      <span className="whitespace-nowrap">{TITLE_TAIL}</span>
    </h1>
    <p className="mt-6 max-w-2xl text-body-lg font-light text-mist-300 sm:mt-8">
      {SUBLINE}
    </p>

    <div className="mt-10 sm:mt-12">
      <CTA href={PHONE_HREF} aria-label={CALL_ARIA_LABEL}>
        <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
        <span>{PHONE_DISPLAY}</span>
      </CTA>
    </div>

    {/* Trust line: a 1px rule and a letter-spaced line in sentence case (B8 — `eyebrow` is never
        uppercased). A paragraph, not a heading: it is a credential, not a section title. */}
    <p className="mt-12 max-w-2xl border-t border-mist-500/40 pt-6 text-eyebrow text-mist-400 sm:mt-16">
      {TRUST_LINE}
    </p>
  </Section>
);

export default Hero;
