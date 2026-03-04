# Oak Chain Docs EDS - Quick Start Guide

Fast-track guide for migrating VitePress content to EDS.

## Project Setup

### Two Separate Projects

- **`oak-chain-docs`** (VitePress) → Source content
- **`oak-chain-docs-eds`** (EDS) → Destination (THIS PROJECT)
- **`blockchain-aem-eds`** → Different project (Twitter-like client)

### Local Development

```bash
cd oak-chain-docs-eds
aem up
```

Site runs at `http://localhost:3000`

## Available Blocks (11 Total)

### Core Blocks (Already Existed)

1. **Hero** - Hero section with logo
2. **Cards** - Feature cards with icons
3. **Narration** - AI narration with audio
4. **Header** - Site navigation
5. **Footer** - Site footer
6. **Columns** - Multi-column layouts
7. **Fragment** - Content fragments

### New Blocks (Just Added)

8. **Axiom Grid** - Two-column axiom layout
9. **Comparison Table** - Side-by-side comparisons
10. **Section Highlight** - Emphasized sections
11. **Flow Diagram** - Interactive flow diagrams

## Common Block Patterns

### Hero (Home Page)

```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) [Run a Validator](/operators) |
| ![Logo](./path-to-logo.svg) |
```

**Renders:**
- Gradient "Oak Chain" title
- Large white subtitle
- Description text
- Action buttons
- Logo on the right (desktop) or top (mobile)

### Cards (Feature Grid)

```markdown
| Cards (clickable) |
|-------------------|
| 🔐 | **Same Oak, New Ownership** JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace. |
| 💰 | **Pay to Publish** No access control lists. No admin approvals. Pay ETH, get writes. Economic security replaces bureaucratic security. |
| ♾️ | **Replicated Forever** Raft consensus across validators. Your content survives any single company, server, or jurisdiction. |
```

**Format:** `Icon | Content`

**Note:** Add `(clickable)` after block name to make entire cards clickable.

### Axiom Grid (Two Axioms)

```markdown
| Axiom Grid |
|------------|
| ### Axiom 1: Ethereum Is Physics<br><br>When BlackRock puts billions into BUIDL, when Visa settles USDC directly... **This project treats Ethereum's dominance as physics, not opinion.** |
| ### Axiom 2: Oak Is Entrenched<br><br>Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences... **We don't replace it. We upgrade it into something planetary.** |
```

**Format:** Each row = one axiom card

### Comparison Table (The Bridge)

```markdown
| Comparison Table |
|------------------|
| **What You Know** \| **What's New** |
| Same JCR API \| Wallet = namespace |
| Same Sling patterns \| ETH payments = authorization |
| Same TAR segments \| Raft consensus = replication |
| Same content model \| Validators = decentralized storage |
```

**Format:** Use `\|` to separate table columns

### Narration (AI Callout)

```markdown
| Narration |
|-----------|
| This is sample text for AI narration from a narration block in Edge Delivery. This is a test. |
```

**Features:** Audio player support, gradient background, badges

### Section Highlight (Emphasized Content)

```markdown
| Section Highlight |
|-------------------|
| > This project treats Ethereum's dominance as physics, not opinion. |
```

**Use for:** Important quotes, key points

### Flow Diagram (Interactive)

```markdown
| Flow Diagram |
|--------------|
| architecture | animated |
```

**Available diagrams:**
- `write-mini`
- `payment-mini`
- `ipfs-mini`
- `consensus-mini`
- `architecture`

Add `| animated |` for animation button.

## Complete Home Page Example

