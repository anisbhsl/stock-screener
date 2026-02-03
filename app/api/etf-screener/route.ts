import { NextRequest, NextResponse } from 'next/server';
import { screenETFs } from '@/lib/etfs';
import { ETFScreenerFilters, ETFScreenerResponse, ETFCategory } from '@/types';
import { getETFsByCategory, getAllCategories } from '@/lib/etf-symbols';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filter parameters
    const categoriesParam = searchParams.get('categories');
    const minDividendYieldParam = searchParams.get('minDividendYield');
    const maxExpenseRatioParam = searchParams.get('maxExpenseRatio');

    // Default to all categories if not specified
    const validCategories = getAllCategories();
    const categories: ETFCategory[] = categoriesParam
      ? (categoriesParam.split(',') as ETFCategory[])
      : validCategories;

    // Validate categories
    for (const category of categories) {
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category: ${category}`, etfs: [], total: 0, filtered: 0 },
          { status: 400 }
        );
      }
    }

    // Parse optional filters
    const minDividendYield = minDividendYieldParam
      ? parseFloat(minDividendYieldParam)
      : undefined;
    const maxExpenseRatio = maxExpenseRatioParam
      ? parseFloat(maxExpenseRatioParam)
      : undefined;

    // Validate numeric filters
    if (minDividendYield !== undefined && (isNaN(minDividendYield) || minDividendYield < 0)) {
      return NextResponse.json(
        { error: 'Min dividend yield must be a positive number', etfs: [], total: 0, filtered: 0 },
        { status: 400 }
      );
    }

    if (maxExpenseRatio !== undefined && (isNaN(maxExpenseRatio) || maxExpenseRatio < 0)) {
      return NextResponse.json(
        { error: 'Max expense ratio must be a positive number', etfs: [], total: 0, filtered: 0 },
        { status: 400 }
      );
    }

    const filters: ETFScreenerFilters = {
      categories,
      minDividendYield,
      maxExpenseRatio,
    };

    const totalSymbols = getETFsByCategory(categories).length;
    const etfs = await screenETFs(filters);

    const response: ETFScreenerResponse = {
      etfs,
      total: totalSymbols,
      filtered: etfs.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('ETF Screener API error:', error);
    return NextResponse.json(
      { error: 'Failed to screen ETFs', etfs: [], total: 0, filtered: 0 },
      { status: 500 }
    );
  }
}
