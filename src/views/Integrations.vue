<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import { integrationSections } from '@/constants/integrationSections'

import { usePageTitleStore } from '../store/pageTitle'

// Componentes modularizados
import MetaAdsSection from '@/components/integrations/MetaAdsSection.vue'
import WebhooksSection from '@/components/integrations/WebhooksSection.vue'
import UtmSection from '@/components/integrations/UtmSection.vue'
import PixelManager from "../components/integrations/PixelManager.vue";
import FacebookSyncSection from '@/components/integrations/FacebookSyncSection.vue'
import KwaiManager from "../components/integrations/KwaiManager.vue";

// Stores
const pageTitle = usePageTitleStore()

// Controle da seção ativa
const activeSection = ref('ads')

onMounted(() => {
    pageTitle.setTitle('Integrações')
})
</script>

<template>
    <!-- Facebook Integration Modal -->
    <FacebookSyncSection></FacebookSyncSection>

    <div class="integrations">
        <div class="integrations-main">

            <div class="integrations-content">
                <!-- Integration Sections Grid -->
                <div class="sections-grid">
                    <div
                        v-for="section in integrationSections"
                        :key="section.id"
                        class="section-card"
                        :class="{ active: activeSection === section.id }"
                        :style="{ '--section-color': section.color }"
                        @click="activeSection = section.id"
                    >
                        <span class="section-icon" v-html="section.icon"></span>
                        <div class="section-info">
                            <h3>{{ section.title }}</h3>
                            <p>{{ section.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="content-area">
                    <!-- Ads Section -->
                    <MetaAdsSection v-if="activeSection === 'ads'" />

                    <!-- Webhooks Section -->
                    <div v-if="activeSection === 'webhooks'" class="section">
                        <WebhooksSection />
                    </div>

                    <!-- UTMs Section -->
                    <UtmSection v-if="activeSection === 'utms'" />

                    <!-- Pixel Section -->
                    <div v-if="activeSection === 'pixel'" class="section">
                       <PixelManager></PixelManager>
                    </div>

                    <!-- kwai Section -->
                    <div v-if="activeSection === 'kwai'" class="section">
                        <KwaiManager></KwaiManager>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.btn-bm {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 12px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 500;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
.integrations {
    min-height: 100vh;
    background-color: var(--background-color);
}

.integrations-main {
    margin-left: 250px;
}

.integrations-content {
    padding: var(--spacing-lg);
    max-width: 1400px;
    margin: 0 auto;
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-xl);
}

.header-info h1 {
    margin: 0;
    font-size: 28px;
    color: var(--text-primary);
    background: linear-gradient(135deg, #1a1f2e 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 16px;
}

.header-actions {
    display: flex;
    gap: var(--spacing-md);
}

/* Integration Sections */
.integration-section {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--border-color);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-lg);
    //border-bottom: 1px solid var(--border-color);
}

.section-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.platform-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.platform-icon.facebook {
    background: linear-gradient(135deg, #1877F2 0%, #42A5F5 100%);
    color: white;
}

.section-title h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-primary);
}

.section-title p {
    margin: 4px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

.connection-status.connected {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Business Manager Selector */
.bm-selector-container {
    position: relative;
    margin-bottom: var(--spacing-xl);
}

.current-bm {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: var(--border-radius-lg);
}

.bm-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.bm-label {
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.bm-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.bm-id {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: monospace;
}

.change-bm-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.change-bm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* BM Dropdown */
.bm-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    z-index: 100;
    overflow: hidden;
}

.dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--menu-hover);
}

.dropdown-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
}

.close-btn:hover {
    background-color: var(--border-color);
}

.bm-list {
    max-height: 300px;
    overflow-y: auto;
}

.bm-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid var(--border-color);
}

.bm-option:hover:not(.disabled) {
    background-color: var(--menu-hover);
}

.bm-option.active {
    background-color: rgba(102, 126, 234, 0.1);
    border-left: 4px solid var(--primary-color);
}

