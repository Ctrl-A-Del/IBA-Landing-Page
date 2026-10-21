Status: ready-for-agent
Type: enhancement

# 04: Fifth nav link "Partner"

**What to build:** The nav gains a "Partner" link between "Unternehmen" and "Kontakt" that jumps to `#partner` on the landing page and leads to `/#partner` from the Legal pages, like the other links. If ticket 01 measured that five links do not fit at 360 or 375 px and recommended a sizing change, apply that recommendation; otherwise the existing sideways-scroll fallback stays as is.

**Blocked by:** 03 (Partner section).

- [ ] `Nav.links` has `{ anchor: "partner", label: "Partner" }` between Unternehmen and Kontakt
- [ ] Nav order follows page order; Legal page nav hrefs include `/#partner`
- [ ] Nav test (five links, order, hrefs) and page nav-target lists updated
- [ ] Comments saying "four links" are corrected (Nav and any others)
- [ ] The nav remains usable at 360 and 375 px, per the 01 verdict
- [ ] `npm test` and `npm run build` green
