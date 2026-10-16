# IBA Landing Page — Design v2

Decision log, verified facts and task tracker for the redesign of `ingenieurbuero-auner.com`.

**Purpose:** this file is the single handoff artefact so that a fresh AI agent — or a human — can resume this work in a new context window without re-discovering the codebase or re-litigating decisions.

**Status:** **design agreed and frozen; implementation under way.** Tickets `01`–`02` have landed on
`design/v2`. Tickets `03`–`10` are the section wave, `11` is the integration QA pass, and `12`–`13`
are human-gated (`13` **publishes the live site**).

**Last updated:** 2026-10-16 · branch `design/v2` with tickets `01`–`11.1` landed; nothing pushed,
`master` untouched at `e5ffdd6`. A human review of the assembled page reopened B6, C12 and C15 in
round `R6` (§3); ticket `11.1` implemented those fixes. The user approved the prototype on
2026-10-16. Ticket `12` (post-approval migration, D6) is implemented and awaiting review: v2 is now
the source of truth, all copy is in `data.json`, and the legacy components, dead tokens and template
images are gone. Next is `13`, which **publishes the live site** and needs explicit approval.

**Note on §1:** §1.3–§1.6 describe `master` at `e5ffdd6`. After ticket 12, `src/App.jsx` renders
the v2 sections from `src/components/sections/` with primitives in `src/components/ui/`. `data.json`
is keyed by v2 section and has no BOM. `brand.alt`, `surface`, `link` and `accent` are gone. Only
the five images in use remain in `public/img`.

**Progress:** all five interview rounds are closed; there are **no open questions** (§5). Everything
decided is in §3. Ticket `01` is complete and reviewed; ticket `02` is complete and verified, with
five items raised for a human at the bottom of its ticket file.

---

## 0. Resume checklist (new context window)

1. Read this file top to bottom.
2. Read the repo memory file `/memories/repo/notes.md` (build/Tailwind/font/deploy gotchas).
3. Read: `tailwind.config.js`, `src/index.css`, `src/App.jsx`, `src/data/data.json`, `public/index.html`, `.github/workflows/deploy.yml`.
4. Run `npm ci` (npm only — there is no `yarn.lock`).
5. There are **no open questions** (§5) — the design is frozen. Do not re-open settled decisions unless the user asks.
6. Read `.scratch/design-v2/parallelisation.md` — it says which of the 13 tickets may be worked by
   several agents at once, and which must run alone. Only the section tickets (`03`–`10`) fan out.
7. Then work the task list in §6, or the ticket queue in `.scratch/design-v2/issues/`.

**Non-obvious but critical:** opening a pull request to `master` **deploys the live website** (see §1.2). Do not open a PR until the user explicitly approves.

---

## 1. Verified facts

Facts below were verified against the working tree. Do not re-derive them; do re-verify if the code has changed.

### 1.1 Stack & tooling

| Thing | Value |
| --- | --- |
| Build tool | Create React App via `react-scripts` 5.0.1 (not Vite/Next) |
| React / ReactDOM | 17.0.1 (legacy `ReactDOM.render` in `src/index.js`) |
| Tailwind CSS | v3.4.19 (devDependency) — config uses `content:`, `theme.extend` |
| postcss / autoprefixer | 8.5.29 / 10.6.1 (CRA-managed) |
| Icons | `lucide-react` 1.54.0 |
| npm scripts | `start`, `build`, `test`, `eject` — that's all |
| `homepage` | `https://ingenieurbuero-auner.com` |
| package name | `iba-landing-page` (lockfile still says `landingpage-react-template` — template leftover) |

There is **no** `postcss.config.js` anywhere in the repo.

### 1.2 Deploy & branch rules

- Hosting: **GitHub Pages** with custom domain, `CNAME` = `ingenieurbuero-auner.com`.
- `.github/workflows/deploy.yml`: triggers on **`push` to `master`** *and* **`pull_request` to `master`**.
- It runs `tanwanimohit/deploy-react-to-ghpages@v1.0.1`, which does `npm i` → `npm ci` → `npx react-scripts build`, then pushes `build/` to the `gh-pages` branch.
- **Therefore: opening a PR to `master` publishes to the live site.** Pushing a feature branch does not.
- `build/` is generated and is listed in `.gitignore` (`/build`) — it exists on disk locally but is not tracked. No `gh-pages` / `predeploy` / `deploy` npm script exists.
- Git state at time of writing: current branch `master`, clean tree, HEAD `e5ffdd6 Fix images`. The earlier `refactor/tailwind-overhaul` branch was merged via PR #1, and `REFACTOR_PLAN.md` was deliberately deleted in `d9d1afd remove migration plan`.

