import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import apiClient from '@/services/apiClient';

export const useAdAccountsStore = defineStore('adAccounts', () => {
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
            const response = await apiClient.post('/facebook/sync-adaccounts', {});
        } catch (err) {
            toast.error('Erro ao buscar contas.')
        } finally {
            loading.value = false;
            fetch(filters, true);
        }
    };

    const fetch = async (filters?, force?) => {
        if (!force && data.value.length > 0) return;

        loading.value = true;
        error.value = null;
        
        try {
            const response = await apiClient.get('/facebook/ad-accounts', {
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
            error.value = err.response?.data?.message || 'Erro ao buscar contas de anúncios.';
        } finally {
            loading.value = false;
        }
    };

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
        syncFacebook
    };
});
