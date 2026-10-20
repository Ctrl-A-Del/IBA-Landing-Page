# 01: Widen the content-file tests to cover the Legal pages

**What to build:** A prefactor that lets the content file take on Company details and the Legal page list without the content-file tests rejecting them. The "approved" check also accepts strings present in the Legal page fixtures and today's two Legal page titles (`Impressum – Ingenieurbüro Auner`, `Datenschutzerklärung – Ingenieurbüro Auner`), written out in the test as an independent golden. The "used" check renders the landing page and every Legal page, and includes the document title, so a string that appears only on a Legal page or only in the tab title counts as used. The "hardcoded" check stays on the landing page only: the Legal text wording is supposed to be hardcoded. The content file does not change in this ticket, and the suite stays green on today's code.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The "approved" check passes a content-file string that appears only in a Legal page fixture, and one that equals a Legal page title from the test's own golden
- [ ] The "approved" check still fails on a string found in neither the prototype golden, the Legal page fixtures nor the title golden
- [ ] The "used" check renders the landing page and every Legal page and searches their copy and document titles
- [ ] The "hardcoded" check still covers only the landing page
- [ ] The prototype-copy golden is not regenerated
- [ ] `npm test` and `npm run build` pass
