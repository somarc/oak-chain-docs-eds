# Content Structure Guide - VitePress to EDS Blocks

Complete guide for breaking down Oak Chain pages into EDS blocks.

## Block Inventory

### Available Blocks

| Block Name | Purpose | File Location |
|------------|---------|---------------|
| `hero` | Hero sections with gradient text | `blocks/hero/` |
| `cards` | Feature cards grid (2-6 cards) | `blocks/cards/` |
| `axiom-grid` | Two-column axiom layout | `blocks/axiom-grid/` |
| `comparison-table` | Side-by-side comparison tables | `blocks/comparison-table/` |
| `narration` | AI narration callouts | `blocks/narration/` |
| `section-highlight` | Highlighted content sections | `blocks/section-highlight/` |
| `flow-diagram` | Interactive diagrams | `blocks/flow-diagram/` |

---

## Home Page (`index.md`)

### Structure Breakdown

#### 1. Hero Section
```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) [Run a Validator](/operators) |
```

#### 2. Feature Cards (6 cards)
```markdown
| Cards |
|-------|
| 🔐 | **Same Oak, New Ownership**<br><br>JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace. |
| 💰 | **Pay to Publish**<br><br>No access control lists. No admin approvals. Pay ETH, get writes. Economic security replaces bureaucratic security. |
| ♾️ | **Replicated Forever**<br><br>Raft consensus across validators. Your content survives any single company, server, or jurisdiction. |
| 🌳 | **Enterprise-Grade Storage**<br><br>Oak's proven segment store. Immutable TAR files, append-only journal, cryptographic checksums. |
| 📦 | **IPFS Binaries**<br><br>Content-addressed binaries. Validators store CIDs, authors own storage. Global availability. |
| 🔄 | **Real-Time Streaming**<br><br>Server-Sent Events for content discovery. Subscribe to the live feed of all writes. |
```

**Note:** Two-column markdown table - first column is icon, second is content.

#### 3. Section: "The Two Axioms"
```markdown
## The Two Axioms

| Axiom Grid |
|------------|
| ### Axiom 1: Ethereum Is Physics<br><br>When BlackRock puts billions into BUIDL, when Visa settles USDC directly, when JPMorgan routes Onyx through Ethereum rails: these aren't bets. They're irreversible commitments.<br><br>**This project treats Ethereum's dominance as physics, not opinion.** |
| ### Axiom 2: Oak Is Entrenched<br><br>Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences. Fortune 500 commerce. Healthcare records. Government services. Financial portals.<br><br>**We don't replace it. We upgrade it into something planetary.** |
```

#### 4. Section: "The Bridge"
```markdown
## The Bridge

Oak Chain brings Ethereum's economic finality to Oak's content model.

| Comparison Table |
|------------------|
| **What You Know** \| **What's New** |
| Same JCR API \| Wallet = namespace |
| Same Sling patterns \| ETH payments = authorization |
| Same TAR segments \| Raft consensus = replication |
| Same content model \| Validators = decentralized storage |
```

**Note:** Use `|` to separate columns in the markdown table.

#### 5. Interactive Architecture
```markdown
## Interactive Architecture

| Flow Diagram |
|--------------|
| architecture |
```

**Note:** The `architecture` value tells the flow-diagram block which diagram to show.

#### 6. The Model (Regular Markdown)
```markdown
## The Model

1. **Author signs** content with Ethereum wallet
2. **Author pays** via smart contract (ETH)
3. **Leader validates** payment on Ethereum
4. **Cluster replicates** via Raft consensus
5. **Content persists** in Oak segment store
6. **Binaries stored** in IPFS (CID in Oak)

Every write is cryptographically signed, economically backed, and replicated.
```

#### 7. Quick Links (Regular Markdown)
```markdown
## Quick Links

- [**The Thesis**](/thesis) - Why this exists
- [**How It Works**](/how-it-works) - Technical flows
- [**Architecture**](/architecture) - The five layers
- [**Developer Guide**](/guide/) - Build on Oak Chain
- [**Run a Validator**](/operators/) - Join the network and earn
```

---

## Thesis Page (`thesis.md`)

### Structure Breakdown

#### 1. Hero/Title
```markdown
# The Thesis

Oak Chain is built on two axioms. If you accept them, everything else follows.
```

