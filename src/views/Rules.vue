<script setup lang="ts">
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import {useRulesStore} from '@/store/rules/rulesStore'
import {onMounted} from 'vue'
import Table from '@/components/common/Table.vue'

import { useAdAccountsStoreSelect } from '@/store/adAccountsStore'
const adAccountsStore = useAdAccountsStoreSelect();
import { useProductsStoreSelect } from '@/store/productsStore';
const productsStore = useProductsStoreSelect()

const rulesStore = useRulesStore()

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const {
    budgetValueInput,
    budgetLimitInput,
    listRules,
    rulesForm,
    showRulesModal,
    loadingRules
} = storeToRefs(rulesStore)

const {
    getRules,
    editRulesItem,
    submitRules,
    deleteRulesItem,
    resetRulesModal,
} = rulesStore

onMounted(() => {
    pageTitle.setTitle('Regras')
    getRules()

    if (adAccountsStore.adAccountsSelect.length === 0) {
        adAccountsStore.fetchAdAccounts();
    }
    if (productsStore.productsSelect.length === 0) {
        productsStore.fetch();
    }
})

const selectedMetric = ref('')

const metrics = [
    {value: 'impressions', label: 'Vis. de Pág'},
    {value: 'clicks', label: 'Cliques'},
    {value: 'conversions', label: 'Vendas'},
    {value: 'cpa', label: 'CPA'},
    {value: 'spend', label: 'Gasto'},
    {value: 'ic', label: 'IC'},
    {value: 'profit', label: 'Lucro'},
    {value: 'revenue', label: 'Orçamento'},
    {value: 'roi', label: 'ROI'}
    // {value: 'roas', label: 'ROAS'},
    // {value: 'margem', label: 'Margem de Lucro'},
    // {value: 'cpc', label: 'CPC'},
    // {value: 'cpi', label: 'CPI'},
    // {value: 'ics', label: 'ICs'},
    // {value: 'ctr', label: 'CTR'},
    // {value: 'cpm', label: 'CPM'},
    // {value: 'conversas', label: 'Conversas'},
    // {value: 'custo_conversa', label: 'Custo por Conversa'},
    // {value: 'cpl', label: 'CPL'},
    // {value: 'cpv', label: 'CPV'},
]

const conditions = [
    {value: 'GreaterThan', label: 'Maior que'},
    {value: 'LessThan', label: 'Menor que'},
    {value: 'GreaterEqual', label: 'Maior ou igual a'},
    {value: 'LessEqual', label: 'Menor ou igual a'}
]

const frequencies = [
    {value: '15min', label: 'A cada 15 minutos'},
    {value: '30min', label: 'A cada 30 minutos'},
    {value: '1h', label: 'A cada hora'},
    {value: '2h', label: 'A cada 2 horas'},
    {value: '3h', label: 'A cada 3 horas'},
    {value: '6h', label: 'A cada 6 horas'},
    {value: '1d', label: 'Uma vez por dia'},
]

const addCondition = () => {
    rulesForm.value.conditions.push({
        metric: '',
        operator: '',
        value: ''
    })
}
const money = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2,
};

const setBudgetOption = (option) => {
    if (option != rulesForm.value.action_budget_option) {
        rulesForm.value.action_budget_value = 0;
    }

    rulesForm.value.action_budget_option = option
}

const validatePercentage = () => {
    if (rulesForm.value.action_budget_value > 100) {
        rulesForm.value.action_budget_value = 100;
    }
    if (rulesForm.value.action_budget_value < 0) {
        rulesForm.value.action_budget_value = 0;
    }
};

</script>

