'use client';

import { useState } from 'react';
import FilterPanel from '@/components/FilterPanel';
import StockTable from '@/components/StockTable';
import { Stock, ScreenerResponse } from '@/types';

export default function Home() {
  const [exchanges, setExchanges] = useState<('NYSE' | 'NASDAQ')[]>(['NYSE', 'NASDAQ']);
  const [rsiThreshold, setRsiThreshold] = useState(40);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filtered, setFiltered] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleScreen = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        exchanges: exchanges.join(','),
        rsiThreshold: rsiThreshold.toString(),
      });

      const response = await fetch(`/api/screener?${params}`);
      const data: ScreenerResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to screen stocks');
      }

      setStocks(data.stocks);
      setTotal(data.total);
      setFiltered(data.filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Stock Screener</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Filter NYSE and NASDAQ stocks by technical indicators
          </p>
        </header>

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
            <FilterPanel
              exchanges={exchanges}
              rsiThreshold={rsiThreshold}
              onExchangeChange={setExchanges}
              onRsiChange={setRsiThreshold}
              onApply={handleScreen}
              isLoading={isLoading}
            />
          </div>

          {/* Results Table */}
          <div className="lg:col-span-3">
            <StockTable
              stocks={stocks}
              isLoading={isLoading}
              total={total}
              filtered={filtered}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Data provided by Yahoo Finance. RSI calculated using 14-period standard.</p>
        </footer>
      </div>
    </main>
  );
}
