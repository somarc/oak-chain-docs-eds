#!/usr/bin/env node
// Convert a VitePress markdown source page to AEM Edge Delivery DA HTML.
//
// Pre-processes oak-chain-docs-specific syntax before running marked:
//   <FlowGraph flow="X" :height="N" />     → flow-graph block table
//   ```mermaid                              → mermaid block table
//   <div class="X">…markdown…</div>         → EDS block table with inner
//                                            markdown rendered to HTML
//
// Section breaks: each top-level `## ` heading starts a new EDS section.
// Front-matter is stripped.

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

const KNOWN_BLOCK_CLASSES = new Set([
  'model-card', 'shared-architecture', 'diagram-explanation',
  'layer-section', 'key-insight', 'integration-path',
  'figure',
]);

// --- helpers --------------------------------------------------------------

function stripFrontmatter(md) {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('\n---', 3);
  if (end === -1) return md;
  return md.slice(end + 4).replace(/^\n+/, '');
}

function flowGraphBlock(flow) {
  return `<div class="flow-graph">\n<div>\n<div>${flow}</div>\n</div>\n</div>`;
}

function mermaidBlock(source) {
  const escaped = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<div class="mermaid">\n<div>\n<div>\n<pre><code>${escaped}</code></pre>\n</div>\n</div>\n</div>`;
}

function customDivBlock(cls, innerHtml) {
  return `<div class="${cls}">\n<div>\n<div>\n${innerHtml}\n</div>\n</div>\n</div>`;
}

// Replace <FlowGraph flow="X" .../> with our flow-graph block markup.
function replaceFlowGraph(md) {
  return md.replace(/<FlowGraph\s+flow="([\w-]+)"[^/]*\/>/g, (_, flow) => flowGraphBlock(flow));
}

// Replace ```mermaid blocks with our mermaid block markup.
function replaceMermaid(md) {
  return md.replace(/```mermaid\n([\s\S]*?)\n```/g, (_, src) => mermaidBlock(src.trim()));
}

// Replace <div class="X">…markdown…</div> with our block markup.
// Inner markdown is rendered to HTML recursively. Only known classes match.
function replaceCustomDivs(md) {
  const classPattern = [...KNOWN_BLOCK_CLASSES].join('|');
  const re = new RegExp(`<div class="(${classPattern})">\\n([\\s\\S]*?)\\n</div>`, 'g');
  return md.replace(re, (_, cls, inner) => {
    const innerHtml = marked.parse(inner.trim()).trim();
    return customDivBlock(cls, innerHtml);
  });
}

// Drop VitePress-only inline HTML wrappers we don't want to keep.
// Specifically: `<div style="…">…<img …/>…</div>` patterns used for
// the rickrubin figure on thesis.md — let the caller hand-author those
// or convert to a figure block manually.
function dropStyleWrapperDivs(md) {
  return md.replace(/<div style="[^"]*">\s*([\s\S]*?)\s*<\/div>/g, (_, inner) => inner);
}

// Strip inline <style> blocks — Helix normalizes them out anyway, and the
// rules they contain have been ported to either styles.css or block CSS.
function stripStyleBlocks(md) {
  return md.replace(/<style>[\s\S]*?<\/style>\s*/g, '');
}

// `<div class="visual-cta-grid">…</div>` containing N `<a class="visual-cta-card">`
// children → EDS block table with each card as its own row. The card's
// `<strong>` becomes the headline; remaining text becomes the description.
function replaceVisualCtaGrid(md) {
  return md.replace(/<div class="visual-cta-grid">([\s\S]*?)<\/div>/g, (_, inner) => {
    const cardRe = /<a class="visual-cta-card" href="([^"]+)">([\s\S]*?)<\/a>/g;
    const rows = [];
    let m;
    while ((m = cardRe.exec(inner)) !== null) {
      rows.push({ href: m[1], body: m[2].trim() });
    }
    if (!rows.length) return '';
    const cells = rows.map((r) => {
      // Body looks like: `<strong>Title</strong>\n<span>Desc</span>` — preserve.
      return `<div>\n<div>\n<a href="${r.href}">${r.body}</a>\n</div>\n</div>`;
    }).join('\n');
    return `<div class="visual-cta-grid">\n${cells}\n</div>`;
  });
}

