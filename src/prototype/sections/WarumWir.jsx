import { FastForward, Recycle, User } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";

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
 * COPY (C8): the eyebrow, intro and three bodies are new prototype copy, flagged `C8-NEW`. The H2 is
 * the old Services heading, hardcoded in the legacy `services.jsx`, kept verbatim.
 */

const HEADING_ID = "warum-heading";

const POINTS = [
  {
    Icon: FastForward,
    name: "Schneller vorankommen",
    // C8-NEW
    text: "Ziel ist ein durchgehender Arbeitsgang, in dem die Maschine den Boden fräst und das Material im selben Zug abfördert.",
  },
  {
    Icon: Recycle,
    name: "Ressourcen effizient nutzen",
    // C8-NEW
    text: "Das Konzept bündelt Fräsen, Aufnehmen und Fördern in einer Maschine. Ziel ist, unnötige Fahr- und Schwenkbewegungen und zusätzliche Maschineneinsätze zu vermeiden.",
  },
  {
    Icon: User,
    name: "Fachkräfte entlasten",
    // C8-NEW
    text: "Die Maschine wird auf Fernsteuerung und ineinandergreifende Arbeitsschritte ausgelegt. Ziel ist, dass Fachkräfte seltener direkt im Gefahrenbereich stehen und dort arbeiten, wo ihr Können gebraucht wird.",
  },
];

const WarumWir = () => (
  <Section id="warum" tone="light" aria-labelledby={HEADING_ID}>
    <Reveal className="max-w-2xl">
      {/* C8-NEW */}
      <p className="text-eyebrow text-ink-500">Warum wir</p>
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-ink-900">
        Neue Netze brauchen leistungsfähigere Bauprozesse.
      </h2>
      {/* C8-NEW */}
      <p className="mt-5 text-body-lg">
        Unsere Maschine ist in Entwicklung. Diese drei Ziele geben ihr die Richtung vor.
      </p>
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
