# ============================================================
# comparer.ps1 — DEUX DIST/, UN SEUL VERDICT
# ============================================================
# Usage : .\comparer.ps1 <distA> <distB> <etiquetteA> <etiquetteB>
#
# Trois niveaux, et il faut les trois :
#   1. le NOMBRE de fichiers — un build qui produit moins est le danger n° 1 ;
#   2. les chemins — un fichier present d un cote et absent de l autre ;
#   3. le CONTENU, hashes de chunks neutralises — sinon on confond
#      « le site a change » avec « un nom de fichier a change ».
# ============================================================
param(
    [string]$A = 'C:\IA\_mesures-conteneur\copie-head\dist',
    [string]$B = 'C:\IA\_mesures-conteneur\sortie-head-1',
    [string]$NomA = 'LOCAL (Windows)',
    [string]$NomB = 'CONTENEUR (Linux)'
)

$ErrorActionPreference = 'Continue'
$motif = '-[A-Za-z0-9_-]{8}\.(js|css|woff2|png|jpg|svg|webp|mjs)'
function Normaliser([string]$t) { return [regex]::Replace($t, $motif, '-X.$1') }
function Cle([string]$n) { return [regex]::Replace($n, $motif, '.$1') }

function Inventaire([string]$base) {
    $t = @{}
    if (-not (Test-Path $base)) { return $t }
    foreach ($f in Get-ChildItem $base -Recurse -File) {
        $rel = $f.FullName.Substring($base.Length + 1)
        $t[$rel] = $f
    }
    return $t
}

$ia = Inventaire $A
$ib = Inventaire $B
Write-Output ('=== ' + $NomA + ' : ' + $ia.Count + ' fichiers ===')
Write-Output ('=== ' + $NomB + ' : ' + $ib.Count + ' fichiers ===')
Write-Output ('ECART DE COMPTE : ' + ($ib.Count - $ia.Count))

# Appariement par cle sans hash.
$paires = @()
foreach ($rel in $ia.Keys) {
    $cle = Cle $rel
    $rel2 = $null
    foreach ($r2 in $ib.Keys) { if ((Cle $r2) -eq $cle) { $rel2 = $r2; break } }
    $paires += , @($rel, $rel2, $cle)
}

$identiques = 0; $propages = 0; $vraies = @(); $absentsDeB = @()
foreach ($p in $paires) {
    $rel = $p[0]; $rel2 = $p[1]; $cle = $p[2]
    if (-not $rel2) { $absentsDeB += $rel; continue }
    $ta = [System.IO.File]::ReadAllText($ia[$rel].FullName, [System.Text.Encoding]::UTF8)
    $tb = [System.IO.File]::ReadAllText($ib[$rel2].FullName, [System.Text.Encoding]::UTF8)
    if ($ta -eq $tb) { $identiques++; continue }
    if ((Normaliser $ta) -eq (Normaliser $tb)) { $propages++; continue }
    $vraies += $cle
}
$enPlusDansB = 0
foreach ($rel2 in $ib.Keys) {
    $cle = Cle $rel2
    $trouve = $false
    foreach ($p in $paires) { if ($p[2] -eq $cle) { $trouve = $true; break } }
    if (-not $trouve) { $enPlusDansB++ }
}

Write-Output ''
Write-Output ('identiques (nom ET contenu)          : ' + $identiques)
Write-Output ('memes noms apres neutralisation      : ' + $propages + '  (renommage de chunk seulement)')
Write-Output ('CONTENU REELLEMENT DIFFERENT         : ' + ($vraies | Sort-Object -Unique).Count)
Write-Output ('presents dans ' + $NomA + ' seul      : ' + $absentsDeB.Count)
Write-Output ('presents dans ' + $NomB + ' seul      : ' + $enPlusDansB)
Write-Output '--- fichiers au contenu reellement different ---'
$vraies | Sort-Object -Unique | ForEach-Object { Write-Output ('   ' + $_) }
