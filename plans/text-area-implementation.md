# TextArea Component Implementation Plan

## Overview
Implement a Vue 3 TextArea component inspired by Apple design, adhering to WAI ARIA minimum requirements. The component will follow the same patterns as existing components (TextField, CheckBox, etc.) using functional utilities and CSS property ordering.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled'` | `'default'` | Visual variant matching TextField styles. |
| `resizable` | `boolean` | `true` | Whether the textarea can be resized by the user. If `false`, CSS `resize: none` is applied. |
| `showCounter` | `boolean` | `false` | Whether to show a character count below the textarea. |
| `maxLength` | `number` | `undefined` | Maximum allowed characters (sets HTML `maxlength` attribute). Also used for character count if `showCounter` is true. |
| `rows` | `number` | `3` | Number of visible text rows (HTML `rows` attribute). |
| `cols` | `number` | `undefined` | Number of visible text columns (HTML `cols` attribute). |
| `disabled` | `boolean` | `false` | Disables the textarea. |
| `modelValue` | `string` | `''` | The bound value (v‑model). |
| `placeholder` | `string` | `undefined` | Placeholder text. |
| All other native attributes | (via `$attrs`) | – | Attributes like `name`, `autocomplete`, `readonly`, `aria-*`, etc. are passed through to the underlying `<textarea>` element. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the textarea value changes (v‑model support). |
| `focus` | `FocusEvent` | Emitted when the textarea receives focus. |
| `blur` | `FocusEvent` | Emitted when the textarea loses focus. |
| `input` | `Event` | Emitted on native `input` event (same as `update:modelValue` but includes the raw event). |

## Slots
None currently. (Future extension could include a slot for a label or helper text.)

## ARIA Attributes
- `role="textbox"` (implicitly set by `<textarea>`)
- `aria-multiline="true"`
- `aria-label` / `aria-labelledby` (passed via `$attrs`)
- `aria-describedby` (passed via `$attrs`)
- `aria-invalid` (automatically set based on validation state if needed)
- `aria-disabled="true"` when disabled
- `aria-readonly="true"` when readonly

## Data Attributes (for CSS targeting)
- `data-variant`: `'default'` | `'filled'`
- `data-resizable`: `''` when `resizable` is `true` (omitted when `false`)
- `data-disabled`: `''` when `disabled` is `true`
- `data-has-value`: `''` when `modelValue.length > 0`
- `data-counter-visible`: `''` when `showCounter` is `true`
- `data-counter-exceeded`: `''` when `modelValue.length > maxLength` (if `maxLength` defined)

## Functional Utilities Usage
Leverage existing utilities from `src/utils/functional.ts` to write declarative, composable logic and avoid ternary operators.

### Key Utilities
- `truthy` – check for truthy values (e.g., for attribute presence)
- `when` – conditionally compute values for data attributes
- `unless` – opposite of `when`
- `clamp` – for character count validation
- `compose` – compose functions for transformations
- `curry2`, `curry3` – for currying functions
- `partial` – partial application

### Example: Computing Data Attributes
Instead of ternary expressions, use `when` to conditionally add attributes:
```typescript
const dataAttributes = computed(() => ({
  'data-variant': props.variant,
  'data-resizable': when(props.resizable, () => ''),
  'data-disabled': when(props.disabled, () => ''),
  'data-has-value': when(modelValue.value.length > 0, () => ''),
  'data-counter-visible': when(props.showCounter, () => ''),
  'data-counter-exceeded': when(
    () => props.maxLength !== undefined && modelValue.value.length > props.maxLength,
    () => ''
  ),
}))
```

### Example: ARIA Invalid State
Use a computed property that returns `'true'` or `'false'` (or `undefined`):
```typescript
const ariaInvalid = computed(() =>
  when(
    () => props.maxLength !== undefined && modelValue.value.length > props.maxLength,
    () => 'true' as const
  )
)
```

### Example: Character Counter Label
Compose a function that generates the screen‑reader label:
```typescript
const counterAriaLabel = computed(() => {
  const length = modelValue.value.length
  const max = props.maxLength
  return when(max !== undefined,
    () => `${length} characters out of ${max}`,
    () => `${length} characters`
  )
})
```

### Embrace Functional Composition
Where possible, define pure functions that transform state and compose them using `compose` or `partial`. For example, a validation function that can be reused.

## Component Structure

### Template
```vue
<template>
  <div class="text-area" v-bind="dataAttributes">
    <textarea
      v-bind="attrs"
      :value="modelValue"
      :rows="rows"
      :cols="cols"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      class="text-area__textarea"
    />
    <div
      v-if="showCounter"
      class="text-area__counter"
      aria-live="polite"
      :aria-label="counterAriaLabel"
    >
      {{ modelValue.length }}<span v-if="maxLength"> / {{ maxLength }}</span>
    </div>
  </div>
</template>
```

### Script
- Use `defineProps` and `defineModel` (Vue 3.3+).
- Use `useAttrs` to capture non‑prop attributes.
- Compute data attributes via `computed` using `when` helper.
- Compute `counterAriaLabel` for screen readers (e.g., “X characters out of Y”).
- Implement `onInput`, `onFocus`, `onBlur` handlers.

### Styles
- Follow **WordPress CSS property ordering** as per coding guidelines.
- Use design tokens (`var(--token‑name)`) for colors, spacing, etc.
- Variant styles copied from TextField with adjustments for `<textarea>`.
- Responsive adjustments using token breakpoints.
- Customize resize handle appearance (optional).

## Character Count Feature
- Displayed as a small text below the textarea, right‑aligned.
- Use `aria-live="polite"` to announce changes to screen readers.
- When `maxLength` is provided, show “X / Y” format.
- If `modelValue.length > maxLength`, apply visual error state (red text) and set `aria-invalid="true"`.

## Resizable Control
- Default `resizable: true` allows browser‑default resize (usually `vertical`).
- When `resizable: false`, apply `resize: none`.
- Could offer granular control (`resize: 'vertical' | 'horizontal' | 'both' | 'none'`) but kept simple for now.

## Unit Tests
- Test rendering with default props.
- Test variant and attribute propagation.
- Test `resizable` CSS.
- Test character count visibility and formatting.
- Test `maxLength` attribute and validation.
- Test event emissions.
- Test disabled and readonly states.

## Integration into DemoPage
Add a new card in `DemoPage.vue` showcasing:
- Default textarea
- Filled variant
- With character counter and maxLength
- Disabled state
- Resizable toggle (maybe with a switch)
- Example with placeholder and rows.

## Open Questions
1. Should `resizable` be a boolean or an enum (`'none' | 'vertical' | 'horizontal' | 'both'`)? Currently boolean.
2. Should we support auto‑expand (height grows with content)? Not required for MVP.
3. Should `showCounter` be automatically enabled when `maxLength` is provided? Could be optional; keep separate.

## Next Steps
1. Create component file `src/components/text-area/TextArea.vue`.
2. Write unit test file `TextArea.test.ts`.
3. Update `src/components/index.ts` export (if exists).
4. Add demo to `DemoPage.vue`.
5. Run linting and tests.

## References
- [TextField component](/src/components/text-field/TextField.vue)
- [CheckBox component](/src/components/checkbox/CheckBox.vue)
- [Coding Guidelines](/coding-guidelines/coding-guidelines.md)
- [Functional Utilities](/src/utils/functional.ts)