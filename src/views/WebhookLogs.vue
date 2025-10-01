<template>
    <div class="webhook-logs">
        <div class="logs-main">

            <div class="logs-content">
                <!-- Header com Breadcrumb -->
                <div class="logs-header">
                    <div class="breadcrumb">
                        <RouterLink to="/integrations" class="breadcrumb-item">
                            <span>🔗</span>
                            Integrações
                        </RouterLink>
                        <span class="breadcrumb-separator">›</span>
                        <span class="breadcrumb-current">Logs do Webhook</span>
                    </div>

                    <div class="webhook-info">
                        <div class="webhook-title">
                            <h1>{{ webhookData.name }}</h1>
                            <div class="webhook-status" :class="webhookData.status">
                                <span class="status-dot"></span>
                                {{ webhookData.status === 'active' ? 'Ativo' : 'Inativo' }}
                            </div>
                        </div>
                        <p class="webhook-url">{{ webhookData.url }}</p>
                    </div>
                </div>

                <!-- Health Summary Cards -->
                <div class="health-summary">
                    <div class="summary-card success">
                        <div class="card-icon">✅</div>
                        <div class="card-content">
                            <span class="card-value">{{ healthMetrics.successRate }}%</span>
                            <span class="card-label">Taxa de Sucesso</span>
                            <span class="card-trend success">+2.3% vs ontem</span>
                        </div>
                    </div>

                    <div class="summary-card total">
                        <div class="card-icon">📊</div>
                        <div class="card-content">
                            <span class="card-value">{{ formatNumber(healthMetrics.totalRequests) }}</span>
                            <span class="card-label">Total de Envios</span>
                            <span class="card-trend neutral">{{ selectedPeriod }}</span>
                        </div>
                    </div>

                    <div class="summary-card errors">
                        <div class="card-icon">⚠️</div>
                        <div class="card-content">
                            <span class="card-value">{{ healthMetrics.errorCount }}</span>
                            <span class="card-label">Falhas</span>
                            <span class="card-trend" :class="healthMetrics.errorTrend > 0 ? 'error' : 'success'">
                {{ healthMetrics.errorTrend > 0 ? '+' : '' }}{{ healthMetrics.errorTrend }}% vs ontem
              </span>
                        </div>
                    </div>

                    <div class="summary-card response-time">
                        <div class="card-icon">⚡</div>
                        <div class="card-content">
                            <span class="card-value">{{ healthMetrics.avgResponseTime }}ms</span>
                            <span class="card-label">Tempo Médio</span>
                            <span class="card-trend success">-15ms vs ontem</span>
                        </div>
                    </div>
                </div>

                <!-- Filters and Actions -->
                <div class="controls-section">
                    <div class="filters">
                        <div class="filter-group">
                            <label>Período</label>
                            <select v-model="selectedPeriod" @change="applyFilters" class="filter-select">
                                <option value="today">Hoje</option>
                                <option value="yesterday">Ontem</option>
                                <option value="last7days">Últimos 7 dias</option>
                                <option value="last30days">Últimos 30 dias</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Status</label>
                            <select v-model="selectedStatus" @change="applyFilters" class="filter-select">
                                <option value="all">Todos</option>
                                <option value="success">Sucesso</option>
                                <option value="error">Erro</option>
                                <option value="pending">Pendente</option>
                                <option value="timeout">Timeout</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Código HTTP</label>
                            <select v-model="selectedHttpCode" @change="applyFilters" class="filter-select">
                                <option value="all">Todos</option>
                                <option value="200">200 - OK</option>
                                <option value="400">400 - Bad Request</option>
                                <option value="401">401 - Unauthorized</option>
                                <option value="404">404 - Not Found</option>
                                <option value="500">500 - Server Error</option>
                            </select>
                        </div>

                    </div>

                    <div class="actions">
                        <button class="action-btn custom-btn" @click="refreshLogs" style="padding: 1rem 1rem;">
                            <i class="fa-solid fa-arrows-rotate"></i>
                            <span class="btn-text">Atualizar</span>
                        </button>
                    </div>
                </div>

                <!-- Logs Table -->
                <div class="logs-table-container">
                    <div class="table-header">
                        <h3>Histórico de Envios</h3>
                        <div class="table-info">
                            {{ filteredLogs.length }} de {{ webhookLogs.webhookLogs.length }} registros
                        </div>
                    </div>

                    <div class="logs-table">
                        <div class="table-head">
                            <div class="col-status">Status</div>
                            <div class="col-timestamp">Data/Hora</div>
                            <div class="col-event">Status venda</div>
                            <div class="col-response">Resposta</div>
                            <div class="col-actions">Ações</div>
                        </div>

                        <div class="table-body">
                            <div
                                v-for="log in paginatedLogs"
                                :key="log.id"
                                class="table-row"
                                :class="{ 'expanded': expandedLog === log.id }"
                            >
                                <div class="col-status">
                                    <div class="status-indicator" :class="log.response_status == 200 ? 'success' : 'error' ">
                                        <span class="status-icon">{{ getStatusIcon(log.response_status) }}</span>
                                        <span class="status -code">{{ log.response_status }}</span>
                                    </div>
                                </div>

                                <div class="col-timestamp">
                                    <div class="timestamp-main">{{ formatDate(log.created_at) }}</div>
                                </div>

                                <div class="col-event">
                                    <div class="event-type">{{ log.status_sale == 'paid' ? 'Pago' : 'Pendente' }}</div>
                                </div>

                                <div class="col-response">
                                    <div class="response-message">{{ log.response.message || 'N/A' }}</div>
                                </div>

                                <div class="col-actions">

                                    <button class="action-btn custom-btn" @click="toggleLogDetails(log.id)" >
                                        <i class="fa-solid fa-expand"></i>
                                    </button>

                                    <button class="action-btn custom-btn" v-if="log.response_status != 200" title="Reprocessar" @click="resendWebhook(log)" :disabled="isResending">
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </button>

                                    <button class="action-btn custom-btn" @click="copyLogData(log)" >
                                        <i class="fa-solid fa-copy"></i>
                                    </button>
                                </div>

                                <!-- Expanded Details -->
                                <div v-if="expandedLog === log.id" class="log-details">
                                    <div class="details-grid">
                                        <div class="detail-section">
                                            <div class="detail-item">
                                                <span class="detail-label">Payload:</span>
                                                <pre class="code-block limitar-texto">{{ JSON.stringify(log.payload, null, 2) }}</pre>
                                            </div>
                                        </div>

                                        <div class="detail-section">
                                            <h4>Response</h4>
                                            <div class="detail-item ">
                                                <span class="detail-label">Status:</span>
                                                <span class="detail-value status"  :class="log.response_status == 200 ? 'success' : 'error' ">
                                                  {{ log.response_status }} - {{ log.response.message }}
                                                </span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Body:</span>
                                                <pre class="code-block limitar-texto">{{ log.response.message  || 'Sem resposta' }}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-if="filteredLogs.length === 0" class="empty-state">
                                <div class="empty-icon">📭</div>
                                <h3>Nenhum log encontrado</h3>
                                <p>{{ searchQuery ? 'Tente ajustar os filtros de busca' : 'Ainda não há logs para este webhook' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" v-if="totalPages > 1">
                        <button
                            class="pagination-btn"
                            @click="currentPage = Math.max(1, currentPage - 1)"
                            :disabled="currentPage === 1"
                        >
                            ‹ Anterior
                        </button>

                        <div class="pagination-info">
                            Página {{ currentPage }} de {{ totalPages }}
                        </div>

                        <button
                            class="pagination-btn"
                            @click="currentPage = Math.min(totalPages, currentPage + 1)"
                            :disabled="currentPage === totalPages"
                        >
                            Próxima ›
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Test Webhook Modal -->
        <div v-if="showTestModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🧪 Testar Webhook</h3>
                    <button @click="showTestModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Tipo de Evento</label>
                        <select v-model="testData.eventType" class="form-select">
                            <option value="sale.created">Venda Criada</option>
                            <option value="sale.updated">Venda Atualizada</option>
                            <option value="sale.cancelled">Venda Cancelada</option>
                            <option value="payment.approved">Pagamento Aprovado</option>
                            <option value="payment.failed">Pagamento Falhou</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Payload de Teste</label>
                        <textarea
                            v-model="testData.payload"
                            class="form-textarea"
                            rows="10"
                            placeholder="JSON do payload..."
                        ></textarea>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showTestModal = false" class="btn-secondary">
                        Cancelar
                    </button>
                    <button @click="sendTestWebhook" class="btn-primary" :disabled="isTesting">
                        <span v-if="isTesting" class="loading-spinner"></span>
                        {{ isTesting ? 'Enviando...' : 'Enviar Teste' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Notification Toast -->
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePageTitleStore } from '../store/pageTitle'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import { useWebhookStore } from '@/store/integrations/webhookLogStore';
const webhookLogs = useWebhookStore()
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters'

const route = useRoute()
const pageTitle = usePageTitleStore()

onMounted(() => {
    pageTitle.setTitle('Logs do Webhook')
    loadWebhookData()
    loadWebhookLogs()
})

// Webhook data
const webhookData = ref({
    id: route.params.id,
    name: 'Webhook Hotmart - Vendas',
    url: 'https://api.minhaempresa.com/webhook/hotmart',
    status: 'active'
})

// Health metrics
const healthMetrics = ref({
    successRate: 94.2,
    totalRequests: 1247,
    errorCount: 73,
    errorTrend: -12,
    avgResponseTime: 245
})

// Filters
const selectedPeriod = ref('last7days')
const selectedStatus = ref('all')
const selectedHttpCode = ref('all')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

// UI State
const expandedLog = ref<string | null>(null)
const isResending = ref(false)
const showTestModal = ref(false)
const isTesting = ref(false)

// Test data
const testData = ref({
    eventType: 'sale.created',
    payload: JSON.stringify({
        "event": "sale.created",
        "data": {
            "id": "12345",
            "amount": 97.00,
            "customer": {
                "name": "João Silva",
                "email": "joao@email.com"
            }
        }
    }, null, 2)
})

// Notification system
const notification = ref({
    show: false,
    type: 'success' as 'success' | 'error' | 'info',
    message: ''
})

// Mock webhook logs data

// Computed properties
const filteredLogs = computed(() => {
    let filtered = webhookLogs.webhookLogs

    if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(log => log.status === selectedStatus.value)
    }

    if (selectedHttpCode.value !== 'all') {
        filtered = filtered.filter(log => log.httpCode.toString() === selectedHttpCode.value)
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(log =>
            log.id.toLowerCase().includes(query) ||
            log.eventType.toLowerCase().includes(query) ||
            JSON.stringify(log.payload).toLowerCase().includes(query)
        )
    }

    return filtered
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredLogs.value.slice(start, end)
})

// Methods
const loadWebhookData = () => {
    // Load webhook data from API
}

const loadWebhookLogs = () => {
    // Load webhook logs from API
}

const applyFilters = () => {
    currentPage.value = 1
    // Apply filters and reload data
}

const refreshLogs = () => {
    loadWebhookLogs()
    showNotification('success', 'Logs atualizados com sucesso')
}

const exportLogs = () => {
    // Export logs functionality
    showNotification('info', 'Exportação iniciada')
}

const toggleLogDetails = (logId: string) => {
    expandedLog.value = expandedLog.value === logId ? null : logId
}

const resendWebhook = async (log: any) => {
    isResending.value = true
    try {
        // Resend webhook logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        showNotification('success', 'Webhook reenviado com sucesso')
    } catch (error) {
        showNotification('error', 'Erro ao reenviar webhook')
    } finally {
        isResending.value = false
    }
}

const copyLogData = (log: any) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    showNotification('success', 'Dados copiados para a área de transferência')
}

const sendTestWebhook = async () => {
    isTesting.value = true
    try {
        // Send test webhook
        await new Promise(resolve => setTimeout(resolve, 2000))
        showTestModal.value = false
        showNotification('success', 'Webhook de teste enviado com sucesso')
        loadWebhookLogs() // Reload to show new test log
    } catch (error) {
        showNotification('error', 'Erro ao enviar webhook de teste')
    } finally {
        isTesting.value = false
    }
}

const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    notification.value = { show: true, type, message }
    setTimeout(() => {
        notification.value.show = false
    }, 4000)
}

