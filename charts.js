let pieChart;
let barChart;

export function renderCharts(data) {

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

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
}
