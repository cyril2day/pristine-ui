<template>
  <div class="pr-radio-wrapper">
    <label
      v-if="mergedOptions.label"
      :for="id"
      class="pr-radio-label"
    >
      {{ mergedOptions.label }}
    </label>
    <div class="pr-radio-container">
      <input
        ref="inputRef"
        :id="id"
        :class="radioClasses"
        :disabled="mergedOptions.disabled"
        :readonly="mergedOptions.readonly"
        :required="mergedOptions.required"
        :checked="isChecked"
        :aria-checked="ariaChecked"
        type="radio"
        :value="value"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="pr-radio-visual" @click="handleVisualClick">
        <!-- Inner dot when checked -->
        <div v-if="isChecked" class="pr-radio-dot"></div>
      </div>
      <label
        v-if="$slots.default"
        :for="id"
        class="pr-radio-custom-label"
      >
        <slot />
      </label>
    </div>
    <p v-if="mergedOptions.helperText" class="pr-radio-helper">
      {{ mergedOptions.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRadio, type RadioOptions } from '../composables/useRadio'

defineOptions({
  name: 'RadioButton'
})

const props = withDefaults(defineProps<{
  modelValue?: unknown
  value: unknown
  id?: string
  options?: RadioOptions
}>(), {
  modelValue: undefined,
  value: undefined,
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  'change': [value: unknown]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const {
  id,
  mergedOptions,
  radioClasses,
  isChecked,
  ariaChecked,
  handleChange,
  handleFocus,
  handleBlur,
} = useRadio(props, emit as (event: string, ...args: unknown[]) => void)

function handleVisualClick() {
  if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
    return
  }
  inputRef.value?.click()
}
</script>

<style lang="scss" scoped>
.pr-radio-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
}

.pr-radio-label {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  line-height: var(--pr-font-callout-line-height);
  color: var(--pr-color-text-secondary);
  user-select: none;
}

.pr-radio-container {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  cursor: default;
}

.pr-radio {
  // Hide native radio visually but keep accessible
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.pr-radio-visual {
  width: var(--pr-radio-size, var(--pr-size-control-regular));
  height: var(--pr-radio-size, var(--pr-size-control-regular));
  border: 1px solid var(--pr-color-fill-secondary);
  border-radius: 50%;
  background-color: var(--pr-color-material-ultrathin);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  cursor: pointer;
  flex-shrink: 0;

  .pr-radio:focus-visible + & {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  .pr-radio:checked + & {
    border-color: var(--pr-color-system-blue);
    background-color: var(--pr-color-system-blue);
  }

  .pr-radio:disabled + &,
  .pr-radio--disabled + & {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }
}

.pr-radio--mini + .pr-radio-visual {
  --pr-radio-size: var(--pr-size-control-mini);
}

.pr-radio--small + .pr-radio-visual {
  --pr-radio-size: var(--pr-size-control-small);
}

.pr-radio--regular + .pr-radio-visual {
  --pr-radio-size: var(--pr-size-control-regular);
}

.pr-radio--large + .pr-radio-visual {
  --pr-radio-size: var(--pr-size-control-large);
}

.pr-radio--extra-large + .pr-radio-visual {
  --pr-radio-size: var(--pr-size-control-extra-large);
}

.pr-radio-dot {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background-color: var(--pr-color-system-white);
}

.pr-radio-custom-label {
  font-size: var(--pr-font-body-size);
  color: var(--pr-color-text-primary);
  user-select: none;
  cursor: pointer;
}

.pr-radio-helper {
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  user-select: none;
}
</style>
