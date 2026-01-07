<template>
  <div class="chart-panel glass">
    <div class="chart-panel__header">
      <div>
        <h3 class="chart-panel__title">{{ title }}</h3>
        <span class="chart-panel__subtitle">{{ subtitle }}</span>
      </div>
      <div class="chart-panel__peak" v-if="peak">
        <span class="chart-panel__peak-label">PEAK:</span>
        <span class="chart-panel__peak-value">{{ peak }}</span>
      </div>
    </div>
    
    <div class="chart-panel__container">
      <canvas ref="chartRef"></canvas>
    </div>
    
    <!-- Accessible data table (sr-only) -->
    <table v-if="accessibleData && accessibleData.length" class="sr-only">
      <caption>{{ title }}</caption>
      <thead>
        <tr>
          <th scope="col">Période</th>
          <th scope="col">Valeur</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in accessibleData" :key="index">
          <td>{{ item.label }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Accessible description (fallback) -->
    <p v-if="accessibleDescription" class="sr-only">{{ accessibleDescription }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  Chart,
  LineController,
  DoughnutController,
  LineElement,
  PointElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from 'chart.js';

// Register only what we need (tree-shaking)
Chart.register(
  LineController,
  DoughnutController,
  LineElement,
  PointElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
);

const props = defineProps({
  title: { type: String, default: 'Charge CPU Cluster (%)' },
  subtitle: { type: String, default: 'Intervalle: 24h // Node Capacity: 150+ Users' },
  peak: { type: String, default: null },
  accessibleDescription: { type: String, default: '' },
  accessibleData: { type: Array, default: () => [] }, // [{ label: '00:00', value: '15%' }, ...]
  type: { type: String, default: 'line' }, // 'line' | 'doughnut'
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});

const chartRef = ref(null);
let chartInstance = null;

const getDefaultOptions = () => {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };
  
  if (props.type === 'line') {
    base.scales = {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#71717a', font: { family: 'JetBrains Mono', size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#71717a', font: { family: 'JetBrains Mono', size: 10 } }
      }
    };
  }
  
  return base;
};

const initChart = () => {
  if (!chartRef.value) return;
  
  const ctx = chartRef.value.getContext('2d');
  
  // Chart.js defaults
  Chart.defaults.color = '#71717a';
  Chart.defaults.font.family = 'JetBrains Mono';
  
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: { ...getDefaultOptions(), ...props.options }
  });
};

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  destroyChart();
});

watch(() => props.data, () => {
  destroyChart();
  initChart();
}, { deep: true });
</script>

<style scoped>
.chart-panel {
  padding: var(--space-lg);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.chart-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.chart-panel__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.chart-panel__subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

.chart-panel__peak {
  text-align: right;
}

.chart-panel__peak-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
  margin-right: 0.25rem;
}

.chart-panel__peak-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 700;
}

.chart-panel__container {
  position: relative;
  height: 220px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
