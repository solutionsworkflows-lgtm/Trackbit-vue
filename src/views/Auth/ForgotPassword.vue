<script setup lang="ts">
import {ref, watch, nextTick, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import api from '../../services/apiClient.ts'
import { useToast } from 'vue-toastification'
import { vMaska } from 'maska'

const toast = useToast()
const router = useRouter()
const showPassword = ref(false)
const showConfirmPassword = ref(false)

import { useAuthStore } from "@/store/authStore";
const authStore = useAuthStore()

const schema = yup.object({
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
})
const isLoading = ref(false)

onMounted(async () => {
});
const onSubmit = async (values: any) => {
    try {
        isLoading.value = true

        let body = {
            email: values.email
        }

        await authStore.forgotPassword(body)
        toast.success('Email de recuperação enviado com sucesso!')
    } catch (error) {
        console.log(error)
        toast.error('Erro ao recuperar conta. Verifique seus dados.')
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
                    <img src="../../assets/logo.png" alt="Logo" class="auth-logo"/>
                </div>

                <h1>Recuperar Conta</h1>

                <Form :validation-schema="schema" @submit="onSubmit" class="auth-form">
                    <!-- Email -->
                    <div class="form-group">
                        <label>E-mail</label>
                        <Field name="email" type="email" placeholder="Seu e-mail" class="form-input"/>
                        <ErrorMessage name="email" class="error-message"/>
                    </div>


                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Carregando...</span>
                        <span v-else>Recuperar senha</span>
                    </button>
                </Form>

                <div class="auth-footer">
                    <p>
                        <router-link to="/auth/login" class="auth-link">
                            Fazer login
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

.password-input {
    position: relative;
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

.checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);
    cursor: pointer;
}

.checkbox-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.4;
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