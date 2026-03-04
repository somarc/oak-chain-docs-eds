/**
 * Unit Visual Programming Integration for Blockchain AEM
 * 
 * Provides interactive flow visualizations using Unit's graph-based approach.
 * @see https://github.com/samuelmtimbo/unit
 * 
 * This module creates visual representations of:
 * - Content write flows (Author → Wallet → Validator → Oak-chain)
 * - Payment flows (MetaMask → Smart Contract → Validators)
 * - Consensus flows (Raft leader election, log replication)
 * - IPFS storage flows (Binary → IPFS → CID → Oak reference)
 */

// =============================================================================
// UNIT GRAPH RENDERER
// =============================================================================

/**
 * Node types for our flow graphs
 */
const NODE_TYPES = {
  // Actors
  USER: { icon: '👤', color: '#00ffd5', label: 'User' },
  WALLET: { icon: '👛', color: '#f0b429', label: 'Wallet' },
  AUTHOR: { icon: '✍️', color: '#7c3aed', label: 'Author' },
  
  // Infrastructure
  VALIDATOR: { icon: '⚡', color: '#3fb950', label: 'Validator' },
  CONSENSUS: { icon: '🔄', color: '#58a6ff', label: 'Consensus' },
  OAK_STORE: { icon: '🌳', color: '#00a3cc', label: 'Oak Store' },
  
  // Blockchain
  ETHEREUM: { icon: '⟠', color: '#627eea', label: 'Ethereum' },
  CONTRACT: { icon: '📜', color: '#f85149', label: 'Contract' },
  
  // Storage
  IPFS: { icon: '🌐', color: '#65c2cb', label: 'IPFS' },
  SEGMENT: { icon: '📦', color: '#8b949e', label: 'Segment' },
  
  // Data
  CONTENT: { icon: '📄', color: '#e6edf3', label: 'Content' },
  SIGNATURE: { icon: '🔐', color: '#f0b429', label: 'Signature' },
  TRANSACTION: { icon: '💸', color: '#3fb950', label: 'Transaction' },
};

/**
 * Edge types for connections
 */
const EDGE_TYPES = {
  DATA: { color: '#00ffd5', style: 'solid', width: 2 },
  CONTROL: { color: '#7c3aed', style: 'dashed', width: 1 },
  PAYMENT: { color: '#f0b429', style: 'solid', width: 3 },
  ASYNC: { color: '#58a6ff', style: 'dotted', width: 1 },
};

/**
 * Flow graph class - represents a visual program flow
 */
