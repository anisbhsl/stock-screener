import { NextRequest, NextResponse } from 'next/server';
import { screenStocks } from '@/lib/stocks';
import { ScreenerFilters, ScreenerResponse } from '@/types';
import { getSymbolsByExchange } from '@/lib/symbols';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filter parameters
    const exchangesParam = searchParams.get('exchanges');
    const rsiThreshold = parseInt(searchParams.get('rsiThreshold') || '40', 10);

    // Default to both exchanges if not specified
    const exchanges: ('NYSE' | 'NASDAQ')[] = exchangesParam
      ? (exchangesParam.split(',') as ('NYSE' | 'NASDAQ')[])
      : ['NYSE', 'NASDAQ'];

    // Validate parameters
    if (isNaN(rsiThreshold) || rsiThreshold < 0 || rsiThreshold > 100) {
      return NextResponse.json(
        { error: 'RSI threshold must be between 0 and 100' },
        { status: 400 }
      );
    }

    const validExchanges = ['NYSE', 'NASDAQ'];
    for (const exchange of exchanges) {
      if (!validExchanges.includes(exchange)) {
        return NextResponse.json(
          { error: `Invalid exchange: ${exchange}` },
          { status: 400 }
        );
      }
    }

    const filters: ScreenerFilters = {
      exchanges,
      rsiThreshold,
    };

    const totalSymbols = getSymbolsByExchange(exchanges).length;
    const stocks = await screenStocks(filters);

    const response: ScreenerResponse = {
      stocks,
      total: totalSymbols,
      filtered: stocks.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Screener API error:', error);
    return NextResponse.json(
      { error: 'Failed to screen stocks', stocks: [], total: 0, filtered: 0 },
      { status: 500 }
    );
  }
}
