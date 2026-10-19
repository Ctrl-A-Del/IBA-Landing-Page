# 0001: Clean paths for the Legal pages by copying the built landing page document

Status: accepted

## Context

The Legal pages (Impressum, Datenschutzerklärung) are React components rendered by the same app as the
landing page. They must be reachable at `/impressum/` and `/datenschutz/` with HTTP status 200 on GitHub
Pages, which serves static files only and has no server-side rewrite. The Legal text must not change.

## Decision

After the CRA build, `scripts/copy-route-documents.js` copies the built landing page document
(`build/index.html`) to `build/impressum/index.html` and `build/datenschutz/index.html`. GitHub Pages then
serves a real file at each clean address, the same bundle boots, and the app picks the Legal page from the
path (no router library). The script exits non-zero if the source document is missing. `npm run build` is
the CRA build followed by this script, so CI, PR checks and deploy use one command. The CRA `homepage` is
the absolute site origin, so asset URLs in the copies need no rewriting.

The old `public/impressum.html` and `public/datenschutz.html` were removed with no redirect stubs; those
`.html` addresses now return 404 (accepted).

## Rejected alternatives

- **Hash routes** (`/#/impressum`): not a clean address, not memorable, poor for a legally required page.
- **404 fallback** (a `404.html` that boots the app): GitHub Pages answers with HTTP status 404, so search
  engines and monitors treat the Legal pages as errors.
- **`react-snap`**: unmaintained and tied to a 2018 Chromium; pre-rendering is out of scope anyway.
- **Custom server-render script**: more code and risk than a file copy, for no benefit the pages need.
- **Moving to Vite** (or another toolchain): disproportionate for two pages and contrary to the technical
  envelope (CRA 5, no new dependencies).

## Consequences

- The Legal pages are empty until JavaScript runs (no pre-rendering).
- Deploys must run `npm run build`, not the bare CRA build; the deploy workflow and the PR check enforce it.
- Migrating to Vite may become worthwhile later. It is out of scope here and would supersede this ADR if
  it provided pre-rendering.
