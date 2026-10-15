# 09: Kontakt

**What to build:** The call — the page's only real goal — gets a named human being beside it, and the email route works without a contact form.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-agent

- [ ] The section is anchored at `#kontakt` on the navy background
- [ ] Marcus Auner is named, labelled "Marcus Auner · Geschäftsführung", with his existing portrait shown in the shared framed light card
- [ ] The phone number is the primary and most prominent action in the section
- [ ] The displayed number is `0176 618 77 599`, and the `tel:` target is `+49 176 618 77 599`
- [ ] Email uses `info@ingenieurbuero-auner.com`, with a `mailto:` that carries a pre-filled subject
- [ ] A copy-to-clipboard affordance copies the email address and reports success in a way a screen reader announces
- [ ] The copy affordance degrades to something usable where the clipboard API is unavailable
- [ ] There is no contact form, and no third-party processor is introduced — that would force a change to the privacy page, which is out of scope
- [ ] The phone CTA never renders white text on orange
- [ ] Focus states are visible against navy
- [ ] At small widths the section does not fight the fixed mobile call bar for space
