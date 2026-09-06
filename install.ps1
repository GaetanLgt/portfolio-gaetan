# ============================================
# GL DIGITAL LAB - Portfolio Installation
# PowerShell Script for Windows
# ============================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   GL DIGITAL LAB - Portfolio Setup" -ForegroundColor Cyan
Write-Host "   🏢 GL Tower | 13 Agents IA" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in correct directory
$projectPath = "C:\Users\neosp\Desktop\portfolio-gaetan"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✅ Répertoire projet trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ Répertoire projet non trouvé: $projectPath" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host ""
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow

$nodeVersion = node -v 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js non installé" -ForegroundColor Red
    Write-Host "   Télécharger: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}

# Check npm
$npmVersion = npm -v 2>$null
if ($npmVersion) {
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm non trouvé" -ForegroundColor Red
    exit 1
}

# Check Git (optional)
$gitVersion = git --version 2>$null
if ($gitVersion) {
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git non installé (optionnel)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
Write-Host ""

# Install dependencies
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dépendances installées avec succès!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ✅ Installation terminée!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Commandes disponibles:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   npm run dev      " -NoNewline -ForegroundColor Cyan
Write-Host "→ Lancer le serveur de développement" -ForegroundColor Gray
Write-Host "   npm run build    " -NoNewline -ForegroundColor Cyan
Write-Host "→ Build de production" -ForegroundColor Gray
Write-Host "   npm run preview  " -NoNewline -ForegroundColor Cyan
Write-Host "→ Prévisualiser le build" -ForegroundColor Gray
Write-Host "   npm run lint     " -NoNewline -ForegroundColor Cyan
Write-Host "→ Vérifier le code" -ForegroundColor Gray
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Yellow
Write-Host "   Local:   " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Hub:     " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5173/hub" -ForegroundColor Cyan
Write-Host "   Carte:   " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5173/carte-holistique" -ForegroundColor Cyan
Write-Host ""
Write-Host "🏢 GL Tower - L'Équipage des 6 Lois ARKADIA" -ForegroundColor Yellow
Write-Host "   和 Wa (Penthouse) — Orchestration" -ForegroundColor Gray
Write-Host "   誠 Makoto (6) — Sécurité & QA" -ForegroundColor Gray
Write-Host "   美 Bi (5) — Frontend & Design" -ForegroundColor Gray
Write-Host "   実 Jitsu (4) — Backend & Livraison" -ForegroundColor Gray
Write-Host "   動 Dou (3) — Monitoring & Alertes" -ForegroundColor Gray
Write-Host "   私 Watashi (2) — Mémoire & RAG" -ForegroundColor Gray
Write-Host ""

# Ask to start dev server
$response = Read-Host "▶️  Lancer le serveur de dev maintenant? (O/n)"

if ($response -eq "" -or $response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Green
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "👋 À bientôt! Lance 'npm run dev' quand tu es prêt." -ForegroundColor Cyan
    Write-Host ""
}
