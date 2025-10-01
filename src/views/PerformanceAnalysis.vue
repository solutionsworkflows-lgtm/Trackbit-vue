<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitleStore } from '../store/pageTitle'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const pageTitle = usePageTitleStore()

onMounted(() => {
    pageTitle.setTitle('Análise de Performance')
})

// Dados simulados para demonstração
const performanceData = ref({
    overview: {
        totalSpend: 45678.90,
        totalRevenue: 156789.45,
        roas: 3.43,
        cpa: 89.50,
        conversionRate: 2.8,
        impressions: 2456789,
        clicks: 45678,
        ctr: 1.86
    },
    campaigns: [
        {
            id: 1,
            name: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 12500.00,
            revenue: 45600.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 167,
            impressions: 567890,
            clicks: 12345,
            ctr: 2.17,
            trend: 'up',
            recommendation: 'high',
            issues: []
        },
        {
            id: 2,
            name: 'Retargeting - Carrinho Abandonado',
            status: 'active',
            spend: 8900.00,
            revenue: 28900.00,
            roas: 3.25,
            cpa: 95.00,
            conversions: 94,
            impressions: 234567,
            clicks: 5678,
            ctr: 2.42,
            trend: 'stable',
            recommendation: 'medium',
            issues: ['high_cpa']
        },
        {
            id: 3,
            name: 'Prospecção - Lookalike 1%',
            status: 'active',
            spend: 15600.00,
            revenue: 31200.00,
            roas: 2.00,
            cpa: 156.00,
            conversions: 100,
            impressions: 890123,
            clicks: 8901,
            ctr: 1.00,
            trend: 'down',
            recommendation: 'low',
            issues: ['low_roas', 'high_cpa', 'low_ctr']
        },
        {
            id: 4,
            name: 'Teste Creative - Vídeo vs Imagem',
            status: 'active',
            spend: 5600.00,
            revenue: 22400.00,
            roas: 4.00,
            cpa: 56.00,
            conversions: 100,
            impressions: 345678,
            clicks: 6789,
            ctr: 1.96,
            trend: 'up',
            recommendation: 'high',
            issues: []
        }
    ],
    adsets: [
        {
            id: 1,
            name: 'Interesse - Empreendedorismo',
            campaign: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 6250.00,
            revenue: 22800.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 83,
            impressions: 283945,
            clicks: 6172,
            ctr: 2.17,
            frequency: 1.8,
            reach: 157747,
            trend: 'up',
            recommendation: 'high',
            issues: [],
            targeting: 'Interesse: Empreendedorismo, Marketing Digital',
            age: '25-45',
            gender: 'Todos'
        },
        {
            id: 2,
            name: 'Lookalike 1% - Compradores',
            campaign: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 6250.00,
            revenue: 22800.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 84,
            impressions: 283945,
            clicks: 6173,
            ctr: 2.17,
            frequency: 2.1,
            reach: 135212,
            trend: 'stable',
            recommendation: 'medium',
            issues: ['high_frequency'],
            targeting: 'Lookalike 1% - Compradores últimos 30 dias',
            age: '25-55',
            gender: 'Todos'
        },
        {
            id: 3,
            name: 'Retargeting - Visitantes 7 dias',
            campaign: 'Retargeting - Carrinho Abandonado',
            status: 'active',
            spend: 4450.00,
            revenue: 14450.00,
            roas: 3.25,
            cpa: 95.00,
            conversions: 47,
            impressions: 117283,
            clicks: 2839,
            ctr: 2.42,
            frequency: 3.2,
            reach: 36651,
            trend: 'down',
            recommendation: 'low',
            issues: ['high_frequency', 'audience_fatigue'],
            targeting: 'Visitantes do site - últimos 7 dias',
            age: '18-65',
            gender: 'Todos'
        },
        {
            id: 4,
            name: 'Carrinho Abandonado - 24h',
            campaign: 'Retargeting - Carrinho Abandonado',
            status: 'active',
            spend: 4450.00,
            revenue: 14450.00,
            roas: 3.25,
            cpa: 95.00,
            conversions: 47,
            impressions: 117284,
            clicks: 2839,
            ctr: 2.42,
            frequency: 2.8,
            reach: 41894,
            trend: 'stable',
            recommendation: 'medium',
            issues: [],
            targeting: 'Carrinho abandonado - últimas 24 horas',
            age: '25-55',
            gender: 'Todos'
        }
    ],
    ads: [
        {
            id: 1,
            name: 'Vídeo - Depoimento Cliente',
            adset: 'Interesse - Empreendedorismo',
            campaign: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 3125.00,
            revenue: 11400.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 42,
            impressions: 141972,
            clicks: 3086,
            ctr: 2.17,
            frequency: 1.8,
            reach: 78873,
            trend: 'up',
            recommendation: 'high',
            issues: [],
            creative_type: 'video',
            format: 'Single Video',
            placement: 'Feed, Stories',
            hook: 'Como ganhei R$ 50k em 30 dias...',
            cta: 'Saiba Mais'
        },
        {
            id: 2,
            name: 'Carrossel - Benefícios',
            adset: 'Interesse - Empreendedorismo',
            campaign: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 3125.00,
            revenue: 11400.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 41,
            impressions: 141973,
            clicks: 3086,
            ctr: 2.17,
            frequency: 1.8,
            reach: 78874,
            trend: 'stable',
            recommendation: 'medium',
            issues: [],
            creative_type: 'carousel',
            format: 'Carousel',
            placement: 'Feed',
            hook: '5 Estratégias que mudaram minha vida',
            cta: 'Saiba Mais'
        },
        {
            id: 3,
            name: 'Imagem - Urgência',
            adset: 'Lookalike 1% - Compradores',
            campaign: 'Campanha Black Friday - Produto A',
            status: 'active',
            spend: 3125.00,
            revenue: 11400.00,
            roas: 3.65,
            cpa: 75.00,
            conversions: 42,
            impressions: 141972,
            clicks: 3086,
            ctr: 2.17,
            frequency: 2.1,
            reach: 67606,
            trend: 'down',
            recommendation: 'low',
            issues: ['creative_fatigue'],
            creative_type: 'image',
            format: 'Single Image',
            placement: 'Feed, Stories',
            hook: 'Últimas horas! 70% OFF',
            cta: 'Comprar Agora'
        },
        {
            id: 4,
            name: 'Vídeo - Demonstração',
            adset: 'Retargeting - Visitantes 7 dias',
            campaign: 'Retargeting - Carrinho Abandonado',
            status: 'paused',
            spend: 2225.00,
            revenue: 7225.00,
            roas: 3.25,
            cpa: 95.00,
            conversions: 23,
            impressions: 58641,
            clicks: 1419,
            ctr: 2.42,
            frequency: 3.2,
            reach: 18325,
            trend: 'down',
            recommendation: 'low',
            issues: ['high_frequency', 'low_performance'],
            creative_type: 'video',
            format: 'Single Video',
            placement: 'Feed',
            hook: 'Veja como funciona na prática',
            cta: 'Assistir Demo'
        }
    ],
    audiences: [
        {
            id: 1,
            name: 'Interesse - Empreendedorismo',
            type: 'interest',
            size: 2500000,
            campaigns_using: 3,
            total_spend: 18750.00,
            total_revenue: 68400.00,
            avg_roas: 3.65,
            avg_cpa: 75.00,
            avg_ctr: 2.17,
            avg_frequency: 1.9,
            performance_score: 85,
            trend: 'up',
            recommendation: 'high',
            issues: [],
            targeting_details: {
                interests: ['Empreendedorismo', 'Marketing Digital', 'Negócios Online'],
                age: '25-45',
                gender: 'Todos',
                locations: ['Brasil'],
                behaviors: ['Compradores online frequentes']
            }
        },
        {
            id: 2,
            name: 'Lookalike 1% - Compradores',
            type: 'lookalike',
            size: 2100000,
            campaigns_using: 2,
            total_spend: 12500.00,
            total_revenue: 45600.00,
            avg_roas: 3.65,
            avg_cpa: 75.00,
            avg_ctr: 2.17,
            avg_frequency: 2.1,
            performance_score: 82,
            trend: 'stable',
            recommendation: 'medium',
            issues: ['frequency_rising'],
            targeting_details: {
                source: 'Compradores últimos 30 dias',
                similarity: '1%',
                age: '25-55',
                gender: 'Todos',
                locations: ['Brasil']
            }
        },
        {
            id: 3,
            name: 'Retargeting - Visitantes Site',
            type: 'custom',
            size: 45000,
            campaigns_using: 4,
            total_spend: 8900.00,
            total_revenue: 28900.00,
            avg_roas: 3.25,
            avg_cpa: 95.00,
            avg_ctr: 2.42,
            avg_frequency: 3.0,
            performance_score: 65,
            trend: 'down',
            recommendation: 'low',
            issues: ['audience_fatigue', 'high_frequency'],
            targeting_details: {
                source: 'Pixel do site',
                timeframe: 'Últimos 30 dias',
                exclusions: ['Compradores últimos 7 dias'],
                age: '18-65',
                gender: 'Todos'
            }
        },
        {
            id: 4,
            name: 'Carrinho Abandonado',
            type: 'custom',
            size: 12000,
            campaigns_using: 2,
            total_spend: 4450.00,
            total_revenue: 14450.00,
            avg_roas: 3.25,
            avg_cpa: 95.00,
            avg_ctr: 2.42,
            avg_frequency: 2.8,
            performance_score: 78,
            trend: 'stable',
            recommendation: 'medium',
            issues: [],
            targeting_details: {
                source: 'Evento de carrinho abandonado',
                timeframe: 'Últimas 24 horas',
                age: '25-55',
                gender: 'Todos'
            }
        }
    ],
    insights: [
        {
            type: 'opportunity',
            priority: 'high',
            title: 'Oportunidade de Escala',
            description: 'A campanha "Teste Creative" está performando 16% acima da meta de ROAS. Considere aumentar o orçamento em 30%.',
            action: 'Aumentar orçamento',
            impact: '+R$ 8.500 em receita estimada'
        },
        {
            type: 'warning',
            priority: 'high',
            title: 'CPA Elevado Detectado',
            description: 'A campanha "Prospecção - Lookalike 1%" está com CPA 74% acima da meta. Revise a segmentação e criativos.',
            action: 'Otimizar segmentação',
            impact: 'Redução estimada de 40% no CPA'
        },
        {
            type: 'info',
            priority: 'medium',
            title: 'Fadiga de Creative',
            description: 'CTR da campanha "Retargeting" caiu 15% nos últimos 3 dias. Hora de testar novos criativos.',
            action: 'Criar novos criativos',
            impact: 'Melhoria estimada de 25% no CTR'
        }
    ],
    timeframe: 'last7days'
})

