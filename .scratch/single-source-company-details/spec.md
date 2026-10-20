Status: ready-for-agent
Type: enhancement

# One source for the Company details and the Legal page addresses

## Problem Statement

The company's facts are written out by hand in several places. The company name sits in the content
file and again in both Legal texts; the phone number and email address sit in the content file and
again, in a different form, in the Datenschutzerklärung; the postal address, representative and
register entry exist only inside the Impressum and Datenschutzerklärung markup. Changing the address
or a phone number means hunting through the code, and a missed copy leaves a wrong fact on a legally
required page with nothing to catch it.

The Legal page addresses have the same problem. Which paths are Legal pages is written in five places:
the app's path lookup, the post-build copy step, the footer links in the content file (with a
different trailing-slash form), the shell loop in the PR check workflow, and the page titles next to
the path lookup. Adding or renaming a Legal page means editing all of them; if one is missed, the
footer can link to a page that was never built and GitHub Pages answers 404.

## Solution

The content file (`data.json`) becomes the single source for every Company detail and for the list of
Legal pages. Every place that shows a Company detail, on the landing page and inside the Legal text,
reads it from there, in the one form the landing page already uses. The app's path lookup, the footer
links, the page titles and the post-build copy step all read the same Legal page list. The post-build
step also takes over the PR check's stylesheet verification, so the workflow no longer names the
pages. Changing an address, a number or a Legal page is one edit, and tests prove the change reaches
every place it appears.

The Legal text's wording is unchanged and still only the company changes it. ADR 0003 records that
the Company details inside it are filled in from data, and the glossary separates the two terms.

## User Stories

1. As the company owner, I want to change the postal address in one place, so that the Impressum and the Datenschutzerklärung both show the new address.
2. As the company owner, I want to change the phone number in one place, so that the nav, the mobile call bar, the hero, Kontakt and the Datenschutzerklärung all show the new number.
3. As the company owner, I want to change the email address in one place, so that Kontakt, its copy button, its mailto link and the Datenschutzerklärung all use the new address.
4. As the company owner, I want to change the company name in one place, so that the footer, the Impressum and the Datenschutzerklärung all show the new name.
5. As the company owner, I want to change the representative in one place, so that the Impressum's "Vertreten durch" is updated.
6. As the company owner, I want to change the register court or register number in one place, so that the Impressum's register entry is updated.
7. As the company owner, I want to change the website in one place, so that the Datenschutzerklärung names the right website.
8. As the company owner, I want every Company detail written in the same form wherever it appears, so that the site never shows two spellings of one fact.
9. As the company owner, I want the Legal text wording to stay exactly as supplied, so that only the Company details inside it change when the data changes.
10. As a visitor, I want the phone number in the Datenschutzerklärung written as `0176 618 77 599`, so that it reads the same as everywhere else on the site.
11. As a visitor, I want the email in the Datenschutzerklärung written in lower case, so that it matches the address in Kontakt.
12. As a visitor, I want every footer link to a Legal page to open that page with HTTP 200, so that a legally required page is never a 404.
13. As a visitor, I want `/impressum` and `/impressum/` (and likewise for every Legal page) to show the same page, so that either form of the address works.
14. As a visitor, I want each Legal page's browser tab title to stay as it is today, so that nothing visible changes beyond the Company details.
15. As a screen-reader user, I want the Impressum to keep its single, visually hidden h1, so that the page structure is unchanged.
16. As a maintainer, I want the list of Legal pages to live in one place, so that adding, renaming or removing one is a single edit to the content file plus its component.
17. As a maintainer, I want a test to fail when a listed Legal page has no component, so that a missing page is caught before deploy.
18. As a maintainer, I want the build to fail when a Legal page document is missing or lacks the stylesheet reference, so that the check runs locally and in CI from one command.
19. As a maintainer, I want the PR check workflow to stop naming Legal pages, so that it cannot drift from the content file.
20. As a maintainer, I want a test that changes one Company detail in a substituted content file and finds the change in Kontakt, the footer, the Impressum and the Datenschutzerklärung, so that the single source is proven, not assumed.
21. As a maintainer, I want the content-file tests to keep proving that every string in the file is approved and used, so that the new Company details do not become dead keys or unreviewed copy.
22. As a maintainer, I want the Legal page fixtures to keep guarding the wording, links and headings, so that a stray edit to the Legal text still fails.
23. As a future agent, I want the glossary and ADR 0003 to explain why the Legal text is partly data-driven, so that a later review does not "restore" the verbatim Company details.

## Implementation Decisions

