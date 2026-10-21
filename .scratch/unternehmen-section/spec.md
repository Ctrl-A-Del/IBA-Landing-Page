Status: resolved
Type: enhancement

# "Das Unternehmen": Team and Über uns in one section

## Problem Statement

The landing page says who the people are but not what the company is. A Bauunternehmer who scrolls
to the Team section sees three portraits and one line, and nothing about whom the company builds for
or where the machine stands. The company owner has two paragraphs that answer this, and they need a
home on the page that does not break the background rhythm or invent a new section between Team and
Kontakt.

The page also names the machine three ways: "Grabenfräse" (hero, Team intro, mail subject),
"Fräsmaschine" (the Verfahren render's alt text) and, in the new copy as supplied, "Grabenmaschine".
Nothing records which name is right.

## Solution

The Team section becomes **"Das Unternehmen"**, one navy section with two parts:

1. **Team** — the existing intro line and the three framed portrait cards, unchanged.
2. **Über uns** — the two new paragraphs, separated from the portraits by a 1 px rule. (Layout verdict 2026-10-21, variant C: Über uns now comes first, Team below; see the note under user story 5.)

The section's anchor becomes `#unternehmen` and the nav link reads "Unternehmen". The section is
headed by the eyebrow "Das Unternehmen" and the H2 "Wer hinter der Grabenfräse steht"; each part has
an H3 ("Team", "Über uns"). The old H2 "Die Menschen hinter der Maschine" is retired.

The Über uns copy (approved by the company owner):

> {Company name} entwickelt Spezialmaschinen für den Energie- und Versorgungsnetzausbau. Unsere
> Zielgruppe sind Bau- und Spezialtiefbauunternehmen.
>
> Die Grabenfräse befindet sich in der Entwicklungsphase. Mit einem Prototyp wollen wir
> Aushubleistung, Energieverbrauch, Zuverlässigkeit und Arbeitssicherheit unter realen
> Einsatzbedingungen validieren.

The company name is the Company detail `Company.name` ("Ingenieurbüro-Auner GmbH"), read from the
content file. The second paragraph is phrased as intent because no prototype exists yet (C2: honest
development register).

"Grabenfräse" becomes the one name for the machine, recorded in the glossary, and the Verfahren alt
text follows it.

## User Stories

1. As a visitor, I want to read what the company develops, so that I know within seconds whether it is relevant to my business.
2. As a Bau- or Spezialtiefbau company, I want to see that I am the intended customer, so that I feel addressed and call.
3. As a visitor, I want to learn that the machine is in development and what a prototype is meant to validate, so that I know where the project stands without being promised performance.
4. As a visitor, I want the company facts next to the people behind it, so that "who" and "what" read as one story.
5. As a visitor, I want the Über uns text after the portraits, so that I meet the people first and then the company. **Reversed by the layout verdict of 2026-10-21 (variant C chosen from five prototype variants A to E): Über uns now comes first, in two text columns, then the divider, then Team.**
6. As a visitor, I want a clear visual break between the portraits and Über uns, so that I see two parts of one section, not a stray paragraph.
7. As a visitor, I want the section to stay on the dark background, so that the page keeps its alternating rhythm.
8. As a visitor, I want the nav link "Unternehmen" to take me to this section, so that the label matches what I find.
9. As a visitor on a phone, I want the nav to keep four links, so that it fits as before.
10. As a visitor, I want the section's heading to cover both people and company, so that the heading does not promise only portraits.
11. As a screen-reader user, I want the section named by its H2, so that the landmark list reads "Wer hinter der Grabenfräse steht".
12. As a screen-reader user, I want "Team" and "Über uns" as H3s under the section's H2, so that I can jump between the parts by heading.
13. As a screen-reader user, I want the dividing rule hidden from assistive technology, so that it is not announced as a separator with no meaning.
14. As a screen-reader user, I want the portrait list still named "Das Team", so that the list keeps its accessible name.
15. As a visitor, I want the company name in Über uns written exactly as in the footer and the Legal pages, so that the site never shows two spellings of the name.
16. As the company owner, I want to change the company name in one place, so that Über uns follows along with the footer, Impressum and Datenschutzerklärung.
17. As the company owner, I want the Über uns copy in the content file, so that I can change the wording without touching components.
18. As the company owner, I want the machine called "Grabenfräse" everywhere, so that the page uses one product name.
19. As a visitor using a screen reader on Verfahren, I want the render described as "3D-Darstellung der Grabenfräse mit ihren vier Modulen", so that the alt text uses the same name as the rest of the page.
20. As a visitor, I want Marcus Auner's portrait to still appear exactly once on the page, so that the page does not repeat his face.
21. As a visitor, I want the Team intro line kept, so that the portraits still have their lead-in.
22. As a visitor, I want the Über uns paragraphs in the same text column width as the section's opening text, so that line lengths stay readable.
23. As a visitor, I want the section's reveal animation to behave like the other sections', so that Über uns does not pop in differently.
24. As a maintainer, I want the component, its test and its content entry named after the section ("Unternehmen"), so that no "Team" name points at a section that is now more than Team.
25. As a maintainer, I want the anchor and nav tests to list `#unternehmen`, so that a stale `#team` cannot slip back.
26. As a maintainer, I want the approved-copy golden updated deliberately with exactly the new and retired strings, so that the copy test keeps proving the page renders only approved text.
27. As a maintainer, I want the single-source test to cover the company name in Über uns, so that a hardcoded name there fails.
28. As a future agent, I want the glossary to define "Grabenfräse" and name the rejected alternatives, so that new copy does not reintroduce "Grabenmaschine" or "Fräsmaschine".
29. As a future agent, I want DESIGN_PLAN.md to record the new section structure as a decision, so that the page structure table, the anchor list and decision B7 agree with the code.

## Implementation Decisions

- **Section module.** The Team section module is renamed to `Unternehmen` (component and its test). It keeps the `Section` primitive with `tone="navy"` and the `PortraitCard` usage unchanged (`fill`, empty alt, width hook). Its anchor is `unternehmen`; the section is labelled by its H2.
- **Heading hierarchy.** Eyebrow "Das Unternehmen" → H2 "Wer hinter der Grabenfräse steht" → H3 "Über uns" (followed by the two paragraphs) → rule → H3 "Team" (followed by the existing intro line and the portrait list). (Order per the 2026-10-21 verdict; originally Team first.) The H3s use an existing type step from the Tailwind config; no new type token is invented.
- **Divider.** A 1 px horizontal rule on navy (a `mist` ramp step at low contrast, matching the hard-edge language of B2), with extra top spacing above it. It is decorative: hidden from assistive technology, not an `<hr>` announced as a separator.
- **Über uns layout.** (Superseded by variant C, 2026-10-21: two text columns from `lg`, stacked below; the max-w-2xl column no longer applies to it.) Left-aligned, same `max-w-2xl` text column as the section opening, body copy in the navy tone's default text colour, wrapped in `Reveal` like the other blocks.
- **Content file shape.** The `Team` entry is replaced by `Unternehmen`:
  - `eyebrow`, `heading` for the section;
  - `team`: `heading` ("Team"), `intro` (unchanged line), `listLabel` ("Das Team"), `people` (unchanged);
  - `ueberUns`: `heading` ("Über uns"), `paragraphs` — a list of two strings. The first is stored **without** the company name ("entwickelt Spezialmaschinen …"); the component renders `Company.name` in front of it. No placeholder syntax is introduced, so every stored string is rendered verbatim and the "every string is used" check still holds.
- **Nav.** The `Nav.links` entry changes from `{ anchor: "team", label: "Team" }` to `{ anchor: "unternehmen", label: "Unternehmen" }`. The nav still has four links.
- **Verfahren.** `renderAlt` becomes "3D-Darstellung der Grabenfräse mit ihren vier Modulen". No other Verfahren change.
- **App composition.** The page order is unchanged apart from the rename: Hero, Verfahren, Einsatzbereiche, Warum wir, Unternehmen, Kontakt. The slot table in the App's header comment is updated.
- **Comments that cite "Team".** Cross-references in other modules' comments (Section tones, PortraitCard, Kontakt, Hero) are updated to name the Unternehmen section.
- **Glossary.** New entry: **Grabenfräse** — the machine the company develops; the one name the page uses for it ("die Maschine" is fine once it is named). Not *Grabenmaschine*, not *Fräsmaschine*.
- **DESIGN_PLAN.md.** A new decision row records: Team becomes "Das Unternehmen" with parts Team and Über uns, navy, anchor `#unternehmen`, nav label "Unternehmen", rule between parts, Über uns copy phrased as intent (C2). B7, §4 row 6, the §4.1 anchor list and the nav row are amended to match.
- **Delivery.** Branch `content/team-company-intro`, `npm test` and `npm run build` green, PR opened, not merged (merging deploys).

## Testing Decisions

- **A good test** observes what a visitor or a screen reader gets: the DOM of the mounted page or section, accessible names and roles, link targets. It never asserts on class names beyond what an existing test already pins through a shared constant, and never on the shape of the content file except where the copy tests already do.
- **Seam 1: the mounted page (`<App />`).** Prior art: the page integration test, the copy test, the single-source Company details test.
  - The landmark/anchor order becomes `start, verfahren, einsatzbereiche, warum, unternehmen, kontakt`; nav targets become `#start, #verfahren, #einsatzbereiche, #unternehmen, #kontakt`, with the visible label "Unternehmen". The Legal page nav hrefs (`/#unternehmen`) and section-id lists in the Legal page tests follow.
  - Marcus Auner's portrait appears exactly once, inside `#unternehmen`.
  - The approved-copy golden is edited by hand, and only for these changes. Removed: "Die Menschen hinter der Maschine", the old alt text, `#team`. Changed: the nav label and the eyebrow ("Team" → "Unternehmen", "Das Unternehmen"); "Team" stays, now as the H3. Added: "Wer hinter der Grabenfräse steht", "Über uns", both Über uns strings as stored, the new alt text, `#unternehmen`. A note beside the golden records that this edit is the company owner's approval from this session.
  - The single-source test adds a place `unternehmen` (the section's DOM) to the `Company.name` row, so a changed name must appear in Über uns and the old one nowhere there.
- **Seam 2: the section (`<Unternehmen />`).** Replaces the Team section test (renamed, existing assertions kept). New assertions:
  - The section is named by the H2 "Wer hinter der Grabenfräse steht", which is not the hero's trust line.
  - Two H3s, "Über uns" then "Team", in that document order (verdict 2026-10-21); the portrait list "Das Team" with three items follows the Team H3.
  - The Über uns part has two paragraphs before the Team part; the first starts with the company name from the content file.
  - The divider is not exposed to assistive technology (no `separator` role in the accessibility tree).
- No new seams. Other section tests (Nav, Verfahren, Kontakt, Footer) change only where they hardcode the old anchor, label or alt text.

## Out of Scope

- Any change to the portraits, the PortraitCard primitive or the people's names and roles.
- Adding Über uns (or any fifth link) to the nav.
- A redirect or alias for old `/#team` links; they fall back to the top of the page.
- Changing the hero subline, Verfahren intro or Warum wir copy, even where it overlaps the Über uns content.
- The static HTML shell's meta description and other meta tags.
- Any change to the Legal text.

## Further Notes

- Origin: grilling session on 2026-10-20. The company owner supplied the two paragraphs; decisions taken: one navy section "Das Unternehmen" (Team, then Über uns), `#unternehmen`, headings as above, "Grabenfräse" as the single name, prototype sentence rephrased as intent because no prototype exists yet.
- The company name is a Company detail (ADR 0003), so it is read from the content file, never written into the Über uns string.
