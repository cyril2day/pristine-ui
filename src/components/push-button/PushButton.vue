<script lang="ts">
type PushButtonRole =
  | 'normal'
  | 'primary'
  | 'destructive'
  | 'cancel'
type PushButtonShape =
  | 'capsule'
  | 'rounded-rectangle'
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    role?: PushButtonRole
    shape?: PushButtonShape
    disabled?: boolean
  }>(),
  {
    role: 'normal',
    shape: 'capsule',
    disabled: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}

// Data attributes for CSS targeting
const buttonAttributes = computed(() => ({
  'data-role': props.role,
  'data-shape': props.shape,
  'data-disabled': props.disabled ? '' : undefined
}))
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    v-bind="buttonAttributes"
    @click="handleClick"
    class="pr-push-button"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.pr-push-button {
  // Display
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;

  // Box Model
  border: none;
  outline: none;
  padding: var(--space-3) var(--space-4);

  // Colors & Typography
  color: var(--color-white);
  font-family: var(--font-family-sans);
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--letter-spacing-normal);
  line-height: var(--line-height-none);
  vertical-align: middle;
  white-space: nowrap;

  // Other
  transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

  // Shape handling via data-shape attribute
  &[data-shape="capsule"] {
    border-radius: var(--radius-full);
  }
  &[data-shape="rounded-rectangle"] {
    border-radius: var(--radius-md);
  }

  // Role-specific colors via data-role attribute
  &[data-role="normal"] {
    background-color: var(--color-gray);
  }
  &[data-role="primary"] {
    background-color: var(--color-blue);
  }
  &[data-role="destructive"] {
    background-color: var(--color-red);
  }
  &[data-role="cancel"] {
    border: var(--border-width-1) solid var(--color-gray);
    background-color: transparent;
    color: var(--color-gray);

    &:not([data-disabled]):active {
      opacity: 0.65
    }
  }

  // Hover states (darken background)
  &:not([data-disabled]):hover {
    filter: brightness(0.95);
  }
  &:not([data-disabled]):active {
    filter: brightness(0.85);
  }

  // Disabled state
  &[data-disabled],
  &[disabled] {
    cursor: not-allowed;
    opacity: var(--opacity-50);
    pointer-events: none;
  }
}
</style>
