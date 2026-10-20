import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import PortraitCard from "../ui/PortraitCard";
import data from "../../data/data.json";

/**
 * Unternehmen — the former Team section (DESIGN_PLAN.md §4 row 6, decision B7).
 *
 * The three real people stay on the navy background (B7 overrides the move to a light surface).
 * Their white studio backdrops read as intentional because every portrait sits in the SAME framed
 * light card: the shared `PortraitCard` primitive from ticket 02, consumed as-is. The 3:4 crop and
 * `object-top` live inside that primitive, so this file never sets a ratio or object position —
 * which also keeps Marcus Auner's crop identical to the one ticket 09 (Kontakt) renders.
 *
 * LAYOUT: one column on phones, three across from `md` (768px) up — never two, which would orphan
 * the third card. In the single-column range the card is capped at `max-w-xs` (and centred) through
 * PortraitCard's documented `className` width hook, so a portrait does not balloon to 600px wide
 * between 640 and 767px. The ratio and crop stay the primitive's.
 *
 * EQUAL HEIGHTS (11.1, C19): each card opts into PortraitCard's `fill` option, so a wrapped name
 * (e.g. "Jan Hönninger" at tablet widths) that makes one caption taller does not leave the other two
 * cards shorter than their row. The grid's default `align-items: stretch` already gives each `<li>`
 * the row's full height; `fill` is what makes the card itself stretch to match.
 *
 * ALT TEXT: empty on purpose. The figcaption directly under each portrait already names the person
 * and their role; repeating the name as alt would make screen readers announce it twice. The photo
 * conveys nothing beyond "this is <name>", which the caption says.
 *
 * HEADINGS: eyebrow "Das Unternehmen" → H2 (names the section) → H3 "Team" → intro and portraits.
 *
 * COPY: `data.json` `Unternehmen` (eyebrow, H2, and under `team` the H3, intro, list name, and each
 * person's image path, name and role). The old heading `Maschinenbau aus NRW` is now the hero's trust line (§4.1 "Key
 * moves") and is deliberately not repeated here. The intro stays in the honest development
 * register of C2 ("entwickeln", no completed-project claims).
 */
const {
  eyebrow: EYEBROW,
  heading: HEADING,
  team: { heading: TEAM_HEADING, intro: INTRO, listLabel: LIST_LABEL, people: PEOPLE },
} = data.Unternehmen;

const HEADING_ID = "unternehmen-heading";

const Unternehmen = () => (
  <Section id="unternehmen" tone="navy" aria-labelledby={HEADING_ID}>
    <Reveal className="max-w-2xl">
      <p className="text-eyebrow text-mist-400">{EYEBROW}</p>
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-mist-100">
        {HEADING}
      </h2>
      <h3 className="mt-10 text-display-md text-mist-100">{TEAM_HEADING}</h3>
      <p className="mt-4 text-body-lg">{INTRO}</p>
    </Reveal>

    <Reveal
      as="ul"
      aria-label={LIST_LABEL}
      className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8"
    >
      {PEOPLE.map(({ img, name, role }) => (
        <li key={name}>
          <PortraitCard
            src={img}
            alt=""
            name={name}
            role={role}
            fill
            className="mx-auto max-w-xs md:max-w-none"
          />
        </li>
      ))}
    </Reveal>
  </Section>
);

export default Unternehmen;
