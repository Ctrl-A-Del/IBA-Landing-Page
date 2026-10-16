/**
 * Ticket 10 — Footer (DESIGN_PLAN.md §4 row 8, decisions B6, C12).
 *
 * Renders the page's <footer> landmark, outside <main> (shell contract in `../Prototype.jsx`):
 * the full framed logo plate as the brand element (B6 — the nav only carries a crop of the emblem)
 * and the two legal links, on the `brand.alt` surface that closes the background rhythm (C12).
 *
 * WHY NOT `<Section tone="alt">`: the primitive renders a <section> with the content-section
 * rhythm (`py-20 … lg:py-36`). The footer must be a <footer> landmark and is not a content section,
 * so it reuses the primitive's `alt` tone classes and page gutter verbatim instead of the element.
 * A hairline top rule (the same `mist-500/40` rule the nav uses) separates it from the navy Kontakt
 * section above, since `#14171a` against `#0a1f2e` alone is a quiet step.
 *
 * NO CONTACT DETAILS here: the footer repeats none of the phone/email shown in the Kontakt section
 * directly above, so it cannot drift from Kontakt; a test guards that it has no tel:/mailto: link.
 * The legal pages in `public/` are linked, not touched.
 *
 * THE MOBILE CALL BAR does not cover this footer: ticket 03's `Nav` reserves the bar's height as
 * `<body>` bottom padding below `md`, so the footer's last line scrolls clear of it.
 */

const LEGAL_LINKS = [
  { href: `${process.env.PUBLIC_URL}/impressum.html`, label: "Impressum" },
  { href: `${process.env.PUBLIC_URL}/datenschutz.html`, label: "Datenschutzerklärung" },
];

// White focus outline (16.8:1 on navy; higher still on #14171a). Outline, not ring, so it survives
// forced-colours mode. Same recipe as Nav's FOCUS_ON_NAVY (not imported: Nav is ticket 03's file and
// does not export it; shared primitives are ticket 02's).
const FOCUS_ON_NAVY =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const Footer = () => (
  <footer className="border-t border-mist-500/40 bg-brand-alt py-12 text-mist-300 sm:py-16">
    <div className="mx-auto flex w-full max-w-container flex-col items-center gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
      {/*
        The full plate (B6). `logo.jpg` is an opaque 540x935 JPEG, so it is shown whole, never
        cropped: a fixed width with `h-auto` scales it proportionally, and the intrinsic width/height
        attributes let the browser reserve that ratio before the image loads.
      */}
      <img
        src={`${process.env.PUBLIC_URL}/img/logo.jpg`}
        alt="Ingenieurbüro-Auner GmbH"
        width="540"
        height="935"
        loading="lazy"
        decoding="async"
        className="h-auto w-28 shrink-0 sm:w-32"
      />

      <div className="flex flex-col items-center gap-4 sm:items-end">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {LEGAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`rounded-edge font-body text-body-sm text-mist-300 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline ${FOCUS_ON_NAVY}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
