import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/services/apiClient';

const API_URL = '/fees';
const API_URL_PRODUCTS = '/products';

interface Fee {
    id: number;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
    createdAt: string;
}

export const useFeesStore = defineStore('fees', () => {
    const fees = ref<Fee[]>([]);
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // const totalTaxRate = computed(() => {
    //     return taxes.value
    //         .filter(tax => tax.type === 'percentage')
    //         .reduce((sum, tax) => sum + tax.value, 0)
    // })
    //
    // const totalFixedTax = computed(() => {
    //     return taxes.value
    //         .filter(tax => tax.type === 'fixed')
    //         .reduce((sum, tax) => sum + tax.value, 0)
    // })

    const totalRatePercentage = computed(() => {
        return fees.value
            .filter(rate => rate.type === 'percentage')
            .reduce((sum, rate) => sum + rate.value, 0)
    })

    const totalFixedRate = computed(() => {
        return fees.value
            .filter(rate => rate.type === 'fixed')
            .reduce((sum, rate) => sum + rate.value, 0)
    })

    const fetchFees = async () => {
        loading.value = true;
        try {
            const response = await axios.get<Fee[]>(API_URL);
            fees.value = response.data;
            error.value = null;
        } catch (err) {
            error.value = 'Falha ao carregar as taxas.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const fetchProducts = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/products');
            products.value = response.data.data;
            error.value = null;
        } catch (err) {
            error.value = 'Falha ao carregar os Produtos.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const addOrUpdateFee = async (feeData: Fee) => {
        try {
            if (feeData.id) {
                // Atualizar
                await axios.put(`${API_URL}/${feeData.id}`, feeData);
            } else {
                // Criar
                await axios.post(API_URL, feeData);
            }
            await fetchFees();
        } catch (err) {
            error.value = 'Falha ao salvar a taxa.';
            console.error(err);
        }
    };

    const deleteFee = async (feeId: number) => {
        try {
            await axios.delete(`${API_URL}/${feeId}`);
            await fetchFees();
        } catch (err) {
            error.value = 'Falha ao deletar a taxa.';
            console.error(err);
        }
    };

    const addOrUpdateProductCost = async (productId: number, cost: number) => {
        try {
            // Send a POST request to the updateCost endpoint
            await axios.post(`${API_URL_PRODUCTS}/${productId}/cost`, { cost: cost });

            // Re-fetch the data to get the updated state from the server
            await fetchProducts();
        } catch (err) {
            error.value = 'Failed to update product cost.';
            console.error(err);
        }
    };

    const resetProductCost = async (productId: number) => {
        try {
            await axios.post(`${API_URL_PRODUCTS}/${productId}/reset-cost`);

            // Re-fetch the data to get the updated state
            await fetchProducts();
        } catch (err) {
            error.value = 'Failed to reset product cost.';
            console.error(err);
        }
    };

    fetchFees();
    fetchProducts();

    return {
        products,
        fees,
        loading,
        error,

        totalRatePercentage,
        totalFixedRate,
        // totalFixedTax,
        // totalTaxRate,

        addOrUpdateProductCost,
        resetProductCost,
        fetchProducts,
        fetchFees,
        addOrUpdateFee,
        deleteFee,
    };
});