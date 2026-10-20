/** @vitest-environment node */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { copyRouteDocuments } = require('../scripts/copy-route-documents');
const data = require('./data/data.json');

const STAND_IN =
  '<!doctype html><title>stand-in</title>' +
  '<link rel="stylesheet" crossorigin href="/assets/index-AbC123.css"><div id="root"></div>';

let dir;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'build-'));
});
afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

test('leaves a directory index per listed Legal page identical to the built document', () => {
  fs.writeFileSync(path.join(dir, 'index.html'), STAND_IN);

  copyRouteDocuments(dir);

  for (const { slug } of data.LegalPages) {
    expect(fs.readFileSync(path.join(dir, slug, 'index.html'), 'utf8')).toBe(STAND_IN);
  }
});

test('fails when the built document is missing', () => {
  expect(() => copyRouteDocuments(dir)).toThrow();
});

test('fails when the built document does not reference the stylesheet bundle', () => {
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    '<!doctype html><title>stand-in</title><link rel="icon" href="/favicon.ico"><div id="root"></div>'
  );

  expect(() => copyRouteDocuments(dir)).toThrow(/stylesheet/);
});
