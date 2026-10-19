'use strict';
// Post-build step: GitHub Pages serves a real file per clean path, so copy the built
// landing page document to a directory index per Legal page.
const fs = require('fs');
const path = require('path');

const ROUTES = ['impressum', 'datenschutz'];

function copyRouteDocuments(buildDir) {
  const source = path.join(buildDir, 'index.html');
  if (!fs.existsSync(source)) {
    throw new Error(`Built document not found: ${source}`);
  }
  for (const route of ROUTES) {
    fs.mkdirSync(path.join(buildDir, route), { recursive: true });
    fs.copyFileSync(source, path.join(buildDir, route, 'index.html'));
  }
}

module.exports = { copyRouteDocuments, ROUTES };

if (require.main === module) {
  try {
    copyRouteDocuments(process.argv[2] || path.join(__dirname, '..', 'build'));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
