import { ref } from 'vue'
import apiClient from '@/services/apiClient'

export function useFacebookAdAccounts() {
    const items = ref([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchAdAccounts = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/facebook/ad-accounts/all')
            items.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao buscar contas de anúncios.'
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        loading,
        error,
        fetchAdAccounts,
    }
}
