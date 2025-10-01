<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { usePageTitleStore } from '../../store/pageTitle'
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/store/authStore";
const authStore = useAuthStore()
const { logout } = useAuthStore()

import { useLayoutStore } from '@/store/layoutStore'
const layout = useLayoutStore()

const { user } = storeToRefs(authStore)
import { storeToRefs } from 'pinia'

const { isDark, toggleTheme } = useTheme()
const pageTitle = usePageTitleStore()
const router = useRouter()

const props = defineProps<{
    username: string;
    userRole: string;
    userAvatar?: string;
}>()

const currentValue = ref(0)
const targetValue = ref(0)
const animating = ref(false)
const showNotification = ref(false)
const notificationAmount = ref(0)
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showQuickActions = ref(false)
const showRewardsPanel = ref(false)
const isMobile = ref(false)

// Notifications data
const notifications = ref([
    {
        id: 1,
        type: 'sale',
        title: 'Nova venda realizada!',
        message: 'Produto X - R$ 297,00',
        time: '2 min atrás',
        read: false,
        icon: '💰'
    },
    {
        id: 2,
        type: 'campaign',
        title: 'Campanha pausada automaticamente',
        message: 'CPA acima do limite definido',
        time: '15 min atrás',
        read: false,
        icon: '⚠️'
    },
    {
        id: 3,
        type: 'system',
        title: 'Relatório mensal disponível',
        message: 'Confira o desempenho de abril',
        time: '1 hora atrás',
        read: true,
        icon: '📊'
    }
])

const quickActions = ref([
    { id: 'new-campaign', label: 'Nova Campanha', icon: 'fa-plus', color: '#667eea' },
    { id: 'create-rule', label: 'Criar Regra', icon: 'fa-magic', color: '#ff6b6b' },
    { id: 'export-data', label: 'Exportar Dados', icon: 'fa-download', color: '#4ecdc4' },
    { id: 'view-reports', label: 'Relatórios', icon: 'fa-chart-line', color: '#45b7d1' }
])

const tiers = [
    { name: 'Iniciante', max: 10000, color: '#4169E1' },
    { name: 'Bronze', max: 100000, color: '#CD7F32' },
    { name: 'Prata', max: 500000, color: '#C0C0C0' },
    { name: 'Ouro', max: 1000000, color: '#FFD700' }
]

const currentTier = computed(() => {
    return tiers.find(tier => currentValue.value < tier.max) || tiers[tiers.length - 1]
})

const progress = computed(() => {
    const tier = currentTier.value
    const prevMax = tiers[tiers.indexOf(tier) - 1]?.max || 0
    let result =  ((currentValue.value - prevMax) / (tier.max - prevMax)) * 100
    return result == 0 ? 5 : result
})

const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read).length
})

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    }).format(value)
}

const simulateSale = () => {
    const amount = Math.floor(Math.random() * 1000) + 500
    addSale(amount)
}

const addSale = (amount: number) => {
    notificationAmount.value = amount
    targetValue.value = Math.min(currentValue.value + amount, 1000000)
    showNotification.value = true

    if (!animating.value) {
        animating.value = true
        animateValue()
    }

    setTimeout(() => {
        showNotification.value = false
    }, 3000)
}

const animateValue = () => {
    if (currentValue.value < targetValue.value) {
        const increment = Math.ceil((targetValue.value - currentValue.value) / 20)
        currentValue.value += increment
        requestAnimationFrame(animateValue)
    } else {
        animating.value = false
    }
}

const handleQuickAction = (actionId: string) => {
    showQuickActions.value = false

    switch (actionId) {
        case 'new-campaign':
            router.push('/campaigns')
            break
        case 'create-rule':
            router.push('/rules')
            break
        case 'export-data':
            // Export logic
            break
        case 'view-reports':
            router.push('/reports')
            break
    }
}

const openWhatsAppSupport = () => {
    // Analytics tracking
    const message = encodeURIComponent(`Olá! Preciso de ajuda com a plataforma.

Usuário: ${props.username}
Descrição do problema:`)

    window.open(`https://wa.me/+5500000000?text=${message}`, '_blank')
}

