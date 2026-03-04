# Oak Chain Theming Guide

How the Ethereum purple theme is implemented in Edge Delivery Services.

## Color Palette

Oak Chain uses an **Ethereum-inspired dark theme** with purple accents.

### Primary Colors

| Name | Value | Usage |
|------|-------|-------|
| **Deep Space** | `#0f0f23` | Main background |
| **Dark Navy** | `#1a1a2e` | Surface backgrounds (cards, headers) |
| **Midnight Blue** | `#16213e` | Elevated elements |
| **Ethereum Purple** | `#627EEA` | Primary brand color, links |
| **Light Purple** | `#8C8DFC` | Secondary brand, hover states |
| **Soft Purple** | `#a5a6ff` | Tertiary, gradients |

### Text Colors

| Name | Value | Usage |
|------|-------|-------|
| **Primary Text** | `rgba(255, 255, 255, 0.95)` | Main content |
| **Secondary Text** | `rgba(255, 255, 255, 0.7)` | Subtitles, captions |
| **Muted Text** | `rgba(255, 255, 255, 0.5)` | Hints, placeholders |

### Border Colors

| Name | Value | Usage |
|------|-------|-------|
| **Subtle Border** | `rgba(98, 126, 234, 0.1)` | Dividers |
| **Accent Border** | `rgba(98, 126, 234, 0.3)` | Card borders |
| **Focus Border** | `rgba(98, 126, 234, 0.5)` | Focus states |

## CSS Variables

All colors are defined as CSS variables in `/styles/styles.css`:

```css
:root {
  /* Backgrounds */
  --bg-deep: #0f0f23;
  --bg-surface: #1a1a2e;
  --bg-elevated: #16213e;
  --bg-hover: #252f3f;
  --bg-input: #0d1117;
  
  /* Accents (Ethereum Purple) */
  --accent-primary: #627EEA;
  --accent-secondary: #8C8DFC;
  --accent-tertiary: #a5a6ff;
  --accent-glow: rgba(98, 126, 234, 0.15);
  
  /* Text */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.5);
  
  /* Borders */
  --border-subtle: rgba(98, 126, 234, 0.1);
  --border-accent: rgba(98, 126, 234, 0.3);
  --border-focus: rgba(98, 126, 234, 0.5);
  
  /* Status */
  --success: #3fb950;
  --warning: #f0b429;
  --error: #f85149;
  --info: #58a6ff;
  
  /* Fonts */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;
  
  /* Spacing */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-glow: 0 0 40px rgba(98, 126, 234, 0.2);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-brand: 0 0 20px rgba(98, 126, 234, 0.3);
  --shadow-brand-hover: 0 0 30px rgba(98, 126, 234, 0.5);
}
```

## Typography

### Fonts

- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

Loaded via Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Heading Styles

```css
h1 {
  font-size: 42px;
  font-weight: 300;
  color: var(--text-primary);
}

h1 strong {
  /* Gradient text effect */
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--accent-secondary); /* Purple! */
}

h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}
```

## Gradient Effects

### Hero Gradient

Used in hero headings for the "Ethereum purple" gradient:

