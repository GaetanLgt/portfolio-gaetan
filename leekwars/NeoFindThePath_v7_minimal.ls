/**************** NeoFindThePath — LS v7 ULTRA MINIMAL ****************/
/*
 * Version anti-plantage: ZERO boucle complexe
 * Opérations garanties < 10k par tour
 */

// === MAIN ===

// Équiper pistolet
if (getWeapon() == null) setWeapon(WEAPON_PISTOL);

// Trouver ennemi
var enemy = getNearestEnemy();

// === DEFENSE ===
var vie = getLife() / getTotalLife();

// Shield
if (vie > 0.3 && canUseChip(CHIP_HELMET, getEntity())) {
	useChip(CHIP_HELMET, getEntity());
}

// Heal
if (vie < 0.7) {
	if (canUseChip(CHIP_CURE, getEntity())) useChip(CHIP_CURE, getEntity());
	if (canUseChip(CHIP_BANDAGE, getEntity())) useChip(CHIP_BANDAGE, getEntity());
}

// === MOVE (approcher si loin) ===
if (enemy != null && isAlive(enemy)) {
	var dist = getCellDistance(getCell(), getCell(enemy));
	
	if (dist > 6) {
		moveToward(enemy, getMP());
	}
}

// === ATTACK ===
if (enemy != null && isAlive(enemy)) {
	// SPARK x4 max
	if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
	if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
	if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
	if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
	
	// ICE
	if (canUseChip(CHIP_ICE, enemy)) useChip(CHIP_ICE, enemy);
	
	// Pistolet x3 max
	if (canUseWeapon(enemy)) useWeapon(enemy);
	if (canUseWeapon(enemy)) useWeapon(enemy);
	if (canUseWeapon(enemy)) useWeapon(enemy);
}

// === POST MOVE (reculer si proche) ===
if (enemy != null && isAlive(enemy)) {
	var dist = getCellDistance(getCell(), getCell(enemy));
	
	if (dist <= 3 && getMP() > 0) {
		moveAwayFrom(enemy, getMP());
	}
}
