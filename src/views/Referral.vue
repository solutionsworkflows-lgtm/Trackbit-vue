<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const showWithdrawModal = ref(false)
const pixKey = ref('')
const withdrawAmount = ref(0)
const referralLink = ref('')

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

import { useReferralStore } from '@/store/referral/referralStore'
const referralStore = useReferralStore()

import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters'

onMounted(async () => {
    pageTitle.setTitle('Indique e Ganhe')
    await referralStore.fetchDashboard()
    referralStore.fetchExtract()
    referralLink.value = `${window.location.origin}` + referralStore.dashboard?.link
});
const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink.value)
}

const handleWithdraw = () => {
    if (!pixKey.value || withdrawAmount.value <= 0) return

    // Handle withdrawal logic here
    referralStore.requestWithdrawal(
        pixKey.value,
        withdrawAmount.value
    )

    showWithdrawModal.value = false
    pixKey.value = ''
    withdrawAmount.value = 0
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'success'
        case 'pending':
            return 'warning'
        default:
            return 'default'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'approved':
            return 'Concluído'
        case 'pending':
            return 'Em processamento'
        default:
            return status
    }
}
</script>

<template>
    <div class="referral">

        <div class="referral-main">

            <div class="referral-content">
                <div class="referral-header">
                    <div>
                        <h1>Indique e Ganhe</h1>
                        <p class="subtitle">Indique amigos e ganhe 10% de comissão vitalícia</p>
                    </div>
                    <div class="header-actions">
                        <a href="#" class="btn-secondary">Ver Regulamento</a>
                        <button class="btn-primary" @click="showWithdrawModal = true">
                            Solicitar Saque
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-user"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Cadastros Ativos</span>
                            <span class="stat-value">{{ referralStore.loading ? 0 : referralStore.dashboard?.count_users }}</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-money-check-dollar"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Saldo a Receber</span>
                            <span class="stat-value">{{ referralStore.loading ? 0 : formatCurrency(referralStore.dashboard?.pending) }}</span>
                        </div>
                    </div>

                    <div class="stat-card highlight">
                        <div class="stat-icon"><i class="fa-solid fa-money-bill-trend-up"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Disponível para Saque</span>
                            <span class="stat-value">{{ referralStore.loading ? 0 : formatCurrency( referralStore.dashboard?.available) }}</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-chart-pie"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Total Ganho</span>
                            <span class="stat-value">{{ referralStore.loading ? 0 : formatCurrency(referralStore.dashboard?.total_earned) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Referral Link Section -->
                <div class="referral-link-section">
                    <h2>Seu Link de Indicação</h2>
                    <div class="link-container">
                        <input type="text" :value="referralLink" readonly class="link-input" />
                        <button class="btn-primary" @click="copyReferralLink">
                            Copiar Link
                        </button>
                    </div>
                </div>

                <!-- Withdrawals Table -->
                <div class="withdrawals-section">
                    <h2>Histórico de Saques</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Data</th>
                                <th>Valor</th>
<!--                                <th>Chave PIX</th>-->
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="withdrawal in referralStore.extract" :key="withdrawal.id">
                                <td>{{ formatDate(withdrawal.created_at) }}</td>
                                <td>{{ formatCurrency(withdrawal.amount) }}</td>
<!--                                <td>{{ withdrawal.type }}</td>-->
                                <td>
                                <span class="status-badge" :class="getStatusColor(withdrawal.status)">
                                  {{ getStatusText(withdrawal.status) }}
                                </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Modal -->
        <div v-if="showWithdrawModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Solicitar Saque</h3>
                    <button @click="showWithdrawModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Valor do Saque</label>
                        <div class="amount-input">
                            <span class="currency-symbol">R$</span>
                            <input
                                type="number"
                                v-model="withdrawAmount"
                                class="form-input"
                                placeholder="0,00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <span class="available-balance">
                          Disponível: {{ formatCurrency(referralStore.dashboard?.available) }}
                        </span>
                    </div>

                    <div class="form-group">
                        <label>Chave PIX</label>
                        <input
                            type="text"
                            v-model="pixKey"
                            class="form-input"
                            placeholder="Digite sua chave PIX"
                        />
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showWithdrawModal = false" class="btn-secondary">
                        Cancelar
                    </button>
                    <button
                        @click="handleWithdraw"
                        class="btn-primary"
                        :disabled="!pixKey || withdrawAmount <= 0"
                    >
                        Solicitar Saque
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.referral {
    min-height: 100vh;
    background-color: var(--background-color);
}

.referral-main {
    margin-left: 250px;
}

.referral-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.referral-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
}

.referral-header h1 {
    margin: 0;
    font-size: 24px;
    color: var(--text-primary);
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.stat-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.stat-card.highlight {
    background-color: var(--primary-color);
    color: white;
}

.stat-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    background-color: rgba(65, 105, 225, 0.1);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.highlight .stat-icon {
    background-color: rgba(255, 255, 255, 0.2);
}

.stat-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.highlight .stat-label {
    color: rgba(255, 255, 255, 0.8);
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.highlight .stat-value {
    color: white;
}

.referral-link-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.referral-link-section h2 {
    margin: 0 0 var(--spacing-md);
    font-size: 18px;
    color: var(--text-primary);
}

.link-container {
    display: flex;
    gap: var(--spacing-md);
}

.link-input {
    flex-grow: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-family: monospace;
}

.withdrawals-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.withdrawals-section h2 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.table-container {
    overflow-x: auto;
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
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--menu-hover);
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
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 500px;
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
    font-size: 18px;
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

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: 14px;
}

.amount-input {
    position: relative;
}

.currency-symbol {
    position: absolute;
    left: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.amount-input .form-input {
    padding-left: 2.5rem;
}

.form-input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.available-balance {
    display: block;
    margin-top: var(--spacing-xs);
    font-size: 12px;
    color: var(--text-secondary);
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
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    text-decoration: none;
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .referral-main {
        margin-left: 0;
    }

    .referral-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-actions {
        width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .link-container {
        flex-direction: column;
    }
}
</style>