// `<a class="action-btn">…</a>` (sometimes wrapped in a `<div style="…">`)
// → action-btn block table.
function replaceActionBtn(md) {
  return md.replace(/<a([^>]*?)class="action-btn(?:\s+secondary)?"([^>]*?)>([\s\S]*?)<\/a>/g,
    (full, before, after, text) => {
      const isSecondary = full.includes('secondary');
      const cls = isSecondary ? 'action-btn secondary' : 'action-btn';
      const hrefMatch = full.match(/href="([^"]+)"/);
      const href = hrefMatch ? hrefMatch[1] : '#';
      return `<div class="${cls}">\n<div>\n<div>\n<a href="${href}">${text.trim()}</a>\n</div>\n</div>\n</div>`;
    });
}

// VitePress publishes under base path /oak-chain-docs/. Strip the prefix
// from absolute hrefs so the same content works on the EDS site, which
// publishes at the root.
function rewriteVitePressBasePath(md) {
  return md
    .replace(/href="\/oak-chain-docs\//g, 'href="/')
    .replace(/src="\/oak-chain-docs\//g, 'src="/')
    .replace(/\(\/oak-chain-docs\//g, '(/');
}

// VitePress container blocks (::: tip / warning / info / danger / details)
// become block quotes with the kind preserved as a leading bold word.
function replaceVitePressContainers(md) {
  return md.replace(/^:::\s*(tip|warning|info|danger|details)(?:\s+([^\n]+))?\n([\s\S]*?)\n:::\s*$/gm, (_, kind, title, body) => {
    const heading = title ? `**${title}**` : `**${kind.charAt(0).toUpperCase() + kind.slice(1)}**`;
    const quoted = body.split('\n').map((l) => `> ${l}`).join('\n');
    return `> ${heading}\n>\n${quoted}`;
  });
}

// Split processed content into sections at every top-level `## `.
// Section 1 keeps the H1 and any leading paragraphs.
function splitSections(md) {
  const lines = md.split('\n');
  const sections = [[]];
  for (const line of lines) {
    if (/^## /.test(line)) {
      sections.push([line]);
    } else {
      sections[sections.length - 1].push(line);
    }
  }
  return sections.map((s) => s.join('\n').trim()).filter(Boolean);
}

// --- main -----------------------------------------------------------------

function convert(md) {
  let content = stripFrontmatter(md);
  content = stripStyleBlocks(content);
  content = rewriteVitePressBasePath(content);
  content = replaceVitePressContainers(content);
  content = replaceVisualCtaGrid(content);
  content = replaceActionBtn(content);
  content = dropStyleWrapperDivs(content);
  content = replaceFlowGraph(content);
  content = replaceMermaid(content);
  content = replaceCustomDivs(content);
  // Drop horizontal rules that were used as section dividers in source —
  // we already split into sections at H2 headings.
  content = content.replace(/^\s*---\s*$/gm, '');

  const sectionMd = splitSections(content);
  const sectionHtml = sectionMd.map((s) => `    <div>\n${marked.parse(s).trim().replace(/^/gm, '      ')}\n    </div>`);

  return `<body>\n  <header></header>\n  <main>\n${sectionHtml.join('\n')}\n  </main>\n  <footer></footer>\n</body>\n`;
}

const [, , inPath, outPath] = process.argv;
if (!inPath) {
  console.error('Usage: tools/da/md-to-da.mjs <input.md> [output.html]');
  process.exit(1);
}
const md = fs.readFileSync(inPath, 'utf8');
const html = convert(md);
if (outPath) {
  fs.writeFileSync(outPath, html);
  console.log(`wrote ${outPath} (${html.length} bytes)`);
} else {
  process.stdout.write(html);
}
