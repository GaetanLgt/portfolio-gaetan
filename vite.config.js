import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Auto-import des composants n-* (naive-ui) UNIQUEMENT dans les vues qui
    // les utilisent — naive-ui n'est plus chargé globalement dans le chunk
    // vendor initial (4 vues concernées, lazy-loadées par le routeur).
    Components({
      resolvers: [NaiveUiResolver()],
      dts: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Optimisations performance
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Code splitting par chunk
        manualChunks(id) {
          // ⛔⛔ LE REGROUPEMENT DES « CALQUES » A ÉTÉ RETIRÉ LE 22/09/2026.
          // Il groupait les huit calques conditionnels de `App.vue` en un seul
          // morceau `calques` : la règle « grouper ce qu'on diffère » était tenue,
          // et c'était la BONNE réponse au piège des requêtes. Mais le différé
          // lui-même a été annulé avec le reste du chantier — le découpage de
          // `HomePage.vue` faisait perdre des pages au prérendu. **Le regroupement
          // ne sert à rien tant que rien n'est différé**, et un morceau nommé qui
          // ne contient plus rien est un piège pour le prochain lecteur.
          // ⭐ À reprendre ensemble : `defineAsyncComponent` DANS `App.vue` ET
          // `manualChunks` ICI, dans le même geste. Jamais l'un sans l'autre.

          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
            if (id.includes('chart.js')) {
              return 'chart';
            }
            return 'vendor';
          }
          // NE RIEN regrouper cote application.
          // Un `return 'views'` ici forcait les 108 vues dans un seul chunk de
          // 1,5 Mo (+ 960 Ko de CSS), preloade des la page d'accueil : tous les
          // imports dynamiques du routeur etaient annules.
          // Meme probleme avec 'three-components' : nommer le chunk le rend
          // eager et rappelle Three.js (522 Ko) dans le chargement bloquant,
          // malgre le defineAsyncComponent cote App.vue.
          // Rollup decoupe correctement a partir des import() si on le laisse faire.
        }
      }
    },
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Critical CSS inline
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})
