import {defineStore} from 'pinia';
import {ref} from 'vue';
import apiClient from '@/services/apiClient';

import { useToast } from 'vue-toastification'
const toast = useToast()
export const useFacebookStore = defineStore('facebookStore', () => {
    const loadingFacebook = ref(false);
    const loadingAdAccount = ref(false);
    const loadingAdset  = ref(false);
    const loadingAds = ref(false);
    const loadingCampaigns = ref(false);
    const error = ref(null);
    const invalidToken = ref(false);
    const savingToken = ref(false)

    const sync = async (page = 1) => {
        loadingFacebook.value = true;
        try {
            const response = await apiClient.post('/facebook/sync');
        } catch (err) {
            error.value = 'Erro ao sincronizar';
            console.error(err);
        } finally {
            loadingFacebook.value = false;
        }
    };


    const saveToken = async (token) => {
        savingToken.value = true;
        try {
            const response = await apiClient.post('/user/token', {"token": token});
            toast.success('Facebook cadastrado com sucesso!')
        } catch (err) {
            error.value = 'Erro ao salvar token';
            console.error(err);
            toast.error('Erro ao salvar Facebook')
        } finally {
            savingToken.value = false;
        }
    };

    const syncAdAccount = async () => {
        loadingAdAccount.value = true;
        try {
            const response = await apiClient.post('/facebook/sync-adaccounts');
        } catch (err) {
            error.value = 'Erro ao sincronizar';
            console.error(err);
        } finally {
            loadingAdAccount.value = false;
        }
    };

    const syncCampaigns = async () => {
        loadingCampaigns.value = true;
        try {
            const response = await apiClient.post('/facebook/sync-campaign');
        } catch (err) {
            error.value = 'Erro ao sincronizar';
            console.error(err);
        } finally {
            loadingCampaigns.value = false;
        }
    };

    const syncAdset = async () => {
        loadingAdset.value = true;
        try {
            const response = await apiClient.post('/facebook/sync-adsets');
        } catch (err) {
            error.value = 'Erro ao sincronizar';
            console.error(err);
        } finally {
            loadingAdset.value = false;
        }
    };

    const syncAds = async () => {
        loadingAds.value = true;
        try {
            const response = await apiClient.post('/facebook/sync-ads');
        } catch (err) {
            error.value = 'Erro ao sincronizar';
            console.error(err);
        } finally {
            loadingAds.value = false;
        }
    };
    const validateToken = async () => {
        loadingFacebook.value = true;
        invalidToken.value = false;
        try {
            const response = await apiClient.get('/user/validate-token');
            if (!response.data.token) {
                invalidToken.value = true;
            }
        } catch (err) {
            error.value = 'Erro ao validar token';
        } finally {
            loadingFacebook.value = false;
        }
    };

    const removeToken = async () => {
        loadingFacebook.value = true;
        try {
            const response = await apiClient.post('/user/remove-token');
            validateToken()
        } catch (err) {
            error.value = 'Erro ao remover token';
        } finally {
            loadingFacebook.value = false;
        }
    };
    return {
        sync,
        saveToken,
        validateToken,
        removeToken,
        error,
        invalidToken,

        syncAds,
        syncAdset,
        syncCampaigns,
        syncAdAccount,

        loadingAdAccount,
        loadingCampaigns,
        loadingFacebook,
        loadingAdset,
        savingToken,
        loadingAds,
    };
});
