<script setup lang="ts">
import { computed } from 'vue'
import { truthy, presenceAttr, doWhen, always } from '@/utils'

const booleanDataAttr = (cond: boolean) => doWhen(truthy(cond), always('true'))

const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const checked = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  change: [value: boolean]
}>()

const buttonAttributes = computed(() => ({
  'data-checked': booleanDataAttr(checked.value),
  'data-disabled': presenceAttr(props.disabled),
}))

function toggle() {
  if (truthy(props.disabled)) return

  const newValue = !checked.value
  checked.value = newValue
  emit('change', newValue)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div
    class="pr-switch-toggle"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled"
    tabindex="0"
    v-bind="buttonAttributes"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <span class="pr-switch-toggle__thumb" aria-hidden="true"></span>
  </div>
</template>

<style lang="scss">
@use '@/styles/mixins' as mixins;

.pr-switch-toggle {
  // Display
  cursor: pointer;
  display: inline-flex;
  user-select: none;

  // Positioning
  position: relative;

  // Box Model
  width: var(--switch-width, 3rem);
  height: var(--switch-height, 1.5rem);
  border-radius: var(--radius-full);
  border: var(--border-width-1) solid transparent;

  // Colors & Typography
  background-color: var(--color-gray);
  transition: background-color 0.3s ease;

  // Other
  outline: none;

  &:focus-visible {
    outline: var(--border-width-2) solid var(--color-blue);
    outline-offset: var(--space-1);
  }

  &[data-checked='true'] {
    background-color: var(--color-blue);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: var(--opacity-50);
    pointer-events: none;
  }

  @include mixins.respond-to(small-phone) {
    --switch-width: 2.5rem;
    --switch-height: 1.25rem;
  }
}

.pr-switch-toggle__thumb {
  // Display
  display: block;

  // Positioning
  position: absolute;
  top: 50%;
  left: var(--space-1);
  transform: translateY(-50%);

  // Box Model
  width: var(--thumb-diameter, 1.25rem);
  height: var(--thumb-diameter, 1.25rem);
  border-radius: var(--radius-full);

  // Colors & Typography
  background-color: var(--color-white);
  transition: left 0.3s ease, transform 0.3s ease;

  .pr-switch-toggle[data-checked='true'] & {
    left: calc(100% - var(--thumb-diameter, 1.25rem) - var(--space-1));
  }

  @include mixins.respond-to(small-phone) {
    --thumb-diameter: 1rem;
  }
}
</style>
