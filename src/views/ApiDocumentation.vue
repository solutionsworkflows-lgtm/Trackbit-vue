<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitleStore } from '../store/pageTitle'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const pageTitle = usePageTitleStore()

onMounted(() => {
    pageTitle.setTitle('Documentação da API')
})

const activeSection = ref('overview')
const showApiKeyModal = ref(false)

const apiKeys = ref({
    public_key: 'pk_live_1239045678*******',
    secret_key: 'sk_live_abcdef1234*******'
})

const baseUrl = 'https://api.wetrackr.com.br/api/internal/hooks'

const sections = [
    { id: 'overview', label: 'Visão Geral', icon: '' },
    { id: 'authentication', label: 'Autenticação', icon: '' },
    { id: 'webhook', label: 'Webhook', icon: '' },
    { id: 'payload', label: 'Payload', icon: '' },
    { id: 'examples', label: 'Exemplos', icon: '' },
    { id: 'errors', label: 'Códigos de Erro', icon: '' },
    { id: 'testing', label: 'Testes', icon: '' }
]

const payloadFields = [
    {
        field: 'orderId',
        type: 'integer',
        required: true,
        description: 'ID único da venda/pedido'
    },
    {
        field: 'platform',
        type: 'string',
        required: false,
        description: 'Plataforma de origem da venda'
    },
    {
        field: 'paymentMethod',
        type: 'string',
        required: true,
        description: 'Método de pagamento utilizado',
        enum: ['pix', 'credit_card', 'boleto', 'debit_card']
    },
    {
        field: 'status',
        type: 'string',
        required: true,
        description: 'Status atual da venda',
        enum: ['pending', 'paid', 'refunded', 'cancelled']
    },
    {
        field: 'createdAt',
        type: 'string (ISO 8601)',
        required: true,
        description: 'Data e hora de criação da venda'
    },
    {
        field: 'approvedDate',
        type: 'string (ISO 8601)',
        required: false,
        description: 'Data e hora de aprovação do pagamento'
    },
    {
        field: 'refundedAt',
        type: 'string (ISO 8601)',
        required: false,
        description: 'Data e hora do reembolso (se aplicável)'
    }
]

const customerFields = [
    {
        field: 'name',
        type: 'string',
        required: true,
        description: 'Nome completo do cliente'
    },
    {
        field: 'email',
        type: 'string',
        required: true,
        description: 'E-mail do cliente'
    },
    {
        field: 'phone',
        type: 'string',
        required: false,
        description: 'Telefone do cliente'
    },
    {
        field: 'document',
        type: 'string',
        required: false,
        description: 'CPF/CNPJ do cliente'
    },
    {
        field: 'ip',
        type: 'string',
        required: false,
        description: 'Endereço IP do cliente'
    }
]

const productFields = [
    {
        field: 'id',
        type: 'integer',
        required: true,
        description: 'ID único do produto'
    },
    {
        field: 'name',
        type: 'string',
        required: true,
        description: 'Nome do produto'
    },
    {
        field: 'planId',
        type: 'integer',
        required: false,
        description: 'ID do plano/variação do produto'
    },
    {
        field: 'planName',
        type: 'string',
        required: false,
        description: 'Nome do plano/variação'
    },
    {
        field: 'quantity',
        type: 'integer',
        required: true,
        description: 'Quantidade comprada'
    },
    {
        field: 'price',
        type: 'number',
        required: true,
        description: 'Preço unitário do produto'
    }
]

const trackingFields = [
    {
        field: 'sck',
        type: 'string',
        required: false,
        description: 'Parâmetro de rastreamento personalizado'
    },
    {
        field: 'src',
        type: 'string',
        required: false,
        description: 'Fonte de origem'
    },
    {
        field: 'utm_campaign',
        type: 'string',
        required: false,
        description: 'Nome da campanha'
    },
    {
        field: 'utm_content',
        type: 'string',
        required: false,
        description: 'Conteúdo do anúncio'
    },
    {
        field: 'utm_medium',
        type: 'string',
        required: false,
        description: 'Meio/conjunto de anúncios'
    },
    {
        field: 'utm_source',
        type: 'string',
        required: false,
        description: 'Fonte de tráfego'
    },
    {
        field: 'utm_term',
        type: 'string',
        required: false,
        description: 'Posicionamento do anúncio'
    }
]

