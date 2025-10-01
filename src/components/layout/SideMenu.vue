<script setup>
import {ref, computed, onMounted, nextTick} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useLayoutStore} from '@/store/layoutStore';
import {isEmpty} from "vuetify/lib/util/index.js";

import {storeToRefs} from "pinia";
import {useDashboardsStore} from '../../store/dashboards';

import { useAuthStore } from "@/store/authStore";
const { logout } = useAuthStore();

const dashboardsStore = useDashboardsStore();
const {dashboardMenus} = storeToRefs(dashboardsStore);
const menuItems = dashboardMenus.value;

const layout = useLayoutStore()

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const showSearch = ref(false)
const hoveredItem = ref(null)
const activeSubmenu = ref(null)
const notifications = ref(3)
const isMobile = ref(false)

const activeSubmenus = ref([]);
const activeSubmenuItem = ref(null);

import { useTheme } from '@/composables/useTheme'
const { isDark } = useTheme()

const bottomItems = [
    {
        id: `dashboard-management`,
        label: 'Dashboards',
        icon: 'fa-solid fa-desktop',
        route: `/dashboard-management`,
        description: 'Gerencie suas dashboards',
        badge: null,
        enabled: true,
        submenu: []
    },
    {
        id: `notifications`,
        label: 'Notificações',
        icon: 'fa-solid fa-bell',
        route: `/notifications`,
        description: 'Central de alertas',
        badge: null,
        enabled: true,
        submenu: []
    },
    {
        id: 'subscription',
        label: 'Assinatura',
        icon: 'fa-solid fa-credit-card',
        route: '/subscription',
        description: 'Veja detalhes do seu plano',
        badge: null,
        highlight: true
    },
  {
    id: 'referral',
    label: 'Indique & Ganhe',
    icon: 'fa-solid fa-gift',
    route: '/referral',
    description: 'Ganhe 10% de comissão',
    badge: null,
    highlight: true
  },
  {
    id: 'support',
    label: 'Suporte',
    icon: 'fa-solid fa-headset',
    route: '/support',
    description: 'Ajuda 24/7',
    badge: null
  }
]

const filteredItems = computed(() => {
  if (!dashboardMenus.value.length) return []

  const menus = dashboardMenus.value

  dashboardMenus.value.map((item) => {
    if (item.isExpanded) {
        activeSubmenu.value = item.id;
    }

    if (item.submenu.length > 0) {
        item.submenu.map((submenu) => {
            if (submenu?.isExpanded) {
              activeSubmenus.value[submenu.id] = !activeSubmenus.value[submenu.id];
            }
        });
    }
  });

  if (!searchQuery.value) return menus

  return menus.filter(item =>
      item.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentRoute = computed(() => route.path)

// const toggleSearch = () => {
//     if (!isExpanded.value) {
//         isExpanded.value = true
//     }
//     showSearch.value = !showSearch.value
//     if (showSearch.value) {
//         nextTick(() => {
//             const searchInput = document.querySelector('.search-input')
//             if (searchInput) searchInput.focus()
//         })
//     }
// }

const toggleSubmenu = (item) => {
  const hasSubmenu = Boolean(item?.submenu?.length);
  const isSubmenuActive = activeSubmenu.value === item.id && hasSubmenu;

  if (!hasSubmenu && isSubmenuActive) {
      return;
  }

  if (!layout.isExpanded && hasSubmenu) {
      return;
  }

  const toggleActiveSubmenu = () => {
    activeSubmenu.value = isSubmenuActive ? null : item.id;
  };

  if (hasSubmenu) {
    toggleActiveSubmenu();
  } else {
    toggleActiveSubmenu();
    router.push(item.route);
  }
}


const toggleSubmenusItem = async (submenu) => {
    activeSubmenuItem.value = activeSubmenuItem.value === submenu.id ? null : submenu.id
    await router.push(submenu.route);
}

const isActiveSubmenuItem = (itemId) => {
    return activeSubmenuItem.value === itemId;
}

const toggleSubmenuItem = (id) => {
  activeSubmenus.value[id] = !activeSubmenus.value[id]
}

const isSubmenuOpen = (id) => {
  return !!activeSubmenus.value[id]
}

const navigateTo = (route) => {
  router.push(route)
  activeSubmenu.value = null
}


const handleLogout = async () => {
  await logout();
    window.location.replace('/auth/login')
}

const isActive = (itemId) => {
  return activeSubmenu.value === itemId;
  // return currentRoute.value === route || currentRoute.value.startsWith(route + '/')
}

const isActiveRoute = (route)=> {
  if (!route || typeof route !== 'string') return false;

  const current = currentRoute?.value?.split('?')[0] ?? '';
  route = route?.split('?')[0] ?? '';

  return current === route || current.startsWith(route + '/');
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768

  if (isMobile.value) {
    layout.toggleExpanded()
  }
}

const handleResize = () => {
  checkMobile()
}

onMounted(async () => {
  checkMobile();

  if (!dashboardMenus.value.length > 0) {
    await dashboardsStore.prepareMenus();
  }

  //window.addEventListener('resize', handleResize)
  // Animate menu items on load
  const items = document.querySelectorAll('.menu-item')
  const submenu = document.querySelectorAll('.submenu-item ');

  submenu.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })

  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })
})
</script>

