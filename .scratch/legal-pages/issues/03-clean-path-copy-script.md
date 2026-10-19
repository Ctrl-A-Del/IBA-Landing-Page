# 03: Clean-path copy script and one build command

**What to build:** `npm run build` produces the complete site: the CRA build followed by a small Node script that copies the built landing page document to a directory index per Legal page, so GitHub Pages serves a real file at `/impressum/` and `/datenschutz/` that boots the same bundle. The script exits non-zero if the source document is missing, failing the build. CRA `homepage` is absolute, so no asset rewriting is needed. No new dependency.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Test runs the script against a temporary directory with a stand-in built document and asserts both route documents exist with identical content
- [ ] Test asserts a missing source document makes the script fail
- [ ] `npm run build` runs both steps and leaves both route documents in `build/`
- [ ] No new runtime or build dependency
