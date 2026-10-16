/**
 * Section — the page's background + rhythm primitive (ticket 02, DESIGN_PLAN.md §4 and §4.1).
 *
 * Two tones, matching the background rhythm fixed by decision C12 (§4, amended in R6):
 *   navy   -> hero, Einsatzbereiche, Team (the footer reuses these classes on its <footer>)
 *   light  -> Verfahren, Warum wir, Kontakt
 * (The former `alt` tone and its `brand.alt` colour were removed in ticket 12: no v2 consumer.)
 *
 * The tone carries its own text colour from the neutral ramp, so a section ticket never writes
 * `text-white/70`. Body copy defaults to the AA-passing steps: `ink-600` on light (7.1:1 on white),
 * `mist-300` on navy (9.7:1 on #0a1f2e). See `tailwind.config.js` for the full ramp and its maths.
 *
 * VERTICAL RHYTHM lives here and nowhere else: `py-20 sm:py-28 lg:py-36` (80/112/144px). That is the
 * "generous space" of §4.1 — do not add per-section padding on top of it, or the page's rhythm
 * drifts section by section.
 *
 * ANCHOR OFFSET — the contract the nav and every section must honour:
 *   The sticky nav is expected to be exactly `h-nav` tall (`spacing.nav` in `tailwind.config.js`).
 *   The scroll-margin is NOT set here: `src/index.css` gives every `section[id]` a `scroll-margin-top`
 *   derived from that same config value with `theme()`, so the number exists once. Do not add a
 *   `scroll-mt-*` utility here — a local literal would outrank the derived rule (unlayered
 *   specificity 0,1,1 beats a utility class) and silently reintroduce the drift this contract
 *   exists to prevent. To change the nav height, change `spacing.nav`.
 *
 * INTERFACE
 *   <Section id="team" tone="navy">...</Section>
 * `className` is for LAYOUT ONLY. It is appended last so it reads last, but Tailwind's cascade is
 * decided by the order of the generated utilities, not by the class attribute: a conflicting
 * background utility passed here is NOT guaranteed to win. Pass layout, not colour.
 * An unknown `tone` falls back to `light`.
 *
 * `TONES` and `GUTTER` are exported for the footer, which is a <footer>, not a <section>. They are
 * literal class strings on purpose: Tailwind only generates classes it finds written out whole.
 */
export const TONES = {
  navy: "bg-brand text-mist-300",
  light: "bg-white text-ink-600",
};

/** The page gutter. One container width for the whole page (1170px) — do not invent another. */
export const GUTTER = "mx-auto w-full max-w-container px-5 sm:px-6 lg:px-8";

const Section = ({ id, tone = "light", className = "", containerClassName = "", children, ...rest }) => (
  <section
    id={id}
    className={`${TONES[tone] ?? TONES.light} py-20 sm:py-28 lg:py-36 ${className}`}
    {...rest}
  >
    <div className={`${GUTTER} ${containerClassName}`}>
      {children}
    </div>
  </section>
);

export default Section;
