<script setup lang="ts">
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { useReportsStore } from '@/store/reports/reportsStore'

import { useAdAccountsStoreSelect } from '@/store/adAccountsStore';
const adAccountsStore = useAdAccountsStoreSelect();

import { useProductsStoreSelect } from '@/store/productsStore';
const productsStore = useProductsStoreSelect();

const showColumnModal = ref(false)
const dateRange = ref('this_week')
const adAccount = ref('all')
const product = ref('all')
const searchColumn = ref('')

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const columns = ref([
    { id: 'data', label: 'Data', checked: true },
    { id: 'dia', label: 'Dia', checked: true },
    { id: 'vendas', label: 'Vendas', checked: true },
    { id: 'cpa', label: 'CPA', checked: true },
    { id: 'gastos', label: 'Gastos', checked: true },
    { id: 'despesas', label: 'Despesas', checked: true },
    { id: 'faturamento', label: 'Faturamento', checked: true },
    { id: 'lucro', label: 'Lucro', checked: true },
    { id: 'roas', label: 'ROAS', checked: true },
    { id: 'margem', label: 'Margem', checked: true },
    { id: 'roi', label: 'ROI', checked: true },
    { id: 'ic', label: 'IC', checked: true },
    // { id: 'cpi', label: 'CPI', checked: true },
    // { id: 'cpc', label: 'CPC', checked: true },
    // { id: 'ctr', label: 'CTR', checked: true },
    // { id: 'cpm', label: 'CPM', checked: true },
    { id: 'impressoes', label: 'Impressões', checked: true },
])

const filteredColumns = computed(() =>
    columns.value.filter(col =>
        col.label.toLowerCase().includes(searchColumn.value.toLowerCase())
    )
)

const reportStore = useReportsStore()
const reportData = computed(() => reportStore.reportData)

const fetchData = () => {
    reportStore.fetchReports({
        period: dateRange.value,
        ad_account_id: adAccount.value !== 'Todas' ? adAccount.value : null,
        product_id: product.value !== 'Qualquer' ? product.value : null,
    })
}

const handleRefresh = () => {
    fetchData()
}

const handleColumnChange = () => {
    columns.value = [...columns.value]
}


onMounted(async () => {
    pageTitle.setTitle('Relatórios')

    fetchData()
    adAccountsStore.fetchAdAccounts();
    productsStore.fetch();
})

watch([dateRange, adAccount, product], fetchData)
</script>

