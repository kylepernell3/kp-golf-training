'use client'

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react'

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

.af{animation:kpFall var(--fd,7s) var(--fdy,0s) linear infinite}
.aml{animation:kpML var(--ms,30s) linear infinite;display:flex}
.amr{animation:kpMR var(--ms,36s) linear infinite;display:flex}
.aft{animation:kpFloat 8s ease-in-out infinite}
.afu{animation:kpFU .75s ease-out forwards}
.al{animation:kpLoad 1.9s cubic-bezier(.4,0,.2,1) forwards}
.ap{animation:kpPulse 1.7s ease-out infinite}

.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 26px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:12px;
  letter-spacing:.17em;text-transform:uppercase;background:var(--o5);color:var(--bg);
  border:1px solid var(--o5);cursor:pointer;transition:all .22s ease;text-decoration:none;
  user-select:none;white-space:nowrap}
.btn-g:hover{background:var(--o3);border-color:var(--o3);transform:translateY(-1px)}
.btn-g:active{transform:translateY(0)}
.btn-g:disabled{opacity:.4;cursor:not-allowed;transform:none}

.btn-w{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 26px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:12px;
  letter-spacing:.17em;text-transform:uppercase;background:transparent;color:var(--t1);
  border:1px solid var(--bd);cursor:pointer;transition:all .22s ease;text-decoration:none;
  user-select:none;white-space:nowrap}
.btn-w:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.05)}

.lbl{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--o5)}
.hdg{font-family:'Cormorant Garamond',serif;font-weight:400;
  font-size:clamp(44px,7vw,86px);line-height:.91;color:var(--t1)}

.kcard{background:var(--bgc);border:1px solid var(--bd);transition:all .3s ease}
.kcard:hover{background:var(--bch);border-color:rgba(255,255,255,.13);transform:translateY(-2px)}

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
interface TSlot { time:string; available:boolean }

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
  'Pine Valley Golf Club','Tavistock Club','On the Range','Short Game Practice',
  'Tee Box Setup','Putting Green','Approach Shots','Drive Analysis',
  'Iron Play','Bunker Work','Course Walk',
]

const LESSONS: Lesson[] = [
  { id:'l30',title:'30-Min Lesson',duration:'30 minutes',price:{min:35,max:40},type:'single',
    description:'Laser-focused on one aspect of your game. Perfect for a quick tune-up.',
    details:['1-on-1 instruction','Video feedback','One drill to take home'] },
  { id:'l45',title:'45-Min Lesson',duration:'45 minutes',price:{min:45,max:55},type:'single',popular:true,
    description:'Our most booked session. Enough time to diagnose, fix, and ingrain a real change.',
    details:['1-on-1 instruction','Video swing analysis','2 practice drills','Personalized feedback'] },
  { id:'l60',title:'60-Min Lesson',duration:'60 minutes',price:{min:55,max:65},type:'single',
    description:'A deep dive into your full swing, short game, or on-course decision making.',
    details:['1-on-1 instruction','Full video analysis','Multi-area coverage','Written practice plan'] },
  { id:'l90',title:'90-Min Lesson',duration:'90 minutes',price:{min:80,max:95},type:'single',
    description:'The complete assessment — full game from tee to green. Where real transformation starts.',
    details:['1-on-1 instruction','Complete swing analysis','Short game work','Full practice plan','On-course tips'] },
  { id:'pk3',title:'3×45 Starter Pack',duration:'3 sessions · 45 min each',price:{min:135,max:150},type:'pack',sessions:3,promoEligible:true,
    description:'Three focused sessions to build real momentum and see results on the course.',
    details:['3 × 45-min sessions','Progress tracking','Custom drill library','Between-session tips'] },
  { id:'pk5',title:'5×60 Break-90 Pack',duration:'5 sessions · 60 min each',price:{min:260,max:300},type:'pack',sessions:5,bestValue:true,promoEligible:true,
    description:'Built for golfers serious about breaking 90. A full game transformation over 5 sessions.',
    details:['5 × 60-min sessions','Full swing overhaul','Short game focus','Course management','Handicap goal plan'] },
  { id:'pkj',title:'4×45 Junior Pack',duration:'4 sessions · 45 min each',price:{min:160,max:180},type:'pack',sessions:4,promoEligible:true,
    description:'For young golfers ages 6–17. Fun, patient, built for long-term athletic development.',
    details:['4 × 45-min sessions','Age-appropriate drills','Fun fundamentals','Parent updates after each session'] },
]

const MARQUEE_W = [
  'Fix Your Slice','Gain Distance','Pure Your Irons','Beginner Friendly',
  'Affordable Rates','Flexible Scheduling','Real Experience','South Jersey Golf',
  'No Judgment Zone','Lower Your Handicap','Short Game Mastery','Caddied at Pine Valley',
]

const TIMES: TSlot[] = [
  {time:'8:00 AM',available:true},{time:'9:00 AM',available:true},
  {time:'10:00 AM',available:false},{time:'11:00 AM',available:true},
  {time:'12:00 PM',available:false},{time:'1:00 PM',available:true},
  {time:'2:00 PM',available:true},{time:'3:00 PM',available:false},
  {time:'4:00 PM',available:true},{time:'5:00 PM',available:true},
]

