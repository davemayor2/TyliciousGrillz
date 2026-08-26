import React from 'react';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/libs/supabase';
import { OrderReceipt, OrderData, OrderItemData } from '@/emails/OrderReceipt';
import { NewOrderAlert } from '@/emails/NewOrderAlert';

const apiKey = process.env.RESEND_API_KEY;

// Initialize Resend Client
export const resend = new Resend(apiKey || 're_placeholder');

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ||
  'Tylicious Grillz <onboarding@resend.dev>';

const RESTAURANT_OPERATIONAL_EMAIL =
  process.env.RESTAURANT_NOTIFICATION_EMAIL ||
  'orders@tyliciousgrillz.co.uk';

/**
 * Sends order confirmation receipt to customer and new order alert to restaurant staff
 * @param orderIdOrSessionId Supabase order ID or Stripe session ID
 */
export async function sendOrderNotifications(orderIdOrSessionId: string | number) {
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY is not configured. Skipping email dispatch.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    // 1. Fetch full order and associated order_items from Supabase
    let query = supabaseAdmin
      .from('orders')
      .select('*, order_items(*)');

    const isNumericId = typeof orderIdOrSessionId === 'number' || (!isNaN(Number(orderIdOrSessionId)) && !orderIdOrSessionId.toString().startsWith('cs_'));

    if (isNumericId) {
      query = query.eq('id', Number(orderIdOrSessionId));
    } else {
      query = query.eq('stripe_session_id', String(orderIdOrSessionId));
    }

    const { data: order, error } = await query.maybeSingle();

    if (error || !order) {
      console.warn('⚠️ Could not find order in Supabase for email notifications:', error?.message || orderIdOrSessionId);
      return { success: false, error: error?.message || 'Order not found' };
    }

    const orderData = order as OrderData;
    const orderItems = (order.order_items || []) as OrderItemData[];

    console.log(`📧 Dispatching Resend email notifications for Order #${orderData.id}...`);

    const emailPromises: Promise<unknown>[] = [];

    // 2. Send Customer Order Receipt
    if (orderData.customer_email && orderData.customer_email.includes('@')) {
      emailPromises.push(
        resend.emails.send({
          from: DEFAULT_FROM,
          to: orderData.customer_email,
          subject: `Order Confirmed #${orderData.id} - Tylicious Grillz 🔥`,
          react: React.createElement(OrderReceipt, {
            order: orderData,
            order_items: orderItems,
          }),
        }).then((res) => {
          if (res.error) {
            console.warn('⚠️ Resend customer receipt notice:', res.error.message);
          } else {
            console.log(`✅ Order receipt emailed to customer: ${orderData.customer_email}`);
          }
          return res;
        }).catch((err) => {
          console.warn('⚠️ Customer email sending error:', err);
        })
      );
    }

    // 3. Send Restaurant Staff New Order Alert
    emailPromises.push(
      resend.emails.send({
        from: DEFAULT_FROM,
        to: RESTAURANT_OPERATIONAL_EMAIL,
        subject: `🚨 ACTION REQUIRED: New Order #${orderData.id} Received (£${Number(orderData.total).toFixed(2)})`,
        react: React.createElement(NewOrderAlert, {
          order: orderData,
          order_items: orderItems,
        }),
      }).then((res) => {
        if (res.error) {
          // If sending to unverified custom domain in testing mode, log notice gracefully
          console.warn('⚠️ Resend staff alert notice:', res.error.message);
        } else {
          console.log(`✅ Kitchen order alert sent to: ${RESTAURANT_OPERATIONAL_EMAIL}`);
        }
        return res;
      }).catch((err) => {
        console.warn('⚠️ Staff alert email sending error:', err);
      })
    );

    await Promise.allSettled(emailPromises);

    return { success: true, orderId: orderData.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown email error';
    console.error('❌ Failed to process order notification emails:', msg);
    return { success: false, error: msg };
  }
}
