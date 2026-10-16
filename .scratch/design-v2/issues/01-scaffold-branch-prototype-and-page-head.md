# 01: Scaffold — branch, prototype tree, and page head

**What to build:** An isolated prototype path so the entire redesign can be built beside the existing site and reverted by editing a single line, plus a page head that previews properly when the link is shared. The dev server renders the prototype tree, and no existing section component is modified.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

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
  build, which shows the old component tree is no longer bundled. The direct evidence that the entry
  points at the prototype is the live DOM below, not the size delta.
- Built `build/index.html` contains the new description/OG/Twitter tags, and
  `Select-String 'favicon|apple-touch-icon'` over `build/index.html` + `build/static/js/*.js`
  returns **0** matches (the note comment is stripped by the production HTML minifier, so the
  reference that remains in the source comment is not in the shipped artefact).
- `npm start` → compiled successfully, HTTP 200 on `http://localhost:3000/`.
- Live DOM at that URL (Playwright): landmarks `nav → main → footer`;
  `main` anchors in order `start, verfahren, einsatzbereiche, warum, team, kontakt` — i.e. exactly
  `DESIGN_PLAN.md` §4's order; `document.documentElement.lang === "de"`.
- In that page load, `performance.getEntriesByType('resource')` held only three entries, all
  `200`: the bundle and two HMR updates. No icon request appeared, and the document has **0**
  `<link>` elements. That is an observation about one page load, not a guarantee: deleting the
  `<link>`s cannot suppress a browser's own implicit `/favicon.ico` probe, so a future console 404
  for an unlinked default icon is possible and is exactly what raised question 1 below is about.
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

**Status.** `ready-for-human`, per `parallelisation.md` §4.2: the implementation is complete and
verified, and the three items above are decisions only a human can make. Verification of the
assembled page still belongs to ticket `11`. No PR was opened and nothing was pushed — `design/v2`
is a local branch with no upstream, so the live site is untouched.

### Post-implementation review (two-axis, fixed point `da12675`)

Both axes ran independently. What they found, and what was done about it:

**Fixed after the review:**

- **The tagline was misquoted in the share titles.** `og:title` / `twitter:title` read
  `"Ingenieurbüro Auner – Wir schaufeln nicht, wir fräsen"` — a **comma** where the company's own
  tagline has a **U+2013 en dash** (§1.5 `Header.title`, §1.8). Both axes flagged it. The titles now
  carry the tagline **verbatim** (`"Wir schaufeln nicht – wir fräsen"`) and the brand is carried by
  `og:site_name`, so the tagline cannot be re-punctuated in future. Verified by code point
  (`U+2013`, no `U+002C` in the tagline).

**Corrected above (claims in this ticket that the diff could not support):**

- The build-size delta was described as "direct evidence" for the entry switch; it only shows the
  old tree left the bundle. The live DOM is the evidence, and the bullet now says so.
- "no icon request is made at all" was an overclaim from a single page load. Deleting the `<link>`s
  cannot suppress a browser's implicit `/favicon.ico` probe.

**Accepted, with reasons — deliberately not changed:**

- *Duplicated description string across `description` / `og:description` / `twitter:description`
  (Duplicated Code smell).* Inherent to OG/Twitter: the two protocols do not read each other's
  tags. Collapsing them would break previews on one platform.
- *`const App` inside `src/AppLegacy.jsx` still called `App` (Mysterious Name).* The file is
  byte-identical to `e5ffdd6:src/App.jsx` on purpose — that equality is the audit trail that proves
  nothing under the old tree was edited. Renaming one symbol would destroy it.
- *The six anchors exist as strings in three places: the §4 contract table in `Prototype.jsx`, the
  stub `id`s, and this ticket (Primitive Obsession / Duplicated Code).* The stubs are throwaway and
  each wave-3 ticket owns its own file, so a shared constants module would be speculative
  generality — and it would put a shared file back in the path of eight parallel agents, which is
  the exact collision `parallelisation.md` §3 exists to prevent. `11` reconciles by hand.
- *`og:image` is a grey `#d8d8d8` render, so "consistent with the theme colour `#0a1f2e`" is not
  something an OG tag can demonstrate.* The theme colour is declared in exactly one place —
  `<meta name="theme-color" content="#0a1f2e" />` — and it was already correct before this ticket.
  No OG/Twitter tag expresses a colour, so this part of the checkbox is satisfied as far as it can
  be. Raising rather than inventing a navy-tinted preview image.
- *No `Type:` line on this ticket.* `docs/agents/triage-labels.md` asks for a category role, but
  none of the 13 tickets in this queue carries one, so adding it to `01` alone would be
  inconsistent. Category is clear from the wording (enhancement). Flagging the queue-wide gap
  instead of changing one file.
- *No `.scratch/design-v2/spec.md`.* `issue-tracker.md` names `spec.md` as the feature spec;
  `DESIGN_PLAN.md` is standing in for it, as the ticket instructions given to the implementer
  confirmed. Pre-existing shape of the queue, not something ticket 01 introduced.

