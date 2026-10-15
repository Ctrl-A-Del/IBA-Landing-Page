# 05: Verfahren — machine render, four modules, lightbox

**What to build:** The machine render stops being a wordless full-bleed image and becomes a section that actually explains the machine: the render at full width, the four modules it carries as real text, and a way to see the render larger.

**Blocked by:** 02 (Theme foundation and shared primitives)

**Status:** claimed

- [ ] The section is anchored at `#verfahren` on the light background
- [ ] The render is full width at every breakpoint, including mobile, and is never hidden, cropped or CSS-zoomed
- [ ] The four modules appear as real HTML text — numerals 01–04, a name and one line each — covering Fräsmodul, Aufnahmemodul, Fördermodul and Antriebsmodul
- [ ] The module text is readable at ~375 px, where the render's own baked-in annotations scale down to roughly 4 px
- [ ] The module list is available to screen readers and to search engines as text
- [ ] A labelled button reading "Größer ansehen" with a maximise icon opens the render full-screen
- [ ] The render is also clickable for pointer users, but the labelled button is the accessible affordance — the feature is never trigger-only
- [ ] The enlarged view opens through the native dialog element's modal mode, so focus trapping, Esc-to-close and the backdrop come from the browser rather than hand-rolled code
- [ ] The enlarged view shows the render as large as the viewport allows, on a dark navy backdrop
- [ ] There is no pan or zoom UI — the source is a finite raster, so magnifying past 1:1 only shows interpolation
- [ ] It closes on Esc, on an explicit close button, and on a backdrop click
- [ ] Focus returns to the element that opened it on every exit path
- [ ] A caption reading "Fräsmodul, Aufnahme-, Förder- und Antriebsmodul" is associated with the enlarged render, so a screen-reader user gets that text when it opens
- [ ] The dialog is operable keyboard-only and announces itself
- [ ] No lightbox library is added
