/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRA 5 detects this file and wires `tailwindcss` into its PostCSS pipeline
  // automatically (react-scripts/config/webpack.config.js: useTailwind).
  //
  // This glob is also why every utility class must appear *literally* in a source file: a class
  // assembled from a string at runtime is never seen by the scanner and never compiled.
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------------------------------
        // Surfaces
        // ---------------------------------------------------------------------------------------
        // Primary dark background used across sections (DESIGN_PLAN.md §3, B1 — kept). The dark
        // sections and the footer all use it (C12, amended in R6). Light sections are plain white.
        //
        // Ticket 12 removed the tokens that only the deleted pre-v2 components used: `brand.alt`
        // (#14171a, the old footer), `surface` (#f6f6f6), `link` (#608dfd) and the `accent`
        // gradient (#6372ff -> #5ca9fb, retired from CTAs by B3). Recover them from git if needed.
        brand: {
          DEFAULT: "#0a1f2e",
        },

        // ---------------------------------------------------------------------------------------
        // Signal colour = the machine's own orange (B3). Primary CTAs only, ALWAYS with navy text.
        // ---------------------------------------------------------------------------------------
        // Contrast of #0a1f2e on each step (WCAG 2.x relative-luminance formula, computed):
        //   signal        #f08a24 -> 6.72:1  (AA normal text, AAA large text)
        //   signal-hover  #d4730f -> 5.01:1  (AA)
        //   signal-active #cd6e0e -> 4.67:1  (AA)
        // The reverse pairing — WHITE on any of these — is ~2.5:1 and FAILS AA. That is why the CTA
        // primitive hard-codes its text colour and exposes no colour prop (§1.9, ticket checklist).
        // hover/active are derived from the base colour by dropping HSL lightness 54% -> 44.5% -> 43%
        // at constant hue/saturation (30deg, 87%); not eyeballed.
        signal: {
          DEFAULT: "#f08a24",
          hover: "#d4730f",
          active: "#cd6e0e",
        },

        // ---------------------------------------------------------------------------------------
        // Neutral ramp — body text comes from these tokens instead of ad-hoc opacity values.
        // This is what makes `text-white/70` unnecessary (§4.1, ticket checklist).
        // ---------------------------------------------------------------------------------------
        // `ink` = text on LIGHT surfaces. Contrast on white / on #f6f6f6:
        //   900 #0f1720 -> 18.0:1 / 16.4:1   headings
        //   700 #33414d -> 10.5:1 /  9.5:1   strong body
        //   600 #4b5a67 ->  7.1:1 /  6.5:1   default body (also the base `body` colour)
        //   500 #5f6e7b ->  5.2:1 /  4.8:1   secondary body, still AA
        //   400 #7d8a95 ->  3.5:1 /  3.2:1   captions only: AA for LARGE text only
        ink: {
          400: "#7d8a95",
          500: "#5f6e7b",
          600: "#4b5a67",
          700: "#33414d",
          900: "#0f1720",
        },
        // `mist` = text and rules on NAVY surfaces. Contrast against #0a1f2e:
        //   100 #f4f7f9 -> 15.6:1   headings
        //   200 #dbe3e9 -> 13.0:1   strong body
        //   300 #b9c6d0 ->  9.7:1   default body on navy (the `text-white/70` replacement)
        //   400 #93a3b0 ->  6.5:1   secondary body on navy, still AA
        //   500 #6f8090 ->  4.1:1   rules / decorative / LARGE text only, FAILS AA for body copy
        mist: {
          100: "#f4f7f9",
          200: "#dbe3e9",
          300: "#b9c6d0",
          400: "#93a3b0",
          500: "#6f8090",
        },
      },

      // Framed light cards sitting over navy (B7) — the one deliberate exception to the hard-edge
      // rule. Wide and low-opacity so the white card separates from #0a1f2e without reading as a
      // soft bubble; the ring is a hairline that keeps the edge crisp on high-DPI screens.
      // Only `shadow-frame` is emitted today because it is the only one a component uses; add a
      // `shadow-frame-lift` sibling here if a section ever needs a lift state for the card.
      boxShadow: {
        frame: "0 20px 44px -20px rgba(2, 10, 18, 0.65)",
      },
      ringColor: {
        frame: "rgba(255, 255, 255, 0.14)",
      },

      // The single corner radius of design v2 (§4.1: hard edges; CTA radius 2–4px, NEVER a pill).
      // The CTA and the framed card both use it, so nothing in the new tree can drift to a pill.
      borderRadius: {
        edge: "3px",
      },

      // ---------------------------------------------------------------------------------------
      // Fluid display scale — Raleway 700–900, sentence case, tight tracking (B8, §4.1).
      // The top step runs ~2.5rem at 375px to exactly 5rem from ~1280px up, via clamp().
      // The tuple carries weight and tracking with the size so a section ticket cannot
      // accidentally re-invent looser tracking at display size.
      // ---------------------------------------------------------------------------------------
      // `eyebrow` is sentence case like everything else (B8) — letter-spaced, never uppercased.
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 1.5rem + 4.5vw, 5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.03em", fontWeight: "800" },
        ],
        "display-lg": [
          "clamp(2rem, 1.25rem + 3.2vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" },
        ],
        "display-md": [
          "clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],

        // -------------------------------------------------------------------------------------
        // Body scale — Open Sans 300–800 (B4). Weight stays with the caller (`font-light`,
        // `font-normal`, `font-semibold`, ...) because body weight carries meaning; only the
        // size and leading are tokenised.
        // -------------------------------------------------------------------------------------
        "body-lg": ["clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        eyebrow: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "600" }],
      },

      // ---------------------------------------------------------------------------------------
      // Sticky-nav height AND the anchor scroll offset are deliberately ONE token.
      // ---------------------------------------------------------------------------------------
      // `h-nav` is the height the sticky nav (ticket 03) must render at; `scroll-mt-nav` is the
      // scroll-margin every section anchor carries so a jump lands with the heading clear of it.
      // Same key, so the two can never drift apart by accident.
      //
      // CONTRACT: if ticket 03 needs a nav other than 5rem tall, this value changes HERE and
      // `--iba-anchor-offset` in `src/index.css` must match. Ticket 02 owns both files, so a
      // wave-3 agent escalates instead of editing them (parallelisation.md §3).
      // `Section.jsx` restates this contract where sections consume it.
      spacing: {
        nav: "5rem",
      },

      fontFamily: {
        heading: ["Raleway", "sans-serif"],
        body: ['"Open Sans"', "sans-serif"],
      },
      maxWidth: {
        container: "1170px",
      },
    },
  },
  plugins: [],
};