<template>
  <nav :class="{ 'expanded': layout.isExpanded, 'collapsed': !layout.isExpanded }" class="sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-container">
        <transition name="fade-slide">

        </transition>
      </div>

      <div class="header-actions mt-10">
        <button
            v-if="isMobile"
            class="action-btn collapse-btn "
            @click="layout.toggleExpanded"
        >
          <i :class="layout.isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'" class="fa-solid"></i>
        </button>
<!--        <button-->
<!--            v-else-->
<!--            :class="{ active: showSearch }"-->
<!--            class="action-btn search-btn"-->
<!--        >-->
<!--          <i class="fa-solid fa-search"></i>-->
<!--        </button>-->
      </div>
    </div>

    <!-- Search Bar -->
    <transition name="slide-down">
      <div v-if="showSearch && layout.isExpanded" class="search-container">
        <div class="search-wrapper">
          <i class="fa-solid fa-search search-icon"></i>
          <input
              v-model="searchQuery"
              class="search-input"
              placeholder="Buscar funcionalidades..."
              type="text"
          />
          <button
              v-if="searchQuery"
              class="clear-search"
              @click="searchQuery = ''"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    </transition>

    <!-- Navigation Items -->
    <div class="nav-content">
      <div class="nav-section">
        <transition-group v-show="filteredItems.length > 0" name="list" tag="div">
          <div
              v-for="item in filteredItems"
              :key="item.id"
              class="menu-item-wrapper"
          >
            <div
                :class="{
                                active: isActive(item.id),
                                'has-submenu': item.submenu.length > 0,
                                'submenu-open': activeSubmenu === item.id,
                              }"
                class="menu-item"
                @click="toggleSubmenu(item)"
                @mouseenter="hoveredItem = item.id"
                @mouseleave="hoveredItem = null"
            >
              <div class="item-content">
                <div class="item-icon">
                  <i :class="item.icon"></i>
                  <div class="icon-glow"></div>
                </div>

                <transition name="fade-slide">
                  <div v-if="layout.isExpanded" class="item-info">
                    <span class="item-label">{{ item.label }}</span>
<!--                    <span class="item-description">{{ item.description }}</span>-->
                  </div>
                </transition>

                <div class="item-indicators">
                                <span
                                    v-if="item.badge"
                                    :class="{
                                      'badge-hot': item.badge === 'HOT',
                                      'badge-ai': item.badge === 'AI',
                                      'badge-count': typeof item.badge === 'number'
                                    }"
                                    class="item-badge"
                                >
                                    {{ item.badge }}
                                 </span>
                  <i
                      v-if="item.submenu.length > 0 && layout.isExpanded"
                      :class="{ rotated: activeSubmenu === item.id }"
                      class="fa-solid fa-chevron-down submenu-arrow"
                  ></i>
                </div>
              </div>

            </div>

            <!-- Submenu -->
            <!-- Submenu Recursivo -->
            <transition name="submenu">
              <div
                  v-if="activeSubmenu === item.id && layout.isExpanded && item?.submenu?.length > 0"
                  class="submenu pb-2"
              >
                <template v-for="subitem in item.submenu" :key="subitem.route">
                  <div
                      :class="{ active: subitem.submenu?.length ? isSubmenuOpen(subitem.id) : isActiveSubmenuItem(subitem.id), 'has-submenu': subitem.submenu?.length > 0 }"
                      class="submenu-item mr-5 mt-1"
                      @click="subitem.submenu?.length ? toggleSubmenuItem(subitem.id, subitem) : (subitem.enabled ? toggleSubmenusItem(subitem) : null)"
                  >
                    <div v-if="subitem.icon" class="item-icon">
                      <i :class="subitem.icon"></i>
                      <div class="icon-glow"></div>
                    </div>

                    <div v-else class="submenu-dot"></div>

                    <transition name="fade-slide">
                      <div class="item-info">
                        <span>{{ subitem.label }}</span>
                        <span class="item-description">{{ subitem.description }}</span>
                      </div>
                    </transition>

                    <span
                        v-if="subitem.badge"
                        class="item-badge-subitem"
                    >
                                {{ subitem.badge }}
                              </span>

                    <i
                        v-if="subitem.submenu?.length"
                        :class="{ rotated: isSubmenuOpen(subitem.id) }"
                        class="fa-solid fa-chevron-down submenu-arrow"
                        style="margin-left:auto"
                    ></i>
                  </div>

                  <!-- Sub-submenu com toggle -->
                  <transition name="submenu">
                    <div
                        v-if="isSubmenuOpen(subitem.id)"
                        class="submenu-nested"
                    >
                      <div
                          v-for="nested in subitem.submenu"
                          :key="nested.route"
                          :class="{ active: isActiveSubmenuItem(nested.id) }"
                          class="submenu-item"
                          @click="nested.enabled ? toggleSubmenusItem(nested) : null"
                      >
                        <div class="submenu-dot"></div>
                        <span>{{ nested.label }}</span>
                        <span
                            v-if="nested.badge"
                            class="item-badge-subitem"
                        >
                          {{ nested.badge }}
                        </span>
                      </div>
                    </div>
                  </transition>
                </template>
              </div>
            </transition>

          </div>
        </transition-group>
      </div>

      <!-- Bottom Section -->
      <div class="nav-bottom">
        <div class="divider"></div>

        <div
            v-for="item in bottomItems"
            :key="item.id"
            :class="{
                        active: isActive(item.route),
                        highlight: item.highlight
                    }"
            class="menu-item"
            @click="navigateTo(item.route)"
        >
          <div class="item-content">
            <div class="item-icon">
              <i :class="item.icon"></i>
              <div class="icon-glow"></div>
            </div>

            <transition name="fade-slide">
              <div v-if="layout.isExpanded" class="item-info">
                <span class="item-label">{{ item.label }}</span>
                <span class="item-description">{{ item.description }}</span>
              </div>
            </transition>

            <span
                v-if="item.badge"
                :class="{
                'badge-hot': item.badge === 'HOT',
                'badge-count': typeof item.badge === 'number'
              }"
                class="item-badge"
            >
              {{ item.badge }}
            </span>
          </div>

          <div v-if="isActive(item.route)" class="item-progress"></div>
        </div>

        <!-- Logout -->
        <button class="logout-btn" @click="handleLogout">
          <div class="item-icon">
            <i class="fa-solid fa-sign-out-alt"></i>
          </div>
          <transition name="fade-slide">
            <span v-if="layout.isExpanded" class="logout-text">Sair</span>
          </transition>
        </button>
      </div>
    </div>

    <!-- Tooltip for collapsed state -->
    <transition name="tooltip">
      <div
          v-if="!layout.isExpanded && hoveredItem"
          class="tooltip"
      >
        {{ menuItems.find(item => item.id === hoveredItem)?.label }}
      </div>
    </transition>
  </nav>
