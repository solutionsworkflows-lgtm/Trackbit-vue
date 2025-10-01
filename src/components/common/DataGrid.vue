<script setup lang="ts">
import { ref, computed, onMounted, watch   } from 'vue'
import { useAdAccountsStoreSelect } from '@/store/adAccountsStore'
const adAccountsStore = useAdAccountsStoreSelect();
import { useProductsStoreSelect } from '@/store/productsStore';
const productsStore = useProductsStoreSelect()

interface Column {
    id: string
    label: string
    checked: boolean
    info?: string
}

interface Props {
    columns: Column[]
    data: any[],
    onBudgetUpdate?: (id: string, value: number) => void
    loading?: boolean
    filters?: {
        name?: string
        status?: string
        period?: string
        account?: string
        product?: string
    }
    showSettings?: boolean
    showTracking?: boolean
    onStatusChange?: (id: string, status: boolean) => void
    onDuplicate?: (id: string, targetAccount: string, copies: number) => void
    onRefresh?: () => void
}

const editingBudget = ref<string | null>(null)
const editingValue = ref('')

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showSettings: true,
    showTracking: true
})

const emit = defineEmits(['update:filters', 'column-change'])

const showColumnCustomization = ref(false)
const searchColumn = ref('')
const selectedRows = ref<string[]>([])
const showBulkActionMenu = ref(false)
const showDuplicateModal = ref(false)
const showUpdateBudgetModal = ref(false)

// Duplicate campaign state
const duplicateData = ref({
    campaignIds: '',
    targetAccount: '',
    selectedAccount: '',
    copies: 1
})

const updateBudgetData = ref({
    campaignIds: '',
    budget: 0,
    type: ''
})

const filteredColumns = computed(() => {
    if (!searchColumn.value) return props.columns
    return props.columns.filter(col =>
        col.label.toLowerCase().includes(searchColumn.value.toLowerCase())
    )
})

onMounted(async () => {
    if (adAccountsStore.adAccountsSelect.length === 0) {
        adAccountsStore.fetchAdAccounts();
    }
    if (productsStore.productsSelect.length === 0) {
        productsStore.fetch();
    }
});
const internalData = ref(props.data);

watch(() => props.data, (newData) => {
    internalData.value = newData;
});

/** code to edit budget */
const startEditing = (id: string, currentValue: string) => {
    editingBudget.value = id;
    editingValue.value = currentValue;
};

const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(num);
};

const totals = computed(() => {
    // Define the columns you want to sum directly
    const columnsToSum = ['spend', 'revenue', 'profit', 'budget', 'sales', 'cpa'];

    const calculatedTotals = {};

    // First, calculate the sums for the core metrics
    columnsToSum.forEach(col => {
        let totalValue = internalData.value.reduce((sum, item) => {
            let value = item[col];
            if (typeof value === 'string') {
                if (value.includes('%')) {
                    value = parseFloat(value.replace('%', ''));
                } else if (value.includes('R$')) {
                    value = parsePtBrNumber(value);
                } else {
                    value = parseFloat(value);
                }
            }
            return sum + (isNaN(value) ? 0 : value);
        }, 0);

        calculatedTotals[col] = totalValue;
    });

    // Now, calculate the derived metrics using the correct formulas
    const totalRevenue = calculatedTotals.revenue || 0;
    const totalSpend = calculatedTotals.spend || 0;

    // Calculate ROAS (Return on Ad Spend)
    calculatedTotals.roas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;

    // Calculate Margin
    calculatedTotals.margin = totalRevenue > 0 ? ((totalRevenue - totalSpend) / totalRevenue) * 100 : 0;

    // Calculate ROI (Return on Investment)
    calculatedTotals.roi = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;

    // Round all final values to 1 decimal place
    for (const key in calculatedTotals) {
        if (Object.prototype.hasOwnProperty.call(calculatedTotals, key)) {
            calculatedTotals[key] = parseFloat(calculatedTotals[key].toFixed(1));
        }
    }

    return calculatedTotals;
});

const unformatCurrency = (value: string) => {
    // Remove currency symbol and any non-digit characters except decimal separator
    return value.replace(/[R$\s.]/g, '').replace(',', '.');
};

const handleBudgetUpdate = (id: string) => {
    if (props.onBudgetUpdate) {
        const numericValue = unformatCurrency(editingValue.value)
        if (!isNaN(numericValue)) {
            props.onBudgetUpdate(id, numericValue);
        }
    }
    editingBudget.value = null;
    editingValue.value = '';
};


