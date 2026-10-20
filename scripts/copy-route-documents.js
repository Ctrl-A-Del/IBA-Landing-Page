'use strict';
// Post-build step: GitHub Pages serves a real file per clean path, so copy the built
// landing page document to a directory index per Legal page. The Legal pages are `LegalPages` in
// the content file (ADR 0002). Afterwards each copy is checked for the Vite stylesheet bundle, so a
// Legal page that would render unstyled fails the build.
const fs = require('fs');
const path = require('path');
const { LegalPages } = require('../src/data/data.json');

const STYLESHEET = /href="\/assets\/[^"]+\.css"/;

function copyRouteDocuments(buildDir) {
  const source = path.join(buildDir, 'index.html');
  if (!fs.existsSync(source)) {
    throw new Error(`Built document not found: ${source}`);
  }
  for (const { slug } of LegalPages) {
    const target = path.join(buildDir, slug, 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    if (!fs.existsSync(target)) {
      throw new Error(`Legal page document not found: ${target}`);
    }
    if (!STYLESHEET.test(fs.readFileSync(target, 'utf8'))) {
      throw new Error(`${target} does not reference the stylesheet bundle (/assets/*.css)`);
    }
  }
}

module.exports = { copyRouteDocuments };

if (require.main === module) {
  try {
    copyRouteDocuments(process.argv[2] || path.join(__dirname, '..', 'dist'));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
