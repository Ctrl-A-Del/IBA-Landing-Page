# 06: Einsatzbereiche

**What to build:** The four application areas stop floating as white tiles on navy and become a deliberate navy section.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** claimed

- [x] The section is anchored at `#einsatzbereiche` on the navy background
- [x] All four areas appear with their existing headings and descriptions:
      Stromtrassen — Erdkabel und Energieübertragung ·
      Wasserstoff & Fernwärme — Neue Leitungsnetze der Energiewende ·
      Wasser & Abwasser — Großformatige Versorgungsgräben ·
      Weitere Infrastruktur — Gas-, Drainage- und industrielle Leitungstrassen
- [x] Cards are hard-edged rectangles with 1 px rules rather than rounded tiles with soft shadows
- [x] The layout is single-column at ~375 px, two columns at ~768 px and four at ~1280 px, without an awkward orphan in the last row
- [x] Body text on navy meets AA contrast
- [x] Any reveal animation is inert under `prefers-reduced-motion: reduce`
- [x] Umlauts, ß and ampersands render correctly throughout

## Comments

### Implementation notes (agent, 2026-10-15)

**Shape.** `src/prototype/sections/Einsatzbereiche.jsx` replaces the placeholder. It is one component:
`<Section id="einsatzbereiche" tone="navy">` (ticket-02 primitive, consumed as-is) holding a
`Reveal`-wrapped header (eyebrow + H2) and a `Reveal as="ul"` with the four areas. No red-list file was
edited, no token or primitive was added, and no dependency was added (`Zap`, `Flame`, `Droplets`,
`Waypoints` come from the existing `lucide-react`).

**Decisions worth knowing:**

- **Cards (§4.1, B2).** Each `<li>` is a rectangle drawn with a 1 px `border-mist-500` rule, no
  radius, no shadow, transparent on navy. The old white `rounded-xl shadow-md` tiles are gone.
- **Layout.** 1 / 2 / 4 columns (base / `sm` / `lg`), the same breakpoints as the Verfahren module
  list. Four items fill every layout exactly (4×1, 2×2, 1×4), so there is never an orphan. Cards in a
  row share one height (grid stretch).
