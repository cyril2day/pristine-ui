import { result, reduce, every, has, compose, countBy, identity } from 'underscore'

/**
 * Returns `true` if `x` is not `null` and not `undefined`.
 */
export function existy(x: unknown): boolean {
  return x != null
}

/**
 * Returns `true` if `x` is not `false` and `existy(x)` is true.
 */
export function truthy(x: unknown): boolean {
  return (x !== false) && existy(x)
}

/**
 * If `cond` is truthy, call `action` and return its result.
 * Otherwise return `undefined`.
 */
export function doWhen<T>(cond: unknown, action: () => T): T | undefined {
  if (truthy(cond)) {
    return action()
  }
  return undefined
}

/**
 * Executes `action` and returns its result when `cond` is `true`.
 * Otherwise returns `undefined`.
 */
export function when<T>(cond: boolean, action: () => T): T | undefined {
  return cond ? action() : undefined
}

/**
 * Executes `action` and returns its result when `cond` is `false`.
 * Otherwise returns `undefined`.
 */
export function unless<T>(cond: boolean, action: () => T): T | undefined {
  return !cond ? action() : undefined
}

/**
 * Clamps a numeric value between a lower and upper bound.
 */
export function clamp(min: number, max: number, value: number): number {
  if (min > max) throw new Error('min must be less than or equal to max')
  return Math.max(min, Math.min(max, value))
}

/**
 * Clamps an index to be within the bounds of an array (0 ≤ index < length).
 * Returns -1 if the array is empty.
 */
export function clampIndex(index: number, length: number): number {
  if (length <= 0) return -1
  return clamp(0, length - 1, index)
}

/**
 * Cycles an index within an array by a delta, wrapping around at boundaries.
 * Returns the new index.
 */
export function cycleIndex(current: number, delta: number, length: number): number {
  if (length <= 0) return -1
  return (current + delta + length) % length
}

/**
 * If `target[name]` exists, returns `_.result(target, name)` and logs the result.
 * Otherwise returns `undefined`.
 */
export function executeIfHasField(target: unknown, name: string): unknown {
  if (!existy(target)) return undefined
  return doWhen(existy((target as Record<string, unknown>)[name]), () => {
    const res = result(target, name)
    console.log(`The result is ${res}`)
    return res
  })
}

/**
 * Returns a function that extracts a property from an object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function plucker(key: string): (obj: any) => any {
  return function(obj) {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    }
    return undefined;
  };
}

/**
 * Returns a function that invokes a method on an object.
 * If the object does not have the method, returns undefined.
 */
export function invoker(methodName: string) {
  return function(target: unknown, ...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (target && typeof (target as any)[methodName] === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[methodName].apply(target, args);
    }
    return undefined;
  };
}

/**
 * Returns an array containing `value` repeated `n` times.
 */
export function repeat<T>(n: number, value: T): T[] {
  return Array.from({ length: n }, () => value);
}

/**
 * Returns an array of length `n` where each element is the result of calling `fn` with the index.
 */
