import { computed } from 'vue'
import { filter, size } from 'underscore'
import { truthy, plucker, doWhen, gt, always } from '@/utils'
import {
  equals,
  containsIgnoreCase,
  ifElse,
  safeProp,
  gte,
  lt
} from '@/utils/component-helpers'
import type { Item, ComboBoxProps } from '../composables/useComboBoxState'
import type { Ref } from 'vue'

export type FilterDeps = {
  props: ComboBoxProps
  modelValue: Ref<string>
  activeIndex: Ref<number>
}

export function createFilter(deps: FilterDeps) {
  const { props, modelValue, activeIndex } = deps

  const getLabel = plucker('label')
  const matchesInput =
    (input: string) =>
      (item: Item) =>
        containsIgnoreCase(input)(getLabel(item))

  const filteredItems = computed(() =>
    ifElse(
      () => truthy(modelValue.value),
      () => filter(props.items, matchesInput(modelValue.value)),
      () => props.items
    )
  )

  const activeItem = computed(() => {
    const items = filteredItems.value
    const idx = activeIndex.value
    return ifElse(
      () => gte(idx)(0) && lt(idx)(size(items)),
      () => items[idx] as Item,
      always(null)
    )
  })

  const isOptionActive =
    (item: Item) =>
      equals(item.id)(safeProp(activeItem.value, 'id'))

  const isSelected =
    (item: Item) =>
      equals(item.label)(modelValue.value)

  const activeItemId = computed(() => safeProp(activeItem.value, 'id'))

  const activeDescendantId = computed(() =>
    doWhen(
      truthy(activeItemId.value),
      () => `option-${activeItemId.value}`
    ))

  const hasValueAttr = computed(() => doWhen(gt(size(modelValue.value))(0), always('')))

  return {
    filteredItems,
    activeItem,
    isOptionActive,
    isSelected,
    activeDescendantId,
    hasValueAttr
  }
}