function getDates(): Date[] {
  const r:Date[]=[];const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1)
  let t=0;while(r.length<14&&t<30){if(d.getDay()!==1)r.push(new Date(d));d.setDate(d.getDate()+1);t++}
  return r
}

const FAQS=[
  { q:'Are you PGA certified?',
    a:"No — and that's kind of the point. I'm not a textbook instructor with a laminated card. I learned golf from the ground up, caddied at two of the most prestigious courses in the world — Tavistock and Pine Valley — and spent years figuring out what actually fixes a real golfer's game. No jargon. No $300/hr ego. Just real feedback that shows up on your scorecard." },
  { q:'Where are lessons held?',
    a:"At driving ranges and practice facilities across South Jersey. Once you book, I'll confirm a spot convenient for you. I keep a few local locations in rotation and recommend the best fit based on what we're working on." },
  { q:'What should I bring?',
    a:"Your clubs, golf shoes or sneakers, and a willingness to try something different. I bring alignment sticks, training aids, and my phone for video analysis. No clubs yet? No problem — we can work with loaners or I'll help you figure out what to get." },
  { q:'Can I reschedule or cancel?',
    a:"Absolutely. Just give me at least 24 hours and we'll sort it out. Pack sessions don't expire, so no stress if you need to push a session. I'm not a big box golf academy — I'm flexible because I'm real." },
]

const STEPS=[
  {n:'01',icon:'⛳',title:'Choose Your Lesson',desc:'Pick a session length or pack that fits your schedule and goals.'},
  {n:'02',icon:'📅',title:'Pick a Time',desc:'Select a date and time from available slots. First-timers get priority.'},
  {n:'03',icon:'🔒',title:'Lock It In',desc:'Pay securely online. Your spot is confirmed instantly.'},
  {n:'04',icon:'🏌️',title:'Show Up & Swing',desc:'Meet at the range. We diagnose, drill, and practice — no judgment.'},
  {n:'05',icon:'📋',title:'Take the Plan Home',desc:'Leave with a custom practice plan so every range session counts.'},
]

const PILLARS=[
  {icon:'🏆',title:"Lived at the Game's Highest Level",
   body:"I caddied at Tavistock and Pine Valley — two of the most storied courses in the world. That experience gave me an eye for the game that no classroom ever could."},
  {icon:'🎯',title:'Real Fixes, Real Fast',
   body:"Skip the theory. I teach simple mechanical cues and instant drills that show up on the scorecard within a round or two. No jargon, no fluff."},
  {icon:'💚',title:'Built for South Jersey Golfers',
   body:"Weekend warriors, beginners, juniors. My pricing is built for real golfers — not golf academies. You don't need a trust fund to play better golf."},
]

