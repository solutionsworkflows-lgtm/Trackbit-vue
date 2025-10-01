import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface LayoutSettings {
    menuExpanded: boolean
    headerFixed: boolean
    menuPosition: 'left' | 'right'
    theme: {
        primary: string
        secondary: string
        accent: string
    }
}

const DEFAULT_SETTINGS: LayoutSettings = {
    menuExpanded: true,
    headerFixed: true,
    menuPosition: 'left',
    theme: {
        primary: '#4169E1',
        secondary: '#F8F9FA',
        accent: '#5CB85C'
    }
}

export const useLayoutSettings = defineStore('layoutSettings', () => {
    const settings = ref<LayoutSettings>(loadSettings())

    function loadSettings(): LayoutSettings {
        const saved = localStorage.getItem('layoutSettings')
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    }

    watch(settings, (newSettings) => {
        localStorage.setItem('layoutSettings', JSON.stringify(newSettings))
        updateThemeColors(newSettings.theme)
    }, { deep: true })

    function updateThemeColors(theme: LayoutSettings['theme']) {
        const root = document.documentElement
        root.style.setProperty('--primary-color', theme.primary)
        root.style.setProperty('--secondary-color', theme.secondary)
        root.style.setProperty('--accent-color', theme.accent)
    }

    function toggleMenu() {
        settings.value.menuExpanded = !settings.value.menuExpanded
    }

    function toggleHeaderFixed() {
        settings.value.headerFixed = !settings.value.headerFixed
    }

    function setMenuPosition(position: 'left' | 'right') {
        settings.value.menuPosition = position
    }

    function updateTheme(theme: Partial<LayoutSettings['theme']>) {
        settings.value.theme = { ...settings.value.theme, ...theme }
    }

    function resetSettings() {
        settings.value = { ...DEFAULT_SETTINGS }
    }

    return {
        settings,
        toggleMenu,
        toggleHeaderFixed,
        setMenuPosition,
        updateTheme,
        resetSettings
    }
})