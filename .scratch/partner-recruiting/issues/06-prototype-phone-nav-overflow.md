Status: ready-for-agent
Type: prototype

# 06: Prototype the phone nav with five links

**What to build:** A throwaway prototype that answers one question: how should the nav behave below `md` now that "Partner" makes five links? Measured in ticket 01 (see its Comments): the link row has 272 px at 360 and 287 px at 375 but needs 381 px, so "Partner" is cut and "Kontakt" is off screen. Four links already overflow by 54 px at 360 today. The prototype lives apart from the real Nav and is switched in with one clearly marked line, removable in one step. It adds no real nav link, content entry or section.

**Blocked by:** none.

Produce a few distinct options, switchable while viewing, e.g.: (a) as is, sideways scroll; (b) scroll with a visible cue such as an edge fade; (c) fewer or shorter labels on phones; (d) a second line or a different arrangement of the link row, keeping the orange call button as the one primary action. Check each at 360, 375, 390 and 768 px with measured widths, and keyboard focus reachability of every link.

- [ ] Options use existing Tailwind tokens and primitives; the call button stays the only orange (B3)
- [ ] Every link is reachable by touch and keyboard at 360 px in each option
- [ ] Prototype is removable in one step and touches no real Nav code
- [ ] A verdict note template is left under `## Comments` for the human to choose
- [ ] `npm test` and `npm run build` green with the prototype switched out

**Not in this ticket:** adding the real link (ticket 04) or building the chosen option.
