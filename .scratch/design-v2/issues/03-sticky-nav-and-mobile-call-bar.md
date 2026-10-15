# 03: Sticky nav and mobile call bar

**What to build:** The page gains navigation it currently lacks entirely, and the phone number becomes reachable at every scroll position and every screen width — the cheapest available move toward the page's single goal.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] A sticky nav renders the emblem disc as a tight CSS crop of the existing logo plate; the full framed plate is not used in the nav — it is a JPEG, so transparency is impossible
- [x] The nav links to Verfahren · Einsatzbereiche · Team · Kontakt, and each anchor lands on its section with the heading clear of the sticky bar
- [x] Over the hero the nav is transparent; once scrolled it becomes solid navy with a subtle bottom border
- [x] The transparent-to-solid transition is suppressed under `prefers-reduced-motion: reduce`
- [x] The nav carries the orange phone CTA
- [x] At `lg` and up the CTA displays `0176 618 77 599`; below `lg` it reads "Anrufen"
- [x] The CTA's `tel:` target is always `+49 176 618 77 599`, while the displayed number uses the local format above
- [x] The nav never auto-hides — it is reachable at every scroll position
- [x] Below `md`, a fixed bottom "Anrufen" bar shows the number and is present from first paint
- [x] The mobile bar does not overlap, cover or hide footer content
- [x] The mobile bar is absent at `md` and above
- [x] Every nav link and the CTA are keyboard-reachable with a visible focus state, and the mobile bar does not introduce a focus trap or a confusing duplicate tab stop
- [x] No WhatsApp or other unpublished contact channel is offered

## Comments

### Implementation notes (agent, 2026-10-15)

**Shape.** `src/prototype/sections/Nav.jsx` replaces the placeholder and renders two siblings, per the
shell contract: the `<nav aria-label="Hauptnavigation">` landmark and the mobile call bar. Two small
helpers sit next to it: `useScrolled.js` (the transparent → solid switch) and `phone.js` (the two
number formats of C16). Both CTAs are the ticket-02 `CTA` primitive, consumed as-is with
layout-only classes. No red-list file was edited.

**Decisions worth knowing:**

- **`fixed`, not `sticky`.** "Transparent over the hero" (B9) means the nav overlays the hero; a sticky
  element stays in flow and would push the hero down by its own height. It is exactly `h-nav` (80 px),
  the same token `src/index.css` derives every section's `scroll-margin-top` from. The hero clears it
  because `Section`'s `py-20` top padding is also 5rem.
- **Solid when scrolled more than 8 px**, read synchronously on mount so a page restored mid-scroll
  paints solid on the first frame. The state is exposed as `data-state="transparent|solid"` on the
  `<nav>`, which is what the tests observe. Solid = `bg-brand` + a 1 px `mist-500/40` bottom border.
  The colour transition is `transition-colors duration-300`, with `motion-reduce:transition-none` on
  top of the global reduced-motion rule in `src/index.css`.
- **Emblem crop (B6).** Measured on the 540×935 source: the gear disc sits in the 340×340 px square at
  (135, 222). The image is scaled to `w-[158.8%]` of a round 40/48 px box and offset by
  `left-[-39.7%] top-[-65.3%]`; `rounded-full overflow-hidden` clips the wall away. The emblem is a link
  to `#start` labelled "Ingenieurbüro Auner – zum Seitenanfang"; the image itself has `alt=""`.
- **One call tab stop per width.** Below `md` the nav's own CTA is `display: none` and the bar is the
  call affordance; from `md` up the bar is hidden and the nav CTA takes over. So a keyboard user
  never meets two identical "Anrufen" stops, and nothing can trap focus (the bar is a plain link). See
  raised item 1.
- **Both CTAs carry `aria-label="Anrufen: 0176 618 77 599"`**, so the accessible name contains the
  visible label at every breakpoint ("Anrufen" below `lg`, the number from `lg`). The `tel:` target is
  `tel:+4917661877599`: the international number from `data.json` with the spaces stripped, the same
  form the legacy `contact.jsx` and the ticket-02 showcase use.
- **The bar never covers the footer.** While `Nav` is mounted, a layout effect adds
  `max-md:pb-[4.5rem]` to `<body>` (the bar is `h-[4.5rem]`), so the end of the page scrolls clear of
  the bar. This is done from `Nav.jsx` because the footer and shell belong to other tickets; it is
  cleaned up on unmount. Both literals live side by side in `Nav.jsx` with a "change both" note.
