import { Droplets, Flame, Waypoints, Zap } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";

/**
 * Ticket 06 — Einsatzbereiche (DESIGN_PLAN.md §4 row 4, §4.1, decisions B2, B5, C12).
 *
 * The four application areas from `data.json` `About`, on the navy surface. They stop being white
 * rounded tiles with soft shadows and become hard-edged rectangles drawn with a 1 px rule (§4.1:
 * "rectangles and 1 px rules rather than rounded cards and soft shadows").
 *
 * LAYOUT. 1 / 2 / 4 columns (base / `sm` / `lg`), the same breakpoints as the Verfahren module list,
 * so four items never leave an orphan in the last row (4 = 4×1 = 2×2 = 1×4).
 *
 * CONTRAST on #0a1f2e (values from the ramp in `tailwind.config.js`): headings `mist-100` 15.6:1,
 * descriptions `mist-300` 9.7:1 (the Section's navy default), eyebrow `mist-400` 6.5:1. The rule is
 * `mist-500` (4.1:1), which is above the 3:1 non-text minimum; it carries no text. Orange stays
 * reserved for primary CTAs (B3), so the icons are `mist-200`.
 *
 * MOTION (B5). Header and list each sit in the shared `Reveal`, which is inert under
 * `prefers-reduced-motion: reduce` — the content is simply there.
 *
 * COPY. The H2 and the four headings/descriptions are verbatim from `data.json` `About`. The eyebrow
 * and the list's accessible name are new prototype copy, flagged `C8-NEW`. The icons are decorative.
 */

// data.json `About` — verbatim.
const AREAS = [
  { icon: Zap, title: "Stromtrassen", text: "Erdkabel und Energieübertragung" },
  { icon: Flame, title: "Wasserstoff & Fernwärme", text: "Neue Leitungsnetze der Energiewende" },
  { icon: Droplets, title: "Wasser & Abwasser", text: "Großformatige Versorgungsgräben" },
  {
    icon: Waypoints,
    title: "Weitere Infrastruktur",
    text: "Gas-, Drainage- und industrielle Leitungstrassen",
  },
];

const HEADING_ID = "einsatzbereiche-heading";

const Einsatzbereiche = () => (
  <Section id="einsatzbereiche" tone="navy" aria-labelledby={HEADING_ID}>
    <Reveal className="max-w-3xl">
      {/* C8-NEW */}
      <p className="text-eyebrow text-mist-400">Einsatzbereiche</p>
      {/*
        Soft hyphen (U+00AD) in "Versorgungs·netzausbau": at ~375 px the 21-letter compound is wider
        than the column at display size, and the base `break-words` would split it as "…ausb / au".
        The soft hyphen is invisible unless the line breaks there, and then it renders a real hyphen.
      */}
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-mist-100">
        Entwickelt für den Energie- und Versorgungs{"\u00AD"}netzausbau
      </h2>
    </Reveal>

    <Reveal
      as="ul"
      // C8-NEW
      aria-label="Die vier Einsatzbereiche"
      className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
    >
      {AREAS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex flex-col border border-mist-500 p-6 sm:p-7">
          <Icon aria-hidden="true" size={28} strokeWidth={1.75} className="text-mist-200" />
          <h3 className="mt-8 text-body-lg font-bold text-mist-100 sm:mt-10">{title}</h3>
          <p className="mt-2 text-body">{text}</p>
        </li>
      ))}
    </Reveal>
  </Section>
);

export default Einsatzbereiche;
