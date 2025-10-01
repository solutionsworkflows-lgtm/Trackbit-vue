<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSubscriptionStore } from '@/store/subscription/subscriptionStore'
const subscriptionStore = useSubscriptionStore()
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters'
import Table from "../components/common/Table.vue";

const currentPlan = computed(() => subscriptionStore.currentPlan);
const invoices = computed(() => subscriptionStore.invoices);
const plans = computed(() => subscriptionStore.plans);

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const showInvoices = ref(false);
const showPaymentModal = ref(false);
const paymentSuccess = ref(false);
const isProcessing = ref(false);
const selectedPlan = ref(null);
const selectedPayInvoice = ref(null);
const selectedCard = ref(null)
const showNewCardForm = ref(false)

const goToPage = (page) => {
    if (page >= 1 && page <= invoices.value.last_page) {
        subscriptionStore.fetchCurrentPlan(page);
    }
}
const getStatusColor = (status) => {
    switch (status) {
        case 'paid': return 'success'
        case 'pending': return 'warning'
        case 'canceled': return 'error'
        case 'refunded': return 'error'
        case 'chargeback': return 'error'
        default: return 'default'
    }
}
const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Pendente'
        case 'paid': return 'Pago'
        case 'canceled': return 'Cancelado'
        case 'refunded': return 'Reembolsado'
        case 'chargeback': return 'Chargeback'
        default: return 'default'
    }
}
const usage = computed(() => currentPlan.value.features_usage);

const remainingDays = computed(() => currentPlan.value.expires_in_days);

const progressBarWidth = computed(() => {
    const usagePercentage = (currentPlan.value.used_sales / currentPlan.value.limit_sales) * 100;
    return `${usagePercentage}%`;
});

const handleUpgrade = (plan) => {
    selectedPlan.value = plan;
    paymentSuccess.value = false;
    showPaymentModal.value = true;
};

const payInvoice = (invoice) => {
    selectedPayInvoice.value = invoice;
    paymentSuccess.value = false;
    showPaymentModal.value = true;
};

const processPayment = async () => {
    isProcessing.value = true;

    if (selectedPayInvoice.value) {
        await processPaymentInvoice()
    } else  {
        const paymentData = {
            plan: selectedPlan.value,
            useExistingCard: !showNewCardForm.value,
            cardId: selectedCard.value
        };

        await subscriptionStore.createSubscription(paymentData)
            .then(() => {
                if (!subscriptionStore.error) {
                    paymentSuccess.value = true;
                }
                isProcessing.value = false;
            }).catch((err) => {
                console.log(err)
                isProcessing.value = false;
            });
    }
};
const processPaymentInvoice = async () => {
    const paymentData = {
        invoice: selectedPayInvoice.value,
        useExistingCard: !showNewCardForm.value,
        cardId: selectedCard.value
    };

    console.log(paymentData, 'fsdf')
    await subscriptionStore.payInvoice(paymentData)
    .then(() => {
        if (!subscriptionStore.error) {
            paymentSuccess.value = true;
        }
        isProcessing.value = false;
    }).catch((err) => {
        console.log(err)
        isProcessing.value = false;
    });
};

onMounted(async () => {
    pageTitle.setTitle('Assinatura')

    subscriptionStore.fetchCurrentPlan();
    await subscriptionStore.savedCards();

    if (subscriptionStore.cardsList) {
        selectedCard.value = subscriptionStore.cardsList[0].card_id;
    }
});

</script>

