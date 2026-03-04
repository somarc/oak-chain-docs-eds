# Oak Chain EDS Blocks Reference

Quick reference for using Oak Chain blocks in Edge Delivery Services.

## Available Blocks

### 1. Hero Block

**Purpose:** Hero sections with gradient text and action buttons

**Markdown:**
```markdown
| Hero |
|------|
| # Oak Chain |
| When Ethereum Meets Oak |
| Two planetary-scale systems. One inevitable convergence. |
| [The Thesis](/thesis) [How It Works](/how-it-works) [Run a Validator](/operators) |
```

**Features:**
- H1 with purple gradient (Ethereum colors)
- Tagline text in secondary color
- Action buttons (first = primary gradient, rest = secondary outline)
- Responsive layout

**CSS:** `blocks/hero/hero.css`  
**JS:** `blocks/hero/hero.js`

---

### 2. Cards Block

**Purpose:** Feature cards grid (2-6 cards) with icons

**Markdown:**
```markdown
| Cards |
|-------|
| 🔐 | **Same Oak, New Ownership**<br><br>JCR API, Sling patterns, TAR segments. Everything you know. But your Ethereum wallet is your namespace. |
| 💰 | **Pay to Publish**<br><br>No access control lists. No admin approvals. Pay ETH, get writes. |
| ♾️ | **Replicated Forever**<br><br>Raft consensus across validators. Your content survives any single company. |
```

**Features:**
- Responsive grid (2-3 columns, 1 on mobile)
- Icon + heading + description layout
- Hover effects (lift + glow)
- Clickable if contains links

**CSS:** `blocks/cards/cards.css`  
**JS:** `blocks/cards/cards.js`

---

### 3. Narration Block

**Purpose:** AI narration callout boxes with purple left border

**Markdown:**
```markdown
| Narration |
|-----------|
| This is sample text for AI narration from a narration block in Edge Delivery. |
```

**Renders as:**
- Box with purple left border
- Icon prefix ("🎙️ AI Narration")
- Subtle hover glow effect

**CSS:** `blocks/narration/narration.css`  
**JS:** `blocks/narration/narration.js`

---

### 4. Axiom Grid Block

**Purpose:** Two-column grid for axioms with gradient backgrounds

**Markdown:**
```markdown
| Axiom Grid |
|------------|
| ### Axiom 1: Ethereum Is Physics<br><br>Ethereum is economic finality encoded as code. |
| ### Axiom 2: Oak Is Entrenched<br><br>Jackrabbit Oak already stores the majority of the planet's high-stakes digital experiences. |
```

**Features:**
- Responsive 2-column grid (1-column on mobile)
- Cards with gradient backgrounds
- Purple border accents
- Hover effects (lift + glow)

**CSS:** `blocks/axiom-grid/axiom-grid.css`  
**JS:** `blocks/axiom-grid/axiom-grid.js`

---

### 5. Comparison Table Block

**Purpose:** Side-by-side comparison tables (e.g., "The Bridge")

**Markdown:**
```markdown
| Comparison Table |
|------------------|
| **What You Know** \| **What's New** |
| Same JCR API \| Wallet = namespace |
| Same Sling patterns \| ETH payments = authorization |
| Same TAR segments \| Raft consensus = replication |
```

**Features:**
- Two-column comparison layout
- Purple-themed table styling
- Hover effects on rows
- Responsive with horizontal scroll

**CSS:** `blocks/comparison-table/comparison-table.css`  
**JS:** `blocks/comparison-table/comparison-table.js`

---

### 6. Section Highlight Block

**Purpose:** Emphasized content sections with gradient background

**Markdown:**
```markdown
| Section Highlight |
|-------------------|
| > This project treats Ethereum's dominance as physics, not opinion. |
```

**Features:**
- Gradient background with purple accent
- Left border (or top border for centered)
- Perfect for quotes, key points
- Supports `.center` and `.full-width` variants

**CSS:** `blocks/section-highlight/section-highlight.css`  
**JS:** `blocks/section-highlight/section-highlight.js`

---

### 7. Flow Diagram Block

**Purpose:** Interactive flow diagrams (already exists)

**Markdown:**
```markdown
| Flow Diagram |
|--------------|
| [Diagram configuration] |
```

**Features:**
- Animated background with purple gradients
- Hover effects
- Compact mode support

**CSS:** `blocks/flow-diagram/flow-diagram.css`  
**JS:** `blocks/flow-diagram/flow-diagram.js`

---

## Block Usage Patterns

### Single Row Block

```markdown
| Block Name |
|------------|
| Content here |
```

EDS generates:
```html
<div class="block-name block">
  <div>
    <div>Content here</div>
  </div>
</div>
```

### Multi-Row Block

```markdown
| Block Name |
|------------|
| Row 1 content |
| Row 2 content |
```

EDS generates:
```html
<div class="block-name block">
  <div>
    <div>Row 1 content</div>
  </div>
  <div>
    <div>Row 2 content</div>
  </div>
</div>
```

### Multi-Column Block

```markdown
| Block Name | |
|------------|--|
| Col 1 | Col 2 |
```

EDS generates:
```html
<div class="block-name block">
  <div>
    <div>Col 1</div>
    <div>Col 2</div>
  </div>
</div>
```

## Styling Best Practices

### 1. Use CSS Variables

Always reference global variables from `styles/styles.css`:

