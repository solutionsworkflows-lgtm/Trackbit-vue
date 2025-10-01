<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminSideMenu from '../../components/admin/AdminSideMenu.vue'

interface DashboardMetrics {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    monthlyRevenue: number
    activeSubscriptions: number
    trialUsers: number
    conversionRate: number
    churnRate: number
}

const metrics = ref<DashboardMetrics>({
    totalUsers: 2567,
    activeUsers: 1893,
    totalRevenue: 198567.45,
    monthlyRevenue: 45678.90,
    activeSubscriptions: 1245,
    trialUsers: 324,
    conversionRate: 68,
    churnRate: 3.2
})

const recentUsers = ref([
    { id: 1, name: 'João Silva', email: 'joao@email.com', plan: 'Professional', status: 'active', lastLogin: '2025-04-25 15:30' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', plan: 'Enterprise', status: 'active', lastLogin: '2025-04-25 14:45' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Starter', status: 'trial', lastLogin: '2025-04-25 13:20' }
])

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<template>
    <div class="admin-dashboard">
        <AdminSideMenu />

        <div class="dashboard-main">
            <header class="dashboard-header">
                <div>
                    <h1>Dashboard Administrativo</h1>
                    <p class="subtitle">Visão geral da plataforma</p>
                </div>

                <div class="header-actions">
                    <button class="btn-secondary">
                        Exportar relatório
                    </button>
                    <button class="btn-primary">
                        Atualizar dados
                    </button>
                </div>
            </header>

            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Usuários Totais</h3>
                    <div class="metric-value">{{ metrics.totalUsers }}</div>
                    <div class="metric-subtitle">{{ metrics.activeUsers }} ativos</div>
                </div>

                <div class="metric-card">
                    <h3>Receita Total</h3>
                    <div class="metric-value">{{ formatCurrency(metrics.totalRevenue) }}</div>
                    <div class="metric-subtitle">Este mês: {{ formatCurrency(metrics.monthlyRevenue) }}</div>
                </div>

                <div class="metric-card">
                    <h3>Assinaturas Ativas</h3>
                    <div class="metric-value">{{ metrics.activeSubscriptions }}</div>
                    <div class="metric-subtitle">{{ metrics.trialUsers }} em trial</div>
                </div>

                <div class="metric-card">
                    <h3>Taxa de Conversão</h3>
                    <div class="metric-value">{{ metrics.conversionRate }}%</div>
                    <div class="metric-subtitle">Churn: {{ metrics.churnRate }}%</div>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Recent Users -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>Usuários Recentes</h2>
                        <RouterLink to="/admin/users" class="btn-text">
                            Ver todos →
                        </RouterLink>
                    </div>

                    <div class="users-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Plano</th>
                                <th>Status</th>
                                <th>Último Acesso</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in recentUsers" :key="user.id">
                                <td>
                                    <div class="user-info">
                                        <div class="user-avatar">{{ user.name[0] }}</div>
                                        <div>
                                            <div class="user-name">{{ user.name }}</div>
                                            <div class="user-email">{{ user.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ user.plan }}</td>
                                <td>
                    <span
                        class="status-badge"
                        :class="user.status"
                    >
                      {{ user.status === 'active' ? 'Ativo' : 'Trial' }}
                    </span>
                                </td>
                                <td>{{ formatDate(user.lastLogin) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Revenue Chart -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>Receita Mensal</h2>
                        <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color" style="background-color: #4169E1"></span>
                2025
              </span>
                            <span class="legend-item">
                <span class="legend-color" style="background-color: #A0AEC0"></span>
                2024
              </span>
                        </div>
                    </div>

                    <div class="chart-container">
                        <!-- Chart would go here -->
                        <div class="chart-placeholder">
                            Gráfico de receita mensal
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-dashboard {
    min-height: 100vh;
    background-color: #f7fafc;
}

.dashboard-main {
    margin-left: 250px;
    padding: var(--spacing-lg);
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
}

.dashboard-header h1 {
    margin: 0;
    font-size: 24px;
    color: #1a202c;
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: #718096;
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.metric-card {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-card h3 {
    margin: 0;
    font-size: 14px;
    color: #718096;
    font-weight: 500;
}

.metric-value {
    font-size: 24px;
    font-weight: 600;
    color: #1a202c;
    margin: var(--spacing-sm) 0;
}

.metric-subtitle {
    font-size: 14px;
    color: #718096;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
}

.dashboard-card {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.card-header h2 {
    margin: 0;
    font-size: 18px;
    color: #1a202c;
}

.btn-text {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
}

.users-table {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
    padding: var(--spacing-sm);
    font-size: 12px;
    font-weight: 500;
    color: #718096;
    border-bottom: 1px solid #e2e8f0;
}

td {
    padding: var(--spacing-sm);
    border-bottom: 1px solid #e2e8f0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.user-avatar {
    width: 32px;
    height: 32px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.user-name {
    font-weight: 500;
    color: #1a202c;
}

.user-email {
    font-size: 12px;
    color: #718096;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.active {
    background-color: #C6F6D5;
    color: #2F855A;
}

.status-badge.trial {
    background-color: #FEEBC8;
    color: #C05621;
}

.chart-legend {
    display: flex;
    gap: var(--spacing-md);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #718096;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.chart-container {
    height: 300px;
}

.chart-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7fafc;
    border-radius: var(--border-radius-md);
    color: #718096;
}

.btn-primary,
.btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 14px;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-secondary {
    background-color: white;
    color: #1a202c;
    border: 1px solid #e2e8f0;
}

@media (max-width: 1024px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .dashboard-main {
        margin-left: 0;
    }

    .dashboard-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-actions {
        width: 100%;
    }

    .metrics-grid {
        grid-template-columns: 1fr;
    }
}
</style>