const selectedTimeframe = ref('last7days')
const selectedView = ref('campaigns')
const showInsightModal = ref(false)
const selectedInsight = ref(null)

const timeframes = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'thisMonth', label: 'Este mês' },
    { value: 'lastMonth', label: 'Mês passado' }
]

const views = [
    { value: 'campaigns', label: 'Campanhas', icon: '🎯' },
    { value: 'adsets', label: 'Conjuntos', icon: '📊' },
    { value: 'ads', label: 'Anúncios', icon: '🖼️' },
    { value: 'audiences', label: 'Públicos', icon: '👥' }
]

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
}

const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
}

const formatAudienceSize = (size: number) => {
    if (size >= 1000000) {
        return `${(size / 1000000).toFixed(1)}M`
    } else if (size >= 1000) {
        return `${(size / 1000).toFixed(0)}K`
    }
    return size.toString()
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'success'
        case 'paused': return 'warning'
        case 'ended': return 'error'
        default: return 'default'
    }
}

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'up': return '📈'
        case 'down': return '📉'
        case 'stable': return '➡️'
        default: return '➡️'
    }
}

const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
        case 'high': return 'success'
        case 'medium': return 'warning'
        case 'low': return 'error'
        default: return 'default'
    }
}

const getInsightIcon = (type: string) => {
    switch (type) {
        case 'opportunity': return '💡'
        case 'warning': return '⚠️'
        case 'info': return 'ℹ️'
        default: return 'ℹ️'
    }
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'error'
        case 'medium': return 'warning'
        case 'low': return 'info'
        default: return 'default'
    }
}

