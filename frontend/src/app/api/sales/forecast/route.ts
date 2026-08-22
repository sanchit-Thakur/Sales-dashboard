import { NextResponse } from 'next/server';
import { DataScienceService } from '@/lib/dataScienceService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand') || 'All';
  const horizon = parseInt(searchParams.get('horizon') || '6', 10);
  const modelType = (searchParams.get('model') as any) || 'holt-winters';

  const forecast = DataScienceService.generateForecast(brand, horizon, modelType);
  return NextResponse.json({
    status: 'success',
    data: forecast
  });
}
