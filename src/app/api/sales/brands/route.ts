import { NextResponse } from 'next/server';
import { MOCK_BRANDS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: MOCK_BRANDS
  });
}
