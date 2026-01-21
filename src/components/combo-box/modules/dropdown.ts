import { doWhen, executeIfHasField, not, always } from '@/utils'
import {
  equals,
  ifElse,
  gte
} from '@/utils/component-helpers'
import type { Item, ComboBoxEmit } from '../composables/useComboBoxState'
import type { Ref } from 'vue'

export type DropdownDeps = {
  props: {
    disabled: boolean
  }
  isOpen: Ref<boolean>
  activeIndex: Ref<number>
  inputRef: Ref<HTMLInputElement | null>
  filteredItems: Ref<Item[]>
  modelValue: Ref<string>
  emit: ComboBoxEmit
}

export function createDropdown(deps: DropdownDeps) {
  const {
    props,
    isOpen,
    activeIndex,
    inputRef,
    filteredItems,
    modelValue,
    emit
  } = deps


  function openDropdown() {
    doWhen(
      not(props.disabled),
      () => {
        isOpen.value = true
        emit('open')
    })
  }

  function closeDropdown() {
    isOpen.value = false
    activeIndex.value = -1
    emit('close')
  }

  function toggleOpen() {
    doWhen(
      not(props.disabled),
      () => {
        ifElse(
          () => isOpen.value,
          closeDropdown,
          openDropdown
        )
    })
  }

  function setActiveItem(item: Item | null) {
    ifElse(
      () => equals(item)(null),
      () => {
        activeIndex.value = -1
      },
      () => {
        const nonNullItem = item as Item
        const idx = filteredItems.value.findIndex((i: Item) => equals(nonNullItem.id)(i.id))

        activeIndex.value = ifElse(
          () => gte(idx)(0),
          () => idx,
          always(-1)
        )
      }
    )
  }

  function selectItem(item: Item) {
    modelValue.value = item.label

    emit('select', item)
    executeIfHasField(inputRef.value, 'focus')
    closeDropdown()
  }

  return {
    openDropdown,
    closeDropdown,
    toggleOpen,
    setActiveItem,
    selectItem
  }
}
