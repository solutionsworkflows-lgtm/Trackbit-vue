import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useBusinessManagerStore = defineStore('businessManager', () => {
    const loading = ref(false);
    const loadingSync = ref(false);
    const error = ref<string | null>(null);
    const items = ref([]);
    const currentBM = ref({});

    const sync = async () => {
        loadingSync.value = true;
        error.value = null;

        try {
            const response = await apiClient.post('/facebook/sync-business-manager', {});
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar BMs.';
        } finally {
            loadingSync.value = false;
        }
    }

    const getByDashboardCode = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.get('/facebook/business-manager/filter', {});
            currentBM.value = response.data;

        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar BMs.';
        } finally {
            loading.value = false;
        }
    }

    const fetch = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await apiClient.get('/facebook/business-manager', {});
            items.value = response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar BMs.';
        } finally {
            loading.value = false;
        }
    }

    const updateDefaultBusinessManager = async (bm) => {
        loading.value = true;
        try {
            const response = await apiClient.post('/facebook/business-manager/select', bm);
            toast.success('BMs padrão atualizada com sucesso!')
        } catch (err) {
            error.value = 'Erro ao salvar BM';
            console.error(err);
            toast.error('Erro ao salvar BM')
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        loadingSync,
        error,
        items,
        currentBM,
        fetch,
        getByDashboardCode,
        updateDefaultBusinessManager,
        sync,
    };
});
