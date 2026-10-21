Status: ready-for-agent
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
