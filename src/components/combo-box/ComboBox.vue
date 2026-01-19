<script lang="ts">
type ComboBoxVariant =
  | 'filled'
  | 'default'
type Item = {
  id: string | number;
  label: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { filter } from 'underscore'
import { truthy, plucker, doWhen, clampIndex, cycleIndex } from '@/utils'
import { presenceAttr, classIf } from '@/utils/template-helpers'
import IconCaret from '@/icons/icon-caret.vue'

const props = withDefaults(
  defineProps<{
    items?: Item[]
    variant?: ComboBoxVariant
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    items: () => [],
    variant: 'default',
    disabled: false,
    placeholder: '',
  }
)

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  select: [item: Item]
  open: []
  close: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// Internal reactive state
const isOpen = ref(false)
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

// Filtering logic using functional composition
const getLabel = plucker('label')
const containsIgnoreCase = (needle: string) => (haystack: string) =>
  haystack.toLowerCase().includes(needle.toLowerCase())
const matchesInput = (input: string) => (item: Item) =>
  containsIgnoreCase(input)(getLabel(item))
const filteredItems = computed(() => {
  if (!modelValue.value) return props.items
  return filter(props.items, matchesInput(modelValue.value))
})

const activeItem = computed(() => {
  const items = filteredItems.value
  const idx = activeIndex.value
  return idx >= 0 && idx < items.length ? items[idx] : null
})

// Open/close dropdown
// Helper functions for template patterns
const isOptionActive = (item: Item) => activeItem.value?.id === item.id
const isSelected = (item: Item) => modelValue.value === item.label
const activeDescendantId = computed(() => activeItem.value ? `option-${activeItem.value.id}` : undefined)

function openDropdown() {
  if (props.disabled) return
  isOpen.value = true
  emit('open')
}

function closeDropdown() {
  isOpen.value = false
  activeIndex.value = -1
  emit('close')
}

function toggleOpen() {
  doWhen(truthy(!props.disabled), () => {
    if (isOpen.value) {
      closeDropdown()
    } else {
      openDropdown()
    }
  })
}

// Click‑outside handling
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!rootRef.value?.contains(event.target as Node) && isOpen.value) {
      closeDropdown()
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
})

// Input handlers
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
  if (!isOpen.value && target.value.length > 0) {
    openDropdown()
  }
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
  if (!props.disabled) {
    openDropdown()
  }
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
  // close on blur? handled by click‑outside
}

function setActiveItem(item: Item | null) {
  if (item === null) {
    activeIndex.value = -1
    return
  }
  const idx = filteredItems.value.findIndex(i => i.id === item.id)
  activeIndex.value = idx >= 0 ? idx : -1
}

function selectItem(item: Item) {
  modelValue.value = item.label
  emit('select', item)
  inputRef.value?.focus()
  closeDropdown()
}

// Keyboard navigation
function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const { key } = event
  const items = filteredItems.value

  const handlers: Record<string, (event: KeyboardEvent) => void> = {
    ArrowDown: (e) => {
      e.preventDefault()
      if (!isOpen.value) openDropdown()
      if (items.length > 0) {
        const current = activeIndex.value
        const next = cycleIndex(current, 1, items.length)
        activeIndex.value = next
      }
    },
    ArrowUp: (e) => {
      e.preventDefault()
      if (!isOpen.value) openDropdown()
      if (items.length > 0) {
        if (activeIndex.value === -1) {
          activeIndex.value = items.length - 1
        } else {
          const next = cycleIndex(activeIndex.value, -1, items.length)
          activeIndex.value = next
        }
      }
    },
    Enter: (e) => {
      if (activeItem.value) {
        e.preventDefault()
        selectItem(activeItem.value)
      }
    },
    Escape: (e) => {
      if (isOpen.value) {
        e.preventDefault()
        closeDropdown()
      }
    },
    Tab: closeDropdown,
    Shift: closeDropdown,
  }

  const handler = handlers[key]
  if (handler) {
    handler(event)
  }
}

// Watch modelValue to reset active item when filtered list changes
watch(filteredItems, (newItems) => {
  const currentId = activeItem.value?.id
  if (currentId && !newItems.some(item => item.id === currentId)) {
    // active item no longer in list, reset to first item (or -1)
    activeIndex.value = newItems.length > 0 ? 0 : -1
  } else {
    // clamp index to new length
    activeIndex.value = clampIndex(activeIndex.value, newItems.length)
  }
})
</script>

<template>
  <div
    ref="rootRef"
    class="pr-combo-box"
    :data-variant="variant"
    :data-expanded="presenceAttr(isOpen)"
    :data-disabled="presenceAttr(disabled)"
    :data-has-value="presenceAttr(!!modelValue)"
  >
    <input
      ref="inputRef"
      v-bind="$attrs"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      aria-controls="listbox-id"
      :aria-activedescendant="activeDescendantId"
      role="combobox"
      class="pr-combo-box__input"
    />
    <button
      type="button"
      class="pr-combo-box__toggle"
      @click="toggleOpen"
      tabindex="-1"
      aria-label="Toggle dropdown"
    >
      <IconCaret color="var(--color-combobox-caret)" :size="10" />
    </button>
    <ul
      v-if="isOpen && filteredItems.length"
      id="listbox-id"
      class="pr-combo-box__listbox"
      role="listbox"
      aria-label="Options"
    >
      <li
        v-for="(item) in filteredItems"
        :key="item.id"
        :id="`option-${item.id}`"
        class="pr-combo-box__option"
        :class="classIf(isOptionActive(item), 'pr-combo-box__option--active')"
        @click="selectItem(item)"
        @mouseenter="setActiveItem(item)"
        role="option"
        :aria-selected="isSelected(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
