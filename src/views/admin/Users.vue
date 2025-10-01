<script setup lang="ts">
import { ref } from 'vue'
import AdminSideMenu from '../../components/admin/AdminSideMenu.vue'

interface User {
    id: number
    name: string
    email: string
    plan: string
    status: string
    lastLogin: string
    subscriptionStatus: string
    createdAt: string
}

const users = ref<User[]>([
    {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        plan: 'Professional',
        status: 'active',
        lastLogin: '2025-04-25 15:30',
        subscriptionStatus: 'active',
        createdAt: '2025-01-15'
    },
    // Add more users...
])

const showUserModal = ref(false)
const selectedUser = ref<User | null>(null)

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const handleUserAction = (action: string, user: User) => {
    selectedUser.value = user
    showUserModal.value = true
    // Handle user action
}

const resendAccess = (userId: number) => {
    // Resend access email logic
}

const changePlan = (userId: number, newPlan: string) => {
    // Change plan logic
}

const toggleStatus = (userId: number) => {
    // Toggle user status logic
}
</script>

<template>
    <div class="admin-users">
        <AdminSideMenu />

        <div class="users-main">
            <header class="users-header">
                <div>
                    <h1>Gerenciar Usuários</h1>
                    <p class="subtitle">Gerencie todos os usuários da plataforma</p>
                </div>

                <div class="header-actions">
                    <div class="search-box">
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            class="search-input"
                        />
                    </div>
                    <button class="btn-primary">
                        Adicionar Usuário
                    </button>
                </div>
            </header>

            <div class="users-table">
                <table>
                    <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Plano</th>
                        <th>Status</th>
                        <th>Último Acesso</th>
                        <th>Assinatura</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>
                            <div class="user-info">
                                <div class="user-avatar">{{ user.name[0] }}</div>
                                <div>
                                    <div class="user-name">{{ user.name }}</div>
                                    <div class="user-email">{{ user.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td>{{ user.plan }}</td>
                        <td>
                <span
                    class="status-badge"
                    :class="user.status"
                >
                  {{ user.status === 'active' ? 'Ativo' : 'Bloqueado' }}
                </span>
                        </td>
                        <td>{{ formatDate(user.lastLogin) }}</td>
                        <td>
                <span
                    class="subscription-badge"
                    :class="user.subscriptionStatus"
                >
                  {{ user.subscriptionStatus === 'active' ? 'Ativa' : 'Inativa' }}
                </span>
                        </td>
                        <td>{{ formatDate(user.createdAt) }}</td>
                        <td>
                            <div class="actions">
                                <button
                                    class="btn-icon"
                                    @click="handleUserAction('edit', user)"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    class="btn-icon"
                                    @click="resendAccess(user.id)"
                                    title="Reenviar acesso"
                                >
                                    📧
                                </button>
                                <button
                                    class="btn-icon"
                                    @click="toggleStatus(user.id)"
                                    title="Alterar status"
                                >
                                    {{ user.status === 'active' ? '🔒' : '🔓' }}
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- User Modal -->
            <div v-if="showUserModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Editar Usuário</h2>
                        <button @click="showUserModal = false" class="close-btn">×</button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                v-model="selectedUser.name"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                v-model="selectedUser.email"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label>Plano</label>
                            <select
                                v-model="selectedUser.plan"
                                class="form-select"
                            >
                                <option value="Starter">Starter</option>
                                <option value="Professional">Professional</option>
                                <option value="Enterprise">Enterprise</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Status</label>
                            <select
                                v-model="selectedUser.status"
                                class="form-select"
                            >
                                <option value="active">Ativo</option>
                                <option value="blocked">Bloqueado</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            class="btn-secondary"
                            @click="showUserModal = false"
                        >
                            Cancelar
                        </button>
                        <button class="btn-primary">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-users {
    min-height: 100vh;
    background-color: #f7fafc;
}

.users-main {
    margin-left: 250px;
    padding: var(--spacing-lg);
}

.users-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
}

.users-header h1 {
    margin: 0;
    font-size: 24px;
    color: #1a202c;
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: #718096;
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

.search-box {
    position: relative;
}

.search-input {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 1px solid #e2e8f0;
    border-radius: var(--border-radius-sm);
    width: 300px;
}

.users-table {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
    padding: var(--spacing-sm);
    font-size: 12px;
    font-weight: 500;
    color: #718096;
    border-bottom: 1px solid #e2e8f0;
}

td {
    padding: var(--spacing-sm);
    border-bottom: 1px solid #e2e8f0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.user-avatar {
    width: 32px;
    height: 32px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.user-name {
    font-weight: 500;
    color: #1a202c;
}

.user-email {
    font-size: 12px;
    color: #718096;
}

.status-badge,
.subscription-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.active {
    background-color: #C6F6D5;
    color: #2F855A;
}

.status-badge.blocked {
    background-color: #FED7D7;
    color: #C53030;
}

.subscription-badge.active {
    background-color: #BEE3F8;
    color: #2B6CB0;
}

.subscription-badge.inactive {
    background-color: #E2E8F0;
    color: #4A5568;
}

.actions {
    display: flex;
    gap: var(--spacing-xs);
}

.btn-icon {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
}

.btn-icon:hover {
    background-color: #f7fafc;
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
    background: white;
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 500px;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #1a202c;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #718096;
    cursor: pointer;
}

.modal-body {
    padding: var(--spacing-lg);
}

.form-group {
    margin-bottom: var(--spacing-md);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: #4A5568;
    font-size: 14px;
}

.form-input,
.form-select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid #e2e8f0;
    border-radius: var(--border-radius-sm);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
}

.btn-primary,
.btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 14px;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-secondary {
    background-color: white;
    color: #1a202c;
    border: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
    .users-main {
        margin-left: 0;
    }

    .users-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .header-actions {
        width: 100%;
        flex-direction: column;
    }

    .search-input {
        width: 100%;
    }
}
</style>