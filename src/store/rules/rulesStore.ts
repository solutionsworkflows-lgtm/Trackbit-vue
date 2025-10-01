import { defineStore } from 'pinia'
import { ref, reactive, nextTick  } from 'vue'
import apiClient from '@/services/apiClient'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Rules {
    id: number
    name: string
    product: string
    ad_account: string
    apply_to: string
    filter_by_name: string
    action: string
    action_budget_option: 'fixed', // 'fixed' ou 'percentage'
    action_budget_value: '',
    action_budget_limit: '',
    conditions: any[]
    calculation_period: string
    frequency: string
    execution_interval: string
    daily_execution_limit: string
    filter_name_option: string
    execution_start_time: string
    execution_end_time: string
    created_at: string
    updated_at: string
}

export const useRulesStore = defineStore('rules', () => {
    // States
    const createdRules = ref<Rules | null>(null)
    const editedRules = ref<Rules | null>(null)
    const listRules = ref<Rules[] | null>(null)

    const loadingRules = ref(false)
    const errorRules = ref<string | null>(null)

    const showRulesModal = ref(false)
    const showRulesMenu = ref('')
    const budgetValueInput = ref(null)
    const budgetLimitInput = ref(null)

    // Reactive form
    let rulesForm = reactive({
        name: '',
        product: 'all',
        ad_account: 'all',
        apply_to: 'ActiveCampaigns',
        filter_by_name: 'Qualquer',
        action: 'Ativar',
        conditions: [],
        calculation_period: 'today',
        frequency: '15min',
        execution_interval: 'Qualquer',
        daily_execution_limit: 'Sem Limite'
    })

    // Actions
    const getRules = async (force = false) => {
        if (listRules.value && !force) return;

        listRules.value = null
        loadingRules.value = true
        errorRules.value = null

        try {
            const response = await apiClient.get('/rules')
            listRules.value = response.data.data
        } catch (err: any) {
            errorRules.value = err.response?.data?.message || 'Erro ao listar regra'
            toast.error('Erro ao listar regra')
            throw err
        } finally {
            loadingRules.value = false
        }
    }

    const createRules = async () => {
        loadingRules.value = true
        errorRules.value = null
        createdRules.value = null

        try {
            const payload = sanitizeRulesForm();

            const response = await apiClient.post('/rules', payload)
            createdRules.value = response.data.data
            toast.success('Regra criado com sucesso!')
        } catch (err: any) {
            errorRules.value = err.response?.data?.message || 'Erro ao criar regra'
            toast.error('Erro ao criar regra')
            throw err
        } finally {
            loadingRules.value = false
        }
    }

    const parseMoneyString = (value) => {
        if (typeof value === 'number') return value;
        if (!value) return 0;

        // Remove R$, pontos de milhar, troca vírgula por ponto
        value = parseInt(value.replace(/\D/g,'')) / 100
        return value;
    };

    const sanitizeRulesForm = () => {
        // Copia todos os campos
        const sanitized = { ...rulesForm };

        // Valor de ação (budget)
        if (sanitized.action === 'AumentarOrcamento' || sanitized.action === 'DiminuirOrcamento') {
            if (sanitized.action_budget_option === 'fixed') {
                sanitized.action_budget_value = parseMoneyString(sanitized.action_budget_value);
            } else if (sanitized.action_budget_option === 'percentage') {
                sanitized.action_budget_value = Math.min(100, Math.max(0, parseInt(sanitized.action_budget_value) || 0));
            }

            sanitized.action_budget_limit = parseMoneyString(sanitized.action_budget_limit);
        }

        return sanitized;
    };

    const editRules = async () => {
        loadingRules.value = true
        errorRules.value = null
        editedRules.value = null

        try {
            const payload = sanitizeRulesForm();

            const response = await apiClient.put(`/rules/${rulesForm.id}`, payload)
            editedRules.value = response.data.data
            toast.success('Regra atualizada com sucesso!')
        } catch (err: any) {
            errorRules.value = err.response?.data?.message || 'Erro ao editar regra'
            toast.error('Erro ao editar regra')
            throw err
        } finally {
            loadingRules.value = false
        }
    }

    const deleteRules = async (id: number) => {
        loadingRules.value = true
        errorRules.value = null

        try {
            await apiClient.delete(`/rules/${id}`)
            toast.success('Regra excluída com sucesso!')
        } catch (err: any) {
            errorRules.value = err.response?.data?.message || 'Erro ao excluir regra'
            toast.error('Erro ao excluir regra')
            throw err
        } finally {
            loadingRules.value = false
        }
    }

    const submitRules = async () => {
        try {
            if (rulesForm.id) {
                await editRules()
            } else {
                await createRules()
            }
            resetRulesModal(false)
            await getRules(true)
        } catch {
            console.error('Erro ao salvar regra:', errorRules.value)
        }
    }

    const submitUpdateRules = async () => {
        try {
            await editRules()
            resetRulesModal(false)
            await getRules(true)
        } catch {
            console.error('Erro ao editar regra:', errorRules.value)
        }
    }

    const editRulesItem = async (item: Rules) => {
        createdRules.value = null
        Object.assign(rulesForm, item)

        showRulesModal.value = true

        await nextTick()

        if (item.action_budget_option == 'fixed') {
            // Dispara evento de input/change manualmente
            if (budgetValueInput.value) {
                budgetValueInput.value.dispatchEvent(new Event('input'))
                budgetValueInput.value.dispatchEvent(new Event('change'))
            }
        }

        if (budgetLimitInput.value) {
            budgetLimitInput.value.dispatchEvent(new Event('input'))
            budgetLimitInput.value.dispatchEvent(new Event('change'))
        }
    }

    const deleteRulesItem = async (item: Rules) => {
        await deleteRules(item.id)
        await getRules(true)
    }

    const resetRulesModal = (showModal: boolean) => {
        createdRules.value = null
        showRulesModal.value = showModal
        showRulesMenu.value = ''
        Object.assign(rulesForm, {
            name: '',
            product: 'all',
            ad_account: 'all',
            apply_to: 'ActiveCampaigns',
            filter_by_name: 'Qualquer',
            action: 'Ativar',
            conditions: [],
            action_budget_option: 'fixed',
            action_budget_value: 0,
            action_budget_limit: 0,
            calculation_period: 'today',
            frequency: '15min',
            execution_interval: 'Qualquer',
            daily_execution_limit: 'Sem Limite'
        })
    }

    return {
        // States
        budgetValueInput,
        budgetLimitInput,
        rulesForm,
        createdRules,
        editedRules,
        listRules,
        loadingRules,
        errorRules,
        showRulesModal,
        showRulesMenu,

        // Actions
        getRules,
        createRules,
        editRules,
        deleteRules,
        submitRules,
        submitUpdateRules,
        editRulesItem,
        deleteRulesItem,
        resetRulesModal,
    }
})
