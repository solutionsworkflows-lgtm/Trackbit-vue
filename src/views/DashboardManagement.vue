<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePageTitleStore } from '../store/pageTitle'
import { useDashboardManagementStore, type Dashboard, type CreateDashboardRequest, type UpdateDashboardRequest } from '@/store/dashboardManagement/dashboardManagement'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const pageTitle = usePageTitleStore()
const store = useDashboardManagementStore()

onMounted(() => {
    pageTitle.setTitle('Gerenciar Dashboards')
    store.initialize()
})

// State
const searchQuery = ref('')
const selectedBMFilter = ref('')
const selectedCurrencyFilter = ref('')
const activeDropdown = ref<string | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const dashboardToDelete = ref<Dashboard | null>(null)

// Notification system
const notification = ref({
    show: false,
    type: 'success' as 'success' | 'error' | 'info',
    message: ''
})

// Form data
const dashboardForm = ref<CreateDashboardRequest & { id?: string }>({
    name: '',
    description: '',
    businessManager: '',
    type: 'FACEBOOK',
    timezone: 'GMT',
    currency: 'BRL',
    featured: false
})

// Computed properties
const filteredDashboards = computed(() => {
    let filtered = store.dashboards

    if (searchQuery.value) {
        filtered = store.searchDashboards(searchQuery.value)
    }

    filtered = store.filterDashboards({
        businessManager: selectedBMFilter.value || undefined,
        currency: selectedCurrencyFilter.value || undefined
    })

    return filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })
})

// Methods
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    }).format(value)
}

const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return 'agora'
}

const getROASClass = (roas: number) => {
    if (roas >= 3) return 'excellent'
    if (roas >= 2) return 'good'
    return 'warning'
}

const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    notification.value = { show: true, type, message }
    setTimeout(() => {
        notification.value.show = false
    }, 4000)
}

const toggleDropdown = (dashboardId: string) => {
    activeDropdown.value = activeDropdown.value === dashboardId ? null : dashboardId
}

const handleToggleFavorite = async (dashboard: Dashboard) => {
    try {
        await store.toggleFavorite(dashboard.id)
        showNotification('success', `Dashboard ${dashboard.featured ? 'removido dos' : 'adicionado aos'} favoritos`)
    } catch (error) {
        showNotification('error', 'Erro ao atualizar favorito')
    }
}

const editDashboard = (dashboard: Dashboard) => {
    dashboardForm.value = {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        type: dashboard.type,
        timezone: 'GMT',
        currency: 'BRL',
        featured: dashboard.featured
    }
    showEditModal.value = true
    activeDropdown.value = null
}

const deleteDashboard = (dashboard: Dashboard) => {
    dashboardToDelete.value = dashboard
    showDeleteModal.value = true
    activeDropdown.value = null
}

const confirmDelete = async () => {
    if (!dashboardToDelete.value) return

    try {
        await store.deleteDashboard(dashboardToDelete.value.id)
        showNotification('success', 'Dashboard excluído com sucesso')
        showDeleteModal.value = false
        dashboardToDelete.value = null
    } catch (error) {
        showNotification('error', 'Erro ao excluir dashboard')
    }
}

const viewDashboard = (dashboard: Dashboard) => {
    console.log('Viewing dashboard:', dashboard.name)
    // Implementar navegação para o dashboard
}

const saveDashboard = async () => {
    try {
        if (showEditModal.value && dashboardForm.value.id) {
            const updateData: UpdateDashboardRequest = {
                id: dashboardForm.value.id,
                name: dashboardForm.value.name,
                description: dashboardForm.value.description,
                businessManager: dashboardForm.value.businessManager,
                timezone: dashboardForm.value.timezone,
                type: dashboardForm.value.type,
                currency: dashboardForm.value.currency,
                featured: dashboardForm.value.featured
            }
            await store.updateDashboard(updateData)
            showNotification('success', 'Dashboard atualizado com sucesso')
        } else {
            const createData: CreateDashboardRequest = {
                name: dashboardForm.value.name,
                description: dashboardForm.value.description,
                businessManager: dashboardForm.value.businessManager,
                timezone: dashboardForm.value.timezone,
                type: dashboardForm.value.type,
                currency: dashboardForm.value.currency,
                featured: dashboardForm.value.featured
            }
            await store.createDashboard(createData)
            showNotification('success', 'Dashboard criado com sucesso')
        }

        closeModals()
    } catch (error) {
        showNotification('error', showEditModal.value ? 'Erro ao atualizar dashboard' : 'Erro ao criar dashboard')
    }
}

