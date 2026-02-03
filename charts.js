let pieChart;
let barChart;

export function renderCharts(data, mode = 'default') {

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  // 🟢 MODO PADRÃO → PIZZA + BARRAS DE STATUS
  if (mode === 'default') {
    pieChart = new Chart(document.getElementById('pieChart'), {
      type: 'pie',
      data: {
        labels: ['Entregues', 'Pendentes'],
        datasets: [{
          data: [data.delivered, data.pending],
          backgroundColor: ['#ff0000', '#333333']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    barChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(data.statusMap),
        datasets: [{
          data: Object.values(data.statusMap),
          backgroundColor: '#ff0000'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    return;
  }

  // 🔴 MODO CIDADE → BARRAS EMPILHADAS POR ENTREGADOR
  if (mode === 'drivers') {
    pieChart = new Chart(document.getElementById('pieChart'), {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Entregues',
            data: data.delivered,
            backgroundColor: '#ff0000'
          },
          {
            label: 'Pendentes',
            data: data.pending,
            backgroundColor: '#333333'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }
}
