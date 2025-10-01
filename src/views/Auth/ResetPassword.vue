<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import { useAuthStore } from "@/store/authStore"

const toast = useToast()
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// Schema de validação
const schema = yup.object({
    password: yup.string().required('Senha é obrigatória').min(8, 'Senha mínima 8 caracteres'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password')], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória')
})

// Pegar token e email da URL
const token = ref<string | null>(null)
const email = ref<string | null>(null)

onMounted(() => {
    token.value = route.query.token as string
    email.value = route.query.email as string
})

const onSubmit = async (values: any) => {
    if (!token.value || !email.value) {
        toast.error('Link inválido ou expirado.')
        return
    }

    try {
        isLoading.value = true

        let body = {
            email: email.value,
            token: token.value,
            password: values.password,
            password_confirmation: values.password_confirmation
        }

        await authStore.resetPassword(body)
        toast.success('Senha redefinida com sucesso!')
        router.push('/auth/login')
    } catch (error) {
        console.log(error)
        toast.error('Erro ao redefinir senha. Verifique os dados e tente novamente.')
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

                <h1>Redefinir Senha</h1>

                <Form :validation-schema="schema" @submit="onSubmit" class="auth-form">
                    <!-- Nova Senha -->
                    <div class="form-group password-input">
                        <label>Nova Senha</label>
                        <Field
                            name="password"
                            type="password"
                            placeholder="Digite a nova senha"
                            class="form-input"/>
                        <ErrorMessage name="password" class="error-message"/>
                    </div>

                    <!-- Confirmação de Senha -->
                    <div class="form-group password-input">
                        <label>Confirmar Senha</label>
                        <Field
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirme a nova senha"
                            class="form-input"/>
                        <ErrorMessage name="password_confirmation" class="error-message"/>
                    </div>

                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        <span v-if="isLoading">Carregando...</span>
                        <span v-else>Redefinir senha</span>
                    </button>
                </Form>

                <div class="auth-footer">
                    <p>
                        <router-link to="/auth/login" class="auth-link">
                            Voltar para login
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Mantendo o mesmo estilo do template de recuperação de conta */
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #3e4a75 0%, #1b355d 40%, #002859 100%);
    padding: var(--spacing-md);
}

.auth-container { width: 100%; max-width: 420px; }
.auth-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-lg);
}

.logo-container { text-align: center; margin-bottom: var(--spacing-xl); }
.auth-logo { margin: auto; height: 37px; width: auto; margin-top: 25px; }

h1 { text-align: center; margin: 0; font-size: 1.75rem; color: var(--text-primary); }

.auth-form { display: flex; flex-direction: column; }

.form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
.form-group label { font-size: 0.875rem; color: var(--text-secondary); }

.form-input {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    transition: all 0.2s ease;
    width: 100%;
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

.btn-primary:hover { background-color: #365CC5; }

.auth-footer { text-align: center; margin-top: var(--spacing-xl); }
.auth-link { color: var(--primary-color); text-decoration: none; font-weight: 500; }
.auth-link:hover { text-decoration: underline; }

.error-message { color: #dc3545; font-size: 0.875rem; }
</style>
