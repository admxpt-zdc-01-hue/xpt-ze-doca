export function calculateMetrics(data) {

  let total = 0;
  let delivered = 0;
  const statusMap = {};

  data.forEach(row => {
    const rawStatus = row['Status'];
    if (!rawStatus) return;

    total++;

    const status = rawStatus.toString().trim().toLowerCase();
    statusMap[rawStatus] = (statusMap[rawStatus] || 0) + 1;

    if (
      (status === 'delivered' || status.endsWith('_delivered')) &&
      !status.includes('return')
    ) {
      delivered++;
    }
  });

  const pending = total - delivered;
  const sla = total > 0 ? ((delivered / total) * 100).toFixed(2) : 0;

  return { total, delivered, pending, sla, statusMap };
}