- **Phone-width link row.** The four links did not fit beside the emblem at 375 px at 14 px/semibold.
  The first browser pass showed a real bug: with `justify-end`, the overflow spilled off the *left*
  edge, where a scroll box cannot reach it, so "Verfahren" slid under the emblem. Below `sm` the row is
  now 13 px/medium, `justify-start`, `gap-x-2`, with a 40 px emblem, and `overflow-x-auto` stays as a
  safety net. From `sm` up it is 16 px/semibold, right-aligned.

**Test seam.** The `tdd` skill asks for seams to be confirmed with the user. This ran as a delegated
agent with no user to ask, so the seam was chosen to match ticket 02's precedent: one seam, the rendered
`<Nav />`, observed only through the DOM a visitor gets (hrefs, text, accessible names,
`data-state`). No Tailwind class string is asserted. Breakpoint visibility can't be observed in jsdom,
so it is verified in the browser pass below.

### Verification evidence

- **Tests**: `src/prototype/sections/Nav.test.jsx` has 6 tests: section links and their order, the nav
  CTA's `tel:` target / local display number / accessible name, transparent ↔ solid on scroll, solid
  when restored mid-scroll, the call bar outside the `<nav>` dialling the same number, and no
  WhatsApp or other unpublished channel. The full suite is 9/9 green (with ticket 02's 3 `useReveal`
  tests). Each slice was written red first. Three mutations were then run to check the tests can fail:
  removing the scroll listener, pointing the bar at `https://wa.me/...`, and switching the display
  format to `+49 …`. Each turned the matching test red, and the suite was green again after restoring.
- **Running the tests in this worktree needs a workaround.** The worktree lives under `.claude/`, and
  CRA's default `testMatch` glob does not match dot-directories, so plain `npm test` reports "No tests
  found". The runs above used
  `CI=true npm test -- --watchAll=false --testMatch "<absolute worktree path>/src/**/*.test.{js,jsx}"`.
  This doesn't happen in a checkout outside a dot-directory.
- **Build**: `npm run build` → `Compiled successfully`, no warnings, `main.css` 5.37 kB gzipped. The
  compiled CSS contains `@media not all and (min-width:768px){.max-md\:pb-\[4\.5rem\]{padding-bottom:4.5rem}}`
  plus the bar height and the three crop offsets, so every arbitrary class compiled.
- **Browser pass** (dev server on port 3103, headless Edge driven over CDP, both killed afterwards),
  at 360 / 375 / 768 / 1280 px:
  - The nav is `position: fixed`, 80 px tall at every width, and a section's `scroll-margin-top` is
    `80px`. At the top it has `data-state="transparent"`, `background-color: rgba(0,0,0,0)` and a
    transparent border. After scrolling it has `data-state="solid"`, `rgb(10,31,46)` and a 1 px
    `rgba(111,128,144,0.4)` bottom border.
  - Nav CTA: hidden at 360/375, where the bar takes over. It reads "Anrufen" at 768 and
    "0176 618 77 599" at 1280. It computes to `rgb(240,138,36)` with `rgb(10,31,46)` text, and its href
    is `tel:+4917661877599` at every width.
  - Call bar: visible at 360/375 (72 px, "Anrufen 0176 618 77 599"), `display: none` at 768 and 1280.
    `<body>` `padding-bottom` is `72px` below `md` and `0px` from `md` up.
  - Footer clearance: scrolled to the very bottom, the last in-flow content of `#root` ends at
    y = 739.75 at 375 px, against a bar top at y = 740. It ends exactly at the bar's edge and is not
    covered. Today that last content is ticket 02's showcase, which sits after the placeholder footer.
    The mechanism doesn't depend on what the last element is, but ticket 11 should re-check it against
    the real footer.
  - No horizontal page overflow at any width. The link row fits at 375 with ~15 px to spare. At 360 the
    row's scroll box overflows by 2 px (its own padding), and all four labels stay fully visible.
  - The emblem image loads (540×935) and the crop shows the gear disc only. The screenshot was
    inspected at 3× DPR.
  - Keyboard (Tab from page load) at 375: emblem → Verfahren → Einsatzbereiche → Team → Kontakt →
    call bar. At 1280 the same order ends in the nav CTA instead. Every stop matched `:focus-visible`.
    The links and emblem show a 2 px white outline; the CTA/bar show the primitive's white outline plus
    navy ring. There is exactly one call stop per width and no trap: the next Tab moves on into the
    page.
  - Reduced motion (emulated `prefers-reduced-motion: reduce`): the nav computes
    `transition-property: none`, so the transparent → solid switch is instant.
- **Anchor landing is not verified here.** Every section is still an empty placeholder, so a jump
  cannot show a heading clearing the bar. This ticket verified its half of the contract (nav height =
  scroll-margin = 80 px). Landing for all sections is verified in ticket 11, per `parallelisation.md`
  §3 ("Known cross-ticket coordination").

