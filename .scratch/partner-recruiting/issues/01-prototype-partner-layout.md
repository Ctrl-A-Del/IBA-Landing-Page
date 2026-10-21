Status: ready-for-agent
Type: prototype

# 01: Prototype the layout of "Partner gesucht"

**What to build:** A throwaway prototype that answers one question: how should the "Partner gesucht" section look? Follow the earlier Unternehmen layout prototypes (D5): the prototype lives apart from the real section modules and is switched in with a single, clearly marked line in the App, so it can be reverted in one step. No content-file entry, no real nav link and no real `Partner` section module are added by this ticket. Use the copy from the spec verbatim, hardcoded inside the prototype.

**Blocked by:** none.

**The question to answer:** how should two Partnerrollen be arranged on a light section so that they read as two equal, quiet options and not as a competing call to action?

Produce a few distinct layouts (at least: roles side by side, roles stacked, and a variant without a sector label above the H3), switchable while viewing, each shown with the real spec copy. Each variant must be checked at 360, 375, 768 and 1280 px.

Also settle the two open points the spec hands to this prototype, with measured evidence:

- [ ] Do five nav links fit at 360 and 375 px, or does the row scroll sideways? Report the measured widths and recommend: leave as is, or a separate decision.
- [ ] How do the light Partner section and the navy Kontakt section, which now joins the navy footer, read together? Confirm the Kontakt-to-footer join looks intended with no divider.

**Acceptance:**

- [ ] The variants use only existing Tailwind tokens and the existing button and type primitives; no orange on the partner actions (B3)
- [ ] Both actions are `mailto:` links with the spec's labels and URI-encoded subjects
- [ ] Each variant's heading order is eyebrow, H2, intro, then one H3 per role
- [ ] Reduced-motion behaviour matches the other sections (B5)
- [ ] The prototype is removable in one step and touches no real section module
- [ ] A short verdict note records which layout the human chose and why, for the follow-up ticket that builds the real section
- [ ] `npm test` and `npm run build` green with the prototype switched out

**Not in this ticket:** building the real section, the nav link, content-file entries, golden changes, or the Kontakt tone change. Those are cut as a follow-up ticket once a layout is chosen.
