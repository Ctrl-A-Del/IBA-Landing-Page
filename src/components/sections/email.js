import data from "../../data/data.json";

/**
 * The company email address and the pre-filled `mailto:` for it (decision C5, DESIGN_PLAN.md §3),
 * read from `data.json` `Contact`.
 *
 * - `EMAIL` is shown on the page and copied to the clipboard.
 * - `mailHref(subject)` builds a `mailto:` to `EMAIL` with a URI-encoded subject, so umlauts and spaces
 *   are valid. Partner uses it for its role subjects.
 * - `MAIL_HREF` is that link with Kontakt's subject.
 */
export const EMAIL = data.Contact.email;

export const MAIL_SUBJECT = data.Contact.mailSubject;

export const mailHref = (subject) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

export const MAIL_HREF = mailHref(MAIL_SUBJECT);