const commissionFields = [
    {
        field: 'tax',
        type: 'number',
        required: false,
        description: 'Valor dos impostos'
    },
    {
        field: 'gatewayFee',
        type: 'number',
        required: false,
        description: 'Taxa do gateway de pagamento'
    },
    {
        field: 'amount',
        type: 'number',
        required: true,
        description: 'Valor da comissão'
    },

    {
        field: 'totalSale',
        type: 'number',
        required: false,
        description: 'Valor total da venda'
    },
    {
        field: 'currency',
        type: 'string',
        required: false,
        description: 'Moeda da transação',
        enum: ['BRL', 'USD', 'EUR']
    }
]

const errorCodes = [
    {
        code: 200,
        status: 'OK',
        description: 'Webhook recebido e processado com sucesso'
    },
    {
        code: 400,
        status: 'Bad Request',
        description: 'Dados inválidos ou malformados no payload'
    },
    {
        code: 401,
        status: 'Unauthorized',
        description: 'Chaves de autenticação inválidas ou ausentes'
    },
    {
        code: 403,
        status: 'Forbidden',
        description: 'Acesso negado - verifique suas permissões'
    },
    {
        code: 422,
        status: 'Unprocessable Entity',
        description: 'Dados válidos mas com regras de negócio violadas'
    },
    {
        code: 429,
        status: 'Too Many Requests',
        description: 'Limite de requisições excedido'
    },
    {
        code: 500,
        status: 'Internal Server Error',
        description: 'Erro interno do servidor'
    }
]

const copyToClipboard = async (text: string, field: string) => {
    try {
        await navigator.clipboard.writeText(text)
        copiedField.value = field
        setTimeout(() => {
            copiedField.value = ''
        }, 2000)
    } catch (err) {
        console.error('Erro ao copiar:', err)
    }
}

