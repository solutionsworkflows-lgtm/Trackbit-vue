<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitleStore } from '../store/pageTitle'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

const pageTitle = usePageTitleStore()

onMounted(() => {
    pageTitle.setTitle('Comunidade')
})

const posts = ref([
    {
        id: 1,
        user: {
            name: 'João Silva',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
            badge: '🏆 Top Performer',
            level: 'Especialista'
        },
        content: 'Acabei de bater 5.2 de ROAS em uma campanha nova! Quem quiser as configurações que usei, só comentar 🚀',
        metrics: {
            roas: 5.2,
            revenue: 15780.50,
            cost: 3034.71
        },
        engagement: {
            likes: 24,
            comments: 12,
            shares: 3
        },
        timestamp: '2025-04-25T14:30:00Z',
        category: 'success'
    },
    {
        id: 2,
        user: {
            name: 'Maria Santos',
            avatar: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100',
            badge: '💡 Inovadora',
            level: 'Avançado'
        },
        content: 'Pessoal, descobri um padrão interessante nos horários de conversão. Vou compartilhar uma análise completa hoje à noite!',
        engagement: {
            likes: 15,
            comments: 8,
            shares: 1
        },
        timestamp: '2025-04-25T13:15:00Z',
        category: 'insight'
    }
])

const activeTab = ref('feed')
const showNewPostModal = ref(false)

const missions = [
    {
        id: 1,
        title: 'Primeira Venda',
        description: 'Faça sua primeira venda com tracking ativo',
        reward: '🌟 100 XP',
        progress: 80
    },
    {
        id: 2,
        title: 'Mestre dos Criativos',
        description: 'Teste 5 criativos diferentes esta semana',
        reward: '🎨 200 XP',
        progress: 40
    },
    {
        id: 3,
        title: 'Otimizador CPA',
        description: 'Reduza seu CPA em 15%',
        reward: '💰 300 XP',
        progress: 60
    }
]

const topPerformers = [
    {
        rank: 1,
        name: 'João Silva',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        metric: 'ROAS 5.2',
        change: '+0.8'
    },
    {
        rank: 2,
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=100',
        metric: 'ROAS 4.8',
        change: '+1.2'
    },
    {
        rank: 3,
        name: 'Pedro Costa',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
        metric: 'ROAS 4.5',
        change: '+0.5'
    }
]

const groups = [
    {
        id: 1,
        name: 'Tráfego para PLR',
        members: 234,
        description: 'Grupo focado em estratégias de tráfego para produtos PLR',
        icon: '📚',
        category: 'Tráfego',
        lastActivity: '2025-04-25T14:30:00Z'
    },
    {
        id: 2,
        name: 'Gestores de Lançamento',
        members: 156,
        description: 'Compartilhe experiências e aprenda com outros gestores de lançamento',
        icon: '🚀',
        category: 'Lançamentos',
        lastActivity: '2025-04-25T13:45:00Z'
    },
    {
        id: 3,
        name: 'Leads via WhatsApp',
        members: 189,
        description: 'Estratégias e dicas para geração de leads pelo WhatsApp',
        icon: '💬',
        category: 'Leads',
        lastActivity: '2025-04-25T12:15:00Z'
    },
    {
        id: 4,
        name: 'Afiliados Iniciantes',
        members: 312,
        description: 'Grupo de suporte para afiliados começando no mercado',
        icon: '🌱',
        category: 'Afiliados',
        lastActivity: '2025-04-25T11:30:00Z'
    }
]

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const handleNewPost = () => {
    showNewPostModal.value = true
}

const likePost = (postId: number) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        post.engagement.likes++
    }
}

const sharePost = (postId: number) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
        post.engagement.shares++
    }
}

const joinGroup = (groupId: number) => {
    // Handle group join logic
    console.log('Joining group:', groupId)
}

