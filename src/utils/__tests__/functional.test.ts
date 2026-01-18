import { describe, it, expect, vi } from 'vitest'
import {
  existy,
  truthy,
  doWhen,
  executeIfHasField,
  plucker,
  finder,
  best,
  always,
  fnull,
  repeat,
  repeatedly,
  iterateUntil,
  invoker,
  validator,
  hasKeys,
  checker,
  cat,
  merge,
  freq,
} from '../functional'

describe('existy', () => {
  it('returns false for null', () => {
    expect(existy(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(existy(undefined)).toBe(false)
  })

  it('returns true for zero', () => {
    expect(existy(0)).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(existy('')).toBe(true)
  })

  it('returns true for false', () => {
    expect(existy(false)).toBe(true)
  })

  it('returns true for an object', () => {
    expect(existy({})).toBe(true)
  })
})

describe('truthy', () => {
  it('returns false for false', () => {
    expect(truthy(false)).toBe(false)
  })

  it('returns false for null', () => {
    expect(truthy(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(truthy(undefined)).toBe(false)
  })

  it('returns true for zero', () => {
    expect(truthy(0)).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(truthy('')).toBe(true)
  })

  it('returns true for an object', () => {
    expect(truthy({})).toBe(true)
  })
})

describe('plucker', () => {
  it('returns a function that extracts the property', () => {
    const getFoo = plucker('foo')
    expect(getFoo({ foo: 'bar' })).toBe('bar')
    expect(getFoo({ foo: 42 })).toBe(42)
  })

  it('returns undefined for missing property', () => {
    const getFoo = plucker('foo')
    expect(getFoo({})).toBeUndefined()
    expect(getFoo({ bar: 'baz' })).toBeUndefined()
  })

  it('returns undefined for null or undefined object', () => {
    const getFoo = plucker('foo')
    expect(getFoo(null)).toBeUndefined()
    expect(getFoo(undefined)).toBeUndefined()
  })

  it('works with nested objects', () => {
    const getDeep = plucker('deep')
    const obj = { deep: { deeper: 'value' } }
    expect(getDeep(obj)).toEqual({ deeper: 'value' })
  })
})

describe('finder', () => {
  it('finds the maximum using identity and Math.max', () => {
    const numbers = [1, 5, 3, 9, 2]
    const max = finder((x) => x, Math.max, numbers)
    expect(max).toBe(9)
  })

  it('finds the minimum using identity and Math.min', () => {
    const numbers = [1, 5, 3, 9, 2]
    const min = finder((x) => x, Math.min, numbers)
    expect(min).toBe(1)
  })

  it('finds the object with max property using property extractor', () => {
    const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 35 }]
    const oldest = finder((p) => p.age, Math.max, people)
    expect(oldest).toEqual({ name: 'Charlie', age: 35 })
  })

  it('returns undefined for empty collection', () => {
    expect(finder((x) => x, Math.max, [])).toBeUndefined()
  })
})

describe('best', () => {
  it('finds the maximum using greater-than comparator', () => {
    const numbers = [1, 5, 3, 9, 2]
    const max = best((a, b) => a > b, numbers)
    expect(max).toBe(9)
  })

  it('finds the minimum using less-than comparator', () => {
    const numbers = [1, 5, 3, 9, 2]
    const min = best((a, b) => a < b, numbers)
    expect(min).toBe(1)
  })

  it('returns undefined for empty collection', () => {
    expect(best((a, b) => a > b, [])).toBeUndefined()
  })

  it('works with custom comparator for objects', () => {
    const people = [{ age: 30 }, { age: 25 }, { age: 35 }]
    const oldest = best((a, b) => a.age > b.age, people)
    expect(oldest).toEqual({ age: 35 })
  })
})

describe('always', () => {
  it('returns a function that always returns the given value', () => {
    const alwaysTrue = always(true)
    expect(alwaysTrue()).toBe(true)
    expect(alwaysTrue('ignored')).toBe(true)
    expect(alwaysTrue(42)).toBe(true)
  })

  it('returns a function that returns the same reference', () => {
    const obj = { foo: 'bar' }
    const alwaysObj = always(obj)
    expect(alwaysObj()).toBe(obj)
    expect(alwaysObj()).toBe(obj)
  })
})

describe('fnull', () => {
  it('returns a function that uses default values for null/undefined arguments', () => {
    const safeMult = fnull((x, y) => x * y, 1, 1)
    expect(safeMult(2, 3)).toBe(6)
    expect(safeMult(null, 3)).toBe(3)
    expect(safeMult(2, undefined)).toBe(2)
    expect(safeMult(null, null)).toBe(1)
  })

  it('works with multiple defaults per argument position', () => {
    const safeSum = fnull((a, b, c) => a + b + c, 0, 0, 0)
    expect(safeSum(1, 2, 3)).toBe(6)
    expect(safeSum(null, 2, 3)).toBe(5)
    expect(safeSum(1, undefined, 3)).toBe(4)
    expect(safeSum(null, null, null)).toBe(0)
  })

  it('accepts a single default for all missing arguments', () => {
    const safeDiv = fnull((x, y) => x / y, 1)
    expect(safeDiv(4, 2)).toBe(2)
    expect(safeDiv(null, 2)).toBe(0.5) // 1 / 2
    expect(safeDiv(4, undefined)).toBe(4) // 4 / 1
    expect(safeDiv(null, null)).toBe(1) // 1 / 1
  })

  it('handles variadic defaults when more defaults than parameters', () => {
    const safeFn = fnull((x, y) => x + y, 10, 20)
    expect(safeFn(1, 2)).toBe(3)
    expect(safeFn(null, 2)).toBe(12) // 10 + 2
    expect(safeFn(1, undefined)).toBe(21) // 1 + 20
    expect(safeFn(null, undefined)).toBe(30) // 10 + 20
  })
})

describe('merge', () => {
  it('merges objects immutably', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const merged = merge(obj1, obj2)
    expect(merged).toEqual({ a: 1, b: 2 })
    expect(merged).not.toBe(obj1)
    expect(merged).not.toBe(obj2)
  })

  it('overwrites earlier properties with later ones', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 3, c: 4 }
    const merged = merge(obj1, obj2)
    expect(merged).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('returns an empty object when no arguments', () => {
    expect(merge()).toEqual({})
  })

  it('does not mutate source objects', () => {
    const obj1 = { x: 1 }
    const obj2 = { y: 2 }
    const merged = merge(obj1, obj2)
    merged.x = 999
    expect(obj1.x).toBe(1)
  })
})

describe('freq', () => {
  it('counts frequencies of elements', () => {
    expect(freq([1, 2, 2, 3, 3, 3])).toEqual({ 1: 1, 2: 2, 3: 3 })
    expect(freq(['a', 'b', 'a'])).toEqual({ a: 2, b: 1 })
  })

  it('returns an empty object for empty array', () => {
    expect(freq([])).toEqual({})
  })

  it('handles mixed types', () => {
    expect(freq([1, '1', 1])).toEqual({ '1': 3 })
  })
})

describe('repeat', () => {
  it('returns an empty array when n = 0', () => {
    expect(repeat(0, 'foo')).toEqual([]);
  });

  it('returns an array with value repeated n times', () => {
    expect(repeat(3, 'x')).toEqual(['x', 'x', 'x']);
    expect(repeat(2, 42)).toEqual([42, 42]);
  });

  it('handles negative n as empty array', () => {
    expect(repeat(-1, 'foo')).toEqual([]);
  });
});

describe('repeatedly', () => {
  it('returns an empty array when n = 0', () => {
    expect(repeatedly(0, () => 'foo')).toEqual([]);
  });

  it('returns array of results of calling fn with index', () => {
    expect(repeatedly(5, (i) => i * 2)).toEqual([0, 2, 4, 6, 8]);
    expect(repeatedly(3, () => 'hello')).toEqual(['hello', 'hello', 'hello']);
  });
});

describe('iterateUntil', () => {
  it('stops when predicate becomes true', () => {
    const result = iterateUntil(
      (x) => x >= 5,
      (x) => x + 1,
      1
    );
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('returns empty array if predicate true immediately', () => {
    const result = iterateUntil(
      (x) => x > 0,
      (x) => x + 1,
      1
    );
    expect(result).toEqual([]);
  });

  it('collects intermediate values', () => {
    const result = iterateUntil(
      (x) => x.length > 3,
      (arr: number[]) => [...arr, arr.length],
      [] as number[]
    );
    expect(result).toEqual([[], [0], [0, 1], [0, 1, 2]]);
  });
});

describe('invoker', () => {
  it('invokes a method on an object', () => {
    const obj = { greet: (name: string) => `Hello ${name}` };
    const greetInvoker = invoker('greet');
    expect(greetInvoker(obj, 'World')).toBe('Hello World');
  });

  it('returns undefined if method does not exist', () => {
    const obj = { foo: 'bar' };
    const missingInvoker = invoker('baz');
    expect(missingInvoker(obj)).toBeUndefined();
  });

  it('returns undefined if target is null or undefined', () => {
    const greetInvoker = invoker('greet');
    expect(greetInvoker(null)).toBeUndefined();
    expect(greetInvoker(undefined)).toBeUndefined();
  });

  it('passes additional arguments to the method', () => {
    const obj = { add: (x: number, y: number) => x + y };
    const addInvoker = invoker('add');
    expect(addInvoker(obj, 5, 3)).toBe(8);
  });
});

describe('validator', () => {
  it('returns undefined when predicate true', () => {
    const isEven = (x: number) => x % 2 === 0;
    const validateEven = validator(isEven, 'must be even');
    expect(validateEven(2)).toBeUndefined();
    expect(validateEven(4)).toBeUndefined();
  });

  it('returns message when predicate false', () => {
    const isEven = (x: number) => x % 2 === 0;
    const validateEven = validator(isEven, 'must be even');
    expect(validateEven(3)).toBe('must be even');
    expect(validateEven(5)).toBe('must be even');
  });
});

describe('hasKeys', () => {
  it('returns true when object has all keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const hasAB = hasKeys('a', 'b');
    expect(hasAB(obj)).toBe(true);
  });

  it('returns false when missing any key', () => {
    const obj = { a: 1, b: 2 };
    const hasABC = hasKeys('a', 'b', 'c');
    expect(hasABC(obj)).toBe(false);
  });

  it('returns false for non-object', () => {
    const hasAny = hasKeys('any');
    expect(hasAny(null)).toBe(false);
    expect(hasAny(undefined)).toBe(false);
    expect(hasAny(42)).toBe(false);
    expect(hasAny('string')).toBe(false);
  });
});

describe('checker', () => {
  it('returns first error message from validators', () => {
    const isEven = (x: number) => x % 2 === 0;
    const isPositive = (x: number) => x > 0;
    const validateEven = validator(isEven, 'not even');
    const validatePositive = validator(isPositive, 'not positive');
    const check = checker(validateEven, validatePositive);
    expect(check(3)).toBe('not even'); // fails first validator
    expect(check(-2)).toBe('not positive'); // fails second validator
  });

  it('returns undefined if all validators pass', () => {
    const isEven = (x: number) => x % 2 === 0;
    const isPositive = (x: number) => x > 0;
    const validateEven = validator(isEven, 'not even');
    const validatePositive = validator(isPositive, 'not positive');
    const check = checker(validateEven, validatePositive);
    expect(check(4)).toBeUndefined();
  });
});

describe('doWhen', () => {
  it('calls action and returns its result when condition is truthy', () => {
    const action = vi.fn(() => 42)
    const result = doWhen(true, action)
    expect(action).toHaveBeenCalledOnce()
    expect(result).toBe(42)
  })

  it('does not call action and returns undefined when condition is false', () => {
    const action = vi.fn(() => 42)
    const result = doWhen(false, action)
    expect(action).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('does not call action when condition is null', () => {
    const action = vi.fn(() => 42)
    const result = doWhen(null, action)
    expect(action).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('calls action when condition is a truthy value', () => {
    const action = vi.fn(() => 'ok')
    const result = doWhen('hello', action)
    expect(action).toHaveBeenCalledOnce()
    expect(result).toBe('ok')
  })
})

describe('executeIfHasField', () => {
  it('returns the property value and logs when property exists', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const obj = { foo: 'bar' }
    const result = executeIfHasField(obj, 'foo')
    expect(consoleSpy).toHaveBeenCalledWith('The result is bar')
    expect(result).toBe('bar')
    consoleSpy.mockRestore()
  })

  it('calls a method and returns its result', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const obj = { greet: () => 'hello' }
    const result = executeIfHasField(obj, 'greet')
    expect(consoleSpy).toHaveBeenCalledWith('The result is hello')
    expect(result).toBe('hello')
    consoleSpy.mockRestore()
  })

  it('returns undefined when property does not exist', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const obj = { foo: 'bar' }
    const result = executeIfHasField(obj, 'baz')
    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
    consoleSpy.mockRestore()
  })

  it('returns undefined when target is null', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = executeIfHasField(null, 'anything')
    expect(consoleSpy).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
    consoleSpy.mockRestore()
  })
})

describe('cat', () => {
  it('concatenates arrays', () => {
    expect(cat([1,2], [3,4])).toEqual([1,2,3,4])
    expect(cat([], [1])).toEqual([1])
    expect(cat([], [])).toEqual([])
  })
})
