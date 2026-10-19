# Emblem source

`logo.jpg` is the **Logo plate**: the full 540x935 photo mockup of the logo. It is the source for
`public/img/emblem.png` and does not ship with the site.

## How the Emblem was produced

- Crop box in the source: the 340x340 px square with top-left at (135, 222), so x 135..475, y 222..562.
  Framing kept as in the former CSS crop (not re-centred, no perspective correction).
- Resampled to 256x256 (high-quality bicubic).
- Circular alpha mask (anti-aliased ellipse 256x256); fully transparent outside the circle.
- Quantised to a 128-colour palette (median cut, no dithering) with per-entry alpha (PNG colour
  type 3 + `tRNS`), which brings the file to about 30 KB (unquantised RGBA was 123 KB).
- Exported one-off from a scratch location (.NET System.Drawing plus a small Node PNG encoder);
  no dependency was added to `package.json`.

To regenerate, repeat the steps above with any image tool and replace `public/img/emblem.png`. The
page test checks the file is a 256x256 PNG with alpha.

## How the Favicon was produced

The Favicon (`public/favicon.ico`, `public/apple-touch-icon.png`) is built from `public/img/emblem.png`,
not from the Logo plate. At 16 to 48 px the Emblem's gear ring blurs, so the Favicon uses the **Phoenix
mark** instead (decision: phoenix-only crop, with a contrast boost, one artwork for every output).
It is a stylised variant of the Emblem because of the contrast edit.

- Crop box in `emblem.png`: 190x190 px, top-left at (33, 22).
- Contrast boost `linear(1.25, -32)` and `sharpen(sigma 0.6)`, then a circular alpha mask.
- `favicon.ico`: 16, 32 and 48 px PNG frames, Lanczos downscale, transparent outside the circle.
- `apple-touch-icon.png`: 180x180, opaque navy `#0a1f2e`, the 144 px mask centred (18 px padding).
- Generated one-off with `sharp` installed in a scratch folder; the ICO is written by hand (PNG
  frames in an ICO container). No dependency was added to `package.json`. To regenerate, repeat these
  steps and replace both files.
- At 16 px the mark reads as a dark disc, not a recognisable phoenix; 32 px and up show the wing
  swirl and the gold eye.
