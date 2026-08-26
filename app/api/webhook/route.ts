import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/libs/supabase';
import { sendOrderNotifications } from '@/libs/email';

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

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is missing from environment variables.');
    return NextResponse.json(
      { error: 'Webhook signing secret is not configured on the server.' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // 1. Read raw body text to cryptographically verify Stripe signature
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('⚠️ Stripe Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook Signature Error: ${message}` },
      { status: 400 }
    );
  }

  // 2. Handle Stripe Webhook Events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const stripeSessionId = session.id;
        const metadata = session.metadata || {};
        const supabaseOrderId = metadata.order_id;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        const customerPhone = session.customer_details?.phone || metadata.customerPhone;

        console.log('🎉 [Webhook] Checkout Session Completed:', {
          stripeSessionId,
          supabaseOrderId,
          customerName,
          customerEmail,
          paymentStatus: session.payment_status,
        });

        // 3. Update the matching order in Supabase to 'paid' and 'confirmed'
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          try {
            const updatePayload: Record<string, unknown> = {
              payment_status: 'paid',
              order_status: 'confirmed',
            };

            if (customerName) updatePayload.customer_name = customerName;
            if (customerEmail) updatePayload.customer_email = customerEmail;
            if (customerPhone) updatePayload.customer_phone = customerPhone;

            let query = supabaseAdmin.from('orders').update(updatePayload);

            if (supabaseOrderId) {
              query = query.eq('id', supabaseOrderId);
            } else {
              query = query.eq('stripe_session_id', stripeSessionId);
            }

            const { data: updatedOrder, error: dbError } = await query.select().single();

            if (dbError) {
              console.warn('⚠️ Supabase order status update notice:', dbError.message);
            } else {
              console.log(`✅ Order #${supabaseOrderId || updatedOrder?.id} marked as PAID & CONFIRMED in Supabase!`);
            }
          } catch (dbErr) {
            console.warn('⚠️ Could not update Supabase orders table:', dbErr);
          }
        }

        // 4. Trigger Resend Email Notifications (Receipt to Customer & Alert to Restaurant)
        const targetOrderId = supabaseOrderId || stripeSessionId;
        try {
          await sendOrderNotifications(targetOrderId);
        } catch (emailErr) {
          console.warn('⚠️ Notification email dispatch encountered an error:', emailErr);
        }

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
  } catch (handlerError: unknown) {
    console.error('Error handling webhook event:', handlerError);
    return NextResponse.json(
      { error: 'Webhook handler encountered an error.' },
      { status: 500 }
    );
  }
}
