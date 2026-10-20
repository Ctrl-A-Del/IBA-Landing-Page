# 01: Rename Team to "Das Unternehmen" and unify the machine name in the page copy

**What to build:** The Team section becomes the navy "Das Unternehmen" section. A visitor following the nav link "Unternehmen" lands on `#unternehmen`, sees the eyebrow "Das Unternehmen", the H2 "Wer hinter der Grabenfräse steht", then an H3 "Team" above the unchanged intro line and the three portraits. The Verfahren render is described with the same machine name as the rest of the page. The component, its test and its content entry are named after the section ("Unternehmen"), and nothing on the page still says `#team`.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Section module, its test and its content entry are renamed to `Unternehmen`; `Section` tone stays navy, `PortraitCard` usage unchanged
- [ ] Section is named by its H2 "Wer hinter der Grabenfräse steht" (not the hero's trust line); the old H2 "Die Menschen hinter der Maschine" is gone
- [ ] H3 "Team" precedes the intro line and the portrait list, which keeps its accessible name "Das Team" with three items
- [ ] Anchor is `unternehmen`; nav has four links, the Team one now `{ anchor: "unternehmen", label: "Unternehmen" }`
- [ ] Verfahren `renderAlt` is "3D-Darstellung der Grabenfräse mit ihren vier Modulen"; its test follows
- [ ] Landmark/anchor order tests read `start, verfahren, einsatzbereiche, warum, unternehmen, kontakt`; nav targets and Legal page nav hrefs (`/#unternehmen`) and section-id lists follow
- [ ] Marcus Auner's portrait still appears exactly once, inside `#unternehmen`
- [ ] Approved-copy golden is edited by hand, only for these changes (removed: old H2, old alt text, `#team`; changed: nav label, eyebrow; added: new H2, new alt text, `#unternehmen`), with a note that the edit is the company owner's approval from this session
- [ ] Comments citing "Team" in Section tones, PortraitCard, Kontakt, Hero and the App slot table name the Unternehmen section
- [ ] `npm test` and `npm run build` green