// Utility functions

const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    if (minutes > 0) return `${minutes}m atrás`
    return 'agora mesmo'
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 200: return '✅'
        case 500: return '❌'
        default: return '❓'
    }
}

const getDurationClass = (duration: number) => {
    if (duration < 500) return 'fast'
    if (duration < 2000) return 'normal'
    return 'slow'
}
</script>

<style scoped>
/* Botões */
.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary, #a0aec0);
    transition: all 0.2s ease;
    border-radius: 0.375rem;
    padding: 0.375rem;
}

.custom-btn {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.375rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    position: relative;
}

.custom-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary, #f7fafc);
}

.webhook-logs {
    min-height: 100vh;
    background-color: var(--background-color);
}

.logs-main {
    margin-left: 250px;
}

.logs-content {
    padding: var(--spacing-lg);
    padding-left: 0px;
    padding-right: 0px;
    margin: 20px 120px 20px 120px;
}

/* Header */
.logs-header {
    margin-bottom: 2rem;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.breadcrumb-item:hover {
    color: var(--primary-color);
}

.breadcrumb-separator {
    color: var(--text-muted);
}

.breadcrumb-current {
    color: var(--text-primary);
    font-weight: 500;
}

.webhook-info {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 1rem;
    padding: 1.5rem;
}

.webhook-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.webhook-title h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary);
}

