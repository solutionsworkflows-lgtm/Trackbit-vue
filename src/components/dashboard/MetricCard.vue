<script setup lang="ts">
import {formatCurrency} from "../../utils/formatters.ts";

defineProps<{
    id: string;
    title: string;
    value: string | number;
    info?: string;
    loading?: boolean;
    customClass?: boolean;
    isPercentage?: boolean;
    isCurrency?: boolean;
}>()

function parsePtBrNumber(value) {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
        // Detecta se está no formato pt-BR (contém vírgula como decimal)
        if (value.includes(',')) {
            return parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }

        // Caso já esteja no formato internacional, apenas converte
        return parseFloat(value);
    }

    return NaN;
}

const formatColumnValue = (value, columnId) => {
    const columnsPercent = ['profitMargin', 'chargeback'];
    const columnsOnlyValues = ['roas', 'roi'];

    if (columnsOnlyValues.includes(columnId)) {
        return value ?? 'N/A';
    }

    if (columnsPercent.includes(columnId)) {
        return value + '%' ?? '-';
    }

    return formatCurrency(parseFloat(value));
}

const getColumnClass = (customClass, id, value) => {

    if (customClass) {
        const parsed = parsePtBrNumber(value);
        // if (id == 'roas') {
        //     if (parsed > 1) {
        //         return 'text-accent';
        //     }
        //     if (parsed == 0) {
        //         return '';
        //     } else {
        //         return 'text-danger';
        //     }
        // }

        if (parsed > 0) {
            return 'text-accent';
        }
        if (parsed == 0) {
            return '';
        } else {
            return 'text-danger';
        }
    }

    return '';
};
</script>

<template>
    <div class="metric-card card animate-fadeIn">
        <div class="card-header">
            <h3 class="card-title">{{ title }}</h3>
            <div v-if="info" class="info-tooltip">
                <span class="info-icon">ⓘ</span>
                <div class="tooltip-content">
                    {{ info }}
                </div>
            </div>
        </div>
        <div class="card-value" :class="getColumnClass(customClass, id, value)">
             <span v-if="loading" class="animate-pulse">
                 <div class="h-4 bg-gray-700 rounded w-3/4 mx-auto" style="width: 280px"></div>
             </span>
            <span v-else> {{ formatColumnValue(value, id) }}</span>
        </div>
    </div>
</template>

<style scoped>
.metric-card {
    background: #1c223b75;
    border: 1px solid #232c4dad;
    height: 123px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--spacing-md);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.card-title {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 500;
}

.info-tooltip {
    position: relative;
    margin-left: var(--spacing-xs);
    cursor: pointer;
}

.info-icon {
    color: var(--text-muted);
    font-size: 14px;
}

.tooltip-content {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    width: 200px;
    font-size: 12px;
    z-index: 10;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    text-align: center;
}

.info-tooltip:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
}

.card-value {
    font-size: 24px;
    font-weight: 700;
    color: #d0d2d6f7;
}

.text-accent {
    color: var(--accent-color);
}

.text-danger {
    color: var(--text-danger);
}

.text-primary {
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .metric-card {
        width: 100%;
    }
    .card-title {
        max-width: 20ch;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .card-value {
        font-size: 20px;
    }

    .card-header {
        margin-bottom: 3px;
    }

    div.metric-card.card.animate-fadeIn > div.card-header > h3 {
        font-size: 17px;
        font-weight: 600 !important;
    }

    div.metric-card.card.animate-fadeIn > div.card-value > span {
        font-size: calc(1.2964rem + .5568vw);
        font-weight: 600 !important;
        text-align: center;
    }

    .info-icon {
        display: none;
    }
}
</style>