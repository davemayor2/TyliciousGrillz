import React from 'react';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { render } from '@react-email/components';
import { supabaseAdmin } from '@/libs/supabase/server';
import { OrderReceipt, OrderData, OrderItemData } from '@/emails/OrderReceipt';
import { NewOrderAlert } from '@/emails/NewOrderAlert';
import { ContactInquiryEmail, ContactInquiryData } from '@/emails/ContactInquiryEmail';
import { CateringInquiryEmail, CateringInquiryData } from '@/emails/CateringInquiryEmail';

const apiKey = process.env.RESEND_API_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Initialize Resend Client
export const resend = new Resend(apiKey || 're_placeholder');

// Initialize Stripe Client
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    })
  : null;

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ||
  'Tylicious Grillz <order@tyliciousgrillz.com>';

const RESTAURANT_OPERATIONAL_EMAIL =
  process.env.RESTAURANT_NOTIFICATION_EMAIL ||
  'order@tyliciousgrillz.com';

/**
 * Sends order confirmation receipt to customer and new order alert to restaurant staff
 * @param orderIdOrSessionId Supabase order ID (number/string/UUID) or Stripe session ID
 */
export async function sendOrderNotifications(orderIdOrSessionId: string | number) {
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    let order: OrderData | null = null;
    let orderItems: OrderItemData[] = [];

    const targetStr = String(orderIdOrSessionId).trim();
    let stripeSessionId: string | null = targetStr.startsWith('cs_') ? targetStr : null;

    // -----------------------------------------------------------------
    // 1. SUPABASE LOOKUP: Fetch order row
    // -----------------------------------------------------------------
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        if (targetStr.startsWith('cs_')) {
          // Lookup by Stripe session ID
          const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('stripe_session_id', targetStr)
            .maybeSingle();

          if (data) {
            order = data as OrderData;
            stripeSessionId = targetStr;
          }
          if (error) console.warn('⚠️ Supabase lookup by stripe_session_id notice:', error.message);
        } else {
          // Lookup by order primary key ID (integer or UUID)
          const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderIdOrSessionId)
            .maybeSingle();

          if (data) {
            order = data as OrderData;
            if (data.stripe_session_id) {
              stripeSessionId = data.stripe_session_id;
            }
          } else {
            // Fallback search by stripe_session_id in case a string ID was provided
            const { data: fallbackData } = await supabaseAdmin
              .from('orders')
              .select('*')
              .eq('stripe_session_id', targetStr)
              .maybeSingle();

            if (fallbackData) {
              order = fallbackData as OrderData;
              if (fallbackData.stripe_session_id) {
                stripeSessionId = fallbackData.stripe_session_id;
              }
            }
          }
          if (error) console.warn('⚠️ Supabase lookup by id notice:', error.message);
        }

        // Fetch associated order_items if order exists in Supabase
        if (order?.id) {
          const { data: explicitItems, error: itemsError } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (explicitItems && explicitItems.length > 0) {
            orderItems = explicitItems.map((it) => ({
              id: it.id,
              product_id: it.product_id,
              product_name: it.product_name || it.name || it.item_name || 'Grilled Item',
              quantity: Math.max(1, Number(it.quantity) || 1),
              unit_price: Number(it.unit_price ?? it.price ?? 0),
              total: Number(it.total ?? (Number(it.unit_price ?? it.price ?? 0) * (Number(it.quantity) || 1))),
              options: it.options,
            }));
            console.log(`📦 Loaded ${orderItems.length} items from Supabase order_items table for Order #${order.id}`);
          }
          if (itemsError) {
            console.warn('⚠️ Supabase order_items query notice:', itemsError.message);
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ Supabase database retrieval notice:', dbErr);
      }
    }

    // -----------------------------------------------------------------
    // 2. STRIPE LINE ITEMS FALLBACK & ENHANCEMENT:
    // If order_items are empty or order is missing from Supabase,
    // load line items & metadata directly from Stripe Checkout Session
    // -----------------------------------------------------------------
    if (stripe && stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

        if (session) {
          // If order wasn't in Supabase, synthesize OrderData from Stripe Session
          if (!order) {
            const isCollection = session.metadata?.fulfillment === 'Collection';
            const deliveryFee = isCollection ? 0 : 7.00;
            const grandTotal = (session.amount_total || 0) / 100;
            const subtotal = Math.max(0, Number((grandTotal - deliveryFee).toFixed(2)));

            const addressObj = session.customer_details?.address || (session as unknown as { shipping_details?: { address?: Stripe.Address } }).shipping_details?.address;
            const stripeAddress = addressObj
              ? [addressObj.line1, addressObj.line2, addressObj.city, addressObj.state, addressObj.postal_code, addressObj.country]
                  .map((p) => p?.trim())
                  .filter(Boolean)
                  .join(', ')
              : session.metadata?.deliveryAddress || (session.metadata?.postcode ? `Postcode: ${session.metadata.postcode}` : null);

            order = {
              id: session.metadata?.order_id || (session.id.startsWith('cs_') ? session.id.slice(-8).toUpperCase() : session.id),
              customer_name: session.customer_details?.name || session.metadata?.customerName || 'Customer',
              customer_email: session.customer_details?.email || session.customer_email || null,
              customer_phone: session.customer_details?.phone || session.metadata?.customerPhone || null,
              delivery_address: stripeAddress,
              fulfillment_method: session.metadata?.fulfillment || 'Delivery',
              subtotal: subtotal,
              delivery_fee: deliveryFee,
              total: grandTotal,
              payment_status: session.payment_status || 'paid',
              order_status: 'confirmed',
              created_at: new Date(session.created * 1000).toISOString(),
              stripe_session_id: session.id,
            };
          } else {
            // Ensure customer details from Stripe are filled in if missing in Supabase
            if (!order.customer_email && (session.customer_details?.email || session.customer_email)) {
              order.customer_email = session.customer_details?.email || session.customer_email;
            }
            if (!order.customer_name && (session.customer_details?.name || session.metadata?.customerName)) {
              order.customer_name = session.customer_details?.name || session.metadata?.customerName;
            }
            if (!order.customer_phone && (session.customer_details?.phone || session.metadata?.customerPhone)) {
              order.customer_phone = session.customer_details?.phone || session.metadata?.customerPhone;
            }
            if (!order.delivery_address) {
              const addressObj = session.customer_details?.address || (session as unknown as { shipping_details?: { address?: Stripe.Address } }).shipping_details?.address;
              if (addressObj) {
                const stripeAddress = [addressObj.line1, addressObj.line2, addressObj.city, addressObj.state, addressObj.postal_code, addressObj.country]
                  .map((p) => p?.trim())
                  .filter(Boolean)
                  .join(', ');
                if (stripeAddress) order.delivery_address = stripeAddress;
              }
            }
          }

          // Fetch Stripe line items if orderItems is empty
          if (orderItems.length === 0) {
            const lineItems = await stripe.checkout.sessions.listLineItems(stripeSessionId, {
              limit: 100,
              expand: ['data.price.product'],
            });

            if (lineItems && lineItems.data && lineItems.data.length > 0) {
              const stripeExtractedItems: OrderItemData[] = [];

              for (const li of lineItems.data) {
                const productObj = (typeof li.price?.product === 'object' && li.price?.product !== null)
                  ? (li.price.product as Stripe.Product)
                  : null;

                const rawName = li.description || productObj?.name || 'Flame-Grilled Item';

                // Exclude delivery line items from food items list
                if (rawName.toLowerCase().includes('delivery')) {
                  continue;
                }

                const quantity = Math.max(1, Number(li.quantity) || 1);
                const unitAmountInPence = li.price?.unit_amount || Math.round((li.amount_total || 0) / quantity);
                const unitPrice = unitAmountInPence / 100;
                const total = (li.amount_total || 0) / 100;

                // Extract custom options from Stripe description (e.g. "Spice Level: Extra Hot | Sides: Jollof Rice")
                const optString = productObj?.description || (li.description && li.description !== rawName ? li.description : '');

                stripeExtractedItems.push({
                  id: li.id,
                  product_id: productObj?.id || li.id,
                  product_name: rawName,
                  quantity,
                  unit_price: unitPrice,
                  total,
                  options: optString || undefined,
                });
              }

              if (stripeExtractedItems.length > 0) {
                orderItems = stripeExtractedItems;
                console.log(`📦 Loaded ${orderItems.length} items from Stripe line items for Order #${order.id}`);

                // Backfill into Supabase order_items table if order exists
                if (order.id && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
                  try {
                    await supabaseAdmin.from('order_items').insert(
                      orderItems.map((item) => ({
                        order_id: order!.id,
                        product_name: item.product_name,
                        name: item.product_name,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        price: item.unit_price,
                        total: item.total,
                        options: item.options ? { 'Details': item.options } : null,
                      }))
                    );
                    console.log(`✅ Backfilled ${orderItems.length} order items into Supabase.`);
                  } catch (backfillErr) {
                    console.warn('⚠️ Order items backfill notice:', backfillErr);
                  }
                }
              }
            }
          }
        }
      } catch (stripeErr) {
        console.warn('⚠️ Stripe session line items lookup notice:', stripeErr);
      }
    }

    if (!order) {
      console.error('❌ Could not resolve order details for email notifications. ID:', orderIdOrSessionId);
      return { success: false, error: 'Order not found' };
    }

    const orderData = order as OrderData;

    console.log(`📧 Pre-rendering HTML templates for Order #${orderData.id} (${orderItems.length} items: ${orderItems.map(i => i.product_name).join(', ') || 'None'}, Total: £${orderData.total})...`);

    // 3. Pre-render React Email templates to static HTML strings
    const receiptHtml = await render(
      React.createElement(OrderReceipt, {
        order: orderData,
        order_items: orderItems,
      })
    );

    const alertHtml = await render(
      React.createElement(NewOrderAlert, {
        order: orderData,
        order_items: orderItems,
      })
    );

    const results: { customer?: unknown; staff?: unknown } = {};

    // 4. Send Customer Order Receipt
    if (orderData.customer_email && orderData.customer_email.includes('@')) {
      try {
        const custRes = await resend.emails.send({
          from: DEFAULT_FROM,
          to: orderData.customer_email,
          subject: `Order Confirmed #${orderData.id} - Tylicious Grillz 🔥`,
          html: receiptHtml,
        });

        if (custRes.error) {
          console.error('❌ Resend customer receipt error:', custRes.error);
          results.customer = { error: custRes.error };
        } else {
          console.log(`✅ Order receipt emailed to customer: ${orderData.customer_email} (ID: ${custRes.data?.id})`);
          results.customer = { success: true, id: custRes.data?.id };
        }
      } catch (custErr) {
        console.error('❌ Exception sending customer receipt:', custErr);
        results.customer = { error: custErr };
      }
    } else {
      console.warn('⚠️ Order has no customer_email:', orderData);
    }

    // 5. Send Restaurant Staff New Order Alert
    try {
      const staffRes = await resend.emails.send({
        from: DEFAULT_FROM,
        to: RESTAURANT_OPERATIONAL_EMAIL,
        subject: `🚨 ACTION REQUIRED: New Order #${orderData.id} Received (£${Number(orderData.total).toFixed(2)})`,
        html: alertHtml,
      });

      if (staffRes.error) {
        console.error('❌ Resend staff alert error:', staffRes.error);
        results.staff = { error: staffRes.error };
      } else {
        console.log(`✅ Kitchen order alert sent to: ${RESTAURANT_OPERATIONAL_EMAIL} (ID: ${staffRes.data?.id})`);
        results.staff = { success: true, id: staffRes.data?.id };
      }
    } catch (staffErr) {
      console.error('❌ Exception sending staff alert:', staffErr);
      results.staff = { error: staffErr };
    }

    return { success: true, orderId: orderData.id, itemCount: orderItems.length, results };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown email error';
    console.error('❌ Failed to process order notification emails:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Sends contact form inquiry directly to order@tyliciousgrillz.com
 */
export async function sendContactInquiryEmail(data: ContactInquiryData) {
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const emailHtml = await render(
      React.createElement(ContactInquiryEmail, { data })
    );

    // 1. Send inquiry notification to restaurant operational inbox (order@tyliciousgrillz.com)
    const notificationRes = await resend.emails.send({
      from: DEFAULT_FROM,
      to: RESTAURANT_OPERATIONAL_EMAIL,
      replyTo: data.email,
      subject: `📬 New Contact Inquiry: ${data.subject} - from ${data.name}`,
      html: emailHtml,
    });

    if (notificationRes.error) {
      console.error('❌ Resend contact notification error:', notificationRes.error);
      return { success: false, error: notificationRes.error.message };
    }

    // 2. Send friendly confirmation receipt to the customer
    if (data.email && data.email.includes('@')) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: data.email,
          subject: 'We have received your message - Tylicious Grillz 🔥',
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FFF5F3; border-radius: 16px; border: 2px solid #1A0500;">
              <h2 style="color: #1A0500; margin-top: 0;">Hi ${data.name},</h2>
              <p style="color: #444; font-size: 15px; line-height: 1.6;">Thank you for reaching out to <strong>Tylicious Grillz</strong>!</p>
              <p style="color: #444; font-size: 15px; line-height: 1.6;">We have safely received your inquiry regarding <strong>"${data.subject}"</strong>. Our team is reviewing your message and will respond as quickly as possible.</p>
              <div style="background: #FFFFFF; padding: 16px; border-radius: 12px; border: 1px solid #FF8A8A; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #666;"><strong>Your message:</strong></p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #2A0300; white-space: pre-wrap;">${data.message}</p>
              </div>
              <p style="color: #777; font-size: 13px; margin-bottom: 0;">Warm regards,<br><strong>The Tylicious Grillz Team</strong><br>order@tyliciousgrillz.com</p>
            </div>
          `,
        });
      } catch (custErr) {
        console.warn('⚠️ Could not send contact confirmation to customer:', custErr);
      }
    }

    return { success: true, id: notificationRes.data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Failed to process contact inquiry email:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Sends catering inquiry directly to order@tyliciousgrillz.com
 */
export async function sendCateringInquiryEmail(data: CateringInquiryData) {
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const emailHtml = await render(
      React.createElement(CateringInquiryEmail, { data })
    );

    // 1. Send catering request to operational inbox (order@tyliciousgrillz.com)
    const notificationRes = await resend.emails.send({
      from: DEFAULT_FROM,
      to: RESTAURANT_OPERATIONAL_EMAIL,
      replyTo: data.email,
      subject: `🍖 New Catering Inquiry: ${data.name} - ${data.date} (${data.guests} guests)`,
      html: emailHtml,
    });

    if (notificationRes.error) {
      console.error('❌ Resend catering notification error:', notificationRes.error);
      return { success: false, error: notificationRes.error.message };
    }

    // 2. Send catering inquiry confirmation to client
    if (data.email && data.email.includes('@')) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: data.email,
          subject: `Catering Inquiry Received (${data.date}) - Tylicious Grillz 🍖`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FFF5F3; border-radius: 16px; border: 2px solid #1A0500;">
              <h2 style="color: #1A0500; margin-top: 0;">Hi ${data.name},</h2>
              <p style="color: #444; font-size: 15px; line-height: 1.6;">Thank you for your event inquiry with <strong>Tylicious Grillz</strong>!</p>
              <p style="color: #444; font-size: 15px; line-height: 1.6;">We have received your event details for <strong>${data.date}</strong> for approximately <strong>${data.guests} guests</strong>. Our event catering team is preparing a customized proposal and will reach out to you shortly via email or phone (${data.phone}).</p>
              <div style="background: #FFFFFF; padding: 16px; border-radius: 12px; border: 1px solid #FF8A8A; margin: 20px 0;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #666;"><strong>Event Summary:</strong></p>
                <p style="margin: 4px 0; font-size: 14px; color: #2A0300;">• <strong>Date:</strong> ${data.date}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #2A0300;">• <strong>Guests:</strong> ${data.guests}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #2A0300;">• <strong>Service Style:</strong> ${data.staffing || 'Standard'}</p>
                ${data.address ? `<p style="margin: 4px 0; font-size: 14px; color: #2A0300;">• <strong>Location:</strong> ${data.address}</p>` : ''}
                ${data.selectedMenu && data.selectedMenu.length > 0 ? `<p style="margin: 4px 0; font-size: 14px; color: #2A0300;">• <strong>Selected Menus:</strong> ${data.selectedMenu.join(', ')}</p>` : ''}
              </div>
              <p style="color: #777; font-size: 13px; margin-bottom: 0;">Warm regards,<br><strong>Tylicious Grillz Events Team</strong><br>order@tyliciousgrillz.com</p>
            </div>
          `,
        });
      } catch (custErr) {
        console.warn('⚠️ Could not send catering confirmation to client:', custErr);
      }
    }

    return { success: true, id: notificationRes.data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Failed to process catering inquiry email:', msg);
    return { success: false, error: msg };
  }
}
