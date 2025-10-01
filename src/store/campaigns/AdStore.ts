import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
export const useAdStore = defineStore('ad', () => {
    const data = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const toast = useToast()

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
            const response = await apiClient.post('/facebook/sync-ads', {});
        } catch (err) {
            toast.error('Erro ao buscar anuncios.')
        } finally {
            loading.value = false;
            fetch(filters, true);
        }
    };

    const fetch = async () => {
        if (data.value.length > 0) return; // Já carregado, não faz de novo

        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.get('/facebook/ads', {
                params: {
                    page: pagination.page,
                    per_page: pagination.perPage,
                    search: filters.search || undefined,
                    status: filters.status || undefined,
                },
            });

            data.value = response.data.data;
            pagination.total = response.data.total;
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar ads.';
        } finally {
            loading.value = false;
        }
    };

    const start = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ads/${code}/start`)
            toast.success('Anuncio iniciado.')
        } catch {
            toast.error('Erro ao iniciar Anuncio.')
        }
    }

    const stop = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ads/${code}/stop`)
            toast.success('Anuncio pausado.')
        } catch {
            toast.error('Erro ao pausar Anuncio.')
        }
    }

    const batchAction = async (payload: {
        ids: string[]
        action: 'pause' | 'resume' | 'duplicate'
        quantity?: number,
        targetAccount: string,
    }) => {
        loading.value = true;

        try {
            apiClient.post('/facebook/ads/batch-action', payload)
            toast.success('Ação em massa em andamento...')
        } catch {
            toast.error('Erro ao aplicar ação em massa.')
        } finally {
            loading.value = false;
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
        fetch,
        reset,
        start,
        stop,
        batchAction,
        syncFacebook
    };
});
