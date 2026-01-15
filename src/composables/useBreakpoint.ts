import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive screen breakpoint detection.
 *
 * @param breakpoints - Mapping of breakpoint names to pixel widths (max-width).
 *   Example: { mobile: 735, tablet: 1250, desktop: Infinity }
 * @returns A reactive object where each key is a breakpoint name and the value
 *   is true if the current viewport width is less than the defined threshold.
 */
export function useBreakpoint(breakpoints: Record<string, number> = { mobile: 735, tablet: 1250, desktop: Infinity }) {
  const matches = ref<Record<string, boolean>>({})

  const updateMatches = () => {
    // Guard against SSR environments where `window` is undefined.
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const nextMatches: Record<string, boolean> = {}

    for (const [name, threshold] of Object.entries(breakpoints)) {
      nextMatches[name] = width < threshold
    }

    matches.value = nextMatches
  }

  onMounted(() => {
    updateMatches()
    window.addEventListener('resize', updateMatches)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateMatches)
  })

  return matches
}

import { computed } from 'vue'

/**
 * Predefined breakpoints following the Pristine UI design system.
 *
 * Mobile: 0–734px   (below 735)
 * Tablet: 735–1249px (below 1250)
 * Desktop: 1250px and above
 */
export function useScreenSize() {
  const matches = useBreakpoint({
    mobile: 550,
    tablet: 1024,
    desktop: Infinity
  })

  const isMobile = computed(() => matches.value.mobile ?? false)
  const isTablet = computed(() => matches.value.tablet ?? false)
  const isDesktop = computed(() => matches.value.desktop ?? false)

  return {
    isMobile,
    isTablet,
    isDesktop
  }
}
