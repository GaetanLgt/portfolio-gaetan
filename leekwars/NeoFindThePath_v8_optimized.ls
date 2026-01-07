/********************************************************
          NeoFindThePath v8 OPTIMIZED
          -- I Know Kung Fu --
          
   Version optimisée pour éviter les plantages
   Compatible avec les builds haut niveau (300+)
   
   Changelog v8:
   - Suppression arrayFilter (trop coûteux)
   - Suppression getCellsToUseChipOnCell (trop coûteux) 
   - Simplification du pathfinding
   - Conservation de toutes les fonctionnalités
   - < 50k opérations par tour garanti
************************************************************/

// ============ GLOBALS ============
global enemy = null;
global moi = getEntity();
global mode = "def";
global shoot = 0;
global stopDep = false;

// ============ INIT ============
if (getTurn() == 1) {
    say("Salut ! et Bonne chance !");
    if (getWeapon() == null) {
        setWeapon(WEAPON_FLAME_THROWER);
        say("Hey ! tu ne le sais pas ?");
        say("Tu es déjà mort ...");
    }
}

// ============ UTILS ============
function alive(e) { return e != null && isAlive(e); }

function distTo(e) {
    if (!alive(e)) return 9999;
    return getCellDistance(getCell(), getCell(e));
}

function pathTo(e) {
    if (!alive(e)) return 9999;
    var p = getPathLength(getCell(), getCell(e));
    return p != null ? p : 9999;
}

function hasLOS(e) {
    if (!alive(e)) return false;
    return lineOfSight(getCell(), getCell(e));
}

function hasEffect(effect, leek) {
    var effects = getEffects(leek);
    for (var i in effects) {
        if (i[0] == effect) return true;
    }
    return false;
}

// ============ TARGETING ============
function cherche() {
    var enemies = getAliveEnemies();
    var best = null;
    var bestDist = 9999;
    
    for (var e in enemies) {
        if (isSummon(e)) continue;
        var d = distTo(e);
        if (d < bestDist) {
            best = e;
            bestDist = d;
        }
    }
    
    if (best == null) best = getNearestEnemy();
    enemy = best;
}

// ============ HEALING ============
function vie() {
    debug("=== SOINS ===");
    var ratio = getLife() / getTotalLife();
    
    // Antidote si empoisonné
    if (hasEffect(EFFECT_POISON, moi)) {
        if (canUseChip(CHIP_ANTIDOTE, moi)) useChip(CHIP_ANTIDOTE, moi);
    }
    
    // Heal par priorité (du plus fort au plus faible)
    if (ratio < 0.9 && canUseChip(CHIP_REGENERATION, moi)) {
        useChip(CHIP_REGENERATION, moi);
    }
    if (ratio < 0.85 && canUseChip(CHIP_REMISSION, moi)) {
        useChip(CHIP_REMISSION, moi);
    }
    if (ratio < 0.95 && canUseChip(CHIP_ARMORING, moi)) {
        useChip(CHIP_ARMORING, moi);
    }
    if (ratio < 0.8 && canUseChip(CHIP_VACCINE, moi)) {
        useChip(CHIP_VACCINE, moi);
    }
    if (ratio < 0.85 && canUseChip(CHIP_CURE, moi)) {
        useChip(CHIP_CURE, moi);
    }
    if (ratio < 0.9 && canUseChip(CHIP_BANDAGE, moi)) {
        useChip(CHIP_BANDAGE, moi);
    }
    
    debug("Vie: " + getLife() + "/" + getTotalLife());
}

// ============ ARMOR ============
function armure() {
    debug("=== ARMURE ===");
    
    // Boucliers par priorité
    if (canUseChip(CHIP_ARMOR, moi)) useChip(CHIP_ARMOR, moi);
    if (canUseChip(CHIP_SHIELD, moi)) useChip(CHIP_SHIELD, moi);
    if (canUseChip(CHIP_WALL, moi)) useChip(CHIP_WALL, moi);
    if (canUseChip(CHIP_HELMET, moi)) useChip(CHIP_HELMET, moi);
    
    debug("Shield Abs: " + getAbsoluteShield() + " | Rel: " + getRelativeShield());
}

// ============ WEAPON SELECTION ============
function verif() {
    if (!alive(enemy)) return;
    
    var d = distTo(enemy);
    debug("=== VERIF ARME === dist=" + d);
    
    // Lance-flammes: priorité si en ligne et à portée
    if (isOnSameLine(getCell(), getCell(enemy)) && d <= 8 && d >= 1) {
        if (getWeapon() != WEAPON_FLAME_THROWER && canUseWeapon(WEAPON_FLAME_THROWER, enemy)) {
            if (getTP() >= getWeaponCost(WEAPON_FLAME_THROWER) + 1) {
                setWeapon(WEAPON_FLAME_THROWER);
                return;
            }
        }
    }
    
    // Double Gun: backup
    if (d <= 7 && d >= 1 && hasLOS(enemy)) {
        if (getWeapon() != WEAPON_DOUBLE_GUN && canUseWeapon(WEAPON_DOUBLE_GUN, enemy)) {
            if (getTP() >= getWeaponCost(WEAPON_DOUBLE_GUN) + 1) {
                setWeapon(WEAPON_DOUBLE_GUN);
                return;
            }
        }
    }
}

