/**
 * Flow Graph block.
 *
 * Renders an interactive SVG flow diagram with optional animated packet replay.
 * Ported from oak-chain-docs/.vitepress/theme/components/FlowGraph.vue.
 *
 * Authoring contract (DA):
 *   | Flow Graph |
 *   | ---------- |
 *   | two-models |
 *
 * Optional second cell may carry configuration like `height: 340`.
 */

const NODE_TYPES = {
  USER: { icon: '👤', color: '#627EEA' },
  WALLET: { icon: '👛', color: '#f0b429' },
  AUTHOR: { icon: '✍️', color: '#8C8DFC' },
  VALIDATOR: { icon: '⚡', color: '#4ade80' },
  CONSENSUS: { icon: '🔄', color: '#627EEA' },
  OAK_STORE: { icon: '🌳', color: '#4ade80' },
  ETHEREUM: { icon: '⟠', color: '#627EEA' },
  CONTRACT: { icon: '📜', color: '#f85149' },
  IPFS: { icon: '🌐', color: '#65c2cb' },
  SEGMENT: { icon: '📦', color: '#8b949e' },
  CONTENT: { icon: '📄', color: '#e6edf3' },
  SIGNATURE: { icon: '🔐', color: '#f0b429' },
  TRANSACTION: { icon: '💸', color: '#4ade80' },
  AEM: { icon: '🏢', color: '#fa0f00' },
  CDN: { icon: '🌍', color: '#f48120' },
  PASSKEY: { icon: '🔑', color: '#a855f7' },
  EDS: { icon: '⚡', color: '#00c7b7' },
  AZURE: { icon: '☁️', color: '#0078d4' },
};

const EDGE_COLORS = {
  DATA: '#627EEA',
  CONTROL: '#8C8DFC',
  PAYMENT: '#f0b429',
  ASYNC: '#65c2cb',
};

const FLOW_WIDTHS = {
  'two-models': 950,
  'aem-integration': 900,
};

