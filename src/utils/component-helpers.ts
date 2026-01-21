/**
 * Component‑specific functional helpers that are candidates for inclusion in pristine‑fp.
 * These utilities are built from the core primitives (pristine‑fp, underscore) and follow
 * the project's functional programming guidelines.
 *
 * This module re‑exports the corresponding functions from the pristine‑fp package.
 */

// --- Equality ------------------------------------------------------------------
export { equals } from 'pristine-fp'

// --- Collection predicates -----------------------------------------------------
export { isNotEmpty } from 'pristine-fp'

// --- String utilities ----------------------------------------------------------
export { containsIgnoreCase } from 'pristine-fp'

// --- Default values ------------------------------------------------------------
export { defaultTo, defaultToC } from 'pristine-fp'

// --- Safe property access -------------------------------------------------------
export { safeProp, safePropC } from 'pristine-fp'

// --- Numeric comparators --------------------------------------------------------
export { gt, lt, gte, lte } from 'pristine-fp'

// --- Boolean data attribute -----------------------------------------------------
export { booleanDataAttr, booleanDataAttrC } from 'pristine-fp'

// --- Conditional branching -----------------------------------------------------
export { ifElse, ifElseC } from 'pristine-fp'

// --- Index utilities -----------------------------------------------------------
export { findIndexByProp, findIndexByPropC } from 'pristine-fp'

// --- Keyboard event helpers -----------------------------------------------------
export { createKeyHandler } from 'pristine-fp'

// --- Template helpers (re‑exported) --------------------------------------------
export { presenceAttr, classIf } from 'pristine-fp'

// --- Utility helpers extracted from ComboBox (can be candidate for pristine-fp) ---

import { every, size } from 'underscore'
import { truthy, doWhen, not, gte, lt, plucker, equals, ifElse } from '@/utils'

export const isTruthy = <T>(val: T | null | undefined): val is NonNullable<T> => truthy(val)

export const allOf = (
  ...conditions: Array<() => boolean>
): boolean =>
  every(conditions, (cond) => cond())

export const bothTruthy = <A, B>(
  a: A | null | undefined,
  b: B | null | undefined
): [A, B] | undefined =>
  doWhen(
    allOf(
      () => isTruthy(a),
      () => isTruthy(b)
    ),
    () => [a as A, b as B]
  )

export const getChildAt = (
  container: HTMLElement | null | undefined,
  index: number
): HTMLElement | undefined => {
  if (not(truthy(container))) return undefined
  const c = container as HTMLElement
  const children = c.children
  const length = size(children)
  return doWhen(
    allOf(
      () => gte(index)(0),
      () => lt(index)(length)
    ),
    () => children[index] as HTMLElement
  )
}

export function keyDispatch<T extends Event = KeyboardEvent>(
  handlers: ((e: T) => void | undefined)[]
): (event: T) => void {
  return function (event: T) {
    for (const handler of handlers) {
      const result = handler(event)
      if (result !== undefined) return result
    }
  }
}

export const ensureCondition = (
  condition: () => boolean,
  ensureFn: () => void
) => (action: () => void): void => {
  doWhen(not(condition()), ensureFn)
  action()
}

export function calculateNextIndex(
  current: number,
  direction: number,
  itemCount: number
): number {
  return ifElse(
    () => allOf(
      () => equals(current)(-1),
      () => lt(direction)(0)
    ),
    () => itemCount - 1,
    () => (current + direction + itemCount) % itemCount
  )
}

export const pluckKey = plucker('key')

export const matchesKey =
  (key: string) =>
    (e: KeyboardEvent) =>
      equals(key)(pluckKey(e))

export const matchesAnyOf =
  (...keys: string[]) =>
    (e: KeyboardEvent) =>
      keys.some(key => equals(key)(pluckKey(e)))

export const withPreventDefault =
  (handler: (e: KeyboardEvent) => boolean) =>
    (e: KeyboardEvent): void => {
      doWhen(handler(e), () => e.preventDefault())
    }

export const whenKey =
  (predicate: (e: KeyboardEvent) => boolean) =>
    (action: (e: KeyboardEvent) => void) =>
      (e: KeyboardEvent): boolean => {
        doWhen(predicate(e), () => action(e))
        return predicate(e)
      }

export const isArrowDown = matchesKey('ArrowDown')
export const isArrowUp = matchesKey('ArrowUp')
export const isEnter = matchesKey('Enter')
export const isEscape = matchesKey('Escape')
export const isTabOrShift = matchesAnyOf('Tab', 'Shift')
