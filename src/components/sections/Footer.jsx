import Emblem from "../ui/Emblem";
import { GUTTER, TONES } from "../ui/Section";
import { FOCUS_ON_DARK } from "./focus";
import data from "../../data/data.json";

/**
 * Ticket 10 — Footer (DESIGN_PLAN.md §4 row 8, decisions B6, C12, C18, amended 11.1/R6).
 *
 * Renders the page's <footer> landmark, outside <main> (page contract in `src/App.jsx`):
 * the brand block (emblem + company name + copyright line, C18) and the two legal links, on the
 * brand navy that closes the background rhythm (C12 amended — navy, not `brand.alt`, and no
 * hairline, since white-to-navy is already a 15.6:1 step).
 *
 * WHY NOT `<Section tone="navy">`: the primitive renders a <section> with the content-section
 * rhythm (`py-20 … lg:py-36`). The footer must be a <footer> landmark and is not a content section,
 * so it imports the primitive's `TONES.navy` and `GUTTER` class strings instead of the element.
 *
 * NO LOGO PLATE (B6 amended): the Logo plate read as a pasted-in grey photo on the near-black
 * footer. The brand block is instead the same Emblem the nav uses (`../ui/Emblem`), larger,
 * plus the company name set as real text — so the name is announced once, not twice as image alt
 * and text. The Emblem is decorative (empty alt) for that reason.
 *
 * NO CONTACT DETAILS here: the footer repeats none of the phone/email shown in the Kontakt section
 * above, so it cannot drift from Kontakt; a test guards that it has no tel:/mailto: link.
 *
 * THE MOBILE CALL BAR does not cover this footer: ticket 03's `Nav` reserves the bar's height as
 * `<body>` bottom padding below `md`, so the footer's last line scrolls clear of it.
 */

// Copy from `data.json` `Footer`; the Legal page links come from `data.json` `LegalPages`, the same
// list the app resolves its paths against (`src/App.jsx`).
const LEGAL_LINKS = data.LegalPages.map(({ slug, linkLabel }) => ({
  href: `/${slug}/`,
  label: linkLabel,
}));

const COMPANY = data.Footer.company;

const Footer = () => (
  <footer className={`${TONES.navy} py-12 sm:py-16`}>
    <div className={`${GUTTER} flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
        <Emblem className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
        <div>
          <p className="font-heading text-body font-bold text-mist-100">{COMPANY}</p>
          <p className="mt-1 text-body-sm text-mist-400">
            © {new Date().getFullYear()} {COMPANY}
          </p>
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
        {LEGAL_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className={`rounded-edge font-body text-body-sm text-mist-300 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline ${FOCUS_ON_DARK}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
