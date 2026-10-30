# Oak Chain docs: design direction (locked 2026-10-30)

```text
Wow-stack: eds-wow-stack
Scout: 2026-10-30 (Awwwards SOTD/SOTM, CSSDA WOTD, FWA, recent.design (ex-Godly), hoverstat.es, X designer posts)
Heat: the index/ordering is the hero; datasheet language as display type (mono micro-labels, bracketed tags, specs set large); one physical object kept whole.
Anti-heat: dark field + one neon accent + dot/line grid + logo strip + card rows (this site's previous house); loader counters and click-to-enter gates; video/WebGL heroes with no readable text.
Mapped: other: exploded-view technical illustration on a technical-manual grid
EDS path: house system for this site only
Cite: https://drone.riotters.com/ (Awwwards SOTD 2026-10-06, datasheet), https://format.obys.agency/ (Awwwards SOTD 2026-10-19, Swiss specimen), https://x.com/wheresryan22/status/2114881666023846116 (exploded key switch, 2026-10-27)
Thesis: Oak Chain is explained as one machined object: a single content write, taken apart layer by layer, every part named.
System: other:exploded-view technical illustration
Depth: house
Forbidden sibling: the previous oak-chain-docs-eds house (until 2026-10-30)
Custom object: "One Commit, Exploded" (the exploded-commit block)
Loved media job: retired (oak-chain-splash.mp4, tree + chains, baked text)
```

## Forbidden sibling (do not reuse)

- Palette: `#627eea`, `#8c8dfc`, `#a5a6ff` (Ethereum blue-violet) on `#0f0f23` / `#1a1a2e` / `#16213e` navy; neon glows.
- Type: system sans for both headings and body.
- Media dialect: glowing tree, gold chains, neon particles, splash video with baked text.
- Skeleton: grid-paper background, rounded card rows (`visual-cta-grid`, `axiom-grid`), gradient-tinted boxes, centered gradient buttons.

## House system

### Field and ink (token contract; keep the old token names, change values, add the new ones)

| Token | Value | Use |
|---|---|---|
| `--background-color` | `#17181a` graphite | page field |
| `--surface-color` | `#1f2124` | raised plates (code, tables) |
| `--surface-elevated` | `#25282c` | hover, header |
| `--code-bg` | `#121315` | code wells |
| `--text-color` | `#ece6d8` ivory | body ink |
| `--text-muted` | `rgb(236 230 216 / 72%)` | secondary ink |
| `--text-faint` | `rgb(236 230 216 / 48%)` | captions, labels |
| `--brand-1` | `#c8a35a` brass | links, the one accent |
| `--brand-2` | `#dcbd7c` | link hover |
| `--brand-3` | `#e9d3a3` | kicker / highlights |
| `--brand-soft` | `rgb(200 163 90 / 12%)` | selection, hover wash |
| `--brand-border` | `rgb(200 163 90 / 35%)` | focus rings, active rules |
| `--border-color` | `rgb(236 230 216 / 16%)` | hairline rules |
| `--divider-color` | `rgb(236 230 216 / 9%)` | faint dividers |
| `--rule` (new) | `1px solid var(--border-color)` | the manual hairline |

No gradients, no glows, no grid-paper background. One accent: brass.

### Type

- Display: IBM Plex Sans Condensed 600 (self-hosted woff2, OFL, `font-display: swap`, only the display weight preloaded).
- Body: IBM Plex Sans 400/600.
- Labels and code: IBM Plex Mono 400/500. Labels are uppercase mono at the small size with tracking, in `--text-faint` or brass: `FIG. 01`, `[ SIGNED ]`.
- Tokens: `--heading-font-family`, `--body-font-family`, `--mono-font-family` keep their names.

### Rhythm (the after-hero skeleton)

- A manual: sections are numbered figures/chapters with a mono label row (`FIG. 01 · ORDERING`) above the heading and a hairline rule.
- Lists of destinations are an index (table-of-contents rows with leader rules and a mono number), not card rows.
- Callouts are margin notes with a brass left rule, not tinted boxes.
- Tables are spec sheets: hairline rows, mono headers.

### The custom object

`exploded-commit` block: an isometric exploded view of one write, top to bottom: document card (the JCR node), signature plate (wallet seal), faceted coin (settlement), three validator tiles (ordering), striped segment slab (Oak TAR storage). Leader lines to authored HTML labels. Hover/focus a layer highlights it and its label. Static when `prefers-reduced-motion` or `html[quick-edit]`. The H1 stays the LCP; the figure decorates after.

## Ownership while building (parallel builders, disjoint files)

- Object builder: `blocks/exploded-commit/**` only.
- House builder: `styles/**`, `fonts/**`, `head.html`, `blocks/{header,footer,docs-sidebar,page-toc,search,mermaid,flow-graph,data-table,eth-ticker}/**`.
- Module builder: `blocks/{video-hero,axiom-grid,bridge-frame,protocol-path,visual-cta-grid,key-insight,model-card,layer-section,shared-architecture,diagram-explanation,integration-path,action-btn,picture,cards,columns,hero,hero-oak}/**`.

## Sibling glance test (gate)

Open this site and a screenshot of the previous house at 1440 px. If a stranger could swap the logos and feel the same house, it fails.
