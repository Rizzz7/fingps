import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const T = {
  bg: '#010204', surface: '#0e0b0e', border: '#252525',
  accent: '#007be3', accent2: '#4f4ff1', cyan: '#95d7e4', blue2: '#3b93ce',
  purple: '#a78bfa', green: '#4ade80', orange: '#fb923c', pink: '#f472b6',
  yellow: '#fbbf24', teal: '#2dd4bf',
  textMain: '#ffffff', textMuted: 'rgba(255,255,255,0.5)',
}

const PAGES = [
  { label: 'Dashboard',    path: '/dashboard' },
  { label: 'Roadmap',      path: '/roadmap' },
  { label: 'Quiz',         path: '/quiz' },
  { label: 'Results',      path: '/results' },
  { label: 'What-If',      path: '/whatif' },
  { label: 'Talk to ARTH', path: '/chat' },
  { label: 'Analysis',     path: '/analysis' },
]

const fmt = (n) => {
  if (!n || isNaN(n)) return '₹—'
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr'
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L'
  return '₹' + Math.round(n / 1000) + 'K'
}

const computeScenarios = ({ sipAmount, retirementAge, inflationGuard, riskTolerance, currentAge = 28, currentSavings = 420000 }) => {
  const yrs = Math.max(1, retirementAge - currentAge)
  const inf = inflationGuard / 100
  const project = (cagr, isCoast = false, timeSlice = 1) => {
    const activeYrs = yrs * timeSlice
    const fvL = currentSavings * Math.pow(1 + cagr, activeYrs)
    let fvS = 0
    if (isCoast) {
      const cYrs = Math.max(1, Math.floor(yrs / 2))
      const ac = Math.min(activeYrs, cYrs)
      const mid = sipAmount * 12 * ((Math.pow(1 + cagr, ac) - 1) / cagr)
      fvS = mid * Math.pow(1 + cagr, Math.max(0, activeYrs - cYrs))
    } else {
      fvS = sipAmount * 12 * ((Math.pow(1 + cagr, activeYrs) - 1) / cagr)
    }
    const nom = fvL + fvS
    return { nominal: nom, real: nom / Math.pow(1 + inf, activeYrs) }
  }
  const sipK = Math.round(sipAmount / 1000)
  const midAge = Math.floor(currentAge + yrs * 0.5)
  return [
    {
      id: 'moonshot', label: 'Moonshot', icon: '🚀', color: T.pink, pathY: 55, cagr: '+22%',
      netWorth: fmt(project(0.22).nominal),
      nodes: [
        { t: 0.28, label: 'First 10x Run',  val: fmt(project(0.22,false,0.28).nominal), hover: riskTolerance > 75 ? 'Your risk appetite (' + riskTolerance + '/100) is built for this. Early mid-caps + sectoral bets can fuel 22% CAGR.' : 'Warning: risk score (' + riskTolerance + '/100) is low for this path. Expect brutal 50-60% drawdowns. Emotional discipline is everything.' },
        { t: 0.60, label: 'The 60% Crash',  val: fmt(project(0.22,false,0.60).nominal * 0.4), hover: 'Bear market wipes 60% of market value. If you maintain ₹' + sipK + 'K/mo here and do not panic-sell, you outpace every investor who does in 18 months.' },
        { t: 1.00, label: 'Generational',   val: fmt(project(0.22).nominal), hover: 'Corpus breached target years early. The compounding curve has gone vertical. Annual 4% withdrawal now exceeds your peak salary.' },
      ]
    },
    {
      id: 'venture', label: 'Venture Mode', icon: '💎', color: T.yellow, pathY: 175, cagr: '+18%',
      netWorth: fmt(project(0.18).nominal),
      nodes: [
        { t: 0.30, label: 'Angel Round',    val: fmt(project(0.18,false,0.30).nominal), hover: 'Deploying 10% of corpus into early-stage startups via a syndicate alongside your SIPs. High variance, but historically 18%+ blended CAGR for disciplined angel investors.' },
        { t: 0.62, label: 'Series B Exit',  val: fmt(project(0.18,false,0.62).nominal), hover: 'One portfolio company exits at 8x. This single event could compress your retirement timeline by 4 years without changing your monthly SIP at all.' },
        { t: 1.00, label: 'Founder Corpus', val: fmt(project(0.18).nominal), hover: 'Founder-grade wealth without founding a company. Diversified venture bets plus equity SIPs equals an outsized, compounding outcome.' },
      ]
    },
    {
      id: 'aggressive', label: 'Aggressive', icon: '⚡', color: T.orange, pathY: 295, cagr: '+16%',
      netWorth: fmt(project(0.16).nominal),
      nodes: [
        { t: 0.35, label: 'Momentum Phase', val: fmt(project(0.16,false,0.35).nominal), hover: 'Equity compounding is accelerating. Your ₹' + sipK + 'K/mo is buying more units on every dip. Keep it automated and ignore market headlines.' },
        { t: 0.68, label: 'Risk Pivot',     val: fmt(project(0.16,false,0.68).nominal), hover: 'Age ' + Math.floor(currentAge + yrs * 0.68) + '. Shift 15-20% allocation to debt instruments. Locks in gains and reduces sequence-of-returns risk as you approach the finish.' },
        { t: 1.00, label: 'FIRE Achieved',  val: fmt(project(0.16).nominal), hover: 'Financial Independence achieved at Age ' + (retirementAge - 2) + '. The 4% annual withdrawal rule now outpaces your full burn rate comfortably.' },
      ]
    },
    {
      id: 'balanced', label: 'Balanced', icon: '⚖️', color: T.cyan, pathY: 350, cagr: '+11%', isMiddle: true,
      netWorth: fmt(project(0.11).nominal),
      nodes: [
        { t: 0.38, label: 'Steady Base',    val: fmt(project(0.11,false,0.38).nominal), hover: '60/40 equity-debt split performing flawlessly. Real growth at ' + Math.max(0, 11 - inflationGuard).toFixed(1) + '% over inflation. Boring wins the long game.' },
        { t: 0.72, label: 'Rebalance+',     val: fmt(project(0.11,false,0.72).nominal), hover: 'Quarterly rebalancing — selling winners, buying laggards — mechanically adds ~1.2% extra CAGR free of emotion and market timing.' },
        { t: 1.00, label: 'Target Retire',  val: fmt(project(0.11).nominal), hover: 'Retirement Age ' + retirementAge + ' fully locked in. Lifestyle expenses, medical corpus and education fund are all accounted for and fully funded.' },
      ]
    },
    {
      id: 'coast', label: 'Coast FIRE', icon: '🏝️', color: T.green, pathY: 430, cagr: '+12%',
      netWorth: fmt(project(0.12,true).nominal),
      nodes: [
        { t: 0.42, label: 'Heavy Lifting',  val: fmt(project(0.12,true,0.42).nominal), hover: 'Frontloading ₹' + sipK + 'K/mo aggressively now so your future self can downshift guilt-free. Front-heavy investing is mathematically optimal.' },
        { t: 0.72, label: 'SIP to Zero',    val: fmt(project(0.12,true,0.72).nominal), hover: 'Coast number hit at Age ' + midAge + '! You dropped your SIP to ₹0 and shifted to a lower-stress career. Compounding does the rest autonomously.' },
        { t: 1.00, label: 'Stress-Free',    val: fmt(project(0.12,true).nominal), hover: 'Same retirement outcome as Aggressive — but you actually enjoyed the last decade instead of grinding through it. Time is not redeemable.' },
      ]
    },
    {
      id: 'conservative', label: 'Conservative', icon: '🛡️', color: T.accent2, pathY: 525, cagr: '+7%',
      netWorth: fmt(project(0.07).nominal),
      nodes: [
        { t: 0.30, label: 'Capital Safe',   val: fmt(project(0.07,false,0.30).nominal), hover: 'Zero volatility, but at ' + inflationGuard + '% inflation, real return is only ' + Math.max(0, 7 - inflationGuard) + '%. That is barely above cash in real terms.' },
        { t: 0.62, label: 'Debt Shield',    val: fmt(project(0.07,false,0.62).nominal), hover: 'Global markets crash 30% but your portfolio barely flinches. That psychological stability has compounding value — it prevents panic redemptions.' },
        { t: 1.00, label: 'Safe Harbor',    val: fmt(project(0.07).nominal), hover: '100% success probability, but requires maintaining ₹' + sipK + 'K/mo for the full ' + yrs + '-year runway without any interruption.' },
      ]
    },
    {
      id: 'fdonly', label: 'FD Only', icon: '🏦', color: T.blue2, pathY: 635, cagr: '+5%',
      netWorth: fmt(project(0.05).nominal),
      nodes: [
        { t: 0.35, label: 'FD Ladder',      val: fmt(project(0.05,false,0.35).nominal), hover: 'Staggering FDs across 1, 3, 5-year maturities gives liquidity while maximising rate. But at ' + inflationGuard + '% inflation, real growth is approaching zero.' },
        { t: 0.65, label: 'Real Gap Opens', val: fmt(project(0.05,false,0.65).nominal * 0.75), hover: 'Inflation has now eroded ' + Math.round(inflationGuard * 1.9) + '% of purchasing power. Your nominal corpus looks healthy. In real terms, it is not.' },
        { t: 1.00, label: 'Nominal Safety', val: fmt(project(0.05).nominal), hover: 'Guaranteed return, guaranteed underperformance. At ' + inflationGuard + '% inflation vs 5% return, you lost ' + (inflationGuard - 5) + '% per year in real purchasing power.' },
      ]
    },
  ]
}

