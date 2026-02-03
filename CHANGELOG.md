# Changelog

All notable changes to the Stock Screener project are documented in this file.

## [Unreleased]

## [0.3.0] - 2026-02-03

### Added
- **ETF Screener Page** (`/etfs`)
  - New page for screening Exchange-Traded Funds
  - Filter by category: Equity, Bond, Sector, International, Commodity
  - Filter by minimum dividend yield percentage
  - Filter by maximum expense ratio percentage
  - Display performance metrics: 1-year, 3-year, 5-year returns
  - Color-coded returns (green for positive, red for negative)
  - Category badges with distinct colors
  - TradingView links for each ETF symbol
  - Pagination support (10 items per page)

- **ETF Data Layer**
  - `lib/etf-symbols.ts`: Defines 34 popular ETFs across 5 categories
    - Equity: SPY, VOO, IVV, VTI, QQQ, IWM, DIA
    - Sector: XLK, XLF, XLE, XLV, XLY, XLP, XLI, XLU, XLRE
    - Bond: BND, AGG, TLT, LQD, HYG, SHY
    - International: VEA, VWO, EFA, EEM, IEFA
    - Commodity: GLD, SLV, USO, DBC
  - `lib/etfs.ts`: ETF data fetching using yahoo-finance2 quoteSummary API
    - Fetches price, dividend yield, expense ratio, trailing returns
    - Batch processing (5 at a time) to respect API rate limits

- **ETF API Endpoint**
  - `app/api/etf-screener/route.ts`: GET endpoint for ETF screening
  - Query parameters: categories, minDividendYield, maxExpenseRatio
  - Returns: etfs array, total count, filtered count

- **ETF Components**
  - `components/ETFFilterPanel.tsx`: Category toggles, yield/expense inputs
  - `components/ETFTable.tsx`: Results table with pagination

- **Type Definitions** (in `types/index.ts`)
  - `ETFCategory`: 'Equity' | 'Bond' | 'Sector' | 'International' | 'Commodity'
  - `ETF`: Full ETF data structure with performance metrics
  - `ETFScreenerFilters`: Filter configuration interface
  - `ETFScreenerResponse`: API response structure

### Changed
- **Header Navigation**
  - Renamed "Screener" to "Stocks" in navigation
  - Added "ETFs" link pointing to `/etfs`
  - Implemented dynamic active state using `usePathname()` hook

## [0.2.0] - Previous

### Added
- TradingView hyperlinks for ticker symbols
- Pagination for stock results

## [0.1.0] - Initial

### Added
- Initial stock screener with RSI filter
- NYSE and NASDAQ exchange filtering
- RSI threshold configuration
- Stock table with price, change, and RSI display

---

## Architecture Notes

### Data Flow
```
User → FilterPanel → API Route → lib/etfs.ts → yahoo-finance2 → Response → Table
```

### Key Files
| File | Purpose |
|------|---------|
| `app/etfs/page.tsx` | ETF screener page component |
| `app/api/etf-screener/route.ts` | ETF API endpoint |
| `lib/etfs.ts` | ETF data fetching logic |
| `lib/etf-symbols.ts` | ETF symbol definitions |
| `components/ETFFilterPanel.tsx` | Filter UI component |
| `components/ETFTable.tsx` | Results table component |
| `types/index.ts` | TypeScript type definitions |

### API Usage
The ETF screener uses `yahoo-finance2` quoteSummary with modules:
- `price`: Current price, change, change percent
- `summaryDetail`: Dividend yield
- `fundProfile`: Expense ratio
- `fundPerformance`: 1Y, 3Y, 5Y trailing returns
