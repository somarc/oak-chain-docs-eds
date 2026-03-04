/**
 * Flow Diagram Block
 * 
 * Interactive flow diagrams for Oak Chain documentation.
 * Supports multiple diagram types with optional animation.
 * 
 * Usage in markdown:
 * | Flow Diagram |
 * |--------------|
 * | architecture |
 * 
 * Or with animation:
 * | Flow Diagram |
 * |--------------|
 * | write-flow | animated |
 */

import { FlowGraph, NODE_TYPES } from '../../scripts/unit-integration.js';

/**
 * Mini flow diagrams for embedding in cards/sections
 */
const MINI_FLOWS = {
  'write-mini': (container) => {
    const graph = new FlowGraph(container, { 
      width: 400, 
      height: 200,
      interactive: false 
    });
    
    graph
      .addNode('author', 'AUTHOR', 50, 100, { label: 'Author', radius: 20 })
      .addNode('validator', 'VALIDATOR', 200, 100, { label: 'Validator', radius: 20 })
      .addNode('oak', 'OAK_STORE', 350, 100, { label: 'Oak', radius: 20 })
      .addEdge('author', 'validator', 'DATA')
      .addEdge('validator', 'oak', 'DATA');
    
    return graph;
  },
  
  'payment-mini': (container) => {
    const graph = new FlowGraph(container, { 
      width: 400, 
      height: 200,
      interactive: false 
    });
    
    graph
      .addNode('user', 'USER', 50, 100, { label: 'User', radius: 20 })
      .addNode('contract', 'CONTRACT', 200, 100, { label: 'Contract', radius: 20 })
      .addNode('validator', 'VALIDATOR', 350, 100, { label: 'Validator', radius: 20 })
      .addEdge('user', 'contract', 'PAYMENT')
      .addEdge('contract', 'validator', 'DATA');
    
    return graph;
  },
  
  'ipfs-mini': (container) => {
    const graph = new FlowGraph(container, { 
      width: 400, 
      height: 200,
      interactive: false 
    });
    
    graph
      .addNode('binary', 'CONTENT', 50, 100, { label: 'Binary', radius: 20 })
      .addNode('ipfs', 'IPFS', 200, 100, { label: 'IPFS', radius: 20 })
      .addNode('oak', 'OAK_STORE', 350, 100, { label: 'Oak CID', radius: 20 })
      .addEdge('binary', 'ipfs', 'DATA')
      .addEdge('ipfs', 'oak', 'DATA');
    
    return graph;
  },
  
  'consensus-mini': (container) => {
    const graph = new FlowGraph(container, { 
      width: 400, 
      height: 200,
      interactive: false 
    });
    
    graph
      .addNode('follower', 'VALIDATOR', 50, 100, { label: 'Follower', radius: 20 })
      .addNode('candidate', 'CONSENSUS', 200, 100, { label: 'Candidate', radius: 20 })
      .addNode('leader', 'VALIDATOR', 350, 100, { label: 'Leader', radius: 20 })
      .addEdge('follower', 'candidate', 'CONTROL')
      .addEdge('candidate', 'leader', 'CONTROL');
    
    return graph;
  },
  
  'architecture': (container) => {
    const graph = new FlowGraph(container, { 
      width: 700, 
      height: 350,
      interactive: true 
    });
    
    // Three-layer architecture
    graph
      // Authoring layer
      .addNode('sling', 'AUTHOR', 100, 80, { 
        label: 'Sling Author',
        description: 'Content authoring via JCR API'
      })
      .addNode('metamask', 'WALLET', 250, 80, { 
        label: 'MetaMask',
        description: 'Wallet for signing & payment'
      })
      
      // Storage layer
      .addNode('validator1', 'VALIDATOR', 100, 200, { 
        label: 'Validator 1',
        description: 'Raft consensus node'
      })
      .addNode('validator2', 'VALIDATOR', 250, 200, { 
        label: 'Validator 2',
        description: 'Raft consensus node'
      })
      .addNode('validator3', 'VALIDATOR', 400, 200, { 
        label: 'Validator 3',
        description: 'Raft consensus node'
      })
      .addNode('ipfs', 'IPFS', 550, 200, { 
        label: 'IPFS',
        description: 'Binary storage'
      })
      
      // Delivery layer
      .addNode('eds', 'CONTENT', 250, 300, { 
        label: 'Edge Delivery',
        description: 'CDN delivery layer'
      })
      
      // Edges
      .addEdge('sling', 'validator1', 'DATA')
      .addEdge('metamask', 'validator2', 'PAYMENT')
      .addEdge('validator1', 'validator2', 'CONTROL')
      .addEdge('validator2', 'validator3', 'CONTROL')
      .addEdge('validator3', 'ipfs', 'ASYNC')
      .addEdge('validator2', 'eds', 'DATA');
    
    return graph;
  }
};

/**
 * Decorate flow diagram blocks
 */
export default function decorate(block) {
  // Get flow type from block content
  const rows = [...block.children];
  let flowType = 'architecture';
  let animated = false;
  
  if (rows.length > 0) {
    const cells = [...rows[0].children];
    if (cells.length > 0) {
      flowType = cells[0].textContent.trim().toLowerCase();
    }
    if (cells.length > 1) {
      animated = cells[1].textContent.trim().toLowerCase() === 'animated';
    }
  }
  
  // Clear existing content
  block.innerHTML = '';
  
  // Add animation button if specified
  if (animated) {
    const controls = document.createElement('div');
    controls.className = 'flow-controls';
    
    const playButton = document.createElement('button');
    playButton.className = 'play-animation-btn';
    playButton.innerHTML = '▶ Play Animation';
    playButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (block.flowGraph && block.flowGraph.animate) {
        playButton.disabled = true;
        playButton.innerHTML = '⏸ Playing...';
        block.flowGraph.animate();
        setTimeout(() => {
          playButton.disabled = false;
          playButton.innerHTML = '▶ Play Animation';
        }, 5000); // Reset after 5 seconds
      }
    });
    
    controls.appendChild(playButton);
    block.appendChild(controls);
  }
  
  // Create diagram container
  const diagramContainer = document.createElement('div');
  diagramContainer.className = 'flow-diagram-container';
  block.appendChild(diagramContainer);
  
  // Get flow creator
  const flowCreator = MINI_FLOWS[flowType] || MINI_FLOWS['architecture'];
  
  // Create the flow
  const graph = flowCreator(diagramContainer);
  
  // Store reference for potential animation
  block.flowGraph = graph;
  
  // Add hint if not on flows page
  if (window.location.pathname !== '/flows' && window.location.pathname !== '/flows/') {
    const hint = document.createElement('div');
    hint.className = 'flow-hint';
    hint.textContent = 'Interactive diagram';
    diagramContainer.appendChild(hint);
  }
}

// Auto-initialize any flow-diagram elements on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.flow-diagram').forEach(block => {
    decorate(block);
  });
});
