<template>
  <div class="pr-checkbox-wrapper">
    <label
      v-if="mergedOptions.label"
      :for="id"
      class="pr-checkbox-label"
    >
      {{ mergedOptions.label }}
    </label>
    <div class="pr-checkbox-container">
      <input
        ref="inputRef"
        :id="id"
        :class="checkboxClasses"
        :disabled="mergedOptions.disabled"
        :readonly="mergedOptions.readonly"
        :required="mergedOptions.required"
        :checked="isChecked"
        :aria-checked="ariaChecked"
        type="checkbox"
        :value="value"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div
        class="pr-checkbox-visual"
        :class="{ 'pr-checkbox-visual--indeterminate': indeterminate }"
        @click="handleVisualClick"
      >
        <!-- Checkmark SVG -->
        <svg
          v-if="isChecked && !indeterminate"
          class="pr-checkbox-checkmark"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- Indeterminate dash -->
        <svg
          v-if="indeterminate"
          class="pr-checkbox-indeterminate"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <label
        v-if="$slots.default"
        :for="id"
        class="pr-checkbox-custom-label"
      >
        <slot />
      </label>
    </div>
    <p v-if="mergedOptions.helperText" class="pr-checkbox-helper">
      {{ mergedOptions.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCheckbox, type CheckboxOptions } from '../composables/useCheckbox'

defineOptions({
  name: 'CheckBox'
})

const props = withDefaults(defineProps<{
  modelValue?: boolean | unknown[]
  value?: unknown
  indeterminate?: boolean
  id?: string
  options?: CheckboxOptions
}>(), {
  modelValue: undefined,
  value: undefined,
  indeterminate: false,
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | unknown[]]
  'change': [value: boolean | unknown[]]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const {
  id,
  mergedOptions,
  checkboxClasses,
  isChecked,
  ariaChecked,
  handleChange,
  handleFocus,
  handleBlur,
} = useCheckbox(props, emit as (event: string, ...args: unknown[]) => void)

function handleVisualClick() {
  if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
    return
  }
  inputRef.value?.click()
}
</script>

<style lang="scss" scoped>
.pr-checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
}

.pr-checkbox-label {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  line-height: var(--pr-font-callout-line-height);
  color: var(--pr-color-text-secondary);
  user-select: none;
}

.pr-checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  cursor: default;
}

.pr-checkbox {
  // Hide native checkbox visually but keep accessible
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.pr-checkbox-visual {
  width: var(--pr-checkbox-size, var(--pr-size-control-regular));
  height: var(--pr-checkbox-size, var(--pr-size-control-regular));
  border: 1px solid var(--pr-color-fill-secondary);
  border-radius: 4px;
  background-color: var(--pr-color-material-ultrathin);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  cursor: pointer;
  flex-shrink: 0;

  .pr-checkbox:focus-visible + & {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  .pr-checkbox:checked + &,
  .pr-checkbox--indeterminate + & {
    border-color: var(--pr-color-system-blue);
    background-color: var(--pr-color-system-blue);
  }

  .pr-checkbox:disabled + &,
  .pr-checkbox--disabled + & {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }
}

.pr-checkbox--mini + .pr-checkbox-visual {
  --pr-checkbox-size: var(--pr-size-control-mini);
}

.pr-checkbox--small + .pr-checkbox-visual {
  --pr-checkbox-size: var(--pr-size-control-small);
}

.pr-checkbox--regular + .pr-checkbox-visual {
  --pr-checkbox-size: var(--pr-size-control-regular);
}

.pr-checkbox--large + .pr-checkbox-visual {
  --pr-checkbox-size: var(--pr-size-control-large);
}

.pr-checkbox--extra-large + .pr-checkbox-visual {
  --pr-checkbox-size: var(--pr-size-control-extra-large);
}

.pr-checkbox-checkmark,
.pr-checkbox-indeterminate {
  width: 60%;
  height: 60%;
  color: var(--pr-color-system-white);
}

.pr-checkbox-custom-label {
  font-size: var(--pr-font-body-size);
  color: var(--pr-color-text-primary);
  user-select: none;
  cursor: pointer;
}

.pr-checkbox-helper {
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  user-select: none;
}
</style>
