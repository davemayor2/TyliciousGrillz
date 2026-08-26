import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { FULL_MENU_DATA } from '@/constants';
import { supabaseAdmin } from '@/libs/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured on the server.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(apiKey);
    const body = await request.json();
    const customerDetails = body.customer_details || {};

    const items = body.items;
    const fulfillment = body.fulfillment_method || body.fulfillment || 'Delivery';
    const deliveryAddress = customerDetails.delivery_address || body.deliveryAddress || '';
    const postcode = customerDetails.postcode || body.postcode || '';
    const scheduledDate = customerDetails.scheduled_date || body.scheduledDate || '';
    const scheduledTime = customerDetails.scheduled_time || body.scheduledTime || '';
    const customerName = customerDetails.customer_name || body.customerName || '';
    const customerEmail = customerDetails.customer_email || body.customerEmail || '';
    const customerPhone = customerDetails.customer_phone || body.customerPhone || '';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your basket is empty.' },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      'http://localhost:3000';

    // Fast lookup map for authoritative menu items
    const productCatalogMap = new Map(FULL_MENU_DATA.map((p) => [p.id, p]));

    // Format line items for Stripe using authoritative backend prices (in pence)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const productId = String(item.product_id || item.product?.id || item.id || '');
      const verifiedProduct = productCatalogMap.get(productId);

      if (!verifiedProduct) {
        return NextResponse.json(
          { error: `Invalid product item in basket (ID: ${productId}).` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      // Calculate option modifiers from item.options
      const optionModifierSum = Object.values(item.options || {}).reduce((sum: number, arr: unknown) => {
        if (!Array.isArray(arr)) return sum;
        return sum + arr.reduce((vSum: number, val: { price?: number }) => vSum + Number(val.price || 0), 0);
      }, 0);

      const effectiveUnitPrice = verifiedProduct.price + optionModifierSum;
      const itemTotal = effectiveUnitPrice * quantity;
      calculatedSubtotal += itemTotal;

      const unitAmountInPence = Math.round(effectiveUnitPrice * 100);

      // Extract description summary for Stripe line item
      const optionDetails = Object.entries(item.options || {})
        .map(([category, vals]) => `${category}: ${(vals as { name: string }[]).map((v) => v.name).join(', ')}`)
        .join(' | ');

      line_items.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: verifiedProduct.name,
            description: optionDetails.length > 0 ? optionDetails.slice(0, 500) : verifiedProduct.description,
            images:
              typeof verifiedProduct.image === 'string' &&
              verifiedProduct.image.startsWith('http')
                ? [verifiedProduct.image]
                : undefined,
          },
          unit_amount: unitAmountInPence,
        },
        quantity,
      });
    }

    // Delivery calculation
    const isDelivery = fulfillment !== 'Collection';
    const deliveryFee = isDelivery ? 5.00 : 0.00;
    const calculatedTotal = Number((calculatedSubtotal + deliveryFee).toFixed(2));

    if (isDelivery) {
      line_items.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Doorstep Delivery',
            description: 'Flat rate delivery to your location',
          },
          unit_amount: 500, // £5.00 in pence (500)
        },
        quantity: 1,
      });
    }

    // -----------------------------------------------------------------
    // 1. SUPABASE: INSERT new row into 'orders' table (pending status)
    // -----------------------------------------------------------------
    let supabaseOrderId: string | number | null = null;
    const fullAddress = deliveryAddress || (postcode ? `Postcode: ${postcode}` : null);

    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            customer_name: customerName || null,
            customer_email: customerEmail || null,
            customer_phone: customerPhone || null,
            delivery_address: fullAddress,
            fulfillment_method: fulfillment,
            subtotal: calculatedSubtotal,
            delivery_fee: deliveryFee,
            total: calculatedTotal,
            payment_status: 'pending',
            order_status: 'pending',
          })
          .select('id')
          .single();

        if (orderError) {
          console.warn('⚠️ Supabase orders insertion warning:', orderError.message);
        } else if (orderData?.id) {
          supabaseOrderId = orderData.id;

          // ---------------------------------------------------------------
          // 2. SUPABASE: INSERT cart items into 'order_items' table
          // ---------------------------------------------------------------
          const orderItemsPayload = items.map((item) => {
            const productId = String(item.product_id || item.product?.id || item.id || '');
            const verifiedProduct = productCatalogMap.get(productId)!;
            const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

            const optionModifierSum = Object.values(item.options || {}).reduce((sum: number, arr: unknown) => {
              if (!Array.isArray(arr)) return sum;
              return sum + arr.reduce((vSum: number, val: { price?: number }) => vSum + Number(val.price || 0), 0);
            }, 0);

            const effectiveUnitPrice = verifiedProduct.price + optionModifierSum;
            const itemTotal = effectiveUnitPrice * quantity;

            return {
              order_id: supabaseOrderId,
              product_id: verifiedProduct.id,
              product_name: verifiedProduct.name,
              quantity,
              unit_price: verifiedProduct.price,
              total: itemTotal,
              options:
                item.options || {
                  'Spice Level': [{ name: item.spiceLevel || 'Medium', price: 0 }],
                  'Sides': (item.selectedSides || []).map((s: string) => ({
                    name: s,
                    price: s.includes('+£8') ? 8 : s.includes('+£7') ? 7 : 0,
                  })),
                },
            };
          });

          const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsPayload);

          if (itemsError) {
            console.warn('⚠️ Supabase order_items insertion warning:', itemsError.message);
          } else {
            console.log(`✅ Order #${supabaseOrderId} and ${orderItemsPayload.length} items recorded in Supabase (status: pending).`);
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ Could not complete initial Supabase order creation:', dbErr);
      }
    }

    // -----------------------------------------------------------------
    // 3. STRIPE: Create Checkout Session with order_id in metadata
    // -----------------------------------------------------------------
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/menu?canceled=true`,
      metadata: {
        order_id: supabaseOrderId ? String(supabaseOrderId) : '',
        fulfillment,
        postcode,
        deliveryAddress: deliveryAddress || postcode,
        scheduledDate,
        scheduledTime,
        itemCount: String(items.length),
        customerPhone,
      },
    };

    if (customerEmail && typeof customerEmail === 'string' && customerEmail.includes('@')) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // -----------------------------------------------------------------
    // 4. SUPABASE: Link stripe_session_id to the created order
    // -----------------------------------------------------------------
    if (supabaseOrderId && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await supabaseAdmin
          .from('orders')
          .update({ stripe_session_id: session.id })
          .eq('id', supabaseOrderId);
      } catch (updateErr) {
        console.warn('⚠️ Failed to update stripe_session_id on order:', updateErr);
      }
    }

    // 5. Return Stripe Checkout session URL to frontend
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: supabaseOrderId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred while creating the checkout session.';
    console.error('Stripe Checkout Session creation error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