const getArthResponse = (scenario, sip, retAge, inf, risk, trigger) => {
  const sipK = Math.round(sip / 1000)
  const sipUp = Math.round(sip * 1.2 / 1000)
  const yrs = retAge - 28
  if (inf >= 10 && risk < 30) return '"Alert: ' + inf + '% inflation is silently destroying purchasing power. Every rupee in cash loses ' + (inf - 5).toFixed(1) + '% real value annually. Even a conservative equity tilt outperforms this."'
  if (sip >= 100000 && retAge < 50) return '"Aggressive Capital Deployment. At ₹' + sipK + 'K/mo you are buying decades of freedom. Continue this intensity for 5 more years before easing. The math strongly favours it."'
  if (sip < 8000 && retAge < 52) return '"₹' + sipK + 'K/mo is a start, not a strategy. Retiring by ' + retAge + ' requires either a significant SIP step-up or a high-CAGR vehicle. Try automating a 15% annual SIP increase first."'
  if (risk > 85 && scenario === 'conservative') return '"Contradiction detected: High risk tolerance (' + risk + '/100) on a Conservative path. You have the temperament for Aggressive but the allocation of a near-retiree. This mismatch costs you compounding years."'
  const matrix = {
    moonshot: [
      '"This path assumes 20%+ CAGR via alt-assets and concentrated equity bets. Volatility will be violent. Keep your emergency fund at 6 months liquid — untouched under any scenario."',
      '"High risk, exponential reward. If this CAGR holds, you shave nearly a decade off your working life. The critical variable: staying invested through the inevitable 40-60% drawdown."',
      '"The Moonshot path works best if started before Age 32. You have the time to recover from crashes. At 22% CAGR, the corpus at Year 20 is nearly incomprehensible versus what linear thinking suggests."',
      '"Increasing SIP from ₹' + sipK + 'K to ₹' + sipUp + 'K locks in the Moonshot outcome even if CAGR dips to 18%. The SIP buffer matters more than the headline return rate."',
      '"Moonshot is not reckless if structured right: 60% Nifty 50 index as ballast, 40% in high-beta mid-caps. This blend has historically delivered 18-22% CAGR in India over 15-year windows."',
    ],
    venture: [
      '"Venture Mode means treating 10-15% of your portfolio like a startup fund. The expected value is positive but the distribution is wide. One 10x exit can make the entire path arithmetic work."',
      '"Angel investing alongside SIPs is the hidden path of India emerging HNI class. Key: join a syndicate, not solo. Diversify across 8-12 startups at ₹2-5L each per year."',
      '"At ₹' + sipK + 'K/mo SIP plus selective angel bets, your effective CAGR blend could reach 16-18%. The variance is high but the asymmetric upside cannot be replicated by equity-only allocation."',
      '"Venture Mode requires patience and network. The average startup takes 7-10 years to exit. Build your deal flow now, even if the first cheques are small. Access compounds like capital does."',
      '"If you are in a high-growth industry, consider ESOPs plus angel bets as your Venture allocation. They are illiquid, but equity in companies you understand has historically been your 30s best-performing asset."',
    ],
    aggressive: [
      '"The sweet spot for wealth generation. Heavy equity exposure optimised for compound growth. Nifty 50 plus mid-cap blend historically returns 14-17% over any 12-year period in India."',
      '"Keep SIPs automated and ignore daily market news. The entire edge of an aggressive investor is emotional discipline, not stock-picking skill or market timing."',
      '"At ₹' + sipK + 'K/mo, you cross ₹1 Cr approximately ' + Math.max(5, yrs - 12) + ' years from now. After that, compounding accelerates — each year adds more than the last 3 combined."',
      '"Aggressive investors should rebalance annually, not quarterly. Over-trading kills CAGR through friction costs and tax drag. Set the allocation, check it once a year, and leave it."',
      '"A 15% annual SIP step-up on Aggressive turns ₹' + sipK + 'K/mo into ₹' + Math.round(sipK * Math.pow(1.15, 5)) + 'K/mo in 5 years — without feeling it monthly."',
      '"The Aggressive path enemy is not market volatility. It is career interruption. Build a 6-month liquid buffer so a job loss never forces you to redeem equity at a market bottom."',
    ],
    balanced: [
      '"The optimal risk-adjusted path. You sacrifice the highest absolute returns for the ability to stay invested through crashes — which prevents the panic-selling that destroys most aggressive investors."',
      '"With ' + inf + '% inflation, Balanced real growth is ' + Math.max(0, 11 - inf).toFixed(1) + '%. This is the minimum required to genuinely build wealth rather than just preserve it."',
      '"Balanced investors win not by picking the best years, but by surviving the worst ones. The 60/40 split cuts drawdowns to 15-20% vs 35-45% for Aggressive — and lets you buy aggressively at market lows."',
      '"Quarterly rebalancing on Balanced mechanically buys equity after crashes and trims after rallies. Disciplined and automatic. Adds roughly 1.2% extra CAGR over a 20-year horizon."',
      '"At ₹' + sipK + 'K/mo on Balanced, a 10% annual SIP step-up gets you to ₹' + Math.round(sipK * Math.pow(1.1, 8)) + 'K/mo in 8 years. That single habit closes 70% of the gap to Aggressive."',
      '"For most investors with families, EMIs and career uncertainty, Balanced is the mathematically correct choice. The Aggressive CAGR is seductive, but execution requires a clean financial balance sheet."',
    ],
    coast: [
      '"The psychological hack of Coast FIRE: push hard now so your future self has choices. By Age ' + Math.floor(28 + yrs * 0.55) + ', you can drop your SIP to zero and still retire on schedule."',
      '"Coast FIRE front-loads the sacrifice so the back half of your career becomes optional. At ₹' + sipK + 'K/mo invested heavily in your 30s, compounding becomes your employee — working when you do not."',
      '"For people who value time and autonomy over maximum wealth, Coast FIRE is the most rational path. Same corpus as Aggressive, but a decade of lower-stress work in between."',
      '"The coast calculation: hit your coast number, then reduce SIP to zero. Your ₹' + sipK + 'K/mo hits that number in approximately ' + Math.max(3, Math.round(yrs * 0.45)) + ' years at current CAGR."',
      '"Switching to Coast at the right moment is a career decision as much as a financial one. The corpus you build in the first half does the compounding. The second half is lived, not invested."',
    ],
    conservative: [
      '"Capital preservation mode. At ' + inf + '% inflation vs 7% return, real growth is only ' + Math.max(0, 7 - inf) + '% per year. You must step up SIPs over time or the real corpus shrinks relative to your lifestyle."',
      '"Recommended if you have a major liquidity event in the next 12-36 months. Conservative is a parking strategy — not a wealth strategy for a 15-year compounding horizon."',
      '"Conservative investors often win in the long run simply by not losing. The critical risk is not volatility — it is outliving your corpus due to inflation erosion over a 25-year retirement."',
      '"A simple upgrade: add a 20% allocation to Nifty 50 index funds. Volatility barely increases, but CAGR jumps from 7% to approximately 9%. Low effort, high long-term impact."',
      '"If you are on Conservative due to a recent income disruption, that is rational. Set a review trigger: when your liquid buffer exceeds 9 months, shift 20% to Balanced. Do not stay Conservative by inertia."',
    ],
    fdonly: [
      '"FD-only is capital preservation, not wealth creation. At ' + inf + '% inflation vs 5% FD return, your real loss is ' + Math.max(0, inf - 5) + '% per year. Over 20 years this meaningfully halves purchasing power."',
      '"The only scenario where FD-only is rational: capital needed within 18 months. Beyond that, even a conservative mutual fund ladder outperforms after tax and inflation adjustment."',
      '"FD returns are fully taxable at your income slab. At 30% tax, a 7% FD becomes 4.9% post-tax. Against ' + inf + '% inflation, real return is ' + (4.9 - inf).toFixed(1) + '%. That number should be alarming."',
      '"A low-risk upgrade: replace half your FD corpus with SCSS or RBI Floating Rate Bonds at 8%+. Same principal safety, meaningfully higher return, minimal added complexity."',
      '"FD investors who add even a 10% Nifty Next 50 allocation have historically improved 10-year returns by 2.5-3% with minimal added volatility. The diversification benefit is mathematically compelling."',
    ],
  }
  const pool = matrix[scenario] || matrix.balanced
  return pool[trigger % pool.length]
}

