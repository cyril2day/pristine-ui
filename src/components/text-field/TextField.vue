<script lang="ts">
type TextFieldVariant =
  | 'filled'
  | 'default'
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { truthy } from '@/utils'

const props = withDefaults(
  defineProps<{
    variant?: TextFieldVariant
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    clearable: false,
    disabled: false,
  }
)

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()

const showClearButton = computed(() => {
  // Clear button should be visible only when:
  // 1. clearable prop is true
  // 2. there is a non‑empty value
  // 3. the input is not disabled
  // 4. the input is not readonly (readonly attribute not present)
  return (
    props.clearable &&
    modelValue.value.length > 0 &&
    !props.disabled &&
    !truthy(attrs.readonly)
  )
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
}

function onClear() {
  modelValue.value = ''
  emit('clear')
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}

// Data attributes for CSS targeting
const dataAttributes = computed(() => ({
  'data-variant': props.variant,
  'data-clearable': props.clearable ? '' : undefined,
  'data-disabled': props.disabled ? '' : undefined,
  'data-has-value': modelValue.value.length > 0 ? '' : undefined,
}))
</script>

<template>
  <div
    class="pr-text-field"
    v-bind="dataAttributes"
  >
    <input
      v-bind="attrs"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      class="pr-text-field__input"
    />
    <button
      v-if="showClearButton"
      type="button"
      @click="onClear"
      class="pr-text-field__clear"
      aria-label="Clear input"
    >
      ×
    </button>
  </div>
</template>
