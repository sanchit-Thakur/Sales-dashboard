import { Request, Response } from 'express';
import {
  BRANDS,
  PRODUCTS,
  MONTHLY_TIME_SERIES,
  CUSTOMER_SEGMENTS_DATA,
  MARKET_BASKET_AFFINITIES,
  ANOMALIES_DATA
} from '../data/mockSalesData.js';
import { DataScienceService } from '../services/dataScienceService.js';

export const getOverview = (req: Request, res: Response) => {
  const brandFilter = (req.query.brand as string) || 'All';
  const timeRange = (req.query.timeRange as string) || 'All';

  let filteredProducts = PRODUCTS;
  let filteredBrands = BRANDS;
  let timeSeries = MONTHLY_TIME_SERIES;

  if (brandFilter !== 'All') {
    filteredProducts = PRODUCTS.filter(p => p.brand.toLowerCase() === brandFilter.toLowerCase());
    filteredBrands = BRANDS.filter(b => b.name.toLowerCase() === brandFilter.toLowerCase());
  }

  // Calculate totals
  const totalGrossRevenue = filteredProducts.reduce((acc, p) => acc + p.grossRevenue, 0);
  const totalNetRevenue = filteredProducts.reduce((acc, p) => acc + p.netRevenue, 0);
  const totalGrossProfit = filteredProducts.reduce((acc, p) => acc + p.grossProfit, 0);
  const totalUnitsSold = filteredProducts.reduce((acc, p) => acc + p.unitsSold, 0);
  const overallMarginPct = totalNetRevenue > 0 ? Math.round((totalGrossProfit / totalNetRevenue) * 10000) / 100 : 0;
  const avgOrderValue = totalUnitsSold > 0 ? Math.round((totalNetRevenue / (totalUnitsSold * 0.85)) * 100) / 100 : 0;

  const insights = DataScienceService.generateExecutiveInsights(brandFilter);

  res.json({
    status: 'success',
    data: {
      kpis: {
        totalGrossRevenue,
        totalNetRevenue,
        totalGrossProfit,
        overallMarginPct,
        totalUnitsSold,
        avgOrderValue,
        yoyGrowthPct: brandFilter === 'All' ? 27.4 : filteredBrands[0]?.yoyGrowth || 24.5,
        cac: brandFilter === 'All' ? 38.5 : filteredBrands[0]?.cac || 42.0,
        ltv: brandFilter === 'All' ? 410.0 : filteredBrands[0]?.ltv || 495.0,
        returnRatePct: 2.85
      },
      brands: filteredBrands,
      topProducts: filteredProducts.slice(0, 8),
      timeSeries,
      insights
    }
  });
};

export const getBrands = (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: BRANDS
  });
};

export const getProducts = (req: Request, res: Response) => {
  const { brand, category, search, sortBy } = req.query;

  let result = [...PRODUCTS];

  if (brand && brand !== 'All') {
    result = result.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (sortBy) {
    if (sortBy === 'revenue_desc') result.sort((a, b) => b.netRevenue - a.netRevenue);
    else if (sortBy === 'revenue_asc') result.sort((a, b) => a.netRevenue - b.netRevenue);
    else if (sortBy === 'units_desc') result.sort((a, b) => b.unitsSold - a.unitsSold);
    else if (sortBy === 'margin_desc') result.sort((a, b) => b.profitMargin - a.profitMargin);
    else if (sortBy === 'rating_desc') result.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    status: 'success',
    count: result.length,
    data: result
  });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ status: 'error', message: `Product ${id} not found` });
  }

  res.json({
    status: 'success',
    data: product
  });
};

export const getTimeSeries = (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: MONTHLY_TIME_SERIES
  });
};

export const getForecast = (req: Request, res: Response) => {
  const brand = (req.query.brand as string) || 'All';
  const horizon = parseInt((req.query.horizon as string) || '6', 10);
  const modelType = (req.query.model as any) || 'holt-winters';

  const forecast = DataScienceService.generateForecast(brand, horizon, modelType);
  res.json({
    status: 'success',
    data: forecast
  });
};

export const simulateWhatIf = (req: Request, res: Response) => {
  const { brandId, productId, priceChangePct, discountChangePct, marketingSpendChangePct, unitCostChangePct } = req.body;

  const result = DataScienceService.simulateWhatIf({
    brandId,
    productId: productId || PRODUCTS[0].id,
    priceChangePct: Number(priceChangePct) || 0,
    discountChangePct: Number(discountChangePct) || 0,
    marketingSpendChangePct: Number(marketingSpendChangePct) || 0,
    unitCostChangePct: Number(unitCostChangePct) || 0
  });

  res.json({
    status: 'success',
    data: result
  });
};

export const getCustomerSegments = (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: CUSTOMER_SEGMENTS_DATA
  });
};

export const getMarketBasket = (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: MARKET_BASKET_AFFINITIES
  });
};

export const getAnomalies = (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: ANOMALIES_DATA
  });
};

export const getExecutiveInsights = (req: Request, res: Response) => {
  const brand = req.query.brand as string;
  const insights = DataScienceService.generateExecutiveInsights(brand);
  res.json({
    status: 'success',
    data: insights
  });
};

export const exportCsv = (_req: Request, res: Response) => {
  let csvContent = 'product_id,brand,product_name,category,base_price,unit_cost,gross_revenue,net_revenue,gross_profit,margin_pct,units_sold,rating\n';
  
  PRODUCTS.forEach(p => {
    csvContent += `"${p.id}","${p.brand}","${p.name}","${p.category}",${p.basePrice},${p.unitCost},${p.grossRevenue},${p.netRevenue},${p.grossProfit},${p.profitMargin},${p.unitsSold},${p.rating}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="omnisales_products_export.csv"');
  res.status(200).send(csvContent);
};
