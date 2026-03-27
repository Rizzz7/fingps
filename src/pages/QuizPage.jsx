import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ── QUESTIONS ──
const QUESTIONS = [
  {
    category: '👤 Age Group',
    text: 'How old are you?',
    options: ['18–25 years', '26–35 years', '36–50 years', '51 years & above'],
  },
  {
    category: '🏦 Monthly Income',
    text: "What's your total monthly income from all sources?",
    options: ['Below ₹25,000', '₹25,000 – ₹75,000', '₹75,000 – ₹2,00,000', 'Above ₹2,00,000'],
  },
  {
    category: '💸 Monthly Savings',
    text: 'How much do you typically save each month?',
    options: ["I don't save yet", 'Below ₹10,000', '₹10,000 – ₹40,000', 'Above ₹40,000'],
  },
  {
    category: '💰 Loans & EMI',
    text: 'Do you have any ongoing loans or EMIs?',
    options: ['No loan or EMI', 'Below ₹10,000/month', '₹10,000 – ₹40,000/month', 'Above ₹40,000/month'],
  },
  {
    category: '🛒 Monthly Expenses',
    text: 'What are your average monthly expenses?',
    options: ['Below ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000'],
  },
  {
    category: '🎯 Financial Goal',
    text: 'What financial goal would you like to achieve?',
    options: ['Buy a Home', 'Retire Comfortably', 'Grow Wealth / Invest', 'Emergency Fund / Debt-Free'],
  },
  {
    category: '📆 Target Timeline',
    text: 'By when do you want to achieve this goal?',
    options: ['Within 1 year', '1–3 years', '3–7 years', '7+ years'],
  },
]

