<template>
  <div
    v-show="active"
    role="tabpanel"
    :aria-labelledby="ariaLabelledby"
    :hidden="!active"
    :class="panelClasses"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: string | number
  disabled?: boolean
  label?: string
  active?: boolean
  ariaLabelledby?: string
}>(), {
  disabled: false,
  label: '',
  active: false,
  ariaLabelledby: '',
})

const panelClasses = computed(() => [
  'pr-tab-panel',
  { 'pr-tab-panel--disabled': props.disabled }
])
</script>

<style lang="scss" scoped>
.pr-tab-panel {
  --pr-tab-view-panel-padding: 16px;
  padding: var(--pr-tab-view-panel-padding);
  background: var(--pr-color-material-thick);
}
</style>
