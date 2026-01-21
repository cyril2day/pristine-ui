<script setup lang="ts">
type ComboBoxVariant =
  | 'filled'
  | 'default'
type Item = {
  id: string | number;
  label: string
}
import { useComboBoxState } from './composables/useComboBoxState'
import IconCaret from '@/icons/icon-caret.vue'
import ComboBoxListbox from './ComboBoxListbox.vue'
import { always } from '@/utils'
import { presenceAttr, isNotEmpty } from '@/utils/component-helpers'

const props = withDefaults(
  defineProps<{
    items?: Item[]
    variant?: ComboBoxVariant
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    items: always([]),
    variant: 'default',
    disabled: false,
    placeholder: '',
  }
)

const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  select: [item: Item]
  open: []
  close: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const {
  isOpen,
  inputRef,
  rootRef,
  filteredItems,
  activeDescendantId,
  activeItemId,
  hasValueAttr,
  toggleOpen,
  onInput,
  onFocus,
  onBlur,
  onKeydown,
  selectItem,
  setActiveItem,
} = useComboBoxState(props, modelValue, emit)
</script>

<template>
  <div
    ref="rootRef"
    class="pr-combo-box"
    :data-variant="variant"
    :data-expanded="presenceAttr(isOpen)"
    :data-disabled="presenceAttr(disabled)"
    :data-has-value="hasValueAttr"
  >
    <input
      ref="inputRef"
      v-bind="$attrs"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      aria-controls="listbox-id"
      :aria-activedescendant="activeDescendantId"
      role="combobox"
      class="pr-combo-box__input"
    />
    <button
      type="button"
      class="pr-combo-box__toggle"
      @click="toggleOpen"
      tabindex="-1"
      aria-label="Toggle dropdown"
    >
      <IconCaret color="var(--color-combobox-caret)" :size="10" />
    </button>
    <ComboBoxListbox
      v-if="isOpen && isNotEmpty(filteredItems)"
      :id="'listbox-id'"
      :items="filteredItems"
      :active-item-id="activeItemId"
      :aria-label="'Options'"
      @select="selectItem"
      @hover="setActiveItem"
    />
  </div>
</template>

<style lang="scss">
@use '@/styles/mixins' as mixins;

:root {
  --color-combobox-caret: hsla(0, 0%, 0%, 0.65);
}

.dark {
  --color-combobox-caret: hsla(0, 0%, 100%, 0.65);
}

.pr-combo-box {

  // Display
  display: inline-flex;
  align-items: center;
  position: relative;

  // Box Model
  box-sizing: border-box;
  width: 100%;
  border-radius: var(--radius-md);
  border: var(--border-width-2) solid transparent;
  background: transparent;
  padding: var(--space-2) var(--space-2);

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

    &:focus-within {
      border-color: var(--color-blue);
      box-shadow: var(--color-blue) 0 0 0 var(--border-width-3);
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
}

// Input element
.pr-combo-box__input {
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

// Toggle button
.pr-combo-box__toggle {
  // Display
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  // Positioning
  position: absolute;
  right: var(--space-3);

  // Box Model
  width: 1.7rem;
  height: 1.7rem;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0;
  margin: 0;

  // Colors & Typography
  color: var(--text-secondary);
  background-color: transparent;
  font-size: var(--text-sm);
  line-height: 1;

  // Other
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus {
    color: var(--text-primary);
    background-color: var(--color-gray4);
  }

  &:active {
    background-color: var(--color-gray3);
  }
}

.pr-combo-box[data-expanded] .pr-combo-box__toggle {
  transform: rotate(180deg);
}

// Dropdown listbox
.pr-combo-box__listbox {
  // Display
  display: block;
  position: absolute;
  z-index: var(--z-index-dropdown);

  // Positioning
  top: 100%;
  left: 0;
  right: 0;

  // Box Model
  margin: var(--space-2) 0 0;
  padding: var(--space-2) 0;
  border-radius: var(--radius-md);
  border: var(--border-width-1) solid var(--color-gray);
  // background: var(--color-gray6);
  background: transparent;
  backdrop-filter: saturate(180%) blur(200px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  // Colors & Typography
  color: var(--text-primary);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  // Other
  list-style: none;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 3px solid transparent;
    background-color: var(--color-gray4);
  }
}

// Option items
.pr-combo-box__option  {
  // Display
  display: block;

  // Box Model
  padding: var(--space-2) var(--space-3);
  margin: 0;

  // Colors & Typography
  background: transparent;
  color: inherit;
  cursor: pointer;

  // Other
  transition: background-color 0.2s ease;

  &:hover,
  &.pr-combo-box__option--active {
    background-color: var(--color-gray5);
  }

  &[aria-selected="true"] {
    background-color: var(--color-blue);
    color: var(--color-white);
  }
}

// Responsive adjustments
@include mixins.respond-to(small-phone) {
  .pr-combo-box {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-sm);

    .pr-combo-box__toggle {
      right: var(--space-2);
      width: 1rem;
      height: 1rem;
      font-size: var(--text-xs);
    }

    .pr-combo-box__listbox {
      max-height: 150px;
    }
  }
}
</style>
