Status: resolved
Type: prototype

# 01: Prototype the layout of "Partner gesucht"

**What to build:** A throwaway prototype that answers one question: how should the "Partner gesucht" section look? Follow the earlier Unternehmen layout prototypes (D5): the prototype lives apart from the real section modules and is switched in with a single, clearly marked line in the App, so it can be reverted in one step. No content-file entry, no real nav link and no real `Partner` section module are added by this ticket. Use the copy from the spec verbatim, hardcoded inside the prototype.

**Blocked by:** none.

**The question to answer:** how should two Partnerrollen be arranged on a light section so that they read as two equal, quiet options and not as a competing call to action?

Produce a few distinct layouts (at least: roles side by side, roles stacked, and a variant without a sector label above the H3), switchable while viewing, each shown with the real spec copy. Each variant must be checked at 360, 375, 768 and 1280 px.

Also settle the two open points the spec hands to this prototype, with measured evidence:

- [ ] Do five nav links fit at 360 and 375 px, or does the row scroll sideways? Report the measured widths and recommend: leave as is, or a separate decision.
- [ ] How do the light Partner section and the navy Kontakt section, which now joins the navy footer, read together? Confirm the Kontakt-to-footer join looks intended with no divider.

**Acceptance:**

- [ ] The variants use only existing Tailwind tokens and the existing button and type primitives; no orange on the partner actions (B3)
- [ ] Both actions are `mailto:` links with the spec's labels and URI-encoded subjects
- [ ] Each variant's heading order is eyebrow, H2, intro, then one H3 per role
- [ ] Reduced-motion behaviour matches the other sections (B5)
- [ ] The prototype is removable in one step and touches no real section module
- [ ] A short verdict note records which layout the human chose and why, for the follow-up ticket that builds the real section
- [ ] `npm test` and `npm run build` green with the prototype switched out

**Not in this ticket:** building the real section, the nav link, content-file entries, golden changes, or the Kontakt tone change. Those are cut as a follow-up ticket once a layout is chosen.


## Comments

### Prototype findings (agent, 2026-10-21)

Status is unchanged (`ready-for-agent`). No layout is picked here; a human chooses.

**View it.** Branch `ticket/01-partner-prototype`. Run `npm start`, open `/?partner=A` to `/?partner=D`. Switch with the black bar at the bottom or the `[` and `]` keys. The bar and the variants are dev only. Production builds render the real Kontakt and nothing else.
The Unternehmen prototype from f1d4fe0 is still switched in on the integration branch and owns `?variant` and the arrow keys, so this one uses `?partner` and `[` `]`. Its own bar shows up too; ignore it.

**Isolation.** `src/prototype/PartnerPrototype.jsx` holds everything. One marked line in `src/App.jsx` imports it in place of Kontakt (`// PROTOTYPE: revert to ./components/sections/Kontakt`). It renders the variant, then a look-alike of Kontakt in the navy tone (same structure, real `CTA`), then the real Footer follows. In dev it also clones one "Partner" `<li>` into the real nav so five links can be seen. No real section module, Nav, `data.json` or test is touched. Copy is the spec's, hardcoded. To remove: revert that one App line and delete `src/prototype/PartnerPrototype.jsx`.

**Variants** (each: eyebrow, H2, intro, then one H3 per role; actions are `mailto:` links with `encodeURIComponent` subjects, navy outline, hard edges, no orange, same `Reveal` as the siblings so reduced motion behaves as in the other sections):

| Key | Layout | Notes from the measured renders |
| --- | --- | --- |
| A | Side by side, top rule per role, sector label above the H3 | Cleanest "two equal options". Stacks below `md`. Partner section 925/926/736/775 px tall at 360/375/768/1280. |
| B | Stacked rows: sector + title, description, action | Reads as a list or table, quietest. Needed `col-span-5` for the title: at `col-span-4` "Entwicklungspartner" broke mid-word at 1280. The second button wraps to two lines at 1280, so the two buttons are unequal. 964/965/986/876 px. |
| C | Side by side, bordered boxes, no sector label | Fewest words. Loses the sector cue (user story 6) and the label that tells a Bauunternehmer which role is theirs. 932/906/750/789 px. |
| D | Heading left, roles stacked right | Strongest hierarchy. Left column is empty under the intro at 1280, and it differs most from the other sections. 949/950/971/848 px. |

