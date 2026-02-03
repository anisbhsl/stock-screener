import YahooFinance from 'yahoo-finance2';
import { ETF, ETFScreenerFilters } from '@/types';
import { getETFsByCategory, ETFSymbol } from './etf-symbols';

const yahooFinance = new YahooFinance();

interface QuoteSummaryResult {
  price?: {
    regularMarketPrice?: number;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
  };
  summaryDetail?: {
    dividendYield?: number;
    trailingAnnualDividendYield?: number;
  };
  fundProfile?: {
    feesExpensesInvestment?: {
      annualReportExpenseRatio?: number;
    };
  };
  fundPerformance?: {
    trailingReturns?: {
      oneYear?: number;
      threeYear?: number;
      fiveYear?: number;
    };
  };
}

/**
 * Fetch ETF data using quoteSummary API
 */
async function fetchETFData(symbol: string, name: string, category: ETF['category']): Promise<ETF | null> {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail', 'fundProfile', 'fundPerformance'],
    }) as QuoteSummaryResult;

    if (!result?.price?.regularMarketPrice) {
      return null;
    }

    const price = result.price;
    const summaryDetail = result.summaryDetail;
    const fundProfile = result.fundProfile;
    const fundPerformance = result.fundPerformance;

    // Get dividend yield (as percentage)
    let dividendYield: number | null = null;
    if (summaryDetail?.dividendYield !== undefined) {
      dividendYield = summaryDetail.dividendYield * 100;
    } else if (summaryDetail?.trailingAnnualDividendYield !== undefined) {
      dividendYield = summaryDetail.trailingAnnualDividendYield * 100;
    }

    // Get expense ratio (as percentage)
    let expenseRatio: number | null = null;
    if (fundProfile?.feesExpensesInvestment?.annualReportExpenseRatio !== undefined) {
      expenseRatio = fundProfile.feesExpensesInvestment.annualReportExpenseRatio * 100;
    }

    // Get trailing returns
    const trailingReturns = fundPerformance?.trailingReturns;
    const return1Y = trailingReturns?.oneYear !== undefined ? trailingReturns.oneYear * 100 : null;
    const return3Y = trailingReturns?.threeYear !== undefined ? trailingReturns.threeYear * 100 : null;
    const return5Y = trailingReturns?.fiveYear !== undefined ? trailingReturns.fiveYear * 100 : null;

    return {
      symbol,
      name,
      category,
      price: price.regularMarketPrice!,
      change: price.regularMarketChange ?? 0,
      changePercent: price.regularMarketChangePercent ?? 0,
      dividendYield,
      expenseRatio,
      return1Y,
      return3Y,
      return5Y,
    };
  } catch (error) {
    console.error(`Error fetching ETF data for ${symbol}:`, error);
    return null;
  }
}

/**
 * Screen ETFs based on filters
 */
export async function screenETFs(filters: ETFScreenerFilters): Promise<ETF[]> {
  const etfSymbols = getETFsByCategory(filters.categories);

  // Process ETFs in batches to avoid rate limiting
  const batchSize = 5;
  const results: ETF[] = [];

  for (let i = 0; i < etfSymbols.length; i += batchSize) {
    const batch = etfSymbols.slice(i, i + batchSize);
    const batchPromises = batch.map((etf: ETFSymbol) =>
      fetchETFData(etf.symbol, etf.name, etf.category)
    );

    const batchResults = await Promise.all(batchPromises);

    for (const etf of batchResults) {
      if (etf) {
        // Apply filters
        if (filters.minDividendYield !== undefined && etf.dividendYield !== null) {
          if (etf.dividendYield < filters.minDividendYield) {
            continue;
          }
        }

        if (filters.maxExpenseRatio !== undefined && etf.expenseRatio !== null) {
          if (etf.expenseRatio > filters.maxExpenseRatio) {
            continue;
          }
        }

        results.push(etf);
      }
    }

    // Small delay between batches to be respectful of the API
    if (i + batchSize < etfSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sort by 1Y return (highest first), with nulls at the end
  return results.sort((a, b) => {
    if (a.return1Y === null && b.return1Y === null) return 0;
    if (a.return1Y === null) return 1;
    if (b.return1Y === null) return -1;
    return b.return1Y - a.return1Y;
  });
}
