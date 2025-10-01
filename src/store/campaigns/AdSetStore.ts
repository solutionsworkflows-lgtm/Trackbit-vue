import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useAdSetStore = defineStore('adASet', () => {
    const data = ref([]);
    const loading = ref(false);
    const error = ref(null);

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
            const response = await apiClient.post('/facebook/sync-adsets', {});
        } catch (err) {
            toast.error('Erro ao buscar conjuntos.')
        } finally {
            loading.value = false;
            fetch(filters, true);
        }
    };

    const updateBudget = async (id, value) => {
        error.value = null;

        try {
            const response = await apiClient.post(`/facebook/ad-set/${id}/update-budget`, {id, budget: value});
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
            const response = await apiClient.get('/facebook/ad-set', {
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
            error.value = err.response?.data?.message || 'Erro ao buscar conjunto de anúncios.';
        } finally {
            loading.value = false;
        }
    };

    const start = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ad-set/${code}/start`)
            toast.success('Conjunto de anuncio iniciado.')
        } catch {
            toast.error('Erro ao iniciar Conjunto.')
        }
    }

    const stop = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ad-set/${code}/stop`)
            toast.success('Conjunto de anuncio pausado.')
        } catch {
            toast.error('Erro ao pausar conjunto.')
        }
    }

    const duplicate = async (id: string | number) => {
        loading.value = true;
        try {
            await apiClient.post(`/facebook/ad-set/${id}/duplicate`)
            toast.success('Conjunto de anuncio duplicado.')
        } catch {
            toast.error('Erro ao duplicar conjunto.')
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
            apiClient.post('/facebook/ad-set/batch-action', payload)
            toast.success('Ação em massa em andamento...')
        } catch {
            toast.error('Erro ao aplicar ação em massa.')
        } finally {
            loading.value = false;
        }
    }

    const duplicateMultiple = async (id: string | number, times: number) => {

        try {
            await apiClient.post(`/facebook/ad-set/${id}/duplicate-multiple`, { times })
            toast.success('Duplicação em massa iniciada.')
        } catch {
            toast.error('Erro ao duplicar conjunto múltiplas vezes.')
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
