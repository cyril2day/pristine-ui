import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { size } from 'underscore'
import { truthy, clampIndex, doWhen, not } from '@/utils'
import { equals, safeProp, isNotEmpty, allOf, ifElse } from '@/utils/component-helpers'
import type { Item } from '../composables/useComboBoxState'

export type LifecycleDeps = {
  isOpen: Ref<boolean>
  activeIndex: Ref<number>
  activeItem: Ref<Item | null>
  filteredItems: Ref<Item[]>
  rootRef: Ref<HTMLElement | null>
  closeDropdown: () => void
  disabled: boolean
}

export function computeNewActiveIndex(
  currentId: string | number | undefined,
  currentIndex: number,
  newItems: Item[]
): number {
  const hasItem = () => newItems.some((item: Item) => equals(currentId)(item.id))
  const itemMissing = allOf(() => truthy(currentId), () => not(hasItem()))

  return ifElse(
    () => itemMissing,
    () => ifElse(() => isNotEmpty(newItems), () => 0, () => -1),
    () => clampIndex(currentIndex, size(newItems))
  )
}

export function setupLifecycle(deps: LifecycleDeps) {
  const {
    isOpen,
    activeIndex,
    activeItem,
    filteredItems,
    rootRef,
    closeDropdown,
  } = deps

  // Click-outside handling
  onMounted(() => {
    function handleClickOutside (event: MouseEvent) {
      const isOpenFn = () => truthy(isOpen.value)
      const isClickOutside = () => {
        const container = rootRef.value
        return allOf(
          () => truthy(container),
          () => not((container as HTMLElement).contains(event.target as Node))
        )
      }

      doWhen(allOf(isOpenFn, isClickOutside), closeDropdown)
    }

    document.addEventListener('click', handleClickOutside)
    onUnmounted(() => document.removeEventListener('click', handleClickOutside))
  })

  // Watch filteredItems to reset active item
  watch(filteredItems, (newItems) => {
    const currentId = safeProp(activeItem.value, 'id')
    activeIndex.value = computeNewActiveIndex(currentId, activeIndex.value, newItems)
  })
}
