# Graph Migration Status

Status of migrating VitePress flow diagrams to EDS.

## ✅ Complete

### 1. Flow Diagram Block Infrastructure
- ✅ Block created (`blocks/flow-diagram/`)
- ✅ Animation button support
- ✅ Ethereum purple theme styling
- ✅ Responsive design
- ✅ FlowGraph class (unit-integration.js)

### 2. Core Diagrams (5/5 implemented)
- ✅ `write-mini` - Simple write flow
- ✅ `payment-mini` - Payment flow
- ✅ `ipfs-mini` - IPFS binary flow
- ✅ `consensus-mini` - Consensus flow
- ✅ `architecture` - Full system architecture

## 🔄 To Be Added

### Extended Diagrams (11 types from VitePress)

These flow types exist in VitePress but need to be added to EDS:

1. **`write`** - Detailed write flow (extended version of write-mini)
2. **`payment`** - Full payment flow
3. **`ipfs`** - Complete IPFS flow
4. **`consensus`** - Full consensus protocol
5. **`gc-overview`** - Garbage collection overview
6. **`gc-compaction`** - Segment compaction process
7. **`gc-generations`** - Generation-based GC
8. **`gc-cleanup`** - GC cleanup phase
9. **`gc-modes`** - Different GC modes comparison
10. **`aem-integration`** - AEM integration flow
11. **`binary-flow`** - Complete binary handling
12. **`validator-auth`** - Validator authentication
13. **`two-models`** - Two approaches comparison
14. **`json-to-jcr`** - JSON to JCR transformation

## How to Use (Current State)

### Markdown Syntax

**Basic diagram:**
```markdown
| Flow Diagram |
|--------------|
| architecture |
```

**With animation:**
```markdown
| Flow Diagram |
|--------------|
| write-mini | animated |
```

### Available Now

| Diagram | Purpose | Usage |
|---------|---------|-------|
| `write-mini` | Basic write flow | `\| write-mini \|` |
| `payment-mini` | Payment verification | `\| payment-mini \|` |
| `ipfs-mini` | IPFS storage | `\| ipfs-mini \|` |
| `consensus-mini` | Raft consensus | `\| consensus-mini \|` |
| `architecture` | System overview | `\| architecture \|` |

### Example Usage

```markdown
## System Architecture

| Flow Diagram |
|--------------|
| architecture | animated |

The diagram shows three layers...

## Write Flow

| Flow Diagram |
|--------------|
| write-mini |

Content flows from author to storage.
```

## Adding More Diagrams

### Step 1: Get Flow Definition from VitePress

Open `oak-chain-docs/.vitepress/theme/components/FlowGraph.vue` and find the `init[FlowName]Flow()` function.

Example for `write` flow:
```javascript
function initWriteFlow() {
  nodes.value = [
    { id: 'author', type: 'AUTHOR', x: 100, y: 150, label: 'Author' },
    { id: 'wallet', type: 'WALLET', x: 250, y: 150, label: 'Wallet' },
    // ... more nodes
  ]
  
  edges.value = [
    { from: 'author', to: 'wallet', type: 'DATA' },
    // ... more edges
  ]
}
```

### Step 2: Convert to EDS Format

Add to `blocks/flow-diagram/flow-diagram.js` in the `MINI_FLOWS` object:

```javascript
const MINI_FLOWS = {
  // ... existing flows
  
  'write': (container) => {
    const graph = new FlowGraph(container, { 
      width: 850,  // Match VitePress width
      height: 400,
      interactive: true 
    });
    
    graph
      .addNode('author', 'AUTHOR', 100, 150, { 
        label: 'Author',
        description: 'Content author in Sling'
      })
      .addNode('wallet', 'WALLET', 250, 150, { 
        label: 'Wallet',
        description: 'MetaMask wallet for signing'
      })
      // ... more nodes
      .addEdge('author', 'wallet', 'DATA')
      // ... more edges
    
    return graph;
  }
};
```

### Step 3: Test

```markdown
| Flow Diagram |
|--------------|
| write | animated |
```

### Step 4: Document

