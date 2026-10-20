# 02: The `LegalPages` list drives the path lookup, page titles and footer links

**What to build:** The content file gets a `LegalPages` list of `{ slug, title, linkLabel }`, with an optional `heading` for a Legal text that has no h1 of its own (the Impressum). Slugs are bare (`impressum`); slashes are added wherever an address is built. The app resolves the current path by matching it against these slugs, with the trailing slash optional as it is today, and takes the tab title and hidden heading from the list. The mapping from slug to Legal page component stays in code. The footer builds its Legal page links (`/<slug>/`, `linkLabel`) from the list, and `Footer.legalLinks` is removed. The app still passes only `onLanding` to the nav. Nothing visible changes.

**Blocked by:** 01 (Widen the content-file tests to cover the Legal pages)

**Status:** ready-for-agent

- [ ] Every `LegalPages` slug, with and without the trailing slash, renders its Legal page with the listed document title
- [ ] The Impressum keeps its single, visually hidden h1; the Datenschutzerklärung still has no added heading
- [ ] Every footer link to a Legal page points at a listed slug (`/<slug>/`) with its `linkLabel`
- [ ] A test fails when a listed slug has no Legal page component
- [ ] Any other path still renders the landing page
- [ ] `Footer.legalLinks` is gone from the content file; the content-file tests (approved and used) pass
- [ ] The Legal page fixture comparison passes unchanged
- [ ] `npm test` and `npm run build` pass
