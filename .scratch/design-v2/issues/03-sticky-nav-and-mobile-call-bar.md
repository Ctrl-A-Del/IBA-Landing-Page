# 03: Sticky nav and mobile call bar

**What to build:** The page gains navigation it currently lacks entirely, and the phone number becomes reachable at every scroll position and every screen width — the cheapest available move toward the page's single goal.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-agent

- [ ] A sticky nav renders the emblem disc as a tight CSS crop of the existing logo plate; the full framed plate is not used in the nav — it is a JPEG, so transparency is impossible
- [ ] The nav links to Verfahren · Einsatzbereiche · Team · Kontakt, and each anchor lands on its section with the heading clear of the sticky bar
- [ ] Over the hero the nav is transparent; once scrolled it becomes solid navy with a subtle bottom border
- [ ] The transparent-to-solid transition is suppressed under `prefers-reduced-motion: reduce`
- [ ] The nav carries the orange phone CTA
- [ ] At `lg` and up the CTA displays `0176 618 77 599`; below `lg` it reads "Anrufen"
- [ ] The CTA's `tel:` target is always `+49 176 618 77 599`, while the displayed number uses the local format above
- [ ] The nav never auto-hides — it is reachable at every scroll position
- [ ] Below `md`, a fixed bottom "Anrufen" bar shows the number and is present from first paint
- [ ] The mobile bar does not overlap, cover or hide footer content
- [ ] The mobile bar is absent at `md` and above
- [ ] Every nav link and the CTA are keyboard-reachable with a visible focus state, and the mobile bar does not introduce a focus trap or a confusing duplicate tab stop
- [ ] No WhatsApp or other unpublished contact channel is offered
