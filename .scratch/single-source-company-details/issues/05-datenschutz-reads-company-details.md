# 05: The Datenschutzerklärung reads its Company details from `Company` and `Contact`

**What to build:** The Datenschutzerklärung's "Name und Anschrift des Verantwortlichen" block fills in name, street, postal code and city and website from `Company`, and phone and email from `Contact`, in the form the landing page uses (ADR 0003: one form per fact). Visitors now see the phone as `0176 618 77 599` (the display number), the email in lower case as it appears in Kontakt, and the website as stored in `Company.website`. The wording is otherwise unchanged. The Datenschutz fixture is updated only in the phone, email and website lines. The single-source test is extended to Kontakt and the Datenschutzerklärung, so each Company detail is proven to reach every place it is shown.

**Blocked by:** 04 (`Company` feeds the footer and the Impressum)

**Status:** ready-for-agent

- [ ] The Datenschutzerklärung shows name, street, postal code and city, phone, email and website from the content file, with no Company detail hardcoded in it
- [ ] Phone reads `0176 618 77 599`, the email is lower case and matches Kontakt, and the website matches `Company.website`
- [ ] The Datenschutz fixture differs from before only in the phone, email and website lines, and the page still matches it in wording, links and headings
- [ ] Single-source test: changing phone, email, website, name, street, postal code or city in a substituted content file shows the new value in Kontakt (phone, email, plus its copy button and mailto link), the footer, the Impressum and the Datenschutzerklärung wherever that field is shown, and the old value nowhere
- [ ] The content-file tests (approved and used) pass
- [ ] `npm test` and `npm run build` pass
