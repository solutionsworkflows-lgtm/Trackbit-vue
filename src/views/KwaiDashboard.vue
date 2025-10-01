<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePageTitleStore } from '../store/pageTitle'
import { useKwaiStore } from '@/store/kwaiDashboardStore'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const pageTitle = usePageTitleStore()
const kwaiStore = useKwaiStore()

// Data periods
const datePeriods = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'thisMonth', label: 'Este mês' }
]

// Chart types
const chartTypes = [
    { value: 'line', label: 'Linha' },
    { value: 'bar', label: 'Barras' },
    { value: 'area', label: 'Área' }
]

// Chart metrics
const chartMetrics = [
    { id: 'sales', label: 'Vendas', color: '#5cb85c' },
    { id: 'pendingSales', label: 'Vendas pendentes', color: '#f0ad4e' },
]

// State
const selectedPeriod = ref('last7days')
const selectedChartType = ref('line')
const selectedChartMetrics = ref(['pendingSales', 'sales'])
const lastUpdateTime = ref('agora mesmo')
const isLoading = ref(false)

// Computed properties
const hasChartData = computed(() => {
    return selectedChartMetrics.value.length > 0
})

// Chart data
const chartData = computed(() => {
    const labels = kwaiStore.chartData.labels
    const datasets = selectedChartMetrics.value.map(metricId => {
        const metric = kwaiStore.chartData.datasets.find(ds => ds.label.toLowerCase() === getMetricLabel(metricId).toLowerCase())
        if (!metric) return null

        return {
            label: metric.label,
            data: metric.data,
            borderColor: metric.color,
            backgroundColor: metric.color,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: metric.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: metric.color,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
        }
    }).filter(Boolean)

    return {
        labels,
        datasets
    }
})

// Area chart data (with fill)
const areaChartData = computed(() => {
    const data = JSON.parse(JSON.stringify(chartData.value))

    if (data.datasets) {
        data.datasets.forEach((dataset: any) => {
            dataset.fill = true
            dataset.backgroundColor = `${dataset.borderColor}33` // Add transparency
        })
    }

    return data
})

// Chart options
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                size: 14
            },
            bodyFont: {
                size: 13
            },
            padding: 12,
            cornerRadius: 8
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    size: 12
                }
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                borderDash: [2, 2]
            },
            ticks: {
                font: {
                    size: 12
                }
            }
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    }
}

// Methods
const refreshData = async () => {
    isLoading.value = true
    try {
        await kwaiStore.initialize(selectedPeriod.value)
        lastUpdateTime.value = 'agora mesmo'
    } catch (error) {
        console.error('Erro ao atualizar dados:', error)
    } finally {
        isLoading.value = false
    }
}

const handlePeriodChange = (period: string) => {
    selectedPeriod.value = period
    refreshData()
}

const updateChartType = (type: string) => {
    selectedChartType.value = type
}

const updateChartData = () => {
    // Atualiza os dados do gráfico com base nas métricas selecionadas
    // Já está sendo feito via computed property
}

const getMetricLabel = (metricId: string): string => {
    const metric = chartMetrics.find(m => m.id === metricId)
    return metric ? metric.label : metricId
}

const exportProductData = () => {
    // Lógica para exportar dados dos produtos
    alert('Exportação de dados iniciada')
}

// Utility functions
const formatNumber = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
    }
    return new Intl.NumberFormat('pt-BR').format(value)
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const getConversionClass = (rate: number) => {
    if (rate >= 15) return 'high'
    if (rate >= 10) return 'medium'
    return 'low'
}

// Inicialização
onMounted(async () => {
    pageTitle.setTitle('Dashboard Kwai')
    isLoading.value = true
    try {
        await kwaiStore.initialize(selectedPeriod.value)
    } catch (error) {
        console.error('Erro ao carregar dados:', error)
    } finally {
        isLoading.value = false
    }
})

// Observar mudanças nas métricas selecionadas
watch(selectedChartMetrics, () => {
    updateChartData()
})
</script>

