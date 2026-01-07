// ARK Config Manager - Default Configuration Data
// Extracted from ARKADIA FRANCE server configs

export const defaultServerConfig = {
  // Rates
  XPMultiplier: 2,
  HarvestAmountMultiplier: 5,
  TamingSpeedMultiplier: 8,
  ItemStackSizeMultiplier: 10,
  ResourcesRespawnPeriodMultiplier: 2,
  SupplyCrateLootQualityMultiplier: 1.15,
  FishingLootQualityMultiplier: 1.1,
  
  // Breeding
  EggHatchSpeedMultiplier: 30,
  BabyMatureSpeedMultiplier: 30,
  BabyCuddleIntervalMultiplier: 0.03,
  BabyImprintAmountMultiplier: 1.5,
  BabyFoodConsumptionSpeedMultiplier: 0.4,
  MatingIntervalMultiplier: 0.03,
  
  // Player
  PlayerCharacterFoodDrainMultiplier: 0.25,
  PlayerCharacterWaterDrainMultiplier: 0.25,
  PlayerCharacterStaminaDrainMultiplier: 1,
  PlayerDamageMultiplier: 1,
  PlayerResistanceMultiplier: 1,
  PlayerCharacterHealthRecoveryMultiplier: 1.2,
  
  // Dinos
  DinoDamageMultiplier: 1,
  DinoResistanceMultiplier: 1,
  DinoCharacterHealthRecoveryMultiplier: 1.2,
  DinoCharacterFoodDrainMultiplier: 1,
  DinoCharacterStaminaDrainMultiplier: 1,
  WildDinoTorporDrainMultiplier: 1.2,
  MaxTamedDinos: 25000,
  
  // XP Multipliers
  WildKillXPMultiplier: 1.25,
  TamedKillXPMultiplier: 1,
  AlphaKillXPMultiplier: 1.33,
  CaveKillXPMultiplier: 1.33,
  BossKillXPMultiplier: 5,
  
  // Boss Settings
  BossDamageMultiplier: 1.2,
  BossResistanceMultiplier: 1.15,
  BossDefeatTimeMultiplier: 5,
  
  // Structures
  TheMaxStructuresInRange: 7000,
  StructureResistanceMultiplier: 1,
  PerPlatformMaxStructuresMultiplier: 15,
  PlatformSaddleBuildAreaBoundsMultiplier: 1.5,
  PvEStructureDecayPeriodMultiplier: 2,
  PvEDinoDecayPeriodMultiplier: 4,
  AutoSavePeriodMinutes: 15,
  
  // Difficulty
  DifficultyOffset: 1.0,
  OverrideOfficialDifficulty: 5,
  KickIdlePlayersPeriod: 3600,
  ImplantSuicideCD: 28800,
  
  // Options
  serverPVE: true,
  allowThirdPersonPlayer: true,
  ServerCrosshair: true,
  ShowMapPlayerLocation: true,
  ShowFloatingDamageText: true,
  AllowFlyerCarryPvE: true,
  AllowFlyingStaminaRecovery: false,
  AlwaysAllowStructurePickup: true,
  AllowAnyoneBabyImprintCuddle: true,
  DisableCryopodEnemyCheck: true,
  DisableCryopodFridgeRequirement: true,
  DisableCryoSicknessPVE: false,
  PreventSpawnAnimations: true,
  ForceAllStructureLocking: true,
  NonPermanentDiseases: true,
  PvEAllowStructuresAtSupplyDrops: true,
  AutoDestroyDecayedDinos: true,
  AutoDestroyStructures: true,
  bAllowUnlimitedRespecs: true,
  bUseCorpseLocator: true
};

