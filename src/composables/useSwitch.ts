import { computed, type ComputedRef } from 'vue'

export type SwitchSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

export type SwitchOptions = {
  size?: SwitchSize
  disabled?: boolean
  readonly?: boolean
  label?: string
  helperText?: string
  onLabel?: string
  offLabel?: string
}

export type SwitchProps = {
  modelValue?: boolean
  id?: string
  options?: SwitchOptions
}

export type SwitchEmits = {
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

const DEFAULT_SWITCH_OPTIONS: Required<SwitchOptions> = {
  size: 'regular',
  disabled: false,
  readonly: false,
  label: '',
  helperText: '',
  onLabel: 'On',
  offLabel: 'Off',
}

function generateUniqueId(): string {
  return `pr-switch-${Math.random().toString(36).slice(2, 9)}`
}

function mergeWithDefaults(options?: SwitchOptions): Required<SwitchOptions> {
  return {
    ...DEFAULT_SWITCH_OPTIONS,
    ...options,
  }
}

export function useSwitch(
  props: SwitchProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const id = computed(() => props.id ?? generateUniqueId())
  const mergedOptions = computed(() => mergeWithDefaults(props.options))

  const switchClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => {
    const { size, disabled } = mergedOptions.value

    return [
      'pr-switch',
      `pr-switch--${size}`,
      { 'pr-switch--disabled': disabled }
    ]
  })

  const isChecked = computed(() => !!props.modelValue)

  const ariaChecked = computed(() => isChecked.value ? 'true' : 'false')

  function handleChange(event: Event) {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
      return
    }

    const target = event.target as HTMLInputElement
    const newValue = target.checked
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  function handleFocus(event: FocusEvent) {
    emit('focus', event)
  }

  function handleBlur(event: FocusEvent) {
    emit('blur', event)
  }

  return {
    id,
    mergedOptions,
    switchClasses,
    isChecked,
    ariaChecked,
    handleChange,
    handleFocus,
    handleBlur,
  }
}
