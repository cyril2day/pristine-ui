<script setup lang="ts">
import { watch, nextTick } from 'vue'
import { equals } from '@/utils/component-helpers'
import type { Item } from './composables/useComboBoxState'

const props = withDefaults(
  defineProps<{
    items: Item[]
    activeItemId: string | number | null
    selectedItemId?: string | number | null
    ariaLabel?: string
    id?: string
  }>(),
  {
    selectedItemId: null,
    ariaLabel: 'Options',
    id: 'listbox-id',
  }
)

const emit = defineEmits<{
  select: [item: Item]
  hover: [item: Item]
}>()

// Scroll active option into view when activeItemId changes
watch(() => props.activeItemId, () => {
  nextTick(() => {
    const activeElement = document.getElementById(`option-${props.activeItemId}`)
    if (activeElement) {
      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}, { flush: 'post' })

const isOptionActive = (item: Item) => equals(item.id)(props.activeItemId)
const isOptionSelected = (item: Item) => equals(item.id)(props.selectedItemId)
</script>

<template>
  <ul
    :id="id"
    class="pr-combo-box__listbox"
    role="listbox"
    :aria-label="ariaLabel"
  >
    <li
      v-for="item in items"
      :key="item.id"
      :id="`option-${item.id}`"
      class="pr-combo-box__option"
      :class="{ 'pr-combo-box__option--active': isOptionActive(item) }"
      @click="emit('select', item)"
      @mouseenter="emit('hover', item)"
      role="option"
      :aria-selected="isOptionSelected(item)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>
