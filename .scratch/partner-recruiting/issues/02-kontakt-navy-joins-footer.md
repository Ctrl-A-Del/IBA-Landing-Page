Status: ready-for-agent
Type: enhancement

# 02: Kontakt returns to navy and joins the footer

**What to build:** Kontakt switches from the light tone back to navy, and the footer follows it with no hairline or rule. Navy on navy needs no divider (amends C12; supersedes R6 Q4 / E4). The orange call button and the C17 two-column Kontakt layout stay exactly as they are; only the tone changes. Comments that cite the old rhythm (Section primitive header, App slot table, Kontakt) are updated to match.

**Blocked by:** none (01 resolved; the join was confirmed as intended).

- [ ] Kontakt renders on the navy tone; the call button and two-column layout are unchanged
- [ ] No hairline or rule between Kontakt and the footer
- [ ] Kontakt, Section and Footer tests are updated only where they hardcode the old tone or a hairline
- [ ] Comments listing Kontakt among the light sections are corrected (Section primitive header, App slot table, Kontakt)
- [ ] `npm test` and `npm run build` green
