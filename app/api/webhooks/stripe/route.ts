import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Stripe secret key not configured on server' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(apiKey);
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    if (webhookSecret) {
      // Cryptographically verify the event was genuinely sent by Stripe
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      console.warn(
        '⚠️ STRIPE_WEBHOOK_SECRET is not configured in .env.local. Signature verification was bypassed for local testing.'
      );
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle Stripe Webhook Events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.id;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name || 'Customer';
        const amountTotalInPence = session.amount_total || 0;
        const amountTotal = (amountTotalInPence / 100).toFixed(2);
        const currency = (session.currency || 'gbp').toUpperCase();
        const metadata = session.metadata || {};

        console.log('🎉 [Webhook] Payment Verified and Completed:', {
          orderId,
          customerName,
          customerEmail,
          total: `${currency} ${amountTotal}`,
          paymentStatus: session.payment_status,
          fulfillment: metadata.fulfillment,
          postcode: metadata.postcode,
          scheduledDate: metadata.scheduledDate,
          scheduledTime: metadata.scheduledTime,
          itemCount: metadata.itemCount,
        });

        // -------------------------------------------------------------
        // BACKEND ORDER FULFILLMENT ACTIONS:
        // 1. Mark order status as PAID in database
        // 2. Send order receipt & confirmation email to customer
        // 3. Dispatch kitchen order ticket / notifications
        // -------------------------------------------------------------

        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ [Webhook] Async payment succeeded for session:', session.id);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn('❌ [Webhook] Async payment failed for session:', session.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(
          '❌ [Webhook] Payment intent failed:',
          paymentIntent.id,
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      default:
        console.log(`[Webhook] Received unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (handlerError: any) {
    console.error('Error handling webhook event:', handlerError);
    return NextResponse.json(
      { error: 'Webhook handler encountered an error.' },
      { status: 500 }
    );
  }
}