export const defaultModSettings = {
  // CYBERS STRUCTURES
  CybersStructures: {
    AutoCrafterLimit: 1,
    HatcheryLimit: 2,
    HealingStationLimit: 1,
    PropagatorLimit: 1,
    IntakeLimit: 1,
    MaxToolRange: 10000,
    bEnableAllAutomation: true,
    bAllowStructurePickup: true,
    bEnableSuperCryoSync: true,
    bEnableKSMSync: true,
    bEnableNoiseReduction: true,
    bEnableReducedSize: true,
    bStrictPropagator: true,
    bDisableClaimOtherTribeDinos: true,
    bDisableKillOtherTribeDinos: true,
    // Crafting Speeds
    ForgeCraftingSpeed: 2,
    FabricatorCraftingSpeed: 2,
    ReplicatorCraftingSpeed: 12,
    ChemistryBenchCraftingSpeed: 6,
    IndustrialCookerCraftingSpeed: 12,
    IndustrialGrinderCraftingSpeed: 2,
    // Storage
    DedicatedStorageSlotCount: 18000,
    VaultSlotCount: 600,
    TekStorageSlotCount: 500,
    BookShelfSlotCount: 600,
    FridgeSlotCount: 150,
    CryoFridgeSlotCount: 250,
    // Breeding
    HatcheryIncubationMultiplier: 1,
    HatcheryRangeInFoundations: 25,
    NannyEmbryoIncubationBonus: 0.35,
    NannyMaxImprint: 100,
    NannyRangeInFoundations: 10,
    CloningCostMultiplier: 0.5,
    CloningSpeedMultiplier: 2,
    // Mutator
    MutatorTribeLimit: 2,
    MutatorPulseCooldowns: 240,
    MutatorPulseCost: 1000,
    MutatorAllowBreedingNeutered: true,
    PropagatorAllowSpeedMutation: true,
    PropagatorAllowCrossVariantBreeding: true
  },
  
  // ARKOMATIC
  ARKomatic: {
    AmmunitionCrafterCraftingSpeed: 12,
    AmmunitionCrafterMaxInventorySlots: 400,
    CompositeCrafterCraftingSpeed: 12,
    CompositeCrafterMaxInventorySlots: 400,
    ForgeCraftingSpeed: 2,
    ForgeMaxInventorySlots: 400,
    MultiCookerCraftingSpeed: 48,
    MultiCookerMaxInventorySlots: 500,
    EggCollectorIncubationMultiplier: 1.25,
    EggCollectorMaxInventorySlots: 400,
    EggCollectorMaxRange: 2500,
    MeatSpoilerMaxInventorySlots: 400,
    MeatSpoilerSpoilMultiplier: 20,
    RefrigeratorSpoilMultiplier: 25000,
    RefrigeratorMaxInventorySlots: 400,
    PoopCollectorCraftingSpeed: 1,
    PoopCollectorMaxInventorySlots: 400,
    PoopCollectorMaxRange: 2000,
    TerrariumMaxInventorySlots: 300,
    TerrariumMaxRange: 2500,
    TerrariumSeedItemToGiveInterval: 180,
    VaultMaxInventorySlots: 600,
    EarthquakeCollectorMaxInventorySlots: 400,
    WoodBakerCraftingSpeed: 1
  },
  
  // SHINY DINOS
  Shiny: {
    MaxNumShinies: 15,
    DinoLevelMin: 150,
    DinoLevelMax: 180,
    SpawnIntervalMin: '30m',
    SpawnIntervalMax: '60m',
    DinoLifetimeMin: '6h',
    DinoLifetimeMax: '8h',
    StatBoostChance: 0.1,
    StatBoostStrength: 1.6,
    EnragedLevelMultiplier: 1.0,
    RadioactiveMutationBoost: 3.0,
    TraitGainChance: 0.33,
    TraitUpgradeChance: 0.33,
    SimpleVariantWeightEnraged: 0.1,
    SimpleVariantWeightSpecial: 0.15,
    SubVariantChance: 0.1,
    VariantSwapChanceAberrant: 0.05,
    VariantSwapChanceGenesis: 0.05,
    EnragedRawEssenceRewardAmount: 1,
    TekNumUnlock: 1,
    TekNumUnlockAlpha: 2,
    EssenceChanceSecond: 0.4,
    UnlockTekOnKill: true,
    TamedShowSparkles: true,
    UseEventColors: true,
    UseEventVariants: true,
    PopulateOnLoad: true,
    NoActiveDuplicateDinos: true,
    DisableNotifications: false,
    RequireTracker: false,
    ShiniesUntameable: false,
    CanCarryShinies: true
  },
  
  // ADDITIONAL CHIBIS
  AdditionalChibis: {
    IsChibisCraftable: true,
    DeerBossBaseHealth: 5000,
    DeerBossDamageMultiplier: 3.0,
    DeerBossMinElementToGive: 3,
    DeerBossMaxElementToGive: 5,
    DeerBossGivesElement: true,
    DeerBossGivesVanillaChibis: true,
    MinibossWolfBaseHealth: 25000,
    MinibossWolfDamageMultiplier: 5.0,
    WolfBossMinElementToGive: 8,
    WolfBossMaxElementToGive: 12,
    WolfBossGivesElement: true,
    WolfBossGivesVanillaChibis: true,
    MammothBossBaseHealth: 10000,
    MammothBossDamageMultiplier: 4.0,
    MammothBossMinElementToGive: 5,
    MammothBossMaxElementToGive: 7,
    MammothBossGivesElement: true,
    MammothBossGivesVanillaChibis: true,
    CrocoBossBaseHealth: 100000,
    CrocoBossDamageMultiplier: 4.0,
    CrocoBossMinElementToGive: 10,
    CrocoBossMaxElementToGive: 20,
    CrocoBossGivesElement: true,
    CrocoBossGivesVanillaChibis: true,
    BasiliskBossBaseHealth: 50000,
    BasiliskBossDamageMultiplier: 5.0,
    BasiliskBossMinElementToGive: 10,
    BasiliskBossMaxElementToGive: 15,
    BasiliskBossGivesElement: true,
    BasiliskBossGivesVanillaChibis: true
  },
  
  // ALFA PLATFORM
  AlfaPlatform: {
    AlfaPlatformMaxPerTribe: 4,
    AlfaPlatformHealth: 140000,
    AlfaPlatformAddSupportDistance: 3900,
    AlfaPlatformMaxPerRange: 6,
    AlfaPlatformRangeLimitForFind: 25000,
    AlfaPlatformAdjustDamageDino: 0.2,
    AlfaPlatformAdjustDamagePlayer: 1,
    AlfaPlatformAllowPvPExtraSupportDistance: true,
    AlfaOceanicPlatformMaxPerTribe: 1,
    AlfaOceanicPlatformHealth: 140000,
    AlfaOceanicPlatformAddSupportDistance: 3900,
    AlfaOceanicPlatformMaxPerRange: 6,
    AlfaOceanicPlatformRangeLimitForFind: 25000,
    AlfaOceanicPlatformAdjustDamageDino: 0.2,
    AlfaOceanicPlatformAdjustDamagePlayer: 1,
    AlfaOceanicPlatformAllowPvPExtraSupportDistance: true
  },
  
  // DINOBALLS / DINO STORAGE V2
  Dinoballs: {
    AllowCaptureSleeping: false,
    AllowCaptureUnclaimed: true,
    AllowDeathAutoCapture: false,
    CaptureObeysCryoPreventionBuffs: true,
    CaptureObeysHurtCooldown: true,
    ReleaseChecksDinoOverlap: true,
    ReleaseChecksStructureOverlap: true,
    ReleaseIgnoresTameCap: false,
    AllowMatingCooldownInDinoball: true,
    BabiesAgeInDinoball: true,
    BabiesImprintInDinoBall: true,
    GestationPausesInDinoball: true,
    DinosGainExperienceInDinoball: true,
    ExperienceGainInDinoballMultiplier: 0.5,
    DinoballStackMaxQuantity: 200,
    DinoballBaseWeight: 1,
    EnableDinoballDynamicWeight: false,
    DinoballPersistsBehaviour: true,
    DinoballPersistsBuffs: true,
    DinoballPersistsCuddleFood: true,
    TerminalSlotCount: 500,
    TerminalRequiresPower: true,
    AllowTerminalIncubateFertilizedEggs: true,
    TerminalIncubationMultiplier: 1.0,
    TerminalPoopGeneration: true,
    TerminalFertilizerDistribution: true,
    CreaturePassiveProduceIntervalMultiplier: 1.5,
    MaxStoragesInRangeAmount: 3,
    MaxTerminalsInRangeAmount: 2
  },
  
  // KSM SHOP
  Ksm: {
    GoldcoinInterval: 900,
    Goldcoinsovertime: 125,
    CoinsOnKillChance: 7.5,
    CoinsOnKillCoinMulti: 1.0,
    EnableCoinsOnKill: true,
    PVPGoldcoinGain: false,
    GoldcoinToHexagonRate: 1.0,
    HexagonToGoldcoinRate: 1.0,
    AllowCurrencyExchange: false,
    AddHexagonStoreTradeOptionsToShop: false,
    EnableUpgradeTable: false,
    UpgradeTableAllowSell: true,
    UpgradeTableAllowUpgrade: true,
    UpgradeTableAllowTekItems: true,
    UpgradeTableBaseUpgradeCost: 100,
    UpgradeTableLuckyUpgradeChance: 0.35,
    UpgradeTableUpgradeMulti: 1.10,
    UpgradeTableUpgradeMultiArmor: 1.20,
    UpgradeTableUpgradeMultiWeapon: 1.35,
    WordlBuffCrateQualityUpMultiplierModifier: 1.15,
    WordlBuffResourceUpMultiplierModifier: 0.5,
    WordlBuffWeightReductionMultiplier: 0.5,
    EnableSellStation: false,
    DisableMissions: false,
    PunisheTameMissionCanceling: true,
    SpawnedMissionDinosDontLeaveCorpse: true,
    UseCustomInfoScreen: true,
    UseBigDataForAdmins: true,
    WelcomeHeader: 'Bienvenue sur ARKadia !',
    WelcomeMessage: 'Starter pack dans le shop. Discord obligatoire : DaST8wRrEK',
    DiscordLink: 'https://discord.gg/DaST8wRrEK'
  },
  
  // RESOURCE GATHERERS
  ResourceGatherers: {
    MaxGatherersPerTribe: 0,
    GathererDedicatedStorageRange: 3000,
    GatherersUseDedicatedStorage: true,
    AutoEnableDedicatedStorageSending: false,
    GatherersRequireOnlinePlayer: false,
    GatherersPlayAudio: false,
    // Basic
    StoneEnabled: true, StoneMultiplier: 4.0, StoneMaxItems: 3000,
    ThatchEnabled: true, ThatchMultiplier: 4.0, ThatchMaxItems: 3000,
    WoodEnabled: true, WoodMultiplier: 4.0, WoodMaxItems: 3000,
    FlintEnabled: true, FlintMultiplier: 4.0, FlintMaxItems: 3000,
    FiberEnabled: true, FiberMultiplier: 4.0, FiberMaxItems: 3000,
    // Metals
    MetalEnabled: true, MetalMultiplier: 3.0, MetalMaxItems: 2000,
    MetalIngotEnabled: true, MetalIngotMultiplier: 2.0, MetalIngotMaxItems: 1000,
    CrystalEnabled: true, CrystalMultiplier: 2.0, CrystalMaxItems: 1000,
    ObsidianEnabled: true, ObsidianMultiplier: 2.0, ObsidianMaxItems: 1000,
    SilicaPearlEnabled: true, SilicaPearlMultiplier: 2.0, SilicaPearlMaxItems: 1000,
    BlackPearlEnabled: true, BlackPearlMultiplier: 0.5, BlackPearlMaxItems: 500,
    // Crafting
    CementingPasteEnabled: true, CementingPasteMultiplier: 2.0, CementingPasteMaxItems: 1000,
    ChitinOrKeratinEnabled: true, ChitinOrKeratinMultiplier: 3.0, ChitinOrKeratinMaxItems: 2000,
    PolymerEnabled: true, PolymerMultiplier: 2.0, PolymerMaxItems: 1000,
    OilEnabled: true, OilMultiplier: 2.0, OilMaxItems: 1000,
    GasolineEnabled: true, GasolineMultiplier: 2.0, GasolineMaxItems: 1000,
    HideEnabled: true, HideMultiplier: 4.0, HideMaxItems: 3000,
    // Food
    MeatEnabled: true, MeatMultiplier: 4.0, MeatMaxItems: 3000,
    PrimeMeatEnabled: true, PrimeMeatMultiplier: 3.0, PrimeMeatMaxItems: 100,
    FishMeatEnabled: true, FishMeatMultiplier: 4.0, FishMeatMaxItems: 3000,
    PrimeFishMeatEnabled: true, PrimeFishMeatMultiplier: 3.0, PrimeFishMeatMaxItems: 100,
    SpoiledMeatEnabled: true, SpoiledMeatMultiplier: 3.0, SpoiledMeatMaxItems: 2000,
    MeatBundleEnabled: true, MeatBundleMultiplier: 2.0, MeatBundleMaxItems: 250,
    BerryEnabled: true, BerryMultiplier: 4.0, BerryMaxItems: 3000,
    // Crops
    CitronalEnabled: true, CitronalMultiplier: 3.0, CitronalMaxItems: 2000,
    LongrassEnabled: true, LongrassMultiplier: 3.0, LongrassMaxItems: 2000,
    RockarrotEnabled: true, RockarrotMultiplier: 3.0, RockarrotMaxItems: 2000,
    SavorootEnabled: true, SavorootMultiplier: 3.0, SavorootMaxItems: 2000,
    RareFlowerEnabled: true, RareFlowerMultiplier: 3.0, RareFlowerMaxItems: 2000,
    RareMushroomEnabled: true, RareMushroomMultiplier: 3.0, RareMushroomMaxItems: 2000,
    BiotoxinEnabled: true, BiotoxinMultiplier: 2.0, BiotoxinMaxItems: 1000,
    // Kibble
    BasicKibbleEnabled: true, BasicKibbleMultiplier: 3.0, BasicKibbleMaxItems: 2000,
    SimpleKibbleEnabled: true, SimpleKibbleMultiplier: 3.0, SimpleKibbleMaxItems: 2000,
    RegularKibbleEnabled: true, RegularKibbleMultiplier: 2.0, RegularKibbleMaxItems: 1000,
    SuperiorKibbleEnabled: true, SuperiorKibbleMultiplier: 2.0, SuperiorKibbleMaxItems: 1000
  },
  
  // AWESOME ADMIN TOOLS
  AwesomeAdminTools: {
    AT_ToolRange: 300,
    MaxReplicationCount: 25,
    LT_UpdateDelta: 0.5,
    DisableAATMenuButton: false,
    DisableAdminToolButton: false,
    OL_RadialMenu: true,
    OL_AdminOnly: false,
    AATMenuAdminOnly: false,
    AllowUnreleasedDinos: false,
    PM_AdminOnly: false,
    DM_AdminOnly: false,
    TM_AdminOnly: false,
    WDM_AdminOnly: true,
    TM_AllowTribeOwnerCleanup: true,
    TM_BaseRange: 15000,
    TM_UpdateDelta: 0.025,
    TM_UpdateTimer: 10,
    TM_StatsAdminOnly: true,
    TM_DisableDestroyCode: false,
    PM_TM_NonAdminOnlySelf: true,
    PM_TM_CoordsAdminOnly: true,
    WDM_CoordsAdminOnly: true,
    DC_BotConnectionEnabled: true,
    DC_InviteLink: 'https://discord.gg/DaST8wRrEK',
    DC_ReportWebhook: '',
    AdminLoggingWebhook: '',
    MoreLogging: true
  },
  
  // SUPER SPYGLASS PLUS
  SuperSpyglassPlus: {
    OutlineRange: 8000,
    DisableBuffInfo: false,
    DisableCrosshair: false,
    DisableEggInfo: false,
    DisableGeneTraitInfo: false,
    DisableGPS: false,
    DisableItembagInfo: false,
    DisableNightVision: false,
    DisableOutlineMode: false,
    DisablePredatorVision: false,
    DisableStatCompare: false,
    DisableStructureInfo: false,
    DisableSupplyDropInfo: false,
    DisableTameFoodInfo: false,
    DisableTheSpyglassOnEnemyTribes: false,
    DontShowAnyStatsOnWildDino: false,
    OnlyHPonEnemyTribeDinos: true,
    OnlyShowStatsForTames: false,
    UseESPOutline: false,
    UseESPOutlineFill: false
  },
  
  // CUSTOM LEVEL DISTRIBUTION
  CustomLevelDistrib: {
    WantsCustom: true,
    WantsEqualLevels: true,
    WantsHighLevels: true,
    WantsRagLevels: false,
    PreventBee: true,
    PreventTitan: true,
    MinLevel: 20,
    MaxLevel: 150,
    MinDeinonLevel: 20,
    MaxDeinonLevel: 150,
    MinDrakeLevel: 60,
    MaxDrakeLevel: 190,
    MinMagmaLevel: 80,
    MaxMagmaLevel: 190,
    LowWeight: 0.5,
    MediumWeight: 1.0,
    HighWeight: 0.5,
    TinyWeight: 0.25
  },
  
  // TROJAN
  Trojan: {
    Webhook_ID_Token: '',
    Stop_Breeding_Gender: 0
  }
};

export const activeMods = [
  { id: '928548', name: 'Cybers Structures', icon: '🏗️', description: 'Structures automatisées avancées, cloning, propagator, nanny', enabled: true, tags: ['QoL', 'Automation', 'Building'], section: 'CybersStructures' },
  { id: '928708', name: 'ARKomatic', icon: '⚙️', description: 'Crafters et collecteurs automatiques', enabled: true, tags: ['Automation', 'Farming'], section: 'ARKomatic' },
  { id: '928824', name: 'Additional Chibis', icon: '🎭', description: 'Chibis supplémentaires et mini-boss (Wolf, Mammoth, Croco, Basilisk)', enabled: true, tags: ['Content', 'Boss'], section: 'AdditionalChibis' },
  { id: '929420', name: 'Alfa Platform', icon: '🏝️', description: 'Plateformes géantes terraforming (terrestre + océanique)', enabled: true, tags: ['Building', 'QoL'], section: 'AlfaPlatform' },
  { id: '929506', name: 'Super Spyglass Plus', icon: '🔭', description: 'Spyglass améliorée avec stats, buffs, GPS, night vision', enabled: true, tags: ['QoL', 'Info'], section: 'SuperSpyglassPlus' },
  { id: '929543', name: 'Shiny Dinos', icon: '✨', description: 'Dinos brillants rares avec variants et rewards', enabled: true, tags: ['Content', 'Dinos'], section: 'Shiny' },
  { id: '930170', name: 'Beacon Sentinel', icon: '📡', description: 'Gestion avancée des beacons', enabled: true, tags: ['Management'] },
  { id: '930442', name: 'RR Admin Stuff', icon: '👑', description: 'Outils admin et limiteurs de base', enabled: true, tags: ['Admin', 'Balance'] },
  { id: '931877', name: 'Dino Storage v2', icon: '📦', description: 'Soul balls pour stockage dinos avec terminal', enabled: true, tags: ['QoL', 'Storage'], section: 'Dinoballs' },
  { id: '932221', name: 'Trojan', icon: '🔔', description: 'Webhooks Discord breeding notifications', enabled: true, tags: ['Discord', 'Automation'], section: 'Trojan' },
  { id: '932365', name: 'KSM Shop', icon: '🪙', description: 'Système économique avec goldcoins et shop', enabled: true, tags: ['Economy', 'Shop'], section: 'Ksm' },
  { id: '932943', name: 'Resource Gatherers', icon: '🌾', description: 'Collecteurs de ressources automatiques', enabled: true, tags: ['Automation', 'Farming'], section: 'ResourceGatherers' },
  { id: '933099', name: 'Awesome Admin Tools', icon: '🛠️', description: 'Outils admin avancés avec Discord integration', enabled: true, tags: ['Admin', 'Discord'], section: 'AwesomeAdminTools' },
  { id: '935399', name: 'Custom Level Distribution', icon: '📊', description: 'Distribution des niveaux personnalisée', enabled: true, tags: ['Balance', 'Spawns'], section: 'CustomLevelDistrib' },
  { id: '937184', name: 'Castle Craft', icon: '🏰', description: 'Structures de château médiéval', enabled: true, tags: ['Building', 'Decor'] },
  { id: '939055', name: 'Cliffan Backpacks', icon: '🎒', description: 'Sacs à dos avec réduction de poids', enabled: true, tags: ['QoL', 'Inventory'] },
  { id: '939244', name: 'Imbue Station', icon: '💎', description: 'Station pour améliorer les items', enabled: true, tags: ['Crafting', 'Upgrade'] },
  { id: '939604', name: 'Improved Egg Incubator', icon: '🥚', description: 'Incubateur amélioré', enabled: true, tags: ['Breeding'] },
  { id: '940338', name: 'MoroIndomDuoMod', icon: '🦖', description: 'Moros Raptor et Rex spawns', enabled: true, tags: ['Dinos', 'Content'] },
  { id: '940975', name: 'Nitrado Transfers Fix', icon: '🔄', description: 'Fix pour les transferts Nitrado', enabled: true, tags: ['Fix', 'Transfer'] },
  // ... autres mods de ta liste
];