<template>
    <div class="subscription">

        <div class="subscription-main">

            <div class="subscription-content">
                <!-- Current Plan Status -->
                <div class="current-plan-card">
                    <div class="plan-header">
                        <h2>Plano Atual - {{ currentPlan.name }}</h2>
                        <span class="plan-price">{{ formatCurrency(currentPlan.price ?? 0) }}</span>
                    </div>
                    <div class="plan-progress">
                        <div class="progress-text">
                            <span>Reinicia em {{ remainingDays }} dias - {{ currentPlan.expires_date }}</span>
                            <span>{{ currentPlan.used_sales }} / {{ currentPlan.limit_sales  }}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: progressBarWidth }"></div>
                        </div>
                    </div>
                </div>

                <!-- Usage Stats -->
                <div class="usage-stats">
                    <div class="usage-card">
                        <h3>Detalhamento do Uso</h3>
                        <div class="usage-items">
                            <div class="usage-item" v-for="(usageItem, key) in usage" :key="key">
                                <span>{{ usageItem.title }}</span>
                                <span>{{ usageItem.used }} / {{ usageItem.limit == '10000000000000000' ? 'ILIMITADO' : usageItem.limit }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Plans -->
                <section class="pricing">
                    <div class="plan basic" :class="currentPlan.name === 'radar' ? 'active' : ''">
                        <h2>Radar</h2>
                        <p class="subtitle"></p>
                        <ul>
                            <li class="active">Até 50 Vendas Aprovadas / mês</li>
                            <li class="active">1 Conta de anúncio</li>
                            <li class="active">1 Webhook</li>
                            <li class="active">1 Pixel de Otimização</li>
                            <li class="active">Relatórios</li>
                            <li class="">Regras Programadas</li>
                            <li class="">Suporte por whatsapp</li>
                        </ul>
                        <div class="price">
                        </div>
                        <div class="price">
                            <strong>R$ 0,00</strong><br>
                        </div>
<!--                        <button @click="handleUpgrade('radar')" class="btn-subscribe"  v-if="currentPlan.name !== 'radar'">GRATUITO</button>-->
                        <button class="btn-subscribe" disabled v-if="currentPlan.name !== 'radar'">GRATUITO</button>
                        <button v-else class="btn-subscribe" >PLANO ATUAL</button>
                    </div>

                    <div class="plan grow" :class="currentPlan.name === 'monitor' ? 'active' : ''">
                        <h2>Monitor </h2>
                        <p class="subtitle"></p>
                        <ul>
                            <li class="active">Até 1000 Vendas Aprovadas / mês</li>
                            <li class="active">3 Conta de anúncio</li>
                            <li class="active">3 Webhook</li>
                            <li class="active">3 Pixel de Otimização</li>
                            <li class="active">Relatórios</li>
                            <li class="">Regras Programadas</li>
                            <li class="">Suporte por whatsapp</li>
                        </ul>
                        <div class="price">
                        </div>
                        <div class="price">
                            <strong>R$ 77,90</strong> <small>/mês</small> <br>
                        </div>
                        <button  @click="handleUpgrade('monitor')" class="btn-subscribe" v-if="currentPlan.name !== 'monitor'">ESCOLHER PLANO</button>
                        <button v-else class="btn-subscribe" style="color: white">PLANO ATUAL</button>
                    </div>

                    <div class="plan pro" :class="currentPlan.name === 'scanner' ? 'active' : ''">
                        <h2>Scanner</h2>
                        <p class="subtitle"></p>
                        <ul>
                            <li class="active">Até 3000 Vendas Aprovadas / mês</li>
                            <li class="active">5 Contas de anúncio</li>
                            <li class="active">5 Webhook</li>
                            <li class="active">5 Pixel de Otimização</li>
                            <li class="active">Relatórios</li>
                            <li class="active">5 Regras Programadas</li>
                            <li class="active">Suporte por whatsapp</li>
                        </ul>
                        <div class="price">
                        </div>
                        <div class="price">
                            <strong>R$ 155,90 </strong>  <small>/mês</small> <br>
                        </div>
                        <button  @click="handleUpgrade('scanner')" class="btn-subscribe" v-if="currentPlan.name !== 'scanner'">ESCOLHER PLANO</button>
                        <button v-else class="btn-subscribe" >PLANO ATUAL</button>
                    </div>

                    <div class="plan fullstack" :class="currentPlan.name === 'sentinela' ? 'active' : ''" >
                        <h2>Sentinela</h2>
                        <p class="subtitle"></p>
                        <ul>
                            <li class="active">Até 7.000 Vendas Aprovadas / mês</li>
                            <li class="active">Conta de anúncio  <b class="unlimited"> ILIMITADAS</b> </li>
                            <li class="active">Webhook  <b class="unlimited"> ILIMITADAS</b> </li>
                            <li class="active">Pixel de Otimização  <b class="unlimited"> ILIMITADOS</b> </li>
                            <li class="active">Relatórios</li>
                            <li class="active">Regras Programadas  <b class="unlimited"> ILIMITADAS</b> </li>
                            <li class="active">Suporte por whatsapp</li>
                        </ul>
                        <div class="price">
                        </div>
                        <div class="price">
                            <strong>R$ 233,90</strong>  <small>/mês</small><br>
                        </div>
                        <button  @click="handleUpgrade('sentinela')" class="btn-subscribe" v-if="currentPlan.name !== 'sentinela'">ESCOLHER PLANO</button>
                        <button v-else class="btn-subscribe" >PLANO ATUAL</button>
                    </div>
                </section>


                <!-- Invoices -->
                <div class="invoices-section">
                    <h2>Histórico de Faturas</h2>
                    <p>Verifique a situação das suas faturas</p>

<!--                    &lt;!&ndash; Alerta caso existam faturas pendentes &ndash;&gt;-->
<!--                    <div-->
<!--                        v-if="invoices.data.some(invoice => invoice.status === 'pending')"-->
<!--                        class="alert alert-warning"-->
<!--                    >-->
<!--                        Você tem faturas pendentes. Clique no botão abaixo para visualizar.-->
<!--                    </div>-->


                    <div class="data-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Pago em</th>
                                <th>Mês de Referência</th>
                                <th>Total</th>
                                <th>Status</th>
<!--                                <th>Ação</th>-->
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="subscriptionStore.loading">
                                <!-- Skeleton Rows -->
                                <tr v-for="n in 5" :key="'skeleton-' + n" class="animate-pulse">
                                    <td><div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div></td>
                                    <td><div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div></td>
                                    <td><div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div></td>
                                    <td><div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div></td>
                                </tr>
                            </template>

                            <template v-else-if="invoices.data.length > 0">
                                <tr v-for="(invoice, index) in invoices.data" :key="index">
                                    <td>{{ formatDate(invoice.due_date) }}</td>
                                    <td>{{ formatDate(invoice.reference_month) }}</td>
                                    <td> {{ formatCurrency(invoice.total) }}</td>
                                    <td>
                                        <span class="status-badge" :class="getStatusColor(invoice.status)">
                                          {{ getStatusLabel(invoice.status) }}
                                        </span>
                                    </td>
<!--                                    <td >-->
<!--                                        <button v-if="invoice.status === 'pending'" class="pay-btn" @click="payInvoice(invoice)">-->
<!--                                            Pagar-->
<!--                                        </button>-->
<!--                                    </td>-->
                                </tr>
                            </template>

                            <template v-else>
                                <tr class="empty-row">
                                    <td :colspan="4" class="text-center py-4">
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>

                        <div class="pagination" v-if="!subscriptionStore.loading && invoices.total > 1">
                            <button @click="goToPage(invoices.current_page - 1)" :disabled="invoices.current_page === 1">Anterior</button>

                            <span>Página {{ invoices.current_page }} de {{ invoices.total }}</span>

                            <button @click="goToPage(invoices.current_page + 1)" :disabled="invoices.current_page === invoices.total">Próxima</button>
                        </div>
                    </div>
                </div>


                <!-- Invoices Modal -->
                <div v-if="showInvoices" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Histórico de Faturas</h3>
                            <button @click="showInvoices = false" class="close-btn">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="empty-state" v-if="!invoices.length">
                                Nenhuma fatura encontrada
                            </div>
                            <div v-else>
                                <table class="invoice-table">
                                    <thead>
                                    <tr>
                                        <th>Mês de Referência</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Ação</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="invoice in invoices" :key="invoice.id">
                                        <td>{{ formatDate(invoice.reference_month) }}</td>
                                        <td> {{ formatCurrency(invoice.total) }}</td>
                                        <td>{{ invoice.status === 'pending' ? 'Pendente' : 'Pago' }}</td>
                                        <td>
                                            <button v-if="invoice.status === 'pending'" class="pay-btn">
                                                Pagar
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Payment Modal -->
                <div v-if="showPaymentModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div v-if="!paymentSuccess">
                                <h3>Assinar Plano {{ selectedPlan }}</h3>
                            </div>
                            <button v-if="!isProcessing" @click="showPaymentModal = false" class="close-btn" >
                                ×
                            </button>
                        </div>

                        <div class="modal-body">
                            <!-- Success Message -->
                            <div v-if="paymentSuccess" class="success-message">
                                <div class="success-icon">✓</div>
                                <h3>Pagamento Confirmado!</h3>
                                <p>Seu plano foi ativado com sucesso.</p>
                            </div>

                            <!-- Payment Selection -->
                            <div v-else-if="!showNewCardForm && subscriptionStore.cardsList.length > 0" class="saved-cards">
                                <h4>Selecione um cartão salvo</h4>

                                <div class="cards-list">
                                    <div
                                        v-for="(card, index) in subscriptionStore.cardsList"
                                        :key="card.card_id"
                                        class="card-option"
                                        :class="{ active: selectedCard === card.card_id }"
                                        @click="selectedCard = card.card_id"
                                    >
                                        <div class="card-info">
                                            <span class="card-brand">💳 {{ card.brand }}</span>
                                            <span class="card-number">•••• {{ card.last_digits }}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    class="btn-secondary btn-new-card"
                                    @click="showNewCardForm = true"
                                >
                                    + Usar novo cartão
                                </button>

                                <button
                                    class="btn-primary btn-full"
                                    @click="processPayment"
                                    :disabled="!selectedCard || isProcessing"
                                >
                                    <span v-if="isProcessing" class="loading-spinner"></span>
                                    {{ isProcessing ? 'Processando...' : 'Confirmar Pagamento' }}
                                </button>
                            </div>

                            <!-- New Card Form -->
                            <form
                                v-else
                                @submit.prevent="processPayment"
                                class="payment-form"
                            >
                                <div v-if="subscriptionStore.cardsList.length > 0" class="form-header">
                                    <button
                                        type="button"
                                        class="btn-back"
                                        @click="showNewCardForm = false"
                                    >
                                        ← Voltar para cartões salvos
                                    </button>
                                </div>

                                <div class="form-group">
                                    <label>Nome no Cartão</label>
                                    <input
                                        type="text"
                                        v-model="subscriptionStore.cardForm.name"
                                        placeholder="Como aparece no cartão"
                                        :disabled="isProcessing"
                                        required
                                    />
                                </div>

                                <div class="form-group">
                                    <label>Número do Cartão</label>
                                    <div class="card-input">
                                        <input
                                            type="text"
                                            v-model="subscriptionStore.cardForm.number"
                                            placeholder="1234 5678 9012 3456"
                                            maxlength="19"
                                            :disabled="isProcessing"
                                            required
                                        />
                                        <span class="card-type">💳</span>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Validade</label>
                                        <input
                                            type="text"
                                            v-model="subscriptionStore.cardForm.expiry"
                                            placeholder="MM/YY"
                                            maxlength="5"
                                            :disabled="isProcessing"
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label>
                                            CVC
                                            <span class="info-icon" title="Código de segurança do cartão">ⓘ</span>
                                        </label>
                                        <input
                                            type="text"
                                            v-model="subscriptionStore.cardForm.cvc"
                                            placeholder="123"
                                            maxlength="4"
                                            :disabled="isProcessing"
                                            required
                                        />
                                    </div>
                                </div>

                                <label class="checkbox-container">
                                    <input
                                        type="checkbox"
                                        v-model="subscriptionStore.cardForm.saveCard"
                                        :disabled="isProcessing"
                                    />
                                    <span class="checkbox-label">Salvar cartão para pagamentos futuros</span>
                                </label>

                                <button
                                    type="submit"
                                    class="btn-primary"
                                    :disabled="isProcessing"
                                >
                                    <span v-if="isProcessing" class="loading-spinner"></span>
                                    {{ isProcessing ? 'Processando...' : 'Confirmar Pagamento' }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.saved-cards {
    padding: var(--spacing-md) 0;
}

.saved-cards h4 {
    margin: 0 0 var(--spacing-md);
    color: var(--text-primary);
}

.cards-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
}

.card-option {
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
}

.card-option:hover {
    border-color: var(--primary-color);
    background-color: var(--menu-hover);
}

.card-option.active {
    border-color: var(--primary-color);
    background-color: rgba(65, 105, 225, 0.1);
}

.card-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
}

