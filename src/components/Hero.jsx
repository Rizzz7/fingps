import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// FEATURE 4 — TWINKLING STARS
// Each star gets a random animation duration (2s–5s)
// and delay (0s–3s) so they all twinkle independently.
// We store these as part of the star object so they
// don't recalculate on every render.
// ─────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: Math.random() * 70,
  left: Math.random() * 100,
  size: Math.random() * 1.8 + 0.6,
  opacity: Math.random() * 0.55 + 0.15,
  // Random twinkle timing per star
  twinkleDuration: (Math.random() * 3 + 2).toFixed(1),  // 2s – 5s
  twinkleDelay: (Math.random() * 3).toFixed(1),           // 0s – 3s
}))

const BAR_HEIGHTS = [40, 55, 45, 70, 60, 80, 65, 90, 75, 95, 85, 100]

// ─────────────────────────────────────────────
// FEATURE 3 — TYPEWRITER EFFECT
// Custom hook that types out a string letter by letter.
// Returns the currently visible portion of the string.
// speed: ms between each character (lower = faster)
// startDelay: ms to wait before typing begins
// ─────────────────────────────────────────────
const useTypewriter = (text, speed = 60, startDelay = 800) => {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    // Wait for startDelay before beginning
    const delayTimer = setTimeout(() => {
      let i = 0
      const timer = setInterval(() => {
        // Add one more character each tick
        setDisplayed(text.slice(0, i + 1))
        i++
        // Stop when we've typed the full string
        if (i >= text.length) clearInterval(timer)
      }, speed)
      return () => clearInterval(timer)
    }, startDelay)

    return () => clearTimeout(delayTimer)
  }, [text, speed, startDelay])

  return displayed
}

// ─────────────────────────────────────────────
// FEATURE 7 — MARQUEE LOGOS
// A horizontally scrolling strip of logos.
// We duplicate the logos array so the scroll
// looks seamless — when the first set scrolls out,
// the duplicate is already right behind it.
// Pure CSS animation — no framer needed here.
// ─────────────────────────────────────────────
const LOGOS = [
  { name: 'GPay', icon: '🅖' },
  { name: 'PhonePe', icon: '📱' },
  { name: 'Paytm', icon: '💳' },
  { name: 'UPI', icon: '⚡' },
  { name: 'Visa', icon: '💠' },
  { name: 'RuPay', icon: '🇮🇳' },
  { name: 'BHIM', icon: '🏦' },
  { name: 'NetBanking', icon: '🔒' },
]

const MarqueeLogos = () => (
  // overflow-hidden clips the scrolling content
  <div className="w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
    {/* The inner track moves left continuously
        We use two copies so it loops seamlessly */}
    <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', width: 'max-content' }}>
      {/* First copy */}
      {[...LOGOS, ...LOGOS].map((logo, i) => (
        <div
          key={i}
          className="flex items-center gap-2 mx-6"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}
        >
          <span style={{ fontSize: '16px' }}>{logo.icon}</span>
          {logo.name}
        </div>
      ))}
    </div>

    {/* CSS keyframe injected inline — moves the track left by 50%
        (exactly one copy width) then jumps back to 0 seamlessly */}
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
)

// ─────────────────────────────────────────────
// FEATURE 6 — ROADMAP TOOLTIP
// Each roadmap item shows a glass tooltip on hover.
// We use a simple useState to track which item
// is currently hovered (null = none).
// The tooltip positions itself above the item.
// ─────────────────────────────────────────────
const ROADMAP_ITEMS = [
  {
    icon: '🛡️',
    name: 'Safety Net',
    status: 'In Progress',
    color: '#4ade80',
    tooltip: 'Build 3 months emergency fund + health insurance. You are 60% there!',
  },
  {
    icon: '📈',
    name: 'Wealth Engine',
    status: 'Locked',
    color: '#f87171',
    tooltip: 'Start SIP investments once Safety Net is complete. Unlock at level 4.',
  },
  {
    icon: '🌟',
    name: 'Dream Fund',
    status: 'Locked',
    color: '#f87171',
    tooltip: 'Goal-based savings for home, education or retirement. Unlocks at level 8.',
  },
]

