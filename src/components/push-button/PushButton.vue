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
