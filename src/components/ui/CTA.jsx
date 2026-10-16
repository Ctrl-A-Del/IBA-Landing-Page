/**
 * CTA — the primary call-to-action primitive (ticket 02, DESIGN_PLAN.md §3 B3/B8, §4.1).
 *
 * DESIGN INTENT
 * Solid orange (#f08a24) with NAVY (#0a1f2e) text, a 3px radius, never a pill.
 *
 * WCAG CONTRAST MATHS — why every choice here is the way it is (computed, not assumed):
 *   navy on signal        #0a1f2e on #f08a24 -> 6.72:1  AA normal text / AAA large text
 *   navy on signal-hover  #0a1f2e on #d4730f -> 5.01:1  AA, so the hover state stays legible
 *   navy on signal-active #0a1f2e on #cd6e0e -> 4.67:1  AA, so the pressed state stays legible
 *   WHITE on signal       #ffffff on #f08a24 ->  2.5:1  FAILS AA. Never allowed (DESIGN_PLAN §1.9).
 *
 * The FILL and the text colour are both locked with Tailwind's important modifier (`!bg-signal`,
 * `!text-brand`), so the CTA has exactly one appearance. A caller cannot pass a colour prop because
 * there is none, and cannot override it with `className="bg-white text-white"` either —
 * `!important` wins in the cascade. The hover/active variants are important too, otherwise the
 * locked base colour would outrank them and hovering would do nothing. Making it literally
 * impossible is the point of the checklist item ("the blue gradient is no longer reachable as a CTA
 * fill"); "don't do that" comments get ignored.
 *
 * Consequence worth knowing before you fight it: a second CTA *appearance* (an outline CTA on navy,
 * say) cannot be expressed by passing classes. That is a design decision, not a local tweak — raise
 * it, do not fork this component.
 *
 * FOCUS INDICATOR — visible on BOTH navy and light backgrounds:
 * A single orange ring cannot do this job: orange against white is only ~2.5:1, below the 3:1 that
 * WCAG 1.4.11 wants for non-text UI. So the indicator is two-tone, drawn outward from the button:
 *   1. a 2px `brand` navy ring hugging the button  -> navy vs orange 6.72:1, navy vs white 18.0:1
 *   2. a 2px white outline outside it              -> white vs navy 16.8:1
 * On a navy page the white outline carries the indicator (16.8:1 against navy); on a light page the
 * navy ring carries it (18.0:1 against white). At least one boundary always clears 3:1, and neither
 * is ever required to sit against the orange at low contrast. `outline` is used (not `ring`) for the
 * outer band so the indicator survives forced-colours / high-contrast mode, where box-shadows are
 * dropped.
 *
 * INTERFACE
 *   <CTA href="tel:...">Anrufen</CTA>   -> renders an <a>
 *   <CTA onClick={...}>Absenden</CTA>   -> renders a <button type="button">
 * `className` is for LAYOUT ONLY (spacing, width, size). Anything colour-related is refused by
 * design; see above.
 */
const CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-edge !bg-signal px-6 py-3 font-body text-body font-semibold !text-brand no-underline transition-colors duration-150 hover:!bg-signal-hover active:!bg-signal-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-brand";

const CTA = ({ href, className = "", children, ...rest }) => {
  const classes = `${CTA_CLASSES} ${className}`;

  // An `href` makes it a link; anything else is a real button, so keyboard and screen-reader users
  // get the semantics they expect from the affordance they see.
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
};

export default CTA;
