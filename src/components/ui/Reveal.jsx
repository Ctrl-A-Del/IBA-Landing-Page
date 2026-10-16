import { useReveal } from "./useReveal";

/**
 * Reveal — the canonical scroll-reveal wrapper (ticket 02, DESIGN_PLAN.md §3 B5).
 *
 * Wraps `useReveal` so the eight section tickets all animate IDENTICALLY instead of each inventing
 * its own duration, easing and offset. Use this rather than calling the hook directly unless you
 * need to place the ref on something that is not a plain container.
 *
 * Reduced motion is handled twice on purpose, because the two halves cover different things:
 *   1. `useReveal` never starts an IntersectionObserver under `prefers-reduced-motion: reduce`, so
 *      `isRevealed` is `true` from the first render — the content is simply there.
 *   2. `motion-reduce:transition-none` (a Tailwind built-in variant) guarantees that even if a
 *      reveal is somehow triggered, no transition runs. `src/index.css` also zeroes transition
 *      durations globally under the same query, so this is belt and braces.
 * The result is exactly what the ticket asks for: content fully visible, nothing animates.
 *
 * INTERFACE
 *   <Reveal>...</Reveal>
 *   <Reveal as="li" className="...">...</Reveal>
 * `data-revealed` is exposed on the element as a small, deliberate courtesy to ticket 11 and to
 * anyone verifying the reveal by hand in devtools.
 */
const Reveal = ({ as: Tag = "div", className = "", children, ...rest }) => {
  const { ref, isRevealed } = useReveal();

  return (
    <Tag
      ref={ref}
      data-revealed={isRevealed ? "true" : "false"}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
