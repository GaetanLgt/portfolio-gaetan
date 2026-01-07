# 🚀 DÉPLOIEMENT GL DIGITAL LAB - O2SWITCH

## Pré-requis
- [ ] Compte O2Switch actif
- [ ] Domaine gldigitallab.fr configuré
- [ ] Accès cPanel

## Avant le build
- [ ] Formspree ID configuré dans ContactPage.vue
- [ ] Favicons PNG générés (realfavicongenerator.net)
- [ ] og-image.png créé (1200x630px)
- [ ] URLs GitHub/LinkedIn vérifiées
- [ ] Hébergeur mis à jour dans MentionsLegales.vue (O2Switch ✅)

## Build
```bash
cd C:\Users\neosp\Desktop\portfolio-gaetan
npm install
npm run build
```

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
- [ ] Lighthouse audit (target: 90+)

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
