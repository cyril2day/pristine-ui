import { computed, type ComputedRef } from 'vue'

export type CheckboxSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

export type CheckboxOptions = {
  size?: CheckboxSize
  disabled?: boolean
  readonly?: boolean
  label?: string
  helperText?: string
  required?: boolean
}

export type CheckboxProps = {
  modelValue?: boolean | unknown[]
  value?: unknown
  indeterminate?: boolean
  id?: string
  options?: CheckboxOptions
}

export type CheckboxEmits = {
  'update:modelValue': [value: boolean | unknown[]]
  'change': [value: boolean | unknown[]]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

const DEFAULT_CHECKBOX_OPTIONS: Required<CheckboxOptions> = {
  size: 'regular',
  disabled: false,
  readonly: false,
  label: '',
  helperText: '',
  required: false,
}

function generateUniqueId(): string {
  return `pr-checkbox-${Math.random().toString(36).slice(2, 9)}`
}

function mergeWithDefaults(options?: CheckboxOptions): Required<CheckboxOptions> {
  return {
    ...DEFAULT_CHECKBOX_OPTIONS,
    ...options,
  }
}

export function useCheckbox(
  props: CheckboxProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const id = computed(() => props.id ?? generateUniqueId())
  const mergedOptions = computed(() => mergeWithDefaults(props.options))

  const checkboxClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => {
    const { size, disabled } = mergedOptions.value

    return [
      'pr-checkbox',
      `pr-checkbox--${size}`,
      { 'pr-checkbox--disabled': disabled }
    ]
  })

  const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) {
      // When modelValue is an array, check if value is in array
      return props.value !== undefined && props.modelValue.includes(props.value)
    }
    return !!props.modelValue
  })

  const ariaChecked = computed(() => {
    if (props.indeterminate) return 'mixed'
    return isChecked.value ? 'true' : 'false'
  })

  function handleChange(event: Event) {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
      return
    }

    const target = event.target as HTMLInputElement
    const newValue = (() => {
      if (Array.isArray(props.modelValue)) {
        const value = props.value
        const current = props.modelValue ?? []
        if (value === undefined) {
          return current
        }
        return target.checked
          ? [...current, value]
          : current.filter(v => v !== value)
      } else {
        return target.checked
      }
    })()

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
    checkboxClasses,
    isChecked,
    ariaChecked,
    handleChange,
    handleFocus,
    handleBlur,
  }
}
