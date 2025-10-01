import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { api } from '@/services/apiClient'
import { apiLogin } from '@/services/apiLoginClient'
import axios from 'axios';

import { useAuth } from '@/composables/useAuth'
const { checkAuth } = useAuth()

const USER_STORAGE_KEY = 'user'
const TOKEN_COOKIE_KEY = import.meta.env.VITE_API_TOKEN_KEY

export const useAuthStore = defineStore('authStore', () => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    const storedToken = Cookies.get(TOKEN_COOKIE_KEY)

    const user = ref(storedUser ? safeParseJSON(storedUser) : null)
    const token = ref(storedToken || null)

    // Função para armazenar o usuário
    function setUser(userData) {
        user.value = userData
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    }

    // Função para armazenar o token
    function setToken(tokenData) {
        token.value = tokenData
        Cookies.set(TOKEN_COOKIE_KEY, tokenData)
    }

    // Função de logout
    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem(USER_STORAGE_KEY)
        Cookies.remove(TOKEN_COOKIE_KEY)
    }

    // Função de login com validação do token CSRF
    const login = async (email, password) => {
        try {
            logout()

            // Isso define o cookie 'XSRF-TOKEN' que será usado automaticamente
            await apiLogin.get('/sanctum/csrf-cookie',{
                withCredentials: true,
                baseURL: import.meta.env.VITE_API_BASE_URL_DOMAIN
            })

            // Faz o login (cookie será setado)
            const { data } = await apiLogin.post(
                '/login',
                { email, password }
            )

            setUser(data.user)
            return data
        } catch (error) {
            if (error.response) {
                console.error('Erro na resposta do servidor:', error.response.status, error.response.data)
            } else if (error.request) {
                console.error('Nenhuma resposta recebida:', error.request)
            } else {
                console.error('Erro na configuração da requisição:', error.message)
            }
            throw new Error('Login failed')
        }
    }

    const register = async (body) => {
        try {
            logout()

            // Isso define o cookie 'XSRF-TOKEN' que será usado automaticamente
            await axios.get('/sanctum/csrf-cookie',{
                withCredentials: true,
                baseURL: import.meta.env.VITE_API_BASE_URL_DOMAIN
            })

            // Faz o login (cookie será setado)
            const { data } = await api.post(
                '/register',
                body
            )

            return data
        } catch (error) {
            if (error.response) {
                console.error('Erro na resposta do servidor:', error.response.status, error.response.data)
            } else if (error.request) {
                console.error('Nenhuma resposta recebida:', error.request)
            } else {
                console.error('Erro na configuração da requisição:', error.message)
            }
            throw new Error('Register failed')
        }
    }

    const forgotPassword = async (body) => {
        try {
            const data = await axios.post('/api/forgot-password', body, {
                withCredentials: true,
                    baseURL: import.meta.env.VITE_API_BASE_URL_DOMAIN
            })
            return data
        } catch (error) {
            if (error.response) {
                console.error('Erro na resposta do servidor:', error.response.status, error.response.data)
            } else if (error.request) {
                console.error('Nenhuma resposta recebida:', error.request)
            } else {
                console.error('Erro na configuração da requisição:', error.message)
            }
            throw new Error('Register failed')
        }
    }

    const resetPassword = async (body: { email: string; token: string; password: string; password_confirmation: string }) => {
        try {
            const response = await api.post("/api/reset-password", body, {
                withCredentials: true,
                baseURL: import.meta.env.VITE_API_BASE_URL_DOMAIN
            });

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Erro ao redefinir senha.");
        }
    }

    // Função para pegar dados do usuário logado
    const getUserLoggedData = async () => {
        const { data } = await api.get('/user')
        return data
    }

    // Computed para verificar se o usuário está logado
    const isUserLogged = computed(() => !!user.value && !!token.value)

    return {
        user,
        token,
        isUserLogged,
        setUser,
        login,
        setToken,
        forgotPassword,
        resetPassword,
        getUserLoggedData,
        logout,
        register
    }
})

// Função para parse seguro de JSON
function safeParseJSON(json) {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}
