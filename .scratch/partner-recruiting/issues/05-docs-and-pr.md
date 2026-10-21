Status: ready-for-agent
Type: enhancement

# 05: Docs and PR: C21, amendments, glossary

**What to build:** The written record agrees with the code, so future agents don't reintroduce staff wording or the old rhythm. Then the PR is opened.

**Blocked by:** 03 (Partner section), 04 (Fifth nav link "Partner").

- [ ] DESIGN_PLAN.md has new decision **C21**: section copy, anchor `#partner`, nav link, secondary lane, no orange, `mailto:` per role, plus the layout verdict from ticket 01
- [ ] A3 (secondary audience clause: Entwicklungspartner), C12 (new order, Kontakt navy, footer join) and C20 (five nav links) are amended
- [ ] §4 gets a new row 7 with later rows renumbered; the §4.1 anchor list adds `#partner`
- [ ] `GLOSSARY.md` defines **Partnerrolle** with its two instances and rejects "Stelle", "Karriere", "Bewerbung"
- [ ] `npm test` and `npm run build` green
- [ ] PR opened from `content/partner-recruiting`, not merged (merging deploys)
