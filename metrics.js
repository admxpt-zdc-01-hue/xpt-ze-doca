export function calculateMetrics(data) {

  let total = 0;
  let delivered = 0;
  const statusMap = {};
  const driverMap = {};

  data.forEach(row => {

    const status = row['Status'];
    const driver = row['Driver Name'];

    if (!status || status.toString().trim() === '') return;

    const cleanStatus = status.toString().trim();
    const statusLower = cleanStatus.toLowerCase();

    total++;

    statusMap[cleanStatus] = (statusMap[cleanStatus] || 0) + 1;

    if (
      statusLower === 'delivered' ||
      statusLower.endsWith('_delivered')
    ) {
      delivered++;
    }

    // 📦 SLA POR ENTREGADOR
    if (driver) {
      if (!driverMap[driver]) {
        driverMap[driver] = { total: 0, delivered: 0 };
      }

      driverMap[driver].total++;

      if (
        statusLower === 'delivered' ||
        statusLower.endsWith('_delivered')
      ) {
        driverMap[driver].delivered++;
      }
    }
  });

  const pending = total - delivered;
  const sla = total > 0 ? ((delivered / total) * 100).toFixed(2) : 0;

  // 🧮 Calcula SLA %
  const driverSLA = Object.entries(driverMap).map(([name, info]) => ({
    name,
    sla: ((info.delivered / info.total) * 100).toFixed(1)
  }));

  return {
    total,
    delivered,
    pending,
    sla,
    statusMap,
    driverSLA
  };
}
