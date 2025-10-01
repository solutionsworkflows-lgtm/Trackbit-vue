import { ref } from 'vue'
import { useFacebookStore } from '@/store/facebookStore'
import { useAdAccountsStoreSelect } from '@/store/adAccountsStore'
import { useBusinessManagerStore } from '@/store/businessManagerStore'

export function useFacebookSyncSteps() {
    const showFacebookModal = ref(false)
    const currentStep = ref(0)

    const steps = [
        { id: 'accounts', label: 'Contas de Anúncio', total: 5 },
        { id: 'campaigns', label: 'Campanhas', total: 25 },
        { id: 'adsets', label: 'Conjuntos de Anúncios', total: 50 },
        { id: 'ads', label: 'Anúncios', total: 150 }
    ]

    const facebookStore = useFacebookStore()
    const adAccountsStoreSelect = useAdAccountsStoreSelect()
    const businessManagerStore = useBusinessManagerStore()

    const startSyncProcess = async () => {
        await businessManagerStore.sync()

        await facebookStore.syncAdAccount()
        currentStep.value++

        adAccountsStoreSelect.fetch()
        facebookStore.validateToken()

        await facebookStore.syncCampaigns()
        currentStep.value++

        await facebookStore.syncAdset()
        currentStep.value++

        facebookStore.syncAds()
        currentStep.value++

        showFacebookModal.value = false
    }

    return {
        showFacebookModal,
        currentStep,
        steps,
        startSyncProcess,
    }
}
