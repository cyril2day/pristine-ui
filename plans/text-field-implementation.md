# TextField Component Implementation Plan

## Overview
Implement a Vue 3 TextField component inspired by macOS design aesthetics. The component will support two visual variants (`filled` and `default`), a clearable feature, and adhere to the project's existing coding patterns and design tokens.

## Component Structure

The TextField component will be a single‑file Vue component (`TextField.vue`) with the following high‑level structure:

```vue
<template>
  <div class="text-field" :data-variant="variant" :data-clearable="clearable" ...>
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      ... />
    <button
      v-if="showClearButton"
      @click="clearValue"
      aria-label="Clear input"
      class="text-field__clear">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
// Type definitions, props, emits, defineModel, computed, etc.
</script>

<style scoped lang="scss">
// Styled according to macOS design tokens
</style>
```

## Component Specifications

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'default'` | `'default'` | Visual style: `filled` has a solid background, `default` is an outlined field. |
| `clearable` | `boolean` | `false` | Whether to show a clear button when the field contains text. |
| `disabled` | `boolean` | `false` | Disables the input and prevents interaction. |
| `modelValue` | `string` | `''` | Two‑way binding for the input value (via `defineModel`). |

**Additional Attributes:** The component will use `inheritAttrs: false` and pass all unmatched attributes (e.g., `placeholder`, `type`, `readonly`, `name`, `autocomplete`, `aria‑*`) directly to the underlying `<input>` element. This keeps the component minimal while allowing full HTML input flexibility.

### Events

| Name | Payload | Description |
|------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes (handled automatically by `defineModel`). |
| `clear` | `none` | Emitted when the clear button is clicked (after the value is cleared). |
| `focus` | `FocusEvent` | Emitted when the input receives focus. |
| `blur` | `FocusEvent` | Emitted when the input loses focus. |
| `input` | `InputEvent` | Emitted on native `input` events (optional, already covered by `update:modelValue`). |

### Slots
No custom slots for this iteration (per user request). Future versions may add `prefix` and `suffix` slots for icons.

### Data Attributes (for CSS Targeting)
Following the pattern established by `PushButton` and `SwitchToggle`, the component will expose the following `data‑*` attributes on the root element:

- `data‑variant`: `'filled'` or `'default'`
- `data‑clearable`: present when `clearable` is `true`
- `data‑disabled`: present when `disabled` is `true`
- `data‑has‑value`: present when the input value is not empty (useful for styling the clear button)

These attributes enable pure‑CSS styling of different states without extra JavaScript in the stylesheet.

## Clearable Behavior
- The clear button (an “×” symbol) is rendered only when **all** of the following conditions are met:
  1. `clearable` prop is `true`
  2. The input value is not empty
  3. The input is **not** `disabled`
  4. The input is **not** `readonly` (i.e., the `readonly` attribute is not present on the input)
- Clicking the clear button sets the bound value to an empty string and emits a `clear` event.
- The button is positioned inside the field, typically at the right‑hand side, and does not interfere with the text cursor.

## Styling & Design Tokens

### macOS Design Inspiration
- **Rounded corners** (`--radius-md` or `--radius-lg`)
- **Subtle inner shadow** (simulated with a light inset box‑shadow)
- **Focused glow** (a thin blue outline with a soft shadow, using `--color‑blue`)
- **Filled variant**: solid background (`--color‑gray5` in light theme, `--color‑gray4` in dark theme)
- **Default variant**: a thin border (`--border‑width‑1 solid --color‑gray`) with transparent background

### CSS Structure
The component’s `<style>` block will be written in SCSS, following the **WordPress CSS property ordering** defined in the project’s coding guidelines.

Token usage:
- **Spacing**: `--space‑2`, `--space‑3`, `--space‑4` for internal paddings.
- **Typography**: `--font‑family‑sans`, `--text‑base`, `--text‑secondary` for placeholder.
- **Colors**: `--text‑primary`, `--color‑gray`, `--color‑blue`, `--color‑white`, `--color‑black`.
- **Border radius**: `--radius‑md` for default, `--radius‑lg` for filled variant.
- **Transition**: `transition: border‑color 0.2s ease, box‑shadow 0.2s ease;`

### Responsive Considerations
- The component will use the existing `respond‑to` mixin for breakpoint‑specific adjustments (e.g., smaller padding on small phones).

## Accessibility
- The `<input>` will have appropriate `aria‑*` attributes when needed (e.g., `aria‑disabled`, `aria‑readonly`).
- The clear button will have `aria‑label="Clear input"` and be focusable via keyboard (Tab key).
- Focus outlines will be visible and follow the design system’s focus style (blue outline with offset).

## Testing Strategy
- Unit tests will be written with Vitest and Vue Test Utils, following the pattern of `PushButton.test.ts`.
- Test cases will cover:
  - Rendering with default props
  - Applying each variant and boolean prop correctly
  - Data‑attribute generation
  - Clear button visibility and interaction
  - v‑model two‑way binding
  - Event emission (focus, blur, clear)
  - Disabled state and readonly attribute
- Tests will be placed in `src/components/text‑field/TextField.test.ts`.

## Integration into DemoPage
- Add a new card in `src/page/DemoPage.vue` showcasing:
  - Both variants (filled & default)
  - Clearable example with live value display
  - Disabled and readonly attribute examples
  - Example with different input types (text, password, email)
- Update the page’s grid layout to accommodate the new card.

## Implementation Steps
1. **Define TypeScript types** for props and emits.
2. **Create component directory and Vue file** (`src/components/text‑field/TextField.vue`).
3. **Implement the template** with proper structure, data attributes, and clear button.
4. **Implement clearable logic** and UI (conditional rendering, click handler).
5. **Apply CSS styling** following macOS design and token usage.
6. **Write unit tests** for the component.
7. **Integrate component into DemoPage** for demonstration.
8. **Review and finalize** the implementation.

## Dependencies
- Vue 3.4+ (for `defineModel`)
- Existing design tokens (`src/styles/tokens/`)
- Functional utilities (`src/utils/functional.ts`) – optional for `truthy` checks.

## Open Questions / Decisions
- Should the clear button be hidden when the field is not focused? (Current plan: visible whenever there is text, as long as the field is not disabled/readonly.)
- Should we add a `size` prop (small, medium, large) in this iteration? (Deferred per user request to keep minimal.)
- Should we support validation states (error, warning) now? (Deferred.)

---

*Plan created: 2026‑01‑17*