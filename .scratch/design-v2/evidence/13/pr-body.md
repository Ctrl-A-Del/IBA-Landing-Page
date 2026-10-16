> [!WARNING]
> **Opening this PR has already deployed it.** `.github/workflows/deploy.yml` runs on `pull_request` to
> `master` as well as on `push` to `master`, and publishes `build/` to the live site at
> `ingenieurbuero-auner.com`. The redesign went live when this PR was opened, before any merge.

## Summary

Design v2: a full redesign of the landing page in an industrial-technical style. Navy surfaces, sentence-case
Raleway display type, orange CTAs with navy text, and a phone-first structure. The legal pages are untouched.
Decision log: `DESIGN_PLAN.md`.

```diff
 <App>
-  <Header>  <Features>  <About>  <Services>  <Team>  <Contact>  <Footer>
+  <Nav>                 sticky; transparent over the hero, solid on scroll; phone CTA + mobile call bar
+  <main>
+    <Hero>              #start            navy
+    <Verfahren>         #verfahren        light  render + "Größer ansehen" <dialog> lightbox + modules 01–04 as text
+    <Einsatzbereiche>   #einsatzbereiche  navy
+    <WarumWir>          #warum            light
+    <Team>              #team             navy   framed portrait cards
+    <Kontakt>           #kontakt          light  Marcus Auner, tel:, mailto: with subject, copy address
+  <Footer>                                navy   emblem, company name, © year, Impressum / Datenschutz
```

```diff
 src/
 ├── App.jsx                  # renders the v2 sections directly
 ├── data/data.json           # all copy, keyed by v2 section, no BOM
 ├── components/
+│   ├── sections/            # Nav, Hero, Verfahren, Einsatzbereiche, WarumWir, Team, Kontakt, Footer
+│   └── ui/                  # CTA, Emblem, PortraitCard, Reveal, Section, useReveal
 public/
 ├── index.html               # meta description, Open Graph / Twitter tags, broken favicon links removed
 └── img/                     # pruned to fraese.png, logo.jpg, marcus.png, klaus.png, jan.png
```

**Deleted components (9):** `src/components/header.jsx`, `features.jsx`, `about.jsx`, `services.jsx`,
`Team.jsx`, `contact.jsx`, `Footer.jsx`, `ui/Container.jsx`, `ui/SectionTitle.jsx`. (`ui/Section.jsx` is
rewritten, not deleted.)

**Pruned assets (32), all template leftovers that nothing referenced:**
- `public/img/about.jpg`, `bagger.png`, `Bild1.jpg`, `intro-bg.jpg`
- `public/img/portfolio/` (18 files: `01`–`09`, `-large.jpg` / `-small.jpg`)
- `public/img/team/` (4 files: `01`–`04.jpg`)
- `public/img/testimonials/` (6 files: `01`–`06.jpg`)

**Removed tokens:** `brand.alt`, `surface`, `link` and `accent` (only the deleted components used them).

**Unchanged:** `public/impressum.html`, `public/datenschutz.html`, `package.json`, `package-lock.json`,
`src/index.css`. No new dependencies, still CRA 5, React 17 and Tailwind v3.

## Evidence

Full-page production builds, reduced motion emulated so every reveal is visible
(`.scratch/design-v2/evidence/13/compare.js`):

| | 375 px | 1280 px |
| --- | --- | --- |
| **Before** (`master` @ `e5ffdd6`) | [before-375.png](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/before-375.png) | [before-1280.png](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/before-1280.png) |
| **After** (`design/v2`) | [after-375.png](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/after-375.png) | [after-1280.png](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/after-1280.png) |

<img src="https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/before-1280.png?raw=true" width="49%" alt="Before, 1280 px"> <img src="https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/evidence/13/shots/after-1280.png?raw=true" width="49%" alt="After, 1280 px">

**QA pass (tickets 11 and 11.1):** browser checks at 360/375/768/1280 cover no horizontal overflow,
13/13 tab stops with visible focus and no trap, reduced motion, every anchor landing clear of the nav,
the lightbox (Esc, backdrop click, focus return) and all images loading.
- Ticket 11 report: [`11-integration-qa-pass.md`](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/issues/11-integration-qa-pass.md), evidence in [`evidence/11/`](https://github.com/Ctrl-A-Del/IBA-Landing-Page/tree/design/v2/.scratch/design-v2/evidence/11)
- Ticket 11.1 report (fixes from the human review): [`11.1-human-review-fixes.md`](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/issues/11.1-human-review-fixes.md), evidence in [`evidence/11.1/`](https://github.com/Ctrl-A-Del/IBA-Landing-Page/tree/design/v2/.scratch/design-v2/evidence/11.1)
- Ticket 12 migration: [`12-post-approval-migration.md`](https://github.com/Ctrl-A-Del/IBA-Landing-Page/blob/design/v2/.scratch/design-v2/issues/12-post-approval-migration.md)

**Tests and build:**

```text
npm test            13 suites, 86 tests passed
CI=true npm run build   Compiled successfully (no warnings)
```

`src/App.copy.test.jsx` pins the rendered page to the approved prototype copy character for character.
An integration test pins `public/img` to the five images in use.

## Merge Danger

**Door:** two-way

The old page can be restored by reverting the merge, or with a PR or push of `master` @ `e5ffdd6`.
Deleted files stay in git history. There is no data or backend.

**Blast Radius:** sitewide

- The whole public landing page changes, and it changed at the moment this PR was opened, not at merge.
- **Closing this PR without merging does not roll the site back.** `gh-pages` keeps the v2 build until
  the next deploy from `master`.
- 32 image URLs under `/img/` (template leftovers) now return 404. The page never used them, but any
  outside link to them breaks.
- The links to Impressum and Datenschutz are unchanged, and so are the files.
