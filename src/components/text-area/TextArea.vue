<script lang="ts">
type TextAreaVariant = 'filled' | 'default'
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { when, existy } from '@/utils'

const props = withDefaults(
  defineProps<{
    variant?: TextAreaVariant
    resizable?: boolean
    showCounter?: boolean
    maxLength?: number
    rows?: number
    cols?: number
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    resizable: true,
    showCounter: false,
    maxLength: undefined,
    rows: 3,
    cols: undefined,
    disabled: false,
  }
)

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()

// Data attributes for CSS targeting
const hasMaxLength = computed(() => existy(props.maxLength))
const exceedsMaxLength = computed(() => hasMaxLength.value && modelValue.value.length > props.maxLength!)

const dataAttributes = computed(() => ({
  'data-variant': props.variant,
  'data-resizable': when(props.resizable, () => ''),
  'data-disabled': when(props.disabled, () => ''),
  'data-has-value': when(modelValue.value.length > 0, () => ''),
  'data-counter-visible': when(props.showCounter, () => ''),
  'data-counter-exceeded': when(exceedsMaxLength.value, () => ''),
}))

// ARIA invalid state when exceeding maxLength
const ariaInvalid = computed(() =>
  when(exceedsMaxLength.value, () => 'true' as const)
)

// Character counter label for screen readers
const counterAriaLabel = computed(() => {
  const length = modelValue.value.length
  const max = props.maxLength
  return when(existy(max),
    () => `${length} characters out of ${max}`,
  ) ?? `${length} characters`
})

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  modelValue.value = target.value
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>

<template>
  <div
    class="pr-text-area"
    v-bind="dataAttributes"
  >
    <textarea
      v-bind="attrs"
      :value="modelValue"
      :rows="rows"
      :cols="cols"
      :maxlength="maxLength"
      :disabled="disabled"
      :aria-invalid="ariaInvalid"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      class="pr-text-area__textarea"
    />
    <div
      v-if="showCounter"
      class="pr-text-area__counter"
      aria-live="polite"
      :aria-label="counterAriaLabel"
    >
      {{ modelValue.length }}<span v-if="maxLength"> / {{ maxLength }}</span>
    </div>
  </div>
</template>
