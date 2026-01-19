<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { truthy, when } from '@/utils'

const props = withDefaults(
  defineProps<{
    indeterminate?: boolean
    disabled?: boolean
    id?: string
    name?: string
    value?: string
    ariaLabel?: string
    ariaLabelledby?: string
  }>(),
  {
    indeterminate: false,
    disabled: false,
    id: undefined,
    name: undefined,
    value: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
  }
)

const checked = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  change: [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

// Sync indeterminate property on the native input
watch(
  () => props.indeterminate,
  (isIndeterminate) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = isIndeterminate
    }
  },
  { immediate: true }
)

// Compute ARIA attribute values using functional style
const ariaChecked = computed(() =>
  when(props.indeterminate, () => 'mixed' as const) ??
  when(checked.value, () => 'true' as const) ??
  'false' as const
)

// Data attributes using when helper
const dataAttributes = computed(() => ({
  'data-checked': when(checked.value, () => 'true'),
  'data-indeterminate': when(props.indeterminate, () => 'true'),
  'data-disabled': when(props.disabled, () => ''),
}))

// Pure state transformer
const toggleState = (currentChecked: boolean, currentIndeterminate: boolean) => {
  // If indeterminate, moving to checked clears indeterminate
  if (currentIndeterminate) {
    return { checked: true, indeterminate: false }
  }
  // Otherwise toggle checked
  return { checked: !currentChecked, indeterminate: false }
}

// Handler that respects disabled state
const handleToggle = () => {
  if (truthy(props.disabled)) return

  const newState = toggleState(checked.value, props.indeterminate)
  checked.value = newState.checked
  emit('change', newState.checked)
}

// Keyboard dispatch map
const keyActions: Record<string, () => void> = {
  Space: handleToggle,
  Enter: handleToggle,
}

const handleKeydown = (event: KeyboardEvent) => {
  const action = keyActions[event.code]
  if (action) {
    event.preventDefault()
    action()
  }
}
</script>

<template>
  <div
    class="pr-check-box"
    role="checkbox"
    :aria-checked="ariaChecked"
    :aria-disabled="disabled"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :tabindex="disabled ? -1 : 0"
    v-bind="dataAttributes"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <input
      ref="inputRef"
      type="checkbox"
      :id="id"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      aria-hidden="true"
      class="pr-check-box__input"
    />
    <span class="pr-check-box__visual" aria-hidden="true"></span>
  </div>
</template>
