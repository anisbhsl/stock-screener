'use client';

import { ETFCategory } from '@/types';

interface ETFFilterPanelProps {
  categories: ETFCategory[];
  minDividendYield: string;
  maxExpenseRatio: string;
  onCategoryChange: (categories: ETFCategory[]) => void;
  onMinDividendYieldChange: (value: string) => void;
  onMaxExpenseRatioChange: (value: string) => void;
  onApply: () => void;
  isLoading: boolean;
}

const ALL_CATEGORIES: ETFCategory[] = ['Equity', 'Bond', 'Sector', 'International', 'Commodity'];

const CATEGORY_COLORS: Record<ETFCategory, string> = {
  Equity: 'bg-blue-600',
  Bond: 'bg-green-600',
  Sector: 'bg-purple-600',
  International: 'bg-orange-600',
  Commodity: 'bg-yellow-600',
};

export default function ETFFilterPanel({
  categories,
  minDividendYield,
  maxExpenseRatio,
  onCategoryChange,
  onMinDividendYieldChange,
  onMaxExpenseRatioChange,
  onApply,
  isLoading,
}: ETFFilterPanelProps) {
  const handleCategoryToggle = (category: ETFCategory) => {
    if (categories.includes(category)) {
      // Don't allow deselecting all categories
      if (categories.length > 1) {
        onCategoryChange(categories.filter(c => c !== category));
      }
    } else {
      onCategoryChange([...categories, category]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Filters</h2>

      <div className="space-y-6">
        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Categories</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categories.includes(category)
                    ? `${CATEGORY_COLORS[category]} text-white`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Min Dividend Yield */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Min Dividend Yield (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={minDividendYield}
            onChange={(e) => onMinDividendYieldChange(e.target.value)}
            placeholder="e.g., 1.5"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Expense Ratio */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Max Expense Ratio (%)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={maxExpenseRatio}
            onChange={(e) => onMaxExpenseRatioChange(e.target.value)}
            placeholder="e.g., 0.5"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

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
            'Screen ETFs'
          )}
        </button>
      </div>
    </div>
  );
}
