<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import PushButton from '@/components/push-button/PushButton.vue'
import SwitchToggle from '@/components/switch-toggle/SwitchToggle.vue'
import TextField from '@/components/text-field/TextField.vue'
import TextArea from '@/components/text-area/TextArea.vue'
import ComboBox from '@/components/combo-box/ComboBox.vue'
import CardDisplay from '@/components/card-display/CardDisplay.vue'
import CheckBox from '@/components/checkbox/CheckBox.vue'
import SegmentedControl from '@/components/segmented-control/SegmentedControl.vue'
import IconGithub from '@/icons/icon-github.vue'

const switch1 = ref(false)
const switch2 = ref(true)
const switchDisabled = ref(false)
const textValue = ref('')
const textValue2 = ref('Initial text')
const isDark = ref(false)
const comboValue = ref('')
const comboItems = ref([
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Blackberry' },
  { id: 4, label: 'Blueberry' },
  { id: 5, label: 'Cantaloupe' },
  { id: 6, label: 'Cherry' },
  { id: 7, label: 'Clementine' },
  { id: 8, label: 'Date' },
  { id: 9, label: 'Eggplant' },
  { id: 10, label: 'Elderberry' },
])

const segmentedValue = ref(1)
const segmentedItems = ref([
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
  { id: 3, label: 'Option 3', disabled: true },
])

const textareaValue = ref('')
const textareaValue2 = ref('Initial text')
const resizable = ref(true)
const showCounter = ref(false)
const maxLength = ref(100)

const checkbox1 = ref(false)
const checkbox2 = ref(true)

const indeterminateChecked = ref(false)
const indeterminateIndeterminate = ref(true)

watch(indeterminateChecked, () => {
  indeterminateIndeterminate.value = false
})

const child1 = ref(false)
const child2 = ref(false)

const parentChecked = computed({
  get: () => child1.value && child2.value,
  set: (newChecked) => {
    child1.value = newChecked
    child2.value = newChecked
  }
})

const parentIndeterminate = computed(() => (child1.value || child2.value) && !(child1.value && child2.value))

const currentTheme = computed(() => {
  return isDark.value ? 'Dark' : 'Light'
})

watch(isDark, (isNowDark) => {
  if (isNowDark) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
})
</script>

