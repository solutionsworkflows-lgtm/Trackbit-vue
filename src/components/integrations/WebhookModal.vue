<template>
    <div v-if="webhooks.showWebhookModal" class="modal">
        <div class="modal-content">
            <!-- Platform Selection Step -->
            <div v-if="webhooks.webhookStep === 'platforms'">
                <div class="modal-header">
                    <div>
                        <h3>Webhooks</h3>
                        <p class="modal-subtitle">Selecione uma plataforma para começar</p>
                    </div>
                    <button @click="close" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="search-box">
                        <input
                            v-model="webhooks.searchPlatform"
                            type="text"
                            placeholder="Buscar por plataforma"
                            class="search-input"
                        />
                    </div>
                    <div class="platforms-grid">
                        <button
                            v-for="platform in webhooks.filteredPlatforms"
                            :key="platform.value"
                            class="platform-button"
                            @click="webhooks.selectPlatform(platform)"
                        >
                            {{ platform.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Configuration Step -->
            <div v-if="webhooks.webhookStep === 'config'">
                <div class="modal-header">
                    <div><h3>Configurar Webhook</h3></div>
                    <button
                        @click="webhooks.webhookStep = 'platforms'"
                        class="back-btn"
                        v-if="!webhooks.webhookId"
                    >
                        ← Voltar
                    </button>
                    <button @click="webhooks.resetWebhookModal(false)" class="close-btn" v-else>
                        ×
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nome do Webhook</label>
                        <input
                            v-model="webhooks.webhookName"
                            type="text"
                            class="form-input"
                            placeholder="Ex: Minha Loja"
                        />
                        <div v-if="webhooks.webhookId" class="token-box">
                            <p class="token-label">URL:</p>
                            <div class="token-value">
                                <input
                                    readonly
                                    class="form-control border-gray"
                                    :value="webhooks.webhookUrl"
                                    style="margin-right: 15px;"
                                />
                                <button class="copy-btn" @click="copyToClipboard(webhooks.webhookUrl)">
                                    Copiar
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        class="btn-primary w-full"
                        :disabled="!webhooks.webhookName || webhooks.isLoading"
                        @click="webhooks.submitWebhook"
                        v-if="!webhooks.webhookId"
                    >
                        {{ webhooks.isLoading ? 'Criando...' : 'Criar Webhook' }}
                    </button>
                    <button
                        v-else
                        class="btn-primary w-full"
                        :disabled="!webhooks.webhookName || webhooks.isLoading"
                        @click="webhooks.submitUpdateWebhook"
                    >
                        {{ webhooks.isLoading ? 'Salvando...' : 'Salvar Webhook' }}
                    </button>
                </div>
            </div>

            <!-- Success Step -->
            <div v-if="webhooks.webhookStep === 'success'">
                <div class="modal-header">
                    <div>
                        <h3>Webhook Criado!</h3>
                        <p class="modal-subtitle">Copie o token abaixo</p>
                    </div>
                    <button @click="webhooks.resetWebhookModal(false)" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="success-message">
                        <span class="success-icon">✓</span>
                        <p>Webhook criado com sucesso!</p>
                    </div>
                    <div class="token-box">
                        <p class="token-label">URL:</p>
                        <div class="token-value">
                            {{ webhooks.createdWebhook?.url }}
                            <button class="copy-btn" @click="copyToClipboard(webhooks.createdWebhook?.url)">
                                Copiar
                            </button>
                        </div>
                    </div>
                    <button class="btn-primary w-full" @click="webhooks.resetWebhookModal(false)">
                        Concluir
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWebhooksStore } from '@/store/integrations/webhooksStore'

const webhooks = useWebhooksStore()

function close() {
    webhooks.resetWebhookModal(false)
}

function copyToClipboard(text?: string) {
    if (text) navigator.clipboard.writeText(text)
}
</script>

<style scoped>
/* seus estilos aqui */
</style>
