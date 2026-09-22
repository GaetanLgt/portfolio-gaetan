# 🚀 DÉPLOIEMENT GL DIGITAL LAB - O2SWITCH

## ⚠️ BANDEAU DE CORRECTION — 22/09/2026

> **Ce fichier a été corrigé le 22/09/2026 par un audit à 360°, et il le fallait :**
> c'est la procédure de mise en ligne du site, et **quatre de ses points
> envoyaient au mauvais endroit.** Suivre cette page telle qu'elle était écrite
> menait à un `cd` dans un dossier inexistant, et à vérifier des prérequis qui
> n'existent plus.
>
> ⛔ **Aucune affirmation fausse n'a été supprimée en silence.** Elles restent,
> marquées `⛔ FAUX`, avec la mesure qui les contredit et sa date : *elles
> documentent l'histoire du dépôt.*
>
> | Ce que ce fichier disait | La vérité mesurée le 22/09/2026 |
> |---|---|
> | `cd C:\Users\neosp\Desktop\portfolio-gaetan` | **ce chemin n'existe pas** sur la machine — le dépôt est dans `C:\IA\portfolio-gaetan` |
> | « Formspree ID configuré dans ContactPage.vue » | **Formspree a été RETIRÉ le 10/09/2026** ; le formulaire est **auto-hébergé** (`api/contact.php`). Les 3 mentions restantes dans `src/` sont des commentaires **qui documentent le retrait** |
> | « og-image.png créé (1200x630px) » | l'`og:image` **réellement livrée** est **`og-navire.jpg`** (42 990 o). `og-image.png` (36 685 o) existe aussi, mais elle est portée par le **JSON-LD** (`@type: LocalBusiness`) — ce n'est pas la même chose |
> | « Lighthouse audit (target: 90+) » | la cible du studio est **≥ 95** — lue dans `.lighthouserc.json` : `minScore: 0.95` sur les **quatre** catégories |
>
> ⚠️ **ET LE POINT LE PLUS IMPORTANT N'ÉTAIT PAS DANS CE FICHIER :** le
> déploiement est **automatique au push sur `main`**
> (`.github/workflows/deploy.yml`). Cette page décrit une mise en ligne
> **manuelle**, alors que publier se fait en poussant. Voir
> `A-FAIRE-PAR-GAETAN.md`.

---

## Pré-requis
- [ ] Compte O2Switch actif
- [ ] Domaine gldigitallab.fr configuré
- [ ] Accès cPanel

## Avant le build
- [ ] ⛔ ~~Formspree ID configuré dans ContactPage.vue~~ **FAUX — sans objet
      depuis le 10/09/2026** : Formspree a été retiré (société américaine), le
      formulaire est **auto-hébergé** par `dist/api/contact.php`.
      ✅ **Ce qu'il faut vérifier à la place** : que `api/contact.php` **part
      bien avec le déploiement** — sans lui, le formulaire ne fonctionne plus.
- [ ] Favicons PNG générés (realfavicongenerator.net)
- [ ] ⛔ ~~og-image.png créé (1200x630px)~~ **à préciser** : l'`og:image` livrée
      est **`og-navire.jpg`**. Les deux fichiers existent dans `public/`, mais
      **ils ne disent pas la même chose** — `og-navire.jpg` est l'image sociale
      de la page, `og-image.png` est l'image de l'**entité** dans le JSON-LD.
- [ ] URLs GitHub/LinkedIn vérifiées
- [ ] Hébergeur mis à jour dans MentionsLegales.vue (O2Switch ✅)

## Build
```bash
# ⛔ FAUX — corrigé le 22/09/2026 :
# cd C:\Users\neosp\Desktop\portfolio-gaetan
#     Ce chemin N'EXISTE PAS sur la machine (Test-Path = False).
#     Le dépôt de travail est dans C:\IA\portfolio-gaetan
cd C:\IA\portfolio-gaetan
npm install
npm run build
```
⚠️ **Le chemin d'origine est conservé ci-dessus parce qu'il documente l'histoire
du dépôt** — et parce qu'un second exemplaire du dépôt existe :
`C:\Users\neosp\code\portfolio-gaetan` (15 commits de retard au 22/09/2026).
**Ne pas déployer depuis cette copie-là.**

⚠️ `npm run build` **n'est pas un simple `vite build`** : il enchaîne `sitemap`,
`ecole`, `arche`, `vite build` puis **`prerendre`** — qui rend 32 pages en HTML
réel en pilotant un navigateur. Compte **une à deux minutes**.
⚠️ Et `prerendre` **échoue si le port 4178 est déjà pris** (deux builds
simultanés sur le même dossier ne cohabitent pas) : `EADDRINUSE`.

## Upload (via cPanel ou FTP)
- [ ] Connexion à cPanel O2Switch
- [ ] Ouvrir File Manager → public_html/
- [ ] Supprimer ancien contenu (sauf .htaccess custom)
- [ ] Uploader TOUT le contenu de dist/
- [ ] Vérifier que .htaccess est présent

## Post-déploiement
- [ ] Activer SSL/Let's Encrypt dans cPanel
- [ ] Tester https://gldigitallab.fr
- [ ] Tester navigation (toutes les pages)
- [ ] Tester formulaire contact
- [ ] Tester sur mobile
- [ ] Vérifier robots.txt : https://gldigitallab.fr/robots.txt
- [ ] Vérifier sitemap : https://gldigitallab.fr/sitemap.xml
- [ ] Lighthouse audit (⛔ ~~target: 90+~~ **FAUX** — la cible du studio est
      **≥ 95**, lue dans `.lighthouserc.json` : `minScore: 0.95` sur
      performance, accessibilité, bonnes pratiques **et** SEO)

## DNS (si nouveau domaine)
Dans la zone DNS O2Switch ou chez le registrar :
```
A     @     [IP du serveur O2Switch]
A     www   [IP du serveur O2Switch]
```
Ou via les NS O2Switch directement.

## En cas de problème

### 404 sur les pages internes
→ .htaccess pas uploadé ou mal configuré

### Fonts ne chargent pas
→ Vérifier CORS ou bloquer dans .htaccess

### HTTPS ne fonctionne pas
→ Attendre propagation SSL (jusqu'à 24h)
→ Vérifier certificat dans cPanel → SSL/TLS

## URLs de test
- https://gldigitallab.fr
- https://gldigitallab.fr/services
- https://gldigitallab.fr/contact
- https://gldigitallab.fr/arkadia
- https://gldigitallab.fr/mentions-legales

## Contact support O2Switch
- Ticket : https://www.o2switch.fr/support/
- Chat : Disponible dans l'espace client
