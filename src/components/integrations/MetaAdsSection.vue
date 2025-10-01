<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { useFacebookStore } from '@/store/facebookStore'
import { useAdAccountsStoreSelect } from '@/store/adAccountsStore'
import { useFacebookAuth } from '@/composables/useFacebookAuth'
import { useSubscriptionStore } from '@/store/subscription/subscriptionStore'
import { useBusinessManagerStore } from '@/store/businessManagerStore'


const subscriptionStore = useSubscriptionStore()
const businessManagerStore = useBusinessManagerStore()

const facebookStore = useFacebookStore()
const adAccountsStoreSelect = useAdAccountsStoreSelect()
const { loginWithFacebook } = useFacebookAuth()

const loading = ref(false)
const usage = computed(() => {
    const plan = subscriptionStore.currentPlan // aqui já deve ser o objeto
    if (!plan) return []
    const features = plan.features_usage ?? []
    return Array.isArray(features) ? features : Object.values(features)
})

const syncBmAndAccounts = async () => {
    loading.value = true
    try {
        await businessManagerStore.sync()
        await facebookStore.syncAdAccount()
        await adAccountsStoreSelect.fetch();
    } finally {
        loading.value = false
    }
}
const handleToggle = async (account: any) => {
    if (account.ad_account_active) {
        adAccountsStoreSelect.stop(account.ad_account_id)
    } else {
        adAccountsStoreSelect.start(account.ad_account_id)
    }
}

onMounted(async () => {
    await facebookStore.validateToken();
    await subscriptionStore.fetchCurrentPlan();

    if (!facebookStore.invalidToken) {
        adAccountsStoreSelect.fetch()
    }
});

</script>

<template>
    <div class="section">
        <div v-if="facebookStore.invalidToken" class="alert alert-warning items-center">
            Sua sessão expirou. Clique no botão ao lado para conectar novamente.
        </div>

        <!-- Meta Ads Section -->
        <div class="integration-section">
            <!-- Usage Stats -->
            <div class="usage-stats">
                <div class="usage-card">
                    <div v-if="subscriptionStore.loading" class="text-sm text-gray-400 text-center block">
                        Carregando...
                    </div>
                    <div v-if="usage.length">
                        <div class="usage-item" v-for="(usageItem, key) in usage" :key="key">
                            <span v-if='usageItem?.code == "contas"'>{{ usageItem.title }}</span>
                            <span v-if='usageItem?.code == "contas"'>{{ usageItem.used }} / {{ subscriptionStore.currentPlan?.name === 'sentinela' ? 'ILIMITADO' : usageItem.limit }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-header">
                <div class="section-title">
                    <img alt="Meta" class="fb-icon" src="https://www.facebook.com/favicon.ico" />
                    <div>
                        <h2>Meta Ads</h2>
                        <p>Conecte suas contas do Facebook Ads</p>
                    </div>
                </div>

                <div v-if="!facebookStore.invalidToken" style="display: flex">
                    <div class="connection-status connected">
                        <span class="status-dot"></span>
                        Conectado
                    </div>
                    <button
                        class="icon-btn"
                        @click="syncBmAndAccounts"
                        :disabled="loading"
                        style="padding: 8px; margin-left: 8px"
                    >
                        <i
                            v-if="!loading"
                            class="fa-solid fa-refresh"
                        ></i>
                        <i
                            v-else
                            class="fa-solid fa-spinner fa-spin"
                        ></i>
                    </button>


                    <button class="icon-btn" @click="facebookStore.removeToken()" :disabled="facebookStore.loadingFacebook" style="padding: 8px; margin-left: 8px">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
<!--                <button-->
<!--                    v-else-->
<!--                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"-->
<!--                    @click="loginWithFacebook"-->
<!--                >-->
<!--                    {{ loading ? 'Sincronizando...' : 'Adicionar perfil' }}-->
<!--                </button>-->
            </div>

            <!-- Ad Accounts List -->
            <div class="ad-accounts-section" v-if="!facebookStore.invalidToken">
                <h3>Contas de Anúncio</h3>

                <!-- Estado: sem contas -->
<!--                <div v-if="adAccountsStoreSelect.items.length === 0" class="text-center py-6">-->
<!--                    <p class="text-sm text-gray-400 mb-3">Carregando...</p>-->
<!--                </div>-->
                <div v-if="adAccountsStoreSelect.loading" class="text-sm text-gray-400 text-center block">
                    Carregando...
                </div>
                <!-- Estado: com contas -->
                <div v-else class="accounts-grid">
                    <div
                        v-for="account in adAccountsStoreSelect.items"
                        :key="account.id"
                        class="account-card"
                        :class="{ inactive: !account.ad_account_active, ignored: account.ignored_by_limit }"
                    >
                        <div class="account-header">
                            <div class="account-info">
                                <h4>{{ account.name }}</h4>
                                <small v-if="account.businessManager">BM: {{ account.businessManager.name }}</small>
                                <small v-if="account.ignored_by_limit" class="text-red-500 text-xs">Não incluída pelo limite do plano</small>
                            </div>
                            <label class="toggle-switch" v-if="!account.ignored_by_limit">
                                <input
                                    type="checkbox"
                                    :checked="account.ad_account_active"
                                    @change="handleToggle(account)"
                                />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="account-status" :class="account.ad_account_active ? 'active' : 'inactive'">
                            {{ account.ad_account_active ? 'Ativa' : 'Inativa' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mensagem quando o token for inválido -->
            <div v-else class="text-center py-8">
                <p class="text-gray-500 text-sm mb-4">Conecte seu Facebook para visualizar suas contas de anúncio.</p>
                <button
                    @click="loginWithFacebook"
                    class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Conectar Facebook
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.account-card.ignored {
    opacity: 0.6;
    border: 1px dashed red;
}
.integration-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--border-color);
}
.usage-stats {
    margin-bottom: var(--spacing-xl);
}

.usage-card {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.usage-card h3 {
    margin: 0 0 var(--spacing-md);
    font-size: 1.25rem;
}

.usage-items {
    display: grid;
    gap: var(--spacing-md);
}

.usage-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.usage-item:last-child {
    border-bottom: none;
}
.icon-btn {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    cursor: pointer;
    color: var(--text-secondary);
}

.icon-btn:hover {
    background: var(--menu-hover);
    color: var(--text-primary);
}
</style>