const FLOWS = {
  'two-models': {
    nodes: [
      ['eds', 'EDS', 70, 80, 'EDS (aem.live)', 'Edge Delivery Services'],
      ['validators1', 'VALIDATOR', 280, 80, 'Validators', 'Raft consensus cluster'],
      ['ethereum1', 'ETHEREUM', 480, 80, 'Ethereum', 'Payment & verification'],
      ['label1', 'CONTENT', 680, 80, 'Model 1', 'Blockchain-Native (new apps)', 20],
      ['aem', 'AEM', 70, 260, 'Existing AEM', 'On-prem, AMS, AEMaaCS'],
      ['http', 'CONSENSUS', 280, 260, 'oak-segment-http', 'HTTP segment transfer'],
      ['validators2', 'VALIDATOR', 480, 260, 'Validators', 'Same cluster, different access'],
      ['label2', 'CONTENT', 680, 260, 'Model 2', 'AEM Integration (existing)', 20],
      ['ipfs', 'IPFS', 280, 170, 'Author IPFS', 'Binaries at source (CID only in validators)'],
    ],
    edges: [
      ['eds', 'validators1', 'DATA', 'HTTPS API'],
      ['validators1', 'ethereum1', 'PAYMENT', 'verify'],
      ['aem', 'http', 'DATA', 'mount'],
      ['http', 'validators2', 'DATA', 'segments'],
      ['validators1', 'ipfs', 'ASYNC', 'CID'],
      ['validators2', 'ipfs', 'ASYNC', 'CID'],
    ],
    sequence: [
      [['eds', 'validators1', '#00c7b7']],
      [['validators1', 'ethereum1', '#f0b429']],
      [['validators1', 'ipfs', '#65c2cb']],
      [['aem', 'http', '#fa0f00']],
      [['http', 'validators2', '#627EEA']],
      [['validators2', 'ipfs', '#65c2cb']],
    ],
  },
  'aem-integration': {
    nodes: [
      ['aem', 'AEM', 70, 180, 'Existing AEM', 'On-prem, AMS, AEMaaCS, or CQ variant'],
      ['composite', 'OAK_STORE', 220, 180, 'Composite Mount', 'Oak CompositeNodeStore'],
      ['local', 'SEGMENT', 220, 80, '/content (local)', 'Read-write local content'],
      ['http', 'CONSENSUS', 400, 180, 'oak-segment-http', 'HTTP persistence layer'],
      ['validators', 'VALIDATOR', 580, 180, 'Validators', 'Raft consensus cluster'],
      ['oakchain', 'OAK_STORE', 580, 80, '/oak-chain (remote)', 'Read-only blockchain content'],
      ['ethereum', 'ETHEREUM', 750, 180, 'Ethereum', 'Payment verification'],
    ],
    edges: [
      ['aem', 'composite', 'DATA', 'JCR API'],
      ['composite', 'local', 'DATA', 'read/write'],
      ['composite', 'http', 'ASYNC', 'read-only'],
      ['http', 'validators', 'DATA', 'segments'],
      ['validators', 'oakchain', 'DATA', 'serve'],
      ['validators', 'ethereum', 'PAYMENT', 'verify'],
    ],
    sequence: [
      [['aem', 'composite', '#fa0f00']],
      [['composite', 'local', '#627EEA']],
      [['composite', 'http', '#65c2cb']],
      [['http', 'validators', '#627EEA']],
      [['validators', 'oakchain', '#4ade80']],
      [['validators', 'ethereum', '#f0b429']],
    ],
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_RADIUS = 28;

function buildNode(spec) {
  const [id, type, x, y, label, description, radius] = spec;
  const t = NODE_TYPES[type] || NODE_TYPES.CONTENT;
  return {
    id,
    type,
    x,
    y,
    label,
    description,
    icon: t.icon,
    color: t.color,
    radius: radius || DEFAULT_RADIUS,
  };
}

function buildEdge(spec) {
  const [from, to, type, label] = spec;
  return {
    from, to, type, label, color: EDGE_COLORS[type] || EDGE_COLORS.DATA,
  };
}

function edgeGeometry(edge, nodes) {
  const a = nodes.find((n) => n.id === edge.from);
  const b = nodes.find((n) => n.id === edge.to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const offA = a.radius + 8;
  const offB = b.radius + 8;
  const sx = a.x + (dx / dist) * offA;
  const sy = a.y + (dy / dist) * offA;
  const ex = b.x - (dx / dist) * offB;
  const ey = b.y - (dy / dist) * offB;
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const cv = 0.2;
  const cx = mx - dy * cv;
  const cy = my + dx * cv;
  return {
    sx, sy, ex, ey, cx, cy, mx: cx, my: cy - 12,
  };
}

function dasharray(type) {
  if (type === 'CONTROL') return '8 4';
  if (type === 'ASYNC') return '4 4';
  return 'none';
}

function svgEl(name, attrs = {}, text = null) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text != null) el.textContent = text;
  return el;
}

function renderFlow(container, flowName) {
  const flow = FLOWS[flowName];
  if (!flow) {
    container.textContent = `Unknown flow: ${flowName}`;
    return null;
  }
  const nodes = flow.nodes.map(buildNode);
  const edges = flow.edges.map(buildEdge);
  const width = FLOW_WIDTHS[flowName] || 850;
  const height = 360;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'flow-graph-svg',
    role: 'img',
    'aria-label': `Flow diagram: ${flowName}`,
  });

  // defs
  const defs = svgEl('defs');
  const marker = svgEl('marker', {
    id: `flow-arrow-${flowName}`, markerWidth: 10, markerHeight: 7, refX: 9, refY: 3.5, orient: 'auto',
  });
  marker.appendChild(svgEl('polygon', { points: '0 0, 10 3.5, 0 7', fill: '#627EEA' }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  // edges
  const edgeGroup = svgEl('g', { class: 'flow-graph-edges' });
  edges.forEach((edge) => {
    const g = edgeGeometry(edge, nodes);
    edgeGroup.appendChild(svgEl('path', {
      d: `M ${g.sx} ${g.sy} Q ${g.cx} ${g.cy} ${g.ex} ${g.ey}`,
      fill: 'none',
      stroke: edge.color,
      'stroke-width': 2,
      'stroke-dasharray': dasharray(edge.type),
      'marker-end': `url(#flow-arrow-${flowName})`,
      class: 'flow-graph-edge',
    }));
    if (edge.label) {
      edgeGroup.appendChild(svgEl('text', {
        x: g.mx, y: g.my, 'text-anchor': 'middle', class: 'flow-graph-edge-label',
      }, edge.label));
    }
  });
  svg.appendChild(edgeGroup);

  // nodes
  const nodeGroup = svgEl('g', { class: 'flow-graph-nodes' });
  nodes.forEach((node) => {
    const g = svgEl('g', {
      transform: `translate(${node.x}, ${node.y})`,
      class: 'flow-graph-node',
      'data-node-id': node.id,
      tabindex: '0',
    });
    g.appendChild(svgEl('circle', {
      r: node.radius + 8, fill: 'none', stroke: node.color, 'stroke-width': 1, class: 'flow-graph-node-glow',
    }));
    g.appendChild(svgEl('circle', {
      r: node.radius, fill: '#1a1a2e', stroke: node.color, 'stroke-width': 2, class: 'flow-graph-node-circle',
    }));
    g.appendChild(svgEl('text', {
      'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 18, class: 'flow-graph-node-icon',
    }, node.icon));
    g.appendChild(svgEl('text', {
      'text-anchor': 'middle', y: node.radius + 18, class: 'flow-graph-node-label',
    }, node.label));
    nodeGroup.appendChild(g);
  });
  svg.appendChild(nodeGroup);

  // packets layer
  const packetGroup = svgEl('g', { class: 'flow-graph-packets' });
  svg.appendChild(packetGroup);

  // info panel
  const info = document.createElement('div');
  info.className = 'flow-graph-info';
  info.hidden = true;

  function showInfo(node) {
    info.innerHTML = `
      <div class="flow-graph-info-header">
        <span class="flow-graph-info-icon">${node.icon}</span>
        <span class="flow-graph-info-title">${node.label}</span>
      </div>
      ${node.description ? `<p class="flow-graph-info-desc">${node.description}</p>` : ''}
    `;
    info.hidden = false;
  }

  function hideInfo() { info.hidden = true; }

  nodeGroup.querySelectorAll('.flow-graph-node').forEach((g) => {
    const id = g.getAttribute('data-node-id');
    const node = nodes.find((n) => n.id === id);
    g.addEventListener('mouseenter', () => showInfo(node));
    g.addEventListener('focus', () => showInfo(node));
    g.addEventListener('mouseleave', hideInfo);
    g.addEventListener('blur', hideInfo);
  });

  container.appendChild(svg);
  container.appendChild(info);

  return {
    svg, packetGroup, nodes, flow,
  };
}

function animateFlow({ packetGroup, nodes, flow }) {
  const seq = flow.sequence || [];
  const stepDuration = 600;
  const stepGap = 200;

  function packet(fromId, toId, color) {
    return new Promise((resolve) => {
      const a = nodes.find((n) => n.id === fromId);
      const b = nodes.find((n) => n.id === toId);
      if (!a || !b) { resolve(); return; }
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const offA = a.radius + 8;
      const offB = b.radius + 8;
      const sx = a.x + (dx / dist) * offA;
      const sy = a.y + (dy / dist) * offA;
      const ex = b.x - (dx / dist) * offB;
      const ey = b.y - (dy / dist) * offB;
      const cv = 0.2;
      const cx = (sx + ex) / 2 - dy * cv;
      const cy = (sy + ey) / 2 + dx * cv;

      const dot = svgEl('circle', {
        cx: sx, cy: sy, r: 6, fill: color, class: 'flow-graph-packet',
      });
      packetGroup.appendChild(dot);
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / stepDuration, 1);
        const u = 1 - t;
        const x = u * u * sx + 2 * u * t * cx + t * t * ex;
        const y = u * u * sy + 2 * u * t * cy + t * t * ey;
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          dot.remove();
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }

  const wait = (ms) => new Promise((r) => { setTimeout(r, ms); });
  return seq.reduce(
    (chain, step) => chain
      .then(() => Promise.all(step.map(([from, to, color]) => packet(from, to, color))))
      .then(() => wait(stepGap)),
    Promise.resolve(),
  );
}

export default function decorate(block) {
  // Extract flow name from first cell.
  const cells = block.querySelectorAll(':scope > div > div');
  const flowName = (cells[0]?.textContent || 'two-models').trim();

  block.textContent = '';
  block.classList.add(`flow-graph-${flowName}`);

  const wrapper = document.createElement('div');
  wrapper.className = 'flow-graph-wrapper';

  const controls = document.createElement('div');
  controls.className = 'flow-graph-controls';
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'flow-graph-play';
  playBtn.innerHTML = '<span aria-hidden="true">▶</span><span>Play animation</span>';
  controls.appendChild(playBtn);

  const stage = document.createElement('div');
  stage.className = 'flow-graph-stage';

  wrapper.append(controls, stage);
  block.appendChild(wrapper);

  const ctx = renderFlow(stage, flowName);
  if (!ctx) {
    playBtn.disabled = true;
    return;
  }

  let running = false;
  playBtn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    playBtn.disabled = true;
    playBtn.querySelector('span:last-child').textContent = 'Playing…';
    try {
      await animateFlow(ctx);
    } finally {
      running = false;
      playBtn.disabled = false;
      playBtn.querySelector('span:last-child').textContent = 'Play animation';
    }
  });
}
