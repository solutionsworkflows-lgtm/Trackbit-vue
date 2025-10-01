import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters'
import api from "../services/apiClient.ts";
import {useDashboardFilters} from "../composables/dashboard/filters.ts";

interface DashboardCard {
  id: string
  title: string
  value: string | number
  info?: string
  color?: string
  isPercentage?: boolean
  isCurrency?: boolean
  visible: boolean
  order: number
}

interface DashboardConfig {
  cards: {
    [key: string]: {
      visible: boolean
      order: number,
      theme?: 'light' | 'dark'
    }
  }
  layout: {
    chartPosition: 'top' | 'bottom' | 'right' | 'left'
    columns: number
  }
}

const DEFAULT_CONFIG: DashboardConfig = {
  cards: {},
  layout: {
    chartPosition: 'left',
    columns: 3,
    theme: 'dark' // valor padrão
  }
}

export const useDashboardStore = defineStore('dashboard', () => {
  // Raw data
  const metrics = ref({})
  const productSumary = ref<any[]>([])
  const loading = ref(false)
  const loadingProductSumary = ref(false)

  // Formatted values for display
  const salesByPayment =  computed(() => metrics.value.sales_by_payment  || [])
  const totalSales =  computed(() => metrics.value.sales_by_payment?.totalSales  || 0)
  const paymentMethods =  computed(() => metrics.value.sales_by_payment?.data  || [])
  const formattedRevenue = computed(() => metrics.value.total_revenue  || '0,00')
  const formattedAdSpend = computed(() => metrics.value.total_spend || '0,00')
  const formattedRoas = computed(() => metrics.value.roas || '0,00')
  const formattedProfit = computed(() => metrics.value.profit || '0,00')
  const formattedPendingSales = computed(() => metrics.value.pending_sales || 0)
  const formattedRoi = computed(() => metrics.value.roi || '0,00')
  const formattedProfitMargin = computed(() => metrics.value.profit_margin || '0,00')
  const formattedRefundedSales = computed(() => metrics.value.refunded_sales || '0,00')
  const formattedRefundRate = computed(() => metrics.value.refund_rate || '0,00')
  const formattedArpu = computed(() => metrics.value.arpu || '0,00')
  const formattedTax = computed(() => metrics.value.tax || '0,00')
  const formattedFee = computed(() => metrics.value.fees || '0,00')
  const formattedChargeback = computed(() => metrics.value.chargeback || '0,00')

  const updateTheme = (theme: 'light' | 'dark') => {
    config.value.layout.theme = theme
    saveConfig()
  }
  const currentTheme = computed(() => config.value.layout.theme || 'light')

  // Dashboard configuration
  const config = ref<DashboardConfig>({ ...DEFAULT_CONFIG })

  // Dashboard cards configuration
  const dashboardCards = ref<DashboardCard[]>([
    {
      id: 'revenue',
      title: 'Faturamento Líquido',
      value: formattedRevenue.value,
      info: 'Valor total de vendas, excluindo reembolsos e cancelamentos.',
      isCurrency: true,
      visible: true,
      order: 0
    },
    {
      id: 'adSpend',
      title: 'Gastos com anúncios',
      value: formattedAdSpend.value,
      info: 'Total gasto em anúncios no Facebook e Instagram.',
      isCurrency: true,
      visible: true,
      order: 1
    },
    {
      id: 'roas',
      title: 'ROAS',
      value: formattedRoas.value,
      info: 'Return on Ad Spend. Faturamento dividido pelo gasto em anúncios.',
      customClass: true,
      visible: true,
      order: 2
    },
    {
      id: 'profit',
      title: 'Lucro',
      value: formattedProfit.value,
      info: 'Faturamento menos custos com anúncios e impostos.',
      customClass: true,
      isCurrency: true,
      visible: true,
      order: 3
    },
    {
      id: 'pendingSales',
      title: 'Vendas Pendentes',
      value: formattedPendingSales.value,
      info: 'Vendas que foram realizadas mas ainda não foram finalizadas.',
      isCurrency: true,
      visible: true,
      order: 4
    },
    {
      id: 'roi',
      title: 'ROI',
      value: formattedRoi.value,
      info: 'Return on Investment. Lucro dividido pelo gasto em anúncios, em porcentagem.',
      customClass: true,
      isPercentage: true,
      visible: true,
      order: 5
    },
    {
      id: 'profitMargin',
      title: 'Margem de Lucro',
      value: formattedProfitMargin.value,
      info: 'Lucro dividido pelo faturamento, em porcentagem.',
      customClass: true,
      isPercentage: true,
      visible: true,
      order: 6
    },
    {
      id: 'refundedSales',
      title: 'Vendas Reembolsadas',
      value: formattedRefundedSales.value,
      info: 'Valor total de vendas que foram reembolsadas.',
      isCurrency: true,
      visible: true,
      order: 7
    },
    {
      id: 'refundRate',
      title: 'Reembolso',
      value: formattedRefundRate.value,
      info: 'Porcentagem de vendas que foram reembolsadas.',
      isPercentage: true,
      visible: true,
      order: 8
    },
    {
      id: 'arpu',
      title: 'ARPU',
      value: formattedArpu.value,
      info: 'Average Revenue Per User. Faturamento dividido pelo número de clientes.',
      isCurrency: true,
      visible: true,
      order: 9
    },
    {
      id: 'fees',
      title: 'Taxas',
      value: formattedFee.value,
      info: 'Total de impostos pagos sobre as vendas.',
      isCurrency: true,
      visible: true,
      order: 10
    },
    {
      id: 'chargeback',
      title: 'Chargeback',
      value: formattedChargeback.value,
      info: 'Porcentagem de vendas que tiveram chargeback (contestação do pagamento pelo cliente).',
      isPercentage: true,
      visible: true,
      order: 11
    }
  ])

  // Load saved configuration from localStorage
  const loadSavedConfig = () => {
    try {
      const savedConfig = localStorage.getItem('dashboardConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig) as DashboardConfig
        config.value = {
          ...DEFAULT_CONFIG,
          ...parsedConfig
        }
        // Apply saved card configuration
        dashboardCards.value = dashboardCards.value.map(card => ({
          ...card,
          visible: config.value.cards[card.id]?.visible ?? card.visible,
          order: config.value.cards[card.id]?.order ?? card.order
        })).filter(card => card.visible)
            .sort((a, b) => a.order - b.order)
      }
    } catch (error) {
      console.error('Error loading dashboard configuration:', error)
      config.value = { ...DEFAULT_CONFIG }
    }
  }

  // Save configuration to localStorage
  const saveConfig = () => {
    try {
      // Update cards configuration
      config.value.cards = dashboardCards.value.reduce((acc, card) => ({
        ...acc,
        [card.id]: {
          visible: card.visible,
          order: card.order
        }
      }), {})

      localStorage.setItem('dashboardConfig', JSON.stringify(config.value))
    } catch (error) {
      console.error('Error saving dashboard configuration:', error)
    }
  }

  // Toggle card visibility
  const toggleCardVisibility = (cardId: string) => {
    const card = dashboardCards.value.find(c => c.id === cardId)
    if (card) {
      card.visible = !card.visible
      saveConfig()
    }
  }

  // Update cards order
  const updateCardsOrder = (newOrder: DashboardCard[]) => {
    try{
      const el = newOrder.moved?.element;
      dashboardCards.value = dashboardCards.value.map(card => {
        if (card.id == el?.id) {
            console.log('newcard' , card.id);
            card.order = newOrder.moved.newIndex;
            return card
        }
        if (card.order == newOrder.moved.newIndex) {
            console.log('oldcard' , card.id);
            card.order = newOrder.moved.oldIndex;
        }
        return card

      });
    } catch (error) {
        console.error('Error saving dashboard configuration:', error)
      }
    // Salvar as novas configurações
    saveConfig();
  };


  // Update layout configuration
  const updateLayout = (layout: Partial<DashboardConfig['layout']>) => {
    config.value.layout = {
      ...config.value.layout,
      ...layout
    }
    saveConfig()
  }

  // Get visible cards in correct order
  const visibleCards = computed(() => {
    return [...dashboardCards.value]
        .filter(card => card.visible)
        .sort((a, b) => a.order - b.order)
  })

  const fetchMetrics = async () => {
    if (metrics.value.length > 0) return; // Já carregado, não faz de novo

    loading.value = true
    try {
      const response = await api.get('/dashboard/metrics', {
        params: filters.value
      })

      metrics.value = response.data
      dashboardCards.value = dashboardCards.value.map(card => {
        if (card.id === 'revenue') card.value = response.data.total_revenue
        if (card.id === 'adSpend') card.value = response.data.total_spend || 0
        if (card.id === 'roas') card.value = response.data.roas || 0
        if (card.id === 'profit') card.value = response.data.profit || 0
        if (card.id === 'pendingSales') card.value = response.data.pending_sales || 0
        if (card.id === 'roi') card.value = response.data.roi || 0
        if (card.id === 'profitMargin') card.value = response.data.profit_margin || 0
        if (card.id === 'refundedSales') card.value = response.data.refunded_sales || 0
        if (card.id === 'refundRate') card.value = response.data.refund_rate || 0
        if (card.id === 'arpu') card.value = response.data.arpu || 0
        if (card.id === 'tax') card.value = response.data.tax || 0
        if (card.id === 'fees') card.value = response.data.fees || 0
        if (card.id === 'chargeback') card.value = metrics.value.chargeback || 0

        // Se o valor for menor que 0, muda a cor para vermelho
        if (Number(card.value) < 0) {
          card.color = 'red'
        }

        return card
      })

    } catch (err: any) {
      console.log(err.message || 'Erro ao buscar métricas.')
    } finally {
      loading.value = false
    }
  }

  const fetchProductSummary = async () => {

    loadingProductSumary.value = true
    try {
      const response = await api.get('/dashboard/products-summary', {
        params: filters.value
      })
      productSumary.value = response.data
    } catch (err: any) {
      console.log(err.message || 'Erro ao buscar métricas.')
    } finally {
      loadingProductSumary.value = false
    }
  }

  const { filters } = useDashboardFilters()

  const fetchData = async () => {
    // Dispara todas as chamadas de API necessárias em paralelo ou sequencialmente
    await Promise.all([
      fetchProductSummary(),
      fetchMetrics(),
    ]);
  };

// um único watch
  watch(
      filters,
      fetchData,
      { immediate: true, deep: true }
  );
  //watch(() => config.value, saveConfig, { deep: true })

  // Initialize
  loadSavedConfig()

  return {
    loading,
    loadingProductSumary,
    fetchMetrics,
    fetchProductSummary,
    // Raw data
    metrics,
    productSumary,

    updateTheme,
    currentTheme,

    salesByPayment,
    formattedRevenue,
    formattedAdSpend,
    formattedRoas,
    formattedProfit,
    formattedPendingSales,
    formattedRoi,
    formattedProfitMargin,
    formattedRefundedSales,
    formattedRefundRate,
    formattedArpu,
    formattedTax,
    formattedChargeback,
    paymentMethods,
    totalSales,
    // Payment methods

    // Dashboard configuration
    config,
    dashboardCards,
    visibleCards,
    toggleCardVisibility,
    updateCardsOrder,
    updateLayout
  }
})