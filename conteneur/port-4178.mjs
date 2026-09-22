// ============================================================
// port-4178.mjs — DEUX CONTENEURS, LE MÊME PORT, EN MÊME TEMPS
// ============================================================
// CE QUE CE SCRIPT REPRODUIT EXACTEMENT : la ligne de `scripts/prerendre.js`
// (mesurée, ligne 120) qui prend le port FIXE 4178 :
//
//     serveur.listen(PORT, '127.0.0.1', () => r(serveur))
//
// C'est le défaut qui a coûté le plus cher : deux builds simultanés se
// tuaient en `EADDRINUSE`, `dist/` ressortait amputé, et les mesures n'étaient
// plus reproductibles.
//
// CE QU'IL MESURE : est-ce que deux conteneurs qui écoutent sur 4178 EN MÊME
// TEMPS se voient ? (réponse attendue : non — chaque conteneur a son propre
// espace réseau). Il dit aussi son nom d'hôte, pour qu'on sache QUI a parlé.
//
// Durée de vie : 20 secondes, puis il s'arrête tout seul. Il n'écoute que sur
// la boucle locale : il ne publie rien, et rien de l'extérieur ne peut
// l'atteindre.
import http from 'node:http'
import os from 'node:os'

const PORT = 4178
const NOUS = os.hostname()

const serveur = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(`je suis ${NOUS}\n`)
})

serveur.on('error', (e) => {
  console.log(`[${NOUS}] ECHEC : 127.0.0.1:${PORT} indisponible → ${e.code}`)
  process.exit(1)
})

serveur.listen(PORT, '127.0.0.1', () => {
  console.log(`[${NOUS}] ecoute ETABLIE sur 127.0.0.1:${PORT}`)
})

setTimeout(() => {
  console.log(`[${NOUS}] 20 s sans collision — je m'arrete.`)
  process.exit(0)
}, 20000)
