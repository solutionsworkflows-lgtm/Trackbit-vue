import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    const isExpanded = ref(true)
    const activeSubmenu = ref(null)
    const showSearch = ref(false)

    const toggleExpanded = () => {
        isExpanded.value = !isExpanded.value
        if (!isExpanded.value) {
            activeSubmenu.value = null
            showSearch.value = false
        }
    }

    return {
        isExpanded,
        activeSubmenu,
        showSearch,
        toggleExpanded,
    }
})
