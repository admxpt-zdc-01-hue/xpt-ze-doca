export function calculateMetrics(data) {

  let total = 0;
  let delivered = 0;
  const statusMap = {};

  data.forEach(row => {

    const status = row['Status'];

    // 🔴 ignora linhas sem status
    if (!status || status.toString().trim() === '') return;

    const cleanStatus = status.toString().trim();

    total++;

    // conta status
    statusMap[cleanStatus] = (statusMap[cleanStatus] || 0) + 1;

    // regra de entregue
    const statusLower = cleanStatus.toLowerCase();
    if (
      statusLower === 'delivered' ||
      statusLower.endsWith('_delivered')
    ) {
      delivered++;
    }
  });

  const pending = total - delivered;
  const sla = total > 0 ? ((delivered / total) * 100).toFixed(2) : 0;

  return {
    total,
    delivered,
    pending,
    sla,
    statusMap
  };
}