<template>
    <div class="rules">
        <div class="rules-main">

            <div class="rules-content">
                <div class="content-area">
                    <div class="rules-header">
                        <h2>Regras</h2>
                        <div class="header-actions">
                            <button class="btn-primary" @click="resetRulesModal();showRulesModal = true">
                                Criar regra
                            </button>
                        </div>
                    </div>

                    <div class="rules-table">
                        <Table
                            :loading="loadingRules"
                            :data="listRules ?? []"
                            :columns="[
                                { label: 'Nome', value: 'name', type: 'string' },
                                { label: 'Frequência', value: 'frequency', type: 'string' },
                                { label: 'Última Execução', value: 'last_executed_at', type: 'date' },
                                { label: 'Próxima Execução', value: 'next_execution_at', type: 'date' },
                            ]"
                            @edit="editRulesItem"
                            @delete="deleteRulesItem"
                            :showActionButtons="true"
                        />
                    </div>
                </div>

                <!-- Rule Creation Modal -->
                <div v-if="showRulesModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <h3>Criar regra personalizada</h3>
                                <p class="modal-subtitle">Atualize campanhas, conjuntos ou anúncios por meio de regras
                                    automatizadas.</p>
                            </div>
                            <button @click="showRulesModal = false" class="close-btn">×</button>
                        </div>

                        <div class="modal-body">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Nome da Regra -->
                                <div class="form-group">
                                    <label>Nome da regra</label>
                                    <input
                                        type="text"
                                        v-model="rulesForm.name"
                                        placeholder="Nome da regra"
                                        class="form-input"
                                    />
                                </div>

                                <!-- Produto -->
                                <div class="form-group">
                                    <label>Produto</label>
                                    <select
                                        v-model="rulesForm.product"
                                        :disabled="productsStore.loading"
                                        :class="['form-select', { 'animate-pulse text-gray-400': productsStore.loading } ]"
                                    >
                                        <option v-if="productsStore.loading" disabled selected value="all">
                                            Carregando...
                                        </option>
                                        <option
                                            v-else
                                            v-for="product in productsStore.productsSelect"
                                            :key="product.value"
                                            :value="product.value"
                                        >
                                            {{ product.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Conta de Anúncio -->
                                <div class="form-group">
                                    <label>Conta de Anúncio</label>
                                    <select
                                        v-model="rulesForm.ad_account"
                                        :disabled="adAccountsStore.loading"
                                        :class="['form-select', { 'animate-pulse text-gray-400': adAccountsStore.loading } ]"
                                    >
                                        <option v-if="adAccountsStore.loading" disabled selected value="all">
                                            Carregando...
                                        </option>
                                        <option
                                            v-else
                                            v-for="account in adAccountsStore.adAccountsSelect"
                                            :key="account.value"
                                            :value="account.value"
                                        >
                                            {{ account.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Aplicar Regra A -->
                                <div class="form-group">
                                    <label>Aplicar regra a</label>
                                    <select v-model="rulesForm.apply_to" class="form-select">
                                        <option value="ActiveCampaigns">Campanhas Ativas</option>
                                        <option value="ActiveAdsets">Conjuntos Ativos</option>
                                        <option value="ActiveAds">Anúncios Ativos</option>
                                        <option value="PausedCampaigns">Campanhas Pausadas</option>
                                        <option value="PausedAdsets">Conjuntos Pausados</option>
                                        <option value="PausedAds">Anúncios Pausados</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>
                                    Filtrar por nome
                                    <span class="info-icon" title="Filtrar campanhas pelo nome">ⓘ</span>
                                </label>
                                <select v-model="rulesForm.filter_by_name" class="form-select">
                                    <option value="Qualquer">Qualquer</option>
                                    <option value="Personalizado">Personalizado</option>
                                </select>

                                <input
                                    v-if="rulesForm.filter_by_name === 'Personalizado'"
                                    type="text"
                                    v-model="rulesForm.filter_name_option"
                                    placeholder="Digite o nome"
                                    class="form-input mt-4"
                                />
                            </div>

                            <div class="form-group">
                                <label>Ação</label>
                                <select v-model="rulesForm.action" class="form-select">
                                    <option value="Ativar">Ativar</option>
                                    <option value="Pausar">Pausar</option>
                                    <option value="AumentarOrcamento">Aumentar Orçamento em </option>
                                    <option value="DiminuirOrcamento">Dimiuir Orçamento em </option>
                                </select>
                            </div>

                            <!-- Campos de valor para ações de orçamento -->
                            <div
                                v-if="rulesForm.action === 'AumentarOrcamento' || rulesForm.action === 'DiminuirOrcamento'"
                                class="budget-fields"
                            >
                                <!-- TIPO DE VALOR -->
                                <div class="form-group">
                                    <label>Tipo de Valor</label>
                                    <div class="value-type-selector">
                                        <button
                                            class="value-type-btn"
                                            :class="{ active: rulesForm.action_budget_option === 'fixed' }"
                                            @click="setBudgetOption('fixed')"
                                        >
                                            Valor Fixo
                                        </button>
                                        <button
                                            class="value-type-btn"
                                            :class="{ active: rulesForm.action_budget_option === 'percentage' }"
                                            @click="setBudgetOption('percentage')"
                                        >
                                            Porcentagem
                                        </button>
                                    </div>
                                </div>

                                <!-- VALOR FIXO OU PORCENTAGEM -->
                                <div class="form-group">
                                    <label>
                                        {{ rulesForm.action_budget_option === 'fixed' ? 'Valor Fixo' : 'Porcentagem' }}
                                        <span
                                            class="info-icon"
                                            :title="`${rulesForm.action === 'AumentarOrcamento' ? 'Aumentar' : 'Diminuir'} o orçamento em ${rulesForm.action_budget_option === 'fixed' ? 'um valor fixo' : 'uma porcentagem'}`"
                                        >ⓘ</span
                                        >
                                    </label>
                                    <div class="input-with-suffix">
                                        <input
                                            v-if="rulesForm.action_budget_option === 'fixed'"
                                            v-money3="money"
                                            v-model="rulesForm.action_budget_value"
                                            ref="budgetValueInput"
                                            class="form-input"
                                            placeholder="R$ 0,00"
                                        />

                                        <input
                                            v-else
                                            type="number"
                                            v-model="rulesForm.action_budget_value"
                                            class="form-input"
                                            placeholder="0"
                                            min="1"
                                            max="100"
                                            @input="validatePercentage"
                                        />
                                        <span class="input-suffix">{{ rulesForm.action_budget_option === 'fixed' ? 'R$' : '%' }}</span>
                                    </div>
                                </div>

                                <!-- LIMITE MÁXIMO -->
                                <div class="form-group">
                                    <label>
                                        Limite máximo de orçamento
                                        <span class="info-icon" title="Orçamento máximo que a campanha pode atingir">ⓘ</span>
                                    </label>
                                    <div class="input-with-suffix">
                                        <input
                                            ref="budgetLimitInput"
                                            v-money3="money"
                                            v-model="rulesForm.action_budget_limit"
                                            class="form-input"
                                            placeholder="R$ 0,00"
                                        />
                                        <span class="input-suffix">R$</span>
                                    </div>
                                </div>
                            </div>


                            <div class="form-group">
                                <label>
                                    Condições
                                    <span class="info-icon"
                                          title="Defina as condições para a regra ser executada">ⓘ</span>
                                </label>
                                <button class="btn-secondary add-condition" @click="addCondition">
                                    +
                                </button>

                                <div v-for="(condition, index) in rulesForm.conditions" :key="index"
                                     class="condition-row">
                                    <select v-model="condition.metric" class="form-select">
                                        <option v-for="metric in metrics" :key="metric.value" :value="metric.value">
                                            {{ metric.label }}
                                        </option>
                                    </select>

                                    <select v-model="condition.operator" class="form-select">
                                        <option v-for="cond in conditions" :key="cond.value" :value="cond.value">
                                            {{ cond.label }}
                                        </option>
                                    </select>

                                    <input
                                        type="number"
                                        v-model="condition.value"
                                        class="form-input"
                                        placeholder="0,00"
                                    />

                                    <button class="btn-icon" @click="rulesForm.conditions.splice(index, 1)">
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label>
                                        Período de Cálculo
                                        <span class="info-icon" title="Período para calcular as métricas">ⓘ</span>
                                    </label>
                                    <select v-model="rulesForm.calculation_period" class="form-select">
                                        <option value="today">Hoje</option>
                                        <option value="yesterday">Ontem</option>
                                        <option value="last_7d">Últimos 7 dias</option>
                                        <option value="this_month">Esse mês</option>
                                        <option value="last_month">Mês passado</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>
                                        Frequência
                                        <span class="info-icon" title="Com que frequência a regra será verificada">ⓘ</span>
                                    </label>
                                    <select v-model="rulesForm.frequency" class="form-select">
                                        <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                                            {{ freq.label }}
                                        </option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>
                                        Intervalo de Execução
                                        <span class="info-icon" title="Intervalo entre execuções da regra">ⓘ</span>
                                    </label>
                                    <select v-model="rulesForm.execution_interval" class="form-select">
                                        <option value="Qualquer">Qualquer</option>
                                        <option value="Personalizado">Personalizado</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>
                                        Limite de Execuções Diário
                                        <span class="info-icon"
                                              title="Número máximo de vezes que a regra pode ser executada por dia">ⓘ</span>
                                    </label>
                                    <select v-model="rulesForm.daily_execution_limit" class="form-select">
                                        <option value="Sem Limite">Sem Limite</option>
                                        <option value="1">1 vez por dia</option>
                                        <option value="2">2 vezes por dia</option>
                                        <option value="5">5 vezes por dia</option>
                                        <option value="10">10 vezes por dia</option>
                                    </select>
                                </div>
                            </div>
                            <div v-if="rulesForm.execution_interval === 'Personalizado'" class="form-group">
                                <div class="flex flex-col md:flex-row gap-4 items-start">
                                    <div class="flex flex-col" style="width: 50%;">
                                        <label class="mb-1 text-sm font-medium text-gray-700">Horário Inicial</label>
                                        <input type="time" v-model="rulesForm.execution_start_time"
                                               class="form-input border-gray-300 rounded-md shadow-sm"/>
                                    </div>
                                    <div class="flex flex-col" style="width: 50%;">
                                        <label class="mb-1 text-sm font-medium text-gray-700">Horário Final</label>
                                        <input type="time" v-model="rulesForm.execution_end_time"
                                               class="form-input border-gray-300 rounded-md shadow-sm"/>
                                    </div>
                                </div>

                                <p
                                    v-if="rulesForm.execution_start_time === rulesForm.execution_end_time"
                                    class="mt-4 flex items-start gap-2 rounded-md border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-800"
                                >
                                    <svg class="h-5 w-5 mt-0.5 text-yellow-500 shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            fill-rule="evenodd"
                                            d="M8.257 3.099c.764-1.36 2.722-1.36 3.486 0l6.518 11.613c.75 1.336-.213 3.038-1.743 3.038H3.482c-1.53 0-2.493-1.702-1.743-3.038L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75V8.75a.75.75 0 011.5 0v1.5c0 .414-.336.75-.75.75z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    Os horários escolhidos são idênticos. Para que a regra funcione corretamente e a
                                    frequência desejada seja aplicada, selecione horários distintos.
                                </p>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button @click="showRulesModal = false" class="btn-secondary">
                                Cancelar
                            </button>
                            <button
                                class="btn-primary"
                                :disabled="loadingRules"
                                @click="submitRules">{{ loadingRules ? 'Salvando...' : 'Salvar Regra' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos para os campos de orçamento */
.budget-fields {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.value-type-selector {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.value-type-btn {
    flex: 1;
    padding: var(--spacing-sm);
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.value-type-btn.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.input-with-suffix {
    position: relative;
}

.input-with-suffix .form-input {
    padding-right: 40px;
}

.input-suffix {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-weight: 500;
}
.content-area {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.rules {
    background-color: var(--background-color);
}

.rules-main {
    margin-left: 250px;
}

.rules-content {
    padding: var(--spacing-lg);
    padding-left: 0px;
    padding-right: 0px;
    margin: 20px 120px 20px 120px;
}

.rules-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.rules-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

.rules-table {
    border-radius: var(--border-radius-md);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
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
}

.empty-row td {
    text-align: center;
    color: var(--text-secondary);
    padding: var(--spacing-xl);
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
    max-width: 800px;
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
    padding: 0;
}

.modal-body {
    padding: var(--spacing-lg);
    gap: 16px;
}

.form-group {
    margin-bottom: 0px;
}
.form-group label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: 14px;
}

.form-input,
.form-select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--card-background);
    color: var(--text-primary);
    font-size: 14px;
}

.info-icon {
    color: var(--text-muted);
    cursor: help;
}

.add-condition {
    width: 100%;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    font-size: 18px;
}

.condition-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.btn-icon {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 20px;
    padding: var(--spacing-xs);
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
    .rules-content {
        margin-left: 20px;
        margin-right: 20px;
    }
    .rules-main {
        margin-left: 0;
    }

    .condition-row {
        grid-template-columns: 1fr;
    }
}
</style>