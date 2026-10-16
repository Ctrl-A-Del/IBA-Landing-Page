# 10: Footer

**What to build:** The bottom of the page closes with the brand and the legal links, on the alternate dark background.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** claimed

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
- **No contact details.** Kontakt (ticket 09) was still a stub when this was built, and C15 makes it
  the single home of the contact details. The footer repeats none, so the "match Kontakt exactly"
  box holds by construction; a test asserts the footer has no `tel:`/`mailto:` link. Ticket 11:
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
