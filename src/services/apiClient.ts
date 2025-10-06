import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { useUsersDashboardStore } from '@/store/usersDashboardStore'
import Cookies from 'js-cookie'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sua-api.com/api',
    withCredentials: true,
    withXSRFToken: true,
})

// Intercepta requisições para adicionar `code` da query string
api.interceptors.request.use(config => {
    const urlParams = new URLSearchParams(window.location.search)
    const fallbackCode = urlParams.get('code')

    const dashboardStore = useUsersDashboardStore()
    const code = dashboardStore.selectedDashboardCode || fallbackCode

    const token = Cookies.get(import.meta.env.VITE_API_TOKEN_KEY);

    if (token) {
        config.headers[`X-${import.meta.env.VITE_API_TOKEN_KEY}`] = decodeURIComponent(token);
    }

    if (code) {
        config.params = {
            ...(config.params || {}),
            code,
        }
    }

    return config
})

// Intercepta respostas para lidar com erros de autenticação
api.interceptors.response.use(
    response => response,
    error => {
        const authStore = useAuthStore()

        if (error.response && [401, 419].includes(error.response.status)) {
            authStore.logout()
            window.location.href = '/auth/login'
        }

        return Promise.reject(error)
    }
)

export default api
