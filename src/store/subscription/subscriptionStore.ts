import {defineStore} from 'pinia';
import {ref} from 'vue';
import apiClient from '@/services/apiClient';
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useSubscriptionStore = defineStore('subscriptionStore', () => {
    // Estado
    const currentPlan = ref({
        name: '-',
        price: '0.00',
        expires_in_days: 0,
        expires_date: '2021-01-01',
        features_usage: [
            {title: '', used: 0, limit: 0},
            {title: '', used: 0, limit: 0},
            {title: '', used: 0, limit: 0},
            {title: '', used: 0, limit: 0},
            {title: '', used: 0, limit: 0}
        ]
    });

    const cardForm = ref({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        saveCard: false
    });

    const cardsList = ref({data: []});
    const invoices = ref({data: []});
    const plans = ref([
        {
            id: 1,
            name: 'Launch',
            price: 0,
            features: [
                'Até 50 Vendas Aprovadas / mês',
                '1 Conta de anúncio',
                '1 Webhook',
                '1 Pixel de otimização',
                'Relatórios',
                'Suporte por email',
            ]
        },
        {
            id: 2,
            name: 'Grow',
            price: 97,
            features: [
                '3 Contas de anúncio',
                'Dashboards ilimitados',
                'Relatórios avançados',
                'Pixels ilimitados',
                'Webhooks ilimitados',
                'Suporte prioritário',
                'API access'
            ],
            recommended: true
        },
        {
            id: 3,
            name: 'Boost',
            price: 297,
            features: [
                'Contas ilimitadas',
                'Dashboards ilimitados',
                'Relatórios personalizados',
                'Pixels ilimitados',
                'Webhooks ilimitados',
                'Suporte 24/7',
                'API access',
                'Onboarding dedicado',
                'Success manager'
            ]
        },
        {
            id: 3,
            name: 'Orbit',
            price: 297,
            features: [
                'Contas ilimitadas',
                'Dashboards ilimitados',
                'Relatórios personalizados',
                'Pixels ilimitados',
                'Webhooks ilimitados',
                'Suporte 24/7',
                'API access',
                'Onboarding dedicado',
                'Success manager'
            ]
        }
    ]);

    const loading = ref(false);
    const error = ref(null);

    // Ações
    const setCurrentPlan = (plan) => {
        currentPlan.value = plan;
    };

    const addInvoice = (invoice) => {
        invoices.value.push(invoice);
    };

    const setPlans = (newPlans) => {
        plans.value = newPlans;
    };

    const savedCards = async () => {
        loading.value = true;

        try {
            const response = await apiClient.get('/user/cards');
            cardsList.value = response.data.data;
        } catch (err) {
            error.value = 'Erro ao carregar os cartões';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    const fetchCurrentPlan = async (page = 1) => {
        loading.value = true;
        try {
            const response = await apiClient.get('/subscriptions/me', {
                params: {page},
            });
            const {plan, invoices: fetchedInvoices} = response.data.data;
            currentPlan.value = plan;
            invoices.value = fetchedInvoices;
        } catch (err) {
            error.value = 'Erro ao carregar o plano atual';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createSubscription = async (paymentData) => {
        loading.value = true;
        error.value = null;

        const [card_expirate_date_month, card_expirate_date_year] = cardForm.value.expiry.split("/");

        const body = {
            plan : paymentData.plan,
            useExistingCard : paymentData.useExistingCard,
            cardId : paymentData.cardId,
            card_number: cardForm.value.number,
            card_holder_name: cardForm.value.name,
            card_expirate_date_mounth: card_expirate_date_month,
            card_expirate_date_year: card_expirate_date_year,
            card_cvv: cardForm.value.cvc,
        }

        try {
            const response = await apiClient.post('/subscriptions/upgrade', body);
            fetchCurrentPlan();
        } catch (err) {
            console.error(err);
            error.value = true
            toast.error('Erro ao realizar assinatura, revise os dados de pagamento.');
        } finally {
            loading.value = false;
        }
    }

    const payInvoice = async (paymentData) => {
        loading.value = true;
        error.value = null;

        console.log(paymentData);
        const [card_expirate_date_month, card_expirate_date_year] = cardForm.value.expiry.split("/");

        const body = {
            invoice : paymentData.invoice,
            useExistingCard : paymentData.useExistingCard,
            cardId : paymentData.cardId,
            card_number: cardForm.value.number,
            card_holder_name: cardForm.value.name,
            card_expirate_date_mounth: card_expirate_date_month,
            card_expirate_date_year: card_expirate_date_year,
            card_cvv: cardForm.value.cvc,
        }

        try {
            const response = await apiClient.post('/subscriptions/pay-invoice', body);
            fetchCurrentPlan();
        } catch (err) {
            console.error(err);
            error.value = true
            toast.error('Erro ao realizar pagamento, revise os dados do cartão.');
        } finally {
            loading.value = false;
        }
    }

    return {
        currentPlan,
        invoices,
        plans,
        cardForm,
        loading,
        error,
        cardsList,
        payInvoice,
        savedCards,
        createSubscription,
        setCurrentPlan,
        addInvoice,
        setPlans,
        fetchCurrentPlan,
    };
});
