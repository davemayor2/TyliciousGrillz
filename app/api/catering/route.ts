import { NextRequest, NextResponse } from 'next/server';
import { sendCateringInquiryEmail } from '@/libs/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, guests, address, staffing, selectedMenu, specialNotes } = body;

    if (!name || !email || !phone || !date || !guests) {
      return NextResponse.json(
        { error: 'Please provide all required fields (name, email, phone, event date, and guest count).' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const result = await sendCateringInquiryEmail({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      date: String(date).trim(),
      guests: guests,
      address: address ? String(address).trim() : undefined,
      staffing: staffing ? String(staffing).trim() : undefined,
      selectedMenu: Array.isArray(selectedMenu) ? selectedMenu : [],
      specialNotes: specialNotes ? String(specialNotes).trim() : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dispatch catering request to order@tyliciousgrillz.com' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your catering inquiry has been received and routed to order@tyliciousgrillz.com.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Catering API Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
