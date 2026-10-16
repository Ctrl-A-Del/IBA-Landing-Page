# 04: Hero

**What to build:** The first screen states what the company does and offers the call — typographically, without the machine render, which is deliberately held back for the Verfahren section.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] The hero is anchored at `#start` on the navy background
- [x] The H1 reads `Wir schaufeln nicht – wir fräsen`, with the en dash (U+2013) preserved exactly rather than typed as a hyphen
- [x] The H1 is sentence case, fluid across the breakpoints, and never uppercase
- [x] A subline names the field — trench milling for energy and utility network expansion — without making a performance claim
- [x] The phone CTA is present in the hero
- [x] `Maschinenbau aus NRW` appears as the hero's trust line, not as a Team heading
- [x] The machine render does not appear in the hero
- [x] The hero's height accounts for the transparent nav overlapping it, so the H1 is never obscured by the nav at any breakpoint
- [x] German characters and dashes render correctly
- [x] No performance promise, completed-project claim or invented reference appears in the copy

## Comments

### Implementation notes (agent, 2026-10-15)

**Shape.** `src/prototype/sections/Hero.jsx` replaces the placeholder: a `Section` (`id="start"`,
`tone="navy"`) holding the H1, one subline, the phone CTA and the trust line. It reuses `CTA`,
`Section` and ticket 03's `phone.js` as-is. It has no image and no `Reveal`, because the hero is the
first paint and a reveal would start the H1 at opacity 0. No red-list file was edited.

**Decisions worth knowing:**

- **Clearing the fixed nav.** The nav is `fixed` and `h-nav` (80 px). `Section`'s top padding is
  `py-20` (80 px), and more from `sm` up, so the content box never starts above the nav's bottom
  edge. The hero is `min-h-svh` with its content centred vertically. Centring can only push the content
  further down. The bottom padding (80 px+) is taller than the mobile call bar (72 px).
- **H1.** The text is `data.json` `Header.title` verbatim, with U+2013. The class is
  `text-display-xl` (fluid clamp 2.5rem → 5rem, 800, -0.03em), `text-mist-100`, and an explicit
  `normal-case` on top of the base rule. "wir fräsen" is wrapped in a `whitespace-nowrap` span, so
  on wide screens the line breaks at the dash. Without it, the first browser pass at 1280 left
  "fräsen" alone on line 2. The text content is unchanged.
- **Subline (new copy, C8):** "Wir entwickeln Grabenfräsen für den Energie- und
  Versorgungsnetzausbau." It names the field in the honest *entwickeln* register (C2) and makes no
  performance claim.
- **Trust line:** "Maschinenbau aus NRW" is a `<p>` in `text-eyebrow` (sentence case, letter-spaced)
  in `mist-400`, below a 1 px `mist-500/40` rule after the CTA. It is not a heading. The H1 is the hero's
  only heading.
- **CTA:** the `CTA` primitive with a `Phone` icon and the local number `0176 618 77 599`,
  `href="tel:+4917661877599"`, `aria-label="Anrufen: 0176 618 77 599"`. That is the same name as the
  nav CTA and the call bar.

**Test seam.** As in ticket 03 (delegated agent, no user to confirm seams with): one seam, the rendered
`<Hero />`, observed through the DOM only. No Tailwind class string is asserted.

### Verification evidence

- **Tests**: `src/prototype/sections/Hero.test.jsx` has 6 tests: the `#start` anchor plus the exact H1
  (en dash written as the `\u2013` escape in the test source), the single phone CTA (href / local number /
  accessible name), the subline
  directly under the H1 naming *fräs…* and *Energie- und Versorgungsnetzausbau*, the trust line as a
  non-heading with the H1 the only heading, no image or `fraese` reference, and no figures or claim
  wording. The full prototype suite is 15/15 green. The anchor/H1, CTA, subline and trust-line slices
  were each written red first. The image and claims tests are guards that were green from the start, so
  they were mutation-checked: adding `<img src="img/fraese.png">` → 2 red; appending
  "mit 300 Meter am Tag" to the subline → 1 red; typing the dash as a hyphen → 1 red; turning the trust
  line into an `<h2>` → 3 red. The suite was green again after each restore.
- **Test command in this worktree**: as noted in ticket 03, the `.claude/` worktree needs
  `--testMatch "<absolute worktree path>/src/prototype/**/*.test.{js,jsx}"`.
