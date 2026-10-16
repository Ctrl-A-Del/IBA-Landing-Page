import { useRef } from "react";
import { Maximize2, X } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import data from "../../data/data.json";

/**
 * Ticket 05 — Verfahren / Die Maschine (DESIGN_PLAN.md §4 row 3, decisions C4, C9, C10, C13, C14).
 *
 * THE RENDER (C9). `fraese.png` is shown at the full container width at every breakpoint, scaled
 * as a whole (`w-full h-auto`): never hidden, cropped or CSS-zoomed. At ~375 px its baked-in
 * annotations shrink to ~4 px, so the meaning is carried by the module list below it (C4).
 *
 * THE MODULES (C4). The four annotation boxes baked into the raster, reproduced verbatim as an
 * ordered list of real text, so screen readers and search engines get them too.
 *
 * THE LIGHTBOX (C10, C13, C14). A native <dialog> opened with `showModal()`. The browser supplies
 * the focus trap, Esc-to-close, inertness of the page behind it and `::backdrop`; nothing here
 * re-implements those. This file adds only what the platform does not:
 *   - a backdrop click closes it. The dialog fills the viewport, so "outside" means outside the
 *     <figure>'s content (render and caption). Press and release must both land outside it, so
 *     dragging from the render or caption onto the backdrop (or back) never closes it;
 *   - focus goes back to whichever element opened it — the labelled button, or the render for a
 *     pointer user — on every exit path. All exits (Esc, close button, backdrop) end in the dialog's
 *     `close` event, so that is the one place focus is restored.
 * No pan/zoom UI: the source is a finite 1342×738 raster. The enlarged image is capped at its
 * natural size (`w-auto h-auto max-w-full max-h-full`), so it fills the viewport on phones and
 * laptops and stops at 1:1 on larger screens instead of showing interpolation.
 *
 * COPY: `data.json` `Verfahren`. The intro stays in the honest register of C2 ("soll", no
 * claims). `modules` are the four annotation boxes baked into `public/img/fraese.png`, reproduced
 * verbatim as text (C4).
 */
const {
  eyebrow: EYEBROW,
  heading: HEADING,
  intro: INTRO,
  renderAlt: RENDER_ALT,
  enlargeLabel: ENLARGE_LABEL,
  closeLabel: CLOSE_LABEL,
  // C14: the only text a screen-reader user gets when the render opens full-screen.
  caption: CAPTION,
  modulesLabel: MODULES_LABEL,
  modules: MODULES,
} = data.Verfahren;

// The one raster, shown inline and enlarged. Natural size, so the browser reserves the box.
// The alt is kept out of the spread object and written on each <img> as `alt={RENDER_ALT}`:
// jsx-a11y/alt-text cannot see an alt inside a spread, and under CI=true (GitHub Actions) CRA fails
// the build on that warning.
const RENDER = { src: "img/fraese.png", width: 1342, height: 738 };

const HEADING_ID = "verfahren-heading";
const CAPTION_ID = "verfahren-lightbox-caption";

