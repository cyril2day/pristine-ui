<script setup lang="ts">
import { computed } from 'vue'
import { truthy } from '@/utils'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const checked = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  change: [value: boolean]
}>()

const buttonAttributes = computed(() => ({
  'data-checked': checked.value ? 'true' : undefined,
  'data-disabled': props.disabled ? '' : undefined,
}))

function toggle() {
  if (truthy(props.disabled)) return

  const newValue = !checked.value
  checked.value = newValue
  emit('change', newValue)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div
    class="pr-switch-toggle"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled"
    tabindex="0"
    v-bind="buttonAttributes"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span class="pr-switch-toggle__thumb" aria-hidden="true"></span>
  </div>
</template>
