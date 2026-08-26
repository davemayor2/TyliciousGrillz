import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const recipient = searchParams.get('to') || 'order@tyliciousgrillz.com';
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not defined in environment variables' },
        { status: 500 }
      );
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Tylicious Grillz <order@tyliciousgrillz.com>';
    const resend = new Resend(apiKey);

    console.log(`🧪 Testing Resend email to ${recipient} from ${fromAddress}...`);

    const result = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      subject: '🔥 Tylicious Grillz Email Test - Resend Integration Working!',
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #1A0500; background: #FFF5F2; border: 2px solid #ED2C02; border-radius: 16px;">
          <h1 style="color: #ED2C02; margin-top: 0;">🔥 Tylicious Grillz Email Service Live</h1>
          <p>This is a confirmation test email sent from <strong>${fromAddress}</strong>.</p>
          <p>Your Resend API Key, sender domain, and Next.js backend are fully operational!</p>
          <hr style="border: 0.5px solid #FFD0C5; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('❌ Resend test email error:', result.error);
      return NextResponse.json({
        success: false,
        from: fromAddress,
        to: recipient,
        error: result.error,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      from: fromAddress,
      to: recipient,
      emailId: result.data?.id,
      message: `Test email successfully sent to ${recipient}!`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
