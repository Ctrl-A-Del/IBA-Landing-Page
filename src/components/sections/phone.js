import data from "../../data/data.json";

/**
 * The company phone number, in the two forms decision C16 (DESIGN_PLAN.md §3) fixes, read from
 * `data.json` `Contact`.
 *
 * - `PHONE_HREF` is the dial target: the international number `data.json` stores
 *   (`+49 176 618 77 599`) with the visual spaces stripped, as RFC 3966 `tel:` URIs expect.
 * - `PHONE_DISPLAY` is what a visitor reads: the local NRW format.
 */
const { phone, phoneDisplay, callVerb } = data.Contact;

export const PHONE_HREF = `tel:${phone.replace(/\s+/g, "")}`;
export const PHONE_DISPLAY = phoneDisplay;

/** The verb on the call buttons ("Anrufen"). */
export const CALL_VERB = callVerb;

/** The accessible name every call CTA shares (nav, mobile call bar, hero, Kontakt): "Anrufen: <number>". */
export const CALL_ARIA_LABEL = `${CALL_VERB}: ${PHONE_DISPLAY}`;