const closeModals = () => {
    showCreateModal.value = false
    showEditModal.value = false
    dashboardForm.value = {
        name: '',
        description: '',
        businessManager: '',
        timezone: 'GMT-3 | Brasília',
        currency: 'BRL',
        featured: false
    }
}

// Watch for errors from store
watch(() => store.error, (error) => {
    if (error) {
        showNotification('error', error)
        store.clearError()
    }
})

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
        activeDropdown.value = null
    }
})
</script>

<template>
    <div class="dashboard-management">
        <div class="management-main">

            <div class="management-content">

                <!-- Loading State -->
                <div v-if="store.isLoading && filteredDashboards.length === 0" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Carregando dashboards...</p>
                </div>

                <!-- Error State -->
                <div v-if="store.error && filteredDashboards.length === 0" class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Erro ao carregar dashboards</h3>
                    <p>{{ store.error }}</p>
                    <button @click="store.initialize()" class="retry-btn">
                        Tentar novamente
                    </button>
                </div>

                <!-- Content -->
                <template v-if="!store.isLoading || filteredDashboards.length > 0">
                    <!-- Barra de Busca Minimalista -->
                    <div class="search-section" style="display: flex">
                        <div class="search-container">
                            <input
                                type="text"
                                v-model="searchQuery"
                                placeholder="Buscar dashboards..."
                                class="search-input"
                            />
                            <div class="search-icon">⌕</div>
                        </div>

                        <button
                            style=" margin-left: auto;"
                            class="create-btn"
                            @click="showCreateModal = true"
                            :disabled="store.isLoading"
                        >
                            <span class="create-icon">+</span>
                            Novo Dashboard
                        </button>

                        <div class="filter-pills" v-if="selectedBMFilter || selectedCurrencyFilter">
                            <div v-if="selectedBMFilter" class="filter-pill">
                                {{ selectedBMFilter }}
                                <button @click="selectedBMFilter = ''" class="pill-remove">×</button>
                            </div>
                            <div v-if="selectedCurrencyFilter" class="filter-pill">
                                {{ selectedCurrencyFilter }}
                                <button @click="selectedCurrencyFilter = ''" class="pill-remove">×</button>
                            </div>
                        </div>
                    </div>

                    <!-- Grid de Dashboards Minimalista -->
                    <div class="dashboards-container">
                        <div
                            v-for="dashboard in filteredDashboards"
                            :key="dashboard.id"
                            class="dashboard-item"
                            :class="{ 'featured': dashboard.featured }"
                            @click="viewDashboard(dashboard)"
                        >
                            <div class="dashboard-header">
                                <div class="dashboard-title">
                                    <h3>{{ dashboard.name }}</h3>
                                </div>

                                <div class="dashboard-actions" @click.stop>
                                    <button
                                        class="favorite-btn"
                                        @click="handleToggleFavorite(dashboard)"
                                        :class="{ 'active': dashboard.featured }"
                                        :disabled="store.isLoading"
                                    >
                                        ★
                                    </button>

                                    <div class="dropdown-container">
                                        <button
                                            class="menu-btn"
                                            @click="toggleDropdown(dashboard.id)"
                                        >
                                            ⋯
                                        </button>

                                        <div v-if="activeDropdown === dashboard.id" class="dropdown-menu" >
                                            <button @click="editDashboard(dashboard)" class="dropdown-item">
                                                Editar
                                            </button>
<!--                                            <button @click="handleDuplicate(dashboard)" class="dropdown-item">-->
<!--                                                Duplicar-->
<!--                                            </button>-->
                                            <button @click="deleteDashboard(dashboard)" class="dropdown-item delete">
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="dashboard-metrics">
                                <div class="metric-primary">
                                    <span class="metric-value">{{ formatCurrency(dashboard.revenue ?? 0) }}</span>
                                    <span class="metric-label">Faturamento</span>
                                </div>

