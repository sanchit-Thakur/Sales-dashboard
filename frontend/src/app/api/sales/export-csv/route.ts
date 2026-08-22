import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function GET() {
  let csvContent = 'product_id,brand,product_name,category,base_price,unit_cost,gross_revenue,net_revenue,gross_profit,margin_pct,units_sold,rating\n';

  MOCK_PRODUCTS.forEach(p => {
    csvContent += `"${p.id}","${p.brand}","${p.name}","${p.category}",${p.basePrice},${p.unitCost},${p.grossRevenue},${p.netRevenue},${p.grossProfit},${p.profitMargin},${p.unitsSold},${p.rating}\n`;
  });

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="omnisales_products_export.csv"'
    }
  });
}
