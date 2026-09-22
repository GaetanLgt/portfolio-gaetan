/**
 * vite.config.controle-modele.mjs — LE CONTRÔLE DE COMPILATION DE LA TRANCHE.
 *
 * ⚠ POURQUOI CE FICHIER EXISTE, ET IL RÉPOND À UNE QUESTION PRÉCISE.
 * La page de la tranche n'est branchée sur AUCUNE route tant que Gaëtan n'a pas ajouté
 * la ligne (elle est livrée hors routeur). Or Vite ne compile que ce qui est ATTEIGNABLE
 * depuis une entrée : lancer `vite build` sur ce dépôt sans entrée dédiée ne compilerait
 * PAS la tranche, et le build « passerait » sans avoir rien vérifié. *Un contrôle qui ne
 * peut pas échouer ne mesure rien.* Ce fichier donne donc à la tranche sa propre entrée,
 * et la compile POUR DE VRAI.
 *
 * CE QU'IL FAIT, EXACTEMENT :
 *   · racine = la racine du dépôt (donc mêmes `node_modules`, même plugin Vue) ;
 *   · une seule entrée : `src/views/modeles/ModeleBorealBoutique.vue` ;
 *   · sortie dans le dossier temporaire du système — JAMAIS dans `dist/`, qui appartient
 *     au build du dépôt. Deux builds qui écrivent au même endroit se battent.
 *
 * CE QU'IL NE FAIT PAS : il ne remplace pas `npm run build` et ne dit rien du prérendu,
 * du sitemap, ni des verrous de `dist/`. Il répond à une seule question : **est-ce que ça
 * compile, et quel poids ça ajoute ?**
 *
 * Usage (depuis la racine du dépôt) :
 *   npx vite build --config src/views/modeles/vite.config.controle-modele.mjs
 */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const RACINE = fileURLToPath(new URL('../../../', import.meta.url));

export default defineConfig({
  root: RACINE,
  // ⚠ `publicDir: false` — MESURÉ, PAS UN DÉTAIL. Par défaut, Vite recopie tout le
  // dossier `public/` du dépôt dans le dossier de sortie (favicons, modèles 3D, planches,
  // images) : ce contrôle ne regarde AUCUNE de ces ressources, et leur copie ne fait que
  // ralentir la mesure et brouiller le compte des fichiers produits.
  publicDir: false,
  // Le seul greffon nécessaire : la tranche n'utilise ni Naive UI, ni greffon
  // d'auto-import, ni Three.js. On ne charge donc pas ce dont elle n'a pas besoin.
  plugins: [vue()],
  resolve: {
    alias: {
      '@': join(RACINE, 'src'),
    },
  },
  build: {
    // ⚠ DOSSIER DE SORTIE PROPRE À CE CONTRÔLE, ET C'EST MESURÉ, PAS PRUDENT.
    // `%TEMP%\build-modeles` est déjà utilisé par le build du dépôt : y écrire avec
    // `emptyOutDir` aurait EFFACÉ les fichiers de l'autre build, et deux builds qui
    // écrivent au même endroit se battent. On écrit donc à côté, jamais dedans.
    outDir: join(tmpdir(), 'build-controle-tranche'),
    emptyOutDir: true,
    cssCodeSplit: true,
    // ⚠ `base: '/'` — ET C'EST PASSÉ DE RELATIF À ABSOLU PAR NÉCESSITÉ, PAS PAR GOÛT.
    // Depuis que les cinq marches sont cinq VRAIES ADRESSES, le banc ouvre des URL
    // profondes : `/modeles/boutique-boreal/produit/<id>`. Avec des chemins relatifs
    // (`./assets/…`), le navigateur chercherait les fichiers dans
    // `/modeles/boutique-boreal/produit/assets/…` — donc nulle part. L'absolu est aussi
    // ce que fait le site en production.
    base: '/',
    minify: 'terser',
    terserOptions: {
      compress: {
        // ⚠ `drop_console: false` — ET C'EST UN CHOIX DE CONTRÔLE, PAS UN OUBLI.
        // Le build du dépôt retire les `console.*` (drop_console: true). Si on les
        // retirait ici, le banc d'essai deviendrait SOURD : les avertissements de Vue
        // (« propriété manquante », « clé dupliquée ») et ses erreurs de rendu seraient
        // supprimés du morceau, et le banc conclurait « aucune erreur » en n'ayant plus
        // les moyens d'en voir une. **Un banc qu'on rend muet ne prouve rien.**
        // Le poids mesuré ici est donc celui d'un build qui garde ses avertissements —
        // c'est dit, et l'écart est de quelques centaines d'octets.
        drop_console: false,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // ⭐ ON SÉPARE LE MOTEUR DE LA TRANCHE, POUR QUE LE POIDS MESURÉ VEUILLE DIRE
      // QUELQUE CHOSE. Sans ce découpage, Vue (le moteur) et la tranche (ce que le studio
      // écrit) atterrissent dans le même morceau : annoncer « 126 ko » ne dirait alors
      // rien du travail du studio. Ici, `moteur-vue` est le cadre, `modele` est la tranche.
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'moteur-vue';
          return undefined;
        },
      },
      // DEUX entrées, et elles ne servent pas à la même chose :
      //   · `essai` est la page HTML qui monte la tranche et l'éprouve de bout en bout ;
      //   · `modele` compile la page elle-même, seule, pour mesurer ce qu'elle pèse.
      input: {
        essai: join(RACINE, 'src', 'views', 'modeles', 'essai-rendu.html'),
        modele: join(RACINE, 'src', 'views', 'modeles', 'ModeleBorealBoutique.vue'),
      },
    },
  },
});
