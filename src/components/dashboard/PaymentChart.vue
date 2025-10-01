<script lang="ts" setup>
import { ref, watch, h } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { CreditCard, FileText, Smartphone } from "lucide-vue-next";

ChartJS.register(ArcElement, Tooltip, Legend)

// Seus tipos de dados
interface PaymentMethod {
    name: string;
    value: number;
    percentage: number;
    color: string;
    code?: string;
    approval_rate?: number;
}

type ProductSummary = {
    name: string
    percentage: number
    sales: number
    id: number
}

const props = withDefaults(defineProps<{
    productSummary: ProductSummary[]
    paymentMethods: PaymentMethod[];
    totalSales: number;
}>(), {
    productSummary: () => [], // <-- Array vazio como padrão
    totalSales: 0
})
// --- Variáveis Reativas ---

const chartData = ref({
    labels: [] as string[],
    datasets: [{
        data: [] as number[],
        backgroundColor: [] as string[],
        borderWidth: 0
    }]
})

// Ref que vai armazenar os dados para as taxas de aprovação
const approvalRatesRef = ref<any[]>([]);

// --- Funções de Lógica ---

/**
 * Mapeia os dados brutos de paymentMethods para o formato usado no gráfico Doughnut.
 */
const updateChartData = () => {
    chartData.value = {
        labels: props.paymentMethods.map(method => method.name),
        datasets: [{
            data: props.paymentMethods.map(method => method.value),
            backgroundColor: props.paymentMethods.map(method => method.color),
            borderWidth: 0
        }]
    }
}

/**
 * Mapeia os dados brutos de paymentMethods para o formato usado nas taxas de aprovação.
 * OBS: Assume que PaymentMethod inclui 'code' e 'approval_rate'.
 */
const updateRateApproval = () => {
    const data = props.paymentMethods || [];

    // Mapeamento de ícones (lucide-react, por exemplo)
    const icons = {
        card: CreditCard,
        pix: '',
        boleto: FileText,
    };

    // Mapeamento de nomes legíveis
    const labels = {
        card: "Cartão",
        pix: "Pix",
        boleto: "Boleto",
    };

    approvalRatesRef.value = ["card", "pix", "boleto"].map((methodCode) => {
        const item = data.find(d => d.code === methodCode) || {} as Partial<PaymentMethod>;
        return {
            method: methodCode,
            name: labels[methodCode as keyof typeof labels],
            rate: item.approval_rate || 0,
            icon: icons[methodCode as keyof typeof icons],
        };
    });
};


/**
 * Retorna a classe CSS para o texto com base na taxa de aprovação.
 */
const getRateClass = (rate: number): string => {
    if (rate >= 50) return "text-green-500";
    if (rate >= 40) return "text-yellow-500";
    if (rate < 30) return "text-gray-500";
    return ""; // Se estiver entre 30 e 40
};

/**
 * Retorna classes de cores de fundo e borda para o card.
 */
const getCardColorClass = (rate: number): string => {
    if (rate >= 50) return "bg-green-500/10 border-green-500/30";
    if (rate >= 40) return "bg-yellow-500/10 border-yellow-500/30";
    if (rate < 30) return "bg-gray-500/10 border-gray-500/30";
    return "bg-[#1c223b75] border-gray-700/60";
};

// --- Efeitos e Observadores ---
watch(
    () => props.paymentMethods,
    () => {
        updateChartData();
        updateRateApproval();
    },
    { immediate: true, deep: true }
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
        },
    }
};

</script>

