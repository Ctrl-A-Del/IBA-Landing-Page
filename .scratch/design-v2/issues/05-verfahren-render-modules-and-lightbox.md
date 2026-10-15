# 05: Verfahren — machine render, four modules, lightbox

**What to build:** The machine render stops being a wordless full-bleed image and becomes a section that actually explains the machine: the render at full width, the four modules it carries as real text, and a way to see the render larger.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] The section is anchored at `#verfahren` on the light background
- [x] The render is full width at every breakpoint, including mobile, and is never hidden, cropped or CSS-zoomed
- [x] The four modules appear as real HTML text — numerals 01–04, a name and one line each — covering Fräsmodul, Aufnahmemodul, Fördermodul and Antriebsmodul
- [x] The module text is readable at ~375 px, where the render's own baked-in annotations scale down to roughly 4 px
- [x] The module list is available to screen readers and to search engines as text
- [x] A labelled button reading "Größer ansehen" with a maximise icon opens the render full-screen
- [x] The render is also clickable for pointer users, but the labelled button is the accessible affordance — the feature is never trigger-only
- [x] The enlarged view opens through the native dialog element's modal mode, so focus trapping, Esc-to-close and the backdrop come from the browser rather than hand-rolled code
- [x] The enlarged view shows the render as large as the viewport allows, on a dark navy backdrop
- [x] There is no pan or zoom UI — the source is a finite raster, so magnifying past 1:1 only shows interpolation
- [x] It closes on Esc, on an explicit close button, and on a backdrop click
- [x] Focus returns to the element that opened it on every exit path
- [x] A caption reading "Fräsmodul, Aufnahme-, Förder- und Antriebsmodul" is associated with the enlarged render, so a screen-reader user gets that text when it opens
- [x] The dialog is operable keyboard-only and announces itself
- [x] No lightbox library is added

## Comments

### Implementation notes (agent, 2026-10-15)

**Shape.** `src/prototype/sections/Verfahren.jsx` replaces the placeholder. It is one component:
`<Section id="verfahren" tone="light">` (ticket-02 primitive, consumed as-is) holding the eyebrow,
H2 and intro, the render with the "Größer ansehen" button, the module list, and the `<dialog>`.
`Reveal` wraps the header and the module list; the render itself is never wrapped, so it is never
transparent. No red-list file was edited, and no dependency was added (`Maximize2` and `X` come from
the existing `lucide-react`).

**Decisions worth knowing:**

- **Render (C9).** `w-full h-auto` at the container width, with `width`/`height` = 1342×738 to
  reserve the box. No `object-fit`, no crop and no breakpoint hiding. At 375 px it is 335 px wide, a
  0.25 scale, so the baked-in annotations are ~4 px, as the ticket expects. It uses the same gutter
  as every other section rather than bleeding to the screen edge.
- **Modules (C4).** An `<ol aria-label="Die vier Module der Maschine">` with one `<li>` per module:
  numeral (`display-md`), name as an `<h3>`, line as a `<p>`. The text is the render's
  annotations, copied verbatim. Layout is 1 / 2 / 4 columns (base / `sm` / `lg`), each item
  topped by a 1 px rule (§4.1). Numerals are navy, not orange: orange on white is ~2.5:1, and B3
  keeps orange for primary CTAs only.
- **Lightbox (C13).** A native `<dialog>`, opened with `showModal()` through a ref. Focus trap, Esc,
  inertness and `::backdrop` come from the browser. The component adds only two things:
  - **Backdrop click.** The dialog fills the viewport and is transparent. A click on anything except
    the render, its caption or the close button closes it. `::backdrop` clicks are reported with
    the `<dialog>` as their target, so they are covered too.
  - **Focus return.** The opener (`event.currentTarget`) is remembered when the dialog opens. Every
    exit path ends in the dialog's `close` event, and that one handler restores focus. Chromium also
    restores focus natively. The explicit restore covers the render-click path and older engines.
- **No `display` utility on the `<dialog>` element.** It would override the UA `display: none` of a
  closed dialog. The flex layout sits on an inner wrapper.
- **Enlarged size (C14).** `w-auto h-auto max-w-full max-h-full`, so the render fills the space left
  after the close button and caption. On viewports larger than 1342×738 it stops at 1:1 instead of
  upscaling, which is the same reasoning as "no pan/zoom".
- **Backdrop colour.** Solid `backdrop:bg-brand` (`#0a1f2e`). The first browser pass used
  `bg-brand/95`. At 375 px the page showed faintly through and the mobile call bar's ghost crossed
  the caption, so it is now opaque.
- **Render click (C14).** The section render has `onClick` plus `tabIndex={-1}`. It is not in the
  tab order and is not exposed as a second button, so the labelled button stays the only accessible
  affordance. Because it can take focus, focus can return to it when a pointer user closes the
  lightbox. After a keyboard close it then shows a navy `focus-visible` outline.
