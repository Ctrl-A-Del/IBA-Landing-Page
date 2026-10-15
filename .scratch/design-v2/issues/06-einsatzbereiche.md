# 06: Einsatzbereiche

**What to build:** The four application areas stop floating as white tiles on navy and become a deliberate navy section.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** claimed

- [ ] The section is anchored at `#einsatzbereiche` on the navy background
- [ ] All four areas appear with their existing headings and descriptions:
      Stromtrassen — Erdkabel und Energieübertragung ·
      Wasserstoff & Fernwärme — Neue Leitungsnetze der Energiewende ·
      Wasser & Abwasser — Großformatige Versorgungsgräben ·
      Weitere Infrastruktur — Gas-, Drainage- und industrielle Leitungstrassen
- [ ] Cards are hard-edged rectangles with 1 px rules rather than rounded tiles with soft shadows
- [ ] The layout is single-column at ~375 px, two columns at ~768 px and four at ~1280 px, without an awkward orphan in the last row
- [ ] Body text on navy meets AA contrast
- [ ] Any reveal animation is inert under `prefers-reduced-motion: reduce`
- [ ] Umlauts, ß and ampersands render correctly throughout
