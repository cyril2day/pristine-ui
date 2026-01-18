# PushButton Component Implementation Plan

## Overview
Implement a Vue 3 single-file component (SFC) for a button with multiple roles, shapes, disabled state, and responsive scaling. The component should follow Apple-inspired design and use existing design tokens.

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| role | `'normal' | 'primary' | 'destructive' | 'cancel'` | `'normal'` | Determines the button's visual role (color, background). |
| shape | `'capsule' | 'rounded-rectangle'` | `'capsule'` | Border‑radius shape. |
| disabled | `boolean` | `false` | Whether the button is disabled. |

### Type Definitions
```typescript
type PushButtonRole = 'normal' | 'primary' | 'destructive' | 'cancel';
type PushButtonShape = 'capsule' | 'rounded-rectangle';
```

## Emits
- `click`: emitted when the button is clicked (unless disabled).

## Styling Details

### Color Mapping (using existing color tokens)
- **normal**: background `var(--color-gray)`, text `var(--color-white)` (or `var(--text-primary)` for contrast?). Use white text for better contrast against gray.
- **primary**: background `var(--color-blue)`, text `var(--color-white)`.
- **destructive**: background `var(--color-red)`, text `var(--color-white)`.
- **cancel**: background `transparent`, border `var(--color-gray)`, text `var(--color-gray)`. Border width `var(--border-width-1)`.

### Shape Radii
- **capsule**: `border-radius: var(--radius-full)` (9999px).
- **rounded‑rectangle**: `border-radius: var(--radius-lg)` (12px).

### Spacing & Dimensions
- Horizontal padding: `var(--space-3)` (0.75rem)
- Vertical padding: `var(--space-2)` (0.5rem)
- Font size: `var(--text-base)` (responsive)
- Font weight: `var(--font-weight-medium)` (500)
- Font family: `var(--font-family-sans)`
- Border: `none` except cancel button.

### States
- **disabled**: `opacity: var(--opacity-50)`; `cursor: not‑allowed`; `pointer‑events: none`.
- **hover**: slight darkening of background (increase lightness by 5% via `filter: brightness(0.95)`).
- **active**: further darkening (`filter: brightness(0.85)`).

### Responsive Scaling
- Font size already adjusts via the `--text‑base` token (which is responsive per breakpoint).
- Padding and border‑radius remain static; they are defined in `rem` units and thus scale with the root font size.
- No additional media queries needed.

### Scoped Styles
All styles will be placed inside the component’s `<style scoped>` block. No new semantic tokens will be added to the global token files; any component‑specific custom properties will be defined locally.

## Implementation Steps

1. **Update `PushButton.vue`**
   - Define props and emits using `<script setup lang="ts">`.
   - Create template with a `<button>` element.
   - Bind dynamic CSS classes based on `role`, `shape`, and `disabled`.
   - Handle click events (prevent when disabled).

2. **Write Scoped Styles**
   - Use CSS custom properties from the global token files (`_colors.scss`, `_box‑model.scss`, etc.).
   - Define local custom properties for hover/active adjustments if needed.
   - Implement the color mapping, shape radii, and states described above.

3. **Create Unit Tests**
   - Test file: `src/components/push-button/PushButton.test.ts`
   - Use `@vue/test‑utils` and `vitest`.
   - Test suites:
     - Prop rendering (role, shape, disabled)
     - CSS class application
     - Click event emission (and prevention when disabled)
     - Accessibility attributes (role="button", aria‑disabled)

4. **Integration Demo**
   - Optionally update `src/App.vue` to include a few example buttons for manual verification.

5. **Validation**
   - Run `pnpm test:unit` to ensure all tests pass.
   - Run `pnpm lint` to ensure code style compliance.

## Coding Guidelines Compliance
- Use `type` instead of `interface` for prop definitions.
- Avoid classes; use plain objects and functions.
- Follow the project’s ESLint configuration (2‑space indentation, double quotes).
- Write JSDoc comments for public functions (if any).

## Test Strategy
- Mount the component with different prop combinations.
- Assert that the correct CSS classes are present.
- Simulate clicks and verify `click` events are emitted (or not emitted when disabled).
- Use `describe`/`it` blocks mirroring the component’s behavior.

## Open Questions / Decisions
- Should the `normal` role use `var(--color‑gray)` or a lighter gray? (Decision: use `--color‑gray` as defined.)
- Should hover/active states be implemented with CSS filters or separate color tokens? (Decision: CSS filters for simplicity.)

## Next Steps
1. Review this plan with the user.
2. Switch to **Code** mode to implement the component.
3. After implementation, run tests and linting.

---

*Plan created: 2026‑01‑17*