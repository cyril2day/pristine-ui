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

<style lang="scss">
@use '@/styles/mixins' as mixins;

.pr-text-area {
  // Display
  align-items: stretch;
  overflow: hidden;
  position: relative;

  // Box Model
  background-color: transparent;
  border: var(--border-width-2) solid transparent;
  border-radius: var(--radius-md);
  box-sizing: border-box;
  padding: var(--space-2) var(--space-3);
  width: 100%;

  // Colors & Typography
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);

  // Other
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  // Variant: default (outlined)
  &[data-variant="default"] {
    background-color: transparent;
    border-color: var(--color-gray);

    &:focus-within {
      border-color: var(--color-blue);
      box-shadow: var(--color-blue) 0 0 0 var(--border-width-3);
      filter: brightness(1.2);
    }
  }

  // Variant: filled (solid background)
  &[data-variant="filled"] {
    background-color: var(--color-gray5);
    border-color: transparent;

    &:focus-within {
      background-color: var(--background-color);
      box-shadow: inset 0 0 0 1px var(--color-blue),
                  0 0 0 2px color-mix(in srgb, var(--color-blue) 10%, transparent);
    }
  }

  // Disabled state
  &[data-disabled] {
    cursor: not-allowed;
    opacity: var(--opacity-50);
    pointer-events: none;
  }

  // Resizable control
  &:not([data-resizable]) .pr-text-area__textarea {
    resize: none;
  }
}

.pr-text-area__textarea {
  // Display
  flex: 1;
  min-height: 0;
  resize: vertical;
  width: 100%;

  // Box Model
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;

  // Colors & Typography
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  // Other
  &::placeholder {
    color: var(--text-tertiary);
  }

  &:disabled {
    cursor: not-allowed;
  }

  // Focus outline for accessibility (keyboard focus)
  &:focus-visible {
    outline: var(--border-width-2) solid var(--color-blue);
    outline-offset: var(--space-2);
  }

  &:focus {
    outline: none;
  }
}

.pr-text-area__counter {
  // Display
  display: flex;
  justify-content: flex-end;

  // Positioning
  margin-top: var(--space-1);
  position: relative;

  // Colors & Typography
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;

  // Error state when exceeding maxLength
  [data-counter-exceeded] & {
    color: var(--color-red);
  }
}

// Responsive adjustments
@include mixins.respond-to(small-phone) {
  .pr-text-area {
    font-size: var(--text-sm);
    padding: var(--space-1) var(--space-2);
  }
}
</style>
