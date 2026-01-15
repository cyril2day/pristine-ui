<script setup lang="ts">
import { ref } from 'vue'
import TextField from '@/components/TextField.vue'
import type { TextFieldOptions } from '@/composables/useTextField'

const modelValue = ref('')
const options = ref<TextFieldOptions>({
  size: 'regular',
  variant: 'default',
  disabled: false,
  readonly: false,
  clearable: false,
  placeholder: 'Type something...',
  label: 'Demo Label',
  helperText: 'This is a helper text',
})

// Available options
const sizeOptions = ['mini', 'small', 'regular', 'large', 'extra-large']
const variantOptions = ['default', 'filled']
</script>

<template>
  <div class="demo-text-field">
    <div class="demo-preview">
      <TextField
        v-model="modelValue"
        :options="options"
      />
      <p class="preview-value">Value: {{ modelValue || '(empty)' }}</p>
    </div>

    <div class="demo-controls">
      <h3>Props</h3>
      <div class="control-group">
        <label>Size</label>
        <select v-model="options.size">
          <option v-for="size in sizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>Variant</label>
        <select v-model="options.variant">
          <option v-for="variant in variantOptions" :key="variant" :value="variant">
            {{ variant }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="options.disabled">
          Disabled
        </label>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="options.readonly">
          Readonly
        </label>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="options.clearable">
          Clearable
        </label>
      </div>
      <div class="control-group">
        <label>Placeholder</label>
        <input type="text" v-model="options.placeholder" placeholder="Placeholder text">
      </div>
      <div class="control-group">
        <label>Label</label>
        <input type="text" v-model="options.label" placeholder="Label text">
      </div>
      <div class="control-group">
        <label>Helper Text</label>
        <input type="text" v-model="options.helperText" placeholder="Helper text">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-text-field {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 2rem;
}

.demo-preview {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.preview-value {
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  margin-top: 1rem;
}

.demo-controls {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: var(--pr-font-callout-size);
  color: var(--pr-color-text-secondary);
  font-weight: var(--pr-font-callout-weight);
}

select,
input[type="text"] {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--pr-color-fill-secondary);
  background: var(--pr-color-background);
  color: var(--pr-color-text-primary);
  font-size: var(--pr-font-body-size);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

select:focus,
input[type="text"]:focus {
  border-color: var(--pr-color-system-blue);
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
