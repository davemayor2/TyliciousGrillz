import React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { supabaseAdmin } from '@/libs/supabase/server';
import { OrderReceipt, OrderData, OrderItemData } from '@/emails/OrderReceipt';
import { NewOrderAlert } from '@/emails/NewOrderAlert';

const apiKey = process.env.RESEND_API_KEY;

// Initialize Resend Client
export const resend = new Resend(apiKey || 're_placeholder');

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

    // 1. Fetch full order and associated order_items from Supabase
    if (targetStr.startsWith('cs_')) {
      // Lookup by Stripe session ID
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('stripe_session_id', targetStr)
        .maybeSingle();

      if (data) {
        order = data as OrderData;
        orderItems = (data.order_items || []) as OrderItemData[];
      }
      if (error) console.warn('⚠️ Supabase lookup by stripe_session_id:', error.message);
    } else {
      // Lookup by order primary key ID (integer or UUID)
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderIdOrSessionId)
        .maybeSingle();

      if (data) {
        order = data as OrderData;
        orderItems = (data.order_items || []) as OrderItemData[];
      } else {
        // Fallback search by stripe_session_id in case a session ID without cs_ prefix was provided
        const { data: fallbackData } = await supabaseAdmin
          .from('orders')
          .select('*, order_items(*)')
          .eq('stripe_session_id', targetStr)
          .maybeSingle();

        if (fallbackData) {
          order = fallbackData as OrderData;
          orderItems = (fallbackData.order_items || []) as OrderItemData[];
        }
      }
      if (error) console.warn('⚠️ Supabase lookup by id:', error.message);
    }

    if (!order) {
      console.error('❌ Could not find order in Supabase for email notifications. ID:', orderIdOrSessionId);
      return { success: false, error: 'Order not found in database' };
    }

    const orderData = order as OrderData;

    console.log(`📧 Pre-rendering HTML templates for Order #${orderData.id} (Total: £${orderData.total})...`);

    // 2. Pre-render React Email templates to static HTML strings
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

    // 3. Send Customer Order Receipt
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

    // 4. Send Restaurant Staff New Order Alert
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

    return { success: true, orderId: orderData.id, results };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown email error';
    console.error('❌ Failed to process order notification emails:', msg);
    return { success: false, error: msg };
  }
}
