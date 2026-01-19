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
