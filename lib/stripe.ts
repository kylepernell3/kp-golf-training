import Stripe from 'stripe'

// Server-side Stripe client
// Only import/use in API routes or server components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Stripe Price ID map — set these in your .env.local after
// creating products in the Stripe Dashboard
export const STRIPE_PRICES = {
  '30min':       process.env.STRIPE_PRICE_30MIN       ?? '',
  '45min':       process.env.STRIPE_PRICE_45MIN       ?? '',
  '60min':       process.env.STRIPE_PRICE_60MIN       ?? '',
  '90min':       process.env.STRIPE_PRICE_90MIN       ?? '',
  'pack-3x45':   process.env.STRIPE_PRICE_PACK_3x45   ?? '',
  'pack-5x60':   process.env.STRIPE_PRICE_PACK_5x60   ?? '',
  'pack-jr-4x45':process.env.STRIPE_PRICE_PACK_JR_4x45 ?? '',
} as const

export type StripePriceKey = keyof typeof STRIPE_PRICES

// Founding Member promo discount (20%)
export const FOUNDING_MEMBER_DISCOUNT = 0.20
export const FOUNDING_MEMBER_PROMO_CODE = 'FOUNDER20'
export const FOUNDING_MEMBER_SLOTS_REMAINING = 15
