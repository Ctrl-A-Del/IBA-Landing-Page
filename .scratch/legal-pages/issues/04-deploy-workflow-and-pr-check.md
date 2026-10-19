# 04: Deploy workflow without the third-party action, plus PR check

**What to build:** The deploy workflow no longer uses the third-party deploy action. It uses explicit steps with only first-party GitHub actions and plain `git`: check out, set up Node 20 with npm cache, `npm ci`, `npm run build`, then commit the build directory and force-push it to `gh-pages` using the built-in token. Branch and Pages configuration are unchanged, and it still triggers on `push` to `master` only. The PR check workflow gains a step that fails if the built Legal page documents are missing or do not reference the stylesheet bundle, so a broken copy step is caught before merge. Nothing is merged or deployed as part of this ticket.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Deploy workflow contains no third-party action and runs `npm run build`
- [ ] Deploy still triggers only on `push` to `master`
- [ ] Check workflow fails when a route document is missing or lacks the stylesheet reference (verified locally by simulating both)
- [ ] Workflow files are valid YAML
