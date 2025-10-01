import { ref, computed, onMounted } from 'vue'

export function useTabs(tabsConfig: Record<string, any>) {
    const selected = ref(Object.keys(tabsConfig)[0]);
    const tabLoaded = ref<Record<string, boolean>>({});
    const columnsAd = ref([
        // {id: 'status', label: 'Status', checked: true},
        {id: 'name', label: 'Campanha', checked: true},
        {id: 'budget', label: 'Orçamento', checked: true},
        {id: 'sales', label: 'Vendas', checked: true},
        {id: 'cpa', label: 'CPA', checked: true, info: 'Custo por Aquisição'},
        {id: 'spend', label: 'Gastos', checked: true},
        {id: 'revenue', label: 'Faturamento', checked: true},
        {id: 'profit', label: 'Lucro', checked: true},
        {id: 'roas', label: 'ROAS', checked: true, info: 'Retorno sobre Investimento em Anúncios'},
        {id: 'margin', label: 'Margem', checked: true},
        {id: 'roi', label: 'ROI', checked: true},
        {id: 'ic', label: 'IC', checked: true, info: 'Índice de Conversão'}
    ])
    const filters = {
        name: '',
        status: 'all',
        period: 'today',
        account: 'all',
        product: 'all'
    };

    const selectedTabStore = computed(() => tabsConfig[selected.value].store);

    const selectedLoading = computed(() => selectedTabStore.value?.loading ?? false)

    const selectedData = computed(() => selectedTabStore.value.data ?? []);
    const selectedColumns = computed(() => columnsAd.value ?? []);
    const selectedFilter = computed(() => filters ?? {});

    const selectTab = async (tabKey: string, filters) => {
        selected.value = tabKey;

        if (!tabLoaded.value[tabKey]) {
            await tabsConfig[tabKey].store.fetch(filters);
            tabLoaded.value[tabKey] = true;
        }
    };

    onMounted(async () => {
        await selectTab(selected.value, filters);
    });

    const syncFacebook = (async () => {
        await tabsConfig[selected.value].store.syncFacebook();
    });

    const reloadTabData = (async (filters, force) => {
        await tabsConfig[selected.value].store.fetch(filters, force);
    });

    const reloadTabWithFilters = (async () => {
        await reloadTabData(filters, true);
    });

    const updateBudget = (async (id, value) => {
        await tabsConfig[selected.value].store.updateBudget(id, value); //only campaign and adset
    });

    const start = (async (id: string | number) => {
        await tabsConfig[selected.value].store.start(id);
    })

    const stop = (async (id: string | number) => {
        await tabsConfig[selected.value].store.stop(id);
    })

    const duplicate = (async (id: string | number) => {
        await tabsConfig[selected.value].store.stop(id);
    })

    const batchAction = (async (payload) => {
        await tabsConfig[selected.value].store.batchAction(payload);
    })

    const tabs = Object.keys(tabsConfig).map(key => ({
        key,
        label: tabsConfig[key].label,
        icon: tabsConfig[key].icon,
    }));

    return {
        selected,
        tabs,
        selectedData,
        selectedColumns,
        selectedFilter,
        selectedLoading,
        reloadTabWithFilters,
        updateBudget,
        reloadTabData,
        selectTab,
        start,
        stop,
        duplicate,
        batchAction,
        syncFacebook
    }
}
