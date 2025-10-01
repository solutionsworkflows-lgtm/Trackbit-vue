import { defineStore } from 'pinia';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useProfileStore = defineStore('profile', {
    state: () => ({
        userProfile: {},
        loading: false,
        error: null,
        passwordForm: {

        },
        showPasswordModal: false,
        activeTab: 'profile', // Ou outro valor inicial para a tab ativa
    }),

    actions: {
        async fetchProfile() {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.get('/profile');
                this.userProfile = response.data.data;
            } catch (err) {
                this.error = 'Erro ao listar perfil';
                toast.error(this.error)
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.put('/profile', data);
                this.userProfile = response.data;
                toast.success('Perfil atualizado com sucesso!')

            } catch (err) {
                this.error = 'Erro ao atualizar perfil';
                toast.error(this.error)
            } finally {
                this.loading = false;
                this.isEditing = false;
            }
        },

        async updateProfileSettings(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.put('/profile/settings', data);
                this.userProfile = response.data;
                toast.success('Configurações atualizadas com sucesso!')

            } catch (err) {
                this.error = 'Erro ao atualizar configurações';
                toast.error(this.error)
            } finally {
                this.loading = false;
            }
        },

        async changePassword(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.put('/profile/change-password', data);
            } catch (err) {
                this.error = 'Erro ao atualizar senha';
            } finally {
                this.loading = false;
                this.showPasswordModal = false;
            }
        },

        async fetchLoginHistory() {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.get('/profile/login-history');
                return response.data;
            } catch (err) {
                this.error = err.response ? err.response.data : err.message;
            } finally {
                this.loading = false;
            }
        },

        toggleNotification(key) {
            if (this.isEditing) {
                this.userProfile.notifications[key] = !this.userProfile.notifications[key];
            }
        },

        handleChangePassword() {
            const data = {
                current_password: this.passwordForm.current,
                new_password: this.passwordForm.new,
                new_password_confirmation: this.passwordForm.confirm
            };
            this.changePassword(data)
                .then(() => {
                    toast.success('Sucesso ao alterar a senha')
                    this.passwordForm = { current: '', new: '', confirm: '' }; // Limpa o formulário após sucesso
                    this.showPasswordModal = false; // Fecha o modal
                })
                .catch((err) => {
                    toast.error(this.error)
                });
        },
    },

    getters: {
        isEditing: (state) => state.activeTab === 'profile',
    },
});
