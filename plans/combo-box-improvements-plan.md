# ComboBox Improvements Plan

## Objectives
1. Enhance caret button visual design and animation to match Apple aesthetics.
2. Refactor component logic using functional programming techniques.
3. Update coding guidelines to reflect new patterns.

## Detailed Implementation Steps

### 1. Caret Button Styling & Animation
- **Modify CSS in `ComboBox.vue`**:
  - Change `.combo-box__toggle` `border-radius` from `var(--radius-full)` to `var(--radius-md)`.
  - Add `transition: transform 0.2s ease` (or extend existing transition).
  - Add rule `.combo-box[data-expanded] .combo-box__toggle { transform: rotate(180deg); }`.
  - Ensure the icon remains vertically/horizontally centered (current `display: flex` with `align-items: center; justify-content: center` is sufficient).
- **Verify visual appearance**:
  - Test in demo page to ensure rounded‑square shape and smooth rotation.
  - Confirm hover and active states still work.

### 2. Keyboard Navigation Refactoring (Dispatch Map)
- **Extract key handlers**:
  - Create pure functions `handleArrowDown`, `handleArrowUp`, `handleEnter`, `handleEscape`, `handleTab` (or `handleShiftTab`) that accept component state and return new state (or side effects).
  - Because Vue component state is reactive, we can keep handlers as methods but make them independent of `this` by passing needed state as arguments.
- **Define dispatch map**:
  ```typescript
  const keyHandlers: Record<string, (event: KeyboardEvent) => void> = {
    ArrowDown: handleArrowDown,
    ArrowUp: handleArrowUp,
    Enter: handleEnter,
    Escape: handleEscape,
    Tab: handleTab,
    Shift: handleTab,
  }
  ```
- **Update `onKeydown` function**:
  - Look up handler; if exists, call `event.preventDefault()` and invoke handler.
  - Keep fallback for unhandled keys.
- **Ensure backward compatibility**:
  - All existing keyboard behavior must remain unchanged.
- **Add unit tests**:
  - Verify each key handler is called correctly.
  - Ensure event prevention works.

### 3. Active Item Management
- **Option A: Convert to computed property**:
  - Create `activeItem` computed that returns the first item in `filteredItems` if the current active item is not in the list.
  - This may require storing an `activeIndex` ref to preserve selection across filtering.
- **Option B: Keep watch but extract logic**:
  - Create a helper `keepActiveItemInList(activeItemRef, filteredItems)` that updates `activeItemRef` when needed.
  - Call it inside the watch.
- **Decision**: Evaluate complexity; Option B may be simpler and less invasive.
- **Implement chosen option** and update tests accordingly.

### 4. New Functional Utilities (Optional)
- **Add `when` and `unless` to `src/utils/functional.ts`**:
  - `when(cond, action)` – if `cond` is truthy, call `action` and return its result, else return `undefined`.
  - `unless(cond, action)` – opposite of `when`.
- **Add `cycle` helper**:
  - `cycle<T>(array: T[], currentIndex: number, direction: 1 | -1): T` returns the next/previous element with wrap‑around.
- **Add `dispatchMap` utility** (if desired):
  - Generic function that creates a dispatcher from a map.
- **Update `coding-guidelines.md`** to mention these new utilities.

### 5. Update Coding Guidelines
- **Insert new section "Functional Patterns in Vue Components"** (see draft).
- **Add examples** from the refactored ComboBox (keyboard dispatch map, conditional execution).
- **Update "Utility Functions" list** with newly added functions.
- **Ensure formatting follows existing style**.

### 6. Testing & Validation
- **Run existing unit tests** (`pnpm test:unit`) to ensure no regression.
- **Add new unit tests** for:
  - Caret rotation CSS class application (via `data-expanded` attribute).
  - Keyboard dispatch map coverage.
  - Active item reset behavior.
- **Manual visual verification** using the demo page.

## Dependencies
- No external dependencies required.
- Changes are confined to `src/components/combo-box/ComboBox.vue`, `src/utils/functional.ts`, and `coding-guidelines/coding-guidelines.md`.

## Success Criteria
- Caret button appears as a rounded square (not a circle) and rotates smoothly when dropdown opens/closes.
- Keyboard navigation works identically to before.
- Component logic uses at least one new functional pattern (dispatch map, extracted helpers).
- Coding guidelines updated with clear, actionable recommendations.
- All tests pass.

## Next Steps
1. Present this plan to the user for approval.
2. Upon approval, switch to **Code** mode to implement the changes.
3. After implementation, run tests and linting, then commit.

---