.webhook-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.webhook-status.active {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.webhook-status.inactive {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    animation: pulse 2s infinite;
}

.webhook-url {
    margin: 0;
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--text-secondary);
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.5rem;
    border-radius: 0.5rem;
}

/* Health Summary */
.health-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.summary-card {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.summary-card.success {
    border-color: rgba(92, 184, 92, 0.2);
}

.summary-card.errors {
    border-color: rgba(217, 83, 79, 0.2);
}

.summary-card.total {
    border-color: rgba(102, 126, 234, 0.2);
}

.summary-card.response-time {
    border-color: rgba(255, 193, 7, 0.2);
}

.card-icon {
    font-size: 2rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.card-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
}

.card-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.card-trend {
    font-size: 0.75rem;
    font-weight: 600;
}

.card-trend.success {
    color: #5cb85c;
}

.card-trend.error {
    color: #d9534f;
}

.card-trend.neutral {
    color: var(--text-muted);
}

/* Controls */
.controls-section {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
}

.filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 150px;
}

.filter-group label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.filter-select {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 0.875rem;
}

.search-group {
    position: relative;
    min-width: 250px;
}

.search-input {
    width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 0.875rem;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.actions {
    display: flex;
    gap: 0.75rem;
}

/* Table */
.logs-table-container {
    background-color: var(--card-background);
    border-radius: 1rem;
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
    margin: 0;
    font-size: 1.125rem;
    color: var(--text-primary);
}

.table-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.logs-table {
    overflow-x: auto;
}

.table-head {
    display: grid;
    grid-template-columns: 16% 14% 18% 35% 10%;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: var(--menu-hover);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table-body {
    min-height: 400px;
}

.table-row {
    display: grid;
    grid-template-columns: 16% 14% 18% 35% 10%;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease;
    cursor: pointer;
}

.table-row:hover {
    background-color: var(--menu-hover);
}

.table-row.expanded {
    background-color: rgba(102, 126, 234, 0.05);
}

.col-status {
    display: flex;
    align-items: center;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-indicator.success {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.status-indicator.error {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.status-indicator.pending {
    background-color: rgba(255, 193, 7, 0.1);
    color: #f0ad4e;
}

.status-indicator.timeout {
    background-color: rgba(108, 117, 125, 0.1);
    color: #6c757d;
}

.col-timestamp {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.timestamp-main {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 500;
}

.timestamp-relative {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.col-event {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.event-type {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 500;
}

.event-id {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: monospace;
}

.col-response {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.response-message {
    font-size: 0.875rem;
    color: var(--text-primary);
}

.response-size {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.col-duration {
    display: flex;
    align-items: center;
}

.duration-value {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.duration-value.fast {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.duration-value.normal {
    background-color: rgba(255, 193, 7, 0.1);
    color: #f0ad4e;
}

.duration-value.slow {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.col-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}


/* Log Details */
.log-details {
    grid-column: 1 / -1;
    padding: 1.5rem;
    //background-color: var(--menu-hover);
    //border-top: 1px solid var(--border-color);
    //margin-top: 1rem;
    border-radius: 0.5rem;
}

.details-grid {
    display: grid;
    //grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.limitar-texto {
    max-width: 1300px;       /* Limita a largura */
    overflow-x: auto;       /* Adiciona scroll horizontal se necessário */
    white-space: pre-wrap;  /* Permite quebras de linha e mantém indentação */
    word-wrap: break-word;  /* Quebra palavras muito grandes se necessário */
    background: #f5f5f5;     /* Opcional: fundo para parecer um code block */
    padding: 1rem;           /* Espaçamento interno */
    border-radius: 6px;      /* Bordas arredondadas */
}


.detail-section h4 {
    margin: 0 0 1rem;
    font-size: 1rem;
    color: var(--text-primary);
}

.detail-item {
    margin-bottom: 1rem;
}

.detail-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.detail-value {
    font-size: 0.875rem;
    color: var(--text-primary);
}

.detail-value.status.success {
    color: #5cb85c;
}

.detail-value.status.error {
    color: #d9534f;
}

.code-block {
    background-color: #1a1f2e;
    color: #e6e6e6;
    padding: 1rem;
    border-radius: 0.5rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.4;
    //overflow-x: auto;
    //max-height: 400px;
    //overflow-y: auto;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--card-background);
    border-radius: 0.5rem;
}

.metric-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.metric-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 500;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    margin: 0 0 0.5rem;
    color: var(--text-primary);
}

.empty-state p {
    margin: 0;
    font-size: 0.875rem;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.pagination-btn {
    padding: 0.5rem 1rem;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Modal */
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
    backdrop-filter: blur(4px);
}

.modal-content {
    background-color: var(--card-background);
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
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

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.form-select,
.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.form-select:focus,
.form-textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
}

.form-textarea {
    resize: vertical;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

/* Buttons */
.btn-primary,
.btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 0.875rem;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #365CC5;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background-color: var(--card-background);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

.loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
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

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

/* Responsive */
@media (max-width: 1200px) {
    .health-summary {
        grid-template-columns: repeat(2, 1fr);
    }

    .details-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .logs-main {
        margin-left: 0;
    }

    .logs-content {
        padding: 1rem;
    }

    .health-summary {
        grid-template-columns: 1fr;
    }

    .controls-section {
        flex-direction: column;
        align-items: stretch;
    }

    .filters {
        flex-direction: column;
    }

    .actions {
        justify-content: center;
    }

    .table-head,
    .table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .table-head > div,
    .table-row > div {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .table-head > div:before,
    .table-row > div:before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--text-secondary);
        display: block;
        margin-bottom: 0.25rem;
    }

    .notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>