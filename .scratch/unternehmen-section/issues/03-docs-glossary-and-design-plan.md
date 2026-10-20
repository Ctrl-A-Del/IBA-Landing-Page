# 03: Docs: glossary and DESIGN_PLAN.md

**What to build:** The written record agrees with the code: the glossary names "Grabenfräse" as the one machine name and rejects the alternatives, and DESIGN_PLAN.md records the new section structure as a decision so future agents don't reintroduce "Team", `#team`, "Grabenmaschine" or "Fräsmaschine".

**Blocked by:** 01 (Rename Team to "Das Unternehmen"), 02 (Über uns part with divider).

**Status:** ready-for-agent

- [ ] `GLOSSARY.md` has **Grabenfräse**: the machine the company develops; the one name the page uses ("die Maschine" is fine once named); not *Grabenmaschine*, not *Fräsmaschine*
- [ ] DESIGN_PLAN.md has a new decision row: Team becomes "Das Unternehmen" with parts Team and Über uns, navy, anchor `#unternehmen`, nav label "Unternehmen", rule between parts, Über uns copy phrased as intent (C2)
- [ ] B7, §4 row 6, the §4.1 anchor list and the nav row are amended to match the code
- [ ] App header slot table checked against the code
- [ ] PR opened from `content/team-company-intro`, not merged (merging deploys); `npm test` and `npm run build` green
