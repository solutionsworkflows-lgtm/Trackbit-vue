import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useAdAccountsStoreSelect = defineStore('adAccountsSelect', () => {
    const adAccountsSelect = ref<{ value: string; label: string }[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const items = ref([]);

    const fetchAdAccounts = async () => {
        if (adAccountsSelect.value.length > 0) return; // Já carregado, não faz de novo

        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/inputs/ad-accounts');
            adAccountsSelect.value = [{ value: 'all', label: 'Todas' }, ...response.data.data];
        } catch (err) {
            error.value = 'Erro ao buscar contas de anúncios';
        } finally {
            loading.value = false;
        }
    };

    const fetch = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.get('/facebook/ad-accounts/all', {});

            items.value = response.data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar contas de anúncios.';
        } finally {
            loading.value = false;
        }
    }

    const fetchByBusinessManager = async (bm) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/facebook/ad-accounts/by-business-manager/' + bm.id, {});

            items.value = response.data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar contas de anúncios.';
        } finally {
            loading.value = false;
        }
    }

    const stop = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ad-accounts/${code}/stop`)
            toast.success('Conta de anuncio desativada.')
        } catch {
            toast.error('Erro ao desativar conta de anuncio.')
        }
    }

    const start = async (code: string | number) => {
        try {
            await apiClient.post(`/facebook/ad-accounts/${code}/start`)
            toast.success('Conta de anuncio ativada.')
        } catch {
            toast.error('Erro ao ativar conta de anuncio.')
        }
    }

    return {
        adAccountsSelect,
        loading,
        error,
        items,
        stop,
        start,
        fetch,
        fetchByBusinessManager,
        fetchAdAccounts
    };
});
