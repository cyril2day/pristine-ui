import { computed, ref, type ComputedRef } from 'vue'

export type SegmentedControlSize = 'mini' | 'small' | 'regular' | 'large' | 'extra-large'

export type SegmentedControlOption = {
  value: string | number
  disabled?: boolean
  label?: string
}

export type SegmentedControlProps = {
  modelValue?: string | number
  options?: SegmentedControlOption[]
  size?: SegmentedControlSize
  disabled?: boolean
  name?: string
  shape?: 'rounded' | 'rectangular'
}

export type SegmentedControlEmits = {
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}

const DEFAULT_SEGMENTED_CONTROL_OPTIONS: Required<Omit<SegmentedControlProps, 'modelValue' | 'name'>> = {
  options: [],
  size: 'regular',
  disabled: false,
  shape: 'rounded',
}

function mergeWithDefaults(options?: Partial<SegmentedControlProps>): Required<Omit<SegmentedControlProps, 'modelValue' | 'name'>> {
  return {
    ...DEFAULT_SEGMENTED_CONTROL_OPTIONS,
    ...options,
  }
}

function generateUniqueId(prefix: string): string {
  // Use crypto.randomUUID if available, otherwise fallback to random string
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`
  }
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`
}

export function useSegmentedControl(
  props: SegmentedControlProps,
  emit: (event: string, ...args: unknown[]) => void,
  options?: {
    onFocus?: (index: number) => void
  }
) {
  const isUsingKeyboard = ref(false)
  const mergedOptions = computed(() => mergeWithDefaults({
    options: props.options,
    size: props.size,
    disabled: props.disabled,
    shape: props.shape,
  }))

  const selectedValue = computed(() => props.modelValue)

  const uniqueName = computed(() => props.name || generateUniqueId('pr-segmented-control-'))

  const segmentClasses: ComputedRef<(string | Record<string, boolean>)[]> = computed(() => [
    'pr-segmented-control',
    `pr-segmented-control--${mergedOptions.value.size}`,
    `pr-segmented-control--${mergedOptions.value.shape}`,
    { 'pr-segmented-control--disabled': mergedOptions.value.disabled }
  ])

  function isSegmentSelected(value: string | number): boolean {
    return selectedValue.value === value
  }

  function isSegmentDisabled(segment: SegmentedControlOption): boolean {
    return mergedOptions.value.disabled || segment.disabled === true
  }

  function handleSegmentClick(segment: SegmentedControlOption) {
    if (isSegmentDisabled(segment)) return
    if (segment.value === selectedValue.value) return

    emit('update:modelValue', segment.value)
    emit('change', segment.value)
  }

  function handleKeydown(event: KeyboardEvent, segment: SegmentedControlOption) {
    if (isSegmentDisabled(segment)) return

    const { options: segments } = mergedOptions.value
    const currentIndex = segments.findIndex(opt => opt.value === selectedValue.value)
    let newIndex = -1

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        // move to previous enabled segment
        for (let i = currentIndex - 1; i >= 0; i--) {
          const opt = segments[i]
          if (opt && !isSegmentDisabled(opt)) {
            newIndex = i
            break
          }
        }
        // if none, wrap to last enabled segment
        if (newIndex === -1) {
          for (let i = segments.length - 1; i > currentIndex; i--) {
            const opt = segments[i]
            if (opt && !isSegmentDisabled(opt)) {
              newIndex = i
              break
            }
          }
        }
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        // move to next enabled segment
        for (let i = currentIndex + 1; i < segments.length; i++) {
          const opt = segments[i]
          if (opt && !isSegmentDisabled(opt)) {
            newIndex = i
            break
          }
        }
        // if none, wrap to first enabled segment
        if (newIndex === -1) {
          for (let i = 0; i < currentIndex; i++) {
            const opt = segments[i]
            if (opt && !isSegmentDisabled(opt)) {
              newIndex = i
              break
            }
          }
        }
        break
      case 'Home':
        event.preventDefault()
        newIndex = segments.findIndex(opt => opt && !isSegmentDisabled(opt))
        break
      case 'End':
        event.preventDefault()
        for (let i = segments.length - 1; i >= 0; i--) {
          const opt = segments[i]
          if (opt && !isSegmentDisabled(opt)) {
            newIndex = i
            break
          }
        }
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        handleSegmentClick(segment)
        return
      default:
        return
    }

    if (newIndex !== -1 && newIndex !== currentIndex) {
      const newSegment = segments[newIndex]
      if (newSegment) {
        isUsingKeyboard.value = true
        emit('update:modelValue', newSegment.value)
        emit('change', newSegment.value)
        options?.onFocus?.(newIndex)
      }
    }
  }

  function resetKeyboardMode() {
    isUsingKeyboard.value = false
  }

  function getSegmentAriaAttributes(segment: SegmentedControlOption) {
    const selected = isSegmentSelected(segment.value)
    const disabled = isSegmentDisabled(segment)
    return {
      'aria-checked': selected ? 'true' : 'false',
      'aria-disabled': disabled ? 'true' : undefined,
      'role': 'radio',
      'tabindex': selected ? '0' : '-1',
    }
  }

  return {
    mergedOptions,
    selectedValue,
    uniqueName,
    segmentClasses,
    isSegmentSelected,
    isSegmentDisabled,
    handleSegmentClick,
    handleKeydown,
    getSegmentAriaAttributes,
    isUsingKeyboard,
    resetKeyboardMode,
  }
}
