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
import { cycleIndex, truthy, doWhen, when } from '@/utils'
import { presenceAttr } from '@/utils/template-helpers'

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
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled)
    .map(({ index }) => index)
)
const selectedIndex = computed(() =>
  props.items.findIndex(item => item.id === selectedId.value)
)

// Helper functions using functional utilities
const isSelected = (id: string | number) => selectedId.value === id
const isDisabled = (id: string | number) => {
  if (props.disabled) return true
  const item = props.items.find(item => item.id === id)
  return item?.disabled ?? false
}

function selectItem(id: string | number) {
  const item = props.items.find(item => item.id === id)
  if (!item || isDisabled(id)) return

  modelValue.value = id
  emit('select', item)
}

// Keyboard navigation
const focusedIndex = ref<number>(-1)
const containerRef = ref<HTMLElement | null>(null)

function moveSelection(delta: number) {
  const enabled = enabledIndices.value
  if (enabled.length === 0) return

  const current = enabled.findIndex(idx => idx === selectedIndex.value)
  const next = cycleIndex(current, delta, enabled.length)
  const nextIndex = enabled[next]
  const nextItem = typeof nextIndex === 'number' ? props.items[nextIndex] : undefined
  doWhen(truthy(nextItem), () => {
    selectItem(nextItem!.id)
    focusedIndex.value = nextIndex!
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const { key } = event
  const handlers: Record<string, (event: KeyboardEvent) => void> = {
    ArrowLeft: (e) => { e.preventDefault(); moveSelection(-1) },
    ArrowUp: (e) => { e.preventDefault(); moveSelection(-1) },
    ArrowRight: (e) => { e.preventDefault(); moveSelection(1) },
    ArrowDown: (e) => { e.preventDefault(); moveSelection(1) },
    Home: (e) => {
      e.preventDefault()
      const enabled = enabledIndices.value
      when(enabled.length > 0, () => {
        const firstIndex = enabled[0]
        const first = typeof firstIndex === 'number' ? props.items[firstIndex] : undefined
        doWhen(truthy(first), () => selectItem(first!.id))
      })
    },
    End: (e) => {
      e.preventDefault()
      const enabled = enabledIndices.value
      when(enabled.length > 0, () => {
        const lastIndex = enabled[enabled.length - 1]
        const last = typeof lastIndex === 'number' ? props.items[lastIndex] : undefined
        doWhen(truthy(last), () => selectItem(last!.id))
      })
    },
    Enter: (e) => {
      e.preventDefault()
      doWhen(focusedIndex.value >= 0, () => {
        const item = props.items[focusedIndex.value]
        doWhen(truthy(item), () => selectItem(item!.id))
      })
    },
    ' ': (e) => {
      e.preventDefault()
      doWhen(focusedIndex.value >= 0, () => {
        const item = props.items[focusedIndex.value]
        doWhen(truthy(item), () => selectItem(item!.id))
      })
    },
  }

  const handler = handlers[key]
  doWhen(truthy(handler), () => handler!(event))
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
        @focus="focusedIndex = items.findIndex(i => i.id === item.id)"
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
