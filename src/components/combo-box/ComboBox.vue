<script setup lang="ts">
type ComboBoxVariant =
  | 'filled'
  | 'default'
type Item = {
  id: string | number;
  label: string
}
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { filter, size, every } from 'underscore'
import { truthy, plucker, doWhen, executeIfHasField, clampIndex, cycleIndex, presenceAttr, classIf, when, not, always } from '@/utils'
import { equals, containsIgnoreCase, isNotEmpty, ifElse, safeProp, gt, lt, gte, createKeyHandler } from '@/utils/component-helpers'
import IconCaret from '@/icons/icon-caret.vue'

const isTruthy = <T>(val: T | null | undefined): val is NonNullable<T> => truthy(val)

const props = withDefaults(
  defineProps<{
    items?: Item[]
    variant?: ComboBoxVariant
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    items: always([]),
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
const listboxRef = ref<HTMLUListElement | null>(null)

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
    () => gte(idx)(0) && lt(idx)(size(items)),
    () => items[idx],
    always(null)
  )
})

// Open/close dropdown
// Helper functions for template patterns
const isOptionActive = (item: Item) => equals(item.id)(safeProp(activeItem.value, 'id'))
const isSelected = (item: Item) => equals(item.label)(modelValue.value)
const activeDescendantId = computed(() => when(truthy(activeItemId.value), () => `option-${activeItemId.value}`))

const activeItemId = computed(() => safeProp(activeItem.value, 'id'))
const hasValueAttr = computed(() => when(gt(size(modelValue.value))(0), always('')))

// Scroll‑to‑view helpers (local; candidate for extraction)
const bothTruthy = <A, B>(
  a: A | null | undefined,
  b: B | null | undefined
): [A, B] | undefined =>
  when(
    allOf(
      () => isTruthy(a),
      () => isTruthy(b)
    ),
    () => [a as A, b as B]
  )

const allOf = (
  ...conditions: Array<() => boolean>
): boolean =>
  every(conditions, (cond) => cond())

const getChildAt = (
  container: HTMLElement | null | undefined,
  index: number
): HTMLElement | undefined => {
  if (not(truthy(container))) return undefined
  const c = container as HTMLElement
  const children = c.children
  const length = size(children)
  return when(
    allOf(
      () => gte(index)(0),
      () => lt(index)(length)
    ),
    () => children[index] as HTMLElement
  )
}

const maybeScrollToActive = (): void => {
  const maybePair = bothTruthy(
    listboxRef.value,
    getChildAt(listboxRef.value, activeIndex.value)
  )

  when(
    truthy(maybePair),
    () => {
      const [, child] = maybePair as [HTMLElement, HTMLElement]
      child.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

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

// Click‑outside handling
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const isOpenFn = () => truthy(isOpen.value)
    const isClickOutside = () => {
      const container = rootRef.value
      return truthy(container) && not((container as HTMLElement).contains(event.target as Node))
    }

    when(
      allOf(isOpenFn, isClickOutside),
      closeDropdown
    )
  }

  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
})

// Input handlers
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
  const shouldOpen = allOf(
    () => not(isOpen.value),
    () => gt(size(target.value))(0)
  )

  when(
    truthy(shouldOpen),
    openDropdown
  )
}

function onFocus(event: FocusEvent) {
  emit('focus', event)

  doWhen(
    not(props.disabled),
    openDropdown
  )
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}

function setActiveItem(item: Item | null) {
  ifElse(
    () => equals(item)(null),
    () => { activeIndex.value = -1 },
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

// Keyboard navigation
function onKeydown(event: KeyboardEvent) {
  doWhen(
    not(props.disabled),
    () => {
      const items = filteredItems.value
      const keyHandlers = createKeyHandler({

        ArrowDown: (e: KeyboardEvent) => {
          e.preventDefault()

          doWhen(
            not(isOpen.value),
            openDropdown
          )

          when(
            truthy(isNotEmpty(items)),
            () => {
              const current = activeIndex.value
              const next = cycleIndex(current, 1, size(items))
              activeIndex.value = next
            }
          )
        },
        ArrowUp: (e: KeyboardEvent) => {
          e.preventDefault()

          doWhen(
            not(isOpen.value),
            openDropdown
          )

          when(
            truthy(isNotEmpty(items)),
            () => {
              const next = ifElse(
                () => equals(activeIndex.value)(-1),
                () => size(items) - 1,
                () => cycleIndex(activeIndex.value, -1, size(items))
              )
              activeIndex.value = next
            }
          )
        },
        Enter: (e: KeyboardEvent) => {
          const item = activeItem.value

          when(
            isTruthy(item),
            () => {
              e.preventDefault()
              selectItem(item as Item)
            }
          )
        },
        Escape: (e: KeyboardEvent) => {
          when(
            truthy(isOpen.value),
            () => {
              e.preventDefault()
              closeDropdown()
            }
          )
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
  const hasItem = () => newItems.some((item: Item) => equals(currentId)(item.id))
  const itemMissing = allOf(
    () => truthy(currentId),
    () => not(hasItem())
  )

  return ifElse(
    () => itemMissing,
    () => ifElse(
      () => isNotEmpty(newItems),
      always(0),
      always(-1)
    ),
    () => clampIndex(currentIndex, size(newItems))
  )
}

watch(filteredItems, (newItems) => {
  const currentId = safeProp(activeItem.value, 'id')
  activeIndex.value = computeNewActiveIndex(currentId, activeIndex.value, newItems)
})

// Scroll active option into view when index changes or dropdown opens
watch(
  () => activeIndex.value,
  () => {
    when(
      truthy(isOpen.value),
      () => {
        nextTick(maybeScrollToActive)
      }
    )
  },
  { flush: 'post' }
)

watch(
  () => isOpen.value,
  (newVal) => {
    when(
      truthy(newVal),
      () => {
        nextTick(maybeScrollToActive)
      }
    )
  }
)
</script>

<template>
  <div
    ref="rootRef"
    class="pr-combo-box"
    :data-variant="variant"
    :data-expanded="presenceAttr(isOpen)"
    :data-disabled="presenceAttr(disabled)"
    :data-has-value="hasValueAttr"
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
      ref="listboxRef"
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
