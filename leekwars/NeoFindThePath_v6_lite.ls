/**************** NeoFindThePath — LS v6 LITE ****************/
/*
 * Changelog v6:
 * - ULTRA-LÉGER: Suppression de arrayFilter et getCellsToUseWeapon
 * - Fix: Utilise le PISTOLET (pas juste les puces)
 * - Fix: Suppression référence au Machine Gun non équipé
 * - Optimisation: Moins de 50k opérations par tour garanti
 */

// ------- Globals -------
global enemy = null;
global me = getEntity();

// ------- Utils simples (pas de lambda!) -------
function alive(e) { return e != null && isAlive(e); }

function distTo(e) { 
	if (e == null) return 9999;
	var c = getCell(e);
	if (c == null) return 9999;
	return getCellDistance(getCell(), c);
}

function canShoot(e) {
	if (!alive(e)) return false;
	if (getWeapon() == null) return false;
	var d = distTo(e);
	return d <= getWeaponMaxRange(getWeapon()) 
		&& d >= getWeaponMinRange(getWeapon())
		&& lineOfSight(getCell(), getCell(e))
		&& getTP() >= getWeaponCost(getWeapon());
}

// ------- Targeting (simplifié) -------
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

// ------- Heal (simplifié) -------
function doHeal() {
	var ratio = getLife() / getTotalLife();
	
	// Critique: heal max
	if (ratio < 0.4) {
		if (canUseChip(CHIP_CURE, me)) useChip(CHIP_CURE, me);
		if (canUseChip(CHIP_BANDAGE, me)) useChip(CHIP_BANDAGE, me);
	}
	// Moyen: heal léger
	else if (ratio < 0.6) {
		if (canUseChip(CHIP_BANDAGE, me)) useChip(CHIP_BANDAGE, me);
	}
	
	// Shield si dispo
	if (canUseChip(CHIP_HELMET, me) && getAbsoluteShield() < 10) {
		useChip(CHIP_HELMET, me);
	}
}

// ------- Attack -------
function doAttack() {
	if (!alive(enemy)) return;
	
	// 1. S'assurer d'avoir le pistolet équipé
	if (getWeapon() != WEAPON_PISTOL) {
		setWeapon(WEAPON_PISTOL);
	}
	
	// 2. Tirer au pistolet tant que possible (PRIORITÉ!)
	while (canShoot(enemy)) {
		useWeapon(enemy);
		if (!alive(enemy)) {
			enemy = findEnemy();
			if (!alive(enemy)) return;
		}
	}
	
	// 3. Utiliser SPARK si PT restants et à portée
	var d = distTo(enemy);
	while (d <= 6 && canUseChip(CHIP_SPARK, enemy)) {
		useChip(CHIP_SPARK, enemy);
		if (!alive(enemy)) {
			enemy = findEnemy();
			if (!alive(enemy)) return;
		}
		d = distTo(enemy);
	}
	
	// 4. ICE pour ralentir si dispo
	if (canUseChip(CHIP_ICE, enemy)) {
		useChip(CHIP_ICE, enemy);
	}
}

// ------- Movement (simplifié) -------
function doMove() {
	if (!alive(enemy)) return;
	if (getMP() <= 0) return;
	
	var d = distTo(enemy);
	var weaponRange = 7; // Pistolet
	
	// Trop loin → approcher
	if (d > weaponRange) {
		moveToward(enemy, getMP());
	}
	// À bonne distance → ne pas bouger ou reculer si trop proche
	else if (d <= 2) {
		moveAwayFrom(enemy, min(getMP(), 2));
	}
	// Sinon, utiliser les PM pour s'éloigner après avoir tiré
	else if (getMP() > 0 && d <= 4) {
		moveAwayFrom(enemy, 1);
	}
}

// ------- MAIN -------

// Init
if (getWeapon() == null) setWeapon(WEAPON_PISTOL);

// 1. Trouver l'ennemi
enemy = findEnemy();

// 2. Approcher si hors de portée (AVANT heal pour économiser des ops)
if (alive(enemy)) {
	var d = distTo(enemy);
	if (d > 7 && getMP() > 0) {
		moveToward(enemy, getMP());
	}
}

// 3. Se soigner/protéger
doHeal();

// 4. Attaquer (PISTOLET prioritaire!)
doAttack();

// 5. Mouvement final
doMove();
