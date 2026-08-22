import { NextResponse } from 'next/server';
import { MOCK_ANOMALIES } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: MOCK_ANOMALIES
  });
}
