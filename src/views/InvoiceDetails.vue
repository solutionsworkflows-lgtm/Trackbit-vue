<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

interface InvoiceItem {
    description: string
    quantity: number
    unitPrice: number
    total: number
}

const currentPlan = ref({
    name: 'Professional',
    price: 97.00,
    limits: {
        sales: 100,
        webhooks: 3,
        adAccounts: 3,
        dashboards: 'Ilimitado',
        pixels: 3
    }
})

const usage = ref({
    sales: {
        used: 157,
        included: 100,
        extraPrice: 0.97 // Price per additional sale
    }
})

const invoiceItems = computed<InvoiceItem[]>(() => {
    const items: InvoiceItem[] = [
        {
            description: `Plano ${currentPlan.value.name}`,
            quantity: 1,
            unitPrice: currentPlan.value.price,
            total: currentPlan.value.price
        }
    ]

    // Add extra sales charges
    if (usage.value.sales.used > usage.value.sales.included) {
        const extraSales = usage.value.sales.used - usage.value.sales.included
        items.push({
            description: 'Vendas adicionais',
            quantity: extraSales,
            unitPrice: usage.value.sales.extraPrice,
            total: extraSales * usage.value.sales.extraPrice
        })
    }

    return items
})

const totalAmount = computed(() => {
    return invoiceItems.value.reduce((sum, item) => sum + item.total, 0)
})

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value)
}

const calculateProgress = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
}

const dueDate = ref('10/05/2025')
const invoiceNumber = ref('2025050001')
const paymentStatus = ref('pending') // pending, paid, overdue
</script>

<template>
    <div class="invoice-details">

        <div class="invoice-main">

            <div class="invoice-content">
                <div class="invoice-header">
                    <div class="header-left">
                        <h1>Fatura</h1>
                        <div class="invoice-meta">
                            <span class="invoice-number">Nº {{ invoiceNumber }}</span>
                            <span class="invoice-period">01/05/2025 - 31/05/2025</span>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="payment-status" :class="paymentStatus">
                            {{ paymentStatus === 'pending' ? 'Pendente' :
                            paymentStatus === 'paid' ? 'Pago' : 'Atrasado' }}
                        </div>
                        <div class="due-date">
                            Vencimento: {{ dueDate }}
                        </div>
                    </div>
                </div>

                <div class="invoice-grid">
                    <!-- Current Plan -->
                    <div class="invoice-card plan-card">
                        <div class="card-header">
                            <h2>Seu Plano</h2>
                            <button class="btn-outline">Alterar plano</button>
                        </div>

                        <div class="plan-details">
                            <div class="plan-name">{{ currentPlan.name }}</div>
                            <div class="plan-price">{{ formatCurrency(currentPlan.price) }}<span>/mês</span></div>

                            <div class="plan-limits">
                                <div class="limit-item primary">
                                    <div class="limit-header">
                                        <span>Vendas Incluídas</span>
                                        <span class="limit-count">{{ formatNumber(usage.sales.used) }}/{{ formatNumber(usage.sales.included) }}</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div
                                            class="progress"
                                            :style="{ width: `${calculateProgress(usage.sales.used, usage.sales.included)}%` }"
                                            :class="{ exceeded: usage.sales.used > usage.sales.included }"
                                        ></div>
                                    </div>
                                    <div v-if="usage.sales.used > usage.sales.included" class="limit-extra">
                                        {{ formatNumber(usage.sales.used - usage.sales.included) }} vendas excedentes
                                    </div>
                                </div>

                                <div class="other-limits">
                                    <div class="limit-row">
                                        <span>Webhooks</span>
                                        <span>{{ currentPlan.limits.webhooks }}</span>
                                    </div>
                                    <div class="limit-row">
                                        <span>Contas de Anúncio</span>
                                        <span>{{ currentPlan.limits.adAccounts }}</span>
                                    </div>
                                    <div class="limit-row">
                                        <span>Pixels</span>
                                        <span>{{ currentPlan.limits.pixels }}</span>
                                    </div>
                                    <div class="limit-row">
                                        <span>Dashboards</span>
                                        <span>{{ currentPlan.limits.dashboards }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Invoice Summary -->
                    <div class="invoice-card summary-card">
                        <h2>Resumo da Fatura</h2>

                        <div class="invoice-items">
                            <div v-for="item in invoiceItems" :key="item.description" class="invoice-item">
                                <div class="item-info">
                                    <div class="item-description">{{ item.description }}</div>
                                    <div class="item-details">
                                        {{ item.quantity }}x {{ formatCurrency(item.unitPrice) }}
                                    </div>
                                </div>
                                <div class="item-total">{{ formatCurrency(item.total) }}</div>
                            </div>
                        </div>

                        <div class="invoice-summary">
                            <div class="summary-row subtotal">
                                <span>Subtotal</span>
                                <span>{{ formatCurrency(totalAmount) }}</span>
                            </div>
                            <div class="summary-row">
                                <span>Impostos</span>
                                <span>{{ formatCurrency(totalAmount * 0.0565) }}</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span>{{ formatCurrency(totalAmount * 1.0565) }}</span>
                            </div>
                        </div>

                        <div class="payment-actions">
                            <button class="btn-primary">Pagar Agora</button>
                            <button class="btn-secondary">Gerar Boleto</button>
                        </div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div class="invoice-footer">
                    <div class="info-card">
                        <div class="info-icon">ℹ️</div>
                        <div class="info-content">
                            <h3>Sobre as cobranças adicionais</h3>
                            <p>As cobranças adicionais são calculadas apenas para vendas que excedem o limite do seu plano.
                                Cada venda adicional é cobrada individualmente conforme a tabela de preços do seu plano.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.invoice-details {
    min-height: 100vh;
    background-color: var(--background-color);
}

.invoice-main {
    margin-left: 250px;
}

.invoice-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
}

