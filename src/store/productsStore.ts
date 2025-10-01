import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/services/apiClient';

export const useProductsStoreSelect = defineStore('productsSelect', () => {
    const productsSelect = ref<{ value: string; label: string }[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetch = async () => {
        if (productsSelect.value.length > 0) return; // Já carregado, não faz de novo

        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/inputs/products');
            productsSelect.value = [{ value: 'all', label: 'Todos' }, ...response.data.data];
        } catch (err) {
            error.value = 'Erro ao buscar produtos';
        } finally {
            loading.value = false;
        }
    };

    return {
        productsSelect,
        loading,
        error,
        fetch,
    };
});
