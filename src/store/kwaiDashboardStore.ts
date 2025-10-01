import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/apiClient'

export interface KwaiMetrics {
    approvedSales: number
    sales: number
    qtdSales: number
    revenue: number
    avgOrderValue: number
    viewsCount: number
    likesCount: number
    commentsCount: number
    sharesCount: number
    viewRate: number
    conversionRate: number
    cartAbandonmentRate: number
    ctr: number
}

export interface KwaiProduct {
    id: number
    name: string
    sku: string
    image: string
    views: number
    cartAdds: number
    sales: number
    revenue: number
    conversionRate: number
}

export interface KwaiInsight {
    id: number
    type: 'opportunity' | 'warning' | 'insight'
    icon: string
    title: string
    description: string
    action: string
}

export interface KwaiChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        color: string
    }[]
}

export const useKwaiStore = defineStore('kwai', () => {
    // State
    const metrics = ref<KwaiMetrics>({
        approvedSales: 0,
        sales: 0,
        qtdSales: 0,
        revenue: 0,

        avgOrderValue: 99.88,
        viewsCount: 15700,
        likesCount: 3200,
        commentsCount: 1800,
        sharesCount: 2400,
        viewRate: 78,
        conversionRate: 15.3,
        cartAbandonmentRate: 38.5,
        ctr: 65
    })

    const mainMetrics = ref([
        {
            id: 'approvedSales',
            icon: '💰',
            label: 'Vendas Aprovadas',
            value: 0,
            isCurrency: true,
        },
        {
            id: 'totalSales',
            icon: '✅',
            label: 'Total em Vendas',
            value: 0,
            isCurrency: true,
        },
        {
            id: 'qtdSales',
            icon: '🛒',
            label: 'Quant. Vendas',
            value: 0,
            isCurrency: false,
        },
        {
            id: 'revenue',
            icon: '💵',
            label: 'Receita Total',
            value: 0,
            isCurrency: true,
        }
    ])

    const products = ref<KwaiProduct[]>([
        {
            id: 1,
            name: 'Camiseta Estampada Kwai',
            sku: 'KW-TS-001',
            image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=50',
            views: 5240,
            cartAdds: 1250,
            sales: 820,
            revenue: 32800,
            conversionRate: 15.6
        },
        {
            id: 2,
            name: 'Boné Kwai Edição Limitada',
            sku: 'KW-CP-002',
            image: 'https://images.pexels.com/photos/844867/pexels-photo-844867.jpeg?auto=compress&cs=tinysrgb&w=50',
            views: 4120,
            cartAdds: 980,
            sales: 645,
            revenue: 19350,
            conversionRate: 15.7
        },
        {
            id: 3,
            name: 'Moletom Kwai Creator',
            sku: 'KW-HD-003',
            image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=50',
            views: 3560,
            cartAdds: 1120,
            sales: 520,
            revenue: 41600,
            conversionRate: 14.6
        }
    ])

    const insights = ref<KwaiInsight[]>([
        {
            id: 1,
            type: 'opportunity',
            icon: '💡',
            title: 'Oportunidade de Crescimento',
            description: 'O produto "Moletom Kwai Creator" tem alta taxa de conversão. Considere aumentar o orçamento de anúncios para este produto.',
            action: 'Aumentar Orçamento'
        },
        {
            id: 2,
            type: 'warning',
            icon: '⚠️',
            title: 'Alto Abandono de Carrinho',
            description: 'A taxa de abandono de carrinho está 38.5%, acima da média do setor. Considere implementar lembretes por e-mail.',
            action: 'Configurar Lembretes'
        },
        {
            id: 3,
            type: 'insight',
            icon: '📊',
            title: 'Pico de Tráfego Identificado',
            description: 'Detectamos um pico de tráfego às 19h. Programe seus posts para este horário para maximizar o alcance.',
            action: 'Ver Análise Detalhada'
        }
    ])

    // Dados do gráfico para diferentes períodos
    const chartDataByPeriod = {
        today: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [
                {
                    label: 'Vendas',
                    data: [5, 12, 18, 22, 28, 35, 42, 38],
                    color: '#5cb85c'
                },
                {
                    label: 'Vendas pendentes ',
                    data: [15, 32, 48, 55, 68, 85, 95, 82],
                    color: '#f0ad4e'
                }
            ]
        },
        yesterday: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [
                {
                    label: 'Vendas',
                    data: [4, 10, 16, 20, 26, 32, 38, 34],
                    color: '#5cb85c'
                },
                {
                    label: 'Vendas pendentes',
                    data: [12, 28, 42, 50, 62, 78, 88, 76],
                    color: '#f0ad4e'
                }
            ]
        },
        last7days: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [
                {
                    label: 'Vendas',
                    data: [120, 190, 150, 220, 280, 210, 180],
                    color: '#5cb85c'
                },
                {
                    label: 'Vendas pendentes',
                    data: [320, 390, 350, 420, 480, 410, 380],
                    color: '#f0ad4e'
                }
            ]
        },
        last30days: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
            datasets: [
                {
                    label: 'Vendas',
                    data: [850, 920, 1050, 1180, 1240],
                    color: '#5cb85c'
                },
                {
                    label: 'Vendas pendentes',
                    data: [1700, 1840, 2100, 2360, 2480],
                    color: '#f0ad4e'
                }
            ]
        },
        thisMonth: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
                {
                    label: 'Vendas',
                    data: [780, 850, 920, 1050],
                    color: '#5cb85c'
                },
                {
                    label: 'Vendas pendentes',
                    data: [1560, 1700, 1840, 2100],
                    color: '#f0ad4e'
                }
            ]
        }
    }

    const chartData = ref<KwaiChartData>({
        labels: [],
        datasets: []
    })

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const topProducts = computed(() => {
        return [...products.value]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3)
    })

    const totalRevenue = computed(() => {
        return products.value.reduce((sum, product) => sum + product.revenue, 0)
    })

    const totalSales = computed(() => {
        return products.value.reduce((sum, product) => sum + product.sales, 0)
    })

    // Actions
    const fetchKwaiMetrics = async (period: string = 'last7days') => {
        isLoading.value = true
        error.value = null

        try {
            isLoading.value = true
            const response = await api.get('/kwai-dashboard/metrics');
            const item = response.data || []

            mainMetrics.value = [
                {
                    id: 'approvedSales',
                    icon: '💰',
                    label: 'Vendas Aprovadas',
                    value: item.totalVendasPago,
                    isCurrency: true,
                },
                {
                    id: 'totalSales',
                    icon: '✅',
                    label: 'Total em Vendas',
                    value: item.totalEmVendas,
                    isCurrency: true,
                },
                {
                    id: 'roas',
                    icon: '🛒',
                    label: 'Quant. Vendas',
                    value: item.quantidadeVendas,
                    isCurrency: false,
                },
                {
                    id: 'revenue',
                    icon: '💵',
                    label: 'Receita Total',
                    value: item.faturamentoLiquido,
                    isCurrency: true,
                }
            ]

        } catch (e) {
            console.error('Erro ao carregar dashboards:', e)
        } finally {
            isLoading.value = false
        }
    }

    const fetchKwaiProducts = async (period: string = 'last7days') => {
        isLoading.value = true
        error.value = null

        try {
            // Simulação de chamada API
            await new Promise(resolve => setTimeout(resolve, 600))

            // Ajustar produtos com base no período
            const multiplier = period === 'today' ? 0.15 :
                period === 'yesterday' ? 0.14 :
                    period === 'last30days' ? 4.2 :
                        period === 'thisMonth' ? 3.8 : 1

            products.value = products.value.map(product => ({
                ...product,
                views: Math.round(product.views * multiplier),
                cartAdds: Math.round(product.cartAdds * multiplier),
                sales: Math.round(product.sales * multiplier),
                revenue: Math.round(product.revenue * multiplier),
                // Manter a taxa de conversão aproximadamente a mesma
                conversionRate: product.conversionRate + (Math.random() * 2 - 1)
            }))

        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao carregar produtos do Kwai'
            console.error('Error fetching Kwai products:', err)
        } finally {
            isLoading.value = false
        }
    }

    const fetchKwaiInsights = async () => {
        isLoading.value = true
        error.value = null

        try {
            // Simulação de chamada API
            await new Promise(resolve => setTimeout(resolve, 500))

            // Insights não mudam com o período

        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao carregar insights do Kwai'
            console.error('Error fetching Kwai insights:', err)
        } finally {
            isLoading.value = false
        }
    }

    const fetchKwaiChartData = async (period = 'last7days', metrics = ['sales', 'pendingSales']) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.get('/kwai-dashboard/chart-data')

            const allChartData = response.data.data.chartDataByPeriod

            if (allChartData && allChartData[period]) {
                // Filtrar os datasets conforme métricas selecionadas
                const rawData = allChartData[period]
                chartData.value = {
                    labels: rawData.labels,
                    datasets: rawData.datasets.filter((d: any) =>
                        metrics.includes(
                            d.label.toLowerCase().includes('pendente') ? 'pendingSales' : 'sales'
                        )
                    )
                }
            } else {
                // Fallback para last7days
                const fallback = allChartData?.last7days
                if (fallback) {
                    chartData.value = {
                        labels: fallback.labels,
                        datasets: fallback.datasets.filter((d: any) =>
                            metrics.includes(
                                d.label.toLowerCase().includes('pendente') ? 'pendingSales' : 'sales'
                            )
                        )
                    }
                } else {
                    throw new Error('Dados de período inválidos ou indisponíveis')
                }
            }
        } catch (err: any) {
            error.value = err?.response?.data?.message || 'Erro ao carregar dados do gráfico do Kwai'
            console.error('Error fetching Kwai chart data:', err)
        } finally {
            isLoading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    // Initialize store
    const initialize = async (period: string = 'last7days') => {
        isLoading.value = true

        try {
            await Promise.all([
                fetchKwaiMetrics(period),
                // fetchKwaiProducts(period),
                fetchKwaiInsights(),
                fetchKwaiChartData(period)
            ])
        } catch (err) {
            console.error('Error initializing Kwai store:', err)
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        metrics,
        products,
        insights,
        chartData,
        isLoading,
        error,

        // Computed
        mainMetrics,
        topProducts,
        totalRevenue,
        totalSales,

        // Actions
        fetchKwaiMetrics,
        fetchKwaiProducts,
        fetchKwaiInsights,
        fetchKwaiChartData,
        clearError,
        initialize
    }
})