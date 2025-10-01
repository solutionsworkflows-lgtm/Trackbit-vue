<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue'
import {data} from "autoprefixer";

interface Column {
    id: string
    label: string
    checked: boolean
    info?: string
}

interface Props {
    columns: Column[]
    data: any[]
    loading?: boolean
    showActionButtons?: boolean
    showSettings?: boolean
    onRefresh?: () => void
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showActionButtons: true,
    showSettings: false,
    onRefresh: Function
})
const internalData = ref(props.data);
const emit = defineEmits(['edit', 'delete']);

watch(
    () => props.data,
    (newData) => {
        internalData.value = newData;
    }
);
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

const formatValue = (value, type) => {
    if (!value) return '-'

    switch (type) {
        case 'date':
            return new Date(value).toLocaleString('pt-BR')
        case 'money':
            return Number(value).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2
            })
        case 'string':
        default:
            return value
    }
}
onMounted(() => {
   //console.log(props.data)
})
</script>

<template>
    <div class="data-grid">
        <div class="toolbar">
            <div class="toolbar-left" v-if="showSettings">
                <div class="grid-header">
                    <button @click="refreshData" :disabled="props.loading">🔄 Atualizar</button>
                </div>
            </div>
        </div>

        <!-- Start Table  -->
        <div class="data-table">
            <table>
                <thead>
                <tr>
                    <th v-for="col in props.columns" :key="col.id">
                        {{ col.label }}
                        <span v-if="col.info" class="info-icon" :title="col.info">ⓘ</span>
                    </th>
                    <th style="width: 100px" v-if="showActionButtons">#</th>

                </tr>
                </thead>
                <tbody>
                <template v-if="props.loading">
                    <!-- Skeleton Rows -->
                    <tr v-for="n in props.columns.length  + 1" :key="'skeleton-' + n" class="animate-pulse">
                        <td v-for="col in props.columns" :key="col.id">
                            <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </td>
                    </tr>
                </template>

                <template v-else-if="props.data.length > 0">
                    <tr v-for="(item, index) in paginatedData" :key="index">
                        <td v-for="col in props.columns" :key="col.value">
                            {{ formatValue(item[col.value], col.type) }}
                        </td>
                        <td class="flex gap-2" v-if="showActionButtons">
                            <button class="icon-btn" @click="$emit('edit', item)" style="padding: 11px">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>

                            <button class="icon-btn" @click="$emit('delete', item)" style="padding: 11px">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                </template>

                <template v-else>
                    <tr class="empty-row">
                        <td :colspan="props.columns.length + 1" class="text-center py-4">
                            Nenhum registro encontrado
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>

            <div class="pagination" v-if="!props.loading && totalPages > 1">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>

                <span>Página {{ currentPage }} de {{ totalPages }}</span>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Próxima</button>
            </div>
        </div>
        <!-- End Table  -->
    </div>
</template>

<style scoped>

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

.filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.filter-group label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
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
    background-color: var(--card-background);
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

@media (max-width: 768px) {
    .filters {
        grid-template-columns: 1fr;
    }
}
</style>