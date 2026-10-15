import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import PortraitCard from "../ui/PortraitCard";

/**
 * Ticket 08 — Team (DESIGN_PLAN.md §4 row 6, decision B7).
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
 * ALT TEXT: empty on purpose. The figcaption directly under each portrait already names the person
 * and their role; repeating the name as alt would make screen readers announce it twice. The photo
 * conveys nothing beyond "this is <name>", which the caption says.
 *
 * COPY (C8, flagged for diffing against `data.json`):
 *   names, roles, image paths = data.json `Team`, verbatim, hardcoded per parallelisation.md §3
 *     (wave 3 does not import or edit `data.json`; ticket 12 owns it).
 *   eyebrow, H2, intro = C8-NEW. The old heading `Maschinenbau aus NRW` is now the hero's trust
 *     line (§4.1 "Key moves") and is deliberately not repeated here. The intro stays in the honest
 *     development register of C2 ("entwickeln", no completed-project claims).
 */
const PEOPLE = [
  { img: "img/marcus.png", name: "Marcus Auner", role: "Geschäftsführung" },
  { img: "img/klaus.png", name: "Klaus Auner", role: "Einkauf" },
  { img: "img/jan.png", name: "Jan Hönninger", role: "Technischer Leiter" },
];

const HEADING_ID = "team-heading";

const Team = () => (
  <Section id="team" tone="navy" aria-labelledby={HEADING_ID}>
    <Reveal className="max-w-2xl">
      {/* C8-NEW */}
      <p className="text-eyebrow text-mist-400">Team</p>
      {/* C8-NEW */}
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-mist-100">
        Die Menschen hinter der Maschine
      </h2>
      {/* C8-NEW */}
      <p className="mt-5 text-body-lg">
        Geschäftsführung, Einkauf und Technik entwickeln die Grabenfräse gemeinsam.
      </p>
    </Reveal>

    <Reveal
      as="ul"
      aria-label="Das Team"
      className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8"
    >
      {PEOPLE.map(({ img, name, role }) => (
        <li key={name}>
          <PortraitCard
            src={img}
            alt=""
            name={name}
            role={role}
            className="mx-auto max-w-xs md:max-w-none"
          />
        </li>
      ))}
    </Reveal>
  </Section>
);

export default Team;