<template>
    <div class="payment-chart animate-fadeIn">
        <div class="mb-3 p-2">
            <h3 class="chart-title">Taxa de Aprovação</h3>

            <div class="grid grid-cols-3 gap-2">
                <div
                    v-for="item in approvalRatesRef"
                    :key="item.method"
                    class="relative"
                >
                    <div
                        class="relative z-10 p-2 rounded-md border backdrop-blur-sm transition-all duration-300"
                        :class="getCardColorClass(item.rate)"
                    >
                        <div class="flex flex-col items-center text-center space-y-1">
                            <div
                                class="flex items-center justify-center w-6 h-6"
                                :class="getRateClass(item.rate)"
                            >
                                <i class="fa-brands fa-pix" v-if="item.method=='pix'"></i>
                                <component :is="item.icon" v-else class="w-4 h-4" />
                            </div>

                            <div
                                class="text-lg font-bold leading-none"
                                :class="getRateClass(item.rate)"
                            >
                                {{ item.rate }}%
                            </div>

                            <div class="text-[10px] font-medium" :class="getRateClass(item.rate)">
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-4" style="height: calc(57% - 150px); min-height: 150px;">
            <h3 class="chart-title">Vendas por Pagamento</h3>
            <div class="chart-content">
                <div class="chart-wrapper">
                    <Doughnut
                        :data="chartData"
                        :options="chartOptions"
                        class="chart"
                    />
                    <div class="chart-center">
                        <div class="center-label">Total</div>
                        <div class="center-value">{{ totalSales }}</div>
                    </div>
                </div>

                <div class="chart-legend">
                    <div
                        v-for="method in paymentMethods"
                        :key="method.name"
                        class="legend-item"
                    >
                        <div :style="{ backgroundColor: method.color }" class="legend-color"></div>
                        <div class="legend-label">{{ method.name }}</div>
                        <div class="legend-percentage">{{ method.percentage.toFixed(1) }}%</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-4 product-sales-card">
            <div class="card-header">
                <h3 class="chart-title mb-1">Vendas por Produto</h3>
                <div class="info-icon" title="Produtos mais vendidos e sua participação no total de vendas">ⓘ</div>
            </div>

            <div class="product-sales-list">
                <div
                    v-for="(product, index) in productSummary"
                    :key="product.id"
                    class="product-sales-item"
                >
                    <div class="product-name">{{ product.name }} ({{ product.sales }})</div>
                    <div class="product-metrics">
                        <div class="sales-bar-container">
                            <div
                                class="sales-bar"
                                :style="{ width: `${product.percentage}%` }"
                            ></div>
                        </div>
                        <div class="sales-percentage">{{ product.percentage.toFixed(1) }}%</div>
                    </div>
                </div>
                <div v-if="productSummary.length === 0" class="no-products">
                    Nenhum produto encontrado.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.payment-chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.card {
    background-color: #1c223b75;
    border-radius: 12px;
    border: 1px solid #2d3748;
    padding: 16px;
    backdrop-filter: blur(5px);
}

.chart-title {
    font-size: 16px;
    color: #a0aec0;
    margin-bottom: 16px;
    font-weight: 500;
}

.chart-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.chart-wrapper {
    position: relative;
    width: 130px;
    height: 130px;
}

.chart-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.center-label {
    font-size: 12px;
    color: #a0aec0;
}

.center-value {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.chart-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.legend-label {
    font-size: 14px;
    color: #a0aec0;
    flex-grow: 1;
}

.legend-percentage {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
}
.product-sales-card {
    max-height: 240px;
    overflow-y: auto;
}
/* Lista de Produtos */
.product-sales-card .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.product-sales-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.product-name {
    font-size: 14px;
    color: #a0aec0;
}

.product-metrics {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sales-bar-container {
    flex-grow: 1;
    height: 8px;
    background-color: #1c223b75;
    border-radius: 4px;
    overflow: hidden;
}

.sales-bar {
    height: 100%;
    background-color: #667eea;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.sales-percentage {
    min-width: 50px;
    text-align: right;
    font-size: 14px;
    color: #a0aec0;
}

.no-products {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 16px;
}

/* Responsividade */
@media (max-width: 768px) {
    .chart-content {
        flex-direction: column;
    }

    .chart-wrapper {
        width: 100px;
        height: 100px;
    }
}
</style>