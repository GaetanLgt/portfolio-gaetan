<template>
  <div class="ark-config-manager">
    <!-- HEADER -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <router-link to="/apps" class="back-btn">← Apps</router-link>
          <div class="app-branding">
            <span class="app-logo">🦖</span>
            <div class="app-info">
              <h1>ARK Config Manager</h1>
              <span class="app-subtitle">ARKADIA FRANCE • Configuration INI & Mods</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="server-status" :class="serverStatus">
            <span class="status-dot"></span>
            <span class="status-text">{{ serverStatusText }}</span>
          </div>
          <button class="btn-primary" @click="exportConfig">📥 Exporter</button>
          <button class="btn-secondary" @click="showImportModal = true">📤 Importer</button>
        </div>
      </div>
      <nav class="header-tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
        </button>
      </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- SERVER SETTINGS -->
      <section v-if="activeTab === 'server'" class="config-section">
        <div class="section-header">
          <h2>⚙️ Server Settings</h2>
          <p>Configuration principale du serveur ARKADIA FRANCE</p>
        </div>
        <div class="config-grid">
          <!-- Rates -->
          <div class="config-card">
            <h3>📈 Multiplicateurs</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in rateConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                  <span class="value-display">x{{ config[c.key] }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Breeding -->
          <div class="config-card">
            <h3>🥚 Breeding</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in breedingConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                  <span class="value-display">x{{ config[c.key] }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Player -->
          <div class="config-card">
            <h3>👤 Player</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in playerConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                  <span class="value-display">x{{ config[c.key] }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Dinos -->
          <div class="config-card">
            <h3>🦕 Dinos</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in dinoConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input v-if="c.type === 'number'" type="number" v-model.number="config[c.key]" :min="c.min" :max="c.max">
                  <template v-else>
                    <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                    <span class="value-display">x{{ config[c.key] }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- Structures -->
          <div class="config-card">
            <h3>🏗️ Structures</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in structureConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input v-if="c.type === 'number'" type="number" v-model.number="config[c.key]" :min="c.min" :max="c.max">
                  <template v-else>
                    <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                    <span class="value-display">x{{ config[c.key] }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- XP -->
          <div class="config-card">
            <h3>⭐ XP Multipliers</h3>
            <div class="config-group">
              <div class="config-item" v-for="c in xpConfigs" :key="c.key">
                <label>{{ c.label }}</label>
                <div class="input-with-value">
                  <input type="range" v-model.number="config[c.key]" :min="c.min" :max="c.max" :step="c.step">
                  <span class="value-display">x{{ config[c.key] }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Options -->
          <div class="config-card full-width">
            <h3>🎮 Game Options</h3>
            <div class="config-group toggles">
              <div class="toggle-item" v-for="opt in gameOptions" :key="opt.key">
                <label>{{ opt.label }}</label>
                <input type="checkbox" v-model="config[opt.key]">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MODS LIST -->
      <section v-if="activeTab === 'mods'" class="config-section">
        <div class="section-header">
          <h2>🧩 Mods Actifs ({{ mods.length }})</h2>
          <p>Configuration des mods ARKADIA FRANCE</p>
        </div>
        <div class="mods-toolbar">
          <input type="text" v-model="modSearch" placeholder="🔍 Rechercher..." class="search-input">
        </div>
        <div class="mods-grid">
          <div v-for="(mod, i) in filteredMods" :key="mod.id" class="mod-card" :class="{ disabled: !mod.enabled }">
            <div class="mod-header">
              <span class="mod-order">#{{ i + 1 }}</span>
              <span class="mod-icon">{{ mod.icon }}</span>
              <div class="mod-info">
                <h4>{{ mod.name }}</h4>
                <span class="mod-id">ID: {{ mod.id }}</span>
              </div>
              <div class="mod-actions">
                <button class="action-btn" @click="mod.enabled = !mod.enabled">{{ mod.enabled ? '✅' : '❌' }}</button>
                <button v-if="mod.section" class="action-btn" @click="openModConfig(mod.section)">⚙️</button>
              </div>
            </div>
            <p class="mod-desc">{{ mod.description }}</p>
            <div class="mod-tags">
              <span v-for="tag in mod.tags" :key="tag" class="mod-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- MOD CONFIG -->
      <section v-if="activeTab === 'modconfig'" class="config-section">
        <div class="section-header">
          <h2>🔧 Configuration des Mods</h2>
          <p>Paramètres détaillés extraits de vos fichiers INI</p>
        </div>
        <div class="mod-config-tabs">
          <button v-for="mc in modConfigSectionsData" :key="mc.section" :class="['mod-config-tab', { active: activeModConfig === mc.section }]" @click="activeModConfig = mc.section">
            {{ mc.icon }} {{ mc.name }}
          </button>
        </div>
        <div class="mod-config-content" v-if="activeModConfig && modSettings[activeModConfig]">
          <div class="config-card full-width">
            <h3>{{ getModIcon(activeModConfig) }} {{ getModName(activeModConfig) }}</h3>
            <div class="config-group">
              <template v-for="(value, key) in modSettings[activeModConfig]" :key="key">
                <div v-if="typeof value === 'boolean'" class="toggle-item">
                  <label>{{ formatKey(key) }}</label>
                  <input type="checkbox" v-model="modSettings[activeModConfig][key]">
                </div>
                <div v-else class="config-item">
                  <label>{{ formatKey(key) }}</label>
                  <div class="input-with-value">
                    <input :type="typeof value === 'number' ? 'number' : 'text'" v-model="modSettings[activeModConfig][key]" :step="getStep(value)">
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- STACKS -->
      <section v-if="activeTab === 'stacks'" class="config-section">
        <div class="section-header">
          <h2>📦 Stack Overrides</h2>
          <p>ConfigOverrideItemMaxQuantity</p>
        </div>
        <div class="stacks-toolbar">
          <input type="text" v-model="stackSearch" placeholder="🔍 Rechercher..." class="search-input">
          <select v-model="stackCategory" class="filter-select">
            <option value="">Toutes</option>
            <option value="ammo">🔫 Munitions</option>
            <option value="food">🍖 Nourriture</option>
            <option value="consumable">💊 Consommables</option>
          </select>
        </div>
        <div class="stacks-table">
          <div class="table-header">
            <span>📦</span><span>Item</span><span>Class</span><span>Qty</span>
          </div>
          <div class="table-body">
            <div v-for="s in filteredStacks" :key="s.class" class="table-row">
              <span>{{ s.icon }}</span>
              <span>{{ s.name }}</span>
              <span class="col-class">{{ s.class }}</span>
              <span><input type="number" v-model.number="s.quantity" min="1"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- PRESETS -->
      <section v-if="activeTab === 'presets'" class="config-section">
        <div class="section-header">
          <h2>⚡ Presets</h2>
          <p>Configurations pré-définies</p>
        </div>
        <div class="presets-grid">
          <div v-for="p in presetsData" :key="p.id" class="preset-card" @click="applyPreset(p)">
            <span class="preset-icon">{{ p.icon }}</span>
            <h3>{{ p.name }}</h3>
            <p>{{ p.description }}</p>
            <div class="preset-rates">
              <span>XP: x{{ p.rates.xp }}</span>
              <span>Harvest: x{{ p.rates.harvest }}</span>
              <span>Taming: x{{ p.rates.taming }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- RAW INI -->
      <section v-if="activeTab === 'raw'" class="config-section">
        <div class="section-header">
          <h2>📝 Éditeur RAW INI</h2>
        </div>
        <div class="raw-tabs">
          <button :class="{ active: rawFile === 'gus' }" @click="rawFile = 'gus'">GameUserSettings.ini</button>
          <button :class="{ active: rawFile === 'game' }" @click="rawFile = 'game'">Game.ini</button>
        </div>
        <div class="raw-editor">
          <div class="editor-toolbar">
            <button class="btn-small" @click="generateIni">🔧 Générer</button>
            <button class="btn-small" @click="copyIni">📋 Copier</button>
          </div>
          <textarea v-model="rawContent" class="code-editor" spellcheck="false"></textarea>
        </div>
      </section>
    </main>

    <!-- IMPORT MODAL -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="showImportModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>📤 Importer</h3>
          <button class="close-btn" @click="showImportModal = false">✕</button>
        </div>
        <div class="modal-body">
          <textarea v-model="importContent" placeholder="Collez le contenu INI..." class="import-textarea"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showImportModal = false">Annuler</button>
          <button class="btn-primary" @click="processImport">Importer</button>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <div class="floating-actions">
      <button class="fab-btn save" @click="saveConfig" title="Sauvegarder">💾</button>
      <button class="fab-btn reset" @click="resetConfig" title="Reset">🔄</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { defaultServerConfig, defaultModSettings, activeMods, modConfigSections, presets, stackOverrides } from './ark-config/data.js';

const activeTab = ref('server');
const serverStatus = ref('online');
const showImportModal = ref(false);
const modSearch = ref('');
const stackSearch = ref('');
const stackCategory = ref('');
const activeModConfig = ref('CybersStructures');
const rawFile = ref('gus');
const importContent = ref('');

const modConfigSectionsData = modConfigSections;
const presetsData = presets;

const tabs = [
  { id: 'server', icon: '⚙️', label: 'Server' },
  { id: 'mods', icon: '🧩', label: 'Mods', badge: activeMods.length },
  { id: 'modconfig', icon: '🔧', label: 'Mod Config' },
  { id: 'stacks', icon: '📦', label: 'Stacks' },
  { id: 'presets', icon: '⚡', label: 'Presets' },
  { id: 'raw', icon: '📝', label: 'RAW' },
];

const config = reactive({ ...defaultServerConfig });
const modSettings = reactive(JSON.parse(JSON.stringify(defaultModSettings)));
const mods = ref([...activeMods]);
const stacks = ref([...stackOverrides]);

const rateConfigs = [
  { key: 'XPMultiplier', label: 'XP', min: 1, max: 20, step: 0.5 },
  { key: 'HarvestAmountMultiplier', label: 'Harvest', min: 1, max: 20, step: 1 },
  { key: 'TamingSpeedMultiplier', label: 'Taming', min: 1, max: 20, step: 1 },
  { key: 'ItemStackSizeMultiplier', label: 'Stack Size', min: 1, max: 20, step: 1 },
  { key: 'ResourcesRespawnPeriodMultiplier', label: 'Respawn', min: 0.1, max: 5, step: 0.1 },
];

const breedingConfigs = [
  { key: 'EggHatchSpeedMultiplier', label: 'Egg Hatch', min: 1, max: 100, step: 5 },
  { key: 'BabyMatureSpeedMultiplier', label: 'Baby Mature', min: 1, max: 100, step: 5 },
  { key: 'BabyCuddleIntervalMultiplier', label: 'Cuddle', min: 0.01, max: 1, step: 0.01 },
  { key: 'BabyImprintAmountMultiplier', label: 'Imprint', min: 1, max: 5, step: 0.1 },
];

const playerConfigs = [
  { key: 'PlayerCharacterFoodDrainMultiplier', label: 'Food Drain', min: 0.1, max: 2, step: 0.05 },
  { key: 'PlayerCharacterWaterDrainMultiplier', label: 'Water Drain', min: 0.1, max: 2, step: 0.05 },
  { key: 'PlayerDamageMultiplier', label: 'Damage', min: 0.5, max: 3, step: 0.1 },
  { key: 'PlayerCharacterHealthRecoveryMultiplier', label: 'Health Regen', min: 0.5, max: 3, step: 0.1 },
];

const dinoConfigs = [
  { key: 'DinoDamageMultiplier', label: 'Damage', min: 0.5, max: 3, step: 0.1 },
  { key: 'DinoResistanceMultiplier', label: 'Resistance', min: 0.5, max: 3, step: 0.1 },
  { key: 'WildDinoTorporDrainMultiplier', label: 'Wild Torpor', min: 0.5, max: 3, step: 0.1 },
  { key: 'MaxTamedDinos', label: 'Max Tamed', min: 1000, max: 50000, step: 1000, type: 'number' },
];

const structureConfigs = [
  { key: 'TheMaxStructuresInRange', label: 'Max In Range', min: 1000, max: 20000, type: 'number' },
  { key: 'StructureResistanceMultiplier', label: 'Resistance', min: 0.5, max: 3, step: 0.1 },
  { key: 'PerPlatformMaxStructuresMultiplier', label: 'Platform Mult', min: 1, max: 20, step: 1 },
  { key: 'AutoSavePeriodMinutes', label: 'Auto Save (min)', min: 5, max: 60, type: 'number' },
];

const xpConfigs = [
  { key: 'WildKillXPMultiplier', label: 'Wild Kill', min: 0.5, max: 5, step: 0.25 },
  { key: 'AlphaKillXPMultiplier', label: 'Alpha Kill', min: 1, max: 5, step: 0.33 },
  { key: 'BossKillXPMultiplier', label: 'Boss Kill', min: 1, max: 10, step: 1 },
];

const gameOptions = [
  { key: 'serverPVE', label: 'PvE Mode' },
  { key: 'allowThirdPersonPlayer', label: 'Third Person' },
  { key: 'ServerCrosshair', label: 'Crosshair' },
  { key: 'ShowMapPlayerLocation', label: 'Map Location' },
  { key: 'AllowFlyerCarryPvE', label: 'Flyer Carry' },
  { key: 'AllowAnyoneBabyImprintCuddle', label: 'Anyone Imprint' },
  { key: 'DisableCryopodFridgeRequirement', label: 'No Fridge Req' },
  { key: 'bAllowUnlimitedRespecs', label: 'Unlimited Respecs' },
  { key: 'bUseCorpseLocator', label: 'Corpse Locator' },
];

const serverStatusText = computed(() => ({ online: 'En ligne', offline: 'Hors ligne' }[serverStatus.value]));
const filteredMods = computed(() => {
  if (!modSearch.value) return mods.value;
  const s = modSearch.value.toLowerCase();
  return mods.value.filter(m => m.name.toLowerCase().includes(s) || m.id.includes(s));
});
const filteredStacks = computed(() => {
  let r = stacks.value;
  if (stackCategory.value) r = r.filter(s => s.category === stackCategory.value);
  if (stackSearch.value) r = r.filter(s => s.name.toLowerCase().includes(stackSearch.value.toLowerCase()));
  return r;
});
const rawContent = computed({ get: () => generateIniContent(), set: () => {} });

const openModConfig = (section) => { activeModConfig.value = section; activeTab.value = 'modconfig'; };
const getModIcon = (s) => modConfigSectionsData.find(m => m.section === s)?.icon || '⚙️';
const getModName = (s) => modConfigSectionsData.find(m => m.section === s)?.name || s;
const formatKey = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
const getStep = (v) => v >= 1000 ? 100 : v >= 100 ? 10 : v >= 10 ? 1 : 0.1;

const applyPreset = (p) => {
  config.XPMultiplier = p.rates.xp;
  config.HarvestAmountMultiplier = p.rates.harvest;
  config.TamingSpeedMultiplier = p.rates.taming;
  if (p.rates.breed) { config.EggHatchSpeedMultiplier = p.rates.breed; config.BabyMatureSpeedMultiplier = p.rates.breed; }
};

const generateIniContent = () => {
  let ini = rawFile.value === 'gus' ? '[ServerSettings]\n' : '[/script/shootergame.shootergamemode]\n';
  Object.entries(config).forEach(([k, v]) => {
    ini += typeof v === 'boolean' ? `${k}=${v ? 'True' : 'False'}\n` : `${k}=${v}\n`;
  });
  return ini;
};

const generateIni = () => { rawFile.value = rawFile.value === 'gus' ? 'game' : 'gus'; };
const exportConfig = () => {
  const blob = new Blob([generateIniContent()], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'ARKADIA_Config.ini'; a.click();
};
const processImport = () => {
  importContent.value.split('\n').forEach(l => {
    const m = l.match(/^(\w+)=(.+)$/);
    if (m && config.hasOwnProperty(m[1])) {
      const v = m[2];
      config[m[1]] = v === 'True' ? true : v === 'False' ? false : !isNaN(parseFloat(v)) ? parseFloat(v) : v;
    }
  });
  showImportModal.value = false;
};
const copyIni = () => navigator.clipboard.writeText(rawContent.value);
const saveConfig = () => { localStorage.setItem('arkConfig', JSON.stringify(config)); alert('Config sauvegardée !'); };
const resetConfig = () => { if (confirm('Reset ?')) Object.assign(config, defaultServerConfig); };
</script>

<style scoped>
.ark-config-manager { min-height: 100vh; background: #0a0a0a; color: #f5f5f5; padding-top: 80px; }
.app-header { background: linear-gradient(180deg, rgba(16,185,129,0.1) 0%, transparent 100%); border-bottom: 1px solid rgba(16,185,129,0.2); position: sticky; top: 80px; z-index: 100; backdrop-filter: blur(10px); }
.header-content { max-width: 1600px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.header-left { display: flex; align-items: center; gap: 1.5rem; }
.back-btn { color: #737373; text-decoration: none; font-size: 0.9rem; }
.back-btn:hover { color: #10B981; }
.app-branding { display: flex; align-items: center; gap: 1rem; }
.app-logo { font-size: 2.5rem; }
.app-info h1 { font-size: 1.5rem; margin: 0; color: #10B981; }
.app-subtitle { font-size: 0.8rem; color: #737373; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.server-status { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(0,0,0,0.3); border-radius: 2rem; font-size: 0.85rem; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.server-status.online .status-dot { background: #10B981; box-shadow: 0 0 8px #10B981; }
.btn-primary { padding: 0.6rem 1.25rem; background: #10B981; border: none; border-radius: 0.5rem; color: #000; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #059669; }
.btn-secondary { padding: 0.6rem 1.25rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem; color: #a3a3a3; cursor: pointer; }
.btn-secondary:hover { border-color: #10B981; color: #10B981; }
.btn-small { padding: 0.4rem 0.75rem; font-size: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.25rem; color: #a3a3a3; cursor: pointer; }
.header-tabs { max-width: 1600px; margin: 0 auto; padding: 0 2rem; display: flex; gap: 0.5rem; overflow-x: auto; }
.tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: transparent; border: none; border-bottom: 2px solid transparent; color: #737373; cursor: pointer; white-space: nowrap; }
.tab-btn:hover { color: #a3a3a3; }
.tab-btn.active { color: #10B981; border-bottom-color: #10B981; }
.tab-badge { padding: 0.15rem 0.5rem; background: rgba(16,185,129,0.2); border-radius: 1rem; font-size: 0.7rem; color: #10B981; }
.main-content { max-width: 1600px; margin: 0 auto; padding: 2rem; }
.section-header { margin-bottom: 2rem; }
.section-header h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.section-header p { color: #737373; }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
.config-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.5rem; }
.config-card.full-width { grid-column: 1 / -1; }
.config-card h3 { font-size: 1rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.config-group { display: flex; flex-direction: column; gap: 1rem; }
.config-group.toggles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
.config-item { display: flex; flex-direction: column; gap: 0.5rem; }
.config-item label { font-size: 0.85rem; color: #a3a3a3; }
.input-with-value { display: flex; align-items: center; gap: 1rem; }
.input-with-value input[type="range"] { flex: 1; accent-color: #10B981; }
.input-with-value input[type="number"], .input-with-value input[type="text"] { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.25rem; color: #f5f5f5; font-family: monospace; }
.value-display { min-width: 50px; text-align: right; font-family: monospace; color: #10B981; }
.toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; }
.toggle-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #10B981; }
.mods-toolbar, .stacks-toolbar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 0.75rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; }
.filter-select { padding: 0.75rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; }
.mods-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem; }
.mod-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem; transition: all 0.3s; }
.mod-card:hover { border-color: #10B981; }
.mod-card.disabled { opacity: 0.5; }
.mod-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.mod-order { font-family: monospace; font-size: 0.75rem; color: #10B981; }
.mod-icon { font-size: 1.5rem; }
.mod-info { flex: 1; }
.mod-info h4 { margin: 0; font-size: 1rem; }
.mod-id { font-family: monospace; font-size: 0.7rem; color: #737373; }
.mod-actions { display: flex; gap: 0.25rem; }
.action-btn { padding: 0.4rem; background: transparent; border: none; cursor: pointer; border-radius: 0.25rem; }
.action-btn:hover { background: rgba(255,255,255,0.1); }
.mod-desc { font-size: 0.85rem; color: #a3a3a3; margin-bottom: 0.75rem; }
.mod-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.mod-tag { padding: 0.2rem 0.5rem; background: rgba(16,185,129,0.1); border-radius: 1rem; font-size: 0.7rem; color: #10B981; }
.mod-config-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.mod-config-tab { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #a3a3a3; cursor: pointer; }
.mod-config-tab:hover, .mod-config-tab.active { border-color: #10B981; color: #10B981; }
.stacks-table { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; overflow: hidden; }
.table-header { display: grid; grid-template-columns: 50px 1fr 2fr 100px; gap: 1rem; padding: 1rem 1.5rem; background: rgba(0,0,0,0.3); font-weight: 600; font-size: 0.85rem; color: #a3a3a3; }
.table-body { max-height: 400px; overflow-y: auto; }
.table-row { display: grid; grid-template-columns: 50px 1fr 2fr 100px; gap: 1rem; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center; }
.table-row:hover { background: rgba(16,185,129,0.05); }
.col-class { font-family: monospace; font-size: 0.6rem; color: #737373; overflow: hidden; text-overflow: ellipsis; }
.table-row input { width: 100%; padding: 0.4rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.25rem; color: #f5f5f5; font-family: monospace; }
.presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
.preset-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s; }
.preset-card:hover { border-color: #10B981; transform: translateY(-4px); }
.preset-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
.preset-card h3 { margin-bottom: 0.5rem; }
.preset-card p { font-size: 0.85rem; color: #737373; margin-bottom: 1rem; }
.preset-rates { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; font-family: monospace; font-size: 0.75rem; color: #10B981; }
.raw-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.raw-tabs button { padding: 0.6rem 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem 0.5rem 0 0; color: #a3a3a3; cursor: pointer; }
.raw-tabs button.active { background: rgba(16,185,129,0.1); border-color: #10B981; color: #10B981; }
.raw-editor { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0 1rem 1rem 1rem; }
.editor-toolbar { display: flex; gap: 0.5rem; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.code-editor { width: 100%; min-height: 400px; padding: 1rem; background: transparent; border: none; color: #f5f5f5; font-family: monospace; font-size: 0.85rem; line-height: 1.6; resize: vertical; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; width: 90%; max-width: 600px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.modal-header h3 { margin: 0; }
.close-btn { background: none; border: none; color: #737373; font-size: 1.25rem; cursor: pointer; }
.modal-body { padding: 1.5rem; }
.import-textarea { width: 100%; min-height: 250px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; font-family: monospace; resize: vertical; }
.modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
.floating-actions { position: fixed; bottom: 2rem; right: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.fab-btn { width: 56px; height: 56px; border-radius: 50%; border: none; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.3s; }
.fab-btn.save { background: #10B981; }
.fab-btn.reset { background: #374151; }
.fab-btn:hover { transform: scale(1.1); }
@media (max-width: 768px) { .header-content { flex-direction: column; } .config-grid, .mods-grid { grid-template-columns: 1fr; } .table-header, .table-row { grid-template-columns: 40px 1fr 80px; } .col-class { display: none; } }
</style>
