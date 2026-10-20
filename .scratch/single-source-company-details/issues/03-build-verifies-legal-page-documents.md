# 03: The build verifies the Legal page documents; CI no longer names them

**What to build:** The post-build copy step reads the Legal page slugs from the content file instead of its own list, so a page added to `LegalPages` gets a document without touching the script. After copying, it checks that each Legal page document exists and references the Vite stylesheet bundle (`/assets/*.css`), and it fails the build if not. This takes over the "Verify Legal page documents" step in the PR check workflow, which is removed. The interface stays one function taking the build directory, and the CLI entry point still exits non-zero on failure. The check now runs locally and in CI from `npm run build`.

**Blocked by:** 02 (The `LegalPages` list drives the path lookup, page titles and footer links)

**Status:** resolved

- [x] After the step runs on a temporary build directory, a document exists for every `LegalPages` slug, read from the real content file in the test (no hardcoded list); the stand-in document carries a stylesheet reference
- [x] It fails when the built document is missing
- [x] It fails when a document lacks the stylesheet reference
- [x] The script no longer holds its own list of routes
- [x] The PR check workflow no longer has the "Verify Legal page documents" step and names no Legal page
- [x] `npm run build` passes on the real build and produces a document per Legal page
- [x] `npm test` passes

## Comments

- `scripts/copy-route-documents.js` reads the slugs from `src/data/data.json` `LegalPages` (the `ROUTES` export is gone) and, after each copy, throws if the document is missing or lacks `href="/assets/*.css"`. The CLI still exits 1 on failure (checked on a stand-in without a stylesheet).
- `src/copyRouteDocuments.test.js` iterates the real `LegalPages`; the stylesheet test was red before the check was added.
- The missing-document test covers a missing built `index.html`; a missing copy right after `copyFileSync` cannot be produced from outside, so it has no test of its own.
- `.github/workflows/check.yml` no longer has the "Verify Legal page documents" step.