// ============ PUNISHMENT (FINISHER) ============
function chatiment() {
    if (!alive(enemy)) return;
    if (isSummon(enemy)) return;
    
    var myLife = getLife();
    var totalLife = getTotalLife();
    
    // Seulement si on a assez de vie
    if (myLife < totalLife * 0.68) return;
    
    // Calcul des dégâts potentiels
    var degats = (myLife * 0.33) * (1 + getStrength() / 100);
    var enemyShield = getAbsoluteShield(enemy);
    var enemyRelShield = getRelativeShield(enemy);
    var effectiveDamage = degats * (1 - enemyRelShield) - enemyShield;
    
    // Finisher si ça tue
    if (getLife(enemy) <= effectiveDamage) {
        if (pathTo(enemy) <= getMP() && canUseChip(CHIP_PUNISHMENT, enemy)) {
            moveToward(enemy, getMP());
            if (canUseChip(CHIP_PUNISHMENT, enemy)) {
                useChip(CHIP_PUNISHMENT, enemy);
                say("Surprise Mother fuc*er !");
                shoot++;
            }
        }
    }
}

// ============ ATTACK ============
function att() {
    cherche();
    if (!alive(enemy)) return;
    
    debug("=== ATTACK ===");
    var lifeEnemyBefore = getLife(enemy);
    
    // Châtiment d'abord (finisher)
    chatiment();
    if (!alive(enemy)) { cherche(); return; }
    
    // Poison si loin (TOXIN: range 2-9)
    if (distTo(enemy) > 2 && canUseChip(CHIP_TOXIN, enemy)) {
        useChip(CHIP_TOXIN, enemy);
        shoot++;
    }
    if (!alive(enemy)) { cherche(); return; }
    
    // Poison VENOM
    if (canUseChip(CHIP_VENOM, enemy)) {
        useChip(CHIP_VENOM, enemy);
        shoot++;
    }
    if (!alive(enemy)) { cherche(); return; }
    
    // Attaque arme principale
    verif();
    var weaponShots = 0;
    while (weaponShots < 10 && alive(enemy) && canUseWeapon(enemy)) {
        useWeapon(enemy);
        shoot++;
        weaponShots++;
        verif();
        if (!alive(enemy)) { cherche(); break; }
    }
    
    // Re-poison si PT restants
    if (alive(enemy) && canUseChip(CHIP_TOXIN, enemy)) {
        useChip(CHIP_TOXIN, enemy);
        shoot++;
    }
    if (alive(enemy) && canUseChip(CHIP_VENOM, enemy)) {
        useChip(CHIP_VENOM, enemy);
        shoot++;
    }
    
    // Châtiment final
    chatiment();
    
    debug("Shots: " + shoot + " | Enemy HP: " + lifeEnemyBefore + " -> " + getLife(enemy));
}

// ============ MOVEMENT ============
function dep() {
    debug("=== MOVE === MP=" + getMP());
    if (getMP() <= 0) return;
    if (!alive(enemy)) return;
    
    var d = distTo(enemy);
    
    // Si trop proche, reculer
    if (d <= 1 && getMP() > 0) {
        moveAwayFrom(enemy, min(getMP(), 2));
        return;
    }
    
    // Si hors de portée, approcher
    var weaponRange = 8; // Lance-flammes
    if (d > weaponRange || !hasLOS(enemy)) {
        var steps = min(getMP(), 4);
        for (var i = 0; i < steps; i++) {
            moveToward(enemy, 1);
            verif();
            if (canUseWeapon(enemy)) {
                att();
                break;
            }
        }
    }
}

// ============ HIDE ============
function seCacher() {
    if (getMP() <= 1) return;
    if (!alive(enemy)) return;
    if (shoot == 0) return;
    
    debug("=== HIDE ===");
    
    // Simple: s'éloigner si l'ennemi peut nous toucher
    var enemyWeapon = getWeapon(enemy);
    if (enemyWeapon == null) return;
    
    var enemyRange = getWeaponMaxRange(enemyWeapon);
    var d = distTo(enemy);
    
    // Si dans sa portée, essayer de sortir
    if (d <= enemyRange && hasLOS(enemy)) {
        moveAwayFrom(enemy, getMP());
        debug("Reculé de " + getMP() + " cases");
    }
}

// ============ MAIN ============
mode = "def";
stopDep = false;
shoot = 0;

// Déterminer le mode
cherche();
if (alive(enemy)) {
    var pvMoi = getLife();
    var pvAdv = getLife(enemy);
    if (pvMoi > pvAdv * 2) {
        mode = "att";
        debug("Mode ATTAQUE - Avantage!");
    }
}
debug("Mode: " + mode);

// Exécution selon le mode
if (mode == "def") {
    cherche();
    vie();
    armure();
    verif();
    att();
    dep();
} else {
    cherche();
    verif();
    att();
    dep();
    vie();
    armure();
}

// Finir par se cacher
seCacher();

// Message de victoire
if (alive(enemy) == false || getLife(enemy) == 0) {
    say("Je te l'avais dit ! --- Merci pour le combat ;)");
}
