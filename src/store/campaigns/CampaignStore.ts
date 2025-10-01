import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useCampaignStore = defineStore('campaigns', () => {
    const error = ref(null);
    const data = ref([])
    const loading = ref(false)

    const pagination = reactive({
        page: 1,
        perPage: 10,
        total: 0,
    });

    const filters = reactive({
        name: '',
        status: 'all',
        period: 'today',
        account: 'all',
        product: 'all'
    });

    const syncFacebook = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.post('/facebook/sync-campaign', {});
        } catch (err) {
            toast.error('Erro ao buscar campanhas.')
        } finally {
            loading.value = false;
            fetch(filters, true);
        }
    };

    const updateBudget = async (id, value) => {
        error.value = null;

        try {
            const response = await apiClient.post(`/facebook/campaigns/${id}/update-budget`, {id, budget: value});
            toast.success('Orçamento atualizado com sucesso.')
        } catch (err) {
            toast.error('Erro ao atualizar orçamento.')
        } finally {
            //loading.value = false;
        }
    };

    const fetch = async (filters?, force?) => {
        if (!force && data.value.length > 0) return;

        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.get('/facebook/campaigns', {
                params: {
                    page: pagination.page,
                    per_page: pagination.perPage,
                    status: filters?.status || undefined,
                    adAccount: filters?.account || undefined,
                    dateRange: filters?.period || undefined,
                    name: filters?.name || undefined,
                },
            });

            data.value = response.data.data;
            pagination.total = response.data.total;
        } catch (err) {
            toast.error('Erro ao buscar campanhas.')
        } finally {
            loading.value = false;
        }
    };

    const start = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/campaigns/${code}/start`)
            toast.success('Campanha iniciada.')
        } catch {
            toast.error('Erro ao iniciar campanha.')
        }
    }

    const stop = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/campaigns/${code}/stop`)
            toast.success('Campanha pausada.')
        } catch {
            toast.error('Erro ao pausar campanha.')
        }
    }

    const duplicate = async (id: string | number) => {
        loading.value = true;
        try {
            await apiClient.post(`/facebook/campaigns/${id}/duplicate`)
            toast.success('Campanha duplicada.')
        } catch {
            toast.error('Erro ao duplicar campanha.')
        } finally {
            loading.value = false;
        }
    }

    const batchAction = async (payload: {
        ids: string[]
        action: 'pause' | 'resume' | 'duplicate' | 'update-budget'
        quantity?: number,
        targetAccount: string,
        budget?: number,
    }) => {
        loading.value = true;

        try {
            apiClient.post('/facebook/campaigns/batch-action', payload)
            toast.success('Ação em massa em andamento...')
        } catch {
            toast.error('Erro ao aplicar ação em massa.')
        } finally {
            loading.value = false;
        }
    }

    const duplicateMultiple = async (id: string | number, times: number) => {

        try {
            await apiClient.post(`/facebook/campaigns/${id}/duplicate-multiple`, { times })
            toast.success('Duplicação em massa iniciada.')
        } catch {
            toast.error('Erro ao duplicar campanha múltiplas vezes.')
        }
    }
    const reset = () => {
        data.value = [];
        pagination.page = 1;
        filters.search = '';
        filters.status = 'all';
        error.value = null;
    };

    return {
        data,
        loading,
        error,
        pagination,
        filters,
        updateBudget,
        fetch,
        reset,
        start,
        stop,
        duplicate,
        duplicateMultiple,
        batchAction,
        syncFacebook
    };
});
