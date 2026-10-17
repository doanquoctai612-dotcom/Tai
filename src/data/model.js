export const numericFields = ['gmv','orders','sessions','adSpend','adRevenue','impressions','clicks','affiliateRevenue','affiliateOrders','commission'];
export function validateSnapshot(data) {
  if (data?.schemaVersion !== 1 || data.currency !== 'VND' || data.timezone !== 'Asia/Ho_Chi_Minh' || !Array.isArray(data.daily)) throw new Error('Sai phiên bản hoặc cấu trúc dữ liệu');
  const dates = new Set();
  for (const row of data.daily) {
    if (!validDate(row.date) || dates.has(row.date)) throw new Error('Ngày không hợp lệ hoặc trùng ngày');
    dates.add(row.date);
    for (const key of numericFields) {
      if (!Number.isFinite(row[key]) || row[key] < 0) throw new Error('Thiếu hoặc sai chỉ số: ' + key);
    }
    for (const key of ['orders','sessions','impressions','clicks','affiliateOrders']) {
      if (!Number.isInteger(row[key])) throw new Error('Chỉ số đếm phải là số nguyên: ' + key);
    }
  }
  return data;
}
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
