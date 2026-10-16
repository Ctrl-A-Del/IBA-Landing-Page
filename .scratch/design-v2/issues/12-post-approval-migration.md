# 12: Post-approval migration

**What to build:** Once the reviewer approves the prototype, the approved design becomes the single source of truth: the copy lands in the content data, the superseded components are deleted, and the template's dead assets are pruned.

**Blocked by:** 11.1 (Human review fixes) and explicit user approval

**Status:** ready-for-agent

- [ ] The approved page no longer depends on the temporary prototype pointer — the app entry renders the real sections directly
- [ ] All approved copy lives in the content data, including the heading strings currently hardcoded inside the services, Team and contact components
- [ ] The content file's byte-order mark is removed or handled deliberately, so nothing downstream trips over it
- [ ] The seven superseded components are deleted: header, features, about, services, Team, contact and Footer
- [ ] No import, reference or now-dead class remains pointing at the deleted components
- [ ] Shared primitives used only by the deleted components are removed; ones still in use are kept
- [ ] Images are pruned only after confirming the new design does not reference them — the template leftovers (the portfolio, team and testimonials folders, plus the unused single images) go, and everything the new page uses stays
- [ ] The favicon and social-preview assets referenced by the page head still exist after pruning
- [ ] A production build succeeds after the deletions, with no unresolved imports
- [ ] The German copy in the content data is character-identical to the approved prototype copy
- [ ] The technical envelope is intact: no router, no new heavy dependency, no external PostCSS config, self-hosted subsets only, Tailwind v3, React 17
- [ ] `package-lock.json` stays in sync with `package.json`, and no dependency was added or upgraded
- [ ] The legal pages are still untouched
- [ ] The `brand.alt` colour token and the shared Section primitive's `alt` tone are removed, since nothing in v2 uses them after ticket 11.1 (DESIGN_PLAN C12, R6)