### 1.3 Design tokens (current, in `tailwind.config.js`)

| Token | Value |
| --- | --- |
| `brand.DEFAULT` | `#0a1f2e` (primary dark navy) |
| `brand.alt` | `#14171a` |
| `accent.from` | `#6372ff` |
| `accent.to` | `#5ca9fb` |
| `link` | `#608dfd` |
| `surface` | `#f6f6f6` |
| `font-heading` | `Raleway, sans-serif` |
| `font-body` | `"Open Sans", sans-serif` |
| `maxWidth.container` | `1170px` |

No `screens` override (stock breakpoints), no `darkMode` key (defaults to `media`), `plugins: []`.

`src/index.css` (39 lines) contains exactly: the three `@tailwind` directives, two `@font-face` blocks, and an `@layer base` block:

- `html { scroll-behavior: smooth; }`
- `body { @apply font-body text-neutral-600 antialiased; }`
- `h1..h6 { @apply font-heading break-words; }`

No CSS custom properties, no `@layer components`, no custom classes. Styling is 100% Tailwind utility classes in JSX — no CSS modules, no CSS-in-JS, and **no inline `style=` anywhere in `src/`**.

`src/components/ui/Section.jsx` variants: `light` → `bg-white`, `muted` → `bg-surface`, `dark` → `bg-brand`, `darkAlt` → `bg-gradient-to-r from-brand to-brand-alt`.

### 1.4 Current page composition

`src/App.jsx` renders, in order: `<Header>` → `<main>`: `<Features>`, `<About>`, `<Services>`, `<Team>`, `<Contact>` → `<Footer>`.

| Section id | Component | Current treatment |
| --- | --- | --- |
| `header` | `header.jsx` (26 lines) | Full-viewport 2-panel grid: `logo.jpg` panel + `<h1>` (uppercase). `h-screen` / `100dvh`, `min-h-[600px]` |
| `features` | `features.jsx` (18 lines) | `bg-brand`, image-only — `fraese.png` at full width, `rounded-xl`. **No heading, no text.** Not data-driven |
| `about` | `about.jsx` (28 lines) | `variant="dark"`, 4 white cards (`rounded-xl bg-white shadow-md`) on navy. 1/2/4 cols |
| `services` | `services.jsx` (38 lines) | `variant="darkAlt"`, 3 columns, each a gradient-filled circle (`from-accent-from to-accent-to`) with a lucide icon. 1/3 cols |
| `team` | `Team.jsx` (33 lines) | `variant="dark"`, 3 portraits, `aspect-[3/4] object-cover object-top`, `rounded-[20px]`. 1/2/3 cols |
| `contact` | `contact.jsx` (40 lines) | `variant="dark"`, `tel:` and `mailto:` links with `Phone` / `Mail` icons. **No form, no `useState`** |
| — | `Footer.jsx` (26 lines) | Flat link list to `/datenschutz.html` and `/impressum.html` |

No router. No `<nav>` element anywhere — the sections have `id`s and `scroll-mt-24`, but **nothing links to them**.

Section headings that are **hardcoded in JSX and absent from `data.json`**:

- `services.jsx`: `Neue Netze brauchen leistungsfähigere Bauprozesse.`
- `Team.jsx`: `Maschinenbau aus NRW` + `subtitle="für die Infrastruktur von morgen"`
- `contact.jsx`: `Kontakt` + `subtitle="Lassen Sie uns über den Grabenaushub von morgen sprechen."`

### 1.5 Content (`src/data/data.json`) — verbatim

Top-level keys: `Header`, `About`, `Services`, `Team`, `Contact`. Nothing else. No testimonials, no portfolio, no references data.

**Header**
- `title`: `"Wir schaufeln nicht – wir fräsen"` (U+2013 EN DASH, not a hyphen)

**About**
- `heading`: `"Entwickelt für den Energie- und Versorgungsnetzausbau"`
- Card 1: `"Stromtrassen"` — `"Erdkabel und Energieübertragung"`
- Card 2: `"Wasserstoff & Fernwärme"` — `"Neue Leitungsnetze der Energiewende"`
- Card 3: `"Wasser & Abwasser"` — `"Großformatige Versorgungsgräben"`
- Card 4: `"Weitere Infrastruktur"` — `"Gas-, Drainage- und industrielle Leitungstrassen"`

