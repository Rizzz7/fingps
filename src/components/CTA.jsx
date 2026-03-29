import { motion } from 'framer-motion'

// ─────────────────────────────────────────────
// ANIMATION THEORY FOR THIS FILE:
//
// NEW CONCEPT: ANIMATE PRESENCE / SCALE ENTRANCE
// The CTA card uses scale: 0.94 → 1 combined with
// opacity and y. This makes it feel like it "expands"
// into view — more dramatic than a plain fade.
// Good for hero-level CTAs where you want impact.
//
// NEW CONCEPT: INFINITE PULSE ANIMATION
// The glow orb behind the heading uses:
// animate with repeat: Infinity + repeatType: 'reverse'
// This bounces the animation back and forth forever.
// Use this for subtle ambient effects — never on text
// or important UI elements (gets distracting fast).
//
// NEW CONCEPT: BUTTON PRESS FEEDBACK
// whileTap: { scale: 0.96 } gives physical press feedback.
// Combined with whileHover: { scale: 1.04 } it feels
// like a real button. This should be on EVERY button
// across the whole site — it's the cheapest UX win.
// ─────────────────────────────────────────────

const CTA = () => {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* ── CARD ENTRANCE ──
            scale: 0.94 → 1 makes it feel like it expands into view
            Combined with y: 40 → 0 for a slight upward float
            delay: 0.1 gives the page a moment to settle first */}
        <motion.div
          className="relative rounded-3xl px-8 py-20 text-center overflow-hidden"
          style={{
            background: 'rgba(8,14,42,0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(79,111,241,0.25)',
            boxShadow: '0 0 80px rgba(26,70,220,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* ── STATIC GLOW EFFECTS ── */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(26,80,220,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[250px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(26,80,220,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(100,160,240,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          {/* ── INFINITE PULSE GLOW ──
              This orb pulses its opacity and scale forever.
              repeat: Infinity = loops forever
              repeatType: 'reverse' = ping-pong (forward then backward)
              duration: 3 = slow pulse — any faster feels jittery
              This creates a "breathing" ambient glow effect */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(79,79,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />

          <div className="relative z-10">

            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-7"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Start Your Journey
            </motion.span>

            {/* Heading */}
            <motion.h2
              className="font-bold mb-5 mx-auto"
              style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: '700px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Map your financial future{' '}
              <span className="text-gradient">today</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              className="text-base mb-10 mx-auto"
              style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '480px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Join thousands of Indians who have taken the 2-minute quiz and got their personalised financial roadmap. Free forever.
            </motion.p>

            {/* ── BUTTONS ──
                Each button has whileHover scale up + whileTap scale down.
                This pattern should be on every clickable element.
                The motion.div wrapper is needed because <a> tags
                don't natively support framer motion props in all cases */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#"
                className="btn-primary text-base px-9 py-3.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                Take the Quiz 🎯
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>

              <motion.a
                href="#"
                className="btn-secondary text-base px-9 py-3.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                Talk to ARTH 🤖
              </motion.a>
            </motion.div>

            {/* Fine print */}
            <motion.p
              className="text-xs mt-6"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Free forever plan available · No credit card needed · Made for Bharat 🇮🇳
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA