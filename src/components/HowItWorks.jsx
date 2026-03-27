import { motion } from 'framer-motion'

// ── ALL STEPS NOW USE #95d7e4 (light blue) CONSISTENTLY ──
// Changed: color field is now #95d7e4 for all 4 steps
const steps = [
  { number: '01', title: 'Take the 8-question quiz', desc: 'Answer simple questions about your income, savings, goals and spending habits. No bank linking needed — just honest answers.', color: '#95d7e4' },
  { number: '02', title: 'Get your Financial DNA Score', desc: 'Our AI analyses your answers and generates a personalised score — showing exactly where you stand financially right now.', color: '#95d7e4' },
  { number: '03', title: 'Get your 3-bucket roadmap', desc: 'Receive a clear Safety Net → Wealth Engine → Dream Fund roadmap with specific, achievable milestones tailored to your life.', color: '#95d7e4' },
  { number: '04', title: 'Track progress with ARTH', desc: 'Your AI advisor ARTH guides you step by step, answers questions, simulates scenarios, and celebrates every milestone you hit.', color: '#95d7e4' },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, rgba(149,215,228,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse, rgba(149,215,228,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="max-w-[1200px] mx-auto">

        {/* ── CENTERED HEADER — same structure as Features section ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(149,215,228,0.08)', border: '1px solid rgba(149,215,228,0.2)', color: '#95d7e4', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            How it works
          </span>
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            From quiz to roadmap in{' '}
            <span className="text-gradient">2 minutes</span>
          </h2>
          <p className="max-w-[500px] mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            No complicated setup. No bank linking. Just answer 8 honest questions and FinGPS builds your complete financial roadmap.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT COLUMN — steps only, heading moved above */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            {/* Numbered steps */}
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex gap-5"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col items-center">
                    {/* ── NUMBER CIRCLE — all consistently #95d7e4 ── */}
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: 'rgba(149,215,228,0.12)',
                        border: '2px solid rgba(149,215,228,0.35)',
                        color: '#95d7e4',
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.15, ease: 'backOut' }}
                      viewport={{ once: true }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Connector line — same light blue tint */}
                    {i < steps.length - 1 && (
                      <motion.div
                        className="w-px flex-1 mt-2"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(149,215,228,0.25), rgba(149,215,228,0.05))',
                          minHeight: '28px',
                          originY: 0,
                        }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.4, delay: 0.55 + i * 0.15, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>

                  <div className="pb-2">
                    <h3 className="text-base font-semibold mb-1.5" style={{ letterSpacing: '-0.02em' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl overflow-hidden" style={{
              background: 'rgba(8,13,36,0.62)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(149,215,228,0.15)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(149,215,228,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-semibold">Your Financial DNA</span>
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(149,215,228,0.15)', color: '#95d7e4' }}>Score: 72</span>
              </div>

              <div className="p-6 space-y-5">
                {/* Donut chart */}
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#95d7e4" strokeWidth="3"
                        strokeDasharray="50 50" strokeLinecap="round"
                        style={{ animation: 'drawArc 1s ease-out 0.8s both' }}/>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#007be3" strokeWidth="3"
                        strokeDasharray="25 75" strokeDashoffset="-50" strokeLinecap="round"
                        style={{ animation: 'drawArc 1s ease-out 1s both' }}/>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4f4ff1" strokeWidth="3"
                        strokeDasharray="15 85" strokeDashoffset="-75" strokeLinecap="round"
                        style={{ animation: 'drawArc 1s ease-out 1.2s both' }}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold">72%</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>score</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Safety Net', pct: '60%', color: '#95d7e4' },
                      { label: 'Wealth Engine', pct: '25%', color: '#007be3' },
                      { label: 'Dream Fund', pct: '15%', color: '#4f4ff1' },
                    ].map((item, i) => (
                      <motion.div key={item.label} className="flex items-center gap-2.5"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                        viewport={{ once: true }}>
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                        <span className="text-xs font-semibold">{item.pct}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bar chart */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(8,13,36,0.5)', border: '1px solid rgba(149,215,228,0.1)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Monthly Savings</span>
                    <span className="text-sm font-bold" style={{ color: '#95d7e4' }}>+₹12,500</span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[55,70,45,80,65,90,75,100,85,95,80,92].map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i >= 10 ? 'linear-gradient(to top, #95d7e4, #4f4ff1)' : 'rgba(255,255,255,0.1)',
                          originY: 1,
                        }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.45, delay: 0.6 + i * 0.04, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                </div>

                {/* AI tip */}
                <motion.div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: 'rgba(149,215,228,0.07)', border: '1px solid rgba(149,215,228,0.18)' }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(149,215,228,0.2)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2a7 7 0 017 7c0 2.5-1.3 4.7-3.3 6l-.7.5V17H9v-1.5l-.7-.5A7 7 0 0112 2zm-1 17h2v2h-2v-2z" fill="#95d7e4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#95d7e4' }}>ARTH says</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Start a ₹500/mo SIP in Nifty 50 index fund to unlock your Wealth Engine milestone.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(149,215,228,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes drawArc {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  )
}

export default HowItWorks