export function repeatedly<T>(n: number, fn: (index: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

/**
 * Repeatedly applies `transform` to `seed`, collecting results in an array until `predicate` returns true.
 * The predicate is tested *before* including the next value (i.e., the seed is included only if predicate is false).
 * Returns the array of collected values (including the seed if predicate never becomes true).
 */
export function iterateUntil<T>(
  predicate: (val: T) => boolean,
  transform: (val: T) => T,
  seed: T
): T[] {
  const result: T[] = [];
  let current = seed;
  while (!predicate(current)) {
    result.push(current);
    current = transform(current);
  }
  return result;
}

/**
 * Returns the "best" element in a collection according to a value function and a comparison function.
 */
export function finder<T, V>(
  valueFun: (item: T) => V,
  bestFun: (a: V, b: V) => V,
  coll: T[]
): T | undefined {
  if (coll.length === 0) return undefined;
  return reduce(coll, function(best, current) {
    const bestValue = valueFun(best);
    const currentValue = valueFun(current);
    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

/**
 * Returns the element in a collection that is "best" according to a comparator function.
 */
export function best<T>(
  fun: (a: T, b: T) => boolean,
  coll: T[]
): T | undefined {
  if (coll.length === 0) return undefined;
  return reduce(coll, (x, y) => fun(x, y) ? x : y);
}

/**
 * Returns a function that always returns the given value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function always<T>(value: T): (...args: any[]) => T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  return (...args: any[]) => value;
}

/**
 * Returns a function that calls `fun` with arguments, replacing any `null` or `undefined` with the corresponding default value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fnull(fun: (...args: any[]) => any, ...defaults: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(...args: any[]) {
    const filled = args.map((arg, i) => {
      if (existy(arg)) return arg;
      // choose default for position i
      if (defaults.length === 1) {
        return defaults[0];
      }
      // if defaults[i] exists
      if (i < defaults.length) {
        return defaults[i];
      }
      // fallback to last default (if any)
      if (defaults.length > 0) {
        return defaults[defaults.length - 1];
      }
      // no defaults at all (should not happen because defaults at least one? Actually could be zero)
      return undefined;
    });
    return fun(...filled);
  };
}

/**
 * Returns a validator function that returns an error message if predicate fails.
 */
export function validator<T = unknown>(predicate: (x: T) => boolean, message: string) {
  function validate(x: T): string | undefined {
    return predicate(x) ? undefined : message;
  }
  (validate as unknown as { message: string }).message = message;
  return validate;
}

/**
 * Returns a function that checks if an object has all the specified keys.
 */
export function hasKeys(...keys: string[]) {
  return function(obj: unknown): boolean {
    if (!obj || typeof obj !== 'object') return false;
    return every(keys, (key) => has(obj, key));
  };
}

/**
 * Returns a checker function that runs multiple validators and returns the first error.
 */
export function checker<T = unknown>(...validators: ((x: T) => string | undefined)[]) {
  return function(x: T): string | undefined {
    for (const validator of validators) {
      const error = validator(x);
      if (error) return error;
    }
    return undefined;
  };
}

/**
 * Concatenates zero or more arrays into a single array.
 */
export function cat<T>(...arrays: T[][]): T[] {
  return arrays.reduce((acc, arr) => acc.concat(arr), []);
}

/**
 * Constructs an array with `head` as first element and `tail` as the rest.
 */
export function construct<T>(head: T, tail: T[]): T[] {
  return [head, ...tail];
}

/**
 * Takes a function expecting individual arguments and returns a function that takes an array of those arguments.
 */
export function splat<T, R>(fun: (...args: T[]) => R): (args: T[]) => R {
  return function(args: T[]) {
    return fun(...args);
  };
}

/**
 * Maps a function over a collection and concatenates all results.
 */
export function mapcat<T, U>(fun: (item: T) => U[], coll: T[]): U[] {
  return cat(...coll.map(fun));
}

/**
 * Returns a function that is the logical complement of the given predicate.
 */
export function complement<T>(pred: (x: T) => boolean): (x: T) => boolean {
  return function(x: T) {
    return !pred(x);
  };
}

/**
 * Returns the logical negation of a value.
 */
export function not(x: boolean): boolean {
  return !x;
}

/**
 * Creates a function that checks if an object's `type` property matches the given type string.
 * If it matches, calls the action function with the object; otherwise returns undefined.
 */
export function isa<T extends { type: string }, R>(
  type: string,
  action: (obj: T) => R
): (obj: T) => R | undefined {
  return function(obj: T) {
    if (obj.type === type) {
      return action(obj);
    }
    return undefined;
  };
}

/**
 * Returns a function that tries each given function in order until one returns an existy value.
 */
export function dispatch(...funs: ((...args: unknown[]) => unknown)[]): (...args: unknown[]) => unknown {
  return function(target: unknown, ...args: unknown[]) {
    for (const fun of funs) {
      const result = fun.apply(fun, construct(target, args));
      if (existy(result)) return result;
    }
    return undefined;
  };
}

/**
 * Curries a single-argument function.
 */
export function curry<T, R>(fun: (arg: T) => R): (arg: T) => R {
  return function(arg: T) {
    return fun(arg);
  };
}

/**
 * Curries a two-argument function from right to left.
 */
export function curry2<T1, T2, R>(fun: (arg1: T1, arg2: T2) => R): (arg2: T2) => (arg1: T1) => R {
  return function(arg2: T2) {
    return function(arg1: T1) {
      return fun(arg1, arg2);
    };
  };
}

/**
 * Curries a three-argument function from right to left.
 */
export function curry3<T1, T2, T3, R>(fun: (arg1: T1, arg2: T2, arg3: T3) => R): (arg3: T3) => (arg2: T2) => (arg1: T1) => R {
  return function(arg3: T3) {
    return function(arg2: T2) {
      return function(arg1: T1) {
        return fun(arg1, arg2, arg3);
      };
    };
  };
}

/**
 * Partially applies the first argument to a function.
 */
export function partial1<T1, T2, R>(fun: (arg1: T1, arg2: T2) => R, arg1: T1): (arg2: T2) => R {
  return function(arg2: T2) {
    return fun(arg1, arg2);
  };
}

/**
 * Partially applies the first two arguments to a function.
 */
export function partial2<T1, T2, T3, R>(fun: (arg1: T1, arg2: T2, arg3: T3) => R, arg1: T1, arg2: T2): (arg3: T3) => R {
  return function(arg3: T3) {
    return fun(arg1, arg2, arg3);
  };
}

/**
 * Partially applies any number of arguments to a function.
 */
export function partial(fun: (...args: unknown[]) => unknown, ...pargs: unknown[]): (...args: unknown[]) => unknown {
  return function(...args: unknown[]) {
    return fun.apply(fun, cat(pargs, args));
  };
}

/**
 * Creates a precondition checker that validates an argument against given validators before calling a function.
 */
export function condition1<T>(...validators: ((x: T) => boolean)[]): (fun: (arg: T) => unknown, arg: T) => unknown {
  return function(fun: (arg: T) => unknown, arg: T) {
    const errors = mapcat(function(isValid: (x: T) => boolean) {
      return isValid(arg) ? [] : [(isValid as unknown as { message: string }).message];
    }, validators);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    return fun(arg);
  };
}

/**
 * Immutable merge of objects. Returns a new object that is a shallow merge of all given objects.
 */
export function merge(...objects: Record<string, unknown>[]): Record<string, unknown> {
  return Object.assign({}, ...objects);
}

/**
 * Frequency counter. Returns an object mapping each element in a collection to its count.
 */
export const freq = curry2(countBy)(identity);

/**
 * Re-export compose from underscore for convenience.
 */
export { compose };