<template>
    <div class="reports">

        <div class="reports-main">

            <div class="reports-content">
                <div class="content-area">
                    <div class="reports-header">
                        <h2>Relatórios</h2>
                        <p class="subtitle">Use essa tela para visualizar relatórios diários.</p>

                        <div class="header-actions">
                            <button class="icon-btn" @click="showColumnModal = true">
                                <span><i class="fa-solid fa-gear"></i></span>
                            </button>
                            <button class="icon-btn" @click="handleRefresh" style="padding: 11px">
                                <i class="fa-solid fa-rotate"></i>
                            </button>
                        </div>
                    </div>

                    <div class="filters">
                        <div class="filter-group">
                            <label>Período de Visualização</label>
                            <select v-model="dateRange" class="filter-select">
                                <option value="this_week">Esta semana</option>
                                <option value="last_week">Semana passada</option>
                                <option value="this_month">Este mês</option>
                                <option value="last_month">Mês passado</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Conta de Anúncio</label>
                            <div class="dropdown">
                                <select
                                    v-model="adAccount"
                                    :disabled="adAccountsStore.loading"
                                    :class="[
                                'filter-select',
                                { 'animate-pulse text-gray-400': adAccountsStore.loading }
                              ]"
                                >
                                    <option v-if="adAccountsStore.loading" disabled selected value="all">Carregando...</option>
                                    <option v-else v-for="account in adAccountsStore.adAccountsSelect" :key="account.value" :value="account.value">
                                        {{ account.label }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="filter-group">
                            <label>Produto</label>
                            <select
                                v-model="product"
                                :disabled="productsStore.loading"
                                :class="[
                                'filter-select',
                                { 'animate-pulse text-gray-400': productsStore.loading }
                              ]"
                            >
                                <option v-if="productsStore.loading" disabled selected value="all">Carregando...</option>
                                <option v-else v-for="product in productsStore.productsSelect" :key="product.value" :value="product.value">
                                    {{ product.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="reports-table">
                        <div class="table-wrapper">
                            <table>
                                <thead>
                                <tr>
                                    <th v-for="col in columns.filter(c => c.checked)" :key="col.id">
                                        {{ col.label }}
                                        <span v-if="col.info" class="info-icon" :title="col.info">ⓘ</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-if="reportStore.loading">
                                    <!-- Skeleton Rows -->
                                    <tr v-for="n in 5" :key="'skeleton-' + n" class="animate-pulse">
                                        <td v-for="col in columns" :key="col.id">
                                            <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else-if="reportData.length > 0">
                                    <tr v-for="row in reportData" :key="row.data">
                                        <td v-for="col in columns.filter(c => c.checked)" :key="col.id">
                                            {{ row[col.id.toLowerCase()] }}
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr class="empty-row">
                                        <td :colspan="columns.filter(c => c.checked).length + 3">
                                            Nenhum registro encontrado
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Modal para personalização de colunas -->
                <div v-if="showColumnModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <h3>Personalize as colunas</h3>
                                <p class="modal-subtitle">Escolha como você quer visualizar as colunas na tabela.</p>
                            </div>
                            <button @click="showColumnModal = false" class="close-btn">×</button>
                        </div>
                        <div class="modal-body">
                            <input
                                type="text"
                                v-model="searchColumn"
                                placeholder="Buscar por coluna"
                                class="search-input"
                            />
                            <div class="columns-list">
                                <label v-for="col in filteredColumns" :key="col.id" class="column-item">
                                    <input
                                        type="checkbox"
                                        v-model="col.checked"
                                        @change="handleColumnChange"
                                    />
                                    <span>{{ col.label }}</span>
                                    <span v-if="col.info" class="info-icon" :title="col.info">ⓘ</span>
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button @click="showColumnModal = false" class="btn-secondary">
                                Cancelar
                            </button>
                            <button @click="showColumnModal = false" class="btn-primary">
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.empty-row td {
    text-align: center;
    color: var(--text-secondary);
    padding: var(--spacing-xl);
}
.content-area {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}
.reports {
  background-color: var(--background-color);
}

.reports-main {
  margin-left: 250px;
}

.reports-content {
    padding: var(--spacing-lg);
    padding-left: 0px;
    padding-right: 0px;
    margin: 20px 120px 20px 120px;
}

.reports-header {
  margin-bottom: var(--spacing-lg);
}

.reports-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
}

.subtitle {
  margin: var(--spacing-xs) 0 var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.icon-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn:hover {
  background: var(--menu-hover);
  color: var(--text-primary);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-group label {
  font-size: 14px;
  color: var(--text-secondary);
}

.filter-select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--card-background);
  color: var(--text-primary);
}

.reports-table {
  background-color: var(--card-background);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th, td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--menu-hover);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
  position: sticky;
  top: 0;
}

.info-icon {
  color: var(--text-muted);
  margin-left: var(--spacing-xs);
  cursor: help;
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
  overflow-y: auto;
}

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-subtitle {
  margin: var(--spacing-xs) 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: var(--spacing-lg);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--card-background);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.columns-list {
  display: grid;
  gap: var(--spacing-sm);
}

.column-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
}

.column-item:hover {
  background-color: var(--menu-hover);
  border-radius: var(--border-radius-sm);
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #365CC5;
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--menu-hover);
}

@media (max-width: 768px) {
.reports-content {
    margin-left: 20px;
    margin-right: 20px;
}
  .reports-main {
    margin-left: 0;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}
</style>