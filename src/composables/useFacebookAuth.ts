import { ref, onMounted } from 'vue'
import { useFacebookStore } from '../store/facebookStore.ts'
import { useBusinessManagerStore } from '@/store/businessManagerStore';

const userFacebook = ref(null)

export function useFacebookAuth() {
    const businessManagerStore = useBusinessManagerStore();
    const loading = ref(false)
    const facebookStore = useFacebookStore()

    let sdkLoaded: Promise<void> | null = null

    const loadFacebookSDK = () => {
        if (sdkLoaded) return

        sdkLoaded = new Promise((resolve, reject) => {
            if (window.FB) {
                resolve()
                return
            }

            window.fbAsyncInit = function () {
                FB.init({
                    appId: import.meta.env.VITE_FACEBOOK_APP_ID,
                    xfbml: true,
                    version: 'v21.0',
                })
                resolve()
            }

            if (document.getElementById('facebook-jssdk')) {
                resolve()
                return
            }

            const js = document.createElement('script')
            js.id = 'facebook-jssdk'
            js.src = 'https://connect.facebook.net/en_US/sdk.js'
            js.onerror = () => reject(new Error('Erro ao carregar Facebook SDK.'))

            const fjs = document.getElementsByTagName('script')[0]
            fjs.parentNode?.insertBefore(js, fjs)
        })
    }

    const loginWithFacebook = async () => {
        if (!sdkLoaded) {
            console.warn('SDK ainda não foi iniciado.')
            return
        }

        loading.value = true

        try {
            await sdkLoaded

            if (!window.FB) {
                throw new Error('Facebook SDK não está disponível.')
            }

            await FB.login(
                (response) => {
                    if (response.authResponse) {
                        const accessToken = response.authResponse.accessToken
                        try {
                            facebookStore.saveToken(accessToken)
                            console.log('Token salvo com sucesso!')
                        } catch (err) {
                            console.error('Erro ao salvar token:', err)
                        }
                    } else {
                        console.log('Usuário cancelou o login.')
                    }
                },
                {
                    scope:
                        'public_profile,business_management,ads_management,ads_read,pages_show_list,pages_read_engagement',
                    auth_type: 'rerequest', // força re-login se necessário
                    return_scopes: true,
                    state: JSON.stringify({config_id: import.meta.env.VITE_FACEBOOK_CONFIG_ID}),
                }
            )
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }


    onMounted(() => {
        loadFacebookSDK()
    })

    return {
        userFacebook,
        loginWithFacebook,
        loading,
    }
}
