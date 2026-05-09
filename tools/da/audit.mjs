#!/usr/bin/env node
// Corpus-wide audit. Fetches every page from DA and applies the site-wide
// editorial + factual rules accumulated during the V5 cleanup pass.
//
// Run: `node tools/da/audit.mjs`
//
// Exit code: 0 if no errors, 1 if any rule classified `error` triggers.
// `warn` and `info` findings print but do not fail the run.
//
// Adding a rule: append to RULES below. Each rule encodes one editorial
// or factual invariant. Test patterns against false positives before
// promoting a rule to `error` severity.

import fs from 'node:fs';

const TOKEN = JSON.parse(fs.readFileSync(`${process.env.HOME}/.aem/da-token.json`)).access_token;
const ORG = 'somarc';
const REPO = 'oak-chain-docs-eds';

const PAGES = [
  '/index', '/thesis', '/faq', '/architecture', '/how-it-works', '/bull-case',
  '/segment-gc', '/project-composition',
  '/guide/index', '/guide/quickstart', '/guide/economics', '/guide/testnet',
  '/guide/smart-contract', '/guide/auth', '/guide/binaries', '/guide/proposal-flow',
  '/guide/streaming', '/guide/api', '/guide/consensus', '/guide/content-consumption',
  '/guide/aem-integration', '/guide/paths', '/guide/primary-signals',
  '/guide/surface-catalog',
  '/operators/index',
  '/operators/validator-load-test-2026-02-04',
  '/operators/validator-load-test-2026-02-07-overnight-finalization-gap',
];