<template>
    <div class="kwai-dashboard">
        <div class="dashboard-main">

            <div class="dashboard-content">
                <!-- Header da Dashboard -->
                <div class="dashboard-header">
                    <div class="header-info"></div>

                    <div class="header-actions">
                        <div class="date-selector">
                            <button
                                v-for="period in datePeriods"
                                :key="period.value"
                                class="date-btn"
                                :class="{ active: selectedPeriod === period.value }"
                                @click="handlePeriodChange(period.value)"
                            >
                                {{ period.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Métricas Principais -->
                <div class="metrics-grid">
                    <MetricCard
                        v-for="metric in kwaiStore.mainMetrics"
                        :id="metric.id"
                        :loading="kwaiStore.isLoading"
                        :title="metric.label"
                        :value="metric.value"
                        :isCurrency="metric.isCurrency"
                        :info="metric.label"
                    />
                </div>

                <!-- Gráfico Principal -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h2>Desempenho ao Longo do Tempo</h2>
                        <div class="chart-controls">
                            <div class="chart-type-selector">
                                <button
                                    v-for="type in chartTypes"
                                    :key="type.value"
                                    class="chart-type-btn"
                                    :class="{ active: selectedChartType === type.value }"
                                    @click="updateChartType(type.value)"
                                >
                                    {{ type.label }}
                                </button>
                            </div>

                            <div class="chart-metrics-selector">
                                <label v-for="metric in chartMetrics" :key="metric.id" class="metric-checkbox">
                                    <input
                                        type="checkbox"
                                        :value="metric.id"
                                        v-model="selectedChartMetrics"
                                        @change="updateChartData"
                                    />
                                    <span class="checkbox-label">{{ metric.label }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="chart-wrapper">
                        <div v-if="isLoading" class="chart-loading">
                            <div class="loading-spinner large"></div>
                            <p>Carregando dados...</p>
                        </div>
                        <div v-else-if="!hasChartData" class="chart-empty">
                            <div class="empty-icon">📊</div>
                            <p>Selecione pelo menos uma métrica para visualizar o gráfico</p>
                        </div>
                        <div v-else class="chart-visualization">
                            <Line
                                v-if="selectedChartType === 'line'"
                                :data="chartData"
                                :options="chartOptions"
                            />
                            <Bar
                                v-else-if="selectedChartType === 'bar'"
                                :data="chartData"
                                :options="chartOptions"
                            />
                            <Line
                                v-else-if="selectedChartType === 'area'"
                                :data="areaChartData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>
                </div>

                <!-- Métricas Secundárias -->
<!--                <div class="secondary-metrics-grid">-->
<!--                    &lt;!&ndash; Métricas de Engajamento &ndash;&gt;-->
<!--                    <div class="metrics-section">-->
<!--                        <h3>Métricas de Engajamento</h3>-->
<!--                        <div class="engagement-metrics">-->
<!--                            <div class="engagement-metric">-->
<!--                                <div class="metric-circle" style="&#45;&#45;percentage: 78%;">-->
<!--                                    <div class="circle-inner">-->
<!--                                        <span class="circle-value">78%</span>-->
<!--                                        <span class="circle-label">Taxa de Visualização</span>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->

<!--                            <div class="engagement-stats">-->
<!--                                <div class="stat-item">-->
<!--                                    <div class="stat-value">12.5K</div>-->
<!--                                    <div class="stat-label">Visualizações</div>-->
<!--                                </div>-->
<!--                                <div class="stat-item">-->
<!--                                    <div class="stat-value">3.2K</div>-->
<!--                                    <div class="stat-label">Likes</div>-->
<!--                                </div>-->
<!--                                <div class="stat-item">-->
<!--                                    <div class="stat-value">1.8K</div>-->
<!--                                    <div class="stat-label">Comentários</div>-->
<!--                                </div>-->
<!--                                <div class="stat-item">-->
<!--                                    <div class="stat-value">2.4K</div>-->
<!--                                    <div class="stat-label">Compartilhamentos</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    &lt;!&ndash; Métricas de Conversão &ndash;&gt;-->
<!--                    <div class="metrics-section">-->
<!--                        <h3>Métricas de Conversão</h3>metrics-->
<!--                        <div class="conversion-metrics">-->
<!--                            <div class="funnel-visualization">-->
<!--                                <div class="funnel-step" style="&#45;&#45;width: 100%;">-->
<!--                                    <span class="step-value">15.7K</span>-->
<!--                                    <span class="step-label">Visualizações</span>-->
<!--                                </div>-->
<!--                                <div class="funnel-step" style="&#45;&#45;width: 65%;">-->
<!--                                    <span class="step-value">10.2K</span>-->
<!--                                    <span class="step-label">Cliques</span>-->
<!--                                </div>-->
<!--                                <div class="funnel-step" style="&#45;&#45;width: 40%;">-->
<!--                                    <span class="step-value">6.3K</span>-->
<!--                                    <span class="step-label">Visitas na Página</span>-->
<!--                                </div>-->
<!--                                <div class="funnel-step" style="&#45;&#45;width: 25%;">-->
<!--                                    <span class="step-value">3.9K</span>-->
<!--                                    <span class="step-label">Adicionados ao Carrinho</span>-->
<!--                                </div>-->
<!--                                <div class="funnel-step" style="&#45;&#45;width: 15%;">-->
<!--                                    <span class="step-value">2.4K</span>-->
<!--                                    <span class="step-label">Vendas</span>-->
<!--                                </div>-->
<!--                            </div>-->

<!--                            <div class="conversion-rates">-->
<!--                                <div class="rate-item">-->
<!--                                    <div class="rate-label">CTR</div>-->
<!--                                    <div class="rate-value">65%</div>-->
<!--                                    <div class="rate-trend up">+5.2%</div>-->
<!--                                </div>-->
<!--                                <div class="rate-item">-->
<!--                                    <div class="rate-label">Taxa de Conversão</div>-->
<!--                                    <div class="rate-value">15.3%</div>-->
<!--                                    <div class="rate-trend up">+2.1%</div>-->
<!--                                </div>-->
<!--                                <div class="rate-item">-->
<!--                                    <div class="rate-label">Abandono de Carrinho</div>-->
<!--                                    <div class="rate-value">38.5%</div>-->
<!--                                    <div class="rate-trend down">-4.3%</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->

                <!-- Tabela de Produtos -->
<!--                <div class="products-section">-->
<!--                    <div class="section-header">-->
<!--                        <h3>Desempenho por Produto</h3>-->
<!--                        <div class="section-actions">-->
<!--                            <button class="btn-secondary" @click="exportProductData">-->
<!--                                <span>📥</span>-->
<!--                                Exportar-->
<!--                            </button>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    <div class="products-table">-->
<!--                        <div class="table-header">-->
<!--                            <div class="col-product">Produto</div>-->
<!--                            <div class="col-views">Visualizações</div>-->
<!--                            <div class="col-cart">Adições ao Carrinho</div>-->
<!--                            <div class="col-sales">Vendas</div>-->
<!--                            <div class="col-revenue">Receita</div>-->
<!--                            <div class="col-conversion">Taxa de Conversão</div>-->
<!--                        </div>-->

<!--                        <div class="table-body">-->
<!--                            <div-->
<!--                                v-for="product in kwaiStore.products"-->
<!--                                :key="product.id"-->
<!--                                class="table-row"-->
<!--                            >-->
<!--                                <div class="col-product">-->
<!--                                    <div class="product-info">-->
<!--                                        <div class="product-image">-->
<!--                                            <img :src="product.image" :alt="product.name" />-->
<!--                                        </div>-->
<!--                                        <div class="product-details">-->
<!--                                            <div class="product-name">{{ product.name }}</div>-->
<!--                                            <div class="product-sku">SKU: {{ product.sku }}</div>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                                <div class="col-views">{{ formatNumber(product.views) }}</div>-->
<!--                                <div class="col-cart">{{ formatNumber(product.cartAdds) }}</div>-->
<!--                                <div class="col-sales">{{ formatNumber(product.sales) }}</div>-->
<!--                                <div class="col-revenue">{{ formatCurrency(product.revenue) }}</div>-->
<!--                                <div class="col-conversion">-->
<!--                                    <div class="conversion-badge" :class="getConversionClass(product.conversionRate)">-->
<!--                                        {{ product.conversionRate }}%-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->

                <!-- Insights e Recomendações -->
<!--                <div class="insights-section">-->
<!--                    <h3>Insights e Recomendações</h3>-->

<!--                    <div class="insights-grid">-->
<!--                        <div-->
<!--                            v-for="insight in kwaiStore.insights"-->
<!--                            :key="insight.id"-->
<!--                            class="insight-card"-->
<!--                            :class="insight.type"-->
<!--                        >-->
<!--                            <div class="insight-icon">{{ insight.icon }}</div>-->
<!--                            <div class="insight-content">-->
<!--                                <h4>{{ insight.title }}</h4>-->
<!--                                <p>{{ insight.description }}</p>-->
<!--                            </div>-->
<!--                            <button class="insight-action">{{ insight.action }}</button>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<style scoped>
.kwai-dashboard {
    min-height: 100vh;
    background-color: var(--background-color);
}

.dashboard-main {
    margin-left: 250px;
}

.dashboard-content {
    max-width: 86%;
    margin: 0 auto;
    padding: var(--spacing-lg);
}

/* Header */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
}

.header-info {
    max-width: 600px;
}

.platform-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--menu-bg) 100%);
    border-radius: 2rem;
    color: white;
    margin-bottom: 1rem;
}

