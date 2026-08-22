import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');

  let result = [...MOCK_PRODUCTS];

  if (brand && brand !== 'All') {
    result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (sortBy) {
    if (sortBy === 'revenue_desc') result.sort((a, b) => b.netRevenue - a.netRevenue);
    else if (sortBy === 'revenue_asc') result.sort((a, b) => a.netRevenue - b.netRevenue);
    else if (sortBy === 'units_desc') result.sort((a, b) => b.unitsSold - a.unitsSold);
    else if (sortBy === 'margin_desc') result.sort((a, b) => b.profitMargin - a.profitMargin);
    else if (sortBy === 'rating_desc') result.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    status: 'success',
    count: result.length,
    data: result
  });
}
