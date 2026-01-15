<template>
  <div
    ref="rootRef"
    :class="indicatorClasses"
    role="tablist"
    :aria-label="ariaLabel"
    :aria-disabled="disabled"
  >
    <button
      v-for="dot in mergedOptions.options"
      :key="dot.value"
      :class="dotButtonClasses(dot)"
      :disabled="isDotDisabled(dot)"
      :aria-label="dot.label || `Tab ${dot.value}`"
      role="tab"
      :aria-selected="isDotSelected(dot.value)"
      :aria-disabled="isDotDisabled(dot)"
      :tabindex="isDotSelected(dot.value) ? 0 : -1"
      @click="handleDotClick(dot)"
      @keydown="handleKeydown($event, dot)"
    >
      <slot
        v-if="$slots.default"
        :dot="dot"
        :active="isDotSelected(dot.value)"
        :disabled="isDotDisabled(dot)"
      />
      <!-- Default dot visualization (circle) -->
      <template v-else>
        <span class="pr-dot-indicator__dot" />
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDotIndicator, type DotIndicatorOption } from '@/composables/useDotIndicator'

const rootRef = ref<HTMLElement | null>(null)

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options?: DotIndicatorOption[]
  size?: 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  modelValue: undefined,
  options: () => [],
  size: 'regular',
  disabled: false,
  ariaLabel: '',
})

defineExpose({
  rootElement: rootRef,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const {
  mergedOptions,
  indicatorClasses,
  isDotSelected,
  isDotDisabled,
  handleDotClick,
  handleKeydown,
} = useDotIndicator(props, emit as (event: string, ...args: unknown[]) => void)

function dotButtonClasses(dot: DotIndicatorOption) {
  return [
    'pr-dot-indicator__button',
    `pr-dot-indicator__button--${props.size}`,
    {
      'pr-dot-indicator__button--selected': isDotSelected(dot.value),
      'pr-dot-indicator__button--disabled': isDotDisabled(dot),
    }
  ]
}
</script>

<style lang="scss" scoped>
.pr-dot-indicator {
  display: inline-flex;
  gap: var(--pr-size-spacing-base);
  align-items: center;
  justify-content: center;
}

.pr-dot-indicator__button {
  width: var(--pr-dot-indicator-size, 8px);
  height: var(--pr-dot-indicator-size, 8px);
  border: none;
  border-radius: 50%;
  background-color: var(--pr-color-fill-secondary);
  cursor: pointer;
  padding: 0;
  position: relative;
  outline: none;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:hover:not(.pr-dot-indicator__button--disabled):not(.pr-dot-indicator__button--selected) {
    background-color: var(--pr-color-fill-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  &--selected {
    background-color: var(--pr-color-system-blue);
    transform: scale(1.2);
  }

  &--disabled {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }
}

// Size variants
.pr-dot-indicator__button--mini {
  --pr-dot-indicator-size: 6px;
}
.pr-dot-indicator__button--small {
  --pr-dot-indicator-size: 7px;
}
.pr-dot-indicator__button--regular {
  --pr-dot-indicator-size: 8px;
}
.pr-dot-indicator__button--large {
  --pr-dot-indicator-size: 10px;
}
.pr-dot-indicator__button--extra-large {
  --pr-dot-indicator-size: 12px;
}
</style>
