/**
 * Mermaid block.
 *
 * Renders a Mermaid diagram from a fenced code block authored inside the
 * block's single cell:
 *
 *   <div class="mermaid">
 *     <div><div>
 *       <pre><code>stateDiagram-v2
 *         [*] --> Follower
 *         …
 *       </code></pre>
 *     </div></div>
 *   </div>
 *
 * Mermaid is loaded lazily from a CDN on first use to avoid the ~600KB cost
 * on pages that don't need it.
 */

const MERMAID_VERSION = '11.16.0';
const MERMAID_CDN = `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs`;
// House palette (DIRECTION.md): graphite field, ivory ink, brass accent.
// Mermaid needs literal colours, so these mirror the :root tokens.
const HOUSE = {
  well: '#121315',
  field: '#17181a',
  plate: '#1f2124',
  raised: '#25282c',
  rule: '#3a3a39',
  ivory: '#ece6d8',
  muted: '#b0aca3',
  faint: '#8e8b84',
  brass: '#c8a35a',
};

const THEME = {
  startOnLoad: false,
  securityLevel: 'strict',
  suppressErrorRendering: true,
  theme: 'base',
  themeVariables: {
    darkMode: true,
    fontFamily: "'IBM Plex Sans', arial, sans-serif",
    fontSize: '14px',
    background: HOUSE.well,
    primaryColor: HOUSE.plate,
    primaryTextColor: HOUSE.ivory,
    primaryBorderColor: HOUSE.brass,
    secondaryColor: HOUSE.raised,
    secondaryTextColor: HOUSE.ivory,
    secondaryBorderColor: HOUSE.muted,
    tertiaryColor: HOUSE.field,
    tertiaryTextColor: HOUSE.ivory,
    tertiaryBorderColor: HOUSE.rule,
    mainBkg: HOUSE.plate,
    nodeBorder: HOUSE.brass,
    nodeTextColor: HOUSE.ivory,
    textColor: HOUSE.ivory,
    titleColor: HOUSE.ivory,
    lineColor: HOUSE.muted,
    edgeLabelBackground: HOUSE.well,
    clusterBkg: HOUSE.field,
    clusterBorder: HOUSE.rule,
    actorBkg: HOUSE.plate,
    actorBorder: HOUSE.brass,
    actorTextColor: HOUSE.ivory,
    actorLineColor: HOUSE.faint,
    signalColor: HOUSE.muted,
    signalTextColor: HOUSE.ivory,
    labelBoxBkgColor: HOUSE.plate,
    labelBoxBorderColor: HOUSE.brass,
    labelTextColor: HOUSE.ivory,
    loopTextColor: HOUSE.ivory,
    noteBkgColor: HOUSE.raised,
    noteBorderColor: HOUSE.brass,
    noteTextColor: HOUSE.ivory,
    activationBkgColor: HOUSE.raised,
    activationBorderColor: HOUSE.brass,
    sequenceNumberColor: HOUSE.field,
    transitionColor: HOUSE.muted,
    transitionLabelColor: HOUSE.muted,
    stateLabelColor: HOUSE.ivory,
    labelBackgroundColor: HOUSE.well,
    compositeBackground: HOUSE.field,
    compositeTitleBackground: HOUSE.plate,
    altBackground: HOUSE.field,
    specialStateColor: HOUSE.brass,
    innerEndBackground: HOUSE.brass,
  },
};

let mermaidPromise;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import(/* @vite-ignore */ MERMAID_CDN).then((mod) => {
      const m = mod.default || mod;
      m.initialize(THEME);
      return m;
    });
  }
  return mermaidPromise;
}

let counter = 0;

export default async function decorate(block) {
  const code = block.querySelector('pre code, code');
  const source = (code?.textContent || block.textContent || '').trim();
  if (!source) return;

  const diagramType = source.split(/\s|\n/, 1)[0].toLowerCase();
  if (diagramType.startsWith('sequence')) block.classList.add('sequence');
  else if (diagramType.startsWith('state')) block.classList.add('state');
  else if (/^(?:graph|flowchart)$/.test(diagramType)) block.classList.add('wide');

  block.textContent = '';
  const stage = document.createElement('div');
  stage.className = 'mermaid-stage';
  block.appendChild(stage);

  try {
    const mermaid = await loadMermaid();
    // Mermaid measures label text at render time; measure the house face.
    await document.fonts?.ready;
    counter += 1;
    const id = `mermaid-svg-${counter}`;
    const { svg } = await mermaid.render(id, source);
    stage.innerHTML = svg;
  } catch (err) {
    stage.classList.add('mermaid-error');
    const pre = document.createElement('pre');
    pre.textContent = `Mermaid render failed: ${err.message}\n\n${source}`;
    stage.appendChild(pre);
  }
}
