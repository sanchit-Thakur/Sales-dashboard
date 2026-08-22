import { NextResponse } from 'next/server';
import { MOCK_MARKET_BASKET } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: MOCK_MARKET_BASKET
  });
}
