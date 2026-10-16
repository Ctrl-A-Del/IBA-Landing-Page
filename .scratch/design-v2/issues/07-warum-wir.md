# 07: Warum wir

**What to build:** The three service points move from hedged *sollen* language into plain German, without crossing into a performance promise the company cannot yet make.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] The section is anchored at `#warum` on the light background
- [x] The three points are present: getting on faster · using resources efficiently · relieving skilled workers
- [x] Each point is rewritten from the current hedged phrasing into direct German, with the *sollen* hedging genuinely resolved rather than simply deleted
- [x] The rewritten copy stays honest about the machine being in development — it does not read as an established, delivered product
- [x] No claim states or implies measured productivity, a performance ratio, a delivered project, a certification, or a count of anything
- [x] Icons come from the existing icon library at a consistent stroke width, with no emoji and no decorative gradient circles
- [x] The retired blue gradient is not used as a decorative fill here
- [x] The layout is single-column at ~375 px and three across at ~1280 px

## Comments

### Implementation notes (agent, 2026-10-15)

**Shape.** `src/prototype/sections/WarumWir.jsx` replaces the placeholder. It is one component:
`<Section id="warum" tone="light" aria-labelledby="warum-heading">` (ticket-02 primitive, consumed
as-is), holding a `Reveal`'d header (eyebrow, H2, intro) and a `Reveal as="ul"` with the three
points. Each `<li>` is topped by a 1 px rule (as in the Verfahren module list) and holds an icon,
the name as an `<h3>`, and the body as a `<p>`. No red-list file was edited, and no dependency was
added. The icons (`FastForward`, `Recycle`, `User`) are the same lucide glyphs the old Services
section mapped.

