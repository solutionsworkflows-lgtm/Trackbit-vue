<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', route: '/admin' },
    { id: 'users', label: 'Usuários', icon: '👥', route: '/admin/users' },
    { id: 'subscriptions', label: 'Assinaturas', icon: '💳', route: '/admin/subscriptions' },
    { id: 'settings', label: 'Configurações', icon: '⚙️', route: '/admin/settings' }
]
</script>

<template>
    <aside class="admin-menu">
        <div class="logo">
            <img src="/src/assets/vue.svg" alt="Logo" class="logo-img"/>
            <span class="admin-badge">Admin</span>
        </div>

        <nav class="menu-items">
            <RouterLink
                v-for="item in menuItems"
                :key="item.id"
                :to="item.route"
                class="menu-item"
                active-class="active"
            >
                <span class="item-icon">{{ item.icon }}</span>
                <span class="item-label">{{ item.label }}</span>
            </RouterLink>
        </nav>

        <div class="menu-footer">
            <RouterLink to="/" class="exit-admin">
                ← Voltar ao app
            </RouterLink>
        </div>
    </aside>
</template>

<style scoped>
.admin-menu {
    width: 250px;
    height: 100vh;
    background-color: #1a1f2e;
    padding: var(--spacing-md);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.logo {
    padding: var(--spacing-md) 0;
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.logo-img {
    height: 40px;
    width: auto;
}

.admin-badge {
    background-color: var(--primary-color);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.menu-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex-grow: 1;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    color: #a0aec0;
    text-decoration: none;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background-color: #242935;
    color: white;
}

.menu-item.active {
    background-color: var(--primary-color);
    color: white;
}

.item-icon {
    margin-right: var(--spacing-md);
    font-size: 18px;
}

.item-label {
    font-size: 14px;
    font-weight: 500;
}

.menu-footer {
    padding-top: var(--spacing-md);
    border-top: 1px solid #2d3748;
}

.exit-admin {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    color: #a0aec0;
    text-decoration: none;
    border-radius: var(--border-radius-sm);
    transition: all 0.2s ease;
}

.exit-admin:hover {
    background-color: #242935;
    color: white;
}
</style>