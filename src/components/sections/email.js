import data from "../../data/data.json";

/**
 * The company email address and the pre-filled `mailto:` for it (decision C5, DESIGN_PLAN.md §3),
 * read from `data.json` `Contact`.
 *
 * - `EMAIL` is shown on the page and copied to the clipboard.
 * - `MAIL_HREF` opens a new mail with a URI-encoded subject, so the umlaut and spaces are valid.
 */
export const EMAIL = data.Contact.email;

export const MAIL_SUBJECT = data.Contact.mailSubject;

export const MAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
