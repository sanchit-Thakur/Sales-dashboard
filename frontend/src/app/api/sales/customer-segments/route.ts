import { NextResponse } from 'next/server';
import { MOCK_CUSTOMER_SEGMENTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: MOCK_CUSTOMER_SEGMENTS
  });
}