**How the hedge is resolved (C2).** The old copy said "soll(en)" because each sentence describes
what the machine is being built to do. Deleting the word would turn that into a promise. Instead,
each body states the design directly ("Wir entwickeln … für", "Das Konzept bündelt", "wird …
ausgelegt") and labels the aim openly as a goal ("Ziel ist …"). The intro states that the machine is
in development and calls the three points goals. Dropped on purpose: "höhere Tagesleistungen … als
klassische Einzelzyklen", which is a performance ratio. The section has no numerals at all.

**New copy (C8), flagged `C8-NEW` in the source:**

- Eyebrow: "Warum wir"
- Intro: "Unsere Maschine ist in Entwicklung. Diese drei Ziele geben ihr die Richtung vor."
- Schneller vorankommen: "Wir entwickeln die Maschine für einen durchgehenden Arbeitsgang: Sie
  fräst den Boden und fördert das Material im selben Zug ab, statt zwischen Graben, Schwenken und
  Abladen zu wechseln."
- Ressourcen effizient nutzen: "Das Konzept bündelt Fräsen, Aufnehmen und Fördern in einer
  Maschine. Ziel ist, unnötige Fahr- und Schwenkbewegungen und zusätzliche Maschineneinsätze zu
  vermeiden."
- Fachkräfte entlasten: "Die Maschine wird auf Fernsteuerung und ineinandergreifende
  Arbeitsschritte ausgelegt. Ziel ist, dass Fachkräfte seltener direkt im Gefahrenbereich stehen und
  dort arbeiten, wo ihr Können gebraucht wird."

The three point names and the H2 ("Neue Netze brauchen leistungsfähigere Bauprozesse.", which was
hardcoded in the legacy `services.jsx`) are verbatim.

**Icons.** Navy (`text-brand`), 28 px, `strokeWidth={1.75}` on all three, `aria-hidden`, with no
circle and no gradient behind them. lucide scales the stroke with the icon size (24 px viewBox), so
1.75 at 28 px renders ~2.0 px, close to the 20 px / 2.25 phone icons in the hero and nav
(2.25 × 20/24 ≈ 1.9 px). That is a visual match, not the same prop value.

**Layout.** One column, then three across from `lg` (1024 px). Between 640 and 1023 px it stays one
column, the same breakpoint the Verfahren module list uses for its widest row.

**Test seam.** As in tickets 03 and 05, there was no user to confirm seams with, so the precedent
was followed: one seam, the rendered `<WarumWir />`, observed through the DOM. No Tailwind class
string is asserted. The `getComputedStyle` pseudo-element shim from `Verfahren.test.jsx` is repeated
here, scoped to the file.

### Verification evidence

- **Tests.** `src/prototype/sections/WarumWir.test.jsx` has 5 tests:
  1. `#warum` exists and is exposed as a region named by its H2.
  2. The three points are listed in order, each with the verbatim name as its `<h3>` and a body.
  3. No "soll/sollen/sollte(n)" anywhere in the section, the section says "Entwicklung", and
     every body states its intent ("Ziel", "ausgelegt", "entwickeln", "geplant", …).
  4. No claim vocabulary (%, "Prozent", "x-mal so schnell", "Tagesleistung", "als
     klassische/herkömmliche/bisherige", "zertifi", "Referenz", "bewährt", "garantier", "im
     Einsatz", "realisiert", "abgeschlossen") and no digits at all.
  5. Each point has exactly one lucide SVG, `aria-hidden`, with one shared `stroke-width`, and the
     section has no emoji (`\p{Extended_Pictographic}`).

  Every slice was written red first. Slices 3 and 4 were red against the old hedged copy, which
  slice 2's minimal implementation had pasted in verbatim. Two mutations were run: putting "soll"
  back into one body turned test 3 red, and giving one icon `strokeWidth={2}` turned test 5 red.
  The full suite is 29/29 green, run with the `.claude/` worktree `--testMatch` workaround from
  ticket 03.
- **Build.** `npm run build` with `BUILD_PATH` in a scratch directory (the shared `build/` was left
  alone). It reports "Compiled with warnings", but both warnings are in `Verfahren.jsx` (see Raised
  item 1). `WarumWir.jsx` adds none.
- **Browser pass** (the build served on port 3002, headless Edge over CDP, both stopped
  afterwards), at 375×740 and 1280×800:
  - `#warum` background is `rgb(255,255,255)` and `aria-labelledby="warum-heading"`.
    `background-image` is `none` on the section and on every descendant, so there is no gradient.
    There is no horizontal overflow at either width.
  - At 375: one column. All three items sit at left 20 px, 335 px wide, stacked at y = 444/730/1015.
    h3 17.3 px, body 16 px in `rgb(75,90,103)`.
  - At 1280: three columns. Items share y = 581, 342 px each, at x = 80/462/844. h3 20 px.
  - Icons: 28 px, stroke-width 1.75, navy `rgb(10,31,46)`. Both `Reveal`s report
    `data-revealed="true"`.
  - Screenshots of the section at both widths were inspected.

### Raised for a human

1. **The ticket-05 review fix makes `npm run build` emit two `jsx-a11y/alt-text` warnings**
   (`Verfahren.jsx` lines 119 and 187). `alt` arrives through the `{...RENDER}` spread, which the
   lint rule can't see. Locally that is only a warning. On GitHub Actions, though, `CI=true`, and
   CRA treats warnings as errors, so the deploy build would likely fail. Not fixed here, because
   that file is outside this ticket. The likely fix is an explicit `alt={RENDER.alt}` on both
   `<img>`s.
2. **Copy for C8 review:** the eyebrow, intro and three bodies above. One judgement call to check:
   the H2 "Neue Netze brauchen leistungsfähigere Bauprozesse." is kept verbatim. It argues the
   need, not the machine's performance, so it was read as within C2.
3. **Eyebrow "Warum wir" next to a goals-framed body.** The section title promises reasons to choose
   the company, while the body honestly lists development goals. Say if the eyebrow should change
   (for example to "Ziele").

### Review findings (agent, 2026-10-15)

Branch `design-v2/07-review-fixes`. Only `WarumWir.jsx`, `WarumWir.test.jsx` and this file were
edited.

**Fixed:**

- **Point 1 copy ("Schneller vorankommen").** The old body opened with "Wir entwickeln …", but the
  clause after the colon ("Sie fräst den Boden und fördert das Material … ab") described a working
  machine in plain present tense, and "statt zwischen Graben, Schwenken und Abladen zu wechseln"
  was an implied comparative performance claim. New body, same "Ziel ist …" framing as points 2
  and 3, no comparison (still flagged `C8-NEW`):
  "Ziel ist ein durchgehender Arbeitsgang, in dem die Maschine den Boden fräst und das Material im
  selben Zug abfördert."
- **Intent test tightened.** The old `INTENT` regex passed if "entwickeln" appeared anywhere in a
  body, which let point 1 through. Now every body must contain "Ziel ist", and every clause (split
  at `.`, `:` and `;`; commas stay inside) must carry an intent marker ("Ziel", "ausgelegt",
  "entwickeln", "Konzept", …). A new test forbids comparatives in the point bodies ("statt",
  "anstatt", "als", "gegenüber", "Vergleich…", "schneller", "besser", "effizienter"). It is scoped to
  the bodies, so the verbatim point name "Schneller vorankommen" and the H2 are not hit. Both
  checks were red against the old point-1 copy and are green now.
- **Test helper.** `const utils = render(...)` became `const { container } = render(...)`, and the
  helper returns only `{ section }`.

**Deferred (for ticket 11 or a human):**

1. **`getComputedStyle` shim duplicated** across the Verfahren, Team and WarumWir tests. A candidate
   for `src/setupTests.js` (red-list / ticket-11 territory, so not moved here).
2. **The rule + icon + h3 + p list item is duplicated** across Einsatzbereiche, Verfahren and
   WarumWir. Extracting it would need a ticket-02-owned primitive in `src/prototype/ui/`.
3. **Stroke widths differ:** 1.75 (WarumWir, Einsatzbereiche) vs 2.25 (Hero, Nav, Verfahren). The
   rendered weights are close because the icon sizes differ, but §4.1 "consistent stroke width"
   needs an interpretation: the same prop value, or the same rendered weight?
4. **`ready-for-human` status semantics vs `docs/agents/triage-labels.md`.** This is repo-wide, not
   specific to this ticket.
5. **Human copy calls:** the eyebrow "Warum wir" sits above a goal-list body (alternative: "Unsere
   Ziele"), and the H2 "Neue Netze brauchen leistungsfähigere Bauprozesse." was kept under C2.
   Both need a human decision.

**Tests / build.** Full suite 39/39 green, run with the `.claude/` worktree `--testMatch`
workaround from ticket 03. `npm run build` (with `BUILD_PATH` in a scratch directory) reports
"Compiled with warnings". Both warnings are the known `jsx-a11y/alt-text` ones in `Verfahren.jsx`
(Raised item 1 above); WarumWir adds none.
