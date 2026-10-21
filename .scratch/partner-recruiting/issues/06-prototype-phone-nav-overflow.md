Status: resolved
Type: prototype

# 06: Prototype the phone nav with five links

**What to build:** A throwaway prototype that answers one question: how should the nav behave below `md` now that "Partner" makes five links? Measured in ticket 01 (see its Comments): the link row has 272 px at 360 and 287 px at 375 but needs 381 px, so "Partner" is cut and "Kontakt" is off screen. Four links already overflow by 54 px at 360 today. The prototype lives apart from the real Nav and is switched in with one clearly marked line, removable in one step. It adds no real nav link, content entry or section.

**Blocked by:** none.

Produce a few distinct options, switchable while viewing, e.g.: (a) as is, sideways scroll; (b) scroll with a visible cue such as an edge fade; (c) fewer or shorter labels on phones; (d) a second line or a different arrangement of the link row, keeping the orange call button as the one primary action. Check each at 360, 375, 390 and 768 px with measured widths, and keyboard focus reachability of every link.

- [ ] Options use existing Tailwind tokens and primitives; the call button stays the only orange (B3)
- [ ] Every link is reachable by touch and keyboard at 360 px in each option
- [ ] Prototype is removable in one step and touches no real Nav code
- [ ] A verdict note template is left under `## Comments` for the human to choose
- [ ] `npm test` and `npm run build` green with the prototype switched out

**Not in this ticket:** adding the real link (ticket 04) or building the chosen option.

## Comments

### Prototype findings (agent, 2026-10-21)

Status is unchanged (`ready-for-agent`). No option is picked here; a human chooses.

**View it.** Branch `ticket/06-nav-prototype`. Run `npm start`, open `/?nav=a` to `/?nav=d` in a phone-sized window (devtools device mode at 360 to 390 px). Switch with the small black bar above the call bar, or the `,` (previous) and `.` (next) keys. Dev only; production builds do nothing. The Unternehmen prototype (`?variant`, arrow keys) is still switched in on the base, so its bar shows up too; ignore it.

**Isolation.** `src/prototype/NavPrototype.js` holds everything. One marked side-effect import in `src/App.jsx` (`// PROTOTYPE: remove this line (phone nav, ticket 06)`) switches it in. It edits the rendered nav DOM (clones a fifth "Partner" `<li>` after "Unternehmen", then restyles the row per option). The real Nav, `data.json`, sections and tests are untouched. To remove: delete that import line and the file. The orange call button is not touched and stays the only orange.

**Options** (c and d only change anything below `md`, 768 px; from `md` up every option is the real row):

| Key | What it does |
| --- | --- |
| a | As is: five links, row scrolls sideways, no cue |
| b | Same row, right edge fades out (mask) until scrolled to the end |
| c | Shorter phone labels: "Einsatzbereiche" becomes "Einsatz", "Unternehmen" becomes "Firma" (proposal wording only) |
| d | Two lines: nav grows, links wrap under the emblem (3 + 2), no scroll |

**Measured** (headless Edge 155, real Nav plus the cloned fifth link). Link widths on phones: Verfahren 61.8, Einsatzbereiche 97.1, Unternehmen 86.8, Partner 46.6, Kontakt 48.4 px. With c: 61.8, 43.5, 35.3, 46.6, 48.4. At 768: 77.6, 121.7, 108.7, 58.6, 61.3.

| Viewport | Row width | a, b: content / overflow | c: content / overflow | d: nav height | Links fully visible without scrolling (a,b / c / d) |
| --- | --- | --- | --- | --- | --- |
| 360 | 272 | 381 / 109 | 276 / 4 | 144 | 3 / 5 / 5 |
| 375 | 287 | 381 / 94 | 287 / 0 | 144 | 3 / 5 / 5 |
| 390 | 302 | 381 / 79 | 302 / 0 | 144 | 3 / 5 / 5 |
| 768 | 489 | 489 / 0 | same | 80 | all (real row) |

- Page horizontal overflow: 0 px in all 16 renders. No console errors.
- Nav height: 80 px (`h-nav`) in a, b, c; 144 px in d at 360 to 390, so d is 64 px taller. While d is shown the anchor offset (`scroll-mt-nav`, 5rem) is too small, so section headings land under the nav; it would need the token changed in a real build.
- c at 360 still scrolls 4 px, which is only the row's own `p-1` padding; every label is fully visible. Needs 276 px, row has 272.
- b: fade is on at the start (3 links visible), and switches off once scrolled to the end. At 360 to 390 it hints that "Unternehmen" onward continues.
- Touch reachability: in a and b the last link is fully visible after scrolling to the end at every width. In c and d everything is visible without scrolling at 375, 390 (c at 360 within 4 px).
- Keyboard: tabbing from the top reaches all five links in all options at all widths (focus lands on each, in order). In a and b at 375 the "Partner" link stays partly clipped by the viewport edge after receiving focus (the browser did not scroll it fully in); at 360 and 390 all five were fully inside the viewport once focused. In c and d all focused links were fully inside the viewport.
- Orange: not used anywhere in the options.

**Tests and build.** With both prototype import lines reverted locally (not committed): `npm test` and `npm run build` green (results below). The committed state keeps the Unternehmen and nav prototypes switched in, as on the base, so `src/App.copy.test.jsx` fails 2 tests there (dev bar text), pre-existing from the Unternehmen prototype.

### Verdict note (human, to fill in)

- Chosen option for the phone nav (a / b / c / d / other):
- Why:
- Labels (if c): keep "Einsatz" and "Firma", or other wording:
- If d: nav height token and anchor offset change accepted? yes / no
- Follow-up: ticket 04 builds the chosen option together with the real Partner link.

### Verdict (human, 2026-10-21)

Superseded by ticket 07: a hamburger menu replaces the overflowing link row. None of options a to d is built.
