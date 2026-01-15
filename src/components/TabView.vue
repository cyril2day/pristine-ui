<template>
  <div ref="tabViewRef" :class="viewClasses">
    <div ref="barRef" class="pr-tab-view__bar">
      <div
        ref="segmentedControlWrapperRef"
        class="pr-tab-view__control-wrapper"
        :class="{ 'pr-tab-view__control--hidden': shouldUseDotIndicator }"
      >
        <SegmentedControl
          v-model="activeTab"
          :options="tabOptions"
          :size="size"
          :shape="shape"
          :disabled="disabled"
          :aria-label="ariaLabel"
          @update:modelValue="handleTabChange"
        />
      </div>
      <div
        ref="dotIndicatorWrapperRef"
        class="pr-tab-view__control-wrapper"
        :class="{ 'pr-tab-view__control--hidden': !shouldUseDotIndicator }"
      >
        <DotIndicator
          v-model="activeTab"
          :options="tabOptions"
          :size="size"
          :disabled="disabled"
          :aria-label="ariaLabel"
          @update:modelValue="handleTabChange"
        />
      </div>
    </div>
    <div ref="panelsRef" class="pr-tab-view__panels">
      <TabPanel
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        :label="tab.label"
        :active="tab.value === activeTab"
        :aria-labelledby="`tab-${tab.value}`"
      >
        <slot :name="`tab-${tab.value}`" :active="tab.value === activeTab">
          {{ tab.content }}
        </slot>
      </TabPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SegmentedControl from './SegmentedControl.vue'
import TabPanel from './TabPanel.vue'
import DotIndicator from './DotIndicator.vue'
import { useDotIndicatorCondition } from '@/composables/useDotIndicatorCondition'

type TabDefinition = {
  value: string | number
  label?: string
  disabled?: boolean
  content?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  tabs?: TabDefinition[]
  size?: 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
  shape?: 'rounded' | 'rectangular'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  modelValue: undefined,
  tabs: () => [],
  size: 'regular',
  shape: 'rectangular',
  disabled: false,
  ariaLabel: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const firstTabValue = props.tabs.length > 0 ? props.tabs[0]!.value : ''
const activeTab = ref(props.modelValue ?? firstTabValue)
const barRef = ref<HTMLElement | null>(null)
const segmentedControlWrapperRef = ref<HTMLElement | null>(null)
const dotIndicatorWrapperRef = ref<HTMLElement | null>(null)
const panelsRef = ref<HTMLElement | null>(null)
const tabViewRef = ref<HTMLElement | null>(null)
const { shouldUseDotIndicator } = useDotIndicatorCondition(segmentedControlWrapperRef, tabViewRef)
console.log('TabView: initial shouldUseDotIndicator', shouldUseDotIndicator.value)

watch(shouldUseDotIndicator, (newVal) => {
  console.log('TabView: shouldUseDotIndicator changed to', newVal)
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    activeTab.value = newVal
  }
})

watch(activeTab, (newVal) => {
  emit('update:modelValue', newVal)
  emit('change', newVal)
})

const tabOptions = computed(() => props.tabs.map(tab => ({
  value: tab.value,
  disabled: tab.disabled,
})))

const viewClasses = computed(() => [
  'pr-tab-view',
  `pr-tab-view--shape-${props.shape}`
])

function handleTabChange(value: string | number) {
  activeTab.value = value
}
</script>

<style lang="scss" scoped>
.pr-tab-view {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  --pr-tab-view-control-overlap: 22px;
}

.pr-tab-view__bar {
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: calc(-1 * var(--pr-tab-view-control-overlap));
  position: relative;
  z-index: 1;
  /* Override selected segment background to match panel */
  --pr-segmented-control-selected-background: var(--pr-color-material-medium);
  --pr-segmented-control-selected-color: var(--pr-color-text-primary);

  .pr-segmented-control {
    background: var(--pr-color-material-ultrathick);
  }
}

.pr-tab-view__bar :deep(.pr-segmented-control__button--selected) {
  background-color: var(--pr-color-material-medium);
  color: var(--pr-color-text-primary);
  box-shadow: inset 0 0 0 1px var(--pr-color-fill-secondary);
}

.pr-tab-view__control-wrapper {
  display: inline-block;
  transition: opacity 0.2s;
}

.pr-tab-view__control--hidden {
  display: none;
}

.pr-tab-view__panels {
  border-radius: var(--pr-tab-view-panel-border-radius);
  overflow: hidden;
}

.pr-tab-view__panels .pr-tab-panel {
  padding-top: calc(var(--pr-tab-view-panel-padding, 16px) + var(--pr-tab-view-control-overlap, 22px));
}

.pr-tab-view--shape-rectangular {
  --pr-tab-view-panel-border-radius: var(--pr-size-border-radius-rounded-rectangle);
}

.pr-tab-view--shape-rounded {
  --pr-tab-view-panel-border-radius: var(--pr-size-border-radius-rounded-rectangle);
}

:deep(.dark) .pr-tab-view__bar .pr-segmented-control__button {
  color: var(--pr-color-text-primary);
}
</style>
