# 12: Post-approval migration

**What to build:** Once the reviewer approves the prototype, the approved design becomes the single source of truth: the copy lands in the content data, the superseded components are deleted, and the template's dead assets are pruned.

**Blocked by:** 11.1 (Human review fixes) and explicit user approval

**Status:** claimed

- [x] The approved page no longer depends on the temporary prototype pointer — the app entry renders the real sections directly
- [x] All approved copy lives in the content data, including the heading strings currently hardcoded inside the services, Team and contact components
- [x] The content file's byte-order mark is removed or handled deliberately, so nothing downstream trips over it
- [x] The seven superseded components are deleted: header, features, about, services, Team, contact and Footer
- [x] No import, reference or now-dead class remains pointing at the deleted components
- [x] Shared primitives used only by the deleted components are removed; ones still in use are kept
- [x] Images are pruned only after confirming the new design does not reference them — the template leftovers (the portfolio, team and testimonials folders, plus the unused single images) go, and everything the new page uses stays
- [x] The favicon and social-preview assets referenced by the page head still exist after pruning
- [x] A production build succeeds after the deletions, with no unresolved imports
- [x] The German copy in the content data is character-identical to the approved prototype copy
- [x] The technical envelope is intact: no router, no new heavy dependency, no external PostCSS config, self-hosted subsets only, Tailwind v3, React 17
- [x] `package-lock.json` stays in sync with `package.json`, and no dependency was added or upgraded
- [x] The legal pages are still untouched
- [x] The `brand.alt` colour token and the shared Section primitive's `alt` tone are removed, since nothing in v2 uses them after ticket 11.1 (DESIGN_PLAN C12, R6)

## Comments

### Approval gate (orchestrator, 2026-10-16)

The user explicitly approved the prototype on 2026-10-16. That satisfies this ticket's "explicit
user approval" blocker; 11.1 was already resolved.

### Implementation evidence (agent, 2026-10-16)

Worktree branch, based on `design/v2` @ `628e628`. Nothing pushed; no PR.

- **Golden copy captured first.** Commit `84ce708` rendered the untouched prototype and saved every
  text block, `alt`/`aria-label`/`href` value and the two copy-status messages to
  `src/__fixtures__/prototype-copy.json`, using `src/__fixtures__/captureCopy.js`. This happened
  before any file was moved or deleted. The one-off capture test was then deleted.
- **`src/App.copy.test.jsx`** checks four things: the rendered App equals that golden fixture
  character for character (including the U+2013 dash, the U+00AD soft hyphen and „“/⌘); every
  string in `data.json` is in the golden copy (only image paths are exempt, because `src` is not
  copy); with every data string wrapped in markers, no text block, alt, aria-label or status
  message on the page is unmarked, so nothing is hardcoded and no data key is dead; and
  `data.json` starts without `EF BB BF`. (It already had no BOM on `design/v2`; the integration
  test's BOM-stripping workaround is gone.)
- **Structure.** `src/App.jsx` renders the eight sections directly. `src/prototype/` is gone:
  sections live in `src/components/sections/` and primitives in `src/components/ui/`. The seven
  legacy components, `AppLegacy.jsx`, `Showcase.jsx` and the legacy-only `Container`, `Section` and
  `SectionTitle` primitives are deleted. `data.json` is keyed by v2 section. Decorative icons
  stay in code, matched to the data by position.
- **Tokens.** `brand.alt` and Section's `alt` tone are removed. `surface`, `link` and `accent` are
  removed too, because only the deleted components used them. The built CSS contains none of
  `#14171a`, `#6372ff`, `#608dfd` or `#f6f6f6`.
- **Images.** Every path in `public/img` was grepped in `src/` and `public/index.html` first. Then
  `about.jpg`, `bagger.png`, `Bild1.jpg`, `intro-bg.jpg`, `portfolio/` (18), `team/` (4) and
  `testimonials/` (6) were deleted. A new integration test pins `public/img` to `fraese.png`,
  `jan.png`, `klaus.png`, `logo.jpg` and `marcus.png`, and checks that every image the head
  references (og:image, twitter:image) exists. The head has no favicon links (ticket 01). The legal
  pages reference no images.
- **Envelope.** `git diff master` is empty for `package.json`, `package-lock.json`,
  `public/impressum.html` and `public/datenschutz.html`. `npm ci` is clean. There is no
  `postcss.config.*`, no router and no font CDN, and `src/index.css` is untouched.
- **Checks.** All 11 suites and 82 tests pass. `CI=true npm run build` reports "Compiled
  successfully" (no warnings), and `build/img` holds exactly the five images.
- **Worktree note.** Under `.claude/worktrees/…`, CRA's generated `testMatch` turns `\.claude` into
  an escaped dot and finds no tests. There, tests were run with an explicit forward-slash
  `--testMatch "<abs path>/src/**/*.test.{js,jsx}"`. A normal checkout is not affected.
