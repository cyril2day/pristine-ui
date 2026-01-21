<script lang="ts">
type SegmentedItem = {
  id: string | number
  label: string
  disabled?: boolean
}
type SegmentedShape = 'capsule' | 'rounded-rectangle'
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { isEmpty } from 'underscore'
import { cycleIndex, truthy, doWhen, when, presenceAttr } from '@/utils'
import { createKeyHandler, equals, safeProp, defaultTo } from '@/utils/component-helpers'


const props = withDefaults(
  defineProps<{
    items?: SegmentedItem[]
    shape?: SegmentedShape
    disabled?: boolean
  }>(),
  {
    items: () => [],
    shape: 'capsule',
    disabled: false,
  }
)

const modelValue = defineModel<string | number>({ default: undefined })

const emit = defineEmits<{
  select: [item: SegmentedItem]
}>()

// Derived reactive state
const selectedId = computed(() => modelValue.value)
const enabledIndices = computed(() =>
  props.items
    .map((item: SegmentedItem, index: number) => ({ item, index }))
    .filter(({ item }: { item: SegmentedItem }) => !truthy(item.disabled))
    .map(({ index }) => index)
)
const selectedIndex = computed(() =>
  props.items.findIndex((item: SegmentedItem) => equals(selectedId.value)(item.id))
)

// Helper functions using functional utilities
const isSelected = (id: string | number) => equals(selectedId.value)(id)
const isDisabled = (id: string | number) => {
  if (props.disabled) return true
  const item = props.items.find((item: SegmentedItem) => equals(id)(item.id))
  return defaultTo(safeProp(item, 'disabled'), false)
}

function selectItem(id: string | number) {
  const item = props.items.find((item: SegmentedItem) => equals(id)(item.id))
  if (!item || isDisabled(id)) return

  modelValue.value = id
  emit('select', item)
}

function findItemIndex(id: string | number) {
  return props.items.findIndex((item: SegmentedItem) => equals(id)(item.id))
}

// Keyboard navigation
const focusedIndex = ref<number>(-1)
const containerRef = ref<HTMLElement | null>(null)

function moveSelection(delta: number) {
  const enabled = enabledIndices.value
  if (isEmpty(enabled)) return

  const current = enabled.findIndex(equals(selectedIndex.value))
  const next = cycleIndex(current, delta, enabled.length)
  const nextIndex = enabled[next]!
  const nextItem = props.items[nextIndex]
  doWhen(truthy(nextItem), () => {
    selectItem(nextItem!.id)
    focusedIndex.value = nextIndex!
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const keyHandlers = createKeyHandler({
    ArrowLeft: (e: KeyboardEvent) => moveSelection(-1),
    ArrowUp: (e: KeyboardEvent) => moveSelection(-1),
    ArrowRight: (e: KeyboardEvent) => moveSelection(1),
    ArrowDown: (e: KeyboardEvent) => moveSelection(1),
    Home: (e: KeyboardEvent) => {
      const enabled = enabledIndices.value
      when(!isEmpty(enabled), () => {
        const firstIndex = enabled[0]!
        const first = props.items[firstIndex]
        doWhen(truthy(first), () => selectItem(first!.id))
      })
    },
    End: (e: KeyboardEvent) => {
      const enabled = enabledIndices.value
      when(!isEmpty(enabled), () => {
        const lastIndex = enabled[enabled.length - 1]!
        const last = props.items[lastIndex]
        doWhen(truthy(last), () => selectItem(last!.id))
      })
    },
    Enter: (e: KeyboardEvent) => {
      doWhen(focusedIndex.value >= 0, () => {
        const item = props.items[focusedIndex.value]
        doWhen(truthy(item), () => selectItem(item!.id))
      })
    },
    ' ': (e: KeyboardEvent) => {
      doWhen(focusedIndex.value >= 0, () => {
        const item = props.items[focusedIndex.value]
        doWhen(truthy(item), () => selectItem(item!.id))
      })
    },
  })

  keyHandlers(event)
}
</script>

<template>
  <div
    ref="containerRef"
    class="pr-segmented-control"
    :data-shape="shape"
    :data-disabled="presenceAttr(disabled)"
    @keydown="handleKeydown"
    role="radiogroup"
    aria-orientation="horizontal"
    tabindex="0"
  >
    <template v-if="$slots.default">
      <slot
        :items="items"
        :selected-id="selectedId"
        :select="selectItem"
        :is-selected="isSelected"
        :is-disabled="isDisabled"
      />
    </template>

    <template v-else>
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        :disabled="isDisabled(item.id)"
        :data-selected="presenceAttr(isSelected(item.id))"
        :data-disabled="presenceAttr(isDisabled(item.id))"
        @click="selectItem(item.id)"
        @focus="focusedIndex = findItemIndex(item.id)"
        role="radio"
        :aria-checked="isSelected(item.id)"
        :aria-disabled="isDisabled(item.id)"
        class="pr-segmented-control__segment"
      >
        {{ item.label }}
      </button>
    </template>
  </div>
</template>

<style lang="scss">
.pr-segmented-control {
  // Display
  display: flex;
  align-items: stretch;
  overflow: hidden;
  max-width: 100%;

  // Box Model
  border: none;
  outline: none;
  padding: 0;
  gap: 0;

  // Colors & Typography
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-size: clamp(var(--text-xs), 2vw, var(--text-sm));
  line-height: var(--line-height-normal);

  // Other
  transition: opacity 0.2s ease;

  &[data-shape="capsule"] {
    border-radius: var(--radius-full);
  }
  &[data-shape="rounded-rectangle"] {
    border-radius: var(--radius-lg);
  }

  &[data-disabled] {
    opacity: var(--opacity-50);
    cursor: not-allowed;
    pointer-events: none;
  }
}

.pr-segmented-control__segment {
  // Display
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;

  // Positioning
  overflow: hidden;
  position: relative;

  // Box Model
  border: none;
  margin: 0;
  outline: none;
  padding: var(--space-3) var(--space-4);

  // Colors & Typography
  background-color: var(--color-gray5);
  color: inherit;
  font-family: inherit;
  font-size: clamp(var(--text-xs), 2vw, var(--text-sm));
  font-weight: var(--font-weight-normal);
  line-height: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;

  // Other
  transition: background-color 0.2s ease, color 0.2s ease;

  &:not(:first-child) {
    border-left: var(--border-width-1) solid var(--color-white);
  }

  &[data-selected] {
    background-color: var(--color-blue);
    color: var(--color-white);
  }

  &:hover:not([data-disabled]):not([data-selected]) {
    filter: brightness(0.95);
  }

  &:active:not([data-disabled]):not([data-selected]) {
    filter: brightness(0.85);
  }

  &[data-disabled] {
    opacity: var(--opacity-50);
    cursor: not-allowed;
    pointer-events: none;
  }
}

// Shape-specific border radii
.pr-segmented-control[data-shape="capsule"] {
  .pr-segmented-control__segment:first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }
  .pr-segmented-control__segment:last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}

.pr-segmented-control[data-shape="rounded-rectangle"] {
  .pr-segmented-control__segment:first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }
  .pr-segmented-control__segment:last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}
</style>
