'use client';

import RsiFilter from './filters/RsiFilter';

interface FilterPanelProps {
  exchanges: ('NYSE' | 'NASDAQ')[];
  rsiThreshold: number;
  onExchangeChange: (exchanges: ('NYSE' | 'NASDAQ')[]) => void;
  onRsiChange: (value: number) => void;
  onApply: () => void;
  isLoading: boolean;
}

export default function FilterPanel({
  exchanges,
  rsiThreshold,
  onExchangeChange,
  onRsiChange,
  onApply,
  isLoading,
}: FilterPanelProps) {
  const handleExchangeToggle = (exchange: 'NYSE' | 'NASDAQ') => {
    if (exchanges.includes(exchange)) {
      // Don't allow deselecting all exchanges
      if (exchanges.length > 1) {
        onExchangeChange(exchanges.filter(e => e !== exchange));
      }
    } else {
      onExchangeChange([...exchanges, exchange]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Filters</h2>

      <div className="space-y-6">
        {/* Exchange Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Exchanges
          </label>
          <div className="flex gap-3">
            {(['NYSE', 'NASDAQ'] as const).map(exchange => (
              <button
                key={exchange}
                onClick={() => handleExchangeToggle(exchange)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  exchanges.includes(exchange)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {exchange}
              </button>
            ))}
          </div>
        </div>

        {/* RSI Filter */}
        <RsiFilter value={rsiThreshold} onChange={onRsiChange} />

        {/* Apply Button */}
        <button
          onClick={onApply}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Screening...
            </>
          ) : (
            'Screen Stocks'
          )}
        </button>
      </div>
    </div>
  );
}
