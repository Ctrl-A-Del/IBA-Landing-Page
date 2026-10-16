# 02: Theme foundation and shared primitives

**What to build:** The visual vocabulary every section ticket consumes — colour, type, motion, and the shared CTA, section and card primitives — demonstrated on its own so later tickets compose rather than invent. The showcase renders at three breakpoints, under keyboard-only use, and with reduced motion forced.

**Blocked by:** 01 (Scaffold — branch, prototype tree, and page head)

**Status:** ready-for-human

- [x] A signal orange `#f08a24` is available as a token, together with a darkened hover/active shade derived from it
- [x] The blue `#6372ff → #5ca9fb` gradient is no longer reachable as a CTA fill; it may survive for non-CTA decorative use only
- [x] A neutral ramp covers body text on both navy and light surfaces, so text colour comes from tokens rather than ad-hoc opacity values
- [x] Shadow and ring tokens exist for the framed light cards that sit over navy
- [x] A fluid display scale is defined for Raleway 700–900, roughly 2.5rem → 5rem at the top of the scale, in sentence case with tight tracking
- [x] A body scale is defined for Open Sans 300–800
- [x] A CTA button primitive renders solid orange with navy `#0a1f2e` text and a 2–4 px radius, is never a pill, and can never render white text on orange
- [x] The CTA button has visible hover and focus states, and its focus state is visible on both navy and light backgrounds
- [x] A section primitive provides the navy, light and alternate-dark backgrounds plus the generous vertical rhythm
- [x] A section primitive's anchors scroll clear of the sticky nav that ticket 03 adds
- [x] A framed light card primitive exists for portraits over navy — needed by both Team and Kontakt, which are built independently and must not depend on each other
- [x] A scroll-reveal hook wraps `IntersectionObserver` and is inert under `prefers-reduced-motion: reduce`: content is fully visible and nothing animates
- [x] A showcase renders every token and primitive at ~375 / ~768 / ~1280 px
- [x] The showcase is keyboard-navigable and correct with reduced motion forced
- [x] No animation library, router or new runtime dependency is added, and no external PostCSS config is introduced
- [x] Every utility class appears literally in the source — the content globs already cover the prototype tree, so no class name is assembled from strings

## Comments

### Implementation notes (agent, 2026-10-15)

**How this ticket was produced (honest version).** The first implementer agent wrote the whole
implementation and was cut off before it verified, recorded or committed anything; the next run was
started to finish verification and again returned nothing, so the coordinator completed the ticket
directly. The red→green proof, the build and compiled-CSS evidence, the browser pass, the
review-driven fixes below and this record all come from that final run.

**The tracker protocol was not followed at the start of this ticket.** `parallelisation.md` §4.1 says
to set `Status: claimed` and commit that *before* doing the work, and it never happened. It was
harmless here — one agent held the worktree, so nothing raced — but it is a lapse, not something to
hide.

**Shape.** Tokens live in `tailwind.config.js`; the anchor contract lives in `src/index.css`; the
primitives live in `src/prototype/ui/` (`CTA`, `Section`, `PortraitCard`, `Reveal`, `useReveal`).
Nothing imports the legacy `src/components/**` tree, which ticket 12 deletes.

**Decisions worth knowing:**

- `signal` is `#f08a24`, with `hover` `#d4730f` and `active` `#cd6e0e` derived at constant hue by
  dropping HSL lightness 54.1% → 44.5% → 42.9%. Navy on each is 6.72:1 / 5.01:1 / 4.67:1 — all AA.
- The CTA locks **both** the fill and the text colour with `!important` (and the hover/active
  variants too, or the locked base colour would outrank them). Neither `text-white` nor the retired
  `accent` gradient can be passed in by a caller. The cost is documented in the component: a second
  CTA *appearance* cannot be expressed by passing classes, so it needs a decision, not a class.
- The focus indicator is deliberately **not** a darkened orange — see raised item 2.
- `PortraitCard` owns the 3:4 crop, so Team (08) and Kontakt (09) cannot diverge. That removes the
  reconciliation `parallelisation.md` §3 predicted ticket 11 would have to do by hand.
- `spacing.nav` (5rem) is the single source for both the nav height ticket 03 must hit and the anchor
  scroll-margin: `src/index.css` derives `scroll-margin-top` from it with `theme()`. An earlier draft
  also applied a `scroll-mt-nav` utility and a `--iba-anchor-offset` custom property; both were
  removed after review, because the duplicated literal silently outranked the derived rule and made
  the "one number" claim untrue.
- `body` gained `break-words`. The browser pass found the showcase's own intro paragraph forcing a
  27 px horizontal scroll at 375 px on the unbreakable token `src/prototype/Prototype.jsx`. Headings
  already had `break-words`; body copy needed it too, and every wave-3 section inherits the fix.