- **Contrast** on `#0a1f2e`, from the ramp in `tailwind.config.js`: H2 and H3 `mist-100` 15.6:1,
  descriptions `mist-300` 9.7:1 (the Section's navy default), eyebrow `mist-400` 6.5:1. All pass AA
  for normal text. The rule is `mist-500` 4.1:1, above the 3:1 non-text minimum, and carries no text.
- **Icons.** Decorative (`aria-hidden`), `mist-200`, stroke 1.75. Orange stays reserved for primary
  CTAs (B3).
- **Long compound at 375 px.** At display size "Versorgungsnetzausbau" is wider than the 335 px
  column, and the base `break-words` split it as "…ausb / au". The H2 carries a soft hyphen
  (`{"\u00AD"}`, written as an escape) after "Versorgungs", so it breaks as "Versorgungs- /
  netzausbau" and is invisible otherwise.
- **Copy (C8).** The H2 ("Entwickelt für den Energie- und Versorgungsnetzausbau") and the four
  headings and descriptions are verbatim from `data.json` `About`. New strings, flagged `C8-NEW` in the
  source: the eyebrow "Einsatzbereiche" and the list's accessible name "Die vier Einsatzbereiche".

**Test seam.** Same as tickets 03–05, with no user to confirm seams with: the rendered
`<Einsatzbereiche />`, observed only through the DOM (anchor, headings, list roles, text,
`data-revealed`). No Tailwind class string is asserted. `@testing-library/dom` 6.16 ignores the
`level` option of `*ByRole`, so the tests filter headings by tag name.

### Verification evidence

- **Tests.** `src/prototype/sections/Einsatzbereiche.test.jsx` has 4 tests:
  1. The `#einsatzbereiche` anchor, labelled by its single H2 (soft hyphen stripped before comparing).
  2. The four areas in order, each one `<li>` with one H3 and a `<p>`, compared by exact
     `textContent` so `&`, `ß` and the umlauts must arrive as literal characters.
  3. Under `prefers-reduced-motion: reduce` (stubbed `matchMedia`, plus an `IntersectionObserver` that
     never fires): every reveal is `data-revealed="true"` on first render, the H2 and every `<li>` sit
     inside one, and no observer is constructed.
  4. No figures or claim wording in the copy (C2).

  Slices 1 and 2 were written red first. Tests 3 and 4 passed on arrival, because the behaviour comes
  from the shared `Reveal` and the verbatim copy; they stay as guards. Mutation: replacing the header
  `Reveal` with a plain `<div data-revealed="false">` turned test 3 red.

  Full suite 28/28 green, run with the `.claude/` worktree workaround from ticket 03:
  `CI=true npx react-scripts test --watchAll=false --testMatch "<abs worktree>/src/**/*.test.{js,jsx}"`.
- **Build.** `npm run build` with `BUILD_PATH=build-06` inside the worktree (deleted afterwards).
  "Compiled with warnings": the only two are `jsx-a11y/alt-text` in `Verfahren.jsx` (see below);
  nothing from this file.
- **Browser pass** (the build served on port 3006, headless Edge over CDP, both stopped afterwards):

  | Viewport | Rows × cols | Card width | Overflow-x |
  | --- | --- | --- | --- |
  | 375×740 | 4 × 1 | 335 | 0 |
  | 768×1024 | 2 × 2 | 352 | 0 |
  | 1024×768 | 1 × 4 | 225 | 0 |
  | 1280×800 | 1 × 4 | 262 | 0 |

  - `#einsatzbereiche` background `rgb(10, 31, 46)`. Card border `1px solid rgb(111, 128, 144)`,
    `border-radius: 0px`, `box-shadow: none` at every width.
  - Computed colours: H2 and H3 `rgb(244, 247, 249)`, description `rgb(185, 198, 208)` at 16 px,
    eyebrow `rgb(147, 163, 176)` at 13 px. H2 is 32 px at 375 and 56 px at 1280.
  - Rendered text read back from the page: "Stromtrassen / Erdkabel und Energieübertragung ||
    Wasserstoff & Fernwärme / Neue Leitungsnetze der Energiewende || Wasser & Abwasser / Großformatige
    Versorgungsgräben || Weitere Infrastruktur / Gas-, Drainage- und industrielle Leitungstrassen".
  - Reveal without reduced motion: both reveals `data-revealed="false"`, opacity 0, transition 0.7s
    before scrolling, `true` after. With reduced motion emulated: `true`, opacity 1, transition
    `1e-05s` before any scroll.
  - Screenshots of the section were inspected at 375, 768, 1280 and 1280 with reduced motion. The
    first 375 pass showed the H2 breaking as "Versorgungsnetzausb / au", which led to the soft hyphen
    above; the re-check shows "Versorgungs- / netzausbau". (The fixed nav appears as a band across the
    375 capture because it is a beyond-viewport screenshot; that is not a layout defect.)

### Raised for a human

1. **New copy for C8 review:** the eyebrow "Einsatzbereiche" and the list label "Die vier
   Einsatzbereiche". The H2 keeps the existing `data.json` `About.heading`.
2. **Icons are new.** The four lucide icons (Zap, Flame, Droplets, Waypoints) are a visual addition
   with no source in `data.json`; drop them if the section should be type-only.
3. **Pre-existing build warning, not from this ticket:** `Verfahren.jsx` lines 119 and 187 trigger
   `jsx-a11y/alt-text`, because the `alt` arrives through the `{...RENDER}` spread, which the lint
   rule can't see. The rendered `<img>`s do have alt text. Ticket 05's owner or ticket 11 may want an
   explicit `alt={RENDER.alt}` to silence it.
4. **The same long-compound break may affect other headings at 375 px.** It is visible here only
   because this H2 contains "Versorgungsnetzausbau"; ticket 11 may want to scan the other H1/H2s.
