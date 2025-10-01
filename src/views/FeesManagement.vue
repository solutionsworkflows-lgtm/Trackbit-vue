<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitleStore } from '@/store/pageTitle'
import { useFeesStore } from '@/store/feesStore'
import { storeToRefs } from 'pinia'
import { formatCurrency, formatPercentage } from '../utils/formatters'
import { Percent } from "lucide-vue-next";

// Importe as stores e a lógica existentes
const pageTitle = usePageTitleStore()
const feesStore = useFeesStore()

// Use storeToRefs para manter a reatividade das propriedades da store
const { fees, products, totalRatePercentage, totalFixedRate } = storeToRefs(feesStore)

onMounted(() => {
    pageTitle.setTitle('Gerenciar Taxas')
})

// State do componente
const activeTab = ref('rates')
const showRateModal = ref(false)
const showProductCostModal = ref(false)
const editingRate = ref(null)
const editingProduct = ref(null)

// Forms
const rateForm = ref({
    name: '',
    type: 'percentage',
    value: 0,
    description: ''
})
const productCostForm = ref({
    productId: '',
    cost: 0
})

// Rate methods
const openRateModal = (rate = null) => {
    if (rate) {
        editingRate.value = rate
        rateForm.value = { ...rate }
    } else {
        editingRate.value = null
        rateForm.value = {
            name: '',
            type: 'percentage',
            value: 0,
            description: ''
        }
    }
    showRateModal.value = true
}

const saveRate = () => {
    if (editingRate.value) {
        feesStore.addOrUpdateFee({ ...editingRate.value, ...rateForm.value })
    } else {
        feesStore.addOrUpdateFee({ ...rateForm.value })
    }
    closeRateModal()
}

const deleteRate = (rateId: number) => {
    if (confirm('Tem certeza que deseja excluir esta taxa?')) {
        feesStore.deleteFee(rateId)
    }
}

const closeRateModal = () => {
    showRateModal.value = false
    editingRate.value = null
}

// Product cost methods
const openProductCostModal = (product: any) => {
    editingProduct.value = product
    productCostForm.value = {
        productId: product.id,
        cost: product.cost
    }
    showProductCostModal.value = true
}

const saveProductCost = () => {
    feesStore.addOrUpdateProductCost(editingProduct.value.id, productCostForm.value.cost)
    closeProductCostModal()
}

const closeProductCostModal = () => {
    showProductCostModal.value = false
    editingProduct.value = null
}

const resetProductCost = (product: any) => {
    feesStore.resetProductCost(product.id)
    closeProductCostModal()
}

// Formatação
const formatValue = (type: string, value: number) => {
    return type === 'percentage' ? formatPercentage(value) : formatCurrency(value)
}

// Lógica de tab
const isRatesTab = computed(() => activeTab.value === 'rates')
const isProductsTab = computed(() => activeTab.value === 'products')

</script>

