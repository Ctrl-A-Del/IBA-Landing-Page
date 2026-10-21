Status: resolved
Type: prototype

# 07: Prototype a hamburger menu for phone and tablet

**What to build:** A throwaway prototype of a hamburger button that opens the nav links, for phones and also tablets (human request, 2026-10-21; the spec had ruled a hamburger out of scope unless five links did not fit). Ticket 06 measured that five links overflow below ~469 px, and the human wants the same menu on tablet too, so find where the switch from inline links to the hamburger should sit. The prototype lives apart from the real Nav and is switched in with one clearly marked line, removable in one step. It adds no real nav link, content entry or section.

**Blocked by:** none. Read ticket 06's Comments for measurements.

Produce a few distinct variants, switchable while viewing, e.g.: dropdown panel under the nav bar, full-width overlay, slide-in side panel. Check each at 360, 375, 768, 820, 1024 and 1280 px and recommend the breakpoint above which links show inline.

- [ ] Button is a real `<button>` with an accessible name, `aria-expanded` and `aria-controls`; opens and closes by touch and keyboard, Esc closes and returns focus to the button, selecting a link closes the menu
- [ ] All five links ("Verfahren", "Einsatzbereiche", "Unternehmen", "Partner", "Kontakt") are reachable; the orange call button stays the only orange (B3) and stays visible without opening the menu
- [ ] Open state does not break anchor scrolling or the transparent-over-hero to solid-on-scroll behaviour (B9); reduced-motion respected (B5)
- [ ] Options use existing Tailwind tokens and primitives
- [ ] Removable in one step, touches no real Nav code
- [ ] Verdict note template under `## Comments` for the human to choose
- [ ] `npm test` and `npm run build` green with the prototype switched out

**Not in this ticket:** the real hamburger or the real Partner link (ticket 04).

## Comments

### Prototype findings (agent, 2026-10-21)

Status is unchanged (`ready-for-agent`). No variant is picked here; a human chooses.

**View it.** Branch `ticket/07-hamburger-prototype`. Run `npm start`, open `/?menu=a` to `/?menu=c` and resize the window (or devtools device mode at 360, 375, 768, 820, 1024, 1280). Switch with the black bar at the bottom right ("menu proto") or the keys `;` (previous) and `'` (next). `0` shows the real nav with no prototype. `?bp=<px>` sets the width from which the five links are inline (default 1024); `?bp=0` forces inline, to measure the row. Dev only; production builds do nothing. The Unternehmen prototype (`?variant`, arrows) is still switched in on the base; ignore its bar.

**Isolation.** `src/prototype/HamburgerPrototype.jsx` holds everything. One marked side-effect import in `src/App.jsx` (`// PROTOTYPE: remove this line (hamburger menu, ticket 07)`) switches it in. It mounts its own React root and portals into the real nav bar: it hides the real link row from outside (`display:none`), adds its own five-link row (incl. "Partner", `#partner`, no section yet) at or above the breakpoint, and a hamburger button plus panel below it. The real Nav, `data.json`, sections and tests are untouched. To remove: delete that import line and the file. The nav's orange call button and the phone call bar are not touched and stay the only orange.

**Variants**

| Key | What it does |
| --- | --- |
| a | Dropdown: full-width navy panel drops from the bottom edge of the nav bar, rows 60 px tall, page dimmed |
| b | Overlay: full-width navy sheet from below the nav bar to the viewport bottom, big Raleway links (52 to 61 px rows), page not visible |
| c | Side panel: slides in from the right over the nav bar, 306 px wide at 360, 319 at 375, 320 from 768 up (`min(20rem, 85vw)`), own close button takes focus on open, page dimmed |

All use existing tokens only (`bg-brand`, `mist-*`, `rounded-edge`, `h-nav`, `top-nav`, `text-display-md`, `FOCUS_ON_DARK` outline). The button is a real `<button>` (44 x 44 px, accessible name "Menü", `aria-expanded`, `aria-controls="proto-menu"`). Open: the bar turns solid navy via inline colour only (React still owns `data-state`, so the transparent-to-solid scroll behaviour of B9 is untouched). Transitions use `motion-reduce:transition-none` (B5).

