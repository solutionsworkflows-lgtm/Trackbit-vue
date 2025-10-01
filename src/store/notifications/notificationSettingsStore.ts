import { defineStore } from 'pinia'
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'

const toast = useToast()
export interface NotificationSettings {
    sendPending: boolean
    sendPaid: boolean
    display_value: 'sale' | 'commission' | 'both' | 'none'
    message_template: string
}

export const useNotificationSettingsStore = defineStore('notificationSettings', {
    state: () => ({
        settings: {
            send_pending_sales: false,
            send_paid_sales: true,
            display_value: 'both',
            message_template: ''
        } as NotificationSettings,
        loading: false,
        error: null as Error | null,
    }),

    actions: {
        async fetchSettings() {
            this.loading = true
            this.error = null
            try {
                const response = await apiClient.get('/notification-setting')
                this.settings = response.data
            } catch (err) {
                toast.error('Erro ao listar notificações')
                this.error = err as Error
            } finally {
                this.loading = false
            }
        },

        async saveSettings() {
            this.loading = true
            this.error = null
            try {
                await apiClient.put('/notification-setting', this.settings)
                toast.success('Notificações salvas com sucesso!')
            } catch (err) {
                this.error = err as Error
                toast.error('Erro ao salvar notificações')
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
