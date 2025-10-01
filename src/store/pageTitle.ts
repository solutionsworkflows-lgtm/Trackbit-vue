import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageTitleStore = defineStore('pageTitle', () => {
    const title = ref('Dashboard')

    const setTitle = (newTitle: string) => {
        title.value = newTitle
    }

    return {
        title,
        setTitle
    }
})