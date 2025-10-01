import { defineStore } from 'pinia'
import axios from 'axios'
import api from "@/services/apiClient.ts";
import { useToast } from 'vue-toastification'
const toast = useToast()
export const useReferralStore = defineStore('referral', {
    state: () => ({
        dashboard: null as null | {
            active_referrals: number,
            total_earned: number,
            available_balance: number,
            pending_balance: number,
            referral_link: string
        },
        extract: [] as Array<{
            id: number,
            type: 'commission' | 'withdraw',
            amount: number,
            status: 'pending' | 'available' | 'paid',
            created_at: string
        }>,
        loading: false,
        error: null as null | string,
    }),

    actions: {
        async fetchDashboard() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/referral/dashboard')
                this.dashboard = response.data
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Erro ao carregar o dashboard'
            } finally {
                this.loading = false
            }
        },

        async fetchExtract() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/referral/extract')
                this.extract = response.data
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Erro ao carregar o extrato'
            } finally {
                this.loading = false
            }
        },

        async requestWithdrawal(pixKey, amount: number) {
            this.loading = true
            this.error = null
            try {
                await api.post('/referral/withdraw', { pix: pixKey, amount: amount })
                toast.success('Saque solicitado com sucesso.')
                await this.fetchDashboard()
                await this.fetchExtract()
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Erro ao solicitar saque'
                console.error(e)
                toast.error('Erro ao solicitar saque.')
            } finally {
                this.loading = false
            }
        }
    }
})
