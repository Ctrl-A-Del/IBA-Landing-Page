# 03: The build verifies the Legal page documents; CI no longer names them

**What to build:** The post-build copy step reads the Legal page slugs from the content file instead of its own list, so a page added to `LegalPages` gets a document without touching the script. After copying, it checks that each Legal page document exists and references the Vite stylesheet bundle (`/assets/*.css`), and it fails the build if not. This takes over the "Verify Legal page documents" step in the PR check workflow, which is removed. The interface stays one function taking the build directory, and the CLI entry point still exits non-zero on failure. The check now runs locally and in CI from `npm run build`.

**Blocked by:** 02 (The `LegalPages` list drives the path lookup, page titles and footer links)

**Status:** ready-for-agent

- [ ] After the step runs on a temporary build directory, a document exists for every `LegalPages` slug, read from the real content file in the test (no hardcoded list); the stand-in document carries a stylesheet reference
- [ ] It fails when the built document is missing
- [ ] It fails when a document lacks the stylesheet reference
- [ ] The script no longer holds its own list of routes
- [ ] The PR check workflow no longer has the "Verify Legal page documents" step and names no Legal page
- [ ] `npm run build` passes on the real build and produces a document per Legal page
- [ ] `npm test` passes
