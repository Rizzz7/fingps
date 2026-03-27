import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

// ── ALL CARDS NOW USE #95d7e4 (cyan) AS ACCENT ──
// Changed: each feature's accent is now uniformly #95d7e4
const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: 'Financial DNA',
    title: 'Know your exact financial health score',
    desc: "Our AI analyses your income, savings, debt and investments to give you a personalised Financial DNA Score — your financial fingerprint.",
    accent: '#95d7e4',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: 'Smart Roadmap',
    title: '3-bucket wealth building system',
    desc: 'Safety Net → Wealth Engine → Dream Fund. A clear, step-by-step roadmap built around your goals and risk profile.',
    accent: '#95d7e4',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'What-If Engine',
    title: 'Simulate life events before they happen',
    desc: 'What if I lose my job? What if I buy a home? Simulate any financial scenario and see the impact on your roadmap instantly.',
    accent: '#95d7e4',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'India-First',
    title: 'Built for Indian financial reality',
    desc: 'UPI, SIPs, PPF, EPF, NPS, gold — FinGPS understands the Indian financial ecosystem natively. No generic global templates.',
    accent: '#95d7e4',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: 'Privacy First',
    title: 'Your data stays yours, always',
    desc: 'No bank linking required. You input what you want. Zero-knowledge architecture — we never store sensitive financial credentials.',
    accent: '#95d7e4',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: 'AI Advisor',
    title: 'ARTH — your personal finance mentor',
    desc: "Ask anything in plain Hindi or English. ARTH explains your score, answers questions, and gives you a clear next step — always.",
    accent: '#95d7e4',
  },
]

const Features = () => {
  return (
    <section id="features" className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(149,215,228,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(149,215,228,0.08)', border: '1px solid rgba(149,215,228,0.2)', color: '#95d7e4', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Features
          </span>
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Everything you need to{' '}
            <br className="hidden md:block" />
            <span className="text-gradient">own your finances</span>
          </h2>
          <p className="max-w-[500px] mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Powerful tools built for everyday Indians — from AI insights to a personalised roadmap — all in one place.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-7 cursor-pointer"
              variants={cardVariants}
              // ── INCREASED HOVER INTENSITY ──
              // y: -10 (was -6) — lifts higher
              // scale: 1.02 — subtle grow
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              style={{
                background: 'rgba(8, 13, 36, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(149,215,228,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                transition: 'border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
              }}
              // ── STRONGER GLOW ON HOVER ──
              // Border goes brighter, glow is more intense
              onMouseEnter={e => {
                e.currentTarget.style.border = '1px solid rgba(149,215,228,0.55)'
                e.currentTarget.style.background = 'rgba(8,13,36,0.80)'
                e.currentTarget.style.boxShadow = '0 28px 70px rgba(0,0,0,0.6), 0 0 40px rgba(149,215,228,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(149,215,228,0.12)'
                e.currentTarget.style.background = 'rgba(8,13,36,0.55)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'
              }}
            >
              {/* Icon — scales up on hover */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'rgba(149,215,228,0.12)',
                  color: '#95d7e4',
                  transition: 'transform 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.15)'
                  e.currentTarget.style.background = 'rgba(149,215,228,0.22)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'rgba(149,215,228,0.12)'
                }}
              >
                {f.icon}
              </div>

              <span className="text-xs font-semibold tracking-widest uppercase mb-3 block"
                style={{ color: '#95d7e4' }}>
                {f.tag}
              </span>
              <h3 className="text-lg font-semibold mb-3 leading-snug"
                style={{ letterSpacing: '-0.02em' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features