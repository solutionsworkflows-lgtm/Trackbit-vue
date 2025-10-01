// Styles
import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'

// Composables
import { createVuetify } from 'vuetify'

import { pt, en, es } from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    buttons: {
        capitalize: false,
    },
    locale: {
        locale: 'pt-BR',
        fallback: 'pt-BR',
        messages: {
            'pt-BR': pt,
            'en-US': en,
            'en-USDR': en,
            'es-AR': es,
            'es-BO': es,
            'es-CL': es,
            'es-PY': es,
            'es-PE': es
        }
    },
    theme: {
        defaultTheme: 'dark',
        themes: {
            darkCustom: {
                dark: true,
                colors: {
                    primary: '#ffffff',            // --v-theme-primary
                    secondary: '#a0aec0',          // --v-theme-secondary
                    background: '#1a1f2e',          // --v-theme-background
                    surface: '#242935',             // --v-theme-surface
                    'on-surface': '#342f2f85',        // --v-theme-on-surface
                    'on-background': '#ffffff',     // --v-theme-on-background
                    border: '#2d3748',              // custom color (not exposed by default)
                    menu: '#242935',                // custom color
                    menuHover: '#2d3748',           // custom color
                },
                variables: {
                    // Aqui você pode sobrescrever qualquer variável CSS usada pelo Vuetify
                    'border-color': '#2d3748', // customização adicional
                }
            }
        }
    },
    // treeShake: true,
    breakpoint: {
        mobileBreakpoint: 'sm'
    },
    display: {
        mobileBreakpoint: 'sm',
        thresholds: {
            xs: 0,
            sm: 340,
            md: 540,
            lg: 800,
            xl: 1280
        }
    },
})