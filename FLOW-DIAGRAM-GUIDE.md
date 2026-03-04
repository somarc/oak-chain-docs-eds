# Flow Diagram Guide

Complete guide for using flow diagrams in Oak Chain EDS.

## Overview

The Flow Diagram block creates interactive SVG diagrams showing technical flows, architectures, and processes. Supports animation and multiple diagram types.

## Basic Usage

### Simple Diagram

```markdown
| Flow Diagram |
|--------------|
| architecture |
```

### Animated Diagram

```markdown
| Flow Diagram |
|--------------|
| write-flow | animated |
```

The second column `animated` adds a "Play Animation" button.

## Available Diagram Types

### Core Flows

#### 1. **write-mini**
Simple 3-node write flow: Author → Validator → Oak

**Usage:**
```markdown
| Flow Diagram |
|--------------|
| write-mini |
```

**Shows:** Basic content write path

---

#### 2. **payment-mini**
Payment flow: User → Contract → Validator

**Usage:**
```markdown
| Flow Diagram |
|--------------|
| payment-mini |
```

**Shows:** Ethereum payment verification

---

#### 3. **ipfs-mini**
IPFS binary flow: Binary → IPFS → Oak CID

**Usage:**
```markdown
| Flow Diagram |
|--------------|
| ipfs-mini |
```

**Shows:** Binary storage with IPFS

---

#### 4. **consensus-mini**
Consensus flow: Follower → Candidate → Leader

**Usage:**
```markdown
| Flow Diagram |
|--------------|
| consensus-mini |
```

**Shows:** Raft consensus election

---

#### 5. **architecture**
Full system architecture with all layers

**Usage:**
```markdown
| Flow Diagram |
|--------------|
| architecture | animated |
```

**Shows:**
- Authoring layer (Sling, MetaMask)
- Storage layer (Validators, IPFS)
- Delivery layer (Edge Delivery)

---

### Extended Flows (To Be Added)

Based on VitePress site, these additional flows can be added:

- `write-flow` - Detailed write flow
- `read-flow` - Content read flow
- `binary-flow` - Complete binary handling
- `validator-auth` - Validator authentication
- `consensus-full` - Full consensus protocol
- `gc-overview` - Garbage collection overview
- `gc-compaction` - Segment compaction
- `gc-generations` - Generation-based GC
- `aem-integration` - AEM integration flow
- `two-models` - Comparison of two approaches
- `json-to-jcr` - JSON to JCR transformation

## Animation

Add `animated` as second column to enable animation:

```markdown
| Flow Diagram |
|--------------|
| architecture | animated |
```

This adds a "Play Animation" button that:
- Animates data flow through the diagram
- Shows packets moving along edges
- Highlights nodes as data passes through

## Node Types

Diagrams use these node types (with icons):

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| USER | 👤 | Purple | End user |
| WALLET | 👛 | Yellow | Ethereum wallet |
| AUTHOR | ✍️ | Purple | Content author |
| VALIDATOR | ⚡ | Green | Validator node |
| CONSENSUS | 🔄 | Purple | Consensus mechanism |
| OAK_STORE | 🌳 | Green | Oak segment store |
| ETHEREUM | ⟠ | Purple | Ethereum blockchain |
| CONTRACT | 📜 | Red | Smart contract |
| IPFS | 🌐 | Cyan | IPFS storage |
| CONTENT | 📄 | White | Content data |
| SIGNATURE | 🔐 | Yellow | Cryptographic signature |

## Edge Types

Connections between nodes:

| Type | Color | Style | Description |
|------|-------|-------|-------------|
| DATA | Purple | Solid | Data flow |
| CONTROL | Light Purple | Dashed | Control flow |
| PAYMENT | Yellow | Solid (thick) | Payment flow |
| ASYNC | Cyan | Dotted | Async operation |

## Creating Custom Diagrams

To add a new diagram type, edit `blocks/flow-diagram/flow-diagram.js`:

```javascript
const MINI_FLOWS = {
  'my-custom-flow': (container) => {
    const graph = new FlowGraph(container, { 
      width: 600, 
      height: 300,
      interactive: true 
    });
    
    graph
      .addNode('node1', 'USER', 50, 150, { 
        label: 'Start',
        description: 'Starting point'
      })
      .addNode('node2', 'VALIDATOR', 300, 150, { 
        label: 'Process',
        description: 'Processing step'
      })
      .addNode('node3', 'OAK_STORE', 550, 150, { 
        label: 'End',
        description: 'Final destination'
      })
      .addEdge('node1', 'node2', 'DATA')
      .addEdge('node2', 'node3', 'DATA');
    
    return graph;
  }
};
```

Then use in markdown:
```markdown
| Flow Diagram |
|--------------|
| my-custom-flow |
```

## FlowGraph API

### Constructor

```javascript
new FlowGraph(container, options)
```

