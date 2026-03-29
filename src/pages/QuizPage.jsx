import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from "../lib/api";

const PAGES = [
  { label: 'Dashboard',    path: '/dashboard' },
  { label: 'Roadmap',      path: '/roadmap' },
  { label: 'Quiz',         path: '/quiz' },
  { label: 'Results',      path: '/results' },
  { label: 'What-If',      path: '/whatif' },
  { label: 'Talk to ARTH', path: '/chat' },
  { label: 'Analysis',     path: '/analysis' },
]

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
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
      >⌘ Jump <span style={{ fontSize: '10px', opacity: 0.5 }}>{open ? '▲' : '▼'}</span></motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: '#0e0b0e', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
          >
            {PAGES.map((p, i) => (
              <motion.div key={p.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: '#95d7e4' }}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', borderBottom: i < PAGES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.15s' }}
              >{p.label}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TOTAL_QUESTIONS = 9
const LETTERS = ['A', 'B', 'C', 'D']
// ── DYNAMIC QUESTION ENGINE (100% Branching) ──
const getDynamicQuestion = (step, answers) => {
  const persona = answers[0] // 0: Student, 1: Early Career, 2: Mid-Career, 3: Retirement

  switch (step) {
    case 0:
      return {
        category: '👤 The Baseline',
        text: 'Which best describes your current stage in life?',
        options: ['Student / Just starting out', 'Early career (Renting/Building)', 'Mid-career (Homeowner/Family)', 'Approaching retirement'],
      }
    
    case 1:
      if (persona === 0) return {
        category: '🏦 Funding Sources',
        text: 'What is your primary source of funds right now?',
        options: ['Pocket money / Allowance', 'Part-time job / Internship', 'Scholarships / Grants', 'Freelance / Side-hustle'],
      }
      return {
        category: '🏦 Income Dynamics',
        text: 'What does your monthly income stream look like?',
        options: ['Highly variable (Freelance/Business)', 'Fixed salary (Below ₹50k)', 'Fixed salary (₹50k - ₹1.5L)', 'High earner (Above ₹1.5L)'],
      }
    
    case 2:
      if (persona === 0) return {
        category: '💸 Spending Habits',
        text: 'How do you usually track your daily spending?',
        options: ['I don\'t track it at all', 'Mental math (I just guess)', 'I use an app or spreadsheet', 'My parents manage it'],
      }
      return {
        category: '💸 Monthly Margin',
        text: 'Roughly how much is left in your account at the end of the month?',
        options: ['Nothing, living paycheck to paycheck', 'A little bit (0–10%)', 'A comfortable margin (10–30%)', 'A highly optimized margin (30%+)'],
      }

    case 3:
      if (persona === 0) return {
        category: '⚖️ Current Liabilities',
        text: 'Are you currently managing any debt?',
        options: ['Education / Student loans', 'Credit cards / Buy-Now-Pay-Later', 'Borrowed from family/friends', 'None, I am completely debt-free'],
      }
      return {
        category: '⚖️ Current Liabilities',
        text: 'What is your biggest financial weight right now?',
        options: ['Credit card balances', 'Personal or Student Loans', 'Home/Car EMI', 'None, I am completely debt-free'],
      }

    case 4:
      if (persona === 0) return {
        category: '🛡️ The Safety Net',
        text: 'What is your biggest financial anxiety right now?',
        options: ['Finding a good paying job', 'Paying off my student loans', 'Peer-pressure spending (FOMO)', 'Not knowing how to invest'],
      }
      return {
        category: '🛡️ The Safety Net',
        text: 'If your primary income stopped tomorrow, how long could you survive comfortably?',
        options: ['Less than a month', '1 to 3 months', '3 to 6 months', '6+ months (Fully secured)'],
      }

    case 5:
      if (persona === 0) return {
        category: '📈 Growth Strategy',
        text: 'How much are you currently able to set aside for the future?',
        options: ['Nothing yet, just surviving', 'Spare change from pocket money', 'Started small SIPs / Crypto', 'Actively learning & investing'],
      }
      return {
        category: '📈 Growth Strategy',
        text: 'Where is the majority of your wealth currently sitting?',
        options: ['Standard Savings Account', 'Fixed Deposits (FDs)', 'Mutual Funds & SIPs', 'Diversified (Stocks, Real Estate, etc.)'],
      }

    case 6:
      if (persona === 0) return {
        category: '🧠 Financial Psychology',
        text: 'You get a surprise ₹10,000 gift. What is your immediate instinct?',
        options: ['Spend it on lifestyle/going out', 'Buy a course or upskill', 'Put it straight into savings', 'Invest it in the market'],
      }
      return {
        category: '🧠 Financial Psychology',
        text: 'You suddenly get a ₹50,000 windfall. What is your immediate instinct?',
        options: ['Pay off debt immediately', 'Invest it all', 'Save half, spend half', 'Book a vacation / Buy a gadget'],
      }

    case 7:
      if (persona === 0) return {
        category: '🎯 Short-Term Focus',
        text: 'What is your primary goal for the next 12 months?',
        options: ['Graduate completely debt-free', 'Land a high-paying job', 'Build a basic emergency fund', 'Start my first investment portfolio'],
      }
      return {
        category: '🌩️ Risk Profile',
        text: 'When you think about money, what makes you the most anxious?',
        options: ['Unexpected medical emergencies', 'Never being able to retire', 'Drowning in debt', 'Not enjoying my life today'],
      }

    case 8:
      if (persona === 0) return {
        category: '🌟 The North Star',
        text: 'Where do you want to be financially by age 30?',
        options: ['100% financially independent', 'Earning a 6-figure monthly salary', 'Owning my own house', 'Running my own business'],
      }
      return {
        category: '🌟 The North Star',
        text: 'What is your most important financial goal for the next 3 years?',
        options: ['Buying a home / Real estate', 'Clearing all debt', 'Building a wealth portfolio', 'Major lifestyle upgrade (Travel/Wedding)'],
      }

    default:
      return { category: '', text: '', options: [] }
  }
}

