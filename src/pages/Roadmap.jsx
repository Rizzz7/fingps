// src/pages/Roadmap.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from "../lib/api";
const NAV_ITEMS = [
  { icon: '✦', label: 'AI Insights', id: 'insights' },
  { icon: '🔀', label: 'What-If', id: 'whatif' },
  { icon: '💬', label: 'Talk to ARTH', id: 'arth' },
]

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
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(79,111,241,0.18)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
      >⌘ Jump <span style={{ fontSize: '10px', opacity: 0.5 }}>{open ? '▲' : '▼'}</span></motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: '#0e0b0e', border: '1px solid rgba(79,111,241,0.18)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
          >
            {PAGES.map((p, i) => (
              <motion.div key={p.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: '#95d7e4' }}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', borderBottom: i < PAGES.length - 1 ? '1px solid rgba(79,111,241,0.12)' : 'none', transition: 'all 0.15s' }}
              >{p.label}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const nodeStyle = (status) => {
  if (status === 'completed') return { bg: '#4ade80', border: 'none', glow: '0 0 18px rgba(74,222,128,0.7)', textColor: '#022c1a' }
  if (status === 'current') return { bg: 'linear-gradient(135deg, #007be3, #4f4ff1)', border: 'none', glow: '0 0 30px rgba(79,111,241,0.8)', textColor: '#fff' }
  if (status === 'dream') return { bg: 'rgba(79,79,241,0.15)', border: '2px solid rgba(79,111,241,0.3)', glow: '0 0 20px rgba(79,79,241,0.3)', textColor: '#4f4ff1' }
  return { bg: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', glow: 'none', textColor: 'rgba(255,255,255,0.2)' }
}

const RoadmapPage = () => {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('gps')
  const [activeNode, setActiveNode] = useState(null) 
  
  const [milestones, setMilestones] = useState([])
  const [progress, setProgress] = useState(0)
  const [currentMission, setCurrentMission] = useState('Analyzing Profile...')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoadmap = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`${API}/api/roadmap/generate`, {
          headers: { 'x-auth-token': token }
        })
        const data = await response.json()

        if (response.ok && data.milestones) {
          console.log("ALIVE DATA FROM AI:", data);
          setMilestones(data.milestones)
          setProgress(data.progress)
          
          const active = data.milestones.find(m => m.status === 'current')
          if (active) {
            setCurrentMission(active.label)
            setActiveNode(active.id)
          }
        } else {
            console.error("Failed to load roadmap data:", data)
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoadmap()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

  const handleNodeClick = (node) => setActiveNode(prev => prev === node.id ? null : node.id)
  
const handleCTA = (milestone) => {
    // If it's the current mission or the dream mission, send them to ARTH with the prompt
    if (milestone.status === 'current' || milestone.status === 'dream') {
      navigate('/chat', { state: { autoPrompt: milestone.actionPrompt } });
    } 
    // If they click a completed milestone, let them see their general analysis
    else if (milestone.status === 'completed') {
      navigate('/analysis');
    }
  }

  const handleNavClick = (id) => {
    setActiveNav(id)
    if (id === 'arth') navigate('/chat')
    if (id === 'whatif') navigate('/whatif')
    if (id === 'insights') navigate('/analysis')
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#03050f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid rgba(149,215,228,0.2)', borderTopColor: '#95d7e4', borderRadius: '50%', marginBottom: '20px' }} />
        <p style={{ color: '#95d7e4', fontSize: '14px', letterSpacing: '1px' }}>AI is mapping your path...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#03050f', fontFamily: 'Be Vietnam Pro, sans-serif', color: '#fff', overflowX: 'hidden', position: 'relative' }}>
      
      {/* DOT GRID & GLOWS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(rgba(149,215,228,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(79,79,241,0.18) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(0,123,227,0.15) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      {/* TOP NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(3,5,15,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(79,111,241,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: '64px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #007be3, #4f4ff1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff' }}>Fin<span style={{ color: '#95d7e4' }}>GPS</span></span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/dashboard" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Dashboard</Link>
          <a href="#" style={{ fontSize: '14px', fontWeight: 700, color: '#95d7e4', textDecoration: 'none', borderBottom: '2px solid #95d7e4', paddingBottom: '2px' }}>Roadmap</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PageJump navigate={navigate} />
          <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
          >Log Out</motion.button>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f4ff1, #007be3)', border: '2px solid rgba(149,215,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>P</div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '96px', paddingBottom: '120px', minHeight: '100vh' }}>
        
        {/* PROGRESS HEADER */}
        <motion.header style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '1px', background: '#95d7e4' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#95d7e4' }}>Operational Status</span>
            </div>
            <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>The Financial Path</h1>
          </div>

          <div style={{ background: 'rgba(12,20,58,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(149,215,228,0.15)', borderTop: '1px solid rgba(149,215,228,0.25)', borderRadius: '20px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '28px', minWidth: '380px', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Overall Progress</span>
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em', color: '#95d7e4' }}>{progress}%</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #007be3, #95d7e4)', borderRadius: '99px' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Active Mission</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#95d7e4' }}>{currentMission}</span>
            </div>
          </div>
        </motion.header>

        {/* WINDING PATH MAP */}
        <div style={{ position: 'relative', width: '100%', height: '620px', maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid meet" fill="none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="40%" stopColor="#95d7e4" />
                <stop offset="100%" stopColor="#4f4ff1" />
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <motion.path d="M50 300C250 300 350 100 550 100C750 100 650 500 850 500C1050 500 1150 300 1350 300" stroke="url(#pathGradient)" strokeWidth="3" strokeDasharray="12 8" filter="url(#glow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }} />
          </svg>

          {/* SECTOR LABELS */}
          <motion.div style={{ position: 'absolute', top: '8px', left: '16px', opacity: 0.5 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.5, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ade80', display: 'block' }}>Sector 01</span>
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff' }}>Safety Net</span>
          </motion.div>
          <motion.div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 0.5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.5, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#95d7e4', display: 'block' }}>Sector 02</span>
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff' }}>Wealth Engine</span>
          </motion.div>
          <motion.div style={{ position: 'absolute', top: '8px', right: '16px', textAlign: 'right', opacity: 0.5 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.5, x: 0 }} transition={{ duration: 0.6, delay: 0.9 }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f4ff1', display: 'block' }}>Sector 03</span>
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff' }}>Dream Fund</span>
          </motion.div>

          {/* MILESTONE NODES */}
          {milestones.map((node, i) => {
            const ns = nodeStyle(node.status)
            const isActive = activeNode === node.id
            const isCurrent = node.status === 'current'
            const isCompleted = node.status === 'completed'
            const isDream = node.status === 'dream'
            const nodeSize = isCurrent || isDream ? 44 : 26

            return (
              <motion.div key={node.id} style={{ position: 'absolute', left: `${(node.x / 1400) * 100}%`, top: `${(node.y / 600) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: isCurrent ? 20 : 10, cursor: node.status === 'locked' ? 'not-allowed' : 'pointer' }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.15, ease: 'backOut' }}>
                
                {/* POPUP CARD */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div style={{ position: 'absolute', bottom: `${nodeSize / 2 + 20}px`, left: '50%', transform: 'translateX(-50%)', width: '300px', background: 'rgba(12,20,58,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(149,215,228,0.2)', borderTop: '1px solid rgba(149,215,228,0.35)', borderRadius: '20px', padding: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(79,111,241,0.15)', zIndex: 30, pointerEvents: 'all' }} initial={{ opacity: 0, y: 12, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                      <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', width: '1px', height: '20px', background: 'linear-gradient(to bottom, rgba(149,215,228,0.5), transparent)' }} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px', background: isCurrent ? 'rgba(149,215,228,0.15)' : isCompleted ? 'rgba(74,222,128,0.15)' : isDream ? 'rgba(79,79,241,0.15)' : 'rgba(255,255,255,0.08)', color: isCurrent ? '#95d7e4' : isCompleted ? '#4ade80' : isDream ? '#a78bfa' : 'rgba(255,255,255,0.4)', border: `1px solid ${isCurrent ? 'rgba(149,215,228,0.3)' : isCompleted ? 'rgba(74,222,128,0.3)' : 'rgba(79,79,241,0.3)'}` }}>
                          {isCurrent ? 'Current Mission' : isCompleted ? 'Completed' : isDream ? 'Your Destination' : 'Locked'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>#{String(node.id).padStart(2, '0')}</span>
                      </div>

                      <h3 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '8px' }}>{node.mission}</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '16px' }}>{node.desc}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                        {[{ label: 'Target', value: node.target, color: '#fff' }, { label: node.statLabel, value: node.stat, color: node.statColor }].map((s, i) => (
                          <div key={i} style={{ background: 'rgba(8,13,36,0.6)', borderRadius: '12px', padding: '10px 12px', border: '1px solid rgba(79,111,241,0.12)' }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>{s.label}</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.value}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button onClick={() => handleCTA(node)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: node.status === 'locked' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #1a6fe8, #4f4ff1)', border: node.status === 'locked' ? '1px solid rgba(255,255,255,0.1)' : 'none', color: node.status === 'locked' ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: '14px', fontWeight: 600, cursor: node.status === 'locked' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Be Vietnam Pro, sans-serif', boxShadow: node.status !== 'locked' ? '0 0 20px rgba(79,111,241,0.4)' : 'none' }} whileHover={node.status !== 'locked' ? { scale: 1.02, boxShadow: '0 0 30px rgba(79,111,241,0.6)' } : {}} whileTap={node.status !== 'locked' ? { scale: 0.97 } : {}}>
                        {node.cta}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div onClick={() => handleNodeClick(node)} style={{ width: `${nodeSize}px`, height: `${nodeSize}px`, borderRadius: '50%', background: ns.bg, border: ns.border, boxShadow: isActive ? `${ns.glow}, 0 0 0 4px rgba(149,215,228,0.15)` : ns.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isCurrent ? '18px' : '12px', color: ns.textColor, transition: 'box-shadow 0.2s', position: 'relative' }} whileHover={node.status !== 'locked' ? { scale: 1.25 } : { scale: 1.05 }} whileTap={{ scale: 0.9 }} animate={isCurrent ? { boxShadow: ['0 0 20px rgba(79,111,241,0.5)', '0 0 40px rgba(79,111,241,0.9)', '0 0 20px rgba(79,111,241,0.5)'] } : {}} transition={isCurrent ? { duration: 2, repeat: Infinity, repeatType: 'reverse' } : {}}>
                  {isCompleted && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#022c1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {isCurrent && '🚀'}
                  {node.status === 'locked' && <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)"><path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4"/></svg>}
                  {isDream && '⭐'}
                </motion.div>

                {!isActive && (
                  <div style={{ position: 'absolute', top: `${nodeSize + 6}px`, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: isCompleted ? '#4ade80' : isCurrent ? '#95d7e4' : isDream ? '#a78bfa' : 'rgba(255,255,255,0.25)' }}>
                    {node.label}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <motion.div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,12,32,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '99px', padding: '6px 8px', minWidth: '420px', border: '1px solid rgba(79,111,241,0.2)', boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 30px rgba(79,79,241,0.1)', gap: '4px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          return (
            <motion.button key={item.id} onClick={() => handleNavClick(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '99px', background: isActive ? 'rgba(149,215,228,0.12)' : 'transparent', border: isActive ? '1px solid rgba(149,215,228,0.25)' : '1px solid transparent', color: isActive ? '#95d7e4' : 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s' }} whileHover={{ color: isActive ? '#95d7e4' : 'rgba(255,255,255,0.8)', scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>{item.label}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

export default RoadmapPage