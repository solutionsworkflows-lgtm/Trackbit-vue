<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import SideMenu from '@/components/layout/SideMenu.vue'

import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { isPublicRoute } from '@/router'
import Header from "./components/layout/Header.vue";

const route = useRoute()
const isPublic = computed(() => isPublicRoute(route))

const { isLogged } = useAuth()
</script>

<template>
    <SideMenu v-if="isLogged && !isPublic" />
    <Header v-if="isLogged && !isPublic" />
    <RouterView />
</template>