Add to `FLOW-DIAGRAM-GUIDE.md` and `BLOCKS-REFERENCE.md`.

## Priority for Adding Diagrams

Based on usage in VitePress site:

### High Priority (Used on main pages)
1. ✅ `architecture` - Home page, Architecture page
2. 🔄 `write` - How It Works page
3. 🔄 `binary-flow` - Binary storage page
4. 🔄 `consensus` - Consensus page

### Medium Priority (Used on guide pages)
5. 🔄 `aem-integration` - AEM integration guide
6. 🔄 `validator-auth` - Validator setup
7. 🔄 `gc-overview` - Segment GC page

### Low Priority (Specialized pages)
8. 🔄 `gc-compaction` - GC details
9. 🔄 `gc-generations` - GC details
10. 🔄 `gc-cleanup` - GC details
11. 🔄 `gc-modes` - GC details
12. 🔄 `two-models` - Comparison pages
13. 🔄 `json-to-jcr` - Technical deep dive

## Node Types Reference

When creating diagrams, use these node types:

```javascript
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
  TRANSACTION: { icon: '💸', color: '#4ade80' }
};
```

## Edge Types Reference

```javascript
const EDGE_TYPES = {
  DATA: { color: '#627EEA', style: 'solid', width: 2 },
  CONTROL: { color: '#8C8DFC', style: 'dashed', width: 1 },
  PAYMENT: { color: '#f0b429', style: 'solid', width: 3 },
  ASYNC: { color: '#65c2cb', style: 'dotted', width: 1 }
};
```

## Testing Workflow

1. **Add flow definition** to `flow-diagram.js`
2. **Create test page** with the new flow
3. **Run locally**: `aem up`
4. **Check**:
   - Nodes positioned correctly
   - Labels visible
   - Edges connect properly
   - Animation works (if enabled)
   - Responsive on mobile
5. **Compare** to VitePress version
6. **Adjust** coordinates/styling if needed

## Current Implementation Details

### Animation Button

When `animated` flag is set:
```markdown
| Flow Diagram |
|--------------|
| write-mini | animated |
```

The block adds:
- Purple gradient "Play Animation" button
- Calls `graph.animate()` when clicked
- Button disabled during animation
- Resets after 5 seconds

### Styling

All diagrams use Ethereum purple theme:
- Primary: #627EEA (Ethereum purple)
- Secondary: #8C8DFC (Light purple)
- Node strokes: purple borders
- Hover effects: glow
- Background: subtle purple gradients

### Responsive

- SVG scales to container width
- Minimum height: 300px
- Mobile: Centered controls, smaller buttons
- ViewBox ensures proper scaling

## Files Reference

| File | Purpose |
|------|---------|
| `blocks/flow-diagram/flow-diagram.js` | Block logic, flow definitions |
| `blocks/flow-diagram/flow-diagram.css` | Styling, animation button |
| `scripts/unit-integration.js` | FlowGraph class implementation |
| `FLOW-DIAGRAM-GUIDE.md` | Complete usage guide |
| `GRAPH-MIGRATION-STATUS.md` | This file (migration status) |

## Next Actions

### Immediate
1. ✅ Basic flow-diagram block working
2. ✅ Animation support added
3. ✅ Documentation created

### Short-term
1. Add `write` flow (high priority)
2. Add `binary-flow` (high priority)
3. Add `consensus` (high priority)
4. Test on actual content pages

### Long-term
1. Add remaining GC flows
2. Add specialized flows (two-models, json-to-jcr)
3. Create animation library for common patterns

## Summary

✅ **Infrastructure complete** - Block, animation, styling ready  
✅ **5 core diagrams** - Basic flows working  
🔄 **11 extended diagrams** - Need to be ported from VitePress  
📚 **Documentation complete** - Usage guide, API reference  

**You can start using flow diagrams now** with the 5 available types. Additional diagrams can be added incrementally as needed for content migration.

---

**Quick Start:**

```markdown
| Flow Diagram |
|--------------|
| architecture | animated |
```

**See:** FLOW-DIAGRAM-GUIDE.md for complete documentation.
