# 05: The Datenschutzerklärung reads its Company details from `Company` and `Contact`

**What to build:** The Datenschutzerklärung's "Name und Anschrift des Verantwortlichen" block fills in name, street, postal code and city and website from `Company`, and phone and email from `Contact`, in the form the landing page uses (ADR 0003: one form per fact). Visitors now see the phone as `0176 618 77 599` (the display number), the email in lower case as it appears in Kontakt, and the website as stored in `Company.website`. The wording is otherwise unchanged. The Datenschutz fixture is updated only in the phone, email and website lines. The single-source test is extended to Kontakt and the Datenschutzerklärung, so each Company detail is proven to reach every place it is shown.

**Blocked by:** 04 (`Company` feeds the footer and the Impressum)

**Status:** resolved

- [x] The Datenschutzerklärung shows name, street, postal code and city, phone, email and website from the content file, with no Company detail hardcoded in it
- [x] Phone reads `0176 618 77 599`, the email is lower case and matches Kontakt, and the website matches `Company.website`
- [x] The Datenschutz fixture differs from before only in the phone, email and website lines, and the page still matches it in wording, links and headings
- [x] Single-source test: changing phone, email, website, name, street, postal code or city in a substituted content file shows the new value in Kontakt (phone, email, plus its copy button and mailto link), the footer, the Impressum and the Datenschutzerklärung wherever that field is shown, and the old value nowhere
- [x] The content-file tests (approved and used) pass
- [x] `npm test` and `npm run build` pass

## Comments

- `Company.website` is now in the content file as `ingenieurbuero-auner.com` (lower case, like the email domain; the old Legal text had `Ingenieurbuero-auner.com`). The Datenschutz fixture changed only in the Tel., E-Mail and Website lines.
- The single-source test reads the Datenschutzerklärung from `<main>` only: the nav above it shows the phone number too, which would hide a hardcoded number. Kontakt is read as its text, its link targets (decoded) and what its copy button writes to the clipboard.
- The "old value nowhere" check matches the old value standalone (not right after `@`, `.`, `-` or a word character): the old website is also the domain of the unchanged email.
- Rows for phone and email use `Contact.phoneDisplay` and `Contact.email`; `Contact.phone` (the international `tel:` form) is not shown in the Legal text and is not a row.
