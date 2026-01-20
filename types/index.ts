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
