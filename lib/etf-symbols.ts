import { ETFCategory } from '@/types';

export interface ETFSymbol {
  symbol: string;
  name: string;
  category: ETFCategory;
}

export const ETF_SYMBOLS: ETFSymbol[] = [
  // Equity - Broad Market
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equity' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'Equity' },
  { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', category: 'Equity' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'Equity' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Equity' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'Equity' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial ETF', category: 'Equity' },

  // Sector ETFs
  { symbol: 'XLK', name: 'Technology Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLY', name: 'Consumer Discretionary SPDR', category: 'Sector' },
  { symbol: 'XLP', name: 'Consumer Staples Select SPDR', category: 'Sector' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR', category: 'Sector' },
  { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR', category: 'Sector' },

  // Bond ETFs
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'Bond' },
  { symbol: 'AGG', name: 'iShares Core US Aggregate Bond', category: 'Bond' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond', category: 'Bond' },
  { symbol: 'LQD', name: 'iShares Investment Grade Corp', category: 'Bond' },
  { symbol: 'HYG', name: 'iShares High Yield Corporate', category: 'Bond' },
  { symbol: 'SHY', name: 'iShares 1-3 Year Treasury Bond', category: 'Bond' },

  // International ETFs
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', category: 'International' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets', category: 'International' },
  { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', category: 'International' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets', category: 'International' },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF', category: 'International' },

  // Commodity ETFs
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Commodity' },
  { symbol: 'SLV', name: 'iShares Silver Trust', category: 'Commodity' },
  { symbol: 'USO', name: 'United States Oil Fund', category: 'Commodity' },
  { symbol: 'DBC', name: 'Invesco DB Commodity Index', category: 'Commodity' },
];

export function getETFsByCategory(categories: ETFCategory[]): ETFSymbol[] {
  if (categories.length === 0) {
    return ETF_SYMBOLS;
  }
  return ETF_SYMBOLS.filter(etf => categories.includes(etf.category));
}

export function getAllCategories(): ETFCategory[] {
  return ['Equity', 'Bond', 'Sector', 'International', 'Commodity'];
}
