<script setup lang="ts">
import { ref } from 'vue'
import TabView from '@/components/TabView.vue'

type Size = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
type Shape = 'rounded' | 'rectangular'

const size = ref<Size>('regular')
const shape = ref<Shape>('rounded')
const disabled = ref(false)
const activeTab = ref('tab1')

const tabs = ref([
  {
    value: 'tab1',
    label: 'Overview',
    content: ''
  },
  {
    value: 'tab2',
    label: 'Usage',
    content: ''
  },
  {
    value: 'tab3',
    label: 'Disabled',
    disabled: true,
    content: ''
  },
  {
    value: 'tab4',
    label: 'Styling',
    content: ''
  },
])

function handleChange(value: string | number) {
  console.log('TabView changed to', value)
}
</script>

<template>
  <div class="demo-tab-view">
    <div class="demo-preview">
      <TabView
        v-model="activeTab"
        :tabs="tabs"
        :size="size"
        :shape="shape"
        :disabled="disabled"
        aria-label="Demo tab view"
        @change="handleChange"
      >
        <template #tab-tab1>
          <h3>Overview</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </template>
        <template #tab-tab2>
          <h3>Usage</h3>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </template>
        <template #tab-tab3>
          <h3>Disabled</h3>
          <p>This tab is disabled and cannot be selected. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        </template>
        <template #tab-tab4>
          <h3>Styling</h3>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </template>
      </TabView>
      <p class="preview-hint">
        Active tab: <strong>{{ activeTab }}</strong>
      </p>
      <p class="responsive-note">
        On small screens (below 735px), the tab control switches to dot indicators.
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
          <option value="rounded">Rounded</option>
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
          <option v-for="tab in tabs" :key="tab.value" :value="tab.value" :disabled="tab.disabled">
            {{ tab.label }} {{ tab.disabled ? '(disabled)' : '' }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>Tab Definitions</label>
        <ul class="tabs-list">
          <li v-for="tab in tabs" :key="tab.value">
            <strong>{{ tab.label }}</strong> ({{ tab.value }}) {{ tab.disabled ? '— disabled' : '' }}
            <p class="tab-content-preview">{{ tab.content }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-tab-view {
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

.responsive-note {
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  margin: 0;
  text-align: center;
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

.tabs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
}

.tab-content-preview {
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  margin: 0.25rem 0 0.5rem 0;
  padding-left: 1rem;
  border-left: 2px solid var(--pr-color-fill-secondary);
}

.pr-tab-panel {
  white-space: pre-line;
}
</style>
