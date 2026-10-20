import data from "../../data/data.json";

/**
 * The Impressum Legal text. Its wording is verbatim from the fixture `src/__fixtures__/impressum.html`
 * (the original static file has been removed): do not reword, reformat or "fix" it; the mounted-app
 * test in `src/LegalPages.test.jsx` compares it with the fixture.
 *
 * The Company details inside it (name, street, postal code and city, representative, register court
 * and number) are not part of that wording: they come from `data.json` `Company` (ADR 0003), and
 * `src/CompanyDetails.test.jsx` proves a change there reaches this page.
 */
const Impressum = () => {
  const { name, street, postalCode, city, representative, registerCourt, registerNumber } =
    data.Company;
  return (
    <>
      <h2>Impressum</h2>
      <p>Angaben gemäß § 5 DDG</p>
      <p>
        {name}
        <br />
        <br />
        {street}
        <br />
        {postalCode} {city} <br />
      </p>
      <p>
        <strong>Vertreten durch: </strong>
        <br />
        {representative}
        <br />
      </p>
      <p>
        <strong>Registereintrag: </strong>
        <br />
        Eintragung im Handelsregister.
        <br />
        Registergericht: {registerCourt} <br />
        Registernummer: {registerNumber}
        <br />
      </p>
      <p>
        <strong>Verbraucherstreitbeilegung / Universalschlichtungsstelle</strong>
        <br />
        Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil und
        sind dazu auch nicht verpflichtet.
      </p>
      <p>
        Erstellt mit{" "}
        <a href="https://impressum-generator.de" rel="dofollow">
          Impressum-Generator.de
        </a>
        , dem Tool für Impressum und{" "}
        <a href="https://impressum-generator.de/datenschutz-generator" rel="dofollow">
          Datenschutz-Erklärung
        </a>
        . Nach einer Vorlage der{" "}
        <a href="https://www.kanzlei-hasselbach.de/" rel="dofollow">
          Kanzlei Hasselbach
        </a>
        .
      </p>
    </>
  );
};

export default Impressum;
