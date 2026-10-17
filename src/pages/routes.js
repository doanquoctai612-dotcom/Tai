export const routes = {
  overview: { title:'Tổng quan', metrics:['gmv','sessions','cr','aov','adSpend','affiliateRevenue'] },
  gmv: { title:'GMV', metrics:['gmv','orders'] },
  traffic: { title:'Traffic', metrics:['sessions'] },
  cr: { title:'Conversion rate', metrics:['cr','orders','sessions'] },
  aov: { title:'Average order value', metrics:['aov','gmv','orders'] },
  ads: { title:'Ads', metrics:['adSpend','adRevenue','roas','ctr','cpc'] },
  affiliate: { title:'Affiliate', metrics:['affiliateRevenue','affiliateOrders','commission','affiliateAov'] },
  todos: { title:'Todo hằng ngày', metrics:[] }
};
