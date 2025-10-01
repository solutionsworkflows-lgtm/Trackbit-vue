<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Header from '../components/layout/Header.vue'
import SideMenu from '../components/layout/SideMenu.vue'

import { usePageTitleStore } from '../store/pageTitle'
const pageTitle = usePageTitleStore()

const faqCategories = [
    {
        id: 'getting-started',
        icon: '',
        title: 'Primeiros Passos',
        questions: [
            {
                question: 'Como começar a usar a plataforma?',
                answer: 'Para começar, faça login na sua conta e acesse o Dashboard. Lá você encontrará um guia passo a passo para configurar sua primeira campanha e conectar suas contas de anúncio.'
            },
            {
                question: 'Como conectar minha conta do Facebook Ads?',
                answer: 'Vá até a seção de Integrações, clique em "Adicionar Conta" e siga as instruções para autorizar o acesso à sua conta do Facebook Ads. O processo leva apenas alguns minutos.'
            },
            {
                question: 'Quais são os requisitos mínimos para usar a plataforma?',
                answer: 'Você precisa ter uma conta ativa no Facebook Ads e pelo menos uma campanha de vendas em andamento. Nossa plataforma é compatível com todos os navegadores modernos.'
            }
        ]
    },
    {
        id: 'tracking',
        icon: '',
        title: 'Rastreamento de Vendas',
        questions: [
            {
                question: 'Como funciona o rastreamento de vendas?',
                answer: 'Nossa plataforma utiliza uma combinação de UTMs e pixels para rastrear suas vendas com precisão. Quando uma venda é realizada, identificamos automaticamente a origem do cliente e atribuímos corretamente à campanha.'
            },
            {
                question: 'O que fazer se algumas vendas não estão sendo rastreadas?',
                answer: 'Verifique se o pixel está instalado corretamente em todas as páginas do seu funil de vendas e se os UTMs estão configurados adequadamente nos links das suas campanhas.'
            },
            {
                question: 'Como configurar o pixel de rastreamento?',
                answer: 'Na seção de Integrações, selecione "Pixels" e clique em "Adicionar Novo". Siga o assistente de configuração para instalar o pixel no seu site ou plataforma de vendas.'
            }
        ]
    },
    {
        id: 'automation',
        icon: '',
        title: 'Automação e Regras',
        questions: [
            {
                question: 'Como criar regras automáticas?',
                answer: 'Acesse a seção de Regras, clique em "Criar Nova Regra" e defina as condições e ações desejadas. Por exemplo, você pode criar uma regra para pausar campanhas com CPA alto automaticamente.'
            },
            {
                question: 'Quais tipos de automação estão disponíveis?',
                answer: 'Oferecemos automações para controle de orçamento, otimização de lances, pausa/ativação de campanhas baseada em métricas, e ajustes automáticos de segmentação.'
            },
            {
                question: 'É seguro usar as automações?',
                answer: 'Sim! Todas as automações possuem limites de segurança e você pode definir condições específicas para evitar ações indesejadas. Além disso, mantemos um registro detalhado de todas as ações automáticas.'
            }
        ]
    },
    {
        id: 'billing',
        icon: '',
        title: 'Cobrança e Assinatura',
        questions: [
            {
                question: 'Como funciona a cobrança?',
                answer: 'Trabalhamos com planos mensais ou anuais, com pagamento recorrente via cartão de crédito ou PIX. Você pode cancelar ou alterar seu plano a qualquer momento.'
            },
            {
                question: 'Posso mudar de plano?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença será calculada proporcionalmente ao período restante da sua assinatura.'
            },
            {
                question: 'Qual a política de reembolso?',
                answer: 'Oferecemos garantia de 7 dias. Se você não estiver satisfeito, pode solicitar o reembolso integral dentro deste período, sem questionamentos.'
            }
        ]
    }
]

const selectedCategory = ref('getting-started')
const expandedQuestions = ref<string[]>([])

const toggleQuestion = (categoryId: string, index: number) => {
    const questionId = `${categoryId}-${index}`
    const questionIndex = expandedQuestions.value.indexOf(questionId)

    if (questionIndex === -1) {
        expandedQuestions.value.push(questionId)
    } else {
        expandedQuestions.value.splice(questionIndex, 1)
    }
}

const isQuestionExpanded = (categoryId: string, index: number) => {
    return expandedQuestions.value.includes(`${categoryId}-${index}`)
}

const whatsappNumber = '+5511999999999'
const businessHours = '09:00 às 18:00'

const openWhatsapp = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com a plataforma.')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
}

onMounted(async () => {
    pageTitle.setTitle('Suporte')
});
</script>

