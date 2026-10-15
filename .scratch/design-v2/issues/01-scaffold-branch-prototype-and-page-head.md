# 01: Scaffold — branch, prototype tree, and page head

**What to build:** An isolated prototype path so the entire redesign can be built beside the existing site and reverted by editing a single line, plus a page head that previews properly when the link is shared. The dev server renders the prototype tree, and no existing section component is modified.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [x] Branch `design/v2` exists, created off `master` at `e5ffdd6`
- [x] `npm ci` completes, and `npm start` serves the app — npm only, with `package-lock.json` left in sync
- [x] A prototype component tree exists that the app entry points at through a single line, and nothing under the existing component tree is modified
- [x] Reverting to the current design requires editing that one line and nothing else
- [x] The four favicon references pointing at files that do not exist are removed or replaced, so the console no longer reports 404s for them
- [x] The meta description is no longer empty
- [x] Open Graph and Twitter card tags are present, describing trench milling for energy and utility network expansion, consistent with the theme colour `#0a1f2e`
- [x] The document language and title remain correct for a German site
- [x] The legal pages, `robots.txt` and the `CNAME` file are untouched

## Comments

### Implementation notes (agent, 2026-10-15)

**Branch.** `design/v2` created off `master` @ `e5ffdd6` (verified: `git rev-parse master` →
`e5ffdd6543c746cc1ffaaffe4e517faba5d13bd2`). The planning artefacts (`AGENTS.md`, `DESIGN_PLAN.md`,
`docs/`, `.scratch/`) were untracked on `master`; they were committed here in `da12675` together
with the claim, per `docs/agents/issue-tracker.md` ("commit them alongside the work they describe").

**Prototype tree.** `src/prototype/Prototype.jsx` is the shell; it composes the eight slots of
`DESIGN_PLAN.md` §4 in order and is **frozen** per `parallelisation.md` §3. `src/prototype/sections/`
holds one placeholder file per wave-3 ticket, each carrying the anchor its ticket must keep:

| File | Ticket | Must render |
| --- | --- | --- |
| `sections/Nav.jsx` | 03 | the `<nav>` landmark (plus the fixed mobile call bar) |
| `sections/Hero.jsx` | 04 | `<section id="start">` |
| `sections/Verfahren.jsx` | 05 | `<section id="verfahren">` |
| `sections/Einsatzbereiche.jsx` | 06 | `<section id="einsatzbereiche">` |
| `sections/WarumWir.jsx` | 07 | `<section id="warum">` |
| `sections/Team.jsx` | 08 | `<section id="team">` |
| `sections/Kontakt.jsx` | 09 | `<section id="kontakt">` |
| `sections/Footer.jsx` | 10 | the `<footer>` landmark, outside `<main>` |

This is parallelisation option **A**. A wave-3 agent replaces its own file wholesale and never edits
`Prototype.jsx`. The stubs carry **no styling and no copy** — `02` owns the visual vocabulary, and
`§4.1` exists precisely so that vocabulary is not forked by eight agents.

`npm start` on this commit therefore renders an intentionally empty page: the old components are no
longer rendered and no v2 section has pixels in it yet. `02`'s showcase is the first thing to look
at. The pages are *not* broken; they are empty by construction.

**The single line (D5).** `src/App.jsx` is now one statement —
`export { default } from "./prototype/Prototype";`. The previous composition is preserved verbatim
as `src/AppLegacy.jsx` (verified byte-identical: blob `3a4af198d79bda4da6fd402cc478f841beb8dfce`
for both `e5ffdd6:src/App.jsx` and the new file), so reverting is literally changing that one
specifier to `"./AppLegacy"`. Nothing under `src/components/` was modified
(`git status --short` shows only `M src/App.jsx`, `?? src/AppLegacy.jsx`, `?? src/prototype/`).
**Ticket 12 must delete `src/AppLegacy.jsx` too** — it is new, so it is not in `12`'s list of seven
components to remove.

**Page head.** `public/index.html` — the four icon links were **removed, not replaced**; see the
raised question below. Added `og:*` (type, site_name, locale, url, title, description, image, image
type/width/height/alt) and `twitter:*` (card `summary_large_image`, title, description, image,
image alt). `og:image` is the machine render; its declared 1342×738 was byte-verified with
`System.Drawing` (`fraese.png` is really 1342×738, 1453 KB), so the `og:image:width/height` values
are facts, not guesses. `<html lang="de">` and `<title>Ingenieurbüro Auner</title>` are unchanged.
`public/impressum.html`, `public/datenschutz.html`, `public/robots.txt` and `CNAME` were not touched
(`git status --short` confirms).

### Verification evidence

- `npm ci` → exit 0, 1664 packages, `package-lock.json` unmodified. (The first attempt was
  interrupted by a tool-session boundary and left a partial `node_modules/`; re-run cleanly.)
- `npm run build` → **Compiled successfully**, exit 0. `main.js` gzip **−4.45 kB** vs. the previous
  build, which is the old component tree no longer being bundled — direct evidence the entry now
  points at the prototype.
- Built `build/index.html` contains the new description/OG/Twitter tags, and
  `Select-String 'favicon|apple-touch-icon'` over `build/index.html` + `build/static/js/*.js`
  returns **0** matches (the note comment is stripped by the production HTML minifier).
- `npm start` → compiled successfully, HTTP 200 on `http://localhost:3000/`.
- Live DOM at that URL (Playwright): landmarks `nav → main → footer`;
  `main` anchors in order `start, verfahren, einsatzbereiche, warum, team, kontakt` — i.e. exactly
  `DESIGN_PLAN.md` §4's order; `document.documentElement.lang === "de"`.
- All resource timings at that URL: **200 only, no 404** — and `head link` count is `0`, so no icon
  request is made at all.
- `npm test` → `No tests found, exiting with code 1`. Pre-existing: the repo has zero test files
  (`setupTests.js` is not one) and CRA's `test` script has always behaved this way here. Not a
  regression.

### Raised for a human (not silently decided)

1. **No favicon at all now.** The ticket allows "removed or replaced". Removal is what was done,
   because no icon asset exists in `public/img/` and no brand mark is specified anywhere in
   `DESIGN_PLAN.md` §3/§4/§4.1 — inventing one would be an unlogged design decision, which §2 and
   `parallelisation.md` §4.4 forbid. If a favicon is wanted, the cheapest honest option is a tiny
   SVG derived from the emblem disc (the same source `B6` crops for the nav mark), which would be a
   new decision to record. `D4` only asked for the broken references to go away, so this is a
   deferral rather than an omission.
2. **No test seam was pre-agreed, so no test was written.** The `tdd` skill's rule is that no test
   is written at an unconfirmed seam, and ticket 01 has no seam in it (branch, file tree, HTML
   head). The one seam worth an executable contract is the shell order above, which `parallelisation.md`
   §3 calls "the one real collision risk". Say the word and it becomes a test asserting that the six
   §4 anchors render in order — a good fit for ticket `11`, which currently would verify it by hand.
3. **`og:image` points at the 1453 KB CAD render.** It is the only landscape asset that exists and
   `D4`'s rationale is that the link must preview properly when pasted into a WhatsApp group. No
   image was re-encoded or invented. If a smaller preview asset is wanted later, that is a `12`
   (asset pruning) decision.

**Status.** Left as `claimed` deliberately, per `parallelisation.md` §4.2: the work is complete and
verified, and verification of the assembled page belongs to ticket `11`. The three items above are
the only parts of this ticket that are waiting on a human. No PR was opened and nothing was pushed —
`design/v2` is a local branch, so the live site is untouched.

