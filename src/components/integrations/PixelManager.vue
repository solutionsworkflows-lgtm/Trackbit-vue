<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePixelStore } from '@/store/integrations/pixelStore'
import { onMounted } from 'vue'

import Table from '@/components/common/Table.vue'
import { useProductsStoreSelect } from '@/store/productsStore';
import DataGrid from "../common/DataGrid.vue";
const productsStore = useProductsStoreSelect();

const store = usePixelStore()
const {
    listPixels,
    pixelFormPixel,
    showPixelModal,
    loadingPixels
} = storeToRefs(store)

const {
    getPixels,
    submitPixel,
    submitUpdatePixel,
    editPixelItem,
    deletePixelItem,
    resetPixelModal
} = store

onMounted(() => {
    getPixels()
    productsStore.fetch()
})
</script>
<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-white">Pixels</h2>
            <button class="btn-primary" @click="resetPixelModal();showPixelModal = true">
                Adicionar Pixel
            </button>
        </div>

        <div class="space-y-2">
            <div>
                <Table
                    :loading="loadingPixels"
                    :data="listPixels ?? []"
                    :columns="[
                        { label: 'Nome', value: 'name' },
                        { label: 'Tipo', value: 'type' },
                        { label: 'Produto', value: 'product_name' },
                        { label: 'Id', value: 'pixel_id' },
                        { label: 'Token', value: 'token' }
                    ]"
                    @edit="editPixelItem"
                    @delete="deletePixelItem"
                    :showActionButtons="true"
                />
            </div>
        </div>

        <div v-if="showPixelModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h3>Adicionar Pixel</h3>
                        <p class="modal-subtitle">Configure seu pixel para rastreamento</p>
                    </div>
                    <button @click="showPixelModal = false" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nome</label>
                        <input v-model="pixelFormPixel.name" type="text" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>ID</label>
                        <input v-model="pixelFormPixel.pixel_id" type="text" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>Token</label>
                        <input v-model="pixelFormPixel.token" type="text" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>Tipo de Pixel</label>
                        <select v-model="pixelFormPixel.type" class="form-select">
                            <option value="FACEBOOK">Meta (Facebook)</option>
                            <option value="KWAI">Kwai</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>
                            Regra de Purchase
                            <span class="info-icon" title="Configuração para envio de eventos de compra">ⓘ</span>
                        </label>
                        <select v-model="pixelFormPixel.send_config" class="form-select">
                            <option value="approved_only">Enviar apenas vendas aprovadas</option>
                            <option value="approved_and_pending">Enviar todas as vendas</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>
                            Produto
                            <span class="info-icon" title="Produto associado ao pixel">ⓘ</span>
                        </label>
                        <select
                            v-model="pixelFormPixel.product_id"
                            :disabled="productsStore.loading"
                            :class="[
                            'form-select',
                                { 'animate-pulse text-gray-400': productsStore.loading }
                              ]"
                            >
                            <option v-if="productsStore.loading" disabled selected value="all">Carregando...</option>
                            <option v-else v-for="product in productsStore.productsSelect" :key="product.value" :value="product.value">
                                {{ product.label }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showPixelModal = false" class="btn-secondary">Cancelar</button>
                    <button
                        class="btn-primary"
                        :disabled="loadingPixels"
                        @click="submitPixel">{{ loadingPixels ? 'Salvando...' : 'Salvar Pixel' }}</button>
                </div>
            </div>
        </div>
        <!-- Modal -->
    </div>
</template>

<style scoped>
.modal-body {
    gap: 20px;
}
.form-group {
    margin-bottom: 0px;
}
.modal-content {
    overflow-y: auto;
}
</style>