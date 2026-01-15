<script setup lang="ts">
import { ref, computed } from 'vue'
import Checkbox from '@/components/Checkbox.vue'
import type { CheckboxSize } from '@/composables/useCheckbox'

const modelValue = ref<boolean | unknown[]>(false)
const size = ref<CheckboxSize>('regular')
const disabled = ref(false)
const readonly = ref(false)
const label = ref('Checkbox label')
const helperText = ref('Optional helper text')
const indeterminate = ref(false)

const options = computed(() => ({
  size: size.value,
  disabled: disabled.value,
  readonly: readonly.value,
  label: label.value,
  helperText: helperText.value,
}))

function handleChange(value: boolean | unknown[]) {
  console.log('Checkbox changed:', value)
}
</script>

<template>
  <div class="demo-checkbox">
    <div class="demo-preview">
      <Checkbox
        v-model="modelValue"
        :options="options"
        :indeterminate="indeterminate"
        @change="handleChange"
      />
    </div>

    <div class="demo-controls">
      <h3>Props</h3>
      <div class="control-group">
        <label>Size</label>
        <select v-model="size">
          <option value="mini">Mini</option>
          <option value="small">Small</option>
          <option value="regular">Regular</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="disabled">
          Disabled
        </label>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="readonly">
          Readonly
        </label>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="indeterminate">
          Indeterminate
        </label>
      </div>
      <div class="control-group">
        <label>Label Text</label>
        <input type="text" v-model="label" placeholder="Label">
      </div>
      <div class="control-group">
        <label>Helper Text</label>
        <input type="text" v-model="helperText" placeholder="Helper text">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-checkbox {
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
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
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

select {
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

select:focus {
  border-color: var(--pr-color-system-blue);
}

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

input[type="text"]:focus {
  border-color: var(--pr-color-system-blue);
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
