import { useLayoutEffect } from "react";
import { Phone } from "lucide-react";
import CTA from "../ui/CTA";
import Emblem from "../ui/Emblem";
import data from "../../data/data.json";
import { CALL_ARIA_LABEL, CALL_VERB, PHONE_DISPLAY, PHONE_HREF } from "./phone";
import useScrolled from "./useScrolled";
import { FOCUS_ON_DARK } from "./focus";

/**
 * Ticket 03 — Sticky nav + mobile call bar (DESIGN_PLAN.md §4 row 1, decisions B6, B9, C6, C16).
 *
 * Renders two siblings, per the page contract in `src/App.jsx`:
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
 * clear of it. It lives here, beside the bar, so the reservation mounts and unmounts with it.
 *
 * THE EMBLEM is `../ui/Emblem`, shared with the footer (11.1/R6) so the brand mark has one source of truth
 * (the `emblem.png` asset); this file only sizes it.
 */

const { label: NAV_LABEL, homeLabel: HOME_LABEL, links } = data.Nav;
const linksFor = (prefix) =>
  links.map(({ anchor, label }) => ({ href: `${prefix}#${anchor}`, label }));

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

const useReserveCallBarSpace = () => {
  // Layout effect, so the padding is in place before the first paint — the bar is too.
  useLayoutEffect(() => {
    document.body.classList.add(CALL_BAR_RESERVE);
    return () => document.body.classList.remove(CALL_BAR_RESERVE);
  }, []);
};

/**
 * `onLanding` (default) links the sections as same-page `#anchors`. On a Legal page it is `false`:
 * the links then lead to the landing page's sections (`/#anchor`), and the bar is always solid,
 * since there is no hero for it to be transparent over.
 */
const Nav = ({ onLanding = true }) => {
  const scrolled = useScrolled();
  const isScrolled = scrolled || !onLanding;
  const prefix = onLanding ? "" : `${process.env.PUBLIC_URL}/`;
  const LINKS = linksFor(prefix);
  useReserveCallBarSpace();

  return (
    <>
      <nav
        aria-label={NAV_LABEL}
        data-state={isScrolled ? "solid" : "transparent"}
        className={`fixed inset-x-0 top-0 z-40 h-nav border-b transition-colors duration-300 motion-reduce:transition-none ${
          isScrolled ? "border-mist-500/40 bg-brand" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-container items-center gap-2 px-5 sm:gap-6 sm:px-6 lg:px-8">
          <a
            href={`${prefix}#start`}
            aria-label={HOME_LABEL}
            className={`shrink-0 rounded-full ${FOCUS_ON_DARK}`}
          >
            <Emblem className="h-10 w-10 sm:h-12 sm:w-12" />
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
                  className={`block whitespace-nowrap rounded-edge py-2 font-body text-[0.8125rem] font-medium text-mist-200 no-underline transition-colors duration-150 hover:text-white sm:text-body sm:font-semibold ${FOCUS_ON_DARK}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 md:block">
            <CTA href={PHONE_HREF} aria-label={CALL_ARIA_LABEL}>
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
              <span className="lg:hidden">{CALL_VERB}</span>
              <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
            </CTA>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-mist-500/40 bg-brand px-5 md:hidden ${CALL_BAR_HEIGHT}`}
      >
        <CTA href={PHONE_HREF} aria-label={CALL_ARIA_LABEL} className="w-full">
          <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
          <span>{CALL_VERB}</span>
          <span className="font-normal">{PHONE_DISPLAY}</span>
        </CTA>
      </div>
    </>
  );
};

export default Nav;
