interface StockSymbol {
  symbol: string;
  name: string;
  exchange: 'NYSE' | 'NASDAQ';
}

// Top NYSE stocks (S&P 500 components and major market cap)
export const NYSE_SYMBOLS: StockSymbol[] = [
  { symbol: 'JPM', name: 'JPMorgan Chase', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc', exchange: 'NYSE' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart', exchange: 'NYSE' },
  { symbol: 'PG', name: 'Procter & Gamble', exchange: 'NYSE' },
  { symbol: 'MA', name: 'Mastercard', exchange: 'NYSE' },
  { symbol: 'UNH', name: 'UnitedHealth', exchange: 'NYSE' },
  { symbol: 'HD', name: 'Home Depot', exchange: 'NYSE' },
  { symbol: 'BAC', name: 'Bank of America', exchange: 'NYSE' },
  { symbol: 'DIS', name: 'Walt Disney', exchange: 'NYSE' },
  { symbol: 'KO', name: 'Coca-Cola', exchange: 'NYSE' },
  { symbol: 'PFE', name: 'Pfizer', exchange: 'NYSE' },
  { symbol: 'VZ', name: 'Verizon', exchange: 'NYSE' },
  { symbol: 'MRK', name: 'Merck', exchange: 'NYSE' },
  { symbol: 'CVX', name: 'Chevron', exchange: 'NYSE' },
  { symbol: 'XOM', name: 'Exxon Mobil', exchange: 'NYSE' },
  { symbol: 'ABT', name: 'Abbott Labs', exchange: 'NYSE' },
  { symbol: 'CRM', name: 'Salesforce', exchange: 'NYSE' },
  { symbol: 'ORCL', name: 'Oracle', exchange: 'NYSE' },
  { symbol: 'NKE', name: 'Nike', exchange: 'NYSE' },
  { symbol: 'T', name: 'AT&T', exchange: 'NYSE' },
  { symbol: 'WFC', name: 'Wells Fargo', exchange: 'NYSE' },
  { symbol: 'C', name: 'Citigroup', exchange: 'NYSE' },
  { symbol: 'GS', name: 'Goldman Sachs', exchange: 'NYSE' },
  { symbol: 'IBM', name: 'IBM', exchange: 'NYSE' },
];

// Top NASDAQ stocks (Tech-heavy, S&P 500 components)
export const NASDAQ_SYMBOLS: StockSymbol[] = [
  { symbol: 'AAPL', name: 'Apple', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet (Google)', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta (Facebook)', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ' },
  { symbol: 'AVGO', name: 'Broadcom', exchange: 'NASDAQ' },
  { symbol: 'COST', name: 'Costco', exchange: 'NASDAQ' },
  { symbol: 'PEP', name: 'PepsiCo', exchange: 'NASDAQ' },
  { symbol: 'ADBE', name: 'Adobe', exchange: 'NASDAQ' },
  { symbol: 'CSCO', name: 'Cisco', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix', exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'AMD', exchange: 'NASDAQ' },
  { symbol: 'INTC', name: 'Intel', exchange: 'NASDAQ' },
  { symbol: 'CMCSA', name: 'Comcast', exchange: 'NASDAQ' },
  { symbol: 'INTU', name: 'Intuit', exchange: 'NASDAQ' },
  { symbol: 'QCOM', name: 'Qualcomm', exchange: 'NASDAQ' },
  { symbol: 'TXN', name: 'Texas Instruments', exchange: 'NASDAQ' },
  { symbol: 'AMGN', name: 'Amgen', exchange: 'NASDAQ' },
  { symbol: 'SBUX', name: 'Starbucks', exchange: 'NASDAQ' },
  { symbol: 'GILD', name: 'Gilead Sciences', exchange: 'NASDAQ' },
  { symbol: 'MDLZ', name: 'Mondelez', exchange: 'NASDAQ' },
  { symbol: 'PYPL', name: 'PayPal', exchange: 'NASDAQ' },
  { symbol: 'BKNG', name: 'Booking Holdings', exchange: 'NASDAQ' },
];

export const ALL_SYMBOLS: StockSymbol[] = [...NYSE_SYMBOLS, ...NASDAQ_SYMBOLS];

export function getSymbolsByExchange(exchanges: ('NYSE' | 'NASDAQ')[]): StockSymbol[] {
  return ALL_SYMBOLS.filter(stock => exchanges.includes(stock.exchange));
}
