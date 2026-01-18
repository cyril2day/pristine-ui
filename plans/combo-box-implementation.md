# ComboBox Component Implementation Plan

## Overview
Implement a Vue 3 ComboBox component inspired by macOS design aesthetics and WAI ARIA combobox pattern. The component will support single‑select, editable filtering, keyboard navigation, and adhere to the project's existing coding patterns and design tokens. Functional utilities will be used where appropriate to maintain functional discipline.

## Component Structure

The ComboBox component will be a single‑file Vue component (`ComboBox.vue`) with the following high‑level structure:

```vue
<template>
  <div class="combo-box" :data-variant="variant" :data-expanded="isOpen" ...>
    <input
      ref="inputRef"
      v-bind="$attrs"
      :value="inputValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      aria-autocomplete="list"
      aria-expanded="isOpen"
      aria-controls="listbox-id"
      aria-activedescendant="activeId"
      role="combobox"
    />
    <button
      type="button"
      class="combo-box__toggle"
      @click="toggleOpen"
      tabindex="-1"
      aria-label="Toggle dropdown"
    >
      ▼
    </button>
    <ul
      v-if="isOpen"
      id="listbox-id"
      class="combo-box__listbox"
      role="listbox"
      aria-label="Options"
    >
      <li
        v-for="item in filteredItems"
        :key="item.id"
        :id="`option-${item.id}`"
        :class="{ 'combo-box__option--active': isActive(item) }"
        @click="selectItem(item)"
        @mouseenter="setActiveItem(item)"
        role="option"
        :aria-selected="isSelected(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Type definitions, props, emits, defineModel, reactive state, etc.
</script>

<style scoped lang="scss">
// Styled according to macOS design tokens and CSS property ordering.
</style>
```

## Component Specifications

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ id: string \| number, label: string }>` | `[]` | List of selectable options. |
| `variant` | `'filled' \| 'default'` | `'default'` | Visual style matching TextField variants. |
| `disabled` | `boolean` | `false` | Disables the input and prevents interaction. |
| `placeholder` | `string` | `''` | Placeholder text for the input. |
| `modelValue` | `string` | `''` | Two‑way binding for the selected item's label (via `defineModel`). |

**Additional Attributes:** The component will use `inheritAttrs: false` and pass all unmatched attributes (e.g., `type`, `name`, `autocomplete`) directly to the underlying `<input>` element.

### Events

| Name | Payload | Description |
|------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the selected label changes. |
| `select` | `{ id: string \| number, label: string }` | Emitted when an item is selected (provides the full item). |
| `open` | `none` | Emitted when the dropdown opens. |
| `close` | `none` | Emitted when the dropdown closes. |
| `focus` | `FocusEvent` | Emitted when the input receives focus. |
| `blur` | `FocusEvent` | Emitted when the input loses focus. |

### Slots
No custom slots for this iteration.

### Data Attributes (for CSS Targeting)
Following the pattern established by existing components, the component will expose the following `data‑*` attributes on the root element:

- `data‑variant`: `'filled'` or `'default'`
- `data‑expanded`: present when the dropdown is open
- `data‑disabled`: present when `disabled` is `true`
- `data‑has‑value`: present when the input value is not empty

These attributes enable pure‑CSS styling of different states.

## Functional Behavior

### Filtering
- The input is editable; typing filters the `items` list by checking if the item's `label` contains the input text (case‑insensitive).
- Filtering is performed reactively using a computed property that returns a subset of `items`.
- When the input value changes and the dropdown is closed, it will automatically open (unless the value is empty?).

### Selection
- Clicking an item in the list sets `modelValue` to that item's `label`, closes the dropdown, and emits the `select` event.
- The input displays the selected label; the user can still edit it (which will re‑open the dropdown and re‑filter).
- If the user types a label that does not match any item, the dropdown may show no matches (empty state). The modelValue will remain the typed label.

### Keyboard Navigation
- **Arrow Down/Up**: Move the active descendant within the filtered list, scrolling if needed.
- **Enter**: Select the currently active item (if any) and close the dropdown.
- **Escape**: Close the dropdown without selecting.
- **Tab**: Move focus out of the combobox (closes the dropdown).
- **Shift+Tab**: Move focus backwards (closes the dropdown).

### Dropdown Toggle Button
- A button positioned on the right side of the input displays a downward‑pointing triangle (▼).
- It has `tabindex="-1"` to prevent keyboard focus, but remains clickable with mouse.
- Clicking the button toggles the dropdown (open/close).

### Click‑Outside Closing
- The dropdown will close when the user clicks anywhere outside the component (including the toggle button). This will be implemented using a Vue directive or a composable (e.g., `useClickOutside`).

## Styling & Design Tokens

### macOS Design Inspiration
- Rounded corners (`--radius-md` or `--radius-lg`)
- Subtle inner shadow (simulated with a light inset box‑shadow)
- Focused glow (thin blue outline with soft shadow, using `--color‑blue`)
- Variants as defined for TextField:
  - **Filled variant**: solid background (`--color‑gray5` in light theme)
  - **Default variant**: thin border with transparent background
- Dropdown list styled as a floating panel with subtle shadow, matching Apple's popover appearance.

### CSS Structure
The component’s `<style>` block will be written in SCSS, following the **WordPress CSS property ordering** defined in the project’s coding guidelines.

Token usage:
- **Spacing**: `--space‑2`, `--space‑3`, `--space‑4` for internal paddings.
- **Typography**: `--font‑family‑sans`, `--text‑base`, `--text‑secondary` for placeholder.
- **Colors**: `--text‑primary`, `--color‑gray`, `--color‑blue`, `--color‑white`, `--color‑black`.
- **Border radius**: `--radius‑md` for default, `--radius‑lg` for filled variant.
- **Transition**: `transition: border‑color 0.2s ease, box‑shadow 0.2s ease;`

### Responsive Considerations
- Use the existing `respond‑to` mixin for breakpoint‑specific adjustments (e.g., smaller padding on small phones).

## Accessibility

The component will implement the [WAI‑ARIA 1.2 Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):

- `role="combobox"` on the input element.
- `aria‑expanded` indicates whether the listbox is visible.
- `aria‑controls` points to the `id` of the listbox.
- `aria‑activedescendant` points to the `id` of the currently active option (if any).
- `aria‑autocomplete="list"` indicates that the autocomplete behavior is list‑based.
- Each option has `role="option"` and `aria‑selected` where appropriate.
- The toggle button has `aria‑label="Toggle dropdown"`.
- Keyboard navigation follows the ARIA keyboard interaction model.

## Functional Utilities Integration

The component will demonstrate advanced functional composition by leveraging utilities from `src/utils/functional.ts` alongside Underscore’s `compose`, `filter`, `curry`, etc. Example for filtering:

```ts
import { filter, compose, contains } from 'underscore'
import { plucker, curry, complement } from '@/utils'