</template>

<style scoped>
#app > nav > div.nav-content > div.nav-bottom > div > div > div.item-info > span.item-label {
    font-size: 14px;
}
.submenu-nested {
  margin-left: 20px;
  padding-left: 12px;
  border-left: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 5%;
  padding-top: 5%;
  padding-right: 20px;
}

.submenu-item.has-submenu {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-img {
  width: auto;
  margin: 10px;
  height: 33px;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 270px;
  background: var(--menu-bg);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 11px;
  color: #667eea;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.action-btn.active {
  //background: #667eea;
  color: white;
}

.search-container {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.clear-search {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-section {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section::-webkit-scrollbar {
  width: 4px;
}

.nav-section::-webkit-scrollbar-track {
  background: transparent;
}

.nav-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.menu-item-wrapper {
  margin-bottom: 4px;
}

.menu-item {
  position: relative;
  margin: 0 16px;
  padding: 13px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.menu-item.active {
    background: var(--card-background);
    backdrop-filter: blur(30px);
    //border: 1px solid rgba(102, 126, 234, 0.3);
}


.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.item-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 16px;
  transition: all 0.3s ease;
}

.menu-item.active .item-icon {
  //color: #667eea;
}

.icon-glow {
  position: absolute;
  inset: -4px;
  //background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item.active .icon-glow {
  opacity: 1;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-label {
  font-size: 16px;
  //font-weight: 600;
  color: var(--text-secondary);
  line-height: 1.2;
}

.item-description {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.2;
}

.item-indicators {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-badge {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-badge-subitem {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 9px;
  background: #ff8e53;
  color: white;
  animation: pulse 2s infinite;
}

.badge-hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  animation: pulse 2s infinite;
}

.badge-ai {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-count {
  background: #ff6b6b;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.submenu-arrow {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.submenu-arrow.rotated {
  transform: rotate(180deg);
}

.active .item-progress {
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  //background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

.submenu {
  //margin-top: 8px;
  padding-left: 36px;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.submenu-item.active {
  background: rgba(102, 126, 234, 0.2);
  //color: #667eea;
}

.submenu-dot {
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.6;
}

.nav-bottom {
  padding: 20px 0;
  //border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--text-secondary) 50%, transparent 100%);
  margin: 0 20px 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 16px 0;
  padding: 12px 16px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  width: calc(100% - 32px);
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.logout-text {
  font-size: 14px;
  font-weight: 500;
}

.tooltip {
  position: fixed;
  left: 90px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1001;
  backdrop-filter: blur(10px);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 200px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-5px);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.expanded {
    transform: translateX(0);
  }
}
</style>