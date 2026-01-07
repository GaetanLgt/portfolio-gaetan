<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="print3d-manager">
      <!-- HEADER -->
      <header class="app-header">
        <div class="header-left">
          <router-link to="/apps" class="back-btn">
            <n-button quaternary size="small">← Apps</n-button>
          </router-link>
          <div class="app-title">
            <span class="app-icon">🖨️</span>
            <div>
              <h1>3D Print Manager</h1>
              <span class="app-subtitle">Gestion complète d'entreprise d'impression 3D</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <n-badge :value="pendingOrders" :max="99">
            <n-button quaternary @click="activeTab = 'orders'">📦 Commandes</n-button>
          </n-badge>
          <n-badge :value="lowStockCount" :max="99" type="warning">
            <n-button quaternary @click="activeTab = 'inventory'">📊 Stock</n-button>
          </n-badge>
          <n-button type="primary" @click="showNewOrderModal = true">
            + Nouvelle commande
          </n-button>
        </div>
      </header>

      <!-- DASHBOARD STATS -->
      <section class="dashboard-stats" v-if="activeTab === 'dashboard'">
        <n-grid :cols="5" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
          <n-gi span="5 s:5 m:1">
            <n-card class="stat-card">
              <n-statistic label="CA du mois" :value="monthlyRevenue" prefix="€">
                <template #suffix>
                  <n-tag :type="revenueGrowth >= 0 ? 'success' : 'error'" size="small">
                    {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth }}%
                  </n-tag>
                </template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi span="5 s:5 m:1">
            <n-card class="stat-card">
              <n-statistic label="Commandes en cours" :value="pendingOrders">
                <template #prefix><span>📦</span></template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi span="5 s:5 m:1">
            <n-card class="stat-card">
              <n-statistic label="Impressions actives" :value="activePrints">
                <template #prefix><span>🖨️</span></template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi span="5 s:5 m:1">
            <n-card class="stat-card">
              <n-statistic label="Temps machine (h)" :value="totalPrintHours">
                <template #prefix><span>⏱️</span></template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi span="5 s:5 m:1">
            <n-card class="stat-card" :class="{ 'warning': lowStockCount > 0 }">
              <n-statistic label="Alertes stock" :value="lowStockCount">
                <template #prefix><span>⚠️</span></template>
              </n-statistic>
            </n-card>
          </n-gi>
        </n-grid>
      </section>

      <!-- TABS NAVIGATION -->
      <n-tabs v-model:value="activeTab" type="line" animated class="main-tabs">
        <!-- DASHBOARD -->
        <n-tab-pane name="dashboard" tab="📊 Dashboard">
          <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <!-- Recent Orders -->
            <n-gi span="2 l:1">
              <n-card title="📦 Dernières commandes">
                <n-data-table :columns="orderColumns" :data="recentOrders" :max-height="300" size="small" />
              </n-card>
            </n-gi>
            
            <!-- Printer Status -->
            <n-gi span="2 l:1">
              <n-card title="🖨️ État des imprimantes">
                <n-space vertical :size="12">
                  <div v-for="printer in printers" :key="printer.id" class="printer-status">
                    <n-space justify="space-between" align="center">
                      <n-space align="center" :size="12">
                        <n-badge :dot="true" :type="printer.status === 'printing' ? 'success' : printer.status === 'idle' ? 'default' : 'warning'" />
                        <div>
                          <n-text strong>{{ printer.name }}</n-text>
                          <n-text depth="3" style="display: block; font-size: 0.8rem">{{ printer.model }}</n-text>
                        </div>
                      </n-space>
                      <div style="text-align: right">
                        <n-tag :type="getStatusType(printer.status)" size="small">{{ getStatusLabel(printer.status) }}</n-tag>
                        <n-progress v-if="printer.status === 'printing'" :percentage="printer.progress" :show-indicator="false" style="width: 100px; margin-top: 4px" />
                      </div>
                    </n-space>
                    <n-text v-if="printer.currentJob" depth="3" style="font-size: 0.85rem; margin-top: 4px; display: block">
                      {{ printer.currentJob }} • {{ printer.timeRemaining }}
                    </n-text>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Low Stock Alert -->
            <n-gi span="2 l:1">
              <n-card title="⚠️ Alertes stock">
                <n-empty v-if="lowStockItems.length === 0" description="Aucune alerte" />
                <n-space v-else vertical :size="8">
                  <n-alert v-for="item in lowStockItems" :key="item.id" type="warning" :title="item.name">
                    Stock: {{ item.quantity }}{{ item.unit }} (min: {{ item.minStock }}{{ item.unit }})
                    <template #action>
                      <n-button size="tiny" @click="openReorderModal(item)">Commander</n-button>
                    </template>
                  </n-alert>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Today's Schedule -->
            <n-gi span="2 l:1">
              <n-card title="📅 Planning du jour">
                <n-timeline>
                  <n-timeline-item v-for="task in todaySchedule" :key="task.id" :type="task.type" :title="task.title" :time="task.time">
                    {{ task.description }}
                  </n-timeline-item>
                </n-timeline>
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>

        <!-- ORDERS -->
        <n-tab-pane name="orders" tab="📦 Commandes">
          <n-card>
            <template #header>
              <n-space justify="space-between" align="center">
                <n-h3 style="margin: 0">Gestion des commandes</n-h3>
                <n-space :size="12">
                  <n-select v-model:value="orderFilter" :options="orderFilterOptions" style="width: 150px" />
                  <n-input v-model:value="orderSearch" placeholder="Rechercher..." style="width: 200px">
                    <template #prefix>🔍</template>
                  </n-input>
                  <n-button type="primary" @click="showNewOrderModal = true">+ Nouvelle commande</n-button>
                </n-space>
              </n-space>
            </template>
            
            <n-data-table 
              :columns="fullOrderColumns" 
              :data="filteredOrders" 
              :pagination="{ pageSize: 10 }"
              :row-key="row => row.id"
            />
          </n-card>
        </n-tab-pane>

        <!-- INVENTORY -->
        <n-tab-pane name="inventory" tab="📊 Inventaire">
          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <!-- Filaments -->
            <n-gi span="3 l:1">
              <n-card title="🧵 Filaments">
                <template #header-extra>
                  <n-button size="tiny" @click="showAddFilamentModal = true">+ Ajouter</n-button>
                </template>
                <n-space vertical :size="8">
                  <div v-for="filament in filaments" :key="filament.id" class="inventory-item">
                    <n-space justify="space-between" align="center">
                      <n-space align="center" :size="8">
                        <div class="color-dot" :style="{ background: filament.colorHex }"></div>
                        <div>
                          <n-text strong>{{ filament.name }}</n-text>
                          <n-text depth="3" style="display: block; font-size: 0.75rem">{{ filament.type }} • {{ filament.brand }}</n-text>
                        </div>
                      </n-space>
                      <div style="text-align: right">
                        <n-text :type="filament.quantity < filament.minStock ? 'error' : 'default'">
                          {{ filament.quantity }}g
                        </n-text>
                        <n-progress 
                          :percentage="(filament.quantity / filament.maxStock) * 100" 
                          :status="filament.quantity < filament.minStock ? 'error' : 'default'"
                          :show-indicator="false" 
                          style="width: 60px" 
                        />
                      </div>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Resins -->
            <n-gi span="3 l:1">
              <n-card title="🧪 Résines">
                <template #header-extra>
                  <n-button size="tiny" @click="showAddResinModal = true">+ Ajouter</n-button>
                </template>
                <n-space vertical :size="8">
                  <div v-for="resin in resins" :key="resin.id" class="inventory-item">
                    <n-space justify="space-between" align="center">
                      <n-space align="center" :size="8">
                        <div class="color-dot" :style="{ background: resin.colorHex }"></div>
                        <div>
                          <n-text strong>{{ resin.name }}</n-text>
                          <n-text depth="3" style="display: block; font-size: 0.75rem">{{ resin.type }} • {{ resin.brand }}</n-text>
                        </div>
                      </n-space>
                      <div style="text-align: right">
                        <n-text :type="resin.quantity < resin.minStock ? 'error' : 'default'">
                          {{ resin.quantity }}ml
                        </n-text>
                        <n-progress 
                          :percentage="(resin.quantity / resin.maxStock) * 100" 
                          :status="resin.quantity < resin.minStock ? 'error' : 'default'"
                          :show-indicator="false" 
                          style="width: 60px" 
                        />
                      </div>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Consumables -->
            <n-gi span="3 l:1">
              <n-card title="🔧 Consommables">
                <template #header-extra>
                  <n-button size="tiny" @click="showAddConsumableModal = true">+ Ajouter</n-button>
                </template>
                <n-space vertical :size="8">
                  <div v-for="item in consumables" :key="item.id" class="inventory-item">
                    <n-space justify="space-between" align="center">
                      <div>
                        <n-text strong>{{ item.name }}</n-text>
                        <n-text depth="3" style="display: block; font-size: 0.75rem">{{ item.category }}</n-text>
                      </div>
                      <n-tag :type="item.quantity < item.minStock ? 'error' : 'default'" size="small">
                        {{ item.quantity }} {{ item.unit }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>

        <!-- PRINTERS -->
        <n-tab-pane name="printers" tab="🖨️ Imprimantes">
          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="printer in printers" :key="printer.id" span="3 m:3 l:1">
              <n-card class="printer-card" :class="{ 'printing': printer.status === 'printing' }">
                <template #header>
                  <n-space align="center" :size="12">
                    <span style="font-size: 2rem">🖨️</span>
                    <div>
                      <n-h3 style="margin: 0">{{ printer.name }}</n-h3>
                      <n-text depth="3">{{ printer.model }}</n-text>
                    </div>
                  </n-space>
                </template>
                <template #header-extra>
                  <n-tag :type="getStatusType(printer.status)">{{ getStatusLabel(printer.status) }}</n-tag>
                </template>

                <n-space vertical :size="16">
                  <!-- Current Job -->
                  <div v-if="printer.status === 'printing'">
                    <n-text depth="3" style="font-size: 0.85rem">Impression en cours:</n-text>
                    <n-text strong style="display: block">{{ printer.currentJob }}</n-text>
                    <n-progress :percentage="printer.progress" :indicator-placement="'inside'" />
                    <n-space justify="space-between" style="margin-top: 8px">
                      <n-text depth="3">Temps restant: {{ printer.timeRemaining }}</n-text>
                      <n-text depth="3">Filament: {{ printer.filamentUsed }}g</n-text>
                    </n-space>
                  </div>

                  <!-- Specs -->
                  <n-descriptions :column="2" size="small">
                    <n-descriptions-item label="Volume">{{ printer.volume }}</n-descriptions-item>
                    <n-descriptions-item label="Type">{{ printer.type }}</n-descriptions-item>
                    <n-descriptions-item label="Heures">{{ printer.totalHours }}h</n-descriptions-item>
                    <n-descriptions-item label="Buse">{{ printer.nozzle }}mm</n-descriptions-item>
                  </n-descriptions>

                  <!-- Actions -->
                  <n-space :size="8">
                    <n-button v-if="printer.status === 'idle'" type="primary" size="small" @click="startPrint(printer)">
                      ▶️ Démarrer
                    </n-button>
                    <n-button v-if="printer.status === 'printing'" type="warning" size="small" @click="pausePrint(printer)">
                      ⏸️ Pause
                    </n-button>
                    <n-button v-if="printer.status === 'paused'" type="success" size="small" @click="resumePrint(printer)">
                      ▶️ Reprendre
                    </n-button>
                    <n-button size="small" @click="showPrinterSettings(printer)">⚙️ Paramètres</n-button>
                  </n-space>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>

        <!-- CLIENTS -->
        <n-tab-pane name="clients" tab="👥 Clients">
          <n-card>
            <template #header>
              <n-space justify="space-between" align="center">
                <n-h3 style="margin: 0">Base clients</n-h3>
                <n-space :size="12">
                  <n-input v-model:value="clientSearch" placeholder="Rechercher un client..." style="width: 250px">
                    <template #prefix>🔍</template>
                  </n-input>
                  <n-button type="primary" @click="showNewClientModal = true">+ Nouveau client</n-button>
                </n-space>
              </n-space>
            </template>

            <n-data-table :columns="clientColumns" :data="filteredClients" :pagination="{ pageSize: 10 }" />
          </n-card>
        </n-tab-pane>

        <!-- QUOTES / INVOICES -->
        <n-tab-pane name="billing" tab="💰 Facturation">
          <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi span="2 l:1">
              <n-card title="📋 Devis en attente">
                <template #header-extra>
                  <n-button size="small" type="primary" @click="showNewQuoteModal = true">+ Nouveau devis</n-button>
                </template>
                <n-data-table :columns="quoteColumns" :data="pendingQuotes" size="small" :max-height="300" />
              </n-card>
            </n-gi>
            <n-gi span="2 l:1">
              <n-card title="🧾 Factures récentes">
                <template #header-extra>
                  <n-button size="small" @click="showNewInvoiceModal = true">+ Nouvelle facture</n-button>
                </template>
                <n-data-table :columns="invoiceColumns" :data="recentInvoices" size="small" :max-height="300" />
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>

        <!-- PRICING CALCULATOR -->
        <n-tab-pane name="calculator" tab="🧮 Calculateur">
          <n-grid :cols="2" :x-gap="24" responsive="screen" item-responsive>
            <n-gi span="2 l:1">
              <n-card title="🧮 Calculateur de prix">
                <n-form label-placement="left" label-width="140px">
                  <n-form-item label="Type d'impression">
                    <n-select v-model:value="calcPrintType" :options="printTypeOptions" />
                  </n-form-item>
                  <n-form-item label="Matériau">
                    <n-select v-model:value="calcMaterial" :options="materialOptions" />
                  </n-form-item>
                  <n-form-item label="Poids estimé (g)">
                    <n-input-number v-model:value="calcWeight" :min="1" :max="10000" />
                  </n-form-item>
                  <n-form-item label="Temps impression (h)">
                    <n-input-number v-model:value="calcTime" :min="0.1" :max="500" :step="0.5" />
                  </n-form-item>
                  <n-form-item label="Complexité">
                    <n-slider v-model:value="calcComplexity" :min="1" :max="5" :marks="{ 1: 'Simple', 3: 'Moyen', 5: 'Complexe' }" />
                  </n-form-item>
                  <n-form-item label="Post-traitement">
                    <n-checkbox-group v-model:value="calcPostProcess">
                      <n-space>
                        <n-checkbox value="sanding">Ponçage</n-checkbox>
                        <n-checkbox value="painting">Peinture</n-checkbox>
                        <n-checkbox value="assembly">Assemblage</n-checkbox>
                      </n-space>
                    </n-checkbox-group>
                  </n-form-item>
                  <n-form-item label="Quantité">
                    <n-input-number v-model:value="calcQuantity" :min="1" :max="1000" />
                  </n-form-item>
                </n-form>
              </n-card>
            </n-gi>
            
            <n-gi span="2 l:1">
              <n-card title="💰 Estimation">
                <n-space vertical :size="16">
                  <n-descriptions :column="1" label-placement="left">
                    <n-descriptions-item label="Coût matière">{{ calcMaterialCost.toFixed(2) }} €</n-descriptions-item>
                    <n-descriptions-item label="Coût machine">{{ calcMachineCost.toFixed(2) }} €</n-descriptions-item>
                    <n-descriptions-item label="Main d'œuvre">{{ calcLaborCost.toFixed(2) }} €</n-descriptions-item>
                    <n-descriptions-item label="Post-traitement">{{ calcPostCost.toFixed(2) }} €</n-descriptions-item>
                  </n-descriptions>
                  
                  <n-divider />
                  
                  <n-space justify="space-between" align="center">
                    <n-text depth="3">Sous-total unitaire</n-text>
                    <n-text strong>{{ calcSubtotal.toFixed(2) }} €</n-text>
                  </n-space>
                  
                  <n-space justify="space-between" align="center">
                    <n-text depth="3">Marge ({{ marginPercent }}%)</n-text>
                    <n-text>{{ calcMargin.toFixed(2) }} €</n-text>
                  </n-space>
                  
                  <n-divider />
                  
                  <n-space justify="space-between" align="center">
                    <n-text strong style="font-size: 1.1rem">Prix unitaire HT</n-text>
                    <n-text strong style="font-size: 1.5rem; color: #06B6D4">{{ calcUnitPrice.toFixed(2) }} €</n-text>
                  </n-space>
                  
                  <n-space justify="space-between" align="center">
                    <n-text>× {{ calcQuantity }} pièces</n-text>
                    <n-text strong style="font-size: 1.25rem">{{ calcTotalPrice.toFixed(2) }} € HT</n-text>
                  </n-space>
                  
                  <n-space justify="space-between" align="center">
                    <n-text depth="3">TVA (20%)</n-text>
                    <n-text>{{ (calcTotalPrice * 0.2).toFixed(2) }} €</n-text>
                  </n-space>
                  
                  <n-card style="background: rgba(6,182,212,0.1); border-color: #06B6D4">
                    <n-space justify="space-between" align="center">
                      <n-text strong>TOTAL TTC</n-text>
                      <n-text strong style="font-size: 2rem; color: #06B6D4">{{ (calcTotalPrice * 1.2).toFixed(2) }} €</n-text>
                    </n-space>
                  </n-card>
                  
                  <n-button type="primary" block @click="createQuoteFromCalc">
                    📋 Créer un devis
                  </n-button>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-tab-pane>
      </n-tabs>

      <!-- NEW ORDER MODAL -->
      <n-modal v-model:show="showNewOrderModal" preset="card" title="📦 Nouvelle commande" style="width: 600px; max-width: 95vw">
        <n-form :model="newOrder" label-placement="left" label-width="120px">
          <n-form-item label="Client">
            <n-select v-model:value="newOrder.clientId" :options="clientOptions" placeholder="Sélectionner un client" filterable />
          </n-form-item>
          <n-form-item label="Description">
            <n-input v-model:value="newOrder.description" type="textarea" placeholder="Description de la commande..." />
          </n-form-item>
          <n-form-item label="Fichier 3D">
            <n-upload>
              <n-button>📁 Importer fichier STL/OBJ</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="Matériau">
            <n-select v-model:value="newOrder.material" :options="materialOptions" />
          </n-form-item>
          <n-form-item label="Couleur">
            <n-color-picker v-model:value="newOrder.color" />
          </n-form-item>
          <n-form-item label="Quantité">
            <n-input-number v-model:value="newOrder.quantity" :min="1" />
          </n-form-item>
          <n-form-item label="Priorité">
            <n-select v-model:value="newOrder.priority" :options="priorityOptions" />
          </n-form-item>
          <n-form-item label="Date souhaitée">
            <n-date-picker v-model:value="newOrder.deadline" type="date" />
          </n-form-item>
        </n-form>
        <template #action>
          <n-space justify="end">
            <n-button @click="showNewOrderModal = false">Annuler</n-button>
            <n-button type="primary" @click="createOrder">Créer la commande</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { darkTheme, NButton, NTag, NProgress } from 'naive-ui';
import { glThemeOverrides } from '@/config/naiveTheme.js';

const themeOverrides = glThemeOverrides;
const activeTab = ref('dashboard');

// Modals
const showNewOrderModal = ref(false);
const showAddFilamentModal = ref(false);
const showAddResinModal = ref(false);
const showAddConsumableModal = ref(false);
const showNewClientModal = ref(false);
const showNewQuoteModal = ref(false);
const showNewInvoiceModal = ref(false);

// Search & Filters
const orderFilter = ref('all');
const orderSearch = ref('');
const clientSearch = ref('');

// Dashboard Stats
const monthlyRevenue = ref(12450);
const revenueGrowth = ref(15);
const pendingOrders = ref(8);
const activePrints = ref(3);
const totalPrintHours = ref(156);

// Data
const printers = ref([
  { id: 1, name: 'Prusa MK4', model: 'Prusa i3 MK4', status: 'printing', currentJob: 'Figurine Dragon', progress: 67, timeRemaining: '2h 15min', filamentUsed: 85, volume: '250×210×220mm', type: 'FDM', totalHours: 1250, nozzle: 0.4 },
  { id: 2, name: 'Ender 3 S1', model: 'Creality Ender 3 S1 Pro', status: 'idle', currentJob: null, progress: 0, timeRemaining: null, filamentUsed: 0, volume: '220×220×270mm', type: 'FDM', totalHours: 890, nozzle: 0.4 },
  { id: 3, name: 'Elegoo Mars', model: 'Elegoo Mars 3 Pro', status: 'printing', currentJob: 'Bijoux miniatures (x12)', progress: 45, timeRemaining: '4h 30min', filamentUsed: 25, volume: '143×89×175mm', type: 'Résine', totalHours: 450, nozzle: null },
  { id: 4, name: 'Bambu X1C', model: 'Bambu Lab X1 Carbon', status: 'maintenance', currentJob: null, progress: 0, timeRemaining: null, filamentUsed: 0, volume: '256×256×256mm', type: 'FDM', totalHours: 320, nozzle: 0.4 },
]);

const orders = ref([
  { id: 'CMD-2024-001', client: 'TechStartup SAS', description: 'Prototype boîtier IoT', status: 'printing', priority: 'high', deadline: '2024-02-15', price: 450, createdAt: '2024-02-10' },
  { id: 'CMD-2024-002', client: 'Marie Dupont', description: 'Figurines personnalisées (x5)', status: 'pending', priority: 'normal', deadline: '2024-02-20', price: 180, createdAt: '2024-02-11' },
  { id: 'CMD-2024-003', client: 'IndustrieCo', description: 'Pièces de rechange machines', status: 'completed', priority: 'urgent', deadline: '2024-02-12', price: 890, createdAt: '2024-02-08' },
  { id: 'CMD-2024-004', client: 'Bijoux Élégance', description: 'Moules bijoux collection été', status: 'review', priority: 'normal', deadline: '2024-02-25', price: 650, createdAt: '2024-02-12' },
  { id: 'CMD-2024-005', client: 'ArchitectStudio', description: 'Maquette bâtiment 1:100', status: 'pending', priority: 'high', deadline: '2024-02-18', price: 1200, createdAt: '2024-02-13' },
]);

const filaments = ref([
  { id: 1, name: 'PLA Blanc', type: 'PLA', brand: 'Prusament', colorHex: '#FFFFFF', quantity: 1200, minStock: 500, maxStock: 3000 },
  { id: 2, name: 'PLA Noir', type: 'PLA', brand: 'Prusament', colorHex: '#1a1a1a', quantity: 800, minStock: 500, maxStock: 3000 },
  { id: 3, name: 'PETG Transparent', type: 'PETG', brand: 'eSUN', colorHex: '#e0e0e0', quantity: 350, minStock: 400, maxStock: 2000 },
  { id: 4, name: 'ABS Gris', type: 'ABS', brand: 'Polymaker', colorHex: '#808080', quantity: 600, minStock: 300, maxStock: 2000 },
  { id: 5, name: 'TPU Flexible Rouge', type: 'TPU', brand: 'NinjaTek', colorHex: '#EF4444', quantity: 200, minStock: 200, maxStock: 1000 },
]);

const resins = ref([
  { id: 1, name: 'Standard Gris', type: 'Standard', brand: 'Elegoo', colorHex: '#6B7280', quantity: 800, minStock: 500, maxStock: 2000 },
  { id: 2, name: 'Water Washable Blanc', type: 'Water Washable', brand: 'Anycubic', colorHex: '#F5F5F5', quantity: 450, minStock: 400, maxStock: 1500 },
  { id: 3, name: 'ABS-Like Noir', type: 'ABS-Like', brand: 'Siraya Tech', colorHex: '#1a1a1a', quantity: 250, minStock: 300, maxStock: 1000 },
]);

const consumables = ref([
  { id: 1, name: 'Alcool isopropylique', category: 'Nettoyage', quantity: 2.5, unit: 'L', minStock: 2 },
  { id: 2, name: 'Gants nitrile', category: 'Protection', quantity: 150, unit: 'pcs', minStock: 50 },
  { id: 3, name: 'Film FEP', category: 'Résine', quantity: 3, unit: 'pcs', minStock: 2 },
  { id: 4, name: 'Buse 0.4mm', category: 'Pièces', quantity: 8, unit: 'pcs', minStock: 5 },
  { id: 5, name: 'Colle Magigoo', category: 'Adhérence', quantity: 1, unit: 'pcs', minStock: 2 },
]);

const clients = ref([
  { id: 1, name: 'TechStartup SAS', email: 'contact@techstartup.fr', phone: '01 23 45 67 89', type: 'pro', orders: 12, totalSpent: 4500 },
  { id: 2, name: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '06 12 34 56 78', type: 'particulier', orders: 3, totalSpent: 280 },
  { id: 3, name: 'IndustrieCo', email: 'achats@industrieco.com', phone: '01 98 76 54 32', type: 'pro', orders: 25, totalSpent: 15600 },
  { id: 4, name: 'Bijoux Élégance', email: 'atelier@bijoux-elegance.fr', phone: '01 45 67 89 01', type: 'pro', orders: 8, totalSpent: 3200 },
  { id: 5, name: 'ArchitectStudio', email: 'projets@architectstudio.fr', phone: '01 34 56 78 90', type: 'pro', orders: 6, totalSpent: 5800 },
]);

const todaySchedule = ref([
  { id: 1, title: 'Fin impression Dragon', time: '10:30', description: 'Prusa MK4 - Vérifier qualité', type: 'success' },
  { id: 2, title: 'Livraison CMD-003', time: '14:00', description: 'IndustrieCo - Pièces machines', type: 'info' },
  { id: 3, title: 'Lancer impression CMD-005', time: '15:30', description: 'Maquette architecturale', type: 'default' },
  { id: 4, title: 'Maintenance Bambu X1C', time: '17:00', description: 'Nettoyage hotend + calibration', type: 'warning' },
]);

const pendingQuotes = ref([
  { id: 'DEV-2024-015', client: 'NouvClient SARL', description: 'Série prototypes (x50)', amount: 2500, date: '2024-02-10', status: 'pending' },
  { id: 'DEV-2024-016', client: 'Artisan Local', description: 'Moules chocolat custom', amount: 380, date: '2024-02-12', status: 'sent' },
]);

const recentInvoices = ref([
  { id: 'FAC-2024-042', client: 'IndustrieCo', amount: 890, date: '2024-02-12', status: 'paid' },
  { id: 'FAC-2024-041', client: 'TechStartup SAS', amount: 450, date: '2024-02-08', status: 'pending' },
  { id: 'FAC-2024-040', client: 'Bijoux Élégance', amount: 650, date: '2024-02-05', status: 'paid' },
]);

// Calculator
const calcPrintType = ref('fdm');
const calcMaterial = ref('pla');
const calcWeight = ref(100);
const calcTime = ref(5);
const calcComplexity = ref(2);
const calcPostProcess = ref([]);
const calcQuantity = ref(1);
const marginPercent = ref(35);

// Options
const orderFilterOptions = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'printing' },
  { label: 'Terminées', value: 'completed' },
];

const printTypeOptions = [
  { label: 'FDM (Filament)', value: 'fdm' },
  { label: 'SLA (Résine)', value: 'sla' },
];

const materialOptions = [
  { label: 'PLA', value: 'pla' },
  { label: 'PETG', value: 'petg' },
  { label: 'ABS', value: 'abs' },
  { label: 'TPU', value: 'tpu' },
  { label: 'Résine Standard', value: 'resin_standard' },
  { label: 'Résine ABS-Like', value: 'resin_abs' },
];

const priorityOptions = [
  { label: '🟢 Normal', value: 'normal' },
  { label: '🟡 Haute', value: 'high' },
  { label: '🔴 Urgent (+50%)', value: 'urgent' },
];

// New Order Form
const newOrder = ref({
  clientId: null,
  description: '',
  material: 'pla',
  color: '#FFFFFF',
  quantity: 1,
  priority: 'normal',
  deadline: null,
});

// Computed
const lowStockItems = computed(() => {
  const items = [];
  filaments.value.filter(f => f.quantity < f.minStock).forEach(f => items.push({ ...f, unit: 'g' }));
  resins.value.filter(r => r.quantity < r.minStock).forEach(r => items.push({ ...r, unit: 'ml' }));
  consumables.value.filter(c => c.quantity < c.minStock).forEach(c => items.push(c));
  return items;
});

