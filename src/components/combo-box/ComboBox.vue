<script setup lang="ts">
type ComboBoxVariant =
  | 'filled'
  | 'default'
type Item = {
  id: string | number;
  label: string
}
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { filter } from 'underscore'
import { truthy, plucker, doWhen, executeIfHasField, clampIndex, cycleIndex, presenceAttr, classIf, when } from '@/utils'
import { equals, containsIgnoreCase, isNotEmpty, ifElse, safeProp, gt, lt, gte, createKeyHandler } from '@/utils/component-helpers'
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
const matchesInput = (input: string) => (item: Item) =>
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
    () => gte(idx)(0) && lt(idx)(items.length),
    () => items[idx],
    () => null
  )
})

// Open/close dropdown
// Helper functions for template patterns
const isOptionActive = (item: Item) => equals(item.id)(safeProp(activeItem.value, 'id'))
const isSelected = (item: Item) => equals(item.label)(modelValue.value)
const activeDescendantId = computed(() => when(truthy(activeItem.value), () => `option-${activeItem.value!.id}`))

function openDropdown() {
  doWhen(truthy(!props.disabled), () => {
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
  when(truthy(!isOpen.value && gt(target.value.length)(0)), openDropdown)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
  doWhen(truthy(!props.disabled), openDropdown)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}

function setActiveItem(item: Item | null) {
  if (item === null) {
    activeIndex.value = -1
    return
  }
  const idx = filteredItems.value.findIndex((i: Item) => equals(item.id)(i.id))
  activeIndex.value = ifElse(
    () => gte(idx)(0),
    () => idx,
    () => -1
  )
}

function selectItem(item: Item) {
  modelValue.value = item.label
  emit('select', item)
  executeIfHasField(inputRef.value, 'focus')
  closeDropdown()
}

// Keyboard navigation
function onKeydown(event: KeyboardEvent) {
  doWhen(truthy(!props.disabled), () => {
    const items = filteredItems.value
    const keyHandlers = createKeyHandler({
      ArrowDown: (e: KeyboardEvent) => {
        e.preventDefault()
        doWhen(truthy(!isOpen.value), openDropdown)
        when(truthy(isNotEmpty(items)), () => {
          const current = activeIndex.value
          const next = cycleIndex(current, 1, items.length)
          activeIndex.value = next
        })
      },
      ArrowUp: (e: KeyboardEvent) => {
        e.preventDefault()
        doWhen(truthy(!isOpen.value), openDropdown)
        when(truthy(isNotEmpty(items)), () => {
          if (equals(activeIndex.value)(-1)) {
            activeIndex.value = items.length - 1
          } else {
            const next = cycleIndex(activeIndex.value, -1, items.length)
            activeIndex.value = next
          }
        })
      },
      Enter: (e: KeyboardEvent) => {
        when(truthy(activeItem.value), () => {
          e.preventDefault()
          selectItem(activeItem.value!)
        })
      },
      Escape: (e: KeyboardEvent) => {
        when(truthy(isOpen.value), () => {
          e.preventDefault()
          closeDropdown()
        })
      },
      Tab: closeDropdown,
      Shift: closeDropdown,
    }, { preventDefault: false })
    keyHandlers(event)
  })
}

// Watch modelValue to reset active item when filtered list changes
function computeNewActiveIndex(
  currentId: string | number | undefined,
  currentIndex: number,
  newItems: Item[]
): number {
  if (currentId && !newItems.some((item: Item) => equals(currentId)(item.id))) {
    // active item no longer in list, reset to first item (or -1)
    return ifElse(
      () => isNotEmpty(newItems),
      () => 0,
      () => -1
    )
  }
  // clamp index to new length
  return clampIndex(currentIndex, newItems.length)
}

watch(filteredItems, (newItems) => {
  const currentId = activeItem.value?.id
  activeIndex.value = computeNewActiveIndex(currentId, activeIndex.value, newItems)
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
      v-if="isOpen && isNotEmpty(filteredItems)"
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