**Services** (note the hedging — see §1.7)
- 1 · icon `fast-forward` · `"Schneller vorankommen"` — `"Kontinuierlicher Bodenabtrag und Materialtransport sollen höhere Tagesleistungen ermöglichen als klassische Einzelzyklen."`
- 2 · icon `recycle` · `"Ressourcen effizient nutzen"` — `"Ein gebündelter Arbeitsprozess soll unnötige Fahr- und Schwenkbewegungen sowie zusätzliche Maschineneinsätze reduzieren."`
- 3 · icon `user` · `"Fachkräfte entlasten"` — `"Integrierte Prozessschritte und Fernsteuerung sollen Fachkräfte effizienter einsetzen und Tätigkeiten direkt im Gefahrenbereich reduzieren."`

**Team**
- `img/marcus.png` — `"Marcus Auner"`, `"Geschäftsführung"` (data.json has a BOM at the start of the file)
- `img/klaus.png` — `"Klaus Auner"`, `"Einkauf"`
- `img/jan.png` — `"Jan Hönninger"`, `"Technischer Leiter"`

**Contact**
- `phone`: `"+49 176 618 77 599"`
- `email`: `"info@ingenieurbuero-auner.com"`

### 1.6 Assets

**In use**

| File | Reality |
| --- | --- |
| `public/img/fraese.png` | **3D CAD render, not a photo.** Declared 1342×738 (16:9), **opaque** — light grey/dirt scene backdrop (`#d8d8d8`/`#c9c9c9`), brown earth `#6b5a45`. Machine is **orange `#f08a24`**. Has four German annotation boxes **baked into the pixels**: `01 · Fräsmodul / Zwei Arme, gegenläufige Fräsköpfe`, `02 · Aufnahmemodul / Nimmt das gelöste Material auf`, `03 · Fördermodul / Kontinuierlicher Austrag, beidseitig`, `04 · Antriebsmodul / Energie, Hydraulik, Steuerung`. Its own annotation navy (`#123f5c`) is close to the page navy |
| `design-assets/source/logo.jpg` | The **Logo plate**, moved here from `public/img/` by the Emblem change; `public/img/emblem.png` replaces it on the page. **Opaque JPEG — transparency is impossible.** Portrait photo-mockup of a 3D metallic logo on a slate-blue wall (`#4e6070`); circular gear/eagle emblem, `INGENIEURBÜRO` in grey metal caps, `AUNER` in **orange `#e08b3c`/`#f2a94f`**, flanked by two thin orange rules |
| `public/img/marcus.png` | 240×320 (3:4) studio portrait, flat white background, head-and-shoulders, white open-collar shirt |
| `public/img/klaus.png` | 240×320 (3:4) studio portrait, flat white background, grey hair, white shirt with light-blue placket |
| `public/img/jan.png` | 240×320 (3:4) studio portrait, **visible light-grey→white gradient backdrop and a blown-out halo** around the hair, round dark glasses. The least clean of the three |

Exact pixel dimensions and file sizes were not byte-verified — the figures above come from declared `width`/`height` attributes and visual inspection. To verify:

```powershell
Add-Type -AssemblyName System.Drawing
'fraese.png','logo.jpg','marcus.png','klaus.png','jan.png' | ForEach-Object {
  $p = "$PWD\public\img\$_"
  $img = [System.Drawing.Image]::FromFile($p)
  "{0,-12} {1}x{2} px  {3} KB" -f $_, $img.Width, $img.Height, [math]::Round((Get-Item $p).Length/1KB,1)
  $img.Dispose()
}
```

**Dead / unreferenced** (nothing in `src/` points at these): `public/img/about.jpg`, `bagger.png`, `Bild1.jpg`, `intro-bg.jpg`, plus the entire `public/img/portfolio/` (18 files), `public/img/team/` (4 files) and `public/img/testimonials/` (6 files) folders. These are leftovers from the original free template.

### 1.7 The "concept machine" insight (drives all copy)

The machine is presented via a **CAD render** with **annotations baked in**, and every performance claim in `data.json` is hedged with *sollen/soll* ("…**sollen** höhere Tagesleistungen **ermöglichen**"). This reads as a machine still in development. Confirmed by the user in Round 3 → see decision **C2**. Consequence: **no performance claims, no fabricated references, no testimonial section.**

### 1.8 Company & legal (for context; do not edit)

- **Ingenieurbüro-Auner GmbH**, Tulpenweg 12, 41366 Schwalmtal (NRW). Registergericht Mönchengladbach, HRB 23617, vertreten durch Marcus Auner.
- Field: trench milling for energy/utility network expansion. Tagline: `"Wir schaufeln nicht – wir fräsen"`.
- `public/impressum.html` and `public/datenschutz.html` are static HTML. `impressum.html` shows a likely typo: `41366 Tulpenweg`. `datenschutz.html` documents GitHub Pages / GitHub Inc. as processor.
- `README.md` is the **unmodified** "React JS Landing Page Template" readme (Issaaf Kattan; inspired by Free-CSS "Interact") — it still instructs `yarn` and mentions EmailJS, which is no longer used anywhere.

### 1.9 Known defects to fix in this branch

- `public/index.html` references **four favicons that do not exist**: `img/favicon.ico`, `img/apple-touch-icon.png`, `img/apple-touch-icon-72x72.png`, `img/apple-touch-icon-114x114.png`.
- `public/index.html` meta description is **empty**; no Open Graph / Twitter card tags → shared links render as a bare URL.
- `<meta name="theme-color" content="#0a1f2e" />` is already correct; `<html lang="de">` and `<title>Ingenieurbüro Auner</title>` are fine.
- Contrast pair measured: white on `#f08a24` ≈ **2.5:1** (fails WCAG AA) · `#0a1f2e` on `#f08a24` ≈ **6.7:1** (passes AA). This is why the CTA is orange with navy text and never the reverse.

---

## 2. Hard constraints (do not violate)

1. **Never open a PR to `master`** (or push to `master`) until the user explicitly approves — it deploys the live site (§1.2).
2. **Stay inside the technical envelope:** CRA 5 / `react-scripts` 5.0.1, React 17, Tailwind **v3**, no router, no new heavy dependencies. `lucide-react` 1.54 is available for icons.
3. **Do not add `postcss.config.js`** — CRA sets PostCSS `config: false` and would ignore it; CRA auto-enables Tailwind because `tailwind.config.js` exists at the repo root.
4. **Do not re-add Google Fonts / any font CDN `<link>`.** Fonts are self-hosted, latin subset only.
5. **New Tailwind classes only compile if they appear in the `content` globs** (`./src/**/*.{js,jsx}`, `./public/index.html`). Don't build class names dynamically from strings.
6. **Do not touch** `public/impressum.html` or `public/datenschutz.html`.
7. **No fabricated content:** no invented references, testimonials, project counts, performance figures or certifications. The machine is a concept (§1.7).
8. **Never put white text on the orange CTA** (§1.9).
9. **`npm` only** — there is no `yarn.lock`; keep `package-lock.json` in sync; CI runs `npm ci`.
10. Use `npm start` / `npm run build` / `npm test` — nothing else.

---

## 3. Decision log

Numbering is `Rn Qm` = round *n*, question *m* of the grilling session that produced it.

### A. Scope, goal & audience

| # | Decision | Rationale |
| --- | --- | --- |
| **A1** | **Full visual overhaul of the landing page** — new layout system, typography scale, colour treatment and imagery style. Landing page only: `public/impressum.html` and `public/datenschutz.html` are untouched. | `R1 Q1a` |
| **A2** | **Primary KPI = a phone call or email.** Secondary = credibility/modernity (so the site is not dismissed as a hobby page). Every section is measured against whether it moves a visitor toward calling. | `R1 Q2a+c` |
| **A3** | **Primary audience = Bauunternehmen / Generalunternehmer** who subcontract trench milling. No co-primary audience; utility operators are not a design lane. | `R1 Q3a` |

### B. Brand & visual language

