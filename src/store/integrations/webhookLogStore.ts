import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/apiClient'
import { useRoute } from 'vue-router'

export interface WebhookLog {
    id: string
    timestamp: Date
    eventType: string
    status: 'success' | 'error' | 'pending' | 'timeout'
    httpCode: number
    duration: number
    attempts: number
    maxAttempts: number
    requestUrl: string
    requestHeaders: Record<string, string>
    payload: any
    responseMessage: string
    responseHeaders: Record<string, string>
    responseBody: string
    responseSize: number
    nextRetry: Date | null
}

export interface Webhook {
    id: string
    name: string
    url: string
    status: 'active' | 'inactive'
    events: string[]
    requests24h: number
    successRate: number
}

export const useWebhookStore = defineStore('webhookLogs', () => {
    // State
    const webhooks = ref<Webhook[]>([])
    const webhookLogs = ref([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const currentWebhook = ref<Webhook | null>(null)
    const route = useRoute();
    // Computed
    const activeWebhooks = computed(() => {
        return webhooks.value.filter(webhook => webhook.status === 'active')
    })


    const fetchWebhookLogs = async (webhookId: string) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.get(`/webhooks-logs/${route.params.id}`)
            webhookLogs.value = response.data.data;

        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao carregar logs do webhook'
            console.error('Error fetching webhook logs:', err)

            // Fallback para dados mock em caso de erro
            loadMockWebhookLogs(webhookId)
        } finally {
            isLoading.value = false
        }
    }

    const testWebhook = async (webhookId: string, payload: any) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.post(`/webhooks/${webhookId}/test`, payload)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao testar webhook'
            console.error('Error testing webhook:', err)
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    const resendWebhookLog = async (logId: string) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await api.post(`/webhook-logs/${logId}/resend`)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao reenviar webhook'
            console.error('Error resending webhook:', err)
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    // Initialize store
    fetchWebhookLogs()

    return {
        // State
        webhooks,
        webhookLogs,
        isLoading,
        error,
        currentWebhook,

        // Computed
        activeWebhooks,

        // Actions
        fetchWebhookLogs,
        testWebhook,
        resendWebhookLog,
        clearError,
    }
})