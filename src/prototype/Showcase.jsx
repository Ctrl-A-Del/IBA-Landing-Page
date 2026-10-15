import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import CTA from "./ui/CTA";
import PortraitCard from "./ui/PortraitCard";
import Reveal from "./ui/Reveal";
import Section from "./ui/Section";

/**
 * TEMPORARY DEV ARTEFACT — TICKET 02 ONLY. REMOVE BEFORE THE PAGE SHIPS.
 *
 * Renders every design token and every shared primitive so that tickets 03–10 compose from this
 * vocabulary instead of inventing their own colours, type sizes, CTA variants or card variants.
 *
 * It is deliberately wired in as the FIRST child of `src/prototype/Prototype.jsx` (one line, above
 * `<Nav />`) so it renders above the real page and cannot be confused with a real section. It is
 * not part of the page structure fixed by DESIGN_PLAN.md §4 and it must not survive into it —
 * ticket 11 (Integration QA) reconciles the assembled page and is the natural ticket to delete it.
 *
 * Everything below is literal Tailwind classes, never assembled strings, because CRA only compiles
 * classes that appear verbatim in a file matched by the `content` globs.
 */

const SURFACES = [
  {
    name: "brand",
    value: "#0a1f2e",
    swatch: "bg-brand",
    note: "Primary navy surface, kept from the old palette (B1). Dominant background (§4.1).",
  },
  {
    name: "brand-alt",
    value: "#14171a",
    swatch: "bg-brand-alt",
    note: "Footer surface only (C12).",
  },
  {
    name: "surface",
    value: "#f6f6f6",
    swatch: "bg-surface",
    note: "Light muted surface. Available, but §4 uses plain white for the two light sections.",
  },
  {
    name: "link",
    value: "#608dfd",
    swatch: "bg-link",
    note: "Legacy link colour. Not used by v2 sections — use the neutral ramp (`signal` is CTA-only).",
  },
];

const SIGNALS = [
  {
    name: "signal",
    value: "#f08a24",
    swatch: "bg-signal",
    note: "The machine's own orange (B3). Primary CTA fill only. Navy text on it: 6.72:1 (AA).",
  },
  {
    name: "signal-hover",
    value: "#d4730f",
    swatch: "bg-signal-hover",
    note: "Derived shade, same hue: L 54.1% -> 44.5%. Navy on it: 5.01:1, so hover stays AA.",
  },
  {
    name: "signal-active",
    value: "#cd6e0e",
    swatch: "bg-signal-active",
    note: "Derived shade, L 42.9%. Navy on it: 4.67:1. White on ANY of these is 2.5:1 — never.",
  },
];

const INK_RAMP = [
  { name: "ink-900", swatch: "bg-ink-900", note: "Headings on light. 18.0:1 on white." },
  { name: "ink-700", swatch: "bg-ink-700", note: "Strong body on light. 10.5:1." },
  { name: "ink-600", swatch: "bg-ink-600", note: "Default body on light. 7.1:1. This is `body`." },
  { name: "ink-500", swatch: "bg-ink-500", note: "Secondary body on light. 5.2:1, still AA." },
  { name: "ink-400", swatch: "bg-ink-400", note: "Captions only — large text. 3.5:1 fails AA for body." },
];

const MIST_RAMP = [
  { name: "mist-100", swatch: "bg-mist-100", note: "Headings on navy. 15.6:1." },
  { name: "mist-200", swatch: "bg-mist-200", note: "Strong body on navy. 13.0:1." },
  {
    name: "mist-300",
    swatch: "bg-mist-300",
    note: "Default body on navy. 9.7:1 — this replaces `text-white/70`.",
  },
  { name: "mist-400", swatch: "bg-mist-400", note: "Secondary body on navy. 6.5:1, still AA." },
  { name: "mist-500", swatch: "bg-mist-500", note: "Rules / ornaments / large text. 4.1:1." },
];

/**
 * The secondary text on a swatch is a *step of the ramp*, not the token's own colour with an
 * `opacity-*` stacked on top. A showcase whose whole point is "colour comes from tokens, not from
 * ad-hoc opacity" cannot demonstrate that ramp with `text-white/70`-style tricks, so the muted step
 * is passed in from the list below. The list knows which surface it is on; the swatch does not.
 */
const Swatch = ({ swatch, name, value, note, muted = "" }) => (
  <li className="flex items-start gap-3">
    <span
      aria-hidden="true"
      className={`mt-1 h-10 w-10 shrink-0 rounded-edge ring-1 ring-frame ${swatch}`}
    />
    <span className="min-w-0">
      <span className="block font-heading text-body font-bold">{name}</span>
      {value && <span className={`block text-body-sm ${muted}`}>{value}</span>}
      <span className={`mt-0.5 block text-body-sm ${muted}`}>{note}</span>
    </span>
  </li>
);