const handleUserMenuAction = async (action: string) => {
    showUserMenu.value = false

    switch (action) {
        case 'profile':
            await router.push('/profile')
            break
        case 'settings':
            await router.push('/admin/settings')
            break
        case 'logout':
            await logout();
            window.location.replace('/auth/login')
            break
    }
}

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
    showUserMenu.value = false
    showNotifications.value = false
    showQuickActions.value = false
    showRewardsPanel.value = false
}

const handleResize = () => {
    checkMobile()
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', handleResize)
    document.addEventListener('click', closeDropdowns)
})

</script>

<template>
    <header class="modern-header">
        <div class="header-container">
            <!-- Left Section -->
            <div class="header-left">
                <button
                    v-if="isMobile"
                    class="action-btn collapse-btn mobile"
                    @click="layout.toggleExpanded"
                >
                    <i class="fa-solid fa-bars"></i>
                </button>

                <div class="page-info" v-if="!isMobile">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-3">
                            <div class="logo">
                                <img v-if="isDark" alt="Logo" class="logo-img" src="../../assets/logo1.png"/>
                                <img v-else alt="Logo" class="logo-img" src="../../assets/logo.png"/>
                            </div>
                        </div>


                        <div class="breadcrumb" >
                            <span class="breadcrumb-item">Dashboard</span>
                            <i class="fa-solid fa-chevron-right breadcrumb-separator"></i>
                            <span class="breadcrumb-item current">{{ pageTitle.title }}</span>
                        </div>
                    </div>
                    <!--                    <h1 class="page-title">{{ pageTitle.title }}</h1>-->


                </div>

            </div>

            <!-- Right Section -->
            <div class="header-right">
                <div class="logo-container"  v-if="isMobile">
                    <transition name="fade-slide">
                        <div class="logo">
                            <img src="../../assets/logo1.png" alt="Logo" class="logo-img" v-if="true" style="height: 27px; width: auto;"/>
                            <img src="../../assets/logo.png" alt="Logo" class="logo-img" style="height: 27px; width: auto;" v-else/>
                        </div>
                    </transition>
                </div>
                <div class="header-action whatsapp-support" @click.stop="openWhatsAppSupport">
                    <button class="action-btn" title="Suporte via WhatsApp" v-if="!isMobile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help h-4 w-4 mr-2" data-lov-id="src/components/dashboard/DashboardHeader.tsx:40:12" data-lov-name="HelpCircle" data-component-path="src/components/dashboard/DashboardHeader.tsx" data-component-line="40" data-component-file="DashboardHeader.tsx" data-component-name="HelpCircle" data-component-content="%7B%22className%22%3A%22h-4%20w-4%20mr-2%22%7D"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                        <span class="action-label" v-if="!isMobile">Suporte</span>
                    </button>
                </div>

                <!-- Theme Toggle -->
                <button class="action-btn theme-toggle" @click="toggleTheme" v-if="!isMobile">
                    <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
                </button>
                <div class="user-profile" v-if="!isMobile">
                    <div class="premium-status">
                        <span class="price">R$ 0,00 / R$ 1M</span>

                        <div class="progress-container">
                            <div class="progress-bar" :style="{ width: `${progress}%`, backgroundColor: currentTier.color }" >
                                <div class="progress-glow" v-if="animating"></div>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- User Menu -->
                <div class="header-action user-section" @click.stop="showUserMenu = !showUserMenu">
                    <div class="user-info">
                        <div class="user-avatar">
                            <img v-if="userAvatar" :src="userAvatar" :alt="username" />
                            <div v-else class="avatar-placeholder" style="background: #525de0;border-radius: 50%;">
                                {{ user?.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="status-indicator"></div>
                        </div>
                        <div class="user-details" v-if="!isMobile">
                            <span class="user-name">{{ user.name }}</span>
                            <span class="user-role">{{ userRole }}</span>
                        </div>
                    </div>

                    <transition name="dropdown">
                        <div v-if="showUserMenu" class="dropdown user-dropdown">
                            <div class="user-menu-items">
                                <button class="user-menu-item" @click="handleUserMenuAction('profile')">
                                    <i class="fa-solid fa-user"></i>
                                    <span>Meu Perfil</span>
                                </button>
<!--                                <button class="user-menu-item" @click="handleUserMenuAction('settings')">-->
<!--                                    <i class="fa-solid fa-cog"></i>-->
<!--                                    <span>Configurações</span>-->
<!--                                </button>-->
                                <div class="menu-divider"></div>
                                <button class="user-menu-item logout" @click="handleUserMenuAction('logout')">
                                    <i class="fa-solid fa-sign-out-alt"></i>
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <!-- Sale Notification -->
        <transition name="notification">
            <div v-if="showNotification" class="sale-notification">
                <div class="notification-content">
                    <div class="notification-icon-large">🎉</div>
                    <div class="notification-text">
                        <h4>Nova venda!</h4>
                        <p>{{ formatCurrency(notificationAmount) }}</p>
                    </div>
                    <button class="close-notification" @click="showNotification = false">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
        </transition>
    </header>
</template>

<style scoped>
.user-profile {
    width: 150px;
    margin-left: 3%;
}
.premium-status {
    display: flex;
    flex-direction: column;
    //align-items: flex-end;
}

.premium-status span {
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    color: var(--text-secondary);
}

.price {
    color: var(--text-secondary);
    font-size: 10px;
}


.logo-img {
    width: auto;
    margin: 10px;
    height: 28px;
}
.whatsapp-support {
    position: relative;
}

.user-name {
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.modern-header {
    position: sticky;
    top: 0;
    left: 280px;
    right: 0;
    height: 67px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 100;
    transition: all 0.3s ease;
}

.header-container {
    height: 100%;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0px 20px auto;
}

/* Left Section */
.header-left {
    flex: 1;
    min-width: 0;
}

.page-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
    background: var(--text-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
}

.breadcrumb-item {
    transition: color 0.2s ease;
}

.breadcrumb-item.current {
    color: #667eea;
    font-weight: 500;
}

.breadcrumb-separator {
    font-size: 10px;
    opacity: 0.5;
}

/* Right Section */
.header-right {
    display: flex;
    align-items: center;
    gap: 23px;
}

.header-action {
    position: relative;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 12px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 15px;
    font-weight: 500;
}

.action-btn:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-1px);
}

.action-btn i {
    font-size: 15px;
}

/* Rewards Button */
.rewards-btn {
    position: relative;
    padding: 12px 16px;
}

.rewards-icon {
    color: var(--text-secondary);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tier-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid white;
}

.tier-name-small {
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Quick Actions Button */
.quick-actions-btn .action-label {
    color: var(--text-secondary);
    font-size: 13px;
}

.quick-actions-btn {
    color: var(--text-secondary);
}

/* Notifications Button */
.notifications-btn {
    position: relative;
    padding: 12px;
}

.notification-badge {
    color: var(--text-secondary);
    position: absolute;
    top: 6px;
    right: 6px;
    background: #ff6b6b;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 16px;
    text-align: center;
    animation: pulse 2s infinite;
}

/* Theme Toggle */
.theme-toggle {
    color: var(--text-secondary);
    padding: 12px;
}

/* User Section */
.user-section {
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.user-info:hover {
    background: rgba(102, 126, 234, 0.1);
}

.user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    line-height: 1;
}

.user-role {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1;
}

.user-avatar {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 12px;
    overflow: hidden;
}

.user-avatar img,
.avatar-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 16px;
}

.status-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: #4ecdc4;
    border: 2px solid white;
    border-radius: 50%;
}
.dropdown::after {
    content: unset;
}
/* Dropdowns */
.dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    z-index: 1000;
    overflow: hidden;
}

