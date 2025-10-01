<script setup lang="ts">
import { ref } from 'vue'
import AdminSideMenu from '../../components/admin/AdminSideMenu.vue'

interface Admin {
    id: number
    name: string
    email: string
    role: string
    lastAccess: string
}

const admins = ref<Admin[]>([
    {
        id: 1,
        name: 'Admin Principal',
        email: 'admin@email.com',
        role: 'super_admin',
        lastAccess: '2025-04-25 15:30'
    }
])

const showAddAdminModal = ref(false)
const newAdmin = ref({
    name: '',
    email: '',
    role: 'admin'
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const addAdmin = () => {
    // Add admin logic
    showAddAdminModal.value = false
}

const removeAdmin = (adminId: number) => {
    // Remove admin logic
}
</script>

<template>
    <div class="admin-settings">
        <AdminSideMenu />

        <div class="settings-main">
            <header class="settings-header">
                <div>
                    <h1>Configurações</h1>
                    <p class="subtitle">Gerencie as configurações administrativas</p>
                </div>
            </header>

            <div class="settings-grid">
                <!-- Admins Section -->
                <div class="settings-card">
                    <div class="card-header">
                        <h2>Administradores</h2>
                        <button
                            class="btn-primary"
                            @click="showAddAdminModal = true"
                        >
                            Adicionar Admin
                        </button>
                    </div>

                    <div class="admins-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Função</th>
                                <th>Último Acesso</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="admin in admins" :key="admin.id">
                                <td>{{ admin.name }}</td>
                                <td>{{ admin.email }}</td>
                                <td>
                    <span
                        class="role-badge"
                        :class="admin.role"
                    >
                      {{ admin.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
                    </span>
                                </td>
                                <td>{{ formatDate(admin.lastAccess) }}</td>
                                <td>
                                    <div class="actions">
                                        <button
                                            class="btn-icon"
                                            @click="removeAdmin(admin.id)"
                                            title="Remover"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Platform Settings -->
                <div class="settings-card">
                    <h2>Configurações da Plataforma</h2>

                    <div class="settings-form">
                        <div class="form-group">
                            <label>Nome da Plataforma</label>
                            <input
                                type="text"
                                value="Facebook Sales Tracking"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label>E-mail de Suporte</label>
                            <input
                                type="email"
                                value="suporte@email.com"
                                class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label>Timezone Padrão</label>
                            <select class="form-select">
                                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" checked />
                                Permitir registro de novos usuários
                            </label>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" checked />
                                Ativar período de trial
                            </label>
                        </div>

                        <button class="btn-primary">
                            Salvar Configurações
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add Admin Modal -->
            <div v-if="showAddAdminModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Adicionar Administrador</h2>
                        <button @click="showAddAdminModal = false" class="close-btn">×</button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                v-model="newAdmin.name"
                                class="form-input"
                                placeholder="Nome do administrador"
                            />
                        </div>

                        <div class="form-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                v-model="newAdmin.email"
                                class="form-input"
                                placeholder="E-mail do administrador"
                            />
                        </div>

                        <div class="form-group">
                            <label>Função</label>
                            <select
                                v-model="newAdmin.role"
                                class="form-select"
                            >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            class="btn-secondary"
                            @click="showAddAdminModal = false"
                        >
                            Cancelar
                        </button>
                        <button
                            class="btn-primary"
                            @click="addAdmin"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-settings {
    min-height: 100vh;
    background-color: #f7fafc;
}

.settings-main {
    margin-left: 250px;
    padding: var(--spacing-lg);
}

.settings-header {
    margin-bottom: var(--spacing-xl);
}

.settings-header h1 {
    margin: 0;
    font-size: 24px;
    color: #1a202c;
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: #718096;
}

.settings-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
}

.settings-card {
    background: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.card-header h2 {
    margin: 0;
    font-size: 18px;
    color: #1a202c;
}

.admins-table {
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

.role-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.role-badge.super_admin {
    background-color: #FED7E2;
    color: #B83280;
}

.role-badge.admin {
    background-color: #BEE3F8;
    color: #2B6CB0;
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

.settings-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-group label {
    color: #4A5568;
    font-size: 14px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
}

.form-input,
.form-select {
    padding: var(--spacing-sm);
    border: 1px solid #e2e8f0;
    border-radius: var(--border-radius-sm);
    width: 100%;
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

@media (max-width: 1024px) {
    .settings-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .settings-main {
        margin-left: 0;
    }
}
</style>