<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed  } from 'vue'
import Table from '@/components/common/Table.vue'
import { useKwaiStore } from '@/store/integrations/kwaiStore'
import KwaiModal from "./KwaiModal.vue"

const kwai = useKwaiStore()
const showCopiedToast = ref(false)
const activeTab = ref('list') // 'list' ou 'setup'

onMounted(() => {
    kwai.getKwais()
})

const scriptTag = computed(() => {
    if (!currentItem.value) {
        return `<scr` + `ipt
    src="https://www.wetrackr.com.br/kwai.min.js"
    data-token="SEU-UUID-AQUI"
    data-click-id-param="click_id">
</scr` + `ipt>`;
}

return  `<scr` + `ipt
    src="https://www.wetrackr.com.br/kwai.min.js"
    data-token="${currentItem.value.uuid}"
    data-click-id-param="click_id">
></scr` + `ipt>`;
})

const copyScript = (item) => {
    navigator.clipboard.writeText(scriptTag.value)
    showCopiedToast.value = true

    setTimeout(() => {
        showCopiedToast.value = false
    }, 3000)
}

const copyScriptUrl = (url) => {
    navigator.clipboard.writeText(url)
    showCopiedToast.value = true

    setTimeout(() => {
        showCopiedToast.value = false
    }, 3000)
}

const currentItem = ref(null)

function showSetup(item) {
    currentItem.value = item
    activeTab.value = 'setup'
}

const columns = [
    { label: 'Nome', value: 'name' },
    { label: 'Plataforma', value: 'platform_name' },
    { label: 'Pixel', value: 'pixel_name' },
    { label: 'URL Postback', value: 'url' }
];
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold text-white mb-1">Integração Kwai</h2>
                <p class="text-gray-400 text-sm">Rastreie suas vendas e otimize suas campanhas no Kwai</p>
            </div>
            <div class="flex space-x-3  gap-4">
                <button
                    class="btn-primary px-4 py-2 flex items-center gap-2"
                    @click="kwai.showModal = true"
                >
                    <span> Adicionar Kwai</span>
                </button>
            </div>
        </div>

        <!-- Lista de Kwais -->
        <div  class="">
            <div class="mb-4 flex justify-between items-right">
                <div class="text-sm text-gray-400">
                    {{ kwai.list?.length || 0 }} integrações ativas
                </div>
            </div>

            <div class="space-y-2">
                <div>
                    <div class="data-table">
                        <table>
                            <thead>
                            <tr>
                                <th v-for="col in columns" :key="col.id">
                                    {{ col.label }}
                                    <span v-if="col.info" class="info-icon" :title="col.info">ⓘ</span>
                                </th>
                                <th style="width: 100px">#</th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="kwai.loadingList">
                                <!-- Skeleton Rows -->
                                <tr v-for="n in columns.length  + 1" :key="'skeleton-' + n" class="animate-pulse">
                                    <td v-for="col in columns" :key="col.id">
                                        <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="kwai.list?.length > 0">
                                <tr v-for="(item, index) in kwai.list" :key="index">
                                    <td v-for="col in columns" :key="col.value">
                                        <span v-if="col.value == 'url'">
                                            <div class="relative">
                                                 <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto"><pre>{{ item[col.value] }}</pre> </div>
                                                <button @click="copyScriptUrl(item[col.value])"
                                                        class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                                                        title="Copiar código">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              stroke-width="2"
                                                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </span>
                                        <span v-else>
                                            {{ item[col.value] }}
                                        </span>
                                    </td>
                                    <td style="width: 300px">
                                        <button
                                            style="margin-right: 15px"
                                            class="btn-secondary px-4 py-2 "
                                            @click="showSetup(item)"
                                        > <span> Ver Instruções</span>
                                        </button>
                                        <button class="icon-btn" @click="kwai.editKwai" style="margin-right: 15px">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>

                                        <button class="icon-btn" @click="kwai.deleteKwai" style="">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr class="empty-row">
                                    <td :colspan="columns.length + 1" class="text-center py-4">
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Instruções de Configuração -->
        <div v-if="activeTab == 'setup'" class="modal">
            <div class="modal-content">
                <!-- Platform Selection Step -->
                <div>
                    <div class="modal-header">
                        <div>
                            <h3>Integração no funil</h3>
                        </div>
                        <button @click="activeTab = 'list'" class="close-btn">×</button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <div class="mb-6">
                                <!-- Passos de Instalação -->
                                <div class="space-y-8">
                                    <!-- Passo 1 -->
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                                            <h4 class="text-lg font-medium text-white">Insira o código abaixo em TODAS as páginas do funil</h4>
                                        </div>

                                        <div class="relative">
                                            <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-5">
                                                <pre>{{ scriptTag }}</pre>
                                            </div>
                                            <button
                                                @click="copyScript"
                                                class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                                                title="Copiar código"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>


                                    </div>

                                    <!-- Passo 2 -->
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                                            <h4 class="text-lg font-medium text-white">Configure o webhook abaixo na sua plataforma </h4>
                                        </div>

                                        <div class="bg-gray-900 rounded-lg p-4">
                                            <p class="text-white mb-2">Eventos que precisam ser ativados:</p>
                                            <ul class="list-disc list-inside text-gray-300 space-y-1 mb-4">
                                                <li>Venda aguardando pagamento</li>
                                                <li>Venda aprovada</li>
                                            </ul>

                                            <div class="font-mono text-sm text-gray-300 bg-gray-800 p-3 rounded">
                                                {{ currentItem?.url || 'Nenhuma URL selecionada' }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Passo 3 -->
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                                            <h4 class="text-lg font-medium text-white">Verifique a integração</h4>
                                        </div>

                                        <div class="bg-gray-900 rounded-lg p-4 text-gray-300">
                                            <p>Após configurar, faça uma venda de teste para verificar se os dados estão sendo rastreados corretamente.</p>
                                            <p class="mt-2">Você pode verificar os logs de webhook na seção de <a href="#" class="text-blue-400 hover:underline">Logs de Webhook</a>.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast de Copiado -->
    <div
        v-if="showCopiedToast"
        class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span>Código copiado para a área de transferência!</span>
    </div>

    <KwaiModal />
</template>

<style scoped>
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
    background: white;
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 500px;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #1a202c;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #718096;
    cursor: pointer;
}

.modal-body {
    padding: var(--spacing-lg);
}

.form-group {
    margin-bottom: var(--spacing-md);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: #4A5568;
    font-size: 14px;
}

.form-input,
.form-select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid #e2e8f0;
    border-radius: var(--border-radius-sm);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
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
    max-width: 900px;
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
.space-y-3 {
    margin: 1rem !important;
}
.modal-content {
    overflow-y: auto;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
}
</style>