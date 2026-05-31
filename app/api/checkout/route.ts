import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerEmail, customerName, promoCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Calculate total
    let subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    // Apply promo code
    if (promoCode === 'FOUNDING20') {
      discount = Math.round(subtotal * 0.20);
    }

    const total = subtotal - discount;

    // Build line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add discount line item if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Founding Member Discount (20% off)' },
          unit_amount: -discount * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
      metadata: {
        customerName,
        promoCode: promoCode || '',
        items: JSON.stringify(items),
      },
    });

    // Save booking to Supabase
    await supabase.from('bookings').insert({
      customer_name: customerName,
      customer_email: customerEmail,
      items: items,
      subtotal,
      discount,
      total,
      stripe_session_id: session.id,
      status: 'pending',
      promo_code: promoCode || null,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
