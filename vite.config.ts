import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// Utilities
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    tailwindcss(),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      }
    })
  ],
  server: {
    port: 3000,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'app-dev.track.com.br-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'app-dev.track.com.br.pem'))
    // },
    // host: 'app-dev.track.com.br',
    // hmr: {
    //   host: 'app-dev.wetrackr.com.br',
    //   protocol: "wss",
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
