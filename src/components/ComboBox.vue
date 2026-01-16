<template>
  <div class="pr-combo-box-wrapper" ref="wrapperRef">
    <label
      v-if="mergedOptions.label"
      :for="id"
      class="pr-combo-box-label"
    >
      {{ mergedOptions.label }}
    </label>
    <div class="pr-combo-box-container">
      <input
        :id="id"
        :class="comboBoxClasses"
        :disabled="mergedOptions.disabled"
        :readonly="mergedOptions.readonly"
        :placeholder="mergedOptions.placeholder"
        :value="displayValue"
        :autocomplete="mergedOptions.autocomplete"
        :required="mergedOptions.required"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        v-bind="inputAriaAttributes"
      />
      <button
        v-if="!mergedOptions.readonly"
        class="pr-combo-box-toggle"
        type="button"
        @click="toggleDropdown"
        :disabled="mergedOptions.disabled"
        :aria-label="toggleButtonAriaLabel"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div
        v-if="isOpen"
        class="pr-combo-box-dropdown"
        :id="dropdownId"
        role="listbox"
        @blur="closeDropdown"
      >
        <ul class="pr-combo-box-dropdown-list">
          <li
            v-for="(item, index) in filteredItems"
            :key="item.value"
            :id="getOptionId(index)"
            :class="dropdownItemClasses(item)"
            @click="selectItem(item)"
            @mouseenter="activeIndex = index"
            role="option"
            :aria-selected="selectedItem?.value === item.value"
            :aria-disabled="item.disabled || undefined"
          >
            {{ item.label ?? item.value.toString() }}
          </li>
          <li
            v-if="filteredItems.length === 0"
            class="pr-combo-box-no-results"
          >
            {{ mergedOptions.noResultsText }}
          </li>
          <li
            v-if="mergedOptions.loading"
            class="pr-combo-box-loading"
          >
            Loading…
          </li>
        </ul>
      </div>
    </div>
    <p v-if="mergedOptions.helperText" class="pr-combo-box-helper">
      {{ mergedOptions.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useComboBox, type ComboBoxOptions } from '../composables/useComboBox'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  id?: string
  items?: Array<{ value: string | number, label?: string, disabled?: boolean }>
  options?: ComboBoxOptions
}>(), {
  modelValue: null,
  items: () => [],
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'input': [value: string]
  'open': []
  'close': []
}>()

const {
  id,
  mergedOptions,
  isOpen,
  displayValue,
  filteredItems,
  dropdownId,
  comboBoxClasses,
  inputAriaAttributes,
  toggleButtonAriaLabel,
  activeIndex,
  selectedItem,
  toggleDropdown,
  closeDropdown,
  handleInput,
  handleFocus,
  handleBlur,
  selectItem,
  handleKeydown,
  dropdownItemClasses,
  getOptionId
} = useComboBox(props, emit as (event: string, ...args: unknown[]) => void)

const wrapperRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.pr-combo-box-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
}

.pr-combo-box-label {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  line-height: var(--pr-font-callout-line-height);
  color: var(--pr-color-text-secondary);
  user-select: none;
}

.pr-combo-box-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.pr-combo-box {
  // Base styles – reuse TextField styles
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
  padding-right: calc(var(--pr-size-padding-horizontal) + 28px); // space for toggle button

  // Placeholder
  &::placeholder {
    color: var(--pr-color-text-tertiary);
    opacity: 1;
  }

  // States
  &:hover:not(:disabled):not(.pr-combo-box--disabled):not(:focus) {
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
  &.pr-combo-box--disabled {
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

.pr-combo-box-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--pr-color-text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.1s ease, color 0.1s ease;

  &:hover:not(:disabled) {
    background-color: var(--pr-color-fill-primary);
    color: var(--pr-color-text-secondary);
  }

  &:active:not(:disabled) {
    background-color: var(--pr-color-fill-secondary);
  }

  &:disabled {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
}

.pr-combo-box-dropdown {
  --pr-dropdown-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --pr-dropdown-item-padding: var(--pr-size-padding-vertical) var(--pr-size-padding-horizontal);
  --pr-dropdown-item-hover-background: var(--pr-color-fill-primary);
  --pr-dropdown-item-selected-background: var(--pr-color-system-blue);

  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--pr-color-material-ultrathick);
  border: var(--pr-color-fill-secondary);
  border-radius: var(--pr-size-border-radius-rounded-rectangle);
  box-shadow: var(--pr-dropdown-shadow);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.pr-combo-box-dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pr-combo-box-dropdown-item {
  padding: var(--pr-dropdown-item-padding);
  cursor: pointer;
  color: var(--pr-color-text-primary);
  font-size: var(--pr-font-body-size);
  font-weight: var(--pr-font-body-weight);
  line-height: var(--pr-font-body-line-height);
  transition: background-color 0.1s ease;

  &:hover:not(.pr-combo-box-dropdown-item--disabled) {
    background-color: var(--pr-dropdown-item-hover-background);
  }

  &.pr-combo-box-dropdown-item--selected {
    background-color: var(--pr-dropdown-item-selected-background);
    color: var(--pr-color-system-white);
  }

  &.pr-combo-box-dropdown-item--active {
    background-color: var(--pr-color-fill-secondary);
  }

  &.pr-combo-box-dropdown-item--disabled {
    opacity: var(--pr-opacity-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }
}

.pr-combo-box-no-results,
.pr-combo-box-loading {
  padding: var(--pr-size-padding-vertical) var(--pr-size-padding-horizontal);
  color: var(--pr-color-text-tertiary);
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  text-align: center;
}

.pr-combo-box-helper {
  font-size: var(--pr-font-caption-1-size);
  font-weight: var(--pr-font-caption-1-weight);
  line-height: var(--pr-font-caption-1-line-height);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  user-select: none;
}
</style>