<!--                                <div class="metrics-secondary">-->
<!--                                    <div class="metric-small">-->
<!--                                        <span class="value" :class="getROASClass(dashboard.roas)">{{ dashboard.roas.toFixed(1) }}</span>-->
<!--                                        <span class="label">ROAS</span>-->
<!--                                    </div>-->
<!--                                    <div class="metric-small">-->
<!--                                        <span class="value">{{ formatCurrency(dashboard.profit) }}</span>-->
<!--                                        <span class="label">Lucro</span>-->
<!--                                    </div>-->
<!--                                </div>-->
                            </div>

                            <div class="dashboard-footer">
                                <div class="status-indicators">
                                    <div class="indicator brl">BRL</div>
                                    <div class="indicator timezone">{{dashboard.type}}</div>
                                </div>

                                <div class="last-update">
                                    {{ formatRelativeTime(dashboard.lastUpdated) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Estado Vazio Minimalista -->
                    <div v-if="filteredDashboards.length === 0 && !store.isLoading" class="empty-state">
                        <div class="empty-content">
                            <div class="empty-icon">📊</div>
                            <h3>{{ searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum dashboard criado' }}</h3>
                            <p>{{ searchQuery ? 'Tente ajustar sua busca' : 'Crie seu primeiro dashboard para começar' }}</p>
                            <button v-if="!searchQuery" class="create-btn" @click="showCreateModal = true">
                                Criar Dashboard
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Modal de Criação/Edição Minimalista -->
        <div v-if="showCreateModal || showEditModal" class="modal">
            <div class="modal-backdrop" @click="closeModals"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ showEditModal ? 'Editar Dashboard' : 'Novo Dashboard' }}</h2>
                    <button @click="closeModals" class="close-btn">×</button>
                </div>

                <form @submit.prevent="saveDashboard" class="modal-form">
                    <div class="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            v-model="dashboardForm.name"
                            placeholder="Nome do dashboard"
                            class="form-input"
                            required
                            :disabled="store.isLoading"
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Plataforma</label>
                            <select v-model="dashboardForm.type" class="form-select">
                                <option value="FACEBOOK" selected>Facebook</option>
                                <option value="KWAI" selected>Kwai</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Moeda</label>
                            <select v-model="dashboardForm.currency" class="form-select" :disabled="store.isLoading">
                                <option value="BRL" selected>BRL</option>
<!--                                <option value="USD">USD</option>-->
<!--                                <option value="EUR">EUR</option>-->
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Fuso Horário</label>
                            <select v-model="dashboardForm.timezone" class="form-select" :disabled="store.isLoading">
                                <option value="GMT" selected>GMT-3 | Brasília</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea
                            v-model="dashboardForm.description"
                            placeholder="Descrição opcional..."
                            class="form-textarea"
                            rows="3"
                            :disabled="store.isLoading"
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" @click="closeModals" class="btn-cancel" :disabled="store.isLoading">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-save" :disabled="store.isLoading">
                            <span v-if="store.isLoading" class="loading-spinner small"></span>
                            {{ store.isLoading ? 'Salvando...' : (showEditModal ? 'Salvar' : 'Criar') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de Confirmação de Exclusão -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-backdrop" @click="showDeleteModal = false"></div>
            <div class="modal-content small">
                <div class="delete-content">
                    <div class="delete-icon">⚠️</div>
                    <h3>Excluir Dashboard</h3>
                    <p>Tem certeza que deseja excluir <strong>{{ dashboardToDelete?.name }}</strong>?</p>
                    <p class="warning-text">Esta ação não pode ser desfeita.</p>

                    <div class="delete-actions">
                        <button @click="showDeleteModal = false" class="btn-cancel" :disabled="store.isLoading">
                            Cancelar
                        </button>
                        <button @click="confirmDelete" class="btn-delete" :disabled="store.isLoading">
                            <span v-if="store.isLoading" class="loading-spinner small"></span>
                            {{ store.isLoading ? 'Excluindo...' : 'Excluir' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast de Notificação -->
        <div v-if="notification.show" class="notification" :class="notification.type">
            <div class="notification-content">
        <span class="notification-icon">
          {{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '✗' : 'ℹ' }}
        </span>
                <span class="notification-message">{{ notification.message }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-management {
    min-height: 100vh;
    background-color: var(--background-color);
}

.management-main {
    margin-left: 250px;
}

.management-content {
    padding: 2rem;
    max-width: 90%;
    margin: 0 auto;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
}

.loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-spinner.small {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ef4444;
}

.error-state h3 {
    margin: 0 0 0.5rem;
    color: var(--text-primary);
}

.error-state p {
    margin: 0 0 1.5rem;
    color: var(--text-secondary);
}

.retry-btn {
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
}

/* Header Minimalista */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
}

.header-content h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
}

.subtitle {
    margin: 0.25rem 0 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
}

.create-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, #5a67d8 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.create-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.create-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.create-icon {
    font-size: 1.25rem;
    font-weight: 300;
}

/* Busca Minimalista */
.search-section {
    margin-bottom: 2rem;
}

.search-container {
    position: relative;
    max-width: 400px;
}

.search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid transparent;
    border-radius: 1rem;
    background-color: var(--card-background);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    outline: none;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    font-size: 1.25rem;
    pointer-events: none;
}

.filter-pills {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.filter-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: rgba(102, 126, 234, 0.1);
    color: var(--primary-color);
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.pill-remove {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Grid de Dashboards */
.dashboards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.dashboard-item {
    background-color: var(--card-background);
    border: 2px solid transparent;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.dashboard-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(102, 126, 234, 0.2);
}

.dashboard-item.featured {
    border-color: #FFD700;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, var(--card-background) 100%);
}

.dashboard-item.featured::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 2rem 2rem 0;
    border-color: transparent #FFD700 transparent transparent;
}

.dashboard-item.featured::after {
    content: '★';
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    color: white;
    font-size: 0.75rem;
    z-index: 1;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.dashboard-title h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

.bm-label {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.dashboard-actions {
    display: flex;
    gap: 0.5rem;
}

.favorite-btn,
.menu-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background-color: var(--menu-hover);
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.favorite-btn:hover:not(:disabled),
.menu-btn:hover {
    background-color: var(--border-color);
}

.favorite-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.favorite-btn.active {
    background-color: rgba(255, 215, 0, 0.2);
    color: #FFD700;
}

.dropdown-container {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 120px;
    overflow: hidden;
}

.dropdown-item {
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background-color: var(--menu-hover);
}

.dropdown-item.delete {
    color: #ef4444;
}

.dashboard-metrics {
    margin-bottom: 1.5rem;
}

.metric-primary {
    margin-bottom: 1rem;
}

.metric-primary .metric-value {
    display: block;
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
}

.metric-primary .metric-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-top: 0.25rem;
}

.metrics-secondary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.metric-small .value {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
}

.metric-small .value.excellent {
    color: #10b981;
}

.metric-small .value.good {
    color: #f59e0b;
}

.metric-small .value.warning {
    color: #ef4444;
}

.metric-small .label {
    display: block;
    font-size: 0.625rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-top: 0.25rem;
}

.dashboard-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.status-indicators {
    display: flex;
    gap: 0.5rem;
}

.indicator {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.indicator.brl {
    background-color: rgba(34, 197, 94, 0.1);
    color: #16a34a;
}

.indicator.usd {
    background-color: rgba(59, 130, 246, 0.1);
    color: #2563eb;
}

.indicator.eur {
    background-color: rgba(168, 85, 247, 0.1);
    color: #9333ea;
}

.indicator.timezone {
    background-color: var(--menu-hover);
    color: var(--text-secondary);
}

.last-update {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* Estado Vazio */
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
}

.empty-content {
    text-align: center;
    max-width: 400px;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
}

.empty-content h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: var(--text-primary);
}

.empty-content p {
    margin: 0 0 1.5rem;
    color: var(--text-secondary);
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background-color: var(--card-background);
    border-radius: 1rem;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-content.small {
    max-width: 400px;
}

.modal-header {
    padding: 1.5rem 1.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background-color: var(--menu-hover);
}

.modal-form {
    padding: 0 1.5rem 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
}

.btn-cancel,
.btn-save {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-cancel {
    background-color: var(--menu-hover);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
}

.btn-cancel:hover:not(:disabled) {
    background-color: var(--border-color);
}

.btn-save {
    background: linear-gradient(135deg, var(--primary-color) 0%, #5a67d8 100%);
    color: white;
    border: none;
}

.btn-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-cancel:disabled,
.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Modal de Exclusão */
.delete-content {
    padding: 1.5rem;
    text-align: center;
}

.delete-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ef4444;
}

.delete-content h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    color: var(--text-primary);
}

.delete-content p {
    margin: 0 0 0.5rem;
    color: var(--text-secondary);
}

.warning-text {
    color: #ef4444;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

.delete-actions {
    display: flex;
    gap: 0.75rem;
}

.btn-delete {
    flex: 1;
    padding: 0.75rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-delete:hover:not(:disabled) {
    background-color: #dc2626;
    transform: translateY(-1px);
}

.btn-delete:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Notification */
.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 1001;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease-out;
}

.notification.success {
    background-color: rgba(16, 185, 129, 0.9);
    color: white;
}

.notification.error {
    background-color: rgba(239, 68, 68, 0.9);
    color: white;
}

.notification.info {
    background-color: rgba(59, 130, 246, 0.9);
    color: white;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-icon {
    font-weight: bold;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .management-main {
        margin-left: 0;
    }

    .management-content {
        padding: 1rem;
    }

    .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .dashboards-container {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>