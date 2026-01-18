# CardDisplay Component Implementation Plan

## Overview
Create a general-purpose card component inspired by Apple design, featuring two variants (`outlined` and `elevated`) with subtle shadows, rounded corners, and a slot for arbitrary content.

## Component Spec

### Props
```typescript
type CardDisplayVariant = 'outlined' | 'elevated'
```
- `variant`: `CardDisplayVariant` (default `'outlined'`)
- No other props needed for minimal version; additional props (e.g., `padding`, `border`) could be added later but are out of scope.

### Data Attributes
- `data-variant`: the current variant value (for CSS targeting)
- `data-card`: presence attribute (always present) for generic styling hooks

### Slots
- Default slot: the card's content (any HTML/component)
- No named slots required initially

### Styling
- **Outlined variant**: `border: 1px solid var(--color-gray)`, `background-color: var(--background-color)`, no shadow.
- **Elevated variant**: `border: 1px solid transparent`, `background-color: var(--background-color)`, `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)` (subtle shadow), hover elevation increase.
- Common styles: `border-radius: var(--radius-lg)`, `padding: var(--space-6)` (consistent with existing `.card` class), `transition: box-shadow 0.2s ease`.
- Follow WordPress CSS property ordering (Display, Positioning, Box Model, Colors & Typography, Other) as per coding guidelines.
- Use design tokens for colors, spacing, radii.

### Example Usage
```vue
<CardDisplay variant="outlined">
  <h3>Title</h3>
  <p>Content goes here.</p>
</CardDisplay>

<CardDisplay variant="elevated">
  <img src="..." alt="...">
  <p>Elevated card content.</p>
</CardDisplay>
```

## Implementation Steps

1. **Create directory and Vue file**  
   - Create `src/components/card-display/`
   - Create `CardDisplay.vue` with `<script>`, `<template>`, `<style>` sections.

2. **Implement TypeScript props and data attributes**  
   - Define `CardDisplayVariant` type.
   - Use `defineProps` with `withDefaults`.
   - Compute data attributes object.

3. **Write template**  
   - Root `<div>` with `class="card-display"` and `v-bind="dataAttributes"`.
   - Include `<slot />`.

4. **Style component**  
   - Write SCSS with proper ordering.
   - Define styles for both variants using attribute selectors (`[data-variant="..."]`).
   - Ensure responsive design (optional, but can reuse token breakpoints).

5. **Write unit tests**  
   - Create `CardDisplay.test.ts` in the same directory.
   - Test rendering, variant application, slot content.
   - Use Vitest and Vue Test Utils (following existing patterns).

6. **Integrate into DemoPage**  
   - Add import in `src/page/DemoPage.vue`.
   - Create a new card in the demo grid showcasing both variants.
   - Update demo page as needed.

7. **Verification**  
   - Run existing test suite to ensure no regressions.
   - Visually inspect card appearance in browser (optional).

## Files to Create/Modify

- `src/components/card-display/CardDisplay.vue` (new)
- `src/components/card-display/CardDisplay.test.ts` (new)
- `src/page/DemoPage.vue` (modified)

## Design Decisions

- **No classes**: Avoid using classes for component styling; rely on data attributes.
- **Minimal API**: Only variant prop; keep component simple as requested.
- **Consistency**: Follow existing component patterns (PushButton, TextField) for script structure, data attributes, and CSS ordering.
- **Accessibility**: The card is a presentational container, so no specific ARIA roles needed unless interactive. If future interactivity is added, consider `role="region"` or `article`.

## Open Questions

- Should the card have a default padding? (Yes, `var(--space-6)` as per demo card.)
- Should we support a `click` event? (Not needed for now; card is purely presentational.)
- Should we support a `title` prop? (Not needed; content via slot.)

## Dependencies

- Vue 3 Composition API
- Existing design tokens (`src/styles/tokens/`)
- Underscore library (optional, not required for this component)

## Testing Strategy

- Render test with default slot content.
- Verify `data-variant` attribute changes with prop.
- Verify CSS classes are not used (except root class).
- Ensure no unexpected DOM attributes.

## Success Criteria

- Component passes all unit tests.
- Demo page displays both variants correctly.
- Styles match Apple-inspired aesthetic (subtle shadows, rounded corners).
- No linting errors (run `pnpm lint`).