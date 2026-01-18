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
    class="card-display"
    v-bind="dataAttributes"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/tokens/index' as tokens;

.card-display {
  // Display
  display: block;

  // Positioning
  position: relative;

  // Box Model
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: var(--border-width-1) solid transparent;

  // Colors & Typography
  background-color: var(--surface-color-primary);
  color: var(--text-primary);

  // Other
  transition: box-shadow 0.2s ease;

  // Variant: outlined
  &[data-variant="outlined"] {
    border-color: var(--color-gray);
  }

  // Variant: elevated
  &[data-variant="elevated"] {
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
