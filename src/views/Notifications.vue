<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useNotificationSettingsStore } from '@/store/notifications/notificationSettingsStore'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const store = useNotificationSettingsStore()
const settings = computed(() => store.settings)

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const previewData = {
    sale_approved_title: 'Venda aprovada!',
    product_name: 'Camiseta Bege',
    sale_value: 99.90,
    commission_value: 29.97
}

const display_value = computed(() => {
    switch (settings.value.display_value) {
        case 'sale':
            return `Valor: R$ ${previewData.sale_value.toFixed(2)}`
        case 'commission':
            return `Comissão: R$ ${previewData.commission_value.toFixed(2)}`
        case 'both':
            return `Valor: R$ ${previewData.sale_value.toFixed(2)} | Comissão: R$ ${previewData.commission_value.toFixed(2)}`
        default:
            return ''
    }
})

const previewTitle = computed(() => {
    return settings.value.message_template
        .replace('{{sale_approved_title}}', previewData.sale_approved_title)
        .replace('{{product_name}}', previewData.product_name)
})

const saveSettings = async () => {
    await store.saveSettings()
}

onMounted(() => {
    pageTitle.setTitle('Notificações')

    store.fetchSettings()
})
</script>

<template>
    <div class="notification-settings">

        <div class="settings-main">

            <div class="settings-content">
                <div class="settings-grid">
                    <!-- Settings Panel -->
                    <div class="settings-panel">
                        <h2>Configurações de Notificação</h2>
                        <p class="subtitle">Personalize como você deseja receber as notificações de vendas.</p>

                        <div class="settings-form">
                            <div class="form-group">
                                <label class="switch-label">
                                    <span>Enviar vendas pendentes</span>
                                    <label class="switch">
                                        <input
                                            type="checkbox"
                                            v-model="settings.send_pending_sales"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>

                            <div class="form-group">
                                <label class="switch-label">
                                    <span>Enviar vendas pagas</span>
                                    <label class="switch">
                                        <input
                                            type="checkbox"
                                            v-model="settings.send_paid_sales"
                                        >
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>

                            <div class="form-group">
                                <label>Exibir valores</label>
                                <select v-model="settings.display_value" class="form-select">
                                    <option value="none">Não exibir valores</option>
                                    <option value="sale">Apenas valor da venda</option>
                                    <option value="commission">Apenas valor da comissão</option>
                                    <option value="both">Exibir ambos os valores</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Modelo da mensagem</label>
                                <div class="template-help">
                                    Variáveis disponíveis:
                                    <code>&#123;&#123;sale_approved_title&#125;&#125;</code>
                                    <code>&#123;&#123;product_name&#125;&#125;</code>
                                </div>
                                <input
                                    type="text"
                                    v-model="settings.message_template"
                                    class="form-input"
                                    placeholder="Ex: Venda aprovada! | {{product_name}}"
                                />
                            </div>

                            <button class="btn-primary" @click="saveSettings" :disabled="store.loading">
                                {{ store.loading ? 'Carregando...' : 'Salvar configurações' }}
                            </button>
                        </div>
                    </div>

                    <!-- Preview Panel -->
                    <div class="preview-panel">
                        <h3>Prévia da Notificação</h3>
                        <div class="notification-preview">
                            <div class="preview-header">
                                <img src="/src/assets/icon.png" alt="Logo" class="preview-logo" />

                            </div>

                            <div class="preview-content">
                                <h4>{{ previewTitle }}</h4>
                                <p v-if="settings.display_value !== 'none'" class="preview-value">
                                    {{ display_value }}
                                </p>
                            </div>
                        </div>
                        <div class="notification-preview mt-4">
                            <div class="preview-header flex items-center gap-x-2">
                                <img src="/src/assets/icon.png" alt="Logo" class="preview-logo" />
                            </div>

                            <div class="preview-content">
                                <h4>{{ previewTitle }}</h4>
                                <p v-if="settings.display_value !== 'none'" class="preview-value">
                                    {{ display_value }}
                                </p>
                            </div>
                        </div>
                        <div class="notification-preview mt-4">
                            <div class="preview-header">
                                <img src="/src/assets/icon.png" alt="Logo" class="preview-logo" />

                            </div>

                            <div class="preview-content">
                                <h4>{{ previewTitle }}</h4>
                                <p v-if="settings.display_value !== 'none'" class="preview-value">
                                    {{ display_value }}
                                </p>
                            </div>
                        </div>
                        <div class="notification-preview mt-4">
                            <div class="preview-header">
                                <img src="/src/assets/icon.png" alt="Logo" class="preview-logo" />

                            </div>

                            <div class="preview-content">
                                <h4>{{ previewTitle }}</h4>
                                <p v-if="settings.display_value !== 'none'" class="preview-value">
                                    {{ display_value }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.notification-settings {
    min-height: 100vh;
    background-color: var(--background-color);
}

.settings-main {
    margin-left: 250px;
}

.settings-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
}

.settings-panel {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
}

.settings-panel h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary);
}

.subtitle {
    color: var(--text-secondary);
    margin: var(--spacing-xs) 0 var(--spacing-xl);
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.switch-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.switch {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(24px);
}

.form-select,
.form-input {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.template-help {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
}

.template-help code {
    background-color: var(--menu-hover);
    padding: 2px 4px;
    border-radius: 4px;
    margin: 0 2px;
    font-family: monospace;
}

.preview-panel {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
}

.preview-panel h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 1.25rem;
    color: var(--text-primary);
}

.notification-preview {
    display: flex;
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: 10px;
    max-width: 400px;
}

.preview-header {
    margin: 10px 20px 10px 10px;
    //display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.preview-logo {
    width: auto;
    height: 60px;
    border-radius: 8px;
}

.preview-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.preview-content h4 {
    margin-bottom: 0px;
    margin-top: 13px;
    font-size: 1rem;
    color: var(--text-primary);
}

.preview-value {
    margin: var(--spacing-xs) 0 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #365CC5;
}

@media (max-width: 768px) {
    .settings-main {
        margin-left: 0;
    }

    .settings-grid {
        grid-template-columns: 1fr;
    }
}
</style>