# 11: Integration QA pass

**What to build:** The assembled page verified as a whole. This is the last ticket before a reviewer sees anything, so its output is the evidence they trust.

**Blocked by:** 03, 04, 05, 06, 07, 08, 09 and 10

**Status:** ready-for-human

- [x] The full page renders at ~375 / ~768 / ~1280 px with no horizontal overflow at any width
- [x] Tab order through the whole page is logical, every interactive element is reachable, every one has a visible focus state, and nothing traps focus *(ticked in the review follow-up, after the showcase was removed: 13/13 stops at 375/768/1280)*
- [x] The lightbox is fully operable keyboard-only, and focus returns to its trigger on Esc, on the close button and on a backdrop click *(caveat F4: in Edge, Tab from the open dialog alternates between "Schließen" and leaving the document, which contradicts ticket 05's notes "focus stayed inside the dialog every time")*
- [x] With reduced motion forced, the page is fully usable and readable: no scroll reveals fire, no transitions hide content
- [x] No white text sits on the orange signal colour anywhere; the navy-on-orange pair is used instead
- [x] A no-fabricated-content audit passes: no performance figures, references, testimonials, completed-project claims, certifications or invented counts
- [x] Every factual claim on the page traces back to existing company information *(caveat: "Schwalmtal" in the meta description was first traced only to DESIGN_PLAN §1.8; the review follow-up found the company source, master `public/datenschutz.html` §2 "41366 Schwalmtal". Copy flags C1/C2 stay open for the C8 review)*
- [x] The displayed phone number and the `tel:` target match the agreed formats, and the number reads correctly when copied out of the page *(caveat: the `tel:` target is `tel:+4917661877599`, not literally C16's `+49 176 618 77 599` as `data.json` stores it; spaces stripped per RFC 3966 (ticket 03). Escalated as E8 for confirmation)*
- [x] The email address is correct and the pre-filled subject is sensible
- [x] Every internal anchor resolves to a section that exists and lands with its heading clear of the sticky nav
- [x] Every referenced image loads; no dead image references remain
- [x] The Impressum and Datenschutz pages are unchanged and still reachable
- [x] A production build succeeds locally, and the build output contains no reference to the four previously broken favicon paths
- [x] Findings are written down rather than silently fixed, so the reviewer can see what changed and why

## Comments

### QA report (agent, 2026-10-16)

Branch `design-v2/11-integration-qa`, based on `design/v2` @ `711a8ec`. 13 of 14 boxes are ticked.
The tab-order box is not ticked: the page itself passes, but the dev-only token showcase is still
rendered after the footer and puts 5 extra stops in the tab order (escalation E1).

> **Superseded in part by the [review follow-up](#review-follow-up) below:** the showcase is
> removed and box 2 is ticked (14/14); boxes 3, 7 and 8 carry caveats; the evidence now lives in
> the repo under `.scratch/design-v2/evidence/11/`.

**How it was checked**

- **Automated (Jest):** new `src/prototype/Page.integration.test.jsx`, 11 tests. The seam is the
  whole page as `App.jsx` mounts it (`<Prototype />`), observed through the DOM, plus the files in
  `public/`. Content audits read only the visitor-facing part (`nav`, the call bar, `main`,
  `footer`), not the showcase. No user was available to confirm the seam, so the precedent from
  tickets 03–10 was followed. These are guards over code that already exists, so they passed when
  first written. Each was then mutation-checked and went red: a nav href changed to `#teams`; an
  image path changed to `klaus.jpg`; `className="text-white"` added to the hero CTA; the mail
  subject cut to "Anfrage"; "seit 1998" added to the trust line; "Referenzen auf Anfrage." added to
  the Team intro; the display number changed by one digit. The legal-page hash test and the
  favicon test were **not** mutation-checked, because both would mean editing red-list files
  (`public/*.html`), even temporarily. *(Done in the review follow-up, with temporary edits that
  were reverted and never committed.)*
- **Full suite:** 68/68 green across 10 suites. It was run with the `.claude/` worktree workaround
  from ticket 03:
  `CI=true npx react-scripts test --watchAll=false --testMatch "<abs worktree>/src/**/*.test.{js,jsx}"`.
  This is a deviation from DESIGN_PLAN §2.10 ("`npm test` — nothing else"): CRA's default
  `testMatch` ignores files under a `.claude/` path, so `npm test` in this worktree finds no tests.
  The runner and the config are the same; only the file pattern is passed explicitly.
- **Build:** `CI=true BUILD_PATH=build-11 npm run build` (the output directory was deleted afterwards).
- **Browser:** headless Edge 155 (`Edg/155.0.4283.45`), driven over the Chrome DevTools Protocol by
  a Node 22 script with no dependencies. It ran against the `build-11` production build, served
  on `127.0.0.1:3011` by a small static server with no SPA fallback, so 404s are real. Viewports
  were 360×740, 375×812, 768×1024 and 1280×800, with mobile emulation below 768. Playwright and
  Puppeteer are not installed; neither was needed.
  - Scripts: `.scratch/design-v2/evidence/11/run1/qa.js` and `run1/serve.js` (plus `run1/t.sh`,
    the test-runner wrapper; its `cd` points at the original QA worktree).
  - Raw output: `.scratch/design-v2/evidence/11/run1/out-part1.txt`, `out-p2.txt`, `out-p3.txt`,
    `out-p4.txt` and `results.json`.
  - Screenshots: `.scratch/design-v2/evidence/11/run1/shots/`. The full set (16 MB: full-page,
    per-section and reduced-motion captures) stayed in the session scratchpad; the repo keeps the
    key ones: `focus-1280-01/07/10/12.png`, `lightbox-open-375.png`,
    `anchor-kontakt-375-shipping.png`, `bottom-<w>-shipping.png`, `brand-nav-emblem.png`,
    `brand-footer-plate.png`, `section-768-team-0.png` (F7), `section-375-kontakt-0.png` (F5/F6)
    and `clipboard-375-grant-true.png`. Screenshots named below that are not in that list were
    not kept.
  - Re-run: serve a build with `node serve.js <build dir> 3011`, then
    `node qa.js http://127.0.0.1:3011/ 1,2,3,4,5,6,7,8,10,11,12`.
  - **"Shipping state":** wherever the showcase would distort a measurement, the script removes
    every node after `<footer>` from the live DOM, then re-measures. The `#kontakt` anchor and the
    footer-vs-call-bar clearance were measured this way. Both states are reported.

#### Per-box results

| # | Box | Result | Evidence |
| --- | --- | --- | --- |
| 1 | No horizontal overflow at ~375/768/1280 | **pass** | `scrollWidth − clientWidth` = 0 at 360, 375, 768 and 1280 (body too). No element extends past the viewport outside an `overflow` box. Measured after scrolling through the whole page, so every reveal had fired. |
| 2 | Tab order / reachability / focus visible / no trap | **pass for the page, fail as rendered** (not ticked) | Tab from page load at 375 and 1280. 375: emblem → Verfahren → Einsatzbereiche → Team → Kontakt → call bar → hero CTA → "Größer ansehen" → Kontakt call → mail link → "Adresse kopieren" → Impressum → Datenschutzerklärung. 1280 is the same, with the nav CTA in place of the call bar. Order follows the DOM and the reading order. Every page stop matched `:focus-visible` and had a 2 px outline: white on navy and footer, navy on white for "Größer ansehen"; the CTAs add the navy ring. The number of stops reached equals the number of tabbable elements (18/18). After the last stop focus leaves the document, so nothing traps it. Screenshots: `focus-1280-01…13.png`. **But** 5 of the 18 stops belong to the showcase after the footer ("Anrufen", "E-Mail schreiben", "Als button — 0 gedrückt", "Kompakter CTA", "Sprungmarke zu tone=navy") → E1. **Review follow-up: pass, ticked** (showcase removed; 13/13 at 375/768/1280, see below). |
| 3 | Lightbox keyboard + focus return | **pass** | At 375×740 and 1280×800: Tab reaches "Größer ansehen"; Enter opens it (`open`, `:modal`, focus on "Schließen"). Esc closes it, and focus returns to the trigger with `:focus-visible`. Enter on "Schließen" closes it, focus returns. A click on the enlarged render leaves it open. A click on the backdrop corner closes it, and focus returns to the trigger. Pointer path: clicking the inline render opens it, Esc returns focus to the render `<img>`. Screenshot `lightbox-open-375.png`. See finding F4 on what Tab does inside the dialog. |
| 4 | Reduced motion | **pass** | `prefers-reduced-motion: reduce` was emulated at 375 and 1280, and the page read **before any scroll**: all 13 `[data-revealed]` are `"true"`, opacity `1`, transform identity, transition-duration `1e-05s`. Nav transition is `none`, `html` scroll-behavior is `auto`. There are 0 elements with opacity 0 or `visibility:hidden` inside the landmarks (the closed dialog is excluded). Control run without reduced motion: 13/13 reveals were `"false"` before scrolling, so the check is meaningful. Screenshots: `reduced-motion-<w>-noscroll.png`. |
| 5 | No white on orange | **pass** | Jest: every element with a `bg-signal*` class in the page carries `!text-brand`, and it and its descendants have no `text-white*` (mutation-checked). Browser: 16 text and SVG elements sit on a computed orange background (`#f08a24`/`#d4730f`/`#cd6e0e`) at 375 and 1280. Their only computed colour is `rgb(10, 31, 46)`, and none is white. |
| 6 | No fabricated content | **pass** | Jest: in the visible copy plus all `alt`/`aria-label`, the only digits are the phone number, the module numerals 01–04 and "3D". A list of banned terms finds nothing (Referenz, Kunde, Testimonial, zertifi, ISO/TÜV/DIN, realisiert, im Einsatz, bewährt, garantier, Jahre Erfahrung, %, Tagesleistung, "bis zu", Partner, …). A manual read of every string agrees (see the claims audit below). |
| 7 | Every claim traces to company info | **pass, with copy calls flagged** | See the claims audit below. Every claim has a source. Three wordings are inferences rather than quotations (C1–C3 in the audit); they are flagged for the human copy review that C8 already requires. **Review follow-up:** C3 ("Schwalmtal") was traced only to DESIGN_PLAN §1.8, which is not a company source; it now traces to master `public/datenschutz.html` §2 (see below). |
| 8 | Phone formats + copy-out | **pass** | Jest: all 4 page `tel:` links are `tel:+4917661877599` (the `data.json` number with spaces stripped), with `aria-label` "Anrufen: 0176 618 77 599" and the display text "0176 618 77 599" (C16). Browser: selecting each link's contents and reading `getSelection().toString()` gives "0176 618 77 599" for the nav CTA (≥ lg), hero and Kontakt, and "Anrufen\n0176 618 77 599" for the mobile bar. The number survives copying intact. **Review follow-up:** the `tel:` target deviates literally from C16's wording (`+49 176 618 77 599`, as `data.json` stores it) → E8. |
| 9 | Email + subject | **pass** | Jest: exactly one `mailto:`, to `info@ingenieurbuero-auner.com` (`data.json`). The only parameter is `subject` = "Anfrage zur Grabenfräse", percent-encoded (`Anfrage%20zur%20Grabenfr%C3%A4se`). Browser: the copy button in a secure context (127.0.0.1) with clipboard permission granted puts exactly `info@ingenieurbuero-auner.com` on the clipboard, and the status reads "E-Mail-Adresse kopiert.". The fallback over plain `http` on a non-localhost origin and the long-press on real devices were **not** checked (F11). |
| 10 | Anchors resolve + land clear of the nav | **pass** | Jest: every `#` link resolves to a `<section>` in `<main>`; the anchors are `start, verfahren, einsatzbereiche, warum, team, kontakt`, in order. Browser: each nav link was clicked at 375, 768 and 1280, and positions were read after scrolling settled. Every section's top is at y = 80 (= nav bottom, the `scroll-margin-top` contract). Heading tops: 190 (375), 222 (768), 254 (1280); `#kontakt` at 375 is 521, because the portrait comes first (F5). `#start` H1: 234/320/169. All are clear of the 80 px nav. The same results hold with the showcase removed, so `#kontakt` still reaches y = 80 when the footer is the last element. |
| 11 | Images load | **pass** | Jest: every `<img>` `src` exists in `public/`. Browser: after each image was scrolled into view, all 10 `<img>` were `complete` with natural sizes at 768 and 1280 (fraese 1342×738, logo 540×935, marcus 339×453, klaus 385×513, jan 481×642), and all were OK at 360/375 in the layout pass. The only non-2xx request was `/favicon.ico` 404 (F3), which is not one of the four broken paths. |
| 12 | Legal pages unchanged + reachable | **pass** | `git diff master -- public/impressum.html public/datenschutz.html` is empty (0 lines). Jest: the LF-normalised SHA-256 of both files equals master's, and the footer links `/impressum.html` and `/datenschutz.html`. Build: both are byte-identical in `build-11/` (`cmp`) and served 200. |
| 13 | Build + no favicon paths | **pass (after fix F1)** | Before the fix, `CI=true npm run build` failed with "Treating warnings as errors because process.env.CI = true. Failed to compile." (two `jsx-a11y/alt-text` warnings in `Verfahren.jsx`). After the fix it is `Compiled successfully` (main.js 54.95 kB, main.css 5.94 kB gzipped). `grep -rlE "favicon\.ico\|apple-touch-icon" build-11` finds nothing. The only `<link>` in the built `index.html` is the stylesheet. Jest also guards `public/index.html` attribute values. |
| 14 | Findings written down | **pass** | This comment. The one code fix (F1) is its own commit. |

#### Items deferred to ticket 11 by tickets 03–10

| From | Item | Result |
| --- | --- | --- |
| 03, 09, 10 | Footer / Kontakt not covered by the mobile call bar | **pass.** Showcase removed, scrolled to the end: the legal links' bottom is at 617 (360) / 690 (375) against a bar top of 668 / 740. The footer ends at the bar's edge (740.09 vs 740). Screenshot `bottom-375-shipping.png`. |
| 03 | Nav at 360 | **pass.** No page overflow at 360. All four links are visible (`section-375-*.png`; the 360 full page is `page-360.png`). |
| 04 | Hero clears the nav at mobile (0 px padding slack) | **pass.** H1 top is 199 (360) / 234 (375) against a nav bottom of 80. The vertical centring gives about 120 px of slack. |
| 06 | Long compounds in other H1/H2s at 375 | **pass.** Screenshots of every section at 375: no mid-word breaks. "Versorgungs- / netzausbau" breaks at the soft hyphen. |
| 08 | Portraits 3:4 at every breakpoint; 1 column at 375, 3 across at 1280 | **pass.** Rendered h/w = 1.3333 for all three portraits at 360/375/768/1280. 1 column × 3 rows at 360/375, 3 × 1 at 768/1280. |
| 08 + 09 (parallelisation §3) | Team and Kontakt Marcus crops identical | **pass.** Both `<img>` have the identical class list (`aspect-[3/4] w-full rounded-edge object-cover object-top`) and identical computed `object-fit: cover`, `object-position: 50% 0%`, `aspect-ratio: 3 / 4`, rendered ratio 1.3333 at every width. Only the card width differs (Team 296/195/323 px, Kontakt 200/264/264 px), which is the intended width hook. |
| 09 | Focus visible against navy | **pass.** Mail link and "Adresse kopieren" have a 2 px white outline (`focus-1280-10/11.png`). |
| 10 | Plate not stretched | **pass.** Rendered h/w 1.7314 vs natural 1.7315, at 112 px (mobile) and 128 px (≥ sm) wide. |
| 03 + 10 (parallelisation §3) | Nav emblem and footer plate read as the same brand | **pass (visual).** The emblem crop shows the gear-and-eagle disc with its orange teeth (`brand-nav-emblem.png`, 4×). The footer plate shows the same disc above "INGENIEURBÜRO AUNER" (`bottom-375-shipping.png`). It is the same JPEG, so colours match exactly. |
| 10 | Footer visually distinguishable from navy Kontakt | **measured, needs a decision** → E4. Footer `rgb(20,23,26)` vs Kontakt `rgb(10,31,46)`, about 1.07:1. The separation comes from the 1 px `rgba(111,128,144,.4)` top rule. |

#### Factual-claims audit

Every statement a visitor reads (including `alt`, `aria-label` and the `<head>` meta, which a
shared link displays), with its source. "data.json" means `src/data/data.json`; legacy components
are under `src/components/`.

| Where | Claim / text | Source |
| --- | --- | --- |
| head | `<title>` "Ingenieurbüro Auner"; og:site_name | master `public/index.html`; company name in `public/impressum.html` |
| head | description/og: "Ingenieurbüro Auner aus Schwalmtal in NRW: Frästechnik für den Grabenaushub im Energie- und Versorgungsnetzausbau. Wir schaufeln nicht – wir fräsen." | Schwalmtal: DESIGN_PLAN §1.8. Impressum gives PLZ 41366, the Schwalmtal code, but its town line has the typo "41366 Tulpenweg", so "Schwalmtal" is not literally written there (C3). NRW: Registergericht Mönchengladbach (impressum). "Grabenaushub": legacy `contact.jsx` subtitle. Field: data.json `About.heading`. Tagline: data.json `Header.title` |
| head | og/twitter image alt "3D-Studie der Fräsmaschine mit Fräs-, Aufnahme-, Förder- und Antriebsmodul" | `public/img/fraese.png` annotations (DESIGN_PLAN §1.6) |
| nav | "Ingenieurbüro Auner – zum Seitenanfang"; Verfahren/Einsatzbereiche/Team/Kontakt | company name (impressum); section names DESIGN_PLAN §4 |
| hero | H1 "Wir schaufeln nicht – wir fräsen" | data.json `Header.title`, verbatim (U+2013) |
| hero | "Wir entwickeln Grabenfräsen für den Energie- und Versorgungsnetzausbau." | data.json `About.heading` ("Entwickelt für …"); C2 (machine in development, user-confirmed). Plural "Grabenfräsen" → C1 |
| hero | "Maschinenbau aus NRW" | legacy `Team.jsx` heading; NRW via the impressum |
| verfahren | "Die Maschine ist in Entwicklung." | C2 / DESIGN_PLAN §1.7 (user-confirmed R3 Q2a) |
| verfahren | "Vier Module sollen Bodenabtrag und Materialtransport in einem kontinuierlichen Arbeitsgang bündeln." | data.json `Services[0]` ("Kontinuierlicher Bodenabtrag und Materialtransport sollen …") + `Services[1]` ("Ein gebündelter Arbeitsprozess soll …") + four modules in `fraese.png` |
| verfahren | 01 Fräsmodul / Zwei Arme, gegenläufige Fräsköpfe · 02 Aufnahmemodul / Nimmt das gelöste Material auf · 03 Fördermodul / Kontinuierlicher Austrag, beidseitig · 04 Antriebsmodul / Energie, Hydraulik, Steuerung | `fraese.png` annotations, verbatim (DESIGN_PLAN §1.6, C4) |
| verfahren | alt "3D-Darstellung der Fräsmaschine mit ihren vier Modulen"; caption "Fräsmodul, Aufnahme-, Förder- und Antriebsmodul" | §1.6 (it is a 3D CAD render); caption is C14 verbatim |
| einsatzbereiche | H2 + 4 areas and descriptions | data.json `About`, verbatim |
| warum | H2 "Neue Netze brauchen leistungsfähigere Bauprozesse." | legacy `services.jsx` heading, verbatim |
| warum | "Unsere Maschine ist in Entwicklung. Diese drei Ziele …" | C2 |
| warum | 3 names | data.json `Services[*].name`, verbatim |
| warum | "Ziel ist ein durchgehender Arbeitsgang, in dem die Maschine den Boden fräst und das Material im selben Zug abfördert." | data.json `Services[0]` (continuous removal + transport), framed as a goal |
| warum | "Das Konzept bündelt Fräsen, Aufnehmen und Fördern in einer Maschine. Ziel ist, unnötige Fahr- und Schwenkbewegungen und zusätzliche Maschineneinsätze zu vermeiden." | data.json `Services[1]` + modules 01–03 |
| warum | "Die Maschine wird auf Fernsteuerung und ineinandergreifende Arbeitsschritte ausgelegt. Ziel ist, dass Fachkräfte seltener direkt im Gefahrenbereich stehen und dort arbeiten, wo ihr Können gebraucht wird." | data.json `Services[2]` ("Integrierte Prozessschritte und Fernsteuerung sollen Fachkräfte effizienter einsetzen und Tätigkeiten direkt im Gefahrenbereich reduzieren."). The second clause paraphrases "effizienter einsetzen" → C2 |
| team | "Die Menschen hinter der Maschine"; "Geschäftsführung, Einkauf und Technik entwickeln die Grabenfräse gemeinsam." | roles: data.json `Team`; "develop jointly" is an inference → C2 |
| team | Marcus Auner · Geschäftsführung, Klaus Auner · Einkauf, Jan Hönninger · Technischer Leiter | data.json `Team`, verbatim. Marcus Auner as the company's representative is also in the impressum |
| kontakt | "Sprechen Sie direkt mit uns"; "Lassen Sie uns über den Grabenaushub von morgen sprechen." | H2 is UI copy (C8); subtitle is legacy `contact.jsx`, verbatim |
| kontakt | "Marcus Auner · Geschäftsführung" as the person to call | data.json `Team[0]`; C11/C15 |
| kontakt | 0176 618 77 599 / `tel:+4917661877599`; info@ingenieurbuero-auner.com; subject "Anfrage zur Grabenfräse" | data.json `Contact`; C16; subject is C8 copy |
| footer | alt "Ingenieurbüro-Auner GmbH"; "Impressum", "Datenschutzerklärung" | impressum (legal name); legacy `Footer.jsx` labels |

Nothing on the page states a figure, a reference, a customer, a certification or a completed
project. The flagged copy calls (for the C8 review, not defects):

- **C1:** "Grabenfräsen" (plural) in the hero. Only one machine is in evidence; ticket 04 already
  raised this.
- **C2:** Two paraphrases go slightly beyond the source: Team's "… entwickeln die Grabenfräse
  gemeinsam" (are all three roles developers?) and Warum wir's "dort arbeiten, wo ihr Können
  gebraucht wird".
- **C3:** "Schwalmtal" in the meta description comes from DESIGN_PLAN §1.8. The impressum on master
  never prints the town name, because of its "41366 Tulpenweg" typo. *(Resolved in the review
  follow-up: master `public/datenschutz.html` §2 names the controller as "Ingenieurbüro-Auner GmbH,
  Tulpenweg 12, 41366 Schwalmtal".)*

#### Findings fixed in this ticket

- **F1, `Verfahren.jsx`, commit `8a3ef41`.** Production builds failed in CI. `jsx-a11y/alt-text`
  cannot see the `alt` inside `{...RENDER}`, and under `CI=true` (GitHub Actions; the deploy action
  runs `npx react-scripts build`) CRA turns that warning into "Failed to compile". Both `<img>` now
  restate `alt={RENDER.alt}` after the spread, with a comment explaining why. The rendered alt is
  unchanged (Verfahren tests green). Reproduced red, then green, with
  `CI=true BUILD_PATH=build-11 npm run build`. Tickets 06, 07 and 09 had raised this; nobody
  owned the fix.

No other code was changed. The only other commit is the test file (`e8f4ea1`).

#### Findings not fixed (recorded only)

- **F3: `/favicon.ico` → 404.** The page declares no icon, so browsers request the root default.
  This is not one of the four removed paths. Adding an icon needs an asset and a `public/index.html`
  edit (ticket 01's file) → E2.
- **F4: Tab inside the open lightbox.** In Edge 155, Tab alternates between "Schließen" and
  *leaving the document* (`activeElement` = `body`; in a headed browser this is the address bar).
  This is Chromium's native modal-dialog behaviour. Focus never reaches the inert page, Shift+Tab
  behaves the same, and the next Tab returns to "Schließen". It is acceptable under C13 ("the
  browser supplies the focus trap"). It does contradict ticket 05's evidence ("focus stayed inside
  the dialog every time"), so it is noted here.
- **F5: Kontakt anchor on phones.** At 375×812 the "Kontakt" link lands on Marcus's portrait. The
  H2 is at y = 521, and the label and phone CTA are below the fold (`anchor-kontakt-375-shipping.png`).
  The fixed call bar is visible throughout, so the call is still one tap away. Ticket 09 chose the
  portrait-first stack deliberately → E5.
- **F6: Label wrap at 375.** "Marcus Auner · Geschäftsführung" (display-md) breaks as "Marcus
  Auner · / Geschäftsführung", leaving the middle dot at the end of line 1. Cosmetic; left for the
  copy/design review.
- **F7: Team cards have unequal heights at 768–1279 px.** "Marcus / Auner" and "Jan / Hönninger"
  wrap onto two lines while "Klaus Auner" fits on one, so the middle card is shorter
  (`section-768-team-0.png`). Fixing it means letting the card fill the grid cell (`h-full`), and
  `PortraitCard`'s `className` is documented as width-only (ticket 02's primitive) → E6.
- **F8: Up to three identical call stops** (nav CTA or call bar, hero CTA, Kontakt CTA), all named
  "Anrufen: 0176 618 77 599". Raised in 03/04/09. The tab order is still logical; noted for the
  reviewer.
- **F9: Verfahren intro keeps "sollen"** ("Vier Module sollen … bündeln"), while Warum wir removed
  every "soll". Both are inside C2; the tone differs between the sections.
- **F10: Duplication carried over from earlier reviews** (not QA defects): the jsdom
  `getComputedStyle` shim is in 5 test files; Verfahren's local `BUTTON_BASE` outline button; the
  phone number is hardcoded in `phone.js`, `Showcase.jsx` and the tests (ticket 12 consolidates it
  with `data.json`).
- **F11: Not verified here.** The clipboard fallback over plain `http` on a non-localhost origin,
  and the long-press "Kopieren" on real iOS/Android devices (ticket 09, deferred item 4). There
  was also no screen-reader run; accessible names were checked from the DOM and attributes only.

#### Escalations needing a human decision

- **E1: Remove the ticket-02 showcase from the page before review.** `Prototype.jsx` still renders
  `<Showcase />` after `<Footer />`. On the page this adds a visible "Temporäres Dev-Artefakt"
  block of about 8,000–11,000 px (page height 18,296 px at 375 against 7,829 px without it), plus
  5 extra tab stops, a second `tel:` and a `mailto:` without subject. It is the only reason box 2 is
  unticked, and the footer is not the last thing on the page (ticket 10 item d). `Prototype.jsx`
  is the frozen, coordinator-owned shell, so this was not edited here. Removing the import and the
  one JSX line is the fix. Ticket 12 is the latest point. **Resolved in the review follow-up**
  (coordinator-authorised edit); this also closes ticket 10's item (d).
- **E2: Favicon (F3).** Provide an icon (for example a square crop of the emblem) and add it in
  `public/index.html`, or accept the 404.
- **E3: Copy review (C8).** The claims-audit flags C1–C3, plus the open copy items from 04/05/06/07/09
  (subline wording, "Warum wir" eyebrow vs goal list, new status texts, render annotation 04's third
  line).
- **E4: Footer vs Kontakt contrast** (ticket 10 item a). They are about 1.07:1 apart, separated only
  by the hairline, which conflicts with frozen C12's "structure without borders". Options: accept
  the hairline, change the footer tone, or amend C12.
- **E5: Kontakt stacking on phones (F5).** Keep portrait-first, or put the text and call first below
  `md`.
- **E6: `PortraitCard` equal-height option (F7).** Ticket 02 owns the primitive.
- **E7: Still open from earlier tickets** and not resolvable in QA:
  - The C16 reading of "no nav CTA below `md`" (03).
  - The 8 px nav solid threshold vs "over the hero" (03).
  - `text-[0.8125rem]` vs a `nav` type token (03; `tailwind.config.js`).
  - Who owns the `<body>` padding side effect (03/10).
  - The lightbox 1:1 cap vs "as large as the viewport allows" (05).
  - A `Section` `as` prop for the footer (10).
  - A shared outline-button primitive (05).
  - Icon stroke-width interpretation (07).
- **E8: `tel:` target format (box 8).** All four call links use `tel:+4917661877599`. C16's
  wording says the href "keeps the international `+49 176 618 77 599` exactly as `data.json`
  stores it", so this deviates literally. The spaces are stripped on purpose (ticket 03): RFC 3966
  allows only `-`, `.` and `(`/`)` as visual separators in a `tel:` URI, not spaces, so
  `tel:+49 176 …` is not a valid URI. The digits are identical. Please confirm that C16 means "the
  same number", not "the same string".

### Review follow-up

Agent, 2026-10-16. Branch `design-v2/11-review-fixes`, based on `design/v2` @ `5b1bf60`. Fixes
for the code review of this ticket. Full suite: 69/69 green across 10 suites, run with the same
`--testMatch` workaround as above (deviation from DESIGN_PLAN §2.10, for the `.claude/` worktree
reason given there). `CI=true BUILD_PATH=build-11r npm run build`: `Compiled successfully`
(main.js 50.69 kB, main.css 5.94 kB gzipped); `grep -rlE "favicon\.ico|apple-touch-icon" build-11r`
finds nothing. `build-11r/` was deleted afterwards.
`git diff master -- public/impressum.html public/datenschutz.html public/index.html` is empty.

| # | What | Why | Commit |
| --- | --- | --- | --- |
| 1 | `Prototype.jsx`: removed the `Showcase` import, its TEMPORARY comments and `<Showcase />`; rewrote the header paragraph that still said the shell "renders an intentionally empty page" and that the showcase "is the first thing with pixels". `Showcase.jsx` itself is left in place: deleting it belongs to ticket 12's migration. New test "page composition": the top-level landmarks are exactly `nav`, `main`, `footer`, and the footer is the container's last element (red before the edit, green after). | E1; the coordinator authorised this one edit of the frozen shell (ticket 02 note 3 names ticket 11 as owner). Closes ticket 10's escalation (d). | `8727267` |
| 2 | `Page.integration.test.jsx`: the `data.json` BOM is written as `﻿`; the anchor test is renamed to match its five hrefs (page top + four nav sections); the call bar is found by its accessible name ("Anrufen: 0176 618 77 599") as the one call link outside every landmark, not by `nav.nextElementSibling`; page text is built from text nodes joined with spaces, so a banned phrase split across elements is caught; the orange test checks every `bg-signal` element against a reference render of the `CTA` primitive (as Kontakt.test and Team.test do), with a comment on why the class contract is the only jsdom seam (no Tailwind CSS, no computed colours; the computed check is the browser pass); the favicon guard scans `public/index.html` and every non-test file in `src/`, accepts single and double quotes, and says in a comment that the build output is checked by the build/browser pass. Added the jsdom `getComputedStyle` pseudo-element shim the section tests use, because `getAllByRole(..., { name })` needs it. | Review findings on the test file. | `0dc8673` |
| 3 | `Verfahren.jsx`: `RENDER` no longer carries `alt`; each `<img>` spreads `{...RENDER}` and sets `alt={RENDER_ALT}` once. `CI=true` build still `Compiled successfully`; Verfahren tests green. | The alt was duplicated (in the spread and restated after it, F1). | `ebb9a54` |
| 4 | This ticket: box 2 ticked; caveats next to boxes 3 (F4), 7 (C3 source) and 8 (E8); E1 and C3 marked resolved; the `--testMatch` deviation from §2.10 noted; evidence paths repointed to the repo. Box 7 stays ticked: the review asked to untick it unless a company source for "Schwalmtal" exists, and master `public/datenschutz.html` §2 ("Name und Anschrift des Verantwortlichen") is one. | Review findings on the QA report. | this commit |
| 5 | Evidence copied to `.scratch/design-v2/evidence/11/`: `run1/` holds the first run's scripts, raw output and key screenshots (the full 16 MB set is too large); `run2/` holds this re-run. | The temp scratchpad may be cleaned up. | this commit |

**Mutation checks** (each edit temporary, reverted with `git checkout --`, never committed):

| Edit | Red test |
| --- | --- |
| `public/impressum.html`: "Impressum" → "Impresum" | impressum.html is unchanged from master |
| `public/datenschutz.html`: comment appended | datenschutz.html is unchanged from master |
| `public/index.html`: `<link rel="icon" href="%PUBLIC_URL%/img/favicon.ico" />` | favicon guard (`index.html: %PUBLIC_URL%/img/favicon.ico`) |
| `public/index.html`: `<link rel='apple-touch-icon' href='img/apple-touch-icon-72x72.png' />` (single quotes) | favicon guard |
| `src/prototype/sections/phone.js`: `export const ICON = 'img/apple-touch-icon.png';` | favicon guard (`phone.js: …`) |
| `Team.jsx` intro: `<em>bis</em><em>zu</em> doppelt so schnell` | banned terms (`/\bbis zu\b/i`); the old `textContent` join read "biszu" and missed it |
| `Hero.jsx` trust line: `!text-brand bg-signal` (navy on orange, but not the CTA) | orange test; the old `!text-brand` check passed this |
| `Prototype.jsx` before the fix (showcase rendered) | page composition |

**Browser re-run** (`.scratch/design-v2/evidence/11/run2/`): headless Edge 155 over CDP against
`build-11r`, served on `127.0.0.1:3012` by `run2/serve.js`; `node qa.js http://127.0.0.1:3012/ 4,7,8`.
`run2/qa.js` is `run1/qa.js` with the keyboard pass at 375, 768 and 1280 and focus screenshots for
every stop. Raw output: `run2/out.txt`, `run2/results.json`; screenshots: `run2/shots/`.

- **Box 2 (tab order): pass at 375, 768 and 1280.** 13 tabbable elements, 13 stops, in DOM and
  reading order: emblem → Verfahren → Einsatzbereiche → Team → Kontakt → call (call bar at 375,
  nav CTA at 768/1280) → hero CTA → "Größer ansehen" → Kontakt call → mail link → "Adresse
  kopieren" → Impressum → Datenschutzerklärung. Every stop matches `:focus-visible` with a 2 px
  solid outline (white; navy for "Größer ansehen"). The 14th Tab leaves the document (`body`), so
  nothing traps focus. No showcase stops remain. Screenshots `focus-<w>-01…13.png`.
- **Box 10 (anchors): unchanged, pass.** Every nav link lands its section top at y = 80 (the nav
  bottom) at 375/768/1280; heading tops 190/222/254; `#kontakt` at 375 is 521 (F5, portrait
  first); `#start` H1 234/320/169. The page now ends at the footer (375: 7,829 px tall, was 18,296).
  The "(showcase removed)" rows in the output are identical, because there is nothing left to remove.
- **Bottom of the page:** the footer is the last thing; at 360/375 it ends at the call bar's top
  edge (667.7 vs 668, 740.1 vs 740), legal links at 617/690. `bottom-<w>-shipping.png`.
- Only non-2xx request: `/favicon.ico` 404 (F3, E2), as before.
