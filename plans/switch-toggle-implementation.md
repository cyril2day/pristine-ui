# SwitchToggle Component Implementation Plan

## Overview
Complete the Apple‑inspired switch toggle component based on the existing boilerplate in `src/components/switch‑toggle/SwitchToggle.vue`. The component will be a controlled switch that supports `v‑model` and a `disabled` state, with full keyboard accessibility and ARIA compliance.

## API Design

### Props
```typescript
type SwitchToggleProps = {
  /** Whether the switch is disabled */
  disabled?: boolean
}
```

Defaults: `disabled: false` (via `withDefaults`).

### Model
Use Vue 3.4+ `defineModel` for two‑way binding:
```typescript
const checked = defineModel<boolean>({ default: false })
```

### Events
- `change` – emitted with the new boolean value after a toggle (optional convenience event).

### Slots
None. The component is a pure toggle without a label. A label can be placed adjacent to the component by the parent.

### Data Attributes (for CSS targeting)
Following the pattern established by `PushButton`:
- `data‑checked` – present when the switch is on (`data‑checked="true"`), absent when off.
- `data‑disabled` – present (empty string) when `disabled` is true, absent when false.

### ARIA Attributes
- `role="switch"` (already present)
- `aria‑checked` – bound to the current checked state (`"true"`/`"false"`)
- `tabindex="0"` (already present)
- `aria‑disabled` – will be automatically added by Vue’s `:disabled` binding? Actually the root is a `<div>`, not a native control. We’ll set `aria‑disabled="true"` when `disabled` is true.

## Implementation Details

### Script Section
1. Define the `disabled` prop using `defineProps` with `withDefaults`.
2. Define the model using `defineModel<boolean>({ default: false })`.
3. Define `change` event using `defineEmits` (optional).
4. Compute `buttonAttributes` (data attributes) via a computed property.
5. Implement `toggle()` method that:
   - Returns early if `disabled`.
   - Computes the new value (`!checked.value`).
   - Updates `checked.value` (which automatically triggers `update:modelValue`).
   - Emits `change` event.
6. Attach `toggle` to:
   - `@click` (with mouse event)
   - `@keydown` for `Space` and `Enter` keys (prevent default for Space)
7. Use the functional utilities (`existy`, `truthy`) where appropriate (e.g., checking if `disabled` is truthy).

### Template Section
Keep the existing structure but:
- Bind `aria‑checked` to `checked`
- Add `:aria‑disabled="disabled"`
- Add `v‑bind="buttonAttributes"`
- Attach `@click` and `@keydown` listeners
- Possibly add `:class` for styling (could also rely on data attributes)

### Style Section
Create an Apple‑style switch with the following design tokens:

**Dimensions (approximate)**
- Track width: `3rem` (`--space‑12`)
- Track height: `1.5rem` (`--space‑6`)
- Thumb diameter: `1.25rem` (`--space‑5`)
- Thumb offset: `0.125rem` (`--space‑1`)

**Responsive Sizing**
Use the `respond‑to` mixin from `src/styles/tokens/_breakpoints.scss` to apply subtle size adjustments at different viewport breakpoints. Example:

```scss
.switch‑toggle {
  // Default dimensions (as above)
  width: var(--switch‑width, 3rem);
  height: var(--switch‑height, 1.5rem);

  @include respond‑to(small‑phone) {
    --switch‑width: 2.5rem;
    --switch‑height: 1.25rem;
  }
}
```

Adjust thumb size and offset proportionally.

**Colors**
- Track (off): `var(--color‑gray)`
- Track (on): `var(--color‑green)`
- Thumb: `var(--color‑white)`
- Disabled opacity: `var(--opacity‑50)`

**Transitions**
- `transition: background‑color 0.3s ease, transform 0.3s ease`

**CSS Property Order**
Follow the WordPress CSS Coding Standards as documented in `coding‑guidelines/coding‑guidelines.md`. Group properties in this order:
1. Display
2. Positioning
3. Box Model
4. Colors & Typography
5. Other

**Styling Strategy**
Use attribute selectors for state‑dependent styles:
```scss
.switch‑toggle[data‑checked="true"] { … }
.switch‑toggle[data‑disabled] { … }
```

## Unit Tests
Write tests in `SwitchToggle.test.ts` covering:

1. Renders with default props (checked false, not disabled).
2. Reflects `modelValue` prop correctly (checked state).
3. Applies `disabled` prop correctly (data‑disabled attribute, aria‑disabled).
4. Emits `update:modelValue` when toggled via click.
5. Emits `change` event when toggled.
6. Does not emit events when disabled.
7. Toggles via keyboard (Space, Enter).
8. Does not toggle via other keys.
9. ARIA attributes are correctly set.

Follow the pattern from `PushButton.test.ts`.

## Integration
Verify that the component works in `DemoPage.vue` (already imported). Ensure it toggles visually and respects the dark/light theme via CSS custom properties.

## Demo Page Update
Simplify the demo page to show all components (PushButton, SwitchToggle) in a unified, clean layout. Replace the current sidebar‑based navigation with simple cards:

- Remove the sidebar and top‑bar navigation (or keep minimal header).
- Create a grid of cards, each card containing one component example.
- Each card has a title (component name) and a few variants (e.g., default, disabled, different states).
- Use minimal labeling; avoid elaborate descriptions.

This will make the demo page easier to maintain and focus on component presentation.

## Dependencies
- Uses existing design tokens (colors, spacing, opacity).
- May use functional utilities from `src/utils/functional.ts`.

## Acceptance Criteria
- [ ] Component accepts `v‑model` and `disabled` prop.
- [ ] Visually matches Apple’s switch design (light/dark theme).
- [ ] Accessible (keyboard navigable, correct ARIA).
- [ ] Follows project coding guidelines (TypeScript types, CSS property order).
- [ ] Comprehensive unit tests pass.
- [ ] Works in the demo page.

## Next Steps
1. Switch to **Code** mode to implement the changes.
2. After implementation, run `pnpm lint` and `pnpm test` to verify.
3. Optionally update the demo page with more examples (disabled state, etc.).