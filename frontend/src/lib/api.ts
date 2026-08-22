import axios from 'axios';
import {
  Brand,
  Product,
  TimeSeriesPoint,
  KPIOverview,
  ExecutiveInsights,
  ForecastResult,
  SimulationResult,
  CustomerSegment,
  MarketBasketItem,
  AnomalyItem
} from '@/types/sales';
import {
  MOCK_BRANDS,
  MOCK_PRODUCTS,
  MOCK_MONTHLY_TIME_SERIES,
  MOCK_CUSTOMER_SEGMENTS,
  MOCK_MARKET_BASKET,
  MOCK_ANOMALIES
} from './mockData';
import { DataScienceService } from './dataScienceService';

const API_BASE_URL = typeof window !== 'undefined'
  ? '/api/sales'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/sales');

export async function fetchOverview(brand: string = 'All'): Promise<{
  kpis: KPIOverview;
  brands: Brand[];
  topProducts: Product[];
  timeSeries: TimeSeriesPoint[];
  insights: ExecutiveInsights;
}> {
  try {
    const res = await axios.get(`${API_BASE_URL}/overview`, {
      params: { brand },
      timeout: 2500
    });
    return res.data.data;
  } catch (_e) {
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

    return {
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
      insights: DataScienceService.generateExecutiveInsights(brand)
    };
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/brands`, { timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    return MOCK_BRANDS;
  }
}

export async function fetchProducts(params?: { brand?: string; category?: string; search?: string }): Promise<Product[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/products`, { params, timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    let list = [...MOCK_PRODUCTS];
    if (params?.brand && params.brand !== 'All') {
      list = list.filter(p => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function fetchForecast(brand: string = 'All', horizon: number = 6, model: string = 'holt-winters'): Promise<ForecastResult> {
  try {
    const res = await axios.get(`${API_BASE_URL}/forecast`, {
      params: { brand, horizon, model },
      timeout: 2000
    });
    return res.data.data;
  } catch (_e) {
    return DataScienceService.generateForecast(brand, horizon, model as any);
  }
}

export async function runWhatIfSimulation(input: {
  productId: string;
  priceChangePct: number;
  discountChangePct: number;
  marketingSpendChangePct: number;
  unitCostChangePct?: number;
}): Promise<SimulationResult> {
  try {
    const res = await axios.post(`${API_BASE_URL}/simulate`, input, { timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    return DataScienceService.simulateWhatIf(input);
  }
}

export async function fetchCustomerSegments(): Promise<CustomerSegment[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/customer-segments`, { timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    return MOCK_CUSTOMER_SEGMENTS;
  }
}

export async function fetchMarketBasket(): Promise<MarketBasketItem[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/market-basket`, { timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    return MOCK_MARKET_BASKET;
  }
}

export async function fetchAnomalies(): Promise<AnomalyItem[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/anomalies`, { timeout: 2000 });
    return res.data.data;
  } catch (_e) {
    return MOCK_ANOMALIES;
  }
}
