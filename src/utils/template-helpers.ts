/**
 * Utilities for Vue template expressions.
 */

import { truthy, doWhen } from './functional'

/**
 * Returns an empty string if `cond` is truthy, otherwise `undefined`.
 * Useful for boolean‑style data attributes where the attribute should be present
 * when the condition is true and omitted when false.
 *
 * @example
 * :data-expanded="presenceAttr(isOpen)"
 */
export function presenceAttr(cond: boolean): '' | undefined {
  return doWhen(truthy(cond), () => '') ?? undefined
}

/**
 * Returns an object suitable for Vue's `:class` binding that conditionally applies a single class.
 *
 * @example
 * :class="classIf(isActive, 'active')"
 */
export function classIf(condition: boolean, className: string): Record<string, boolean> {
  return { [className]: condition }
}

/**
 * Curried version of `classIf`. Useful for composition.
 *
 * @example
 * :class="classIfCurried('active')(isActive)"
 */
export function classIfCurried(className: string): (condition: boolean) => Record<string, boolean> {
  return (condition) => ({ [className]: condition })
}
