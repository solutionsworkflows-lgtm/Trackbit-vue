<template>
    <div v-if="apiKeys.showWebhookAPIModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <h3>Criar Credencial de API</h3>
                </div>
                <button @click="apiKeys.resetApiModal(false)" class="close-btn">×</button>
            </div>

            <div class="modal-body">
                <div v-if="apiKeys.createdKey" class="p-4 rounded">
                    <div class="space-y-4">
                        <div class="api-instructions">
                            <h2>🔐 Como utilizar a API</h2>
                            <p>
                                Para enviar dados para a nossa API interna, você precisa utilizar as
                                <strong>chaves de autenticação</strong> geradas:
                            </p>

                            <h3 class="mt-4">📮 Endpoint</h3>
                            <pre class="code-block">POST {{ baseUrl }}</pre>

                            <h3 class="mt-4">🛡️ Cabeçalhos necessários</h3>
                            <ul>
                                <li><strong>X-Public-Key:</strong> {{ apiKeys.createdKey.public_key }}</li>
                                <li><strong>X-Secret-Key:</strong> {{ apiKeys.createdKey.secret_key }}</li>
                            </ul>

                            <h3 class="mt-4">📦 Payload de exemplo</h3>
                            <pre class="code-block">{{ payloadExample }}</pre>
                        </div>

                        <div>
                            <label class="block-label">Public Key</label>
                            <div class="flex">
                                <input type="text" :value="apiKeys.createdKey.public_key" class="form-input rounded-l-md" disabled />
                                <button @click="copy(apiKeys.createdKey.public_key)" class="btn-copy">Copiar</button>
                            </div>
                        </div>

                        <div>
                            <label class="block-label">Secret Key</label>
                            <div class="flex">
                                <input type="text" :value="apiKeys.createdKey.secret_key" class="form-input rounded-l-md" disabled />
                                <button @click="copy(apiKeys.createdKey.secret_key)" class="btn-copy">Copiar</button>
                            </div>
                            <div class="api-warning">
                                ⚠️ <strong>Importante:</strong> Sua <code>Secret Key</code> só é exibida uma vez. Guarde em um local seguro!
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="form-group">
                        <label>Nome</label>
                        <input
                            v-model="apiKeys.apiKeyName"
                            type="text"
                            class="form-input"
                            placeholder="Ex: Minha Loja"
                        />
                        <button
                            class="btn-primary w-full mt-5"
                            :disabled="!apiKeys.apiKeyName || apiKeys.isSaving"
                            @click="apiKeys.apiKeyId ? apiKeys.submitUpdateApiKey() : apiKeys.submitApiKey()"
                        >
                            {{
                                apiKeys.isSaving
                                    ? apiKeys.apiKeyId
                                        ? 'Salvando...'
                                        : 'Criando...'
                                    : apiKeys.apiKeyId
                                        ? 'Salvar Chave'
                                        : 'Criar Chaves'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useApiKeysStore } from '@/store/integrations/apiKeysStore'

const apiKeys = useApiKeysStore()

const baseUrl = import.meta.env.VITE_API_BASE_URL + '/internal/hooks'

const payloadExample = `{
  "data": {
    "orderId": 1382877,
    "platform": "",
    "paymentMethod": "pix",
    "status": "paid",
    "createdAt": "2025-05-16T10:02:51.000000Z",
    "approvedDate": "2025-05-16T10:03:20.000000Z",
    "refundedAt": null,
    "customer": {
      "name": "Weidson de Souza",
      "email": "weidnsilvaadesoiza@gmail.com",
      "phone": null,
      "document": "15568370460",
      "ip": "127.0.0.1"
    },
    "product": {
      "id": 788,
      "name": "Meta spy",
      "planId": 1420,
      "planName": "Checkout Padrao",
      "quantity": 1,
      "price": 0
    },
    "trackingParameters": {
      "sck": "",
      "src": null,
      "utm_campaign": "Campanha 1|120229129700880404",
      "utm_content": "Novo anuncio de Vendas|120229129700900404",
      "utm_medium": "Cj ABO|120229129700890404",
      "utm_source": "FB",
      "utm_term": "Instagram_Stories"
    },
    "commission": {
      "tax": 0,
      "gatewayFee": 0,
      "amount": 18.05,
      "currency": "BRL"
    }
  }
}`

const copy = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Erro ao copiar:', err)
    }
}
</script>

<style scoped>
.code-block {
    background: #f8f9fa;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: monospace;
    white-space: pre-wrap;
}
.btn-copy {
    background-color: #2563eb;
    color: white;
    padding: 0 1rem;
    border-radius: 0 .5rem .5rem 0;
    font-size: 14px;
    cursor: pointer;
}
.block-label {
    font-weight: 500;
    margin-top: 1rem;
    display: block;
}
.api-warning {
    margin-top: 1rem;
    color: #b91c1c;
    font-size: 13px;
}
</style>