.card-brand {
    font-weight: 500;
    color: var(--text-primary);
}

.card-number {
    color: var(--text-secondary);
}

.card-expiry {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.btn-new-card {
    width: 100%;
    margin-bottom: var(--spacing-md);
}

.btn-full {
    width: 100%;
}

.form-header {
    margin-bottom: var(--spacing-lg);
}

.btn-back {
    background: none;
    border: none;
    color: var(--primary-color);
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.btn-back:hover {
    text-decoration: underline;
}
.pricing {
    display: flex;
    gap: 1.4rem;
    padding: 3rem 0rem 3rem 0rem;
    justify-content: center;
    flex-wrap: wrap;
}

.plan {
    display: flex;
    flex-direction: column;
    background: var(--card-background);
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 300px;
    flex: 1 1 300px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
    position: relative;
    border: 1px solid #1d2b42;
}
.plan .price {
    margin-top: auto;
}
.plan.active {
    border: 2px solid #00aaff;
}


.plan h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.plan .subtitle {
    font-size: 0.875rem;
    color: #a3b1c6;
    margin-bottom: 1.5rem;
}

.plan ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
}

.plan ul li {
    font-size: 15px;
    padding: 0.4rem 0;
    color: #677489;
    position: relative;
    padding-left: 1.2rem;
}

.plan ul li.active {
    color: #ffffff;
}

.plan ul li::before {
    content: "•";
    position: absolute;
    left: 0;
    font-size: 1.2rem;
    color: #00ccff;
}

.plan ul li:not(.active)::before {
    color: #444c5c;
}

.price {
    font-size: 1.4rem;
    margin-bottom: 1rem;
}

.price span {
    font-size: 0.9rem;
    color: #ccc;
}

.unlimited {
    color: #00aaff;
}

.btn-subscribe {
    text-align: center;
    background-image: linear-gradient(90deg,#0094ed,#1457fd);
    color: #000;
    border: none;
    border-radius: 6px;
    padding: 0.8rem;
    width: 100%;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-subscribe:hover {
    background-color: #00aacc;
}


.plan {
    display: flex;
    flex-direction: column;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    position: relative;
    overflow: hidden;
}

.plan::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        120deg,
        rgba(0, 148, 237, 0.1) 0%,
        rgba(20, 87, 253, 0.2) 50%,
        rgba(0, 148, 237, 0.1) 100%
    );
    transform: rotate(0deg);
    transition: opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
    animation: shine 2s linear infinite;
}

.plan:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(0, 148, 237, 0.4);
}

