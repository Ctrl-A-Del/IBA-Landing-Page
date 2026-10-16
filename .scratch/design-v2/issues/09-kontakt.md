# 09: Kontakt

**What to build:** The call — the page's only real goal — gets a named human being beside it, and the email route works without a contact form.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** ready-for-human

- [x] The section is anchored at `#kontakt` on the navy background
- [x] Marcus Auner is named, labelled "Marcus Auner · Geschäftsführung", with his existing portrait shown in the shared framed light card
- [x] The phone number is the primary and most prominent action in the section
- [x] The displayed number is `0176 618 77 599`, and the `tel:` target is `+49 176 618 77 599`
- [x] Email uses `info@ingenieurbuero-auner.com`, with a `mailto:` that carries a pre-filled subject
- [x] A copy-to-clipboard affordance copies the email address and reports success in a way a screen reader announces
- [x] The copy affordance degrades to something usable where the clipboard API is unavailable
- [x] There is no contact form, and no third-party processor is introduced — that would force a change to the privacy page, which is out of scope
- [x] The phone CTA never renders white text on orange
- [ ] Focus states are visible against navy
- [ ] At small widths the section does not fight the fixed mobile call bar for space

## Comments

### Implementation notes (agent, 2026-10-16)

Branch `design-v2/09-kontakt`. Only `Kontakt.jsx`, the new `Kontakt.test.jsx` and this file were
edited. No red-list file was touched and no dependency was added.

**Shape.** `<Section id="kontakt" tone="navy" aria-labelledby="kontakt-heading">` holds two columns
(stacked below `md`, `18rem | 1fr` from `md` up). The left one is Marcus Auner's portrait in the
shared `PortraitCard`, consumed as-is. The right one has an eyebrow, the H2, the intro, the label line
"Marcus Auner · Geschäftsführung", the orange phone `CTA`, and below a hairline the email link, an
"Adresse kopieren" button and a `role="status"` line.

**Label vs primitive.** `PortraitCard`'s caption stacks name and role in two spans, so it cannot
render C15's one-line "Marcus Auner · Geschäftsführung". Rather than ask for a primitive change, the
card is framed **without** a caption here, and the label sits directly above the phone number, which
puts the name right beside the call. Crop and ratio are the primitive's, so they match Team's (the
test compares the `<img>` classes with a reference `PortraitCard` as a set). The alt is empty, as in
Team, because the adjacent label names him. If a human wants the label inside the card instead, that
needs a `PortraitCard` change (ticket 02, red list).

**Phone first.** The call is the only orange `CTA` in the section and the first link or button in DOM
and tab order. Its target is `tel:+4917661877599`, it shows `0176 618 77 599`, and its accessible name
`Anrufen: 0176 618 77 599` comes from `./phone`, like the nav, bar and hero. The `CTA` primitive locks
navy-on-orange, so white on orange is unreachable.

**Email.** `mailto:info@ingenieurbuero-auner.com?subject=Anfrage%20zur%20Grabenfr%C3%A4se` (encoded
with `encodeURIComponent`), with the address visible as the link text.

**Copy to clipboard degrades in three steps:** (1) `navigator.clipboard.writeText`; (2) if that is
missing or refused, the visible address is selected and `document.execCommand("copy")` is tried;
(3) if that fails too, the address **stays selected** and the status says "Adresse markiert – bitte
mit Strg+C (Mac: ⌘+C) kopieren.". On success it says "E-Mail-Adresse kopiert.". The live region is
mounted empty from the first render, so it is announced, and it is visible text too. The message
clears after 5 s, so a repeat click is announced again.

**Mobile call bar.** Nothing in the section is fixed or sticky. Ticket 03's Nav already reserves the
bar's height as `<body>` bottom padding below `md`. The portrait is capped at `14rem` wide on phones
so the call is not pushed a full screen down.

**Test seams.** As in 03–08 there was no user to confirm seams with, so the precedent was followed:
the rendered `<Kontakt />` observed through the DOM, plus the browser clipboard
(`navigator.clipboard`, `document.execCommand`) as the one stubbed external boundary. No Tailwind
class string is asserted literally; "shared card" and "same CTA" are checked by comparison with the
primitives rendered on their own. The jsdom `getComputedStyle` shim is repeated, scoped to the file.

### Verification evidence

- **Tests.** `src/prototype/sections/Kontakt.test.jsx` has 10 tests:
  1. The anchor is a region named by its H2.
  2. The Marcus label, the portrait src, the empty alt, and a crop matching `PortraitCard`.
  3. The call's target, display and accessible name, and that it is the first action.
  4. The call carries every locked `CTA` class, has no `text-white`, and is the section's only CTA.
  5. The mailto address, its encoded non-empty subject and the visible address.
  6–9. Four clipboard cases: API success; the `execCommand` fallback; nothing available, which leaves
     the address selected with "markiert"; and a refused permission, which degrades the same way. Each
     asserts that the empty `status` region is mounted before the click.
  10. No form, input, iframe or script, and every link is `tel:`/`mailto:`.

  Each slice was red first. One mutation (removing the selection step) turned both degrade tests red;
  they were green again after restoring. The full suite is **49/49 green** (8 suites), run with the
  `.claude/` worktree `--testMatch` workaround from ticket 03.