const PROMO='FOUNDING', PROMO_PCT=0.2, SPOTS=9

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useInView(opts?:{threshold?:number;once?:boolean}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref=useRef<any>(null)
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
  const ref=useRef<HTMLVideoElement|null>(null)
  const [playing,setPlaying]=useState(false)
  useEffect(()=>{
    const v=ref.current;if(!v)return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){v.play().then(()=>setPlaying(true)).catch(()=>{})}
      else{v.pause();setPlaying(false)}
    },{threshold})
    obs.observe(v);return()=>obs.disconnect()
  },[threshold])
  return {ref,playing}
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
    <div onClick={enter} style={{
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
  const lb:React.CSSProperties={fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:'.14em',
    textTransform:'uppercase',color:'#96a89a',background:'none',border:'none',cursor:'pointer',padding:0,transition:'color .2s'}
  return (
    <>
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,height:68,padding:'0 24px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        background:scrolled?'rgba(7,15,10,.94)':'transparent',
        backdropFilter:scrolled?'blur(14px)':'none',
        borderBottom:`1px solid ${scrolled?'rgba(255,255,255,.07)':'transparent'}`,
        transition:'all .38s ease',
      }}>
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{
          fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:400,
          color:'#ede8dc',background:'none',border:'none',cursor:'pointer',padding:0,
        }}>KP<span style={{color:'#c5983e'}}>.</span></button>

        {/* Desktop */}
        <div className="nd" style={{alignItems:'center',gap:36}}>
          {NAV.map(l=>(
            <button key={l.h} onClick={()=>go(l.h)} style={lb}
              onMouseEnter={e=>(e.currentTarget.style.color='#ede8dc')}
              onMouseLeave={e=>(e.currentTarget.style.color='#96a89a')}
            >{l.l}</button>
          ))}
          <button onClick={()=>go('#book')} className="btn-g" style={{padding:'8px 18px',fontSize:11}}>Book Now</button>
        </div>

        {/* Hamburger */}
        <button className="nh" onClick={()=>setOpen(o=>!o)} style={{
          background:'none',border:'none',cursor:'pointer',flexDirection:'column',gap:5,padding:4,
        }}>
          {[0,1,2].map(i=>(
            <span key={i} style={{
              display:'block',width:22,height:1,background:'#ede8dc',
              transition:'all .28s ease',transformOrigin:'center',
              transform:open?i===0?'translateY(6px) rotate(45deg)':i===2?'translateY(-6px) rotate(-45deg)':'scaleX(0)':'none',
            }}/>
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position:'fixed',top:68,left:0,right:0,zIndex:199,
        background:'rgba(7,15,10,.97)',backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,.07)',
        padding:'28px 28px 40px',display:'flex',flexDirection:'column',gap:28,
        transform:open?'translateY(0)':'translateY(-110%)',
        transition:'transform .36s cubic-bezier(.4,0,.2,1)',
      }}>
        {NAV.map(l=>(
          <button key={l.h} onClick={()=>go(l.h)} style={{
            fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,
            color:'#ede8dc',background:'none',border:'none',cursor:'pointer',textAlign:'left',padding:0,
          }}>{l.l}</button>
        ))}
        <button onClick={()=>go('#book')} className="btn-g" style={{alignSelf:'flex-start'}}>Book a Lesson</button>
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
      id:i,type:(['ball','flag','club'] as const)[Math.floor(r()*3)],
      left:r()*100,dur:5+r()*9,delay:r()*13,rotate:150+r()*400,
      size:14+r()*22,opacity:.12+r()*0.22,
    }))
  },[])
  return (
    <div style={{
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
            <svg width={el.size} height={el.size} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#c5983e" strokeWidth="1.5" fill="rgba(197,152,62,.07)"/>
              <path d="M12 2 Q8 8 8 12 Q8 16 12 22" stroke="#c5983e" strokeWidth=".7" fill="none" opacity=".5"/>
              <path d="M12 2 Q16 8 16 12 Q16 16 12 22" stroke="#c5983e" strokeWidth=".7" fill="none" opacity=".5"/>
              <path d="M2 12 Q8 9 12 9 Q16 9 22 12" stroke="#c5983e" strokeWidth=".7" fill="none" opacity=".5"/>
            </svg>
          )}
          {el.type==='flag'&&(
            <svg width={el.size*.55} height={el.size*1.55} viewBox="0 0 14 36" fill="none">
              <line x1="3" y1="0" x2="3" y2="36" stroke="#c5983e" strokeWidth="1.4"/>
              <polygon points="3,0 14,7 3,14" fill="#c5983e" opacity=".8"/>
            </svg>
          )}
          {el.type==='club'&&(
            <svg width={el.size*.45} height={el.size*2.1} viewBox="0 0 10 46" fill="none">
              <line x1="5" y1="0" x2="5" y2="38" stroke="#c5983e" strokeWidth="1.2"/>
              <rect x="0" y="38" width="10" height="7" rx="1" fill="#c5983e" opacity=".8"/>
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
      <video autoPlay muted loop playsInline src={VIDEOS[0]} style={{
        position:'absolute',inset:0,width:'100%',height:'100%',
        objectFit:'cover',opacity:.16,zIndex:0,
      }}/>
      <div style={{position:'absolute',inset:0,zIndex:1,
        background:'linear-gradient(142deg,rgba(7,15,10,.97) 0%,rgba(7,15,10,.65) 52%,rgba(7,15,10,.92) 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:1,
        background:'radial-gradient(ellipse at 72% 50%,rgba(197,152,62,.045) 0%,transparent 58%)'}}/>
      <FallingBg/>

      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:1280,margin:'0 auto',padding:'120px clamp(20px,4vw,40px) 80px'}}>
        <div style={{maxWidth:780}}>
          <div className="lbl" style={{marginBottom:28,display:'flex',alignItems:'center',gap:16}}>
            <span style={{width:36,height:1,background:'#c5983e',display:'inline-block'}}/>
            South Jersey Golf Lessons — Starting at $35
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(68px,11vw,130px)',fontWeight:400,lineHeight:.88,
            color:'#ede8dc',marginBottom:32,letterSpacing:'-.025em',
          }}>
            Real Golf.<br/>
            <em style={{color:'#d8b05a',fontStyle:'italic'}}>Real</em> Results.
          </h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,lineHeight:1.65,
            color:'#96a89a',maxWidth:520,marginBottom:52}}>
            Former caddie at Pine Valley &amp; Tavistock. Judgment-free lessons for beginners,
            weekend warriors, and everyone in between.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:72}}>
            <button onClick={()=>go('#book')} className="btn-g">Book Your First Lesson</button>
            <button onClick={()=>go('#videos')} className="btn-w">Watch Swing Videos ↓</button>
          </div>
          <div style={{display:'flex',gap:52,flexWrap:'wrap'}}>
            {[['$35','Starting price'],['2','Elite courses caddied'],['5★','Client reviews']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:'#d8b05a',lineHeight:1}}>{v}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:'#506056',marginTop:5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',
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
          <span key={i} style={{display:'inline-flex',alignItems:'center',gap:18,
            fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:'.11em',textTransform:'uppercase',
            color:dir==='l'?'var(--t2)':'var(--t3)',whiteSpace:'nowrap',paddingRight:18}}>
            {w}<span style={{color:dir==='l'?'var(--o5)':'var(--o7)',fontSize:5}}>●</span>
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
  const {ref,inView}=useInView({threshold:.18,once:true})
  return (
    <section id="about" ref={ref} className="sec" style={{maxWidth:1280,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:72,alignItems:'center'}}>
        <div style={{position:'relative',opacity:inView?1:0,transition:'opacity .9s ease'}}>
          <div style={{position:'absolute',inset:-16,border:'1px solid var(--bd)',zIndex:0}}/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMGS[0]} alt="KP Golf Training" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',position:'relative',zIndex:1,display:'block'}}/>
          <div style={{position:'absolute',bottom:24,left:-20,zIndex:2,background:'var(--bg)',border:'1px solid var(--ba)',padding:'10px 18px'}}>
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
          <div style={{display:'flex',flexDirection:'column',gap:26}}>
            {PILLARS.map((p,i)=>(
              <div key={i} style={{display:'flex',gap:20,alignItems:'flex-start',
                opacity:inView?1:0,
                transform:inView?'none':'translateX(28px)',
                transition:`opacity .65s ease ${.18+i*.16}s,transform .65s ease ${.18+i*.16}s`}}>
                <div style={{flexShrink:0,width:46,height:46,background:'var(--bgc)',border:'1px solid var(--bd)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{p.icon}</div>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,color:'var(--t1)',marginBottom:6}}>{p.title}</div>
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
function VSlide({src,idx}:{src:string;idx:number}) {
  const {ref,playing}=useAutoplay(.5)
  return (
    <div style={{flexShrink:0,width:'clamp(260px,68vw,500px)',aspectRatio:'9/16',
      position:'relative',overflow:'hidden',background:'var(--bgc)',border:'1px solid var(--bd)',
      scrollSnapAlign:'center'}}>
      <video ref={ref} src={src} muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      <div style={{position:'absolute',inset:0,background:'rgba(7,15,10,.32)',
        opacity:playing?0:1,transition:'opacity .55s ease',pointerEvents:'none'}}/>
      {playing&&(
        <div style={{position:'absolute',top:14,right:14,display:'flex',alignItems:'center',gap:7,
          background:'rgba(7,15,10,.72)',padding:'5px 10px',border:'1px solid var(--bd)'}}>
          <div className="ap" style={{width:6,height:6,borderRadius:'50%',background:'#c5983e'}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',
            textTransform:'uppercase',color:'#d8b05a'}}>Playing</span>
        </div>
      )}
      <div style={{position:'absolute',bottom:14,left:16,fontFamily:"'JetBrains Mono',monospace",
        fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--t3)'}}>
        Clip {String(idx+1).padStart(2,'0')} / {String(VIDEOS.length).padStart(2,'0')}
      </div>
    </div>
  )
}

function VideoSlider() {
  const scRef=useRef<HTMLDivElement|null>(null)
  const [act,setAct]=useState(0)
  const {ref,inView}=useInView({threshold:.2})
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
            <button onClick={()=>go(Math.max(0,act-1))} className="btn-w" style={{padding:'10px 18px',fontSize:20}}>←</button>
            <button onClick={()=>go(Math.min(VIDEOS.length-1,act+1))} className="btn-w" style={{padding:'10px 18px',fontSize:20}}>→</button>
          </div>
        </div>
      </div>
      <div ref={scRef} className="ns" style={{
        display:'flex',gap:18,overflowX:'auto',scrollSnapType:'x mandatory',
        padding:'0 clamp(20px,4vw,40px)',
        opacity:inView?1:0,transition:'opacity .9s ease',
      }}>
        {VIDEOS.map((src,i)=><VSlide key={i} src={src} idx={i}/>)}
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:32}}>
        {VIDEOS.map((_,i)=>(
          <button key={i} onClick={()=>go(i)} style={{
            height:4,border:'none',cursor:'pointer',borderRadius:2,padding:0,
            background:i===act?'var(--o5)':'var(--bd)',
            width:i===act?26:8,transition:'all .3s ease',
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
        <h2 className="hdg" style={{textAlign:'center',marginBottom:52}}>The Course.<br/><em>The Range. The Work.</em></h2>
        <div style={{position:'relative',aspectRatio:'16/9',overflow:'hidden',
          background:'var(--bgc)',marginBottom:14,
          opacity:inView?1:0,transition:'opacity .85s ease'}}>
          {IMGS.map((src,i)=>(
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={ICAPS[i]} style={{
              position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block',
              opacity:i===act?1:0,transition:'opacity .85s ease',
            }}/>
          ))}
          <div style={{position:'absolute',inset:0,background:'rgba(7,15,10,.87)',
            opacity:inView?0:1,transition:'opacity .85s ease',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'64px 28px 24px',
            background:'linear-gradient(to top,rgba(7,15,10,.9) 0%,transparent 100%)',pointerEvents:'none'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:'italic',color:'var(--t1)',lineHeight:1.2}}>{ICAPS[act]}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--t3)',marginTop:5}}>
              {String(act+1).padStart(2,'0')} / {String(IMGS.length).padStart(2,'0')}
            </div>
          </div>
          {([[-1,'left','←'],[1,'right','→']] as [1|-1,string,string][]).map(([d,s,a])=>(
            <button key={s} onClick={()=>go(d)} style={{
              position:'absolute',top:'50%',transform:'translateY(-50%)',
              [s]:16,width:44,height:44,background:'rgba(7,15,10,.72)',border:'1px solid var(--bd)',
              color:'var(--t1)',cursor:'pointer',fontSize:18,
              display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',
            }}>{a}</button>
          ))}
        </div>
        <div className="ns" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:2}}>
          {IMGS.map((src,i)=>(
            <button key={i} onClick={()=>setAct(i)} style={{
              flexShrink:0,width:76,height:54,padding:0,cursor:'pointer',overflow:'hidden',
              border:`2px solid ${i===act?'var(--o5)':'transparent'}`,
              opacity:i===act?1:.55,transition:'all .2s',
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
  const {ref,inView}=useInView({threshold:.08,once:true})
  const singles=LESSONS.filter(l=>l.type==='single')
  const packs=LESSONS.filter(l=>l.type==='pack')
  const go=()=>document.querySelector('#book')?.scrollIntoView({behavior:'smooth'})

  function Card({lesson,idx}:{lesson:Lesson;idx:number}) {
    return (
      <div className="kcard" style={{
        padding:28,position:'relative',overflow:'hidden',
        opacity:inView?1:0,transform:inView?'none':'translateY(36px)',
        transition:`opacity .6s ease ${idx*.09}s,transform .6s ease ${idx*.09}s`,
        ...(lesson.popular?{border:'1px solid var(--ba)'}:{}),
      }}>
        <div style={{display:'flex',gap:8,marginBottom:22,flexWrap:'wrap',minHeight:22}}>
          {lesson.popular&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',background:'var(--o5)',color:'var(--bg)',padding:'3px 9px'}}>Most Popular</span>}
          {lesson.bestValue&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',background:'var(--g7)',color:'var(--t1)',padding:'3px 9px'}}>Best Value</span>}
          {lesson.promoEligible&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',border:'1px solid var(--o7)',color:'var(--o5)',padding:'3px 9px'}}>Promo Eligible</span>}
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:15,color:'var(--t1)',marginBottom:4}}>{lesson.title}</div>
        <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:22}}>{lesson.duration}</div>
        <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:'var(--t1)',lineHeight:1}}>${lesson.price.min}</span>
          <span style={{color:'var(--t3)',fontSize:16,lineHeight:1}}>–{lesson.price.max}</span>
        </div>
        {lesson.sessions&&(
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t3)',marginBottom:10}}>
            ${Math.round(lesson.price.min/lesson.sessions)}–{Math.round(lesson.price.max/lesson.sessions)} / session
          </div>
        )}
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',lineHeight:1.65,marginBottom:22}}>{lesson.description}</p>
        <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:28}}>
          {lesson.details.map((d,i)=>(
            <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>
              <span style={{color:'var(--o7)',flexShrink:0,marginTop:3,lineHeight:1}}>—</span>{d}
            </div>
          ))}
        </div>
        <button onClick={go} className="btn-g" style={{width:'100%',justifyContent:'center'}}>Book This</button>
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
        <div style={{background:'rgba(197,152,62,.07)',border:'1px solid var(--ba)',
          padding:'16px 24px',margin:'52px 0 36px',
          display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <span className="lbl" style={{fontSize:10}}>🎯 Founding Member Deal — Code: <strong>FOUNDING</strong></span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>
            20% off all lesson packs — {SPOTS} of 15 spots remaining
          </span>
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:11,color:'var(--t2)',
          textTransform:'uppercase',letterSpacing:'.12em',marginBottom:20}}>Individual Sessions</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14,marginBottom:52}}>
          {singles.map((l,i)=><Card key={l.id} lesson={l} idx={i}/>)}
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:11,color:'var(--t2)',
          textTransform:'uppercase',letterSpacing:'.12em',marginBottom:20}}>Lesson Packs</div>
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
          <div className="lbl" style={{marginBottom:18}}>Process</div>
          <h2 className="hdg">From Zero to<br/><em>On the Course.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:36}}>
          {STEPS.map((step,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
              opacity:inView?1:0,transform:inView?'none':'translateY(28px)',
              transition:`opacity .65s ease ${i*.13}s,transform .65s ease ${i*.13}s`}}>
              <div style={{width:76,height:76,borderRadius:'50%',background:'var(--bgc)',border:'1px solid var(--bd)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,marginBottom:18,position:'relative'}}>
                {step.icon}
                <span style={{position:'absolute',top:-8,right:-8,fontFamily:"'JetBrains Mono',monospace",
                  fontSize:9,letterSpacing:'.1em',background:'var(--o5)',color:'var(--bg)',padding:'2px 6px'}}>{step.n}</span>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,color:'var(--t1)',marginBottom:10}}>{step.title}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',lineHeight:1.65}}>{step.desc}</div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--g9)',border:'1px solid var(--bd)',
          padding:'clamp(40px,5vw,64px) clamp(28px,5vw,56px)',marginTop:80,textAlign:'center'}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:400,color:'var(--t1)',marginBottom:16}}>
            Ready to start?
          </h3>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',marginBottom:36}}>
            First lesson starts at $35. No experience needed.
          </p>
          <button onClick={()=>document.querySelector('#book')?.scrollIntoView({behavior:'smooth'})} className="btn-g">
            Book Your First Lesson
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING
// ─────────────────────────────────────────────────────────────────────────────
function Booking() {
  const [sel,setSel]=useState<Lesson|null>(null)
  const [later,setLater]=useState(false)
  const [selDate,setSelDate]=useState<Date|null>(null)
  const [selTime,setSelTime]=useState<string|null>(null)
  const [cart,setCart]=useState<CartItem[]>([])
  const [piInput,setPiInput]=useState('')
  const [piApplied,setPiApplied]=useState(false)
  const [piErr,setPiErr]=useState('')
  const [form,setForm]=useState<BForm>({name:'',email:'',phone:'',message:''})
  const [fErr,setFErr]=useState('')
  const [done,setDone]=useState(false)
  const [dates,setDates]=useState<Date[]>([])

  useEffect(()=>{setDates(getDates())},[])

  const fmtD=(d:Date)=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
  const canAdd=sel&&(later||(selDate&&selTime))

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
    else setPiErr('Invalid code. Try FOUNDING')
  }

  const sub=cart.reduce((s,c)=>s+c.lesson.price.min*c.quantity,0)
  const hasEl=cart.some(c=>c.lesson.promoEligible)
  const disc=piApplied&&hasEl?cart.filter(c=>c.lesson.promoEligible).reduce((s,c)=>s+c.lesson.price.min*c.quantity*PROMO_PCT,0):0
  const total=sub-disc

  const checkout=async()=>{
    if(!form.name||!form.email){setFErr('Name and email are required.');return}
    setFErr('')

    // TODO: Supabase — insert booking before checkout
    // import { createClient } from '@supabase/supabase-js'
    // const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    // await sb.from('bookings').insert({
    //   cart: JSON.stringify(cart), contact: JSON.stringify(form),
    //   total, promo: piApplied, status: 'pending', created_at: new Date().toISOString()
    // })

    // TODO: Stripe — create checkout session and redirect
    // const res = await fetch('/api/checkout', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ cart, total, email: form.email, name: form.name })
    // })
    // const { url } = await res.json()
    // window.location.href = url   ← Stripe-hosted checkout page

    alert(`Booking received! We'll reach out to ${form.email} to confirm.\n\n[Stripe + Supabase integration pending — see TODO comments in source]`)
    setDone(true)
  }

  if(done) return (
    <section id="book" className="sec" style={{background:'var(--bg2)',textAlign:'center'}}>
      <div style={{maxWidth:480,margin:'0 auto'}}>
        <div style={{fontSize:52,marginBottom:28}}>⛳</div>
        <h2 className="hdg" style={{marginBottom:18}}>You're In.</h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)'}}>Booking confirmed. Check your email for details.</p>
      </div>
    </section>
  )

  const IS:React.CSSProperties={width:'100%',padding:'12px 16px',background:'var(--bgc)',
    border:'1px solid var(--bd)',color:'var(--t1)',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none'}

  const SL=(n:string,txt:string)=>(
    <div className="lbl" style={{marginBottom:22,display:'flex',alignItems:'center',gap:14}}>
      <span>{n}</span>
      <span style={{width:24,height:1,background:'var(--o7)',display:'inline-block'}}/>
      <span>{txt}</span>
    </div>
  )

  return (
    <section id="book" className="sec" style={{background:'var(--bg2)'}}>
      <div className="wrap">
        <div style={{marginBottom:56}}>
          <div className="lbl" style={{marginBottom:18}}>Book a Lesson</div>
          <h2 className="hdg">Let's Build Your<br/><em>Game.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:56}}>

          {/* ── LEFT ── */}
          <div>
            {SL('01','Choose a Lesson')}
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:sel?36:0}}>
              {LESSONS.map(l=>(
                <button key={l.id} onClick={()=>setSel(l.id===sel?.id?null:l)} style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'16px 20px',
                  background:sel?.id===l.id?'var(--bch)':'var(--bgc)',
                  border:`1px solid ${sel?.id===l.id?'var(--ba)':'var(--bd)'}`,
                  cursor:'pointer',transition:'all .2s',textAlign:'left',width:'100%',
                }}>
                  <div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,color:'var(--t1)',
                      marginBottom:5,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                      {l.title}
                      {l.popular&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                        background:'var(--o5)',color:'var(--bg)',padding:'2px 7px',letterSpacing:'.1em',textTransform:'uppercase'}}>Popular</span>}
                      {l.bestValue&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                        background:'var(--g7)',color:'var(--t1)',padding:'2px 7px',letterSpacing:'.1em',textTransform:'uppercase'}}>Best Value</span>}
                    </div>
                    <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>{l.duration}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0,marginLeft:16}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,color:'var(--t1)',lineHeight:1}}>${l.price.min}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--t3)'}}>–${l.price.max}</div>
                  </div>
                </button>
              ))}
            </div>

            {sel&&(
              <div>
                {SL('02','Pick a Time')}
                <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer',
                  marginBottom:28,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t2)'}}>
                  <input type="checkbox" checked={later} onChange={e=>setLater(e.target.checked)}/>
                  I'll schedule after purchase
                </label>
                {!later&&(
                  <>
                    <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:12}}>Select Date</div>
                    <div className="ns" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:24}}>
                      {dates.map((date,i)=>{
                        const s=selDate?.toDateString()===date.toDateString()
                        return (
                          <button key={i} onClick={()=>{setSelDate(date);setSelTime(null)}} style={{
                            flexShrink:0,padding:'10px 12px',textAlign:'center',cursor:'pointer',
                            background:s?'var(--o5)':'var(--bgc)',
                            border:`1px solid ${s?'var(--o5)':'var(--bd)'}`,
                            color:s?'var(--bg)':'var(--t1)',transition:'all .2s',
                          }}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:2}}>
                              {date.toLocaleDateString('en-US',{weekday:'short'})}
                            </div>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,lineHeight:1}}>{date.getDate()}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.08em',marginTop:2}}>
                              {date.toLocaleDateString('en-US',{month:'short'})}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {selDate&&(
                      <>
                        <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:12}}>Select Time</div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(96px,1fr))',gap:8,marginBottom:24}}>
                          {TIMES.map(slot=>{
                            const s=selTime===slot.time
                            return (
                              <button key={slot.time} disabled={!slot.available} onClick={()=>setSelTime(slot.time)} style={{
                                padding:'10px 6px',fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                                background:s?'var(--o5)':!slot.available?'rgba(0,0,0,.15)':'var(--bgc)',
                                border:`1px solid ${s?'var(--o5)':'var(--bd)'}`,
                                color:s?'var(--bg)':'var(--t1)',
                                cursor:slot.available?'pointer':'not-allowed',
                                opacity:slot.available?1:.38,transition:'all .2s',
                              }}>{slot.available?slot.time:'—'}</button>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
                <button onClick={addItem} className="btn-g" disabled={!canAdd}
                  style={{width:'100%',justifyContent:'center'}}>
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div>
            {SL('03',`Cart (${cart.reduce((s,c)=>s+c.quantity,0)})`)}

            {cart.length===0?(
              <div style={{padding:'44px 24px',textAlign:'center',background:'var(--bgc)',border:'1px solid var(--bd)',
                fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t3)'}}>
                No lessons added yet.<br/><span style={{fontSize:12,opacity:.6}}>Select one on the left ←</span>
              </div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {cart.map(item=>(
                  <div key={item.lesson.id} style={{padding:'16px 20px',background:'var(--bgc)',border:'1px solid var(--bd)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                      <div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,color:'var(--t1)',marginBottom:4}}>{item.lesson.title}</div>
                        {item.date?(
                          <div className="lbl" style={{fontSize:9,color:'var(--o5)'}}>{item.date}{item.time&&` @ ${item.time}`}</div>
                        ):(
                          <div className="lbl" style={{fontSize:9,color:'var(--t3)'}}>Schedule TBD</div>
                        )}
                      </div>
                      <button onClick={()=>rmItem(item.lesson.id)} style={{background:'none',border:'none',cursor:'pointer',
                        color:'var(--t3)',fontSize:20,lineHeight:1,padding:'0 4px',transition:'color .2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
                        onMouseLeave={e=>(e.currentTarget.style.color='var(--t3)')}>×</button>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:14}}>
                        {([[-1,'−'],[1,'+']] as [number,string][]).map(([d,ic])=>(
                          <button key={ic} onClick={()=>qty(item.lesson.id,d)} style={{
                            width:30,height:30,background:'var(--bg)',border:'1px solid var(--bd)',
                            cursor:'pointer',color:'var(--t1)',fontSize:18,
                            display:'flex',alignItems:'center',justifyContent:'center',
                          }}>{ic}</button>
                        ))}
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14}}>{item.quantity}</span>
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:300,color:'var(--t1)'}}>
                        ${item.lesson.price.min*item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length>0&&(
              <>
                {/* Promo */}
                <div style={{marginTop:16}}>
                  <div style={{display:'flex',gap:8}}>
                    <input value={piInput} onChange={e=>{setPiInput(e.target.value);setPiErr('')}}
                      placeholder="Promo code (try FOUNDING)"
                      style={{...IS,flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                        textTransform:'uppercase',letterSpacing:'.1em'}}
                      onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                      onBlur={e=>(e.target.style.borderColor='var(--bd)')}/>
                    <button onClick={applyPromo} className="btn-w" style={{padding:'10px 16px',fontSize:12}}>Apply</button>
                  </div>
                  {piErr&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'#e05555',marginTop:6}}>{piErr}</div>}
                  {piApplied&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--g4)',marginTop:6}}>✓ 20% founding member discount applied to packs</div>}
                </div>

                {/* Totals */}
                <div style={{marginTop:16,padding:20,background:'var(--bgc)',border:'1px solid var(--bd)'}}>
                  {[
                    ['Subtotal',`$${sub}`,false],
                    ...(disc>0?[[`Founding Discount (20%)`,`-$${disc.toFixed(0)}`,true]]:[] as [string,string,boolean][]),
                    ['Total',`$${total.toFixed(0)}`,false],
                  ].map(([lbl,val,isDisc],i,arr)=>(
                    <div key={String(lbl)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                      padding:i===arr.length-1?'16px 0 0':'8px 0',
                      borderTop:i===arr.length-1?'1px solid var(--bd)':'none',
                      marginTop:i===arr.length-1?8:0}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",
                        fontSize:i===arr.length-1?15:13,fontWeight:i===arr.length-1?600:400,
                        color:isDisc?'var(--g4)':'var(--t2)'}}>{lbl}</span>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",
                        fontSize:i===arr.length-1?28:20,fontWeight:300,color:'var(--t1)'}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div style={{marginTop:36}}>
                  {SL('04','Your Info')}
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {[
                      {k:'name',lbl:'Full Name *',ph:'John Smith',t:'text'},
                      {k:'email',lbl:'Email *',ph:'john@example.com',t:'email'},
                      {k:'phone',lbl:'Phone',ph:'(609) 555-0123',t:'tel'},
                    ].map(f=>(
                      <div key={f.k}>
                        <div className="lbl" style={{fontSize:9,color:'var(--t3)',display:'block',marginBottom:8}}>{f.lbl}</div>
                        <input type={f.t} placeholder={f.ph}
                          value={form[f.k as keyof BForm]}
                          onChange={e=>setForm({...form,[f.k]:e.target.value})}
                          style={IS}
                          onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                          onBlur={e=>(e.target.style.borderColor='var(--bd)')}/>
                      </div>
                    ))}
                    <div>
                      <div className="lbl" style={{fontSize:9,color:'var(--t3)',display:'block',marginBottom:8}}>Message (optional)</div>
                      <textarea placeholder="Anything I should know before our first session?" rows={3}
                        value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                        style={{...IS,resize:'vertical'}}
                        onFocus={e=>(e.target.style.borderColor='var(--o7)')}
                        onBlur={e=>(e.target.style.borderColor='var(--bd)')}/>
                    </div>
                  </div>
                  {fErr&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'#e05555',marginTop:12}}>{fErr}</div>}
                  <button onClick={checkout} className="btn-g" style={{width:'100%',justifyContent:'center',marginTop:20,padding:'16px 24px'}}>
                    Confirm &amp; Pay ${total.toFixed(0)} →
                  </button>
                  <div className="lbl" style={{fontSize:9,color:'var(--t3)',textAlign:'center',marginTop:12,letterSpacing:'.12em'}}>
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
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {FAQS.map((f,i)=>(
            <div key={i} style={{background:'var(--bgc)',
              border:`1px solid ${open===i?'var(--ba)':'var(--bd)'}`,
              transition:'border-color .3s'}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{
                width:'100%',padding:'24px 28px',display:'flex',alignItems:'center',
                justifyContent:'space-between',background:'none',border:'none',
                cursor:'pointer',textAlign:'left',gap:24,
              }}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,
                  color:'var(--t1)',lineHeight:1.2}}>{f.q}</span>
                <span style={{fontSize:24,color:'var(--o5)',flexShrink:0,lineHeight:1,
                  transform:open===i?'rotate(45deg)':'none',transition:'transform .3s'
                }}>+</span>
              </button>
              <div className={`acc${open===i?' open':''}`}>
                <div>
                  <div style={{padding:'0 28px 24px',fontFamily:"'DM Sans',sans-serif",
                    fontSize:15,lineHeight:1.8,color:'var(--t2)'}}>{f.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:48,padding:40,textAlign:'center',background:'var(--bgc)',border:'1px solid var(--bd)'}}>
          <div className="lbl" style={{marginBottom:16}}>Still have questions?</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:'var(--t2)',marginBottom:24}}>
            Reach out directly — no bots, no wait.
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
    <footer style={{background:'var(--bg2)',borderTop:'1px solid var(--bd)',
      padding:'clamp(64px,8vw,96px) clamp(20px,4vw,40px) 32px'}}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:48,marginBottom:64}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:400,color:'var(--t1)',marginBottom:16}}>
              KP<span style={{color:'var(--o5)'}}>.</span>
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)',lineHeight:1.7,marginBottom:24,maxWidth:240}}>
              Real golf lessons for real people. South Jersey's most affordable coaching — no judgment, no fluff.
            </p>
            <div style={{display:'flex',gap:16}}>
              {['IG','TT','YT'].map(p=>(
                <a key={p} href="#" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'.1em',
                  color:'var(--t3)',textDecoration:'none',transition:'color .2s'}}
                  onMouseEnter={e=>(e.currentTarget.style.color='var(--o5)')}
                  onMouseLeave={e=>(e.currentTarget.style.color='var(--t3)')}>{p}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:20}}>Navigation</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[['About','#about'],['Videos','#videos'],['Pricing','#pricing'],['Book a Lesson','#book'],['FAQ','#faq']].map(([l,h])=>(
                <button key={h} onClick={()=>go(h)} style={{
                  fontFamily:"'DM Sans',sans-serif",fontSize:14,color:'var(--t2)',
                  background:'none',border:'none',cursor:'pointer',textAlign:'left',padding:0,transition:'color .2s',
                }}
                onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
                onMouseLeave={e=>(e.currentTarget.style.color='var(--t2)')}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:20}}>Lessons</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {LESSONS.map(l=>(
                <div key={l.id} style={{display:'flex',justifyContent:'space-between',gap:16}}>
                  <button onClick={()=>go('#book')} style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,
                    color:'var(--t2)',background:'none',border:'none',cursor:'pointer',padding:0,
                    textAlign:'left',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='var(--t1)')}
                    onMouseLeave={e=>(e.currentTarget.style.color='var(--t2)')}>{l.title}</button>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--o7)',flexShrink:0}}>${l.price.min}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:20}}>Contact</div>
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              {[{lbl:'Email',val:'kpgolftraining@gmail.com'},{lbl:'Area',val:'South Jersey, NJ'},{lbl:'Availability',val:'Tue–Sun · 8am–6pm'}].map(c=>(
                <div key={c.lbl}>
                  <div className="lbl" style={{fontSize:9,color:'var(--t3)',marginBottom:4}}>{c.lbl}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--t2)'}}>{c.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid var(--bd)',paddingTop:24,
          display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'.1em',
            textTransform:'uppercase',color:'var(--t3)'}}>
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

  useEffect(()=>{ setMounted(true) },[])

  // Prevent SSR/hydration mismatch by deferring full render to client
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
