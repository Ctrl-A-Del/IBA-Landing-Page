import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Verfahren from "./sections/Verfahren";
import Einsatzbereiche from "./sections/Einsatzbereiche";
import WarumWir from "./sections/WarumWir";
import Team from "./sections/Team";
import Kontakt from "./sections/Kontakt";
import Footer from "./sections/Footer";
// TEMPORARY (ticket 02): the token showcase is a dev artefact, not a page section. Delete this
// import and the `<Showcase />` line below before the page ships.
import Showcase from "./Showcase";

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
 * Everything under `./sections/` is a placeholder until its ticket lands, so `npm start` on this
 * commit renders an intentionally empty page: no old component is rendered any more, and no v2
 * section exists yet. Ticket 02's token showcase is the first thing with pixels in it.
 *
 * The previous design is preserved untouched in `src/AppLegacy.jsx` and is re-entered through the
 * single line in `src/App.jsx` (DESIGN_PLAN.md §3, D5).
 */
const Prototype = () => (
  <>
    {/* TEMPORARY — ticket 02's token showcase. Remove with its import above. */}
    <Showcase />
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
