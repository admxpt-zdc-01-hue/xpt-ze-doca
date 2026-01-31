import { processCSV } from './csvReader.js';
import { renderCharts } from './charts.js';
import { calculateMetrics } from './metrics.js';

const input = document.getElementById('csvInput');
const driverSelect = document.getElementById('driverSelect');
const citySelect = document.getElementById('citySelect');
const kpiSlaCard = document.getElementById('kpiSlaCard');
const cityTableBody = document.getElementById('cityTableBody');

let rawData = [];

const cityMap = {
  '65365-000': 'Zé Doca',
  '65272-000': 'Santa Luzia do Paruá',
  '65274-000': 'Nova Olinda do Maranhão',
  '65368-000': 'Araguanã',
  '65398-000': 'Alto Alegre do Pindaré',
  '65363-000': 'Gov. Newton Bello',
  '65385-000': 'São João do Carú',
  '65378-000': 'Tufilândia',
  '65380-000': 'Bom Jardim'
};

/* SLA COLOR */
function getSlaClass(sla) {
  const v = parseFloat(sla);
  if (v >= 98) return 'sla-green';
  if (v >= 95) return 'sla-yellow';
  return 'sla-red';
}

function applySlaColor(sla) {
  kpiSlaCard.classList.remove('sla-green', 'sla-yellow', 'sla-red');
  kpiSlaCard.classList.add(getSlaClass(sla));
}

/* DASHBOARD */
function updateDashboard(data) {
  const result = calculateMetrics(data);

  document.getElementById('kpiTotal').innerText = result.total;
  document.getElementById('kpiDelivered').innerText = result.delivered;
  document.getElementById('kpiPending').innerText = result.pending;
  document.getElementById('kpiSla').innerText = result.sla + '%';

  applySlaColor(result.sla);
  renderCharts(result);
}

/* TABLE */
function renderCityTable(data) {
  cityTableBody.innerHTML = '';

  const grouped = {};

  data.forEach(row => {
    const city = cityMap[row['Postal Code']];
    if (!city) return;

    if (!grouped[city]) grouped[city] = [];
    grouped[city].push(row);
  });

  Object.keys(grouped).forEach(city => {
    const m = calculateMetrics(grouped[city]);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${city}</td>
      <td>${m.total}</td>
      <td>${m.delivered}</td>
      <td>${m.pending}</td>
      <td class="${getSlaClass(m.sla)}">${m.sla}%</td>
    `;
    cityTableBody.appendChild(tr);
  });
}

/* FILTERS */
function applyFilters() {
  let filtered = [...rawData];

  if (driverSelect.value) {
    filtered = filtered.filter(r => r['Driver Name'] === driverSelect.value);
  }

  if (citySelect.value) {
    filtered = filtered.filter(r => cityMap[r['Postal Code']] === citySelect.value);
  }

  updateDashboard(filtered);
}

/* LOAD CSV */
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  rawData = await processCSV(file);

  // DROPDOWNS
  const drivers = [...new Set(rawData.map(r => r['Driver Name']).filter(Boolean))];
  driverSelect.innerHTML = '<option value="">Todos</option>';
  drivers.forEach(d => driverSelect.innerHTML += `<option>${d}</option>`);

  const cities = [...new Set(rawData.map(r => cityMap[r['Postal Code']]).filter(Boolean))];
  citySelect.innerHTML = '<option value="">Todas</option>';
  cities.forEach(c => citySelect.innerHTML += `<option>${c}</option>`);

  updateDashboard(rawData);
  renderCityTable(rawData);
});

driverSelect.addEventListener('change', applyFilters);
citySelect.addEventListener('change', applyFilters);