| # | Decision | Rationale |
| --- | --- | --- |
| **B1** | Keep the logo and the core navy `#0a1f2e`; the palette may be **extended** and the type scale **reworked**. | `R1 Q4b` |
| **B2** | **One direction, chosen and defended by the agent:** *industrial-technical* — dark navy as the dominant surface, oversized Raleway display type, the machine treated as a real object, generous space, **hard edges and precise rules rather than rounded cards and decorative gradients**. The user reacts to the prototype rather than choosing from multiple directions. | `R2 Q2a` |
| **B3** | **Signal colour = the machine's own orange `#f08a24`**, used **exclusively for primary CTAs**, always with **dark navy text on it**. The `#6372ff → #5ca9fb` gradient is retired from CTAs. | `R3 Q1a`. The machine render and the logo wordmark are both orange, so blue CTAs compete with the brand's own imagery. Contrast: 6.7:1 navy-on-orange (passes AA) |
| **B4** | **Keep Raleway (100–900) + Open Sans (300–800)**, self-hosted. The new look comes purely from scale, weight contrast, tracking and line-height. **No new font files, no new licence.** | `R2 Q5a`. The variable Raleway already goes to 900 — that range is simply not being used today |
| **B5** | **Motion = CSS-only**: Tailwind transitions, hover/focus states, and a light scroll-reveal via a small `IntersectionObserver` hook — **all gated behind `prefers-reduced-motion`**. No animation library. | `R2 Q6a` |
| **B6** | **Logo handling:** the nav and footer show the **Emblem**, a dedicated 256x256 PNG (`public/img/emblem.png`) cut once from the Logo plate and transparent outside the circle. No vector is available, so the disc keeps the plate's slate wall inside the circle. The Logo plate (`logo.jpg`) lives in `design-assets/source/` as the Emblem's source (crop recorded in its README) and does not ship. **History:** originally the plate was kept as a brand element outside the nav, with a CSS crop of the disc in the nav (`R3 Q5a`); amended in R6 so the plate no longer appears on the page and the footer uses a larger Emblem plus the company name as text (C18); amended again by the Emblem-asset change, replacing the runtime CSS crop with the pre-cut PNG. | `R3 Q5a`; amended `R6 Q2a`. On the footer the plate read as a pasted-in grey photo |
| **B7** | **Team section stays on the dark background**; each portrait gets a **consistent framed light card**. | `R3 Q4b` — this overrides the agent's recommendation to move Team onto the light `surface` background |
| **B8** | **Type & heading hierarchy: sentence case, not uppercase.** The H1 drops the current `uppercase` in favour of sentence case with tight tracking and fluid sizing; H2s step down from it. **CTA buttons are solid orange rectangles with a small radius (2–4 px), not pills.** | `R4 Q1a`. Uppercase at ~5rem makes a 32-character German headline hard to read; the tagline already carries enough force without shouting |
| **B9** | **Nav behaviour: transparent over the hero, turning solid navy on scroll**, with a subtle bottom border, the anchors and the orange phone CTA. | `R4 Q2b` |

### C. Content & structure

