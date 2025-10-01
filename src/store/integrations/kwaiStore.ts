import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/apiClient'

interface Kwai {
    id: number
    name: string
    token: string
    platform: string
    created_at: string
    updated_at: string
}

type KwaiStep = 'platforms' | 'config' | 'success'

export const useKwaiStore = defineStore('kwai', () => {
    const error = ref<string | null>(null)
    const showModal = ref(false)

    const created = ref<Kwai | null>(null)
    const edited = ref<Kwai | null>(null)
    const list = ref<Kwai[] | null>(null)

    const step = ref<KwaiStep>('platforms')
    const selectedPlatform = ref('')
    const id = ref('')
    const name = ref('')
    const token = ref('')
    const pixel_id = ref('')
    const url = ref('')
    const isLoading = ref(false)
    const loadingList = ref(false)
    const listPlatforms = ref<any[]>([])

    const searchPlatform = ref('')
    const filteredPlatforms = computed(() =>
        listPlatforms.value?.filter(platform =>
            platform.name.toLowerCase().includes(searchPlatform.value.toLowerCase())
        )
            .map(platform => ({
                label: platform.name,
                value: platform.id
            }))
    )

    const selectPlatform = (platform: any) => {
        selectedPlatform.value = platform.value
        step.value = 'config'
    }

    const submitKwai = async () => {
        isLoading.value = true
        error.value = null
        created.value = null

        try {
            const response = await apiClient.post('/kwai', {
                name: name.value,
                pixel_id: pixel_id.value,
                platform_id: selectedPlatform.value
            })
            created.value = response.data.data
            token.value = created.value.token
            step.value = 'success'
            resetKwaiModal(false)
            getKwais(true)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao criar integração'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const submitUpdateKwai = async () => {
        if (!name.value) return

        isLoading.value = true
        error.value = null
        edited.value = null

        try {
            const response = await apiClient.put(`/kwai/${id.value}`, {
                name: name.value,
                pixel_id: pixel_id.value
            })
            edited.value = response.data.data
            resetKwaiModal(false)
            getKwais(true)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao editar integração'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteKwai = async (item: Kwai) => {
        isLoading.value = true
        error.value = null

        try {
            await apiClient.delete(`/kwai/${item.id}`)
            getKwais(true)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao excluir integração'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const getKwais = async (force = false) => {
        if (list.value && !force) return;

        list.value = null
        loadingList.value = true
        error.value = null

        try {
            const response = await apiClient.get('/kwai')
            list.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao listar webhooks'
            throw err
        } finally {
            loadingList.value = false
        }
    }

    const getPlatforms = async () => {
        try {
            const response = await apiClient.get('/platform/kwai')
            listPlatforms.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erro ao listar plataformas'
            throw err
        }
    }

    const resetKwaiModal = (show: boolean) => {
        step.value = 'platforms'
        selectedPlatform.value = ''
        pixel_id.value = ''
        url.value = ''
        name.value = ''
        token.value = ''
        id.value = ''
        showModal.value = show
    }

    const editKwai = (item: Kwai) => {
        step.value = 'config'
        created.value = null
        name.value = item.name
        url.value = item.url
        pixel_id.value = item.pixel_id ?? null
        token.value = item.token
        id.value = item.id.toString()
        showModal.value = true
    }

    return {
        url,
        getPlatforms,
        selectPlatform,
        id,
        showModal,
        isLoading,
        error,
        pixel_id,
        created,
        edited,
        list,
        loadingList,
        submitKwai,
        editKwai,
        submitUpdateKwai,
        deleteKwai,
        getKwais,
        step,
        selectedPlatform,
        name,
        token,
        resetKwaiModal,
        searchPlatform,
        filteredPlatforms
    }
})
