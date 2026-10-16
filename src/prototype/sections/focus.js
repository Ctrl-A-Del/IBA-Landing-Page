/**
 * Visible keyboard focus for text links and quiet buttons on the dark tones (navy #0a1f2e, footer
 * #14171a): a white outline, 16.8:1 against navy and higher still on the footer. Outline, not ring,
 * so it survives forced-colours mode (the same choice as the `CTA` primitive's own indicator).
 *
 * Shared by Nav, Kontakt and Footer. A full literal string, never assembled at runtime, so Tailwind's
 * content scan sees every class (DESIGN_PLAN.md §2.5).
 */
export const FOCUS_ON_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
