# Spec: A proper Emblem asset instead of a CSS-cropped Logo plate

Status: ready-for-agent
Type: enhancement

## Problem Statement

The round brand mark shown in the header (nav) and the footer is not its own image. Both places load
the full Logo plate, a 540x935 opaque JPEG (about 215 KB) that is a photo mockup of the logo on a slate
wall, and hide almost all of it with CSS (percentage offsets, an oversized width and a circular
overflow clip). Visitors download a large portrait photo to see a disc that is roughly 40 to 64 px
wide. The crop maths lives in the component, the page is tied to the exact pixel geometry of one
source file, and the unneeded plate ships in `public/`.

## Solution

Create a dedicated Emblem image: a small square PNG that contains only the round gear-ring mark, with
transparency outside the circle. The nav and footer use this image directly, with no CSS cropping.
The original Logo plate stays in the repository as the source for regenerating the Emblem, but no
longer ships with the site. The page looks the same as today; it just loads a much smaller, purpose-made file.

## User Stories

1. As a site visitor, I want the header logo to load quickly, so that the page feels fast on a slow mobile connection.
2. As a site visitor, I want the footer logo to load quickly, so that the bottom of the page does not trigger a heavy download.
3. As a site visitor on a high-density phone, I want the emblem to be sharp, so that the brand looks professional.
4. As a site visitor, I want the emblem in the nav and footer to look the same as it does now, so that the redesign's approved look is not changed by a technical fix.
5. As a visitor on the navy nav and footer, I want the emblem to sit on the page as a clean disc with no grey rectangle around it, so that it does not look pasted in.
6. As a screen-reader user, I want the decorative emblem to be skipped, so that I hear the company name as text rather than a redundant image description.
7. As the site owner, I want the full Logo plate not to ship to visitors, so that bandwidth is not spent on an image nobody sees.
8. As the site owner, I want the emblem to be a real asset, so that it can later be reused for a favicon, touch icon or social image without re-deriving a crop.
9. As a developer, I want one Emblem component with the same sizing interface for nav and footer, so that the two cannot drift apart.
10. As a developer, I want the Emblem component to be a plain image without crop percentages, so that I do not need to understand the old crop maths to change its size.
11. As a developer, I want the source Logo plate kept in the repo outside `public/`, so that the Emblem can be regenerated or re-cut if the artwork changes.
12. As a developer, I want the exact crop used to create the Emblem recorded, so that the asset can be reproduced.
13. As a developer, I want the tests to fail if the Logo plate is referenced or served again, so that the heavy image does not creep back in.
14. As a developer, I want the tests to fail if the Emblem file is missing, the wrong size or has no alpha channel, so that a bad export is caught before deploy.
15. As a maintainer, I want the design plan and glossary to say what an Emblem and a Logo plate are, so that future work uses the same words.
16. As a maintainer, I want the previously stated non-goal about making the logo transparent updated, so that the plan does not contradict the repo.
17. As a maintainer, I want this work done on a feature branch with no pull request opened, so that the live site is not deployed by accident.
18. As a reviewer, I want before and after evidence that the nav and footer look unchanged, so that I can approve without hunting for regressions.

## Implementation Decisions

