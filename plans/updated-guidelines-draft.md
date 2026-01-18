# Updated Coding Guidelines (Draft)

## Functional Programming (Additions)

### Functional Patterns in Vue Components

When building Vue components, leverage functional programming principles to create more declarative, testable, and maintainable code.

#### 1. Dispatch Maps for Keyboard Navigation

Avoid lengthy `switch` statements for handling keyboard events. Instead, define a dispatch map that maps key names to handler functions, and look up the handler in the event listener.

**Example (before):**
```typescript
switch (key) {
  case 'ArrowDown':
    // ... logic
    break
  case 'ArrowUp':
    // ... logic
    break
  // ... more cases
}
```

**Example (after):**
```typescript
const keyHandlers: Record<string, (event: KeyboardEvent) => void> = {
  ArrowDown: handleArrowDown,
  ArrowUp: handleArrowUp,
  Enter: handleEnter,
  Escape: handleEscape,
}

function onKeydown(event: KeyboardEvent) {
  const handler = keyHandlers[event.key]
  if (handler) {
    event.preventDefault()
    handler(event)
  }
}
```

This pattern makes it easy to add or modify key bindings, and separates each handler into a pure function that can be tested independently.

#### 2. Higher‑Order Functions for Conditional Execution

Use `doWhen`, `when`, or `unless` (if available) to express conditional logic as function composition.

**Example:**
```typescript
doWhen(truthy(!props.disabled), () => {
  // action
})
```

Consider creating a `when` function that returns a closure:

```typescript
const when = (cond: boolean) => (fn: () => void) => cond ? fn() : undefined
```

#### 3. Prefer Computed Properties over Watchers

Whenever possible, derive reactive state using `computed` rather than `watch`. Computed properties are declarative and automatically track their dependencies, reducing side‑effect bugs.

**Example (before):**
```typescript
watch(filteredItems, (newItems) => {
  if (!newItems.some(item => item.id === activeItem.value?.id)) {
    setActiveItem(newItems.length > 0 ? newItems[0] : null)
  }
})
```

**Example (after):**
```typescript
const activeItem = computed(() => {
  const items = filteredItems.value
  const current = activeItemRef.value
  if (current && items.some(item => item.id === current.id)) {
    return current
  }
  return items.length > 0 ? items[0] : null
})
```

Note: This may require refactoring to avoid circular dependencies.

#### 4. Currying and Partial Application

Use the existing `curry`, `curry2`, `curry3`, and `partial` utilities to create specialized functions from general ones.

**Example:**
```typescript
const containsIgnoreCase = curry2((needle: string, haystack: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase())
)

const matchesInput = (input: string) => (item: Item) =>
  containsIgnoreCase(input, plucker('label')(item))
```

#### 5. Extract Side Effects into Composable Functions

Isolate side‑effects (e.g., event listeners, timers, API calls) into custom composables. This keeps component scripts focused on view‑specific logic and improves reusability.

**Example:**
```typescript
// useClickOutside.ts
export function useClickOutside(rootRef, callback) {
  // ... implementation
}

// In component:
const { rootRef } = useClickOutside(() => closeDropdown())
```

#### 6. Use Existing Functional Utilities

The project provides a rich set of functional utilities in `src/utils/functional.ts`. Familiarize yourself with functions like `complement`, `plucker`, `invoker`, `finder`, `best`, `cat`, `construct`, `mapcat`, `dispatch`, etc. Use them to avoid reinventing common patterns.

### Updates to Utility Functions Section

Add descriptions for the following utilities (if they are added):

- **`when(cond, action)`** – executes `action` only when `cond` is truthy, returns the result or `undefined`.
- **`unless(cond, action)`** – executes `action` only when `cond` is falsy.
- **`dispatchMap(map)`** – creates a dispatcher function that looks up a handler in a map.
- **`cycle(array, direction)`** – returns the next element in a circular array, useful for keyboard navigation.

### CSS Guidelines

No changes required.

---