const RULES = [
  {
    id: 'v3-residue',
    severity: 'error',
    label: 'V3 settlement residue',
    note: 'V5 retired the tier model. Use ValidatorPaymentV5 / settleWrite / settleDelete / ProposalSettledV5.',
    test: (html) => {
      const hits = [];
      const patterns = [
        /\bPRIORITY\b/g,
        /\bEXPRESS\b/g,
        /payForProposal/g,
        /paymentTier/g,
        /ValidatorPaymentV3/g,
        /\bProposalPaid\b/g,
        /\bpayment class(es)?\b/gi,
        /\bpayment tier(s)?\b/gi,
        /0x7fcEc350268F5482D04eb4B229A0679374906732/g,
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) hits.push(`${p.source}: ${m.length}`);
      }
      return hits;
    },
  },
  {
    id: 'em-dash',
    severity: 'warn',
    label: 'Em dash in copy',
    note: 'Replace with period, comma, or colon. Data-table "—" cell placeholders and Rick Rubin attribution are allowed.',
    test: (html) => {
      const lines = html.split('\n');
      const findings = [];
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (!line.includes('—')) continue;
        // Allow: data-table cells (the placeholder pattern <div>—</div>)
        if (line.match(/<div>—<\/div>/) && line.match(/data-table/)) continue;
        // Allow: Rick Rubin attribution
        if (line.match(/Rick Rubin/i)) continue;
        const count = (line.match(/—/g) || []).length;
        // Subtract data-table placeholders even on lines that have other dashes
        const placeholders = (line.match(/<div>—<\/div>/g) || []).length;
        const real = count - placeholders;
        if (real > 0) findings.push(`L${i + 1}: ${real} dash(es)`);
      }
      return findings;
    },
  },
  {
    id: 'emoji',
    severity: 'error',
    label: 'Emoji in content',
    note: 'No emojis in copy or diagrams. Replace with text labels.',
    test: (html) => {
      const patterns = [
        /⚠️/g, /✅/g, /❌/g, /🚀/g, /💡/g, /⭐/g, /👉/g, /📌/g, /📍/g,
        /✏️/g, /👁️/g, /🔥/g, /🎯/g, /✨/g, /🤖/g, /🔒/g, /🔑/g,
      ];
      const hits = [];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) hits.push(`${p.source}: ${m.length}`);
      }
      return hits;
    },
  },
  {
    id: 'retired-page-link',
    severity: 'warn',
    label: 'Reference to retired DA page',
    note: 'These DA pages were retired (architecture-system-map, changelog, contributing, write-flow-and-content-fabric). Links to /diagrams/oak-chain-write-flow-and-content-fabric.html are OK — that is a static asset.',
    test: (html) => {
      const findings = [];
      // Match href="/foo" or href='/foo' but NOT href="/diagrams/foo"
      const retired = ['architecture-system-map', 'changelog', 'contributing'];
      for (const p of retired) {
        // catch href="/p" but not /diagrams/* references
        const re = new RegExp(`href=["']/${p}["']`, 'g');
        const m = html.match(re);
        if (m) findings.push(`/${p}: ${m.length} link(s)`);
      }
      // write-flow-and-content-fabric: only flag if not under /diagrams/
      const wfHits = html.match(/href=["']\/write-flow-and-content-fabric["']/g);
      if (wfHits) findings.push(`/write-flow-and-content-fabric: ${wfHits.length} link(s) (use /diagrams/oak-chain-write-flow-and-content-fabric.html)`);
      return findings;
    },
  },
  {
    id: 'quickstart-routing',
    severity: 'error',
    label: 'Quick Start label routed to /guide/ instead of /guide/quickstart',
    note: '/guide/ is now the map; the tutorial lives at /guide/quickstart.',
    test: (html) => {
      const re = /href=["']\/guide\/?["'][^>]*>\s*Quick[\s-]?[Ss]tart/g;
      const m = html.match(re);
      return m ? [`${m.length} stale Quick Start link(s)`] : [];
    },
  },
  {
    id: 'sepolia-v3-address',
    severity: 'error',
    label: 'Hard-coded V3 Sepolia address',
    note: 'V3 contract address 0x7fcEc... should be replaced with <SEPOLIA_V5_ADDRESS> placeholder.',
    test: (html) => {
      const m = html.match(/0x7fcEc350268F5482D04eb4B229A0679374906732/gi);
      return m ? [`${m.length} reference(s)`] : [];
    },
  },
  {
    id: 'sepolia-v5-placeholder',
    severity: 'info',
    label: 'V5 Sepolia address placeholder',
    note: 'Replace <SEPOLIA_V5_ADDRESS> with the deployed V5 address once the contract ships.',
    test: (html) => {
      const m = html.match(/&lt;SEPOLIA_V5_ADDRESS&gt;|<SEPOLIA_V5_ADDRESS>/g);
      return m ? [`${m.length} placeholder(s)`] : [];
    },
  },
  {
    id: 'oak-segment-naming',
    severity: 'info',
    label: 'oak-segment-http used without oak-segment-gossip',
    note: 'oak-segment-gossip is the canonical conceptual name (decided 2026-05-06). oak-segment-http is the package/transport name. Most pages should reference both, with -gossip primary.',
    test: (html) => {
      const httpCount = (html.match(/oak-segment-http/g) || []).length;
      const gossipCount = (html.match(/oak-segment-gossip/g) || []).length;
      if (httpCount > 0 && gossipCount === 0) return [`${httpCount} oak-segment-http reference(s) without -gossip`];
      return [];
    },
  },
  {
    id: 'http-protocol-bare-url',
    severity: 'warn',
    label: 'Bare http:// URL (not localhost)',
    note: 'Production URLs should be https://. http://localhost:* is fine for example code.',
    test: (html) => {
      // match http:// but not http://localhost or http://127.
      const re = /http:\/\/(?!localhost|127\.0\.0\.1|validator:)/g;
      const m = html.match(re);
      return m ? [`${m.length} bare http:// URL(s)`] : [];
    },
  },
];

const FETCH_HEADERS = { Authorization: `Bearer ${TOKEN}` };

async function fetchPage(path) {
  const url = `https://admin.da.live/source/${ORG}/${REPO}${path}.html`;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) return { path, error: res.status };
  return { path, html: await res.text() };
}

async function main() {
  const results = await Promise.all(PAGES.map(fetchPage));
  const fetched = results.filter((r) => r.html);
  const failed = results.filter((r) => r.error);

  if (failed.length) {
    console.log('Failed to fetch:');
    for (const f of failed) console.log(`  ${f.path} (${f.error})`);
    console.log();
  }

  const findings = [];
  for (const { path, html } of fetched) {
    for (const rule of RULES) {
      const hits = rule.test(html);
      if (hits.length) findings.push({ path, rule, hits });
    }
  }

  // Group findings by rule for the summary view
  const byRule = new Map();
  for (const f of findings) {
    if (!byRule.has(f.rule.id)) byRule.set(f.rule.id, { rule: f.rule, items: [] });
    byRule.get(f.rule.id).items.push(f);
  }

  let errorCount = 0;
  let warnCount = 0;
  let infoCount = 0;

  console.log('OAK CHAIN DOCS CORPUS AUDIT');
  console.log('===========================');
  console.log(`Pages audited: ${fetched.length}`);
  console.log(`Findings: ${findings.length}`);
  console.log();

  if (!findings.length) {
    console.log('Clean. No rules triggered.');
    process.exit(0);
  }

  for (const { rule, items } of byRule.values()) {
    const tag = rule.severity.toUpperCase();
    console.log(`[${tag}] ${rule.label} — ${items.length} page(s)`);
    console.log(`  ${rule.note}`);
    for (const f of items) {
      console.log(`  ${f.path}: ${f.hits.join(', ')}`);
      if (rule.severity === 'error') errorCount += 1;
      else if (rule.severity === 'warn') warnCount += 1;
      else infoCount += 1;
    }
    console.log();
  }

  console.log('Summary:');
  console.log(`  errors: ${errorCount}`);
  console.log(`  warnings: ${warnCount}`);
  console.log(`  info: ${infoCount}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('audit failed:', err);
  process.exit(2);
});