```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) [Run a Validator](/operators) |
| ![Oak Chain Logo](./media_1675440367a5896d1811c279961d1ca5693ad0f92.svg) |

---

| Cards (clickable) |
|-------------------|
| 🔐 | **Same Oak, New Ownership** JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace. /architecture |
| 💰 | **Pay to Publish** No access control lists. No admin approvals. Pay ETH, get writes. Economic security replaces bureaucratic security. /guide/economics |
| ♾️ | **Replicated Forever** Raft consensus across validators. Your content survives any single company, server, or jurisdiction. /guide/consensus |
| 🌳 | **Enterprise-Grade Storage** Oak's proven segment store. Immutable TAR files, append-only journal, cryptographic checksums. /architecture |
| 📦 | **IPFS Binaries** Content-addressed binaries. Validators store CIDs, authors own storage. Global availability. /guide/binaries |
| 🔄 | **Real-Time Streaming** Server-Sent Events for content discovery. Subscribe to the live feed of all writes. /guide/streaming |

---

## The Two Axioms

| Axiom Grid |
|------------|
| ### Axiom 1: Ethereum Is Physics<br><br>When BlackRock puts billions into BUIDL, when Visa settles USDC directly, when JPMorgan routes Onyx through Ethereum rails: these aren't bets. They're irreversible commitments.<br><br>**This project treats Ethereum's dominance as physics, not opinion.** |
| ### Axiom 2: Oak Is Entrenched<br><br>Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences. Fortune 500 commerce. Healthcare records. Government services. Financial portals.<br><br>**We don't replace it. We upgrade it into something planetary.** |

[Read the full thesis →](/thesis)

---

## The Bridge

Oak Chain brings Ethereum's economic finality to Oak's content model.

| Comparison Table |
|------------------|
| **What You Know** \| **What's New** |
| Same JCR API \| Wallet = namespace |
| Same Sling patterns \| ETH payments = authorization |
| Same TAR segments \| Raft consensus = replication |
| Same content model \| Validators = decentralized storage |

---

## Interactive Architecture

| Flow Diagram |
|--------------|
| architecture | animated |

[See all interactive flows →](/how-it-works)

---

## The Model

1. **Author signs** content with Ethereum wallet
2. **Author pays** via smart contract (ETH)
3. **Leader validates** payment on Ethereum
4. **Cluster replicates** via Raft consensus
5. **Content persists** in Oak segment store
6. **Binaries stored** in IPFS (CID in Oak)

Every write is cryptographically signed, economically backed, and replicated.

---

## Quick Links

- [**The Thesis**](/thesis) - Why this exists
- [**How It Works**](/how-it-works) - Technical flows
- [**Architecture**](/architecture) - The five layers
- [**Developer Guide**](/guide/) - Build on Oak Chain
- [**Run a Validator**](/operators/) - Join the network and earn
```

## Clickable Cards Pattern

To make cards clickable, add `(clickable)` to block name and include link at end:

```markdown
| Cards (clickable) |
|-------------------|
| Icon | **Title** Description text /link-path |
```

The existing cards block automatically:
- Extracts the link
- Makes entire card clickable
- Removes link text from visible content
- Adds hover effects

## Testing Workflow

1. **Create test page** with all blocks
2. **Run locally:** `aem up`
3. **Check browser:** `http://localhost:3000/test-page`
4. **Verify:**
   - Layout matches VitePress
   - Colors are correct (purple theme)
   - Hover effects work
   - Mobile responsive
   - Animations work (flow diagrams)

## Deploy

```bash
git add .
git commit -m "Add content migration"
git push
```

EDS auto-publishes on push.

## Documentation

### Essential Reading (Priority Order)

1. **QUICK-START.md** ← You are here
2. **CONTENT-STRUCTURE-GUIDE.md** - Complete page examples
3. **BLOCKS-REFERENCE.md** - All blocks reference
4. **FLOW-DIAGRAM-GUIDE.md** - Flow diagram details
5. **EDS-MIGRATION-GUIDE.md** - Deep dive on EDS
6. **THEMING-GUIDE.md** - Styling details

### Quick Reference

| Need | Read |
|------|------|
| How to structure a page | CONTENT-STRUCTURE-GUIDE.md |
| Block syntax | BLOCKS-REFERENCE.md |
| Flow diagrams | FLOW-DIAGRAM-GUIDE.md |
| Colors/styling | THEMING-GUIDE.md |
| EDS concepts | EDS-MIGRATION-GUIDE.md |

## Common Questions

### Q: How do I add a new page?

Create a markdown file with blocks:
```markdown
# Page Title

Content here...

| Block Name |
|------------|
| Content |
```

### Q: How do I make cards clickable?

Add `(clickable)` to block name:
```markdown
| Cards (clickable) |
|-------------------|
| Icon | Content /link |
```

### Q: How do I add animation to flow diagram?

Add `animated` as second column:
```markdown
| Flow Diagram |
|--------------|
| architecture | animated |
```

### Q: Can I use regular markdown?

Yes! Only use blocks when you need special styling. Regular markdown (headings, paragraphs, lists, blockquotes) works normally.

### Q: How do I preview changes?

Run `aem up` and visit `http://localhost:3000/your-page`

## File Locations

```
oak-chain-docs-eds/
├── blocks/              ← All blocks here
├── scripts/
│   └── unit-integration.js  ← Flow diagram engine
├── styles/
│   └── styles.css       ← Global styling (purple theme)
└── [Docs]               ← All guides here
```

## Next Actions

1. ✅ **Blocks ready** - 11 blocks available
2. ✅ **Styling ready** - Purple theme configured
3. ✅ **Docs ready** - 7 guides available
4. 🔄 **Create content** - Use CONTENT-STRUCTURE-GUIDE.md
5. 🔄 **Test locally** - Run aem up
6. 🔄 **Deploy** - Push to GitHub

## Support

- **Block not working?** → Check BLOCKS-REFERENCE.md
- **Layout wrong?** → Check CONTENT-STRUCTURE-GUIDE.md
- **Colors wrong?** → Check THEMING-GUIDE.md
- **Flow diagram issues?** → Check FLOW-DIAGRAM-GUIDE.md

---

**START HERE:** Open `CONTENT-STRUCTURE-GUIDE.md` and copy the home page example to begin your migration! 🚀
