Status: ready-for-agent
Type: enhancement

# Legal pages in the site theme

## Problem Statement

The Impressum and the Datenschutzerklärung are bare HTML fragments with no document structure, no stylesheet,
no viewport meta and no navigation. A visitor who follows the footer link leaves the site's look entirely: system
fonts, no brand, no way back except the browser's back button, and unreadable line lengths on desktop. The pages
also render in browser quirks mode. The company wants both Legal pages to share the landing page's theme.

The repository currently forbids this: the design plan declares both files out of scope and untouchable, and a
test pins each file to a SHA-256 hash. The Legal text must still not change as part of this work.

## Solution

Both Legal pages become real React components that render inside the same app as the landing page, using the real
Nav and Footer, the same tokens, fonts and Emblem. They are reachable at `/impressum/` and `/datenschutz/` with
HTTP status 200 on GitHub Pages. The Legal text is carried over word for word, and a test guards it.

Clean addresses come from a post-build step that copies the built landing page document to one directory per Legal
page. GitHub Pages then serves a real file at each address, the same bundle boots, and the app picks the page from
the path. The deploy workflow is changed so that this step actually runs on deploy.

## User Stories

1. As a visitor, I want the Impressum to look like the rest of the site, so that I trust it is the same company.
2. As a visitor, I want the Datenschutzerklärung to look like the rest of the site, so that it is easy to read.
3. As a visitor on a phone, I want the Legal pages to fit my screen without sideways scrolling, so that I can read
   them where I probably opened the site.
4. As a visitor on a desktop, I want the Legal text in a readable-width column, so that lines are not
   hundreds of characters long.
5. As a visitor, I want the same header on the Legal pages as on the landing page, so that I always know where I am
   and can get back.
6. As a visitor, I want the footer links on the Legal pages, so that I can move from the Impressum to the
   Datenschutzerklärung and back.
7. As a visitor, I want the navigation links on a Legal page to take me to the matching section of the landing
   page, so that they are not dead links.
8. As a visitor, I want the phone call bar on mobile Legal pages too, so that I can still call from anywhere.
9. As a visitor, I want the browser tab to show the page's own title (for example "Impressum – Ingenieurbüro
   Auner"), so that I can tell tabs and bookmarks apart.
10. As a visitor, I want a Legal page to open scrolled to the top, so that I do not land mid-document after
    following the footer link from the bottom of the landing page.
11. As a visitor using a keyboard, I want focus styles and heading order on the Legal pages to match the landing
    page, so that I can navigate them.
12. As a visitor using a screen reader, I want each Legal page to have one top-level heading and the original
    heading levels below it, so that the document outline matches the Legal text.
13. As a visitor, I want to type `/impressum` or `/datenschutz` into the address bar and arrive at the page, so
    that the address is memorable.
14. As a visitor, I want to reload a Legal page and get the same page back, so that the address is stable and
    shareable.
15. As a visitor, I want an unknown address to behave as it does today, so that nothing else about the site changes.
16. As the company owner, I want the Legal text to be exactly what the company supplied, so that I carry no legal
    risk from a design change.
17. As the company owner, I want any accidental wording change to fail a test, so that nobody can edit the Legal text
    unnoticed.
18. As the company owner, I want links inside the Legal text (generator credits, privacy authors, GitHub) to keep
    working, so that attributions required by the text generators stay intact.
19. As the company owner, I want the Impressum to stay reachable from every page of the site, so that it meets
    the "easily recognisable and directly reachable" requirement.
20. As the company owner, I want the corrected address line ("41366 Schwalmtal") to be what the Impressum shows, so
    that the correction I already made is kept.
21. As the company owner, I want the Legal pages served with HTTP status 200, so that search engines and monitors
    treat them as real pages.
22. As the company owner, I want the old `.html` addresses to be gone, so that there is one address per page.
23. As a maintainer, I want one command (`npm run build`) to produce the complete site, so that CI and deploy
    cannot differ.
24. As a maintainer, I want the deploy to fail loudly if the Legal page documents are missing from the build, so that
    an unstyled or missing Legal page can never ship quietly.
25. As a maintainer, I want pull requests to run the same check, so that a broken copy step is caught before merge.
26. As a maintainer, I want the deploy workflow to depend only on GitHub's own actions and plain `git`, so that no
    unpinned third-party action builds the production site.
27. As a maintainer, I want the design plan and glossary updated, so that the next agent does not treat the Legal
    pages as untouchable.
28. As a maintainer, I want an ADR recording why clean paths come from a copy step, so that nobody re-litigates hash
    routes, a 404 fallback, pre-rendering or a Vite migration without context.
29. As a maintainer, I want the dev server (`npm start`) to serve the Legal pages at the same addresses, so that I
    can iterate on them locally.
30. As a maintainer, I want no new runtime or build dependency, so that the technical envelope in the design plan
    stays intact.

## Implementation Decisions

- **Vocabulary.** Use the glossary terms **Legal page** and **Legal text**. The Legal text is never edited as part
  of design work.
- **Components.** The Impressum and the Datenschutzerklärung are two React components, each a faithful transcription
  of the existing HTML into JSX, inside one shared Legal page layout (readable-width column, theme typography).
  Prose styling is a small set of descendant rules under one wrapper class in the global stylesheet, using the
  existing tokens. Do not add the Tailwind typography plugin or any other dependency.
- **Chrome.** Legal pages render the existing Nav and Footer unchanged, inside the same app shell as the landing
  page, so the mobile call bar and focus styles come along. The Nav's section links must resolve to the landing
  page's sections when shown on a Legal page (a same-page `#anchor` would be a dead link there). The Nav's
  scroll-state behaviour must work on a page with no hero.
