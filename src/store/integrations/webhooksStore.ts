import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/apiClient'

interface Webhook {
    id: number
    name: string
    token: string
    platform: string
    created_at: string
    updated_at: string
}

type WebhookStep = 'platforms' | 'config' | 'success'

export const useWebhooksStore = defineStore('webhooks', () => {
    const errorWebhook = ref<string | null>(null)
    const showWebhookModal = ref(false)

    const createdWebhook = ref<Webhook | null>(null)
    const editedWebhook = ref<Webhook | null>(null)
    const listWebhooks = ref<Webhook[] | null>(null)

    const webhookStep = ref<WebhookStep>('platforms')
    const selectedPlatform = ref('')
    const webhookId = ref('')
    const webhookName = ref('')
    const webhookToken = ref('')
    const webhookUrl = ref('')
    const isLoading = ref(false)
    const loadingWebhookList = ref(false)
    const listPlatforms = ref<any[]>([])

    const searchPlatform = ref('')
    const filteredPlatforms = computed(() =>
        listPlatforms.value?.filter(platform =>
            platform.name.toLowerCase().includes(searchPlatform.value.toLowerCase())
        )
            .map(platform => ({
                label: platform.name,
                value: platform.id
            }))
    )

    const selectPlatform = (platform: any) => {
        selectedPlatform.value = platform.value
        webhookStep.value = 'config'
    }

    const submitWebhook = async () => {
        isLoading.value = true
        errorWebhook.value = null
        createdWebhook.value = null

        try {
            const response = await apiClient.post('/webhooks', {
                name: webhookName.value,
                platform_id: selectedPlatform.value
            })
            createdWebhook.value = response.data.data
            webhookToken.value = createdWebhook.value.token
            webhookStep.value = 'success'
            resetWebhookModal(false)
            getWebhooks()
        } catch (err: any) {
            errorWebhook.value = err.response?.data?.message || 'Erro ao criar webhook'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const submitUpdateWebhook = async () => {
        if (!webhookName.value) return

        isLoading.value = true
        errorWebhook.value = null
        editedWebhook.value = null

        try {
            const response = await apiClient.put(`/webhooks/${webhookId.value}`, {
                name: webhookName.value
            })
            editedWebhook.value = response.data.data
            resetWebhookModal(false)
            getWebhooks()
        } catch (err: any) {
            errorWebhook.value = err.response?.data?.message || 'Erro ao editar webhook'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteWebhook = async (item: Webhook) => {
        isLoading.value = true
        errorWebhook.value = null

        try {
            await apiClient.delete(`/webhooks/${item.id}`)
            getWebhooks()
        } catch (err: any) {
            errorWebhook.value = err.response?.data?.message || 'Erro ao excluir webhook'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const getWebhooks = async () => {
        listWebhooks.value = null
        loadingWebhookList.value = true
        errorWebhook.value = null

        try {
            const response = await apiClient.get('/webhooks')
            listWebhooks.value = response.data.data
        } catch (err: any) {
            errorWebhook.value = err.response?.data?.message || 'Erro ao listar webhooks'
            throw err
        } finally {
            loadingWebhookList.value = false
        }
    }

    const getPlatforms = async () => {
        try {
            const response = await apiClient.get('/platforms')
            listPlatforms.value = response.data.data
        } catch (err: any) {
            errorWebhook.value = err.response?.data?.message || 'Erro ao listar plataformas'
            throw err
        }
    }

    const resetWebhookModal = (showModal: boolean) => {
        webhookStep.value = 'platforms'
        selectedPlatform.value = ''
        webhookUrl.value = ''
        webhookName.value = ''
        webhookToken.value = ''
        webhookId.value = ''
        showWebhookModal.value = showModal
    }

    const editWebhook = (item: Webhook) => {
        webhookStep.value = 'config'
        createdWebhook.value = null
        webhookName.value = item.name
        webhookUrl.value = item.url
        webhookToken.value = item.token
        webhookId.value = item.id.toString()
        showWebhookModal.value = true
    }

    return {
        webhookUrl,
        getPlatforms,
        selectPlatform,
        webhookId,
        showWebhookModal,
        isLoading,
        errorWebhook,
        createdWebhook,
        editedWebhook,
        listWebhooks,
        loadingWebhookList,
        submitWebhook,
        editWebhook,
        submitUpdateWebhook,
        deleteWebhook,
        getWebhooks,
        webhookStep,
        selectedPlatform,
        webhookName,
        webhookToken,
        resetWebhookModal,
        searchPlatform,
        filteredPlatforms
    }
})
