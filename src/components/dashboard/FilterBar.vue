<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdAccountsStoreSelect } from '@/store/adAccountsStore';
const adAccountsStore = useAdAccountsStoreSelect();

import { useProductsStoreSelect } from '@/store/productsStore';
const productsStore = useProductsStoreSelect();

const emit = defineEmits(['filter-changed', 'refresh', 'sync']);

const dateRanges = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last_7d', label: 'Últimos 7 dias' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'last_month', label: 'Mês passado' }
];

const platforms = [
    { value: 'all', label: 'Qualquer' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' }
];

const trackedSales = [
    { value: 'all', label: 'Todas as vendas' },
    { value: 'only_tracked', label: 'Somente trackeadas' },
    // { value: 'only_untracked', label: 'Somente não trackeadas' }
];


// Estados reativos para armazenar as opções selecionadas
const selectedDateRange = ref('today');
const selectedAdAccount = ref('all');
const selectedPlatform = ref('all');
const selectedProduct = ref('all');
const showTrackedSales = ref('all');
const lastUpdated = ref(new Date());


onMounted(async () => {
    adAccountsStore.fetchAdAccounts();
    productsStore.fetch();
});

const handleFilterChange = () => {
    emit('filter-changed', {
        dateRange: selectedDateRange.value,
        adAccount: selectedAdAccount.value,
        platform: selectedPlatform.value,
        product: selectedProduct.value,
        showTrackedSales: showTrackedSales.value,
        sync: false
    });
};

const handleRefresh = () => {
    lastUpdated.value = new Date();
    emit('refresh');
};
const handleSync = () => {
    lastUpdated.value = new Date();
    emit('sync');
};

// Formatar a diferença de tempo
const formatTimeDiff = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.value.getTime()) / 60000); // Diferença em minutos

    if (diff < 1) return 'agora mesmo';
    if (diff === 1) return 'há 1 minuto';
    return `há ${diff} minutos`;
};
</script>

<template>
    <div class="filter-header">
        <h2>Resumo</h2>
        <div class="last-updated">
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Atualizado {{ formatTimeDiff() }}</span>
                <button  @click="handleSync"  class=" ">
                    <span class="fa-stack fa-xs" style="vertical-align:middle">
                      <i class="fas fa-circle fa-stack-2x" style="color:#1877F2"></i>
                      <i class="fab fa-facebook-f fa-stack-1x" style="color:white"></i>
                    </span>

                    Sincronizar
                </button>
                <button  @click="handleRefresh"  class=" mr-1">
                     <span class="fa-stack fa-xs" style="vertical-align:middle">
                        <i class="fas fa-circle fa-stack-2x" style="color:#1877F2"></i>
                      <i class="fas fa-rotate fa-stack-1x" style="color:white"></i>
                    </span>

                    Atualizar
                </button>
            </div>
        </div>
    </div>
    <div class="filter-bar card">

        <div class="filters-grid">
            <div class="filter-group">
                <label>Período</label>
                <div class="dropdown">
                    <select v-model="selectedDateRange" @change="handleFilterChange">
                        <option v-for="range in dateRanges" :key="range.value" :value="range.value">
                            {{ range.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="filter-group">
                <label>Conta de Anúncio</label>
                <div class="dropdown">
                    <select
                        v-model="selectedAdAccount"
                        @change="handleFilterChange"
                        :disabled="adAccountsStore.loading"
                        :class="{ 'animate-pulse text-gray-400': adAccountsStore.loading }"
                    >
                        <option v-if="adAccountsStore.loading" disabled selected value="all">Carregando...</option>
                        <option v-else v-for="account in adAccountsStore.adAccountsSelect" :key="account.value" :value="account.value">
                            {{ account.label }}
                        </option>
                    </select>
                </div>

            </div>

            <div class="filter-group">
                <label>Plataforma</label>
                <div class="dropdown">
                    <select v-model="selectedPlatform" @change="handleFilterChange">
                        <option v-for="platform in platforms" :key="platform.value" :value="platform.value">
                            {{ platform.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="filter-group">
                <label>Produto</label>
                <div class="dropdown">

                    <select
                        v-model="selectedProduct"
                        @change="handleFilterChange"
                        :disabled="productsStore.loading"
                        :class="{ 'animate-pulse text-gray-400': productsStore.loading }"
                    >
                        <option v-if="productsStore.loading" disabled selected value="all">Carregando...</option>
                        <option v-else v-for="product in productsStore.productsSelect" :key="product.value" :value="product.value">
                            {{ product.label }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="filter-group">
                <label>Vendas Trackeadas</label>
                <div class="dropdown">
                    <select
                        class="form-select"
                        v-model="showTrackedSales"
                        @change="handleFilterChange">

                        <option v-for="track in trackedSales" :key="track.value" :value="track.value">
                            {{ track.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-bar {
    margin-bottom: var(--spacing-lg);
}

.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.filter-header h2 {
    color: var(--text-secondary);
    margin: 0;
    font-size: 20px;
}

.last-updated {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-size: 14px;
    color: var(--text-muted);
}

.refresh-button {
    //background-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: bold;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--spacing-md);
}

@media (min-width: 768px) {

    .filters-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .filters-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}
@media (max-width: 768px) {
    .last-updated > span {
        display: none;
    }
}
.filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.filter-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
}
</style>
