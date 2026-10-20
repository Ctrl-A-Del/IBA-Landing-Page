# 01: Widen the content-file tests to cover the Legal pages

**What to build:** A prefactor that lets the content file take on Company details and the Legal page list without the content-file tests rejecting them. The "approved" check also accepts strings present in the Legal page fixtures and today's two Legal page titles (`Impressum – Ingenieurbüro Auner`, `Datenschutzerklärung – Ingenieurbüro Auner`), written out in the test as an independent golden. The "used" check renders the landing page and every Legal page, and includes the document title, so a string that appears only on a Legal page or only in the tab title counts as used. The "hardcoded" check stays on the landing page only: the Legal text wording is supposed to be hardcoded. The content file does not change in this ticket, and the suite stays green on today's code.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The "approved" check passes a content-file string that appears only in a Legal page fixture, and one that equals a Legal page title from the test's own golden
- [x] The "approved" check still fails on a string found in neither the prototype golden, the Legal page fixtures nor the title golden
- [x] The "used" check renders the landing page and every Legal page and searches their copy and document titles
- [x] The "hardcoded" check still covers only the landing page
- [x] The prototype-copy golden is not regenerated
- [x] `npm test` and `npm run build` pass

## Comments

`src/App.copy.test.jsx`: a `LEGAL_PAGES` golden (path, fixture, title) in the test; an `unapproved()` helper
whose approval source now includes the Legal page fixtures' visible text and link targets plus the
titles, with three tests of its own (fixture-only string, title, rejected string). `renderWithMarkedData`
also renders every Legal page path and folds their blocks, attrs, image sources and `document.title`
into the "used" haystack; the "hardcoded" check still reads the landing-page capture only.
`src/__fixtures__/captureCopy.js`: new `captureStatic()` export (blocks, attrs, sources, title), reused
by `captureCopy`; the algorithm is unchanged and `prototype-copy.json` was not touched.
