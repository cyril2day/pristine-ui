import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'

/**
 * Determines whether dot indicators should be used instead of a segmented control
 * based on the width ratio between the tab controls and the tab content.
 * Shows dots when the width of the tab controls is ≥ 90 % of the width of the tab container.
 */
export function useDotIndicatorCondition(
  controlContainerRef: Ref<HTMLElement | null>,
  contentContainerRef: Ref<HTMLElement | null>
) {
  const controlWidth = ref(0)
  const contentWidth = ref(0)
  const switchThresholdWidth = ref<number | null>(null)

  const UPPER_THRESHOLD = 0.9

  const updateWidths = () => {
    if (controlContainerRef.value && contentContainerRef.value) {
      const cw = controlContainerRef.value.clientWidth
      const tw = contentContainerRef.value.clientWidth
      console.log('[useDotIndicatorCondition] updateWidths', { cw, tw })
      controlWidth.value = cw
      contentWidth.value = tw
    }
  }

  // Decide whether to show dot indicator based on current widths and recorded threshold
  watch([controlWidth, contentWidth], () => {
    if (contentWidth.value === 0) return

    // When we are already showing dots, controlWidth may be zero (hidden).
    // We still need to check if we should switch back based on contentWidth.
    if (switchThresholdWidth.value === null) {
      // Not yet switched to dots: need a valid controlWidth to compute ratio
      if (controlWidth.value === 0) return
      const ratio = controlWidth.value / contentWidth.value
      console.log('[useDotIndicatorCondition] ratio', ratio, 'switchThresholdWidth', switchThresholdWidth.value)
      if (ratio >= UPPER_THRESHOLD) {
        console.log(' -> switch to dot, recording content width:', contentWidth.value)
        switchThresholdWidth.value = contentWidth.value
      }
    } else {
      // Already showing dots: check if we should switch back
      console.log('[useDotIndicatorCondition] dot active, contentWidth', contentWidth.value, 'threshold', switchThresholdWidth.value)
      if (contentWidth.value > switchThresholdWidth.value) {
        console.log(' -> switch to segmented, content width exceeded threshold')
        switchThresholdWidth.value = null
      }
    }
  }, { immediate: true })

  const shouldUseDotIndicator = computed(() => switchThresholdWidth.value !== null)

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    updateWidths()

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateWidths()
      })

      if (controlContainerRef.value) {
        resizeObserver.observe(controlContainerRef.value)
      }
      if (contentContainerRef.value) {
        resizeObserver.observe(contentContainerRef.value)
      }
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  // Also watch the refs themselves in case they change (e.g., after mount)
  watch([controlContainerRef, contentContainerRef], () => {
    updateWidths()
  })

  return {
    shouldUseDotIndicator,
    controlWidth,
    contentWidth,
  }
}