- The showcase is wired in as **one line at the bottom of `src/prototype/Prototype.jsx`, after
  `<Footer />`**. It is a dev artefact, so it belongs neither between the landmarks
  (`nav → main → footer`) nor inside `<main>`, where it would perturb the §4 anchor order that ticket
  01 verified.

### Verification evidence

- **Tests** (`useReveal` is the only agreed seam): `CI=true npm test` → `Test Suites: 1 passed`,
  `Tests: 3 passed, 3 total`. The suite covers the reveal, the fail-open path when
  `IntersectionObserver` is absent, and the reduced-motion guard. Each test was proven able to fail by
  breaking the behaviour it claims to catch: (1) dropping the reduced-motion guard → 1 failed, 2
  passed, the reduced-motion test red; (2) removing `setIsRevealed(true)` from the fail-open branch →
  the no-observer test red; (3) removing `observer.observe(element)` → the reveal test red with
  `expect(observer.observed).toContain(...)`. The hook was then restored and the suite re-run green.
- **Build**: `npm run build` → `Compiled successfully`, no new warnings, `main.js` 49.92 kB and
  `main.css` 5 kB gzipped.
- **Compile-out proof** (raw match counts in `build/static/css/*.css`): `#f08a24` ×2, `#d4730f` ×2,
  `#cd6e0e` ×2, `clamp(` ×4 (display-xl/lg/md + body-lg), `scroll-margin-top` ×3 with
  `section[id]{scroll-margin-top:5rem}` — i.e. `theme("spacing.nav")` resolved and no unresolved
  `theme(` remains — `#020a12a6` ×1 (cssnano rewrites the card shadow's `rgba(2,10,18,0.65)` to
  8-digit hex, which is why grepping for the rgba literal finds nothing) and `!important` ×16 (the
  CTA's locked colour utilities).
- **Browser pass** (dev server on port 3102, killed afterwards): landmarks are `nav → main → footer`
  with the showcase after the footer, and `main`'s anchors are exactly `start, verfahren,
  einsatzbereiche, warum, team, kontakt` — ticket 01's evidence still holds. The CTA computes to
  `background-color: rgb(240,138,36)`, `color: rgb(10,31,46)`, `border-radius: 3px`; a section's
  `scroll-margin-top` is `80px`. At ~375 / ~768 / ~1280 px there is **no** horizontal overflow, and
  the top display step bottoms out at exactly 2.5rem at the smallest width. Tabbing through the
  showcase, all five focusable elements show an indicator with `:focus-visible` matched (CTAs: navy
  ring plus white outline; the in-page link on the light tone: navy outline). With reduced motion
  forced, all three `[data-revealed]` blocks are `"true"` from the first render with
  `transition-duration: 0.00001s`, `opacity: 1` and an identity transform; without the preference the
  same blocks reveal on scroll.

### Raised for a human

1. **§4.1 names `text-neutral-600` for light-surface body copy; this ticket ships `ink-600`
   `#4b5a67`.** The checklist requires a neutral ramp covering both surfaces, and `neutral-600` is
   Tailwind's flat grey (`#525252`), so the ramp is this ticket's requirement and the §4.1 line
   describes the palette being replaced. Raised rather than silently reconciled — if light-surface
   body copy must be exactly `#525252`, it is a one-line change in `tailwind.config.js`.
2. **§4.1's "hover/focus = a darkened shade of the same orange" is only half-implemented, on
   purpose.** The checklist separately requires the focus state to be visible on navy *and* light,
   and orange on white is only ~2.5:1. Focus is therefore a 2 px navy ring inside a 2 px white
   outline (on navy the white band carries it, 16.8:1; on light the navy band does, 18:1). Hover and
   active use the darkened orange as §4.1 asks. Confirm the two-tone ring is acceptable.
3. **The showcase must be deleted before the page ships.** It is one line plus one import in
   `src/prototype/Prototype.jsx`, and the code names ticket 11 as the owner. Say so if you would
   rather it went earlier.
4. **`DESIGN_PLAN.md` §1.6's portrait dimensions are wrong.** The three portraits are 339×453,
   385×513 and 481×642 px, not the declared 240×320. `PortraitCard` therefore carries no
   `width`/`height` attributes and reserves its box with the CSS aspect ratio. §1.6 was not edited
   here because it is your fact log, not this ticket's.
5. **`npm test` no longer fails with "No tests found"** — the pre-existing exit-1 that ticket 01
   recorded. That is a side effect of introducing the agreed test seam, not a new test strategy: the
   rest of the checklist is still verified by build output, compiled CSS and the browser.
