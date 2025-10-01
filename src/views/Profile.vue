<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import { formatDate, parseUserAgent } from '../utils/formatters'

import { useProfileStore } from '@/store/profile/profileStore';

// Criação da store para gerenciamento de perfil
const profileStore = useProfileStore();

// Estado do componente
const showSecurityModal = ref(false);
const isEditing = ref(false);
const activeTab = ref(profileStore.activeTab);
const userProfile = ref(profileStore.userProfile);
const passwordForm = ref(profileStore.passwordForm);
const twoFactorEnabled = ref(false);
const show2FAModal = ref(false);

const passwordRequirements = [
    { label: 'Entre 8 a 50 caracteres', regex: /.{8,50}/ },
    { label: 'Pelo menos uma letra maiúscula', regex: /[A-Z]/ },
    { label: 'Pelo menos um número', regex: /[0-9]/ },
    { label: 'Pelo menos um caractere especial', regex: /[!@#$%^&*(),.?":{}|<>]/ }
]

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handlePasswordChange = () => {
    if (!isPasswordValid.value) return
    if (passwordForm.value.new !== passwordForm.value.confirm) return

    // Handle password change
    profileStore.handleChangePassword()
}

const isPasswordValid = computed(() =>
    metRequirements.value.every(req => req.met)
)

const metRequirements = computed(() => {
    return passwordRequirements.map(req => ({
        ...req,
        met: req.regex.test(passwordForm.value.new)
    }))
})

const handle2FAActivation = () => {
    show2FAModal.value = true
}

// Método para carregar o perfil
const fetchProfileData = async () => {
    await profileStore.fetchProfile();
    userProfile.value = profileStore.userProfile;
};

// Método para atualizar o perfil
const handleProfileUpdate = async () => {
    await profileStore.updateProfile(userProfile.value);
};

// Método para alternar a notificação
const toggleNotification = async (type) => {
    const updatedProfile = { ...userProfile.value };
    updatedProfile.notifications[type] = !updatedProfile.notifications[type];
    await profileStore.updateProfileSettings(updatedProfile.notifications);
    userProfile.value = updatedProfile;
};

// Carregar o perfil quando o componente for montado
onMounted(() => {
    pageTitle.setTitle('Meu perfil')

    fetchProfileData();
});
</script>

<template>
    <div class="profile">

        <div class="profile-main">

            <div class="profile-content">
                <!-- Profile Header -->
                <div class="profile-header">
                    <div class="profile-avatar">
                        <div class="avatar-placeholder">J</div>
                        <button class="avatar-upload">
                            <span>📷</span>
                        </button>
                    </div>
                    <div class="profile-info">
                        <h1>{{ userProfile.name }}</h1>
                        <p>{{ userProfile.email }}</p>
                    </div>
                    <div class="profile-actions">
                        <button
                            class="btn-primary"
                            @click="isEditing = true"
                        >
                             Editar Perfil
                        </button>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="profile-tabs">
                    <button
                        v-for="tab in ['profile', 'security', 'notifications']"
                        :key="tab"
                        class="tab-button"
                        :class="{ active: activeTab === tab }"
                        @click="activeTab = tab"
                    >
                        {{ {
                        profile: 'Perfil',
                        security: 'Segurança',
                        notifications: 'Notificações'
                    }[tab] }}
                    </button>
                </div>

                <!-- Profile Tab -->
                <div v-if="activeTab === 'profile'" class="tab-content">
                    <div class="profile-grid">
                        <div class="profile-section">
                            <h3>Informações Pessoais</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Nome</label>
                                    <input
                                        v-model="userProfile.name"
                                        type="text"
                                        class="form-input"
                                        :disabled="!isEditing"
                                    />
                                </div>

                                <div class="form-group">
                                    <label>E-mail</label>
                                    <input
                                        v-model="userProfile.email"
                                        type="email"
                                        class="form-input"
                                        :disabled="true"
                                    />
                                </div>

                                <div class="form-group">
                                    <label>Telefone</label>
                                    <input
                                        v-model="userProfile.phone"
                                        type="tel"
                                        class="form-input"
                                        :disabled="!isEditing"
                                    />
                                </div>

                                <div class="form-group">
                                    <label>CPF/CNPJ</label>
                                    <input
                                        v-model="userProfile.document"
                                        type="text"
                                        class="form-input"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="profile-section">
                            <h3>Informações Gerais</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Fuso Horário</label>
                                    <select
                                        v-model="userProfile.timezone"
                                        class="form-input"
                                        :disabled="true"
                                    >
                                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                                        <option value="America/Manaus">Manaus (GMT-4)</option>
                                        <option value="America/Belem">Belém (GMT-3)</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label>Idioma</label>
                                    <select
                                        v-model="userProfile.language"
                                        class="form-input"
                                        :disabled="true"
                                    >
                                        <option value="Português">Português</option>
                                        <option value="English">English</option>
                                        <option value="Español">Español</option>
                                    </select>
                                </div>
                            </div>
                        </div>

<!--                        <div class="profile-section">-->
<!--                            <h3>Plano e Assinatura</h3>-->
<!--                            <div class="subscription-info">-->
<!--                                <div class="plan-badge">{{ userProfile.plan }}</div>-->
<!--                                <button class="btn-primary">Fazer Upgrade</button>-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>

                    <div class="form-actions" v-if="isEditing">
                        <button class="btn-secondary" @click="isEditing = false">
                            Cancelar
                        </button>
                        <button class="btn-primary" @click="handleProfileUpdate" :disabled="profileStore.loading">
                            {{  profileStore.loading ? 'Salvando...' : 'Salvar Alterações' }}
                        </button>
                    </div>
                </div>

                <!-- Security Tab -->
                <div v-if="activeTab === 'security'" class="tab-content">
                    <div class="security-grid">
                        <div class="security-card">
                            <div class="security-header">
                                <h3>Senha</h3>
                            </div>
                            <button
                                class="btn-secondary"
                                @click="profileStore.showPasswordModal = true"
                            >
                                Alterar Senha
                            </button>
                        </div>

<!--                        <div class="security-card">-->
<!--                            <div class="security-header">-->
<!--                                <h3>Autenticação de Dois Fatores</h3>-->
<!--                                <p>Status: {{ twoFactorEnabled ? 'Ativado' : 'Desativado' }}</p>-->
<!--                            </div>-->
<!--                            <button-->
<!--                                class="btn-primary"-->
<!--                                @click="handle2FAActivation"-->
<!--                                v-if="!twoFactorEnabled"-->
<!--                            >-->
<!--                                Ativar 2FA-->
<!--                            </button>-->
<!--                            <button-->
<!--                                class="btn-danger"-->
<!--                                v-else-->
<!--                                @click="twoFactorEnabled = false"-->
<!--                            >-->
<!--                                Desativar 2FA-->
<!--                            </button>-->
<!--                        </div>-->

                        <div class="security-card">
                            <div class="security-header">
                                <h3>Histórico de Login</h3>
                                <p>Último acesso: <b>{{ formatDate(userProfile.security.loginHistory[0]?.created_at) }}</b></p>
                            </div>
                            <div class="login-history">
                                <div
                                    v-for="(login, index) in userProfile.security.loginHistory"
                                    :key="index"
                                    class="login-item"
                                >
                                    <div class="login-info">
                                        <span class="login-device"> {{ parseUserAgent(login.user_agent) }}</span>
                                        <span class="login-location">{{ login.location ?? '-' }}</span>
                                    </div>
                                    <div class="login-meta">
                                        <span class="login-date">{{ formatDate(login.created_at) }}</span>
                                        <span class="login-ip">IP: {{ login.ip_address }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notifications Tab -->
                <div v-if="activeTab === 'notifications'" class="tab-content">
                    <div class="notifications-grid">
                        <div class="notification-card">
                            <div class="notification-header">
                                <h3>E-mail</h3>
                                <p>Receba atualizações importantes por e-mail</p>
                            </div>
                            <label class="toggle">
                                <input
                                    type="checkbox"
                                    :checked="userProfile.notifications.email"
                                    @change="toggleNotification('email')"
                                />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="notification-card">
                            <div class="notification-header">
                                <h3>Push</h3>
                                <p>Notificações em tempo real no navegador</p>
                            </div>
                            <label class="toggle">
                                <input
                                    type="checkbox"
                                    :checked="userProfile.notifications.push"
                                    @change="toggleNotification('push')"
                                />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

<!--                        <div class="notification-card">-->
<!--                            <div class="notification-header">-->
<!--                                <h3>SMS</h3>-->
<!--                                <p>Receba alertas importantes por SMS</p>-->
<!--                            </div>-->
<!--                            <label class="toggle">-->
<!--                                <input-->
<!--                                    type="checkbox"-->
<!--                                    :checked="userProfile.notifications.sms"-->
<!--                                    @change="toggleNotification('sms')"-->
<!--                                />-->
<!--                                <span class="toggle-slider"></span>-->
<!--                            </label>-->
<!--                        </div>-->
                    </div>
                </div>
            </div>
        </div>

        <div v-if="profileStore.showPasswordModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Alterar Senha</h3>
                    <button @click="profileStore.showPasswordModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-stack">
                        <div class="form-group">
                            <label>Senha atual</label>
                            <div class="password-input">
                                <input
                                    v-model="passwordForm.current"
                                    :type="showCurrentPassword ? 'text' : 'password'"
                                    class="form-input"
                                    placeholder="Digite a senha atual"
                                />
                                <button
                                    class="toggle-password"
                                    @click="showCurrentPassword = !showCurrentPassword"
                                >
                                    {{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Nova senha</label>
                            <div class="password-input">
                                <input
                                    v-model="passwordForm.new"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    class="form-input"
                                    placeholder="Digite a nova senha"
                                />
                                <button
                                    class="toggle-password"
                                    @click="showNewPassword = !showNewPassword"
                                >
                                    {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Confirmar nova senha</label>
                            <div class="password-input">
                                <input
                                    v-model="passwordForm.confirm"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    class="form-input"
                                    placeholder="Digite a nova senha novamente"
                                />
                                <button
                                    class="toggle-password"
                                    @click="showConfirmPassword = !showConfirmPassword"
                                >
                                    {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                                </button>
                            </div>
                        </div>

                        <div class="password-requirements">
                            <h4>Requisitos da senha:</h4>
                            <ul>
                                <li
                                    v-for="req in metRequirements"
                                    :key="req.label"
                                    :class="{ 'met': req.met }"
                                >
                                    {{ req.label }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button
                        class="btn-secondary"
                        @click="profileStore.showPasswordModal = false"
                    >
                        Cancelar
                    </button>
                    <button
                        class="btn-primary"
                        @click="handlePasswordChange"
                        :disabled="!isPasswordValid || passwordForm.new !== passwordForm.confirm"
                    >
                        Alterar Senha
                    </button>
                </div>
            </div>
        </div>

        <!-- 2FA Modal -->
        <div v-if="show2FAModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Configurar autenticação de dois fatores</h3>
                    <button @click="show2FAModal = false" class="close-btn">×</button>
                </div>

                <div class="modal-body">
                    <div class="setup-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <p>Abra o aplicativo Autenticador no seu celular</p>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <p>No aplicativo autenticador, selecione Adicionar conta e escolha a opção Escanear código QR</p>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <p>Escaneie o QR code abaixo usando a câmera do seu celular</p>
                        </div>
                    </div>

                    <div class="qr-code">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example" alt="2FA QR Code" />
                    </div>

                    <div class="verification-section">
                        <input
                            type="text"
                            class="form-input"
                            placeholder="Digite o código do aplicativo autenticador"
                        />
                        <button class="btn-primary" @click="confirmTwoFactor">
                            Verificar Código
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile {
    min-height: 100vh;
    background-color: var(--background-color);
}

.profile-main {
    margin-left: 250px;
}

.profile-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}

.profile-avatar {
    position: relative;
}

.avatar-placeholder {
    width: 100px;
    height: 100px;
    background-color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: white;
    font-weight: 600;
}

.avatar-upload {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    background-color: var(--card-background);
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.25rem;
}

.profile-info {
    flex-grow: 1;
}

.profile-info h1 {
    margin: 0;
    font-size: 1.75rem;
    color: var(--text-primary);
}

.profile-info p {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
}

.profile-actions {
    display: flex;
    gap: var(--spacing-md);
}

.profile-tabs {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-md);
}

.tab-button {
    background: none;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 500;
    position: relative;
}

.tab-button::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.2s ease;
}

.tab-button.active {
    color: var(--primary-color);
}

.tab-button.active::after {
    transform: scaleX(1);
}

.tab-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.profile-grid {
    display: grid;
    gap: var(--spacing-xl);
}

.profile-section {
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
}

.profile-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.profile-section h3 {
    margin: 0 0 var(--spacing-lg);
    color: var(--text-primary);
    font-size: 1.25rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
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
}

.form-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.1);
}

.form-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.subscription-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
}

.plan-badge {
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    font-weight: 500;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
}

.security-grid {
    display: grid;
    gap: var(--spacing-lg);
}

.security-card {
    padding: var(--spacing-lg);
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
}

.security-header {
    margin-bottom: var(--spacing-md);
}

.security-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.security-header p {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.login-history {
    margin-top: var(--spacing-md);
}

.login-item {
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
}

.login-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
}

.login-device {
    font-weight: 500;
}

.login-location {
    color: var(--text-secondary);
}

.login-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.notifications-grid {
    display: grid;
    gap: var(--spacing-lg);
}

.notification-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
}

.notification-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.notification-header p {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.toggle {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: .4s;
    border-radius: 34px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
    transform: translateX(24px);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
}

.modal-body {
    padding: var(--spacing-lg);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
}

.setup-steps {
    margin-bottom: var(--spacing-lg);
}

.step {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.step-number {
    width: 24px;
    height: 24px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
}

.step p {
    margin: 0;
    color: var(--text-secondary);
}

.qr-code {
    display: flex;
    justify-content: center;
    margin: var(--spacing-xl) 0;
}

.qr-code img {
    width: 200px;
    height: 200px;
    border-radius: var(--border-radius-sm);
}

.verification-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
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

.password-requirements {
    background-color: var(--menu-hover);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    margin-top: var(--spacing-md);
}

.password-requirements h4 {
    margin: 0 0 var(--spacing-sm);
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.password-requirements ul {
    list-style: none;
    padding:  0;
    margin: 0;
}

.password-requirements li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: var(--spacing-xs);
}

.password-requirements li::before {
    content: '•';
    color: var(--text-secondary);
}

.password-requirements li.met {
    color: var(--accent-color);
}

.password-requirements li.met::before {
    content: '✓';
    color: var(--accent-color);
}

.btn-primary,
.btn-secondary,
.btn-danger {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

.btn-danger {
    background-color: #dc3545;
    color: white;
    border: none;
}

.btn-danger:hover {
    background-color: #c82333;
}

@media (max-width: 768px) {
    .profile-main {
        margin-left: 0;
    }

    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .profile-actions {
        width: 100%;
        flex-direction: column;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .profile-tabs {
        overflow-x: auto;
        padding-bottom: var(--spacing-sm);
    }

    .tab-button {
        white-space: nowrap;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
    }
}
</style>