.bm-option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.bm-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.bm-option-name {
    font-weight: 500;
    color: var(--text-primary);
}

.bm-option-id {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: monospace;
}

.bm-accounts-count {
    font-size: 12px;
    color: var(--text-secondary);
}

.bm-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.bm-status.active {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
}

.bm-status.inactive {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

/* Ad Accounts */
.ad-accounts-section h3 {
    margin: 0 0 var(--spacing-lg);
    font-size: 18px;
    color: var(--text-primary);
}

.accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* menor min */
    gap: var(--spacing-lg);
}

.account-card {
    background-color: var(--menu-hover);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    transition: all 0.3s ease;
}

.account-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.account-card.inactive {
    opacity: 0.6;
}

.account-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
}

.account-info h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.account-id {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: monospace;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: .4s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
    transform: translateX(24px);
}

.account-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.metric {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.metric-label {
    font-size: 12px;
    color: var(--text-secondary);
}

.metric-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.account-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.account-status.active {
    background-color: rgba(92, 184, 92, 0.1);
    color: #5cb85c;
    width: 100%;
}

.account-status.inactive {
    background-color: rgba(217, 83, 79, 0.1);
    color: #d9534f;
}

.bm-selection-intro p {
    color: var(--text-secondary);
    margin: 0;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
}

.bm-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.bm-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    transition: all 0.3s ease;
}

.bm-item:hover:not(.disabled) {
    border-color: #1877F2;
    background-color: rgba(24, 119, 242, 0.05);
}

.bm-item.selected {
    border-color: #1877F2;
    background-color: rgba(24, 119, 242, 0.1);
}

.bm-item.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.bm-radio {
    margin-top: 2px;
}

.bm-radio input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: #1877F2;
}

.bm-info {
    flex: 1;
}

.bm-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-sm);
}

.bm-header h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 600;
}

.bm-badges {
    display: flex;
    gap: var(--spacing-xs);
}

.permission-badge {
    background-color: rgba(24, 119, 242, 0.1);
    color: #1877F2;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.pending {
    background-color: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.bm-accounts {
    color: var(--text-secondary);
    font-size: 14px;
}

.bm-id {
    color: var(--text-muted);
    font-size: 12px;
    font-family: monospace;
}

.no-bms {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-secondary);
}

.no-bms-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
}

.no-bms h4 {
    margin: 0 0 var(--spacing-sm);
    color: var(--text-primary);
}

.no-bms p {
    margin: 0;
    font-size: 14px;
}

.selected-bm-summary {
    background-color: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.3);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
}

.summary-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
}

.summary-icon {
    font-size: 20px;
}

.summary-header h4 {
    margin: 0;
    color: #28a745;
    font-size: 16px;
}

.summary-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.summary-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.summary-info strong {
    color: var(--text-primary);
}

