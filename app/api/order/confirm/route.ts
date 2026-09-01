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
    if (sessionId) {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (apiKey) {
        try {
          const stripe = new Stripe(apiKey, {
            apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
          });
          const session = await stripe.checkout.sessions.retrieve(sessionId);

          if (session.payment_status !== 'paid') {
            return NextResponse.json(
              {
                success: false,
                message: 'Payment not yet confirmed by Stripe',
                status: session.payment_status,
              },
              { status: 400 }
            );
          }

          if (!targetOrderId && session.metadata?.order_id) {
            targetOrderId = session.metadata.order_id;
          }
          if (!resolvedEmail) {
            resolvedEmail = session.customer_details?.email || session.customer_email;
          }
        } catch (stripeErr) {
          console.warn('⚠️ Stripe verification note:', stripeErr);
        }
      }
    }

    // -----------------------------------------------------------------
    // ATOMIC DATABASE IDEMPOTENCY CHECK:
    // Update 'receipt_sent' to true ONLY if 'receipt_sent' is currently false.
    // In PostgreSQL / Supabase, this row-level atomic condition guarantees
    // that rapid concurrent refreshes will only match once.
    // -----------------------------------------------------------------
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const updatePayload: Record<string, unknown> = {
          receipt_sent: true,
          payment_status: 'paid',
          order_status: 'confirmed',
        };

        if (resolvedEmail) {
          updatePayload.customer_email = resolvedEmail;
        }
        if (sessionId) {
          updatePayload.stripe_session_id = sessionId;
        }

        const baseQuery = supabaseAdmin
          .from('orders')
          .update(updatePayload);

        const filterQuery = targetOrderId
          ? baseQuery.eq('id', targetOrderId)
          : baseQuery.eq('stripe_session_id', sessionId!);

        // Strictly apply condition: only execute update if receipt_sent is currently false
        const { data: updatedRows, error: updateError } = await filterQuery
          .eq('receipt_sent', false)
          .select();

        if (updateError) {
          console.error('❌ Supabase atomic idempotency update error:', updateError.message);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // If returned array is empty, it means receipt was already processed by a previous page load/webhook
        if (!updatedRows || updatedRows.length === 0) {
          console.log(`ℹ️ [Idempotency Guard] Order #${targetOrderId || sessionId} receipt already sent. Bypassing duplicate email dispatch.`);
          return NextResponse.json(
            {
              success: true,
              message: 'Receipt already processed.',
              alreadyProcessed: true,
            },
            { status: 200 }
          );
        }

        const confirmedOrder = updatedRows[0];
        targetOrderId = confirmedOrder.id;
        console.log(`✅ [Idempotency Guard] Atomic update succeeded for Order #${targetOrderId}. Proceeding with email dispatch.`);
      } catch (dbErr) {
        console.error('❌ Database error during idempotency check:', dbErr);
        return NextResponse.json(
          { error: 'Database check failed' },
          { status: 500 }
        );
      }
    }

    // -----------------------------------------------------------------
    // Row successfully updated -> Execute email sending function
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
        message: 'Order confirmed and receipt sent successfully.',
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
