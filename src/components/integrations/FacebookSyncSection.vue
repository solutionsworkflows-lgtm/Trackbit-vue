<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFacebookStore } from '@/store/facebookStore'
import { useAdAccountsStoreSelect } from '@/store/adAccountsStore'
import { useBusinessManagerStore } from '@/store/businessManagerStore'

const facebookStore = useFacebookStore()
const adAccountsStoreSelect = useAdAccountsStoreSelect()
const businessManagerStore = useBusinessManagerStore()

const showFacebookModal = ref(false)
const currentStep = ref(0)
const syncProgress = ref(0)
const currentStepProgress = ref(0)
const syncInterval = ref<number | null>(null)

import { useSubscriptionStore } from '@/store/subscription/subscriptionStore'
const subscriptionStore = useSubscriptionStore()

const steps = [
    { id: 'accounts', label: 'Contas de Anúncio', total: 5 },
    { id: 'campaigns', label: 'Campanhas', total: 25 },
    { id: 'adsets', label: 'Conjuntos de Anúncios', total: 50 },
    { id: 'ads', label: 'Anúncios', total: 150 }
]

const startSyncProcess = async () => {
    await businessManagerStore.sync()

    await facebookStore.syncAdAccount()
    currentStep.value++

    adAccountsStoreSelect.fetch()
    facebookStore.validateToken()

    subscriptionStore.fetchCurrentPlan();

    await facebookStore.syncCampaigns()
    currentStep.value++

    await facebookStore.syncAdset()
    currentStep.value++

    facebookStore.syncAds()
    currentStep.value++

    showFacebookModal.value = false
}

watch(
    () => facebookStore.savingToken,
    (loading) => {
        if (loading) {
            showFacebookModal.value = true
        } else {
            startSyncProcess()
        }
    }
)
</script>

<template>
    <div v-if="showFacebookModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">
                    <img src="https://www.facebook.com/favicon.ico" alt="Meta" class="fb-icon" />
                    <h3>Sincronizando com Meta Ads</h3>
                </div>
            </div>

            <div class="modal-body">
                <div class="sync-steps">
                    <div
                        v-for="(step, index) in steps"
                        :key="step.id"
                        class="sync-step"
                        :class="{
                            'active': index === currentStep,
                            'completed': index < currentStep
                          }"
                    >
                        <div class="step-indicator">
                            <div class="step-number">
                                <template v-if="index < currentStep">✓</template>
                                <template v-else>{{ index + 1 }}</template>
                            </div>
                            <div class="step-line" v-if="index < steps.length - 1"></div>
                        </div>

                        <div class="step-content">
                            <h4>{{ step.label }}</h4>
                            <div v-if="index === currentStep" class="step-progress">
                                <div class="progress-bar">
                                    <div
                                        class="progress"
                                        :style="{ width: `${syncProgress}%` }"
                                    ></div>
                                </div>
                                <div class="progress-text">
                                    {{ currentStepProgress }}
                                </div>
                            </div>
                            <div v-else-if="index < currentStep" class="step-complete">
                                itens sincronizados
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sync-message">
                    <div class="spinner"></div>
                    <p>
                        {{ currentStep < steps.length ? 'Sincronizando...' : 'Sincronização concluída!' }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

