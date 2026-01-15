<script setup lang="ts">
import { ref } from 'vue'
import SegmentedControl from '@/components/SegmentedControl.vue'

type Size = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

const size = ref<Size>('regular')
const disabled = ref(false)
const shape = ref<'rounded' | 'rectangular'>('rounded')
const activeTab = ref('tab1')

const options = ref([
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3', disabled: true },
  { value: 'tab4', label: 'Tab 4' },
])

const iconOptions = ref([
  { value: 'star', label: '⭐' },
  { value: 'bell', label: '🔔' },
  { value: 'gear', label: '⚙️' },
  { value: 'heart', label: '❤️' },
])

const iconActive = ref('star')

function handleChange(value: string | number) {
  console.log('SegmentedControl changed to', value)
}
</script>

<template>
  <div class="demo-segmented-control">
    <div class="demo-preview">
      <SegmentedControl
        v-model="activeTab"
        :options="options"
        :size="size"
        :disabled="disabled"
        :shape="shape"
        aria-label="Demo tab selection"
        @change="handleChange"
      />
      <p class="preview-hint">
        Active tab: <strong>{{ activeTab }}</strong>
      </p>
    </div>

    <div class="demo-preview">
      <h3>Icon‑only segments</h3>
      <SegmentedControl
        v-model="iconActive"
        :options="iconOptions"
        size="regular"
        shape="rounded"
        aria-label="Icon selection"
        @change="handleChange"
      >
        <template #default="{ segment }">
          <span style="font-size: 1.5em">{{ segment.label }}</span>
        </template>
      </SegmentedControl>
      <p class="preview-hint">
        Active icon: <strong>{{ iconActive }}</strong>
      </p>
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
        <label>Shape</label>
        <select v-model="shape">
          <option value="rounded">Rounded (capsule)</option>
          <option value="rectangular">Rectangular</option>
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="disabled">
          Disabled
        </label>
      </div>
      <div class="control-group">
        <label>Active Tab</label>
        <select v-model="activeTab">
          <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
            {{ opt.label }} {{ opt.disabled ? '(disabled)' : '' }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>Options (editing not implemented)</label>
        <ul class="options-list">
          <li v-for="opt in options" :key="opt.value">
            {{ opt.label }} ({{ opt.value }}) {{ opt.disabled ? '— disabled' : '' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-segmented-control {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 2rem;
}

.demo-preview {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
  gap: 1rem;
}

.preview-hint {
  font-size: var(--pr-font-callout-size);
  color: var(--pr-color-text-secondary);
  margin: 0;
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

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
}
</style>
