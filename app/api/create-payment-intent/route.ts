import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      promoApplied,
    } = body;

    // Support both promoCode string check and promoApplied boolean
    const isPromo =
      promoApplied === true ||
      (typeof promoCode === 'string' &&
        promoCode.toUpperCase() === PROMO_CODE);
    const discountMultiplier = isPromo ? 1 - PROMO_DISCOUNT : 1;

    // Calculate total in cents
    const amount = Math.round(
      items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      ) *
        discountMultiplier *
        100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: customerEmail || undefined,
      metadata: {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        bookedDate: bookedDate || '',
        bookedTime: bookedTime || '',
        promoCode: promoCode || '',
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    console.error('PaymentIntent error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