const getLastActivityText = (date: string) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / 60000)

    if (diffInMinutes < 60) {
        return `${diffInMinutes}m atrás`
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h atrás`
    } else {
        return formatDate(date)
    }
}
// User Profile Data
const userProfile = {
    name: 'João Silva',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    business: 'Marketing Digital',
    niche: 'Infoprodutos',
    status: 'Escalador',
    revenue: 1250000.00,
    showRevenue: true,
    badges: [
        { icon: '🏆', name: 'Top Performer', description: 'Entre os 10 melhores da plataforma' },
        { icon: '🚀', name: 'Primeira Escala', description: 'Alcançou ROAS 3.0' },
        { icon: '💎', name: 'Mestre do CPA', description: 'Manteve CPA baixo por 7 dias' }
    ],
    stats: {
        totalSales: 1567,
        averageRoas: 4.2,
        bestCampaign: {
            name: 'Black Friday 2024',
            roas: 8.5
        }
    },
    level: {
        current: 'Escalador',
        progress: 75,
        nextLevel: 'Expert',
        requiredPoints: 1000,
        currentPoints: 750
    }
}
</script>

<template>
    <div class="community">

        <div class="community-main">

            <div class="community-content">
                <!-- Navigation -->
                <nav class="community-nav">
                    <button
                        v-for="tab in ['feed', 'perfil', 'ranking', 'missoes', 'grupos']"
                        :key="tab"
                        class="nav-button"
                        :class="{ active: activeTab === tab }"
                        @click="activeTab = tab"
                    >
                        {{ {
                        feed: 'Feed',
                        perfil: 'Meu Perfil',
                        ranking: 'Ranking',
                        missoes: 'Missões',
                        grupos: 'Grupos'
                    }[tab] }}
                    </button>
                </nav>

                <!-- Feed Tab -->
                <div v-if="activeTab === 'feed'" class="community-grid">
                    <!-- Main Content -->
                    <div class="main-content">
                        <!-- New Post Button -->
                        <button class="new-post-button" @click="handleNewPost">
                            <span class="button-icon">✏️</span>
                            <span class="button-text">Criar nova publicação</span>
                        </button>

                        <!-- Posts Feed -->
                        <div class="posts-feed">
                            <div
                                v-for="post in posts"
                                :key="post.id"
                                class="post-card"
                                :class="post.category"
                            >
                                <!-- Post Header -->
                                <div class="post-header">
                                    <div class="user-info">
                                        <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar" />
                                        <div class="user-details">
                                            <div class="user-name">{{ post.user.name }}</div>
                                            <div class="user-badges">
                                                <span class="user-badge">{{ post.user.badge }}</span>
                                                <span class="user-level">{{ post.user.level }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="post-time">{{ formatDate(post.timestamp) }}</div>
                                </div>

                                <!-- Post Content -->
                                <div class="post-content">{{ post.content }}</div>

                                <!-- Metrics Card (if available) -->
                                <div v-if="post.metrics" class="metrics-card">
                                    <div class="metric">
                                        <span class="metric-label">ROAS</span>
                                        <span class="metric-value highlight">{{ post.metrics.roas }}x</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Receita</span>
                                        <span class="metric-value">R$ {{ post.metrics.revenue.toLocaleString() }}</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Custo</span>
                                        <span class="metric-value">R$ {{ post.metrics.cost.toLocaleString() }}</span>
                                    </div>
                                </div>

                                <!-- Post Actions -->
                                <div class="post-actions">
                                    <button class="action-button" @click="likePost(post.id)">
                                        👍 {{ post.engagement.likes }}
                                    </button>
                                    <button class="action-button">
                                        💬 {{ post.engagement.comments }}
                                    </button>
                                    <button class="action-button" @click="sharePost(post.id)">
                                        🔄 {{ post.engagement.shares }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="sidebar">
                        <!-- Missions Section -->
                        <div class="sidebar-section">
                            <h3>Missões Ativas</h3>
                            <div class="missions-list">
                                <div v-for="mission in missions" :key="mission.id" class="mission-card">
                                    <div class="mission-header">
                                        <h4>{{ mission.title }}</h4>
                                        <span class="mission-reward">{{ mission.reward }}</span>
                                    </div>
                                    <p class="mission-description">{{ mission.description }}</p>
                                    <div class="progress-bar">
                                        <div
                                            class="progress"
                                            :style="{ width: `${mission.progress}%` }"
                                        ></div>
                                    </div>
                                    <div class="progress-text">{{ mission.progress }}% completo</div>
                                </div>
                            </div>
                        </div>

                        <!-- Top Performers -->
                        <div class="sidebar-section">
                            <h3>Top Performers</h3>
                            <div class="performers-list">
                                <div
                                    v-for="performer in topPerformers"
                                    :key="performer.rank"
                                    class="performer-card"
                                >
                                    <div class="rank">{{ performer.rank }}º</div>
                                    <img :src="performer.avatar" :alt="performer.name" class="performer-avatar" />
                                    <div class="performer-info">
                                        <div class="performer-name">{{ performer.name }}</div>
                                        <div class="performer-metric">
                                            {{ performer.metric }}
                                            <span class="metric-change" :class="{ positive: performer.change.startsWith('+') }">
                        {{ performer.change }}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Tab -->
                <div v-if="activeTab === 'perfil'" class="profile-container">
                    <div class="profile-header">
                        <div class="profile-info">
                            <div class="profile-avatar">
                                <img :src="userProfile.avatar" :alt="userProfile.name" />
                                <div class="profile-status" :title="`Status: ${userProfile.status}`">
                                    {{ userProfile.status === 'Escalador' ? '🚀' : '👤' }}
                                </div>
                            </div>
                            <div class="profile-details">
                                <h2>{{ userProfile.name }}</h2>
                                <div class="profile-meta">
                                    <span class="business-tag">{{ userProfile.business }}</span>
                                    <span class="niche-tag">{{ userProfile.niche }}</span>
                                </div>
                                <div v-if="userProfile.showRevenue" class="profile-revenue">
                                    <span class="revenue-label">Faturamento Total</span>
                                    <span class="revenue-value">
                    {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(userProfile.revenue) }}
                  </span>
                                </div>
                            </div>
                        </div>
                        <div class="profile-level">
                            <div class="level-info">
                                <span class="current-level">{{ userProfile.level.current }}</span>
                                <span class="next-level">Próximo: {{ userProfile.level.nextLevel }}</span>
                            </div>
                            <div class="level-progress">
                                <div class="progress-bar">
                                    <div
                                        class="progress"
                                        :style="{ width: `${userProfile.level.progress}%` }"
                                    ></div>
                                </div>
                                <span class="progress-text">
                  {{ userProfile.level.currentPoints }}/{{ userProfile.level.requiredPoints }} XP
                </span>
                            </div>
                        </div>
                    </div>

                    <div class="profile-grid">
                        <!-- Stats Section -->
                        <div class="profile-section">
                            <h3>Estatísticas</h3>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <span class="stat-icon">🛒</span>
                                    <div class="stat-info">
                                        <span class="stat-value">{{ userProfile.stats.totalSales }}</span>
                                        <span class="stat-label">Vendas Totais</span>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-icon">📈</span>
                                    <div class="stat-info">
                                        <span class="stat-value">{{ userProfile.stats.averageRoas }}x</span>
                                        <span class="stat-label">ROAS Médio</span>
                                    </div>
                                </div>
                                <div class="stat-card highlight">
                                    <span class="stat-icon">🏆</span>
                                    <div class="stat-info">
                                        <span class="stat-value">{{ userProfile.stats.bestCampaign.roas }}x</span>
                                        <span class="stat-label">Melhor ROAS</span>
                                        <span class="stat-subtitle">{{ userProfile.stats.bestCampaign.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Badges Section -->
                        <div class="profile-section">
                            <h3>Conquistas</h3>
                            <div class="badges-grid">
                                <div
                                    v-for="badge in userProfile.badges"
                                    :key="badge.name"
                                    class="badge-card"
                                >
                                    <div class="badge-icon">{{ badge.icon }}</div>
                                    <div class="badge-info">
                                        <h4>{{ badge.name }}</h4>
                                        <p>{{ badge.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Posts Section -->
                        <div class="profile-section">
                            <h3>Últimas Publicações</h3>
                            <div class="posts-list">
                                <div
                                    v-for="post in posts.slice(0, 2)"
                                    :key="post.id"
                                    class="post-card"
                                    :class="post.category"
                                >
                                    <div class="post-content">{{ post.content }}</div>
                                    <div v-if="post.metrics" class="metrics-card">
                                        <div class="metric">
                                            <span class="metric-label">ROAS</span>
                                            <span class="metric-value highlight">{{ post.metrics.roas }}x</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-label">Receita</span>
                                            <span class="metric-value">R$ {{ post.metrics.revenue.toLocaleString() }}</span>
                                        </div>
                                    </div>
                                    <div class="post-footer">
                                        <span class="post-date">{{ formatDate(post.timestamp) }}</span>
                                        <div class="post-stats">
                                            <span>👍 {{ post.engagement.likes }}</span>
                                            <span>💬 {{ post.engagement.comments }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ranking Tab -->
                <div v-if="activeTab === 'ranking'" class="ranking-container">
                    <div class="ranking-header">
                        <h2>Ranking de Performance</h2>
                        <div class="ranking-period">
                            <button class="period-button active">Este mês</button>
                            <button class="period-button">Últimos 3 meses</button>
                            <button class="period-button">Todo período</button>
                        </div>
                    </div>

                    <div class="ranking-categories">
                        <div class="ranking-category">
                            <h3>🏆 Melhor ROAS</h3>
                            <div class="ranking-list">
                                <div
                                    v-for="performer in topPerformers"
                                    :key="performer.rank"
                                    class="ranking-item"
                                >
                                    <div class="rank-badge" :class="`rank-${performer.rank}`">
                                        {{ performer.rank }}º
                                    </div>
                                    <img :src="performer.avatar" :alt="performer.name" class="rank-avatar" />
                                    <div class="rank-info">
                                        <span class="rank-name">{{ performer.name }}</span>
                                        <span class="rank-metric">ROAS {{ performer.metric }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="ranking-category">
                            <h3>💰 Maior Faturamento</h3>
                            <div class="ranking-list">
                                <div
                                    v-for="performer in topPerformers"
                                    :key="performer.rank"
                                    class="ranking-item"
                                >
                                    <div class="rank-badge" :class="`rank-${performer.rank}`">
                                        {{ performer.rank }}º
                                    </div>
                                    <img :src="performer.avatar" :alt="performer.name" class="rank-avatar" />
                                    <div class="rank-info">
                                        <span class="rank-name">{{ performer.name }}</span>
                                        <span class="rank-metric">R$ 150.000,00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="ranking-category">
                            <h3>🎯 Melhor CPA</h3>
                            <div class="ranking-list">
                                <div
                                    v-for="performer in topPerformers"
                                    :key="performer.rank"
                                    class="ranking-item"
                                >
                                    <div class="rank-badge" :class="`rank-${performer.rank}`">
                                        {{ performer.rank }}º
                                    </div>
                                    <img :src="performer.avatar" :alt="performer.name" class="rank-avatar" />
                                    <div class="rank-info">
                                        <span class="rank-name">{{ performer.name }}</span>
                                        <span class="rank-metric">CPA R$ 25,00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Missions Tab -->
                <div v-if="activeTab === 'missoes'" class="missions-container">
                    <div class="missions-header">
                        <h2>Missões e Desafios</h2>
                        <div class="missions-stats">
                            <div class="stat">
                                <span class="stat-value">1.250</span>
                                <span class="stat-label">XP Total</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">15</span>
                                <span class="stat-label">Missões Completas</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">5</span>
                                <span class="stat-label">Badges Conquistadas</span>
                            </div>
                        </div>
                    </div>

                    <div class="missions-grid">
                        <div class="missions-category">
                            <h3>🎯 Missões Diárias</h3>
                            <div class="missions-list">
                                <div v-for="mission in missions" :key="mission.id" class="mission-card">
                                    <div class="mission-header">
                                        <h4>{{ mission.title }}</h4>
                                        <span class="mission-reward">{{ mission.reward }}</span>
                                    </div>
                                    <p class="mission-description">{{ mission.description }}</p>
                                    <div class="progress-bar">
                                        <div
                                            class="progress"
                                            :style="{ width: `${mission.progress}%` }"
                                        ></div>
                                    </div>
                                    <div class="progress-text">{{ mission.progress }}% completo</div>
                                </div>
                            </div>
                        </div>

                        <div class="missions-category">
                            <h3>🏆 Conquistas</h3>
                            <div class="achievements-grid">
                                <div class="achievement-card">
                                    <div class="achievement-icon">🚀</div>
                                    <h4>Primeira Escala</h4>
                                    <p>Alcance ROAS 3.0 em uma campanha</p>
                                    <div class="achievement-progress">
                                        <div class="progress-bar">
                                            <div class="progress" style="width: 75%"></div>
                                        </div>
                                        <span>75%</span>
                                    </div>
                                </div>
                                <div class="achievement-card completed">
                                    <div class="achievement-icon">💎</div>
                                    <h4>Mestre do CPA</h4>
                                    <p>Mantenha CPA abaixo de R$30 por 7 dias</p>
                                    <div class="achievement-status">Concluído!</div>
                                </div>
                                <div class="achievement-card">
                                    <div class="achievement-icon">📈</div>
                                    <h4>Rei do ROI</h4>
                                    <p>Alcance 500% de ROI em uma campanha</p>
                                    <div class="achievement-progress">
                                        <div class="progress-bar">
                                            <div class="progress" style="width: 30%"></div>
                                        </div>
                                        <span>30%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Groups Tab -->
                <div v-if="activeTab === 'grupos'" class="groups-container">
                    <div class="groups-header">
                        <h2>Grupos da Comunidade</h2>
                        <button class="btn-primary">Criar Novo Grupo</button>
                    </div>

                    <div class="groups-filters">
                        <div class="search-box">
                            <input type="text" placeholder="Buscar grupos..." class="search-input" />
                        </div>
                        <div class="filter-tags">
                            <button class="filter-tag active">Todos</button>
                            <button class="filter-tag">Tráfego</button>
                            <button class="filter-tag">Lançamentos</button>
                            <button class="filter-tag">Leads</button>
                            <button class="filter-tag">Afiliados</button>
                        </div>
                    </div>

                    <div class="groups-grid">
                        <div
                            v-for="group in groups"
                            :key="group.id"
                            class="group-card"
                        >
                            <div class="group-icon">{{ group.icon }}</div>
                            <div class="group-content">
                                <h3>{{ group.name }}</h3>
                                <p class="group-description">{{ group.description }}</p>
                                <div class="group-meta">
                                    <span class="group-members">{{ group.members }} membros</span>
                                    <span class="group-activity">
                    Última atividade {{ getLastActivityText(group.lastActivity) }}
                  </span>
                                </div>
                                <div class="group-category">{{ group.category }}</div>
                            </div>
                            <button class="join-group-btn" @click="joinGroup(group.id)">
                                Participar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- New Post Modal -->
                <div v-if="showNewPostModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Criar nova publicação</h3>
                            <button @click="showNewPostModal = false" class="close-btn">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="post-type-selector">
                                <button class="post-type-button active">
                                    <span class="type-icon">💭</span>
                                    <span class="type-label">Texto</span>
                                </button>
                                <button class="post-type-button">
                                    <span class="type-icon">📊</span>
                                    <span class="type-label">Métricas</span>
                                </button>
                                <button class="post-type-button">
                                    <span class="type-icon">❓</span>
                                    <span class="type-label">Pergunta</span>
                                </button>
                            </div>

                            <textarea
                                placeholder="O que você quer compartilhar?"
                                class="post-input"
                                rows="4"
                            ></textarea>

                            <div class="post-options">
                                <button class="option-button">
                                    <span class="option-icon">🏷️</span>
                                    Adicionar categoria
                                </button>
                                <button class="option-button">
                                    <span class="option-icon">📎</span>
                                    Anexar arquivo
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button @click="showNewPostModal = false" class="btn-secondary">
                                Cancelar
                            </button>
                            <button class="btn-primary">
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Existing styles remain unchanged */

/* Profile Tab Styles */
.profile-container {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
}

.profile-info {
    display: flex;
    gap: var(--spacing-lg);
}

.profile-avatar {
    position: relative;
    width: 120px;
    height: 120px;
}

.profile-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.profile-status {
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
    font-size: 20px;
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.profile-details h2 {
    margin: 0;
    font-size: 24px;
    color: var(--text-primary);
}

.profile-meta {
    display: flex;
    gap: var(--spacing-sm);
}

.business-tag,
.niche-tag {
    padding: 4px 12px;
    background-color: var(--menu-hover);
    border-radius: 20px;
    font-size: 14px;
    color: var(--text-secondary);
}

.profile-revenue {
    margin-top: var(--spacing-sm);
}

.revenue-label {
    display: block;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 2px;
}

.revenue-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
}

.profile-level {
    text-align: right;
}

.level-info {
    margin-bottom: var(--spacing-sm);
}

.current-level {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
}

.next-level {
    font-size: 14px;
    color: var(--text-secondary);
    margin-left: var(--spacing-sm);
}

.level-progress {
    width: 200px;
}

.progress-bar {
    height: 8px;
    background-color: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
}

.progress {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 12px;
    color: var(--text-secondary);
}

.profile-grid {
    display: grid;
    gap: var(--spacing-xl);
}

.profile-section {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.profile-section h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.stat-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.stat-icon {
    font-size: 24px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.stat-subtitle {
    font-size: 12px;
    color: var(--text-muted);
}

.stat-card.highlight {
    border: 1px solid var(--primary-color);
}

.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
}

.badge-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.badge-icon {
    font-size: 32px;
    width: 48px;
    height: 48px;
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-info h4 {
    margin: 0 0 var(--spacing-xs);
    font-size: 16px;
    color: var(--text-primary);
}

.badge-info p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.posts-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.post-date {
    font-size: 14px;
    color: var(--text-secondary);
}

.post-stats {
    display: flex;
    gap: var(--spacing-md);
    color: var(--text-secondary);
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .profile-level {
        text-align: center;
        width: 100%;
    }

    .level-progress {
        width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}


.stat-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.stat-icon {
    font-size: 24px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.stat-subtitle {
    font-size: 12px;
    color: var(--text-muted);
}

.stat-card.highlight {
    border: 1px solid var(--primary-color);
}

.badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
}

.badge-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.badge-icon {
    font-size: 32px;
    width: 48px;
    height: 48px;
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-info h4 {
    margin: 0 0 var(--spacing-xs);
    font-size: 16px;
    color: var(--text-primary);
}

.badge-info p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.posts-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.post-date {
    font-size: 14px;
    color: var(--text-secondary);
}

.post-stats {
    display: flex;
    gap: var(--spacing-md);
    color: var(--text-secondary);
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .profile-level {
        text-align: center;
        width: 100%;
    }

    .level-progress {
        width: 100%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
.community {
    min-height: 100vh;
    background-color: var(--background-color);
}

.community-main {
    margin-left: 250px;
}

.community-content {
    padding: var(--spacing-lg);
    max-width: 1400px;
    margin: 0 auto;
}

.community-nav {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-sm);
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}

.nav-button {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: none;
    border: none;
    color: var(--text-secondary);
    font-weight: 500;
    border-radius: var(--border-radius-sm);
    transition: all 0.3s ease;
}

.nav-button:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.nav-button.active {
    background-color: var(--primary-color);
    color: white;
}

.community-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--spacing-xl);
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.new-post-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--card-background);
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius-lg);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.new-post-button:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
}

.button-icon {
    font-size: 24px;
}

.posts-feed {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.post-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.post-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.post-card.success {
    border-left: 4px solid #4BB543;
}

.post-card.insight {
    border-left: 4px solid #1877F2;
}

.post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
}

.user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.user-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.user-name {
    font-weight: 600;
    color: var(--text-primary);
}

.user-badges {
    display: flex;
    gap: var(--spacing-sm);
}

.user-badge {
    font-size: 12px;
    color: var(--primary-color);
}

.user-level {
    font-size: 12px;
    color: var(--text-secondary);
}

.post-time {
    font-size: 14px;
    color: var(--text-secondary);
}

.post-content {
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
    line-height: 1.6;
}

.metrics-card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-lg);
}

.metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
}

.metric-label {
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
}

.metric-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.metric-value.highlight {
    color: var(--primary-color);
}

.post-actions {
    display: flex;
    gap: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.action-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-button:hover {
    color: var(--primary-color);
    transform: scale(1.1);
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.sidebar-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.sidebar-section h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.missions-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.mission-card {
    padding: var(--spacing-md);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
}

.mission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
}

.mission-header h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.mission-reward {
    font-size: 14px;
    color: var(--primary-color);
}

.mission-description {
    margin: 0 0 var(--spacing-md);
    font-size: 14px;
    color: var(--text-secondary);
}

.progress-bar {
    height: 6px;
    background-color: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: var(--spacing-xs);
}

.progress {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 12px;
    color: var(--text-secondary);
    text-align: right;
}

.performers-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.performer-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
}

.rank {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
    min-width: 30px;
}

.performer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.performer-info {
    flex-grow: 1;
}

.performer-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.performer-metric {
    font-size: 12px;
    color: var(--text-secondary);
}

.metric-change {
    margin-left: var(--spacing-xs);
}

.metric-change.positive {
    color: #4BB543;
}

/* Ranking Tab Styles */
.ranking-container {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.ranking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
}

.ranking-header h2 {
    margin: 0;
    font-size: 24px;
    color: var(--text-primary);
}

.ranking-period {
    display: flex;
    gap: var(--spacing-sm);
}

.period-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.period-button:hover {
    background-color: var(--menu-hover);
}

.period-button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.ranking-categories {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

.ranking-category {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.ranking-category h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.ranking-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.ranking-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    background-color: var(--card-background);
    border-radius: var(--border-radius-sm);
}

.rank-badge {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 600;
    font-size: 14px;
}

.rank-1 {
    background-color: #FFD700;
    color: #000;
}

.rank-2 {
    background-color: #C0C0C0;
    color: #000;
}

.rank-3 {
    background-color: #CD7F32;
    color: #fff;
}

.rank-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
}

.rank-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.rank-name {
    font-weight: 500;
    color: var(--text-primary);
}

.rank-metric {
    font-size: 14px;
    color: var(--text-secondary);
}

/* Missions Tab Styles */
.missions-container {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.missions-header {
    margin-bottom: var(--spacing-xl);
}

.missions-header h2 {
    margin: 0 0 var(--spacing-md);
    font-size: 24px;
    color: var(--text-primary);
}

.missions-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

.stat {
    background-color: var(--menu-hover);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.missions-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
}

.missions-category {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.missions-category h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.achievement-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    text-align: center;
}

.achievement-icon {
    font-size: 32px;
    margin-bottom: var(--spacing-sm);
}

.achievement-card h4 {
    margin: 0 0 var(--spacing-xs);
    font-size: 16px;
    color: var(--text-primary);
}

.achievement-card p {
    margin: 0 0 var(--spacing-md);
    font-size: 14px;
    color: var(--text-secondary);
}

.achievement-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.achievement-status {
    color: #4BB543;
    font-weight: 500;
}

.achievement-card.completed {
    border: 1px solid #4BB543;
}

/* Groups Tab Styles */
.groups-container {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.groups-header h2 {
    margin: 0;
    font-size: 24px;
    color: var(--text-primary);
}

.groups-filters {
    margin-bottom: var(--spacing-xl);
}

.search-box {
    margin-bottom: var(--spacing-md);
}

.search-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.filter-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.filter-tag {
    padding: var(--spacing-xs) var(--spacing-md);
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-tag:hover {
    background-color: var(--menu-hover);
}

.filter-tag.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

.group-card {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-md);
    transition: all 0.3s ease;
}

.group-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.group-icon {
    font-size: 32px;
    width: 60px;
    height: 60px;
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.group-content {
    flex-grow: 1;
}

.group-content h3 {
    margin: 0 0 var(--spacing-xs);
    font-size: 18px;
    color: var(--text-primary);
}

.group-description {
    margin: 0 0 var(--spacing-md);
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.group-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
}

.group-category {
    display: inline-block;
    padding: 2px 8px;
    background-color: var(--card-background);
    border-radius: 12px;
    font-size: 12px;
    color: var(--text-primary);
}

.join-group-btn {
    align-self: flex-end;
    padding: var(--spacing-xs) var(--spacing-md);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all 0.3s ease;
}

.join-group-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
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
    max-width: 600px;
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
    font-size: 20px;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
}

.modal-body {
    padding: var(--spacing-lg);
}

.post-type-selector {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.post-type-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
    background-color: var(--menu-hover);
    border: none;
    border-radius: var(--border-radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.post-type-button:hover {
    background-color: var(--border-color);
}

.post-type-button.active {
    background-color: var(--primary-color);
    color: white;
}

.type-icon {
    font-size: 24px;
}

.type-label {
    font-size: 14px;
    font-weight: 500;
}

.post-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    resize: vertical;
    margin-bottom: var(--spacing-lg);
}

.post-options {
    display: flex;
    gap: var(--spacing-md);
}

.option-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--menu-hover);
    border: none;
    border-radius: var(--border-radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.option-button:hover {
    background-color: var(--border-color);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
}

.btn-primary,
.btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

@media (max-width: 1024px) {
    .community-grid {
        grid-template-columns: 1fr;
    }

    .ranking-categories {
        grid-template-columns: 1fr;
    }

    .missions-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .community-main {
        margin-left: 0;
    }

    .community-nav {
        overflow-x: auto;
        padding-bottom: var(--spacing-xs);
    }

    .nav-button {
        white-space: nowrap;
    }

    .post-type-selector {
        flex-direction: column;
    }

    .achievements-grid {
        grid-template-columns: 1fr;
    }

    .groups-grid {
        grid-template-columns: 1fr;
    }
}
</style>