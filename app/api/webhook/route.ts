import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Fire booking data to GHL inbound webhook ────────────────────────────────
async function notifyGHL(payload: {
  customerName: string;
  customerEmail: string;
  bookedDate: string;
  bookedTime: string;
  promoCode: string;
  lessonName: string;
  amountPaid: string;
  stripeSessionId: string;
}) {
  const ghlUrl = process.env.GHL_WEBHOOK_URL;
  if (!ghlUrl) {
    console.warn('GHL_WEBHOOK_URL is not set — skipping GHL notification');
    return;
  }
  try {
    const res = await fetch(ghlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('GHL webhook responded with status:', res.status);
    } else {
      console.log('GHL webhook fired successfully');
    }
  } catch (err) {
    console.error('Failed to fire GHL webhook:', err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        // 1. Update Supabase booking status to paid
        await supabase
          .from('bookings')
          .update({ status: 'paid' })
          .eq('stripe_session_id', session.id);

        // 2. Pull metadata stored at checkout time
        const meta = session.metadata ?? {};
        const customerName  = meta.customerName  ?? '';
        const bookedDate    = meta.bookedDate    ?? '';
        const bookedTime    = meta.bookedTime    ?? '';
        const promoCode     = meta.promoCode     ?? '';
        const customerEmail = session.customer_email ?? '';

        // 3. Pull lesson name + amount from Stripe line items
        let lessonName  = '';
        let amountPaid  = '0.00';
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
          if (lineItems.data.length > 0) {
            lessonName = lineItems.data.map((i) => i.description).join(', ');
            const totalCents = lineItems.data.reduce((sum, i) => sum + (i.amount_total ?? 0), 0);
            amountPaid = (totalCents / 100).toFixed(2);
          }
        } catch (liErr) {
          console.error('Could not fetch line items:', liErr);
        }

        // 4. Fire to GHL
        await notifyGHL({
          customerName,
          customerEmail,
          bookedDate,
          bookedTime,
          promoCode,
          lessonName,
          amountPaid,
          stripeSessionId: session.id,
        });

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error processing webhook event:', err);
    return NextResponse.json({ received: true, error: err.message });
  }

  return NextResponse.json({ received: true });
}
