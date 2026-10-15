/**
 * The company phone number, in the two forms decision C16 (DESIGN_PLAN.md §3) fixes.
 *
 * - `PHONE_HREF` is the dial target: the international number `data.json` stores
 *   (`+49 176 618 77 599`) with the visual spaces stripped, as RFC 3966 `tel:` URIs expect and as the
 *   legacy `contact.jsx` already does.
 * - `PHONE_DISPLAY` is what a visitor reads: the local NRW format.
 *
 * Hardcoded on purpose: wave-3 tickets do not read or edit `src/data/data.json` (ticket 12 owns it,
 * parallelisation.md §3).
 */
export const PHONE_HREF = "tel:+4917661877599";
export const PHONE_DISPLAY = "0176 618 77 599";

/** The accessible name every call CTA shares (nav, mobile call bar, hero). */
export const CALL_LABEL = `Anrufen: ${PHONE_DISPLAY}`;