#### 2. Optional Narration
```markdown
| Narration |
|-----------|
| This is sample text for AI narration from a narration block in Edge Delivery. This is a test. |
```

#### 3. Axiom 1 Section
```markdown
## Axiom 1: Ethereum Is Physics

Ethereum is economic finality encoded as code.

When BlackRock puts billions into BUIDL, when Visa settles USDC transactions directly, when JPMorgan routes Onyx payments through Ethereum rails: these are not bets. These are irreversible commitments.

This is not "blockchain adoption." This is the re-architecture of digital ownership.

### The Evidence

**BlackRock BUIDL**

- The world's largest asset manager ($10T+ AUM) launched a tokenized fund on Ethereum
- Not a pilot. Not an experiment. A product.
- Signal: Institutional capital has chosen its rails

**Visa USDC Settlement**

- Visa settles USDC transactions directly on Ethereum
- Bypasses traditional banking rails entirely
- Signal: Payment networks are moving on-chain

**JPMorgan Onyx**

- $1B+ in daily transactions on their blockchain platform
- Interoperates with public Ethereum
- Signal: Even the most conservative institutions have committed
```

#### 4. Highlighted Quote
```markdown
| Section Highlight |
|-------------------|
| > This project treats Ethereum's dominance as physics, not opinion. |
```

Or use regular blockquote:
```markdown
> This project treats Ethereum's dominance as physics, not opinion.
```

#### 5. More Content Sections (Regular Markdown)
```markdown
### Understanding the Primitive

To understand why Ethereum is physics, you have to understand what it actually is.

Bitcoin is triple-entry accounting on a globally distributed abacus. It does one thing perfectly: sound money.

Ethereum extends the same idea, but Turing-complete. Instead of just tracking balances, you can deploy *deterministic code* that runs indefinitely, without permission, so long as you pay the gas fee for computation.

The primitive: **trust-minimized software on permissionless rails.**
```

#### 6. Axiom 2 Section (same pattern as Axiom 1)
```markdown
## Axiom 2: Oak Is Entrenched

Jackrabbit Oak already stores and serves the majority of the planet's high-stakes digital experiences.

Fortune 500 commerce. Healthcare records. Government services. Financial portals. The content that *cannot* go down.

### The Evidence

**Adobe Experience Manager**

- Built on Jackrabbit Oak
- Powers 60%+ of Fortune 100 digital experiences
- Decades of enterprise deployment
```

#### 7. Convergence Section
```markdown
## The Convergence

Ethereum is becoming the settlement layer for digital ownership.

Oak already stores the content that matters.

These systems will meet. The only question is: on whose infrastructure?
```

---

## Bull Case Page (`bull-case.md`)

Similar structure to thesis page:

```markdown
# Bull Case

| Section Highlight |
|-------------------|
| Why Oak Chain could become the standard for decentralized content infrastructure. |

## The Market Opportunity

[Regular markdown content...]

### TAM Analysis

[Regular markdown with lists and emphasis...]

## Competitive Advantages

| Cards |
|-------|
| 🏛️ | **Enterprise Proven**<br><br>Oak already runs in production at Fortune 500 scale. |
| 🔐 | **Ethereum Native**<br><br>Built on the most secure and adopted blockchain. |
| 🚀 | **First Mover**<br><br>No competing decentralized content repository exists. |
```

---

## How It Works Page (`how-it-works.md`)

### Structure Breakdown

```markdown
# How It Works

Technical overview of Oak Chain's architecture.

## Write Flow

| Flow Diagram |
|--------------|
| write-flow |

### Step-by-Step

1. **Author creates content** in Sling
2. **Signs with wallet** (MetaMask)
3. **Pays gas** (Sepolia testnet)
4. **Leader validates** blockchain receipt
5. **Cluster replicates** via Raft
6. **Content persists** in segment store

## Read Flow

[Regular markdown...]

| Flow Diagram |
|--------------|
| read-flow |
```

---

## Architecture Page (`architecture.md`)

```markdown
# Architecture

## The Five Layers

| Section Highlight |
|-------------------|
| ### Layer 1: Content Ownership<br><br>Wallet address IS the namespace<br><br>`/oak-chain/{wallet-address}/{user-hierarchy}` |

[More content...]

## Layer Diagram

| Flow Diagram |
|--------------|
| architecture-layers |
```

