<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import PushButton from '@/components/PushButton.vue'
import DemoPushButton from './components/DemoPushButton.vue'
import DemoTextField from './components/DemoTextField.vue'
import DemoCheckbox from './components/DemoCheckbox.vue'
import DemoRadioButton from './components/DemoRadioButton.vue'
import DemoSwitchToggle from './components/DemoSwitchToggle.vue'
import DemoSegmentedControl from './components/DemoSegmentedControl.vue'
import DemoTabView from './components/DemoTabView.vue'

const { isDark, toggleTheme } = useTheme()

// Window size tracking
const isSmallScreen = ref(false)
const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

// Sidebar visibility - hidden by default on small screen
const sidebarVisible = ref(true)

// Update sidebar visibility based on screen size
watch(isSmallScreen, (newVal) => {
  sidebarVisible.value = !newVal
}, { immediate: true })

const showOverlay = computed(() => sidebarVisible.value && isSmallScreen.value)

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

// Component selection
type ComponentId = 'push-button' | 'text-field' | 'checkbox' | 'radio-button' | 'switch-toggle' | 'segmented-control' | 'tab-view'
type ComponentCategory = {
  id: string
  title: string
  components: Array<{ id: ComponentId; label: string }>
}
const selectedComponent = ref<ComponentId>('push-button')

const categories: ComponentCategory[] = [
  {
    id: 'selection-input',
    title: 'Selection and Input',
    components: [
      { id: 'text-field', label: 'TextField' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio-button', label: 'RadioButton' },
      { id: 'switch-toggle', label: 'SwitchToggle' },
      { id: 'segmented-control', label: 'SegmentedControl' },
    ]
  },
  {
    id: 'menus-actions',
    title: 'Menus and Actions',
    components: [
      { id: 'push-button', label: 'PushButton' },
    ]
  },
  {
    id: 'layout-organization',
    title: 'Layout and Organization',
    components: [
      { id: 'tab-view', label: 'TabView' },
    ]
  }
]

function selectComponent(id: ComponentId) {
  selectedComponent.value = id
  if (isSmallScreen.value) {
    sidebarVisible.value = false
  }
}
</script>

<template>
  <div class="component-demo-page">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-hidden': !sidebarVisible }">
      <div class="sidebar-header">
        <h2>PristineUI</h2>
        <p class="subtitle">Component Demo</p>
      </div>

      <nav class="sidebar-nav">
        <template v-for="category in categories" :key="category.id">
          <h3 class="nav-section-title">{{ category.title }}</h3>
          <ul class="nav-list">
            <li v-for="component in category.components" :key="component.id">
              <button
                :class="{ active: selectedComponent === component.id }"
                @click="selectComponent(component.id)"
              >
                {{ component.label }}
              </button>
            </li>
          </ul>
        </template>
      </nav>

      <div class="sidebar-section theme-toggle-section">
        <PushButton @click="toggleTheme">
          {{ isDark ? 'Switch to Light' : 'Switch to Dark' }}
        </PushButton>
        <p class="theme-hint">Theme: {{ isDark ? 'Dark' : 'Light' }}</p>
      </div>
    </aside>

    <div v-if="showOverlay" class="sidebar-overlay" @click="toggleSidebar"></div>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-top-row">
          <button class="sidebar-toggle" @click="toggleSidebar" aria-label="Toggle sidebar">
            <span class="toggle-icon">☰</span> Menu
          </button>
          <a
            class="github-link"
            href="https://github.com/cyril2day/pristine-ui"
            target="_blank"
            aria-label="GitHub repository"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.547 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.165 22 16.416 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
            </svg>
          </a>
        </div>
        <h1>{{
          selectedComponent === 'push-button' ? 'PushButton'
          : selectedComponent === 'text-field' ? 'TextField'
          : selectedComponent === 'checkbox' ? 'Checkbox'
          : selectedComponent === 'radio-button' ? 'RadioButton'
          : selectedComponent === 'switch-toggle' ? 'SwitchToggle'
          : selectedComponent === 'segmented-control' ? 'SegmentedControl'
          : 'TabView'
        }}</h1>
        <p class="component-description">
          {{
            selectedComponent === 'push-button'
            ? 'A button component with various roles, sizes, and shapes.'
            : selectedComponent === 'text-field'
            ? 'A text input component with states, sizes, and variants.'
            : selectedComponent === 'checkbox'
            ? 'A checkbox component with support for indeterminate state, sizes, and variants.'
            : selectedComponent === 'radio-button'
            ? 'A radio button component for single selection, with sizes and variants.'
            : selectedComponent === 'switch-toggle'
            ? 'A toggle switch component with on/off labels, sizes, and variants.'
            : selectedComponent === 'segmented-control'
            ? 'A segmented control component for selecting one option from a set, with size variants.'
            : 'A tab view component combining segmented control and tab panels, following Apple HIG and WAI‑ARIA patterns.'
          }}
        </p>
      </header>

      <div class="demo-area">
        <component
          :is="
            selectedComponent === 'push-button' ? DemoPushButton
            : selectedComponent === 'text-field' ? DemoTextField
            : selectedComponent === 'checkbox' ? DemoCheckbox
            : selectedComponent === 'radio-button' ? DemoRadioButton
            : selectedComponent === 'switch-toggle' ? DemoSwitchToggle
            : selectedComponent === 'segmented-control' ? DemoSegmentedControl
            : DemoTabView
          "
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
:global(html),
:global(body) {
  margin: 0;
  overflow: hidden;
}

.component-demo-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--pr-color-material-thick);
  border-right: 1px solid var(--pr-color-fill-tertiary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid var(--pr-color-fill-tertiary);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.sidebar-header h2 {
  font-size: var(--pr-font-title-2-size);
  font-weight: var(--pr-font-title-2-weight);
  color: var(--pr-color-text-primary);
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  margin: 0;
}

.nav-section-title {
  font-size: var(--pr-font-callout-size);
  font-weight: var(--pr-font-callout-weight);
  color: var(--pr-color-text-secondary);
  margin-bottom: 0.75rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-list button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--pr-color-text-secondary);
  font-size: var(--pr-font-body-size);
  font-weight: var(--pr-font-body-weight);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  user-select: none;
}

