<template>
  <div class="pr-text-field-wrapper">
    <label
      v-if="mergedOptions.label"
      :for="id"
      class="pr-text-field-label"
    >
      {{ mergedOptions.label }}
    </label>
    <div class="pr-text-field-container">
      <slot name="leading" />
      <input
        :id="id"
        :class="textFieldClasses"
        :disabled="mergedOptions.disabled"
        :readonly="mergedOptions.readonly"
        :placeholder="mergedOptions.placeholder"
        :type="mergedOptions.type"
        :value="modelValue"
        :autocomplete="mergedOptions.autocomplete"
        :required="mergedOptions.required"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      <button
        v-if="mergedOptions.clearable && modelValue && !mergedOptions.disabled && !mergedOptions.readonly"
        class="pr-text-field-clear"
        type="button"
        @click="handleClear"
        aria-label="Clear input"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <slot name="trailing" />
    </div>
    <p v-if="mergedOptions.helperText" class="pr-text-field-helper">
      {{ mergedOptions.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTextField, type TextFieldOptions } from '../composables/useTextField'

const props = withDefaults(defineProps<{
  modelValue?: string
  id?: string
  options?: TextFieldOptions
}>(), {
  modelValue: '',
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'keydown': [event: KeyboardEvent]
}>()

const {
  id,
  mergedOptions,
  textFieldClasses,
  handleInput,
  handleFocus,
  handleBlur,
  handleKeydown,
  handleClear
} = useTextField(props, emit as (event: string, ...args: unknown[]) => void)
</script>

<style lang="scss" scoped>
.pr-text-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.pr-text-field-label {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  line-height: var(--pr-font-callout-line-height);
  color: var(--pr-color-text-secondary);
  user-select: none;
}

.pr-text-field-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.pr-text-field {
  // Base styles
  display: block;
  width: 100%;
  font-family: var(--pr-font-family-base);
  font-size: var(--pr-font-body-size);
  font-weight: var(--pr-font-body-weight);
  line-height: var(--pr-font-body-line-height);
  color: var(--pr-color-text-primary);
  background-color: var(--pr-color-material-ultrathin);
  border: 2px solid var(--pr-color-fill-secondary);
  border-radius: var(--pr-size-border-radius-rounded-rectangle);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  // Sizes
  height: var(--pr-size-height-regular);
  padding: var(--pr-size-padding-vertical) var(--pr-size-padding-horizontal);

  // Placeholder
  &::placeholder {
    color: var(--pr-color-text-tertiary);
    opacity: 1;
  }

  // States
  &:hover:not(:disabled):not(.pr-text-field--disabled):not(:focus) {
    border-color: var(--pr-color-fill-primary);
  }

  &:focus {
    border-color: var(--pr-color-system-blue);
    box-shadow: 0 0 0 5px rgba(var(--pr-color-system-blue), 0.3);
  }

  &:focus:hover {
    /* Ensure focus ring stays visible when hovering while focused */
    box-shadow: 0 0 0 5px rgba(var(--pr-color-system-blue), 0.3);
  }

  &:disabled,
  &.pr-text-field--disabled {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  // Variants
  &--filled {
    background-color: var(--pr-color-fill-tertiary);
    border-color: transparent;
  }


  // Size variants
  &--mini {
    height: var(--pr-size-height-mini);
    font-size: calc(var(--pr-font-body-size) * 0.85);
  }

  &--small {
    height: var(--pr-size-height-small);
    font-size: calc(var(--pr-font-body-size) * 0.9);
  }

  &--regular {
    height: var(--pr-size-height-regular);
  }

  &--large {
    height: var(--pr-size-height-large);
    font-size: calc(var(--pr-font-body-size) * 1.15);
  }

  &--extra-large {
    height: var(--pr-size-height-extra-large);
    font-size: calc(var(--pr-font-body-size) * 1.3);
  }

}

.pr-text-field-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--pr-color-text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.1s ease, color 0.1s ease;

  &:hover {
    background-color: var(--pr-color-fill-primary);
    color: var(--pr-color-text-secondary);
  }

  &:active {
    background-color: var(--pr-color-fill-secondary);
  }

  svg {
    width: 10px;
    height: 10px;
  }
}

.pr-text-field-helper {
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  user-select: none;
}
</style>
