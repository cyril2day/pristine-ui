<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    :aria-disabled="disabled"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">

import { computed } from 'vue'

const props = withDefaults(defineProps<{
  role?: 'normal' | 'primary' | 'destructive' | 'cancel'
  size?: 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
  shape?: 'rounded-rectangle' | 'capsule' | 'circular'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  role: 'normal',
  size: 'regular',
  shape: 'rounded-rectangle',
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
}>()

const buttonClasses = computed(() => [
  'pr-button',
  `pr-button--${props.role}`,
  `pr-button--${props.size}`,
  `pr-button--${props.shape}`,
  {
    'pr-button--disabled': props.disabled
  }
])

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)
}
</script>

<style lang="scss" scoped>
.pr-button {
  // Base styles
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--pr-font-body-size);
  font-weight: var(--pr-font-body-weight);
  line-height: var(--pr-font-body-line-height);
  text-decoration: none;
  white-space: nowrap;
  border: none;
  outline: none;
  transition: filter 0.1s ease, opacity 0.1s ease;

  // Dimensions
  min-width: var(--pr-size-min-width);
  min-height: var(--pr-size-height-regular);
  padding: var(--pr-size-padding-vertical) var(--pr-size-padding-horizontal);

  // Colors and background
  background-color: var(--pr-color-material-thin);
  color: var(--pr-color-text-primary);

  // Border radius
  border-radius: var(--pr-size-border-radius-rounded-rectangle);

  // States
  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:active:not(:disabled) {
    filter: brightness(0.8);
  }

  &:focus-visible {
    outline: 2px solid var(--pr-color-system-blue);
    outline-offset: 2px;
  }

  &:disabled,
  &.pr-button--disabled {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  // Role variants
  &--primary {
    background-color: var(--pr-color-system-blue);
    color: var(--pr-color-system-white);
  }

  &--destructive {
    background-color: var(--pr-color-system-red);
    color: var(--pr-color-system-white);
  }

  &--cancel {
    background-color: var(--pr-color-system-gray);
    color: var(--pr-color-text-primary);
  }

  // Size variants
  &--mini {
    min-height: var(--pr-size-height-mini);
    font-size: calc(var(--pr-font-body-size) * 0.85);
  }

  &--small {
    min-height: var(--pr-size-height-small);
    font-size: calc(var(--pr-font-body-size) * 0.9);
  }

  &--regular {
    min-height: var(--pr-size-height-regular);
  }

  &--large {
    min-height: var(--pr-size-height-large);
    font-size: calc(var(--pr-font-body-size) * 1.15);
  }

  &--extra-large {
    min-height: var(--pr-size-height-extra-large);
    font-size: calc(var(--pr-font-body-size) * 1.3);
  }

  // Shape variants
  &--capsule {
    border-radius: var(--pr-size-border-radius-capsule);
  }

  &--circular {
    border-radius: var(--pr-size-border-radius-circular);
    aspect-ratio: 1;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
