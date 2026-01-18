# Functional Refinements for ComboBox Logic

## Goal
Transform the ComboBox component's imperative patterns into elegant, fluid functional compositions that can be reused across other components.

## Key Patterns Identified

### 1. Currying and Partial Application
- Use `curry2` from `src/utils/functional.ts` to create reusable predicate builders.
- Example: `containsIgnoreCase` can be curried for easier composition.

**Current:**
```typescript
const containsIgnoreCase = (needle: string, haystack: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase())
```

**Improved:**
```typescript
import { curry2 } from '@/utils'

const containsIgnoreCase = curry2(
  (needle: string, haystack: string) =>
    haystack.toLowerCase().includes(needle.toLowerCase())
)

// Now can be used as:
const matchesInput = (input: string) => (item: Item) =>
  containsIgnoreCase(input, plucker('label')(item))
```

### 2. Dispatch Map for Keyboard Navigation
Replace the `switch` statement with a map from key to pure handler functions. Each handler receives the component's reactive state and returns a new state (or side effects). This makes it easy to test and extend.

**Current:** 47‑line switch block.

**Proposed:**
```typescript
import { doWhen, truthy } from '@/utils'

// Pure functions that compute new state
const moveActiveIndex = (delta: 1 | -1) => (state: ComboBoxState) => {
  const { filteredItems, activeIndex } = state
  if (filteredItems.length === 0) return state
  const newIndex = (activeIndex + delta + filteredItems.length) % filteredItems.length
  return { ...state, activeIndex: newIndex }
}

const selectActiveItem = (state: ComboBoxState) => {
  const { filteredItems, activeIndex } = state
  const item = filteredItems[activeIndex]
  if (item) {
    // side effect: emit select, update modelValue, close dropdown
    // return new state with isOpen: false
    return { ...state, isOpen: false }
  }
  return state
}

// Map keys to state transformers
const keyHandlers: Record<string, (state: ComboBoxState) => ComboBoxState> = {
  ArrowDown: moveActiveIndex(1),
  ArrowUp: moveActiveIndex(-1),
  Enter: selectActiveItem,
  Escape: (state) => ({ ...state, isOpen: false }),
}

// In component, call handler with current state and apply changes
function onKeydown(event: KeyboardEvent) {
  const handler = keyHandlers[event.key]
  if (handler) {
    event.preventDefault()
    const newState = handler(currentState)
    applyState(newState)
  }
}
```

**Note:** This pattern separates pure state transformation from side effects (emitting events, focusing input). Side effects can be handled after applying the state.

### 3. Active Index Management via Clamp
Store `activeIndex` instead of `activeItem`. Use a computed `activeItem` derived from `filteredItems` and `activeIndex`. When `filteredItems` changes, clamp `activeIndex` to stay within bounds.

**Utility functions:**
```typescript
const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value))

const clampIndex = (index: number, length: number) =>
  length === 0 ? -1 : clamp(0, length - 1, index)
```

**Implementation:**
```typescript
const activeIndex = ref(0)
const activeItem = computed(() => filteredItems.value[activeIndex.value] ?? null)

watch(filteredItems, (newItems) => {
  activeIndex.value = clampIndex(activeIndex.value, newItems.length)
})
```

### 4. Composable Conditional Execution
Create a `when` and `unless` utility for more readable conditional logic.

**Add to `src/utils/functional.ts`:**
```typescript
export function when<T>(cond: boolean, fn: () => T): T | undefined {
  return cond ? fn() : undefined
}

export function unless<T>(cond: boolean, fn: () => T): T | undefined {
  return !cond ? fn() : undefined
}
```

**Usage:**
```typescript
function toggleOpen() {
  when(truthy(!props.disabled), () => {
    if (isOpen.value) closeDropdown()
    else openDropdown()
  })
}
```

### 5. Extract Side Effects into Composable Hooks
Create reusable hooks for common patterns:

- `useClickOutside(rootRef, callback)`
- `useKeyboardNavigation(listLength, { onNext, onPrevious })`
- `useFilteredList(items, getText, filterText)`

These hooks can be implemented using functional composition and can be shared across components.

### 6. Function Composition for Filtering
Use `compose` from Underscore to build the filtering pipeline.

**Example:**
```typescript
import { compose, filter } from 'underscore'

const getLabel = plucker('label')
const matchesInput = (input: string) => (item: Item) =>
  containsIgnoreCase(input, getLabel(item))

const filteredItems = computed(() => {
  if (!modelValue.value) return props.items
  return compose(
    filter(matchesInput(modelValue.value))
  )(props.items)
})
```

This is more declarative but may be overkill for a simple filter.

## Recommended Implementation Steps

1. **Add new utilities** (`when`, `unless`, `clamp`, `clampIndex`, `cycleIndex`) to `src/utils/functional.ts`.
2. **Refactor filtering** to use curried `containsIgnoreCase`.
3. **Introduce `activeIndex`** and computed `activeItem`.
4. **Implement keyboard dispatch map** with pure state transformers.
5. **Extract click‑outside logic** into a composable (optional but good for reuse).
6. **Update CSS** for caret as previously planned.
7. **Update coding guidelines** with examples of these patterns.

## Benefits
- **Testability**: Pure functions can be unit‑tested without Vue.
- **Reusability**: Utilities like `cycleIndex`, `clampIndex` can be used in other list‑navigation components (e.g., carousel, dropdown).
- **Readability**: Dispatch map makes key bindings explicit and easy to modify.
- **Consistency**: Encourages functional patterns across the codebase.

## Trade‑offs
- Increased abstraction may add complexity for developers unfamiliar with functional programming.
- Some patterns (like pure state transformers) may require more boilerplate for side effects.
- Need to ensure performance is not impacted (e.g., creating new state objects on each keypress).

## Next Steps
Present this refined plan to the user for feedback, then implement in Code mode.

---