---

## Block Usage Patterns

### When to Use Each Block

| Block | Use When | Example |
|-------|----------|---------|
| **Hero** | Page header with title + tagline + CTAs | Home, main pages |
| **Cards** | 2-6 feature items with icons | Features, benefits |
| **Axiom Grid** | Two-column comparison/principles | Axioms, key concepts |
| **Comparison Table** | Side-by-side comparison data | "The Bridge" section |
| **Narration** | AI narration callouts | Special announcements |
| **Section Highlight** | Emphasized content sections | Key quotes, important info |
| **Flow Diagram** | Interactive diagrams | Technical flows |
| **Regular Markdown** | Standard content | Body text, lists, paragraphs |

### Block Combinations

**Common Page Structure:**
1. Hero (title/intro)
2. Regular content (paragraphs)
3. Cards (features/benefits)
4. Section Highlight (key quote)
5. More content
6. Flow Diagram (if technical)
7. Regular content (conclusion)

---

## Markdown Table Syntax for Blocks

### Single Column Block
```markdown
| Block Name |
|------------|
| Content here |
```

### Two Column Block (Cards, Axioms)
```markdown
| Block Name |
|------------|
| Column 1 | Column 2 |
| Row 2 Col 1 | Row 2 Col 2 |
```

### Table Block (Comparison Table)
```markdown
| Comparison Table |
|------------------|
| Header 1 \| Header 2 |
| Row 1 Col 1 \| Row 1 Col 2 |
| Row 2 Col 1 \| Row 2 Col 2 |
```

**Note:** Use `|` (pipe) with backslash to separate table columns within block content.

---

## Content Authoring Tips

### 1. Line Breaks in Blocks
Use `<br>` tags for line breaks:
```markdown
| Cards |
|-------|
| 🔐 | **Title**<br><br>Description text here. |
```

### 2. Bold Text
Use `**bold**` for emphasis:
```markdown
**This is important**
```

### 3. Links
Use standard markdown links:
```markdown
[Link Text](/path)
```

### 4. Inline Code
Use backticks:
```markdown
`code here`
```

### 5. Blockquotes
Use `>` for blockquotes (outside blocks):
```markdown
> This is a quote
```

Or inside Section Highlight block:
```markdown
| Section Highlight |
|-------------------|
| > This is a highlighted quote |
```

---

## Example: Complete Home Page

```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) [Run a Validator](/operators) |

---

| Cards |
|-------|
| 🔐 | **Same Oak, New Ownership**<br><br>JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace. |
| 💰 | **Pay to Publish**<br><br>No access control lists. No admin approvals. Pay ETH, get writes. Economic security replaces bureaucratic security. |
| ♾️ | **Replicated Forever**<br><br>Raft consensus across validators. Your content survives any single company, server, or jurisdiction. |
| 🌳 | **Enterprise-Grade Storage**<br><br>Oak's proven segment store. Immutable TAR files, append-only journal, cryptographic checksums. |
| 📦 | **IPFS Binaries**<br><br>Content-addressed binaries. Validators store CIDs, authors own storage. Global availability. |
| 🔄 | **Real-Time Streaming**<br><br>Server-Sent Events for content discovery. Subscribe to the live feed of all writes. |

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
| architecture |

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

---

## Next Steps

1. **Create content in Document Authoring** using these block patterns
2. **Test locally** with `aem up`
3. **Iterate on styling** in block CSS files
4. **Deploy** to preview environment

---

## Quick Reference

### Block Syntax Cheat Sheet

```markdown
# Hero
| Hero |
|------|
| # Title |
| Subtitle |
| [Button](#) |

# Cards (2-6 items)
| Cards |
|-------|
| Icon | Content |

# Axiom Grid (2 items)
| Axiom Grid |
|------------|
| Item 1 |
| Item 2 |

# Comparison Table
| Comparison Table |
|------------------|
| Col 1 \| Col 2 |

# Narration
| Narration |
|-----------|
| Text |

# Section Highlight
| Section Highlight |
|-------------------|
| Content |

# Flow Diagram
| Flow Diagram |
|--------------|
| diagram-name |
```

---

**Tip:** Always preview blocks locally before deploying. Use browser dev tools to inspect the generated HTML and CSS.
