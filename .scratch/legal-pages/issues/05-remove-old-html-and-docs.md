# 05: Remove the old .html files and update the docs

**What to build:** The two raw HTML files are removed from the static assets, with no redirect stubs (the old `.html` addresses will 404; this is accepted). The design plan is amended so the next agent does not treat the Legal pages as untouchable: decision A1 and hard constraints §2.6 and §2.10 (Legal pages in scope, Legal text still untouchable, build command is CRA build plus the copy script), and the §1.8 address note (corrected by the owner). One ADR records why clean paths come from a copy of the built landing page document per route. It lists the rejected alternatives (hash routes, a 404 fallback because of the wrong HTTP status, `react-snap` because it is unmaintained with 2018 Chromium, a custom server-render script, moving to Vite) and notes Vite as a possible future migration, out of scope here. Use the glossary terms Legal page and Legal text.

**Blocked by:** 01, 02, 03

**Status:** ready-for-agent

- [ ] `public/impressum.html` and `public/datenschutz.html` no longer exist; no remaining references to them in src, docs or tests
- [ ] `DESIGN_PLAN.md` amended as described
- [ ] ADR added under `docs/adr/`
- [ ] `npm test` and `npm run build` pass
