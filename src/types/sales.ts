export interface Brand {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  logoIcon: string;
  established: number;
  grossRevenue: number;
  netRevenue: number;
  grossProfit: number;
  profitMargin: number;
  unitsSold: number;
  orderCount: number;
  avgOrderValue: number;
  marketShare: number;
  yoyGrowth: number;
  cac: number;
  ltv: number;
  csat: number;
  productCount: number;
}

export interface RegionalDist {
  region: string;
  units: number;
  revenue: number;
}

export interface ChannelDist {
  channel: string;
  units: number;
  revenue: number;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  basePrice: number;
  unitCost: number;
  grossRevenue: number;
  netRevenue: number;
  grossProfit: number;
  profitMargin: number;
  unitsSold: number;
  avgOrderValue: number;
  priceElasticity: number;
  rating: number;
  returnRate: number;
  inventoryTurnover: number;
  sparkline: number[];
  regionalDistribution: RegionalDist[];
  channelDistribution: ChannelDist[];
}

export interface TimeSeriesPoint {
  date: string;
  netRevenue: number;
  grossRevenue: number;
  grossProfit: number;
  unitsSold: number;
  orders: number;
  marginPct: number;
  auratechRevenue?: number;
  novastyleRevenue?: number;
  apexlivingRevenue?: number;
  vitalishealthRevenue?: number;
  pulseaudioRevenue?: number;
}

export interface KPIOverview {
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalGrossProfit: number;
  overallMarginPct: number;
  totalUnitsSold: number;
  avgOrderValue: number;
  yoyGrowthPct: number;
  cac: number;
  ltv: number;
  returnRatePct: number;
}

export interface ExecutiveInsights {
  summary: string;
  keyDrivers: string[];
  risksAndAnomalies: string[];
  actionableStrategies: string[];
}

export interface ForecastPoint {
  date: string;
  historical?: number;
  forecast: number;
  lowerConfidence95: number;
  upperConfidence95: number;
  trend: number;
  seasonality: number;
  residuals?: number;
}

export interface ForecastResult {
  brand: string;
  metric: string;
  modelName: string;
  horizonDays: number;
  accuracy: {
    rmse: number;
    mae: number;
    mapePct: number;
    rSquared: number;
  };
  seasonalityStrength: number;
  historicalTrendSlope: number;
  data: ForecastPoint[];
  seasonalDecomposition: {
    period: string;
    seasonalIndex: number;
    interpretation: string;
  }[];
}

export interface SimulationResult {
  baseline: {
    unitPrice: number;
    unitsSold: number;
    grossRevenue: number;
    netRevenue: number;
    totalCost: number;
    grossProfit: number;
    profitMarginPct: number;
  };
  simulated: {
    unitPrice: number;
    unitsSold: number;
    grossRevenue: number;
    netRevenue: number;
    totalCost: number;
    grossProfit: number;
    profitMarginPct: number;
  };
  deltas: {
    unitPriceDeltaPct: number;
    unitsSoldDeltaPct: number;
    netRevenueDeltaPct: number;
    grossProfitDeltaPct: number;
    marginDeltaPct: number;
  };
  elasticityCoefficient: number;
  demandCurve: { price: number; predictedVolume: number; predictedRevenue: number; predictedProfit: number }[];
  recommendation: string;
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  avgMonetary: number;
  avgRecencyDays: number;
  avgFrequency: number;
  revenueContribution: number;
  revenueSharePct: number;
  color: string;
  description: string;
}

export interface MarketBasketItem {
  itemA: string;
  brandA: string;
  itemB: string;
  brandB: string;
  support: number;
  confidence: number;
  lift: number;
  recommendedBundleDiscount: string;
}

export interface AnomalyItem {
  id: string;
  date: string;
  brand: string;
  product: string;
  type: string;
  severity: string;
  metric: string;
  observedValue: number;
  expectedValue: number;
  zScore: number;
  rootCause: string;
}
