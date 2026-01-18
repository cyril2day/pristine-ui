# Coding Guidelines

This document outlines the coding standards and preferences for this project.

## TypeScript

### Types vs Interfaces

- **Prefer `type` over `interface`** for defining object shapes, unions, and intersections.
- Use `interface` only when you need declaration merging (which should be rare).
- Example:

```typescript
// Good
type User = {
  id: number;
  name: string;
};

// Avoid
interface IUser {
  id: number;
  name: string;
}
```

### Classes

- **Avoid classes** in JavaScript/TypeScript unless absolutely necessary (e.g., when integrating with a library that expects class instances).
- Prefer plain objects and functions for data modeling and behavior.
- Use factory functions or constructor functions that return plain objects if you need encapsulation.
- Example:

```typescript
// Good: factory function
function createUser(id: number, name: string) {
  return { id, name };
}

// Avoid: class
class User {
  constructor(public id: number, public name: string) {}
}
```

### Functional Programming

- Embrace functional programming principles: immutability, pure functions, and higher‑order functions.
- Use the Underscore library for common functional operations (map, filter, reduce, etc.).
- Write small, composable functions that do one thing well.

### Utility Functions

The project includes a set of reusable functional utilities in `src/utils/`. These functions follow the discipline described in “Functional JavaScript” (Chapter 1).

Key functions:

- `existy(x)` – checks that `x` is neither `null` nor `undefined`.
- `truthy(x)` – checks that `x` is not `false` and passes `existy`.
- `doWhen(cond, action)` – executes `action` only when `cond` is truthy.
- `executeIfHasField(target, name)` – safely retrieves a property (or method result) from `target` if it exists.
- `when(condition, fn)` – returns `fn()` if condition truthy, otherwise undefined.
- `unless(condition, fn)` – opposite of `when`.
- `clamp(min, max, value)` – ensures value is within bounds.
- `clampIndex(length, index)` – clamps index to valid array indices (0 ≤ index < length) or returns -1.
- `cycleIndex(current, delta, length)` – cycles through array indices with wrap‑around.
- `containsIgnoreCase(str, substr)` – case‑insensitive substring check, curried for reuse.

Refer to the source files for exact signatures and usage examples.

**Patterns in UI Components:**
Prefer dispatch maps over long `switch` statements for keyboard event handling. Create a plain object mapping keys to pure state transformers, leading to more declarative and testable code.

## CSS (Vue Components)

When writing CSS/SCSS within Vue component `<style>` blocks, follow the **WordPress CSS Coding Standards** for property ordering. This ensures consistency and improves readability.

### Property Order

Declare related properties in the following order:

1. **Display** – properties that affect how an element is displayed.
   - `display`, `visibility`, `opacity`, `z‑index`, `content`, `list‑style‑type`, `list‑style‑position`, `list‑style‑image`, `list‑style`, `pointer‑events`, `cursor`, `user‑select`, `box‑sizing`

2. **Positioning** – properties that affect the position of an element.
   - `position`, `top`, `right`, `bottom`, `left`, `float`, `clear`, `clip`, `clip‑path`, `overflow`, `overflow‑x`, `overflow‑y`, `overscroll‑behavior`, `scroll‑behavior`

3. **Box Model** – properties that define the dimensions, margins, paddings, and borders.
   - `width`, `min‑width`, `max‑width`, `height`, `min‑height`, `max‑height`, `margin`, `margin‑top`, `margin‑right`, `margin‑bottom`, `margin‑left`, `padding`, `padding‑top`, `padding‑right`, `padding‑bottom`, `padding‑left`, `border`, `border‑width`, `border‑style`, `border‑color`, `border‑radius`, `border‑collapse`, `border‑spacing`, `outline`, `outline‑width`, `outline‑style`, `outline‑color`, `outline‑offset`

4. **Colors & Typography** – properties that define colors, backgrounds, fonts, and text.
   - `color`, `background`, `background‑color`, `background‑image`, `background‑repeat`, `background‑position`, `background‑size`, `background‑clip`, `background‑origin`, `background‑attachment`, `font`, `font‑family`, `font‑size`, `font‑weight`, `font‑style`, `font‑variant`, `line‑height`, `letter‑spacing`, `text‑align`, `text‑decoration`, `text‑transform`, `text‑indent`, `text‑overflow`, `text‑shadow`, `white‑space`, `word‑break`, `word‑spacing`, `word‑wrap`, `vertical‑align`

5. **Other** – all remaining properties, including transitions, transforms, animations, and miscellaneous visual effects.
   - `transition`, `transition‑property`, `transition‑duration`, `transition‑timing‑function`, `transition‑delay`, `transform`, `transform‑origin`, `transform‑style`, `animation`, `animation‑name`, `animation‑duration`, `animation‑timing‑function`, `animation‑delay`, `animation‑iteration‑count`, `animation‑direction`, `animation‑fill‑mode`, `animation‑play‑state`, `filter`, `backdrop‑filter`, `mix‑blend‑mode`, `isolation`, `object‑fit`, `object‑position`, `resize`, `appearance`

### Notes

- Within each group, order properties alphabetically (optional but recommended for consistency).
- Use SCSS nesting sparingly; keep nesting depth ≤ 3.
- Always use design tokens (`var(--token‑name)`) for colors, spacing, typography, etc.
- Prefer HSL/HSLA for color definitions in custom properties (the project’s design tokens already follow this convention).
- This ordering applies only to styles written inside Vue component `<style>` blocks; the global `src/styles/` folder is exempt.

### Example

```scss
.button {
  // Display
  display: inline-flex;
  opacity: var(--opacity-100);
  z-index: var(--z-index-base);

  // Positioning
  position: relative;
  top: 0;
  left: 0;

  // Box Model
  width: 100%;
  padding: var(--space-4);
  border: var(--border-width-1) solid var(--color-gray);
  border-radius: var(--radius-lg);

  // Colors & Typography
  color: var(--text-primary);
  background-color: var(--color-white);
  font-family: var(--font-family-sans);
  font-size: var(--text-base);

  // Other
  transition: background-color 0.2s ease;
  transform: translateY(0);
}
```

## General Style

- Use **2‑space indentation**.
- Use **double quotes** for strings (as configured in the project’s ESLint).
- Always run `pnpm lint` before committing to ensure consistency.

## Documentation

- Document public functions with JSDoc comments.
- Keep internal comments concise and focused on the “why” rather than the “what”.

---

*Last updated: 2026‑01‑17*