**Options:**
- `width` - SVG width (default: 800)
- `height` - SVG height (default: 500)
- `interactive` - Enable hover/click (default: true)
- `animated` - Enable animations (default: true)

### Methods

#### addNode(id, type, x, y, props)

Add a node to the diagram.

**Parameters:**
- `id` - Unique node identifier
- `type` - Node type (e.g., 'USER', 'VALIDATOR')
- `x` - X coordinate
- `y` - Y coordinate
- `props` - Additional properties:
  - `label` - Display label
  - `description` - Hover description
  - `radius` - Node size (default: 30)

**Returns:** FlowGraph instance (chainable)

**Example:**
```javascript
graph.addNode('author', 'AUTHOR', 100, 150, {
  label: 'Content Author',
  description: 'Creates content in Sling',
  radius: 35
})
```

#### addEdge(from, to, type, props)

Add an edge (connection) between nodes.

**Parameters:**
- `from` - Source node ID
- `to` - Target node ID
- `type` - Edge type ('DATA', 'CONTROL', 'PAYMENT', 'ASYNC')
- `props` - Additional properties:
  - `label` - Edge label text
  - `width` - Line width override

**Returns:** FlowGraph instance (chainable)

**Example:**
```javascript
graph.addEdge('author', 'validator', 'DATA', {
  label: 'Submit content'
})
```

#### animate()

Start the animation (if enabled).

**Example:**
```javascript
graph.animate();
```

## Example: Complete Write Flow

```markdown
## Write Flow

| Flow Diagram |
|--------------|
| write-flow | animated |

### How It Works

1. **Author creates** content in Sling
2. **Signs with wallet** (MetaMask)
3. **Pays gas** (Ethereum transaction)
4. **Validator verifies** blockchain receipt
5. **Cluster replicates** via Raft consensus
6. **Content persists** in Oak segment store
```

## Example: Architecture Overview

```markdown
## System Architecture

| Flow Diagram |
|--------------|
| architecture | animated |

The diagram shows the three layers of Oak Chain:
- **Authoring**: Sling + MetaMask
- **Storage**: Validator cluster + IPFS
- **Delivery**: Edge Delivery Services
```

## Styling

Diagrams inherit the Ethereum purple theme:
- Primary color: #627EEA
- Secondary: #8C8DFC
- Nodes/edges use theme colors
- Hover effects with glow
- Smooth animations

## Responsive Design

- Diagrams scale to container width
- Minimum height: 300px
- Mobile: Controls centered, smaller buttons
- SVG viewBox ensures scalability

## Best Practices

### 1. Choose the Right Diagram Type

- **Simple flow** → Use `*-mini` variants
- **Full system** → Use `architecture`
- **Specific process** → Use dedicated flow type

### 2. Use Animation Sparingly

Only add `animated` when:
- The animation adds understanding
- The page has few diagrams (1-2)
- The flow is complex and benefits from sequential visualization

### 3. Add Context

Always add text before/after diagrams explaining what they show:

```markdown
The write flow shows how content moves from author to storage:

| Flow Diagram |
|--------------|
| write-flow | animated |

Each step is verified on Ethereum before proceeding.
```

### 4. Test on Mobile

- View on mobile devices
- Ensure text is readable
- Check button sizes

## Troubleshooting

### Diagram Not Showing

**Cause:** Unknown flow type

**Solution:** Check spelling of flow type name:
```markdown
| Flow Diagram |
|--------------|
| architechture |  ← Wrong!
| architecture |   ← Correct
```

### Animation Not Working

**Cause:** Missing `animated` flag

**Solution:** Add second column:
```markdown
| Flow Diagram |
|--------------|
| write-flow | animated |
```

### Nodes Overlapping

**Cause:** Coordinates too close

**Solution:** Edit flow definition in `flow-diagram.js` and adjust X/Y coordinates

### Colors Wrong

**Cause:** Node type doesn't exist

**Solution:** Use valid node type from list above, or add new type to `NODE_TYPES`

## Migration from VitePress

VitePress uses `<FlowGraph flow="write" />` component.

**Convert to EDS:**

```markdown
<!-- VitePress -->
<FlowGraph flow="write" :height="400" />

<!-- EDS -->
| Flow Diagram |
|--------------|
| write-flow |
```

**With animation:**

```markdown
<!-- VitePress -->
<FlowGraph flow="write" :height="400" interactive />

<!-- EDS -->
| Flow Diagram |
|--------------|
| write-flow | animated |
```

## Quick Reference

```markdown
# Basic
| Flow Diagram |
|--------------|
| architecture |

# With animation
| Flow Diagram |
|--------------|
| write-flow | animated |

# Available types:
- write-mini
- payment-mini
- ipfs-mini
- consensus-mini
- architecture
```

---

**See also:**
- BLOCKS-REFERENCE.md - All blocks
- CONTENT-STRUCTURE-GUIDE.md - Page layouts
- unit-integration.js - FlowGraph implementation
