<template>
  <div
    ref="rootRef"
    :class="[segmentClasses, { 'pr-segmented-control--using-keyboard': isUsingKeyboard }]"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-disabled="disabled"
    :name="uniqueName"
    @mousemove="resetKeyboardMode"
  >
    <button
      v-for="(segment, index) in mergedOptions.options"
      :key="segment.value"
      :ref="(el) => segmentButtonRefs[index] = el as HTMLElement"
      :class="segmentButtonClasses(segment)"
      :disabled="isSegmentDisabled(segment)"
      :aria-checked="isSegmentSelected(segment.value)"
      :aria-disabled="isSegmentDisabled(segment)"
      role="radio"
      :tabindex="isSegmentSelected(segment.value) ? 0 : -1"
      @click="handleSegmentClick(segment)"
      @keydown="handleKeydown($event, segment)"
      @mousedown="resetKeyboardMode"
    >
      <slot
        v-if="$slots.default"
        :segment="segment"
        :active="isSegmentSelected(segment.value)"
        :disabled="isSegmentDisabled(segment)"
      />
      <template v-else>
        {{ segment.value }}
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSegmentedControl, type SegmentedControlOption } from '@/composables/useSegmentedControl'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options?: SegmentedControlOption[]
  size?: 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
  disabled?: boolean
  name?: string
  ariaLabel?: string
  shape?: 'rounded' | 'rectangular'
}>(), {
  modelValue: undefined,
  options: () => [],
  size: 'regular',
  disabled: false,
  name: '',
  ariaLabel: '',
  shape: 'rounded',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const rootRef = ref<HTMLElement | null>(null)
const segmentButtonRefs = ref<Array<HTMLElement | null>>([])

function focusSegment(index: number) {
  const el = segmentButtonRefs.value[index]
  if (el) {
    el.focus()
  }
}

defineExpose({
  rootElement: rootRef,
})

const {
  mergedOptions,
  segmentClasses,
  isSegmentSelected,
  isSegmentDisabled,
  handleSegmentClick,
  handleKeydown,
  uniqueName,
  isUsingKeyboard,
  resetKeyboardMode,
} = useSegmentedControl(props, emit as (event: string, ...args: unknown[]) => void, {
  onFocus: focusSegment,
})

function segmentButtonClasses(segment: SegmentedControlOption) {
  return [
    'pr-segmented-control__button',
    `pr-segmented-control__button--${props.size}`,
    {
      'pr-segmented-control__button--selected': isSegmentSelected(segment.value),
      'pr-segmented-control__button--disabled': isSegmentDisabled(segment),
    }
  ]
}
</script>

<style lang="scss" scoped>
body .pr-segmented-control {
  background: hsl(240, 3%, 94%);

  &__button--selected {
    background: var(--pr-color-system-white);
  }
}

body.dark .pr-segmented-control {
  background: hsl(240, 3%, 12%);

  &__button--selected {
    background:	hsl(240, 1%, 39%);
  }
}

.pr-segmented-control {
  display: inline-flex;
  border-radius: var(--pr-size-border-radius-capsule);
  padding: var(--pr-size-spacing-extra-tight) var(--pr-size-spacing-tight);
  gap: 2px;
}

.pr-segmented-control--rectangular {
  border-radius: var(--pr-size-border-radius-rounded-rectangle);
}

.pr-segmented-control--rectangular .pr-segmented-control__button {
  border-radius: calc(var(--pr-size-border-radius-rounded-rectangle) - 2px);
}

.pr-segmented-control__button {
  flex: 1;
  min-width: 0;
  height: var(--pr-size-height-regular);
  padding: 0 16px;
  border: none;
  border-radius: calc(var(--pr-size-border-radius-capsule) - 4px);
  background-color: transparent;
  color: var(--pr-color-text-secondary);
  font-size: var(--pr-font-body-size);
  font-weight: var(--pr-font-body-weight);
  line-height: var(--pr-font-body-line-height);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  outline: none;

  &:hover:not(.pr-segmented-control__button--disabled):not(.pr-segmented-control__button--selected) {
    background-color: var(--pr-color-fill-primary);
  }

  .pr-segmented-control--using-keyboard &:hover:not(.pr-segmented-control__button--disabled):not(.pr-segmented-control__button--selected) {
    background-color: transparent;
  }

  &:focus-visible {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  &--selected {
    color: var(--pr-color-text-primary);
  }

  &--disabled {
    opacity: var(--pr-opacity-disabled-strong);
    color: var(--pr-color-text-tertiary);
    cursor: not-allowed;
    pointer-events: none;
  }
}

// Size variants
.pr-segmented-control__button--mini {
  height: var(--pr-size-height-mini);
  font-size: calc(var(--pr-font-body-size) * 0.85);
}

.pr-segmented-control__button--small {
  height: var(--pr-size-height-small);
  font-size: calc(var(--pr-font-body-size) * 0.9);
}

.pr-segmented-control__button--regular {
  height: var(--pr-size-height-regular);
}

.pr-segmented-control__button--large {
  height: var(--pr-size-height-large);
  font-size: calc(var(--pr-font-body-size) * 1.15);
}

.pr-segmented-control__button--extra-large {
  height: var(--pr-size-height-extra-large);
  font-size: calc(var(--pr-font-body-size) * 1.3);
}
</style>