- **Content file shape.** Two new top-level entries and one removal:
  - `Company`: `name`, `street`, `postalCode`, `city`, `website`, `representative`, `registerCourt`, `registerNumber`. This is who the company is.
  - `LegalPages`: a list of `{ slug, title, linkLabel }`, with an optional `heading` for a Legal text that has no h1 of its own (the Impressum). Slugs are bare (`impressum`); the leading and trailing slashes are derived wherever an address or a directory name is needed, so the slash convention exists once.
  - `Footer.company` moves to `Company.name`; `Footer.legalLinks` is removed (the footer reads `LegalPages`).
  - `Contact` is unchanged (phone, phone display, call verb, email, mail subject): it is how to reach the company. The Legal text reads phone and email from it.
- **One form per fact.** The Legal text shows each Company detail in the form the landing page shows it: the display phone number, the lower-case email, the website as stored. No Legal-text-only variants are stored.
- **Legal text components.** The Impressum and Datenschutzerklärung keep their wording verbatim and substitute only the Company details (name, street, postal code and city, representative, register court and number, phone, email, website) from the content file.
- **Path lookup.** The app remains the only module that resolves the current path to a Legal page, now by matching against the `LegalPages` slugs (trailing slash optional, as today). The mapping from slug to Legal page component stays in code, since components cannot live in JSON; the page title and optional hidden heading come from the list. The app still passes `onLanding` to the nav; the nav learns nothing about routes.
- **Footer.** Builds its Legal page links from `LegalPages` (`/<slug>/`, `linkLabel`) and its company name from `Company.name`.
- **Post-build step.** The copy step reads the slugs from the content file instead of its own list. After copying, it verifies each document references the Vite stylesheet bundle (`/assets/*.css`) and fails the build if not, taking over the PR check's shell loop. Its interface stays a single function taking the build directory; the CLI entry point and the non-zero exit on failure are unchanged.
- **CI.** The "Verify Legal page documents" step is removed from the PR check workflow; `npm run build` now performs that verification.
- **Docs.** ADR 0003 records the decision; ADR 0002's heading is corrected and points to `LegalPages`; the glossary now distinguishes Legal text from Company details. These are already written on this branch.

## Testing Decisions

- **A good test** observes the page a visitor gets (the DOM of the mounted app at a given path, the document title) or the files the build leaves behind. It never reaches into module internals or asserts on the shape of an intermediate list.
- **Seam 1: the mounted app.** `<App />` rendered at a path, with the content file either real or substituted through the module mock, observed through the DOM. Prior art: `LegalPages.test.jsx` (path-driven rendering and the fixture comparison) and `App.copy.test.jsx` (substituting a marked content file with `vi.doMock`).
  - Every `LegalPages` slug, with and without the trailing slash, renders its Legal page with the listed title.
  - Each footer link to a Legal page points at a listed slug, so no link targets an unlisted page.
  - The Legal pages still match their fixtures in wording, links and headings; the fixtures are updated only in the Company-detail lines that change form (phone, email, website).
  - The single-source test: substitute a content file with one changed Company detail per field and assert the new value appears in Kontakt, the footer, the Impressum and the Datenschutzerklärung wherever that field is shown, and the old value appears nowhere.
  - The content-file tests (approved and used) are widened to cover the Legal pages: the "approved" check accepts strings present in the Legal page fixtures and today's two Legal page titles (written out in the test as an independent golden), and the "used" check renders the landing page and every Legal page and includes the document title, so the new `Company` and `LegalPages` strings count as used.
- **Seam 2: the post-build step.** The copy function run on a temporary build directory, observed through the files it leaves. Prior art: `copyRouteDocuments.test.js`.
  - A document exists for every `LegalPages` slug, read from the real content file rather than a hardcoded list; the stand-in document carries a stylesheet reference.
  - It fails when the built document is missing, and when a document lacks the stylesheet reference.
- No new seams are introduced. The existing per-section tests keep passing unchanged except where they hardcode the footer's company name or legal links.

## Out of Scope

- The static HTML shell's meta tags (town, domain, author) and `public/CNAME`. They are read before the app runs and would need a build-time template; a possible follow-up.
- The names in the Team and Kontakt sections. They are copy about people, not Company details, and stay separate even where they name the same person as the representative.
- Any change to the Legal text wording.
- Pre-rendering the Legal pages (ADR 0002 consequences still apply).
- The other architecture-review candidates (clipboard copy, surface module, content module).

## Further Notes

- Origin: architecture review, candidate 1 ("One Legal page routes module"), widened during the grilling session to all Company details.
- Decisions: ADR 0003 (Company details come from the content file; one form per fact), ADR 0002 (clean addresses by copying the built document, now driven by `LegalPages`).
- The approved-copy golden (`prototype-copy.json`) is not regenerated; the Legal page fixtures become the approval source for the new strings.