- **Accessible name.** The dialog has `aria-labelledby` pointing at the `<figcaption>`, so opening it
  announces "Dialog, Fräsmodul, Aufnahme-, Förder- und Antriebsmodul". The caption is also the
  `<figure>`'s caption for the enlarged `<img>`. Both images share the alt text
  "3D-Darstellung der Fräsmaschine mit ihren vier Modulen".
- **New copy (C8), flagged `C8-NEW` in the source:** eyebrow "Verfahren", H2 "Die Maschine", intro
  "Die Maschine ist in Entwicklung. Vier Module sollen Bodenabtrag und Materialtransport in einem
  kontinuierlichen Arbeitsgang bündeln." The intro is derived from the hedged Services text in
  `data.json` (C2: "soll", no claims). The alt text and the two button labels are new strings too.

**Test seam.** As in ticket 03 there was no user to confirm seams with, so the precedent was followed.
There is one seam, the rendered `<Verfahren />`, observed only through the DOM: roles, accessible
names, text, `dialog.open` and `document.activeElement`. No Tailwind class string is asserted.
jsdom 16 has `HTMLDialogElement` but no `showModal()`/`close()`. The test file stubs both with only
the UA behaviour the spec defines (`open` set or cleared, `close` fired, Escape → cancelable
`cancel` → `close()`). It also shims `getComputedStyle(elt, pseudo)` to silence jsdom
"Not implemented" noise from accessible-name computation.

### Verification evidence

- **Tests.** `src/prototype/sections/Verfahren.test.jsx` has 7 tests:
  1. The anchor and the render.
  2. The four modules, numbered 01–04 in order with name and line.
  3. The labelled button opens a dialog named by the caption, with the caption in the `<figure>`.
  4. The close button closes it and returns focus.
  5. Esc closes it and returns focus.
  6. A backdrop click closes it and returns focus, while clicks on the render and caption don't.
  7. A render click opens it, focus returns to the render, and the render adds no tab stop or button.

  Slices 1–3 and 5–7 were written red first. The Esc test (4) passed on arrival, because it shares
  the `close` path with the close button; it stays as a guard. Two mutations were run:
  - Removing the focus restore turned 4 tests red. The backdrop test initially stayed green, so it
    was tightened to move focus into the dialog first, as the browser does.
  - Making every dialog click close turned the backdrop test red.

  The full suite is 16/16 green: 7 here, plus ticket 03's 6 and ticket 02's 3. It was run with the
  `.claude/` worktree workaround from ticket 03:
  `CI=true npx react-scripts test --watchAll=false --testMatch "<abs worktree>/src/**/*.test.{js,jsx}"`.
- **Build.** `npm run build` with `BUILD_PATH` pointing at a scratch directory, so the shared `build/`
  was left alone. The result is `Compiled successfully` with no warnings. The compiled CSS contains
  `.backdrop\:bg-brand::backdrop{…}` and `.cursor-zoom-in`.
- **Browser pass** (the build served on port 3005, headless Edge 155 over CDP, both stopped
  afterwards), at 375×740 and 1280×800:
  - `#verfahren` background is `rgb(255,255,255)`, `aria-labelledby="verfahren-heading"`. There is no
    horizontal page overflow at either width.
  - The render is `display: block`, `object-fit: fill`, and its width equals the container content
    width exactly: 335 = 335 at 375, 1106 = 1106 at 1280. The image loads at its natural 1342×738.
  - Module text measures 16 px for the line, 17.3 px for the name and 24.4 px for the numeral at
    375; at 1280 the name is 20 px and the numeral 36 px. Screenshots show a single column at 375 and
    four columns at 1280. `data-revealed="true"` once scrolled in.
  - **Keyboard open.** Focus the button (`:focus-visible` matches) and press Enter. The result is
    `dialog.open`, `:modal`, and focus on "Schließen". Chromium's AX tree reports role `dialog`,
    name "Fräsmodul, Aufnahme-, Förder- und Antriebsmodul". The enlarged image is role `image` with
    the alt text, inside a `figure`.
  - The `::backdrop` computes to `rgb(10,31,46)`. The enlarged render is 343×189 at 375 (as wide
    as a portrait phone allows, a 16 px inset) and 1173×645 at 1280. The ratio holds at 1.818–1.819,
    and the caption stays inside the viewport.
  - **Focus trap.** Four Tabs and one Shift+Tab: focus stayed inside the dialog every time.
  - Every exit path returned focus to "Größer ansehen": Esc, a mouse click on "Schließen", and a
    mouse click in an empty corner (the backdrop). Before that corner click, clicks on the enlarged
    render and on the caption left the dialog open.
  - **Pointer on the render.** A click opens the dialog. After Esc, focus is back on the render
    `<img>`. Its `tabIndex` is -1.
  - Screenshots were inspected for the section at 375 and 1280, the module list at 375 and 1280,
    and the open dialog at 375 and 1280.

### Raised for a human

