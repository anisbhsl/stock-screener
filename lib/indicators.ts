import { HistoricalData } from '@/types';

/**
 * Calculate Relative Strength Index (RSI)
 * Uses the standard 14-period calculation
 *
 * @param data - Array of historical price data (oldest first)
 * @param period - RSI period (default 14)
 * @returns RSI value (0-100) or null if insufficient data
 */
export function calculateRSI(data: HistoricalData[], period: number = 14): number | null {
  if (data.length < period + 1) {
    return null;
  }

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }

  // Separate gains and losses
  const gains: number[] = [];
  const losses: number[] = [];

  for (const change of changes) {
    if (change > 0) {
      gains.push(change);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(change));
    }
  }

  // Calculate initial average gain and loss (first 'period' values)
  let avgGain = gains.slice(0, period).reduce((sum, g) => sum + g, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, l) => sum + l, 0) / period;

  // Calculate smoothed averages using Wilder's smoothing
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  // Calculate RSI
  if (avgLoss === 0) {
    return 100; // No losses means RSI is 100
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 100) / 100; // Round to 2 decimal places
}

/**
 * RSI interpretation helper
 */
export function getRsiSignal(rsi: number): 'oversold' | 'overbought' | 'neutral' {
  if (rsi < 30) return 'oversold';
  if (rsi > 70) return 'overbought';
  return 'neutral';
}