<template>
    <div class="bg-[#0d0f2c] text-gray-200 min-h-screen lg:ml-[250px] p-4 sm:p-8">
        <div class="container mx-auto max-w-7xl">
            <div class="mb-8 md:mb-12">
                <h1 class="text-3xl font-extrabold text-gray">Gerenciar Taxas</h1>
                <p class="mt-2 text-lg text-gray-400">
                    Configure suas taxas, comissões e custos de produtos para otimizar seus lucros.
                </p>
            </div>

            <div class="flex border-b border-[#2d3748] mb-6">
                <button
                    @click="activeTab = 'rates'"
                    :class="[
                        'py-3 px-6 text-sm font-medium transition-colors duration-200',
                        isRatesTab ? 'text-gray border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
                    ]"
                >
                    Taxas e Comissões
                </button>
                <button
                    @click="activeTab = 'products'"
                    :class="[
                        'py-3 px-6 text-sm font-medium transition-colors duration-200',
                        isProductsTab ? 'text-gray border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'
                    ]"
                >
                    Custo de Produtos
                </button>
            </div>

            <div class="bg-[#1c223b75] rounded-xl shadow-sm border border-[#2d3748] p-6 md:p-8">
                <div v-show="isRatesTab">
                    <div class="flex items-center justify-between pb-4 mb-6">
                        <h2 class="text-xl font-semibold text-gray">Listagem de Taxas</h2>
                        <button class="bg-blue-600 text-gray px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                @click="openRateModal()">
                            <i class="fas fa-plus mr-2"></i> Adicionar
                        </button>
                    </div>

                    <div v-if="fees && fees.length === 0" class="text-center py-12 text-gray-500">
                        <p>Nenhuma taxa configurada.</p>
                    </div>

                    <div class="space-y-4">
                        <div v-for="rate in fees" :key="rate.id" class="flex items-center justify-between p-4 bg-[#0d0f2c] rounded-lg transition-colors hover:bg-blue-900/40">
                            <div class="flex-1 min-w-0 pr-4">
                                <h3 class="text-lg font-medium text-gray truncate">{{ rate.name }}</h3>
                                <p class="text-sm text-gray-400 mt-1">{{ rate.description }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-semibold text-blue-400">{{ formatValue(rate.type, rate.value) }}</p>
                                <p class="text-xs text-gray-500">{{ rate.type === 'percentage' ? 'Percentual' : 'Valor Fixo' }}</p>
                            </div>
                            <div class="flex ml-4 space-x-2">
                                <button @click="openRateModal(rate)" class="text-gray-400 hover:text-blue-400 transition" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deleteRate(rate.id)" class="text-gray-400 hover:text-red-500 transition" title="Excluir">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="fees && fees.length > 0" class="mt-6 pt-6 border-t border-[#2d3748]">
                        <div class="flex justify-between items-center text-sm font-medium text-gray-400">
                            <span>Total Percentual:</span>
                            <span class="font-semibold text-gray">{{ formatPercentage(totalRatePercentage) }}</span>
                        </div>
                        <div v-if="totalFixedRate > 0" class="flex justify-between items-center text-sm font-medium text-gray-400 mt-2">
                            <span>Total Fixo:</span>
                            <span class="font-semibold text-gray">{{ formatCurrency(totalFixedRate) }}</span>
                        </div>
                    </div>
                </div>

                <div v-show="isProductsTab">
                    <div class="flex items-center justify-between pb-4 mb-6">
                        <h2 class="text-xl font-semibold text-gray">Listagem de Produtos</h2>
                    </div>

                    <div class="space-y-4">
                        <div v-for="product in products" :key="product.id" class="flex items-center justify-between p-4 mb-5 bg-[#0d0f2c] rounded-lg transition-colors hover:bg-blue-900/40">
                            <div class="flex-1 min-w-0 pr-4">
                                <h3 class="text-lg font-medium text-gray truncate">{{ product.name }}</h3>
                                <span class="text-xs font-semibold mt-1 inline-block"
                                      :class="product.use_default_rates ? 'text-blue-400' : 'text-green-500'">
                                  {{ product.use_default_rates ? 'Usando taxas padrão' : 'Custo personalizado' }}
                                </span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-lg font-semibold text-gray-200">{{ formatCurrency(product.cost) }}</span>
                                <button @click="openProductCostModal(product)" class="ml-4 text-gray-400 hover:text-blue-400 transition" title="Editar custo">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showRateModal || showProductCostModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div v-if="showRateModal" class="bg-[#0d0f2c] rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 transform transition-all scale-100">
                <div class="flex items-center justify-between pb-4 border-b border-[#2d3748] mb-6">
                    <h3 class="text-xl font-semibold text-gray">{{ editingRate ? 'Editar Taxa' : 'Adicionar Taxa' }}</h3>
                    <button @click="closeRateModal" class="text-gray-400 hover:text-gray-200 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form @submit.prevent="saveRate">
                    <div class="space-y-6">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-400 mb-1">Nome da Taxa</label>
                            <input type="text" v-model="rateForm.name" placeholder="Ex: Taxa de Gateway" required
                                   class="w-full px-4 py-2 border border-[#2d3748] rounded-lg bg-gray-900 text-gray focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-400 mb-1">Tipo de Taxa</label>
                            <div class="flex space-x-6 gap-5 ">
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="rateForm.type" value="percentage" class="form-radio text-blue-600 focus:ring-blue-500 bg-gray-900 border-gray-600" />
                                    <span class="ml-2 text-gray-200">Percentual (%)</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" v-model="rateForm.type" value="fixed" class="form-radio text-blue-600 focus:ring-blue-500 bg-gray-900 border-gray-600" />
                                    <span class="ml-2 text-gray-200">Valor Fixo (R$)</span>
                                </label>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-400 mb-1">
                                {{ rateForm.type === 'percentage' ? 'Percentual' : 'Valor Fixo' }}
                            </label>
                            <div class="relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span class="text-gray-500 sm:text-sm">{{ rateForm.type === 'percentage' ? '%' : 'R$' }}</span>
                                </div>
                                <input type="number" v-model="rateForm.value" min="0" step="0.01" required
                                       class="w-full px-4 py-2 border border-[#2d3748] rounded-lg bg-gray-900 text-gray focus:ring-blue-500 focus:border-blue-500 pr-10 transition" />
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                            <textarea v-model="rateForm.description" placeholder="Descrição da taxa" rows="3"
                                      class="w-full px-4 py-2 border border-[#2d3748] rounded-lg bg-gray-900 text-gray focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-[#2d3748] flex justify-end space-x-3 gap-3">
                        <button type="button" @click="closeRateModal" class="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                            Cancelar
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-gray bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                            {{ editingRate ? 'Salvar' : 'Adicionar' }}
                        </button>
                    </div>
                </form>
            </div>

            <div v-if="showProductCostModal" class="bg-[#0d0f2c] rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 transform transition-all scale-100">
                <div class="flex items-center justify-between pb-4 border-b border-[#2d3748] mb-6">
                    <h3 class="text-xl font-semibold text-gray">Custo do Produto</h3>
                    <button @click="closeProductCostModal" class="text-gray-400 hover:text-gray-200 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-medium text-gray">{{ editingProduct?.name }}</h4>
                        <p class="text-sm text-gray-400 mt-1">
                            Configure um custo para este produto ou use as taxas padrão.
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Custo do Produto</label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">R$</span>
                            </div>
                            <input type="number" v-model="productCostForm.cost" placeholder="0,00" min="0" step="0.01"
                                   class="w-full px-4 py-2 border border-[#2d3748] rounded-lg bg-gray-900 text-gray focus:ring-blue-500 focus:border-blue-500 pr-10 transition" />
                        </div>
                        <div class="mt-2 text-sm">
                            <p v-if="productCostForm.cost > 0" class="text-green-500">
                                ✓ Custo personalizado: {{ formatCurrency(productCostForm.cost) }}
                            </p>
                            <p v-else class="text-blue-400">
                                ℹ️ Usando taxas padrão
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-6 pt-4 border-t border-[#2d3748] flex justify-end space-x-3 gap-4">
                    <button type="button" @click="closeProductCostModal" class="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                        Cancelar
                    </button>
                    <button type="button" @click="resetProductCost(editingProduct)" v-if="!editingProduct.use_default_rates" class="px-4 py-2 text-sm font-medium text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-400 hover:text-gray transition">
                        Usar Padrão
                    </button>
                    <button type="button" @click="saveProductCost" class="px-4 py-2 text-sm font-medium text-gray bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>