| # | Decision | Rationale |
| --- | --- | --- |
| **C1** | **Copy is rewritable, German only.** Sections may be **added, removed and reordered**, but every factual claim must stay true and the legal pages stay untouched. "Same sections" in `R1 Q1a` means *same subject matter*, not a frozen list. | `R1 Q5b` + `R2 Q1b` |
| **C2** | **The machine is a concept / development project.** All copy stays in an honest register (*Entwicklung*, *geplant*, *soll*). No performance promises, no completed-project claims, no invented references. | `R3 Q2a`. See §1.7 — a page that says "we are building this" is more credible to a Bauunternehmer than one implying a machine is already on his Baustelle |
| **C3** | **Agreed page structure** (replaces the current order) — details in §4. | `R3 Q3a` |
| **C4** | The four modules baked into `fraese.png` are **reproduced as real HTML text** (numerals 01–04, name, one line each) alongside the render. No clean/un-annotated render is available. | `R3 Q6a`. At mobile widths the whole 1342 px raster scales to ~¼, putting its baked-in text at ~4 px — unreadable, and invisible to search engines and screen readers |
| **C5** | **No contact form.** Phone-first. The email uses a `mailto:` with a **pre-filled subject** plus a **copy-to-clipboard affordance**. | `R2 Q3c`. A form needs a third-party processor, which would force an edit to `datenschutz.html` — a file excluded from scope by `A1` |
| **C6** | **Persistent mobile call bar:** a fixed bottom "Anrufen" bar with the number, shown **below the `md` breakpoint only**. | `R3 Q7a`. With the call as the sole KPI (`A2`), hiding the number behind a scroll is the most expensive thing the page can do. No WhatsApp button — it would advertise a channel the company does not publish |
| **C7** | **No testimonials / references section**, because it would require fabricated content. | Derived from `C2` |
| **C8** | **The agent writes the new German copy directly in the prototype**, with every changed string flagged so it can be diffed against `data.json` and edited in place. `data.json` stays untouched until approval. | `R3 Q8a` |
| **C9** | **The machine render stays full-width at every breakpoint**, even though its baked-in annotations become illegible on mobile — the HTML module list (`C4`) carries the meaning. | `R4 Q3a` |
| **C10** | **A lightbox "view larger" affordance is added for the machine render** — a labelled button plus a click on the image opens it full-screen, gallery-style. Behaviour is specified by `C13`/`C14`. | `R4 Q3` — user addition |
| **C11** | **Marcus Auner is the named contact person for calls.** The Kontakt section names him rather than presenting an anonymous number. | `R4 Q5` |
| **C12** | **Background rhythm** (amended in R6): navy (nav + hero) → light (Verfahren) → navy (Einsatzbereiche) → light (Warum wir) → navy (Team) → **light (Kontakt)** → **navy `#0a1f2e` (Footer), with no hairline**. `brand.alt` `#14171a` no longer has a v2 consumer; ticket 12 retires it together with Section's `alt` tone. | `R4 Q4a`; amended `R6 Q4` (E4, from the throwaway prototype on local branch `prototype/footer-tone`, verdict commit `e9ce850`). The old navy Kontakt → `brand.alt` footer step was only about 1.07:1, so a hairline was the only separator, which contradicts "structure without borders". White → navy is 15.6:1. Alternating also stops the light-backdropped render and the white studio portraits from reading as mistakes |
| **C13** | **Lightbox mechanism: the native `<dialog>` element opened with `showModal()`**, styled with Tailwind. No library, no hand-rolled focus trap, no manual scroll lock. | `R5 Q1a`. Attached via a ref; the browser supplies the focus trap, Esc-to-close and `::backdrop` for free. Hand-rolling a focus trap is the most common way an overlay like this ends up unusable by keyboard |
| **C14** | **Lightbox affordances:** the render shown as large as the viewport allows on a dark navy backdrop; closes on **Esc**, an explicit **close button** and a **backdrop click**; **focus returns to the trigger** on close; **no pan/zoom UI** (the source is a 1342 px raster — magnifying past 1:1 only shows interpolation). The trigger is a **labelled button reading "Größer ansehen" with a `Maximize2` icon**; the render itself is also clickable for pointer users, but the button is the accessible affordance. A caption reads **"Fräsmodul, Aufnahme-, Förder- und Antriebsmodul"**. | `R5 Q2a`. The caption is the only text a screen-reader user gets when the image opens full-screen |
| **C15** | **Marcus Auner is the person you call, named in Kontakt without a portrait** (amended in R6). His label sits directly beside the number on two lines: "Marcus Auner" in display type, "Geschäftsführung" beneath in smaller type, no middle dot (the Team caption pattern). His face appears once on the page, in Team. | `R5 Q3a`; amended `R6 Q1a` + `R6 Q9`. With Team directly above, the reused portrait put the same photo twice about a section apart. On white (C12) the framed card would also lose its frame. The one-line label wrapped badly on phones (F6) |
| **C16** | **Nav CTA label and number format:** on `lg` and up the button shows the number, below that the verb **"Anrufen"**. The **displayed** number is the local **`0176 618 77 599`** (what an NRW Bauunternehmer reads fastest), while the `tel:` href keeps the international **`+49 176 618 77 599`** exactly as `data.json` stores it. | `R5 Q4b` |
| **C17** | **Kontakt layout without the portrait:** two columns from `md` up, with the eyebrow, H2 and intro on the left and the contact block on the right (name and role, orange call, divider, email and copy). Below `md` it stacks heading first. | `R6 Q8a`. Fills the white section's width, and on phones the "Kontakt" anchor lands on the heading with the call near the top (resolves E5/F5) |
| **C18** | **Footer content:** brand block on the left (Emblem, "Ingenieurbüro-Auner GmbH" as text, "© {current year} Ingenieurbüro-Auner GmbH" with the year computed at render), legal links on the right from `sm` up; stacked and centred below. **No address, no trust line, no phone, no email.** | `R6 Q2a` + `R6 Q3` + `R6 Q10`. The user declined the address line. Contact details stay in Kontakt only |
| **C19** | **Team cards share one height per row** where they sit side by side, through a documented fill option on the portrait-card primitive (the default stays unchanged). | `R6 Q6` (E6/F7) |

### D. Technical & workflow