export const modConfigSections = [
  { section: 'CybersStructures', name: 'Cybers Structures', icon: '🏗️' },
  { section: 'ARKomatic', name: 'ARKomatic', icon: '⚙️' },
  { section: 'Shiny', name: 'Shiny Dinos', icon: '✨' },
  { section: 'AdditionalChibis', name: 'Additional Chibis', icon: '🎭' },
  { section: 'AlfaPlatform', name: 'Alfa Platform', icon: '🏝️' },
  { section: 'Dinoballs', name: 'Dino Storage v2', icon: '📦' },
  { section: 'Ksm', name: 'KSM Shop', icon: '🪙' },
  { section: 'ResourceGatherers', name: 'Resource Gatherers', icon: '🌾' },
  { section: 'AwesomeAdminTools', name: 'Admin Tools', icon: '🛠️' },
  { section: 'SuperSpyglassPlus', name: 'Super Spyglass', icon: '🔭' },
  { section: 'CustomLevelDistrib', name: 'Level Distribution', icon: '📊' },
  { section: 'Trojan', name: 'Trojan', icon: '🔔' }
];

export const presets = [
  { 
    id: 'vanilla', 
    name: 'Vanilla', 
    icon: '🍦', 
    description: 'Rates officiels, aucune modification',
    rates: { xp: 1, harvest: 1, taming: 1, breed: 1 }
  },
  { 
    id: 'boosted5', 
    name: 'Boosted x5', 
    icon: '🚀', 
    description: 'Rates x5 équilibrés pour PvE casual',
    rates: { xp: 5, harvest: 5, taming: 5, breed: 10 }
  },
  { 
    id: 'arkadia', 
    name: 'ARKADIA', 
    icon: '🦖', 
    description: 'Configuration officielle ARKADIA FRANCE',
    rates: { xp: 2, harvest: 5, taming: 8, breed: 30 }
  },
  { 
    id: 'breeding', 
    name: 'Breeding Focus', 
    icon: '🥚', 
    description: 'Optimisé pour l\'élevage intensif',
    rates: { xp: 2, harvest: 3, taming: 10, breed: 50 }
  },
  { 
    id: 'pvp', 
    name: 'PvP Hardcore', 
    icon: '⚔️', 
    description: 'Rates réduits, difficulté maximum',
    rates: { xp: 1.5, harvest: 2, taming: 3, breed: 5 }
  },
  { 
    id: 'speedrun', 
    name: 'Speedrun', 
    icon: '⏱️', 
    description: 'Rates extrêmes pour tests rapides',
    rates: { xp: 10, harvest: 10, taming: 20, breed: 100 }
  }
];