```css
/* Good */
.my-block {
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-accent);
}

/* Bad */
.my-block {
  background-color: #1a1a2e;
  color: #fff;
  border: 1px solid rgba(98, 126, 234, 0.3);
}
```

### 2. Consistent Spacing

Use standard spacing values:
- Small: `0.5rem` / `8px`
- Medium: `1rem` / `16px`
- Large: `2rem` / `32px`

### 3. Border Radius

Use CSS variables:
- `var(--radius-sm)` - 4px
- `var(--radius-md)` - 8px
- `var(--radius-lg)` - 12px

### 4. Transitions

Standard transition for hover effects:
```css
transition: all 0.2s ease;
```

### 5. Responsive Design

Mobile-first approach with max-width breakpoints:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 480px) {
  /* Smaller mobile */
}
```

## JavaScript Patterns

### Minimal Decoration

Blocks should be mostly CSS. JS only for dynamic behavior:

```javascript
export default function decorate(block) {
  // Read content
  const content = block.textContent.trim();
  
  // Minimal DOM manipulation
  if (content) {
    block.innerHTML = `<p>${content}</p>`;
  }
  
  // Add event listeners if needed
  block.addEventListener('click', () => {
    // Handle interaction
  });
}
```

### Accessing Block Content

```javascript
export default function decorate(block) {
  // Get all rows
  const rows = [...block.children];
  
  // Get all cells in first row
  const cells = [...rows[0].children];
  
  // Query specific elements
  const heading = block.querySelector('h1, h2, h3');
  const links = block.querySelectorAll('a');
}
```

## Global Styles

All blocks can use these global styles from `styles/styles.css`:

### Colors

```css
--bg-deep: #0f0f23           /* Main background */
--bg-surface: #1a1a2e        /* Cards, elevated surfaces */
--bg-elevated: #16213e       /* Even more elevated */
--accent-primary: #627EEA    /* Primary purple */
--accent-secondary: #8C8DFC  /* Light purple */
--text-primary: rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.7)
```

### Typography

```css
--font-sans: 'Inter'         /* Body text */
--font-mono: 'JetBrains Mono' /* Code */
```

### Effects

```css
--shadow-glow: 0 0 40px rgba(98, 126, 234, 0.2)
--shadow-brand: 0 0 20px rgba(98, 126, 234, 0.3)
--shadow-brand-hover: 0 0 30px rgba(98, 126, 234, 0.5)
```

## Content Authoring Tips

### Headings in Blocks

Use markdown headings normally:
```markdown
| Block Name |
|------------|
| # Main Heading |
| ## Subheading |
| Content text |
```

### Links in Blocks

Markdown links work:
```markdown
| Block Name |
|------------|
| [Link Text](/path) |
```

For buttons, add multiple links:
```markdown
| Hero |
|------|
| [Primary Button](/path) [Secondary Button](/other) |
```

The hero block JS automatically styles the first as primary, rest as secondary.

### Line Breaks

Use `<br>` tags for line breaks within cells:
```markdown
| Block Name |
|------------|
| First line<br>Second line<br>Third line |
```

### Bold and Italic

Standard markdown formatting works:
```markdown
| Block Name |
|------------|
| **Bold text** and *italic text* |
```

### Code Blocks

Inline code uses backticks:
```markdown
| Block Name |
|------------|
| Use the `narration` block for callouts. |
```

## Creating New Blocks

### Step 1: Create Folder

```bash
mkdir -p blocks/my-new-block
```

### Step 2: Create CSS

```css
/* blocks/my-new-block/my-new-block.css */
.my-new-block {
  /* Styles here */
}
```

### Step 3: Create JS

```javascript
/* blocks/my-new-block/my-new-block.js */
export default function decorate(block) {
  // Logic here
}
```

### Step 4: Use in Content

```markdown
| My New Block |
|--------------|
| Content here |
```

EDS automatically detects and loads the block.

## Testing Blocks

1. **Start local server:**
   ```bash
   aem up
   ```

2. **Create test page** with block in markdown

3. **Check browser console** for errors

4. **Inspect DOM** to see generated HTML

5. **Test responsive** by resizing browser

## Common Issues

### Block Not Loading

- Check folder name matches block name in markdown
- Check .css and .js files exist
- Check file names match folder name
- Check browser console for errors

### Styles Not Applying

- Verify CSS variable names
- Check selector specificity
- Inspect element to see computed styles
- Clear browser cache

### JS Not Running

- Check for syntax errors in console
- Verify `export default function decorate(block)`
- Check block element exists in DOM

## Resources

- **EDS Blocks:** https://www.aem.live/developer/block-collection
- **Oak Chain Blocks:** `/Users/mhess/aem/aem-code/OAK/blockchain-aem-eds/blocks/`
- **Global Styles:** `/Users/mhess/aem/aem-code/OAK/blockchain-aem-eds/styles/styles.css`

---

**Quick Reference Card:**

| Block | Purpose | Markdown |
|-------|---------|----------|
| Hero | Hero section with gradient | `\| Hero \|` |
| Cards | Feature cards grid | `\| Cards \|` |
| Narration | AI narration callout | `\| Narration \|` |
| Axiom Grid | Two-column axiom layout | `\| Axiom Grid \|` |
| Comparison Table | Side-by-side comparison | `\| Comparison Table \|` |
| Section Highlight | Emphasized sections | `\| Section Highlight \|` |
| Flow Diagram | Interactive diagrams | `\| Flow Diagram \|` |
