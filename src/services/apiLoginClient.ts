import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { useUsersDashboardStore } from '@/store/usersDashboardStore'

export const apiLogin = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sua-api.com/api',
    withCredentials: true,
    withXSRFToken: true,
})

// Intercepta requisições para adicionar `code` da query string
apiLogin.interceptors.request.use(config => {
    const urlParams = new URLSearchParams(window.location.search)
    const fallbackCode = urlParams.get('code')

    const dashboardStore = useUsersDashboardStore()
    const code = dashboardStore.selectedDashboardCode || fallbackCode

    const token = Cookies.get(import.meta.env.VITE_API_TOKEN_KEY);

    if (token) {
        request.headers[`X-${import.meta.env.VITE_API_TOKEN_KEY}`] = decodeURIComponent(token);
    }

    if (code) {
        config.params = {
            ...(config.params || {}),
            code,
        }
    }

    return config
})

export default apiLogin
