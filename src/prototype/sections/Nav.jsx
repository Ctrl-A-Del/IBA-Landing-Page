import { useLayoutEffect } from "react";
import { Phone } from "lucide-react";
import CTA from "../ui/CTA";
import { CALL_LABEL, PHONE_DISPLAY, PHONE_HREF } from "./phone";
import useScrolled from "./useScrolled";

/**
 * Ticket 03 — Sticky nav + mobile call bar (DESIGN_PLAN.md §4 row 1, decisions B6, B9, C6, C16).
 *
 * Renders two siblings, per the shell contract in `../Prototype.jsx`:
 *   1. the page's <nav> landmark — fixed to the top, exactly `h-nav` tall (the anchor contract in
 *      `src/index.css` derives every section's scroll-margin from the same token), transparent over
 *      the hero and solid navy with a hairline bottom border once scrolled (B9). It never auto-hides.
 *   2. the mobile call bar — fixed to the bottom below `md` only (C6).
 *
 * WHY `fixed` AND NOT `sticky`: "transparent over the hero" means the nav overlays the hero. A
 * sticky element stays in flow and would push the hero down by its own height. The hero is a
 * `Section`, whose `py-20` (5rem) top padding equals `h-nav`, so its content clears the nav.
 *
 * ONE CALL TAB STOP PER WIDTH: below `md` the nav's own CTA is hidden and the call bar is the call
 * affordance; from `md` up the bar is hidden and the nav CTA takes over. Both use `display: none`,
 * so the hidden one is out of the tab order and the accessibility tree — keyboard users never meet
 * two identical "Anrufen" stops, and there is nothing to trap focus.
 *
 * THE BAR NEVER COVERS THE FOOTER: while it is mounted, `<body>` reserves the bar's height as
 * bottom padding below `md` (see `useReserveCallBarSpace`), so the last line of the footer scrolls
 * clear of it. This is done from here rather than in the footer or shell because both are owned by
 * other tickets (parallelisation.md §3).
 */

const LINKS = [
  { href: "#verfahren", label: "Verfahren" },
  { href: "#einsatzbereiche", label: "Einsatzbereiche" },
  { href: "#team", label: "Team" },
  { href: "#kontakt", label: "Kontakt" },
];

// The bar's height and the space `<body>` reserves for it are the same literal, written twice in
// this one file because Tailwind only compiles class names that appear verbatim (DESIGN_PLAN §2.5).
// If one changes, change the other.
//
// iOS safe area: the bar grows by the home-indicator inset and pads its content clear of it, so the
// 4.5rem tap row is never squashed, and `<body>` reserves the same sum. Defensive for now:
// `env(safe-area-inset-bottom)` is 0 unless the viewport meta sets `viewport-fit=cover`
// (public/index.html, owned by ticket 01).
const CALL_BAR_HEIGHT =
  "h-[calc(4.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]";
const CALL_BAR_RESERVE = "max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))]";

// Visible keyboard focus for the text links and the emblem on navy: a white outline (16.8:1
// against #0a1f2e). Outline, not ring, so it survives forced-colours mode — same choice as the CTA.
const FOCUS_ON_NAVY =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Emblem disc, cropped with CSS from the framed plate `logo.jpg` (B6). The source is an opaque
 * 540x935 JPEG, so the full plate cannot sit on the nav; only the disc is shown.
 *
 * Crop maths (measured on the source): the gear ring sits in the 340x340 px square whose top-left
 * corner is at (135, 222). Scaling the image so 340 px fill the circle gives
 *   width = 540 / 340 = 158.8 %, left = -135 / 340 = -39.7 %, top = -222 / 340 = -65.3 %
 * of the (square) circle. `rounded-full` + `overflow-hidden` then clip the plate's wall away.
 */
const Emblem = () => (
  <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/10 sm:h-12 sm:w-12">
    <img
      src={`${process.env.PUBLIC_URL}/img/logo.jpg`}
      alt=""
      width="540"
      height="935"
      decoding="async"
      className="absolute left-[-39.7%] top-[-65.3%] h-auto w-[158.8%] max-w-none"
    />
  </span>
);

const useReserveCallBarSpace = () => {
  // Layout effect, so the padding is in place before the first paint — the bar is too.
  useLayoutEffect(() => {
    document.body.classList.add(CALL_BAR_RESERVE);
    return () => document.body.classList.remove(CALL_BAR_RESERVE);
  }, []);
};

const Nav = () => {
  const isScrolled = useScrolled();
  useReserveCallBarSpace();

  return (
    <>
      <nav
        aria-label="Hauptnavigation"
        data-state={isScrolled ? "solid" : "transparent"}
        className={`fixed inset-x-0 top-0 z-40 h-nav border-b transition-colors duration-300 motion-reduce:transition-none ${
          isScrolled ? "border-mist-500/40 bg-brand" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-container items-center gap-2 px-5 sm:gap-6 sm:px-6 lg:px-8">
          <a
            href="#start"
            aria-label="Ingenieurbüro Auner – zum Seitenanfang"
            className={`shrink-0 rounded-full ${FOCUS_ON_NAVY}`}
          >
            <Emblem />
          </a>

          {/*
            Phones: the four links sit in one row at a compact 13px/medium so they fit beside the
            emblem at 375 px. 13px is an arbitrary value because no type token fits: `body-sm`
            (14px) overflows the row at 375 and 360 px, and `eyebrow` (13px) carries letter-spacing.
            `overflow-x-auto` is the safety net for narrower screens, and it is
            why the row is `justify-start` below `sm`: with `justify-end`, overflowing content spills
            off the LEFT edge, where a scroll box cannot reach it. The `p-1` keeps the focus outline
            inside the scroll box, which would otherwise clip it.
          */}
          <ul className="flex min-w-0 flex-1 items-center justify-start gap-x-2 overflow-x-auto p-1 sm:justify-end sm:gap-x-6 lg:gap-x-8">
            {LINKS.map(({ href, label }) => (
              <li key={href} className="shrink-0">
                <a
                  href={href}
                  className={`block whitespace-nowrap rounded-edge py-2 font-body text-[0.8125rem] font-medium text-mist-200 no-underline transition-colors duration-150 hover:text-white sm:text-body sm:font-semibold ${FOCUS_ON_NAVY}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 md:block">
            <CTA href={PHONE_HREF} aria-label={CALL_LABEL}>
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
              <span className="lg:hidden">Anrufen</span>
              <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
            </CTA>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-mist-500/40 bg-brand px-5 md:hidden ${CALL_BAR_HEIGHT}`}
      >
        <CTA href={PHONE_HREF} aria-label={CALL_LABEL} className="w-full">
          <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
          <span>Anrufen</span>
          <span className="font-normal">{PHONE_DISPLAY}</span>
        </CTA>
      </div>
    </>
  );
};

export default Nav;
