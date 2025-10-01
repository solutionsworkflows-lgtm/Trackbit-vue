<template>
    <div class="section">
        <!-- Códigos de UTM -->
        <div class="integration-card">
            <h3>Códigos de UTM</h3>
            <div class="utm-options">
                <div class="utm-option">
                    <div class="utm-info">
                        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" class="platform-icon" />
                        <div>
                            <h4>Facebook</h4>
                            <p>Copie o código para colocar nos anúncios do Facebook</p>
                        </div>
                    </div>
                    <button class="btn-primary" @click="showUtmModal = true">Copiar</button>
                </div>

                <!-- Modal UTMS -->
                <div v-if="showUtmModal" class="modal">
                    <div class="modal-backdrop" @click="showUtmModal = false"></div>
                    <div class="modal-content">
                        <!-- Header -->
                        <div class="modal-header">
                            <div class="header-content">
                                <div class="header-icon">🔗</div>
                                <div>
                                    <h3>Gerador de UTM</h3>
                                    <p class="header-subtitle">Configure seus parâmetros de rastreamento</p>
                                </div>
                            </div>
                            <button @click="showUtmModal = false" class="close-btn">&times;</button>
                        </div>

                        <div class="modal-body">
                            <!-- Quick Copy Section -->
                            <div class="quick-copy-section">
                                <div class="section-label">
                                    <span class="label-icon">🗌</span>
                                    <span>Formato antigo</span>
                                </div>
                                <div class="copy-card">
                                    <div class="parameter-header">
                                        <button
                                            @click="copyToClipboard(oldFormat, 'full-utm')"
                                            class="parameter-copy"
                                            id="full-utm"
                                        >
                                            Copiar UTM
                                        </button>
                                    </div>
                                    <pre class="utm-preview">{{ oldFormat }}</pre>
                                </div>
                            </div>

                            <!-- Parameters Section -->
                            <div class="parameters-section">
                                <div class="section-label">
                                    <span class="label-icon"><i class="fa-solid fa-gear"></i></span>
                                    <span>Formato novo</span>
                                </div>

                                <div class="parameters-grid">
                                    <div
                                        v-for="(value, key) in utmParams"
                                        :key="key"
                                        class="parameter-card"
                                    >
                                        <div class="parameter-header">
                                            <span class="parameter-name">utm_{{ key }}</span>
                                            <button
                                                @click="copyToClipboard(value, `utm-${key}`)"
                                                class="parameter-copy"
                                                :id="`utm-${key}`"
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                        <div class="parameter-value">{{ value }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scripts -->
        <div class="integration-card">
            <h3>Scripts</h3>
            <div class="utm-options">
                <div class="utm-option">
                    <div class="utm-info">
                        <span class="script-icon"><i class="fa-solid fa-link"></i></span>
                        <div>
                            <h4>Script de UTMs</h4>
                            <p>Use esse script nas suas PVs para capturar as UTMs</p>
                        </div>
                    </div>
                    <button class="btn-primary" @click="baixarScriptTxt">Baixar HTML do Script (.txt)</button>
                </div>

<!--                <div class="utm-option">-->
<!--                    <div class="utm-info">-->
<!--                        <span class="script-icon">🔄</span>-->
<!--                        <div>-->
<!--                            <h4>Script de Back Redirect</h4>-->
<!--                            <p>Use esse script na sua PV para usar back redirect com UTMs</p>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <button class="btn-secondary">Baixar</button>-->
<!--                </div>-->

<!--                <div class="utm-option">-->
<!--                    <div class="utm-info">-->
<!--                        <span class="script-icon">🤖</span>-->
<!--                        <div>-->
<!--                            <h4>Typebot</h4>-->
<!--                            <p>Assista ao passo a passo para garantir a configuração correta</p>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <button class="btn-secondary">Assistir</button>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showUtmModal = ref(false)

const utmParams = ref({
    source: 'FB',
    campaign: '{{campaign.name}}|{{campaign.id}}',
    medium: '{{adset.name}}|{{adset.id}}',
    content: '{{ad.name}}|{{ad.id}}',
    term: '{{placement}}'
})

const oldFormat = computed(() => {
    return `utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}`
})

const copyToClipboard = async (text: string, fieldId: string) => {
    try {
        await navigator.clipboard.writeText(text)
        showCopySuccess(fieldId)
    } catch (err) {
        console.error('Erro ao copiar:', err)
    }
}

const showCopySuccess = (fieldId: string) => {
    const el = document.getElementById(fieldId)
    if (el) {
        el.classList.add('copy-success')
        setTimeout(() => {
            el.classList.remove('copy-success')
        }, 2000)
    }
}

const baixarScriptTxt = () => {
    const conteudo = `<scr` + `ipt\n  src=\"https://www.wetrackr.com.br/utms.min.js\"\n  data-wetrackr-prevent-xcod-sck\n  data-wetrackr-prevent-subids\n  async\n  defer\n></scr` + `ipt>`

    const blob = new Blob([conteudo], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'wetrackr-script.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Você pode aplicar seus estilos customizados aqui */
</style>
