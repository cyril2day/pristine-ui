<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { truthy, when, always } from '@/utils'
import { createKeyHandler, defaultTo } from '@/utils/component-helpers'

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
  defaultTo(
    when(props.indeterminate, always('mixed' as const)),
    defaultTo(
      when(checked.value, always('true' as const)),
      'false' as const
    )
  )
)

// Data attributes using when helper
const dataAttributes = computed(() => ({
  'data-checked': when(checked.value, always('true')),
  'data-indeterminate': when(props.indeterminate, always('true')),
  'data-disabled': when(props.disabled, always('')),
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
const keyHandlers = createKeyHandler({
  Space: handleToggle,
  Enter: handleToggle,
})

const handleKeydown = (event: KeyboardEvent) => {
  keyHandlers(event)
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

<style lang="scss">
.pr-check-box {
  // Display
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  user-select: none;

  // Positioning
  position: relative;

  // Box Model
  border: var(--border-width-2) solid var(--color-gray);
  border-radius: var(--radius-sm);
  height: var(--checkbox-size, var(--space-4));
  width: var(--checkbox-size, var(--space-4));

  // Colors & Typography
  background-color: transparent;

  // Other
  outline: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:focus-visible {
    // Box Model
    outline: var(--border-width-2) solid var(--color-blue);
    outline-offset: var(--space-1);
  }

  // Checked state
  &[data-checked='true'] {
    // Colors & Typography
    background-color: var(--color-blue);
    border-color: var(--color-blue);

    .pr-check-box__visual::after {
      // Display
      content: '';
      // Positioning
      position: absolute;
      top: 45%;
      left: 50%;
      // Box Model
      width: 40%;
      height: 20%;
      border: solid var(--color-white);
      border-width: 0 0 2px 2px;
      // Other
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  // Indeterminate state
  &[data-indeterminate='true'] {
    // Colors & Typography
    background-color: var(--color-blue);
    border-color: var(--color-blue);

    .pr-check-box__visual::after {
      // Display
      content: '';
      // Positioning
      position: absolute;
      top: 50%;
      left: 50%;
      // Box Model
      width: 60%;
      height: 2px;
      // Colors & Typography
      background-color: var(--color-white);
      // Other
      transform: translate(-50%, -50%);
    }
  }

  // Disabled state
  &[data-disabled] {
    // Display
    cursor: not-allowed;
    // Colors & Typography
    opacity: var(--opacity-50);
    // Other
    pointer-events: none;
  }

  // Hover state
  &:not([data-disabled]):hover {
    // Colors & Typography
    border-color: var(--color-gray4);
  }

  &:not([data-disabled]):active {
    // Colors & Typography
    border-color: var(--color-blue);
  }
}

.pr-check-box__input {
  // Display
  cursor: pointer;
  // Positioning
  position: absolute;
  // Box Model
  height: 100%;
  margin: 0;
  opacity: 0;
  width: 100%;
  // Other
  z-index: var(--z-index-base);
}

.pr-check-box__visual {
  // Display
  display: block;
  // Positioning
  left: 0;
  position: absolute;
  top: 0;
  // Box Model
  border-radius: inherit;
  height: 100%;
  width: 100%;
  // Other
  pointer-events: none;
}
</style>