<template>
    <div class="support">

        <div class="support-main">

            <div class="support-content">
                <div class="support-header">
                    <div>
                        <h1>Central de Ajuda</h1>
                        <p class="subtitle">Encontre respostas para suas dúvidas ou entre em contato com nosso suporte</p>
                    </div>

                    <button class="whatsapp-button" @click="openWhatsapp">
                        <span class="whatsapp-icon"></span>
                        <div class="whatsapp-info">
                            <span class="whatsapp-label">Suporte via WhatsApp</span>
                            <span class="whatsapp-hours">{{ businessHours }}</span>
                        </div>
                    </button>
                </div>

                <div class="faq-container">
                    <!-- Categories Navigation -->
                    <div class="categories-nav">
                        <button
                            v-for="category in faqCategories"
                            :key="category.id"
                            class="category-button"
                            :class="{ active: selectedCategory === category.id }"
                            @click="selectedCategory = category.id"
                        >
                            <span class="category-icon">{{ category.icon }}</span>
                            <span class="category-title">{{ category.title }}</span>
                        </button>
                    </div>

                    <!-- FAQ Content -->
                    <div class="faq-content" :key="selectedCategory">
                        <div
                            v-for="category in faqCategories"
                            :key="category.id"
                            v-show="selectedCategory === category.id"
                            class="faq-category"
                        >
                            <h2>{{ category.title }}</h2>

                            <div class="questions-list">
                                <div
                                    v-for="(qa, index) in category.questions"
                                    :key="index"
                                    class="question-item"
                                    :class="{ expanded: isQuestionExpanded(category.id, index) }"
                                    @click="toggleQuestion(category.id, index)"
                                >
                                    <div class="question-header">
                                        <h3>{{ qa.question }}</h3>
                                        <span class="toggle-icon">{{ isQuestionExpanded(category.id, index) ? '−' : '+' }} </span>
                                    </div>

                                    <div class="answer" v-show="isQuestionExpanded(category.id, index)">
                                        {{ qa.answer }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Support Options -->
                <div class="additional-support">
                    <h2>Precisa de mais ajuda?</h2>
                    <div class="support-options">
                        <a href="#" class="support-option">
                            <span class="option-icon"></span>
                            <div class="option-info">
                                <h3>Documentação</h3>
                                <p>Acesse nossa documentação técnica completa</p>
                            </div>
                        </a>

                        <a href="#" class="support-option">
                            <span class="option-icon"></span>
                            <div class="option-info">
                                <h3>Blog</h3>
                                <p>Dicas e tutoriais para otimizar suas campanhas</p>
                            </div>
                        </a>

                        <a href="#" class="support-option">
                            <span class="option-icon"></span>
                            <div class="option-info">
                                <h3>E-mail</h3>
                                <p>Entre em contato via suporte@salestracker.com</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.support {
    min-height: 100vh;
    background-color: var(--background-color);
}

.support-main {
    margin-left: 250px;
}

.support-content {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.support-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
}

.support-header h1 {
    margin: 0;
    font-size: 24px;
    color: var(--text-primary);
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
}

.whatsapp-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background-color: #25D366;
    color: white;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.whatsapp-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.whatsapp-icon {
    font-size: 24px;
}

.whatsapp-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.whatsapp-label {
    font-weight: 500;
}

.whatsapp-hours {
    font-size: 12px;
    opacity: 0.9;
}

.faq-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.categories-nav {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.category-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-button:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.category-button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.category-icon {
    font-size: 20px;
}

.faq-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.faq-category h2 {
    margin: 0 0 var(--spacing-lg);
    font-size: 20px;
    color: var(--text-primary);
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.question-item {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.question-item:hover {
    border-color: var(--primary-color);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--menu-hover);
}

.question-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.toggle-icon {
    font-size: 20px;
    color: var(--text-secondary);
    transition: transform 0.3s ease;
}

.question-item.expanded .toggle-icon {
    transform: rotate(180deg);
}

.answer {
    padding: var(--spacing-md);
    color: var(--text-secondary);
    line-height: 1.6;
    border-top: 1px solid var(--border-color);
}

.additional-support {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.additional-support h2 {
    margin: 0 0 var(--spacing-lg);
    font-size: 20px;
    color: var(--text-primary);
}

.support-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

.support-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    text-decoration: none;
    transition: all 0.3s ease;
}

.support-option:hover {
    transform: translateY(-2px);
    background-color: var(--primary-color);
}

.support-option:hover .option-info h3,
.support-option:hover .option-info p {
    color: white;
}

.option-icon {
    font-size: 24px;
}

.option-info h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.option-info p {
    margin: var(--spacing-xs) 0 0;
    font-size: 14px;
    color: var(--text-secondary);
}

@media (max-width: 1024px) {
    .support-options {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .support-main {
        margin-left: 0;
    }

    .support-header {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .faq-container {
        grid-template-columns: 1fr;
    }

    .categories-nav {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: var(--spacing-sm);
    }

    .category-button {
        flex-shrink: 0;
    }

    .support-options {
        grid-template-columns: 1fr;
    }
}
</style>