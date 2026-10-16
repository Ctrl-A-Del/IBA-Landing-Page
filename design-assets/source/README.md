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