```css
.hero h1 {
  background: linear-gradient(135deg, #627EEA 0%, #8C8DFC 50%, #a5a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Colors flow:** Ethereum Purple → Light Purple → Soft Purple

### Button Gradient

Primary buttons use gradient backgrounds:

```css
.button.primary {
  background: linear-gradient(135deg, #627EEA 0%, #8C8DFC 100%);
  box-shadow: var(--shadow-brand);
}

.button.primary:hover {
  box-shadow: var(--shadow-brand-hover);
  transform: translateY(-1px);
}
```

### Card Gradients

Axiom cards and special blocks:

```css
.axiom-grid > div {
  background: linear-gradient(135deg, rgba(98, 126, 234, 0.1), rgba(140, 141, 252, 0.05));
  border: 1px solid var(--border-accent);
}
```

## Visual Effects

### Glow Effects

Purple glow on hover:

```css
.element:hover {
  box-shadow: var(--shadow-brand);
  /* or */
  box-shadow: 0 0 20px rgba(98, 126, 234, 0.3);
}
```

Stronger glow:
```css
.element:hover {
  box-shadow: var(--shadow-brand-hover);
  /* or */
  box-shadow: 0 0 30px rgba(98, 126, 234, 0.5);
}
```

### Border Accents

Left border accent (narration, blockquotes):

```css
.narration {
  border-left: 3px solid var(--accent-primary);
}

.narration:hover {
  border-left-color: var(--accent-secondary);
}
```

### Background Patterns

Subtle animated gradients:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(98, 126, 234, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(140, 141, 252, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
```

## Component Theming

### Buttons

**Primary (Gradient):**
```css
.button.primary {
  background: linear-gradient(135deg, #627EEA 0%, #8C8DFC 100%);
  color: white;
  box-shadow: var(--shadow-brand);
}
```

**Secondary (Outline):**
```css
.button.secondary {
  background-color: transparent;
  border: 2px solid var(--border-accent);
  color: var(--text-primary);
}

.button.secondary:hover {
  background-color: var(--accent-glow);
  border-color: var(--accent-primary);
}
```

### Cards

```css
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

.card:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-glow);
}
```

### Links

```css
a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--accent-secondary);
}
```

### Code Blocks

```css
pre {
  background-color: #0a0a1a; /* Darker than bg-deep */
  border: 1px solid rgba(98, 126, 234, 0.15);
  border-radius: var(--radius-md);
}

:not(pre) > code {
  background-color: rgba(98, 126, 234, 0.1);
  color: var(--accent-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
}
```

### Blockquotes

```css
blockquote {
  border-left: 3px solid var(--accent-primary);
  background: rgba(98, 126, 234, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
```

## Dark Theme Best Practices

### 1. Contrast Ratios

Maintain WCAG AA standards:
- Text on `#0f0f23`: Use `rgba(255, 255, 255, 0.95)` or lighter
- Links: `#627EEA` has sufficient contrast on dark backgrounds
- Secondary text: `rgba(255, 255, 255, 0.7)` minimum

### 2. Layering

Use subtle background differences for depth:
- Base: `--bg-deep` (#0f0f23)
- Cards: `--bg-surface` (#1a1a2e) - slightly lighter
- Elevated: `--bg-elevated` (#16213e) - even lighter

### 3. Borders

Use semi-transparent borders for consistency:
- Subtle: `rgba(98, 126, 234, 0.1)`
- Standard: `rgba(98, 126, 234, 0.3)`
- Focus: `rgba(98, 126, 234, 0.5)`

### 4. Hover States

Increase brightness and glow on hover:
```css
.element {
  border-color: var(--border-subtle);
  transition: all 0.2s ease;
}

.element:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-glow);
}
```

## Customizing the Theme

### Changing Primary Color

To change from purple to another color:

1. **Update CSS variables:**
```css
:root {
  --accent-primary: #YOUR_COLOR;
  --accent-secondary: #LIGHTER_VARIANT;
  --accent-tertiary: #EVEN_LIGHTER;
}
```

2. **Update gradients:**
```css
/* Search for: */
linear-gradient(135deg, #627EEA, #8C8DFC, #a5a6ff)

/* Replace with your colors */
```

3. **Update border colors:**
```css
--border-subtle: rgba(YOUR_RGB, 0.1);
--border-accent: rgba(YOUR_RGB, 0.3);
--border-focus: rgba(YOUR_RGB, 0.5);
```

### Adding Light Mode

1. Define light mode variables:
```css
@media (prefers-color-scheme: light) {
  :root {
    --bg-deep: #ffffff;
    --bg-surface: #f5f5f5;
    --text-primary: #131313;
    /* etc */
  }
}
```

2. Or use data attribute:
```css
[data-theme="light"] {
  --bg-deep: #ffffff;
  /* etc */
}
```

## Comparison: VitePress vs EDS Theme

| Element | VitePress | EDS |
|---------|-----------|-----|
| **Primary Color** | `#627EEA` | `#627EEA` ✓ |
| **Secondary** | `#8C8DFC` | `#8C8DFC` ✓ |
| **Background** | `#0f0f23` | `#0f0f23` ✓ |
| **Font** | Inter | Inter ✓ |
| **H2 Color** | Purple | Purple ✓ |
| **Gradients** | 3-color | 3-color ✓ |
| **Glow Effects** | Yes | Yes ✓ |

The EDS implementation matches the VitePress design exactly.

---

**Quick Reference:**

```css
/* Backgrounds */
--bg-deep: #0f0f23
--bg-surface: #1a1a2e

/* Purple accents */
--accent-primary: #627EEA
--accent-secondary: #8C8DFC

/* Gradients */
linear-gradient(135deg, #627EEA 0%, #8C8DFC 50%, #a5a6ff 100%)

/* Glow */
box-shadow: 0 0 20px rgba(98, 126, 234, 0.3)
```
