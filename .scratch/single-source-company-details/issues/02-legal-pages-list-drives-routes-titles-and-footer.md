# 02: The `LegalPages` list drives the path lookup, page titles and footer links

**What to build:** The content file gets a `LegalPages` list of `{ slug, title, linkLabel }`, with an optional `heading` for a Legal text that has no h1 of its own (the Impressum). Slugs are bare (`impressum`); slashes are added wherever an address is built. The app resolves the current path by matching it against these slugs, with the trailing slash optional as it is today, and takes the tab title and hidden heading from the list. The mapping from slug to Legal page component stays in code. The footer builds its Legal page links (`/<slug>/`, `linkLabel`) from the list, and `Footer.legalLinks` is removed. The app still passes only `onLanding` to the nav. Nothing visible changes.

**Blocked by:** 01 (Widen the content-file tests to cover the Legal pages)

**Status:** resolved

- [x] Every `LegalPages` slug, with and without the trailing slash, renders its Legal page with the listed document title
- [x] The Impressum keeps its single, visually hidden h1; the Datenschutzerklärung still has no added heading
- [x] Every footer link to a Legal page points at a listed slug (`/<slug>/`) with its `linkLabel`
- [x] A test fails when a listed slug has no Legal page component
- [x] Any other path still renders the landing page
- [x] `Footer.legalLinks` is gone from the content file; the content-file tests (approved and used) pass
- [x] The Legal page fixture comparison passes unchanged
- [x] `npm test` and `npm run build` pass

## Comments

- `src/App.jsx` maps slug to component in `LEGAL_TEXTS`; a listed slug with no component falls back to the landing page, which the list-driven tests in `src/LegalPages.test.jsx` catch (checked by removing `datenschutz` from the map: 7 tests fail).
- `src/App.copy.test.jsx`: a marked slug names no page, so the Legal pages are rendered from a copy marked everywhere except the `LegalPages` slugs. The slugs must still be found marked, which the fully marked landing pass shows through the footer hrefs. The used check is not weakened.
- `Footer.company` is left in place for ticket 03 (`Company.name`).