<template>
  <div class="demo-page">
    <main class="main-content">
      <section class="top-section">
        <div>
          <h1 class="page-title">Component Demo</h1>
          <p class="page-subtitle">A simple showcase of the available components.</p>
        </div>

        <div class="top-right-actions">
          <div class="theme-toggle">
            <span class="theme-toggle-label">Theme ({{ currentTheme }})</span>
            <SwitchToggle v-model="isDark" />
          </div>
          <div class="github-corner">
            <a
              href="https://github.com/cyril2day/pristine-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <IconGithub />
            </a>
          </div>
        </div>
      </section>

      <div class="cards-grid">
        <!-- PushButton Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">PushButton</h2>
          <p class="card-description">Various button roles, shapes, and states.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Normal</h3>
              <PushButton role="normal">Normal Button</PushButton>
            </div>
            <div class="example">
              <h3>Primary</h3>
              <PushButton role="primary">Primary Button</PushButton>
            </div>
            <div class="example">
              <h3>Destructive</h3>
              <PushButton role="destructive">Destructive Button</PushButton>
            </div>
            <div class="example">
              <h3>Cancel</h3>
              <PushButton role="cancel">Cancel Button</PushButton>
            </div>
            <div class="example">
              <h3>Capsule Shape</h3>
              <PushButton shape="capsule">Capsule</PushButton>
            </div>
            <div class="example">
              <h3>Rounded Rectangle</h3>
              <PushButton shape="rounded-rectangle">Rounded Rectangle</PushButton>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <PushButton disabled>Disabled Button</PushButton>
            </div>
            <div class="example">
              <h3>Click Event</h3>
              <PushButton @click="() => console.log('clicked')">Click Me</PushButton>
            </div>
          </div>
        </CardDisplay>

    <!-- CardDisplay Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">CardDisplay</h2>
          <p class="card-description">Apple‑inspired card container with outlined and elevated variants.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Outlined variant</h3>
              <CardDisplay variant="outlined">
                <h4>Outlined Card</h4>
                <p>This card has a subtle border.</p>
              </CardDisplay>
            </div>
            <div class="example">
              <h3>Elevated variant</h3>
              <CardDisplay variant="elevated">
                <h4>Elevated Card</h4>
                <p>This card has a subtle shadow that increases on hover.</p>
              </CardDisplay>
            </div>
          </div>
        </CardDisplay>


        <!-- SwitchToggle Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">SwitchToggle</h2>
          <p class="card-description">Apple‑inspired toggle switch with v‑model support.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Default (off)</h3>
              <SwitchToggle v-model="switch1" />
              <p class="example-state">State: {{ switch1 ? 'on' : 'off' }}</p>
            </div>
            <div class="example">
              <h3>Default (on)</h3>
              <SwitchToggle v-model="switch2" />
              <p class="example-state">State: {{ switch2 ? 'on' : 'off' }}</p>
            </div>
            <div class="example">
              <h3>Disabled (off)</h3>
              <SwitchToggle v-model="switchDisabled" disabled />
              <p class="example-state">State: {{ switchDisabled ? 'on' : 'off' }}</p>
            </div>
            <div class="example">
              <h3>Interactive</h3>
              <SwitchToggle v-model="switch1" />
              <SwitchToggle v-model="switch2" />
              <p class="example-state">Toggle both independently.</p>
            </div>
          </div>
        </CardDisplay>

        <!-- TextField Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">TextField</h2>
          <p class="card-description">Apple‑inspired text field with variants and clearable support.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Default variant</h3>
              <TextField v-model="textValue" placeholder="Type something..." clearable />
              <p class="example-state">Value: {{ textValue }}</p>
            </div>
            <div class="example">
              <h3>Filled variant</h3>
              <TextField v-model="textValue2" variant="filled" clearable />
              <p class="example-state">Value: {{ textValue2 }}</p>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <TextField disabled placeholder="Cannot edit" />
            </div>
            <div class="example">
              <h3>Readonly attribute</h3>
              <TextField readonly placeholder="Readonly" :model-value="'Read-only value'" />
            </div>
            <div class="example">
              <h3>Password type</h3>
              <TextField type="password" placeholder="Enter password" />
            </div>
          </div>
        </CardDisplay>

 <!-- ComboBox Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">ComboBox</h2>
          <p class="card-description">Apple‑inspired combobox with filtering and keyboard navigation.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Default variant</h3>
              <ComboBox v-model="comboValue" :items="comboItems" placeholder="Select a fruit..." />
              <p class="example-state">Selected: {{ comboValue }}</p>
            </div>
            <div class="example">
              <h3>Filled variant</h3>
              <ComboBox v-model="comboValue" :items="comboItems" variant="filled" placeholder="Select a fruit..." />
              <p class="example-state">Selected: {{ comboValue }}</p>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <ComboBox disabled placeholder="Disabled" :items="comboItems" />
            </div>
            <div class="example">
              <h3>With initial value</h3>
              <ComboBox v-model="comboValue" :items="comboItems" placeholder="Select a fruit..." />
              <p class="example-state">Selected: {{ comboValue }}</p>
            </div>
          </div>
        </CardDisplay>


        <!-- CheckBox Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">CheckBox</h2>
          <p class="card-description">Apple‑inspired checkbox with tri‑state support and WAI ARIA compliance.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Default (unchecked)</h3>
              <CheckBox v-model="checkbox1" />
              <p class="example-state">State: {{ checkbox1 ? 'checked' : 'unchecked' }}</p>
            </div>
            <div class="example">
              <h3>Checked</h3>
              <CheckBox v-model="checkbox2" />
              <p class="example-state">State: {{ checkbox2 ? 'checked' : 'unchecked' }}</p>
            </div>
            <div class="example">
              <h3>Controlled indeterminate</h3>
              <CheckBox v-model="indeterminateChecked" :indeterminate="indeterminateIndeterminate" />
              <p class="example-state">
                Checked: {{ indeterminateChecked ? 'yes' : 'no' }},
                Indeterminate: {{ indeterminateIndeterminate ? 'yes' : 'no' }}
              </p>
              <PushButton
                role="primary"
                @click="indeterminateIndeterminate = !indeterminateIndeterminate"
              >
                Toggle indeterminate
              </PushButton>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <CheckBox disabled />
              <p class="example-state">Cannot interact</p>
            </div>
            <div class="example">
              <h3>Parent‑child group</h3>
              <div class="parent-child-demo">
                <div>
                  <CheckBox
                    v-model="parentChecked"
                    :indeterminate="parentIndeterminate"
                    aria-label="Parent checkbox"
                  />
                  <span>All Condiments</span>
                </div>
                <div style="display: flex; flex-direction: column; margin-left: 1.5rem;">
                  <p style="display: flex; gap: 2px; align-items: flex-end; margin: 5px 0;">
                    <CheckBox v-model="child1" aria-label="Child 1" /> Lettuce
                  </p>
                  <p style="display: flex; gap: 2px; align-items: flex-end; margin: 5px 0;">
                    <CheckBox v-model="child2" aria-label="Child 2" /> Tomato
                  </p>
                </div>
              </div>
              <p class="example-state">
                Parent: {{ parentIndeterminate ? 'indeterminate' : parentChecked ? 'checked' : 'unchecked' }},
                Children: {{ child1 ? 'checked' : 'unchecked' }}, {{ child2 ? 'checked' : 'unchecked' }}
              </p>
            </div>
          </div>
        </CardDisplay>


        <!-- SegmentedControl Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">SegmentedControl</h2>
          <p class="card-description">Apple‑inspired segmented control with single selection, shape variants, and keyboard navigation.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Capsule shape</h3>
              <SegmentedControl v-model="segmentedValue" :items="segmentedItems" shape="capsule" />
              <p class="example-state">Selected: {{ segmentedValue }}</p>
            </div>
            <div class="example">
              <h3>Rounded rectangle shape</h3>
              <SegmentedControl v-model="segmentedValue" :items="segmentedItems" shape="rounded-rectangle" />
              <p class="example-state">Selected: {{ segmentedValue }}</p>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <SegmentedControl v-model="segmentedValue" :items="segmentedItems" disabled />
              <p class="example-state">Selected: {{ segmentedValue }}</p>
            </div>
            <div class="example">
              <h3>With initial value (Option 2)</h3>
              <SegmentedControl v-model="segmentedValue" :items="segmentedItems" />
              <p class="example-state">Selected: {{ segmentedValue }}</p>
            </div>
          </div>
        </CardDisplay>

  <!-- TextArea Card -->
        <CardDisplay variant="outlined">
          <h2 class="card-title">TextArea</h2>
          <p class="card-description">Apple‑inspired textarea with variants, resizable control, and character counter.</p>
          <div class="card-examples">
            <div class="example">
              <h3>Default variant</h3>
              <TextArea v-model="textareaValue" placeholder="Type something..." />
              <p class="example-state">Value: {{ textareaValue }}</p>
            </div>
            <div class="example">
              <h3>Filled variant</h3>
              <TextArea v-model="textareaValue2" variant="filled" />
              <p class="example-state">Value: {{ textareaValue2 }}</p>
            </div>
            <div class="example">
              <h3>With character counter</h3>
              <TextArea v-model="textareaValue" :max-length="maxLength" :show-counter="true" />
              <p class="example-state">Length: {{ textareaValue.length }} / {{ maxLength }}</p>
            </div>
            <div class="example">
              <h3>Disabled</h3>
              <TextArea disabled placeholder="Cannot edit" />
            </div>
            <div class="example">
              <h3>Resizable toggle</h3>
              <SwitchToggle v-model="resizable" />
              <TextArea :resizable="resizable" placeholder="Try resizing..." />
            </div>
            <div class="example">
              <h3>Show counter toggle</h3>
              <SwitchToggle v-model="showCounter" />
              <TextArea :show-counter="showCounter" :max-length="maxLength" placeholder="Type to see counter" />
            </div>
          </div>
        </CardDisplay>




      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as tokens;

.demo-page {
  min-height: 100vh;
  background: var(--surface-color-secondary);
  color: var(--text-primary);
  padding: var(--space-8);
}

.github-corner {
  svg {
    width: 4rem;
    height: 4rem;
  }
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    color: inherit;
    text-decoration: none;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }

    .github-corner-icon {
      font-size: 2rem;
    }
  }
}

.top-right-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.theme-toggle {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.theme-toggle-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-8);

  @include tokens.respond-to(small-tablet) {
    grid-template-columns: 1fr;
  }
}

.card {
  background-color: var(--background-color);
  border: 1px solid var(--color-gray);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.card-display[data-variant="outlined"]:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.card-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.card-examples {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.example {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--color-gray);
  border-radius: var(--radius-md);
  background-color: var(--background-color);

  h3 {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    margin: 0;
  }
}

.example-state {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}
</style>
