# Oak Chain Docs EDS - Complete Block System

Documentation site blocks and styling summary for `oak-chain-docs-eds`.

## Project Clarification

**Two EDS Projects:**

1. **`blockchain-aem-eds`** - Twitter-like frontend client for Blockchain AEM
2. **`oak-chain-docs-eds`** - Public documentation site (THIS PROJECT)
   - Migrating from: `oak-chain-docs` (VitePress)
   - Destination: EDS with same visual styling

## Complete Block Inventory

| Block | Purpose | Status | Location |
|-------|---------|--------|----------|
| **Hero** | Hero sections with gradient text | ✅ Exists | `blocks/hero/` |
| **Cards** | Feature cards grid | ✅ Exists | `blocks/cards/` |
| **Narration** | AI narration with audio player | ✅ Exists | `blocks/narration/` |
| **Header** | Site header/navigation | ✅ Exists | `blocks/header/` |
| **Footer** | Site footer | ✅ Exists | `blocks/footer/` |
| **Columns** | Multi-column layout | ✅ Exists | `blocks/columns/` |
| **Fragment** | Content fragments | ✅ Exists | `blocks/fragment/` |
| **Axiom Grid** | Two-column axiom layout | ✅ Added | `blocks/axiom-grid/` |
| **Comparison Table** | Side-by-side comparisons | ✅ Added | `blocks/comparison-table/` |
| **Section Highlight** | Emphasized sections | ✅ Added | `blocks/section-highlight/` |
| **Flow Diagram** | Interactive flow diagrams | ✅ Added | `blocks/flow-diagram/` |

## Styling

