// types/index.ts
// KP Golf Training — Global TypeScript Types

export type LessonDuration = 30 | 45 | 60 | 90
export type LessonFrequency = 'weekly' | 'biweekly' | 'custom'
export type LessonStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface BookingSlot {
  date: string | null   // null = 'To Be Scheduled Later'
  startTime: string | null
  notes?: string
}

export interface CartItem {
  id: string
  packageId: string
  packageName: string
  duration: LessonDuration
  quantity: number
  slots: BookingSlot[]
  unitPrice: number
  totalPrice: number
  promoApplied: boolean
  promoDiscount: number
  stripePriceKey: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  promoCode: string
  foundingMemberApplied: boolean
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface CheckoutPayload {
  customer: CustomerInfo
  cart: Cart
}

// Supabase DB Row Types
export interface DbCustomer {
  id: string
  name: string
  email: string
  phone: string
  is_founding_member: boolean
  created_at: string
}

export interface DbBooking {
  id: string
  customer_id: string
  package_id: string
  duration_minutes: LessonDuration
  scheduled_date: string | null
  scheduled_time: string | null
  status: LessonStatus
  stripe_payment_intent_id: string
  amount_paid: number
  notes: string | null
  created_at: string
}

export interface DbLessonCredit {
  id: string
  customer_id: string
  pack_type: string
  total_sessions: number
  used_sessions: number
  remaining_sessions: number
  created_at: string
  expires_at: string | null
}

export interface DbPayment {
  id: string
  customer_id: string
  stripe_payment_intent_id: string
  stripe_session_id: string
  amount: number
  currency: string
  status: PaymentStatus
  created_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateCheckoutResponse {
  sessionId: string
  url: string
}
