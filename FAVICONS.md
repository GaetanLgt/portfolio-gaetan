# Guide : Génération des Favicons PNG

## Méthode Rapide (recommandée)

1. Va sur **https://realfavicongenerator.net**
2. Upload le fichier `public/favicon.svg`
3. Configure :
   - iOS : fond #050505
   - Android : fond #050505, thème #10B981
   - Windows : fond #050505
4. Télécharge le package
5. Copie les fichiers dans `/public/` :
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon-192x192.png`
   - `favicon-512x512.png`
   - `apple-touch-icon.png`

## Méthode Manuelle (avec ImageMagick)

```bash
# Installer ImageMagick si nécessaire
# brew install imagemagick (Mac)
# apt install imagemagick (Linux)

cd public

# Générer les PNG depuis le SVG
convert -background none favicon.svg -resize 16x16 favicon-16x16.png
convert -background none favicon.svg -resize 32x32 favicon-32x32.png
convert -background none favicon.svg -resize 192x192 favicon-192x192.png
convert -background none favicon.svg -resize 512x512 favicon-512x512.png
convert -background none favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon-32x32.png favicon.ico
```

## Méthode Node.js (avec Sharp)

```bash
npm install sharp --save-dev
node scripts/generate-favicons.js
```

## Vérification

Après génération, vérifie que ces fichiers existent :
- [ ] `/public/favicon.ico`
- [ ] `/public/favicon-16x16.png`
- [ ] `/public/favicon-32x32.png`
- [ ] `/public/favicon-192x192.png`
- [ ] `/public/favicon-512x512.png`
- [ ] `/public/apple-touch-icon.png`
- [ ] `/public/og-image.png` (1200x630px pour Open Graph)

## OG Image

Pour l'image Open Graph (`og-image.png`), crée une image 1200x630px avec :
- Fond : #050505
- Logo GL en grand
- Texte : "GL Digital Lab"
- Tagline : "Architecte de vos Systèmes Critiques"
- Couleur accent : #10B981

Tu peux utiliser Figma, Canva, ou un générateur comme https://og-image.vercel.app/
