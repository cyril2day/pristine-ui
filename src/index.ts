// Library entry point for Pristine UI components
// Re-export all components as named exports
export { default as CardDisplay } from '@/components/card-display/CardDisplay.vue'
export { default as CheckBox } from '@/components/checkbox/CheckBox.vue'
export { default as ComboBox } from '@/components/combo-box/ComboBox.vue'
export { default as PushButton } from '@/components/push-button/PushButton.vue'
export { default as SegmentedControl } from '@/components/segmented-control/SegmentedControl.vue'
export { default as SwitchToggle } from '@/components/switch-toggle/SwitchToggle.vue'
export { default as TextArea } from '@/components/text-area/TextArea.vue'
export { default as TextField } from '@/components/text-field/TextField.vue'

// Import global styles (CSS custom properties, component styles, normalize.css)
import '@/styles/global.scss'

// Export utility functions
export * from '@/utils/index'

// Plugin that registers all components globally
import type { App } from 'vue'
import CardDisplay from '@/components/card-display/CardDisplay.vue'
import CheckBox from '@/components/checkbox/CheckBox.vue'
import ComboBox from '@/components/combo-box/ComboBox.vue'
import PushButton from '@/components/push-button/PushButton.vue'
import SegmentedControl from '@/components/segmented-control/SegmentedControl.vue'
import SwitchToggle from '@/components/switch-toggle/SwitchToggle.vue'
import TextArea from '@/components/text-area/TextArea.vue'
import TextField from '@/components/text-field/TextField.vue'

const components = {
  CardDisplay,
  CheckBox,
  ComboBox,
  PushButton,
  SegmentedControl,
  SwitchToggle,
  TextArea,
  TextField,
}

export const PristineUI = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

// Default export is the plugin
export default PristineUI