const cancelEditing = () => {
    editingBudget.value = null
    editingValue.value = ''
}

const handleBlur = () => {
    // formata apenas ao sair do input
    if (editingValue.value) {
        const parsed = parseFloat(editingValue.value.replace(',', '.'));
        if (!isNaN(parsed)) {
            editingValue.value = formatCurrency(parsed.toString());
        }
    }
};
const handleKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
        handleBudgetUpdate(id)
    } else if (e.key === 'Escape') {
        cancelEditing()
    }
}
/** end code to edit budget */

const currentPage = ref(1);
const itemsPerPage = ref(20);
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return internalData.value.slice(start, end);
});
const totalPages = computed(() => {
    return Math.ceil(internalData.value.length / itemsPerPage.value) || 1;
});

function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

const refreshData = () => {
    if (props.onRefresh) {
        props.onRefresh();
    }
};

const toggleStatus = () => {
    if (props.toggleStatus) {
        props.toggleStatus();
    }
};

const handleColumnChange = () => {
    emit('column-change', props.columns)
}

const toggleSelectAll = (event: Event) => {
    const checkbox = event.target as HTMLInputElement
    if (checkbox.checked) {
        selectedRows.value = props.data.map(item => item.id)
    } else {
        selectedRows.value = []
    }
}

// Add new sorting state
const sortConfig = ref({
    key: '',
    direction: 'asc' as 'asc' | 'desc'
});

const getSortIcon = (columnId: string) => {
    if (sortConfig.value.key !== columnId) {
        return 'fa-solid fa-sort';
    }
    return sortConfig.value.direction === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
};

// Add sorting function
const sortData = (key: string) => {
    if (sortConfig.value.key === key) {
        // Toggle direction if clicking same column
        sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // New column, default to ascending
        sortConfig.value.key = key;
        sortConfig.value.direction = 'asc';
    }

    // Sort the data
    internalData.value = [...props.data].sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        // Handle numeric values (including currency strings)
        if (typeof aVal === 'string' && aVal.includes('R$')) {
            aVal = parsePtBrNumber(aVal);
            bVal = parsePtBrNumber(bVal);
        }

        // Handle percentage values
        if (typeof aVal === 'string' && aVal.includes('%')) {
            aVal = parseFloat(aVal.replace('%', ''));
            bVal = parseFloat(bVal.toString().replace('%', ''));
        }

        if (aVal < bVal) return sortConfig.value.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.value.direction === 'asc' ? 1 : -1;
        return 0;
    });
};

// Update watch to preserve sorting when data changes
watch(() => props.data, (newData) => {
    internalData.value = [...newData];
    if (sortConfig.value.key) {
        sortData(sortConfig.value.key);
    }
});
// End sorting function

const toggleRowSelection = (id: string) => {
    const index = selectedRows.value.indexOf(id)
    if (index === -1) {
        selectedRows.value.push(id)
    } else {
        selectedRows.value.splice(index, 1)
    }
}

const handleStatusToggle = (code: string, status: boolean) => {
    if (props.onStatusChange) {
        props.onStatusChange(code, status)
    }
}
const getColumnClass = (columnId: string, item: any) => {
    const columnClassMap: Record<string, (item: any) => string> = {
        profit: (item) => getProfitColor(item.revenue, item.spend),
        margin: (item) => getMarginColor(item.margin),
        roi: (item) => getRoiColor(item.roi, item.spend),
        roas: (item) => getRoiColor(item.roas, item.spend),
        // adicionar mais conforme necessário
    };

    return columnClassMap[columnId]?.(item) || '';
};
const handleDuplicate = (type) => {
    duplicateData.value.campaignIds = selectedRows.value;
    duplicateData.value.type = type;

    showDuplicateModal.value = true
}
const handleUpdateBudget = (type) => {
    updateBudgetData.value.type = type;
    updateBudgetData.value.campaignIds = selectedRows.value;
    showUpdateBudgetModal.value = true
}

const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
}
const handleBulkAction = (type) => {
    duplicateData.value.campaignIds = selectedRows.value;
    duplicateData.value.type = type;

    // to usage bulk action start and stop
    if (props.onDuplicate) {
        showBulkActionMenu.value = false;
        props.onDuplicate(
            duplicateData.value.campaignIds,
            duplicateData.value.selectedAccount,
            duplicateData.value.copies,
            duplicateData.value.type
        )
    }
    duplicateData.value = { campaignIds: '', targetAccount: '', selectedAccount: '', copies: 1 }
}

