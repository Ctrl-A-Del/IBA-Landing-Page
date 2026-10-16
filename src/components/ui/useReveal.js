import { useCallback, useEffect, useState } from "react";

/**
 * Shared scroll-reveal hook (DESIGN_PLAN.md §3 decision B5: motion is CSS-only, no animation
 * library; everything gated behind `prefers-reduced-motion`).
 *
 * PUBLIC INTERFACE — this is the agreed test seam of ticket 02, do not widen it casually:
 *
 *   const { ref, isRevealed } = useReveal();
 *   <div ref={ref} data-revealed={isRevealed} className={isRevealed ? "..." : "..."} />
 *
 * The hook owns *state* ("has this element been revealed?"), the caller owns *presentation*. That
 * split is deliberate: the hook stays a pure piece of behaviour with no Tailwind knowledge, and no
 * caller can reach into the observer.
 *
 * Returns `isRevealed`. It is `true` immediately when the visitor prefers reduced motion, so the
 * content is simply there and nothing animates.
 *
 * Otherwise it starts `false` and flips to `true` the first time the element intersects the
 * viewport, then stops observing — a reveal is a one-shot, never a re-hide on scroll-up.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const prefersReducedMotion = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches === true;
};

export const useReveal = ({ threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = {}) => {
  const [isRevealed, setIsRevealed] = useState(prefersReducedMotion);
  const [element, setElement] = useState(null);

  // Callback ref (not `useRef`) so attaching the element re-runs the effect below. `useRef` would
  // not, and the observer would never see the node.
  const ref = useCallback((node) => setElement(node), []);

  useEffect(() => {
    // Inert under reduced motion: `isRevealed` is already true, so nothing is ever observed.
    if (isRevealed || !element) {
      return undefined;
    }

    // Fail open. If the API is missing there is no way to ever reveal the element, so showing the
    // content immediately is the only safe direction — visibility must never depend on an observer.
    if (typeof window.IntersectionObserver !== "function") {
      setIsRevealed(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting === true)) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, isRevealed, threshold, rootMargin]);

  return { ref, isRevealed };
};

export default useReveal;