const getCreativeIcon = (type: string) => {
    switch (type) {
        case 'video': return '🎥'
        case 'image': return '🖼️'
        case 'carousel': return '🎠'
        default: return '📄'
    }
}

const getAudienceTypeIcon = (type: string) => {
    switch (type) {
        case 'interest': return '🎯'
        case 'lookalike': return '👥'
        case 'custom': return '🔄'
        default: return '👤'
    }
}

const getPerformanceScoreColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
}

const openInsightModal = (insight: any) => {
    selectedInsight.value = insight
    showInsightModal.value = true
}

const applyRecommendation = (insight: any) => {
    // Lógica para aplicar recomendação
    console.log('Aplicando recomendação:', insight)
    showInsightModal.value = false
}

// Computed para dados da visualização atual
const currentData = computed(() => {
    return performanceData.value[selectedView.value] || []
})

// Computed para métricas principais
const mainMetrics = computed(() => [
    {
        label: 'Investimento Total',
        value: formatCurrency(performanceData.value.overview.totalSpend),
        icon: '💰',
        trend: '+12%',
        trendType: 'up'
    },
    {
        label: 'Receita Total',
        value: formatCurrency(performanceData.value.overview.totalRevenue),
        icon: '📈',
        trend: '+28%',
        trendType: 'up'
    },
    {
        label: 'ROAS Médio',
        value: performanceData.value.overview.roas.toFixed(2),
        icon: '🎯',
        trend: '+16%',
        trendType: 'up'
    },
    {
        label: 'CPA Médio',
        value: formatCurrency(performanceData.value.overview.cpa),
        icon: '💸',
        trend: '-8%',
        trendType: 'down'
    }
])