const confirmDuplicate = () => {
    // to usage bulk action duplicate
    showDuplicateModal.value = false
    showBulkActionMenu.value = false
    if (props.onDuplicate) {
        props.onDuplicate(
            duplicateData.value.campaignIds,
            duplicateData.value.selectedAccount,
            duplicateData.value.copies,
            duplicateData.value.type
        )
    }
    duplicateData.value = { campaignIds: '', targetAccount: '', selectedAccount: '', copies: 1 }
}

const confirmUpdateBudget = () => {
    // to usage bulk action duplicate
    showUpdateBudgetModal.value = false
    showBulkActionMenu.value = false
    if (props.onDuplicate) {
        props.onDuplicate(
            updateBudgetData.value.campaignIds,
            null,
            null,
            updateBudgetData.value.type,
            updateBudgetData.value.budget,
        )
    }
    updateBudgetData.value = { campaignIds: '', budget: 0 }
}

const getMarginColor = (margin) => {
    if (margin < 0) return 'text-red-500'   // prejuízo
    if (margin > 20) return 'text-green-500' // margem boa
    return '' // entre 0 e 20% fica neutro
}

const getRoiColor = (roi, spend) => {
    if (roi <= 0 && spend > 0) return 'text-red-500'
    if (roi > 0) return 'text-green-500'
    return ''
}

const getProfitColor = (profit: number, spend: number) => {
    if (profit > spend) return 'text-green-500' //fatramento > gasto
    if (profit < spend && spend > 0) return 'text-red-500'
    if (profit < spend && spend == 0) return ''
    return ''
}

function parsePtBrNumber(value) {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
        // Detecta se está no formato pt-BR (contém vírgula como decimal)
        if (value.includes(',')) {
            return parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }

        // Caso já esteja no formato internacional, apenas converte
        return parseFloat(value);
    }

    return NaN;
}