export const stackOverrides = [
  // Ammo
  { class: 'PrimalItemAmmo_AdvancedRifleBullet_C', name: 'Advanced Rifle Bullet', icon: '🔫', quantity: 500, category: 'ammo' },
  { class: 'PrimalItemAmmo_AdvancedSniperBullet_C', name: 'Advanced Sniper Bullet', icon: '🎯', quantity: 250, category: 'ammo' },
  { class: 'PrimalItemAmmo_ArrowFlame_C', name: 'Flame Arrow', icon: '🔥', quantity: 200, category: 'ammo' },
  { class: 'PrimalItemAmmo_ArrowStone_C', name: 'Stone Arrow', icon: '🏹', quantity: 500, category: 'ammo' },
  { class: 'PrimalItemAmmo_ArrowTranq_C', name: 'Tranq Arrow', icon: '💉', quantity: 500, category: 'ammo' },
  { class: 'PrimalItemAmmo_RefinedTranqDart_C', name: 'Shocking Tranq Dart', icon: '⚡', quantity: 250, category: 'ammo' },
  { class: 'PrimalItemAmmo_TranqDart_C', name: 'Tranq Dart', icon: '💊', quantity: 250, category: 'ammo' },
  { class: 'PrimalItemAmmo_SimpleBullet_C', name: 'Simple Bullet', icon: '🔫', quantity: 500, category: 'ammo' },
  { class: 'PrimalItemAmmo_SimpleRifleBullet_C', name: 'Simple Rifle Bullet', icon: '🔫', quantity: 500, category: 'ammo' },
  { class: 'PrimalItemAmmo_SimpleShotgunBullet_C', name: 'Simple Shotgun', icon: '🔫', quantity: 250, category: 'ammo' },
  { class: 'PrimalItemAmmo_Rocket_C', name: 'Rocket', icon: '🚀', quantity: 50, category: 'ammo' },
  { class: 'PrimalItemAmmo_RocketHomingMissile_C', name: 'Homing Missile', icon: '🎯', quantity: 50, category: 'ammo' },
  { class: 'PrimalItemAmmo_RocketPod_C', name: 'Rocket Pod', icon: '🚀', quantity: 100, category: 'ammo' },
  { class: 'PrimalItemC4Ammo_C', name: 'C4 Charge', icon: '💣', quantity: 50, category: 'ammo' },
  // Food
  { class: 'PrimalItemConsumable_CookedMeat_C', name: 'Cooked Meat', icon: '🍖', quantity: 5000, category: 'food' },
  { class: 'PrimalItemConsumable_CookedMeat_Fish_C', name: 'Cooked Fish', icon: '🐟', quantity: 5000, category: 'food' },
  { class: 'PrimalItemConsumable_CookedLambChop_C', name: 'Cooked Lamb Chop', icon: '🥩', quantity: 250, category: 'food' },
  { class: 'PrimalItemConsumable_CookedPrimeMeat_Jerky_C', name: 'Prime Meat Jerky', icon: '🥓', quantity: 200, category: 'food' },
  // Consumables
  { class: 'PrimalItemConsumable_Berry_Narcoberry_C', name: 'Narcoberry', icon: '🫐', quantity: 2500, category: 'consumable' },
  { class: 'PrimalItemConsumable_Berry_Stimberry_C', name: 'Stimberry', icon: '🍇', quantity: 2500, category: 'consumable' },
  { class: 'PrimalItemConsumable_Berry_Amarberry_C', name: 'Amarberry', icon: '🫐', quantity: 5000, category: 'consumable' },
  { class: 'PrimalItemConsumable_Berry_Azulberry_C', name: 'Azulberry', icon: '🫐', quantity: 5000, category: 'consumable' },
  { class: 'PrimalItemConsumable_Berry_Mejoberry_C', name: 'Mejoberry', icon: '🫐', quantity: 5000, category: 'consumable' }
];
