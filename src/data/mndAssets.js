/**
 * MND — Manga No Densetsu : chemins publics des visuels premium.
 *
 * Les PNG ne sont PAS versionnés ici : ils sont copiés à la main depuis
 * C:\IA\gl-digital-lab\assets\ vers public/images/mnd/ (voir le rapport
 * d'intégration pour la liste source → destination exacte). Tant que la copie
 * n'est pas faite, les composants se replient proprement (aucun rendu cassé).
 */

// Avatars des six Lois (fichiers = nom du fichier dans public/images/mnd/agents/)
export const LAW_AVATAR_FILES = {
  wa: 'wa-harmonie.png',
  makoto: 'makoto-sincerite.png',
  bi: 'bi-beaute.png',
  jitsu: 'jitsu-realisation.png',
  dou: 'dou-mouvement.png',
  watashi: 'watashi-interiorite.png'
};

// URL publique d'un avatar de Loi ('' si la Loi n'a pas de visuel MND)
export function lawAvatarUrl(law) {
  const file = LAW_AVATAR_FILES[law.id];
  return file ? `/images/mnd/agents/${file}` : '';
}

// Autres visuels premium (issus de assets/premium/)
export const MND_PATHS = {
  heroBackground: '/images/mnd/hero-bg-v2.png',
  theOne: '/images/mnd/the-one-v2.png',
  headerBand: '/images/mnd/header-band-v2.png',
  footerBackground: '/images/mnd/footer-bg-v2.png'
};

export default MND_PATHS;
