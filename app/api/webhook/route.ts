import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Required: tell Next.js to pass the raw body so Stripe can verify the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        console.log('Payment completed for session:', session.id);

        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session expired:', session.id);

        await supabase
          .from('bookings')
          .update({ status: 'expired' })
          .eq('stripe_session_id', session.id);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed for intent:', paymentIntent.id);
        // Could update booking status here if needed
        break;
      }

      default:
        // Unhandled event type - log and ignore
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error processing webhook event:', err);
    // Return 200 so Stripe doesn't retry - log the error for investigation
    return NextResponse.json({ received: true, error: err.message });
  }

  return NextResponse.json({ received: true });
}