function Lever({ label, min, max, value, onChange, formatValue, color }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: T.textMuted, fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 800, color: T.textMain, fontFamily: 'Space Grotesk, sans-serif' }}>{formatValue(value)}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', height: '4px', borderRadius: '4px', appearance: 'none', outline: 'none', cursor: 'pointer', background: 'linear-gradient(to right, ' + color + ' ' + pct + '%, ' + T.border + ' ' + pct + '%)' }} />
    </div>
  )
}

function NodeTooltip({ node, color, flipDown }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: flipDown ? -8 : 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', top: flipDown ? '22px' : '-144px', left: '50%', transform: 'translateX(-50%)', width: '240px', background: 'rgba(14,11,14,0.98)', backdropFilter: 'blur(14px)', border: '1px solid ' + color, borderRadius: '12px', padding: '13px 14px', zIndex: 9999, boxShadow: '0 10px 36px rgba(0,0,0,0.85), 0 0 22px ' + color + '44', pointerEvents: 'none' }}
    >
      <div style={{ fontSize: '9px', fontWeight: 800, color: color, fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '5px' }}>{node.label}</div>
      <div style={{ fontSize: '17px', fontWeight: 900, color: T.textMain, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em', marginBottom: '6px' }}>{node.val}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif', lineHeight: 1.55 }}>{node.hover}</div>
      {flipDown
        ? <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', background: 'rgba(14,11,14,0.98)', borderTop: '1px solid ' + color, borderLeft: '1px solid ' + color }} />
        : <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', background: 'rgba(14,11,14,0.98)', borderBottom: '1px solid ' + color, borderRight: '1px solid ' + color }} />
      }
    </motion.div>
  )
}

