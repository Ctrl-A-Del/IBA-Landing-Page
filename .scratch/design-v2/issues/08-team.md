# 08: Team

**What to build:** The three real people are presented on the dark background in consistent framed light cards, so their white studio backdrops stop reading as mistakes.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] The section is anchored at `#team` on the navy background, not on a light surface
- [x] All three people appear: Marcus Auner — Geschäftsführung · Klaus Auner — Einkauf · Jan Hönninger — Technischer Leiter
- [x] Every portrait sits in the same framed light card treatment, with identical framing and crop
- [ ] Portraits keep their 3:4 aspect ratio at every breakpoint and are never stretched or distorted, including the portrait with the least clean backdrop
- [x] The section heading is no longer `Maschinenbau aus NRW`, which now belongs to the hero
- [x] Any subtitle does not repeat the hero's trust line verbatim
- [ ] The layout is single-column at ~375 px and three across at ~1280 px
- [x] The framed-card treatment is the shared primitive across the page, not a local one-off

## Comments

### Review follow-up (agent, 2026-10-15)

Branch `design-v2/08-team-fixes`. Only `Team.jsx`, `Team.test.jsx` and this file were edited.

**Fixed:**

- **Width cap moved onto the primitive's hook.** The `<li>` no longer carries `mx-auto w-full
  max-w-xs md:max-w-none`; Team passes `className="mx-auto max-w-xs md:max-w-none"` to
  `PortraitCard`, the width-only hook its header documents. Ratio and crop stay inside the primitive.
- **Brittle "shared framed card" test.** It no longer compares full class strings. It now checks that
  each Team figure has the same rendered structure as a reference `PortraitCard` (image, then a
  caption with name and role) and that each `<img>` carries the same crop/ratio classes as the
  reference `<img>`, compared as a set. The caller's width `className` lands on the `<figure>` only,
  so it cannot break the comparison.
- **Redundant assertion removed.** The heading-level "not the hero trust line" check is gone; the
  section-level "no line repeats the trust line" test covers it.
- **Fixture shape.** The test's `PEOPLE` uses the component's `{ img, name, role }` objects.
- **Double announcement.** Portraits now have `alt=""`. The figcaption right under each photo names
  the person and their role, so an alt of the name made screen readers say it twice; the photo adds
  nothing a screen-reader user needs beyond that caption. New test (red first): every caption names
  its person and every portrait's alt is empty. (The installed `dom-accessibility-api` 0.3.0 does not
  derive a figure's name from its figcaption, so the test asserts the DOM rather than a role query.)
- **Intro copy vs C15.** "Drei Ansprechpartner, die …" implied three contact persons, but C15 makes
  Marcus Auner the one person you call. The C8-NEW intro is now "Geschäftsführung, Einkauf und
  Technik entwickeln die Grabenfräse gemeinsam." It stays in C2's "entwickeln" register and does not
  repeat the hero's trust line.

**Deferred to ticket 11's browser pass (no dev server was run here):**

- "Portraits keep their 3:4 aspect ratio at every breakpoint …" and "single-column at ~375 px and
  three across at ~1280 px" are left unticked. jsdom has no layout; both need the browser check.
- **Duplicated test shim.** The jsdom `getComputedStyle` pseudo-element workaround in
  `Team.test.jsx` duplicates the one in `Verfahren.test.jsx`. Ticket 11 could lift it into a shared
  test helper (e.g. `src/setupTests.js` or a prototype test util).

**Tests.** Full prototype suite green (29/29) with the `.claude/` worktree `--testMatch` workaround.
