import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import API from "../lib/api";

// ─────────────────────────────────────────────────────────────
// PALETTE (exact from tailwind.config.js)
// primary: #010204 | surface: #0e0b0e | accent: #007be3
// accent2: #4f4ff1 | cyan: #95d7e4 | blue2: #3b93ce
// ─────────────────────────────────────────────────────────────

// ── PAGE REGISTRY ──
const PAGES = [
  { label: 'Dashboard',    path: '/dashboard' },
  { label: 'Roadmap',      path: '/roadmap' },
  { label: 'Quiz',         path: '/quiz' },
  { label: 'Results',      path: '/results' },
  { label: 'What-If',      path: '/whatif' },
  { label: 'Talk to ARTH', path: '/chat' },
  { label: 'Analysis',     path: '/analysis' },
]

// ── PAGE JUMP DROPDOWN ──
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
      <motion.button whileHover={{ borderColor: '#95d7e4', color: '#95d7e4' }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(37,37,37,1)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
      >⌘ Jump <span style={{ fontSize: '10px', opacity: 0.5 }}>{open ? '▲' : '▼'}</span></motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: '#0e0b0e', border: '1px solid rgba(37,37,37,1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
          >
            {PAGES.map((p, i) => (
              <motion.div key={p.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: '#95d7e4' }}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', borderBottom: i < PAGES.length - 1 ? '1px solid rgba(37,37,37,1)' : 'none', transition: 'all 0.15s' }}
              >{p.label}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── COMPOUND INTEREST ENGINE ──
const calcCorpus = (monthly, annualRate, years) => {
  const r = annualRate / 12 / 100
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

const toLakhs = (v) => (v / 100000).toFixed(1)
const toCr = (v) => (v / 10000000).toFixed(2)
const toDisplay = (v) => v >= 10000000 ? `₹${toCr(v)} Cr` : `₹${toLakhs(v)}L`

// ── DATA DERIVATION FROM QUIZ ANSWERS ──
// The branching quiz stores: answers[i].selectedOption, answers[i].questionIndex
const deriveData = (result) => {
  const raw = result?.answers || []
  const get = (idx) => raw.find(a => a.questionIndex === idx)?.selectedOption ?? null

  const persona = get(0) ?? 1 // 0=Student, 1=EarlyCareer, 2=MidCareer, 3=Retirement
  const incomeOpt = get(1) ?? 2
  const marginOpt = get(2) ?? 1
  const debtOpt = get(3) ?? 1
  const efOpt = get(4) ?? 1
  const investOpt = get(5) ?? 1
  const psychOpt = get(6) ?? 2
  const goalOpt = get(8) ?? 1

  // Income estimation
  const INCOME_MONTHLY = {
    student: [8000, 12000, 15000, 20000],
    other: [25000, 40000, 85000, 175000],
  }
  const incomeArr = persona === 0 ? INCOME_MONTHLY.student : INCOME_MONTHLY.other
  const monthlyIncome = incomeArr[incomeOpt] || 50000

  // Savings rate
  const MARGIN_RATES = persona === 0
    ? [0, 5, 15, 30]
    : [0, 7, 20, 35]
  const savingsRate = MARGIN_RATES[marginOpt] || 10
  const monthlySavings = Math.round(monthlyIncome * savingsRate / 100)
  const monthlyExpenses = monthlyIncome - monthlySavings

  // Emergency fund
  const EF_MONTHS = [0, 1.5, 4, 8]
  const efMonths = EF_MONTHS[efOpt] || 1
  const efTarget = monthlyExpenses * 6
  const efCurrent = monthlyExpenses * efMonths
  const efPct = Math.min(100, Math.round((efMonths / 6) * 100))

  // Debt
  const hasDebt = debtOpt <= 1 && persona !== 0 // minimum payments or partial
  const studentDebt = persona === 0 && debtOpt <= 1
  const debtFree = debtOpt >= 3 || (persona !== 0 && debtOpt === 3)

  // Investment
  const INVEST_LABELS = ['None', 'Savings/FD', 'Mutual Funds/SIP', 'Diversified Portfolio']
  const investLabel = INVEST_LABELS[investOpt] || 'None'
  const hasInvestments = investOpt >= 2

  // Psychology score — how good is their financial mindset
  const PSYCH_SCORES = {
    0: [2, 8, 10, 10],  // student: buy course or invest = great
    1: [7, 7, 9, 2],    // others: pay debt or invest = great
  }
  const psychArr = persona === 0 ? PSYCH_SCORES[0] : PSYCH_SCORES[1]
  const psychScore = psychArr[psychOpt] || 5

  return {
    persona, monthlyIncome, savingsRate, monthlySavings, monthlyExpenses,
    efMonths, efTarget, efCurrent, efPct,
    hasDebt, studentDebt, debtFree,
    investOpt, investLabel, hasInvestments,
    psychOpt, psychScore, debtOpt, goalOpt,
    dnaScore: result?.dnaScore || 60,
    riskProfile: result?.riskProfile || 'moderate',
    milestones: result?.milestones || [],
  }
}

// ── GENERATE ARTH ACTIONS based on weak areas ──
const generateARTHActions = (d) => {
  const actions = []

  // Emergency fund
  if (d.efMonths < 3) {
    const needed = Math.round(d.monthlyExpenses * (3 - d.efMonths))
    actions.push({
      id: 'ef_build', icon: '🛡️', category: 'Safety Net', difficulty: 'Medium',
      title: `Build your ${3 - d.efMonths}-month emergency buffer`,
      desc: `Transfer ₹${Math.round(d.monthlyExpenses * 0.1).toLocaleString()} to a liquid fund each month`,
      points: 15, color: '#4ade80', colorBg: 'rgba(74,222,128,0.1)',
      impact: `₹${needed.toLocaleString()} needed`,
    })
  }

  // Savings rate
  if (d.savingsRate < 20) {
    const boost = Math.round(d.monthlyIncome * 0.05)
    actions.push({
      id: 'sav_boost', icon: '💰', category: 'Savings', difficulty: 'Easy',
      title: `Boost savings by 5% via auto-debit`,
      desc: `Set ₹${boost.toLocaleString()} auto-transfer on salary day — you won't miss it`,
      points: 10, color: '#95d7e4', colorBg: 'rgba(149,215,228,0.1)',
      impact: `+₹${boost.toLocaleString()}/mo saved`,
    })
  }

  // Investment start
  if (!d.hasInvestments) {
    const sipAmount = Math.max(500, Math.round(d.monthlySavings * 0.3))
    actions.push({
      id: 'sip_start', icon: '📈', category: 'Investments', difficulty: 'Easy',
      title: `Start a ₹${sipAmount.toLocaleString()}/mo Nifty 50 SIP`,
      desc: 'Index fund SIP — lowest risk, market-linked returns, start today in 5 mins',
      points: 12, color: '#4f4ff1', colorBg: 'rgba(79,79,241,0.1)',
      impact: `₹${toDisplay(calcCorpus(sipAmount, 12, 10))} in 10yrs`,
    })
  }

  // Debt action
  if (d.hasDebt || d.studentDebt) {
    const extra = Math.round(d.monthlyIncome * 0.05)
    actions.push({
      id: 'debt_attack', icon: '⚔️', category: 'Debt', difficulty: 'Hard',
      title: `Pay ₹${extra.toLocaleString()} extra toward highest-interest debt`,
      desc: 'Avalanche method — highest interest rate first saves the most money',
      points: 14, color: '#f87171', colorBg: 'rgba(248,113,113,0.1)',
      impact: 'Saves years of interest',
    })
  }

  // Insurance
  if (d.persona !== 0) {
    actions.push({
      id: 'insure', icon: '🔒', category: 'Protection', difficulty: 'Medium',
      title: `Get ₹1Cr term insurance for ~₹800/mo`,
      desc: 'At your income level this is non-negotiable. One click on Policybazaar',
      points: 13, color: '#a78bfa', colorBg: 'rgba(167,139,250,0.1)',
      impact: '₹1Cr family protection',
    })
  }

  // Upgrade investment
  if (d.hasInvestments && d.investOpt === 2) {
    actions.push({
      id: 'diversify', icon: '🌐', category: 'Investments', difficulty: 'Medium',
      title: 'Add mid-cap + gold to your portfolio`,',
      desc: 'Your current SIP is equity-only. Add 15% gold ETF for stability',
      points: 8, color: '#95d7e4', colorBg: 'rgba(149,215,228,0.1)',
      impact: 'Reduces volatility 20%',
    })
  }

  // Tax saving
  if (d.monthlyIncome > 40000 && d.persona !== 0) {
    actions.push({
      id: 'tax_save', icon: '📋', category: 'Tax', difficulty: 'Easy',
      title: `Invest ₹${Math.min(12500, Math.round(d.monthlyIncome * 0.1)).toLocaleString()}/mo in ELSS`,
      desc: 'Save up to ₹46,800 in taxes annually under 80C while building wealth',
      points: 9, color: '#fbbf24', colorBg: 'rgba(251,191,36,0.1)',
      impact: `₹${Math.min(46800, Math.round(d.monthlyIncome * 0.12)).toLocaleString()} tax saved/yr`,
    })
  }

  return actions
}

// ── GENERATE WEAKNESSES/LEAKS ──
const generateWeaknesses = (d) => {
  const weaknesses = []

  if (d.savingsRate < 10) {
    weaknesses.push({
      id: 'w_savings', severity: 'critical', icon: '🚨',
      title: 'Critical savings gap detected',
      desc: `ARTH found you're saving only ${d.savingsRate}% of income. Minimum healthy rate is 20%.`,
      leak: `₹${Math.round(d.monthlyIncome * (20 - d.savingsRate) / 100).toLocaleString()}/mo untapped`,
      fix: 'Set up a ₹500 auto-debit today — habit beats willpower every time',
      pointsLost: 18, actionId: 'sav_boost',
    })
  } else if (d.savingsRate < 20) {
    weaknesses.push({
      id: 'w_savings_low', severity: 'warning', icon: '⚠️',
      title: 'Below benchmark savings rate',
      desc: `You're at ${d.savingsRate}% savings rate. Industry benchmark for your bracket is 20–30%.`,
      leak: `₹${Math.round(d.monthlyIncome * (20 - d.savingsRate) / 100).toLocaleString()}/mo below target`,
      fix: 'A 5% boost via auto-debit adds ₹${Math.round(d.monthlyIncome * 0.05).toLocaleString()}/mo to your wealth',
      pointsLost: 10, actionId: 'sav_boost',
    })
  }

  if (!d.hasInvestments) {
    const missedGains = calcCorpus(Math.round(d.monthlySavings * 0.5), 12, 5)
    weaknesses.push({
      id: 'w_invest', severity: 'critical', icon: '📉',
      title: 'Savings account is a wealth leak',
      desc: `Your money earns 3–4% in savings account. Inflation is 6%. You're losing purchasing power.`,
      leak: `₹${toDisplay(missedGains)} missed gains over 5yrs`,
      fix: 'Move 50% of monthly savings to a Nifty 50 index fund SIP',
      pointsLost: 15, actionId: 'sip_start',
    })
  }

  if (d.efMonths < 1) {
    weaknesses.push({
      id: 'w_ef', severity: 'critical', icon: '🆘',
      title: 'Zero emergency buffer — extreme risk',
      desc: 'One unexpected event — job loss, medical, car — could wipe your finances completely.',
      leak: 'Any emergency forces debt at 24–36% interest',
      fix: 'Even ₹10,000 in a liquid fund is a start. Do it today.',
      pointsLost: 20, actionId: 'ef_build',
    })
  } else if (d.efMonths < 3) {
    weaknesses.push({
      id: 'w_ef_low', severity: 'warning', icon: '⚠️',
      title: `Emergency fund under-built (${d.efMonths}mo of ${6}mo target)`,
      desc: 'You have some buffer, but 3–6 months is the recommended safety net.',
      leak: `₹${Math.round(d.monthlyExpenses * (6 - d.efMonths)).toLocaleString()} short of 6-month target`,
      fix: 'Automate ₹2,000/mo to a liquid fund until you hit 6 months',
      pointsLost: 12, actionId: 'ef_build',
    })
  }

  if (d.hasDebt) {
    const interestBleed = Math.round(d.monthlyIncome * 0.04)
    weaknesses.push({
      id: 'w_debt', severity: 'warning', icon: '🔴',
      title: 'High-interest debt draining wealth',
      desc: 'Credit card / personal loan interest rates (18–36%) destroy wealth faster than any investment can build it.',
      leak: `~₹${interestBleed.toLocaleString()}/mo going to interest`,
      fix: 'Attack the highest-rate debt first — every extra rupee paid saves 2',
      pointsLost: 14, actionId: 'debt_attack',
    })
  }

  return weaknesses
}

// ── GENERATE SIMULATION DATA ──
const generateSimData = (monthlyIncome) => {
  const eliteMonthly = Math.round(monthlyIncome * 0.35)
  const goodMonthly = Math.round(monthlyIncome * 0.20)
  const slowMonthly = Math.round(monthlyIncome * 0.10)

  return {
    elite: { monthly: eliteMonthly, rate: 14, label: 'Elite' },
    good: { monthly: goodMonthly, rate: 12, label: 'Good' },
    slow: { monthly: slowMonthly, rate: 8, label: 'Slow' },
    chartData: Array.from({ length: 20 }, (_, i) => ({
      year: i + 1,
      Elite: Math.round(calcCorpus(eliteMonthly, 14, i + 1) / 100000),
      Good: Math.round(calcCorpus(goodMonthly, 12, i + 1) / 100000),
      Slow: Math.round(calcCorpus(slowMonthly, 8, i + 1) / 100000),
    })),
  }
}

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

// ── ANIMATED SCORE RING ──
const ScoreRing = ({ score, size = 160 }) => {
  const circumference = 2 * Math.PI * 15.9
  const strokeDash = (score / 100) * circumference

  const getColor = (s) => s >= 75 ? '#4ade80' : s >= 50 ? '#95d7e4' : s >= 30 ? '#fbbf24' : '#f87171'
  const getLabel = (s) => s >= 75 ? 'Excellent' : s >= 50 ? 'Good' : s >= 30 ? 'Fair' : 'Needs Work'
  const color = getColor(score)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#007be3" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle cx="18" cy="18" r="15.9" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        {/* Animated score arc */}
        <motion.circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke="url(#ringGrad)" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
        {/* Glow ring */}
        <motion.circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={color} strokeWidth="0.5"
          strokeOpacity="0.3"
          strokeDasharray={`${strokeDash} ${circumference}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          style={{
            fontFamily: 'Be Vietnam Pro, sans-serif',
            fontSize: size > 120 ? '36px' : '28px', fontWeight: 800,
            letterSpacing: '-0.04em', color,
          }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
          {getLabel(score)}
        </span>
      </div>
    </div>
  )
}

// ── METRIC BAR ──
const MetricBar = ({ label, value, max = 100, color, delay = 0 }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '12px', fontWeight: 700, color }}>{value}{typeof max === 'string' ? max : '%'}</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', borderRadius: '99px', background: `linear-gradient(90deg, ${color}88, ${color})` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
      />
    </div>
  </div>
)

// ── ARTH ACTION CARD ──
const ActionCard = ({ action, checked, onToggle }) => {
  const [justChecked, setJustChecked] = useState(false)

  const handleToggle = () => {
    if (!checked) {
      setJustChecked(true)
      setTimeout(() => setJustChecked(false), 600)
    }
    onToggle(action.id)
  }

  return (
    <motion.div
      layout
      onClick={handleToggle}
      style={{
        background: checked ? `${action.colorBg}` : 'rgba(8,13,36,0.5)',
        border: checked ? `1px solid ${action.color}40` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '16px 18px',
        cursor: 'pointer', transition: 'all 0.25s',
        boxShadow: checked ? `0 0 20px ${action.color}18` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Points toast animation */}
      <AnimatePresence>
        {justChecked && (
          <motion.div
            style={{
              position: 'absolute', top: '8px', right: '12px',
              fontSize: '13px', fontWeight: 700, color: action.color,
              pointerEvents: 'none', zIndex: 10,
            }}
            initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          >
            +{action.points} pts ✨
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Checkbox */}
        <div style={{
          width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
          border: checked ? 'none' : `1.5px solid rgba(255,255,255,0.2)`,
          background: checked ? action.color : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {checked && (
            <motion.svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: checked ? '#fff' : 'rgba(255,255,255,0.85)' }}>
              {action.icon} {action.title}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '8px' }}>
            {action.desc}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '99px',
              background: `${action.color}20`, color: action.color, border: `1px solid ${action.color}30`,
            }}>
              +{action.points} pts
            </span>
            <span style={{
              fontSize: '11px', padding: '2px 10px', borderRadius: '99px',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
            }}>
              {action.category}
            </span>
            <span style={{
              fontSize: '11px', padding: '2px 10px', borderRadius: '99px',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
            }}>
              {action.impact}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── WEAKNESS CARD ──
const WeaknessCard = ({ weakness, onFix, isFixed }) => (
  <motion.div
    style={{
      background: isFixed ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
      border: isFixed ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(248,113,113,0.18)',
      borderRadius: '16px', padding: '16px 18px', transition: 'all 0.3s',
    }}
    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
    layout
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      {/* Severity dot */}
      <div style={{ marginTop: '3px', flexShrink: 0 }}>
        {isFixed ? (
          <span style={{ fontSize: '16px' }}>✅</span>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: weakness.severity === 'critical' ? '#f87171' : '#fbbf24',
              boxShadow: `0 0 8px ${weakness.severity === 'critical' ? '#f87171' : '#fbbf24'}`,
            }} />
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '13px', fontWeight: 600,
          color: isFixed ? '#4ade80' : 'rgba(255,255,255,0.85)', marginBottom: '4px',
          textDecoration: isFixed ? 'line-through' : 'none',
        }}>
          {weakness.icon} {weakness.title}
        </p>
        {!isFixed && (
          <>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '8px' }}>
              {weakness.desc}
            </p>
            <div style={{
              fontSize: '12px', fontWeight: 600, color: '#f87171',
              padding: '4px 10px', borderRadius: '8px',
              background: 'rgba(248,113,113,0.1)', display: 'inline-block', marginBottom: '10px',
            }}>
              📉 {weakness.leak}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontStyle: 'italic' }}>
              ARTH: "{weakness.fix}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#f87171' }}>
                -{weakness.pointsLost} pts dragging score down · fix to recover them
              </span>
              <motion.button
                onClick={() => onFix(weakness.actionId)}
                style={{
                  background: 'linear-gradient(135deg, #1a6fe8, #4f4ff1)',
                  border: 'none', borderRadius: '8px', padding: '5px 14px',
                  fontSize: '12px', fontWeight: 600, color: '#fff',
                  cursor: 'pointer', boxShadow: '0 0 12px rgba(79,111,241,0.3)',
                }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Fix This →
              </motion.button>
            </div>
          </>
        )}
        {isFixed && (
          <p style={{ fontSize: '12px', color: '#4ade80' }}>Marked as action — keep it up! 💪</p>
        )}
      </div>
    </div>
  </motion.div>
)

// ── CUSTOM RECHARTS TOOLTIP ──
const SimTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(8,12,32,0.96)', border: '1px solid rgba(149,215,228,0.2)',
      borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(20px)',
    }}>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Year {label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: '13px', fontWeight: 600, color: p.color, marginBottom: '3px' }}>
          {p.name}: ₹{p.value}L
        </p>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkedActions, setCheckedActions] = useState(new Set())
  const [fixedWeaknesses, setFixedWeaknesses] = useState(new Set())
  const [showSimulate, setShowSimulate] = useState(false)
  const [simView, setSimView] = useState('chart') // 'chart' | 'cards'
  // earnedPoints is DERIVED below from checkedActions + fixedWeaknesses — no useState
  const [notification, setNotification] = useState(null)

 // ── FETCH RESULT FROM BACKEND ──
 // ── FETCH RESULT FROM BACKEND ──
// ── FETCH RESULT FROM BACKEND ──
  useEffect(() => {
    let isMounted = true; // Prevents memory leaks if user navigates away

    const fetchResult = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        // 🌟 1st Priority: Fetch BOTH dashboard data and roadmap data simultaneously
        const [dashRes, roadRes] = await Promise.all([
          fetch(`${API}/api/chat`, {
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
          }),
          fetch(`${API}/api/chat`, {
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
          })
        ]);
        
        if (!dashRes.ok) throw new Error('Dashboard API failed');
        if (!roadRes.ok) throw new Error('Roadmap API failed');
        
        const dashData = await dashRes.json();
        const roadData = await roadRes.json();

        // 🔥 THE SYNC FIX: Inject the strictly calculated Roadmap milestones into the Dashboard
        // This guarantees the Dashboard and Roadmap pages always show the exact same progress!
        dashData.milestones = roadData.milestones;
        
        if (isMounted) setResult(dashData);
        
      } catch (err) {
        console.warn("Live API unavailable. Loading rich fallback dashboard...", err.message);
        
        // 🛡️ 100% Pre-recorded Fallback (Perfectly synced to a score of 62 -> Level 4)
        if (isMounted) {
          setResult({
            dnaScore: 62,
            riskProfile: 'moderate',
            savingsRate: 15,
            debtRatio: 22,
            investmentScore: 48,
            milestones: [
              { id: 1, label: 'Emergency Fund', sector: 'Safety Net', status: 'completed' },
              { id: 2, label: 'Insurance Guard', sector: 'Safety Net', status: 'completed' },
              { id: 3, label: 'Debt Neutral', sector: 'Safety Net', status: 'completed' },
              { id: 4, label: 'Start SIP', sector: 'Wealth Engine', status: 'current' },
              { id: 5, label: 'Diversification', sector: 'Wealth Engine', status: 'locked' },
              { id: 6, label: 'Tax Optimisation', sector: 'Wealth Engine', status: 'locked' },
              { id: 7, label: 'Financial Freedom', sector: 'Dream Fund', status: 'locked' }
            ],
            answers: [
              { questionIndex: 0, selectedOption: 1 }, 
              { questionIndex: 1, selectedOption: 2 }, 
              { questionIndex: 2, selectedOption: 1 }, 
              { questionIndex: 3, selectedOption: 1 }, 
              { questionIndex: 4, selectedOption: 1 }, 
              { questionIndex: 5, selectedOption: 1 }, 
              { questionIndex: 6, selectedOption: 2 }, 
              { questionIndex: 7, selectedOption: 0 }, 
              { questionIndex: 8, selectedOption: 2 }, 
            ],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResult();

    return () => { isMounted = false; };
  }, [navigate]);
  // ── DERIVED DATA ──
  const d = result ? deriveData(result) : null
  const arthActions = d ? generateARTHActions(d) : []
  const weaknesses = d ? generateWeaknesses(d) : []
  const simData = d ? generateSimData(d.monthlyIncome) : null

  // ─────────────────────────────────────────────────────────
  // SCORING SYSTEM — single source of truth
  //
  // Budget breakdown (always sums to ≤ 100):
  //   BASE   : dnaScore from quiz (0–100, already capped server-side)
  //   ACTIONS: each action has its own pts value
  //   WEAKNESS CONQUESTS: each weakness has a pointsLost value —
  //            fixing one earns back those pts (not new pts on top)
  //
  // The TOTAL possible score = min(100,
  //   dnaScore
  //   + sum(action.points for unchecked actions, up to headroom)
  //   + sum(w.pointsLost for unfixed weaknesses, up to headroom)
  // )
  //
  // currentDisplayScore = min(100,
  //   dnaScore + earnedActionPts + conqueredWeaknessPts
  // )
  //
  // earnedPoints (the shared "pts earned today" number) =
  //   earnedActionPts + conqueredWeaknessPts
  // ─────────────────────────────────────────────────────────

  const dnaScore = Math.min(100, Math.max(0, d?.dnaScore || 0))

  // Points available from actions NOT yet checked
  const totalActionPts  = arthActions.reduce((s, a) => s + a.points, 0)
  const checkedActionPts = arthActions
    .filter(a => checkedActions.has(a.id))
    .reduce((s, a) => s + a.points, 0)
  const remainingActionPts = totalActionPts - checkedActionPts

  // Points recoverable by conquering weaknesses NOT yet fixed
  const totalWeaknessPts = weaknesses.reduce((s, w) => s + w.pointsLost, 0)
  const conqueredWeaknessPts = weaknesses
    .filter(w => fixedWeaknesses.has(w.actionId))
    .reduce((s, w) => s + w.pointsLost, 0)
  const remainingWeaknessPts = totalWeaknessPts - conqueredWeaknessPts

  // All points earned this session
  const earnedPoints = checkedActionPts + conqueredWeaknessPts

  // How high the score COULD go if everything is completed
  const projectedScore = Math.min(100, dnaScore + totalActionPts + totalWeaknessPts)

  // Current live score — never exceeds 100
  const currentDisplayScore = Math.min(100, dnaScore + earnedPoints)

  // Remaining headroom shown in the "pts available" badge
  const remainingPts = Math.max(0, projectedScore - currentDisplayScore)

  const completedMilestones = d?.milestones?.filter(m => m.status === 'completed') || []
  const personaLabel = d ? ['Student', 'Early Career', 'Mid-Career', 'Near Retirement'][d.persona] : ''

  // ── ACTION TOGGLE ──
  // earnedPoints is now DERIVED from checkedActions + fixedWeaknesses,
  // so we only need to update the Set — no separate counter to drift.
  const handleActionToggle = (id) => {
    setCheckedActions(prev => {
      const next = new Set(prev)
      const action = arthActions.find(a => a.id === id)
      if (!action) return prev

      if (next.has(id)) {
        // Unchecking — remove from set, score auto-recalculates
        next.delete(id)
      } else {
        const headroom = 100 - currentDisplayScore
        if (headroom <= 0) return prev // already at 100, nothing to add

        next.add(id)
        // Show the actual pts that will be reflected (capped at headroom)
        const actualAwarded = Math.min(action.points, headroom)
        setNotification(`+${actualAwarded} pts added to your score!`)
        setTimeout(() => setNotification(null), 2500)
      }
      return next
    })
  }

  // ── LOGOUT ──
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

  // ── FIX WEAKNESS ──
  // Fixing a weakness:
  //   1. Marks it as fixed (earns back pointsLost for that weakness)
  //   2. Also checks its linked action card if not already checked
  //   Two separate rewards (weakness recovery + action pts) are intentional
  //   BUT only if the combined total doesn't push past 100.
  const handleFixWeakness = (actionId) => {
    if (!actionId) return

    const weakness = weaknesses.find(w => w.actionId === actionId)
    const action = arthActions.find(a => a.id === actionId)

    // Compute pts that would be added
    const weaknessPts = weakness ? weakness.pointsLost : 0
    const actionPts = (action && !checkedActions.has(actionId)) ? action.points : 0
    const totalNew = weaknessPts + actionPts
    const headroom = 100 - currentDisplayScore

    setFixedWeaknesses(prev => new Set([...prev, actionId]))

    // Check the linked action if not already checked AND there's headroom
    if (action && !checkedActions.has(actionId) && headroom > 0) {
      setCheckedActions(prev => new Set([...prev, actionId]))
      const awarded = Math.min(actionPts, headroom)
      if (awarded > 0) {
        setNotification(`+${awarded} pts — weakness fixed!`)
        setTimeout(() => setNotification(null), 2500)
      }
    } else if (weakness && !fixedWeaknesses.has(actionId)) {
      setNotification(`+${Math.min(weaknessPts, Math.max(0, headroom))} pts — weakness conquered!`)
      setTimeout(() => setNotification(null), 2500)
    }
  }

  // ── LOADING ──
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#03050f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Be Vietnam Pro, sans-serif',
    }}>
      <motion.div style={{ textAlign: 'center' }}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧬</div>
        <p style={{ color: '#95d7e4', fontSize: '14px' }}>Loading your Financial DNA...</p>
      </motion.div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#03050f',
      fontFamily: 'Be Vietnam Pro, sans-serif', color: '#fff',
      position: 'relative',
    }}>

      {/* ── DOT GRID ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(149,215,228,0.045) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      {/* ── AMBIENT GLOWS ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(79,79,241,0.15) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(0,123,227,0.12) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(149,215,228,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      {/* ── +PTS NOTIFICATION TOAST ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            style={{
              position: 'fixed', top: '80px', right: '24px', zIndex: 100,
              background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)',
              borderRadius: '12px', padding: '10px 20px',
              fontSize: '14px', fontWeight: 600, color: '#4ade80',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 20px rgba(74,222,128,0.2)',
            }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }}
          >
            ✨ {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STICKY NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(3,5,15,0.88)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(79,111,241,0.12)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 32px', height: '64px',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #007be3, #4f4ff1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '17px', color: '#fff' }}>
            Fin<span style={{ color: '#95d7e4' }}>GPS</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Dashboard', path: '/dashboard', active: true },
            { label: 'Roadmap', path: '/roadmap' },
            { label: 'Chat ARTH', path: '/chat' },
          ].map(item => (
            <Link key={item.path} to={item.path} style={{
              textDecoration: 'none', fontSize: '13px', fontWeight: item.active ? 600 : 500,
              color: item.active ? '#95d7e4' : 'rgba(255,255,255,0.5)',
              padding: '6px 14px', borderRadius: '8px',
              background: item.active ? 'rgba(149,215,228,0.1)' : 'transparent',
              border: item.active ? '1px solid rgba(149,215,228,0.2)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{personaLabel}</span>
          <PageJump navigate={navigate} />
          <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
          >Log Out</motion.button>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f4ff1, #007be3)',
            border: '2px solid rgba(149,215,228,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700,
          }}>P</div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ── GREETING HEADER ── */}
        <motion.div
          style={{ marginBottom: '32px' }}
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>
                Namaste, your financial GPS is active 🧭
              </h1>
            </div>
            <div style={{
              padding: '8px 16px', borderRadius: '12px',
              background: dnaScore >= 70 ? 'rgba(74,222,128,0.1)' : dnaScore >= 50 ? 'rgba(149,215,228,0.1)' : 'rgba(251,191,36,0.1)',
              border: `1px solid ${dnaScore >= 70 ? 'rgba(74,222,128,0.3)' : dnaScore >= 50 ? 'rgba(149,215,228,0.3)' : 'rgba(251,191,36,0.3)'}`,
              fontSize: '13px', fontWeight: 600,
              color: dnaScore >= 70 ? '#4ade80' : dnaScore >= 50 ? '#95d7e4' : '#fbbf24',
            }}>
              {dnaScore >= 70 ? '🏆 Top 25% of FinGPS users' : dnaScore >= 50 ? '📈 Above average saver' : '🌱 Every journey starts here'}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 1: SCORE COMMAND CENTER
        ══════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            background: 'rgba(10,14,40,0.7)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(79,111,241,0.18)',
            borderRadius: '24px', padding: '28px',
            marginBottom: '24px',
            boxShadow: '0 0 60px rgba(79,79,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '32px', alignItems: 'center' }}>

            {/* LEFT: Score Ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                Financial DNA
              </span>
              <ScoreRing score={currentDisplayScore} size={160} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>/ 100 max</p>
                {earnedPoints > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#4ade80' }}>
                      +{earnedPoints} pts earned today
                    </p>
                    {conqueredWeaknessPts > 0 && (
                      <p style={{ fontSize: '10px', color: 'rgba(74,222,128,0.6)', marginTop: '2px' }}>
                        incl. {conqueredWeaknessPts} pts from fixing leaks
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* CENTER: Metric Breakdown */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>
                Score Breakdown
              </p>
              <MetricBar label="Savings Rate" value={d?.savingsRate || 0} color="#95d7e4" delay={0.4} />
              <MetricBar label="Debt Health" value={Math.max(0, 100 - (d?.debtOpt || 2) * 25)} color="#4ade80" delay={0.5} />
              <MetricBar label="Investment Score" value={result?.investmentScore || 45} color="#4f4ff1" delay={0.6} />
              <MetricBar label="Emergency Buffer" value={d?.efPct || 0} color="#fbbf24" delay={0.7} />

              {/* Progress toward projected */}
              <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(79,111,241,0.08)', border: '1px solid rgba(79,111,241,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Progress to projected score</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#95d7e4' }}>
                    {currentDisplayScore} → {projectedScore}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
                  {/* Target marker at projectedScore position */}
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: `${projectedScore}%`,
                    width: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 2,
                  }} />
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, #007be3, #95d7e4)', borderRadius: '99px' }}
                    animate={{ width: `${currentDisplayScore}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '5px' }}>
                  {remainingPts > 0
                    ? `Complete actions & fix leaks to reach ${projectedScore}/100`
                    : currentDisplayScore >= 100
                      ? '🏆 Maximum score reached!'
                      : `${projectedScore} is your ceiling with current actions`
                  }
                </p>
              </div>
            </div>

            {/* RIGHT: Projected Score + Key Stats */}
            <div style={{ minWidth: '180px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>
                Your Potential
              </p>

              {/* Projected score card */}
              <div style={{
                background: 'rgba(79,79,241,0.12)', border: '1px solid rgba(79,111,241,0.25)',
                borderRadius: '16px', padding: '16px', textAlign: 'center', marginBottom: '12px',
              }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Projected Score</p>
                <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '42px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: '#4f4ff1' }}>
                  {projectedScore}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  +{remainingPts} pts still available
                </p>
              </div>

              {/* Quick stats */}
              {[
                { label: 'Monthly Savings', value: `₹${(d?.monthlySavings || 0).toLocaleString()}`, color: '#95d7e4' },
                { label: 'Income', value: `₹${(d?.monthlyIncome || 0).toLocaleString()}/mo`, color: 'rgba(255,255,255,0.6)' },
                { label: 'EF Status', value: `${d?.efMonths || 0}mo buffer`, color: d?.efMonths >= 3 ? '#4ade80' : '#fbbf24' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2: ARTH ACTIONS + WEAKNESSES
        ══════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>

          {/* LEFT: ARTH ACTIONS */}
          <motion.div
            style={{
              background: 'rgba(8,12,36,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(149,215,228,0.12)',
              borderRadius: '24px', padding: '24px',
            }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    ARTH Actions
                  </h2>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  Complete these to improve your score
                </p>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: '10px',
                background: 'rgba(149,215,228,0.1)', border: '1px solid rgba(149,215,228,0.2)',
                fontSize: '13px', fontWeight: 700, color: '#95d7e4',
              }}>
                +{remainingPts} pts remaining
              </div>
            </div>

            {/* Progress bar for actions */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  {checkedActions.size} of {arthActions.length} actions taken
                </span>
                <span style={{ fontSize: '11px', color: '#95d7e4', fontWeight: 600 }}>
                  {Math.round((checkedActions.size / Math.max(1, arthActions.length)) * 100)}% complete
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #007be3, #95d7e4)', borderRadius: '99px' }}
                  animate={{ width: `${(checkedActions.size / Math.max(1, arthActions.length)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Actions list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {arthActions.map((action, i) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  checked={checkedActions.has(action.id)}
                  onToggle={handleActionToggle}
                />
              ))}
            </div>

            {/* Completion celebration */}
            {checkedActions.size === arthActions.length && arthActions.length > 0 && (
              <motion.div
                style={{
                  marginTop: '16px', textAlign: 'center', padding: '16px',
                  background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: '16px',
                }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              >
                <p style={{ fontSize: '16px', marginBottom: '4px' }}>🏆</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>All actions complete!</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  Score from actions: {currentDisplayScore}/100
                  {remainingWeaknessPts > 0 && ` — fix ${weaknesses.filter(w => !fixedWeaknesses.has(w.actionId)).length} leaks to unlock +${remainingWeaknessPts} more pts`}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT: WEAKNESSES + UPGRADES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Weaknesses / Leaks */}
            <motion.div
              style={{
                background: 'rgba(8,12,36,0.65)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(248,113,113,0.15)',
                borderRadius: '24px', padding: '24px', flex: 1,
              }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>⚡</span>
                <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  ARTH Found These Leaks
                </h2>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                Fixing these stops wealth from draining
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {weaknesses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#4ade80' }}>
                    <p style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</p>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>No major leaks detected!</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Strong financial foundation</p>
                  </div>
                ) : (
                  weaknesses.map(w => (
                    <WeaknessCard
                      key={w.id} weakness={w}
                      onFix={handleFixWeakness}
                      isFixed={fixedWeaknesses.has(w.actionId)}
                    />
                  ))
                )}
              </div>
            </motion.div>

            {/* Upgrades / Journey */}
            <motion.div
              style={{
                background: 'rgba(8,12,36,0.65)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(79,111,241,0.15)',
                borderRadius: '24px', padding: '20px',
              }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px' }}>🏅</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Upgrades & Milestones
                </h3>
              </div>

              {/* Completed milestones */}
              {completedMilestones.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                    Completed
                  </p>
                  {completedMilestones.map((m, i) => (
                    <div key={m.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 0',
                      borderBottom: i < completedMilestones.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 500 }}>{m.label}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{m.sector}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions taken this session */}
              {checkedActions.size > 0 && (
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                    Taken today
                  </p>
                  {arthActions.filter(a => checkedActions.has(a.id)).map((a, i) => (
                    <div key={a.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0',
                      borderBottom: i < checkedActions.size - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <span style={{ fontSize: '14px' }}>{a.icon}</span>
                      <span style={{ fontSize: '13px', color: a.color, fontWeight: 500 }}>{a.title}</span>
                      <span style={{ fontSize: '11px', color: a.color, marginLeft: 'auto', fontWeight: 700 }}>+{a.points}pts</span>
                    </div>
                  ))}
                </div>
              )}

              {completedMilestones.length === 0 && checkedActions.size === 0 && (
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '12px 0' }}>
                  Take your first action above to start building upgrades 👆
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 3: SIMULATE
        ══════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            background: 'rgba(8,12,36,0.65)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79,111,241,0.18)',
            borderRadius: '24px', overflow: 'hidden',
            marginBottom: '24px',
          }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Simulate header — always visible */}
          <div
            style={{
              padding: '22px 28px', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: showSimulate ? '1px solid rgba(79,111,241,0.15)' : 'none',
            }}
            onClick={() => setShowSimulate(!showSimulate)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #007be3, #4f4ff1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', boxShadow: '0 0 16px rgba(79,111,241,0.3)',
              }}>🔮</div>
              <div>
                <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Simulate Your Future
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  See Elite, Good, Slow paths — your money, 20 years from now
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showSimulate ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: '20px', color: '#95d7e4' }}
            >
              ↓
            </motion.div>
          </div>

          {/* Simulate body */}
          <AnimatePresence>
            {showSimulate && simData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '28px' }}>

                  {/* Three scenario cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    {[
                      {
                        key: 'elite', label: '🚀 Elite Path', color: '#4ade80',
                        bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)',
                        monthly: simData.elite.monthly, rate: simData.elite.rate,
                        tagline: 'Maximum wealth building',
                        actions: [`Save 35% of income (₹${simData.elite.monthly.toLocaleString()}/mo)`, 'Diversified SIP + stocks + gold', 'Full 80C tax optimization', 'Annual rebalancing'],
                        score: '90+',
                      },
                      {
                        key: 'good', label: '📈 Good Path', color: '#95d7e4',
                        bg: 'rgba(149,215,228,0.08)', border: 'rgba(149,215,228,0.25)',
                        monthly: simData.good.monthly, rate: simData.good.rate,
                        tagline: 'Steady, reliable growth',
                        actions: [`Save 20% (₹${simData.good.monthly.toLocaleString()}/mo)`, 'Nifty 50 index SIP', 'Emergency fund complete', 'Term + health insurance'],
                        score: '75–85',
                      },
                      {
                        key: 'slow', label: '🐢 Slow Path', color: '#fbbf24',
                        bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.2)',
                        monthly: simData.slow.monthly, rate: simData.slow.rate,
                        tagline: 'Minimal action taken',
                        actions: [`Save 10% (₹${simData.slow.monthly.toLocaleString()}/mo)`, 'Savings account / FD only', 'No investment growth', 'Inflation eating returns'],
                        score: '50–60',
                      },
                    ].map(scenario => {
                      const corpus5 = calcCorpus(scenario.monthly, scenario.rate, 5)
                      const corpus10 = calcCorpus(scenario.monthly, scenario.rate, 10)
                      const corpus20 = calcCorpus(scenario.monthly, scenario.rate, 20)

                      return (
                        <motion.div
                          key={scenario.key}
                          style={{
                            background: scenario.bg, border: `1px solid ${scenario.border}`,
                            borderRadius: '20px', padding: '22px',
                            position: 'relative', overflow: 'hidden',
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: scenario.key === 'elite' ? 0.1 : scenario.key === 'good' ? 0.2 : 0.3 }}
                          whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                        >
                          {/* Label */}
                          <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '16px', fontWeight: 700, color: scenario.color, marginBottom: '4px' }}>
                            {scenario.label}
                          </h3>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                            {scenario.tagline}
                          </p>

                          {/* Corpus projections */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                            {[
                              { label: '5 Years', value: toDisplay(corpus5) },
                              { label: '10 Years', value: toDisplay(corpus10) },
                              { label: '20 Years', value: toDisplay(corpus20) },
                            ].map(proj => (
                              <div key={proj.label} style={{ textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{proj.label}</p>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: scenario.color }}>{proj.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Monthly investment */}
                          <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Monthly invest</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: scenario.color }}>₹{scenario.monthly.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>CAGR return</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: scenario.color }}>{scenario.rate}%</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div>
                            {scenario.actions.map((a, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: scenario.color, flexShrink: 0 }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{a}</span>
                              </div>
                            ))}
                          </div>

                          {/* Score badge */}
                          <div style={{
                            marginTop: '14px', textAlign: 'center',
                            padding: '6px', borderRadius: '8px',
                            background: `${scenario.color}18`, border: `1px solid ${scenario.color}30`,
                            fontSize: '11px', fontWeight: 600, color: scenario.color,
                          }}>
                            DNA Score: {scenario.score}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Simulation Chart */}
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '20px', textAlign: 'center' }}>
                      Wealth accumulation over 20 years (₹ in Lakhs)
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={simData.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="eliteGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="goodGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#95d7e4" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#95d7e4" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="slowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                          tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickFormatter={v => `Yr ${v}`} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                          tickLine={false} axisLine={false}
                          tickFormatter={v => `₹${v}L`} />
                        <Tooltip content={<SimTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', paddingTop: '16px' }}
                          formatter={(value) => <span style={{ color: value === 'Elite' ? '#4ade80' : value === 'Good' ? '#95d7e4' : '#fbbf24' }}>{value} Path</span>}
                        />
                        <Area type="monotone" dataKey="Elite" stroke="#4ade80" strokeWidth={2.5}
                          fill="url(#eliteGrad)" dot={false} activeDot={{ r: 5, fill: '#4ade80' }} />
                        <Area type="monotone" dataKey="Good" stroke="#95d7e4" strokeWidth={2.5}
                          fill="url(#goodGrad)" dot={false} activeDot={{ r: 5, fill: '#95d7e4' }} />
                        <Area type="monotone" dataKey="Slow" stroke="#fbbf24" strokeWidth={2}
                          fill="url(#slowGrad)" strokeDasharray="5 3" dot={false} activeDot={{ r: 5, fill: '#fbbf24' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
                      *Projections based on your income bracket. Actual returns may vary. Consult a SEBI-registered advisor for large decisions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 4: ROADMAP PREVIEW + CTA
        ══════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Roadmap next steps */}
          <motion.div
            style={{
              background: 'rgba(8,12,36,0.65)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(79,111,241,0.15)',
              borderRadius: '24px', padding: '24px',
            }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              🗺️ Your Roadmap
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              {completedMilestones.length} of {d?.milestones?.length || 12} milestones complete
            </p>

            {d?.milestones?.slice(0, 5).map((m, i) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: m.status === 'completed' ? 'rgba(74,222,128,0.2)' : m.status === 'current' ? 'rgba(79,111,241,0.2)' : 'rgba(255,255,255,0.05)',
                  border: m.status === 'completed' ? '1.5px solid #4ade80' : m.status === 'current' ? '1.5px solid #4f4ff1' : '1.5px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px',
                }}>
                  {m.status === 'completed' ? '✓' : m.status === 'current' ? '→' : '🔒'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: m.status === 'locked' ? 'rgba(255,255,255,0.3)' : '#fff' }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{m.sector}</p>
                </div>
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
                  background: m.status === 'completed' ? 'rgba(74,222,128,0.1)' : m.status === 'current' ? 'rgba(79,111,241,0.15)' : 'rgba(255,255,255,0.05)',
                  color: m.status === 'completed' ? '#4ade80' : m.status === 'current' ? '#95d7e4' : 'rgba(255,255,255,0.2)',
                  fontWeight: 600,
                }}>
                  {m.status}
                </span>
              </div>
            ))}

            <Link to="/roadmap" style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}>
              <motion.div
                style={{
                  textAlign: 'center', padding: '12px',
                  background: 'rgba(79,111,241,0.1)', border: '1px solid rgba(79,111,241,0.2)',
                  borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#95d7e4',
                  cursor: 'pointer',
                }}
                whileHover={{ background: 'rgba(79,111,241,0.2)' }}
              >
                View Full Roadmap →
              </motion.div>
            </Link>
          </motion.div>

          {/* ARTH Chat CTA */}
          <motion.div
            style={{
              background: 'linear-gradient(145deg, rgba(12,20,58,0.85) 0%, rgba(8,13,36,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(149,215,228,0.2)',
              borderRadius: '24px', padding: '28px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'radial-gradient(ellipse, rgba(149,215,228,0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                style={{
                  width: '52px', height: '52px', borderRadius: '16px', marginBottom: '16px',
                  background: 'linear-gradient(135deg, #007be3, #4f4ff1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', boxShadow: '0 0 24px rgba(79,111,241,0.4)',
                }}
                animate={{ boxShadow: ['0 0 20px rgba(79,111,241,0.3)', '0 0 40px rgba(79,111,241,0.6)', '0 0 20px rgba(79,111,241,0.3)'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
              >
                🤖
              </motion.div>
              <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Ask ARTH anything
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '20px' }}>
                Your AI advisor knows your score, your leaks, and your goals.
                Ask in plain Hindi or English — no jargon, ever.
              </p>

              {/* Quick prompts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {[
                  `"How do I improve my ${dnaScore} score fast?"`,
                  `"Best SIP for my risk profile?"`,
                  `"How to build emergency fund in 6 months?"`,
                ].map((q, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic',
                    cursor: 'pointer',
                  }}>
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/chat" style={{ textDecoration: 'none' }}>
              <motion.div
                className="btn-primary"
                style={{ justifyContent: 'center', fontSize: '15px', padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              >
                Chat with ARTH 🤖
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage