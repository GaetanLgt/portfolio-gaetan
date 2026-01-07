/**************** NeoFindThePath — LS v6 AGILITY BUILD ****************/
/*
 * Build: 100 Agilité / 0 Force
 * Stratégie: Esquive + Survie + Dégâts Puces
 * 
 * Avec 0 Force, le Pistolet fait peu de dégâts.
 * On mise sur:
 * - Esquive naturelle (100 Agi)
 * - Shield permanent (CHIP_HELMET)
 * - Heal constant (CHIP_BANDAGE, CHIP_CURE)
 * - Dégâts via CHIP_SPARK (dépend de Science, pas Force)
 * - Mouvement constant pour maximiser l'esquive
 */

// ------- Globals -------
global enemy = null;
global me = getEntity();
global hasMoved = false;

// ------- Utils simples -------
function alive(e) { return e != null && isAlive(e); }

function distTo(e) { 
	if (e == null) return 9999;
	var c = getCell(e);
	if (c == null) return 9999;
	return getCellDistance(getCell(), c);
}

function hasLOS(e) {
	if (!alive(e)) return false;
	return lineOfSight(getCell(), getCell(e));
}

// ------- Targeting -------
function findEnemy() {
	var E = getAliveEnemies();
	if (count(E) == 0) return null;
	
	var best = null;
	var bestD = 9999;
	
	for (var e in E) {
		if (isSummon(e)) continue;
		var d = distTo(e);
		if (d < bestD) {
			best = e;
			bestD = d;
		}
	}
	return best;
}

// ------- DEFENSE (Priorité #1 pour Agility Build) -------
function doDefense() {
	var ratio = getLife() / getTotalLife();
	
	// Shield TOUJOURS en premier (absorbe les dégâts)
	if (canUseChip(CHIP_HELMET, me) && getAbsoluteShield() < 10) {
		useChip(CHIP_HELMET, me);
	}
	
	// Heal agressif - on se soigne souvent car on mise sur la durée
	if (ratio < 0.75) {
		if (canUseChip(CHIP_CURE, me)) useChip(CHIP_CURE, me);
	}
	if (ratio < 0.85) {
		if (canUseChip(CHIP_BANDAGE, me)) useChip(CHIP_BANDAGE, me);
	}
}

// ------- ATTACK (Puces > Armes pour ce build) -------
function doAttack() {
	if (!alive(enemy)) return;
	
	var d = distTo(enemy);
	
	// SPARK est notre meilleure source de dégâts (Science-based)
	// Portée: 1-6, Coût: 3 PT
	while (d <= 6 && d >= 1 && hasLOS(enemy) && canUseChip(CHIP_SPARK, enemy)) {
		useChip(CHIP_SPARK, enemy);
		if (!alive(enemy)) {
			enemy = findEnemy();
			if (!alive(enemy)) return;
		}
		d = distTo(enemy);
	}
	
	// ICE pour ralentir l'ennemi (il nous rattrapera moins vite)
	// Portée: 1-7, Coût: 3 PT
	if (d <= 7 && d >= 1 && hasLOS(enemy) && canUseChip(CHIP_ICE, enemy)) {
		useChip(CHIP_ICE, enemy);
	}
	
	// ROCK si on l'a (Portée: 2-8, Coût: 3 PT)
	while (d <= 8 && d >= 2 && hasLOS(enemy) && canUseChip(CHIP_ROCK, enemy)) {
		useChip(CHIP_ROCK, enemy);
		if (!alive(enemy)) {
			enemy = findEnemy();
			if (!alive(enemy)) return;
		}
		d = distTo(enemy);
	}
	
	// Pistolet seulement si on a des PT restants et à portée
	// (Fait peu de dégâts avec 0 Force, mais c'est mieux que rien)
	if (getWeapon() == null) setWeapon(WEAPON_PISTOL);
	
	while (d <= 7 && d >= 1 && hasLOS(enemy) && getTP() >= 3 && canUseWeapon(enemy)) {
		useWeapon(enemy);
		if (!alive(enemy)) {
			enemy = findEnemy();
			if (!alive(enemy)) return;
		}
		d = distTo(enemy);
	}
}

// ------- MOVEMENT (Crucial pour Agility Build!) -------
function doMove() {
	if (!alive(enemy)) return;
	if (getMP() <= 0) return;
	
	var d = distTo(enemy);
	
	// Distance idéale: 5-6 cases
	// - Assez proche pour SPARK (portée 6)
	// - Assez loin pour esquiver les Shotguns (portée 1-3)
	// - Dans la zone "moyenne" du Pistolet ennemi
	
	var idealDist = 5;
	
	if (d < 3) {
		// DANGER: Trop proche, risque Shotgun
		// Reculer au maximum
		moveAwayFrom(enemy, getMP());
		hasMoved = true;
	}
	else if (d > 7) {
		// Trop loin: on ne peut pas toucher avec SPARK
		// Approcher prudemment
		var steps = min(getMP(), d - idealDist);
		if (steps > 0) {
			moveToward(enemy, steps);
			hasMoved = true;
		}
	}
	else if (d < idealDist && getMP() >= 1) {
		// Un peu trop proche, reculer de 1-2
		moveAwayFrom(enemy, min(getMP(), 2));
		hasMoved = true;
	}
	
	// Si on n'a pas bougé et qu'il reste des PM, bouger quand même
	// (Le mouvement augmente l'esquive effective!)
	if (!hasMoved && getMP() > 0 && d >= 4 && d <= 6) {
		// On est à bonne distance, bouger latéralement si possible
		// Sinon reculer de 1 pour garder la distance
		moveAwayFrom(enemy, 1);
	}
}

// ------- POST-COMBAT MOVEMENT -------
function doPostMove() {
	if (!alive(enemy)) return;
	if (getMP() <= 0) return;
	
	var d = distTo(enemy);
	
	// Après avoir attaqué, utiliser les PM restants pour s'éloigner
	// Ça force l'ennemi à dépenser ses PM pour nous rattraper
	if (d <= 5) {
		moveAwayFrom(enemy, getMP());
	}
}

// ------- MAIN -------

// Init
hasMoved = false;
if (getWeapon() == null) setWeapon(WEAPON_PISTOL);

// 1. Trouver l'ennemi
enemy = findEnemy();

// 2. DEFENSE FIRST (Shield + Heal)
doDefense();

// 3. Positionnement pré-combat
doMove();

// 4. Attaquer (Puces prioritaires)
doAttack();

// 5. Re-heal si besoin après les échanges
var ratio = getLife() / getTotalLife();
if (ratio < 0.7 && canUseChip(CHIP_BANDAGE, me)) {
	useChip(CHIP_BANDAGE, me);
}

// 6. Mouvement post-combat (utiliser les PM restants pour kiter)
doPostMove();

// 7. Re-shield si possible
if (canUseChip(CHIP_HELMET, me) && getAbsoluteShield() < 10) {
	useChip(CHIP_HELMET, me);
}
