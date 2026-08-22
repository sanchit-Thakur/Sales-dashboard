import { NextResponse } from 'next/server';
import { DataScienceService } from '@/lib/dataScienceService';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandId, productId, priceChangePct, discountChangePct, marketingSpendChangePct, unitCostChangePct } = body;

    const result = DataScienceService.simulateWhatIf({
      brandId,
      productId: productId || MOCK_PRODUCTS[0].id,
      priceChangePct: Number(priceChangePct) || 0,
      discountChangePct: Number(discountChangePct) || 0,
      marketingSpendChangePct: Number(marketingSpendChangePct) || 0,
      unitCostChangePct: Number(unitCostChangePct) || 0
    });

    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