const getLabel = plucker('label')
const containsIgnoreCase = curry((needle, haystack) =>
  haystack.toLowerCase().includes(needle.toLowerCase())
)
const matchesInput = (input: string) => compose(containsIgnoreCase(input), getLabel)
const filterItems = (items: Item[], input: string) => filter(items, matchesInput(input))
```

Other functional patterns:

- `truthy` / `existy` for conditional checks in computed properties.
- `doWhen` to conditionally execute side‑effects (e.g., opening the dropdown when input receives focus).
- `complement` to invert predicates (e.g., filtering out disabled items).
- `curry` / `partial` to create specialized functions (e.g., a curried event handler).
- `dispatch` for handling multiple event types with a single function.
- `iterateUntil` for keyboard navigation cycling through items.

This approach ensures the code adheres to functional discipline—immutability, pure functions, and composition—as described in the project’s coding guidelines.

## Testing Strategy

- Unit tests will be written with Vitest and Vue Test Utils, following the pattern of `TextField.test.ts`.
- Test cases will cover:
  - Rendering with default props
  - Applying each variant and boolean prop correctly
  - Data‑attribute generation
  - Dropdown toggle behavior (click, keyboard)
  - Filtering functionality
  - Item selection (click, keyboard)
  - Event emission (select, open, close, focus, blur)
  - Disabled state and attribute forwarding
  - Click‑outside closing
- Tests will be placed in `src/components/combo‑box/ComboBox.test.ts`.

## Integration into DemoPage

- Add a new card in `src/page/DemoPage.vue` showcasing:
  - Both variants (filled & default)
  - Example with a static list of items
  - Disabled state example
  - Example with placeholder
  - Live display of selected label
- Update the page’s grid layout to accommodate the new card.

## Implementation Steps

1. **Analyze requirements and define component spec** (this document).
2. **Create component directory and boilerplate files** (`src/components/combo‑box/`).
3. **Define TypeScript types** for props, emits, and internal state.
4. **Implement template** with proper HTML structure, ARIA attributes, and data attributes.
5. **Implement script logic**: filtering, keyboard navigation, open/close state, click outside.
6. **Integrate functional utilities** where applicable.
7. **Apply CSS styling** following macOS design tokens and property ordering.
8. **Write unit tests** for the component.
9. **Integrate component into DemoPage** for demonstration.
10. **Review and finalize** the implementation.

## Dependencies

- Vue 3.4+ (for `defineModel`)
- Existing design tokens (`src/styles/tokens/`)
- Functional utilities (`src/utils/functional.ts`)
- No external libraries for dropdown positioning; use plain CSS positioning.

## Open Questions / Decisions

- Should the dropdown automatically open when the input receives focus? (Current plan: yes, if there are items.)
- Should we support a “no results” message when the filtered list is empty? (Deferred for minimal implementation.)
- Should we support clearing the input via a separate clear button (like TextField)? (Deferred; can be added later.)
- Should we support `valueKey` and `labelKey` props for flexible item shapes? (Deferred; assume `id`/`label` for now.)

---
*Plan created: 2026‑01‑17*