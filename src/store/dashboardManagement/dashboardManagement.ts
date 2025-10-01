import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/apiClient'

export interface Dashboard {
    id: string
    name: string
    description: string
    businessManager: string
    timezone: string
    type: string
    currency: 'BRL' | 'USD' | 'EUR'
    featured: boolean
    revenue: number
    adSpend: number
    profit: number
    roas: number
    lastUpdated: Date
    createdAt: Date
    updatedAt: Date
}

export interface BusinessManager {
    id: string
    name: string
    status: 'active' | 'inactive'
    accountsCount: number
}

export interface CreateDashboardRequest {
    name: string
    description?: string
    businessManager: string
    type: string
    timezone: string
    currency: 'BRL' | 'USD' | 'EUR'
    featured?: boolean
}

export interface UpdateDashboardRequest extends CreateDashboardRequest {
    id: string
}

export const useDashboardManagementStore = defineStore('dashboardManagement', () => {
    // State
    const dashboards = ref<Dashboard[]>([])
    const businessManagers = ref<BusinessManager[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const uniqueBusinessManagers = computed(() => {
        return [...new Set(dashboards.value.map(d => d.businessManager))]
    })

    const featuredDashboards = computed(() => {
        return dashboards.value.filter(d => d.featured)
    })

    const dashboardsByBM = computed(() => {
        return (bmName: string) => dashboards.value.filter(d => d.businessManager === bmName)
    })

    // Actions
    const fetchDashboards = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.get('/users-dashboard')
            dashboards.value = response.data.data.map((dashboard: any) => ({
                ...dashboard,
                lastUpdated: new Date(dashboard.lastUpdated),
                createdAt: new Date(dashboard.createdAt),
                updatedAt: new Date(dashboard.updatedAt)
            }))
            console.log(dashboards.value)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao carregar dashboards'
            console.error('Error fetching dashboards:', err)

            // Fallback para dados mock em caso de erro
            //loadMockData()
        } finally {
            isLoading.value = false
        }
    }

    const createDashboard = async (dashboardData: CreateDashboardRequest): Promise<Dashboard> => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.post('/users-dashboard', dashboardData)
            const newDashboard: Dashboard = {
                ...response.data,
                lastUpdated: new Date(response.data.lastUpdated),
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
            }

            dashboards.value.unshift(newDashboard)
            return newDashboard
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao criar dashboard'
            console.error('Error creating dashboard:', err)

            // Fallback para criação local em caso de erro
            const mockDashboard: Dashboard = {
                id: Date.now().toString(),
                ...dashboardData,
                revenue: 0,
                adSpend: 0,
                profit: 0,
                roas: 0,
                featured: dashboardData.featured || false,
                lastUpdated: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }

            dashboards.value.unshift(mockDashboard)
            return mockDashboard
        } finally {
            isLoading.value = false
        }
    }

    const updateDashboard = async (dashboardData: UpdateDashboardRequest): Promise<Dashboard> => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.put(`/users-dashboard/${dashboardData.id}`, dashboardData)
            const updatedDashboard: Dashboard = {
                ...response.data,
                lastUpdated: new Date(response.data.lastUpdated),
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
            }

            const index = dashboards.value.findIndex(d => d.id === dashboardData.id)
            if (index > -1) {
                dashboards.value[index] = updatedDashboard
            }

            return updatedDashboard
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao atualizar dashboard'
            console.error('Error updating dashboard:', err)

            // Fallback para atualização local em caso de erro
            const index = dashboards.value.findIndex(d => d.id === dashboardData.id)
            if (index > -1) {
                const updatedDashboard = {
                    ...dashboards.value[index],
                    ...dashboardData,
                    updatedAt: new Date()
                }
                dashboards.value[index] = updatedDashboard
                return updatedDashboard
            }

            throw new Error('Dashboard não encontrado')
        } finally {
            isLoading.value = false
        }
    }

    const deleteDashboard = async (dashboardId: string): Promise<void> => {
        isLoading.value = true
        error.value = null

        try {
            await api.delete(`/users-dashboard/${dashboardId}`)

            const index = dashboards.value.findIndex(d => d.id === dashboardId)
            if (index > -1) {
                dashboards.value.splice(index, 1)
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao excluir dashboard'
            console.error('Error deleting dashboard:', err)

            // Fallback para exclusão local em caso de erro
            const index = dashboards.value.findIndex(d => d.id === dashboardId)
            if (index > -1) {
                dashboards.value.splice(index, 1)
            }
        } finally {
            isLoading.value = false
        }
    }

    const duplicateDashboard = async (dashboardId: string): Promise<Dashboard> => {
        const originalDashboard = dashboards.value.find(d => d.id === dashboardId)
        if (!originalDashboard) {
            throw new Error('Dashboard não encontrado')
        }

        const duplicateData: CreateDashboardRequest = {
            name: `${originalDashboard.name} (Cópia)`,
            description: originalDashboard.description,
            businessManager: originalDashboard.businessManager,
            timezone: originalDashboard.timezone,
            currency: originalDashboard.currency,
            featured: false
        }

        return await createDashboard(duplicateData)
    }

    const toggleFavorite = async (dashboardId: string): Promise<void> => {
        const dashboard = dashboards.value.find(d => d.id === dashboardId)
        if (!dashboard) return

        const updatedData: UpdateDashboardRequest = {
            id: dashboard.id,
            name: dashboard.name,
            description: dashboard.description,
            businessManager: dashboard.businessManager,
            // timezone: dashboard.timezone,
            // currency: dashboard.currency,
            featured: !dashboard.featured
        }

        await updateDashboard(updatedData)
    }

    const getDashboardById = (id: string): Dashboard | undefined => {
        return dashboards.value.find(d => d.id === id)
    }

    const searchDashboards = (query: string): Dashboard[] => {
        if (!query.trim()) return dashboards.value

        const searchTerm = query.toLowerCase()
        return dashboards.value.filter(dashboard =>
            dashboard.name.toLowerCase().includes(searchTerm) ||
            dashboard.description.toLowerCase().includes(searchTerm) ||
            dashboard.businessManager.toLowerCase().includes(searchTerm)
        )
    }

    const filterDashboards = (filters: {
        businessManager?: string
        currency?: string
        featured?: boolean
    }): Dashboard[] => {
        let filtered = dashboards.value

        if (filters.businessManager) {
            filtered = filtered.filter(d => d.businessManager === filters.businessManager)
        }

        if (filters.currency) {
            filtered = filtered.filter(d => d.currency === filters.currency)
        }

        if (filters.featured !== undefined) {
            filtered = filtered.filter(d => d.featured === filters.featured)
        }

        return filtered
    }

    const clearError = () => {
        error.value = null
    }

    // Initialize store
    const initialize = async () => {
        await Promise.all([
            fetchDashboards()
        ])
    }

    return {
        // State
        dashboards,
        businessManagers,
        isLoading,
        error,

        // Computed
        uniqueBusinessManagers,
        featuredDashboards,
        dashboardsByBM,

        // Actions
        fetchDashboards,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        duplicateDashboard,
        toggleFavorite,
        getDashboardById,
        searchDashboards,
        filterDashboards,
        clearError,
        initialize
    }
})