.summary-info span {
    color: var(--text-secondary);
    font-size: 14px;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background-color: var(--card-background);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.header-icon {
    font-size: 2rem;
    background: linear-gradient(135deg, var(--primary-color), #5CB8E4);
    -webkit-background-clip: text;
    color: transparent;
}

.header-subtitle {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.modal-body {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.section-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
    font-weight: 500;
}

.label-icon {
    font-size: 1.25rem;
}

.quick-copy-section .copy-card {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    position: relative;
    overflow: hidden;
}

.utm-preview {
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
    margin: 0;
    padding: 0;
    white-space: pre-wrap;
    word-break: break-all;
    margin-bottom: var(--spacing-md);
}

.copy-button {
    width: 100%;
    padding: var(--spacing-sm);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.copy-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(65, 105, 225, 0.2);
}

.parameters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
}

.parameter-card {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    transition: all 0.2s ease;
}

.parameter-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.parameter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.parameter-name {
    font-family: monospace;
    color: var(--primary-color);
    font-weight: 500;
}

.parameter-copy {
    background: none;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.parameter-copy:hover {
    background-color: var(--primary-color);
    color: white;
}

.parameter-value {
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--text-secondary);
    word-break: break-all;
}

.help-section {
    border-top: 1px solid var(--border-color);
    padding-top: var(--spacing-lg);
}

.help-card {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: rgba(65, 105, 225, 0.1);
    border-radius: var(--border-radius-md);
}

.help-icon {
    font-size: 1.5rem;
}

.help-content h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
}

.help-content p {
    margin: var(--spacing-xs) 0 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.copy-success {
    position: relative;
}

.copy-success::after {
    content: '✓';
    position: absolute;
    right: -20px;
    color: var(--accent-color);
    animation: fadeOut 2s forwards;
}

@keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
}

@media (max-width: 640px) {
    .parameters-grid {
        grid-template-columns: 1fr;
    }

    .modal-content {
        width: 95%;
        margin: var(--spacing-md);
    }

    .header-content {
        gap: var(--spacing-sm);
    }

    .header-icon {
        font-size: 1.5rem;
    }
}
.format-section {
    margin-bottom: var(--spacing-xl);
}

.format-section h4 {
    margin: 0 0 var(--spacing-md);
    color: var(--text-primary);
    font-size: 1rem;
}

.copy-field {
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    font-size: 0.875rem;
}

.copy-btn {
    position: absolute;
    right: var(--spacing-xs);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
    transition: all 0.2s ease;
}

.copy-btn:hover {
    color: var(--primary-color);
    background-color: rgba(65, 105, 225, 0.1);
}

.utm-params {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.param-group {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--spacing-md);
    align-items: center;
}

.param-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-family: monospace;
}

.param-fields {
    display: flex;
    gap: var(--spacing-sm);
}

.copy-success {
    color: var(--accent-color) !important;
}

.copy-success::after {
    content: '✓';
    position: absolute;
    right: -20px;
    color: var(--accent-color);
    animation: fadeOut 2s forwards;
}

@keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
}

@media (max-width: 640px) {
    .param-group {
        grid-template-columns: 1fr;
        gap: var(--spacing-xs);
    }

    .param-label {
        margin-bottom: calc(var(--spacing-xs) * -1);
    }
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-lg);
    width: 90%;
    max-width: 600px;
    box-shadow: var(--shadow-lg);
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
}

.modal-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.fb-icon {
    width: 24px;
    height: 24px;
}

.modal-title h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
}

.modal-body {
    padding: var(--spacing-xl);
}

.sync-steps {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
}

.sync-step {
    display: flex;
    gap: var(--spacing-lg);
}

.step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--border-color);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    transition: all 0.3s ease;
}

.sync-step.active .step-number {
    background-color: #1877F2;
    color: white;
}

.sync-step.completed .step-number {
    background-color: #4BB543;
    color: white;
}

.step-line {
    flex-grow: 1;
    width: 2px;
    background-color: var(--border-color);
    margin: 4px 0;
}

.sync-step.active .step-line,
.sync-step.completed .step-line {
    background-color: #1877F2;
}

.step-content {
    flex-grow: 1;
}

.step-content h4 {
    margin: 0 0 var(--spacing-sm);
    color: var(--text-primary);
    font-size: 1rem;
}

.step-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.progress-bar {
    flex-grow: 1;
    height: 6px;
    background-color: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #1877F2;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 14px;
    color: var(--text-secondary);
    min-width: 80px;
}

.step-complete {
    font-size: 14px;
    color: #4BB543;
}

.sync-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-md);
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(24, 119, 242, 0.3);
    border-radius: 50%;
    border-top-color: #1877F2;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background-color: #365CC5;
}

@media (max-width: 768px) {
    .integrations-main {
        margin-left: 0;
    }

    .card-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
    }

    .sync-step {
        flex-direction: column;
    }

    .step-line {
        display: none;
    }
}
.alert.alert-warning {
    margin: 1rem;
    background-color: #fff3cd;
    color: #856404;
    padding: 10px 15px;
    margin-bottom: 1rem;
    border: 1px solid #ffeeba;
    border-radius: 4px;
}
.ring-black {
    --tw-ring-color: transparent !important;
}
.api-instructions {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding: 15px;
    color: var(--text-secondary);
}

