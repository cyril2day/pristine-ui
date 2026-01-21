import { size } from 'underscore'
import { doWhen, gt } from '@/utils'
import {
  keyDispatch,
  ensureCondition,
  calculateNextIndex,
  withPreventDefault,
  whenKey,
  isArrowDown,
  isArrowUp,
  isEnter,
  isEscape,
  isTabOrShift,
  isTruthy
} from '@/utils/component-helpers'
import type { Item } from '../composables/useComboBoxState'
import type { Ref } from 'vue'

export type KeyboardDeps = {
  props: {
    disabled: boolean
  }
  filteredItems: Ref<Item[]>
  activeIndex: Ref<number>
  isOpen: Ref<boolean>
  openDropdown: () => void
  closeDropdown: () => void
  selectItem: (item: Item) => void
  activeItem: Ref<Item | null>
}

export function createOnKeydown(deps: KeyboardDeps) {
  const {
    props,
    filteredItems,
    activeIndex,
    isOpen,
    openDropdown,
    closeDropdown,
    selectItem,
    activeItem
  } = deps

  return function onKeydown(event: KeyboardEvent): void {
    if (props.disabled) return

    const items = filteredItems.value
    const itemCount = size(items)

    // Ensure dropdown is open before performing actions that require it
    const handleWithOpen = ensureCondition(() => isOpen.value, openDropdown)

    // Key handlers using composition with preventDefault
    const arrowDownHandler = withPreventDefault(

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whenKey(isArrowDown)((_: KeyboardEvent) => {
        handleWithOpen(() => {
          doWhen(
            gt(itemCount)(0),
            () => {
              const next = calculateNextIndex(activeIndex.value, 1, itemCount)
              activeIndex.value = next
          })
        })
      })
    )

    const arrowUpHandler = withPreventDefault(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whenKey(isArrowUp)((_: KeyboardEvent) => {
        handleWithOpen(() => {
          doWhen(
            gt(itemCount)(0),
            () => {
              const next = calculateNextIndex(activeIndex.value, -1, itemCount)
              activeIndex.value = next
            }
          )
        })
      })
    )

    const enterHandler = withPreventDefault(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whenKey(isEnter)((_: KeyboardEvent) => {
        doWhen(
          isTruthy(activeItem.value),
          () => {
            selectItem(activeItem.value as Item)
          }
        )
      })
    )

    const escapeHandler = withPreventDefault(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      whenKey(isEscape)((_: KeyboardEvent) => {
        doWhen(
          isOpen.value, () => {
            closeDropdown()
          }
        )
      })
    )

    const tabShiftHandler = (e: KeyboardEvent) => {
      if (isTabOrShift(e)) {
        closeDropdown()
      }
    }

    const keyHandlers = keyDispatch([
      arrowDownHandler,
      arrowUpHandler,
      enterHandler,
      escapeHandler,
      tabShiftHandler
    ])

    keyHandlers(event)
  }
}
