import { ref } from 'vue'

const filters = ref({
    dateRange: 'today',
    platform: 'all',
    product: 'all',
    showTrackedSales: 'all',
    sync: false,
})

export function useDashboardFilters() {
    const applyFilters = (newFilters: any) => {
        filters.value = {
            ...filters.value,
            ...newFilters,
        }
    }

    return {
        filters,
        applyFilters
    }
}