// ── STARFIELD ──
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 1.8 + 0.6,
  opacity: Math.random() * 0.4 + 0.1,
  twinkleDuration: (Math.random() * 3 + 2).toFixed(1),
  twinkleDelay: (Math.random() * 3).toFixed(1),
}))

const QuizPage = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState(new Array(TOTAL_QUESTIONS).fill(null))
  const [direction, setDirection] = useState(1)
  const [showResult, setShowResult] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

  const progress = ((current + 1) / TOTAL_QUESTIONS) * 100
  const isLast = current === TOTAL_QUESTIONS - 1
  const isFirst = current === 0

  // Calculate the current question based on state
  const currentQuestion = getDynamicQuestion(current, answers)

  const selectOption = (i) => {
    const newAnswers = [...answers]
    
    // BRANCH RESET LOGIC: If they change their persona (Q1), wipe subsequent answers to prevent logic breaks
    if (current === 0 && newAnswers[0] !== null && newAnswers[0] !== i) {
      for (let j = 1; j < TOTAL_QUESTIONS; j++) newAnswers[j] = null;
    }
    
    newAnswers[current] = i
    setAnswers(newAnswers)
  }

 const submitQuiz = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    const token = localStorage.getItem('token')

    if (!token) {
      setErrorMessage("Please log in to save your results.")
      setIsSubmitting(false)
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    try {
      const response = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Quiz saved to Database!', data)
        localStorage.setItem('finGpsResults', JSON.stringify(data))
        
        // ── PREMIUM UX: UPDATE LOCAL STATE ──
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.hasCompletedQuiz = true;
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        setShowResult(true) 
      } else {
        setErrorMessage(data.message || 'Failed to submit quiz')
        if (response.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
        }
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setErrorMessage('Could not connect to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = () => {
    if (isLast) {
      if (answers[current] === null) return
      submitQuiz() 
    } else {
      setDirection(1)
      setCurrent(c => c + 1)
    }
  }

  const goPrev = () => {
    if (isFirst) return
    setDirection(-1)
    setCurrent(c => c - 1)
  }

  const goToAnalysis = () => {
    navigate('/analysis', { state: { answers } })
  }

  const restart = () => {
    setAnswers(new Array(TOTAL_QUESTIONS).fill(null))
    setCurrent(0)
    setDirection(1)
    setShowResult(false)
  }

  // ── RESULT CALCULATION ──
  const answered = answers.filter(a => a !== null).length
  // Dynamically calculate score based on the specific options presented
  const score = answers.filter((a, i) => {
    if (a === null) return false;
    const q = getDynamicQuestion(i, answers);
    return a === q.options.length - 1; // Assuming the last option is the "best/most secure"
  }).length

  let resultEmoji = '🌱', resultTitle = 'Getting Started!', resultSub = "You're at the beginning of your financial journey. Let's build your roadmap together."
  if (answered >= 8 && score >= 6) { resultEmoji = '🏆'; resultTitle = 'Financial Pro!'; resultSub = 'Impressive! You have excellent financial awareness. Time to optimise your roadmap.' }
  else if (answered >= 5) { resultEmoji = '📈'; resultTitle = 'On the Right Track!'; resultSub = 'Great foundation! A few tweaks and your financial roadmap will be solid.' }

  // ── CARD FLIP VARIANTS ──
  const cardVariants = {
    enter: (dir) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
    center: { rotateY: 0, opacity: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
    exit: (dir) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }),
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{ background: '#010204', fontFamily: 'Be Vietnam Pro, sans-serif', color: '#fff' }}
    >
      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'rgba(0,123,227, 0.25)', top: '-200px', right: '-200px', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.45 }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'rgba(79,79,241, 0.2)', top: '10%', right: '5%', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.25 }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'rgba(0,123,227, 0.15)', bottom: '-100px', left: '-80px', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(79,111,241, 0.15)', top: '40%', left: '30%', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2 }} />

        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full" style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: s.size, height: s.size,
            background: '#fff', opacity: s.opacity,
            animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.05; }
        }
      `}</style>

      <div className="relative z-10 w-full flex flex-col items-center" style={{ maxWidth: '520px' }}>

        {/* ── LOGO ── */}
        <motion.div
          className="mb-6 w-full flex items-center justify-between"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: 700 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #007be3, #4f4ff1)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ color: '#fff' }}>Fin<span style={{ color: '#95d7e4' }}>GPS</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PageJump navigate={navigate} />
            <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
            >Log Out</motion.button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f4ff1, #007be3)', border: '2px solid rgba(149,215,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>P</div>
          </div>
        </motion.div>

        {/* ── ERROR MESSAGE DISPLAY ── */}
        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', color: '#f87171', fontSize: '13px', textAlign: 'center', background: 'rgba(248, 113, 113, 0.1)', padding: '10px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
            {errorMessage}
          </motion.div>
        )}

        {/* ── RESULT SCREEN ── */}
        {showResult ? (
          <motion.div
            className="w-full text-center rounded-3xl p-10"
            style={{
              background: 'rgba(14,11,14,0.92)',
              border: '1px solid rgba(79,111,241,0.25)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 60px rgba(79,111,241,0.15)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{resultEmoji}</div>
            <h2 className="font-bold mb-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '28px', letterSpacing: '-0.03em', color: '#fff' }}>
              {resultTitle}
            </h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '340px', margin: '0 auto 24px' }}>
              {resultSub}
            </p>
            <div className="inline-flex items-center px-5 py-2 rounded-full mb-8 text-sm font-semibold"
              style={{ background: 'rgba(79,111,241,0.12)', border: '1px solid rgba(79,111,241,0.3)', color: '#95d7e4' }}>
              {answered} / {TOTAL_QUESTIONS} answered
            </div>
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={goToAnalysis}
                className="btn-primary w-full justify-center"
                style={{ fontSize: '15px', padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #007be3 0%, #4f4ff1 100%)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              >
                See My Financial DNA 🧬
              </motion.button>
              <motion.button
                onClick={restart}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px', padding: '12px', color: '#94a3b8',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.09)', color: '#fff' }}
                whileTap={{ scale: 0.97 }}
              >
                Retake Quiz ↺
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* ── TOP BAR ── */}
            <motion.div
              className="w-full flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.button
                onClick={goPrev}
                disabled={isFirst}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: isFirst ? 'rgba(255,255,255,0.2)' : '#94a3b8',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', cursor: isFirst ? 'not-allowed' : 'pointer',
                  flexShrink: 0, transition: 'all 0.2s',
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                }}
                whileHover={!isFirst ? { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' } : {}}
                whileTap={!isFirst ? { scale: 0.94 } : {}}
              >
                ←
              </motion.button>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 500 }}>
                  <span style={{ color: '#95d7e4', fontWeight: 600 }}>{current + 1} / {TOTAL_QUESTIONS}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{currentQuestion.category.split(' ').slice(1).join(' ')}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, #007be3, #4f4ff1)', borderRadius: '99px', boxShadow: '0 0 10px rgba(79,111,241,0.5)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── QUESTION CARD ── */}
            <div style={{ width: '100%', perspective: '1000px', marginBottom: '16px' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div style={{
                    background: 'rgba(14,11,14,0.88)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '22px',
                    padding: '36px 32px',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
                    minHeight: '170px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '11px', fontWeight: 600, color: '#95d7e4',
                      background: 'rgba(149,215,228,0.1)', border: '1px solid rgba(149,215,228,0.2)',
                      borderRadius: '99px', padding: '4px 12px', marginBottom: '16px',
                      letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content',
                    }}>
                      {currentQuestion.category}
                    </div>

                    <p style={{
                      fontFamily: 'Be Vietnam Pro, sans-serif',
                      fontSize: 'clamp(18px, 3.5vw, 23px)',
                      fontWeight: 700, color: '#fff',
                      lineHeight: 1.35, letterSpacing: '-0.01em',
                    }}>
                      {currentQuestion.text}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── OPTIONS ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="w-full flex flex-col gap-2.5 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.2 }}
              >
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[current] === i
                  return (
                    <motion.button
                      key={i}
                      onClick={() => selectOption(i)}
                      style={{
                        width: '100%',
                        background: isSelected ? 'rgba(79,111,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: isSelected ? '1px solid rgba(79,111,241,0.6)' : '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '14px', padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: '14px',
                        cursor: 'pointer', textAlign: 'left',
                        boxShadow: isSelected ? '0 0 18px rgba(79,111,241,0.3), 0 0 40px rgba(0,123,227,0.12)' : 'none',
                        fontFamily: 'Be Vietnam Pro, sans-serif',
                        transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
                      }}
                      whileHover={{ x: isSelected ? 4 : 3, background: isSelected ? 'rgba(79,111,241,0.18)' : 'rgba(79,111,241,0.08)', borderColor: isSelected ? 'rgba(79,111,241,0.7)' : 'rgba(79,111,241,0.3)' }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                    >
                      <div style={{
                        width: '30px', height: '30px', flexShrink: 0,
                        borderRadius: '8px',
                        background: isSelected ? 'linear-gradient(135deg, #007be3, #4f4ff1)' : 'rgba(255,255,255,0.06)',
                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Be Vietnam Pro, sans-serif',
                        fontSize: '12px', fontWeight: 700,
                        color: isSelected ? '#fff' : '#94a3b8',
                        transition: 'all 0.2s',
                      }}>
                        {LETTERS[i]}
                      </div>

                      <span style={{
                        fontSize: '14px', fontWeight: 500,
                        color: isSelected ? '#fff' : '#cbd5e1',
                        lineHeight: 1.4, flex: 1, transition: 'color 0.2s',
                      }}>
                        {opt}
                      </span>

                      <div style={{
                        marginLeft: 'auto', flexShrink: 0,
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                        background: isSelected ? 'linear-gradient(135deg, #007be3, #4f4ff1)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: isSelected ? '#fff' : 'transparent',
                        transition: 'all 0.2s',
                      }}>
                        ✓
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* ── NAVIGATION BUTTONS ── */}
            <motion.div
              className="w-full flex gap-3"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={goPrev}
                disabled={isFirst}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px',
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                  fontSize: '15px', fontWeight: 600, cursor: isFirst ? 'not-allowed' : 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: isFirst ? 'rgba(255,255,255,0.2)' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                whileHover={!isFirst ? { background: 'rgba(255,255,255,0.09)', color: '#fff' } : {}}
                whileTap={!isFirst ? { scale: 0.97 } : {}}
              >
                ← Previous
              </motion.button>

              <motion.button
                onClick={goNext}
                disabled={answers[current] === null || isSubmitting}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px',
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                  fontSize: '15px', fontWeight: 600,
                  cursor: (answers[current] === null || isSubmitting) ? 'not-allowed' : 'pointer',
                  background: (answers[current] === null || isSubmitting)
                    ? 'rgba(79,111,241,0.3)'
                    : isLast
                      ? 'linear-gradient(135deg, #007be3, #4f4ff1)'
                      : 'linear-gradient(135deg, #007be3 0%, #4f4ff1 100%)',
                  border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: answers[current] !== null ? '0 0 20px rgba(79,111,241,0.4)' : 'none',
                  opacity: (answers[current] === null || isSubmitting) ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
                whileHover={answers[current] !== null && !isSubmitting ? { scale: 1.02, boxShadow: '0 0 30px rgba(79,111,241,0.6)' } : {}}
                whileTap={answers[current] !== null && !isSubmitting ? { scale: 0.97 } : {}}
              >
                {isSubmitting ? 'Analyzing Data...' : isLast ? 'Submit 🎯' : 'Next →'}
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default QuizPage