**Measured** (headless Edge 155, real Nav; breakpoint 1024).

Five inline links at `sm` and up (16 px semibold): Verfahren 77.6, Einsatzbereiche 121.7, Unternehmen 108.7, Partner 58.6, Kontakt 61.3 px. Row width: 524 px with `gap-x-6` (below 1024), 556 px with `gap-x-8` (1024 up). Nav CTA: 135 px ("Anrufen") from 768, 194 px (phone number) from 1024. Emblem ends at x = 72 (`px-6`, 48 px) plus a 24 px gap, so the row must start at x >= 96.

| Viewport | Inline row left edge (forced inline) | Fits inline? | With `bp=1024` |
| --- | --- | --- | --- |
| 360 | -196 | no, 292 px short | hamburger |
| 375 | -181 | no | hamburger |
| 600 | 44 | no, overlaps emblem | hamburger |
| 640 | 64 | no, overlaps emblem | hamburger |
| 700 | 124 | yes, no call button in nav (call bar below md) | hamburger |
| 768 | 33 | no, runs into emblem (63 px short) | hamburger |
| 820 | 85 | no, 11 px short | hamburger |
| 860 | 125 | yes, 29 px clear of emblem gap | hamburger |
| 1024 | 190 | yes | inline |
| 1280 | 391 | yes | inline |

Row left edge is `viewport - 735` from 768 to 1023 (CTA 135), `viewport - 834` from 1024 up, and `viewport - 576` from 640 to 767 (no nav CTA).

**Recommended breakpoint.** Technical minimum for five inline links with a clean gap to the emblem: 831 px (so 832 px) from md on; it also fits from 672 px up to 767 px, but there the phone call bar is the only call button and a hamburger sits better with the phone. So: hamburger below the breakpoint, inline from it. Use the existing token `lg` (1024 px): 768 and 820 (iPad portrait) get the hamburger, 1024 and 1280 get the inline row, and it is where the nav CTA already switches to the phone number. 832 px (`min-[832px]`) would put 834 to 1023 inline too, with only 0 to 190 px of slack, which is tight against translated German labels or a sixth link; not recommended. Below 768 hamburger always.

**Behaviour checked** (all variants, 360, 375, 768, 820; at 1024 and 1280 the prototype shows the inline row with five links and no hamburger):
- Open/close by click; `Enter` on the focused button opens; Esc closes and focus returns to the button in a, b, c (c focuses its own close button on open first).
- Tab order from the open button: Verfahren, Einsatzbereiche, Unternehmen, Partner, Kontakt, then onward. Closed panels are `visibility:hidden`, so their links are not in the tab order.
- Selecting a link closes the menu and the anchor scroll lands with the section at 80 px (the nav height) in all variants; smooth scroll untouched. No page horizontal overflow, no console errors.
- Nav background while open: navy at top of page too (inline style), `data-state` stays `transparent` at the top and flips to `solid` once scrolled.
- Orange call button: stays visible with the menu open (call bar below 768 px, nav CTA from 768 px; in c the side panel covers the right part of the nav bar at 768 and 820, so the nav CTA is hidden behind it there).
- All five links inside the viewport when open (rows 52 to 61 px high, above the 44 px touch target).
- Known limits: no focus trap, no scroll lock, a and b leave the rest of the page scrollable behind the panel.

**Tests and build.** With both prototype import lines reverted locally (not committed): `npm test` 141 passed, `npm run build` green. The committed state keeps the Unternehmen prototype switched in, as on the base, so 2 tests in `src/App.copy.test.jsx` fail there (pre-existing).

### Verdict note (human, 2026-10-21)

- Chosen variant: **a**, dropdown panel under the bar, **with the link text right-aligned** to sit under the right-hand hamburger.
- Breakpoint: hamburger below `lg` (1024 px), inline links from 1024 (the agent's recommendation; not contradicted by the human).
- Variant c's call-button overlap: not applicable.
- Prototype branch kept for reference: `ticket/07-hamburger-prototype`
