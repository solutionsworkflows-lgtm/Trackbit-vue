<script setup lang="ts">
import { onMounted } from 'vue'
import { useApiKeysStore } from '@/store/integrations/apiKeysStore'
import { useWebhooksStore } from '@/store/integrations/webhooksStore'
import ReusableList from '@/components/common/ReusableList.vue'
import WebhookModal from './WebhookModal.vue'
import WebhookApiModal from './WebhookApiModal.vue'

const apiKeys = useApiKeysStore()
const webhooks = useWebhooksStore()

const baseUrl = import.meta.env.VITE_API_BASE_URL + '/internal/hooks'

onMounted(() => {
    webhooks.getPlatforms()
    webhooks.getWebhooks()
    apiKeys.getApiKeys()
})
</script>

<template>
    <div>
        <!-- Webhooks Card -->
        <div class="integration-card">
            <div class="card-header">
                <div>
                    <h3>Webhooks</h3>
                    <p class="text-muted">Conecte-se com plataformas de venda</p>
                </div>
                <button class="btn-primary" @click="webhooks.showWebhookModal = true">
                    Adicionar Webhook
                </button>
            </div>
            <div class="empty" v-if="webhooks.loadingWebhookList">Carregando...</div>
            <div v-else>
                <ReusableList
                    :columns="[ { label: 'Nome', value: 'name' }, { label: 'URL', value: 'url' }]"
                    :items="webhooks.listWebhooks"
                    @edit="webhooks.editWebhook"
                    @delete="webhooks.deleteWebhook"
                />
            </div>
        </div>

        <!-- API Keys Card -->
        <div class="integration-card">
            <div class="card-header">
                <div>
                    <h3>Credenciais de API</h3>
                    <p class="text-muted">Crie credenciais de API para integração</p>
                </div>
                <button class="btn-primary" @click="apiKeys.resetApiModal(true)">
                    Adicionar API
                </button>
            </div>
            <div class="card-body">
                <div class="empty" v-if="apiKeys.loadingListKeys">Carregando...</div>
                <div v-else>
                    <ReusableList
                        :columns="[ { label: 'Nome', value: 'name' }, { label: 'Chave publica', value: 'public_key' }]"
                        :items="apiKeys.listApiKeys"
                        @edit="apiKeys.editKey"
                        @delete="apiKeys.deleteKey"
                    />
                </div>
            </div>
        </div>

        <!-- Modais -->
        <WebhookModal />
        <WebhookApiModal />
    </div>
</template>
