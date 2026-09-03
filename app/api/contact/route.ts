import { NextRequest, NextResponse } from 'next/server';
import { sendContactInquiryEmail } from '@/libs/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields (name, email, subject, and message).' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const result = await sendContactInquiryEmail({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dispatch inquiry to order@tyliciousgrillz.com' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to order@tyliciousgrillz.com successfully.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Contact API Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
