'use client';

import { ETF, ETFCategory } from '@/types';

interface ETFTableProps {
  etfs: ETF[];
  isLoading: boolean;
  total: number;
  filtered: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const CATEGORY_BADGE_COLORS: Record<ETFCategory, string> = {
  Equity: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Bond: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Sector: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  International: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Commodity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export default function ETFTable({
  etfs,
  isLoading,
  total,
  filtered,
  currentPage,
  pageSize,
  onPageChange,
}: ETFTableProps) {
  const totalPages = Math.ceil(etfs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedETFs = etfs.slice(startIndex, endIndex);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercent = (value: number | null): string => {
    if (value === null) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatYield = (value: number | null): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const getReturnColor = (value: number | null): string => {
    if (value === null) return 'text-gray-400';
    return value >= 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
          <p className="text-gray-500 dark:text-gray-400">
            Fetching ETF data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-foreground">Results</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Found {filtered} ETFs out of {total} screened
          {etfs.length > 0 && (
            <span className="ml-2">
              (showing {startIndex + 1}-{Math.min(endIndex, etfs.length)} of {etfs.length})
            </span>
          )}
        </p>
      </div>

      {etfs.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          {total === 0
            ? 'Click "Screen ETFs" to start screening'
            : 'No ETFs match the current filter criteria'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Div Yield
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Exp Ratio
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    1Y
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    3Y
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    5Y
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedETFs.map(etf => (
                  <tr
                    key={etf.symbol}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a
                        href={`https://www.tradingview.com/chart/ZxrCOvdR/?symbol=${encodeURIComponent('AMEX:' + etf.symbol)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {etf.symbol}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm">
                      {etf.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${CATEGORY_BADGE_COLORS[etf.category]}`}
                      >
                        {etf.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-mono text-foreground">
                      {formatPrice(etf.price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-mono text-foreground">
                      {formatYield(etf.dividendYield)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-mono text-foreground">
                      {formatYield(etf.expenseRatio)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-right font-mono ${getReturnColor(etf.return1Y)}`}>
                      {formatPercent(etf.return1Y)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-right font-mono ${getReturnColor(etf.return3Y)}`}>
                      {formatPercent(etf.return3Y)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-right font-mono ${getReturnColor(etf.return5Y)}`}>
                      {formatPercent(etf.return5Y)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="px-1 text-gray-400">
                        {page}
                      </span>
                    )
                  ))}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
