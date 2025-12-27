<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--disabled': disabled, 'base-button--block': block }
    ]"
    :disabled="disabled"
    :aria-disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  block?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  block: false,
  ariaLabel: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables/design-tokens' as tokens;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: tokens.$font-family-base;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Variants
  &--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover:not(.base-button--disabled) {
      background-color: hsl(var(--color-primary-h), var(--color-primary-s), calc(var(--color-primary-l) - 10%));
    }
  }

  &--secondary {
    background-color: transparent;
    color: var(--color-primary);
    border-color: var(--color-border);

    &:hover:not(.base-button--disabled) {
      background-color: var(--color-background-secondary);
    }
  }

  &--tertiary {
    background-color: transparent;
    color: var(--color-text-secondary);

    &:hover:not(.base-button--disabled) {
      color: var(--color-text-primary);
      background-color: var(--color-background-secondary);
    }
  }

  &--danger {
    background-color: var(--color-error);
    color: white;

    &:hover:not(.base-button--disabled) {
      background-color: hsl(0, 70%, 40%);
    }
  }

  // Sizes
  &--small {
    padding: tokens.$space-2 tokens.$space-4;
    font-size: 0.875rem;
  }

  &--medium {
    padding: tokens.$space-3 tokens.$space-6;
    font-size: 1rem;
  }

  &--large {
    padding: tokens.$space-4 tokens.$space-8;
    font-size: 1.125rem;
  }
}
</style>