### Raised for a human

1. **Below `md`, the nav has no CTA of its own: the fixed call bar is the call affordance.** C16 says
   "below `lg` the verb Anrufen", and that holds from `md` to `lg`. Below `md`, showing it in the nav
   too would put two identical "Anrufen" tel links in the tab order, which the checklist rules out. It
   would also not fit beside the four links at 375 px. Confirm this reading, or say if the nav should
   carry its own CTA on phones as well.
2. **The nav is `fixed` and overlays the top 80 px of the page.** Ticket 04 (hero) must keep at least
   `h-nav` of top padding. `Section`'s default `py-20` already does; a hero that trims its top padding
   would slide under the nav.
3. **Over the navy hero, "transparent" and "solid navy" look nearly the same.** What visibly changes on
   scroll is the hairline bottom border, plus the solid fill once the nav passes over the light
   Verfahren section. That is B9 as written; noting it so it isn't mistaken for a bug in review.
4. **`Nav` adds a class to `<body>`** to reserve the bar's height. That is a deliberate side effect,
   explained in the component, done because the footer and shell are off-limits to this ticket. If
   ticket 10 or the coordinator would rather own that spacing (for example a spacer after the footer
   in the shell), it can be removed from `Nav.jsx` in one place.

### Review outcome (2026-10-15)

Review findings on 9d169b7 and what happened to them (branch `ticket/03-review-fixes`). Tests 9/9
green, `npm run build` clean, re-measured in headless Edge at 360 / 375 / 768 / 1280 px on port 3104.

**Fixed:**

- **`useScrolled.js` was more general than it needed to be.** The unused `threshold` parameter is gone; the
  8 px is now the named constant `SOLID_AFTER_PX`. The `typeof window` SSR guard is gone too (CRA has
  no SSR). So is the eager `update()` in the effect, because the lazy `useState(readScrolled)` already
  reads the restored scroll position on the first render. The "already solid when restored
  mid-scroll" test still passes, and in the browser it was transparent at the top and solid after
  scrolling.
- **`FOCUS` → `FOCUS_ON_NAVY`**, so the name says it is the white-on-navy outline.
- **The `{" "}` between the call-bar spans is removed.** `CTA`'s `gap-2` already gives the visible
  8 px space (measured). The accessible name comes from `aria-label="Anrufen: 0176 618 77 599"`, so it
  doesn't depend on the text node. The raw `textContent` now reads "Anrufen0176 618 77 599", but
  `aria-label` replaces it as the link's name. The call-bar test now also pins its `aria-label` as the guard.
- **iOS safe area on the mobile bar.** The bar is now
  `h-[calc(4.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]`, and `<body>`
  reserves `max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))]`. All of these are literal classes,
  and the compiled CSS shows `calc(4.5rem + env(safe-area-inset-bottom))`. In the browser the bar is
  still 72 px with a 72 px body reserve, and the last content ends at y = 739.75 against a bar top of
  740 (375 px). **This is defensive only:** `env(safe-area-inset-bottom)` is 0 unless the viewport
  meta in `public/index.html` sets `viewport-fit=cover`, and that file belongs to ticket 01, so it
  was not edited.

**Left for a human:**

- **`text-[0.8125rem]` stays.** No type-scale token fits. With `text-body-sm` (14px) swapped in, the
  link row overflows by 5 px at 375 and 20 px at 360. With today's 13px it fits at 375 and overflows
  by 2 px at 360 (the row's own padding). `eyebrow` is 13px but brings 0.14em tracking and weight 600,
  so it would be wider still. Either accept the arbitrary value, or add a `nav` / `body-xs` token in
  `tailwind.config.js` (ticket 02's file).
- **No nav CTA below `md`** (C16 reading): raised item 1 above, still open.
- **The `<body>` padding side effect, and who owns it** (ticket 10 / shell): raised item 4 above,
  still open. The reserve now includes the safe-area inset, so whoever takes it over should keep the
  `calc()`.
- **The 8 px solid threshold vs "over the hero"** (B9 reading). The nav turns solid after 8 px, not
  when it leaves the hero. Confirm this reading of B9, or say if it should switch at the hero's
  bottom edge.
- **The phone number is hardcoded** in `phone.js`, the ticket-02 `Showcase.jsx` and the tests. It
  should be consolidated with `data.json` in ticket 12.
- **The ticket files have no `Type:` line.** This one is unchanged; it is a template question for the
  tracker, not for this ticket.
- **Anchor landing** is still unverified, since the sections are placeholders. It is verified in
  ticket 11.
