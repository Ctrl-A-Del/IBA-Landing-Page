# 01: Impressum page at /impressum/

**What to build:** A visitor who opens `/impressum` or `/impressum/` in the app sees the Impressum in the site theme. It uses the real Nav, Footer and mobile call bar, in a readable-width column. There is one top-level heading and the original heading levels below it. The tab title reads "Impressum – Ingenieurbüro Auner" and the landing page title is restored on `/`. The page opens scrolled to the top. The Nav section links lead to the matching landing page sections (not dead same-page anchors), and the Nav scroll state works on a page with no hero. The app picks the page from the path with no router library, tolerating a trailing slash; `/` and unknown paths render the landing page as today. `npm start` serves the page at that address. The Legal text is carried over word for word from the working tree, including the corrected "41366 Schwalmtal" line, and a verbatim fixture test guards visible text, link targets and heading levels. This test replaces the Impressum SHA-256 pin.

First step: create `design/legal-pages` from `master` and make sure the owner's uncommitted address fix, the glossary entries and `.scratch/` are carried onto it (commit them). Take the fixture from the working tree before touching anything. Do not merge or open a PR to `master`.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [ ] Branch `design/legal-pages` exists with the address fix committed
- [ ] Mounted-app test at the Impressum path: Legal text equals the fixture (whitespace normalised only)
- [ ] Mounted-app test: nav and footer landmarks and the call bar are present; nav section links resolve to the landing page's sections
- [ ] Mounted-app test: document title per page, landing page unchanged at `/`, unknown path renders the landing page
- [ ] No new dependency; prose styling is a small set of descendant rules under one wrapper class using existing tokens
- [ ] Existing tests (favicon, head) still pass
