import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Verfahren from "./sections/Verfahren";
import Einsatzbereiche from "./sections/Einsatzbereiche";
import WarumWir from "./sections/WarumWir";
import Team from "./sections/Team";
import Kontakt from "./sections/Kontakt";
import Footer from "./sections/Footer";

/**
 * Design v2 prototype shell — the composition and order fixed by DESIGN_PLAN.md §4.
 *
 * This file is FROZEN. See `.scratch/design-v2/parallelisation.md` §3: while tickets 03–10 are
 * worked in parallel this is the single shared collision point, so each section ticket replaces
 * its own file under `./sections/` and never edits this one. Adding a section, reordering the
 * slots, or moving one in or out of `<main>` is a coordinator decision, not a section ticket's.
 *
 * The shell contract every section ticket must keep:
 *
 *   slot  section           must render                              ticket
 *   ----  ----------------  ---------------------------------------  ------
 *   1     Sticky nav        a <nav> landmark (plus the mobile        03
 *                           call bar, which is fixed overlay)
 *   2     Hero              <section id="start">                    04
 *   3     Verfahren         <section id="verfahren">                05
 *   4     Einsatzbereiche   <section id="einsatzbereiche">          06
 *   5     Warum wir         <section id="warum">                    07
 *   6     Team              <section id="team">                     08
 *   7     Kontakt           <section id="kontakt">                  09
 *   8     Footer            a <footer> landmark, outside <main>    10
 *
 * The `id`s above are the anchors listed in DESIGN_PLAN.md §4.1; the nav links to them.
 *
 * All eight slots are filled (tickets 03–10), and `<Footer />` is the last thing on the page:
 * nothing renders after it. Ticket 02's dev-only token showcase was removed from this shell in
 * ticket 11's review follow-up; `Showcase.jsx` itself stays until ticket 12's migration deletes it.
 *
 * The previous design is preserved untouched in `src/AppLegacy.jsx` and is re-entered through the
 * single line in `src/App.jsx` (DESIGN_PLAN.md §3, D5).
 */
const Prototype = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <Verfahren />
      <Einsatzbereiche />
      <WarumWir />
      <Team />
      <Kontakt />
    </main>
    <Footer />
  </>
);

export default Prototype;
