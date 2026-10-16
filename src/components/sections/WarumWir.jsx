import { FastForward, Recycle, User } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import data from "../../data/data.json";

/**
 * Ticket 07 — Warum wir (DESIGN_PLAN.md §4 row 5, decisions C2, C8, C12).
 *
 * The three Services points from `data.json`, on the light background (C12). The names are kept
 * verbatim; the bodies are rewritten out of the hedged "sollen" register.
 *
 * HOW THE HEDGE IS RESOLVED (C2). Each old sentence used "soll(en)" because it states something the
 * machine is being built to do, not something it has done. Deleting "sollen" would make that a
 * promise. Instead every body labels its aim openly as a goal ("Ziel ist …"), and any sentence about
 * the design says it is a design ("Das Konzept bündelt", "wird … ausgelegt"). No clause describes the
 * machine working in plain present tense. The intro says the machine is in development, so the three
 * points read as goals, not results. Deliberately dropped from the old copy: "höhere
 * Tagesleistungen … als klassische Einzelzyklen", and any "statt …" comparison with other ways of
 * working: both are performance claims nothing on this page can back up. No numerals, no counts,
 * no references.
 *
 * ICONS (§4.1). The same three lucide glyphs the old Services section mapped (`fast-forward`,
 * `recycle`, `user`), in navy, with no gradient circle behind them. They render at 28 px and lucide
 * scales the stroke with the size, so `strokeWidth={1.75}` renders ~2 px, matching the visual
 * weight of the 20 px / 2.25 phone icons in the hero and nav.
 *
 * LAYOUT. One column, then three across from `lg` (1024 px). Each point is topped by a 1 px rule,
 * the same treatment as the Verfahren module list (§4.1 "hard edges").
 *
 * COPY: `data.json` `WarumWir`. The H2 is the old Services heading, kept verbatim.
 *
 * ICONS are decorative, not content, so they live here, matched to `points` by position.
 */

const HEADING_ID = "warum-heading";

const ICONS = [FastForward, Recycle, User];

const { eyebrow: EYEBROW, heading: HEADING, intro: INTRO } = data.WarumWir;
const POINTS = data.WarumWir.points.map((point, i) => ({ ...point, Icon: ICONS[i] }));

const WarumWir = () => (
  <Section id="warum" tone="light" aria-labelledby={HEADING_ID}>
    <Reveal className="max-w-2xl">
      <p className="text-eyebrow text-ink-500">{EYEBROW}</p>
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-ink-900">
        {HEADING}
      </h2>
      <p className="mt-5 text-body-lg">{INTRO}</p>
    </Reveal>

    <Reveal as="ul" className="mt-12 grid gap-x-10 gap-y-10 sm:mt-16 lg:grid-cols-3">
      {POINTS.map(({ Icon, name, text }) => (
        <li key={name} className="border-t border-ink-900/15 pt-6">
          <Icon aria-hidden="true" size={28} strokeWidth={1.75} className="text-brand" />
          <h3 className="mt-5 text-body-lg font-bold text-ink-900">{name}</h3>
          <p className="mt-2 text-body">{text}</p>
        </li>
      ))}
    </Reveal>
  </Section>
);

export default WarumWir;