.plan:hover::before {
    opacity: 1;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) rotate(15deg);
    }
    100% {
        transform: translateX(100%) rotate(15deg);
    }
}
@media (min-width: 768px) {
    .pricing {
        justify-content: center;
    }

    .plan {
        max-width: 45%;
    }
}

@media (min-width: 1024px) {
    .plan {
        max-width: 23%;
    }
}
.pagination {
    color: var(--text-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    font-weight: bold;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.filter-group label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
}
.data-grid {
    width: 100%;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.toolbar-left {
    display: flex;
    gap: var(--spacing-sm);
}

.icon-btn {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    cursor: pointer;
    color: var(--text-secondary);
}

.icon-btn:hover {
    background: var(--menu-hover);
    color: var(--text-primary);
}

.tracking-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: 14px;
}

.status-dot {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
}

.filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.filter-input,
.filter-select {
    border: 1px solid var(--border-color);
    height: 53px;
    color: var(--text-secondary);
    width: 100%;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    background-color: var(--card-background);
}

.data-table {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

th {
    background-color: var(--menu-hover);
    color: var(--text-secondary);
    font-weight: 500;
    font-size: 14px;
}

.info-icon {
    color: var(--text-muted);
    margin-left: var(--spacing-xs);
    cursor: help;
}

.empty-row td {
    text-align: center;
    color: var(--text-secondary);
    padding: var(--spacing-xl);
}

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

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: hidden;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
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

.column-search {
    width: 100%;
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-bg);
    color: var(--text-primary);
}

.columns-list {
    display: grid;
    gap: var(--spacing-sm);
}

.column-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-primary);
    cursor: pointer;
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
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

