import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Must match PROMO / PROMO_PCT constants in page.tsx
const PROMO_CODE = 'FOUNDING';
const PROMO_DISCOUNT = 0.20;

// Flat item shape sent from page.tsx cart.map()
interface FlatItem {
  lessonId: string;
  name: string;
  quantity: number;
  price: number;        // c.lesson.price.min
  date?: string | null;
  time?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerEmail,
      customerName,
      promoCode,
      promoApplied,
    }: {
      items: FlatItem[];
      customerEmail?: string;
      customerName?: string;
      promoCode?: string;
      promoApplied?: boolean;
    } = body;

    const isPromo =
      promoApplied === true ||
      (typeof promoCode === 'string' &&
        promoCode.toUpperCase() === PROMO_CODE);

    // Sum prices using the flat price field sent from the frontend
    const amount = Math.round(
      items.reduce((sum, item) => {
        const discount = isPromo ? 1 - PROMO_DISCOUNT : 1;
        return sum + item.price * item.quantity * discount;
      }, 0) * 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: customerEmail || undefined,
      metadata: {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        bookedDate: items[0]?.date ?? '',
        bookedTime: items[0]?.time ?? '',
        promoCode: promoCode || '',
        items: JSON.stringify(
          items.map((i) => ({
            id: i.lessonId,
            title: i.name,
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
