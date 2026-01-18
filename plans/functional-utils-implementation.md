# Functional Utilities Implementation Plan

This document outlines the implementation of the four core functions from “A Taste of Functional JavaScript” (Chapter 1).

## Functions

### `existy`

**Signature:** `existy(x: any): boolean`

Checks that `x` is neither `null` nor `undefined`.

```typescript
/**
 * Returns `true` if `x` is not `null` and not `undefined`.
 */
export function existy(x: any): boolean {
  return x != null;
}
```

### `truthy`

**Signature:** `truthy(x: any): boolean`

Checks that `x` is not `false` and passes `existy`.

```typescript
/**
 * Returns `true` if `x` is not `false` and `existy(x)` is true.
 */
export function truthy(x: any): boolean {
  return (x !== false) && existy(x);
}
```

### `doWhen`

**Signature:** `doWhen(cond: any, action: () => any): any`

Executes `action` only when `cond` is truthy; otherwise returns `undefined`.

```typescript
/**
 * If `cond` is truthy, call `action` and return its result.
 * Otherwise return `undefined`.
 */
export function doWhen(cond: any, action: () => any): any {
  if (truthy(cond)) {
    return action();
  }
  return undefined;
}
```

### `executeIfHasField`

**Signature:** `executeIfHasField(target: any, name: string): any`

Uses `doWhen` to safely retrieve a property (or method result) from `target` if it exists.  
Relies on Underscore’s `_.result` function.

```typescript
import { result } from 'underscore';

/**
 * If `target[name]` exists, returns `_.result(target, name)` and logs the result.
 * Otherwise returns `undefined`.
 */
export function executeIfHasField(target: any, name: string): any {
  return doWhen(existy(target[name]), () => {
    const res = result(target, name);
    console.log(`The result is ${res}`);
    return res;
  });
}
```

## Project Structure

```
src/utils/
├── functional.ts   # contains the four functions above
└── index.ts        # re‑exports all utilities
```

### `src/utils/functional.ts`

The complete source file:

```typescript
import { result } from 'underscore';

export function existy(x: any): boolean {
  return x != null;
}

export function truthy(x: any): boolean {
  return (x !== false) && existy(x);
}

export function doWhen(cond: any, action: () => any): any {
  if (truthy(cond)) {
    return action();
  }
  return undefined;
}

export function executeIfHasField(target: any, name: string): any {
  return doWhen(existy(target[name]), () => {
    const res = result(target, name);
    console.log(`The result is ${res}`);
    return res;
  });
}
```

### `src/utils/index.ts`

```typescript
export * from './functional';
```

## Usage Example

```typescript
import { existy, truthy, doWhen, executeIfHasField } from '@/utils';

console.log(existy(null));          // false
console.log(truthy(0));             // true
console.log(doWhen(true, () => 42)); // 42

const obj = { foo: 'bar' };
executeIfHasField(obj, 'foo');      // logs “The result is bar” → returns “bar”
executeIfHasField(obj, 'baz');      // returns undefined
```

## Integration with Vue

To demonstrate the utilities in the existing Vue app, we can modify `src/App.vue` to include a small example in the `<script setup>` section.

```vue
<script setup lang="ts">
import { existy, truthy, doWhen, executeIfHasField } from '@/utils';

// Example usage
const testExisty = existy('hello'); // true
const testTruthy = truthy('');      // true
const testDoWhen = doWhen(testExisty, () => 'executed');
const testExecute = executeIfHasField({ greet: 'Hello World' }, 'greet');
</script>

<template>
  <div>
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the documentation
    </p>
    <p>Functional utilities are now available.</p>
  </div>
</template>
```

## Next Steps

1. Switch to **Code** mode.
2. Create the directory `src/utils/`.
3. Write the files `functional.ts` and `index.ts` as described.
4. Optionally update `src/App.vue` to include the example (or leave as is).
5. Verify that the project compiles and runs without errors.

## References

- “Functional JavaScript” – Chapter 1, “A Taste of Functional JavaScript”
- Underscore documentation: [`_.result`](https://underscorejs.org/#result)