.api-instructions h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.api-instructions ul {
    margin: 10px 0;
    padding-left: 20px;
}

.api-instructions pre {
    background-color: #f9f9f9;
    border-left: 4px solid #4169E1;
    padding: 10px;
    overflow-x: auto;
    font-family: Consolas, monospace;
    font-size: 13px;
    color: #333;
    margin-bottom: 15px;
}

.api-warning {
    color: black;
    background: #fff3cd;
    border-left: 5px solid #ffc107;
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
}
.text-gray {
    color: var(--text-secondary);
}
.border-gray {
    border: 1px solid var(--text-secondary);
}
.sections-grid-webhooks {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}
.integrations {
    background-color: var(--background-color);
}

.integrations-main {
    margin-left: 250px;
}

.integrations-content {
    padding: var(--spacing-lg);
    padding-left: 0px;
    padding-right: 0px;
    margin: auto;
}

.sections-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.section-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
}

.section-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--section-color);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.section-card:hover::before,
.section-card.active::before {
    opacity: 1;
}

.section-card.active {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.section-icon {
    font-size: 24px;
    margin-bottom: var(--spacing-sm);
    display: block;
}

.section-info h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
}

.section-info p {
    margin: var(--spacing-xs) 0 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.content-area {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.integration-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.platform-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.platform-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
}

.text-muted {
    color: var(--text-secondary);
    font-size: 14px;
    margin-top: 4px;
}

.meta-accounts {
    display: grid;
    gap: var(--spacing-md);
}

.account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
}

.account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.account-name {
    font-weight: 500;
}

.account-status {
    width: fit-content;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    background-color: var(--background-color);
}

.account-status.ativa {
    color: #4CAF50;
}

.account-status.desabilitada {
    color: var(--text-secondary);
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.utm-options {
    display: grid;
    gap: var(--spacing-md);
}

.utm-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
}

.utm-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.script-icon {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color);
    border-radius: 8px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--card-background);
    border-radius: var(--border-radius-md);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-subtitle {
    color: var(--text-secondary);
    font-size: 14px;
    margin-top: 4px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
}

.modal-body {
    padding: var(--spacing-lg);
}

.search-box {
    margin-bottom: var(--spacing-lg);
}

.search-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.platforms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-sm);
}

.platform-button {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background-color: var(--menu-hover);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.platform-button:hover {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: 14px;
}

.form-input,
.form-select {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);

    background-color: var(--menu-hover);
    color: var(--text-primary);
}

.info-icon {
    color: var(--text-muted);
    cursor: help;
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
}

.back-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 16px;
    padding: var(--spacing-sm);
}

.success-message {
    text-align: center;
    margin: var(--spacing-lg) 0;
}

.success-icon {
    display: inline-block;
    width: 48px;
    height: 48px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    font-size: 24px;
    line-height: 48px;
    margin-bottom: var(--spacing-md);
}

.token-box {
    background-color: var(--menu-hover);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.token-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
}

.token-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: monospace;
    font-size: 16px;
    color: var(--text-primary);
}

.copy-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-size: 12px;
    cursor: pointer;
}

.w-full {
    width: 100%;
}

.btn-primary,
.btn-secondary {
    //padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
}

.btn-primary:hover {
    background-color: #365CC5;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--menu-hover);
}

@media (max-width: 1024px) {
    .sections-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .integrations-content {
        margin-left: 20px;
        margin-right: 20px;
    }

    .integrations-main {
        margin-left: 0;
    }

    .sections-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .utm-option {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
    }

    .card-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
    }
}

@media (max-width: 480px) {
    .sections-grid {
        grid-template-columns: 1fr;
    }
}
</style>