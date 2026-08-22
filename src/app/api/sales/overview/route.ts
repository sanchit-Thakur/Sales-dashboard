import { NextResponse } from 'next/server';
import { MOCK_BRANDS, MOCK_PRODUCTS, MOCK_MONTHLY_TIME_SERIES } from '@/lib/mockData';
import { DataScienceService } from '@/lib/dataScienceService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand') || 'All';

  let filteredProducts = MOCK_PRODUCTS;
  let filteredBrands = MOCK_BRANDS;

  if (brand !== 'All') {
    filteredProducts = MOCK_PRODUCTS.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    filteredBrands = MOCK_BRANDS.filter(b => b.name.toLowerCase() === brand.toLowerCase());
  }

  const totalGrossRevenue = filteredProducts.reduce((acc, p) => acc + p.grossRevenue, 0);
  const totalNetRevenue = filteredProducts.reduce((acc, p) => acc + p.netRevenue, 0);
  const totalGrossProfit = filteredProducts.reduce((acc, p) => acc + p.grossProfit, 0);
  const totalUnitsSold = filteredProducts.reduce((acc, p) => acc + p.unitsSold, 0);
  const overallMarginPct = totalNetRevenue > 0 ? Math.round((totalGrossProfit / totalNetRevenue) * 10000) / 100 : 0;
  const avgOrderValue = totalUnitsSold > 0 ? Math.round((totalNetRevenue / (totalUnitsSold * 0.85)) * 100) / 100 : 0;

  const insights = DataScienceService.generateExecutiveInsights(brand);

  return NextResponse.json({
    status: 'success',
    data: {
      kpis: {
        totalGrossRevenue,
        totalNetRevenue,
        totalGrossProfit,
        overallMarginPct,
        totalUnitsSold,
        avgOrderValue,
        yoyGrowthPct: brand === 'All' ? 27.4 : filteredBrands[0]?.yoyGrowth || 24.5,
        cac: brand === 'All' ? 38.5 : filteredBrands[0]?.cac || 42.0,
        ltv: brand === 'All' ? 410.0 : filteredBrands[0]?.ltv || 495.0,
        returnRatePct: 2.85
      },
      brands: filteredBrands,
      topProducts: filteredProducts.slice(0, 8),
      timeSeries: MOCK_MONTHLY_TIME_SERIES,
      insights
    }
  });
}