- **Build.** `npm run build` with `BUILD_PATH` in a scratch directory reports "Compiled with
  warnings". Both warnings are the known `jsx-a11y/alt-text` ones in `Verfahren.jsx` (ticket 07,
  Raised item 1). Kontakt adds none. The compiled CSS contains the arbitrary
  `grid-template-columns:minmax(0,18rem) minmax(0,1fr)`, `max-width:14rem` and `min-height:1.5em`.

### Deferred to ticket 11's browser pass (no dev server was run here)

- **"Focus states are visible against navy"** is unticked. The email link and the copy button use the
  same white `outline` recipe as Nav's `FOCUS_ON_NAVY` (16.8:1 on navy), and the `CTA` brings its own
  two-tone indicator, but this needs checking in a browser.
- **"Does not fight the fixed mobile call bar"** is unticked. By construction the section has no fixed
  elements and `<body>` reserves the bar's height. Check at 360/375 px that the last line (the status
  line) scrolls clear of the bar and that the stacked layout reads well.
- Also check the real clipboard in a secure context, and the step-3 fallback over plain `http`.

### Raised for a human

1. **Copy for C8 review (all flagged `C8-NEW` in the source):** eyebrow "Kontakt", H2 "Sprechen Sie
   direkt mit uns", mail subject "Anfrage zur Grabenfräse", button "Adresse kopieren", and the
   statuses "E-Mail-Adresse kopiert." / "Adresse markiert – bitte mit Strg+C (Mac: ⌘+C) kopieren.".
   The intro "Lassen Sie uns über den Grabenaushub von morgen sprechen." is the legacy subtitle,
   verbatim.
2. **Label outside the card** (see "Label vs primitive" above). Say if C15 means it must be the card's
   caption.
3. **Two call affordances below `md`.** At phone widths the section's own call CTA and the fixed call
   bar can both be on screen at once. The hero has the same situation. Kept because the ticket wants
   the call to be the section's most prominent action at every width.
4. **`FOCUS_ON_NAVY` is now duplicated** (Nav, Kontakt). A candidate for a ticket-02-owned shared
   export, along with the duplicated `getComputedStyle` test shim already noted in 07/08.

### Review findings (agent, 2026-10-16)

Branch `design-v2/09-review-fixes`. Edited: `Kontakt.jsx`, `Kontakt.test.jsx`, `Nav.jsx`,
`Footer.jsx`, and this file. New: `src/prototype/sections/email.js` and
`src/prototype/sections/focus.js`.

**Fixed:**

- **Mobile copy fallback.** Step 3 used to select the address inside the `mailto:` `<a>`, where a
  long-press opens the link menu, and the instructions only named "Strg+C / ⌘+C". Now the fallback
  reveals a plain copy of the address below the link: a `<span tabIndex={-1}>` with `select-all`,
  outside any `<a>`, hidden until needed. It is revealed synchronously (`flushSync`), focused and
  selected, and then the legacy `execCommand("copy")` is tried on it. No `<input>` is used, so the
  "no form, no input" test still holds. The new status text covers both cases (`C8-NEW`, needs copy
  approval): "Adresse unten markiert – mit Strg+C (Mac: ⌘+C) kopieren oder auf dem Handy gedrückt
  halten und „Kopieren“ wählen." After a successful copy the fallback is hidden again.
- **Auto-clear.** The 5 s timer now runs only for the success message. The fallback guidance stays
  until the next click.
- **Email literal.** `EMAIL`, `MAIL_SUBJECT` and `MAIL_HREF` moved into `sections/email.js`, using the
  `phone.js` pattern. `Kontakt.jsx` and `Kontakt.test.jsx` import it. `Showcase.jsx` is untouched.
- **Focus class string.** `FOCUS_ON_DARK` lives in `sections/focus.js` as one full literal string
  (§2.5). Nav (was `FOCUS_ON_NAVY`), Footer and Kontakt import it. `CTA_CLASSES` in `ui/` is
  untouched. Nav and Footer tests are unchanged and green. This settles Raised item 4 above.
- **Formatting.** The `render(<PortraitCard …/>); const referenceImage = …` line is split in two.
- **Tests (red first).** Two new tests. (1) In the fallback, the selection is the address, it is not
  inside an `<a>`, it is visible and focused, and the status names both the keyboard shortcut and
  the touch route. (2) With fake timers, the success message is empty after 10 s and the fallback
  guidance is still there after 60 s. Both were red against the old code. The import of `./email`
  was red until the module existed.

**Deferred (unchanged, for a human or ticket 11's browser pass):**

1. Label placement and the caption question (C15), Raised item 2.
2. The label's visual weight compared with the call button.
3. Copy approval for all `C8-NEW` texts, including the new fallback status line.
4. Focus visibility on navy, the mobile call bar check, and a real-device check of the fallback.
   Does the long-press on the focused, selected span offer "Kopieren" in iOS Safari and Android
   Chrome? That needs to be checked over plain `http`.

**Tests / build.** Full suite 56/56 green (9 suites), run with the `.claude/` worktree `--testMatch`
workaround from ticket 03. `npm run build` (`BUILD_PATH` in a scratch directory) reports "Compiled
with warnings". These are only the two known `jsx-a11y/alt-text` warnings in `Verfahren.jsx`, and
none are new. The compiled CSS contains `select-all`.
