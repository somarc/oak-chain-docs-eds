#!/usr/bin/env node
// PUT a single HTML file into DA

import fs from 'fs';

const TOKEN = JSON.parse(fs.readFileSync(process.env.HOME + '/.aem/da-token.json', 'utf8')).access_token;
const [, , localPath, daPath] = process.argv;
if (!localPath || !daPath) {
  console.error('Usage: da-put.mjs <local-file> <da-path>');
  process.exit(1);
}

const html = fs.readFileSync(localPath, 'utf8');
const url = `https://admin.da.live/source/somarc/oak-chain-docs-eds/${daPath}`;

const fd = new FormData();
fd.append('data', new Blob([html], { type: 'text/html' }), daPath.split('/').pop());

const r = await fetch(url, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${TOKEN}` },
  body: fd,
});
console.log(`PUT ${daPath} -> ${r.status}`);
if (!r.ok) console.log(await r.text());
