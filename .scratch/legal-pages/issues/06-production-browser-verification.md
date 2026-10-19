# 06: Production-build browser verification

**What to build:** Verify in a real browser, against a production build (`npm run build`) served locally, what automated tests cannot: layout, focus order, scroll landing and the visual result of the Legal pages. Record the evidence in this ticket. Do not merge or deploy.

**Blocked by:** 01, 02, 03, 04, 05

**Status:** ready-for-agent

- [ ] `/impressum/` and `/datenschutz/` answer with HTTP 200 in the production build and the fonts load
- [ ] No sideways scroll on both pages at about 375, 768 and 1280 px; desktop line length is readable
- [ ] Keyboard focus styles and heading order match the landing page; the mobile call bar shows below `md`
- [ ] Following the footer link from the bottom of the landing page lands at the top of the Legal page; Nav links lead to the landing page sections
- [ ] Reloading each Legal page returns the same page
- [ ] Evidence appended under `## Comments`
