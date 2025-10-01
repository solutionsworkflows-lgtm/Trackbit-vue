<script setup lang="ts">
// Vue core
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Store management
import { storeToRefs } from 'pinia'
import { usePageTitleStore } from '../store/pageTitle'
import { useDashboardStore } from '../store/dashboard'
import { useDashboardsStore } from '@/store/dashboards'
import { useAuthStore } from '@/store/authStore'

// UI / components
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import FilterBar from '../components/dashboard/FilterBar.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'
import PaymentChart from '../components/dashboard/PaymentChart.vue'
import VueDraggable from 'vuedraggable'

// Composables
import { useDashboardFilters } from '../composables/dashboard/filters'

/* -------------------- ROUTER -------------------- */
const route = useRoute()
const router = useRouter()

/* -------------------- STORES -------------------- */
const pageTitle = usePageTitleStore()
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const userDashboardsStore = useDashboardsStore()

/* -------------------- REFS -------------------- */
const { user } = storeToRefs(authStore)
const { firstDashboardCode } = storeToRefs(userDashboardsStore)
const { applyFilters } = useDashboardFilters()

const showCustomizeModal = ref(false)
const localColumns = ref(dashboardStore.config.layout.columns)
const localChartPosition = ref(dashboardStore.config.layout.chartPosition)

/* -------------------- COMPUTED -------------------- */
const hasFacebookToken = computed(() => !!user.value?.facebook_access_token)
const gridColumns = computed(() => `repeat(${localColumns.value}, 1fr)`)

/* -------------------- METHODS -------------------- */
const handleFilterChange = (filters: Record<string, any>) => {
    applyFilters(filters)
}

const handleRefresh = () => {
    applyFilters({
        dateRange: 'today',
        adAccount: 'all',
        platform: 'all',
        product: 'all',
        showTrackedSales: 'all',
        sync: false
    })
}

const handleSync = () => {
    applyFilters({
        dateRange: 'today',
        adAccount: 'all',
        platform: 'all',
        product: 'all',
        showTrackedSales: 'all',
        sync: true
    })
}

const updateColumns = () => {
    dashboardStore.updateLayout({ columns: localColumns.value })
}

const updateChartPosition = () => {
    dashboardStore.updateLayout({ chartPosition: localChartPosition.value })
}

const handleOrderUpdate = (newList: any[]) => {
    dashboardStore.updateCardsOrder(newList)
}

const addCodeToUrl = (code: string) => {
    router.replace({
        query: {
            ...route.query,
            code
        }
    })
}

onMounted(() => {
    pageTitle.setTitle('Dashboard - Principal')
})

/* -------------------- WATCHERS -------------------- */
watch(firstDashboardCode, (newCode) => {
    if (newCode) {
        addCodeToUrl(newCode)
    }
}, { immediate: true })

</script>


<template>
    <div class="dashboard">
        <div class="dashboard-main">

            <div class="dashboard-content">
                <div v-if="false" class="facebook-warning">
                    <div class="warning-icon"><i class="far fa-bell"></i></div>
                    <div class="warning-content">
                        <h3>Conecte sua conta do Facebook</h3>
                        <p>Para começar a rastrear suas vendas e otimizar suas campanhas, conecte sua conta do Facebook Ads.</p>
                        <RouterLink :to="`/integrations?code=${firstDashboardCode}`" class="connect-button">
                            Conectar Facebook Ads
                        </RouterLink>
                    </div>
                </div>

                <div class="dashboard-header">
                    <button class="btn-customize" @click="showCustomizeModal = true" style="float: right; margin: 0px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-4 w-4" data-lov-id="src/components/dashboard/DashboardHeader.tsx:45:12" data-lov-name="Settings" data-component-path="src/components/dashboard/DashboardHeader.tsx" data-component-line="45" data-component-file="DashboardHeader.tsx" data-component-name="Settings" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20mr-2%22%7D"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <FilterBar @filter-changed="handleFilterChange" @refresh="handleRefresh" @sync="handleSync" />
                </div>

                <div
                    class="metrics-container"
                    :class="`chart-${localChartPosition}`"
                >
                    <PaymentChart
                        v-if="localChartPosition === 'left' || localChartPosition === 'top'"
                        :productSummary="dashboardStore.productSumary"
                        :paymentMethods="dashboardStore.paymentMethods"
                        :totalSales="dashboardStore.totalSales"
                        class="payment-chart"
                    />

                    <VueDraggable
                        :list="dashboardStore.dashboardCards"
                        class="metrics-grid"
                        :style="{ gridTemplateColumns: gridColumns }"
                        @change="handleOrderUpdate"
                        item-key="id"
                        handle=".drag-handle"
                    >
                        <template #item="{ element }">
                            <div class="metric-wrapper">
                                <div class="drag-handle">⋮⋮</div>
                                <MetricCard
                                    :id="element.id"
                                    :loading="dashboardStore.loading"
                                    :title="element.title"
                                    :value="element.value"
                                    :info="element.info"
                                    :custom-class="element.customClass"
                                    :isPercentage="element.isPercentage"
                                    :isCurrency="element.isCurrency"
                                />
                            </div>
                        </template>
                    </VueDraggable>

                    <PaymentChart
                        v-if="localChartPosition == 'bottom' || localChartPosition == 'right'"
                        :productSummary="localProductSumary"
                        :paymentMethods="dashboardStore.paymentMethods"
                        :totalSales="dashboardStore.totalSales"
                        class="payment-chart"
                    />

                </div>
            </div>
        </div>

        <!-- Customize Modal -->
        <div v-if="showCustomizeModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Personalizar Dashboard</h3>
                    <button @click="showCustomizeModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <p class="modal-subtitle">Configurações de layout da página</p>

                    <div class="header-actions">
                        <div class="layout-controls">
                            <select v-model="localColumns" @change="updateColumns" class="layout-select">
                                <option value="2">2 Colunas</option>
                                <option value="3">3 Colunas</option>
                                <option value="4">4 Colunas</option>
                                <option value="6">6 Colunas</option>
                            </select>

                            <select
                                v-model="localChartPosition"
                                @change="updateChartPosition"
                                class="layout-select"
                            >
                                <option value="left">Gráfico à Esquerda</option>
                                <option value="right">Gráfico à Direita</option>
                                <option value="top">Gráfico no Topo</option>
                                <option value="bottom">Gráfico Embaixo</option>
                            </select>
                        </div>
                    </div>

                    <p class="modal-subtitle mt-5">Selecione os cards que deseja exibir no dashboard</p>

                    <div class="cards-list">
                        <label
                            v-for="card in dashboardStore.dashboardCards"
                            :key="card.id"
                            class="card-toggle"
                        >
                            <input
                                type="checkbox"
                                :checked="card.visible"
                                @change="dashboardStore.toggleCardVisibility(card.id)"
                            />
                            <span class="card-name">{{ card.title }}</span>
                        </label>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showCustomizeModal = false" class="btn-primary">
                        Concluir
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

