# 02: Datenschutzerklärung page at /datenschutz/ and footer links

**What to build:** The Datenschutzerklärung renders at `/datenschutz` and `/datenschutz/` exactly like the Impressum: same chrome, layout, title (the Datenschutz equivalent of "Impressum – Ingenieurbüro Auner") and top scroll. Its Legal text is a faithful transcription, reproducing the odd `<p><h2>` heading levels and order, and keeping generator-credit, privacy-author and GitHub links working. A fixture test guards it and replaces the Datenschutz SHA-256 pin. The footer's legal links, and the data they come from, point to `/impressum/` and `/datenschutz/` (respecting the existing `PUBLIC_URL` handling), so a visitor can move between the two Legal pages and the Impressum is reachable from every page.

**Blocked by:** 01

**Status:** resolved

- [ ] Mounted-app test at the Datenschutz path: Legal text, link targets and heading levels equal the fixture
- [ ] Document title is set for this page
- [ ] Footer test updated: link list and hrefs use the new addresses on both landing and Legal pages
- [ ] The SHA-256 hash test is gone
- [ ] No rewording, de-duplication or "fixing" of the text