const LETTERS = ['A', 'B', 'C', 'D']

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
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null))
  const [direction, setDirection] = useState(1)
  const [showResult, setShowResult] = useState(false)
  
  // ── NEW STATE FOR BACKEND LOGIC ──
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const progress = ((current + 1) / QUESTIONS.length) * 100
  const isLast = current === QUESTIONS.length - 1
  const isFirst = current === 0

  const selectOption = (i) => {
    const newAnswers = [...answers]
    newAnswers[current] = i
    setAnswers(newAnswers)
  }

  // ── SECURE BACKEND SUBMISSION ──
  const submitQuiz = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    // Get the JWT Token saved during login
    const token = localStorage.getItem('token')

    if (!token) {
      setErrorMessage("Please log in to save your results.")
      setIsSubmitting(false)
      // Optional: Send them to login after a delay
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Send the secure wristband!
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Quiz saved to Database!', data)
        // Save the generated scores locally so your Results/Analysis page can chart it
        localStorage.setItem('finGpsResults', JSON.stringify(data))
        
        // Trigger the beautiful completion screen
        setShowResult(true) 
      } else {
        setErrorMessage(data.message || 'Failed to submit quiz')
        if (response.status === 401) {
          // Token expired, force re-login
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
      submitQuiz() // Trigger backend call instead of just showing result immediately
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
    // Navigating to Analysis/Results page!
    navigate('/analysis', { state: { answers } })
  }

  const restart = () => {
    setAnswers(new Array(QUESTIONS.length).fill(null))
    setCurrent(0)
    setDirection(1)
    setShowResult(false)
  }

  // ── RESULT CALCULATION ──
  const answered = answers.filter(a => a !== null).length
  const score = answers.filter((a, i) => a === QUESTIONS[i].options.length - 1).length
  let resultEmoji = '🌱', resultTitle = 'Getting Started!', resultSub = "You're at the beginning of your financial journey. Let's build your roadmap together."
  if (answered >= 6 && score >= 5) { resultEmoji = '🏆'; resultTitle = 'Financial Pro!'; resultSub = 'Impressive! You have excellent financial awareness. Time to optimise your roadmap.' }
  else if (answered >= 4) { resultEmoji = '📈'; resultTitle = 'On the Right Track!'; resultSub = 'Great foundation! A few tweaks and your financial roadmap will be solid.' }

  // ── CARD FLIP VARIANTS ──
  const cardVariants = {
    enter: (dir) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
    center: { rotateY: 0, opacity: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
    exit: (dir) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }),
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{ background: '#05070f', fontFamily: 'Be Vietnam Pro, sans-serif', color: '#e8edf4' }}
    >
      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: 'absolute', width: '700px', height: '700px', background: '#4c1d95', top: '-200px', right: '-200px', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.45 }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: '#312e81', top: '10%', right: '5%', borderRadius: '50%', filter: 'blur(170px)', opacity: 0.25 }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: '#0c1a3a', bottom: '-100px', left: '-80px', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#1e1b4b', top: '40%', left: '30%', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.2 }} />

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
          className="mb-6 font-bold tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px' }}
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #007be3, #4f4ff1)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ color: '#fff' }}>Fin<span style={{ color: '#95d7e4' }}>GPS</span></span>
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
              background: 'rgba(15,17,28,0.92)',
              border: '1px solid rgba(167,139,250,0.25)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.15)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>{resultEmoji}</div>
            <h2 className="font-bold mb-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '28px', letterSpacing: '-0.03em', color: '#f1f5f9' }}>
              {resultTitle}
            </h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '340px', margin: '0 auto 24px' }}>
              {resultSub}
            </p>
            <div className="inline-flex items-center px-5 py-2 rounded-full mb-8 text-sm font-semibold"
              style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}>
              {answered} / {QUESTIONS.length} answered
            </div>
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={goToAnalysis}
                className="btn-primary w-full justify-center"
                style={{ fontSize: '15px', padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
                whileHover={{ background: 'rgba(255,255,255,0.09)', color: '#e2e8f0' }}
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
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{current + 1} / {QUESTIONS.length}</span>
                  <span style={{ color: '#64748b' }}>{QUESTIONS[current].category.split(' ').slice(1).join(' ')}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: '99px', boxShadow: '0 0 10px rgba(167,139,250,0.5)' }}
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
                    background: 'rgba(15,17,28,0.88)',
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
                      fontSize: '11px', fontWeight: 600, color: '#a78bfa',
                      background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
                      borderRadius: '99px', padding: '4px 12px', marginBottom: '16px',
                      letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content',
                    }}>
                      {QUESTIONS[current].category}
                    </div>

                    <p style={{
                      fontFamily: 'Be Vietnam Pro, sans-serif',
                      fontSize: 'clamp(18px, 3.5vw, 23px)',
                      fontWeight: 700, color: '#f1f5f9',
                      lineHeight: 1.35, letterSpacing: '-0.01em',
                    }}>
                      {QUESTIONS[current].text}
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
                {QUESTIONS[current].options.map((opt, i) => {
                  const isSelected = answers[current] === i
                  return (
                    <motion.button
                      key={i}
                      onClick={() => selectOption(i)}
                      style={{
                        width: '100%',
                        background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: isSelected ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '14px', padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: '14px',
                        cursor: 'pointer', textAlign: 'left',
                        boxShadow: isSelected ? '0 0 18px rgba(99,102,241,0.3), 0 0 40px rgba(167,139,250,0.12)' : 'none',
                        fontFamily: 'Be Vietnam Pro, sans-serif',
                        transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
                      }}
                      whileHover={{ x: isSelected ? 4 : 3, background: isSelected ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.08)', borderColor: isSelected ? 'rgba(167,139,250,0.7)' : 'rgba(99,102,241,0.3)' }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                    >
                      <div style={{
                        width: '30px', height: '30px', flexShrink: 0,
                        borderRadius: '8px',
                        background: isSelected ? 'linear-gradient(135deg, #6366f1, #a78bfa)' : 'rgba(255,255,255,0.06)',
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
                        color: isSelected ? '#f1f5f9' : '#cbd5e1',
                        lineHeight: 1.4, flex: 1, transition: 'color 0.2s',
                      }}>
                        {opt}
                      </span>

                      <div style={{
                        marginLeft: 'auto', flexShrink: 0,
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                        background: isSelected ? 'linear-gradient(135deg, #6366f1, #a78bfa)' : 'transparent',
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
                whileHover={!isFirst ? { background: 'rgba(255,255,255,0.09)', color: '#e2e8f0' } : {}}
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
                    ? 'rgba(99,102,241,0.3)'
                    : isLast
                      ? 'linear-gradient(135deg, #059669, #34d399)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)',
                  border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: answers[current] !== null ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                  opacity: (answers[current] === null || isSubmitting) ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
                whileHover={answers[current] !== null && !isSubmitting ? { scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.6)' } : {}}
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