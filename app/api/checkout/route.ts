import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Promo code constant - must match PROMO in page.tsx
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

    const discountMultiplier =
      promoCode?.toUpperCase() === PROMO_CODE ? 1 - PROMO_DISCOUNT : 1;

    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * discountMultiplier * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        customerName: customerName || '',
        bookedDate: bookedDate || '',
        bookedTime: bookedTime || '',
        promoCode: promoCode || '',
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
