/**************** NeoFindThePath — LS v5, optimized ****************/
/*
 * Changelog v5:
 * - Fix: Approche agressive si hors de portée (plus de 11 tours sans tir!)
 * - Ajout: Gestion CHIP_SPARK pour dégâts supplémentaires
 * - Ajout: Priorisation des ennemis low HP (finisher)
 * - Amélioration: Meilleur timing des heals
 * - Amélioration: Utilisation PM après tirs si non utilisés
 */

// ------- Globals -------
global enemy = null;
global me = getEntity();
global mode = "def";
global shoot = 0;
global stopDep = false;
global myWeapon = (getWeapon() != null) ? getWeapon() : WEAPON_PISTOL;

// Seuils de soin adaptatifs
global LIFE_HEAL_SOFT = 0.65;  // +5% pour heal plus tôt
global LIFE_HEAL_HARD = 0.45;  // +5% pour heal plus tôt

// ------- Safe utils -------
function safeCell(e) { return (e != null) ? getCell(e) : null; }
function distTo(e) { var c = safeCell(e); return (c != null) ? getPathLength(getCell(), c) : 9999; }
function distDirect(e) { var c = safeCell(e); return (c != null) ? getCellDistance(getCell(), c) : 9999; }
function losTo(e) { var c = safeCell(e); return (c != null) && lineOfSight(getCell(), c); }
function alive(e) { return e != null && isAlive(e); }

function inRangeWeapon(e) {
	if (getWeapon() == null || !alive(e)) return false;
	var d = distDirect(e);  // Distance directe, pas path
	return losTo(e) && d <= getWeaponMaxRange(getWeapon()) && d >= getWeaponMinRange(getWeapon()) && canUseWeapon(e);
}

function inRangeChip(chip, e) {
	if (!alive(e)) return false;
	var d = distDirect(e);
	return d <= getChipMaxRange(chip) && d >= getChipMinRange(chip) && canUseChip(chip, e);
}

function setWeaponSafe(w) {
	if (getWeapon() != w && getTP() >= 1) setWeapon(w);
}

// ------- Targeting -------
function refreshEnemy() {
	var E = getEnemies();
	var best = null;
	var bestScore = -1e9;
	
	for (var e in E) {
		if (!alive(e)) continue;
		if (isSummon(e)) continue;
		
		var d = distTo(e);
		var hp = getLife(e);
		var totalHp = getTotalLife(e);
		var hpRatio = hp / totalHp;
		
		// Score: prioriser les low HP proches (finisher)
		var score = 1000 - d * 10;  // Distance compte
		
		// BONUS: Ennemi qu'on peut tuer ce tour
		var myDamage = 20 * 4;  // ~4 tirs pistolet
		if (hp <= myDamage) score += 500;
		
		// BONUS: Ennemi low HP
		if (hpRatio < 0.3) score += 300;
		else if (hpRatio < 0.5) score += 150;
		
		// BONUS: En ligne de vue
		if (losTo(e)) score += 100;
		
		if (score > bestScore) { 
			best = e; 
			bestScore = score; 
		}
	}
	
	if (best == null) best = getNearestEnemy();
	enemy = best;
}

// ------- Defense / Heal -------
function healSmart() {
	var r = getLife() / getTotalLife();
	
	// Heal intensif si critique
	if (r < LIFE_HEAL_HARD) {
		if (canUseChip(CHIP_CURE, me)) useChip(CHIP_CURE, me);
		if (canUseChip(CHIP_BANDAGE, me)) useChip(CHIP_BANDAGE, me);
	} 
	// Heal léger si moyen
	else if (r < LIFE_HEAL_SOFT) {
		if (canUseChip(CHIP_BANDAGE, me)) useChip(CHIP_BANDAGE, me);
	}
	
	// Armure: poser si pas de shield et qu'on a des PT
	var shieldValue = getAbsoluteShield();
	var shieldThreshold = 15 * (1 + getResistance() / 100);
	if (canUseChip(CHIP_HELMET, me) && shieldValue < shieldThreshold) {
		useChip(CHIP_HELMET, me);
	}
}

// ------- Control -------
function tryIce(e) {
	if (inRangeChip(CHIP_ICE, e) && canUseChip(CHIP_ICE, e)) {
		useChip(CHIP_ICE, e);
		shoot += 1;
		return true;
	}
	return false;
}

// ------- Damage Chips -------
function tryDamageChips(e) {
	// CHIP_SPARK si disponible (dégâts bonus)
	while (inRangeChip(CHIP_SPARK, e) && canUseChip(CHIP_SPARK, e)) {
		useChip(CHIP_SPARK, e);
		shoot += 1;
		if (!alive(e)) { refreshEnemy(); if (!alive(enemy)) return; e = enemy; }
	}
	
	// CHIP_ROCK si disponible
	while (inRangeChip(CHIP_ROCK, e) && canUseChip(CHIP_ROCK, e)) {
		useChip(CHIP_ROCK, e);
		shoot += 1;
		if (!alive(e)) { refreshEnemy(); if (!alive(enemy)) return; e = enemy; }
	}
}

// ------- Weapon choice -------
function pickWeaponSmart(e) {
	if (!alive(e)) return;
	
	var d = distDirect(e);
	
	// Shotgun: seulement si très proche ET safe
	if (d <= getWeaponMaxRange(WEAPON_SHOTGUN) && losTo(e)) {
		var theirShotCells = getCellsToUseWeapon(WEAPON_SHOTGUN, me);
		var myCell = getCell();
		// Si l'ennemi ne peut pas nous shotgun depuis notre position
		if (search(theirShotCells, myCell) == null) { 
			setWeaponSafe(WEAPON_SHOTGUN); 
			return; 
		}
	}
	
	// Machine Gun si disponible et à portée (DPS > Pistol)
	if (d <= getWeaponMaxRange(WEAPON_MACHINE_GUN) && d >= getWeaponMinRange(WEAPON_MACHINE_GUN) && losTo(e)) {
		// Vérifier si on a le machine gun
		var weapons = getWeapons();
		if (search(weapons, WEAPON_MACHINE_GUN) != null) {
			setWeaponSafe(WEAPON_MACHINE_GUN);
			return;
		}
	}
	
	// Default: Pistol (fiable, bonne portée)
	setWeaponSafe(WEAPON_PISTOL);
}

// ------- Positioning -------
function bestKiteCell(target) {
	if (!alive(target)) return null;
	
	var meCell = getCell();
	var pistol = WEAPON_PISTOL;
	var enemyGun = (getWeapon(target) != null) ? getWeapon(target) : WEAPON_SHOTGUN;
	
	var mySpots = getCellsToUseWeapon(pistol, target);      // d'où JE peux tirer
	var badSpots = getCellsToUseWeapon(enemyGun, me);       // d'où IL peut me tirer
	
	// Filtrer: accessibles avec mes PM
	var acc = arrayFilter(mySpots, function(c) {
		return getPathLength(meCell, c) <= getMP() && lineOfSight(c, getCell(target));
	});
	
	// Prioriser: positions safe (hors de sa portée)
	var safe = arrayFilter(acc, function(c) { return search(badSpots, c) == null; });
	
	if (count(safe) > 0) return safe[floor((count(safe) - 1) / 2)];
	if (count(acc) > 0) return acc[floor((count(acc) - 1) / 2)];
	return null;
}

function hideIfPossible() {
	if (getMP() <= 0 || stopDep || !alive(enemy)) return;
	
	var myCell = getCell();
	var cells = getCellsToUseChipOnCell(CHIP_SPARK, myCell);
	var acc = arrayFilter(cells, function(c) { return getPathLength(myCell, c) <= getMP(); });
	
	var spots = [];
	for (var c in acc) {
		if (!lineOfSight(c, safeCell(enemy))) spots << c;
	}
	
	if (count(spots) > 0) { 
		moveTowardCell(spots[floor((count(spots) - 1) / 2)]); 
		stopDep = true; 
	}
}

function moveSmart() {
	if (!alive(enemy) || getMP() <= 0) return;
	
	var d = distDirect(enemy);
	var weaponRange = (getWeapon() != null) ? getWeaponMaxRange(getWeapon()) : 7;
	
	// ⚡ NOUVEAU: Si hors de portée → approcher agressivement
	if (d > weaponRange || !losTo(enemy)) {
		moveToward(enemy, getMP());
		return;
	}
	
	// Si à portée, tenter le kiting
	var spot = bestKiteCell(enemy);
	if (spot != null) {
		moveTowardCell(spot);
	} else {
		// Trop proche → reculer
		if (d <= 2) {
			moveAwayFrom(enemy, getMP());
		}
	}
}

// ------- Approach Phase (NEW) -------
function approachIfNeeded() {
	if (!alive(enemy) || getMP() <= 0) return false;
	
	var d = distDirect(enemy);
	var weaponRange = (getWeapon() != null) ? getWeaponMaxRange(getWeapon()) : 7;
	
	// Si hors de portée de tir → approcher d'abord
	if (d > weaponRange || !losTo(enemy)) {
		// Calculer combien de PM pour être à portée
		var needed = d - weaponRange + 1;
		if (needed > 0) {
			moveToward(enemy, min(getMP(), needed + 1));
			return true;
		}
	}
	return false;
}

// ------- Attack turn -------
function attackTurn() {
	refreshEnemy();
	if (!alive(enemy)) return;

	// Choix d'arme optimal
	pickWeaponSmart(enemy);

	// Contrôle d'abord (ralentir l'ennemi)
	tryIce(enemy);

	// Puces de dégâts
	tryDamageChips(enemy);

	// Tir arme principal
	while (getTP() >= getWeaponCost(getWeapon()) && inRangeWeapon(enemy)) {
		useWeapon(enemy);
		shoot += 1;
		if (!alive(enemy)) { 
			refreshEnemy(); 
			if (!alive(enemy)) break; 
		}
	}

	// Re-contrôle si cooldown OK
	tryIce(enemy);
}

// ------- MAIN -------

// Init arme
if (getWeapon() == null) { 
	setWeapon(WEAPON_PISTOL); 
	myWeapon = WEAPON_PISTOL; 
}

// Reset état
mode = "def"; 
stopDep = false; 
shoot = 0;

// 1. Identifier la cible
refreshEnemy();

// 2. ⚡ NOUVEAU: Approcher si hors de portée (fix des 11 tours sans tir!)
var approached = approachIfNeeded();

// 3. Se soigner/protéger
healSmart();

// 4. Attaquer
attackTurn();

// 5. Repositionnement post-combat
if (!approached) {
	moveSmart();
}

// 6. Se cacher si on a tiré et qu'il reste des PM
if (shoot > 0) {
	hideIfPossible();
}

// 7. Utiliser les PM restants intelligemment
if (getMP() > 0 && alive(enemy)) {
	// Si on n'a pas tiré ce tour, approcher pour le prochain
	if (shoot == 0) {
		moveToward(enemy, getMP());
	}
	// Sinon, s'éloigner pour éviter les dégâts
	else if (distDirect(enemy) <= 3) {
		moveAwayFrom(enemy, getMP());
	}
}