- **New asset:** a 256x256 PNG named `emblem.png` in the public images folder. It is cut from the Logo plate using the crop already established in the current component (the 340x340 px square whose top-left is at (135, 222) in the 540x935 source). The crop framing is deliberately kept as is (not re-centred, no perspective correction).
- **Content of the asset:** the same disc as today, meaning gear ring, phoenix and the slate wall visible inside the circle. Transparency exists only outside the circle, applied as a circular alpha mask. The artwork is a photographic mockup, so a "phoenix only" cut-out is not possible without redrawing it as a vector; that is out of scope.
- **Size:** one file at 256x256 with no `srcset`. This covers about 2x density at the largest footer size. If the exported file is above roughly 30 KB, quantise it.
- **Emblem component:** becomes a plain image element that points at the new PNG, with intrinsic width and height of 256, an empty `alt` (decorative), a rounded-full class, the existing hairline ring, and the `data-emblem` marker moved onto the image itself. The public interface is unchanged (a single `className` prop for sizing), so the nav and footer should not need changes beyond verification. The wrapper element and crop percentages are removed, and the component's doc comment is rewritten to describe the new reality.
- **Logo plate:** moved out of the public folder into a source-assets location in the repo (for example `design-assets/source/`), kept in version control, and not deleted. A short note beside it records the crop box and the export settings used to produce the Emblem.
- **Terminology:** add a `GLOSSARY.md` at the repo root defining **Logo plate** (the full framed photo mockup, the source image) and **Emblem** (the round gear-ring mark as its own asset). The glossary contains no implementation details.
- **Design plan:** amend decision B6 and the "Making `logo.jpg` transparent" non-goal, and the lines that say the plate "stays in `public/` as the crop source", and the pruned-assets list, so they describe the Emblem asset and the relocated plate. No ADR is written: the change is cheap to reverse and the plan already records such decisions.
- **Not touched:** favicon, apple-touch icons and the Open Graph image. The missing favicon (a 404) remains a separate follow-up.
- **Git workflow:** work on a new branch (for example `design/emblem-asset`) created from the current branch. Commit only files belonging to this change and leave the pre-existing uncommitted `.gitignore` modification alone. Do not push and do not open a pull request without explicit human approval: opening a PR to `master` deploys the live site.

## Testing Decisions

- **What a good test is here:** assert externally observable behaviour: what the rendered page references and what is actually shipped. Do not assert class names, pixel offsets or the internal structure of the component.
- **One seam:** the existing page-level integration test, which renders the whole page and also reads the public folder from disk. All new and changed assertions live there. No new seams are introduced.
- **Rendered page:** exactly two emblem images exist (nav and footer), each with a source ending in `/img/emblem.png`, an empty `alt`, and the `data-emblem` marker on the image. No image on the page references `logo.jpg`. The existing check that no image carries the company name as alt text stays.
- **Shipped files:** the public images folder contains exactly `emblem.png`, `fraese.png`, `jan.png`, `klaus.png` and `marcus.png` (replacing the existing exact-list assertion that currently names `logo.jpg`).
- **The shipped PNG:** read from disk and verified to have the PNG signature, 256x256 dimensions and an alpha channel (colour type with alpha). This is a check on the file at the same seam, not a new seam.
- **Existing component-level test:** the footer test currently asserts that the emblem source matches `logo.jpg`; update it to the new file name and the same decorative-image expectations rather than adding a second layer of tests.
- **Prior art:** the same page test file already holds the "images exist", "public/img holds exactly N images" and "every logo sits inside a round emblem crop" checks that this change rewrites.
- **Manual verification:** compare production-build screenshots of the nav and footer before and after at 375 px and 1280 px to confirm the emblem looks unchanged. The repo already has a before/after screenshot script from the previous redesign that can be reused.

## Out of Scope

- Favicon, apple-touch icons and the Open Graph / Twitter image (the existing favicon 404 stays open).
- Re-centring the crop on the ring, correcting the perspective skew or including the outer broken arcs and small orange gear.
- Redrawing the logo as a vector (SVG) or producing a true background-free cut-out of the phoenix.
- Multiple resolutions, `srcset`, WebP or AVIF variants.
- Any change to the nav or footer layout, sizes or copy.
- Pushing the branch or opening a pull request.

## Further Notes

- The existing source image is a photo mockup of a 3D metallic logo; the phoenix is dark slate on slate. On the navy surfaces the disc reads as a slate badge, which is how it looks today and is the approved appearance.
- The emblem's ring in the source is slightly elliptical from perspective, so a circular crop shows a little wall at the left and right. This is accepted.
- This change reverses part of the earlier design note that said cropping was the only option; the new constraint is that the crop is now done once, at asset-creation time, instead of at runtime.
- A tool for image export (for example a Node image library or a Python imaging library) is not currently installed in the repo or in the Python environment. The implementing agent should do the one-off export from a scratch location without adding a runtime dependency to `package.json`.

## Comments
