<script setup lang="ts">
import {ref, computed, onBeforeMount, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import { useAuthStore } from "@/store/authStore";
const { setUser, setToken, logout, login, getUserLoggedData } = useAuthStore()
import Cookies from 'js-cookie'

import { useAuth } from '@/composables/useAuth'
const { checkAuth } = useAuth()

const toast = useToast()
const router = useRouter()
const showPassword = ref(false)
const rememberMe = ref(false)

const schema = yup.object({
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha é obrigatória')
})

const isLoading = ref(false)
onMounted(() => {
    checkAuth()
})

const onSubmit = async (values: any) => {
    isLoading.value = true
    try {
        await login(values.email, values.password)

        const { id, name, avatar, email, facebook_access_token } = await getUserLoggedData()

        setUser({ id, name, avatar, email,facebook_access_token })
        const token = Cookies.get(import.meta.env.VITE_API_TOKEN_KEY)
        setToken(token)

        isLoading.value = false
        checkAuth()
        await router.push('/dashboard')
    } catch (error) {
        console.log(error)
        toast.error('Erro ao fazer login. Verifique seus dados.')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="logo-container">
                    <img src="../../assets/logo.png" alt="Logo" class="auth-logo" />
                </div>

                <h1>Bem-vindo de volta!</h1>
                <p class="subtitle">Entre com sua conta para continuar</p>

                <Form :validation-schema="schema"  @submit="onSubmit" class="auth-form">
                    <!-- Email -->
                    <div class="form-group">
                        <label>E-mail</label>
                        <Field name="email" type="email" placeholder="Seu e-mail" class="form-input" />
                        <ErrorMessage name="email" class="error-message" />
                    </div>

                    <!-- Senha -->
                    <div class="form-group">
                        <label>Senha</label>
                        <div class="password-input">
                            <Field
                                :type="showPassword ? 'text' : 'password'"
                                name="password"
                                placeholder="Sua senha"
                                class="form-input"
                            />
                            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                            </button>
                        </div>
                        <ErrorMessage name="password" class="error-message" />
                    </div>

                    <!-- Lembrar-me + Esqueci senha -->
                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" v-model="rememberMe" />
                            <span class="checkbox-label">Lembrar-me</span>
                        </label>
                        <router-link to="/auth/forgot-password" class="forgot-password">
                            Esqueceu a senha?
                        </router-link>
                    </div>

                    <!-- Botão de envio -->
                    <button type="submit" class="btn-primary mt-5" :disabled="isLoading">
                        <span v-if="isLoading">Carregando...</span>
                        <span v-else>Entrar</span>
                    </button>
                </Form>

                <div class="auth-footer">
                    <p>
                        Não tem uma conta?
                        <router-link to="/auth/register" class="auth-link">
                            Criar conta
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #3e4a75 0%, #1b355d 40%, #002859 100%);
    padding: var(--spacing-md);
}

.auth-container {
    width: 100%;
    max-width: 420px;
}

.auth-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-lg);
}

.logo-container {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}

.auth-logo {
    margin: auto;
    height: 37px;
    width: auto;
    margin-top: 25px;
}

h1 {
    text-align: center;
    margin: 0;
    font-size: 1.75rem;
    color: var(--text-primary);
}

.subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin: var(--spacing-xs) 0 var(--spacing-xl);
}

.auth-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-group label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.form-input {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    transition: all 0.2s ease;
    width: 100%;
}

.form-input:focus {
    outline-width: 0;
}

.password-input {
    position: relative;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
    -webkit-text-fill-color: black;
}

.toggle-password {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
}

.checkbox-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.forgot-password {
    font-size: 0.875rem;
    color: var(--primary-color);
    text-decoration: none;
}

.forgot-password:hover {
    text-decoration: underline;
}

.btn-primary {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: #2f354f;
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.auth-footer {
    text-align: center;
    margin-top: var(--spacing-xl);
}

.auth-footer p {
    color: var(--text-secondary);
    margin: 0;
}

.auth-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.auth-link:hover {
    text-decoration: underline;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
}
</style>