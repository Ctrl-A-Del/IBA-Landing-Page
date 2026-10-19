/** @jest-environment node */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { copyRouteDocuments } = require('../scripts/copy-route-documents');

let dir;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-'));
});
afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

test('leaves a directory index per Legal page identical to the built document', () => {
  const html = '<!doctype html><title>stand-in</title><div id="root"></div>';
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  copyRouteDocuments(dir);

  for (const route of ['impressum', 'datenschutz']) {
    expect(fs.readFileSync(path.join(dir, route, 'index.html'), 'utf8')).toBe(html);
  }
});

test('fails when the built document is missing', () => {
  expect(() => copyRouteDocuments(dir)).toThrow();
});
