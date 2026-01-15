<template>
  <div class="pr-switch-wrapper">
    <label
      v-if="mergedOptions.label"
      :for="id"
      class="pr-switch-label"
    >
      {{ mergedOptions.label }}
    </label>
    <div class="pr-switch-container">
      <input
        ref="inputRef"
        :id="id"
        :class="switchClasses"
        :disabled="mergedOptions.disabled"
        :readonly="mergedOptions.readonly"
        :checked="isChecked"
        :aria-checked="ariaChecked"
        type="checkbox"
        role="switch"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="pr-switch-visual" @click="handleVisualClick">
        <div class="pr-switch-track">
          <div class="pr-switch-thumb"></div>
        </div>
        <span
          v-if="mergedOptions.onLabel || mergedOptions.offLabel"
          class="pr-switch-labels"
        >
          <span class="pr-switch-label-on">{{ mergedOptions.onLabel }}</span>
          <span class="pr-switch-label-off">{{ mergedOptions.offLabel }}</span>
        </span>
      </div>
      <label
        v-if="$slots.default"
        :for="id"
        class="pr-switch-custom-label"
      >
        <slot />
      </label>
    </div>
    <p v-if="mergedOptions.helperText" class="pr-switch-helper">
      {{ mergedOptions.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSwitch, type SwitchOptions } from '../composables/useSwitch'

defineOptions({
  name: 'SwitchToggle'
})

const props = withDefaults(defineProps<{
  modelValue?: boolean
  id?: string
  options?: SwitchOptions
}>(), {
  modelValue: false,
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const {
  id,
  mergedOptions,
  switchClasses,
  isChecked,
  ariaChecked,
  handleChange,
  handleFocus,
  handleBlur,
} = useSwitch(props, emit as (event: string, ...args: unknown[]) => void)

function handleVisualClick() {
  if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
    return
  }
  inputRef.value?.click()
}
</script>

<style lang="scss" scoped>
.pr-switch-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: fit-content;
}

.pr-switch-label {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  line-height: var(--pr-font-callout-line-height);
  color: var(--pr-color-text-secondary);
  user-select: none;
}

.pr-switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  cursor: default;
}

.pr-switch {
  // Hide native checkbox visually but keep accessible
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.pr-switch-visual {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pr-switch--mini + .pr-switch-visual {
  --pr-switch-track-width: var(--pr-size-track-width-mini);
  --pr-switch-track-height: var(--pr-size-track-height-mini);
  --pr-switch-thumb-size: var(--pr-size-thumb-size-mini);
}

.pr-switch--small + .pr-switch-visual {
  --pr-switch-track-width: var(--pr-size-track-width-small);
  --pr-switch-track-height: var(--pr-size-track-height-small);
  --pr-switch-thumb-size: var(--pr-size-thumb-size-small);
}

.pr-switch--regular + .pr-switch-visual {
  --pr-switch-track-width: var(--pr-size-track-width-regular);
  --pr-switch-track-height: var(--pr-size-track-height-regular);
  --pr-switch-thumb-size: var(--pr-size-thumb-size-regular);
}

.pr-switch--large + .pr-switch-visual {
  --pr-switch-track-width: var(--pr-size-track-width-large);
  --pr-switch-track-height: var(--pr-size-track-height-large);
  --pr-switch-thumb-size: var(--pr-size-thumb-size-large);
}

.pr-switch--extra-large + .pr-switch-visual {
  --pr-switch-track-width: var(--pr-size-track-width-extra-large);
  --pr-switch-track-height: var(--pr-size-track-height-extra-large);
  --pr-switch-thumb-size: var(--pr-size-thumb-size-extra-large);
}

.pr-switch-track {
  width: var(--pr-switch-track-width, var(--pr-size-track-width-regular));
  height: var(--pr-switch-track-height, var(--pr-size-track-height-regular));
  border-radius: var(--pr-size-border-radius-capsule);
  background-color: var(--pr-color-fill-secondary);
  position: relative;
  transition: background-color 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;

  .pr-switch:checked + .pr-switch-visual & {
    background-color: var(--pr-color-system-blue);
  }

  .pr-switch:focus-visible + .pr-switch-visual & {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  .pr-switch:disabled + .pr-switch-visual &,
  .pr-switch--disabled + .pr-switch-visual & {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }
}

.pr-switch-thumb {
  position: absolute;
  top: 50%;
  left: var(--pr-size-thumb-offset);
  transform: translateY(-50%);
  width: var(--pr-switch-thumb-size, var(--pr-size-thumb-size-regular));
  height: var(--pr-switch-thumb-size, var(--pr-size-thumb-size-regular));
  border-radius: 50%;
  background-color: var(--pr-color-system-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s ease;

  .pr-switch:checked + .pr-switch-visual .pr-switch-track & {
    left: calc(100% - var(--pr-switch-thumb-size, var(--pr-size-thumb-size-regular)) - var(--pr-size-thumb-offset));
  }
}

.pr-switch-labels {
  display: flex;
  flex-direction: column;
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  line-height: 1.2;
  user-select: none;

  .pr-switch-label-on,
  .pr-switch-label-off {
    transition: color 0.2s ease;
  }

  .pr-switch:checked + .pr-switch-visual & .pr-switch-label-on {
    color: var(--pr-color-text-primary);
  }

  .pr-switch:not(:checked) + .pr-switch-visual & .pr-switch-label-off {
    color: var(--pr-color-text-primary);
  }
}

.pr-switch-custom-label {
  font-size: var(--pr-font-body-size);
  color: var(--pr-color-text-primary);
  user-select: none;
  cursor: pointer;
}

.pr-switch-helper {
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  user-select: none;
}
</style>