.nav-list button:hover {
  background-color: var(--pr-color-fill-primary);
  color: var(--pr-color-text-primary);
}

.nav-list button.active {
  background-color: var(--pr-color-fill-primary);
  color: var(--pr-color-text-primary);
  font-weight: var(--pr-font-body-weight-bold);
}

.sidebar-section {
  margin-bottom: 2rem;
}


.theme-toggle-section {
  margin-top: auto;
  padding: 1.5rem;
  border-top: 1px solid var(--pr-color-fill-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.theme-hint {
  font-size: var(--pr-font-caption-1-size);
  color: var(--pr-color-text-tertiary);
  margin-top: 0.5rem;
  text-align: center;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.content-header h1 {
  font-size: var(--pr-font-large-title-size);
  font-weight: var(--pr-font-large-title-weight);
  margin-bottom: 0.5rem;
}

.component-description {
  font-size: var(--pr-font-body-size);
  color: var(--pr-color-text-secondary);
  max-width: 600px;
}

.demo-area {
  border: 1px solid var(--pr-color-fill-tertiary);
  background: var(--pr-color-fill-primary);
  border-radius: 12px;
  padding: 2rem;
  display: block;
  min-height: 200px;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  user-select: none;
}

.sidebar-hidden {
  display: none;
}

.sidebar-toggle {
  display: none;
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--pr-color-text-primary);
  padding: 0.5rem 0;
  border-radius: 0;
  transition: color 0.15s ease;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-toggle:hover {
  background-color: transparent;
  border-color: transparent;
  color: var(--pr-color-text-secondary);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
    margin-bottom: 1rem;
  }

  .component-demo-page {
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background: var(--pr-color-background);
    border-right: 1px solid var(--pr-color-fill-tertiary);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .sidebar:not(.sidebar-hidden) {
    transform: translateX(0);
  }

  .sidebar-hidden {
    display: flex;
    transform: translateX(-100%);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .theme-toggle-section {
    margin-top: 0;
    padding-top: 1.5rem;
    grid-column: 1 / -1;
  }
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.github-link {
  color: var(--pr-color-text-secondary);
  transition: color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.github-link:hover {
  color: var(--pr-color-text-primary);
}
</style>
