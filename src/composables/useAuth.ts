import { ref } from 'vue'
import Cookies from 'js-cookie'

// ✅ fora da função → singleton reativo
const isLogged = ref(false)

const checkAuth = () => {
    const token = Cookies.get(import.meta.env.VITE_API_TOKEN_KEY)
    const user = localStorage.getItem('user')
    isLogged.value = !!(token && user)
}

// Executa ao carregar
checkAuth()

export const useAuth = () => ({
    isLogged,
    checkAuth
})
