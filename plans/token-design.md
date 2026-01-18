# Token Design Specification

## Overview

This document defines the design tokens for the Pristine UI Revamped project. Tokens are organized into categories and implemented as CSS custom properties (variables) for dynamic theming, with SCSS variables for static values where needed (e.g., media queries).

## Directory Structure

```
src/styles/tokens/
├── _index.scss          # Main entry point importing all token categories
├── _breakpoints.scss    # Breakpoint definitions
├── _colors.scss         # Color palette with light/dark themes
├── _typography.scss     # Typography scale, weights, line heights
├── _display.scss        # Display-related tokens (e.g., z-index, opacity)
├── _positioning.scss    # Positioning tokens (e.g., positions, offsets)
├── _box-model.scss      # Box model tokens (margins, paddings, borders)
└── _others.scss         # Miscellaneous tokens (shadows, radii, transitions)
```

## Breakpoint Tokens

### SCSS Variables (for media queries)

```scss
$breakpoint-small-phone: 480px;
$breakpoint-phone-tablet-transition: 767px;
$breakpoint-small-tablet: 1023px;
$breakpoint-tablet-desktop-transition: 1068px;
$breakpoint-small-desktop: 1250px;
```

### CSS Custom Properties (for JavaScript/component usage)

```css
--breakpoint-small-phone: 480px;
--breakpoint-phone-tablet-transition: 767px;
--breakpoint-small-tablet: 1023px;
--breakpoint-tablet-desktop-transition: 1068px;
--breakpoint-small-desktop: 1250px;
```

### Media Query Mixin (optional)

We can provide a SCSS mixin for convenience:

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == small-phone {
    @media (max-width: $breakpoint-small-phone) { @content; }
  }
  @if $breakpoint == phone-tablet-transition {
    @media (max-width: $breakpoint-phone-tablet-transition) { @content; }
  }
  // ... etc.
}
```

## Color Tokens

### Base Colors (HSL values)

#### Light Theme Colors

```css
--color-red: hsl(359, 100%, 61%);
--color-orange: hsl(28, 100%, 58%);
--color-yellow: hsl(48, 100%, 50%);
--color-green: hsl(135, 59%, 49%);
--color-mint: hsl(174, 100%, 39%);
--color-teal: hsl(184, 100%, 41%);
--color-cyan: hsl(199, 78%, 55%);
--color-blue: hsl(208, 100%, 50%);
--color-indigo: hsl(245, 89%, 65%);
--color-purple: hsl(293, 74%, 53%);
--color-pink: hsl(349, 100%, 59%);
--color-brown: hsl(25, 32%, 52%);
--color-white: hsl(0, 0%, 100%);
--color-black: hsl(0, 0%, 0%);
--color-gray: hsl(240, 2%, 57%);
```

#### Dark Theme Colors

```css
--color-red: hsl(359, 100%, 63%);
--color-orange: hsl(28, 100%, 59%);
--color-yellow: hsl(50, 100%, 50%);
--color-green: hsl(135, 64%, 50%);
--color-mint: hsl(174, 100%, 43%);
--color-teal: hsl(184, 100%, 44%);
--color-cyan: hsl(197, 100%, 70%);
--color-blue: hsl(206, 100%, 50%);
--color-indigo: hsl(234, 100%, 71%);
--color-purple: hsl(293, 88%, 58%);
--color-pink: hsl(348, 100%, 61%);
--color-brown: hsl(27, 36%, 56%);
--color-gray: hsl(240, 2%, 61%);
```

### Semantic Color Mapping

Define semantic roles (primary, secondary, background, surface, text, etc.) that map to base colors, adapting per theme.

Example:

```css
/* Light theme */
--color-primary: var(--color-blue);
--color-background: var(--color-white);
--color-text: var(--color-black);
/* etc. */

/* Dark theme */
--color-primary: var(--color-cyan);
--color-background: hsl(240, 5%, 10%);
--color-text: hsl(0, 0%, 95%);
```

### Theming Implementation

Support both:

1. **CSS Class‑based theming**: A `.dark` class applied to a parent element (e.g., `<html>` or `<body>`) overrides light theme variables.
2. **`prefers‑color‑scheme` media query**: Automatically adapt to user's OS preference.

Implementation approach:

- Define light theme variables on `:root`.
- Override them inside `@media (prefers‑color‑scheme: dark)` with dark values.
- Additionally, override them inside a `.dark` class (for manual toggle).

## Typography Tokens

### Font Family

```css
--font-family-sans: 'Inter', sans-serif;
--font-family-mono: 'Monaco', 'Consolas', monospace;
```

### Font Size Scale (static)

```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.8;
```

### Responsive Typography

For each breakpoint, we may adjust the font size scale (e.g., smaller sizes on mobile). This can be done by redefining the CSS custom properties within media queries.

Example:

```css
@media (max-width: 767px) {
  :root {
    --text-base: 0.9375rem;
    --text-lg: 1.0625rem;
    /* ... */
  }
}
```

Alternatively, use fluid typography with `clamp()` for smoother scaling.

## Display Tokens

### Z‑Index Layers

```css
--z-index-dropdown: 1000;
--z-index-sticky: 1020;
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;
--z-index-popover: 1060;
--z-index-tooltip: 1070;
```

### Opacity

```css
--opacity-disabled: 0.5;
--opacity-hover: 0.8;
--opacity-focus: 0.9;
```

## Positioning Tokens

### Positions

```css
--position-static: static;
--position-relative: relative;
--position-absolute: absolute;
--position-fixed: fixed;
--position-sticky: sticky;
```

### Offsets

```css
--offset-none: 0;
--offset-xs: 0.25rem;
--offset-sm: 0.5rem;
--offset-md: 1rem;
--offset-lg: 1.5rem;
--offset-xl: 2rem;
```

## Box Model Tokens

### Spacing Scale (based on 4‑unit grid)

```css
--space-0: 0;
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
--space-20: 5rem;
--space-24: 6rem;
--space-32: 8rem;
```

### Border Widths

```css
--border-width-none: 0;
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;
```

### Border Radii

```css
--radius-none: 0;
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;
```

## Miscellaneous Tokens

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;
```

## Integration with Existing Code

- The existing `--primary-color` in `global.scss` will be replaced by the semantic `--color-primary`.
- Update `global.scss` to import `tokens/_index.scss` after `normalize.css` and before project‑specific styles.

## Next Steps

1. Create the directory and SCSS partial files.
2. Implement each token category according to this specification.
3. Update `global.scss` to import the tokens.
4. Create a demo component to verify token usage and theming.
5. Test across breakpoints and themes.

## Open Questions

- Should we provide a JavaScript object mapping of tokens for use in Vue components? (Not needed for now.)
- Should we generate TypeScript definitions for the tokens? (Could be added later.)
- Do we need to support CSS‑in‑JS libraries? (Not applicable.)