const lowStockCount = computed(() => lowStockItems.value.length);

const recentOrders = computed(() => orders.value.slice(0, 5));

const filteredOrders = computed(() => {
  let result = orders.value;
  if (orderFilter.value !== 'all') {
    result = result.filter(o => o.status === orderFilter.value);
  }
  if (orderSearch.value) {
    const search = orderSearch.value.toLowerCase();
    result = result.filter(o => o.id.toLowerCase().includes(search) || o.client.toLowerCase().includes(search) || o.description.toLowerCase().includes(search));
  }
  return result;
});

const filteredClients = computed(() => {
  if (!clientSearch.value) return clients.value;
  const search = clientSearch.value.toLowerCase();
  return clients.value.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
});

const clientOptions = computed(() => clients.value.map(c => ({ label: c.name, value: c.id })));

// Calculator computed
const materialCosts = { pla: 0.025, petg: 0.035, abs: 0.03, tpu: 0.06, resin_standard: 0.08, resin_abs: 0.12 };
const calcMaterialCost = computed(() => calcWeight.value * (materialCosts[calcMaterial.value] || 0.025));
const calcMachineCost = computed(() => calcTime.value * 2.5); // 2.5€/h
const calcLaborCost = computed(() => (calcTime.value * 0.5 + calcComplexity.value * 5));
const calcPostCost = computed(() => calcPostProcess.value.length * 15);
const calcSubtotal = computed(() => calcMaterialCost.value + calcMachineCost.value + calcLaborCost.value + calcPostCost.value);
const calcMargin = computed(() => calcSubtotal.value * (marginPercent.value / 100));
const calcUnitPrice = computed(() => calcSubtotal.value + calcMargin.value);
const calcTotalPrice = computed(() => calcUnitPrice.value * calcQuantity.value);

// Table columns
const orderColumns = [
  { title: 'ID', key: 'id', width: 120 },
  { title: 'Client', key: 'client' },
  { title: 'Statut', key: 'status', render: row => h(NTag, { type: getStatusType(row.status), size: 'small' }, () => getStatusLabel(row.status)) },
  { title: 'Prix', key: 'price', render: row => `${row.price} €` },
];

const fullOrderColumns = [
  { title: 'ID', key: 'id', width: 130 },
  { title: 'Client', key: 'client' },
  { title: 'Description', key: 'description', ellipsis: { tooltip: true } },
  { title: 'Statut', key: 'status', width: 120, render: row => h(NTag, { type: getStatusType(row.status), size: 'small' }, () => getStatusLabel(row.status)) },
  { title: 'Priorité', key: 'priority', width: 100, render: row => h(NTag, { type: row.priority === 'urgent' ? 'error' : row.priority === 'high' ? 'warning' : 'default', size: 'small' }, () => row.priority) },
  { title: 'Échéance', key: 'deadline', width: 110 },
  { title: 'Prix', key: 'price', width: 80, render: row => `${row.price} €` },
  { title: 'Actions', key: 'actions', width: 100, render: () => h(NButton, { size: 'tiny' }, () => 'Voir') },
];

const clientColumns = [
  { title: 'Nom', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Téléphone', key: 'phone' },
  { title: 'Type', key: 'type', render: row => h(NTag, { type: row.type === 'pro' ? 'info' : 'default', size: 'small' }, () => row.type) },
  { title: 'Commandes', key: 'orders' },
  { title: 'CA Total', key: 'totalSpent', render: row => `${row.totalSpent.toLocaleString()} €` },
  { title: 'Actions', key: 'actions', render: () => h(NButton, { size: 'tiny' }, () => 'Voir') },
];

const quoteColumns = [
  { title: 'N°', key: 'id' },
  { title: 'Client', key: 'client' },
  { title: 'Montant', key: 'amount', render: row => `${row.amount} €` },
  { title: 'Statut', key: 'status', render: row => h(NTag, { type: row.status === 'sent' ? 'info' : 'default', size: 'small' }, () => row.status) },
];

const invoiceColumns = [
  { title: 'N°', key: 'id' },
  { title: 'Client', key: 'client' },
  { title: 'Montant', key: 'amount', render: row => `${row.amount} €` },
  { title: 'Statut', key: 'status', render: row => h(NTag, { type: row.status === 'paid' ? 'success' : 'warning', size: 'small' }, () => row.status === 'paid' ? 'Payée' : 'En attente') },
];

// Functions
function getStatusType(status) {
  const types = { printing: 'success', idle: 'default', paused: 'warning', maintenance: 'error', pending: 'warning', completed: 'success', review: 'info' };
  return types[status] || 'default';
}

function getStatusLabel(status) {
  const labels = { printing: 'En impression', idle: 'Disponible', paused: 'En pause', maintenance: 'Maintenance', pending: 'En attente', completed: 'Terminée', review: 'Vérification' };
  return labels[status] || status;
}

function startPrint(printer) { console.log('Start print', printer); }
function pausePrint(printer) { console.log('Pause print', printer); }
function resumePrint(printer) { console.log('Resume print', printer); }
function showPrinterSettings(printer) { console.log('Settings', printer); }
function openReorderModal(item) { console.log('Reorder', item); }
function createOrder() { console.log('Create order', newOrder.value); showNewOrderModal.value = false; }
function createQuoteFromCalc() { console.log('Create quote from calc'); }
</script>

<style scoped>
.print3d-manager {
  min-height: 100vh;
  background: #0a0a0a;
  padding-bottom: 3rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0,0,0,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-icon {
  font-size: 2rem;
}

.app-title h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #f5f5f5;
}

.app-subtitle {
  font-size: 0.8rem;
  color: #737373;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dashboard-stats {
  padding: 1.5rem 2rem;
}

.stat-card {
  text-align: center;
}

.stat-card.warning {
  border-color: #F59E0B;
}

.main-tabs {
  padding: 0 2rem;
}

.printer-status {
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
}

.inventory-item {
  padding: 0.5rem;
  border-radius: 6px;
}

.inventory-item:hover {
  background: rgba(255,255,255,0.03);
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
}

.printer-card {
  transition: all 0.3s;
}

.printer-card.printing {
  border-color: #10B981;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .header-right {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-tabs {
    padding: 0 1rem;
  }
  
  .dashboard-stats {
    padding: 1rem;
  }
}
</style>
