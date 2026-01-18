# Checkbox Component Implementation Plan

## Overview
Implement an Apple‑inspired checkbox component that follows minimum WAI ARIA guidelines, with support for tri‑state (checked, unchecked, indeterminate) and native form compatibility.

## Component API

### Props
- `checked` (`boolean`, default `false`) – controlled checked state (supports `v‑model`).
- `indeterminate` (`boolean`, default `false`) – visual indeterminate state (overrides `checked` for ARIA `aria‑checked="mixed"`).
- `disabled` (`boolean`, default `false`) – disables interaction and applies disabled styles.
- `id` (`string`, optional) – `id` attribute for the native `<input>`; if omitted, a unique ID will be generated (or omitted).
- `name` (`string`, optional) – `name` attribute for form submission.
- `value` (`string`, optional) – `value` attribute for the checkbox (useful when inside a form).
- `true‑value` (`any`, optional) – value to use when checked (default `true`).
- `false‑value` (`any`, optional) – value to use when unchecked (default `false`).
- `aria‑label` (`string`, optional) – accessible label if no external label is present.
- `aria‑labelledby` (`string`, optional) – ID of an element that labels the checkbox.

### Events
- `update:checked` – emitted when the checked state changes (used for `v‑model`).
- `change` – emitted with the new boolean value (or indeterminate?) when the checkbox is toggled.
- `click` – forwarded native click event.

### Slots
- **default** – optional custom visual content (e.g., an icon) inside the custom box? Probably not needed.
- **label** – not included; label should be a separate `<label>` element using `for` attribute.

### Design Tokens
- **Size**: `--checkbox-size: var(--space-4)` (16px) – matches Apple's default checkbox size.
- **Border radius**: `--radius-sm` (4px) – slightly rounded corners.
- **Checked color**: `--color-blue` (light/dark theme).
- **Border color**: `--color-gray` (default), `--color-gray4` (hover), `--color-blue` (checked).
- **Disabled opacity**: `--opacity-50`.

### Accessibility Features
- Native `<input type="checkbox">` hidden but kept for form compatibility and built‑in semantics.
- Custom visual `<span>` with `aria‑hidden="true"`.
- Root element wraps both, ensuring click events toggle the native input.
- Keyboard support:
  - **Space** toggles the checkbox (native default).
  - **Enter** maybe also toggles (optional, but follows Apple?).
- ARIA attributes:
  - `aria‑checked`: `"true"`, `"false"`, or `"mixed"` (when indeterminate).
  - `aria‑disabled`: reflects `disabled` prop.
  - `aria‑label` / `aria‑labelledby` if provided.

### CSS Structure
Follow WordPress CSS property ordering (Display, Positioning, Box Model, Colors & Typography, Other).
Use SCSS nesting sparingly (depth ≤ 3).

### Files to Create
1. `src/components/checkbox/Checkbox.vue`
2. `src/components/checkbox/Checkbox.test.ts`
3. Update `src/page/DemoPage.vue` to include demo examples.

### Implementation Steps
1. Analyze existing component patterns (PushButton, SwitchToggle, TextField).
2. Define TypeScript types and props.
3. Create Vue component with hidden input and styled visual box.
4. Implement indeterminate visual (dash/minus icon) using CSS pseudo‑element or SVG.
5. Apply CSS with design tokens and proper ordering.
6. Write comprehensive unit tests (rendering, props, events, keyboard interaction).
7. Integrate into DemoPage with examples (checked, unchecked, indeterminate, disabled).
8. Verify accessibility with screen‑reader testing (manual).

### Visual Design Reference
- Apple checkbox: square with rounded corners (≈4px), blue fill when checked, white checkmark.
- Indeterminate: blue fill with a minus sign (‑) or dash.
- Focus ring: `outline: 2px solid var(--color‑blue)` with offset.
- Hover: slight darkening of border.

### Open Questions
- Should `indeterminate` be a separate state that can be toggled by user click? Typically clicking an indeterminate checkbox sets it to checked (or unchecked). We'll follow platform behavior: clicking toggles `checked` and clears `indeterminate`.
- Should we support `size` prop (small, medium, large) or rely on CSS custom properties? Keep simple for now.

### Dependencies
- Vue 3, TypeScript, Vitest, `@vue/test‑utils`.
- Existing design tokens (`src/styles/tokens/`).
- Utility functions (`truthy`, `existy`) from `src/utils/functional.ts`.

### Success Criteria
- Component passes all unit tests.
- Demo page shows all states and interactions.
- Keyboard navigation works (Space toggles).
- ARIA attributes are correctly applied.
- CSS follows project guidelines (WordPress order).