const Hero = () => {
  // Track which roadmap item is hovered for tooltip
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Typewriter hook — types "Mapped Like GPS" starting after 800ms
  const typedText = useTypewriter('Mapped Like GPS', 55, 900)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 px-6">

      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: '#03050f' }}>

        {/* ── TWINKLING STARS ──
            Each star has its own twinkleDuration + twinkleDelay
            The twinkle CSS keyframe pulses opacity up and down
            giving each star its own rhythm */}
        {STARS.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              background: '#fff',
              // Each star gets unique timing — they never sync up
              animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
              opacity: s.opacity,
            }}
          />
        ))}

        {/* Twinkle keyframe — fades from full opacity to 20% and back */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: var(--star-opacity, 0.4); }
            50%       { opacity: 0.1; }
          }
        `}</style>

        {/* Glow layers */}
        <div className="absolute" style={{ top: '-15%', left: '-12%', width: '800px', height: '700px', background: 'radial-gradient(ellipse at 30% 30%, rgba(26,80,220,0.45) 0%, rgba(20,50,160,0.25) 35%, transparent 68%)', filter: 'blur(60px)' }} />
        <div className="absolute" style={{ top: '-5%', right: '-8%', width: '550px', height: '480px', background: 'radial-gradient(ellipse, rgba(30,60,180,0.20) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '10%', width: '760px', height: '420px', background: 'radial-gradient(ellipse at 50% 40%, rgba(60,110,230,0.14) 0%, rgba(79,79,241,0.08) 40%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Cloud / fog layers */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '52%', background: 'radial-gradient(ellipse 120% 80% at 50% 115%, rgba(8,12,32,0.98) 0%, transparent 62%), radial-gradient(ellipse 65% 50% at 15% 120%, rgba(6,10,28,0.90) 0%, transparent 58%), radial-gradient(ellipse 65% 50% at 85% 120%, rgba(6,10,28,0.90) 0%, transparent 58%)' }} />
        <div className="absolute" style={{ bottom: '-5%', left: '-12%', width: '68%', height: '54%', background: 'radial-gradient(ellipse 88% 68% at 38% 100%, rgba(10,16,42,0.97) 0%, rgba(8,13,35,0.78) 45%, transparent 70%)', filter: 'blur(20px)' }} />
        <div className="absolute" style={{ bottom: '-5%', right: '-12%', width: '68%', height: '54%', background: 'radial-gradient(ellipse 88% 68% at 62% 100%, rgba(10,16,42,0.97) 0%, rgba(8,13,35,0.78) 45%, transparent 70%)', filter: 'blur(20px)' }} />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '-3%', width: '85%', height: '50%', background: 'radial-gradient(ellipse 100% 82% at 50% 100%, rgba(12,18,48,0.97) 0%, rgba(9,14,38,0.72) 50%, transparent 72%)', filter: 'blur(24px)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '24%', background: 'linear-gradient(to top, rgba(3,5,15,1) 0%, transparent 100%)' }} />
      </div>

      {/* ── BADGE ── */}
      <motion.div className="relative z-10 mb-7"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}>
        <span className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full"
          style={{ background: 'rgba(79,79,241,0.12)', border: '1px solid rgba(79,79,241,0.3)', color: '#95d7e4' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#95d7e4] animate-pulse" />
          AI-Powered Financial Intelligence
        </span>
      </motion.div>

      {/* ── HEADING with TYPEWRITER ── */}
      <div className="relative z-10 text-center max-w-[860px]">
        <motion.h1
          className="font-bold leading-[1.08] mb-6"
          style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(52px, 8vw, 96px)', letterSpacing: '-0.04em', color: '#fff' }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}>

          {/* Static part of the heading */}
          Your Financial Life,{' '}

          {/* ── TYPEWRITER SPAN ──
              typedText grows from '' to 'Mapped Like GPS'
              The blinking cursor (|) shows while typing
              then disappears once the full text is shown
              We keep the text-gradient class so styling is preserved */}
          <span className="text-gradient">
            {typedText}
            {/* Cursor blinks while typing, hidden when done */}
            {typedText.length < 'Mapped Like GPS'.length && (
              <span style={{ animation: 'blink 0.7s step-end infinite', opacity: 1 }}>|</span>
            )}
          </span>
        </motion.h1>

        {/* Blink keyframe for the cursor */}
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
        `}</style>

        <motion.p className="mx-auto mb-10 font-light"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', maxWidth: '560px' }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}>
          India's first AI financial mentor. Understand where you are. Build where you're going. Every rupee, mapped.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.45 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/quiz" className="btn-primary text-base px-8 py-3.5" style={{ textDecoration: 'none' }}>
              Take the Quiz 
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 5.5L10.5 8l-4 2.5V5.5z" fill="currentColor"/></svg>
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div className="flex items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}>
          <div className="flex -space-x-2">
            {['#e879f9','#38bdf8','#4ade80','#fb923c','#a78bfa'].map((color, i) => (
              <motion.div key={i}
                className="w-8 h-8 rounded-full border-2 border-[#010204] flex items-center justify-center text-xs font-bold"
                style={{ background: color, zIndex: 5 - i }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.07 }}>
                {String.fromCharCode(65 + i)}
              </motion.div>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Trusted by <span className="text-white font-semibold">20,000+</span> Indians
          </p>
        </motion.div>

        {/* ── MARQUEE LOGOS ──
            Fades in below social proof after a short delay
            The MarqueeLogos component handles the scrolling internally */}
        <motion.div className="mt-10 w-full"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}>
          <p className="text-xs mb-4 text-center" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Works with
          </p>
          <MarqueeLogos />
        </motion.div>
      </div>

      {/* ── DASHBOARD PREVIEW CARD ── */}
      <motion.div className="relative z-10 mt-16 w-full max-w-[900px] mx-auto"
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}>
        <div className="rounded-2xl overflow-hidden" style={{
          background: '#0e0b0e',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,79,241,0.08)',
        }}>
          {/* Window bar */}
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="ml-4 flex-1 max-w-[260px] rounded-full px-3 py-1 text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
              app.fingps.in/dashboard
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score card with animated bars */}
            <div className="md:col-span-2 rounded-xl p-5" style={{
              background: 'linear-gradient(135deg, rgba(79,79,241,0.2), rgba(0,123,227,0.1))',
              border: '1px solid rgba(79,79,241,0.25)'
            }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Financial DNA Score</p>
              <motion.p className="text-3xl font-bold tracking-tight mb-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}>
                72 / 100
              </motion.p>
              <div className="flex items-end gap-1" style={{ height: '64px' }}>
                {BAR_HEIGHTS.map((h, i) => (
                  <motion.div key={i} className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? 'linear-gradient(to top, #4f4ff1, #95d7e4)' : 'rgba(255,255,255,0.1)',
                      originY: 1,
                    }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>
              <motion.div className="flex items-center gap-1 mt-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}>
                <span className="text-xs font-medium" style={{ color: '#4ade80' }}>▲ Good</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Room to grow</span>
              </motion.div>
            </div>

            {/* Stats column */}
            <div className="flex flex-col gap-4">
              <motion.div className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Safety Net</p>
                <p className="text-xl font-bold">₹45,000</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #007be3, #4f4ff1)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    viewport={{ once: true }} />
                </div>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>60% of goal</p>
              </motion.div>
              <motion.div className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.15 }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>ARTH says</p>
                <p className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  💡 Start a <span className="text-[#95d7e4] font-semibold">₹500/mo SIP</span> to reach your Dream Fund in 3 years
                </p>
              </motion.div>
            </div>

            {/* ── ROADMAP ROW WITH TOOLTIPS ──
                Each item is wrapped in a relative div so the tooltip
                can be absolutely positioned above it.
                onMouseEnter sets activeTooltip to the item index.
                onMouseLeave resets it to null. */}
            <motion.div className="md:col-span-3 rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}>
              <p className="text-xs font-semibold mb-4"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Your Roadmap Progress
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROADMAP_ITEMS.map((item, i) => (
                  // ── TOOLTIP WRAPPER ──
                  // position: relative so the tooltip can anchor to this div
                  // cursor: pointer invites interaction
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveTooltip(i)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* ── GLASS TOOLTIP ──
                        Only renders when this item is active (activeTooltip === i)
                        Positioned absolutely ABOVE the item (bottom: 100%)
                        The glass style matches your glass-card-strong pattern
                        AnimatePresence would be ideal here but to keep it simple
                        we use CSS opacity transition instead */}
                    {activeTooltip === i && (
                      <motion.div
                        className="absolute z-50 w-48 rounded-xl p-3 text-xs leading-relaxed"
                        style={{
                          bottom: 'calc(100% + 8px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(12,20,58,0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(79,111,241,0.35)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(79,111,241,0.15)',
                          color: 'rgba(255,255,255,0.8)',
                          pointerEvents: 'none',
                        }}
                        // Tooltip pops in from slightly below
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        {/* Small arrow pointing down */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '10px',
                          height: '10px',
                          background: 'rgba(12,20,58,0.95)',
                          border: '1px solid rgba(79,111,241,0.35)',
                          borderTop: 'none',
                          borderLeft: 'none',
                          rotate: '45deg',
                        }} />
                        <span style={{ color: item.color, fontWeight: 600 }}>{item.name}</span>
                        <br/>
                        {item.tooltip}
                      </motion.div>
                    )}

                    {/* The actual row item — same as before */}
                    <motion.div className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                        style={{ background: 'rgba(255,255,255,0.07)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,111,241,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.status}</p>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: item.color }}>
                        {item.status === 'In Progress' ? '●' : '○'}
                      </span>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fade bottom mask */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #010204)' }} />
      </motion.div>
    </section>
  )
}

export default Hero