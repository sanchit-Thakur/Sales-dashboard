import { Router } from 'express';
import {
  getOverview,
  getBrands,
  getProducts,
  getProductById,
  getTimeSeries,
  getForecast,
  simulateWhatIf,
  getCustomerSegments,
  getMarketBasket,
  getAnomalies,
  getExecutiveInsights,
  exportCsv
} from '../controllers/salesController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/brands', getBrands);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/timeseries', getTimeSeries);
router.get('/forecast', getForecast);
router.post('/simulate', simulateWhatIf);
router.get('/customer-segments', getCustomerSegments);
router.get('/market-basket', getMarketBasket);
router.get('/anomalies', getAnomalies);
router.get('/insights', getExecutiveInsights);
router.get('/export-csv', exportCsv);

export default router;