| # | Decision | Rationale |
| --- | --- | --- |
| **D1** | **Hold the technical envelope:** CRA 5 + `react-scripts` 5.0.1 + React 17, Tailwind v3, no router, no new heavy dependencies, self-hosted fonts only, no `postcss.config.js`, `lucide-react` for icons. | `R1 Q6` |
| **D2** | **Prototype = one full single page at real fidelity**: every section, rewritten German copy, real breakpoints, on branch **`design/v2` off `master`**. Old components stay recoverable from git. | `R2 Q7a` |
| **D3** | **Review gate:** no PR to `master` until explicit approval; review happens via local `npm start`. | `R2 Q7a`. See the hard rule in §2 for the deploy reason |
| **D4** | **Housekeeping in the same branch:** fix the four broken favicon references, fill the empty meta description, add Open Graph / Twitter tags. **Prune the dead images only after the new design confirms they are still unused.** | `R2 Q8a`. A page optimised to be *called* should also preview properly when pasted into a WhatsApp group — which is how a Bauunternehmer will actually share it |
| **D5** | **Prototype file layout: `src/prototype/`**, with `src/App.jsx` temporarily pointing at it, so the existing components stay untouched and the whole prototype can be reverted in one line. | `R4 Q6a`. `D2` calls the prototype throwaway — this is the only option where that is literally true |
| **D6** | **Post-approval migration: the v2 structure becomes the source of truth.** The old components (`header.jsx`, `features.jsx`, `about.jsx`, `services.jsx`, `Team.jsx`, `contact.jsx`, `Footer.jsx`) are deleted in the same branch, and `data.json` is updated to the approved copy. | `R4 Q7a`. Keeping both sets would leave two competing component trees for the next agent to disambiguate |

---

## 4. Agreed page structure (C3)

| # | Section | Anchor | Background | Content |
| --- | --- | --- | --- | --- |
| 1 | Sticky nav | — | navy | Emblem, anchors **Verfahren · Einsatzbereiche · Team · Kontakt**, phone CTA (orange) — number on `lg+`, "Anrufen" below (C16); transparent over the hero, solid navy on scroll (B9) |
| 2 | Hero | `#start` | navy | `Wir schaufeln nicht – wir fräsen` as the H1, one subline naming the field, phone CTA. **Typographic — deliberately *not* the machine render.** Trust line `Maschinenbau aus NRW` |
| 3 | Verfahren / Die Maschine | `#verfahren` | light | The render, large and full-width at every breakpoint (C9), with the lightbox trigger (C10, C13, C14), plus the four modules as real HTML text (C4) |
| 4 | Einsatzbereiche | `#einsatzbereiche` | navy | The four areas: Stromtrassen · Wasserstoff & Fernwärme · Wasser & Abwasser · Weitere Infrastruktur |
| 5 | Warum wir | `#warum` | light | The three Services points, reworded from hedged to plain (within C2) |
| 6 | Team | `#team` | navy | The three real people, framed light cards (B7) |
| 7 | Kontakt | `#kontakt` | light | **Marcus Auner named beside the number, no portrait** (C11, C15); two columns from `md` (C17); phone-first; email with pre-filled `mailto:` + copy-to-clipboard (C5) |
| 8 | Footer | — | navy, no hairline (C12) | Emblem + company name + © line, links to Impressum / Datenschutz (B6, C18) |

### 4.1 Concrete visual spec

What "industrial-technical" (`B2`) means in practice, so a fresh agent does not reinterpret it:

- **Surface**: navy `#0a1f2e` dominant, including the footer (C12, amended in R6). `brand.alt` `#14171a` is no longer used by v2. No decorative gradients — the `accent` gradient is retired from CTAs (`B3`).
- **CTA**: solid orange `#f08a24` with **navy `#0a1f2e` text**, radius 2–4 px, **never a pill** (`B8`). Hover/focus = a darkened shade of the same orange. **Never white text on orange** (§1.9).
- **Type**: Raleway 700–900 for display, fluid sizing (~2.5rem → 5rem for the H1), **sentence case, not uppercase** (`B8`), tight tracking at display sizes. Open Sans 300–800 for body — `text-neutral-600` on light surfaces, a light neutral on navy.
- **Edges**: hard — rectangles and 1 px rules rather than rounded cards and soft shadows. The one deliberate exception is the framed Team cards (`B7`).
- **Space**: generous section padding. The page should read calm and precise, not dense.
- **Motion**: transitions on hover/focus plus a light scroll reveal via `IntersectionObserver`, everything behind `prefers-reduced-motion` (`B5`).
- **Icons**: `lucide-react` 1.54 at a consistent stroke width. No emoji, no decorative gradient circles.

**Key moves vs today**

- The machine render stops being a wordless full-bleed image (`features.jsx`) and becomes a section that actually explains the machine.
- `Maschinenbau aus NRW` — currently the odd heading on the *Team* section — becomes the hero's trust line.
- The four About cards stop floating as white tiles on navy.
- The page gains navigation, which it currently does not have at all.

**Anchors used:** `#start`, `#verfahren`, `#einsatzbereiche`, `#warum`, `#team`, `#kontakt`.

