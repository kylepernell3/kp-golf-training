'use client'

import React, {
  useState, useEffect, useRef, useMemo,
} from 'react'
import { createClient } from '@supabase/supabase-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// ─── Supabase (public read — availability) ────────────────────────────────
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Stripe (initialised once at module level) ────────────────────────────
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ─── Stripe Elements appearance ──────────────────────────────────────────
// Uses hex values — CSS vars are not available inside Stripe's iframe.
const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary:          '#c5983e',
    colorBackground:       '#101e14',
    colorText:             '#ede8dc',
    colorDanger:           '#e07070',
    fontFamily:            "'DM Sans', system-ui, sans-serif",
    spacingUnit:           '4px',
    borderRadius:          '2px',
    colorTextPlaceholder:  '#506056',
    colorBorder:           'rgba(255,255,255,0.07)',
    colorIconTab:          '#96a89a',
    colorIconTabSelected:  '#c5983e',
    colorTextSecondary:    '#96a89a',
  },
  rules: {
    '.Input': {
      border:          '1px solid rgba(255,255,255,0.07)',
      backgroundColor: '#101e14',
      color:           '#ede8dc',
      boxShadow:       'none',
      fontSize:        '14px',
      padding:         '12px 16px',
    },
    '.Input:focus': {
      borderColor: '#6b4c10',
      boxShadow:   'none',
    },
    '.Label': {
      color:         '#506056',
      fontSize:      '9px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      fontFamily:    "'JetBrains Mono', monospace",
      fontWeight:    '400',
    },
    '.Tab': {
      backgroundColor: '#0c1810',
      border:          '1px solid rgba(255,255,255,0.07)',
      boxShadow:       'none',
      color:           '#96a89a',
    },
    '.Tab:hover': {
      color:           '#ede8dc',
      backgroundColor: '#101e14',
    },
    '.Tab--selected': {
      borderColor:     'rgba(197,152,62,0.4)',
      backgroundColor: '#101e14',
      color:           '#ede8dc',
    },
    '.Block': {
      backgroundColor: '#0c1810',
      borderColor:     'rgba(255,255,255,0.07)',
    },
    '.Error': {
      color:    '#e07070',
      fontSize: '13px',
    },
    '.CheckboxInput': {
      backgroundColor: '#101e14',
      borderColor:     'rgba(255,255,255,0.07)',
    },
    '.CheckboxInput--checked': {
      backgroundColor: '#c5983e',
      borderColor:     '#c5983e',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// AVAILABILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg:#070f0a; --bg2:#0c1810; --bgc:#101e14; --bch:#14261a;
  --g9:#0e2118; --g8:#183822; --g7:#22502e; --g6:#2d6b3d;
  --g5:#3d8a52; --g4:#54aa6e;
  --o7:#6b4c10; --o6:#9a6e18; --o5:#c5983e; --o4:#d8b05a; --o3:#eacb80;
  --t1:#ede8dc; --t2:#96a89a; --t3:#506056; --t4:#2e403a;
  --bd:rgba(255,255,255,0.07); --ba:rgba(197,152,62,0.4);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{background:var(--bg);color:var(--t1);font-family:'DM Sans',system-ui,sans-serif;overflow-x:hidden}
::selection{background:var(--o5);color:var(--bg)}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--g7);border-radius:2px}

@keyframes kpFall {
  0%{transform:translateY(-130px) rotate(0deg);opacity:0}
  8%{opacity:1} 75%{opacity:0.45}
  100%{transform:translateY(108vh) rotate(var(--fr,360deg));opacity:0}
}
@keyframes kpML {from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes kpMR {from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes kpFloat {
  0%,100%{transform:translateY(0) rotate(0deg)}
  33%{transform:translateY(-11px) rotate(2deg)}
  66%{transform:translateY(-5px) rotate(-1.5deg)}
}
@keyframes kpFU {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes kpLoad {from{width:0%}to{width:100%}}
@keyframes kpPulse {
  0%{transform:scale(0.9);opacity:0.8}
  70%{transform:scale(1.25);opacity:0}
  100%{transform:scale(0.9);opacity:0}
}
@keyframes kpSpin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

.af{animation:kpFall var(--fd,7s) var(--fdy,0s) linear infinite}
.aml{animation:kpML var(--ms,30s) linear infinite;display:flex}
.amr{animation:kpMR var(--ms,36s) linear infinite;display:flex}
.aft{animation:kpFloat 8s ease-in-out infinite}
.afu{animation:kpFU .75s ease-out forwards}
.al{animation:kpLoad 1.9s cubic-bezier(.4,0,.2,1) forwards}
.ap{animation:kpPulse 1.7s ease-out infinite}

.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:13px 28px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:11px;
  letter-spacing:.18em;text-transform:uppercase;background:var(--o5);color:var(--bg);
  border:1px solid var(--o5);cursor:pointer;transition:all .22s ease;text-decoration:none;
  user-select:none;white-space:nowrap;min-height:44px}
.btn-g:hover{background:var(--o3);border-color:var(--o3);transform:translateY(-1px)}
.btn-g:active{transform:translateY(0)}
.btn-g:disabled{opacity:.35;cursor:not-allowed;transform:none}
.btn-g:focus-visible{outline:2px solid var(--o5);outline-offset:3px}

.btn-w{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:13px 28px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:11px;
  letter-spacing:.18em;text-transform:uppercase;background:transparent;color:var(--t1);
  border:1px solid var(--bd);cursor:pointer;transition:all .22s ease;text-decoration:none;
  user-select:none;white-space:nowrap;min-height:44px}
.btn-w:hover{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.05)}
.btn-w:focus-visible{outline:2px solid rgba(255,255,255,.4);outline-offset:3px}

button:focus-visible{outline:2px solid var(--o5);outline-offset:2px}
a:focus-visible{outline:2px solid var(--o5);outline-offset:3px}

.lbl{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--o5)}
.hdg{font-family:'Cormorant Garamond',serif;font-weight:400;
  font-size:clamp(44px,7vw,86px);line-height:.91;color:var(--t1)}

.kcard{background:var(--bgc);border:1px solid var(--bd);transition:all .3s ease}
.kcard:hover{background:var(--bch);border-color:rgba(255,255,255,.12);transform:translateY(-3px)}

.acc{display:grid;grid-template-rows:0fr;transition:grid-template-rows .38s ease}
.acc.open{grid-template-rows:1fr}
.acc>div{overflow:hidden}

.ns::-webkit-scrollbar{display:none}
.ns{-ms-overflow-style:none;scrollbar-width:none}

.grain::after{content:'';position:fixed;inset:0;z-index:1;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:180px 180px;opacity:.026}

input[type=checkbox]{accent-color:var(--o5)}
input,textarea{font-family:'DM Sans',sans-serif}

.nd{display:none}
.nh{display:flex}
@media(min-width:768px){
  .nd{display:flex}
  .nh{display:none}
}

.sec{padding:clamp(80px,10vw,140px) clamp(20px,4vw,40px)}
.wrap{max-width:1280px;margin:0 auto}

.lesson-row{display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;cursor:pointer;transition:all .22s ease;text-align:left;width:100%;
  min-height:72px}
.lesson-row:hover{background:var(--bch) !important}

.time-btn{padding:11px 6px;font-family:'JetBrains Mono',monospace;font-size:11px;
  cursor:pointer;transition:all .2s;min-height:42px;border:none}
.time-btn:disabled{cursor:not-allowed}
.time-btn:not(:disabled):focus-visible{outline:2px solid var(--o5);outline-offset:2px}

.date-btn{flex-shrink:0;padding:11px 13px;text-align:center;cursor:pointer;transition:all .22s;min-height:64px}
.date-btn:focus-visible{outline:2px solid var(--o5);outline-offset:2px}

