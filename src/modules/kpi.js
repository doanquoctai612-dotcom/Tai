import { numericFields } from '../data/model.js';
export const ratio = (a,b) => b === 0 ? null : a / b;
export function calculate(rows) {
  const sum = Object.fromEntries(numericFields.map(key => [key, rows.reduce((n,row) => n + row[key],0)]));
  return { ...sum, cr: ratio(sum.orders,sum.sessions), aov: ratio(sum.gmv,sum.orders), roas: ratio(sum.adRevenue,sum.adSpend), ctr: ratio(sum.clicks,sum.impressions), cpc: ratio(sum.adSpend,sum.clicks), affiliateAov: ratio(sum.affiliateRevenue,sum.affiliateOrders) };
}
export const metrics = {
  gmv: ['GMV','money','Giá trị hàng hóa của đơn đã thanh toán; loại đơn hủy, trước hoàn tiền, không gồm phí giao hàng.'],
  sessions: ['Traffic','number','Số phiên truy cập; không phải số người dùng duy nhất.'],
  cr: ['CR','percent','Đơn đã thanh toán / phiên truy cập trong kỳ.'],
  aov: ['AOV','money','GMV / số đơn đã thanh toán trong kỳ.'],
  orders: ['Đơn hàng','number','Số đơn đã thanh toán, loại đơn hủy.'],
  adSpend: ['Chi phí Ads','money','Chi phí quảng cáo trong kỳ.'],
  adRevenue: ['GMV quy thuộc Ads','money','GMV quy thuộc quảng cáo theo cửa sổ của nguồn.'],
  roas: ['ROAS','multiple','GMV quy thuộc Ads / chi phí Ads.'],
  ctr: ['CTR','percent','Số click / số lượt hiển thị.'],
  cpc: ['CPC','money','Chi phí Ads / số click.'],
  affiliateRevenue: ['GMV Affiliate','money','GMV quy thuộc affiliate theo cửa sổ của nguồn.'],
  affiliateOrders: ['Đơn Affiliate','number','Số đơn quy thuộc affiliate.'],
  commission: ['Hoa hồng','money','Hoa hồng affiliate trong kỳ.'],
  affiliateAov: ['AOV Affiliate','money','GMV Affiliate / đơn Affiliate.']
};
