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
    class="combo-box"
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
      class="combo-box__input"
    />
    <button
      type="button"
      class="combo-box__toggle"
      @click="toggleOpen"
      tabindex="-1"
      aria-label="Toggle dropdown"
    >
      <IconCaret color="var(--color-combobox-caret)" :size="10" />
    </button>
    <ul
      v-if="isOpen && filteredItems.length"
      id="listbox-id"
      class="combo-box__listbox"
      role="listbox"
      aria-label="Options"
    >
      <li
        v-for="(item) in filteredItems"
        :key="item.id"
        :id="`option-${item.id}`"
        :class="classIf(isOptionActive(item), 'combo-box__option--active')"
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

<style scoped lang="scss">
@use '@/styles/tokens/index' as tokens;

.dark .combo-box {
  --color-combobox-caret: hsla(0, 0%, 100%, 0.65);
}

.combo-box {
  --color-combobox-caret: hsla(0, 0%, 0%, 0.65);

  // Display
  display: inline-flex;
  align-items: center;
  position: relative;

  // Box Model
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--radius-md);
  border: var(--border-width-2) solid transparent;
  background: transparent;
  padding: var(--space-2) var(--space-2);

  // Colors & Typography
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);

  // Other
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  // Variant: default (outlined)
  &[data-variant="default"] {
    border-color: var(--color-gray);

    &:focus-within {
      border-color: var(--color-blue);
      box-shadow: var(--color-blue) 0 0 0 var(--border-width-3);
    }
  }

  // Variant: filled (solid background)
  &[data-variant="filled"] {
    border-color: transparent;
    background-color: var(--color-gray5);

    &:focus-within {
      background-color: var(--background-color);
      box-shadow: inset 0 0 0 1px var(--color-blue),
                  0 0 0 2px color-mix(in srgb, var(--color-blue) 10%, transparent);
    }
  }

  // Disabled state
  &[data-disabled] {
    opacity: var(--opacity-50);
    cursor: not-allowed;
    pointer-events: none;
  }
}

// Input element
.combo-box__input {
  // Display
  flex: 1;
  width: 100%;

  // Box Model
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;

  // Colors & Typography
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  // Other
  &::placeholder {
    color: var(--text-tertiary);
  }

  &:disabled {
    cursor: not-allowed;
  }

  // Focus outline for accessibility (keyboard focus)
  &:focus-visible {
    outline: var(--border-width-2) solid var(--color-blue);
    outline-offset: var(--space-2);
  }

  &:focus {
    outline: none;
  }
}

// Toggle button
.combo-box__toggle {
  // Display
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  // Positioning
  position: absolute;
  right: var(--space-3);

  // Box Model
  width: 1.7rem;
  height: 1.7rem;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0;
  margin: 0;

  // Colors & Typography
  color: var(--text-secondary);
  background-color: transparent;
  font-size: var(--text-sm);
  line-height: 1;

  // Other
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus {
    color: var(--text-primary);
    background-color: var(--color-gray4);
  }

  &:active {
    background-color: var(--color-gray3);
  }
}

.combo-box[data-expanded] .combo-box__toggle {
  transform: rotate(180deg);
}

// Dropdown listbox
.combo-box__listbox {
  // Display
  display: block;
  position: absolute;
  z-index: var(--z-index-dropdown);

  // Positioning
  top: 100%;
  left: 0;
  right: 0;

  // Box Model
  margin: var(--space-2) 0 0;
  padding: var(--space-2) 0;
  border-radius: var(--radius-md);
  border: var(--border-width-1) solid var(--color-gray);
  // background: var(--color-gray6);
  background: transparent;
  backdrop-filter: saturate(180%) blur(200px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  // Colors & Typography
  color: var(--text-primary);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  // Other
  list-style: none;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 3px solid transparent;
    background-color: var(--color-gray4);
  }
}

// Option items
.combo-box__listbox li {
  // Display
  display: block;

  // Box Model
  padding: var(--space-2) var(--space-3);
  margin: 0;

  // Colors & Typography
  background: transparent;
  color: inherit;
  cursor: pointer;

  // Other
  transition: background-color 0.2s ease;

  &:hover,
  &.combo-box__option--active {
    background-color: var(--color-gray5);
  }

  &[aria-selected="true"] {
    background-color: var(--color-blue);
    color: var(--color-white);
  }
}

// Responsive adjustments
@include tokens.respond-to(small-phone) {
  .combo-box {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-sm);

    .combo-box__toggle {
      right: var(--space-2);
      width: 1rem;
      height: 1rem;
      font-size: var(--text-xs);
    }

    .combo-box__listbox {
      max-height: 150px;
    }
  }
}
</style>
