# KP Golf Training — Email Templates

> These templates are used in the GHL post-booking automation workflow.
> All `{{contact.*}}` merge tags map directly to GHL contact fields.

---

## 1. Customer Booking Confirmation Email

**Subject:** You're on the range, {{contact.first_name}}. Lesson confirmed ⛳

**Preview Text:** Everything's locked in — here's what you need to know.

---

Hey {{contact.first_name}},

You're all set. Your lesson is booked and I'm looking forward to working with you.

Here's a quick summary of what you've got locked in:

---

**Booking Details**

| | |
|---|---|
| **Lesson** | {{contact.lesson_name}} |
| **Date** | {{contact.booked_date}} |
| **Time** | {{contact.booked_time}} |
| **Amount Paid** | ${{contact.lesson_amount_paid}} |

---

**What to bring:**
- Your clubs (or just a few irons — totally fine)
- Golf shoes or sneakers work great
- A water bottle
- An open mind — we're going to fix something real

I'll confirm the exact location with you a day before your lesson. Most sessions are at a local South Jersey driving range or practice facility — I'll pick the best fit for what we're working on.

If you need to reschedule, just reply to this email and give me at least 24 hours. No stress, no penalty — I run this personally and I'm flexible.

See you on the range.

— KP
**KP Golf Training** | South Jersey
Text anytime with questions

---

*To reschedule or cancel, reply directly to this email.*

---

## 2. Internal Booking Notification Email (to KP)

**Subject:** New Booking — {{contact.first_name}} {{contact.last_name}} | {{contact.lesson_name}}

---

New booking just came in through the website.

---

**Customer**

| | |
|---|---|
| **Name** | {{contact.first_name}} {{contact.last_name}} |
| **Email** | {{contact.email}} |
| **Phone** | {{contact.phone}} |

**Lesson Details**

| | |
|---|---|
| **Lesson Type** | {{contact.lesson_name}} |
| **Date** | {{contact.booked_date}} |
| **Time** | {{contact.booked_time}} |

**Payment**

| | |
|---|---|
| **Amount Paid** | ${{contact.lesson_amount_paid}} |
| **Promo Code Used** | {{contact.promo_code_used}} |
| **Stripe Session ID** | {{contact.stripe_session_id}} |

---

Reply directly to this email to reach the customer, or head into GHL to view their full contact record.

---

## 3. Pre-Lesson Reminder SMS (fires 24hrs before lesson)

```
Reminder: Your KP Golf lesson is tomorrow at {{contact.booked_time}}. 
Same spot as before — I'll send the address shortly. 
See you on the range! — KP
```

---

## 4. Confirmation SMS (fires immediately after booking)

```
Hey {{contact.first_name}}, you're booked! 
KP Golf lesson confirmed for {{contact.booked_date}} at {{contact.booked_time}}. 
Check your email for full details. See you soon! — KP
```

---

## GHL Merge Field Reference

| Merge Tag | Maps To | Source |
|---|---|---|
| `{{contact.first_name}}` | Customer first name | GHL Contact |
| `{{contact.last_name}}` | Customer last name | GHL Contact |
| `{{contact.email}}` | Customer email | GHL Contact |
| `{{contact.phone}}` | Customer phone | GHL Contact |
| `{{contact.lesson_name}}` | Lesson booked | Custom Field |
| `{{contact.booked_date}}` | Lesson date | Custom Field |
| `{{contact.booked_time}}` | Lesson time | Custom Field |
| `{{contact.lesson_amount_paid}}` | Amount charged | Custom Field |
| `{{contact.promo_code_used}}` | Promo code (if any) | Custom Field |
| `{{contact.stripe_session_id}}` | Stripe session ref | Custom Field |
