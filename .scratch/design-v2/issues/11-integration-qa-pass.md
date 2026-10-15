# 11: Integration QA pass

**What to build:** The assembled page verified as a whole. This is the last ticket before a reviewer sees anything, so its output is the evidence they trust.

**Blocked by:** 03, 04, 05, 06, 07, 08, 09 and 10

**Status:** ready-for-agent

- [ ] The full page renders at ~375 / ~768 / ~1280 px with no horizontal overflow at any width
- [ ] Tab order through the whole page is logical, every interactive element is reachable, every one has a visible focus state, and nothing traps focus
- [ ] The lightbox is fully operable keyboard-only, and focus returns to its trigger on Esc, on the close button and on a backdrop click
- [ ] With reduced motion forced, the page is fully usable and readable: no scroll reveals fire, no transitions hide content
- [ ] No white text sits on the orange signal colour anywhere; the navy-on-orange pair is used instead
- [ ] A no-fabricated-content audit passes: no performance figures, references, testimonials, completed-project claims, certifications or invented counts
- [ ] Every factual claim on the page traces back to existing company information
- [ ] The displayed phone number and the `tel:` target match the agreed formats, and the number reads correctly when copied out of the page
- [ ] The email address is correct and the pre-filled subject is sensible
- [ ] Every internal anchor resolves to a section that exists and lands with its heading clear of the sticky nav
- [ ] Every referenced image loads; no dead image references remain
- [ ] The Impressum and Datenschutz pages are unchanged and still reachable
- [ ] A production build succeeds locally, and the build output contains no reference to the four previously broken favicon paths
- [ ] Findings are written down rather than silently fixed, so the reviewer can see what changed and why
