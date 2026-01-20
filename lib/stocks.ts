import YahooFinance from 'yahoo-finance2';
import { Stock, HistoricalData, ScreenerFilters } from '@/types';
import { getSymbolsByExchange } from './symbols';
import { calculateRSI } from './indicators';

const yahooFinance = new YahooFinance();

interface ChartQuote {
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

interface ChartResult {
  quotes: ChartQuote[];
}

interface QuoteResult {
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
}

/**
 * Fetch historical data for a stock symbol
 */
export async function getHistoricalData(
  symbol: string,
  days: number = 30
): Promise<HistoricalData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d',
    }) as ChartResult;

    if (!result.quotes || result.quotes.length === 0) {
      return [];
    }

    return result.quotes
      .filter(q => q.close !== null && q.close !== undefined)
      .map(q => ({
        date: new Date(q.date),
        open: q.open ?? 0,
        high: q.high ?? 0,
        low: q.low ?? 0,
        close: q.close ?? 0,
        volume: q.volume ?? 0,
      }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch current quote for a stock symbol
 */
export async function getQuote(symbol: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
} | null> {
  try {
    const quote = await yahooFinance.quote(symbol) as QuoteResult;

    if (!quote || !quote.regularMarketPrice) {
      return null;
    }

    return {
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Process a single stock: fetch data and calculate RSI
 */
async function processStock(
  symbol: string,
  name: string,
  exchange: 'NYSE' | 'NASDAQ'
): Promise<Stock | null> {
  try {
    // Fetch historical data and current quote in parallel
    const [historicalData, quote] = await Promise.all([
      getHistoricalData(symbol, 30), // 30 days for RSI calculation
      getQuote(symbol),
    ]);

    if (!quote || historicalData.length < 15) {
      return null;
    }

    const rsi = calculateRSI(historicalData);

    if (rsi === null) {
      return null;
    }

    return {
      symbol,
      name,
      exchange,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      rsi,
    };
  } catch (error) {
    console.error(`Error processing ${symbol}:`, error);
    return null;
  }
}

/**
 * Screen stocks based on filters
 */
export async function screenStocks(filters: ScreenerFilters): Promise<Stock[]> {
  const symbols = getSymbolsByExchange(filters.exchanges);

  // Process stocks in batches to avoid rate limiting
  const batchSize = 5;
  const results: Stock[] = [];

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchPromises = batch.map(stock =>
      processStock(stock.symbol, stock.name, stock.exchange)
    );

    const batchResults = await Promise.all(batchPromises);

    for (const stock of batchResults) {
      if (stock && stock.rsi <= filters.rsiThreshold) {
        results.push(stock);
      }
    }

    // Small delay between batches to be respectful of the API
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sort by RSI (lowest first)
  return results.sort((a, b) => a.rsi - b.rsi);
}
