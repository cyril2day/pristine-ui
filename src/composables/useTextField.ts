import { computed, type ComputedRef } from 'vue'

export type TextFieldSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'
export type TextFieldVariant = 'default' | 'filled'

export type TextFieldOptions = {
  size?: TextFieldSize
  variant?: TextFieldVariant
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  helperText?: string
  clearable?: boolean
  autocomplete?: string
  required?: boolean
}

export type TextFieldProps = {
  modelValue?: string
  id?: string
  options?: TextFieldOptions
}

export type TextFieldEmits = {
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'keydown': [event: KeyboardEvent]
}

const DEFAULT_TEXT_FIELD_OPTIONS: Required<Omit<TextFieldOptions, 'autocomplete'>> & { autocomplete?: string } = {
  size: 'regular',
  variant: 'default',
  disabled: false,
  readonly: false,
  placeholder: '',
  type: 'text',
  label: '',
  helperText: '',
  clearable: false,
  autocomplete: undefined,
  required: false,
}

function generateUniqueId(): string {
  return `pr-text-field-${Math.random().toString(36).slice(2, 9)}`
}

function mergeWithDefaults(options?: TextFieldOptions): Required<Omit<TextFieldOptions, 'autocomplete'>> & { autocomplete?: string } {
  return {
    ...DEFAULT_TEXT_FIELD_OPTIONS,
    ...options,
  }
}

export function useTextField(
  props: TextFieldProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const id = computed(() => props.id ?? generateUniqueId())
  const mergedOptions = computed(() => mergeWithDefaults(props.options))

  const textFieldClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => {
    const { size, variant, disabled } = mergedOptions.value

    return [
      'pr-text-field',
      `pr-text-field--${size}`,
      `pr-text-field--${variant}`,
      { 'pr-text-field--disabled': disabled }
    ]
  })

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  function handleFocus(event: FocusEvent) {
    emit('focus', event)
  }

  function handleBlur(event: FocusEvent) {
    emit('blur', event)
  }

  function handleKeydown(event: KeyboardEvent) {
    emit('keydown', event)
  }

  function handleClear() {
    if (mergedOptions.value.disabled || mergedOptions.value.readonly) {
      return
    }
    emit('update:modelValue', '')
    emit('clear')
  }

  return {
    id,
    mergedOptions,
    textFieldClasses,
    handleInput,
    handleFocus,
    handleBlur,
    handleKeydown,
    handleClear
  }
}