- **Build**: `npm run build` → `Compiled successfully`, `main.css` 5.49 kB gzipped. It contains
  `.min-h-svh{min-height:100svh}` and `.whitespace-nowrap`.
- **Browser pass** (dev server on port 3014, headless Edge over CDP, both stopped afterwards), at
  360×740 / 375×812 / 768×1024 / 1280×800 / 1920×1080:
  - `#start` has `rgb(10,31,46)` and fills the viewport height (740 / 812 / 1024 / 800 / 1080).
  - The nav bottom is 80 at every width. The H1 top is 199 / 234 / 320 / 169 / 309, so it always clears
    the nav.
  - H1: Raleway 800, `text-transform: none`, 40.2 / 40.9 / 58.6 / 80 / 80 px, two lines at every
    width. Text "Wir schaufeln nicht – wir fräsen" (U+2013 and ä render correctly in the screenshots).
    From 1280 up it breaks as "Wir schaufeln nicht – / wir fräsen".
  - CTA: `rgb(240,138,36)` with `rgb(10,31,46)` text, 3 px radius.
  - The trust line's bottom (541 / 578) sits above the mobile call bar's top (668 / 740) at 360 / 375.
  - No `<img>` in the hero, and no horizontal overflow at any width.
  - Reduced motion (emulated at 375): identical layout. The hero has no motion of its own.

### Raised for a human

1. **Subline copy is new prototype copy (C8)**: "Wir entwickeln Grabenfräsen für den Energie- und
   Versorgungsnetzausbau." Confirm the wording. In particular, confirm whether "Grabenfräsen" (plural,
   a product family) or a singular / process wording ("ein Fräsverfahren für den Grabenbau …")
   describes the company more accurately.
2. **Trust-line placement.** It sits *below* the CTA, after a hairline rule, as a sign-off. Placing it
   above the H1 as an eyebrow would be equally valid within §4. This is a taste call.
3. **Two identical call CTAs at the top of the page.** From `md` up the nav CTA and the hero CTA both
   dial the same number, and both are visible on the first screen at 1280. Below `md` the hero CTA and
   the call bar coexist. That is two tab stops with the same name. The ticket asks for the CTA in the
   hero, so it stays. Note it for ticket 11, together with ticket 03's "one call stop per width" goal.
4. **CTA label.** The hero CTA shows the number at every width, not "Anrufen" (C16 governs the nav
   only). Say if the hero should read "Jetzt anrufen" instead.

## Review

### Review outcome (2026-10-15)

Review findings on the ticket-04 merge (920b348) and what happened to them (branch
`design-v2/04-hero-review`). The prototype suite is green after the fixes and after merging
`design/v2`.

**Fixed:**

- **The H1 test's comment said the en dash was written as an escape, but the source used a literal
  dash.** The expected string in `Hero.test.jsx` now spells it `\u2013`, so the comment is true and
  an editor can't silently swap the character. The verification evidence above was corrected to
  match.
- **`CALL_LABEL` was defined twice** (`Hero.jsx` and `Nav.jsx`, both `` `Anrufen: ${PHONE_DISPLAY}` ``).
  It is now exported once from `phone.js` and imported by both. Rename/move only: the value is
  unchanged, and `Nav.test.jsx` and `Hero.test.jsx` stay green. The one-line `Nav.jsx` edit touches
  ticket 03's finished file; it was approved for this review.

**Left for a human / ticket 11:**

- **Mobile nav clearance is exactly 0 px.** Below `sm`, `Section`'s top padding `py-20` (5rem) equals
  `h-nav` (5rem), so the hero's content box starts exactly at the nav's bottom edge. That is correct
  but coupled: shrinking `Section`'s padding or growing the nav would put the H1 under the nav, with
  only the vertical centring in `min-h-svh` as slack. jsdom has no layout, so no unit test can guard
  it. Ticket 11 should re-check it in its browser pass.
- **Subline wording** ("Wir entwickeln Grabenfräsen …", raised item 1): "Grabenfräsen" needs sign-off.
- **Trust-line placement** below the CTA (raised item 2) is a taste call.
- **Duplicate call CTA on the first screen** (raised item 3): two tab stops with the same name, which
  works against ticket 03's "one call stop per width" goal. For ticket 11.
- **The hero CTA label always shows the number** (raised item 4), not "Anrufen" / "Jetzt anrufen".