function PageJump({ navigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button whileHover={{ borderColor: T.cyan, color: T.cyan }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid ' + T.border, color: T.textMuted, fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
      >⌘ Jump <span style={{ fontSize: '10px', opacity: 0.5 }}>{open ? '▲' : '▼'}</span></motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: T.surface, border: '1px solid ' + T.border, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
          >
            {PAGES.map((p, i) => (
              <motion.div key={p.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: T.cyan }}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: T.textMuted, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', borderBottom: i < PAGES.length - 1 ? '1px solid ' + T.border : 'none', transition: 'all 0.15s' }}
              >{p.label}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const bezier = (t, p0, p1, p2, p3) => {
  const u = 1 - t
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3
}

export default function WhatIfEngine() {
  const navigate = useNavigate()
  const [activeScenario, setActiveScenario] = useState('balanced')
  const [hoveredNode, setHoveredNode] = useState(null)
  const [arthTrigger, setArthTrigger] = useState(0)
  const [sipAmount, setSipAmount] = useState(25000)
  const [retirementAge, setRetirementAge] = useState(55)
  const [inflationGuard, setInflationGuard] = useState(6)
  const [riskTolerance, setRiskTolerance] = useState(50)

  const scenarios = computeScenarios({ sipAmount, retirementAge, inflationGuard, riskTolerance })

  useEffect(() => {
    const t = setTimeout(() => setArthTrigger(n => n + 1), 400)
    return () => clearTimeout(t)
  }, [sipAmount, retirementAge, inflationGuard, riskTolerance, activeScenario])

  const arthText = getArthResponse(activeScenario, sipAmount, retirementAge, inflationGuard, riskTolerance, arthTrigger)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)
  const twRef = useRef(null)
  useEffect(() => {
    clearInterval(twRef.current)
    setDisplayed(''); setTyping(true)
    let i = 0
    twRef.current = setInterval(() => {
      i++
      if (i <= arthText.length) setDisplayed(arthText.slice(0, i))
      else { setTyping(false); clearInterval(twRef.current) }
    }, 14)
    return () => clearInterval(twRef.current)
  }, [arthText])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

  const X0 = 60, Y0 = 350
  const X1 = 380, X2 = 440, X3 = 970

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.textMain, fontFamily: 'Be Vietnam Pro, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:currentColor;cursor:pointer;border:2px solid #010204;box-shadow:0 0 8px currentColor;}
        input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:currentColor;cursor:pointer;border:2px solid #010204;}
        @keyframes blink{0%,100%{opacity:0.5}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(' + T.border + ' 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(0,123,227,0.1) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* TOP NAV */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(1,2,4,0.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid ' + T.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '64px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, ' + T.accent + ', ' + T.accent2 + ')', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px' }}>Fin<span style={{ color: T.cyan }}>GPS</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(14,11,14,0.7)', borderRadius: '10px', padding: '4px', border: '1px solid ' + T.border }}>
          {[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Roadmap', path: '/roadmap' }, { label: 'Talk to ARTH', path: '/chat' }].map(item => (
            <motion.button key={item.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: T.cyan }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate(item.path)}
              style={{ padding: '7px 15px', borderRadius: '7px', background: 'transparent', border: 'none', color: T.textMuted, fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
            >{item.label}</motion.button>
          ))}
          <div style={{ padding: '7px 15px', borderRadius: '7px', background: 'rgba(149,215,228,0.1)', color: T.cyan, fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', borderBottom: '2px solid ' + T.cyan }}>What-If</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <PageJump navigate={navigate} />
          <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
          >Log Out</motion.button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, ' + T.accent2 + ', ' + T.accent + ')', border: '2px solid rgba(149,215,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>P</div>
        </div>
      </nav>

      {/* SIDE PANEL */}
      <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{ position: 'fixed', left: 0, top: '64px', bottom: 0, width: '260px', background: T.surface, borderRight: '1px solid ' + T.border, padding: '22px 18px', zIndex: 40, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
      >
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 900, color: T.cyan, margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>Timeline<br/>Setup</h2>
          <p style={{ fontSize: '9px', color: T.textMuted, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '6px' }}>Adjust Levers · Shift Reality</p>
        </div>
        <div style={{ flex: 1 }}>
          <Lever label="SIP Investment"    min={5000}  max={200000} value={sipAmount}      onChange={setSipAmount}      formatValue={v => '₹' + (v/1000).toFixed(0) + 'K/mo'}       color={T.cyan} />
          <Lever label="Target Retire Age" min={40}    max={70}     value={retirementAge}  onChange={setRetirementAge}  formatValue={v => v + ' yrs'}                                color={T.purple} />
          <Lever label="Inflation Guard"   min={2}     max={15}     value={inflationGuard} onChange={setInflationGuard} formatValue={v => v + '%'}                                   color={T.orange} />
          <Lever label="Risk Tolerance"    min={0}     max={100}    value={riskTolerance}  onChange={setRiskTolerance}  formatValue={v => v <= 33 ? 'Low' : v <= 66 ? 'Med' : 'High'} color={T.pink} />
        </div>
        <div style={{ borderTop: '1px solid ' + T.border, paddingTop: '16px', marginTop: '8px' }}>
          <div style={{ fontSize: '9px', color: T.textMuted, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Multiverse Path</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {scenarios.map(sc => (
              <motion.div key={sc.id} onClick={() => setActiveScenario(sc.id)} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 11px', borderRadius: '8px', cursor: 'pointer', background: activeScenario === sc.id ? sc.color + '18' : 'transparent', border: '1px solid ' + (activeScenario === sc.id ? sc.color + '55' : 'transparent'), transition: 'all 0.18s' }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px' }}>{sc.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk', color: activeScenario === sc.id ? sc.color : T.textMuted }}>{sc.label}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Space Grotesk', color: activeScenario === sc.id ? T.textMain : T.textMuted }}>{sc.netWorth}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main style={{ marginLeft: '260px', paddingTop: '80px', paddingRight: '20px', paddingBottom: '20px', height: '100vh', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '34px', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>Branching Futures</h1>
            <p style={{ color: T.textMuted, fontSize: '12px', fontFamily: 'Inter, sans-serif', margin: '4px 0 0' }}>Hover nodes to inspect each timeline. Click path or sidebar to activate.</p>
          </div>
          <div style={{ textAlign: 'right', background: T.surface, border: '1px solid ' + T.border, padding: '12px 20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '9px', color: T.textMuted, fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {scenarios.find(s => s.id === activeScenario)?.label} Corpus
            </div>
            <motion.div key={sipAmount + retirementAge + activeScenario} initial={{ scale: 1.08, color: T.green }} animate={{ scale: 1, color: T.cyan }} transition={{ duration: 0.4 }}
              style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'Space Grotesk', marginTop: '2px' }}
            >{scenarios.find(s => s.id === activeScenario)?.netWorth}</motion.div>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 185px)', background: 'rgba(3,5,15,0.45)', borderRadius: '18px', border: '1px solid ' + T.border, overflow: 'visible' }}>

          {/* ARTH panel — z:50 so bottom branch tooltips go under it, top branch tooltips go over it naturally since they're higher in the DOM via SVG foreignObject */}
          <motion.div key={arthTrigger} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'absolute', top: '20px', left: '20px', width: '310px', background: 'rgba(14,11,14,0.97)', backdropFilter: 'blur(18px)', borderRadius: '14px', border: '1px solid ' + T.border, borderTop: '1px solid rgba(149,215,228,0.3)', padding: '15px', zIndex: 50, boxShadow: '0 20px 48px rgba(0,0,0,0.6)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
              <motion.div animate={{ boxShadow: ['0 0 8px ' + T.cyan + '66', '0 0 18px ' + T.cyan + 'cc', '0 0 8px ' + T.cyan + '66'] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, ' + T.cyan + ', ' + T.accent + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}
              >✦</motion.div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: T.cyan, fontFamily: 'Space Grotesk', letterSpacing: '0.06em' }}>ARTH LIVE ANALYSIS</div>
                <div style={{ fontSize: '8px', color: T.textMuted, fontFamily: 'Space Grotesk', letterSpacing: '0.1em' }}>{typing ? '● Simulating...' : '✓ Ready'}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: typing ? T.orange : T.green, boxShadow: '0 0 7px ' + (typing ? T.orange : T.green), animation: 'pulse 1s ease infinite' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', fontFamily: 'Inter', lineHeight: 1.65, minHeight: '54px', fontStyle: 'italic' }}>
              {displayed}{typing && <span style={{ opacity: 0.5, animation: 'blink 0.8s step-end infinite' }}>|</span>}
            </div>
          </motion.div>

          <svg width="100%" height="100%" viewBox="0 0 1020 700" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              {scenarios.map(sc => (
                <filter key={sc.id} id={'gf_' + sc.id}>
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              ))}
              <filter id="gf_strong">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Origin */}
            <motion.circle cx={X0} cy={Y0} r={10} fill={T.cyan} filter="url(#gf_strong)"
              animate={{ r: [10, 13, 10] }} transition={{ duration: 2.5, repeat: Infinity }}
            />
            <text x={X0} y={Y0 + 24} fill={T.textMuted} fontSize="8" fontFamily="Space Grotesk, sans-serif" fontWeight="700" textAnchor="middle" letterSpacing="0.12em">PRESENT</text>

            {scenarios.map((sc) => {
              const isActive = activeScenario === sc.id
              const d = 'M ' + X0 + ' ' + Y0 + ' C ' + X1 + ' ' + Y0 + ', ' + X2 + ' ' + sc.pathY + ', ' + X3 + ' ' + sc.pathY
              // Balanced gets SAME treatment as others — all paths glow when active
              const glowFilter = isActive ? 'url(#gf_strong)' : 'url(#gf_' + sc.id + ')'

              return (
                <g key={sc.id}>
                  {/* Thick glow copy — makes path visible and glowing */}
                  <motion.path d={d} fill="none" stroke={sc.color}
                    strokeWidth={isActive ? 9 : 4}
                    strokeLinecap="round"
                    filter={glowFilter}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isActive ? 0.65 : 0.1 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                  />
                  {/* Main crisp path */}
                  <motion.path d={d} fill="none" stroke={sc.color}
                    strokeWidth={isActive ? 4 : 2}
                    strokeLinecap="round"
                    strokeDasharray={isActive ? 'none' : '7 5'}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isActive ? 1 : 0.18 }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.05 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveScenario(sc.id)}
                  />

                  {/* Nodes */}
                  {sc.nodes.map((node, i) => {
                    const nx = bezier(node.t, X0, X1, X2, X3)
                    const ny = bezier(node.t, Y0, Y0, sc.pathY, sc.pathY)
                    const nk = sc.id + '-' + i
                    const isH = hoveredNode === nk
                    // Top 3 branches (moonshot, venture, aggressive) have pathY < 300 → flip tooltip DOWN
                    const flipDown = sc.pathY < 300

                    return (
                      <g key={i} onMouseEnter={() => setHoveredNode(nk)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
                        {isActive && (
                          <motion.circle cx={nx} cy={ny} r={16} fill="none" stroke={sc.color} strokeWidth="1"
                            animate={{ r: isH ? 20 : 16, opacity: isH ? 0.5 : 0.22 }} transition={{ duration: 0.2 }}
                          />
                        )}
                        <motion.circle cx={nx} cy={ny}
                          r={isActive ? 8 : 5}
                          fill={isH && isActive ? sc.color : T.bg}
                          stroke={sc.color}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          filter={isActive ? 'url(#gf_' + sc.id + ')' : 'none'}
                          animate={{ r: isH && isActive ? 11 : isActive ? 8 : 5 }}
                          transition={{ duration: 0.18 }}
                        />
                        {isActive && !isH && (
                          <text x={nx} y={flipDown ? ny - 16 : ny + 22}
                            fill={T.textMuted} fontSize="9" fontFamily="Space Grotesk, sans-serif"
                            textAnchor="middle" fontWeight="700"
                          >{node.label}</text>
                        )}
                        <AnimatePresence>
                          {isH && isActive && (
                            <foreignObject x={nx - 120} y={flipDown ? ny + 14 : ny - 144} width="240" height="144" style={{ overflow: 'visible' }}>
                              <NodeTooltip node={node} color={sc.color} flipDown={flipDown} />
                            </foreignObject>
                          )}
                        </AnimatePresence>
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>
        </div>
      </main>
    </div>
  )
}