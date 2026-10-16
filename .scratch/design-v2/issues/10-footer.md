# 10: Footer

**What to build:** The bottom of the page closes with the brand and the legal links, on the alternate dark background.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [ ] The footer sits on the alternate dark background and is visually distinguishable from the navy Kontakt section above it
- [x] Links to the Impressum and Datenschutz pages resolve, and both pages load
- [x] The full framed logo plate appears here as the brand element, since the nav carries only a crop of the emblem
- [ ] The logo plate is not stretched and retains its aspect ratio
- [x] Contact details, if repeated here, match the Kontakt section exactly
- [ ] The footer is not obscured by the fixed mobile call bar at small widths
- [x] The legal pages themselves are not modified

## Comments

### Implementation (agent, 2026-10-16)

Branch `design-v2/10-footer`. Only `Footer.jsx`, `Footer.test.jsx` and this file were edited.

**Built:**

- **`<footer>` landmark on `brand.alt`.** Not `<Section tone="alt">`: that primitive renders a
  `<section>` with the content-section rhythm, and the shell contract requires a `<footer>`. The
  footer reuses the primitive's `alt` tone classes (`bg-brand-alt text-mist-300`) and the page gutter
  verbatim, with its own lighter `py-12 sm:py-16`. A hairline top rule (`border-mist-500/40`, the
  nav's rule) separates it from navy Kontakt, because `#14171a` vs `#0a1f2e` alone is a quiet step.
- **Full logo plate (B6).** `logo.jpg` shown whole at `w-28 sm:w-32 h-auto`, with intrinsic
  `width="540" height="935"` so the ratio is reserved before load and scaling stays proportional.
  `alt="Ingenieurbüro-Auner GmbH"` (the plate carries the wordmark). Lazy-loaded.
- **Legal links.** `${PUBLIC_URL}/impressum.html` and `/datenschutz.html`, the same targets as the
  legacy `Footer.jsx`. The test resolves each href against `public/` and fails if the file is not
  shipped. `public/impressum.html` and `public/datenschutz.html` are untouched (`git diff` empty).
- **No contact details.** The footer repeats none of Kontakt's phone/email, so it cannot drift from
  Kontakt and the "match Kontakt exactly" box holds by construction; a test asserts the footer has
  no `tel:`/`mailto:` link. Ticket 11:
  if the page later wants contact details in the footer, they must be shared with Kontakt, not
  retyped.
- Text: links `mist-300`, copyright line `mist-400` (both AA on `#14171a`, which is darker than
  navy). White focus outline, same as the nav.

**Deferred to ticket 11's browser pass (no dev server was run here):**

- "Visually distinguishable from navy Kontakt", "plate not stretched" and "not obscured by the
  mobile call bar" need a real browser. The first box is left unticked for that reason too. The
  call-bar clearance relies on ticket 03's `Nav`, which reserves the bar's height as `<body>`
  bottom padding below `md`; verify the footer's last line clears the bar at ~375 px.
- `03` (nav emblem crop) and this plate both use `logo.jpg`; confirm they read as the same brand.

**Tests.** `Footer.test.jsx`, 5 tests at the rendered-component seam (landmark, both legal links
resolving to shipped files, plate with intrinsic ratio, no repeated contact links). Full suite green
(44/44) with the `.claude/` worktree `--testMatch` workaround. `BUILD_PATH=build-10` build clean.

### Review follow-up (agent, 2026-10-16)

Branch `design-v2/10-review-fixes`, based on `design/v2` after ticket 09 Kontakt merged. Only
`Footer.jsx`, `Footer.test.jsx` and this file were edited.

**Fixed:**

- **Unrequested copyright line removed.** `© Ingenieurbüro-Auner GmbH` was new copy; the ticket and
  DESIGN_PLAN §4 row 8 ask only for the legal links and the logo plate. New test (red first): the
  footer's text content is exactly the two legal link labels and contains no `©`.
- **Wrong citation.** The header comment and the implementation note cited C15 as making Kontakt the
  single home of the contact details; C15 says no such thing (it is about Marcus Auner and his
  portrait). Both now give the actual reason: the footer repeats no contact details, so it cannot
  drift from Kontakt, and a test guards it.
- **Stale context.** The "Kontakt was still a stub" wording is gone; `Kontakt.jsx` now exists. The
  no-`tel:`/`mailto:` test still passes against the merged branch.
- **Focus constant naming.** `FOCUS_ON_DARK` renamed to `FOCUS_ON_NAVY` with the "same recipe as
  Nav's" comment, matching `Kontakt.jsx`. Value unchanged; still a local constant.

**Escalated / deferred to ticket 11 or the user:**

- (a) **Footer vs Kontakt contrast.** Footer `bg-brand-alt` `#14171a` against Kontakt navy
  `#0a1f2e` is ≈1.07:1 luminance contrast, so the `border-t` hairline does most of the separating.
  That conflicts with frozen C12's "structure without borders". Needs a user decision (different
  footer tone, accept the hairline, or amend C12). Hairline left in place.
- (b) **Section primitive has no `as`/element prop**, so the footer duplicates `TONES.alt` and the
  container gutter instead of reusing `<Section>`. The ticket 02 owner should add one; the footer's
  `<footer>` approach is unchanged until then.
- (c) **Duplication for a shared helper in ticket 11:** this is the third copy of the white
  focus-outline constant (Nav, Kontakt, Footer) and the fourth copy of the jsdom `getComputedStyle`
  pseudo-element shim in tests.
- (d) **`Prototype.jsx` still renders `<Showcase />` after `<Footer />`**, so the footer is not
  yet the last thing on the page.

**Tests.** Footer: 6 tests (was 5). Full suite green (55/55) with the `.claude/` worktree
`--testMatch` workaround.