const scrollToSection = (sectionId: string) => {
    activeSection.value = sectionId
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

const generateApiKeys = () => {
    // Simular geração de novas chaves
    apiKeys.value = {
        public_key: 'pk_live_' + Math.random().toString(36).substring(2, 18),
        secret_key: 'sk_live_' + Math.random().toString(36).substring(2, 18)
    }
    showApiKeyModal.value = true
}
const copiedField = ref(null);

const jsonPayload = {
    data: {
        orderId: 1382877,
        platform: "Hotmart",
        paymentMethod: "pix",
        status: "paid",
        createdAt: "2025-05-16T10:02:51.000000Z",
        approvedDate: "2025-05-16T10:03:20.000000Z",
        refundedAt: null,
        customer: {
            name: "Weidson de Souza",
            email: "weidnsilvaadesoiza@gmail.com",
            phone: "+5511999999999",
            document: "15568370460",
            ip: "127.0.0.1"
        },
        product: {
            id: 788,
            name: "Meta Spy",
            planId: 1420,
            planName: "Checkout Padrão",
            quantity: 1,
            price: 197.0
        },
        trackingParameters: {
            sck: "",
            src: null,
            utm_campaign: "Campanha 1|120229129700880404",
            utm_content: "Novo anuncio de Vendas|120229129700900404",
            utm_medium: "Cj ABO|120229129700890404",
            utm_source: "FB",
            utm_term: "Instagram_Stories"
        },
        commission: {
            tax: 0.0,
            gatewayFee: 2.95,
            amount: 18.05,
            totalSale: 24.00,
            currency: "BRL"
        }
    }
};

</script>

<template>
    <div class="api-documentation">
        <div class="documentation-main">

            <div class="documentation-content">

                <div class="documentation-layout">
                    <!-- Sidebar Navigation -->
                    <nav class="doc-sidebar">
                        <div class="sidebar-header">
                            <h3>Navegação</h3>
                        </div>
                        <ul class="nav-list">
                            <li v-for="section in sections" :key="section.id">
                                <a
                                    :href="`#${section.id}`"
                                    class="nav-link"
                                    :class="{ active: activeSection === section.id }"
                                    @click.prevent="scrollToSection(section.id)"
                                >
                                    <span class="nav-icon">{{ section.icon }}</span>
                                    {{ section.label }}
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Main Content -->
                    <main class="doc-content">
                        <!-- Overview Section -->
                        <section id="overview" class="doc-section">
                            <h2> Visão Geral</h2>
                            <div class="content-card">
                                <p>A API do Wetracker permite que você envie dados de vendas em tempo real para nossa plataforma, possibilitando o rastreamento preciso de conversões e ROI das suas campanhas de marketing.</p>

                                <div class="features-grid">
                                    <div class="feature-item">
                                        <div>
                                            <h4>Tempo Real</h4>
                                            <p>Receba dados instantaneamente</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div>
                                            <h4>Seguro</h4>
                                            <p>Autenticação por chaves API</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div>
                                            <h4>Analytics</h4>
                                            <p>Rastreamento completo de UTMs</p>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <div>
                                            <h4>Webhook</h4>
                                            <p>Integração via HTTP POST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Authentication Section -->
                        <section id="authentication" class="doc-section">
                            <h2>Autenticação</h2>
                            <div class="content-card">
                                <p>Todas as requisições para a API devem incluir suas chaves de autenticação nos cabeçalhos HTTP.</p>

                                <div class="auth-info">
                                    <h4>Cabeçalhos Obrigatórios</h4>
                                    <div class="code-block">
                    <pre><code>X-Public-Key: {{ apiKeys.public_key }}
X-Secret-Key: {{ apiKeys.secret_key }}</code></pre>
                                        <button
                                            class="copy-btn"
                                            @click="copyToClipboard(`X-Public-Key: ${apiKeys.public_key}\nX-Secret-Key: ${apiKeys.secret_key}`, 'headers')"
                                            :class="{ copied: copiedField === 'headers' }"
                                        >
                                            {{ copiedField === 'headers' ? '✓' : '📋' }}
                                        </button>
                                    </div>
                                </div>

                                <div class="warning-box">
                                    <span class="warning-icon"></span>
                                    <div>
                                        <strong>Importante:</strong> Mantenha suas chaves seguras e nunca as exponha em código client-side. A Secret Key só é exibida uma vez durante a geração.
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Webhook Section -->
                        <section id="webhook" class="doc-section">
                            <h2>Endpoint do Webhook</h2>
                            <div class="content-card">
                                <div class="endpoint-info">
                                    <div class="method-badge post">POST</div>
                                    <code class="endpoint-url">{{ baseUrl }}</code>
                                    <button
                                        class="copy-btn"
                                        @click="copyToClipboard(baseUrl, 'endpoint')"
                                        :class="{ copied: copiedField === 'endpoint' }"
                                    >
                                        {{ copiedField === 'endpoint' ? '✓' : '📋' }}
                                    </button>
                                </div>

                                <h4>Content-Type</h4>
                                <div class="code-block">
                                    <pre><code>Content-Type: application/json</code></pre>
                                </div>

                                <h4>Timeout</h4>
                                <p>O endpoint tem um timeout de <strong>30 segundos</strong>. Certifique-se de que sua aplicação responda dentro deste prazo.</p>
                            </div>
                        </section>

                        <!-- Payload Section -->
                        <section id="payload" class="doc-section">
                            <h2>Estrutura do Payload</h2>
                            <div class="content-card">
                                <p>O payload deve ser enviado no formato JSON com a seguinte estrutura:</p>

                                <!-- Main Data Fields -->
                                <div class="field-group">
                                    <h4>Dados Principais</h4>
                                    <div class="fields-table">
                                        <div class="table-header">
                                            <span>Campo</span>
                                            <span>Tipo</span>
                                            <span>Obrigatório</span>
                                            <span>Descrição</span>
                                        </div>
                                        <div v-for="field in payloadFields" :key="field.field" class="table-row">
                                            <code class="field-name">{{ field.field }}</code>
                                            <span class="field-type">{{ field.type }}</span>
                                            <span class="field-required" :class="{ required: field.required }">
                        {{ field.required ? 'Sim' : 'Não' }}
                      </span>
                                            <span class="field-description">{{ field.description }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Customer Fields -->
                                <div class="field-group">
                                    <h4> Dados do Cliente (customer)</h4>
                                    <div class="fields-table">
                                        <div class="table-header">
                                            <span>Campo</span>
                                            <span>Tipo</span>
                                            <span>Obrigatório</span>
                                            <span>Descrição</span>
                                        </div>
                                        <div v-for="field in customerFields" :key="field.field" class="table-row">
                                            <code class="field-name">customer.{{ field.field }}</code>
                                            <span class="field-type">{{ field.type }}</span>
                                            <span class="field-required" :class="{ required: field.required }">
                        {{ field.required ? 'Sim' : 'Não' }}
                      </span>
                                            <span class="field-description">{{ field.description }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Product Fields -->
                                <div class="field-group">
                                    <h4>Dados do Produto (product)</h4>
                                    <div class="fields-table">
                                        <div class="table-header">
                                            <span>Campo</span>
                                            <span>Tipo</span>
                                            <span>Obrigatório</span>
                                            <span>Descrição</span>
                                        </div>
                                        <div v-for="field in productFields" :key="field.field" class="table-row">
                                            <code class="field-name">product.{{ field.field }}</code>
                                            <span class="field-type">{{ field.type }}</span>
                                            <span class="field-required" :class="{ required: field.required }">
                        {{ field.required ? 'Sim' : 'Não' }}
                      </span>
                                            <span class="field-description">{{ field.description }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tracking Fields -->
                                <div class="field-group">
                                    <h4>Parâmetros de Rastreamento (trackingParameters)</h4>
                                    <div class="fields-table">
                                        <div class="table-header">
                                            <span>Campo</span>
                                            <span>Tipo</span>
                                            <span>Obrigatório</span>
                                            <span>Descrição</span>
                                        </div>
                                        <div v-for="field in trackingFields" :key="field.field" class="table-row">
                                            <code class="field-name">trackingParameters.{{ field.field }}</code>
                                            <span class="field-type">{{ field.type }}</span>
                                            <span class="field-required" :class="{ required: field.required }">
                        {{ field.required ? 'Sim' : 'Não' }}
                      </span>
                                            <span class="field-description">{{ field.description }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Commission Fields -->
                                <div class="field-group">
                                    <h4> Dados de Comissão (commission)</h4>
                                    <div class="fields-table">
                                        <div class="table-header">
                                            <span>Campo</span>
                                            <span>Tipo</span>
                                            <span>Obrigatório</span>
                                            <span>Descrição</span>
                                        </div>
                                        <div v-for="field in commissionFields" :key="field.field" class="table-row">
                                            <code class="field-name">commission.{{ field.field }}</code>
                                            <span class="field-type">{{ field.type }}</span>
                                            <span class="field-required" :class="{ required: field.required }">
                        {{ field.required ? 'Sim' : 'Não' }}
                      </span>
                                            <span class="field-description">{{ field.description }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Examples Section -->
                        <section id="examples" class="doc-section">
                            <h2>Exemplos de Uso</h2>
                            <div class="content-card">
                                <h4>Exemplo Completo de Payload</h4>
                                <div class="code-block large">
                  <pre><code>{
  "data": {
    "orderId": 1382877,
    "platform": "Hotmart",
    "paymentMethod": "pix",
    "status": "paid",
    "createdAt": "2025-05-16T10:02:51.000000Z",
    "approvedDate": "2025-05-16T10:03:20.000000Z",
    "refundedAt": null,
    "customer": {
      "name": "Weidson de Souza",
      "email": "weidnsilvaadesoiza@gmail.com",
      "phone": "+5511999999999",
      "document": "15568370460",
      "ip": "127.0.0.1"
    },
    "product": {
      "id": 788,
      "name": "Meta Spy",
      "planId": 1420,
      "planName": "Checkout Padrão",
      "quantity": 1,
      "price": 197.00
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
      "tax": 5.91,
      "gatewayFee": 2.95,
      "amount": 18.05,
      "totalSale: 24.00,
      "currency": "BRL"
    }
  }
}</code></pre>
                                    <button
                                        class="copy-btn"
                                        @click="copyToClipboard(jsonPayload, 'payload')"
                                        :class="{ copied: copiedField === 'payload' }"
                                    >
                                        {{ copiedField === 'payload' ? '✓ Copiado' : '📋 Copiar' }}
                                    </button>
                                </div>

                                <h4>Exemplo com cURL</h4>
                                <div class="code-block">
                  <pre><code>curl -X POST {{ baseUrl }} \
  -H "Content-Type: application/json" \
  -H "X-Public-Key: {{ apiKeys.public_key }}" \
  -H "X-Secret-Key: {{ apiKeys.secret_key }}" \
  -d '{
    "data": {
      "orderId": 1382877,
      "paymentMethod": "pix",
      "status": "paid",
      "customer": {
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "product": {
        "id": 788,
        "name": "Produto Teste",
        "quantity": 1,
        "price": 97.00
      },
      "commission": {
        "amount": 9.70,
        "currency": "BRL"
      }
    }
  }'</code></pre>
                                    <button
                                        class="copy-btn"
                                    ></button>
                                </div>
                            </div>
                        </section>

                        <!-- Error Codes Section -->
                        <section id="errors" class="doc-section">
                            <h2>Códigos de Erro</h2>
                            <div class="content-card">
                                <p>A API retorna os seguintes códigos de status HTTP:</p>

                                <div class="errors-table">
                                    <div class="table-header">
                                        <span>Código</span>
                                        <span>Status</span>
                                        <span>Descrição</span>
                                    </div>
                                    <div v-for="error in errorCodes" :key="error.code" class="table-row">
                    <span class="error-code" :class="{ success: error.code === 200, error: error.code >= 400 }">
                      {{ error.code }}
                    </span>
                                        <span class="error-status">{{ error.status }}</span>
                                        <span class="error-description">{{ error.description }}</span>
                                    </div>
                                </div>

                                <h4>Exemplo de Resposta de Erro</h4>
                                <div class="code-block">
                  <pre><code>{
  "error": {
    "code": 400,
    "message": "Bad Request",
    "details": "O campo 'orderId' é obrigatório",
    "timestamp": "2025-01-20T10:30:00Z"
  }
}</code></pre>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>

        <!-- API Keys Modal -->
        <div v-if="showApiKeyModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Suas Chaves da API</h3>
                    <button @click="showApiKeyModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="warning-box">
                        <span class="warning-icon">⚠️</span>
                        <div>
                            <strong>Importante:</strong> Sua Secret Key só é exibida uma vez. Guarde em um local seguro!
                        </div>
                    </div>

                    <div class="key-group">
                        <label>Public Key</label>
                        <div class="key-input">
                            <input type="text" :value="apiKeys.public_key" readonly />
                            <button
                                @click="copyToClipboard(apiKeys.public_key, 'public')"
                                :class="{ copied: copiedField === 'public' }"
                            >
                                {{ copiedField === 'public' ? '✓' : '📋' }}
                            </button>
                        </div>
                    </div>

                    <div class="key-group">
                        <label>Secret Key</label>
                        <div class="key-input">
                            <input type="text" :value="apiKeys.secret_key" readonly />
                            <button
                                @click="copyToClipboard(apiKeys.secret_key, 'secret')"
                                :class="{ copied: copiedField === 'secret' }"
                            >
                                {{ copiedField === 'secret' ? '✓' : '📋' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="showApiKeyModal = false" class="btn-primary">
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.api-documentation {
    min-height: 100vh;
    background-color: var(--background-color);
}

.documentation-main {
}

.documentation-content {
    padding: var(--spacing-lg);
    max-width: 1400px;
    margin: 0 auto;
}

/* Header */
.doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.header-info {
    position: relative;
}

.header-info h1 {
    margin: 0;
    font-size: 32px;
    color: var(--text-primary);
    background: linear-gradient(135deg, #1a1f2e 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    margin: var(--spacing-xs) 0 var(--spacing-md);
    color: var(--text-secondary);
    font-size: 16px;
}

.version-badge {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

/* Layout */
.documentation-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: var(--spacing-xl);
}

/* Sidebar */
.doc-sidebar {
    position: sticky;
    top: var(--spacing-lg);
    height: fit-content;
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
}

.sidebar-header h3 {
    margin: 0 0 var(--spacing-md);
    font-size: 16px;
    color: var(--text-primary);
}

.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--border-radius-md);
    transition: all 0.3s ease;
    font-size: 14px;
    margin-bottom: 4px;
}

.nav-link:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.nav-link.active {
    background-color: var(--primary-color);
    color: white;
}

.nav-icon {
    font-size: 16px;
}

/* Content */
.doc-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
}

.doc-section {
    padding: var(--spacing-xl);
    border-bottom: 1px solid var(--border-color);
}

.doc-section:last-child {
    border-bottom: none;
}

.doc-section h2 {
    margin: 0 0 var(--spacing-lg);
    font-size: 24px;
    color: var(--text-primary);
}

.content-card {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.content-card:last-child {
    margin-bottom: 0;
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
}

.feature-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.feature-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    background-color: rgba(102, 126, 234, 0.1);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.feature-item h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.feature-item p {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--text-secondary);
}

/* Code Blocks */
.code-block {
    position: relative;
    background-color: #1a1f2e;
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    margin: var(--spacing-md) 0;
    overflow-x: auto;
}

.code-block.large {
    max-height: 400px;
    overflow-y: auto;
}

.code-block pre {
    margin: 0;
    color: #e6e6e6;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
}

.copy-btn {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
}

.copy-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.copy-btn.copied {
    background-color: #4CAF50;
    border-color: #4CAF50;
}

/* Endpoint Info */
.endpoint-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background-color: var(--card-background);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    margin: var(--spacing-md) 0;
}

.method-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.method-badge.post {
    background-color: #4CAF50;
    color: white;
}

.endpoint-url {
    flex-grow: 1;
    font-family: monospace;
    font-size: 14px;
    color: var(--text-primary);
}

/* Tables */
.fields-table,
.errors-table {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    margin: var(--spacing-md) 0;
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 120px 100px 2fr;
    background-color: var(--primary-color);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
}

.errors-table .table-header {
    grid-template-columns: 80px 150px 2fr;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 120px 100px 2fr;
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    align-items: center;
}

.errors-table .table-row {
    grid-template-columns: 80px 150px 2fr;
}

.table-row:last-child {
    border-bottom: none;
}

.table-row:nth-child(even) {
    background-color: rgba(102, 126, 234, 0.05);
}

.field-name {
    font-family: monospace;
    font-size: 13px;
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--text-secondary);
}

.field-type {
    font-size: 12px;
    color: var(--text-secondary);
}

.field-required {
    font-size: 12px;
    color: var(--text-secondary);
}

.field-required.required {
    color: #d9534f;
    font-weight: 600;
}

.field-description {
    font-size: 13px;
    color: var(--text-secondary);
}

.error-code {
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
}

.error-code.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
}

.error-code.error {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

/* Field Groups */
.field-group {
    margin: var(--spacing-xl) 0;
}

.field-group h4 {
    margin: 0 0 var(--spacing-md);
    font-size: 16px;
    color: var(--text-primary);
}

/* Warning and Info Boxes */
.warning-box,
.info-box {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    margin: var(--spacing-md) 0;
}

.warning-box {
    background-color: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.info-box {
    background-color: rgba(23, 162, 184, 0.1);
    border: 1px solid rgba(23, 162, 184, 0.3);
}

.warning-icon,
.info-icon {
    font-size: 20px;
    margin-top: 2px;
}

/* Testing Tools */
.testing-tools {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
}

.tool-card {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    text-align: center;
}

.tool-card h4 {
    margin: 0 0 var(--spacing-sm);
    font-size: 16px;
    color: var(--text-primary);
}

.tool-card p {
    margin: 0 0 var(--spacing-md);
    font-size: 14px;
    color: var(--text-secondary);
}

/* Modal */
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
    max-width: 600px;
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
    font-size: 20px;
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

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
}

.key-group {
    margin-bottom: var(--spacing-lg);
}

.key-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: 14px;
    color: var(--text-secondary);
}

.key-input {
    display: flex;
    gap: var(--spacing-sm);
}

.key-input input {
    flex-grow: 1;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-family: monospace;
    font-size: 14px;
}

.key-input button {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all 0.3s ease;
}

.key-input button:hover {
    background-color: #365CC5;
}

.key-input button.copied {
    background-color: #4CAF50;
}

/* Buttons */
.btn-primary,
.btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

/* Responsive */
@media (max-width: 1200px) {
    .documentation-layout {
        grid-template-columns: 1fr;
    }

    .doc-sidebar {
        position: static;
    }

    .nav-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
}

@media (max-width: 768px) {
    .documentation-main {
        margin-left: 0;
    }

    .doc-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .testing-tools {
        grid-template-columns: 1fr;
    }

    .table-header,
    .table-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-xs);
    }

    .table-header span,
    .table-row span {
        padding: 4px 0;
    }

    .endpoint-info {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>