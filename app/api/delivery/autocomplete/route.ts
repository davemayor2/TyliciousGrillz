import { NextRequest, NextResponse } from 'next/server';
import { getAddressSuggestions } from '@/libs/delivery/geocoding';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || searchParams.get('query') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getAddressSuggestions(query.trim());
    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Autocomplete lookup failed.';
    console.warn('Autocomplete lookup notice:', msg);
    return NextResponse.json({ suggestions: [] });
  }
}