1. **On a portrait phone the enlarged view is barely larger than the inline render** (343 px vs
   335 px wide). That is the geometry of a 16:9 raster on a 9:19.5 screen, not a bug. The lightbox
   pays off on desktop and on a phone turned to landscape. Rotating the image or adding pan/zoom
   would break C14, so nothing was added.
2. **The render's 04 annotation has a third line** that §1.6 doesn't list: "Für breite und tief
   angelegte Infrastrukturgräben". The module list follows C4 ("one line each") and uses the second
   line, "Energie, Hydraulik, Steuerung". Say if the third line should appear in the HTML too.
3. **The render is inset by the page gutter on phones** (20 px each side) rather than bleeding to
   the screen edge. "Full width" was read as full container width, consistent with every other
   section. Going edge to edge would gain 40 px at 375.
4. **New copy for C8 review:** the eyebrow, H2, intro, alt text and the two button labels
   ("Größer ansehen" is fixed by C14; "Schließen" is new).
5. **Page scroll behind the open dialog is not locked**, per C13 ("no manual scroll lock"). The
   page is inert but can still scroll under the opaque backdrop on some platforms. Nothing visible
   changes, because the backdrop is solid.

### Review follow-up (agent, 2026-10-15)

Branch `design-v2/05-review-fixes`. Only `Verfahren.jsx`, `Verfahren.test.jsx` and this file were
edited.

**Fixed:**

- **Backdrop click.** The `closest("img, figcaption, button")` tag allowlist is gone. The dialog
  records the `mousedown` and `mouseup` targets, and its `click` handler closes only when both lie
  outside the figure content: `figureRef.current.contains(node)`, excluding the `<figure>` box
  itself. The release target is needed too, because `click` fires on the common ancestor of press
  and release, so a drag from the backdrop onto the render looks like a backdrop click. Clicks with
  no recorded press (keyboard Enter on "Schließen") are ignored by this handler, and the button
  closes the dialog itself. The `<figure>` became a two-row grid (`minmax(0,1fr)` / `auto`) with no
  wrapper `<div>`, so the render and caption are its only descendants and its empty area still
  counts as backdrop.
  - Tests: the backdrop test now dispatches real press/release/click sequences. Two new tests cover
    a drag from the render or the caption out to the backdrop, and a drag from the backdrop onto the
    render. Both were red before the change.
  - Browser check (scratch build on port 3005, headless Edge over CDP) at 375×740, 1280×800,
    1920×1080 and 800×375:
    - Click on the render: stays open. Drag render→corner: stays open. Drag corner→render: stays
      open.
    - Click in the figure's empty area beside the render: closes, and focus returns to
      "Größer ansehen".
    - Enlarged render sizes: 1173×645 at 1280×800, 1342×738 at 1920×1080, 400×220 at 800×375. The
      ratio is 1.818 everywhere, and the caption is in view.
- **Data clump.** A single `RENDER = { src, alt, width, height }` is spread into both `<img>`s.
- **Duplicate class.** The `<figcaption>` no longer repeats `text-mist-300`; it inherits it from the
  `<dialog>`.
- **Reveal.** A comment marks the render as deliberately outside `Reveal` (C9: never hidden).
- **Focus outline.** The section render has `outline-none` in place of its `focus-visible` ring.
  Focus still returns to it (the test is unchanged and green). In the browser, after a pointer open
  and Esc, it matches `:focus-visible` but its outline is transparent (`2px solid #0000`). Tab never
  reaches it, so the ring could only ever appear as a stray. In forced-colours mode the transparent
  outline shows, which is intended.

**Raised for a human (not changed):**

1. **Local `BUTTON_BASE` vs the red-list "never fork a local variant" rule.** The two outline
   buttons ("Größer ansehen", "Schließen") share a local class string, because ticket 02 ships only
   the orange primary CTA, and orange is reserved for primary CTAs (B3). This is arguably a local
   fork of a shared primitive. Should it become a shared secondary/outline button in ticket 02's
   domain (`src/prototype/ui/`), which other sections could then consume?
2. **Enlarged render capped at its natural 1342×738 vs C14 "as large as the viewport allows".** On
   viewports larger than about 1406×870 the render stops at 1:1 with navy around it. That follows
   C14's own "no pan/zoom, magnifying past 1:1 only shows interpolation", but the literal wording
   says "as large as the viewport allows". Confirm the cap, or remove it and let the render upscale.
3. **`getComputedStyle` test shim, kept.** jsdom 16 logs "Not implemented: window.computedStyle(elt,
   pseudoElt)" each time `getByRole(..., { name })` computes an accessible name. The shim drops
   the pseudo-element argument and returns the element's own style. That is honest here, because no
   pseudo-element on this page carries text. It is scoped to this file (`beforeAll`/`afterAll`)
   and only keeps the output readable; it changes no assertion. Remove it if jsdom is upgraded.

**Tests.** Full suite 24/24 green before and after `git merge design/v2`, run with the `.claude/`
worktree `--testMatch` workaround from ticket 03.
