# 13: Open the PR to master

**What to build:** The pull request that ships the redesign. It is its own ticket precisely because opening it publishes the live website.

**Blocked by:** 12 (Post-approval migration) and explicit user approval

**Status:** ready-for-agent

- [ ] Explicit approval from the user is on record before the PR is created
- [ ] Nothing was ever pushed directly to `master` — the branch is the only source
- [ ] The PR is opened against `master`, and the PR body states plainly that the deploy workflow runs on pull requests to `master` as well as on pushes, so **opening** this PR is itself a deploy, not only merging it
- [ ] The PR body links the evidence gathered in the QA pass, including the before/after comparison
- [ ] The PR body lists the deleted components and the pruned assets, so the reviewer sees the full blast radius
- [ ] The branch still contains nothing that touches the legal pages
- [ ] The PR is opened without merging it
