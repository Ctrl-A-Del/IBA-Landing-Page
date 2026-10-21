Status: ready-for-agent
Type: enhancement

# 03: "Partner gesucht" section with a pre-addressed email per Partnerrolle

**What to build:** A visitor scrolling past "Das Unternehmen" meets a light "Partner gesucht" section (`#partner`) before Kontakt: eyebrow, H2 "Gemeinsam arbeiten", intro, and two Partnerrollen (Anwender & Pilotpartner, Entwicklungspartner), each with sector label, description and a quiet outlined action that opens an email to the company address with the role's URI-encoded subject. Layout is the one approved in ticket 01. No orange, no form, no named contact, and no "Stelle", "Karriere" or "Bewerbung" wording. All copy is as in the spec.

**Blocked by:** 01 (Prototype the layout of "Partner gesucht"), 02 (Kontakt returns to navy and joins the footer).

- [ ] New top-level `Partner` content entry (`eyebrow`, `heading`, `intro`, `roles` with `sector`, `title`, `description`, `actionLabel`, `mailSubject`); every string renders verbatim and is used
- [ ] `Partner` section module on the `Section` primitive: light tone, anchor `partner`, named by its H2, wrapped in `Reveal`; layout per the approved prototype verdict
- [ ] Two H3s under the H2, in order; each sector label is read together with its role
- [ ] Two `mailto:` links built like Kontakt's, address read from `Contact.email` (never stored in `Partner`); each link's accessible name identifies its role; focus is visible
- [ ] Actions use the shared secondary button style, not the orange primary
- [ ] App order: Hero, Verfahren, Einsatzbereiche, Warum wir, Unternehmen, Partner, Kontakt; slot table comment updated
- [ ] Section tests (H2 name, two H3s, links and subjects, no primary styling, no forbidden words) and page tests (landmark order, Legal page section-id lists) updated
- [ ] Approved-copy golden edited by hand with exactly the new strings, plus a note recording the company owner's approval
- [ ] Single-source test shows a changed `Contact.email` appears in both partner links and the old one nowhere
- [ ] `npm test` and `npm run build` green
