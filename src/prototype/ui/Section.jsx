/**
 * Section — the page's background + rhythm primitive (ticket 02, DESIGN_PLAN.md §4 and §4.1).
 *
 * Three tones, matching the background rhythm fixed by decision C12 (§4):
 *   navy   -> hero, Einsatzbereiche, Team, Kontakt
 *   light  -> Verfahren, Warum wir
 *   alt    -> Footer
 *
 * The tone carries its own text colour from the neutral ramp, so a section ticket never writes
 * `text-white/70`. Body copy defaults to the AA-passing steps: `ink-600` on light (7.1:1 on white),
 * `mist-300` on navy (9.7:1 on #0a1f2e). See `tailwind.config.js` for the full ramp and its maths.
 *
 * VERTICAL RHYTHM lives here and nowhere else: `py-20 sm:py-28 lg:py-36` (80/112/144px). That is the
 * "generous space" of §4.1 — do not add per-section padding on top of it, or the page's rhythm
 * drifts section by section.
 *
 * ANCHOR OFFSET — the contract ticket 03 and every section ticket must honour:
 *   The sticky nav is expected to be exactly `h-nav` tall (5rem, `spacing.nav` in
 *   `tailwind.config.js`). This primitive applies `scroll-mt-nav` (the SAME token) so a jump to
 *   `#verfahren` etc. lands with the heading clear of the nav. `src/index.css` also sets
 *   `scroll-margin-top: var(--iba-anchor-offset)` on every `section[id]` as a safety net.
 *   If ticket 03 needs a different nav height, `spacing.nav` and `--iba-anchor-offset` must change
 *   TOGETHER — both live in files owned by ticket 02, so escalate instead of editing (see
 *   `.scratch/design-v2/parallelisation.md` §3). There is deliberately no per-call override for
 *   this: two sections with different offsets would mean the page's nav is not one height.
 *
 * INTERFACE
 *   <Section id="team" tone="navy">...</Section>
 * `className` is for LAYOUT ONLY — it is appended last, so a tone/bg class passed there wins the
 * cascade. Don't.
 */
const TONES = {
  navy: "bg-brand text-mist-300",
  light: "bg-white text-ink-600",
  alt: "bg-brand-alt text-mist-300",
};

const Section = ({ id, tone = "light", className = "", containerClassName = "", children, ...rest }) => (
  <section
    id={id}
    className={`scroll-mt-nav ${TONES[tone]} py-20 sm:py-28 lg:py-36 ${className}`}
    {...rest}
  >
    {/* The page gutter. One container width for the whole page (1170px) — do not invent another. */}
    <div className={`mx-auto w-full max-w-container px-5 sm:px-6 lg:px-8 ${containerClassName}`}>
      {children}
    </div>
  </section>
);

export default Section;
