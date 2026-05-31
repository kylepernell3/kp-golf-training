// lib/data.ts
// KP Golf Training — All static data, URLs, and lesson configuration

// ============================================
// VIDEO ASSETS — On-course swing videos
// ============================================
export const VIDEO_URLS: string[] = [
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af0f4045e32379f10fa3f.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af0f45a3e6e89b6f76864.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af313045e32379f111cbe.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af312045e32379f111cbb.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af357045e32379f11230b.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af357d53fc25488c3385d.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af3565be84ad64045dba4.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af3565a3e6e89b6f79150.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af61cd53fc25488c36b67.mov',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af61d5a3e6e89b6f7c3bc.mov',
]

// ============================================
// IMAGE ASSETS — Pine Valley photos
// ============================================
export const PINE_VALLEY_IMAGES: string[] = [
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808d53fc25488c38bad.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808045e32379f1172bb.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af8085a3e6e89b6f7e2b2.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808045e32379f1172b9.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808ff82912d65a97cec.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808ff82912d65a97ced.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808ff82912d65a97cf0.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808d53fc25488c38bab.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808d53fc25488c38bae.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af808ff82912d65a97cf2.jpeg',
  'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a1af7f95a3e6e89b6f7e1ef.jpeg',
]

// ============================================
// LESSON TYPES & PRICING
// ============================================
export type LessonDuration = 30 | 45 | 60 | 90

export interface LessonPackage {
  id: string
  name: string
  tagline: string
  description: string
  durations?: LessonDuration[]
  defaultDuration?: LessonDuration
  sessionCount?: number
  pricePerSession: number
  totalPrice: number
  originalTotal?: number
  badge?: 'most-popular' | 'best-value' | 'junior' | 'founding'
  stripePriceKey: string
}

export const LESSON_PACKAGES: LessonPackage[] = [
  {
    id: 'quick-tune-up',
    name: 'Quick Tune-Up',
    tagline: 'Fix one thing fast',
    description: 'Perfect for a specific issue — grip, alignment, setup, or that one shot that\'s costing you strokes. In and out with a clear fix and a drill to take to the range.',
    durations: [30],
    defaultDuration: 30,
    pricePerSession: 38,
    totalPrice: 38,
    stripePriceKey: '30min',
  },
  {
    id: 'standard-session',
    name: 'Standard Session',
    tagline: 'Full swing + a practice plan',
    description: 'Full swing review, 1–2 key adjustments, and a simple practice plan to take home. This is the most popular format and where most golfers see the quickest improvement.',
    durations: [45, 60],
    defaultDuration: 60,
    pricePerSession: 60,
    totalPrice: 60,
    badge: 'most-popular',
    stripePriceKey: '60min',
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    tagline: 'Serious overhaul session',
    description: 'Full warm-up, complete swing breakdown, multiple drills, on-course strategy tips, and a written practice plan. Best for golfers who are serious about making real change.',
    durations: [90],
    defaultDuration: 90,
    pricePerSession: 88,
    totalPrice: 88,
    stripePriceKey: '90min',
  },
  {
    id: 'starter-pack',
    name: '3-Lesson Starter Pack',
    tagline: 'Commit to the process',
    description: 'Three 45-minute sessions scheduled at your pace. Each session builds on the last — by session 3 you\'ll have a clear picture of your game and a roadmap to keep improving.',
    defaultDuration: 45,
    sessionCount: 3,
    pricePerSession: 47,
    totalPrice: 141,
    originalTotal: 165,
    stripePriceKey: 'pack-3x45',
  },
  {
    id: 'break-90-pack',
    name: '5-Lesson Break-90 Pack',
    tagline: 'The real transformation package',
    description: 'Five 60-minute sessions designed to take your game to the next level. We\'ll systematically work through every part of your game — driving, irons, short game, and course management.',
    defaultDuration: 60,
    sessionCount: 5,
    pricePerSession: 56,
    totalPrice: 280,
    originalTotal: 325,
    badge: 'best-value',
    stripePriceKey: 'pack-5x60',
  },
  {
    id: 'junior-pack',
    name: 'Junior Development Pack',
    tagline: 'For the next generation',
    description: 'Four 45-minute sessions built specifically for junior golfers (ages 8–17). Patient, fun, and fundamentals-first. We\'ll build a solid foundation they can grow on.',
    defaultDuration: 45,
    sessionCount: 4,
    pricePerSession: 42,
    totalPrice: 168,
    originalTotal: 192,
    badge: 'junior',
    stripePriceKey: 'pack-jr-4x45',
  },
]

// ============================================
// MARQUEE / BANNER TEXT
// ============================================
export const MARQUEE_LINE_1 =
  'Fix Your Slice • Gain Distance • Pure Your Irons • Stop Topping Drives • Roll More Putts • Lower Your Score • Play with Confidence • Fix Your Slice • Gain Distance • Pure Your Irons • Stop Topping Drives • Roll More Putts • Lower Your Score • Play with Confidence'

export const MARQUEE_LINE_2 =
  'Beginner-Friendly • Affordable Rates • Flexible Scheduling • Real Course Experience • South Jersey Local • Judgment-Free Zone • Beginner-Friendly • Affordable Rates • Flexible Scheduling • Real Course Experience • South Jersey Local • Judgment-Free Zone'

// ============================================
// FAQ
// ============================================
export const FAQ_ITEMS = [
  {
    q: 'Are you a PGA certified instructor?',
    a: "Not yet — but I bring something just as valuable: real lived experience. I've caddied at Tavistock and Pine Valley, two of the most elite courses in the world. I've watched thousands of swings up close, given tips to golfers of every level, and studied the game deeply. My coaching is practical, honest, and gets results.",
  },
  {
    q: 'Where do lessons take place?',
    a: 'Lessons are held at local South Jersey ranges and courses. Once you book, I\'ll confirm the exact location based on your preference and availability. I\'m flexible on location.',
  },
  {
    q: 'What should I bring?',
    a: 'Just your clubs and some balls if the range doesn\'t provide them. Wear comfortable clothes you can swing in. No special equipment needed — we\'ll use what you have.',
  },
  {
    q: 'What if I need to reschedule?',
    a: 'No problem at all. Life happens. Just give me 24 hours notice and we\'ll find a new time that works. Pack holders can schedule sessions as they go, so there\'s full flexibility.',
  },
  {
    q: 'I\'m a complete beginner. Is that okay?',
    a: 'Absolutely — beginners are welcome and this is actually where coaching makes the biggest difference. We\'ll start with the fundamentals and build from the ground up. No judgment, no rush.',
  },
  {
    q: 'What does the Founding Member discount mean?',
    a: 'For the first 15 students, all lesson packs are 20% off — locked in at that rate for their first 2-3 months. This is my way of rewarding early believers and building the right community from day one.',
  },
]

// ============================================
// BUSINESS INFO
// ============================================
export const BUSINESS = {
  name: 'KP Golf Training',
  tagline: 'South Jersey Golf Lessons That Won\'t Break the Bank',
  location: 'South Jersey, NJ',
  email: 'kp@kpgolftraining.com',
  phone: '(609) 000-0000',
  instagram: '@kpgolftraining',
  foundingMemberSlots: 15,
  foundingMemberDiscount: 20,
  promoCode: 'FOUNDER20',
}
