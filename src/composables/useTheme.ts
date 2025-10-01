import { ref, watch } from 'vue'
import { useDashboardStore } from '@/store/dashboard'

const isDark = ref(true)

export const useTheme = () => {
  const dashboard = useDashboardStore()

  //  Atualiza o valor de isDark com base no valor persistido do store
  isDark.value = dashboard.currentTheme === 'dark'

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const updateThemeColors = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.style.setProperty('--background-color', '#0d0f2c')
      root.style.setProperty('--card-background', '#1c223b75')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#a0aec0')
      root.style.setProperty('--border-color', '#2d3748')
      root.style.setProperty('--menu-bg', '#1c223b75');
      root.style.setProperty('--menu-hover', '#0d0f2c')
    } else {
      root.style.setProperty('--background-color', '#f5f5f5')
      root.style.setProperty('--card-background', '#ffffff')
      root.style.setProperty('--text-primary', '#333333')
      root.style.setProperty('--text-secondary', '#666666')
      root.style.setProperty('--border-color', '#e1e1e1')
      root.style.setProperty('--menu-bg', '#ffffff')
      root.style.setProperty('--menu-hover', '#f8f9fa')
    }
  }

  watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
    updateThemeColors(newValue)

    const theme = newValue ? 'dark' : 'light'
    dashboard.updateTheme(theme)
  }, { immediate: true })

  return {
    isDark,
    toggleTheme
  }
}
