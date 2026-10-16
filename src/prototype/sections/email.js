/**
 * The company email address and the pre-filled `mailto:` for it (decision C5, DESIGN_PLAN.md §3).
 *
 * - `EMAIL` is the address `data.json` `Contact` stores, shown on the page and copied to the clipboard.
 * - `MAIL_HREF` opens a new mail with a URI-encoded subject, so the umlaut and spaces are valid.
 *
 * Hardcoded on purpose, like `./phone`: wave-3 tickets do not read or edit `src/data/data.json`
 * (ticket 12 owns it, parallelisation.md §3).
 */
export const EMAIL = "info@ingenieurbuero-auner.com";

// C8-NEW
export const MAIL_SUBJECT = "Anfrage zur Grabenfräse";

export const MAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
