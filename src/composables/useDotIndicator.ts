import { computed, type ComputedRef } from 'vue'

export type DotIndicatorSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

export type DotIndicatorOption = {
  value: string | number
  disabled?: boolean
  label?: string
}

export type DotIndicatorProps = {
  modelValue?: string | number
  options?: DotIndicatorOption[]
  size?: DotIndicatorSize
  disabled?: boolean
  ariaLabel?: string
}

export type DotIndicatorEmits = {
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}

const DEFAULT_DOT_INDICATOR_OPTIONS: Required<Omit<DotIndicatorProps, 'modelValue'>> = {
  options: [],
  size: 'regular',
  disabled: false,
  ariaLabel: '',
}

function mergeWithDefaults(options?: Partial<DotIndicatorProps>): Required<Omit<DotIndicatorProps, 'modelValue'>> {
  return {
    ...DEFAULT_DOT_INDICATOR_OPTIONS,
    ...options,
  }
}

export function useDotIndicator(
  props: DotIndicatorProps,
  emit: (event: string, ...args: unknown[]) => void
) {
  const mergedOptions = computed(() => mergeWithDefaults({
    options: props.options,
    size: props.size,
    disabled: props.disabled,
    ariaLabel: props.ariaLabel,
  }))

  const selectedValue = computed(() => props.modelValue)

  const indicatorClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => [
    'pr-dot-indicator',
    `pr-dot-indicator--${mergedOptions.value.size}`,
    { 'pr-dot-indicator--disabled': mergedOptions.value.disabled }
  ])

  function isDotSelected(value: string | number): boolean {
    return selectedValue.value === value
  }

  function isDotDisabled(dot: DotIndicatorOption): boolean {
    return mergedOptions.value.disabled || dot.disabled === true
  }

  function handleDotClick(dot: DotIndicatorOption) {
    if (isDotDisabled(dot)) return
    if (dot.value === selectedValue.value) return

    emit('update:modelValue', dot.value)
    emit('change', dot.value)
  }

  function handleKeydown(event: KeyboardEvent, dot: DotIndicatorOption) {
    if (isDotDisabled(dot)) return

    const { options } = mergedOptions.value
    const currentIndex = options.findIndex(opt => opt.value === selectedValue.value)
    let newIndex = -1

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        // move to previous enabled dot
        for (let i = currentIndex - 1; i >= 0; i--) {
          const opt = options[i]
          if (opt && !isDotDisabled(opt)) {
            newIndex = i
            break
          }
        }
        // if none, wrap to last enabled dot
        if (newIndex === -1) {
          for (let i = options.length - 1; i > currentIndex; i--) {
            const opt = options[i]
            if (opt && !isDotDisabled(opt)) {
              newIndex = i
              break
            }
          }
        }
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        // move to next enabled dot
        for (let i = currentIndex + 1; i < options.length; i++) {
          const opt = options[i]
          if (opt && !isDotDisabled(opt)) {
            newIndex = i
            break
          }
        }
        // if none, wrap to first enabled dot
        if (newIndex === -1) {
          for (let i = 0; i < currentIndex; i++) {
            const opt = options[i]
            if (opt && !isDotDisabled(opt)) {
              newIndex = i
              break
            }
          }
        }
        break
      case 'Home':
        event.preventDefault()
        newIndex = options.findIndex(opt => opt && !isDotDisabled(opt))
        break
      case 'End':
        event.preventDefault()
        for (let i = options.length - 1; i >= 0; i--) {
          const opt = options[i]
          if (opt && !isDotDisabled(opt)) {
            newIndex = i
            break
          }
        }
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        handleDotClick(dot)
        return
      default:
        return
    }

    if (newIndex !== -1 && newIndex !== currentIndex) {
      const newDot = options[newIndex]
      if (newDot) {
        emit('update:modelValue', newDot.value)
        emit('change', newDot.value)
      }
    }
  }


  return {
    mergedOptions,
    selectedValue,
    indicatorClasses,
    isDotSelected,
    isDotDisabled,
    handleDotClick,
    handleKeydown,
  }
}
