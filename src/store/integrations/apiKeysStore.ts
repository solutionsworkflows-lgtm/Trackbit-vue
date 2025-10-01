import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiClient'

interface ApiKey {
    id: number
    name: string
    public_key: string
    secret_key: string
    created_at: string
    updated_at: string
}

export const useApiKeysStore = defineStore('apiKeys', () => {
    // States
    const apiKeyName = ref('')
    const apiKeyId = ref<number | null>(null)

    const createdKey = ref<ApiKey | null>(null)
    const editedApiKey = ref<ApiKey | null>(null)
    const listApiKeys = ref<ApiKey[] | null>(null)

    const loadingListKeys = ref(false)
    const isSaving = ref(false)
    const error = ref<string | null>(null)

    const showWebhookAPIModal = ref(false)
    const showMenu = ref('')

    // Actions
    async function getApiKeys() {
        listApiKeys.value = null
        loadingListKeys.value = true
        error.value = null

        try {
            const response = await apiClient.get('/api-keys')
            listApiKeys.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao listar chaves'
            throw err
        } finally {
            loadingListKeys.value = false
        }
    }

    async function createApiKey(name: string) {
        isSaving.value = true
        error.value = null
        createdKey.value = null

        try {
            const response = await apiClient.post('/api-keys', { name })
            createdKey.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao criar chave'
            throw err
        } finally {
            isSaving.value = false
        }
    }

    async function editApiKey(name: string, id: number) {
        isSaving.value = true
        error.value = null
        editedApiKey.value = null

        try {
            const response = await apiClient.put(`/api-keys/${id}`, { name })
            editedApiKey.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao editar chave'
            throw err
        } finally {
            isSaving.value = false
        }
    }

    async function deleteApiKey(id: number) {
        isSaving.value = true
        error.value = null

        try {
            await apiClient.delete(`/api-keys/${id}`)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao excluir chave'
            throw err
        } finally {
            isSaving.value = false
        }
    }

    async function submitApiKey() {
        if (!apiKeyName.value) return
        try {
            await createApiKey(apiKeyName.value)
            await getApiKeys()
        } catch {
            console.error('Erro ao salvar chave:', error.value)
        }
    }

    async function submitUpdateApiKey() {
        if (!apiKeyName.value || apiKeyId.value === null) return
        try {
            await editApiKey(apiKeyName.value, apiKeyId.value)
            resetApiModal(false)
            await getApiKeys()
        } catch {
            console.error('Erro ao editar chave:', error.value)
        }
    }

    function editKey(item: ApiKey) {
        createdKey.value = null
        apiKeyName.value = item.name
        apiKeyId.value = item.id
        showWebhookAPIModal.value = true
    }

    async function deleteKey(item: ApiKey) {
        await deleteApiKey(item.id)
        await getApiKeys()
    }

    function resetApiModal(showModal: boolean) {
        createdKey.value = null
        apiKeyName.value = ''
        apiKeyId.value = null
        showWebhookAPIModal.value = showModal
        showMenu.value = ''
    }

    function toggleMenu(keyId: string) {
        showMenu.value = showMenu.value === keyId ? '' : keyId
    }

    return {
        // states
        apiKeyName,
        apiKeyId,
        createdKey,
        editedApiKey,
        listApiKeys,
        loadingListKeys,
        isSaving,
        error,
        showWebhookAPIModal,
        showMenu,
        toggleMenu,

        // actions
        createApiKey,
        editApiKey,
        deleteApiKey,
        getApiKeys,
        submitApiKey,
        submitUpdateApiKey,
        editKey,
        deleteKey,
        resetApiModal
    }
})