// Computed para insights por prioridade
const prioritizedInsights = computed(() => {
    return performanceData.value.insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
})
</script>

<template>
    <div class="performance-analysis">

        <div class="analysis-main">

            <div class="analysis-content">
                <!-- Header da Análise -->
                <div class="analysis-header">
                    <div class="header-info">
                        <h1>Análise de Performance</h1>
                        <p class="subtitle">Insights inteligentes para otimização de campanhas</p>
                    </div>

                    <div class="header-controls">
                        <select v-model="selectedTimeframe" class="timeframe-select">
                            <option v-for="timeframe in timeframes" :key="timeframe.value" :value="timeframe.value">
                                {{ timeframe.label }}
                            </option>
                        </select>

                        <button class="btn-primary">
                            <span>📊</span>
                            Exportar Relatório
                        </button>
                    </div>
                </div>

                <!-- Métricas Principais -->
                <div class="main-metrics">
                    <div v-for="metric in mainMetrics" :key="metric.label" class="metric-card">
                        <div class="metric-header">
                            <span class="metric-icon">{{ metric.icon }}</span>
                            <span class="metric-trend" :class="metric.trendType">
                {{ metric.trend }}
              </span>
                        </div>
                        <div class="metric-value">{{ metric.value }}</div>
                        <div class="metric-label">{{ metric.label }}</div>
                    </div>
                </div>

                <!-- Insights Inteligentes -->
                <div class="insights-section">
                    <div class="section-header">
                        <h2>🧠 Insights Inteligentes</h2>
                        <span class="insights-count">{{ prioritizedInsights.length }} insights disponíveis</span>
                    </div>

                    <div class="insights-grid">
                        <div
                            v-for="insight in prioritizedInsights"
                            :key="insight.title"
                            class="insight-card"
                            :class="insight.priority"
                            @click="openInsightModal(insight)"
                        >
                            <div class="insight-header">
                                <span class="insight-icon">{{ getInsightIcon(insight.type) }}</span>
                                <span class="insight-priority" :class="getPriorityColor(insight.priority)">
                  {{ insight.priority.toUpperCase() }}
                </span>
                            </div>

                            <h3>{{ insight.title }}</h3>
                            <p>{{ insight.description }}</p>

                            <div class="insight-footer">
                                <span class="insight-impact">{{ insight.impact }}</span>
                                <button class="insight-action">{{ insight.action }}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navegação de Visualizações -->
                <div class="view-navigation">
                    <div class="view-tabs">
                        <button
                            v-for="view in views"
                            :key="view.value"
                            class="view-tab"
                            :class="{ active: selectedView === view.value }"
                            @click="selectedView = view.value"
                        >
                            <span>{{ view.icon }}</span>
                            {{ view.label }}
                        </button>
                    </div>
                </div>

                <!-- Tabela de Performance -->
                <div class="performance-table">
                    <div class="table-header">
                        <h3>Performance por {{ views.find(v => v.value === selectedView)?.label }}</h3>
                        <div class="table-actions">
                            <button class="btn-secondary">
                                <span><i class="fa-solid fa-gear"></i></span>
                                Colunas
                            </button>
                            <button class="btn-secondary">
                                <span>📋</span>
                                Regras
                            </button>
                        </div>
                    </div>

                    <div class="table-container">
                        <!-- Tabela de Campanhas -->
                        <table v-if="selectedView === 'campaigns'">
                            <thead>
                            <tr>
                                <th>Status</th>
                                <th>Nome</th>
                                <th>Investimento</th>
                                <th>Receita</th>
                                <th>ROAS</th>
                                <th>CPA</th>
                                <th>Conversões</th>
                                <th>CTR</th>
                                <th>Tendência</th>
                                <th>Recomendação</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="campaign in currentData" :key="campaign.id" class="campaign-row">
                                <td>
                    <span class="status-badge" :class="getStatusColor(campaign.status)">
                      {{ campaign.status === 'active' ? 'Ativa' : campaign.status }}
                    </span>
                                </td>
                                <td>
                                    <div class="campaign-name">
                                        <span class="name">{{ campaign.name }}</span>
                                        <div v-if="campaign.issues.length > 0" class="issues">
                        <span v-for="issue in campaign.issues" :key="issue" class="issue-tag">
                          {{ issue === 'high_cpa' ? 'CPA Alto' :
                            issue === 'low_roas' ? 'ROAS Baixo' :
                                issue === 'low_ctr' ? 'CTR Baixo' : issue }}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="metric-cell">{{ formatCurrency(campaign.spend) }}</td>
                                <td class="metric-cell">{{ formatCurrency(campaign.revenue) }}</td>
                                <td class="metric-cell" :class="{ 'good': campaign.roas >= 3, 'warning': campaign.roas < 2.5 }">
                                    {{ campaign.roas.toFixed(2) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': campaign.cpa <= 80, 'warning': campaign.cpa > 120 }">
                                    {{ formatCurrency(campaign.cpa) }}
                                </td>
                                <td class="metric-cell">{{ campaign.conversions }}</td>
                                <td class="metric-cell" :class="{ 'good': campaign.ctr >= 2, 'warning': campaign.ctr < 1.5 }">
                                    {{ formatPercentage(campaign.ctr) }}
                                </td>
                                <td class="trend-cell">
                                    <span class="trend-indicator">{{ getTrendIcon(campaign.trend) }}</span>
                                </td>
                                <td>
                    <span class="recommendation-badge" :class="getRecommendationColor(campaign.recommendation)">
                      {{ campaign.recommendation === 'high' ? 'Escalar' :
                        campaign.recommendation === 'medium' ? 'Otimizar' : 'Revisar' }}
                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn" title="Editar">✏️</button>
                                        <button class="action-btn" title="Pausar">⏸️</button>
                                        <button class="action-btn" title="Duplicar">📋</button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- Tabela de Conjuntos -->
                        <table v-if="selectedView === 'adsets'">
                            <thead>
                            <tr>
                                <th>Status</th>
                                <th>Nome do Conjunto</th>
                                <th>Campanha</th>
                                <th>Segmentação</th>
                                <th>Investimento</th>
                                <th>ROAS</th>
                                <th>CPA</th>
                                <th>CTR</th>
                                <th>Frequência</th>
                                <th>Alcance</th>
                                <th>Recomendação</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="adset in currentData" :key="adset.id" class="campaign-row">
                                <td>
                    <span class="status-badge" :class="getStatusColor(adset.status)">
                      {{ adset.status === 'active' ? 'Ativo' : adset.status }}
                    </span>
                                </td>
                                <td>
                                    <div class="campaign-name">
                                        <span class="name">{{ adset.name }}</span>
                                        <div v-if="adset.issues.length > 0" class="issues">
                        <span v-for="issue in adset.issues" :key="issue" class="issue-tag">
                          {{ issue === 'high_frequency' ? 'Frequência Alta' :
                            issue === 'audience_fatigue' ? 'Fadiga de Público' : issue }}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="campaign-cell">{{ adset.campaign }}</td>
                                <td class="targeting-cell">
                                    <div class="targeting-info">
                                        <span class="targeting-main">{{ adset.targeting }}</span>
                                        <span class="targeting-details">{{ adset.age }} • {{ adset.gender }}</span>
                                    </div>
                                </td>
                                <td class="metric-cell">{{ formatCurrency(adset.spend) }}</td>
                                <td class="metric-cell" :class="{ 'good': adset.roas >= 3, 'warning': adset.roas < 2.5 }">
                                    {{ adset.roas.toFixed(2) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': adset.cpa <= 80, 'warning': adset.cpa > 120 }">
                                    {{ formatCurrency(adset.cpa) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': adset.ctr >= 2, 'warning': adset.ctr < 1.5 }">
                                    {{ formatPercentage(adset.ctr) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': adset.frequency <= 2, 'warning': adset.frequency > 3 }">
                                    {{ adset.frequency.toFixed(1) }}
                                </td>
                                <td class="metric-cell">{{ formatNumber(adset.reach) }}</td>
                                <td>
                    <span class="recommendation-badge" :class="getRecommendationColor(adset.recommendation)">
                      {{ adset.recommendation === 'high' ? 'Escalar' :
                        adset.recommendation === 'medium' ? 'Otimizar' : 'Revisar' }}
                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn" title="Editar">✏️</button>
                                        <button class="action-btn" title="Pausar">⏸️</button>
                                        <button class="action-btn" title="Duplicar">📋</button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- Tabela de Anúncios -->
                        <table v-if="selectedView === 'ads'">
                            <thead>
                            <tr>
                                <th>Status</th>
                                <th>Anúncio</th>
                                <th>Conjunto</th>
                                <th>Tipo</th>
                                <th>Hook</th>
                                <th>Investimento</th>
                                <th>ROAS</th>
                                <th>CTR</th>
                                <th>Frequência</th>
                                <th>Posicionamentos</th>
                                <th>Recomendação</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="ad in currentData" :key="ad.id" class="campaign-row">
                                <td>
                    <span class="status-badge" :class="getStatusColor(ad.status)">
                      {{ ad.status === 'active' ? 'Ativo' : ad.status === 'paused' ? 'Pausado' : ad.status }}
                    </span>
                                </td>
                                <td>
                                    <div class="campaign-name">
                                        <span class="name">{{ ad.name }}</span>
                                        <div v-if="ad.issues.length > 0" class="issues">
                        <span v-for="issue in ad.issues" :key="issue" class="issue-tag">
                          {{ issue === 'creative_fatigue' ? 'Fadiga de Creative' :
                            issue === 'low_performance' ? 'Performance Baixa' :
                                issue === 'high_frequency' ? 'Frequência Alta' : issue }}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="campaign-cell">{{ ad.adset }}</td>
                                <td class="creative-cell">
                                    <div class="creative-info">
                                        <span class="creative-icon">{{ getCreativeIcon(ad.creative_type) }}</span>
                                        <span class="creative-format">{{ ad.format }}</span>
                                    </div>
                                </td>
                                <td class="hook-cell">
                                    <div class="hook-info">
                                        <span class="hook-text">{{ ad.hook }}</span>
                                        <span class="cta-text">CTA: {{ ad.cta }}</span>
                                    </div>
                                </td>
                                <td class="metric-cell">{{ formatCurrency(ad.spend) }}</td>
                                <td class="metric-cell" :class="{ 'good': ad.roas >= 3, 'warning': ad.roas < 2.5 }">
                                    {{ ad.roas.toFixed(2) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': ad.ctr >= 2, 'warning': ad.ctr < 1.5 }">
                                    {{ formatPercentage(ad.ctr) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': ad.frequency <= 2, 'warning': ad.frequency > 3 }">
                                    {{ ad.frequency.toFixed(1) }}
                                </td>
                                <td class="placement-cell">{{ ad.placement }}</td>
                                <td>
                    <span class="recommendation-badge" :class="getRecommendationColor(ad.recommendation)">
                      {{ ad.recommendation === 'high' ? 'Escalar' :
                        ad.recommendation === 'medium' ? 'Otimizar' : 'Revisar' }}
                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn" title="Editar">✏️</button>
                                        <button class="action-btn" title="Pausar">⏸️</button>
                                        <button class="action-btn" title="Duplicar">📋</button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- Tabela de Públicos -->
                        <table v-if="selectedView === 'audiences'">
                            <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Nome do Público</th>
                                <th>Tamanho</th>
                                <th>Campanhas</th>
                                <th>Investimento Total</th>
                                <th>ROAS Médio</th>
                                <th>CTR Médio</th>
                                <th>Frequência</th>
                                <th>Score</th>
                                <th>Detalhes</th>
                                <th>Recomendação</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="audience in currentData" :key="audience.id" class="campaign-row">
                                <td class="audience-type-cell">
                                    <div class="audience-type">
                                        <span class="audience-icon">{{ getAudienceTypeIcon(audience.type) }}</span>
                                        <span class="type-label">
                        {{ audience.type === 'interest' ? 'Interesse' :
                                            audience.type === 'lookalike' ? 'Lookalike' : 'Personalizado' }}
                      </span>
                                    </div>
                                </td>
                                <td>
                                    <div class="campaign-name">
                                        <span class="name">{{ audience.name }}</span>
                                        <div v-if="audience.issues.length > 0" class="issues">
                        <span v-for="issue in audience.issues" :key="issue" class="issue-tag">
                          {{ issue === 'audience_fatigue' ? 'Fadiga de Público' :
                            issue === 'high_frequency' ? 'Frequência Alta' :
                                issue === 'frequency_rising' ? 'Frequência Subindo' : issue }}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="metric-cell">{{ formatAudienceSize(audience.size) }}</td>
                                <td class="metric-cell">{{ audience.campaigns_using }}</td>
                                <td class="metric-cell">{{ formatCurrency(audience.total_spend) }}</td>
                                <td class="metric-cell" :class="{ 'good': audience.avg_roas >= 3, 'warning': audience.avg_roas < 2.5 }">
                                    {{ audience.avg_roas.toFixed(2) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': audience.avg_ctr >= 2, 'warning': audience.avg_ctr < 1.5 }">
                                    {{ formatPercentage(audience.avg_ctr) }}
                                </td>
                                <td class="metric-cell" :class="{ 'good': audience.avg_frequency <= 2, 'warning': audience.avg_frequency > 3 }">
                                    {{ audience.avg_frequency.toFixed(1) }}
                                </td>
                                <td class="score-cell">
                                    <div class="performance-score">
                      <span class="score-value" :class="getPerformanceScoreColor(audience.performance_score)">
                        {{ audience.performance_score }}
                      </span>
                                        <div class="score-bar">
                                            <div
                                                class="score-fill"
                                                :class="getPerformanceScoreColor(audience.performance_score)"
                                                :style="{ width: `${audience.performance_score}%` }"
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="targeting-cell">
                                    <div class="targeting-details">
                                        <div v-if="audience.type === 'interest'">
                                            <strong>Interesses:</strong> {{ audience.targeting_details.interests.join(', ') }}
                                        </div>
                                        <div v-if="audience.type === 'lookalike'">
                                            <strong>Fonte:</strong> {{ audience.targeting_details.source }}
                                        </div>
                                        <div v-if="audience.type === 'custom'">
                                            <strong>Fonte:</strong> {{ audience.targeting_details.source }}
                                        </div>
                                        <div><strong>Idade:</strong> {{ audience.targeting_details.age }}</div>
                                    </div>
                                </td>
                                <td>
                    <span class="recommendation-badge" :class="getRecommendationColor(audience.recommendation)">
                      {{ audience.recommendation === 'high' ? 'Escalar' :
                        audience.recommendation === 'medium' ? 'Otimizar' : 'Revisar' }}
                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn" title="Editar">✏️</button>
                                        <button class="action-btn" title="Duplicar">📋</button>
                                        <button class="action-btn" title="Expandir">🔍</button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Insight -->
        <div v-if="showInsightModal && selectedInsight" class="modal">
            <div class="modal-content insight-modal">
                <div class="modal-header">
                    <div class="insight-modal-header">
                        <span class="insight-icon-large">{{ getInsightIcon(selectedInsight.type) }}</span>
                        <div>
                            <h3>{{ selectedInsight.title }}</h3>
                            <span class="insight-priority-badge" :class="getPriorityColor(selectedInsight.priority)">
                Prioridade {{ selectedInsight.priority.toUpperCase() }}
              </span>
                        </div>
                    </div>
                    <button @click="showInsightModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="insight-details">
                        <h4>Análise Detalhada</h4>
                        <p>{{ selectedInsight.description }}</p>

                        <div class="impact-section">
                            <h4>Impacto Estimado</h4>
                            <div class="impact-value">{{ selectedInsight.impact }}</div>
                        </div>

                        <div class="recommendation-section">
                            <h4>Recomendação</h4>
                            <p>{{ selectedInsight.action }}</p>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showInsightModal = false" class="btn-secondary">
                        Fechar
                    </button>
                    <button @click="applyRecommendation(selectedInsight)" class="btn-primary">
                        Aplicar Recomendação
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.performance-analysis {
    min-height: 100vh;
    background-color: var(--background-color);
}

.analysis-main {
    margin-left: 250px;
}

.analysis-content {
    padding: var(--spacing-lg);
    max-width: 1600px;
    margin: 0 auto;
}

/* Header */
.analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
}

.header-info h1 {
    margin: 0;
    font-size: 28px;
    color: var(--text-primary);
    background: linear-gradient(135deg, #1a1f2e 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 16px;
}

.header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
}

.timeframe-select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    background-color: var(--card-background);
    color: var(--text-primary);
    font-weight: 500;
}

/* Métricas Principais */
.main-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.metric-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    transition: all 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.metric-icon {
    font-size: 24px;
}

.metric-trend {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
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
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
}

.metric-label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
}

/* Insights */
.insights-section {
    margin-bottom: var(--spacing-xl);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.section-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
}

.insights-count {
    font-size: 14px;
    color: var(--text-secondary);
    background-color: var(--menu-hover);
    padding: 4px 12px;
    border-radius: 12px;
}

.insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-lg);
}

.insight-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.insight-card.high {
    border-left-color: #d9534f;
}

.insight-card.medium {
    border-left-color: #f0ad4e;
}

.insight-card.low {
    border-left-color: #5bc0de;
}

.insight-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.insight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.insight-icon {
    font-size: 20px;
}

.insight-priority {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.insight-priority.error {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.insight-priority.warning {
    background-color: rgba(240, 173, 78, 0.1);
    color: #f0ad4e;
}

.insight-priority.info {
    background-color: rgba(91, 192, 222, 0.1);
    color: #5bc0de;
}

.insight-card h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: 16px;
    color: var(--text-primary);
}

.insight-card p {
    margin: 0 0 var(--spacing-md);
    color: var(--text-secondary);
    line-height: 1.5;
    font-size: 14px;
}

.insight-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.insight-impact {
    font-size: 12px;
    font-weight: 600;
    color: #5cb85c;
}

.insight-action {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
}

/* Navegação de Views */
.view-navigation {
    margin-bottom: var(--spacing-lg);
}

.view-tabs {
    display: flex;
    gap: var(--spacing-sm);
    background-color: var(--card-background);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-lg);
}

.view-tab {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: none;
    border: none;
    border-radius: var(--border-radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.view-tab:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.view-tab.active {
    background-color: var(--primary-color);
    color: white;
}

/* Tabela de Performance */
.performance-table {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
}

.table-actions {
    display: flex;
    gap: var(--spacing-sm);
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1200px;
}

th, td {
    padding: var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

th {
    background-color: var(--menu-hover);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.campaign-row:hover {
    background-color: var(--menu-hover);
}

.campaign-name {
    max-width: 250px;
}

.campaign-name .name {
    font-weight: 500;
    color: var(--text-primary);
    display: block;
    margin-bottom: var(--spacing-xs);
}

.issues {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.issue-tag {
    font-size: 10px;
    padding: 2px 6px;
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
    border-radius: 8px;
    font-weight: 500;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.success {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.status-badge.warning {
    background-color: rgba(240, 173, 78, 0.1);
    color: #f0ad4e;
}

.status-badge.error {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.metric-cell {
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
}

.metric-cell.good {
    color: #5cb85c;
}

.metric-cell.warning {
    color: #f0ad4e;
}

.campaign-cell {
    max-width: 200px;
    font-size: 12px;
    color: var(--text-secondary);
}

.targeting-cell {
    max-width: 250px;
}

.targeting-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.targeting-main {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 13px;
}

.targeting-details {
    font-size: 11px;
    color: var(--text-secondary);
}

.creative-cell {
    min-width: 120px;
}

.creative-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.creative-icon {
    font-size: 16px;
}

.creative-format {
    font-size: 12px;
    color: var(--text-secondary);
}

.hook-cell {
    max-width: 200px;
}

.hook-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hook-text {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 13px;
}

.cta-text {
    font-size: 11px;
    color: var(--text-secondary);
}

.placement-cell {
    font-size: 12px;
    color: var(--text-secondary);
    max-width: 150px;
}

.audience-type-cell {
    min-width: 120px;
}

.audience-type {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.audience-icon {
    font-size: 16px;
}

.type-label {
    font-size: 12px;
    color: var(--text-secondary);
}

.score-cell {
    min-width: 100px;
}

.performance-score {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.score-value {
    font-weight: 600;
    font-size: 14px;
}

.score-value.success {
    color: #5cb85c;
}

.score-value.warning {
    color: #f0ad4e;
}

.score-value.error {
    color: #d9534f;
}

.score-bar {
    width: 60px;
    height: 4px;
    background-color: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.score-fill.success {
    background-color: #5cb85c;
}

.score-fill.warning {
    background-color: #f0ad4e;
}

.score-fill.error {
    background-color: #d9534f;
}

.trend-cell {
    text-align: center;
}

.trend-indicator {
    font-size: 18px;
}

.recommendation-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.recommendation-badge.success {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.recommendation-badge.warning {
    background-color: rgba(240, 173, 78, 0.1);
    color: #f0ad4e;
}

.recommendation-badge.error {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.action-buttons {
    display: flex;
    gap: var(--spacing-xs);
}

.action-btn {
    background: none;
    border: none;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background-color: var(--menu-hover);
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
}

.insight-modal {
    width: 90%;
    max-width: 600px;
}

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.insight-modal-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.insight-icon-large {
    font-size: 32px;
}

.insight-modal-header h3 {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
}

.insight-priority-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

.insight-details h4 {
    margin: 0 0 var(--spacing-sm);
    font-size: 16px;
    color: var(--text-primary);
}

.insight-details p {
    margin: 0 0 var(--spacing-lg);
    color: var(--text-secondary);
    line-height: 1.6;
}

.impact-section,
.recommendation-section {
    margin-bottom: var(--spacing-lg);
}

.impact-value {
    font-size: 18px;
    font-weight: 600;
    color: #5cb85c;
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
    border-radius: var(--border-radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

/* Responsive */
@media (max-width: 1200px) {
    .main-metrics {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .analysis-main {
        margin-left: 0;
    }

    .analysis-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-controls {
        width: 100%;
        justify-content: space-between;
    }

    .main-metrics {
        grid-template-columns: 1fr;
    }

    .insights-grid {
        grid-template-columns: 1fr;
    }

    .view-tabs {
        overflow-x: auto;
        padding-bottom: var(--spacing-sm);
    }

    .view-tab {
        white-space: nowrap;
    }

    .table-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
    }

    .table-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>