import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

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
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: 'rgba(14,11,14,0.97)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
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

const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 1.8 + 0.6,
  opacity: Math.random() * 0.55 + 0.15,
}))

const MESSAGES = [
  'Analyzing your income patterns...',
  'Calculating your risk profile...',
  'Mapping your savings behavior...',
  'Building your Financial DNA...',
  'Generating your personal roadmap...',
]

const AnalysisPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const answers = location.state?.answers || []

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [msgVisible, setMsgVisible] = useState(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 35)
    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgVisible(false)
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % MESSAGES.length)
        setMsgVisible(true)
      }, 400)
    }, 1000)
    return () => clearInterval(msgInterval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        navigate('/results', { state: { answers } })
      }, 600)
    }
  }, [progress, navigate, answers])

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: '#03050f', fontFamily: 'Be Vietnam Pro, sans-serif' }}
    >
      {/* ── TOP-RIGHT NAV CLUSTER ── */}
      <div style={{ position: 'fixed', top: '16px', right: '20px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PageJump navigate={navigate} />
        <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
        >Log Out</motion.button>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f4ff1, #007be3)', border: '2px solid rgba(149,215,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>P</div>
      </div>

      {/* ── BACKGROUND — stronger glow than other screens ── */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full" style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: s.size, height: s.size,
            opacity: s.opacity, background: '#fff',
          }} />
        ))}
        {/* Stronger primary glow */}
        <div className="absolute" style={{
          top: '-20%', left: '-15%', width: '900px', height: '800px',
          background: 'radial-gradient(ellipse at 30% 30%, rgba(26,80,220,0.55) 0%, rgba(20,50,160,0.30) 35%, transparent 68%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          top: '0%', width: '800px', height: '500px',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(79,79,241,0.18) 0%, rgba(60,110,230,0.12) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div className="absolute" style={{
          top: '-5%', right: '-8%', width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(30,60,180,0.20) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />
        {/* Bottom fog — Hero.jsx exact */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '45%',
          background: `
            radial-gradient(ellipse 120% 80% at 50% 115%, rgba(8,12,32,0.98) 0%, transparent 62%),
            radial-gradient(ellipse 65% 50% at 15% 120%, rgba(6,10,28,0.90) 0%, transparent 58%),
            radial-gradient(ellipse 65% 50% at 85% 120%, rgba(6,10,28,0.90) 0%, transparent 58%)
          `,
        }} />
        <div className="absolute" style={{
          bottom: '-5%', left: '-12%', width: '68%', height: '50%',
          background: 'radial-gradient(ellipse 88% 68% at 38% 100%, rgba(10,16,42,0.97) 0%, rgba(8,13,35,0.78) 45%, transparent 70%)',
          filter: 'blur(20px)',
        }} />
        <div className="absolute" style={{
          bottom: '-5%', right: '-12%', width: '68%', height: '50%',
          background: 'radial-gradient(ellipse 88% 68% at 62% 100%, rgba(10,16,42,0.97) 0%, rgba(8,13,35,0.78) 45%, transparent 70%)',
          filter: 'blur(20px)',
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '20%',
          background: 'linear-gradient(to top, rgba(3,5,15,1) 0%, transparent 100%)',
        }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Spinner ring */}
        <div className="relative mb-10" style={{ width: '160px', height: '160px' }}>
          {/* Outer static ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid rgba(79,111,241,0.15)',
          }} />
          {/* Spinning ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#4f4ff1',
            borderRightColor: '#007be3',
            animation: 'spin 1.8s linear infinite',
          }} />
          {/* Inner circle — glass-card-strong exact */}
          <div style={{
            position: 'absolute', inset: '20px',
            borderRadius: '50%',
            background: 'rgba(12,20,58,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(79,111,241,0.3)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>🧬</span>
            <span style={{
              fontSize: '15px', fontWeight: 700,
              marginTop: '4px',
              background: 'linear-gradient(135deg, #ffffff 0%, #7dd8f0 45%, #4f6ef1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Heading — same sizing pattern as other screens */}
        <h1 className="font-bold mb-3" style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 'clamp(26px, 4vw, 38px)',
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#fff',
        }}>
          Analyzing your Financial DNA
        </h1>

        {/* Cycling message */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgba(255,255,255,0.5)',
          minHeight: '24px',
          marginBottom: '32px',
          transition: 'opacity 0.4s ease',
          opacity: msgVisible ? 1 : 0,
        }}>
          {MESSAGES[msgIndex]}
        </p>

        {/* Progress bar — same as QuizPage */}
        <div style={{ width: '320px', maxWidth: '100%' }}>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #007be3, #4f4ff1)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <div className="flex justify-end mt-1.5">
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{progress}% complete</span>
          </div>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AnalysisPage