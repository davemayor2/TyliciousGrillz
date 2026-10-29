import { NextRequest, NextResponse } from 'next/server';
import { calculateDeliveryQuoteForAddress } from '@/libs/delivery/pricing';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const address = String(body.address || body.delivery_address || '').trim();
    const postcode = String(body.postcode || '').trim();

    if (!address && !postcode) {
      return NextResponse.json(
        { error: 'Please provide a delivery address or UK postcode.' },
        { status: 400 }
      );
    }

    const quote = await calculateDeliveryQuoteForAddress(address, postcode);

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to calculate delivery quote.';
    return NextResponse.json(
      { error: msg },
      { status: 400 }
    );
  }
}
