# 13: Open the PR to master

**What to build:** The pull request that ships the redesign. It is its own ticket precisely because opening it publishes the live website.

**Blocked by:** 12 (Post-approval migration) and explicit user approval

**Status:** ready-for-agent

- [x] Explicit approval from the user is on record before the PR is created
- [x] Nothing was ever pushed directly to `master` — the branch is the only source
- [ ] The PR is opened against `master`, and the PR body states plainly that the deploy workflow runs on pull requests to `master` as well as on pushes, so **opening** this PR is itself a deploy, not only merging it
- [x] The PR body links the evidence gathered in the QA pass, including the before/after comparison
- [x] The PR body lists the deleted components and the pruned assets, so the reviewer sees the full blast radius
- [x] The branch still contains nothing that touches the legal pages
- [ ] The PR is opened without merging it

## Comments

### Prep and approval (agent, 2026-10-16)

- **Before/after comparison** did not exist in the QA evidence, so it was made here:
  `evidence/13/compare.js` takes full-page screenshots of production builds of `master` @ `e5ffdd6`
  and `design/v2` at 375 and 1280 px, with reduced motion emulated. Output is in `evidence/13/shots/`.
- **PR body** is in `evidence/13/pr-body.md`: the deploy warning, the deleted components (9), the
  pruned assets (32), the removed tokens, links to the QA evidence, and the merge danger.
- **Checks:** `origin/master` is still `e5ffdd6` and an ancestor of the branch. `git diff` against
  `master` is empty for `public/impressum.html` and `public/datenschutz.html`. 13 suites and 86
  tests pass.
- **Approval:** the user explicitly approved pushing the branch and opening the PR to `master` on
  2026-10-16, after being told that opening it deploys the live site.
- **Pushed:** `design/v2` → `origin/design/v2`. **PR not opened yet:** `gh` is not installed on this
  machine. Open it from
  `https://github.com/Ctrl-A-Del/IBA-Landing-Page/compare/master...design/v2?expand=1` with the
  title "Design v2: landing page redesign" and the body from `evidence/13/pr-body.md`, then tick the
  two remaining boxes.
