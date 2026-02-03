export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
  price: number;
  rsi: number;
  change: number;
  changePercent: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
  price: number;
  change: number;
  changePercent: number;
}

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ScreenerFilters {
  exchanges: ('NYSE' | 'NASDAQ')[];
  rsiThreshold: number;
}

export interface ScreenerResponse {
  stocks: Stock[];
  error?: string;
  total: number;
  filtered: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export type ETFCategory = 'Equity' | 'Bond' | 'Sector' | 'International' | 'Commodity';

export interface ETF {
  symbol: string;
  name: string;
  category: ETFCategory;
  price: number;
  change: number;
  changePercent: number;
  dividendYield: number | null;
  expenseRatio: number | null;
  return1Y: number | null;
  return3Y: number | null;
  return5Y: number | null;
}

export interface ETFScreenerFilters {
  categories: ETFCategory[];
  minDividendYield?: number;
  maxExpenseRatio?: number;
}

export interface ETFScreenerResponse {
  etfs: ETF[];
  error?: string;
  total: number;
  filtered: number;
}
