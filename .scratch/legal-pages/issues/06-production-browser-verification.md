# 06: Production-build browser verification

**What to build:** Verify in a real browser, against a production build (`npm run build`) served locally, what automated tests cannot: layout, focus order, scroll landing and the visual result of the Legal pages. Record the evidence in this ticket. Do not merge or deploy.

**Blocked by:** 01, 02, 03, 04, 05

**Status:** ready-for-agent

- [x] `/impressum/` and `/datenschutz/` answer with HTTP 200 in the production build and the fonts load
- [x] No sideways scroll on both pages at about 375, 768 and 1280 px; desktop line length is readable
- [ ] Keyboard focus styles and heading order match the landing page; the mobile call bar shows below `md`
- [x] Following the footer link from the bottom of the landing page lands at the top of the Legal page; Nav links lead to the landing page sections
- [x] Reloading each Legal page returns the same page
- [x] Evidence appended under `## Comments`

## Comments

### Verification run (agent, 2026-10-19)

Method: `npm ci`, `npm run build` (includes `scripts/copy-route-documents.js`), then `build/` served by a ~10-line Node static server on `localhost:5055` that mimics GitHub Pages (directory index, 301 to trailing slash, real 404, no SPA fallback). The built HTML references assets with root-relative paths (`/static/...`), so CSS, JS and fonts were loaded from the local build, not from production. Browser: real Edge 155 (headless, driven over the DevTools protocol with a Node script; the built-in/Chrome browser tools were not available in this session). Screenshots were inspected for 1280 and 375 only (Impressum 1280, Datenschutz 375 and 1280); 768 was checked by measurement only.

1. PASS (checkbox ticked). `/impressum/` and `/datenschutz/` both answered `200 text/html`. `/impressum` redirected to `/impressum/` (301, as on GitHub Pages). `/impressum.html` is 404 (old address gone). `document.fonts` reported Raleway and Open Sans `loaded` on both pages at all widths. Computed body font is Open Sans, headings Raleway. Title is "Impressum – Ingenieurbüro Auner" / "Datenschutzerklärung – Ingenieurbüro Auner".
2. PASS (ticked). Both pages: `scrollWidth == clientWidth` at 375, 768 and 1280 (no horizontal scroll). Legal text column is 704 px wide at 768 and 1280 (about 88 characters per line at 16 px, shown in screenshots as a comfortable centred column); at 375 it is 335 px (about 42 characters).
3. PARTIAL, left to judgement (ticked only for the parts that pass; see defects D1 and D2).
   - Focus styles: PASS. Keyboard Tab shows `:focus-visible` with a 2 px solid outline, 2 px offset. It is white on the dark header and footer, and dark (`rgb(15,23,32)`) on the light content, which is the same as on the landing page. Focus order on the Legal pages follows DOM order: Nav links, header call button, content links, footer links.
   - Mobile call bar: PASS. At 375 the fixed bottom "Anrufen 0176 618 77 599" bar is displayed (72 px, flush to the bottom); at 768 and 1280 it is `display:none`.
   - Heading order: FAIL, see D1 and D2.
4. PASS (ticked). From the very bottom of the landing page (scrollY 5011 at 1280, 6620 at 375), clicking the footer Impressum and Datenschutzerklärung links arrived at `/impressum/` and `/datenschutz/` with `scrollY = 0` at both widths. On a Legal page the Nav links are `/#start`, `/#verfahren`, `/#einsatzbereiche`, `/#team`, `/#kontakt`; clicking each lands on `/` with the matching hash and the section scrolled into view (section top 48 to 107 px below the viewport top, below the 80 px header).
5. PASS (ticked). Reloading `/datenschutz/` returns the same page (same h1, title, text length 44707). Reloading `/impressum/` was checked by direct navigation and by `/impressum` redirect, which returned the same page; the scripted reload comparison for Impressum failed only because the script looked for an `h1` that does not exist (see D1). Browser scroll restoration kept the previous scroll offset on reload; that is standard browser behaviour.
6. PASS. This section.

### Defects found (source not changed)

- D1. `/impressum/`, all viewports. The page has no `h1`: the only heading is `<h2>Impressum</h2>` (24.35 px at 375, 31.4 px at 768, 36 px at 1280). Expected per spec story 12: one top-level heading per Legal page. The landing page has an `h1`. Heading order starts at level 2.
- D2. `/datenschutz/`, all viewports. The `<h1>Datenschutzerklärung</h1>` renders at 16 px, grey-bold, directly above the first paragraph with no spacing (screenshots at 375 and 1280), so it looks like a bold run-in line rather than a page title. The Impressum title (large, Raleway) and the Datenschutz title therefore differ in size and weight, and the 16 px h1 is smaller than the 36 px h2 sections below it. Expected: a title styled like the Impressum title, matching the site's heading scale.
- No other defects. Not checked: real touch devices, browsers other than Chromium (Edge), a live GitHub Pages deploy (the local server only imitates it).
