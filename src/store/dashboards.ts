import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from "../services/apiClient.ts"
import {number} from "yup";

export interface Dashboard {
    id: number
    uuid: string
    code: string
    name: string
    type: string;
    slug: string
    description?: string
    settings?: Record<string, any> // ou algo mais específico
}
interface DashboardMenu {
    id: string
    label: string
    icon: string | number
    route?: string
    description?: string
    type: string;
    badge?: string
    isExpanded: boolean,
    submenu: DashboardMenu[]
}

interface MenuItem {
    id: string;
    label: string;
    type: string;
    icon: string;
    route: string;
    description: string;
    badge: string | null;
    enabled: boolean;
    submenu: MenuItem[];
}


export const useDashboardsStore = defineStore('dashboards', () => {
    const dashboards = ref<Dashboard[]>([])
    const dashboardMenus = ref<DashboardMenu[]>([])
    const loading = ref(false)
    const selectedDashboardSlug = ref<string | null>(null)

    const selectedDashboard = computed(() =>
        dashboards.value.find(d => d.slug === selectedDashboardSlug.value) || null
    )

    const firstDashboardCode = ref(null)

    async function prepareMenus() {
        await fetchDashboards()

        if (dashboards.value.length == 1) {
            const dashboardMenu = dashboards.value[0];

            dashboardMenus.value = [
                {
                    id: `dashboard-${dashboardMenu.code}`,
                    label: 'Resumo',
                    icon: 'fa-solid fa-chart-line',
                    route: `${dashboardMenu.type == 'KWAI' ? '/kwai-dashboard' : '/dashboard'}?code=${dashboardMenu.code}`,
                    description: 'Visão geral completa',
                    badge: null,
                    enabled: true,
                    submenu: []
                },
                {
                    id: `campaigns-${dashboardMenu.code}`,
                    label: 'Campanhas',
                    icon: 'fa-solid fa-bullhorn',
                    route: '',
                    description: 'Gerencie suas campanhas',
                    badge: null,
                    enabled: true,
                    submenu: [
                        {
                            id: `subitem-campaigns-${dashboardMenu.code}`,
                            label: 'Todas as Campanhas',
                            route: `/campaigns?code=${dashboardMenu.code}`,
                            enabled: true,
                            badge: null,
                            submenu: []
                        },
                        {
                            id: `subitem-performance-${dashboardMenu.code}`,
                            label: 'Análise de Performance',
                            route: '',
                            enabled: false,
                            badge: 'Em breve',
                            submenu: []
                        }
                    ]
                },
                {
                    id: `analytics-${dashboardMenu.code}`,
                    label: 'Analytics',
                    icon: 'fa-solid fa-chart-pie',
                    route: '',
                    description: 'Relatórios detalhados',
                    badge: null,
                    enabled: true,
                    submenu: [
                        {
                            id: `subitem-reports-${dashboardMenu.code}`,
                            label: 'Relatórios Gerais',
                            route: `/reports?code=${dashboardMenu.code}`,
                            enabled: true,
                            badge: null,
                            submenu: []
                        },
                        {
                            id: `subitem-roi-${dashboardMenu.code}`,
                            label: 'ROI Analysis',
                            route: '',
                            enabled: false,
                            badge: 'Em breve',
                            submenu: []
                        }
                    ]
                },
                {
                    id: `automation-${dashboardMenu.code}`,
                    label: 'Automação',
                    icon: 'fa-solid fa-robot',
                    route: `/rules?code=${dashboardMenu.code}`,
                    description: 'Regras inteligentes',
                    badge: null,
                    enabled: true,
                    submenu: []
                },
                {
                    id: `fees-${dashboardMenu.code}`,
                    label: 'Taxas',
                    icon: 'fa-solid fa-percent',
                    route: `/fees?code=${dashboardMenu.code}`,
                    description: '',
                    badge: null,
                    enabled: true,
                    submenu: []
                },
                {
                    id: `integrations-${dashboardMenu.code}`,
                    label: 'Integrações',
                    icon: 'fa-solid fa-plug',
                    route: `/integrations?code=${dashboardMenu.code}`,
                    description: 'Conecte suas ferramentas',
                    badge: null,
                    enabled: true,
                    submenu: []
                }
            ];

            dashboardMenus.value[0].isExpanded = true;
            return;
        }

        dashboardMenus.value = dashboards.value.map(dash => ({
            id: `dashboard-${dash.code}`,
            label: dash.name,
            icon: 'fa-solid fa-chart-line',
            route: ``,
            description: dash.description,
            badge: '',
            isExpanded: false,
            submenu: [
                {
                    id: `dashboard-${dash.code}`,
                    label: 'Resumo',
                    icon: 'fa-solid fa-chart-line',
                    route: `${dash.type == 'KWAI' ? '/kwai-dashboard' : '/dashboard'}?code=${dash.code}`,
                    description: 'Visão geral completa',
                    badge: null,
                    enabled: true,
                    submenu: []
                },
                {
                    id: `campaigns-${dash.code}`,
                    label: 'Campanhas',
                    route: ``,
                    enabled: false,
                    icon: 'fa-solid fa-bullhorn',
                    description: 'Gerencie suas campanhas',
                    submenu: [
                        {
                            id: `subitem-campaigns-${dash.code}`,
                            label: 'Todas as campanha',
                            route: `/campaigns?code=${dash.code}`,
                            enabled: true,
                            badge: null,
                            submenu: []
                        },
                        {
                            id: `subitem-performance-${dash.code}`,
                            label: 'Análise de Performance',
                            route: ``,
                            enabled: false,
                            badge: 'Em breve',
                            submenu: []
                        }
                    ]
                },
                {
                    id: `analytics-${dash.code}`,
                    label: 'Analytics',
                    route: ``,
                    enabled: true,
                    icon: 'fa-solid fa-chart-pie',
                    description: 'Relatórios detalhados',
                    submenu: [
                        {
                            id: `subitem-reports-${dash.code}`,
                            label: 'Relátorios Gerais',
                            route: `/reports?code=${dash.code}`,
                            enabled: true,
                            badge: '',
                            submenu: []
                        }
                    ]
                },
                {
                    id: `rules-${dash.code}`,
                    label: 'Automação',
                    route: `/rules?code=${dash.code}`,
                    enabled: true,
                    icon: 'fa-solid fa-robot',
                    description: 'Regras inteligentes',
                    submenu: []
                },
                {
                    id: `integrations-${dash.code}`,
                    label: 'Integrações',
                    route: `/integrations?code=${dash.code}`,
                    enabled: true,
                    icon: 'fa-solid fa-plug',
                    description: 'Conecte suas ferramentas',
                    submenu: []
                }
            ]
        }));
        dashboardMenus.value[0].isExpanded = true;
        firstDashboardCode.value = dashboardMenus.value[0].id.replace('dashboard-', '');
    }
    async function fetchDashboards() {
        try {
            if (dashboards.value.length > 0) return; // Já carregado, não faz de novo

            loading.value = true
            const response = await api.get('/users-dashboard');
            dashboards.value = response.data?.data || []
            firstDashboardCode.value = dashboards.value[0].code;
            //console.log(dashboards.value[0])
        } catch (e) {
            console.error('Erro ao carregar dashboards:', e)
        } finally {
            loading.value = false
        }
    }

    function setSelectedDashboard(slug: string) {
        selectedDashboardSlug.value = slug
    }

    return {
        dashboards,
        loading,
        selectedDashboard,
        firstDashboardCode,
        selectedDashboardSlug,
        dashboardMenus,
        fetchDashboards,
        prepareMenus
    }
}, { persist: true} );