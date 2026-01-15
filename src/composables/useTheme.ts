import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  function applyTheme(dark: boolean) {
    const body = document.body
    if (dark) {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }
  }

  // Detect system preference and apply initial theme
  onMounted(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    isDark.value = media.matches
    applyTheme(isDark.value)

    media.addEventListener('change', (e) => {
      isDark.value = e.matches
      applyTheme(isDark.value)
    })
  })

  watch(isDark, (dark) => {
    applyTheme(dark)
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme
  }
}