.dropdown-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dropdown-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.mark-all-read {
    background: none;
    border: none;
    color: #667eea;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
}

/* Rewards Dropdown */
.rewards-dropdown {
    width: 320px;
}

.rewards-content {
    padding: 20px;
}

.current-tier {
    margin-bottom: 24px;
}

.tier-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    margin-bottom: 16px;
}

.tier-progress {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 16px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.progress-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.progress-value {
    font-size: 12px;
    color: var(--text-primary);
    font-weight: 600;
}

.progress-container {
    position: relative;
    height: 6px;
    background: var(--background-color);
    width: 100%;
    margin-top: 5px;
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar {
    border-radius: 3px;
    position: relative;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.tier-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tier-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.tier-item.current {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.tier-item.completed {
    opacity: 0.7;
}

.tier-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
}

.tier-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tier-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.tier-target {
    font-size: 11px;
    color: var(--text-secondary);
}

.tier-status {
    color: var(--text-secondary);
    font-size: 14px;
}

.tier-item.completed .tier-status {
    color: #4ecdc4;
}

.tier-item.current .tier-status {
    color: #667eea;
}

/* Quick Actions Dropdown */
.quick-actions-dropdown {
    width: 280px;
}

.quick-actions-grid {
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.quick-action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(102, 126, 234, 0.05);
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-action-item:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
}

.action-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
}

.action-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    text-align: center;
}

/* Notifications Dropdown */
.notifications-dropdown {
    width: 360px;
    max-height: 480px;
}

.notifications-list {
    max-height: 320px;
    overflow-y: auto;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.notification-item:hover {
    background: rgba(102, 126, 234, 0.05);
}

.notification-item.unread {
    background: rgba(102, 126, 234, 0.02);
}

.notification-icon {
    font-size: 20px;
    margin-top: 2px;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-content h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}

.notification-content p {
    margin: 0 0 4px;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.notification-time {
    font-size: 11px;
    color: var(--text-muted);
}

.unread-dot {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 6px;
    height: 6px;
    background: #667eea;
    border-radius: 50%;
}

.dropdown-footer {
    padding: 16px 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.view-all-btn {
    width: 100%;
    padding: 8px;
    background: none;
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    color: #667eea;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.view-all-btn:hover {
    background: rgba(102, 126, 234, 0.1);
}

/* User Dropdown */
.user-dropdown {
    width: 172px;
}

.user-dropdown-header {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.user-avatar-large {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    overflow: hidden;
    border: 3px solid rgba(102, 126, 234, 0.3);
}

.avatar-placeholder-large {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-info-large h3 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.user-info-large p {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
}

.user-menu-items {
    padding: 8px;
}

.user-menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.user-menu-item:hover {
    background: rgba(102, 126, 234, 0.1);
}

.user-menu-item.logout {
    color: #ff6b6b;
}

.user-menu-item.logout:hover {
    background: rgba(255, 107, 107, 0.1);
}

.menu-divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 8px 16px;
}

/* Sale Notification */
.sale-notification {
    position: fixed;
    top: 100px;
    right: 32px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(102, 126, 234, 0.2);
    z-index: 1001;
    backdrop-filter: blur(20px);
}

.sale-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.notification-icon-large {
    font-size: 32px;
    animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-4px); }
}

.sale-notification .notification-text h4 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.sale-notification .notification-text p {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #667eea;
}

.close-notification {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.close-notification:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--text-primary);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.notification-enter-active,
.notification-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
    .header-container {
        margin: 0px 0px auto !important;
    }
    .modern-header {
        left: 0;
        padding: 0 16px;
    }

    .header-container {
        padding: 0 16px;
    }

    .page-title {
        font-size: 20px;
    }

    .dropdown {
        right: -16px;
    }

    .quick-actions-dropdown,
    .notifications-dropdown,
    .user-dropdown,
    .rewards-dropdown {
        width: calc(100vw - 32px);
        max-width: 320px;
    }

    .sale-notification {
        right: 16px;
        left: 16px;
        width: auto;
    }
}

/* Dark mode adjustments */
.dark .modern-header {
    //background: var(--menu-bg);
    background: #1c223b75;
    border: 1px solid #232c4dad;
    //border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .dropdown {
    background: #1a1f2e;
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .sale-notification {
    background: #1a1f2e;
    border-color: rgba(102, 126, 234, 0.3);
}
</style>