import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Must match PROMO / PROMO_PCT constants in page.tsx
const PROMO_CODE = 'FOUNDING';
const PROMO_DISCOUNT = 0.20;

// CartItem shape sent from page.tsx
interface CartItem {
  lesson: {
    id: string;
    title: string;
    price: { min: number; max: number };
    promoEligible?: boolean;
  };
  quantity: number;
  date?: string;
  time?: string;
}

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
    }: {
      items: CartItem[];
      customerEmail?: string;
      customerName?: string;
      promoCode?: string;
      bookedDate?: string;
      bookedTime?: string;
      promoApplied?: boolean;
    } = body;

    const isPromo =
      promoApplied === true ||
      (typeof promoCode === 'string' &&
        promoCode.toUpperCase() === PROMO_CODE);

    // Sum prices using lesson.price.min (the sale/current price)
    const amount = Math.round(
      items.reduce((sum, item) => {
        const unitPrice = item.lesson.price.min;
        const discount =
          isPromo && item.lesson.promoEligible !== false
            ? 1 - PROMO_DISCOUNT
            : 1;
        return sum + unitPrice * item.quantity * discount;
      }, 0) * 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: customerEmail || undefined,
      metadata: {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        bookedDate: bookedDate || (items[0]?.date ?? ''),
        bookedTime: bookedTime || (items[0]?.time ?? ''),
        promoCode: promoCode || '',
        items: JSON.stringify(
          items.map((i) => ({
            id: i.lesson.id,
            title: i.lesson.title,
            qty: i.quantity,
            date: i.date,
            time: i.time,
          }))
        ),
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
