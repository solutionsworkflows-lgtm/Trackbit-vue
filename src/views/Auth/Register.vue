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

const cpfCnpjRegex = /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)/;

let maskType = ref('###.###.###-##') // padrão CPF

const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
    cpf_cnpj: yup.string()
        .required('Campo obrigatório')
        .matches(cpfCnpjRegex, 'CPF ou CNPJ inválido'),
    password: yup.string()
        .required('Senha é obrigatória')
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial'),
    confirmPassword: yup.string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('password')], 'As senhas não conferem'),
    terms: yup.boolean().oneOf([true], 'Você precisa aceitar os termos de uso')
})
const isLoading = ref(false)

onMounted(async () => {
    // Salva o código em localStorage ou cookie
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        localStorage.setItem('ref_code', ref);
    }
});
const onSubmit = async (values: any) => {
    try {
        isLoading.value = true
        const refCode = localStorage.getItem('ref_code');

        let body = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
            cpf_cnpj: values.cpf_cnpj,
            ref_code: refCode
        }

        await authStore.register(body)

        toast.success('Cadastro realizado com sucesso!')
        router.push('/auth/login')
    } catch (error) {
        console.log(error)
        toast.error('Erro ao criar conta. Verifique seus dados.')
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

                <h1>Criar Conta</h1>
                <p class="subtitle">Preencha os dados abaixo para começar</p>

                <Form :validation-schema="schema" @submit="onSubmit" class="auth-form">
                    <!-- Nome -->
                    <div class="form-group">
                        <label>Nome completo</label>
                        <Field name="name" type="text" placeholder="Seu nome" class="form-input"/>
                        <ErrorMessage name="name" class="error-message"/>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <label>E-mail</label>
                        <Field name="email" type="email" placeholder="Seu e-mail" class="form-input"/>
                        <ErrorMessage name="email" class="error-message"/>
                    </div>

                    <div class="form-group">
                        <label>CPF/CNPJ</label>
                        <Field name="cpf_cnpj" v-slot="{ value, handleChange }">
                            <input
                                :value="value"
                                @input="(e) => {
                                  const val = e.target.value
                                  const digits = val.replace(/\D/g, '')
                                  maskType = digits.length > 11 ? '##.###.###/####-##' : '###.###.###-##'
                                  handleChange(val) // sincroniza com VeeValidate
                                }"
                                v-maska
                                :data-maska="maskType"
                                class="form-input"
                                placeholder="Digite seu CPF ou CNPJ"
                            />
                        </Field>

                        <ErrorMessage name="cpf_cnpj" class="error-message" />
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
                        <ErrorMessage name="password" class="error-message"/>
                    </div>

                    <!-- Confirmar senha -->
                    <div class="form-group">
                        <label>Confirmar senha</label>
                        <div class="password-input">
                            <Field
                                :type="showConfirmPassword ? 'text' : 'password'"
                                name="confirmPassword"
                                placeholder="Confirme sua senha"
                                class="form-input"
                            />
                            <button type="button" class="toggle-password"
                                    @click="showConfirmPassword = !showConfirmPassword">
                                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                            </button>
                        </div>
                        <ErrorMessage name="confirmPassword" class="error-message"/>
                    </div>

                    <!-- Aceite de termos -->
                    <div class="form-group">
                        <label class="checkbox-container">
                            <Field type="checkbox" name="terms"/>
                            <span class="checkbox-label">
                                Li e aceito os
                                <a href="https://www.wetrackr.com.br/temos-de-uso" target="_blank" class="auth-link">termos de uso</a>
                                e
                                <a href="https://www.wetrackr.com.br/privacy" target="_blank" class="auth-link">política de privacidade</a>
                              </span>
                        </label>
                        <ErrorMessage name="terms" class="error-message"/>
                    </div>

                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Carregando...</span>
                        <span v-else>Criar conta</span>
                    </button>
                </Form>

                <div class="auth-footer">
                    <p>
                        Já tem uma conta?
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