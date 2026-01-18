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
    class="text-field"
    v-bind="dataAttributes"
  >
    <input
      v-bind="attrs"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      class="text-field__input"
    />
    <button
      v-if="showClearButton"
      type="button"
      @click="onClear"
      class="text-field__clear"
      aria-label="Clear input"
    >
      ×
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/tokens/index' as tokens;

.text-field {
  // Display
  display: inline-flex;
  align-items: center;
  position: relative;

  // Box Model
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--radius-md);
  border: var(--border-width-2) solid transparent;
  background-color: transparent;
  padding: var(--space-2) var(--space-3);

  // Colors & Typography
  color: var(--text-primary);
  font-family: var(--font-family-sans);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);

  // Other
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  // Variant: default (outlined)
  &[data-variant="default"] {
    border-color: var(--color-gray);
    background-color: transparent;

    &:focus-within {
      border-color: var(--color-blue);
      box-shadow: var(--color-blue) 0 0 0 var(--border-width-3);
      filter: brightness(1.2);
    }
  }

  // Variant: filled (solid background)
  &[data-variant="filled"] {
    border-color: transparent;
    background-color: var(--color-gray5);

    &:focus-within {
      background-color: var(--background-color);
      box-shadow: inset 0 0 0 1px var(--color-blue),
                  0 0 0 2px color-mix(in srgb, var(--color-blue) 10%, transparent);
    }
  }

  // Disabled state
  &[data-disabled] {
    opacity: var(--opacity-50);
    cursor: not-allowed;
    pointer-events: none;
  }

  // Clear button
  .text-field__clear {
    // Display
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    // Positioning
    position: absolute;
    right: var(--space-3);

    // Box Model
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    border-radius: var(--radius-full);
    padding: 0;
    margin: 0;

    // Colors & Typography
    color: var(--text-secondary);
    background-color: transparent;
    font-size: var(--text-lg);
    line-height: 1;

    // Other
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover,
    &:focus {
      color: var(--text-primary);
      background-color: var(--color-gray4);
    }

    &:active {
      background-color: var(--color-gray3);
    }
  }

  // Input element
  .text-field__input {
    // Display
    flex: 1;
    width: 100%;

    // Box Model
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;

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

  // Responsive adjustments
  @include tokens.respond-to(small-phone) {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-sm);

    .text-field__clear {
      right: var(--space-2);
      width: 1rem;
      height: 1rem;
      font-size: var(--text-base);
    }
  }
}
</style>
