import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Promo code constant — must match PROMO in page.tsx
const PROMO_CODE = 'FOUNDING';
const PROMO_DISCOUNT = 0.20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerEmail,
      customerName,
      promoCode,
      bookedDate,
      bookedTime,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Calculate subtotal and discount
    const subtotal: number = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const promoApplied = promoCode === PROMO_CODE;
    const discount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT * 100) / 100 : 0;
    const total = subtotal - discount;

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    // Add discount line item if promo applied
    if (promoApplied && discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Promo: ${PROMO_CODE} (20% off)`,
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kp-golf-training.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=true`,
      metadata: {
        customerName,
        promoCode: promoCode || '',
        promoApplied: String(promoApplied),
        discount: String(discount),
        total: String(total),
        bookedDate: bookedDate || '',
        bookedTime: bookedTime || '',
      },
    });

    // Insert pending booking into Supabase
    const { error: dbError } = await supabase.from('bookings').insert({
      customer_name: customerName,
      customer_email: customerEmail,
      items: items,
      subtotal,
      discount,
      total,
      stripe_session_id: session.id,
      status: 'pending',
      promo_code: promoCode || null,
      booked_date: bookedDate || null,
      booked_time: bookedTime || null,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // Don't block checkout if DB write fails — Stripe webhook will reconcile
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
