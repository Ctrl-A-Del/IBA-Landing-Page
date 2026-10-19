import Nav from "./components/sections/Nav";
import Hero from "./components/sections/Hero";
import Verfahren from "./components/sections/Verfahren";
import Einsatzbereiche from "./components/sections/Einsatzbereiche";
import WarumWir from "./components/sections/WarumWir";
import Team from "./components/sections/Team";
import Kontakt from "./components/sections/Kontakt";
import Footer from "./components/sections/Footer";
import LegalPage from "./components/legal/LegalPage";
import Impressum from "./components/legal/Impressum";

/**
 * The page — composition and order fixed by DESIGN_PLAN.md §4 (design v2, approved and migrated
 * in ticket 12, decision D6).
 *
 *   slot  section           renders
 *   ----  ----------------  -----------------------------------------------------------
 *   1     Sticky nav        a <nav> landmark, plus the mobile call bar (fixed overlay)
 *   2     Hero              <section id="start">
 *   3     Verfahren         <section id="verfahren">
 *   4     Einsatzbereiche   <section id="einsatzbereiche">
 *   5     Warum wir         <section id="warum">
 *   6     Team              <section id="team">
 *   7     Kontakt           <section id="kontakt">
 *   8     Footer            a <footer> landmark, outside <main>, last on the page
 *
 * The `id`s are the anchors listed in DESIGN_PLAN.md §4.1; the nav links to them. All copy comes
 * from `src/data/data.json`.
 */
const LandingMain = () => (
  <main>
    <Hero />
    <Verfahren />
    <Einsatzbereiche />
    <WarumWir />
    <Team />
    <Kontakt />
  </main>
);

/**
 * Legal pages, picked from the path (no router library). The trailing slash is optional; any other
 * path renders the landing page. Links between pages are plain anchors (full page loads).
 */
const LEGAL_PAGES = {
  "/impressum": () => (
    <LegalPage title="Impressum – Ingenieurbüro Auner">
      <Impressum />
    </LegalPage>
  ),
};

const legalPageFor = (pathname) => LEGAL_PAGES[pathname.replace(/\/+$/, "")];

const App = () => {
  const Legal = legalPageFor(window.location.pathname);
  return (
    <>
      <Nav onLanding={!Legal} />
      {Legal ? <Legal /> : <LandingMain />}
      <Footer />
    </>
  );
};

export default App;
