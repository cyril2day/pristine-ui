import { computed, ref, type Ref } from 'vue'
import { size } from 'underscore'
import { truthy, when, not, gt } from '@/utils'
import { allOf } from '@/utils/component-helpers'
import { createFilter } from '../modules/filter'
import { createDropdown } from '../modules/dropdown'
import { createOnKeydown } from '../modules/keyboard'
import { setupLifecycle } from '../modules/lifecycle'

// Types from ComboBox.vue
export type ComboBoxVariant = 'filled' | 'default'
export type Item = {
  id: string | number
  label: string
}
export type ComboBoxProps = {
  items: Item[]
  variant: ComboBoxVariant
  disabled: boolean
  placeholder: string
}
export type ComboBoxEmit = {
  (e: 'select', item: Item): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export function useComboBoxState(
  props: ComboBoxProps,
  modelValue: Ref<string>,
  emit: ComboBoxEmit
) {
  // Internal reactive state
  const isOpen = ref(false)
  const activeIndex = ref(-1)

  // External refs (passed back to the component for template binding)
  const inputRef = ref<HTMLInputElement | null>(null)
  const rootRef = ref<HTMLElement | null>(null)

  // Filter module
  const filter = createFilter({
    props,
    modelValue,
    activeIndex
  })

  const activeItemId = computed(() => filter.activeItem.value?.id ?? null)

  // Dropdown module
  const dropdown = createDropdown({
    props,
    isOpen,
    activeIndex,
    inputRef,
    filteredItems: filter.filteredItems,
    modelValue,
    emit
  })

  // Keyboard module
  const keyboard = createOnKeydown({
    props,
    filteredItems: filter.filteredItems,
    activeIndex,
    isOpen,
    openDropdown: dropdown.openDropdown,
    closeDropdown: dropdown.closeDropdown,
    selectItem: dropdown.selectItem,
    activeItem: filter.activeItem
  })

  // Lifecycle side effects
  setupLifecycle({
    isOpen,
    activeIndex,
    activeItem: filter.activeItem,
    filteredItems: filter.filteredItems,
    rootRef,
    closeDropdown: dropdown.closeDropdown,
    disabled: props.disabled
  })

  // --- Event Handlers (Input/Focus/Blur) ---

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement
    modelValue.value = target.value

    const shouldOpen = allOf(
      () => not(isOpen.value),
      () => gt(size(target.value))(0)
    )

    when(truthy(shouldOpen), dropdown.openDropdown)
  }

  function onFocus(event: FocusEvent) {
    emit('focus', event)
    when(not(props.disabled), dropdown.openDropdown)
  }

  function onBlur(event: FocusEvent) {
    emit('blur', event)
  }

  return {
    // Refs for template binding
    isOpen: computed(() => isOpen.value),
    inputRef,
    rootRef,
    filteredItems: filter.filteredItems,

    // Computed properties for template
    activeDescendantId: filter.activeDescendantId,
    hasValueAttr: filter.hasValueAttr,
    activeItem: filter.activeItem,
    activeItemId,

    // Methods for template
    toggleOpen: dropdown.toggleOpen,
    onInput,
    onFocus,
    onBlur,
    onKeydown: keyboard,
    selectItem: dropdown.selectItem,
    setActiveItem: dropdown.setActiveItem,
    isOptionActive: filter.isOptionActive,
    isSelected: filter.isSelected
  }
}