@media (max-width: 768px) {
    .filters {
        grid-template-columns: 1fr;
    }
}
.plan-card {
    display: flex;
    flex-direction: column;
}
.plan-footer {
    margin-top: auto; /* Isso vai garantir que o botão fique no final do card */
}
.alert.alert-warning {
    background-color: #fff3cd;
    color: #856404;
    padding: 10px 15px;
    margin-bottom: 1rem;
    border: 1px solid #ffeeba;
    border-radius: 4px;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.invoice-table th {
    text-align: left;
    font-size: 12px;
}

.invoice-table th,
.invoice-table td {
    padding: 8px 12px;
}

.pay-btn {
    background-color: #4CAF50;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.subscription {
    background-color: var(--background-color);
}

.subscription-main {
    margin-left: 250px;
}

.subscription-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.current-plan-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.plan-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.plan-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
}

.plan-progress {
    width: 100%;
}

.progress-text {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.progress-bar {
    width: 100%;
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

.usage-stats {
    margin-bottom: var(--spacing-xl);
}

.usage-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.usage-card h3 {
    margin: 0 0 var(--spacing-md);
    font-size: 1.25rem;
}

.usage-items {
    display: grid;
    gap: var(--spacing-md);
}

.usage-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border-color);
}

.usage-item:last-child {
    border-bottom: none;
}

