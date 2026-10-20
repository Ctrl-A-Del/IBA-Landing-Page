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
import Datenschutz from "./components/legal/Datenschutz";
import data from "./data/data.json";
import { slugOfPath } from "./legalPageAddress.mjs";

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
 * Legal pages, picked from the path (no router library) by matching it against the slugs in
 * `data.json` `LegalPages` (ADR 0002, 0003). The trailing slash is optional (the slash convention
 * lives in `./legalPageAddress.mjs`); any other path renders the landing page. Links between pages
 * are plain anchors (full page loads).
 *
 * The list gives each page's tab title and optional hidden heading; only the slug-to-component
 * mapping lives here, since components cannot live in JSON. A listed slug without a component here
 * renders the landing page, which the per-slug tests in `src/LegalPages.test.jsx` catch.
 */
const LEGAL_TEXTS = {
  impressum: Impressum,
  datenschutz: Datenschutz,
};

const legalPageFor = (pathname) => {
  const slug = slugOfPath(pathname);
  const page = data.LegalPages.find((p) => p.slug === slug);
  const Text = page && LEGAL_TEXTS[page.slug];
  return Text ? { ...page, Text } : null;
};

const App = () => {
  const legal = legalPageFor(window.location.pathname);
  return (
    <>
      <Nav onLanding={!legal} />
      {legal ? (
        <LegalPage title={legal.title} heading={legal.heading}>
          <legal.Text />
        </LegalPage>
      ) : (
        <LandingMain />
      )}
      <Footer />
    </>
  );
};

export default App;
