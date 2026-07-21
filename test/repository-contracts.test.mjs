import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(?:js|mjs)$/.test(entry.name) ? [target] : [];
  });
}

test('repository code has no direct DA or AEM admin API client', () => {
  const files = [
    ...sourceFiles(path.join(root, 'blocks')),
    ...sourceFiles(path.join(root, 'scripts')),
  ];
  const forbidden = /admin\.da\.live|admin\.hlx\.page|api\.aem\.live/;
  const violations = files.filter((file) => forbidden.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(violations, []);
});

test('interactive flow diagrams do not reintroduce retired settlement language', () => {
  const flow = read('blocks/flow-graph/flow-graph.js');
  const forbidden = /\b(?:priority|express|payment tier|epoch buckets|epoch finalizer|payment verification|payment proof|beacon chain)\b/i;
  assert.equal(forbidden.test(flow), false);
});

test('shared navigation is the authored source for the docs rail', () => {
  const sidebar = read('blocks/docs-sidebar/docs-sidebar.js');
  assert.match(sidebar, /loadFragment\(navPath\)/);
  assert.doesNotMatch(sidebar, /const\s+SECTIONS\s*=/);
});

test('social metadata has one generated image source and a valid default asset', () => {
  const head = read('head.html');
  assert.doesNotMatch(head, /(?:og:image|twitter:image|twitter:card)/);
  const png = fs.readFileSync(path.join(root, 'default-meta-image.png'));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('retired routes cannot re-enter the search index configuration', () => {
  const query = read('helix-query.yaml');
  ['/changelog', '/contributing', '/architecture-system-map', '/write-flow-and-content-fabric']
    .forEach((route) => assert.match(query, new RegExp(`- ${route.replace('/', '\\/')}`)));
});

test('repository declares DA as authored content authority', () => {
  assert.match(read('README.md'), /DA is the single source of truth/i);
});

test('live publication remains x402-gated', () => {
  const gate = read('RELEASE-GATE.md');
  assert.match(gate, /Status:\*\* CLOSED/);
  assert.match(gate, /PAYMENT-REQUIRED/);
  assert.match(gate, /Existing live site must remain unchanged/i);
});
