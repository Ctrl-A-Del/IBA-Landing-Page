# 02: Über uns part with divider

**What to build:** Below the portraits, separated by a 1 px decorative rule, the Unternehmen section shows an H3 "Über uns" and the two approved paragraphs. The first paragraph starts with the company name read from the Company detail, so changing the name in one place changes it here, in the footer and in the Legal pages. The second paragraph is phrased as intent (no prototype exists yet).

**Blocked by:** 01 (Rename Team to "Das Unternehmen").

**Status:** resolved

- [ ] Content file has `ueberUns` with `heading` ("Über uns") and `paragraphs` (two strings); the first is stored without the company name and the component renders `Company.name` in front of it; no placeholder syntax
- [ ] Rule is 1 px, low-contrast `mist` step on navy, with extra top spacing, and hidden from assistive technology (no `separator` role in the accessibility tree)
- [ ] Über uns uses the existing H3 type step (no new type token), the same `max-w-2xl` column, default navy text colour, wrapped in `Reveal`
- [ ] Section test: two H3s "Team" then "Über uns" in document order, the "Das Team" list with three items between them, two paragraphs after the list, the first starting with the company name from the content file
- [ ] Single-source test gains an `unternehmen` place on the `Company.name` row: a changed name appears in Über uns and the old one nowhere there
- [ ] Approved-copy golden gains "Über uns" and both paragraph strings as stored
- [ ] "every string is used" content check still holds
- [ ] `npm test` and `npm run build` green
