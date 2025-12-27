import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Campaigns from '../views/Campaigns.vue'
import Rules from '../views/Rules.vue'
import Reports from '../views/Reports.vue'
import Integrations from '../views/Integrations.vue'
import Profile from '../views/Profile.vue'
import Notifications from '../views/Notifications.vue'
import Landing from '../views/Landing.vue'
import Privacy from '../views/Privacy.vue'
import Support from '../views/Support.vue'
import DashboardManagement from '../views/DashboardManagement.vue'
import KwaiDashboard from '../views/KwaiDashboard.vue'

import Login from '../views/Login/index.vue'
import Register from '../views/Auth/Register.vue'
import Subscription from "../views/Subscription.vue";
import InvoiceDetails from '../views/InvoiceDetails.vue'
import Referral from '../views/Referral.vue'
import Community from '../views/Community.vue'
import WebhookLogs from '../views/WebhookLogs.vue'


import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminSettings from '../views/admin/Settings.vue'
import Cookies from 'js-cookie'
import PerformanceAnalysis from '../views/PerformanceAnalysis.vue'
import ApiDocumentation from '../views/ApiDocumentation.vue'
import {useDashboardsStore} from '@/store/dashboards';
import TermosCondicoes from "../views/TermosCondicoes.vue";
import ForgotPassword from "../views/Auth/ForgotPassword.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import FeesManagement from "../views/FeesManagement.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: Landing
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: Privacy
        },
        {
            path: '/termos-e-condicoes',
            name: 'termos',
            component: TermosCondicoes
        },
        {
            path: '/documentation',
            name: 'documentation',
            component: ApiDocumentation
        },
        {
            path: '/performance',
            name: 'performance',
            component: PerformanceAnalysis,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard-management',
            name: 'dashboard-management',
            component: DashboardManagement,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/community',
            name: 'community',
            component: Community,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/fees',
            name: 'fees',
            component: FeesManagement,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/campaigns',
            name: 'campaigns',
            component: Campaigns,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/rules',
            name: 'rules',
            component: Rules,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/integrations',
            name: 'integrations',
            component: Integrations,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/reports',
            name: 'reports',
            component: Reports,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/support',
            name: 'support',
            component: Support,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/subscription',
            name: 'subscription',
            component: Subscription,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/invoice-details',
            name: 'invoice-details',
            component: InvoiceDetails
        },
        {
            path: '/notifications',
            name: 'notifications',
            component: Notifications,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/integrations/webhook/:id/logs',
            name: 'webhook-logs',
            component: WebhookLogs,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/kwai-dashboard',
            name: 'kwai-dashboard',
            component: KwaiDashboard,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/referral',
            name: 'referral',
            component: Referral
        },
        // admin routes
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard,
            meta: {requiresAdmin: true}
        },
        {
            path: '/admin/users',
            name: 'admin-users',
            component: AdminUsers,
            meta: {requiresAdmin: true}
        },
        // {
        //     path: '/admin/subscriptions',
        //     name: 'admin-subscriptions',
        //     component: AdminSubscriptions,
        //     meta: {requiresAdmin: true}
        // },
        {
            path: '/admin/settings',
            name: 'admin-settings',
            component: AdminSettings,
            meta: {requiresAdmin: true}
        },
        {path: '/auth/forgot-password', name: 'forgot', component: ForgotPassword},
        {path: '/reset-password', name: 'reset', component: ResetPassword},
        {path: '/login', name: 'login', component: Login},
        {path: '/auth/register', name: 'register', component: Register},
    ]
})

export const isPublicRoute = (route) => {
    return ['/auth/login','/auth/forgot-password', '/reset-password', '/auth/register', '/', '/privacy', '/documentation', '/termos-e-condicoes'].includes(route.path)
}

export const isLoading = () => {
    return false;
}
// 🧠 Middleware de autenticação

router.beforeEach(async (to, from, next) => {
    if (isPublicRoute(to)) {
        return next()
    }

    const token = Cookies.get(import.meta.env.VITE_API_TOKEN_KEY)
    const user = localStorage.getItem('user')

    if (!token || !user) {
        return next('/auth/login')
    }

    // ✅ Usuário está autenticado
    if (to.name == 'dashboard' && !to.query.code) {
        // Pega a store e garante que dashboards estejam carregados
        const dashboardsStore = useDashboardsStore()

        if(!dashboardsStore.firstDashboardCode) {
            await dashboardsStore.fetchDashboards()
        }

        const firstCode = dashboardsStore.firstDashboardCode
        const currentMenu = dashboardsStore.dashboards[0];

        if (firstCode) {
            return next({
                name: currentMenu.type == 'FACEBOOK' ? to.name : 'kwai-dashboard',
                params: to.params,
                query: { ...to.query, code: firstCode },
                hash: to.hash
            })
        }
    }
    // if (to.meta.requiresAdmin) {
    //     // Check if user is admin
    //     const isAdmin = localStorage.getItem('isAdmin') === 'true'
    //     if (!isAdmin) {
    //         next('/')
    //         return
    //     }
    // }
    // Já tem ?code= ou não precisa redirecionar
    return next()
})
export default router