.qty-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .2s;font-size:18px;border:none}
.qty-btn:hover{background:var(--bgc) !important}
.qty-btn:focus-visible{outline:2px solid var(--o5);outline-offset:2px}
`

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Lesson {
  id:string; title:string; duration:string
  price:{min:number;max:number}; description:string; details:string[]
  type:'single'|'pack'; sessions?:number
  popular?:boolean; bestValue?:boolean; promoEligible?:boolean
}
interface CartItem { lesson:Lesson; quantity:number; date?:string; time?:string }
interface BForm { name:string; email:string; phone:string; message:string }

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CDN = 'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/'

const VIDEOS = [
  `${CDN}6a1af0f4045e32379f10fa3f.mov`,
  `${CDN}6a1af0f45a3e6e89b6f76864.mov`,
  `${CDN}6a1af313045e32379f111cbe.mov`,
  `${CDN}6a1af312045e32379f111cbb.mov`,
  `${CDN}6a1af357045e32379f11230b.mov`,
  `${CDN}6a1af357d53fc25488c3385d.mov`,
  `${CDN}6a1af3565be84ad64045dba4.mov`,
  `${CDN}6a1af3565a3e6e89b6f79150.mov`,
  `${CDN}6a1af61cd53fc25488c36b67.mov`,
  `${CDN}6a1af61d5a3e6e89b6f7c3bc.mov`,
]

const IMGS = [
  `${CDN}6a1af808d53fc25488c38bad.jpeg`,
  `${CDN}6a1af808045e32379f1172bb.jpeg`,
  `${CDN}6a1af8085a3e6e89b6f7e2b2.jpeg`,
  `${CDN}6a1af808045e32379f1172b9.jpeg`,
  `${CDN}6a1af808ff82912d65a97cec.jpeg`,
  `${CDN}6a1af808ff82912d65a97ced.jpeg`,
  `${CDN}6a1af808ff82912d65a97cf0.jpeg`,
  `${CDN}6a1af808d53fc25488c38bab.jpeg`,
  `${CDN}6a1af808d53fc25488c38bae.jpeg`,
  `${CDN}6a1af808ff82912d65a97cf2.jpeg`,
  `${CDN}6a1af7f95a3e6e89b6f7e1ef.jpeg`,
]

const ICAPS = [
  '18th Overlook','5th Teeshot','3rd Tee Shot','15th in Fall','Putting Green',
  '8th Double Green','18th Teeshot','9th Approach','16th Green',
  'Golden State Warriors Championship Rings','14th Teeshot',
]

const ICAP_SUBS: (string|null)[] = [
  null,null,null,null,null,null,null,null,null,
  'Caddied for a Pine Valley member — 6× NBA Champion',
  null,
]

const LESSONS: Lesson[] = [
  { id:'l30',title:'30-Min Lesson',duration:'30 minutes',price:{min:39.99,max:44.99},type:'single',
    description:'Laser-focused on one aspect of your game. Perfect for a quick tune-up or a targeted fix.',
    details:['1-on-1 instruction','Video feedback','One drill to take home'] },
  { id:'l45',title:'45-Min Lesson',duration:'45 minutes',price:{min:49.99,max:59.99},type:'single',popular:true,
    description:'Our most booked session. Enough time to diagnose, fix, and ingrain a real change.',
    details:['1-on-1 instruction','Video swing analysis','Two practice drills','Personalized feedback'] },
  { id:'l60',title:'60-Min Lesson',duration:'60 minutes',price:{min:59.99,max:69.99},type:'single',
    description:'A deep dive into your full swing, short game, or on-course decision making.',
    details:['1-on-1 instruction','Full video analysis','Multi-area coverage','Written practice plan'] },
  { id:'l90',title:'90-Min Lesson',duration:'90 minutes',price:{min:84.99,max:99.99},type:'single',
    description:'The complete assessment — tee to green. Where real transformation starts.',
    details:['1-on-1 instruction','Complete swing analysis','Short game work','Full practice plan','On-course strategy'] },
  { id:'pk3',title:'3×45 Starter Pack',duration:'3 sessions · 45 min each',price:{min:139.99,max:154.99},type:'pack',sessions:3,promoEligible:true,
    description:'Three focused sessions to build real momentum and see results on the course.',
    details:['3 × 45-min sessions','Progress tracking','Custom drill library','Between-session tips'] },
  { id:'pk5',title:'5×60 Break-90 Pack',duration:'5 sessions · 60 min each',price:{min:264.99,max:304.99},type:'pack',sessions:5,bestValue:true,promoEligible:true,
    description:'Built for golfers serious about breaking 90. A full game transformation over five sessions.',
    details:['5 × 60-min sessions','Full swing overhaul','Short game focus','Course management','Handicap goal plan'] },
  { id:'pkj',title:'4×45 Junior Pack',duration:'4 sessions · 45 min each',price:{min:164.99,max:184.99},type:'pack',sessions:4,promoEligible:true,
    description:'For young golfers ages 6–17. Fun, patient, and built for long-term athletic development.',
    details:['4 × 45-min sessions','Age-appropriate drills','Fun fundamentals','Parent updates after each session'] },
]

const MARQUEE_W = [
  'Fix Your Slice','Gain Distance','Pure Your Irons','Beginner Friendly',
  'Affordable Rates','Flexible Scheduling','Real Experience','South Jersey Golf',
  'No Judgment Zone','Lower Your Handicap','Short Game Mastery','Caddied at Pine Valley',
]

function getDates(): Date[] {
  const r:Date[]=[];const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1)
  let t=0;while(r.length<14&&t<30){if(d.getDay()!==1)r.push(new Date(d));d.setDate(d.getDate()+1);t++}
  return r
}

const FAQS=[
  { q:'Are you PGA certified?',
    a:"No — and that's kind of the point. I'm not a textbook instructor with a laminated card. I learned golf from the ground up, caddied at two of the most prestigious courses in the world — Tavistock and Pine Valley — and spent years figuring out what actually fixes a real golfer's game. No jargon. No $300/hr ego. Just honest feedback that shows up on your scorecard." },
  { q:'Where are lessons held?',
    a:"At driving ranges and practice facilities across South Jersey. Once you book, I'll confirm a convenient spot for you. I keep a few local locations in rotation and recommend the best fit based on what we're working on." },
  { q:'What should I bring?',
    a:"Your clubs, golf shoes or sneakers, and a willingness to try something different. I bring alignment sticks, training aids, and my phone for video analysis. No clubs yet? No problem — I'll help you figure out what you need." },
  { q:'Can I reschedule or cancel?',
    a:"Absolutely. Give me at least 24 hours and we'll sort it out. Pack sessions don't expire, so no stress if you need to push a session. I'm not a big box golf academy — I'm flexible because I run this personally." },
]

const STEPS=[
  {n:'01',icon:'⛳',title:'Choose Your Lesson',desc:'Pick a session length or pack that fits your schedule and goals.'},
  {n:'02',icon:'\ud83d\udcc5',title:'Pick a Time',desc:'Select a date and time from available slots. First-timers get priority.'},
  {n:'03',icon:'\ud83d\udd12',title:'Lock It In',desc:'Pay securely online. Your spot is confirmed instantly.'},
  {n:'04',icon:'\ud83c\udfcc\ufe0f',title:'Show Up & Swing',desc:'Meet at the range. We diagnose, drill, and practice — no judgment.'},
  {n:'05',icon:'\ud83d\udccb',title:'Take the Plan Home',desc:'Leave with a custom practice plan so every range session after this one counts.'},
]

const PILLARS=[
  {icon:'\ud83c\udfc6',title:"Lived at the Game's Highest Level",
   body:"I caddied at Tavistock and Pine Valley — two of the most storied courses in the world. That experience gave me an eye for the game that no classroom ever could."},
  {icon:'\ud83c\udfaf',title:'Real Fixes, Real Fast',
   body:"Skip the theory. I teach simple mechanical cues and targeted drills that show up on the scorecard within a round or two. No jargon, no fluff."},
  {icon:'\ud83d\udc9a',title:'Built for South Jersey Golfers',
   body:"Weekend warriors, beginners, juniors. My pricing is built for real golfers — not golf academies. You don't need a trust fund to play better golf."},
]

const PROMO='FOUNDING', PROMO_PCT=0.2

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useInView(opts?:{threshold?:number;once?:boolean}) {
  const ref=useRef<HTMLDivElement>(null)
  const [inView,setInView]=useState(false)
  useEffect(()=>{
    const el=ref.current;if(!el)return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setInView(true);if(opts?.once)obs.disconnect()}
      else if(!opts?.once)setInView(false)
    },{threshold:opts?.threshold??0.1})
    obs.observe(el);return()=>obs.disconnect()
  },[opts?.threshold,opts?.once])
  return {ref,inView}
}

function useAutoplay(threshold=0.5) {
  const ref=useRef<HTMLVideoElement>(null)
  const [playing,setPlaying]=useState(false)
  useEffect(()=>{
    const v=ref.current as HTMLVideoElement;if(!v)return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){v.play().then(()=>setPlaying(true)).catch(()=>{})}
      else{v.pause();setPlaying(false)}
    },{threshold})
    obs.observe(v);return()=>obs.disconnect()
  },[threshold])
  return {ref,playing}
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT FORM  (must live inside <Elements> provider)
// ─────────────────────────────────────────────────────────────────────────────
interface PaymentFormProps {
  total:        number
  customerName: string
  customerEmail:string
  onSuccess:    ()=>void
  onBack:       ()=>void
}

function PaymentForm({ total, customerName, customerEmail, onSuccess, onBack }: PaymentFormProps) {
  const stripe   = useStripe()
  const elements = useElements()
  const [paying,  setPaying]  = useState(false)
  const [payErr,  setPayErr]  = useState('')

  const submit = async () => {
    if (!stripe || !elements || paying) return
    setPaying(true)
    setPayErr('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Fallback URL for payment methods that require redirect (e.g. 3DS bank flows).
        // The webhook is the source of truth regardless of redirect.
        return_url: typeof window !== 'undefined'
          ? `${window.location.origin}/?booking=confirmed`
          : '/',
        payment_method_data: {
          billing_details: { name: customerName, email: customerEmail },
        },
      },
      // Stay on-page for card payments; redirect only if the payment method requires it.
      redirect: 'if_required',
    })

    if (error) {
      setPayErr(error.message || 'Payment failed. Please try again.')
      setPaying(false)
    } else {
      // Payment confirmed inline — webhook will write the booking record
      onSuccess()
    }
  }

  return (
    <div>
      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: { name: customerName, email: customerEmail },
          },
        }}
      />

      {payErr && (
        <div style={{
          fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'#e07070',
          marginTop:14,padding:'10px 14px',
          background:'rgba(224,112,112,.07)',border:'1px solid rgba(224,112,112,.2)',
        }}>
          {payErr}
        </div>
      )}

      <button
        onClick={submit}
        disabled={!stripe || !elements || paying}
        className="btn-g"
        style={{width:'100%',justifyContent:'center',marginTop:20,padding:'17px 24px',fontSize:11}}
      >
        {paying
          ? 'Processing…'
          : `Confirm & Pay — $${total.toFixed(2)}`
        }
      </button>

      <div style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t4)',
        textAlign:'center',marginTop:10,letterSpacing:'.12em',
      }}>
        Secure payment powered by Stripe
      </div>

      <button
        onClick={onBack}
        disabled={paying}
        className="btn-w"
        style={{width:'100%',justifyContent:'center',marginTop:10,fontSize:10}}
      >
        ← Edit Cart
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({onDone}:{onDone:()=>void}) {
  const [phase,setPhase]=useState<'loading'|'ready'|'out'>('loading')
  useEffect(()=>{const t=setTimeout(()=>setPhase('ready'),2100);return()=>clearTimeout(t)},[])
  const enter=()=>{if(phase!=='ready')return;setPhase('out');setTimeout(onDone,680)}
  const S={position:'absolute' as const,width:28,height:28,borderStyle:'solid' as const,borderColor:'#6b4c10'}
  return (
    <div
      onClick={enter}
      role="button"
      aria-label="Enter site"
      tabIndex={0}
      onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')enter()}}
      style={{
        position:'fixed',inset:0,zIndex:9999,background:'#070f0a',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        cursor:phase==='ready'?'pointer':'default',
        opacity:phase==='out'?0:1,visibility:phase==='out'?'hidden':'visible',
        transition:'opacity .68s ease,visibility .68s ease',
      }}>
      <div style={{...S,top:24,left:24,borderWidth:'1px 0 0 1px'}}/>
      <div style={{...S,top:24,right:24,borderWidth:'1px 1px 0 0'}}/>
      <div style={{...S,bottom:24,left:24,borderWidth:'0 0 1px 1px'}}/>
      <div style={{...S,bottom:24,right:24,borderWidth:'0 1px 1px 0'}}/>
      <div style={{
        position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        width:500,height:500,borderRadius:'50%',pointerEvents:'none',
        background:'radial-gradient(circle,rgba(197,152,62,.07) 0%,transparent 70%)',
      }}/>
      <div style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:'clamp(90px,16vw,152px)',fontWeight:300,color:'#ede8dc',
        lineHeight:1,letterSpacing:'-.04em',marginBottom:52,position:'relative',
      }}>
        KP
        <div style={{position:'absolute',bottom:-10,left:'50%',transform:'translateX(-50%)',width:40,height:1,background:'#c5983e'}}/>
      </div>
      <div style={{width:200,height:1,background:'rgba(255,255,255,.07)',position:'relative',overflow:'hidden',marginBottom:36}}>
        <div className="al" style={{position:'absolute',top:0,left:0,height:'100%',background:'#c5983e'}}/>
      </div>
      <div style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.22em',
        textTransform:'uppercase',color:'#c5983e',
        opacity:phase==='ready'?1:0,transition:'opacity .6s ease',
      }}>Press anywhere to enter</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV=[{l:'About',h:'#about'},{l:'Videos',h:'#videos'},{l:'Pricing',h:'#pricing'},{l:'Book',h:'#book'},{l:'FAQ',h:'#faq'}]

function Navbar() {
  const [scrolled,setScrolled]=useState(false)
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60)
    window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)
  },[])
  const go=(h:string)=>{document.querySelector(h)?.scrollIntoView({behavior:'smooth'});setOpen(false)}
  const lb:React.CSSProperties={
    fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:'.14em',
    textTransform:'uppercase',color:'#96a89a',background:'none',border:'none',
    cursor:'pointer',padding:'4px 0',transition:'color .2s',minHeight:44,display:'flex',alignItems:'center',
  }
  return (
    <>
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,height:68,
        padding:'0 clamp(20px,3vw,40px)',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        background:scrolled?'rgba(7,15,10,.94)':'transparent',
        backdropFilter:scrolled?'blur(14px)':'none',
        borderBottom:`1px solid ${scrolled?'rgba(255,255,255,.07)':'transparent'}`,
        transition:'all .38s ease',
      }}>
        <button
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          aria-label="KP Golf Training — scroll to top"
          style={{
            fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:400,
            color:'#ede8dc',background:'none',border:'none',cursor:'pointer',padding:'4px 0',lineHeight:1,
          }}>KP<span style={{color:'#c5983e'}}>.</span>
        </button>

        <div className="nd" style={{alignItems:'center',gap:44}}>
          {NAV.map(l=>(
            <button key={l.h} onClick={()=>go(l.h)} style={lb}
              onMouseEnter={e=>(e.currentTarget.style.color='#ede8dc')}
              onMouseLeave={e=>(e.currentTarget.style.color='#96a89a')}
            >{l.l}</button>
          ))}
          <button onClick={()=>go('#book')} className="btn-g" style={{padding:'9px 22px',fontSize:10}}>
            Book a Lesson
          </button>
        </div>

        <button
          className="nh"
          onClick={()=>setOpen(o=>!o)}
          aria-label={open?'Close menu':'Open menu'}
          aria-expanded={open}
          style={{background:'none',border:'none',cursor:'pointer',flexDirection:'column',gap:5,padding:8}}>
          {[0,1,2].map(i=>(
            <span key={i} style={{
              display:'block',width:22,height:1,background:'#ede8dc',
              transition:'all .28s ease',transformOrigin:'center',
              transform:open?i===0?'translateY(6px) rotate(45deg)':i===2?'translateY(-6px) rotate(-45deg)':'scaleX(0)':'none',
            }}/>
          ))}
        </button>
      </nav>

      <div
        aria-hidden={!open}
        style={{
          position:'fixed',top:68,left:0,right:0,zIndex:199,
          background:'rgba(7,15,10,.97)',backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,.07)',
          padding:'36px 32px 52px',display:'flex',flexDirection:'column',gap:6,
          transform:open?'translateY(0)':'translateY(-110%)',
          transition:'transform .36s cubic-bezier(.4,0,.2,1)',
          pointerEvents:open?'auto':'none',
        }}>
        {NAV.map(l=>(
          <button key={l.h} onClick={()=>go(l.h)} style={{
            fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,
            color:'#ede8dc',background:'none',border:'none',cursor:'pointer',
            textAlign:'left',padding:'10px 0',lineHeight:1.1,
            borderBottom:'1px solid rgba(255,255,255,.04)',
          }}>{l.l}</button>
        ))}
        <div style={{height:8}}/>
        <button onClick={()=>go('#book')} className="btn-g" style={{alignSelf:'flex-start',marginTop:8}}>
          Book a Lesson
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLING GOLF BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
function FallingBg() {
  const items=useMemo(()=>{
    let s=42;const r=()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}
    return Array.from({length:38},(_,i)=>({
      id:i,type:(['ball','flag'] as const)[Math.floor(r()*2)],
      left:r()*100,dur:5+r()*9,delay:r()*13,rotate:150+r()*400,
      size:14+r()*22,opacity:.12+r()*0.22,
    }))
  },[])
  return (
    <div aria-hidden="true" style={{
      position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:1,
      maskImage:'linear-gradient(to bottom,black 0%,black 38%,transparent 76%)',
      WebkitMaskImage:'linear-gradient(to bottom,black 0%,black 38%,transparent 76%)',
    }}>
      {items.map(el=>(
        <div key={el.id} className="af" style={{
          position:'absolute',top:-130,left:`${el.left}%`,opacity:el.opacity,
          ['--fd' as string]:`${el.dur}s`,
          ['--fdy' as string]:`${el.delay}s`,
          ['--fr' as string]:`${el.rotate}deg`,
        }}>
          {el.type==='ball'&&(
            <svg viewBox="0 0 32 32" width={el.size} height={el.size}>
              <circle cx="16" cy="16" r="14" fill="white" stroke="#ddd" strokeWidth="0.5"/>
              <circle cx="11" cy="11" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="16" cy="9"  r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="21" cy="11" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="9"  cy="16" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="14" cy="15" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="19" cy="15" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="23" cy="16" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="11" cy="21" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="16" cy="23" r="1.5" fill="#ccc" opacity="0.6"/>
              <circle cx="21" cy="21" r="1.5" fill="#ccc" opacity="0.6"/>
            </svg>
          )}
          {el.type==='flag'&&(
            <svg width={el.size*.55} height={el.size*1.55} viewBox="0 0 14 36" fill="none">
              <line x1="3" y1="0" x2="3" y2="36" stroke="#c5983e" strokeWidth="1.4"/>
              <polygon points="3,0 14,7 3,14" fill="#c5983e" opacity=".8"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const go=(h:string)=>document.querySelector(h)?.scrollIntoView({behavior:'smooth'})
  return (
    <section id="hero" style={{
      position:'relative',minHeight:'100svh',overflow:'hidden',
      display:'flex',alignItems:'center',background:'var(--bg)',
    }}>
      <video autoPlay muted loop playsInline src={`${CDN}6a1af357d53fc25488c3385d.mov`} style={{
        position:'absolute',inset:0,width:'100%',height:'100%',
        objectFit:'cover',opacity:.16,zIndex:0,
      }}/>
      <div style={{position:'absolute',inset:0,zIndex:1,
        background:'linear-gradient(142deg,rgba(7,15,10,.97) 0%,rgba(7,15,10,.62) 52%,rgba(7,15,10,.92) 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:1,
        background:'radial-gradient(ellipse at 72% 50%,rgba(197,152,62,.045) 0%,transparent 58%)'}}/>
      <FallingBg/>

      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:1280,margin:'0 auto',
        padding:'124px clamp(20px,4vw,40px) 80px'}}>
        <div style={{maxWidth:800}}>
          <div className="lbl" style={{marginBottom:30,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <span style={{width:36,height:1,background:'#c5983e',display:'inline-block',flexShrink:0}}/>
            South Jersey Golf Lessons — Starting at $39.99
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(64px,10.5vw,128px)',fontWeight:400,lineHeight:.88,
            color:'#ede8dc',marginBottom:30,letterSpacing:'-.025em',
          }}>
            Real Golf.<br/>
            <em style={{color:'#d8b05a',fontStyle:'italic'}}>Real</em> Results.
          </h1>
          <p style={{
            fontFamily:"'DM Sans',sans-serif",fontSize:'clamp(15px,1.8vw,18px)',lineHeight:1.65,
            color:'#96a89a',maxWidth:500,marginBottom:48,
          }}>
            Former caddie at Pine Valley &amp; Tavistock. Judgment-free lessons for beginners,
            weekend warriors, and everyone in between.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:68}}>
            <button onClick={()=>go('#book')} className="btn-g">Book a Lesson</button>
            <button onClick={()=>go('#videos')} className="btn-w">Watch Swing Videos ↓</button>
          </div>
          <div style={{display:'flex',gap:44,flexWrap:'wrap',rowGap:28}}>
            {([
              {v:'$39.99',l:'Starting price',sm:false},
              {v:'2',l:'Elite courses',sm:false},
              {v:'Tailored',l:'To Your Swing',sm:true},
            ] as {v:string;l:string;sm:boolean}[]).map(({v,l,sm})=>(
              <div key={l}>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:sm?'clamp(26px,3.5vw,36px)':'clamp(34px,4.5vw,46px)',
                  fontWeight:300,color:'#d8b05a',lineHeight:1,fontStyle:sm?'italic':'normal',
                }}>{v}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                  letterSpacing:'.16em',textTransform:'uppercase',color:'#506056',marginTop:6}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div aria-hidden="true" style={{position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',
        zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.2em',
          textTransform:'uppercase',color:'#506056',writingMode:'vertical-rl'}}>Scroll</div>
        <div style={{width:1,height:52,background:'#6b4c10'}}/>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEES
// ─────────────────────────────────────────────────────────────────────────────
function Marquees() {
  const h=Math.ceil(MARQUEE_W.length/2),r1=MARQUEE_W.slice(0,h),r2=MARQUEE_W.slice(h)
  const Row=({words,dir,spd}:{words:string[];dir:'l'|'r';spd:string})=>(
    <div style={{overflow:'hidden'}}>
      <div className={dir==='l'?'aml':'amr'} style={{'--ms':spd} as React.CSSProperties}>
        {[...words,...words].map((w,i)=>(
          <span key={i} style={{
            display:'inline-flex',alignItems:'center',gap:18,
            fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:'.11em',textTransform:'uppercase',
            color:dir==='l'?'var(--t2)':'var(--t3)',whiteSpace:'nowrap',paddingRight:18,
          }}>
            {w}<span style={{color:dir==='l'?'var(--o5)':'var(--o7)',fontSize:5}}>\u25cf</span>
          </span>
        ))}
      </div>
    </div>
  )
  return (
    <div style={{background:'var(--bg2)',borderTop:'1px solid var(--bd)',borderBottom:'1px solid var(--bd)',
      padding:'18px 0',display:'flex',flexDirection:'column',gap:14}}>
      <Row words={r1} dir="l" spd="29s"/>
      <Row words={r2} dir="r" spd="37s"/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY KP
// ─────────────────────────────────────────────────────────────────────────────
function WhyKP() {
  const {ref,inView}=useInView({threshold:.15,once:true})
  return (
    <section id="about" ref={ref} className="sec" style={{maxWidth:1280,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:72,alignItems:'center'}}>
        <div style={{
          position:'relative',opacity:inView?1:0,
          transform:inView?'none':'translateX(-20px)',
          transition:'opacity .9s ease,transform .9s ease',
        }}>
          <div style={{position:'absolute',inset:-16,border:'1px solid var(--bd)',zIndex:0,pointerEvents:'none'}}/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMGS[0]} alt="KP on the course at Pine Valley" style={{
            width:'100%',aspectRatio:'3/4',objectFit:'cover',position:'relative',zIndex:1,display:'block',
          }}/>
          <div style={{position:'absolute',bottom:24,left:-20,zIndex:2,background:'var(--bg)',
            border:'1px solid var(--ba)',padding:'10px 18px'}}>
            <span className="lbl" style={{fontSize:9}}>Former Caddie · Pine Valley · Tavistock</span>
          </div>
        </div>

        <div>
          <div className="lbl" style={{marginBottom:18}}>Why KP Training</div>
          <h2 className="hdg" style={{marginBottom:26}}>The Bag Tag<br/><em>Means Something.</em></h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',lineHeight:1.8,marginBottom:52,maxWidth:480}}>
            You don't learn golf at Pine Valley by reading a manual. You learn it by watching the world's
            best players navigate every lie, every wind, every pressure putt. That's the education
            I'm bringing to South Jersey.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:28}}>
            {PILLARS.map((p,i)=>(
              <div key={i} style={{
                display:'flex',gap:20,alignItems:'flex-start',
                opacity:inView?1:0,transform:inView?'none':'translateX(28px)',
                transition:`opacity .65s ease ${.2+i*.15}s,transform .65s ease ${.2+i*.15}s`,
              }}>
                <div style={{flexShrink:0,width:48,height:48,background:'var(--bgc)',border:'1px solid var(--o7)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{p.icon}</div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,color:'var(--t1)',marginBottom:7}}>{p.title}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t2)',lineHeight:1.7}}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SLIDER
// ─────────────────────────────────────────────────────────────────────────────
function VSlide({src,idx,slideW}:{src:string;idx:number;slideW:string}) {
  const {ref,playing}=useAutoplay(.5)
  return (
    <div style={{
      flexShrink:0,width:slideW,aspectRatio:'9/16',
      position:'relative',overflow:'hidden',background:'var(--bgc)',
      border:'1px solid var(--bd)',scrollSnapAlign:'center',
    }}>
      <video ref={ref} src={src} muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      <div style={{position:'absolute',inset:0,background:'rgba(7,15,10,.32)',
        opacity:playing?0:1,transition:'opacity .55s ease',pointerEvents:'none'}}/>
      {playing&&(
        <div style={{position:'absolute',top:14,right:14,display:'flex',alignItems:'center',gap:7,
          background:'rgba(7,15,10,.72)',padding:'5px 10px',border:'1px solid var(--bd)'}}>
          <div className="ap" style={{width:6,height:6,borderRadius:'50%',background:'#c5983e'}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
            textTransform:'uppercase',color:'#d8b05a'}}>Live</span>
        </div>
      )}
      <div style={{position:'absolute',bottom:14,left:16,fontFamily:"'JetBrains Mono',monospace",
        fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--t3)'}}>
        {String(idx+1).padStart(2,'0')} / {String(VIDEOS.length).padStart(2,'0')}
      </div>
    </div>
  )
}

function VideoSlider() {
  const scRef=useRef<HTMLDivElement|null>(null)
  const [act,setAct]=useState(0)
  const {ref,inView}=useInView({threshold:.2})
  const [isMobile,setIsMobile]=useState(false)
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768)
    check();window.addEventListener('resize',check,{passive:true})
    return()=>window.removeEventListener('resize',check)
  },[])
  const slideW=isMobile?'90vw':'72vw'
  const go=(i:number)=>{
    const s=scRef.current?.children[i] as HTMLElement
    s?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})
    setAct(i)
  }
  return (
    <section id="videos" ref={ref} style={{padding:'clamp(80px,10vw,140px) 0'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)',marginBottom:48}}>
        <div className="lbl" style={{marginBottom:18}}>Swing Footage</div>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
          <h2 className="hdg">See the Work<br/><em>In Action.</em></h2>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>go(Math.max(0,act-1))} aria-label="Previous video"
              className="btn-w" style={{padding:'10px 20px',fontSize:20}}>←</button>
            <button onClick={()=>go(Math.min(VIDEOS.length-1,act+1))} aria-label="Next video"
              className="btn-w" style={{padding:'10px 20px',fontSize:20}}>→</button>
          </div>
        </div>
      </div>
      <div style={{position:'relative'}}>
        <div ref={scRef} className="ns" style={{
          display:'flex',gap:16,overflowX:'auto',scrollSnapType:'x mandatory',
          padding:'0 clamp(20px,4vw,40px)',
          opacity:inView?1:0,transition:'opacity .9s ease',
        }}>
          {VIDEOS.map((src,i)=><VSlide key={i} src={src} idx={i} slideW={slideW}/>)}
        </div>
        <div aria-hidden="true" style={{
          position:'absolute',inset:0,pointerEvents:'none',zIndex:2,
          background:'linear-gradient(to right,#070f0a 0%,transparent 8%,transparent 92%,#070f0a 100%)',
        }}/>
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:32}}>
        {VIDEOS.map((_,i)=>(
          <button key={i} onClick={()=>go(i)} aria-label={`Go to clip ${i+1}`} style={{
            height:4,border:'none',cursor:'pointer',borderRadius:2,padding:0,
            background:i===act?'var(--o5)':'var(--bd)',
            width:i===act?28:8,transition:'all .3s ease',minWidth:8,
          }}/>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE SLIDER
// ─────────────────────────────────────────────────────────────────────────────
function ImageSlider() {
  const [act,setAct]=useState(0)
  const {ref,inView}=useInView({threshold:.3})
  useEffect(()=>{
    if(!inView)return
    const t=setInterval(()=>setAct(p=>(p+1)%IMGS.length),3900)
    return()=>clearInterval(t)
  },[inView])
  const go=(d:1|-1)=>setAct(p=>(p+d+IMGS.length)%IMGS.length)
  return (
    <section ref={ref} style={{padding:'clamp(80px,10vw,140px) clamp(20px,4vw,40px)'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div className="lbl" style={{textAlign:'center',marginBottom:18}}>Gallery</div>
        <h2 className="hdg" style={{textAlign:'center',marginBottom:52}}>
          The Course.<br/><em>The Range. The Work.</em>
        </h2>
        <div style={{
          position:'relative',aspectRatio:'16/9',overflow:'hidden',
          background:'var(--bgc)',marginBottom:14,
          opacity:inView?1:0,transition:'opacity .85s ease',
        }}>
          {IMGS.map((src,i)=>(
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={ICAPS[i]} style={{
              position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block',
              opacity:i===act?1:0,transition:'opacity .85s ease',
            }}/>
          ))}
          <div style={{
            position:'absolute',bottom:0,left:0,right:0,padding:'72px 28px 24px',
            background:'linear-gradient(to top,rgba(7,15,10,.92) 0%,transparent 100%)',
            pointerEvents:'none',
          }}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:'italic',
              color:'var(--t1)',lineHeight:1.2}}>{ICAPS[act]}</div>
            {ICAP_SUBS[act]&&(
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
                textTransform:'uppercase',color:'var(--o5)',marginTop:7}}>{ICAP_SUBS[act]}</div>
            )}
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
              textTransform:'uppercase',color:'var(--t4)',marginTop:6}}>
              {String(act+1).padStart(2,'0')} / {String(IMGS.length).padStart(2,'0')}
            </div>
          </div>
          {([[-1,'left','←'],[1,'right','→']] as [1|-1,string,string][]).map(([d,s,a])=>(
            <button key={s} onClick={()=>go(d)} aria-label={d===-1?'Previous image':'Next image'} style={{
              position:'absolute',top:'50%',transform:'translateY(-50%)',
              [s]:16,width:44,height:44,background:'rgba(7,15,10,.72)',
              border:'1px solid var(--bd)',color:'var(--t1)',cursor:'pointer',fontSize:18,
              display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',
            }}>{a}</button>
          ))}
        </div>
        <div className="ns" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:2}}>
          {IMGS.map((src,i)=>(
            <button key={i} onClick={()=>setAct(i)} aria-label={`View ${ICAPS[i]}`} style={{
              flexShrink:0,width:76,height:54,padding:0,cursor:'pointer',overflow:'hidden',background:'none',
              border:`2px solid ${i===act?'var(--o5)':'transparent'}`,
              opacity:i===act?1:.48,transition:'all .25s',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={ICAPS[i]} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────────────────────
function Pricing() {
  const {ref,inView}=useInView({threshold:.06,once:true})
  const singles=LESSONS.filter(l=>l.type==='single')
  const packs=LESSONS.filter(l=>l.type==='pack')
  const go=()=>document.querySelector('#book')?.scrollIntoView({behavior:'smooth'})

  function Card({lesson,idx}:{lesson:Lesson;idx:number}) {
    return (
      <div className="kcard" style={{
        padding:'30px 28px 28px',position:'relative',overflow:'hidden',
        display:'flex',flexDirection:'column',
        opacity:inView?1:0,transform:inView?'none':'translateY(36px)',
        transition:`opacity .6s ease ${idx*.08}s,transform .6s ease ${idx*.08}s`,
        ...(lesson.popular?{border:'1px solid var(--ba)'}:{}),
      }}>
        <div style={{display:'flex',gap:7,marginBottom:20,flexWrap:'wrap',minHeight:24,alignItems:'center'}}>
          {lesson.popular&&(
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
              textTransform:'uppercase',background:'var(--o5)',color:'var(--bg)',padding:'4px 10px',fontWeight:500}}>
              Most Popular</span>
          )}
          {lesson.bestValue&&(
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
              textTransform:'uppercase',background:'var(--g7)',color:'var(--t1)',padding:'4px 10px'}}>
              Best Value</span>
          )}
          {lesson.promoEligible&&(
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
              textTransform:'uppercase',border:'1px solid var(--o7)',color:'var(--o5)',padding:'3px 9px'}}>
              Promo Eligible</span>
          )}
        </div>

        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,color:'var(--t1)',marginBottom:4}}>
          {lesson.title}
        </div>
        <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:22}}>{lesson.duration}</div>

        {/* Price: current + compare-at */}
        <div style={{marginBottom:lesson.sessions?8:16}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
            textTransform:'uppercase',color:'var(--o5)',marginBottom:8}}>Now</div>
          <div style={{display:'flex',alignItems:'baseline',gap:14}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,
              color:'var(--t1)',lineHeight:1}}>
              ${lesson.price.min}
            </span>
            <div style={{display:'flex',flexDirection:'column',gap:2,paddingBottom:6}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                letterSpacing:'.1em',textTransform:'uppercase',color:'var(--t4)',lineHeight:1}}>Reg.</span>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:400,
                color:'var(--t4)',textDecoration:'line-through',lineHeight:1}}>${lesson.price.max}</span>
            </div>
          </div>
        </div>

        {lesson.sessions&&(
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t3)',
            letterSpacing:'.1em',marginBottom:16}}>
            ~${Math.round(lesson.price.min/lesson.sessions)} per session
          </div>
        )}

        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',
          lineHeight:1.65,marginBottom:20,flex:1}}>{lesson.description}</p>

        <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:28}}>
          {lesson.details.map((d,i)=>(
            <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',
              fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>
              <span style={{color:'var(--o7)',flexShrink:0,marginTop:2,lineHeight:1.2}}>—</span>
              <span>{d}</span>
            </div>
          ))}
        </div>

        <button onClick={go} className="btn-g" style={{width:'100%',justifyContent:'center',fontSize:10}}>
          Book This Lesson
        </button>
      </div>
    )
  }

  return (
    <section id="pricing" ref={ref} className="sec" style={{background:'var(--bg2)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:16}}>
          <div className="lbl" style={{marginBottom:18}}>Pricing</div>
          <h2 className="hdg">No Gimmicks.<br/><em>Just Lessons.</em></h2>
        </div>

        {/* Founding member banner — no fake scarcity counts */}
        <div style={{
          background:'rgba(197,152,62,.06)',border:'1px solid var(--ba)',
          padding:'20px 26px',margin:'52px 0 40px',
          display:'flex',alignItems:'center',gap:20,flexWrap:'wrap',
        }}>
          <span style={{fontSize:18}}>\ud83c\udfaf</span>
          <div>
            <div className="lbl" style={{fontSize:10,marginBottom:5}}>
              Founding Member Pricing — Code: <strong style={{color:'var(--o3)'}}>FOUNDING</strong>
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>
              Save 20% on all lesson packs. Limited-time founding member rate for early supporters.
            </div>
          </div>
        </div>

        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:500,fontSize:10,
          color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.16em',marginBottom:18}}>
          Individual Sessions
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(232px,1fr))',gap:14,marginBottom:56}}>
          {singles.map((l,i)=><Card key={l.id} lesson={l} idx={i}/>)}
        </div>

        <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:500,fontSize:10,
          color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.16em',marginBottom:18}}>
          Lesson Packs
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:14}}>
          {packs.map((l,i)=><Card key={l.id} lesson={l} idx={singles.length+i}/>)}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const {ref,inView}=useInView({threshold:.08,once:true})
  return (
    <section ref={ref} className="sec">
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:72}}>
          <div className="lbl" style={{marginBottom:18}}>The Process</div>
          <h2 className="hdg">From Zero to<br/><em>On the Course.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:40}}>
          {STEPS.map((step,i)=>(
            <div key={i} style={{
              display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
              opacity:inView?1:0,transform:inView?'none':'translateY(28px)',
              transition:`opacity .65s ease ${i*.12}s,transform .65s ease ${i*.12}s`,
            }}>
              <div style={{
                width:80,height:80,borderRadius:'50%',background:'var(--bgc)',border:'1px solid var(--o7)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:28,marginBottom:20,position:'relative',flexShrink:0,
              }}>
                <span role="img" aria-hidden="true">{step.icon}</span>
                <span style={{
                  position:'absolute',top:-10,right:-6,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.1em',
                  background:'var(--o5)',color:'var(--bg)',padding:'3px 7px',
                }}>{step.n}</span>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:400,
                color:'var(--t1)',marginBottom:10,lineHeight:1.2}}>{step.title}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',lineHeight:1.65}}>{step.desc}</div>
            </div>
          ))}
        </div>
        <div style={{
          background:'var(--g9)',border:'1px solid var(--bd)',
          padding:'clamp(40px,5vw,64px) clamp(28px,5vw,56px)',
          marginTop:88,textAlign:'center',
        }}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:400,
            color:'var(--t1)',marginBottom:14}}>Ready to start?</h3>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',marginBottom:36}}>
            First lesson starts at $39.99. No experience needed.
          </p>
          <button
            onClick={()=>document.querySelector('#book')?.scrollIntoView({behavior:'smooth'})}
            className="btn-g">
            Book a Lesson
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING  (embedded Stripe Payment Element flow)
// ─────────────────────────────────────────────────────────────────────────────
function Booking() {
  // ── Cart / selection state ─────────────────────────────────────────────────
  const [sel,setSel]               = useState<Lesson|null>(null)
  const [later,setLater]           = useState(false)
  const [selDate,setSelDate]       = useState<Date|null>(null)
  const [selTime,setSelTime]       = useState<string|null>(null)
  const [cart,setCart]             = useState<CartItem[]>([])
  const [piInput,setPiInput]       = useState('')
  const [piApplied,setPiApplied]   = useState(false)
  const [piErr,setPiErr]           = useState('')
  const [form,setForm]             = useState<BForm>({name:'',email:'',phone:'',message:''})
  const [fErr,setFErr]             = useState('')
  const [done,setDone]             = useState(false)
  const [dates,setDates]           = useState<Date[]>([])
  const [bookedSlots,setBookedSlots] = useState<string[]>([])
  const [loadingSlots,setLoadingSlots] = useState(false)

  // ── Payment intent state ───────────────────────────────────────────────────
  const [bookingStep,setBookingStep] = useState<'build'|'payment'>('build')
  const [clientSecret,setClientSecret] = useState<string|null>(null)
  const [loadingPI,setLoadingPI]   = useState(false)
  const [piCreateErr,setPiCreateErr] = useState('')

  useEffect(()=>{setDates(getDates())},[])

  const fmtD=(d:Date)=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})

  async function fetchAvailability(dateStr:string) {
    setLoadingSlots(true)
    try {
      const {data,error}=await supabasePublic
        .from('bookings')
        .select('booked_time')
        .eq('booked_date',dateStr)
        .in('status',['pending','confirmed'])
      if(error)throw error
      setBookedSlots((data??[]).map((r:any)=>r.booked_time).filter(Boolean))
    } catch(err){
      console.error('fetchAvailability error:',err)
      setBookedSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(()=>{
    if(!selDate)return
    fetchAvailability(fmtD(selDate))
    setSelTime(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selDate])

  const canAdd=!!(sel&&(later||(selDate&&selTime)))

  const addItem=()=>{
    if(!sel)return
    setCart(p=>{
      const ex=p.find(c=>c.lesson.id===sel.id)
      if(ex)return p.map(c=>c.lesson.id===sel.id?{...c,quantity:c.quantity+1}:c)
      return [...p,{lesson:sel,quantity:1,
        date:selDate?fmtD(selDate):undefined,
        time:selTime??undefined}]
    })
    setSel(null);setSelDate(null);setSelTime(null);setLater(false)
  }

  const rmItem=(id:string)=>setCart(p=>p.filter(c=>c.lesson.id!==id))
  const qty=(id:string,d:number)=>setCart(p=>p.map(c=>c.lesson.id===id?{...c,quantity:Math.max(1,c.quantity+d)}:c))

  const applyPromo=()=>{
    if(piInput.trim().toUpperCase()===PROMO){setPiApplied(true);setPiErr('')}
    else setPiErr('Invalid code — try FOUNDING')
  }

  const sub  = cart.reduce((s,c)=>s+c.lesson.price.min*c.quantity,0)
  const hasEl = cart.some(c=>c.lesson.promoEligible)
  const disc  = piApplied&&hasEl
    ?cart.filter(c=>c.lesson.promoEligible).reduce((s,c)=>s+c.lesson.price.min*c.quantity*PROMO_PCT,0)
    :0
  const total = sub-disc

  // ── Create PaymentIntent and transition to payment step ───────────────────
  const proceedToPayment=async()=>{
    if(!form.name||!form.email){setFErr('Name and email are required.');return}
    setFErr('')
    setLoadingPI(true)
    setPiCreateErr('')
    try {
      const res=await fetch('/api/create-payment-intent',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          items:cart.map(c=>({
            lessonId:c.lesson.id,
            name:c.lesson.title,
            quantity:c.quantity,
            date:c.date||null,
            time:c.time||null,
                        price:c.lesson.price.min,
          })),
          customerEmail:form.email,
          customerName:form.name,
          promoCode:piApplied?PROMO:undefined,
        }),
      })
      if(!res.ok){
        const err=await res.json()
        setPiCreateErr(err.error||'Could not set up payment. Please try again.')
        return
      }
      const {clientSecret:cs}=await res.json()
      setClientSecret(cs)
      setBookingStep('payment')
      setTimeout(()=>document.querySelector('#book')?.scrollIntoView({behavior:'smooth'}),80)
    } catch {
      setPiCreateErr('Something went wrong. Please try again.')
    } finally {
      setLoadingPI(false)
    }
  }

  // ── Shared helper — step label ────────────────────────────────────────────
  const SL=(n:string,txt:string)=>(
    <div style={{marginBottom:24,display:'flex',alignItems:'center',gap:14}}>
      <div style={{
        width:30,height:30,borderRadius:'50%',flexShrink:0,
        background:'rgba(197,152,62,.1)',border:'1px solid var(--o7)',
        display:'flex',alignItems:'center',justifyContent:'center',
        fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.08em',color:'var(--o5)',
      }}>{n}</div>
      <div style={{width:20,height:1,background:'rgba(107,76,16,.5)',flexShrink:0}}/>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.18em',
        textTransform:'uppercase',color:'var(--o5)'}}>{txt}</span>
    </div>
  )

  const availCount  = ALL_TIMES.length-bookedSlots.length
  const cartQty     = cart.reduce((s,c)=>s+c.quantity,0)

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIRMATION SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if(done) return (
    <section id="book" className="sec" style={{background:'var(--bg2)',textAlign:'center'}}>
      <div style={{maxWidth:480,margin:'0 auto',padding:'40px 0'}}>
        <div style={{fontSize:52,marginBottom:28}}>⛳</div>
        <h2 className="hdg" style={{marginBottom:18}}>You're In.</h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',lineHeight:1.7}}>
          Booking confirmed. Check your email — I'll be in touch to lock in the details.
        </p>
      </div>
    </section>
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYMENT STEP  (embedded Stripe Elements)
  // ═══════════════════════════════════════════════════════════════════════════
  if(bookingStep==='payment'&&clientSecret) return (
    <section id="book" className="sec" style={{background:'var(--bg2)'}}>
      <div className="wrap">

        {/* Back link */}
        <button
          onClick={()=>{setBookingStep('build');setClientSecret(null)}}
          style={{
            background:'none',border:'none',cursor:'pointer',marginBottom:36,padding:0,
            display:'flex',alignItems:'center',gap:8,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,
            letterSpacing:'.14em',textTransform:'uppercase',color:'var(--t3)',
            transition:'color .2s',
          }}
          onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
          onMouseLeave={e=>(e.currentTarget.style.color='var(--t3)')}
        >
          ← Edit Cart
        </button>

        <div style={{marginBottom:48}}>
          <div className="lbl" style={{marginBottom:18}}>Secure Checkout</div>
          <h2 className="hdg" style={{fontSize:'clamp(38px,5vw,64px)'}}>
            Complete Your<br/><em>Booking.</em>
          </h2>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:48}}>

          {/* Left: Order summary */}
          <div>
            {SL('05','Order Summary')}

            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
              {cart.map(item=>(
                <div key={item.lesson.id} style={{
                  padding:'16px 20px',background:'var(--bgc)',border:'1px solid var(--bd)',
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,
                        color:'var(--t1)',marginBottom:5}}>{item.lesson.title}</div>
                      {item.quantity>1&&(
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                          color:'var(--t3)',letterSpacing:'.1em',marginBottom:4}}>
                          ×{item.quantity}
                        </div>
                      )}
                      {item.date?(
                        <div className="lbl" style={{fontSize:9,color:'var(--o5)'}}>
                          {item.date}{item.time&&` · ${item.time}`}
                        </div>
                      ):(
                        <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>
                          Scheduling via email
                        </div>
                      )}
                    </div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,
                      fontWeight:300,color:'var(--t1)',lineHeight:1,marginLeft:12}}>
                      ${(item.lesson.price.min*item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{padding:'16px 20px',background:'var(--bgc)',border:'1px solid var(--bd)'}}>
              {disc>0&&(
                <div style={{display:'flex',justifyContent:'space-between',
                  padding:'4px 0 10px',marginBottom:10,borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--g4)'}}>
                    20% Founding Discount
                  </span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:'var(--g4)'}}>
                    -${disc.toFixed(2)}
                  </span>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,color:'var(--t2)'}}>
                  Total
                </span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,color:'var(--t1)'}}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer info recap */}
            <div style={{marginTop:16,padding:'14px 20px',background:'rgba(197,152,62,.04)',
              border:'1px solid var(--ba)'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.12em',
                textTransform:'uppercase',color:'var(--t4)',marginBottom:4}}>Booking for</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t1)',lineHeight:1.6}}>
                {form.name}
                <span style={{color:'var(--t3)',marginLeft:6}}>{form.email}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Element */}
          <div>
            {SL('06','Payment')}
            {clientSecret ? (<Elements stripe={stripePromise} options={{clientSecret,appearance:stripeAppearance}}>
              <PaymentForm
                total={total}
                customerName={form.name}
                customerEmail={form.email}
                onSuccess={()=>setDone(true)}
                onBack={()=>{setBookingStep('build');setClientSecret(null)}}
              />
            </Elements>) : (<div style={{color:'var(--t1)',textAlign:'center',padding:'20px'}}>Loading payment form…</div>)}
          </div>
        </div>
      </div>
    </section>
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // BUILD STEP  (lesson selection + scheduling + cart + contact)
  // ═══════════════════════════════════════════════════════════════════════════
  const IS:React.CSSProperties={
    width:'100%',padding:'13px 16px',background:'var(--bgc)',
    border:'1px solid var(--bd)',color:'var(--t1)',fontFamily:"'DM Sans',sans-serif",
    fontSize:14,outline:'none',transition:'border-color .2s',
  }

  const addBtnLabel=canAdd
    ?'Add to Cart'
    :!selDate?'Choose a Date First':'Choose a Time to Continue'

  return (
    <section id="book" className="sec" style={{background:'var(--bg2)'}}>
      <div className="wrap">
        <div style={{marginBottom:56}}>
          <div className="lbl" style={{marginBottom:18}}>Book a Lesson</div>
          <h2 className="hdg">Let's Build Your<br/><em>Game.</em></h2>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:64}}>

          {/* ── LEFT: Lesson + Schedule ── */}
          <div>
            {SL('01','Choose a Lesson')}

            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:sel?40:0}}>
              {LESSONS.map(l=>{
                const isSelected=sel?.id===l.id
                return (
                  <button key={l.id} onClick={()=>setSel(isSelected?null:l)}
                    className="lesson-row"
                    style={{
                      background:isSelected?'var(--bch)':'var(--bgc)',
                      border:`1px solid ${isSelected?'var(--o5)':'var(--bd)'}`,
                    }}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,
                        color:'var(--t1)',marginBottom:6,
                        display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',lineHeight:1.2}}>
                        {l.title}
                        {l.popular&&(
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                            background:'var(--o5)',color:'var(--bg)',padding:'2px 7px',
                            letterSpacing:'.1em',textTransform:'uppercase',flexShrink:0}}>Popular</span>
                        )}
                        {l.bestValue&&(
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                            background:'var(--g7)',color:'var(--t1)',padding:'2px 7px',
                            letterSpacing:'.1em',textTransform:'uppercase',flexShrink:0}}>Best Value</span>
                        )}
                      </div>
                      <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>{l.duration}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0,marginLeft:16}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,
                        color:isSelected?'var(--o3)':'var(--t1)',lineHeight:1,transition:'color .2s'}}>
                        ${l.price.min}
                      </div>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,
                        color:'var(--t4)',textDecoration:'line-through',marginTop:3}}>
                        ${l.price.max}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {sel&&(
              <div style={{animation:'kpFU .4s ease-out forwards'}}>
                <div style={{borderTop:'1px solid var(--bd)',paddingTop:36,marginTop:8}}>
                  {SL('02','Schedule')}

                  <label style={{
                    display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',
                    marginBottom:28,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t2)',
                    padding:'14px 16px',background:'var(--bgc)',border:'1px solid var(--bd)',
                    transition:'border-color .2s',
                    ...(later?{borderColor:'rgba(255,255,255,.15)'}:{}),
                  }}>
                    <input
                      type="checkbox"
                      checked={later}
                      onChange={e=>{setLater(e.target.checked);if(e.target.checked){setSelDate(null);setSelTime(null)}}}
                      style={{width:16,height:16,flexShrink:0,marginTop:3}}
                    />
                    <div>
                      <div style={{color:'var(--t1)',fontWeight:500,fontSize:14,marginBottom:4}}>
                        Schedule after purchase
                      </div>
                      <div style={{fontSize:13,color:'var(--t3)',lineHeight:1.55}}>
                        Pay now and coordinate timing later — KP will follow up by email within 24 hours.
                      </div>
                    </div>
                  </label>

                  {!later&&(
                    <>
                      <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:10}}>Select Date</div>
                      <div className="ns" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:24}}>
                        {dates.map((date,i)=>{
                          const s=selDate?.toDateString()===date.toDateString()
                          return (
                            <button key={i} className="date-btn" onClick={()=>setSelDate(date)} style={{
                              background:s?'var(--o5)':'var(--bgc)',
                              border:`1px solid ${s?'var(--o5)':'var(--bd)'}`,
                              color:s?'var(--bg)':'var(--t1)',
                            }}>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                                letterSpacing:'.08em',textTransform:'uppercase',marginBottom:3,opacity:.8}}>
                                {date.toLocaleDateString('en-US',{weekday:'short'})}
                              </div>
                              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,lineHeight:1,fontWeight:400}}>
                                {date.getDate()}
                              </div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                                letterSpacing:'.06em',marginTop:3,opacity:.7}}>
                                {date.toLocaleDateString('en-US',{month:'short'})}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {selDate&&loadingSlots&&(
                        <div style={{display:'flex',justifyContent:'center',padding:24}}>
                          <div style={{width:20,height:20,borderRadius:'50%',
                            border:'2px solid var(--bd)',borderTopColor:'var(--o5)',
                            animation:'kpSpin .7s linear infinite'}}/>
                        </div>
                      )}

                      {selDate&&!loadingSlots&&(
                        <>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                            <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>Select Time</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                              color:'var(--g4)',letterSpacing:'.1em'}}>
                              {availCount} slot{availCount!==1?'s':''} open
                            </div>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(94px,1fr))',
                            gap:7,marginBottom:24}}>
                            {ALL_TIMES.map(time=>{
                              const isBooked=bookedSlots.includes(time)
                              const isSelected=selTime===time
                              return (
                                <button key={time} disabled={isBooked} onClick={()=>setSelTime(time)}
                                  className="time-btn" style={{
                                  background:isSelected?'var(--o5)':isBooked?'rgba(0,0,0,.15)':'rgba(61,138,82,.08)',
                                  border:`1px solid ${isSelected?'var(--o5)':isBooked?'rgba(255,255,255,.04)':'rgba(61,138,82,.22)'}`,
                                  color:isSelected?'var(--bg)':isBooked?'rgba(80,96,86,.35)':'var(--t1)',
                                  opacity:isBooked?.5:1,
                                  textDecoration:isBooked?'line-through':'none',
                                  letterSpacing:'.08em',
                                }}>
                                  {time}
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <button onClick={addItem} className="btn-g" disabled={!canAdd}
                    style={{width:'100%',justifyContent:'center',marginTop:8}}>
                    {addBtnLabel}
                  </button>
                  {!canAdd&&!later&&(
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t3)',
                      textAlign:'center',marginTop:10,letterSpacing:'.1em'}}>
                      Or tick <em style={{fontStyle:'normal',color:'var(--o7)'}}>Schedule after purchase</em> above to skip
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Cart + Contact + Proceed ── */}
          <div>
            {SL('03',cartQty>0?`Review Your Booking (${cartQty})`:'Review Your Booking')}

            {/* Empty cart guided state */}
            {cart.length===0?(
              <div style={{
                padding:'48px 32px',textAlign:'center',
                background:'var(--bgc)',border:'1px dashed rgba(255,255,255,.07)',
                display:'flex',flexDirection:'column',alignItems:'center',gap:20,
              }}>
                <div style={{fontSize:28,opacity:.28}}>⛳</div>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,
                    color:'var(--t2)',fontStyle:'italic',lineHeight:1.2,marginBottom:18}}>
                    Nothing added yet.
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10,
                    textAlign:'left',maxWidth:264,margin:'0 auto'}}>
                    {[
                      'Choose a lesson on the left',
                      'Pick a date & time — or schedule after purchase',
                      'Add to cart, then check out securely',
                    ].map((step,i)=>(
                      <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                          color:'var(--o7)',flexShrink:0,lineHeight:1.7,letterSpacing:'.06em'}}>
                          {i+1}.
                        </span>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,
                          color:'var(--t3)',lineHeight:1.6}}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {cart.map(item=>(
                  <div key={item.lesson.id} style={{
                    padding:'18px 20px',background:'var(--bgc)',border:'1px solid var(--bd)',
                  }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,
                          color:'var(--t1)',marginBottom:5}}>{item.lesson.title}</div>
                        {item.date?(
                          <div className="lbl" style={{fontSize:9,color:'var(--o5)'}}>
                            {item.date}{item.time&&` · ${item.time}`}
                          </div>
                        ):(
                          <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>
                            KP will confirm time via email
                          </div>
                        )}
                      </div>
                      <button
                        onClick={()=>rmItem(item.lesson.id)}
                        aria-label={`Remove ${item.lesson.title}`}
                        style={{background:'none',border:'none',cursor:'pointer',color:'var(--t4)',
                          fontSize:20,lineHeight:1,padding:'0 4px',transition:'color .2s',marginLeft:12}}
                        onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
                        onMouseLeave={e=>(e.currentTarget.style.color='var(--t4)')}>
                        ×
                      </button>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                      borderTop:'1px solid rgba(255,255,255,.04)',paddingTop:12}}>
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        <button className="qty-btn" onClick={()=>qty(item.lesson.id,-1)}
                          aria-label="Decrease quantity"
                          style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--bd)',
                            color:'var(--t1)',borderRadius:2}}>−</button>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,
                          minWidth:28,textAlign:'center'}}>{item.quantity}</span>
                        <button className="qty-btn" onClick={()=>qty(item.lesson.id,1)}
                          aria-label="Increase quantity"
                          style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--bd)',
                            color:'var(--t1)',borderRadius:2}}>+</button>
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:'var(--t1)'}}>
                        ${(item.lesson.price.min*item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length>0&&(
              <>
                {/* Promo code */}
                <div style={{marginTop:14}}>
                  <div style={{display:'flex',gap:8}}>
                    <input
                      value={piInput}
                      onChange={e=>{setPiInput(e.target.value);setPiErr('')}}
                      placeholder="Promo code (try FOUNDING)"
                      style={{
                        ...IS,flex:1,fontFamily:"'JetBrains Mono',monospace",
                        fontSize:12,textTransform:'uppercase',letterSpacing:'.1em',
                      }}
                      onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                      onBlur={e=>(e.target.style.borderColor='var(--bd)')}
                    />
                    <button onClick={applyPromo} className="btn-w"
                      style={{padding:'10px 18px',fontSize:11,flexShrink:0}}>
                      Apply
                    </button>
                  </div>
                  {piErr&&(
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'#e07070',marginTop:7}}>
                      {piErr}
                    </div>
                  )}
                  {piApplied&&(
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--g4)',
                      marginTop:7,display:'flex',alignItems:'center',gap:6}}>
                      <span>\u2713</span> 20% founding member discount applied to packs
                    </div>
                  )}
                </div>

                {/* Order summary */}
                <div style={{marginTop:12,padding:'20px',background:'var(--bgc)',border:'1px solid var(--bd)'}}>
                  {([
                    {lbl:'Subtotal',val:`$${sub.toFixed(2)}`,disc:false,big:false},
                    ...(disc>0?[{lbl:'20% Founding Discount',val:`-$${disc.toFixed(2)}`,disc:true,big:false}]:[]),
                    {lbl:'Total',val:`$${total.toFixed(2)}`,disc:false,big:true},
                  ] as {lbl:string;val:string;disc:boolean;big:boolean}[]).map((row)=>(
                    <div key={row.lbl} style={{
                      display:'flex',justifyContent:'space-between',alignItems:'center',
                      padding:row.big?'14px 0 0':'7px 0',
                      borderTop:row.big?'1px solid var(--bd)':'none',
                      marginTop:row.big?10:0,
                    }}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",
                        fontSize:row.big?15:13,fontWeight:row.big?600:400,
                        color:row.disc?'var(--g4)':'var(--t2)'}}>{row.lbl}</span>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",
                        fontSize:row.big?30:20,fontWeight:300,
                        color:row.disc?'var(--g4)':'var(--t1)'}}>{row.val}</span>
                    </div>
                  ))}
                </div>

                {/* Contact info */}
                <div style={{marginTop:36}}>
                  <div style={{borderTop:'1px solid var(--bd)',paddingTop:28,marginBottom:24}}>
                    {SL('04','Your Info')}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {[
                      {k:'name', lbl:'Full Name *',     ph:'John Smith',        t:'text'},
                      {k:'email',lbl:'Email Address *', ph:'john@example.com',  t:'email'},
                      {k:'phone',lbl:'Phone Number',    ph:'(609) 555-0123',    t:'tel'},
                    ].map(f=>(
                      <div key={f.k}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
                          textTransform:'uppercase',color:'var(--t3)',display:'block',marginBottom:8}}>
                          {f.lbl}
                        </div>
                        <input
                          type={f.t}
                          placeholder={f.ph}
                          value={form[f.k as keyof BForm]}
                          onChange={e=>setForm({...form,[f.k]:e.target.value})}
                          style={IS}
                          onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                          onBlur={e=>(e.target.style.borderColor='var(--bd)')}
                        />
                      </div>
                    ))}
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
                        textTransform:'uppercase',color:'var(--t3)',display:'block',marginBottom:8}}>
                        Message (optional)
                      </div>
                      <textarea
                        placeholder="Anything I should know before our first session? Goals, experience level, injuries…"
                        rows={3}
                        value={form.message}
                        onChange={e=>setForm({...form,message:e.target.value})}
                        style={{...IS,resize:'vertical'}}
                        onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                        onBlur={e=>(e.target.style.borderColor='var(--bd)')}
                      />
                    </div>
                  </div>

                  {fErr&&(
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'#e07070',marginTop:12}}>
                      {fErr}
                    </div>
                  )}
                  {piCreateErr&&(
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'#e07070',marginTop:12}}>
                      {piCreateErr}
                    </div>
                  )}

                  {/* Proceed to Payment — replaces old Stripe Checkout redirect */}
                  <button
                    onClick={proceedToPayment}
                    disabled={loadingPI}
                    className="btn-g"
                    style={{width:'100%',justifyContent:'center',marginTop:20,padding:'17px 24px',fontSize:11}}
                  >
                    {loadingPI
                      ? 'Setting Up Payment…'
                      : `Proceed to Payment — $${total.toFixed(2)} →`
                    }
                  </button>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t4)',
                    textAlign:'center',marginTop:10,letterSpacing:'.12em'}}>
                    Secure checkout via Stripe
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open,setOpen]=useState<number|null>(null)
  return (
    <section id="faq" className="sec">
      <div className="wrap" style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div className="lbl" style={{marginBottom:18}}>FAQ</div>
          <h2 className="hdg">Got Questions?<br/><em>Good.</em></h2>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {FAQS.map((f,i)=>(
            <div key={i} style={{
              background:'var(--bgc)',
              border:`1px solid ${open===i?'var(--ba)':'var(--bd)'}`,
              transition:'border-color .3s ease',
            }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{
                width:'100%',padding:'22px 26px',display:'flex',alignItems:'flex-start',
                justifyContent:'space-between',background:'none',border:'none',
                cursor:'pointer',textAlign:'left',gap:24,
              }}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,
                  color:'var(--t1)',lineHeight:1.25}}>{f.q}</span>
                <span style={{
                  fontSize:22,color:'var(--o5)',flexShrink:0,lineHeight:1,marginTop:2,
                  transform:open===i?'rotate(45deg)':'none',
                  transition:'transform .3s ease',display:'inline-block',
                }}>+</span>
              </button>
              <div className={`acc${open===i?' open':''}`}>
                <div>
                  <div style={{padding:'0 26px 24px',fontFamily:"'DM Sans',sans-serif",
                    fontSize:15,lineHeight:1.8,color:'var(--t2)'}}>{f.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:52,padding:'36px 40px',textAlign:'center',
          background:'var(--bgc)',border:'1px solid var(--bd)'}}>
          <div className="lbl" style={{marginBottom:14}}>Still have questions?</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',marginBottom:24,lineHeight:1.65}}>
            Reach out directly — no bots, no wait time.
          </p>
          <a href="mailto:kpgolftraining@gmail.com" className="btn-w">Email KP Directly</a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const yr=new Date().getFullYear()
  const go=(h:string)=>document.querySelector(h)?.scrollIntoView({behavior:'smooth'})
  return (
    <footer style={{
      background:'var(--bg2)',borderTop:'1px solid var(--bd)',
      padding:'clamp(64px,8vw,96px) clamp(20px,4vw,40px) 32px',
    }}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:52,marginBottom:64}}>

          {/* Brand */}
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:400,
              color:'var(--t1)',marginBottom:16}}>
              KP<span style={{color:'var(--o5)'}}>.</span>
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',
              lineHeight:1.75,maxWidth:240}}>
              Affordable, judgment-free golf lessons for South Jersey golfers — beginner to weekend warrior.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.16em',
              textTransform:'uppercase',color:'var(--t3)',marginBottom:20}}>Navigation</div>
            <nav style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                ['About','#about'],
                ['Swing Videos','#videos'],
                ['Pricing','#pricing'],
                ['Book a Lesson','#book'],
                ['FAQ','#faq'],
              ].map(([l,h])=>(
                <button key={h} onClick={()=>go(h)} style={{
                  fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t2)',
                  background:'none',border:'none',cursor:'pointer',textAlign:'left',
                  padding:0,transition:'color .2s',
                }}
                onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
                onMouseLeave={e=>(e.currentTarget.style.color='var(--t2)')}>{l}</button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.16em',
              textTransform:'uppercase',color:'var(--t3)',marginBottom:20}}>Contact</div>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.12em',
                  textTransform:'uppercase',color:'var(--t4)',marginBottom:6}}>Email</div>
                <a href="mailto:kpgolftraining@gmail.com" style={{
                  fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',
                  textDecoration:'none',transition:'color .2s',
                }}
                onMouseEnter={e=>(e.currentTarget.style.color='var(--o5)')}
                onMouseLeave={e=>(e.currentTarget.style.color='var(--t2)')}>
                  kpgolftraining@gmail.com
                </a>
              </div>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.12em',
                  textTransform:'uppercase',color:'var(--t4)',marginBottom:6}}>Area</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>
                  South Jersey, NJ
                </div>
              </div>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.12em',
                  textTransform:'uppercase',color:'var(--t4)',marginBottom:6}}>Caddie History</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',lineHeight:1.6}}>
                  Pine Valley · Tavistock
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid var(--bd)',paddingTop:24,
          display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.1em',
            textTransform:'uppercase',color:'var(--t4)'}}>
            © {yr} KP Golf Training. All rights reserved.
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:14,color:'var(--t3)'}}>
            Pine Valley · Tavistock
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [mounted,setMounted]=useState(false)
  const [entered,setEntered]=useState(false)
  useEffect(()=>{setMounted(true)},[])

  if(!mounted) return (
    <div style={{background:'#070f0a',minHeight:'100vh'}}>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      {!entered&&<LoadingScreen onDone={()=>setEntered(true)}/>}
      <div className="grain" style={{background:'var(--bg)',minHeight:'100vh'}}>
        <Navbar/>
        <Hero/>
        <Marquees/>
        <WhyKP/>
        <VideoSlider/>
        <ImageSlider/>
        <Pricing/>
        <HowItWorks/>
        <Booking/>
        <FAQ/>
        <Footer/>
      </div>
    </>
  )
}
