# 04: `Company` feeds the footer and the Impressum

**What to build:** The content file gets a `Company` entry: `name`, `street`, `postalCode`, `city`, `website`, `representative`, `registerCourt`, `registerNumber`. `Footer.company` moves to `Company.name`. The footer reads its company name from there, and the Impressum fills in its Company details (name, street, postal code and city, representative, register court and register number) from it. The Impressum wording stays as supplied, and since none of these details changes form, the Impressum fixture does not change. The single-source test starts here: a substituted content file with one changed value per field shows the new value in the footer and the Impressum wherever that field appears, and the old value nowhere. See ADR 0003 and the glossary entries for Legal text and Company details.

**Blocked by:** 02 (The `LegalPages` list drives the path lookup, page titles and footer links)

**Status:** resolved

- [ ] `Company` exists in the content file with all eight fields; `Footer.company` is gone (seven fields; `website` deferred to 05, see Comments)
- [x] The footer shows `Company.name` in its brand block and copyright line
- [x] The Impressum shows name, street, postal code and city, representative, register court and register number from `Company`, with no Company detail hardcoded in it
- [x] The Impressum still matches its unchanged fixture in wording, links and headings
- [x] Single-source test: changing each of name, street, postal code, city, representative, register court and register number in a substituted content file changes it in the footer (name) and the Impressum, and the old value appears nowhere on those pages
- [x] Existing tests that hardcode the footer's company name are updated only as needed; the content-file tests (approved and used) pass
- [x] `npm test` and `npm run build` pass

## Comments

- `Company` has seven fields; `website` is left for 05. Nothing renders it before the
  Datenschutzerklärung does, so adding it here fails the "every string is used" check (verified). 05
  adds `"website": "ingenieurbuero-auner.com"` together with the Datenschutz change.
- `Footer` is removed from the content file entirely (it held only `company`); the Footer test's
  ticket-02 guard now asserts there is no `Footer` entry.
- The single-source test is `src/CompanyDetails.test.jsx`: a `FIELDS` table of
  `[field, old value, new value, places]`, with places `footer` (at `/`) and `impressum` (the whole
  page at `/impressum/`, title included). 05 extends the table and adds `kontakt` and `datenschutz`
  places. Existing tests that hardcode the company name needed no change.