Headings were identical in all variants and widths: `H2 Gemeinsam arbeiten`, `H3 Anwender & Pilotpartner`, `H3 Entwicklungspartner`. Sector label is exposed by naming each role `<article>` with `aria-labelledby="<sector id> <title id>"`. Hrefs: `mailto:info@ingenieurbuero-auner.com?subject=Anfrage%20Pilotpartner` and `...Anfrage%20Entwicklungspartner`. No orange background inside the section in any variant. Horizontal page overflow: 0 px in all 16 renders. No console errors.

**Open point 1: do five nav links fit?** Measured in headless Edge 155 against the real Nav, with a fifth link added.
Link widths on phones: Verfahren 61.8, Einsatzbereiche 97.1, Unternehmen 86.8, Partner 46.6, Kontakt 48.4 px (768 and up: 77.6, 121.7, 108.7, 58.6, 61.3).

| Viewport | Link row visible (clientWidth) | Content width, 5 links | Sideways overflow, 5 links | Overflow, 4 links (today) |
| --- | --- | --- | --- | --- |
| 360 | 272 | 381 | 109 | 54 |
| 375 | 287 | 381 | 94 | 39 |
| 390 | 302 | 381 | 79 | 24 |
| 414 | 326 | 381 | 55 | 0 |
| 768 | 489 | 489 | none | none |
| 1280 | 816 | 816 | none | none |

- Five links do not fit at 360 or 375. The row scrolls sideways, as the spec's fallback says. Needs about 469 px of viewport to fit.
- At 360 and 375 "Verfahren", "Einsatzbereiche" and most of "Unternehmen" show; "Partner" is cut by the right edge (its box spans x 342 to 388) and "Kontakt" (396 to 445) is fully off screen until scrolled.
- The four-link nav already overflows today at 360 (by 54 px) and 375 (by 39 px), so "Kontakt" is already partly cut there. The fifth link adds 55 px.
- The row has no scroll cue, but the mobile call bar is the call affordance below `md`, so the page's one goal is not hidden.
- Recommendation: leave as is for this section (the spec's fallback holds, no sizing change). Raise a separate decision about the phone nav (for example a scroll cue, or dropping Kontakt/Partner from the phone row in favour of the call bar). No spacing or size tweak makes five links fit at 360, since 109 px would have to go.

**Open point 2: light Partner, navy Kontakt, navy footer.** Computed backgrounds: Partner `rgb(255,255,255)`, Kontakt `rgb(10,31,46)`, Footer `rgb(10,31,46)`. Gap between Kontakt bottom and Footer top: 0 px at all four widths. The Footer has no border or rule (`navy py-12 sm:py-16`).
- White to navy is a hard step (about 18:1), so the section change reads as intended. The page alternates Unternehmen navy, Partner light, Kontakt navy, which keeps the rhythm.
- Kontakt flowing into the footer reads as one dark block with no divider needed. The join looks intended.
- Side effect to be aware of: below the email the dark block is Kontakt's `py-36` (144 px at `lg`) plus the footer's 64 px top padding, so about 208 px of empty navy sits between the contact content and the footer text at 1280 (about 128 px at 360: `py-20` plus the footer's `py-12`). It is calm, not broken. A follow-up could reduce Kontakt's bottom padding, but that is outside this ticket.
- The orange call button on navy is the page's only orange; the white-to-navy step also makes it stand out more than the light Kontakt did.

**Tests and build.** With both prototype lines reverted (Partner and the leftover Unternehmen one): `npm test` 140/140 pass, `npm run build` ok. With the Unternehmen prototype switched in (as on the base) `src/App.copy.test.jsx` has 2 failures, because the dev switcher bar text is rendered. Not caused by this ticket. The committed state keeps both prototypes switched in, like f1d4fe0.

### Verdict note (human, 2026-10-21)

- Chosen layout: **C**, two bordered boxes side by side, no sector label.
- Why: not given beyond the choice.
- Sector label above the H3: **drop**. The sector strings ("Bau & Infrastruktur", "Industrie & Entwicklung") are therefore not rendered; ticket 03 drops the `sector` key so no dead content key remains. This departs from spec user stories 6 and 27.
- Nav with five links: separate decision, prototype in ticket 06.
- Kontakt navy to footer join: accepted as measured (no divider). The extra navy padding below the email is left alone.
- Follow-up tickets: 03 (section, amended for C), 06 (nav overflow prototype).
- Prototype branch kept for reference: `ticket/01-partner-prototype` (variant C in `src/prototype/PartnerPrototype.jsx`)
