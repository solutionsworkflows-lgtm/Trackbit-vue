<script setup lang="ts">
import { useTabs } from '@/composables/campaigns/useTabs';
import {onMounted, watch} from 'vue'

import Header from '../components/layout/Header.vue';
import SideMenu from '../components/layout/SideMenu.vue';
import DataGrid from "../components/common/DataGrid.vue";

import { useFacebookStore } from '@/store/facebookStore';
import { useAdAccountsStore } from '@/store/campaigns/adAccountsStore';
import { useCampaignStore } from '@/store/campaigns/CampaignStore';
import { useAdSetStore } from '@/store/campaigns/AdSetStore';
import { useAdStore } from '@/store/campaigns/AdStore';
import {useDashboardStore} from "../store/dashboard.ts";
import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()
import debounce from 'lodash.debounce'

const facebookStore = useFacebookStore()

// Define a configuração das tabs
const tabsConfig = {
    contas: {
        label: 'Contas',
        icon: '<i class="fas fa-briefcase"></i>\n',
        store: useAdAccountsStore(),
    },
    campanhas: {
        label: 'Campanhas',
        icon: '<i class="fa-solid fa-bullhorn"></i>',
        store: useCampaignStore(),
    },
    conjuntos: {
        label: 'Conjuntos',
        icon: '<i class="fas fa-layer-group"></i>\n',
        store: useAdSetStore(),
    },
    anuncios: {
        label: 'Anúncios',
        icon: '<i class="fas fa-ad"></i>\n',
        store: useAdStore(),
    }
};


const reloadFilteredData = async (event) => {
    await reloadTabData(event, true)
}

const debounceReload = debounce((name, originalEvent) => {
    reloadFilteredData({ ...originalEvent, name })
}, 900)

const filterData = (event) => {
    // Se houver valor em event.name, usa debounce
    if (event.name && event.name.length > 0) {
        debounceReload(event.name, event)
    } else {
        reloadFilteredData(event)
    }
}

onMounted(async () => {
    pageTitle.setTitle('Campanhas')
});

const handleRefresh = async () => {
    //await facebookStore.sync();
    //await syncFacebook();
    console.log('clicked')
    reloadTabWithFilters();
};

// Status change handler
const handleStatusChange = async (code: string, status: boolean) => {
    if (status) {
        await start(code);
    } else {
        await stop(code);
    }
};

// Duplicate campaign handler
const handleBulkAction = async (id: string, targetAccount: string, copies: number, type, budget) => {
    await batchAction({
        ids: id,
        action: type,
        quantity: copies,
        targetAccount: targetAccount,
        budget
    });
    //reloadTabData();
};

const handleBudgetUpdate = (id: string, value: number) => {
    updateBudget(id, value)
}

// Usa o composable
const {
    selected,
    tabs,
    selectedData,
    selectedColumns,
    selectedFilter,
    selectedLoading,
    updateBudget,
    reloadTabData,
    reloadTabWithFilters,
    syncFacebook,
    selectTab,
    start,
    stop,
    duplicate,
    batchAction
} = useTabs(tabsConfig);
</script>

<template>
    <div class="campaigns">
        <div class="campaigns-main">
            <div class="campaigns-content-wrapper">
                <!-- Navegação de Tabs -->
                <div class="flex flex-row gap-2 justify-between px-0 m-0 items-end tabs">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        @click="selectTab(tab.key, selectedFilter)"
                        :class="[
                          'tab font-semibold text-sm pb-2 transition-all',
                          selected === tab.key ? 'border-b-2 border-black active' : 'text-gray-400  hover:border-black/20 border-b-2 border-transparent'
                        ]"
                    >
                        <span v-html="tab.icon"></span> {{ tab.label }}
                    </button>
                </div>

                <div class="campaigns-content">
                    <DataGrid
                        @update:filters="filterData"
                        :onBudgetUpdate="(id, value) => handleBudgetUpdate(id, value)"
                        :data="selectedData"
                        :columns="selectedColumns"
                        :filters="selectedFilter"
                        :loading="selectedLoading || facebookStore.loadingFacebook"
                        :onRefresh="handleRefresh"
                        :on-status-change="handleStatusChange"
                        :on-duplicate="handleBulkAction"
                        :show-settings="true"
                        :show-tracking="true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tabs {
    margin-top: 2rem;
    margin-left: 20px;
    margin-right: 20px;
}

.active {
    border-bottom: 2px solid var(--primary-color);
}

.campaigns-content-wrapper {
    margin-right: 2rem;
    margin-left: 2rem;
    padding-top: 10px;
}

button.tab:hover {
    color: var(--primary-color);
    border-bottom: 2px solid var(--card-background);
}

.tab {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: var(--card-background);
    font-size: 17px;
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    width: 28%;
    padding-top: 13px;
    padding-bottom: 13px;
}

.campaigns {
    background-color: var(--background-color);
}

.campaigns-main {
    margin-left: 250px;
}

.campaigns-content {
    padding: var(--spacing-lg);
    background: var(--card-background);
    margin: 0px 20px 20px 20px;
    border-radius: 5px;
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
    width: 95%;
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
    .campaigns-content {
        margin-left: 20px;
        margin-right: 20px;
    }
    .campaigns-content-wrapper {
        margin-left: 0px;
        margin-right: 0px;
    }
    .campaigns-main {
        margin-left: 0;
    }

    .filters {
        grid-template-columns: 1fr;
    }
}
</style>