class FlowGraph {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      width: options.width || 800,
      height: options.height || 500,
      animated: options.animated !== false,
      interactive: options.interactive !== false,
      theme: options.theme || 'dark',
      ...options
    };
    this.nodes = new Map();
    this.edges = [];
    this.activeNode = null;
    this.animationFrame = null;
    this.dataFlows = [];
    
    this.init();
  }
  
  init() {
    // Create SVG canvas
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', this.options.height);
    this.svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
    this.svg.classList.add('unit-flow-graph');
    
    // Create layers
    this.edgeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.edgeLayer.classList.add('edge-layer');
    
    this.nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.nodeLayer.classList.add('node-layer');
    
    this.animationLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.animationLayer.classList.add('animation-layer');
    
    // Defs for gradients and markers
    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.createDefs();
    
    this.svg.appendChild(this.defs);
    this.svg.appendChild(this.edgeLayer);
    this.svg.appendChild(this.nodeLayer);
    this.svg.appendChild(this.animationLayer);
    
    // Create info panel
    this.infoPanel = document.createElement('div');
    this.infoPanel.classList.add('unit-info-panel');
    this.infoPanel.style.display = 'none';
    
    // Wrap in container
    const wrapper = document.createElement('div');
    wrapper.classList.add('unit-flow-wrapper');
    wrapper.appendChild(this.svg);
    wrapper.appendChild(this.infoPanel);
    
    this.container.appendChild(wrapper);
  }
  
  createDefs() {
    // Arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', 'var(--accent-primary)');
    marker.appendChild(polygon);
    this.defs.appendChild(marker);
    
    // Glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.innerHTML = `
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `;
    this.defs.appendChild(filter);
    
    // Gradient for edges
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'edge-gradient');
    gradient.innerHTML = `
      <stop offset="0%" stop-color="#00ffd5" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#00ffd5" stop-opacity="1"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.3"/>
    `;
    this.defs.appendChild(gradient);
  }
  
  /**
   * Add a node to the graph
   */
  addNode(id, type, x, y, options = {}) {
    const nodeType = NODE_TYPES[type] || NODE_TYPES.CONTENT;
    const node = {
      id,
      type,
      x,
      y,
      label: options.label || nodeType.label,
      icon: options.icon || nodeType.icon,
      color: options.color || nodeType.color,
      description: options.description || '',
      data: options.data || {},
      radius: options.radius || 28,
    };
    
    this.nodes.set(id, node);
    this.renderNode(node);
    return this;
  }
  
  /**
   * Add an edge between nodes
   */
  addEdge(fromId, toId, type = 'DATA', options = {}) {
    const edgeType = EDGE_TYPES[type] || EDGE_TYPES.DATA;
    const edge = {
      from: fromId,
      to: toId,
      type,
      color: options.color || edgeType.color,
      style: options.style || edgeType.style,
      width: options.width || edgeType.width,
      label: options.label || '',
      animated: options.animated !== false,
    };
    
    this.edges.push(edge);
    this.renderEdge(edge);
    return this;
  }
  
  renderNode(node) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('unit-node');
    g.setAttribute('data-id', node.id);
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
    
    // Outer glow circle
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('r', node.radius + 8);
    glow.setAttribute('fill', 'none');
    glow.setAttribute('stroke', node.color);
    glow.setAttribute('stroke-width', '1');
    glow.setAttribute('opacity', '0.3');
    glow.classList.add('node-glow');
    
    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', node.radius);
    circle.setAttribute('fill', 'var(--bg-elevated)');
    circle.setAttribute('stroke', node.color);
    circle.setAttribute('stroke-width', '2');
    circle.classList.add('node-circle');
    
    // Icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('dominant-baseline', 'central');
    icon.setAttribute('font-size', '20');
    icon.textContent = node.icon;
    icon.classList.add('node-icon');
    
    // Label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('y', node.radius + 20);
    label.setAttribute('fill', 'var(--text-secondary)');
    label.setAttribute('font-size', '11');
    label.setAttribute('font-weight', '500');
    label.textContent = node.label;
    label.classList.add('node-label');
    
    g.appendChild(glow);
    g.appendChild(circle);
    g.appendChild(icon);
    g.appendChild(label);
    
    // Interactivity
    if (this.options.interactive) {
      g.style.cursor = 'pointer';
      g.addEventListener('mouseenter', () => this.onNodeHover(node, g));
      g.addEventListener('mouseleave', () => this.onNodeLeave(node, g));
      g.addEventListener('click', () => this.onNodeClick(node, g));
    }
    
    this.nodeLayer.appendChild(g);
    node.element = g;
  }
  
  renderEdge(edge) {
    const fromNode = this.nodes.get(edge.from);
    const toNode = this.nodes.get(edge.to);
    
    if (!fromNode || !toNode) return;
    
    // Calculate path
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Offset from node centers
    const offsetFrom = fromNode.radius + 5;
    const offsetTo = toNode.radius + 15;
    
    const startX = fromNode.x + (dx / dist) * offsetFrom;
    const startY = fromNode.y + (dy / dist) * offsetFrom;
    const endX = toNode.x - (dx / dist) * offsetTo;
    const endY = toNode.y - (dy / dist) * offsetTo;
    
    // Create curved path
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curvature = 0.2;
    const ctrlX = midX - dy * curvature;
    const ctrlY = midY + dx * curvature;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', edge.color);
    path.setAttribute('stroke-width', edge.width);
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.classList.add('unit-edge');
    
    if (edge.style === 'dashed') {
      path.setAttribute('stroke-dasharray', '8 4');
    } else if (edge.style === 'dotted') {
      path.setAttribute('stroke-dasharray', '2 4');
    }
    
    this.edgeLayer.appendChild(path);
    edge.element = path;
    edge.pathData = { startX, startY, endX, endY, ctrlX, ctrlY };
    
    // Add label if present
    if (edge.label) {
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', ctrlX);
      labelText.setAttribute('y', ctrlY - 10);
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('fill', 'var(--text-muted)');
      labelText.setAttribute('font-size', '10');
      labelText.textContent = edge.label;
      this.edgeLayer.appendChild(labelText);
    }
  }
  
  onNodeHover(node, element) {
    element.querySelector('.node-glow').setAttribute('opacity', '0.6');
    element.querySelector('.node-circle').setAttribute('filter', 'url(#glow)');
    
    // Show info panel
    this.showInfo(node);
  }
  
  onNodeLeave(node, element) {
    element.querySelector('.node-glow').setAttribute('opacity', '0.3');
    element.querySelector('.node-circle').removeAttribute('filter');
    
    // Hide info panel
    this.hideInfo();
  }
  
  onNodeClick(node, element) {
    // Highlight connected edges
    this.highlightConnections(node.id);
    
    // Dispatch custom event
    this.container.dispatchEvent(new CustomEvent('node-click', { 
      detail: { node, element } 
    }));
  }
  
  showInfo(node) {
    this.infoPanel.innerHTML = `
      <div class="info-header">
        <span class="info-icon">${node.icon}</span>
        <span class="info-title">${node.label}</span>
      </div>
      ${node.description ? `<p class="info-desc">${node.description}</p>` : ''}
      ${Object.keys(node.data).length > 0 ? `
        <div class="info-data">
          ${Object.entries(node.data).map(([k, v]) => 
            `<div class="info-row"><span>${k}:</span> <code>${v}</code></div>`
          ).join('')}
        </div>
      ` : ''}
    `;
    this.infoPanel.style.display = 'block';
  }
  
  hideInfo() {
    this.infoPanel.style.display = 'none';
  }
  
  highlightConnections(nodeId) {
    // Reset all
    this.edges.forEach(edge => {
      if (edge.element) {
        edge.element.setAttribute('opacity', '0.3');
      }
    });
    
    // Highlight connected
    this.edges.forEach(edge => {
      if (edge.from === nodeId || edge.to === nodeId) {
        if (edge.element) {
          edge.element.setAttribute('opacity', '1');
        }
      }
    });
    
    // Reset after delay
    setTimeout(() => {
      this.edges.forEach(edge => {
        if (edge.element) {
          edge.element.setAttribute('opacity', '1');
        }
      });
    }, 2000);
  }
  
  /**
   * Animate data flowing along an edge
   */
  animateDataFlow(fromId, toId, options = {}) {
    const edge = this.edges.find(e => e.from === fromId && e.to === toId);
    if (!edge || !edge.pathData) return;
    
    const { startX, startY, endX, endY, ctrlX, ctrlY } = edge.pathData;
    
    // Create data packet
    const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    packet.setAttribute('r', options.size || 6);
    packet.setAttribute('fill', options.color || '#00ffd5');
    packet.setAttribute('filter', 'url(#glow)');
    packet.classList.add('data-packet');
    
    this.animationLayer.appendChild(packet);
    
    // Animate along quadratic bezier
    const duration = options.duration || 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Quadratic bezier formula
      const x = (1-t)*(1-t)*startX + 2*(1-t)*t*ctrlX + t*t*endX;
      const y = (1-t)*(1-t)*startY + 2*(1-t)*t*ctrlY + t*t*endY;
      
      packet.setAttribute('cx', x);
      packet.setAttribute('cy', y);
      
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        packet.remove();
        if (options.onComplete) options.onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Run a sequence of animations
   */
  async runSequence(steps) {
    for (const step of steps) {
      await new Promise(resolve => {
        this.animateDataFlow(step.from, step.to, {
          ...step,
          onComplete: resolve
        });
      });
      
      // Highlight target node briefly
      const targetNode = this.nodes.get(step.to);
      if (targetNode && targetNode.element) {
        targetNode.element.querySelector('.node-circle').setAttribute('filter', 'url(#glow)');
        setTimeout(() => {
          targetNode.element.querySelector('.node-circle').removeAttribute('filter');
        }, 300);
      }
      
      if (step.delay) {
        await new Promise(r => setTimeout(r, step.delay));
      }
    }
  }
  
  /**
   * Clear the graph
   */
  clear() {
    this.nodes.clear();
    this.edges = [];
    this.nodeLayer.innerHTML = '';
    this.edgeLayer.innerHTML = '';
    this.animationLayer.innerHTML = '';
  }
}

// =============================================================================
// PREDEFINED FLOW GRAPHS
// =============================================================================

/**
 * Create the Content Write Flow graph
 */
function createContentWriteFlow(container) {
  const graph = new FlowGraph(container, { width: 900, height: 450 });
  
  // Add nodes
  graph
    .addNode('author', 'AUTHOR', 80, 225, {
      label: 'Sling Author',
      description: 'Content editor creates/modifies content',
      data: { 'Tool': 'Composum/AEM', 'Protocol': 'JCR API' }
    })
    .addNode('wallet', 'WALLET', 220, 120, {
      label: 'Author Wallet',
      description: 'Signs content with secp256k1 key',
      data: { 'Key': 'Keystore', 'Algorithm': 'ECDSA' }
    })
    .addNode('proposal', 'SIGNATURE', 220, 330, {
      label: 'Write Proposal',
      description: 'Signed content change request',
      data: { 'Format': 'JSON', 'Signed': 'Yes' }
    })
    .addNode('leader', 'VALIDATOR', 400, 225, {
      label: 'Raft Leader',
      description: 'Receives and validates proposals',
      data: { 'Consensus': 'Aeron Raft', 'Quorum': '2/3' }
    })
    .addNode('consensus', 'CONSENSUS', 550, 120, {
      label: 'Log Replication',
      description: 'Proposal replicated to followers',
      data: { 'Protocol': 'Raft', 'Durability': 'Majority' }
    })
    .addNode('followers', 'VALIDATOR', 550, 330, {
      label: 'Followers',
      description: 'Replicate and acknowledge',
      data: { 'Count': '2+', 'Sync': 'Async' }
    })
    .addNode('commit', 'TRANSACTION', 700, 225, {
      label: 'Commit',
      description: 'Entry committed to log',
      data: { 'Index': 'Auto', 'Term': 'Current' }
    })
    .addNode('oak', 'OAK_STORE', 820, 225, {
      label: 'Oak Store',
      description: 'Content persisted to segments',
      data: { 'Format': 'TAR', 'Journal': 'Updated' }
    });
  
  // Add edges
  graph
    .addEdge('author', 'wallet', 'DATA', { label: 'content' })
    .addEdge('author', 'proposal', 'DATA', { label: 'changes' })
    .addEdge('wallet', 'proposal', 'CONTROL', { label: 'sign' })
    .addEdge('proposal', 'leader', 'DATA', { label: 'submit' })
    .addEdge('leader', 'consensus', 'CONTROL', { label: 'append' })
    .addEdge('leader', 'followers', 'DATA', { label: 'replicate' })
    .addEdge('consensus', 'commit', 'CONTROL', { label: 'majority' })
    .addEdge('followers', 'commit', 'ASYNC', { label: 'ack' })
    .addEdge('commit', 'oak', 'DATA', { label: 'apply' });
  
  return graph;
}

/**
 * Create the Payment Flow graph
 */
function createPaymentFlow(container) {
  const graph = new FlowGraph(container, { width: 900, height: 400 });
  
  graph
    .addNode('user', 'USER', 80, 200, {
      label: 'End User',
      description: 'Initiates content write via UI',
      data: { 'Auth': 'MetaMask' }
    })
    .addNode('metamask', 'WALLET', 220, 200, {
      label: 'MetaMask',
      description: 'Signs Ethereum transaction',
      data: { 'Network': 'Sepolia', 'Gas': 'Auto' }
    })
    .addNode('contract', 'CONTRACT', 400, 200, {
      label: 'ValidatorPayment',
      description: 'Smart contract on Ethereum',
      data: { 'Version': 'V3.1', 'Chain': 'Sepolia' }
    })
    .addNode('event', 'ETHEREUM', 550, 120, {
      label: 'PaymentReceived',
      description: 'Event emitted on-chain',
      data: { 'Indexed': 'payer, amount' }
    })
    .addNode('validators', 'VALIDATOR', 550, 280, {
      label: 'Validators',
      description: 'Monitor contract events',
      data: { 'Listener': 'Web3j', 'Confirm': '1 block' }
    })
    .addNode('authorize', 'SIGNATURE', 720, 200, {
      label: 'Write Authorized',
      description: 'Payment verified, write allowed',
      data: { 'TTL': '1 hour', 'Scope': 'wallet path' }
    });
  
  graph
    .addEdge('user', 'metamask', 'CONTROL', { label: 'connect' })
    .addEdge('metamask', 'contract', 'PAYMENT', { label: 'ETH' })
    .addEdge('contract', 'event', 'DATA', { label: 'emit' })
    .addEdge('contract', 'validators', 'ASYNC', { label: 'notify' })
    .addEdge('event', 'validators', 'DATA', { label: 'verify' })
    .addEdge('validators', 'authorize', 'CONTROL', { label: 'allow' });
  
  return graph;
}

/**
 * Create the IPFS Storage Flow graph
 */
function createIPFSFlow(container) {
  const graph = new FlowGraph(container, { width: 850, height: 400 });
  
  graph
    .addNode('binary', 'CONTENT', 80, 200, {
      label: 'Binary Asset',
      description: 'Image, PDF, video uploaded',
      data: { 'Max': '100MB', 'Types': 'Any' }
    })
    .addNode('author', 'AUTHOR', 220, 200, {
      label: 'Author IPFS',
      description: 'Author runs local IPFS node',
      data: { 'Node': 'Kubo', 'Port': '5001' }
    })
    .addNode('pin', 'IPFS', 380, 120, {
      label: 'Pin Locally',
      description: 'Binary pinned to author node',
      data: { 'Replicas': '1', 'GC': 'Protected' }
    })
    .addNode('cid', 'SEGMENT', 380, 280, {
      label: 'CID Generated',
      description: 'Content-addressed hash',
      data: { 'Version': 'CIDv1', 'Codec': 'raw' }
    })
    .addNode('oak', 'OAK_STORE', 550, 200, {
      label: 'Oak Reference',
      description: 'CID stored as blob reference',
      data: { 'Property': 'jcr:data', 'Type': 'Binary' }
    })
    .addNode('dht', 'IPFS', 720, 120, {
      label: 'DHT Announce',
      description: 'CID announced to network',
      data: { 'Protocol': 'Kademlia', 'TTL': '24h' }
    })
    .addNode('retrieve', 'USER', 720, 280, {
      label: 'Global Retrieve',
      description: 'Anyone can fetch via CID',
      data: { 'Gateway': 'ipfs.io', 'P2P': 'Direct' }
    });
  
  graph
    .addEdge('binary', 'author', 'DATA', { label: 'upload' })
    .addEdge('author', 'pin', 'CONTROL', { label: 'ipfs add' })
    .addEdge('author', 'cid', 'DATA', { label: 'hash' })
    .addEdge('pin', 'oak', 'ASYNC', { label: 'reference' })
    .addEdge('cid', 'oak', 'DATA', { label: 'store CID' })
    .addEdge('oak', 'dht', 'ASYNC', { label: 'announce' })
    .addEdge('dht', 'retrieve', 'DATA', { label: 'discover' })
    .addEdge('cid', 'retrieve', 'CONTROL', { label: 'address' });
  
  return graph;
}

/**
 * Create the Consensus State Machine graph
 */
function createConsensusFlow(container) {
  const graph = new FlowGraph(container, { width: 800, height: 450 });
  
  graph
    .addNode('follower', 'VALIDATOR', 150, 150, {
      label: 'Follower',
      description: 'Initial state, receives heartbeats',
      data: { 'Timeout': '150-300ms', 'Vote': 'None' }
    })
    .addNode('candidate', 'CONSENSUS', 400, 80, {
      label: 'Candidate',
      description: 'Election timeout, requests votes',
      data: { 'Term': '+1', 'Votes': 'Self' }
    })
    .addNode('leader', 'VALIDATOR', 650, 150, {
      label: 'Leader',
      description: 'Sends heartbeats, handles writes',
      data: { 'Heartbeat': '50ms', 'Log': 'Master' }
    })
    .addNode('heartbeat', 'SIGNATURE', 400, 280, {
      label: 'Heartbeat',
      description: 'AppendEntries RPC (empty)',
      data: { 'Interval': '50ms', 'Term': 'Current' }
    })
    .addNode('election', 'TRANSACTION', 150, 350, {
      label: 'Election',
      description: 'RequestVote RPC to all nodes',
      data: { 'Quorum': 'Majority', 'Split': 'Retry' }
    });
  
  graph
    .addEdge('follower', 'candidate', 'CONTROL', { label: 'timeout' })
    .addEdge('candidate', 'leader', 'CONTROL', { label: 'majority votes' })
    .addEdge('candidate', 'follower', 'ASYNC', { label: 'higher term' })
    .addEdge('leader', 'follower', 'ASYNC', { label: 'higher term' })
    .addEdge('leader', 'heartbeat', 'DATA', { label: 'send' })
    .addEdge('heartbeat', 'follower', 'DATA', { label: 'reset timer' })
    .addEdge('follower', 'election', 'CONTROL', { label: 'no heartbeat' })
    .addEdge('election', 'candidate', 'DATA', { label: 'start' });
  
  return graph;
}

/**
 * Create the Segment Store GC Overview graph
 * In Oak Chain: GC is PROPOSAL-BASED through Raft consensus!
 * Shows: Epoch Trigger → GC Proposal → Consensus → Deterministic Compaction
 */
function createGCOverviewFlow(container) {
  const graph = new FlowGraph(container, { width: 950, height: 480 });
  
  // Consensus-based GC flow
  graph
    .addNode('epoch', 'ETHEREUM', 80, 240, {
      label: 'Epoch Finalization',
      description: 'Ethereum epoch triggers GC check',
      data: { 'Trigger': 'Every N epochs', 'Source': 'Ethereum block' }
    })
    .addNode('leader', 'VALIDATOR', 230, 140, {
      label: 'Raft Leader',
      description: 'Only leader can propose GC',
      data: { 'Role': 'Leader only', 'Check': 'Garbage threshold' }
    })
    .addNode('gc_proposal', 'SIGNATURE', 230, 340, {
      label: 'GC Proposal',
      description: 'Signed compaction proposal',
      data: { 'Type': 'COMPACT', 'Signed': 'Leader wallet' }
    })
    .addNode('raft', 'CONSENSUS', 430, 240, {
      label: 'Raft Consensus',
      description: 'Proposal replicated to all validators',
      data: { 'Protocol': 'Aeron Raft', 'Quorum': 'Majority ack' }
    })
    .addNode('deterministic', 'VALIDATOR', 430, 100, {
      label: 'Deterministic',
      description: 'All nodes apply same GC',
      data: { 'Critical': 'Same result', 'Verify': 'Hash match' }
    })
    .addNode('local_gc', 'OAK_STORE', 430, 380, {
      label: 'Local Compaction',
      description: 'Each validator compacts locally',
      data: { 'Mode': 'Tail/Full', 'Parallel': 'Per-node' }
    })
    .addNode('commit', 'TRANSACTION', 630, 240, {
      label: 'Raft Commit',
      description: 'GC committed to consensus log',
      data: { 'Index': 'Raft log', 'Durable': 'Majority' }
    })
    .addNode('reclaimed', 'CONTENT', 800, 240, {
      label: 'Space Reclaimed',
      description: 'All validators reclaim same space',
      data: { 'Consistent': 'Yes', 'Logged': 'Per-node' }
    });
  
  graph
    .addEdge('epoch', 'leader', 'CONTROL', { label: 'trigger' })
    .addEdge('epoch', 'gc_proposal', 'DATA', { label: 'epoch ref' })
    .addEdge('leader', 'gc_proposal', 'CONTROL', { label: 'create' })
    .addEdge('gc_proposal', 'raft', 'DATA', { label: 'broadcast' })
    .addEdge('raft', 'deterministic', 'CONTROL', { label: 'replicate' })
    .addEdge('raft', 'local_gc', 'DATA', { label: 'apply' })
    .addEdge('deterministic', 'commit', 'ASYNC', { label: 'verify' })
    .addEdge('local_gc', 'commit', 'DATA', { label: 'complete' })
    .addEdge('commit', 'reclaimed', 'DATA', { label: 'finalize' });
  
  return graph;
}

/**
 * Create the Compaction Detail graph
 * Shows how segments are copied from old to new generation
 */
function createCompactionDetailFlow(container) {
  const graph = new FlowGraph(container, { width: 950, height: 520 });
  
  graph
    .addNode('journal', 'CONTENT', 80, 260, {
      label: 'Journal Head',
      description: 'Current repository state reference',
      data: { 'File': 'journal.log', 'Format': 'RecordId' }
    })
    .addNode('traverse', 'CONSENSUS', 220, 160, {
      label: 'Tree Traversal',
      description: 'Walk content tree from root',
      data: { 'Algorithm': 'Parallel DFS', 'Threads': '8' }
    })
    .addNode('checkpoints', 'SIGNATURE', 220, 360, {
      label: 'Checkpoints',
      description: 'Async indexing save points',
      data: { 'Dedupe': 'Shared data', 'Order': 'Oldest first' }
    })
    .addNode('old_gen', 'SEGMENT', 400, 100, {
      label: 'Old Generation',
      description: 'Segments in previous generation',
      data: { 'Status': 'Read-only', 'Contains': 'Live + Garbage' }
    })
    .addNode('reachable', 'VALIDATOR', 400, 260, {
      label: 'Reachability Check',
      description: 'Is segment referenced?',
      data: { 'Graph': 'Segment refs', 'Dense': 'Very connected' }
    })
    .addNode('garbage', 'TRANSACTION', 400, 420, {
      label: 'Garbage',
      description: 'Unreachable segments',
      data: { 'Typical': '70-90%', 'Cause': 'Content churn' }
    })
    .addNode('copy', 'OAK_STORE', 580, 180, {
      label: 'Copy Live Data',
      description: 'Write to new generation segments',
      data: { 'Dedupe': 'Record level', 'Compress': 'Yes' }
    })
    .addNode('new_gen', 'SEGMENT', 750, 180, {
      label: 'New Generation',
      description: 'Compacted segments',
      data: { 'Size': '10-30% of old', 'Clean': 'No garbage' }
    })
    .addNode('new_journal', 'CONTENT', 750, 340, {
      label: 'New Journal',
      description: 'Updated head reference',
      data: { 'Atomic': 'CAS update', 'Safe': 'After flush' }
    });
  
  graph
    .addEdge('journal', 'traverse', 'DATA', { label: 'root' })
    .addEdge('journal', 'checkpoints', 'DATA', { label: 'refs' })
    .addEdge('traverse', 'old_gen', 'CONTROL', { label: 'read' })
    .addEdge('checkpoints', 'reachable', 'DATA', { label: 'mark' })
    .addEdge('old_gen', 'reachable', 'DATA', { label: 'check' })
    .addEdge('reachable', 'garbage', 'ASYNC', { label: 'unreachable' })
    .addEdge('reachable', 'copy', 'DATA', { label: 'live' })
    .addEdge('copy', 'new_gen', 'DATA', { label: 'write' })
    .addEdge('new_gen', 'new_journal', 'CONTROL', { label: 'commit' })
    .addEdge('traverse', 'copy', 'CONTROL', { label: 'compact' });
  
  return graph;
}

/**
 * Create the Generational GC graph
 * Shows how generations work and why 2 are retained
 */
function createGenerationalGCFlow(container) {
  const graph = new FlowGraph(container, { width: 900, height: 500 });
  
  graph
    .addNode('gen1', 'SEGMENT', 100, 150, {
      label: 'Generation 1',
      description: 'Oldest generation (to be deleted)',
      data: { 'Age': 'Oldest', 'Status': 'Reclaimable' }
    })
    .addNode('gen2', 'SEGMENT', 100, 350, {
      label: 'Generation 2',
      description: 'Previous generation (retained)',
      data: { 'Age': 'Previous', 'Status': 'Retained' }
    })
    .addNode('gen3', 'OAK_STORE', 300, 250, {
      label: 'Generation 3',
      description: 'Current generation (active)',
      data: { 'Age': 'Current', 'Status': 'Active writes' }
    })
    .addNode('gc_cycle', 'CONSENSUS', 500, 150, {
      label: 'GC Cycle',
      description: 'Compaction creates new generation',
      data: { 'Creates': 'Gen N+1', 'Deletes': 'Gen N-1' }
    })
    .addNode('gen4', 'OAK_STORE', 700, 250, {
      label: 'Generation 4',
      description: 'New generation after GC',
      data: { 'Contains': 'Compacted data', 'Clean': 'Yes' }
    })
    .addNode('delete', 'TRANSACTION', 500, 350, {
      label: 'Delete Gen 1',
      description: 'Oldest generation removed',
      data: { 'Safe': 'No refs from Gen 3+', 'Files': 'TAR deleted' }
    })
    .addNode('retain', 'VALIDATOR', 700, 400, {
      label: 'Retain 2 Gens',
      description: 'Safety buffer for readers',
      data: { 'Why': 'In-flight reads', 'Config': 'Fixed at 2' }
    });
  
  graph
    .addEdge('gen1', 'gc_cycle', 'ASYNC', { label: 'mark old' })
    .addEdge('gen2', 'gen3', 'DATA', { label: 'refs' })
    .addEdge('gen3', 'gc_cycle', 'DATA', { label: 'compact' })
    .addEdge('gc_cycle', 'gen4', 'DATA', { label: 'create' })
    .addEdge('gc_cycle', 'delete', 'CONTROL', { label: 'cleanup' })
    .addEdge('delete', 'gen1', 'CONTROL', { label: 'remove' })
    .addEdge('gen2', 'retain', 'ASYNC', { label: 'keep' })
    .addEdge('gen4', 'retain', 'DATA', { label: 'new current' });
  
  return graph;
}

/**
 * Create the TAR File Cleanup graph
 * Shows how TAR files are marked and deleted
 */
function createTARCleanupFlow(container) {
  const graph = new FlowGraph(container, { width: 900, height: 450 });
  
  graph
    .addNode('tar_files', 'SEGMENT', 80, 225, {
      label: 'TAR Files',
      description: 'Segment archive files on disk',
      data: { 'Size': '256MB each', 'Format': 'data00XXXa.tar' }
    })
    .addNode('scan', 'CONSENSUS', 230, 120, {
      label: 'Scan TAR',
      description: 'Check each segment in TAR',
      data: { 'Index': 'In-TAR index', 'Graph': 'Segment refs' }
    })
    .addNode('live_segs', 'OAK_STORE', 230, 330, {
      label: 'Live Segments',
      description: 'Still referenced by current gen',
      data: { 'Keep': 'Yes', 'Rewrite': 'If partial' }
    })
    .addNode('dead_segs', 'TRANSACTION', 420, 225, {
      label: 'Dead Segments',
      description: 'Not referenced, reclaimable',
      data: { 'Action': 'Mark for delete', 'Safe': 'After GC' }
    })
    .addNode('rewrite', 'VALIDATOR', 420, 380, {
      label: 'Rewrite TAR',
      description: 'Copy live segments to new TAR',
      data: { 'When': 'Partial cleanup', 'Atomic': 'Yes' }
    })
    .addNode('mark', 'SIGNATURE', 600, 120, {
      label: 'Mark Deletable',
      description: 'TAR file marked for removal',
      data: { 'Immediate': 'No', 'Deferred': 'Yes' }
    })
    .addNode('reaper', 'CONSENSUS', 600, 330, {
      label: 'File Reaper',
      description: 'Background deletion thread',
      data: { 'Interval': 'Periodic', 'Safe': 'No open handles' }
    })
    .addNode('deleted', 'CONTENT', 780, 225, {
      label: 'Files Deleted',
      description: 'Disk space reclaimed',
      data: { 'Log': 'Removed files...', 'Metric': 'Reclaimed GB' }
    });
  
  graph
    .addEdge('tar_files', 'scan', 'DATA', { label: 'iterate' })
    .addEdge('tar_files', 'live_segs', 'DATA', { label: 'check refs' })
    .addEdge('scan', 'dead_segs', 'CONTROL', { label: 'unreachable' })
    .addEdge('live_segs', 'rewrite', 'DATA', { label: 'if partial' })
    .addEdge('dead_segs', 'mark', 'CONTROL', { label: 'empty TAR' })
    .addEdge('rewrite', 'mark', 'ASYNC', { label: 'old TAR' })
    .addEdge('mark', 'reaper', 'CONTROL', { label: 'queue' })
    .addEdge('reaper', 'deleted', 'DATA', { label: 'unlink' });
  
  return graph;
}

/**
 * Create the Consensus-Based GC flow (Oak Chain specific)
 * In Oak Chain, ALL operations go through Raft consensus - including GC!
 * There is no "offline" mode in a distributed consensus system.
 */
function createGCModesFlow(container) {
  const graph = new FlowGraph(container, { width: 950, height: 500 });
  
  // GC Proposal path (consensus-based)
  graph
    .addNode('gc_trigger', 'VALIDATOR', 80, 180, {
      label: 'Leader Triggers GC',
      description: 'Raft leader initiates GC proposal',
      data: { 'Trigger': 'Epoch-based', 'Who': 'Leader only' }
    })
    .addNode('gc_proposal', 'SIGNATURE', 230, 100, {
      label: 'GC Proposal',
      description: 'Signed proposal for compaction',
      data: { 'Type': 'COMPACT', 'Signed': 'Leader wallet' }
    })
    .addNode('debt_check', 'TRANSACTION', 230, 260, {
      label: 'GC Debt Check',
      description: 'Check entity GC debt accounts',
      data: { 'Model': 'ADR 017', 'Block': 'If over limit' }
    })
    .addNode('raft_replicate', 'CONSENSUS', 420, 180, {
      label: 'Raft Replication',
      description: 'All validators receive GC proposal',
      data: { 'Protocol': 'Aeron Raft', 'Quorum': 'Majority' }
    })
    .addNode('deterministic', 'VALIDATOR', 600, 100, {
      label: 'Deterministic Apply',
      description: 'All nodes compact identically',
      data: { 'Key': 'Same input → Same output', 'Critical': 'Yes' }
    })
    .addNode('local_compact', 'OAK_STORE', 600, 260, {
      label: 'Local Compaction',
      description: 'Each validator compacts locally',
      data: { 'Mode': 'Tail/Full', 'Parallel': 'Per-node' }
    })
    .addNode('commit', 'TRANSACTION', 780, 180, {
      label: 'Consensus Commit',
      description: 'GC committed to Raft log',
      data: { 'Index': 'Raft log index', 'Durable': 'Yes' }
    });
  
  // GC Debt Economics (bottom)
  graph
    .addNode('delete_op', 'AUTHOR', 80, 400, {
      label: 'Delete Operation',
      description: 'Content deletion creates GC debt',
      data: { 'Cost': 'Deferred', 'Paid by': 'Deleter' }
    })
    .addNode('debt_accrual', 'ETHEREUM', 280, 400, {
      label: 'Debt Accrual',
      description: 'GC cost attributed to entity',
      data: { 'Per MB': 'Configurable', 'Limit': 'Per wallet' }
    })
    .addNode('debt_payment', 'WALLET', 480, 400, {
      label: 'Debt Payment',
      description: 'ETH payment clears GC debt',
      data: { 'When': 'Before next write', 'Contract': 'ValidatorPayment' }
    })
    .addNode('writes_unblocked', 'CONTENT', 680, 400, {
      label: 'Writes Unblocked',
      description: 'Entity can write again',
      data: { 'Cleared': 'Debt < limit', 'Resume': 'Immediate' }
    });
  
  graph
    .addEdge('gc_trigger', 'gc_proposal', 'CONTROL', { label: 'create' })
    .addEdge('gc_trigger', 'debt_check', 'DATA', { label: 'check' })
    .addEdge('gc_proposal', 'raft_replicate', 'DATA', { label: 'broadcast' })
    .addEdge('debt_check', 'raft_replicate', 'ASYNC', { label: 'include' })
    .addEdge('raft_replicate', 'deterministic', 'CONTROL', { label: 'replicate' })
    .addEdge('raft_replicate', 'local_compact', 'DATA', { label: 'apply' })
    .addEdge('deterministic', 'commit', 'CONTROL', { label: 'verify' })
    .addEdge('local_compact', 'commit', 'DATA', { label: 'complete' })
    .addEdge('delete_op', 'debt_accrual', 'DATA', { label: 'incur' })
    .addEdge('debt_accrual', 'debt_payment', 'PAYMENT', { label: 'pay ETH' })
    .addEdge('debt_payment', 'writes_unblocked', 'CONTROL', { label: 'clear' });
  
  return graph;
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  FlowGraph,
  NODE_TYPES,
  EDGE_TYPES,
  createContentWriteFlow,
  createPaymentFlow,
  createIPFSFlow,
  createConsensusFlow,
  // Segment Store GC flows
  createGCOverviewFlow,
  createCompactionDetailFlow,
  createGenerationalGCFlow,
  createTARCleanupFlow,
  createGCModesFlow,
};

// Make available globally for non-module scripts
window.UnitFlows = {
  FlowGraph,
  NODE_TYPES,
  EDGE_TYPES,
  createContentWriteFlow,
  createPaymentFlow,
  createIPFSFlow,
  createConsensusFlow,
  // Segment Store GC flows
  createGCOverviewFlow,
  createCompactionDetailFlow,
  createGenerationalGCFlow,
  createTARCleanupFlow,
  createGCModesFlow,
};
