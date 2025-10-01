import { defineStore } from 'pinia'

export const useUsersDashboardStore = defineStore('UsersDashboard', {
    state: () => ({
        selectedDashboardCode: null as string | null,
    }),
    actions: {
        setDashboard(code: string) {
            this.selectedDashboardCode = code
        },
    },
})
