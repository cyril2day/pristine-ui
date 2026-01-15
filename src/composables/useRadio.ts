import { computed, type ComputedRef } from 'vue'

export type RadioSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

export type RadioOptions = {
  size?: RadioSize
  disabled?: boolean
  readonly?: boolean
  label?: string
  helperText?: string
  required?: boolean
}

export type RadioProps = {
  modelValue?: unknown
  value: unknown
  id?: string
  options?: RadioOptions
}

export type RadioEmits = {
  'update:modelValue': [value: unknown]
  'change': [value: unknown]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

const DEFAULT_RADIO_OPTIONS: Required<RadioOptions> = {
  size: 'regular',
  disabled: false,
  readonly: false,
  label: '',
  helperText: '',
  required: false,
}

function generateUniqueId(): string {
  return `pr-radio-${Math.random().toString(36).slice(2, 9)}`
}

function mergeWithDefaults(options?: RadioOptions): Required<RadioOptions> {
  return {
    ...DEFAULT_RADIO_OPTIONS,
    ...options,
  }
}

export function useRadio(
  props: RadioProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const id = computed(() => props.id ?? generateUniqueId())
  const mergedOptions = computed(() => mergeWithDefaults(props.options))

  const radioClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => {
    const { size, disabled } = mergedOptions.value

    return [
      'pr-radio',
      `pr-radio--${size}`,
      { 'pr-radio--disabled': disabled }
    ]
  })

  const isChecked = computed(() => props.modelValue === props.value)

  const ariaChecked = computed(() => isChecked.value ? 'true' : 'false')

  function handleChange(event: Event) {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
      return
    }

    const target = event.target as HTMLInputElement
    if (target.checked) {
      emit('update:modelValue', props.value)
      emit('change', props.value)
    }
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
    radioClasses,
    isChecked,
    ariaChecked,
    handleChange,
    handleFocus,
    handleBlur,
  }
}
