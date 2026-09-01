import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/libs/supabase/server';
import { sendOrderNotifications } from '@/libs/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = body.orderId || body.order_id;
    const userEmail = body.userEmail || body.customer_email || body.email;
    const sessionId = body.sessionId || body.session_id;

    if (!orderId && !sessionId) {
      return NextResponse.json(
        { error: 'Missing required orderId or sessionId parameter.' },
        { status: 400 }
      );
    }

    let targetOrderId = orderId;
    let resolvedEmail = userEmail;

    // Optional verification via Stripe session if sessionId is provided
    let stripeSession: Stripe.Checkout.Session | null = null;
    if (sessionId) {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (apiKey) {
        try {
          const stripe = new Stripe(apiKey, {
            apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
          });
          stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

          if (stripeSession.payment_status !== 'paid') {
            return NextResponse.json(
              {
                success: false,
                message: 'Payment not yet confirmed by Stripe',
                status: stripeSession.payment_status,
              },
              { status: 400 }
            );
          }

          if (!targetOrderId && stripeSession.metadata?.order_id) {
            targetOrderId = stripeSession.metadata.order_id;
          }
          if (!resolvedEmail) {
            resolvedEmail = stripeSession.customer_details?.email || stripeSession.customer_email;
          }
        } catch (stripeErr) {
          console.warn('⚠️ Stripe verification note:', stripeErr);
        }
      }
    }

    // -----------------------------------------------------------------
    // SUPABASE DATABASE IDEMPOTENCY & AUTO-RECOVERY CHECK:
    // -----------------------------------------------------------------
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        // 1. Check if order already exists in Supabase
        let existingOrder: { id: string | number; receipt_sent?: boolean | null } | null = null;

        if (targetOrderId) {
          const { data } = await supabaseAdmin
            .from('orders')
            .select('id, receipt_sent')
            .eq('id', targetOrderId)
            .maybeSingle();
          existingOrder = data;
        }

        if (!existingOrder && sessionId) {
          const { data } = await supabaseAdmin
            .from('orders')
            .select('id, receipt_sent')
            .eq('stripe_session_id', sessionId)
            .maybeSingle();
          existingOrder = data;
        }

        // 2. If order does NOT exist in Supabase (e.g. pre-checkout insert failed or skipped), auto-insert it from Stripe session
        if (!existingOrder) {
          console.log('🔄 Order not found in Supabase. Recovering and saving order from Stripe session...');

          if (stripeSession) {
            const isCollection = stripeSession.metadata?.fulfillment === 'Collection';
            const deliveryFee = isCollection ? 0 : 7.00;
            const grandTotal = (stripeSession.amount_total || 0) / 100;
            const subtotal = Math.max(0, Number((grandTotal - deliveryFee).toFixed(2)));

            const addressObj =
              stripeSession.customer_details?.address ||
              (stripeSession as unknown as { shipping_details?: { address?: Stripe.Address } }).shipping_details?.address;

            const stripeAddress = addressObj
              ? [addressObj.line1, addressObj.line2, addressObj.city, addressObj.state, addressObj.postal_code, addressObj.country]
                  .map((p) => p?.trim())
                  .filter(Boolean)
                  .join(', ')
              : stripeSession.metadata?.deliveryAddress || (stripeSession.metadata?.postcode ? `Postcode: ${stripeSession.metadata.postcode}` : null);

            const customerName = stripeSession.customer_details?.name || stripeSession.metadata?.customerName || null;
            const customerPhone = stripeSession.customer_details?.phone || stripeSession.metadata?.customerPhone || null;
            const custEmail = stripeSession.customer_details?.email || stripeSession.customer_email || resolvedEmail || null;

            const insertPayload: Record<string, unknown> = {
              customer_name: customerName,
              customer_email: custEmail,
              customer_phone: customerPhone,
              delivery_address: stripeAddress,
              fulfillment_method: stripeSession.metadata?.fulfillment || 'Delivery',
              subtotal,
              delivery_fee: deliveryFee,
              total: grandTotal,
              payment_status: 'paid',
              order_status: 'confirmed',
              stripe_session_id: sessionId,
              receipt_sent: true,
            };

            let insRes = await supabaseAdmin
              .from('orders')
              .insert(insertPayload)
              .select('id')
              .single();

            // Fallback if receipt_sent column does not exist
            if (insRes.error) {
              console.warn('⚠️ Retrying recovery insert with core columns:', insRes.error.message);
              delete insertPayload.receipt_sent;
              insRes = await supabaseAdmin
                .from('orders')
                .insert(insertPayload)
                .select('id')
                .single();
            }

            if (insRes.data?.id) {
              targetOrderId = insRes.data.id;
              console.log(`✅ [Auto-Recovery] Order #${targetOrderId} successfully saved to Supabase!`);
            } else if (insRes.error) {
              console.error('❌ [Auto-Recovery] Supabase order insert error:', insRes.error.message);
            }
          }
        } else {
          // 3. Order already exists: Update status atomically
          const updatePayload: Record<string, unknown> = {
            receipt_sent: true,
            payment_status: 'paid',
            order_status: 'confirmed',
          };

          if (resolvedEmail) updatePayload.customer_email = resolvedEmail;
          if (sessionId) updatePayload.stripe_session_id = sessionId;

          let updateRes = await supabaseAdmin
            .from('orders')
            .update(updatePayload)
            .eq('id', existingOrder.id)
            .eq('receipt_sent', false)
            .select();

          // Fallback if receipt_sent column does not exist in schema
          if (updateRes.error) {
            delete updatePayload.receipt_sent;
            updateRes = await supabaseAdmin
              .from('orders')
              .update(updatePayload)
              .eq('id', existingOrder.id)
              .select();
          }

          const { data: updatedRows } = updateRes;

          // If receipt was already sent by a previous load/webhook, return 200 and bypass duplicate email
          if (existingOrder.receipt_sent === true || (updatedRows && updatedRows.length === 0)) {
            console.log(`ℹ️ [Idempotency Guard] Order #${existingOrder.id} receipt already processed. Bypassing duplicate email dispatch.`);
            return NextResponse.json(
              {
                success: true,
                message: 'Receipt already processed.',
                alreadyProcessed: true,
              },
              { status: 200 }
            );
          }

          targetOrderId = existingOrder.id;
          console.log(`✅ [Idempotency Guard] Atomic update succeeded for Order #${targetOrderId}. Proceeding with email dispatch.`);
        }
      } catch (dbErr) {
        console.error('❌ Database error during order confirmation check:', dbErr);
      }
    }

    // -----------------------------------------------------------------
    // Dispatch Resend Email Notifications
    // -----------------------------------------------------------------
    try {
      const emailResult = await sendOrderNotifications(targetOrderId || sessionId);
      console.log('📧 Order receipt notifications dispatched:', emailResult);
    } catch (emailErr) {
      console.error('⚠️ Email dispatch notification error:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order confirmed and recorded successfully.',
        orderId: targetOrderId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown confirmation error';
    console.error('❌ Order confirmation error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