### Theme
- ✅ Ethereum purple theme (#627EEA, #8C8DFC)
- ✅ Dark mode (#0f0f23 background)
- ✅ Purple gradients and glows
- ✅ Matches VitePress oak-chain-docs exactly

### Global Styles
**Location:** `styles/styles.css`

Already configured with:
- Ethereum purple colors
- Roboto fonts
- Boilerplate structure
- Responsive breakpoints

## Documentation Files (Copied)

| File | Purpose |
|------|---------|
| **CONTENT-STRUCTURE-GUIDE.md** | Page breakdown examples |
| **BLOCKS-REFERENCE.md** | Quick reference for all blocks |
| **FLOW-DIAGRAM-GUIDE.md** | Flow diagram usage |
| **GRAPH-MIGRATION-STATUS.md** | Flow migration status |
| **BLOCKS-COMPLETE-SUMMARY.md** | Complete summary |
| **EDS-MIGRATION-GUIDE.md** | Migration process |
| **THEMING-GUIDE.md** | Color palette guide |

## Key Usage Examples

### Home Page

```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) |

---

| Cards |
|-------|
| 🔐 | **Same Oak, New Ownership** JCR API, Sling patterns, TAR segments. |
| 💰 | **Pay to Publish** No access control lists. Pay ETH, get writes. |
| ♾️ | **Replicated Forever** Raft consensus across validators. |

---

| Axiom Grid |
|------------|
| ### Axiom 1: Ethereum Is Physics<br><br>When BlackRock puts billions into BUIDL... |
| ### Axiom 2: Oak Is Entrenched<br><br>Jackrabbit Oak already stores... |

---

| Comparison Table |
|------------------|
| **What You Know** \| **What's New** |
| Same JCR API \| Wallet = namespace |
| Same Sling patterns \| ETH payments = authorization |

---

| Flow Diagram |
|--------------|
| architecture | animated |
```

### Thesis Page

```markdown
# The Thesis

| Narration |
|-----------|
| AI narration sample text |

## Axiom 1: Ethereum Is Physics

Content...

| Section Highlight |
|-------------------|
| > This project treats Ethereum's dominance as physics, not opinion. |

## The Evidence

More content...
```

## Block Comparison: Existing vs New

### Cards Block (Existing)
The existing cards block is more sophisticated:
- Uses `<ul><li>` structure
- Separate card-image and card-body divs
- Clickable card support with overlay links
- Icon sizing (64x64px)

**Keep the existing one** - it's better structured.

### Narration Block (Existing)
The existing narration block has:
- Audio player support
- Transcript links
- Metadata badges
- Complex gradient backgrounds

**Keep the existing one** - it's production-ready.

### Hero Block (Existing)
The existing hero is more advanced:
- Two-column layout (text + logo)
- Logo with glow effects
- More sophisticated responsive design

**Keep the existing one** - matches the site better.

## What Was Added (New Blocks)

The new blocks fill gaps for content migration:

1. **Axiom Grid** - Two-column layout for principles/axioms
2. **Comparison Table** - Side-by-side comparison tables
3. **Section Highlight** - Highlighted quote/callout sections
4. **Flow Diagram** - Interactive diagrams with animation

These complement the existing blocks.

## File Structure

```
oak-chain-docs-eds/
├── blocks/
│   ├── hero/              ✅ Existing (keep)
│   ├── cards/             ✅ Existing (keep)
│   ├── narration/         ✅ Existing (keep)
│   ├── header/            ✅ Existing (keep)
│   ├── footer/            ✅ Existing (keep)
│   ├── columns/           ✅ Existing (keep)
│   ├── fragment/          ✅ Existing (keep)
│   ├── axiom-grid/        🆕 Added
│   ├── comparison-table/  🆕 Added
│   ├── section-highlight/ 🆕 Added
│   └── flow-diagram/      🆕 Added
├── scripts/
│   ├── aem.js
│   ├── scripts.js
│   └── unit-integration.js  🆕 Added (for flow diagrams)
├── styles/
│   └── styles.css         ✅ Already has purple theme
└── [Documentation files]  🆕 All added
```

## Quick Start

### 1. Local Development
```bash
cd oak-chain-docs-eds
aem up
```

Site runs at `http://localhost:3000`

### 2. Use Existing Blocks

The existing blocks already work:
- Hero (with logo support)
- Cards (sophisticated card grid)
- Narration (with audio player)
- Header/Footer

### 3. Use New Blocks

New blocks for content migration:
- Axiom Grid (two-column principles)
- Comparison Table (side-by-side)
- Section Highlight (emphasized sections)
- Flow Diagram (interactive diagrams)

### 4. Check Documentation

Open **CONTENT-STRUCTURE-GUIDE.md** for complete examples.

## Next Steps

### Content Migration Priority

1. **Home page** (`index.md`)
   - Use existing Hero block
   - Use existing Cards block
   - Use new Axiom Grid
   - Use new Comparison Table
   - Use new Flow Diagram

2. **Thesis page** (`thesis.md`)
   - Regular markdown (h2, h3, p)
   - Use new Section Highlight for quotes
   - Optional: Narration block

3. **Other pages**
   - How It Works - needs Flow Diagram
   - Architecture - needs Flow Diagram
   - Guide pages - standard markdown

### Testing

1. Create content in Document Authoring
2. Test locally with all blocks
3. Verify purple theme matches VitePress
4. Check responsive design
5. Deploy to preview

## Documentation Reference

All guides are now in `oak-chain-docs-eds/`:

- **START HERE:** `CONTENT-STRUCTURE-GUIDE.md`
- **Block reference:** `BLOCKS-REFERENCE.md`
- **Flow diagrams:** `FLOW-DIAGRAM-GUIDE.md`
- **Migration:** `EDS-MIGRATION-GUIDE.md`
- **Styling:** `THEMING-GUIDE.md`

## Key Differences: oak-chain-docs-eds vs blockchain-aem-eds

| Aspect | oak-chain-docs-eds | blockchain-aem-eds |
|--------|-------------------|-------------------|
| **Purpose** | Public documentation | Twitter-like client |
| **Audience** | Developers, operators | End users |
| **Content** | Docs, guides, ADRs | Social feed, content viewer |
| **Blocks** | Documentation-focused | Application-focused |
| **Styling** | Same purple theme | Same purple theme |

Both use Ethereum purple theme, but different block types for different purposes.

## Summary

✅ **All blocks ready** - 11 total blocks (7 existing + 4 new)  
✅ **Styling complete** - Ethereum purple theme already configured  
✅ **Documentation complete** - 7 guides copied  
✅ **Flow diagrams ready** - unit-integration.js copied  
✅ **Ready for migration** - Start with CONTENT-STRUCTURE-GUIDE.md  

**The oak-chain-docs-eds project is now fully equipped for migrating content from the VitePress site!** 🚀
