/**
 * Visible keyboard focus for text links and quiet buttons, one helper per tone (11.1, R6).
 *
 * `FOCUS_ON_DARK`: the navy tone (#0a1f2e) — a white outline, 16.8:1 against it. Shared by Nav and
 * Footer and Kontakt (all navy, C12 amended).
 * `FOCUS_ON_LIGHT`: the light tone (white) — an `ink-900` outline, 18.0:1 against it. Used by
 * Partner, the page's light section with actions (Kontakt is navy again, C21).
 * Both are outlines, not rings, so the indicator survives forced-colours mode (the same choice as
 * the `CTA` primitive's own indicator). Each is a full literal string, never assembled at runtime,
 * so Tailwind's content scan sees every class (DESIGN_PLAN.md §2.5).
 */
export const FOCUS_ON_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export const FOCUS_ON_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";
