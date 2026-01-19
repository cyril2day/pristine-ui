<script lang="ts">
type CardDisplayVariant =
  | 'outlined'
  | 'elevated'
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: CardDisplayVariant
  }>(),
  {
    variant: 'outlined',
  }
)

// Data attributes for CSS targeting
const dataAttributes = computed(() => ({
  'data-variant': props.variant,
  'data-card': '',
}))
</script>

<template>
  <div
    class="pr-card-display"
    v-bind="dataAttributes"
  >
    <slot />
  </div>
</template>
