import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from "../lib/api";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i, top: Math.random() * 100, left: Math.random() * 100,
  size: Math.random() * 1.8 + 0.6, opacity: Math.random() * 0.4 + 0.1,
  twinkleDuration: (Math.random() * 3 + 2).toFixed(1), twinkleDelay: (Math.random() * 3).toFixed(1),
}))

const AppInput = ({ label, placeholder, icon, type = 'text', value, onChange }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{label}</label>}
      <div style={{ position: 'relative', width: '100%' }}>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} style={{ position: 'relative', zIndex: 10, width: '100%', height: '52px', borderRadius: '12px', background: 'rgba(8,13,36,0.6)', border: '1px solid rgba(79,111,241,0.20)', padding: '0 44px 0 16px', color: '#fff', fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 400, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} onFocus={e => { e.target.style.borderColor = 'rgba(149,215,228,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(149,215,228,0.08)' }} onBlur={e => { e.target.style.borderColor = 'rgba(79,111,241,0.20)'; e.target.style.boxShadow = 'none' }} />
        {isHovering && (
          <>
            <div style={{ position: 'absolute', pointerEvents: 'none', top: 0, left: 0, right: 0, height: '2px', zIndex: 20, borderRadius: '12px 12px 0 0', overflow: 'hidden', background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, #95d7e4 0%, transparent 70%)` }} />
            <div style={{ position: 'absolute', pointerEvents: 'none', bottom: 0, left: 0, right: 0, height: '2px', zIndex: 20, borderRadius: '0 0 12px 12px', overflow: 'hidden', background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, #95d7e4 0%, transparent 70%)` }} />
          </>
        )}
        {icon && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, color: 'rgba(255,255,255,0.3)' }}>{icon}</div>}
      </div>
    </div>
  )
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  // ── THE BACKEND CONNECTION (REGISTER) ──
  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const response = await fetch(`${API}/api/auth/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Registration Success:', data)
        navigate('/login') // Send to login on success
      } else {
        setErrorMessage(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setErrorMessage('Could not connect to server. Is your backend running?')
    }
  }

  const socialIcons = [
    { label: 'Google', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
    { label: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/></svg> },
    { label: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z"/></svg> },
  ]

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#03050f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'Be Vietnam Pro, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {STARS.map(s => <div key={s.id} style={{ position: 'absolute', top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity, animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite` }} />)}
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(79,79,241,0.3) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(0,123,227,0.2) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.05; } } ::placeholder { color: rgba(255,255,255,0.25); font-family: 'Inter', sans-serif; }`}</style>

      <motion.div style={{ background: 'rgba(8,12,32,0.75)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(79,111,241,0.22)', borderRadius: '24px', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(79,111,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)', width: '100%', maxWidth: '880px', height: '580px', display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
        
        <div style={{ width: '100%', flex: '1', padding: '48px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div style={{ position: 'absolute', pointerEvents: 'none', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,111,241,0.18) 0%, rgba(0,123,227,0.12) 40%, rgba(149,215,228,0.06) 70%, transparent 100%)', filter: 'blur(60px)', transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`, transition: 'transform 0.1s ease-out', opacity: isHovering ? 1 : 0, zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div className="flex items-center gap-2.5 mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #007be3, #4f4ff1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff' }}>Fin<span style={{ color: '#95d7e4' }}>GPS</span></span>
            </motion.div>

            <motion.h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginBottom: '6px' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>Sign Up</motion.h1>
            <motion.p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>Create your FinGPS account</motion.p>

            <motion.div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              {socialIcons.map((s, i) => (
                <motion.a key={i} href="#" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(79,111,241,0.2)', borderColor: 'rgba(149,215,228,0.4)' }} whileTap={{ scale: 0.93 }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.3 + i * 0.08, ease: 'backOut' }}>{s.icon}</motion.a>
              ))}
            </motion.div>

            <motion.div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>or use your account</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </motion.div>

            <motion.form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              
              {errorMessage && (
                <div style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', background: 'rgba(248, 113, 113, 0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                  {errorMessage}
                </div>
              )}

              <AppInput placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
              <AppInput placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <AppInput placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} icon={<button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>{showPassword ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>}</button>} />

              <motion.button type="submit" className="btn-primary w-full justify-center" style={{ fontSize: '15px', padding: '14px', borderRadius: '12px', marginTop: '4px', position: 'relative', overflow: 'hidden' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', transform: 'skew(-13deg) translateX(-100%)', transition: 'transform 0.8s ease', pointerEvents: 'none' }} onMouseEnter={e => e.currentTarget.style.transform = 'skew(-13deg) translateX(100%)'}><span style={{ position: 'relative', width: '32px', height: '100%', background: 'rgba(255,255,255,0.15)' }} /></span>
                Sign Up
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.button>
            </motion.form>

            <motion.p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '20px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
              Already have an account? <Link to="/login" style={{ color: '#95d7e4', textDecoration: 'none', fontWeight: 500 }}>Log In →</Link>
            </motion.p>
          </div>
        </div>

        <motion.div style={{ width: '48%', flexShrink: 0, background: 'linear-gradient(145deg, rgba(10,16,50,0.9) 0%, rgba(4,8,28,0.95) 100%)', borderLeft: '1px solid rgba(79,111,241,0.15)', display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', position: 'relative', overflow: 'hidden' }} className="lg:flex" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(79,79,241,0.25) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'radial-gradient(ellipse, rgba(0,123,227,0.2) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.div style={{ width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 24px', background: 'linear-gradient(135deg, #007be3, #4f4ff1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(79,111,241,0.4)' }} animate={{ boxShadow: ['0 0 30px rgba(79,111,241,0.3)', '0 0 60px rgba(79,111,241,0.5)', '0 0 30px rgba(79,111,241,0.3)'] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}>
              <svg width="36" height="36" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
            <h2 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginBottom: '10px' }}>Your money, <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #7dd8f0 45%, #4f6ef1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>mapped.</span></h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto 32px' }}>India's first AI financial mentor. Know where you stand. Build where you're going.</p>
            {[
              { label: 'Financial DNA Score', value: '72/100', color: '#95d7e4' },
              { label: 'Safety Net Progress', value: '60%', color: '#4ade80' },
              { label: 'Next milestone', value: 'Start SIP', color: '#a78bfa' },
            ].map((stat, i) => (
              <motion.div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', marginBottom: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{stat.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUpPage