<template>
    <div class="table-container">
        <!-- Estado de carregamento -->
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando dados...</p>
        </div>

        <!-- Estado vazio -->
        <div v-else-if="!items || items.length === 0" class="empty-state">
            <p>Nenhum registro encontrado</p>
        </div>

        <!-- Tabela com dados -->
        <div v-else class="data-table">
            <!-- Cabeçalho -->
            <div class="table-header">
                <div
                    v-for="column in columns"
                    :key="column.value"
                    class="header-cell"
                    :class="{ 'actions-cell': column.value === 'actions' }"
                >
                    {{ column.label }}
                </div>
                <div class="header-cell actions-cell" style="text-align: right;">Ações</div>
            </div>

            <!-- Linhas -->
            <div
                v-for="item in items"
                :key="item.id"
                class="table-row"
                :class="{ 'selected': selectedItemId === item.id }"
                @click="selectItem(item.id)"
            >
                <div
                    v-for="column in columns"
                    :key="column.value"
                    class="table-cell"
                >
                    <slot :name="column.value" :item="item">
                        <span class="cell-content">{{ item[column.value] }}</span>
                    </slot>
                </div>

                <div class="table-cell actions-cell">
                    <div class="actions-wrapper">
                        <button
                            class="action-btn copy-btn"
                            @click.stop="copyToClipboard(item)"
                            title="Copiar"
                        >
                            <i class="fa-solid fa-copy"></i>
                            <span class="btn-text">Copiar</span>
                        </button>

                        <button
                            class="action-btn copy-btn"
                            @click.stop="redirectToLogs(item.id)"
                            title="Logs"
                        >
                            <i class="fa-solid fa-folder-open"></i>
                            <span class="btn-text">Logs</span>
                        </button>

                        <div class="dropdown-wrapper">
                            <button
                                class="action-btn menu-btn"
                                @click.stop="toggleMenu(item.id)"
                                title="Mais ações"
                            >
                                <span class="btn-icon">⋮</span>
                            </button>

                            <div
                                v-if="openMenuId === item.id"
                                class="dropdown-menu"
                                @click.stop
                            >
                                <button
                                    class="menu-item edit-item"
                                    @click="$emit('edit', item)"
                                >
                                    <span class="item-icon"><i class="fa-solid fa-pen-to-square"></i></span>
                                    <span class="item-text">Editar</span>
                                </button>
                                <button
                                    class="menu-item delete-item"
                                    @click="$emit('delete', item)"
                                >
                                    <span class="item-icon"><i class="fa-solid fa-trash-can"></i></span>
                                    <span class="item-text">Excluir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notificação de cópia -->
        <div
            v-if="showCopyNotification"
            class="copy-notification"
        >
            <span class="notification-icon">✓</span>
            <span class="notification-text">Copiado para a área de transferência</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Item {
    id: number
    [key: string]: any
}

const props = defineProps<{
    items: Item[]
    columns: {
        label: string
        value: string
    }[]
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'edit', item: Item): void
    (e: 'delete', item: Item): void
}>()

const toast = useToast()
const openMenuId = ref<number | null>(null)
const selectedItemId = ref<number | null>(null)
const showCopyNotification = ref(false)

// Selecionar item
const selectItem = (id: number) => {
    selectedItemId.value = selectedItemId.value === id ? null : id
}

// Alternar menu de ações
const toggleMenu = (id: number) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

const redirectToLogs= (id) => {
    router.push(`/integrations/webhook/${id}/logs`)
}

// Copiar para área de transferência
const copyToClipboard = async (item: any) => {
    try {
        let textToCopy = ''

        if (item.url) {
            textToCopy = item.url
        } else if (item.public_key) {
            textToCopy = item.public_key
        } else {
            // Fallback para JSON se não houver campo específico
            textToCopy = JSON.stringify(item, null, 2)
        }

        await navigator.clipboard.writeText(textToCopy)

        // Mostrar notificação interna
        showCopyNotification.value = true
        setTimeout(() => {
            showCopyNotification.value = false
        }, 2000)

        // Mostrar toast
        //toast.success('Copiado com sucesso!')
    } catch (error) {
        toast.error('Erro ao copiar para a área de transferência')
        console.error('Erro ao copiar:', error)
    }
}

// Fechar menu ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
    if (openMenuId.value !== null) {
        const target = event.target as HTMLElement
        if (!target.closest('.dropdown-wrapper')) {
            openMenuId.value = null
        }
    }
}

// Fechar menu ao pressionar ESC
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && openMenuId.value !== null) {
        openMenuId.value = null
    }
}

// Limpar seleção ao mudar os itens
watch(() => props.items, () => {
    selectedItemId.value = null
    openMenuId.value = null
}, { deep: true })

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.table-container {
    position: relative;
    width: 100%;
    overflow: hidden;
}

/* Estados */
.loading-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.75rem;
    color: var(--text-secondary, #a0aec0);
}

.loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary-color, #4169E1);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.loading-state p,
.empty-state p {
    font-size: 0.875rem;
    margin: 0;
}

/* Tabela */
.data-table {
    width: 100%;
    border-radius: 0.75rem;
    overflow: hidden;
}

.table-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) 100px;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.75rem 1rem;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
}

.header-cell {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary, #a0aec0);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.table-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) 20px;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;
    cursor: pointer;
}

.table-row:last-child {
    border-bottom: none;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
}

.table-row:hover {
    background: rgba(255, 255, 255, 0.07);
}

.table-row.selected {
    background: rgba(65, 105, 225, 0.1);
    border-left: 3px solid var(--primary-color, #4169E1);
}

.table-cell {
    font-size: 0.875rem;
    color: var(--text-primary, #f7fafc);
    display: flex;
    align-items: center;
}

.cell-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.actions-cell {
    justify-content: flex-end;
}

.actions-wrapper {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

/* Botões */
.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary, #a0aec0);
    transition: all 0.2s ease;
    border-radius: 0.375rem;
    padding: 0.375rem;
}

.copy-btn {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.375rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    position: relative;
}

.copy-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary, #f7fafc);
}

.menu-btn {
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
}

.menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary, #f7fafc);
}

.btn-icon {
    font-size: 1rem;
}

.btn-text {
    font-size: 0.75rem;
    font-weight: 500;
}

/* Dropdown Menu */
.dropdown-wrapper {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: #1a202c;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 10;
    min-width: 10rem;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.menu-item {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.edit-item {
    color: var(--text-primary, #f7fafc);
}

.delete-item {
    color: #fc8181;
}

.delete-item:hover {
    background: rgba(252, 129, 129, 0.1);
}

.item-icon {
    font-size: 1rem;
}

.item-text {
    font-size: 0.875rem;
    font-weight: 500;
}

/* Notificação de cópia */
.copy-notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: rgba(72, 187, 120, 0.9);
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
    z-index: 50;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.notification-icon {
    font-weight: bold;
}

.notification-text {
    font-size: 0.875rem;
    font-weight: 500;
}

/* Responsividade */
@media (max-width: 768px) {
    .table-header,
    .table-row {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
    }

    .header-cell:not(:first-child):not(:last-child),
    .table-cell:not(:first-child):not(:last-child) {
        display: none;
    }

    .copy-notification {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>