.plans-section {
    margin-bottom: var(--spacing-xl);
}

.plans-section h2 {
    margin-bottom: var(--spacing-lg);
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

.plan-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plan-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.plan-card.recommended {
    border: 2px solid var(--primary-color);
    position: relative;
}

.plan-card.recommended::before {
    content: '✨ Recomendado';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
}

.plan-card-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
}

.plan-card-header h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: 1.25rem;
}

.plan-card-price {
    font-size: 2rem;
    font-weight: 600;
    color: var(--primary-color);
}

.price-period {
    font-size: 1rem;
    color: var(--text-secondary);
}

.plan-features {
    margin-bottom: var(--spacing-lg);
}

.plan-features ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.plan-features li {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-sm);
    color: var(--text-secondary);
}

.feature-check {
    color: var(--primary-color);
    margin-right: var(--spacing-sm);
    font-weight: bold;
}

.btn-upgrade {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
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
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

.invoices-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    text-align: center;
}

.invoices-section h2 {
    margin: 0 0 var(--spacing-xs);
}

.invoices-section p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
}

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

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: hidden;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
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

.empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: var(--spacing-xl) 0;
}

@media (max-width: 768px) {
    .subscription-main {
        margin-left: 0;
    }

    .plans-grid {
        grid-template-columns: 1fr;
    }
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-group label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.form-group input {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 1rem;
}

.form-group input:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.1);
}

.form-group input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.card-input {
    position: relative;
}

.card-type {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.info-icon {
    color: var(--text-muted);
    cursor: help;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
}

.checkbox-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}
.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
}

.success-message {
    text-align: center;
    padding: var(--spacing-xl) 0;
}

.success-icon {
    width: 64px;
    height: 64px;
    background-color: var(--accent-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto var(--spacing-lg);
    animation: scaleIn 0.3s ease;
}

.success-message h3 {
    margin: 0 0 var(--spacing-sm);
    color: var(--text-primary);
}

.success-message p {
    color: var(--text-secondary);
    margin: 0;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes scaleIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
}

@media (max-width: 1024px) {
    .plans-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>