- **Routing.** The app chooses between the landing page and a Legal page from the current path. No router library.
  Matching tolerates the trailing slash. Any other path renders the landing page as today. Navigation between pages
  is a normal full page load (plain anchors).
- **Page head.** `document.title` is set per Legal page (`Impressum – Ingenieurbüro Auner`, and the Datenschutz
  equivalent) and restored on the landing page. A Legal page opens scrolled to the top.
- **Footer links.** The footer's legal links and the data they come from point to `/impressum/` and
  `/datenschutz/`. Respect the existing `PUBLIC_URL` handling used for these links.
- **Clean paths.** A small Node script runs after the CRA build. It copies the built landing page document to a
  directory index per Legal page, so the bundle boots at `/impressum/` and `/datenschutz/`. It fails the build with
  a non-zero exit if the source document is missing. The CRA `homepage` is the absolute site origin, so asset URLs in
  the copied documents are already absolute and need no rewriting.
- **Build command.** `npm run build` runs the CRA build and then the copy script, so CI, PR checks and deploy use
  one command.
- **Old files removed.** The two raw HTML files are removed from the static assets. There are no redirect stubs
  (decided). The old `.html` addresses will return 404 on the live site; this is accepted.
- **Deploy workflow.** Replace the third-party deploy action with explicit steps that do what it did, minus its
  redundant install: check out, set up Node 20 with npm cache, `npm ci`, `npm run build`, then commit the build
  directory and force-push it to the `gh-pages` branch using the built-in token. This is the same branch and
  Pages configuration as today. Only first-party GitHub actions and plain `git` are used.
- **PR check.** The check workflow gains a step that fails if the built Legal page documents are missing or do not
  reference the stylesheet bundle.
- **Text source of truth.** The Legal text as it is in the working tree when implementation starts is the reference,
  including the already-corrected address line. Verbatim copies move into test fixtures. The Legal text must not be
  reworded, reformatted into different sentences, de-duplicated or "fixed" during transcription. That includes the
  odd `<p><h2>` nesting in the Datenschutzerklärung: reproduce its heading levels and order, even though browsers
  repair that markup.
- **Design plan.** Amend decision A1 and hard constraints §2.6 and §2.10 so that the Legal pages are in scope, the
  text remains untouchable, and the build command is now the CRA build plus the copy script. Fix the §1.8 note about
  the address typo (it was corrected by the owner).
- **ADR.** Write one ADR recording the clean-path decision: copy of the built landing page document per route.
  Alternatives rejected: hash routes, a 404 fallback (wrong HTTP status), `react-snap` (unmaintained, 2018
  Chromium), a custom server-render script, and moving to Vite. Mention Vite as a possible future migration that is
  out of scope here.
- **Branch.** Work on a new branch from `master` named `design/legal-pages`. Do not merge or open a PR to `master`
  without the owner's explicit approval, because merging deploys the live site.

## Testing Decisions

- **What a good test is here.** Observe what a visitor gets: the DOM of the mounted app at a given path, and the
  files the build leaves behind. Do not assert on class names, component names or the routing mechanism.
- **Seam 1 (primary, existing): the mounted app.** Render the whole app with the browser location set to each
  path, as the existing page integration tests do for the landing page. Assert on:
  - the Legal text: for each page, the visible text, link targets and heading levels equal those of the verbatim
    fixture, with whitespace normalised and nothing else normalised;
  - chrome: the nav and footer landmarks and the mobile call bar are present; footer links point at the new
    addresses; nav section links lead to the landing page's sections;
  - head: the document title per page; the landing page is unchanged at `/`;
  - unknown paths still render the landing page.
- **Seam 2 (one new, small): the build output.** One test runs the copy script against a temporary directory
  holding a stand-in built document and asserts the two route documents exist with identical content and that a
  missing source document fails. The same condition is enforced for the real build in the PR check workflow.
  This is the only new seam; everything else reuses seam 1.
- **Replaced test.** The existing test that pins the raw files to SHA-256 hashes is replaced by the fixture-based
  text comparison. The footer link assertions in the existing tests move to the new addresses. The tests for
  favicon and head must keep passing.
- **Prior art.** The page integration test (whole-app DOM, banned-copy audits, legal-page and head checks), the
  footer test (link list and hrefs), and the nav test.
- **Out of the automated tests.** Layout, focus order, scroll landing and the visual result are verified in a real
  browser against a production build served locally, with the evidence recorded in the ticket. Include a check that
  `/impressum/` and `/datenschutz/` answer in the production build and that fonts load.

## Out of Scope

- Any change to the Legal text, including legal review, updating the generator credits, or adding sections.
- Pre-rendering or server-side rendering of the Legal pages (the pages are empty until JavaScript runs).
- Redirect stubs or any other support for the old `.html` addresses.
- Migrating from Create React App to Vite, Astro, Next.js or any other toolchain (a possible future idea).
- Adding a router library, the Tailwind typography plugin or any other dependency.
- Cookie banners, consent management, or changes to the data processors named in the Datenschutzerklärung.
- Changes to the landing page's content or design beyond what is needed to host the Legal pages (Nav anchor
  resolution, footer addresses).
- Merging to `master` or deploying. That needs the owner's explicit approval.

## Further Notes

- The owner has already corrected the address line in the Impressum in the working tree (an uncommitted change
  when this spec was written). The first step of the implementation is to check that this change is committed or
  carried onto the new branch, then take the fixtures from it.
- Deploy caveat: the live deploy only changes when this lands on `master`, and the old third-party action did not
  run npm scripts, which is why the workflow must change in the same PR as the copy script.
- `npm start` needs no extra work: the dev server already falls back to the landing page document for unknown
  paths, so the app's own routing serves the Legal pages in development.
- The seams above are proposed, not yet confirmed with the owner: the whole mounted app (existing) and the build
  copy script (new, small).