// Hairline-ruled, hard-edged secondary button (§4.1). Orange is reserved for primary CTAs (B3).
const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-edge border px-4 py-2 text-body-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const Verfahren = () => {
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const figureRef = useRef(null);
  const pressRef = useRef({ down: null, up: null });

  const open = (event) => {
    openerRef.current = event.currentTarget;
    dialogRef.current.showModal();
  };

  const close = () => dialogRef.current.close();

  // Content = anything inside the <figure> except the figure box itself, whose empty grid area
  // looks like backdrop. `::backdrop` hits are reported with the <dialog> as their target.
  const isContent = (node) => node !== figureRef.current && figureRef.current.contains(node);

  // `click` lands on the common ancestor of press and release, so it cannot tell a drag from the
  // render onto the backdrop from a real backdrop click. The press and release targets can.
  const recordPress = (event) => {
    pressRef.current = { down: event.target, up: null };
  };
  const recordRelease = (event) => {
    pressRef.current.up = event.target;
  };
  const closeOnBackdropClick = () => {
    const { down, up } = pressRef.current;
    pressRef.current = { down: null, up: null };
    // No press recorded = a keyboard-generated click (Enter on "Schließen"), not a backdrop click.
    if (down && up && !isContent(down) && !isContent(up)) close();
  };

  const restoreFocus = () => {
    if (openerRef.current) openerRef.current.focus();
    openerRef.current = null;
  };

  return (
    <Section id="verfahren" tone="light" aria-labelledby={HEADING_ID}>
      <Reveal className="max-w-2xl">
        <p className="text-eyebrow text-ink-500">{EYEBROW}</p>
        <h2 id={HEADING_ID} className="mt-3 text-display-lg text-ink-900">
          {HEADING}
        </h2>
        <p className="mt-5 text-body-lg">{INTRO}</p>
      </Reveal>

      {/* Deliberately outside <Reveal>: the render is never hidden, not even before it scrolls in (C9). */}
      <div className="mt-12 sm:mt-16">
        {/*
          Pointer-only shortcut (C14). `tabIndex={-1}` keeps it out of the tab order — the labelled
          button below is the accessible affordance — but makes it focusable, so focus can return
          here when a pointer user closes the lightbox. No focus outline: Tab never reaches it, so a
          ring would only ever appear as a stray one after the lightbox closes.
        */}
        <img
          {...RENDER}
          alt={RENDER_ALT}
          loading="lazy"
          decoding="async"
          tabIndex={-1}
          onClick={open}
          className="block h-auto w-full cursor-zoom-in outline-none"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={open}
            className={`${BUTTON_BASE} border-brand text-brand hover:bg-brand hover:text-mist-100 focus-visible:outline-brand`}
          >
            <Maximize2 aria-hidden="true" size={16} strokeWidth={2.25} />
            {ENLARGE_LABEL}
          </button>
        </div>
      </div>

      <Reveal
        as="ol"
        aria-label={MODULES_LABEL}
        className="mt-12 grid gap-x-8 gap-y-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
      >
        {MODULES.map(({ numeral, name, line }) => (
          <li key={numeral} className="border-t border-ink-900/15 pt-5">
            <span className="block font-heading text-display-md text-brand">{numeral}</span>
            <h3 className="mt-2 text-body-lg font-bold text-ink-900">{name}</h3>
            <p className="mt-1 text-body">{line}</p>
          </li>
        ))}
      </Reveal>

      {/*
        No `display` utility on the <dialog> itself: that would override the UA `display: none` of a
        closed dialog. Layout lives on the inner wrapper.
      */}
      <dialog
        ref={dialogRef}
        aria-labelledby={CAPTION_ID}
        onClose={restoreFocus}
        onMouseDown={recordPress}
        onMouseUp={recordRelease}
        onClick={closeOnBackdropClick}
        className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-mist-300 backdrop:bg-brand"
      >
        <div className="flex h-full w-full flex-col p-4 sm:p-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              className={`${BUTTON_BASE} border-mist-500 text-mist-100 hover:bg-mist-100 hover:text-brand focus-visible:outline-white`}
            >
              <X aria-hidden="true" size={16} strokeWidth={2.25} />
              {CLOSE_LABEL}
            </button>
          </div>
          {/*
            Grid, not a wrapper <div>: the render and caption are the figure's only descendants, so
            every other point in it is the figure box itself and counts as backdrop. The image row
            takes the leftover height (`minmax(0,1fr)`), and `max-h-full`/`max-w-full` scale the
            render down into it proportionally.
          */}
          <figure
            ref={figureRef}
            className="mt-4 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] place-items-center gap-3"
          >
            <img
              {...RENDER}
              alt={RENDER_ALT}
              decoding="async"
              className="block h-auto max-h-full w-auto max-w-full"
            />
            <figcaption id={CAPTION_ID} className="text-center text-body-sm">
              {CAPTION}
            </figcaption>
          </figure>
        </div>
      </dialog>
    </Section>
  );
};

export default Verfahren;
