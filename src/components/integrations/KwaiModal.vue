<script setup lang="ts">
import { useKwaiStore } from '@/store/integrations/kwaiStore'
import { usePixelStore } from '@/store/integrations/pixelStore'
import {onMounted} from "vue";

const kwaiStore = useKwaiStore()
const pixel = usePixelStore()

function close() {
    kwaiStore.resetKwaiModal(false)
}

onMounted(() => {
    kwaiStore.getPlatforms()
    pixel.getPixelsKwai()
})

function copyToClipboard(text?: string) {
    if (text) navigator.clipboard.writeText(text)
}
</script>
<template>
    <div v-if="kwaiStore.showModal" class="modal">
        <div class="modal-content">
            <!-- Platform Selection Step -->
            <div v-if="kwaiStore.step === 'platforms'">
                <div class="modal-header">
                    <div>
                        <h3>Kwai</h3>
                        <p class="modal-subtitle">Selecione uma plataforma para começar</p>
                    </div>
                    <button @click="close" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="search-box">
                        <input
                            v-model="kwaiStore.searchPlatform"
                            type="text"
                            placeholder="Buscar por plataforma"
                            class="search-input"
                        />
                    </div>
                    <div class="platforms-grid">
                        <button
                            v-for="platform in kwaiStore.filteredPlatforms"
                            :key="platform.value"
                            class="platform-button"
                            @click="kwaiStore.selectPlatform(platform)"
                        >
                            {{ platform.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Configuration Step -->
            <div v-if="kwaiStore.step === 'config'">
                <div class="modal-header">
                    <div><h3>Configurar Kwai</h3></div>
                    <button
                        @click="kwaiStore.step = 'platforms'"
                        class="back-btn"
                        v-if="!kwaiStore.id"
                    >
                        ← Voltar
                    </button>
                    <button @click="kwaiStore.resetKwaiModal(false)" class="close-btn" v-else>
                        ×
                    </button>
                </div>
                <div class="modal-body">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label>Nome da integração</label>
                            <input
                                v-model="kwaiStore.name"
                                type="text"
                                class="form-input"
                                placeholder="Ex: Minha Loja"
                            />
                        </div>

                        <div class="form-group">
                            <label> Pixel </label>
                            <select
                                v-model="kwaiStore.pixel_id"
                                :disabled="pixel.loading"
                                :class="['form-select', { 'animate-pulse text-gray-400': pixel.loading }]"
                            >
                                <option v-if="pixel.loading" disabled selected>Carregando...</option>

                                <template v-else>
                                    <option v-if="pixel.pixelKwaiToSelect.length === 0" disabled :value="' '">
                                        Nenhum pixel cadastrado
                                    </option>
                                    <option
                                        v-for="pixel in pixel.pixelKwaiToSelect"
                                        :key="pixel.value"
                                        :value="pixel.value"
                                    >
                                        {{ pixel.label }}
                                    </option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <button
                        class="btn-primary w-full"
                        :disabled="!kwaiStore.name || kwaiStore.isLoading"
                        @click="kwaiStore.submitKwai"
                        v-if="!kwaiStore.id"
                    >
                        {{ kwaiStore.isLoading ? 'Criando...' : 'Criar Integração' }}
                    </button>
                    <button
                        v-else
                        class="btn-primary w-full"
                        :disabled="!kwaiStore.name || kwaiStore.isLoading"
                        @click="kwaiStore.submitUpdateKwai"
                    >
                        {{ kwaiStore.isLoading ? 'Salvando...' : 'Salvar' }}
                    </button>
                </div>
            </div>

            <!-- Success Step -->
            <div v-if="kwaiStore.step === 'success'">
                <div class="modal-header">
                    <div>
                        <h3>Kwai Criado!</h3>
                        <p class="modal-subtitle">Copie o token abaixo</p>
                    </div>
                    <button @click="kwaiStore.resetKwaiModal(false)" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="success-message">
                        <span class="success-icon">✓</span>
                        <p>Kwai criado com sucesso!</p>
                    </div>
                    <div class="token-box">
                        <p class="token-label">URL:</p>
                        <div class="token-value">
                            {{ kwaiStore.created?.url }}
                            <button class="copy-btn" @click="copyToClipboard(kwaiStore.created?.url)">
                                Copiar
                            </button>
                        </div>
                    </div>
                    <button class="btn-primary w-full" @click="kwaiStore.resetKwaiModal(false)">
                        Concluir
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* seus estilos aqui */
</style>
