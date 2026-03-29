import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ─────────────────────────────────────────────
// ANIMATION THEORY FOR THIS FILE:
//
// NEW CONCEPT: useInView hook
// Instead of putting whileInView on a motion element,
// useInView gives us a boolean (true/false) we can use
// in regular JS logic — perfect for count-up numbers
// since those need a useEffect + setInterval, not just CSS.
//
// THE COUNT-UP TRICK:
// When useInView becomes true, we start a setInterval
// that increments the displayed number every few ms
// until it reaches the target. Feels like a live counter.
//
// We also use a custom hook (useCountUp) so we don't
// repeat the same logic for each of the 4 stats.
// ─────────────────────────────────────────────

// ── CUSTOM HOOK: useCountUp ──
// Accepts a target number + whether to start
// Returns the current animated value
// duration controls how long the count-up takes (ms)
const useCountUp = (target, shouldStart, duration = 1800) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Don't start until the element is in view
    if (!shouldStart) return

    let startTime = null
    const startValue = 0

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      // How far through the animation are we? (0 to 1)
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // easeOut formula: fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * (target - startValue) + startValue))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }

    requestAnimationFrame(step)
  }, [shouldStart, target, duration])

  return count
}

// ── STAT DATA (UPDATED FOR IMPACT) ──
// rawValue: the actual number to count up to
// prefix/suffix: characters to add around the number (₹, +, %)
// label + desc: text below the number
const stats = [
  { rawValue: 30, suffix: '%', label: 'Optimised Savings', desc: 'Found via AI spending analysis' },
  { rawValue: 3, suffix: '', label: 'Strategic Buckets', desc: 'Simplifying complex wealth building' },
  { rawValue: 24, suffix: '/7', label: 'AI Mentorship', desc: 'Real-time guidance, zero jargon' },
  { rawValue: 100, suffix: '%', label: 'Financial Clarity', desc: 'Every single rupee, mapped' },
]

// ── SINGLE STAT ITEM ──
// Separated into its own component so each stat
// gets its own useInView ref and triggers independently
const StatItem = ({ stat, index }) => {
  const ref = useRef(null)

  // useInView returns true the moment this element
  // enters the viewport. once:true = only trigger once.
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Start counting when isInView becomes true
  const count = useCountUp(
    stat.rawValue,
    isInView,
    1600 + index * 100  // slight delay per stat for stagger feel
  )

  return (
    // motion.div for the fade-in entrance
    // ref is attached here so useInView can watch it
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      {/* ── THE COUNT-UP NUMBER ──
          prefix + animated count + suffix
          The gradient text style is the same as Stats.jsx original */}
      <p
        className="font-bold mb-1"
        style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 'clamp(36px, 5vw, 56px)',
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #fff 0%, #95d7e4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {stat.prefix || ''}{count}{stat.suffix}
      </p>
      <p className="text-base font-semibold mb-1">{stat.label}</p>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.desc}</p>
    </motion.div>
  )
}

const Stats = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* ── GLASS CARD CONTAINER ──
            The whole card fades in as one unit first,
            then each stat inside animates individually */}
        <motion.div
          className="rounded-2xl p-12 md:p-16 relative overflow-hidden"
          style={{
            background: 'rgba(8,13,38,0.60)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(79,111,241,0.18)',
            boxShadow: '0 0 60px rgba(26,70,200,0.10), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          // scale: 0.98 → 1 is subtle but makes the card
          // feel like it "materialises" rather than just fading in
        >
          {/* Top glow inside the card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(26,80,220,0.18) 0%, transparent 60%)' }}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {stats.map((s, i) => (
              <StatItem key={i} stat={s} index={i} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Stats