.platform-icon {
    font-size: 1.25rem;
}

.platform-name {
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
}

.header-info h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    color: var(--text-primary);
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--menu-bg) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    margin: 0;
    color: var(--text-secondary);
    font-size: 1rem;
}

.header-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
}

.date-selector {
    display: flex;
    background-color: var(--card-background);
    border-radius: 0.75rem;
    padding: 0.25rem;
    border: 1px solid var(--border-color);
}

.date-btn {
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.date-btn:hover {
    color: var(--text-primary);
}

.date-btn.active {
    background-color: var(--primary-color);
    color: white;
}

.refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.refresh-btn:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.refresh-icon {
    font-size: 1rem;
}

.last-update {
    font-size: 0.75rem;
}

/* Main Metrics */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.metric-card {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.metric-card:hover::before {
    opacity: 1;
}

.metric-card.approved-sales::before {
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}

.metric-card.paid::before {
    background: linear-gradient(90deg, transparent, #5cb85c, transparent);
}

.metric-card.cart-adds::before {
    background: linear-gradient(90deg, transparent, #f0ad4e, transparent);
}

.metric-card.total-products::before {
    background: linear-gradient(90deg, transparent, #5bc0de, transparent);
}

.metric-card.revenue::before {
    background: linear-gradient(90deg, transparent, #d9534f, transparent);
}

.metric-card.avg-order::before {
    background: linear-gradient(90deg, transparent, #6f42c1, transparent);
}

.metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.metric-icon {
    font-size: 1.5rem;
}

.metric-trend {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
}

.metric-trend.up {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.metric-trend.down {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.metric-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.metric-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Chart */
.chart-container {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.chart-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-primary);
}

.chart-controls {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.chart-type-selector {
    display: flex;
    background-color: var(--menu-hover);
    border-radius: 0.5rem;
    padding: 0.25rem;
}

.chart-type-btn {
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.chart-type-btn:hover {
    color: var(--text-primary);
}

.chart-type-btn.active {
    background-color: var(--card-background);
    color: var(--text-primary);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.chart-metrics-selector {
    display: flex;
    gap: 1rem;
}

.metric-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.chart-wrapper {
    height: 400px;
    position: relative;
}

/* Chart Placeholder (for demo) */
.chart-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.chart-visualization {
    height: 100%;
    width: 100%;
}

.chart-visualization::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--border-color);
}

.chart-line {
    flex: 1;
    height: var(--height);
    background: linear-gradient(to top, var(--color) 0%, transparent 100%);
    border-radius: 0.5rem 0.5rem 0 0;
    position: relative;
    animation: growUp 1.5s ease-out;
}

@keyframes growUp {
    from { height: 0; }
    to { height: var(--height); }
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem 0 0.5rem;
    border-top: 1px solid var(--border-color);
    margin-top: 1.5rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.legend-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Secondary Metrics */
.secondary-metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.metrics-section {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
}

.metrics-section h3 {
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    color: var(--text-primary);
}

/* Engagement Metrics */
.engagement-metrics {
    display: flex;
    gap: 2rem;
}

.engagement-metric {
    flex: 1;
    display: flex;
    justify-content: center;
}

.metric-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
        var(--primary-color) 0% var(--percentage),
        var(--menu-hover) var(--percentage) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.metric-circle::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--card-background);
}

.circle-inner {
    position: relative;
    text-align: center;
}

.circle-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
}

.circle-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    max-width: 100px;
    margin: 0 auto;
}

.engagement-stats {
    flex: 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.stat-item {
    background-color: var(--menu-hover);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* Conversion Metrics */
.conversion-metrics {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.funnel-visualization {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.funnel-step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--menu-bg) 100%);
    width: var(--width);
    height: 2.5rem;
    border-radius: 0.5rem;
    padding: 0 1rem;
    color: white;
    font-weight: 500;
    transition: width 1s ease-out;
}

.step-value {
    font-size: 0.875rem;
}

.step-label {
    font-size: 0.75rem;
}

.conversion-rates {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.rate-item {
    background-color: var(--menu-hover);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
}

.rate-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.rate-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.rate-trend {
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.25rem;
}

.rate-trend.up {
    color: #5cb85c;
}

.rate-trend.down {
    color: #d9534f;
}

/* Products Section */
.products-section {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h3 {
    margin: 0;
    font-size: 1.125rem;
    color: var(--text-primary);
}

.products-table {
    width: 100%;
    overflow-x: auto;
}

.table-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background-color: var(--menu-hover);
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table-row {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    align-items: center;
}

.table-row:last-child {
    border-bottom: none;
}

.product-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.product-image {
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-name {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.product-sku {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.conversion-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.conversion-badge.high {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.conversion-badge.medium {
    background-color: rgba(240, 173, 78, 0.1);
    color: #f0ad4e;
}

.conversion-badge.low {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

/* Insights Section */
.insights-section {
    background-color: var(--card-background);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
}

.insights-section h3 {
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    color: var(--text-primary);
}

.insights-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.insight-card {
    display: flex;
    flex-direction: column;
    background-color: var(--menu-hover);
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.insight-card:hover {
    transform: translateY(-5px);
}

.insight-card.opportunity {
    border-left-color: #5cb85c;
}

.insight-card.warning {
    border-left-color: #f0ad4e;
}

.insight-card.insight {
    border-left-color: #5bc0de;
}

.insight-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.insight-content {
    flex-grow: 1;
}

.insight-content h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: var(--text-primary);
}

.insight-content p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
}

.insight-action {
    align-self: flex-start;
    margin-top: 1.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.insight-action:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

/* Buttons */
.btn-primary,
.btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: var(--menu-bg);
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: var(--card-background);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

/* Responsive */
@media (max-width: 1400px) {
    .metrics-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1200px) {
    .secondary-metrics-grid {
        grid-template-columns: 1fr;
    }

    .insights-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 992px) {
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-header {
        flex-direction: column;
        gap: 1.5rem;
    }

    .header-actions {
        align-items: flex-start;
    }

    .chart-header {
        flex-direction: column;
    }

    .engagement-metrics {
        flex-direction: column;
    }

    .insights-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .chart-metrics-selector {
        display: block;
    }
    .dashboard-main {
        margin-left: 0;
    }

    .metrics-grid {
        grid-template-columns: 1fr;
    }

    .chart-controls {
        flex-direction: column;
        align-items: flex-start;
    }

    .conversion-rates {
        grid-template-columns: 1fr;
    }

    .table-header,
    .table-row {
        grid-template-columns: 1fr;
    }

    .table-header {
        display: none;
    }

    .table-row > div {
        padding: 0.5rem 0;
    }

    .table-row > div:not(.col-product) {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .table-row > div:not(.col-product)::before {
        content: attr(class);
        text-transform: uppercase;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
}
</style>