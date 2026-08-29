import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/libs/supabase/server';
import { sendOrderNotifications } from '@/libs/email';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured' }, { status: 500 });
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    });

    // 1. Retrieve the session directly from Stripe to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        message: 'Payment not yet confirmed by Stripe',
        status: session.payment_status,
      });
    }

    const supabaseOrderId = session.metadata?.order_id;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name;
    const customerPhone = session.customer_details?.phone || session.metadata?.customerPhone;
    const addressObj = session.customer_details?.address || (session as unknown as { shipping_details?: { address?: Stripe.Address } }).shipping_details?.address;
    const customerAddress = addressObj
      ? [addressObj.line1, addressObj.line2, addressObj.city, addressObj.state, addressObj.postal_code, addressObj.country]
          .map((p) => p?.trim())
          .filter(Boolean)
          .join(', ')
      : session.metadata?.deliveryAddress || (session.metadata?.postcode ? `Postcode: ${session.metadata.postcode}` : null);

    console.log('⚡ [Order Confirm Fail-Safe] Verifying paid session:', {
      sessionId,
      supabaseOrderId,
      customerEmail,
      customerPhone,
      customerAddress,
    });

    // 2. Update Supabase order status if not already paid
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const updatePayload: Record<string, unknown> = {
          payment_status: 'paid',
          order_status: 'confirmed',
          stripe_session_id: sessionId,
        };

        if (customerName) updatePayload.customer_name = customerName;
        if (customerEmail) updatePayload.customer_email = customerEmail;
        if (customerPhone) updatePayload.customer_phone = customerPhone;
        if (customerAddress) updatePayload.delivery_address = customerAddress;

        let query = supabaseAdmin.from('orders').update(updatePayload);

        if (supabaseOrderId) {
          query = query.eq('id', supabaseOrderId);
        } else {
          query = query.eq('stripe_session_id', sessionId);
        }

        await query;
      } catch (dbErr) {
        console.warn('⚠️ Supabase order update notice:', dbErr);
      }
    }

    // 3. Dispatch Resend Email Notifications
    const targetOrderId = supabaseOrderId || sessionId;
    try {
      const emailResult = await sendOrderNotifications(targetOrderId);
      console.log('📧 [Order Confirm Fail-Safe] Email dispatch result:', emailResult);
    } catch (emailErr) {
      console.warn('⚠️ Email dispatch notice:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: supabaseOrderId,
      status: 'paid',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown confirmation error';
    console.error('❌ Order confirmation error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