const formatColumnValue = (value, columnId) => {
    const columnsToParse = ['spend', 'revenue', 'profit', 'budget', 'cpa'];
    const columnsPercent = ['margin'];

    if (columnsPercent.includes(columnId)) {
        return value + '%' ?? '-';
    }
    if (columnsToParse.includes(columnId)) {
        const parsed = parsePtBrNumber(value);
        return isNaN(parsed) ? '-' : parsed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return value ?? '-';
}
</script>

<template>
    <div class="data-grid">
        <div class="toolbar" v-if="showSettings || showTracking">
            <div class="toolbar-left" v-if="showSettings">
                <button class="icon-btn" @click="showColumnCustomization = true">
                    <span><i class="fa-solid fa-gear"></i></span>
                </button>
                <button class="icon-btn" :disabled="props.loading" @click="refreshData" style="padding: 11px">
                    <i class="fa-solid fa-rotate"></i>
                </button>
                <button
                    v-if="selectedRows.length > 0"
                    class="btn-secondary"
                    @click="showBulkActionMenu = true"
                >
                    Ações em massa ({{ selectedRows.length }})
                </button>
            </div>

            <div class="tracking-status" v-if="showTracking">
                <span class="status-dot"></span>
                Todas as vendas trackeadas
            </div>
        </div>

        <!-- Start filters  -->
        <div class="filters">
            <div class="filter-group" v-if="filters?.name !== undefined">
                <label>Nome</label>
                <input
                    type="text"
                    v-model="props.filters.name"
                    @input="$emit('update:filters', { ...props.filters, name: ($event.target as HTMLInputElement).value })"
                    placeholder="Filtrar por nome"
                    class="filter-input"
                />
            </div>

            <div class="filter-group" v-if="props.filters?.status !== undefined">
                <label>Status</label>
                <select
                    v-model="props.filters.status"
                    @change="$emit('update:filters', { ...props.filters, status: ($event.target as HTMLSelectElement).value })"
                    class="filter-select"
                >
                    <option value="all">Qualquer</option>
                    <option value="active">Ativo</option>
                    <option value="paused">Pausado</option>
                </select>
            </div>

            <div class="filter-group" v-if="props.filters?.period !== undefined">
                <label>Período</label>
                <select
                    v-model="props.filters.period"
                    @change="$emit('update:filters', { ...props.filters, period: ($event.target as HTMLSelectElement).value })"
                    class="filter-select"
                >
<!--                    <option value="all">Todo</option>-->
                    <option value="today">Hoje</option>
                    <option value="yesterday">Ontem</option>
                    <option value="last_7d">Últimos 7 dias</option>
                    <option value="last30">Últimos 30 dias</option>
                    <option value="this_month">Este mês</option>
                    <option value="last_month">Mês passado</option>
                </select>
            </div>

            <div class="filter-group" v-if="props.filters?.account !== undefined">
                <label>Conta de Anúncio</label>
                <select
                    v-model="props.filters.account"
                    @change="$emit('update:filters', { ...props.filters, account: ($event.target as HTMLSelectElement).value })"
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

            <div class="filter-group" v-if="props.filters?.product !== undefined">
                <label>Produto</label>
                <select
                    :value="props.filters.product"
                    @change="$emit('update:filters', { ...props.filters, product: ($event.target as HTMLSelectElement).value })"
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

        <div class="data-table">
            <table>
                <thead>
                <tr>
                    <th>
                        <label class="custom-checkbox">
                            <input
                                type="checkbox"
                                :checked="selectedRows.length === data.length"
                                @change="toggleSelectAll"
                            />
                            <span class="checkmark"></span>
                        </label>
                    </th>
                    <th @click="sortData('status')" class="sortable-header">
                        Status
                        <i :class="getSortIcon('status')" class="sort-indicator"></i>
                    </th>
                    <th
                        v-for="col in columns.filter(c => c.checked)"
                        :key="col.id"
                        @click="sortData(col.id)"
                        class="sortable-header"
                    >
                        {{ col.label }}
                        <span v-if="col.info" class="info-icon" :title="col.info">ⓘ</span>
                        <i :class="getSortIcon(col.id)" class="sort-indicator"></i>
                    </th>
                </tr>
                </thead>
                <tbody>
                <template v-if="!loading && data.length > 0">
                    <tr v-for="item in paginatedData" :key="item.id">
                        <td>
                            <label class="custom-checkbox">
                                <input
                                    type="checkbox"
                                    :id="`checkbox-${item.id}`"
                                    :checked="selectedRows.includes(item.id)"
                                    @change="toggleRowSelection(item.id)"
                                />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        <td>
                            <div class="toggle-switch">
                                <input
                                    :id="`switch-${item.id}`"
                                    :key="item.id"
                                    type="checkbox"
                                    :checked="item.status === 'active'"
                                    @change="handleStatusToggle(item.code, $event.target.checked)"
                                />
                                <label :for="`switch-${item.id}`" class="slider"></label>
                            </div>
                        </td>
                        <td
                            v-for="col in columns.filter(c => c.checked)"
                            :key="col.id"
                            :class="getColumnClass(col.id, item)"
                        >
                            <template v-if="col.id === 'budget'">
                                <div class="budget-cell" v-if="editingBudget === item.id && item.can_edit">
                                    <input
                                        type="text"
                                        v-model="editingValue"
                                        class="budget-input"
                                        @keydown="(e) => handleKeyDown(e, item.id)"
                                        @blur="handleBlur"
                                        v-focus
                                        placeholder="R$ 0,00"
                                    />

                                    <div class="budget-actions">
                                        <button class="budget-action save" @click="handleBudgetUpdate(item.id)">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="budget-action cancel" @click="cancelEditing">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="budget-cell">
                                    <span>{{ formatColumnValue(item[col.id], col.id) }}</span>
                                    <button class="edit-button" @click="startEditing(item.id, item[col.id])">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                </div>
                            </template>
                            <template v-else>
                                {{ formatColumnValue(item[col.id], col.id) }}
                            </template>
                        </td>
                    </tr>
                </template>
                <template v-else-if="loading">
                    <tr :colspan="columns.length + 3" class="animate-pulse">
                        <td v-for="col in columns.length + 2 " :key="col.id">
                            <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
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
                <tr v-if="!loading && data.length > 0" class="total-row">
                    <td>{{ internalData.length }} registros</td>
                    <td></td> <td
                    v-for="col in columns.filter(c => c.checked)"
                    :key="col.id"
                    :class="getColumnClass(col.id, totals)"
                >
                    <template v-if="col.id === 'budget'">
                    </template>
                    <template v-else>
                        {{ formatColumnValue(totals[col.id], col.id) }}
                    </template>
                </td>
                </tr>
                </tbody>
            </table>

            <div class="pagination" v-if="!props.loading && totalPages > 1" style="text-align: center; margin-top: 20px;">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>

                <span>Página {{ currentPage }} de {{ totalPages }}</span>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Próxima</button>
            </div>
        </div>

        <!-- Bulk Action Menu -->
        <div v-if="showBulkActionMenu" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Ações em massa</h3>
                    <button @click="showBulkActionMenu = false" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <button class="action-btn" @click="handleBulkAction('resume')">
                        Ativar
                    </button>
                    <button class="action-btn" @click="handleBulkAction('pause')">
                        Pausar
                    </button>
<!--                    <button class="action-btn" @click="handleBulkAction('delete')">-->
<!--                        Excluir-->
<!--                    </button>-->
                    <button class="action-btn" @click="handleDuplicate('duplicate')">
                        Duplicar
                    </button>

                    <button class="action-btn" @click="handleUpdateBudget('update-budget')">
                        Alterar orçamento
                    </button>
                </div>
            </div>
        </div>

        <!-- Duplicate Campaign Modal -->
        <div v-if="showDuplicateModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Duplique sua campanha</h3>
                    <p class="modal-subtitle">Escolha como você quer duplicar sua campanha.</p>
                    <button @click="showDuplicateModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <!-- Same Account Option -->
                    <div
                        class="duplicate-option active"
                        :class="{ active: duplicateData.targetAccount === 'same' }"
                        @click="duplicateData.targetAccount = 'same'"
                    >
                        <div class="option-content">
                            <h4>Mesma Conta de Anúncio</h4>
                            <p>Sua campanha será duplicada na mesma conta de anúncio a que pertence.</p>
                        </div>
                    </div>

<!--                    &lt;!&ndash; Different Account Option &ndash;&gt;-->
<!--                    <div-->
<!--                        class="duplicate-option"-->
<!--                        :class="{ active: duplicateData.targetAccount === 'other' }"-->
<!--                        @click="duplicateData.targetAccount = 'other'"-->
<!--                    >-->
<!--                        <div class="option-content">-->
<!--                            <h4>Outra Conta de Anúncio</h4>-->
<!--                            <p>Sua campanha será duplicada em outra conta de anúncio que você escolher.</p>-->
<!--                        </div>-->
<!--                    </div>-->

                    <!-- Account Selection -->
                    <div v-if="duplicateData.targetAccount === 'other'" class="form-group">
                        <label>Escolha a Conta de Anúncio</label>
                        <select
                            :value="props.filters.account"
                            @change="$emit('update:filters', { ...props.filters, account: ($event.target as HTMLSelectElement).value })"
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

                    <!-- Copies Input -->
                    <div class="form-group">
                        <label>Quantidade de cópias</label>
                        <input
                            type="number"
                            v-model="duplicateData.copies"
                            min="1"
                            max="10"
                            class="form-input"
                        />
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showDuplicateModal = false" class="btn-secondary">
                        Cancelar
                    </button>
                    <button
                        @click="confirmDuplicate"
                        class="btn-primary"
                        :disabled="!duplicateData.copies > 0"
                    >
                        Duplicar
                    </button>
                </div>
            </div>
        </div>

        <!-- Update Budget Modal -->
        <div v-if="showUpdateBudgetModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Altere o orçamento de sua campanha</h3>
                    <button @click="showUpdateBudgetModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Novo valor</label>
                        <input
                            type="number"
                            v-model="updateBudgetData.budget"
                            min="1"
                            max="10"
                            class="form-input"
                        />
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showUpdateBudgetModal = false" class="btn-secondary">
                        Cancelar
                    </button>
                    <button
                        @click="confirmUpdateBudget"
                        class="btn-primary"
                        :disabled="!updateBudgetData.budget > 0"
                    >
                        Alterar
                    </button>
                </div>
            </div>
        </div>

        <!-- Column Customization Modal -->
        <div v-if="showColumnCustomization" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Personalize as colunas</h3>
                    <button @click="showColumnCustomization = false" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <input
                        v-model="searchColumn"
                        type="text"
                        placeholder="Buscar por coluna"
                        class="column-search"
                    />
                    <div class="columns-list">
                        <label v-for="col in filteredColumns" :key="col.id" class="column-item">
                            <input
                                type="checkbox"
                                v-model="col.checked"
                                @change="handleColumnChange"
                            />
                            {{ col.label }}
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showColumnCustomization = false" class="btn-secondary">
                        Cancelar
                    </button>
                    <button @click="showColumnCustomization = false" class="btn-primary">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.total-row {
    font-weight: bold;
    color: var(--text-secondary);
}
.sortable-header {
    cursor: pointer;
    user-select: none;
    position: relative;
    padding-right: 20px;
    transition: background-color 0.2s ease;
}

.sortable-header:hover {
    background-color: var(--menu-hover);
}

.sort-indicator {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 12px;
}
.pagination {
    color: var(--text-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    font-weight: bold;
}
.budget-cell {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.budget-cell:hover .edit-button {
    opacity: 1;
}

.edit-button {
    opacity: 0;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    transition: all 0.2s ease;
}

.edit-button:hover {
    color: var(--primary-color);
}

.budget-input {
    width: 120px;
    padding: 4px 8px;
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius-sm);
    background: var(--card-background);
    color: var(--text-primary);
    text-align: right;
    font-family: monospace;
}

.budget-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.5;
}

.budget-actions {
    display: flex;
    gap: 4px;
}

.budget-action {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.budget-action.save {
    color: #10B981;
}

.budget-action.save:hover {
    color: #059669;
}

.budget-action.cancel {
    color: #EF4444;
}

.budget-action.cancel:hover {
    color: #DC2626;
}

.custom-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.custom-checkbox .checkmark {
    height: 20px;
    width: 20px;
    background-color: #eee;
    border: 2px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    margin-right: 8px;
    transition: all 0.2s ease;
    position: relative;
}

.custom-checkbox input:checked + .checkmark {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.custom-checkbox .checkmark::after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.custom-checkbox input:checked + .checkmark::after {
    display: block;
}


.action-buttons {
    display: flex;
    gap: var(--spacing-xs);
}

.btn-icon {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
}

.btn-icon:hover {
    background-color: var(--menu-hover);
}

.text-green-500 {
    color: #10B981;
}

.text-red-500 {
    color: #EF4444;
}

.duplicate-option {
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-md);
    cursor: pointer;
    transition: all 0.2s ease;
}

.duplicate-option:hover {
    border-color: var(--primary-color);
    background-color: var(--menu-hover);
}

.duplicate-option.active {
    border-color: var(--primary-color);
    background-color: rgba(65, 105, 225, 0.1);
}

.data-grid {
    width: 100%;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.toolbar-left {
    display: flex;
    gap: var(--spacing-sm);
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

.tracking-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: 14px;
}

.status-dot {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
}

.filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.filter-input,
.filter-select {
    border: 1px solid var(--border-color);
    height: 53px;
    color: var(--text-secondary);
    width: 100%;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    background-color: var(--background-color);
}
.filter-input, .filter-select:active {
    border: 1px solid var(--border-color);

}
.data-table {
    background-color: var(--card-background);
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

.info-icon {
    color: var(--text-muted);
    margin-left: var(--spacing-xs);
    cursor: help;
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
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
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

.column-search {
    width: 100%;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-bg);
    color: var(--text-primary);
}

.columns-list {
    display: grid;
    gap: var(--spacing-sm);
}

.column-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-primary);
    cursor: pointer;
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

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.action-buttons {
    display: flex;
    gap: var(--spacing-xs);
}

.btn-icon {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
}

.btn-icon:hover {
    background-color: var(--menu-hover);
}

.action-btn {
    width: 100%;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    text-align: left;
    background: none;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    color: var(--text-primary);
}

.action-btn:hover {
    background-color: var(--menu-hover);
}

.text-green-500 {
    color: #10B981;
}

.text-red-500 {
    color: #EF4444;
}

.duplicate-option {
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-md);
    cursor: pointer;
    transition: all 0.2s ease;
}

.duplicate-option:hover {
    border-color: var(--primary-color);
    background-color: var(--menu-hover);
}

.duplicate-option.active {
    border-color: var(--primary-color);
    background-color: rgba(65, 105, 225, 0.1);
}

.option-content h4 {
    margin: 0 0 var(--spacing-xs);
    color: var(--text-primary);
    font-size: 16px;
}

.option-content p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.modal-subtitle {
    margin: var(--spacing-xs) 0 var(--spacing-lg);
    color: var(--text-secondary);
    font-size: 14px;
}

@media (max-width: 768px) {
    .filters {
        grid-template-columns: 1fr;
    }
}
</style>