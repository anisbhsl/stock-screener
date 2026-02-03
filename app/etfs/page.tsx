'use client';

import { useState } from 'react';
import ETFFilterPanel from '@/components/ETFFilterPanel';
import ETFTable from '@/components/ETFTable';
import { ETF, ETFCategory, ETFScreenerResponse } from '@/types';

const PAGE_SIZE = 10;

export default function ETFsPage() {
  const [categories, setCategories] = useState<ETFCategory[]>([
    'Equity',
    'Bond',
    'Sector',
    'International',
    'Commodity',
  ]);
  const [minDividendYield, setMinDividendYield] = useState('');
  const [maxExpenseRatio, setMaxExpenseRatio] = useState('');
  const [etfs, setEtfs] = useState<ETF[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filtered, setFiltered] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleScreen = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const params = new URLSearchParams({
        categories: categories.join(','),
      });

      if (minDividendYield) {
        params.set('minDividendYield', minDividendYield);
      }

      if (maxExpenseRatio) {
        params.set('maxExpenseRatio', maxExpenseRatio);
      }

      const response = await fetch(`/api/etf-screener?${params}`);
      const data: ETFScreenerResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to screen ETFs');
      }

      setEtfs(data.etfs);
      setTotal(data.total);
      setFiltered(data.filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEtfs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ETF Screener
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Filter ETFs by category, dividend yield, and expense ratio to find the right investment for your portfolio.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ETFFilterPanel
              categories={categories}
              minDividendYield={minDividendYield}
              maxExpenseRatio={maxExpenseRatio}
              onCategoryChange={setCategories}
              onMinDividendYieldChange={setMinDividendYield}
              onMaxExpenseRatioChange={setMaxExpenseRatio}
              onApply={handleScreen}
              isLoading={isLoading}
            />
          </div>

          {/* Results Table */}
          <div className="lg:col-span-3">
            <ETFTable
              etfs={etfs}
              isLoading={isLoading}
              total={total}
              filtered={filtered}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
