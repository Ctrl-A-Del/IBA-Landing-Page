# 02: Theme foundation and shared primitives

**What to build:** The visual vocabulary every section ticket consumes — colour, type, motion, and the shared CTA, section and card primitives — demonstrated on its own so later tickets compose rather than invent. The showcase renders at three breakpoints, under keyboard-only use, and with reduced motion forced.

**Blocked by:** 01 (Scaffold — branch, prototype tree, and page head)

**Status:** ready-for-agent

- [ ] A signal orange `#f08a24` is available as a token, together with a darkened hover/active shade derived from it
- [ ] The blue `#6372ff → #5ca9fb` gradient is no longer reachable as a CTA fill; it may survive for non-CTA decorative use only
- [ ] A neutral ramp covers body text on both navy and light surfaces, so text colour comes from tokens rather than ad-hoc opacity values
- [ ] Shadow and ring tokens exist for the framed light cards that sit over navy
- [ ] A fluid display scale is defined for Raleway 700–900, roughly 2.5rem → 5rem at the top of the scale, in sentence case with tight tracking
- [ ] A body scale is defined for Open Sans 300–800
- [ ] A CTA button primitive renders solid orange with navy `#0a1f2e` text and a 2–4 px radius, is never a pill, and can never render white text on orange
- [ ] The CTA button has visible hover and focus states, and its focus state is visible on both navy and light backgrounds
- [ ] A section primitive provides the navy, light and alternate-dark backgrounds plus the generous vertical rhythm
- [ ] A section primitive's anchors scroll clear of the sticky nav that ticket 03 adds
- [ ] A framed light card primitive exists for portraits over navy — needed by both Team and Kontakt, which are built independently and must not depend on each other
- [ ] A scroll-reveal hook wraps `IntersectionObserver` and is inert under `prefers-reduced-motion: reduce`: content is fully visible and nothing animates
- [ ] A showcase renders every token and primitive at ~375 / ~768 / ~1280 px
- [ ] The showcase is keyboard-navigable and correct with reduced motion forced
- [ ] No animation library, router or new runtime dependency is added, and no external PostCSS config is introduced
- [ ] Every utility class appears literally in the source — the content globs already cover the prototype tree, so no class name is assembled from strings