.header-left h1 {
    margin: 0;
    font-size: 28px;
    color: var(--text-primary);
}

.invoice-meta {
    margin-top: var(--spacing-xs);
    display: flex;
    gap: var(--spacing-md);
    color: var(--text-secondary);
    font-size: 14px;
}

.header-right {
    text-align: right;
}

.payment-status {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
}

.payment-status.pending {
    background-color: #FFF3CD;
    color: #856404;
}

.payment-status.paid {
    background-color: #D4EDDA;
    color: #155724;
}

.payment-status.overdue {
    background-color: #F8D7DA;
    color: #721C24;
}

.due-date {
    color: var(--text-secondary);
    font-size: 14px;
}

.invoice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.invoice-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.card-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
}

.plan-details {
    text-align: center;
}

.plan-name {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
}

.plan-price {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xl);
}

.plan-price span {
    font-size: 16px;
    font-weight: 400;
    color: var(--text-secondary);
}

.plan-limits {
    text-align: left;
}

.limit-item.primary {
    background-color: var(--menu-hover);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
}

.limit-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    font-weight: 500;
}

.limit-count {
    color: var(--text-secondary);
}

.progress-bar {
    height: 8px;
    background-color: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
}

.progress.exceeded {
    background-color: #dc3545;
}

.limit-extra {
    margin-top: var(--spacing-xs);
    color: #dc3545;
    font-size: 14px;
    font-weight: 500;
}

.other-limits {
    display: grid;
    gap: var(--spacing-sm);
}

.limit-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: 14px;
}

.limit-row:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
}

.invoice-items {
    margin-bottom: var(--spacing-xl);
}

.invoice-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--border-color);
}

.item-info {
    flex-grow: 1;
}

.item-description {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
}

.item-details {
    color: var(--text-secondary);
    font-size: 14px;
}

.item-total {
    color: var(--text-primary);
    font-weight: 500;
}

.invoice-summary {
    padding: var(--spacing-lg);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    color: var(--text-secondary);
}

.summary-row.subtotal {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.summary-row.total {
    color: var(--text-primary);
    font-weight: 600;
    font-size: 18px;
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.payment-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.btn-primary,
.btn-secondary,
.btn-outline {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.btn-secondary {
    background-color: var(--menu-hover);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--border-color);
}

.btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}

.btn-outline:hover {
    background-color: var(--primary-color);
    color: white;
}

.invoice-footer {
    margin-top: var(--spacing-xl);
}

.info-card {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    border-left: 4px solid var(--primary-color);
}

.info-icon {
    font-size: 24px;
}

.info-content h3 {
    margin: 0 0 var(--spacing-xs);
    font-size: 16px;
    color: var(--text-primary);
}

.info-content p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .invoice-main {
        margin-left: 0;
    }

    .invoice-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-right {
        text-align: left;
    }

    .invoice-grid {
        grid-template-columns: 1fr;
    }

    .payment-actions {
        grid-template-columns: 1fr;
    }
}
</style>