const TokenList = ({ title, items, className = "", muted = "" }) => (
  <div className={className}>
    <h3 className="font-heading text-display-md font-bold">{title}</h3>
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <Swatch key={item.name} muted={muted} {...item} />
      ))}
    </ul>
  </div>
);

const RevealDemoCard = ({ step, title }) => (
  <Reveal className="rounded-edge border border-mist-500 p-5">
    <span className="font-heading text-display-md font-bold text-mist-100">{step}</span>
    <p className="mt-2 text-body-sm text-mist-300">{title}</p>
  </Reveal>
);

const Showcase = () => {
  const [pressCount, setPressCount] = useState(0);

  return (
    <>
      <Section id="showcase-about" tone="alt">
        <p className="font-heading text-eyebrow text-mist-400">Temporäres Dev-Artefakt · Ticket 02</p>
        <h2 className="mt-3 max-w-3xl font-heading text-display-lg text-mist-100">
          Token- und Primitiv-Showcase — nicht Teil der Seite
        </h2>
        <p className="mt-5 max-w-2xl text-body-lg text-mist-300">
          This page renders every design token and shared primitive from ticket 02 so that tickets
          03–10 compose from the same vocabulary. It is added as a single line at the top of
          <code className="mx-1 text-mist-200">src/prototype/Prototype.jsx</code>
          and must be deleted again (ticket 11 reconciles the assembled page).
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <div
            aria-hidden="true"
            className="flex h-nav w-24 items-center justify-center rounded-edge border border-dashed border-mist-500"
          >
            <span className="font-heading text-eyebrow text-mist-400">h-nav</span>
          </div>
          <p className="max-w-xl text-body-sm text-mist-300">
            5rem — the height ticket 03 must build the sticky nav at. Every{" "}
            <code className="text-mist-200">section[id]</code> derives its anchor scroll-margin from
            the same <code className="text-mist-200">spacing.nav</code> value in{" "}
            <code className="text-mist-200">src/index.css</code> via{" "}
            <code className="text-mist-200">theme()</code>, so there is one number rather than two
            that have to be kept in step. A taller nav means changing{" "}
            <code className="text-mist-200">spacing.nav</code> — which lives in a file ticket 02
            owns, so escalate rather than edit it.
          </p>
        </div>
      </Section>

      <Section id="showcase-colour" tone="navy">
        <h2 className="font-heading text-display-lg text-mist-100">Colour tokens</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-mist-300">
          Body text colour comes from the neutral ramp, never from an ad-hoc opacity like
          <code className="mx-1 text-mist-200">text-white/70</code>. Ratios are computed against the
          surface each token is meant for.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <TokenList title="Surfaces" items={SURFACES} muted="text-mist-400" />
          <TokenList title="Signal (CTA only)" items={SIGNALS} muted="text-mist-400" />
          {/*
            The ink ramp is TEXT FOR LIGHT SURFACES. Rendering its labels in `ink-600` straight onto
            the navy section would put 2.2:1 dark-on-dark copy on screen — the swatches would be
            unreadable and the demo would contradict itself. So this one column carries its own
            white panel: the ramp is shown on the surface it is meant for, and it is the only place
            in the showcase where an `ink-*` class is legible at all.
          */}
          <TokenList
            title="ink — on light"
            items={INK_RAMP}
            className="rounded-edge bg-white p-6 text-ink-600 shadow-frame"
            muted="text-ink-500"
          />
          <TokenList title="mist — on navy" items={MIST_RAMP} className="text-mist-300" muted="text-mist-400" />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-mist-500 pt-8">
          <span aria-hidden="true" className="h-10 w-24 rounded-edge bg-gradient-to-r from-accent-from to-accent-to" />
          <p className="max-w-2xl text-body-sm text-mist-400">
            <strong className="text-mist-200">accent — retired from CTAs (B3).</strong> The blue
            gradient survives for non-CTA decorative use only. It has no consumer in v2 and is kept
            solely so the un-rendered legacy tree in
            <code className="mx-1 text-mist-200">src/components/</code>
            keeps resolving while the one-line revert in <code className="text-mist-200">App.jsx</code>
            (D5) stays possible. Do not use it as a button fill — that is what
            <code className="mx-1 text-mist-200">signal</code> is for.
          </p>
        </div>
      </Section>

      <Section id="showcase-type" tone="light">
        <h2 className="font-heading text-display-lg text-ink-900">Type scale</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-ink-600">
          Raleway 700–900 for display, Open Sans 300–800 for body (B4). Sentence case, never
          uppercase (B8) — the base layer sets <code className="text-ink-900">normal-case</code> on
          every heading. Display steps are fluid: the top step is exactly 5rem from ~1280px and never
          below 2.5rem.
        </p>

        <div className="mt-12 space-y-10">
          <div>
            <p className="font-heading text-eyebrow text-ink-500">display-xl · clamp(2.5rem → 5rem)</p>
            <p className="mt-2 font-heading text-display-xl text-ink-900">
              Wir schaufeln nicht – wir fräsen
            </p>
          </div>
          <div>
            <p className="font-heading text-eyebrow text-ink-500">display-lg · clamp(2rem → 3.5rem)</p>
            <p className="mt-2 font-heading text-display-lg text-ink-900">
              Maschinenbau aus NRW
            </p>
          </div>
          <div>
            <p className="font-heading text-eyebrow text-ink-500">display-md · clamp(1.5rem → 2.25rem)</p>
            <p className="mt-2 font-heading text-display-md text-ink-900">
              Stromtrassen, Wasserstoff und Fernwärme
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-400 pt-8">
          <h3 className="font-heading text-display-md text-ink-900">Body scale — Open Sans</h3>
          <div className="mt-6 space-y-6">
            <p className="text-body-lg text-ink-600">
              body-lg · Open Sans regular, leading 1.65 — for the lead paragraph of a section.
            </p>
            <p className="text-body text-ink-600">
              body · Open Sans regular, leading 1.7 — the default body size and the base
              <code className="mx-1 text-ink-900">body</code> colour (ink-600, 7.1:1 on white).
            </p>
            <p className="text-body-sm text-ink-500">
              body-sm · 0.875rem, leading 1.6, ink-500 at 5.2:1 — captions and metadata.
            </p>
            <p className="font-heading text-eyebrow text-ink-500">
              eyebrow · 0.8125rem, tracking 0.14em, sentence case
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-body text-ink-700">
            <span className="font-light">font-light 300</span>
            <span className="font-normal">font-normal 400</span>
            <span className="font-semibold">font-semibold 600</span>
            <span className="font-bold">font-bold 700</span>
            <span className="font-extrabold">font-extrabold 800</span>
          </div>
        </div>
      </Section>

      <Section id="showcase-cta" tone="navy">
        <h2 className="font-heading text-display-lg text-mist-100">CTA primitive</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-mist-300">
          One fill, one text colour, one radius. There is no colour prop, and the navy text is locked
          with an important class so not even <code className="text-mist-200">className="text-white"</code>
          can override it. Focus the buttons below with Tab: the indicator is a 2px navy ring plus a
          2px white outline, so it stays visible on navy (white band, 16.8:1) and on light surfaces
          (navy band, 18.0:1). A single orange ring would only manage 2.5:1 on white.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <CTA href="tel:+4917661877599">
            <Phone aria-hidden="true" size={18} strokeWidth={2} />
            Anrufen
          </CTA>
          <CTA href="mailto:info@ingenieurbuero-auner.com">
            <Mail aria-hidden="true" size={18} strokeWidth={2} />
            E-Mail schreiben
          </CTA>
          <CTA onClick={() => setPressCount((count) => count + 1)}>
            Als button — {pressCount}&nbsp;gedrückt
          </CTA>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-mist-500 pt-8">
          <p className="max-w-lg text-body-sm text-mist-400">
            Compact size via <code className="text-mist-200">className</code> — layout only. Colour
            cannot be passed in.
          </p>
          <CTA href="#showcase-about" className="text-body-sm">
            Kompakter CTA
          </CTA>
        </div>
      </Section>

      <Section id="showcase-card" tone="navy">
        <h2 className="font-heading text-display-lg text-mist-100">Framed portrait card</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-mist-300">
          The one deliberate exception to the hard-edge rule (B7). Ticket 08 (Team) and ticket 09
          (Kontakt) both use this primitive, so Marcus Auner's portrait is cropped identically in both
          places by construction — the 3:4 ratio and the top-anchored crop live inside the primitive,
          not in the callers.
        </p>

        <div className="mt-10 grid max-w-sm gap-8 sm:grid-cols-2 sm:max-w-2xl">
          <PortraitCard
            src="img/marcus.png"
            alt="Marcus Auner"
            name="Marcus Auner"
            role="Geschäftsführung"
          />
          <PortraitCard src="img/jan.png" alt="Jan Hönninger" name="Jan Hönninger" role="Technischer Leiter" />
        </div>
        <p className="mt-6 max-w-2xl text-body-sm text-mist-400">
          Portrait only, no caption: <code className="text-mist-200">name</code> and
          <code className="mx-1 text-mist-200">role</code> are optional. The paths above match the
          values stored in <code className="text-mist-200">src/data/data.json</code> verbatim, so a
          section ticket can pass <code className="text-mist-200">person.img</code> through unchanged.
        </p>
      </Section>

      <Section id="showcase-tones" tone="light">
        <h2 className="font-heading text-display-lg text-ink-900">Section tones</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-ink-600">
          Three tones, each carrying its own text colour from the neutral ramp, plus the shared
          vertical rhythm (80 / 112 / 144px) and the anchor scroll-margin. The link below jumps to the
          navy tone — with the sticky nav of ticket 03 in place, the heading must land clear of it.
        </p>
        <p className="mt-6">
          <a
            href="#showcase-tone-navy"
            className="font-heading text-body font-semibold text-ink-900 underline decoration-ink-500 decoration-2 underline-offset-4 transition-colors duration-150 hover:text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Sprungmarke zu tone="navy"
          </a>
        </p>

        <div className="mt-12 border-t border-ink-400 pt-8">
          <h3 className="font-heading text-display-md text-ink-900">Structural tokens</h3>
          <ul className="mt-6 space-y-4 text-body text-ink-600">
            <li>
              <code className="text-ink-900">rounded-edge</code> · 3px. The page's only corner
              radius — the CTA and the framed card share it, so nothing can drift to a pill.
            </li>
            <li>
              <code className="text-ink-900">shadow-frame</code> +{" "}
              <code className="text-ink-900">ring-frame</code> · the lift and the hairline on the
              framed light card in the portrait section above. §4.1 keeps shadows to that one
              exception, so nothing else may use them.
            </li>
            <li>
              <code className="text-ink-900">max-w-container</code> · 1170px, the single page
              gutter, applied by <code className="text-ink-900">Section</code>.
            </li>
            <li>
              <code className="text-ink-900">h-nav</code> · 5rem, the height the ticket-03 sticky
              nav must be built to. The anchor scroll-margin is derived from the same{" "}
              <code className="text-ink-900">spacing.nav</code> value in{" "}
              <code className="text-ink-900">src/index.css</code>, so there is one number, not two.
            </li>
          </ul>
        </div>
      </Section>

      <Section id="showcase-tone-navy" tone="navy">
        <p className="font-heading text-eyebrow text-mist-400">tone="navy"</p>
        <h3 className="mt-3 font-heading text-display-md text-mist-100">
          Hero, Einsatzbereiche, Team, Kontakt
        </h3>
        <p className="mt-4 max-w-2xl text-body text-mist-300">
          Default body text on navy is mist-300 (9.7:1). Secondary copy is mist-400 (6.5:1). Never
          reach for white with an opacity suffix.
        </p>
      </Section>

      <Section id="showcase-tone-light" tone="light">
        <p className="font-heading text-eyebrow text-ink-500">tone="light"</p>
        <h3 className="mt-3 font-heading text-display-md text-ink-900">
          Verfahren, Warum wir
        </h3>
        <p className="mt-4 max-w-2xl text-body text-ink-600">
          Default body text on light is ink-600 (7.1:1 on white, 6.5:1 on surface). Secondary copy is
          ink-500 (5.2:1 / 4.8:1), still AA.
        </p>
      </Section>

      <Section id="showcase-tone-alt" tone="alt">
        <p className="font-heading text-eyebrow text-mist-400">tone="alt"</p>
        <h3 className="mt-3 font-heading text-display-md text-mist-100">Footer</h3>
        <p className="mt-4 max-w-2xl text-body text-mist-300">
          brand-alt (#14171a) is the footer surface only (C12).
        </p>
      </Section>

      <Section id="showcase-motion" tone="navy">
        <h2 className="font-heading text-display-lg text-mist-100">Scroll reveal &amp; motion</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-mist-300">
          Every animated thing here is CSS-only (B5). The three blocks below use the shared
          <code className="mx-1 text-mist-200">Reveal</code> wrapper. Scroll them into view to watch
          them arrive; with “reduce motion” switched on in your OS, they are simply already there and
          nothing moves — the hook never starts an observer, and the transition is switched off in
          CSS as well. <code className="text-mist-200">data-revealed</code> on each block shows which
          state it is in.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <RevealDemoCard step="01" title="Reveal starts hidden, then arrives once, and never hides again on scroll-up." />
          <RevealDemoCard step="02" title="Duration, easing and offset come from the wrapper — not from each section." />
          <RevealDemoCard step="03" title="Reduced motion: content visible immediately, no observer, no transition." />
        </div>

        <p className="mt-8 max-w-2xl text-body-sm text-mist-400">
          Nothing else on this page animates. Hover and focus transitions are colour changes only.
        </p>
      </Section>
    </>
  );
};

export default Showcase;