/* Facebook Warning Styles */
.facebook-warning {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    border: 1px solid rgba(65, 105, 225, 0.2);
    animation: fadeIn 0.5s ease-out;
}

.warning-icon {
    font-size: 32px;
    color: var(--primary-color);
}

.warning-content h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 18px;
}

.warning-content p {
    margin: var(--spacing-xs) 0 var(--spacing-md);
    color: var(--text-secondary);
}

.connect-button {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.connect-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
}

.loading-spinner {
    text-align: center;
    padding: 2rem;
    font-size: 1.25rem;
}
.dashboard {
    min-height: 100vh;
    background-color: var(--background-color);
}

.dashboard-main {
    margin-left: 250px;
}

.dashboard-content {
    max-width: 95%;
    margin: 0 auto;
    padding: var(--spacing-lg);
}

.dashboard-header {
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-lg);
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
}

.layout-controls {
    display: flex;
    gap: var(--spacing-sm);
}

.layout-select {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--card-background);
    color: var(--text-primary);
    cursor: pointer;
}

.btn-customize {
    background-color: var(--card-background);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-customize:hover {
    background-color: var(--menu-hover);
}

.metrics-container {
    display: grid;
    gap: var(--spacing-lg);
}

.metrics-container.chart-right {
    grid-template-columns: 1fr auto;
}

.metrics-container.chart-left {
    grid-template-columns: 1fr 3fr;
}

.metrics-container.chart-top,
.metrics-container.chart-bottom {
    grid-template-columns: 1fr;
}

.metrics-grid {
    display: grid;
    gap: var(--spacing-md);
}

.payment-chart {
    min-width: 200px;
    //background: #1c223b75;
    //border-radius: var(--border-radius-md);
    //padding: var(--spacing-lg);
    //border: 1px solid #232c4dad;
}

.metric-wrapper {
    position: relative;
    cursor: move;
}

.drag-handle {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    color: var(--text-secondary);
    cursor: move;
    opacity: 0;
    transition: opacity 0.2s ease;
    font-size: 20px;
    z-index: 1;
}

.metric-wrapper:hover .drag-handle {
    opacity: 1;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: hidden;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
}

.modal-body {
    padding: var(--spacing-lg);
}

.modal-subtitle {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
}

.cards-list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem; /* Espaço entre os itens */
}

.card {
    background: #1c223b75;
    border: 1px solid #232c4dad;
}

.card-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.card-name {
    color: var(--text-primary);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #365CC5;
}

@media (max-width: 768px) {
    .metrics-container {
        grid-template-columns: auto !important;
    }
    .metrics-grid {
        grid-template-columns: auto !important;
    }
    .filter-header > div > span {
        display: none;
    }
    .btn-customize {
        display: none;
    }
    .payment-chart {
        display: none;
    }
    .dashboard-main {
        margin-left: 0;
    }

    .dashboard-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-actions {
        width: 100%;
        flex-direction: column;
    }

    .layout-controls {
        width: 100%;
    }

    .layout-select {
        flex: 1;
    }

    .btn-customize {
        width: 100%;
    }

    .metrics-container.chart-right {
        grid-template-columns: 1fr;
    }

    .payment-chart {
        min-width: 100%;
    }
}
</style>