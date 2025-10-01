import { defineStore } from 'pinia'
import apiClient from '@/services/apiClient'

export const useReportsStore = defineStore('reports', {
    state: () => ({
        reportData: [],
        loading: false,
    }),
    actions: {
        async fetchReports({ period, ad_account_id, product_id }) {
            this.loading = true
            try {
                const response = await apiClient.get('/report', {
                    params: {
                        period,
                        ad_account_id,
                        product_id,
                    }
                })
                this.reportData = response.data
            } catch (error) {
                console.error('Erro ao buscar relatórios:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
