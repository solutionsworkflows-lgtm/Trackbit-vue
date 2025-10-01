import { ref, computed } from 'vue'
import {isUndefined} from "vue-toastification/dist/types/ts/utils";

const userKey = 'user'

const storedUser = ref(getStoredUser())

function getStoredUser() {
    const data = localStorage.getItem(userKey) || sessionStorage.getItem(userKey)
    return !isUndefined(data) ? JSON.parse(data) : null
}

function setUser(user: any, remember = true) {
    storedUser.value = user

    const data = JSON.stringify(user)
    if (remember) {
        localStorage.setItem(userKey, data)
    } else {
        sessionStorage.setItem(userKey, data)
    }
}

function clearUser() {
    localStorage.removeItem(userKey)
    sessionStorage.removeItem(userKey)
    storedUser.value = null
}

export function useAuthUser() {
    return {
        user: computed(() => storedUser.value),
        setUser,
        clearUser
    }
}
