Status: ready-for-agent
Type: enhancement

# "Partner gesucht": a section that looks for development partners

> **Gate:** the layout does not exist yet and will be prototyped first (decision D5, ticket 01). No
> component, content-file entry or nav link is built until that layout is approved by a human. Until
> then this spec fixes content, behaviour and page structure only.

## Problem Statement

The Grabenfräse is a machine in development, and the company needs outside parties to finish it:
site-side users who can say what a trench job really demands, and engineering partners who can build
and validate components and a prototype with the company. The landing page has no place for either.
A Bauunternehmer who would gladly test the machine, or a Maschinenbau firm that could build part of
it, has no way to learn that the company is looking for them, and nowhere to say "I'm in".

The page also runs on one goal, a phone call (A2) from one audience, Bauunternehmen (A3). Any new
section that asks for something else risks pulling attention from the call, and a section that reads
like a job ad would misstate what the company is offering.

## Solution

A new light section, **"Partner gesucht"**, between "Das Unternehmen" and "Kontakt". It names the two
**Partnerrollen** (see the glossary), each with a short description and a quiet action that opens a
pre-addressed email. It is a secondary lane: it adds no form, no named contact person, no second
inbox and no orange, so the call stays the page's only primary action (A2, B3).

Copy (the two role sentences are the company owner's, verbatim):

- Eyebrow: **Partner gesucht**
- H2: **Gemeinsam arbeiten**
- Intro: **Wir entwickeln die Grabenfräse gemeinsam mit Partnern aus Bau und Industrie.**
- Role 1
  - Sector label: **Bau & Infrastruktur**
  - Title (H3): **Anwender & Pilotpartner**
  - Description: **Baustellenanforderungen und Einsatzbedingungen gemeinsam mit Anwendern validieren.**
  - Action: **Als Pilotpartner melden**, subject **Anfrage Pilotpartner**
- Role 2
  - Sector label: **Industrie & Entwicklung**
  - Title (H3): **Entwicklungspartner**
  - Description: **Maschinenbau, Komponenten und Prototyp gemeinsam entwickeln und validieren.**
  - Action: **Als Entwicklungspartner melden**, subject **Anfrage Entwicklungspartner**

Page structure after this change (amends C12 and C20):

| Slot | Section | Background |
| --- | --- | --- |
| 1 | Nav | navy |
| 2 | Hero | navy |
| 3 | Verfahren | light |
| 4 | Einsatzbereiche | navy |
| 5 | Warum wir | light |
| 6 | Das Unternehmen | navy |
| 7 | **Partner gesucht** (`#partner`) | **light** |
| 8 | Kontakt | **navy** (was light) |
| 9 | Footer | navy, joined to Kontakt with no hairline |

The nav gains a fifth link, **"Partner"**, between "Unternehmen" and "Kontakt".

## User Stories

1. As a Bauunternehmer, I want to see that the company is looking for site-side users to test the machine with, so that I can offer my sites and my experience.
2. As a Bauunternehmer, I want the role described as Anwender & Pilotpartner, so that I recognise myself in it.
3. As a Bauunternehmer, I want to see what a Pilotpartner does (validating site requirements and operating conditions), so that I can judge the effort before I write.
4. As a machine builder, I want to see that the company is looking for an Entwicklungspartner, so that I know a supplier relationship is possible.
5. As a machine builder, I want the role described as developing and validating mechanical engineering, components and the prototype, so that I can tell whether my firm fits.
6. As a visitor, I want each role headed by its sector (Bau & Infrastruktur, Industrie & Entwicklung), so that I find my own role at a glance.
7. As a visitor, I want the section to say the company seeks partners, not staff, so that I do not mistake it for a job listing.
8. As a visitor, I want no "Stelle", "Karriere" or "Bewerbung" wording, so that nothing implies employment.
9. As a visitor, I want a button that opens an email already addressed to the company, so that I do not have to look up the address.
10. As a visitor, I want the email subject pre-filled with the role I picked ("Anfrage Pilotpartner" or "Anfrage Entwicklungspartner"), so that I do not have to explain what the email is about.
11. As a visitor, I want the subject to arrive with umlauts and spaces intact, so that my mail client does not show garbled text.
12. As a visitor on a phone, I want the buttons to open my mail app, so that I can reply from where I am.
13. As a visitor, I want the section to promise nothing about pay, contract terms, timelines or machine availability, so that nothing on the page is untrue.
14. As a visitor, I want the section's tone to match the rest of the page ("gemeinsam", "validieren", "entwickeln"), so that it reads as part of the same honest development story (C2).
15. As a Bauunternehmer who came to call, I want the call button to stay the only orange element on the page, so that I never wonder which action matters.
16. As a visitor, I want the partner actions to look quieter than the call button, so that the page keeps one primary action.
17. As a visitor, I want a "Partner" link in the nav, so that I can jump to the section from anywhere on the page.
18. As a visitor on a Legal page, I want the "Partner" nav link to lead to the landing page's section, so that it works from every page like the other links.
19. As a visitor on a small phone, I want the nav to remain usable with five links, so that adding a link does not hide the others.
20. As a visitor, I want the nav order to follow the page order, so that the links read in the order I scroll.
21. As a visitor, I want the section on a light background between two navy ones, so that the page keeps its alternating rhythm.
22. As a visitor, I want Kontakt to be dark and flow into the footer without a divider, so that the page ends in one calm dark block.
23. As a visitor, I want the orange call button and the two-column Kontakt layout unchanged, so that nothing I already rely on moves.
24. As a screen-reader user, I want the section named by its H2 "Gemeinsam arbeiten", so that the landmark list tells me what the section is for.
25. As a screen-reader user, I want each role's title as an H3 under that H2, so that I can jump between the roles by heading.
26. As a screen-reader user, I want each button's accessible name to say which role it is for, so that two buttons are never both read as "melden".
27. As a screen-reader user, I want a sector label read together with its role, so that I hear "Bau & Infrastruktur" before the role it belongs to.
28. As a keyboard user, I want both buttons reachable with Tab and visible when focused, so that I can use them without a mouse.
29. As a visitor, I want the section's reveal animation to behave like the other sections', so that it does not pop in differently (B5).
30. As the company owner, I want the roles' wording in the content file, so that I can change it without touching components.
31. As the company owner, I want the destination address read from the one place the email address is kept, so that changing it there updates the partner buttons too (ADR 0003).
32. As the company owner, I want the mail subjects in the content file, so that I can change them without touching components.
33. As the company owner, I want the section to commit the company to nothing, so that no reply can be read as a binding offer.
34. As a maintainer, I want the page-order, anchor and nav tests to list `#partner` and the new Kontakt tone, so that a stale order cannot slip back.
35. As a maintainer, I want the approved-copy golden updated by hand with exactly the new strings, so that the copy test keeps proving the page renders only approved text.
36. As a maintainer, I want every new string in the content file to be used on the page, so that no dead keys appear.
37. As a future agent, I want DESIGN_PLAN.md to record the section, the new rhythm and the five-link nav, so that the plan, the glossary and the code agree.
38. As a future agent, I want the glossary term Partnerrolle, so that new copy does not reintroduce "Stelle" or "Bewerbung".

## Implementation Decisions

- **Meaning.** The section recruits partners, not employees. The glossary defines **Partnerrolle** with two instances, Anwender & Pilotpartner and Entwicklungspartner. The page never uses "Stelle", "Karriere", "Jobs" or "Bewerbung".
- **Audience (amends A3).** A3 gains a clause: Entwicklungspartner from Industrie & Entwicklung are a *secondary* audience. The primary audience stays Bauunternehmen. The Bau & Infrastruktur role is the same audience as A3.
- **Section module.** A new section module named `Partner`, built on the `Section` primitive with the light tone, anchor `partner`, labelled by its H2, wrapped in `Reveal` like its siblings. Layout is **not decided here**: the arrangement of the two roles (side by side, stacked, with or without a sector label above the H3) comes from the layout prototype.
- **Heading hierarchy.** Eyebrow "Partner gesucht" → H2 "Gemeinsam arbeiten" → intro line → one H3 per role. The sector label belongs to the role it introduces; how it is exposed to assistive technology is decided with the layout, but it must be read together with the role.
- **Content file shape.** A new top-level `Partner` entry: `eyebrow`, `heading`, `intro`, and `roles`, a list of two entries with `sector`, `title`, `description`, `actionLabel` and `mailSubject`. No placeholder syntax; every stored string renders verbatim, so the "every string is used" check holds.
- **Destination address.** Read from the existing email entry in `Contact` (a Company detail, ADR 0003), never written into `Partner`. The `mailto:` link is built the same way as the Kontakt link: URI-encoded subject. The existing Kontakt subject stays as it is; the role subjects belong to `Partner`.
- **Actions.** Two `mailto:` links, one per role, styled as a quiet secondary button: an outline in navy on the light section, hard edges (B2, B8). Not orange (B3 reserves orange for primary CTAs) and never white text on orange (§1.9). No copy-to-clipboard here; that stays in Kontakt. No form (C5).
- **Accessible name of the actions.** Each action's name includes the role it is for, so the two are distinguishable out of context. (The visible labels already differ: "Als Pilotpartner melden", "Als Entwicklungspartner melden"; an `aria-label` is needed only if the final visual label is shortened.)
- **Nav.** `Nav.links` gains `{ anchor: "partner", label: "Partner" }` between Unternehmen and Kontakt: five links. The row's existing sideways-scroll fallback is the safety net; no sizing change is made now. Whether five links fit at 360 and 375 px is checked during the layout prototype, with measured widths, and decided then.
- **Legal pages.** The nav links already switch to `/#anchor` there, so `/#partner` follows with no extra work.
- **Rhythm (amends C12; supersedes R6 Q4 / E4).** Kontakt returns to the navy tone; the footer follows it with no hairline or rule. Navy on navy needs no divider, which removes the 1.07:1 step that originally forced Kontakt to light. The orange call button and the C17 two-column Kontakt layout are unchanged. The Section primitive's header comment, which lists Kontakt among the light sections, is updated.
- **App composition.** Order becomes Hero, Verfahren, Einsatzbereiche, Warum wir, Unternehmen, Partner, Kontakt. The slot table in the App's header comment is updated.
- **Comments that cite the old rhythm or "four links"** in other modules (Section tones, Nav, Kontakt, Unternehmen) are updated to match.
- **DESIGN_PLAN.md.** One new decision, **C21**, records the section (copy, anchor, nav link, secondary lane, no orange, mailto per role). A3, C12 and C20 are amended (audience clause, new order, "five" nav links). §4 gets a new row 7 and renumbers, and the §4.1 anchor list adds `#partner`.
- **Delivery.** Branch `content/partner-recruiting`. `npm test` and `npm run build` green, PR opened, not merged (merging deploys, §1.2).

## Testing Decisions

- **A good test** observes what a visitor or a screen reader gets: the DOM of the mounted page or section, accessible names and roles, link targets. It does not assert class names beyond what an existing test already pins through a shared constant, and does not assert the shape of the content file except where the copy tests already do.
- **Seam 1: the mounted page (`<App />`).** Prior art: the page integration test, the approved-copy test, the single-source Company details test.
  - Landmark order becomes `start, verfahren, einsatzbereiche, warum, unternehmen, partner, kontakt`; nav targets `#start, #verfahren, #einsatzbereiche, #unternehmen, #partner, #kontakt`, with the visible label "Partner". The Legal page nav hrefs (`/#partner`) and section-id lists follow.
  - The approved-copy golden is edited by hand and only for this change: added are the eyebrow, H2, intro, both sector labels, titles, descriptions and action labels, the two mail subjects as they appear in the encoded `mailto:` hrefs, the nav label and `#partner`. A note beside the golden records this as the company owner's approval from this session.
  - The "all copy comes from the content file, and every string is used" test covers the new entry with no change.
  - The single-source test confirms the partner `mailto:` addresses follow `Contact.email`: a changed address appears in both partner links and the old one nowhere.
- **Seam 2: the section (`<Partner />`).** Prior art: the Unternehmen, Kontakt and Verfahren section tests.
  - The section is named by the H2 "Gemeinsam arbeiten".
  - Two H3s, "Anwender & Pilotpartner" then "Entwicklungspartner", under that H2, each with its description.
  - Two links to `mailto:` with the content file's address and the URI-encoded subject per role; each link's accessible name identifies its role.
  - No orange primary-button styling on the actions, through the shared button constant used elsewhere, not a literal class check.
  - None of the words Stelle, Karriere, Bewerbung appears in the section's text.
- **Existing seams touched only where they hardcode the old order or tone:** the Nav test (five links, order, hrefs), the Kontakt test (dark tone), the Section test (tone listing), the Footer test (no hairline between Kontakt and footer, if asserted there).
- No new seams.

## Out of Scope

- The layout of the section (prototype first, ticket 01).
- A contact form, a new email address, a named contact person or a phone number for this section (C5, C11).
- Any statement about pay, contract terms, timelines, machine availability, or the number of partners sought.
- Partner logos, testimonials or a list of existing partners (C7).
- Changes to Kontakt's content, its call block or the C17 layout; only its tone changes.
- Changes to the nav's sizing or a hamburger menu, unless the prototype shows five links do not fit, in which case that is a separate decision.
- A redirect or alias for any anchor.
- Any change to the Legal text.
- Rewording role 1's "mit Anwendern"; see Further Notes.

## Further Notes

- Origin: grilling session on 2026-10-21 with the company owner. Settled: partners not staff, secondary lane, placement after Unternehmen on light, Kontakt back to navy, fifth nav link "Partner", per-role `mailto:`, copy as above.
- **Possible rewording, deliberately not made.** Role 1 reads "…gemeinsam mit Anwendern validieren", yet the partner *is* the Anwender. The sentence is kept verbatim as supplied; "gemeinsam mit uns validieren" or "mit Anwendern aus der Praxis" are the alternatives if the owner prefers.
- The Bau & Infrastruktur role overlaps the primary audience, so a Bauunternehmer reading Einsatzbereiche and then this section meets the company twice: once as a supplier of a machine, once as a seeker of pilot sites. The intro line frames both as one development effort ("gemeinsam mit Partnern aus Bau und Industrie").
- The branch builds on `content/team-company-intro` (C20) and shares its history, including the five Unternehmen layout prototypes. If that branch merges first, rebase.
