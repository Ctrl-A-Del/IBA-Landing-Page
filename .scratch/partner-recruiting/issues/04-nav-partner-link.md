Status: resolved
Type: enhancement

# 04: Fifth nav link "Partner"

**What to build:** The nav gains a "Partner" link between "Unternehmen" and "Kontakt" that jumps to `#partner` on the landing page and leads to `/#partner` from the Legal pages, like the other links. Per the verdicts of tickets 06 and 07, the nav also gets a real hamburger menu: below `lg` (1024 px) the five links collapse behind a hamburger button, from `lg` up they show inline. The menu is variant a of ticket 07 (a full-width navy dropdown panel under the bar) with **the link text right-aligned**, to match the hamburger on the right. Reference: branch `ticket/07-hamburger-prototype`, `src/prototype/HamburgerPrototype.jsx`; do not merge that branch. The orange call button stays the only orange and stays visible outside the menu.

**Blocked by:** 03 (Partner section), 06 and 07 (nav prototypes; 07 is the hamburger). Their verdicts replace the "per the 01 verdict" sizing wording below.

- [ ] `Nav.links` has `{ anchor: "partner", label: "Partner" }` between Unternehmen and Kontakt
- [ ] Nav order follows page order; Legal page nav hrefs include `/#partner`
- [ ] Nav test (five links, order, hrefs) and page nav-target lists updated
- [ ] Comments saying "four links" are corrected (Nav and any others)
- [ ] Pure prototype leftovers (src/prototype/HamburgerPrototype.jsx etc.) are NOT carried into the real Nav
- [ ] Hamburger is a real `<button>` named "Menü" with `aria-expanded` and `aria-controls`; below 1024 px it shows and the inline row is hidden, from 1024 px the reverse; Esc closes and returns focus to the button, picking a link closes the menu; the panel text is right-aligned
- [ ] The nav stays usable at 360, 375, 768, 820, 1024 and 1280 px, with the anchor offset still right, the transparent-to-solid scroll behaviour and reduced motion intact (B5, B9)
- [ ] Nav tests cover the hamburger behaviour, in the spirit of the Nav test prior art
- [ ] `npm test` and `npm run build` green

## Answer

Done in 3b63e1d on ticket/04-nav-hamburger, merged. One CSS-switched list serves inline and panel layouts. Layout at the six widths was not checked in a browser, only in jsdom.
