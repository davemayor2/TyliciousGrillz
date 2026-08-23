import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { FULL_MENU_DATA } from '@/constants';

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
    const {
      items,
      fulfillment = 'Delivery',
      postcode = '',
      scheduledDate = '',
      scheduledTime = '',
      customerEmail = '',
    } = body;

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

    // Build a quick lookup map for fast O(1) product validation from database/constants
    const productCatalogMap = new Map(FULL_MENU_DATA.map((p) => [p.id, p]));

    // Format line items using ONLY verified backend prices (in pence)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const productId = item.product?.id || item.id;
      const verifiedProduct = productCatalogMap.get(productId);

      if (!verifiedProduct) {
        return NextResponse.json(
          { error: `Invalid product item in basket (ID: ${productId}).` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      // Verified authoritative price from backend in smallest currency unit (pence): £55 = 5500
      const unitAmountInPence = Math.round(verifiedProduct.price * 100);

      const sides =
        Array.isArray(item.selectedSides) && item.selectedSides.length > 0
          ? item.selectedSides.join(', ')
          : '';

      const details = [
        item.spiceLevel ? `Spice: ${item.spiceLevel}` : '',
        sides ? `Sides: ${sides}` : '',
        item.specialNotes ? `Notes: ${item.specialNotes}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      line_items.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: verifiedProduct.name,
            description: details.length > 0 ? details.slice(0, 500) : verifiedProduct.description,
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

    // Add Flat rate delivery fee if delivery is chosen (or by default)
    if (fulfillment !== 'Collection') {
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

    // Create the Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/menu?canceled=true`,
      metadata: {
        fulfillment,
        postcode,
        scheduledDate,
        scheduledTime,
        itemCount: String(items.length),
      },
    };

    if (customerEmail && typeof customerEmail === 'string' && customerEmail.includes('@')) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
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
