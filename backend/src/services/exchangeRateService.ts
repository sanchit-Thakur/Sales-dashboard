import { RedisService } from './redisService.js';

export interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  INR: number;
  CAD: number;
  AUD: number;
  JPY: number;
}

export class ExchangeRateService {
  private static CACHE_KEY = 'exchange_rates_usd';

  static async getExchangeRates(): Promise<ExchangeRates> {
    const cached = await RedisService.get<ExchangeRates>(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Default reference rates against USD base
    const rates: ExchangeRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      INR: 83.50,
      CAD: 1.36,
      AUD: 1.52,
      JPY: 155.20,
    };

    await RedisService.set(this.CACHE_KEY, rates, 3600); // Cache for 1 hour
    return rates;
  }

  static async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount;
    const rates = await this.getExchangeRates();
    const fromRate = rates[fromCurrency as keyof ExchangeRates] || 1.0;
    const toRate = rates[toCurrency as keyof ExchangeRates] || 1.0;

    // Convert from source to USD base then to target currency
    const amountInUSD = amount / fromRate;
    return Number((amountInUSD * toRate).toFixed(2));
  }
}