---

## 5. Open questions

**None. The frontier is empty — the design is frozen.**

Every branch of the design tree has been visited and recorded in §3, with nothing left silently assumed. All five interview rounds are closed.

If implementation turns up a genuine conflict with a decision in §3, raise it with the user rather than silently changing a settled decision.

**Round 6 (2026-10-16, closed):** after reviewing the assembled page, the user reopened B6, C12 and C15 and added C17–C19. Implementation is ticket `.scratch/design-v2/issues/11.1-human-review-fixes.md`.

---

## 6. Task list

### Setup
- [x] Create branch `design/v2` off `master` (`e5ffdd6`)
- [x] `npm ci`
- [x] Prototype scaffold: `src/prototype/` + the temporary `App.jsx` pointer (D5)
- [ ] **Do not re-open settled decisions** — §3 is frozen. If something genuinely conflicts during implementation, raise it with the user instead of silently changing it

### Theme
- [x] Extend `tailwind.config.js`: orange signal colour `#f08a24` (+ a hover/active shade), a custom neutral ramp, retire the `accent` gradient from CTAs, add a shadow/ring token set for the framed cards (B7)
- [x] Rework the type scale: display sizes for Raleway at 700–900, tighter tracking, body sizes for Open Sans
- [x] Add `prefers-reduced-motion` handling and the `IntersectionObserver` reveal hook (B5)
- [x] Add an AA-contrast CTA button component (orange fill, navy text)

### Sections (per §4)
- [ ] Nav + Emblem (B6), transparent-over-hero behaviour (B9), with the mobile call bar (C6)
- [ ] Hero, sentence-case fluid H1 (B8)
- [ ] Verfahren incl. the four modules as HTML text (C4) and the lightbox trigger (C10)
- [ ] Lightbox component — native `<dialog>` + `showModal()`, "Größer ansehen" trigger, caption, focus return (C10, C13, C14)
- [ ] Einsatzbereiche
- [ ] Warum wir (rewrite the three hedged Services points, C2/C8)
- [ ] Team, framed light cards (B7)
- [ ] Kontakt — Marcus Auner named (C11), phone-first, pre-filled `mailto:`, copy-to-clipboard (C5)
- [ ] Footer with the logo plate

### Housekeeping (D4)
- [x] Fix the four broken favicon references in `public/index.html`
- [x] Fill the meta description
- [x] Add Open Graph + Twitter card tags
- [x] Prune dead images **only after** the design lands (ticket 12). Pruned set is now `emblem.png`, `fraese.png`, `jan.png`, `klaus.png`, `marcus.png`; the Logo plate moved to `design-assets/source/` (`.scratch/emblem-asset/spec.md`)

### Review & ship
- [ ] `npm start` and self-review at ~375 / ~768 / ~1280 px, keyboard-only, and with reduced motion
- [x] Present the prototype to the user; collect feedback (R6 → ticket 11.1; approved 2026-10-16)
- [x] On approval: migrate copy into `data.json`, delete the old components (D6), prune dead assets (ticket 12, awaiting review)
- [ ] Open a PR to `master` **only after explicit approval** — merging deploys the live site

---

## 7. Explicitly rejected / not doing

- ❌ A contact form (C5) — would require a third-party processor and a `datenschutz.html` edit.
- ❌ Testimonials, references or logo walls (C7) — no real content exists; fabricating it would break `C2`.
- ❌ WhatsApp CTA (C6) — advertises a channel that isn't published.
- ❌ Moving Team onto a light background (B7 overruled the agent's recommendation).
- ❌ New fonts, a router, an animation library, a Tailwind upgrade, or any migration off CRA (`R1 Q6`).
- ❌ Making the Logo plate itself transparent, or a background-free phoenix cut-out — the plate is a photo mockup JPEG. Instead the Emblem is cut once as a circular, alpha-masked PNG (B6); the slate wall stays visible inside the circle.
- ❌ Revealing the machine render's baked-in annotations as the primary content — they scale to ~4 px on mobile (C4).
- ❌ Hiding the render on mobile, or CSS-zooming into it (`R4 Q3`) — the render is the most persuasive asset on the page, and a crop risks cutting the very detail it is meant to show.
- ❌ An auto-hiding nav (`R4 Q2`) — it would hide the call CTA exactly when `A2` says it must be reachable, and it fights the mobile call bar (`C6`).
- ❌ A trigger-only, click-anywhere-to-zoom lightbox with no visible button — the labelled button is the accessible affordance (C10).
