import { computed, ref, type ComputedRef } from 'vue'

export type ComboBoxSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
export type ComboBoxVariant = 'default' | 'filled'

export type ComboBoxItem = {
  value: string | number
  label?: string
  disabled?: boolean
}

export type ComboBoxOptions = {
  size?: ComboBoxSize
  variant?: ComboBoxVariant
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  label?: string
  helperText?: string
  filterable?: boolean
  noResultsText?: string
  loading?: boolean
  required?: boolean
  autocomplete?: 'off' | 'on'
}

export type ComboBoxProps = {
  modelValue?: string | number | null
  id?: string
  items?: ComboBoxItem[]
  options?: ComboBoxOptions
}

export type ComboBoxEmits = {
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'input': [value: string]
  'open': []
  'close': []
}

const DEFAULT_COMBO_BOX_OPTIONS: Required<ComboBoxOptions> = {
  size: 'regular',
  variant: 'default',
  disabled: false,
  readonly: false,
  placeholder: '',
  label: '',
  helperText: '',
  filterable: true,
  noResultsText: 'No results found',
  loading: false,
  required: false,
  autocomplete: 'off',
}

function generateUniqueId(): string {
  return `pr-combo-box-${Math.random().toString(36).slice(2, 9)}`
}

function mergeWithDefaults(options?: ComboBoxOptions): Required<ComboBoxOptions> {
  return {
    ...DEFAULT_COMBO_BOX_OPTIONS,
    ...options,
  }
}

function filterItems(
  items: ComboBoxItem[],
  inputValue: string,
  filterable: boolean
): ComboBoxItem[] {
  if (!filterable || !inputValue.trim()) {
    return items
  }
  const query = inputValue.toLowerCase()
  return items.filter(item => {
    const label = item.label ?? item.value.toString()
    return label.toLowerCase().includes(query)
  })
}

function findItemByValue(items: ComboBoxItem[], value: string | number | null): ComboBoxItem | undefined {
  if (value === null) return undefined
  return items.find(item => item.value === value)
}

export function useComboBox(
  props: ComboBoxProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const id = computed(() => props.id ?? generateUniqueId())
  const mergedOptions = computed(() => mergeWithDefaults(props.options))
  const items = computed(() => props.items ?? [])

  // Reactive state
  const isOpen = ref(false)
  const inputValue = ref('')
  const activeIndex = ref(-1)

  // Selected item based on modelValue
  const selectedItem = computed(() => findItemByValue(items.value, props.modelValue ?? null))

  // Display value: show label of selected item, otherwise input value
  const displayValue = computed(() => {
    if (selectedItem.value) {
      return selectedItem.value.label ?? selectedItem.value.value.toString()
    }
    return inputValue.value
  })

  // Filtered items based on input
  const filteredItems = computed(() =>
    filterItems(items.value, inputValue.value, mergedOptions.value.filterable)
  )

  // Dropdown ID for aria-controls
  const dropdownId = computed(() => `${id.value}-dropdown`)

  // CSS classes for the input element
  const comboBoxClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => {
    const { size, variant, disabled } = mergedOptions.value
    return [
      'pr-combo-box',
      `pr-combo-box--${size}`,
      `pr-combo-box--${variant}`,
      { 'pr-combo-box--disabled': disabled }
    ]
  })

  // Open/close dropdown
  function openDropdown() {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) return
    isOpen.value = true
    emit('open')
  }

  function closeDropdown() {
    isOpen.value = false
    activeIndex.value = -1
    emit('close')
  }

  function toggleDropdown() {
    if (isOpen.value) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  // Input handling
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    inputValue.value = target.value
    emit('input', target.value)
    // Open dropdown when user starts typing (if filterable)
    if (mergedOptions.value.filterable && !isOpen.value) {
      openDropdown()
    }
    // Clear selection if input value doesn't match selected item label
    if (selectedItem.value) {
      const selectedLabel = selectedItem.value.label ?? selectedItem.value.value.toString()
      if (target.value !== selectedLabel) {
        emit('update:modelValue', null)
        emit('change', null)
      }
    }
  }

  // Focus/blur handling
  function handleFocus(event: FocusEvent) {
    emit('focus', event)
  }

  function handleBlur(event: FocusEvent) {
    emit('blur', event)
    const related = event.relatedTarget as HTMLElement | null
    const dropdownEl = document.getElementById(dropdownId.value)
    if (dropdownEl && related && dropdownEl.contains(related)) {
      // focus moved inside dropdown, keep open
      return
    }
    closeDropdown()
  }

  // Select an item
  function selectItem(item: ComboBoxItem) {
    if (item.disabled) return
    emit('update:modelValue', item.value)
    emit('change', item.value)
    inputValue.value = item.label ?? item.value.toString()
    closeDropdown()
  }

  // Keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          openDropdown()
        }
        moveActiveIndex(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen.value) {
          openDropdown()
        }
        moveActiveIndex(-1)
        break
      case 'Enter':
        if (isOpen.value && activeIndex.value >= 0) {
          const item = filteredItems.value[activeIndex.value]
          if (item) {
            selectItem(item)
          }
        }
        break
      case 'Escape':
        closeDropdown()
        break
      case 'Tab':
        closeDropdown()
        break
    }
  }

  function moveActiveIndex(delta: number) {
    const items = filteredItems.value
    if (items.length === 0) return
    let newIndex = activeIndex.value + delta
    if (newIndex < 0) newIndex = items.length - 1
    if (newIndex >= items.length) newIndex = 0
    activeIndex.value = newIndex
  }

  // Helper for dropdown item classes
  function dropdownItemClasses(item: ComboBoxItem) {
    const isSelected = selectedItem.value?.value === item.value
    const isActive = filteredItems.value[activeIndex.value]?.value === item.value
    return [
      'pr-combo-box-dropdown-item',
      { 'pr-combo-box-dropdown-item--selected': isSelected },
      { 'pr-combo-box-dropdown-item--active': isActive },
      { 'pr-combo-box-dropdown-item--disabled': item.disabled }
    ]
  }

  // Generate ID for an option
  function getOptionId(index: number): string {
    return `${dropdownId.value}-option-${index}`
  }

  const activeDescendantId = computed(() =>
    activeIndex.value >= 0 ? getOptionId(activeIndex.value) : ''
  )

  const toggleButtonAriaLabel = computed(() =>
    isOpen.value ? 'Close dropdown' : 'Open dropdown'
  )

  // Accessibility attributes for input
  const inputAriaAttributes = computed<{
    'aria-expanded': 'true' | 'false'
    'aria-controls': string
    'aria-autocomplete': 'list'
    'role': 'combobox'
    'aria-activedescendant': string
  }>(() => ({
    'aria-expanded': isOpen.value ? 'true' : 'false',
    'aria-controls': dropdownId.value,
    'aria-autocomplete': 'list',
    'role': 'combobox',
    'aria-activedescendant': activeDescendantId.value
  }))

  return {
    id,
    mergedOptions,
    items,
    isOpen,
    inputValue,
    displayValue,
    filteredItems,
    dropdownId,
    comboBoxClasses,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    handleInput,
    handleFocus,
    handleBlur,
    selectItem,
    handleKeydown,
    dropdownItemClasses,
    inputAriaAttributes,
    toggleButtonAriaLabel,
    activeDescendantId,
    getOptionId,
    activeIndex,
    selectedItem,
  }
}
