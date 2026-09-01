import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/libs/supabase/server';
import { sendOrderNotifications } from '@/libs/email';

export const dynamic = 'force-dynamic';

function formatStripeAddress(address: Stripe.Address | null | undefined): string | null {
  if (!address) return null;
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .map((p) => p?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : null;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim().replace(/^["']|["']$/g, '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim().replace(/^["']|["']$/g, '');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Stripe secret key not configured on server' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });
  const signature = request.headers.get('stripe-signature')?.trim();

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
  let rawBody = '';

  try {
    // 1. Read raw body text to cryptographically verify Stripe signature
    rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('⚠️ Stripe Webhook signature verification failed:', message, {
      hasSecret: !!webhookSecret,
      secretPrefix: webhookSecret ? webhookSecret.substring(0, 8) : 'none',
      hasSignature: !!signature,
      signaturePrefix: signature ? signature.substring(0, 15) : 'none',
      bodyLength: rawBody.length,
    });
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
        const deliveryMethod = metadata.delivery_method as 'delivery' | 'pickup' | undefined;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        const customerPhone = session.customer_details?.phone || metadata.customerPhone;
        const customerAddress =
          formatStripeAddress(session.customer_details?.address) ||
          formatStripeAddress((session as unknown as { shipping_details?: { address?: Stripe.Address } }).shipping_details?.address) ||
          metadata.deliveryAddress ||
          (metadata.postcode ? `Postcode: ${metadata.postcode}` : null);

        console.log('🎉 [Webhook] Checkout Session Completed:', {
          stripeSessionId,
          supabaseOrderId,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          paymentStatus: session.payment_status,
        });

        // 3. Update or auto-recover order in Supabase with payment status
        let shouldSendEmail = true;
        let finalOrderId: string | number | null = supabaseOrderId || null;

        if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          try {
            // Check if order exists in Supabase
            let existingOrder: { id: string | number; receipt_sent?: boolean | null } | null = null;

            if (supabaseOrderId) {
              const { data } = await supabaseAdmin
                .from('orders')
                .select('id, receipt_sent')
                .eq('id', supabaseOrderId)
                .maybeSingle();
              existingOrder = data;
            }

            if (!existingOrder && stripeSessionId) {
              const { data } = await supabaseAdmin
                .from('orders')
                .select('id, receipt_sent')
                .eq('stripe_session_id', stripeSessionId)
                .maybeSingle();
              existingOrder = data;
            }

            if (!existingOrder) {
              console.log('🔄 [Webhook] Order not in Supabase. Auto-inserting order from Stripe session...');
              const isCollection = metadata.fulfillment === 'Collection';
              const deliveryFee = isCollection ? 0 : 7.00;
              const grandTotal = (session.amount_total || 0) / 100;
              const subtotal = Math.max(0, Number((grandTotal - deliveryFee).toFixed(2)));

              const insertPayload: Record<string, unknown> = {
                customer_name: customerName || null,
                customer_email: customerEmail || null,
                customer_phone: customerPhone || null,
                delivery_address: customerAddress,
                fulfillment_method: metadata.fulfillment || 'Delivery',
                subtotal,
                delivery_fee: deliveryFee,
                total: grandTotal,
                payment_status: 'paid',
                order_status: 'confirmed',
                stripe_session_id: stripeSessionId,
                receipt_sent: true,
              };

              let insRes = await supabaseAdmin.from('orders').insert(insertPayload).select('id').single();
              if (insRes.error) {
                delete insertPayload.receipt_sent;
                insRes = await supabaseAdmin.from('orders').insert(insertPayload).select('id').single();
              }

              if (insRes.data?.id) {
                finalOrderId = insRes.data.id;
                console.log(`✅ [Webhook Auto-Recovery] Order #${finalOrderId} inserted into Supabase!`);
              }
            } else {
              finalOrderId = existingOrder.id;
              const updatePayload: Record<string, unknown> = {
                payment_status: 'paid',
                order_status: 'confirmed',
                receipt_sent: true,
                stripe_session_id: stripeSessionId,
              };

              if (customerName) updatePayload.customer_name = customerName;
              if (customerEmail) updatePayload.customer_email = customerEmail;
              if (customerPhone) updatePayload.customer_phone = customerPhone;
              if (customerAddress) updatePayload.delivery_address = customerAddress;

              let updateRes = await supabaseAdmin
                .from('orders')
                .update(updatePayload)
                .eq('id', existingOrder.id)
                .eq('receipt_sent', false)
                .select();

              if (updateRes.error) {
                delete updatePayload.receipt_sent;
                updateRes = await supabaseAdmin
                  .from('orders')
                  .update(updatePayload)
                  .eq('id', existingOrder.id)
                  .select();
              }

              if (existingOrder.receipt_sent === true || (updateRes.data && updateRes.data.length === 0)) {
                console.log(`ℹ️ [Webhook] Order #${existingOrder.id} receipt already processed. Skipping duplicate email.`);
                shouldSendEmail = false;
              } else {
                console.log(`✅ [Webhook] Order #${existingOrder.id} marked as PAID in Supabase!`);
              }
            }
          } catch (dbErr) {
            console.warn('⚠️ Could not update Supabase orders table in webhook:', dbErr);
          }
        }

        // 4. Trigger Resend Email Notifications if not already dispatched
        if (shouldSendEmail) {
          const targetOrderId = finalOrderId || supabaseOrderId || stripeSessionId;
          try {
            await sendOrderNotifications(targetOrderId);
          } catch (emailErr) {
            console.warn('⚠️ Notification email dispatch encountered an error:', emailErr);
          }
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
