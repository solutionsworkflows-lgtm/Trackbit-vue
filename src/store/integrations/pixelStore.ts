import { defineStore } from 'pinia'
import {ref, reactive, computed} from 'vue'
import apiClient from '@/services/apiClient'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Pixel {
    id: number
    name: string
    public_key: string
    secret_key: string
    created_at: string
    updated_at: string
}

export const usePixelStore = defineStore('pixel', () => {
    // States
    const createdPixel = ref<Pixel | null>(null)
    const editedPixel = ref<Pixel | null>(null)
    const listPixels = ref<Pixel[] | null>(null)
    const listPixelsKwai = ref<Pixel[] | null>(null)

    const loadingPixels = ref(false)
    const errorPixel = ref<string | null>(null)

    const showPixelModal = ref(false)
    const showPixelMenu = ref('')

    const pixelKwaiToSelect = computed(() =>
        listPixelsKwai.value?.map(item => ({ label: item.name, value: item.id }))
    )

    // Reactive form
    let pixelFormPixel = reactive({
        id: null as number | null,
        name: '',
        pixel_id: '',
        token: '',
        type: 'FACEBOOK',
        send_config: 'approved_only',
        product: 'Qualquer',
    })

    // Actions
    const getPixels = async (force = false) => {
        if (listPixels.value && !force) return;

        listPixels.value = null
        loadingPixels.value = true
        errorPixel.value = null

        try {
            const response = await apiClient.get('/pixels')
            listPixels.value = response.data.data
        } catch (err: any) {
            errorPixel.value = err.response?.data?.message || 'Erro ao listar pixels'
            toast.error('Erro ao listar pixels')
            throw err
        } finally {
            loadingPixels.value = false
        }
    }

    const getPixelsKwai = async () => {
        listPixelsKwai.value = null
        loadingPixels.value = true
        errorPixel.value = null

        try {
            const response = await apiClient.get('/pixel/kwai')
            listPixelsKwai.value = response.data.data
        } catch (err: any) {
            errorPixel.value = err.response?.data?.message || 'Erro ao listar pixels'
            toast.error('Erro ao listar pixels')
            throw err
        } finally {
            loadingPixels.value = false
        }
    }

    const createPixel = async () => {
        loadingPixels.value = true
        errorPixel.value = null
        createdPixel.value = null

        try {
            const response = await apiClient.post('/pixels', pixelFormPixel)
            createdPixel.value = response.data.data
            toast.success('Pixel criado com sucesso!')
        } catch (err: any) {
            errorPixel.value = err.response?.data?.message || 'Erro ao criar pixel'
            toast.error(errorPixel.value)
            throw err
        } finally {
            loadingPixels.value = false
        }
    }

    const editPixel = async () => {
        loadingPixels.value = true
        errorPixel.value = null
        editedPixel.value = null

        try {
            const response = await apiClient.put(`/pixels/${pixelFormPixel.id}`, pixelFormPixel)
            editedPixel.value = response.data.data
            toast.success('Pixel atualizado com sucesso!')
        } catch (err: any) {
            errorPixel.value = err.response?.data?.message || 'Erro ao editar pixel'
            toast.error('Erro ao editar pixel')
            throw err
        } finally {
            loadingPixels.value = false
        }
    }

    const deletePixel = async (id: number) => {
        loadingPixels.value = true
        errorPixel.value = null

        try {
            await apiClient.delete(`/pixels/${id}`)
            toast.success('Pixel excluído com sucesso!')
        } catch (err: any) {
            errorPixel.value = err.response?.data?.message || 'Erro ao excluir pixel'
            toast.error('Erro ao excluir pixel')
            throw err
        } finally {
            loadingPixels.value = false
        }
    }

    const submitPixel = async () => {
        try {
            if (pixelFormPixel.id) {
                await editPixel()
            } else {
                await createPixel()
            }
            resetPixelModal(false)
            await getPixels(true)
        } catch {
            console.error('Erro ao salvar pixel:', errorPixel.value)
        }
    }

    const submitUpdatePixel = async () => {
        try {
            await editPixel()
            resetPixelModal(false)
            await getPixels(true)
        } catch {
            console.error('Erro ao editar pixel:', errorPixel.value)
        }
    }

    const editPixelItem = (item: Pixel) => {
        createdPixel.value = null
        Object.assign(pixelFormPixel, item)
        showPixelModal.value = true
    }

    const deletePixelItem = async (item: Pixel) => {
        await deletePixel(item.id)
        await getPixels(true)
    }

    const resetPixelModal = (showModal: boolean) => {
        createdPixel.value = null
        showPixelModal.value = showModal
        showPixelMenu.value = ''
        Object.assign(pixelFormPixel, {
            id: null,
            name: '',
            pixel_id: '',
            token: '',
            type: 'Meta (Facebook)',
            send_config: 'approved_only',
            product_id: 'all',
        })
    }

    const togglePixelMenu = (pixelKeyId: string) => {
        showPixelMenu.value = showPixelMenu.value === pixelKeyId ? '' : pixelKeyId
    }

    return {
        // States
        pixelFormPixel,
        createdPixel,
        editedPixel,
        pixelKwaiToSelect,
        listPixels,
        listPixelsKwai,
        loadingPixels,
        errorPixel,
        showPixelModal,
        showPixelMenu,

        // Actions
        getPixelsKwai,
        getPixels,
        createPixel,
        editPixel,
        deletePixel,
        submitPixel,
        submitUpdatePixel,
        editPixelItem,
        deletePixelItem,
        resetPixelModal,
        togglePixelMenu
    }
})
