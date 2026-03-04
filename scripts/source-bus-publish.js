#!/usr/bin/env node

/*
 * Upload blockified HTML to Source Bus and trigger Preview/Publish via Admin API.
 *
 * Usage:
 *   node scripts/source-bus-publish.js \
 *     --org somarc --site oak-chain-docs-eds \
 *     --html migrations/index.html \
 *     --path /index.html \
 *     --page-path /index \
 *     --assets-root ../oak-chain-docs/public \
 *     --preview --publish
 *
 * Env vars:
 *   AEM_ADMIN_ORIGIN   (default: https://admin.hlx.page)
 *   AEM_SOURCE_ORIGIN  (default: https://api.aem.live)
 *   AEM_SOURCE_MODE    (default: api-aem-live) values: api-aem-live | admin-da-live
 *   AEM_ADMIN_TOKEN    (required) Bearer token
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_ADMIN_ORIGIN = 'https://admin.hlx.page';
const DEFAULT_SOURCE_ORIGIN = 'https://api.aem.live';
const DEFAULT_SOURCE_MODE = 'api-aem-live';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
    args[key.replace(/^--/, '')] = value;
    if (value !== true) i += 1;
  }
  return args;
}

function required(value, name) {
  if (!value) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
}

function normalizePath(p) {
  if (!p.startsWith('/')) return `/${p}`;
  return p;
}

function readFileBuffer(filePath) {
  return fs.readFileSync(filePath);
}

function readFileText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractLocalAssetPaths(html) {
  const assetPaths = new Set();
  const srcMatches = html.matchAll(/src\s*=\s*"([^"]+)"/gi);
  for (const match of srcMatches) {
    const src = match[1].trim();
    if (src.startsWith('/')) {
      assetPaths.add(src);
    }
  }
  return [...assetPaths];
}

function contentTypeFromExt(ext) {
  switch (ext.toLowerCase()) {
    case '.html':
      return 'text/html';
    case '.json':
      return 'application/json';
    case '.svg':
      return 'image/svg+xml';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

async function request(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${url}\n${text}`);
  }
  return res;
}

async function uploadSourceFile({ sourceOrigin, sourceMode, org, site, resourcePath, body, contentType, token, method }) {
  if (sourceMode === 'admin-da-live') {
    const url = `${sourceOrigin}/source/${org}/${site}/main${resourcePath}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const form = new FormData();
    const blob = new Blob([body], { type: contentType });
    form.append('data', blob);
    await request(url, { method: 'POST', headers, body: form });
    return url;
  }

  const url = `${sourceOrigin}/${org}/sites/${site}/source${resourcePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': contentType,
  };
  await request(url, { method, headers, body });
  return url;
}

async function previewPage({ adminOrigin, org, site, pagePath, token }) {
  const url = `${adminOrigin}/preview/${org}/${site}/main${pagePath}`;
  const headers = { Authorization: `Bearer ${token}` };
  const res = await request(url, { method: 'POST', headers });
  return res.json();
}

async function publishPage({ adminOrigin, org, site, pagePath, token }) {
  const url = `${adminOrigin}/live/${org}/${site}/main${pagePath}`;
  const headers = { Authorization: `Bearer ${token}` };
  const res = await request(url, { method: 'POST', headers });
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv);
  const org = required(args.org, '--org');
  const site = required(args.site, '--site');
  const htmlPath = required(args.html, '--html');
  const resourcePath = normalizePath(required(args.path, '--path'));
  const pagePath = normalizePath(args['page-path'] || '/index');
  const assetsRoot = args['assets-root'] ? path.resolve(args['assets-root']) : null;
  const doPreview = Boolean(args.preview);
  const doPublish = Boolean(args.publish);

  const adminOrigin = process.env.AEM_ADMIN_ORIGIN || DEFAULT_ADMIN_ORIGIN;
  const sourceOrigin = process.env.AEM_SOURCE_ORIGIN || DEFAULT_SOURCE_ORIGIN;
  const sourceMode = process.env.AEM_SOURCE_MODE || DEFAULT_SOURCE_MODE;
  const token = process.env.AEM_ADMIN_TOKEN;

  if (!token) {
    throw new Error('Missing AEM_ADMIN_TOKEN environment variable.');
  }

  const html = readFileText(htmlPath);
  const htmlBuffer = Buffer.from(html, 'utf8');

  const htmlUrl = await uploadSourceFile({
    sourceOrigin,
    sourceMode,
    org,
    site,
    resourcePath,
    body: htmlBuffer,
    contentType: 'text/html',
    token,
    method: 'POST',
  });

  console.log(`Uploaded HTML: ${htmlUrl}`);

  const assets = extractLocalAssetPaths(html);
  if (assets.length && !assetsRoot) {
    console.warn('Assets found in HTML but --assets-root not provided. Skipping asset upload.');
  }

  if (assets.length && assetsRoot) {
    for (const assetPath of assets) {
      const localPath = path.join(assetsRoot, assetPath.replace(/^\//, ''));
      if (!fs.existsSync(localPath)) {
        console.warn(`Missing asset on disk: ${localPath}`);
        continue;
      }
      const ext = path.extname(localPath);
      const body = readFileBuffer(localPath);
      const contentType = contentTypeFromExt(ext);
      const assetUrl = await uploadSourceFile({
        sourceOrigin,
        sourceMode,
        org,
        site,
        resourcePath: assetPath,
        body,
        contentType,
        token,
        method: 'PUT',
      });
      console.log(`Uploaded asset: ${assetUrl}`);
    }
  }

  if (doPreview) {
    const result = await previewPage({ adminOrigin, org, site, pagePath, token });
    console.log(`Preview result: ${JSON.stringify(result, null, 2)}`);
  }

  if (doPublish) {
    const result = await publishPage({ adminOrigin, org, site, pagePath, token });
    console.log(`Publish result: ${JSON.stringify(result, null, 2)}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
