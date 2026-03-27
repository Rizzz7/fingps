import { motion } from 'framer-motion'

// ─────────────────────────────────────────────
// ANIMATION THEORY FOR THIS FILE:
//
// NEW CONCEPT: 2D STAGGER
// In Features.jsx we staggered a flat list (1,2,3,4,5,6).
// Here the cards are in a MASONRY grid (3 columns).
// So we stagger by COLUMN first, then by ROW within column.
// Card at column 0 row 0 → delay 0
// Card at column 1 row 0 → delay 0.15
// Card at column 2 row 0 → delay 0.30
// Card at column 0 row 1 → delay 0.10  (row offset)
// This makes columns appear left-to-right, rows top-to-bottom.
//
// NEW CONCEPT: whileHover with borderColor
// Framer CAN'T animate border-color directly (it's a CSS shorthand).
// But it CAN animate boxShadow and scale.
// So we use framer for the lift + glow, and keep onMouseEnter
// only for the border color change. Best of both worlds.
//
// NEW CONCEPT: LAYOUT ANIMATION
// The masonry layout uses CSS columns. We add layout prop
// to each card so framer tracks its position — if the layout
// ever shifts (e.g. responsive resize), cards smoothly
// animate to their new position instead of jumping.
// ─────────────────────────────────────────────

const testimonials = [
  { name: 'Priya Sharma', role: 'Marketing Manager, Mumbai', avatar: 'PS', avatarColor: '#e879f9', text: 'FinGPS completely changed how I think about money. I never knew I was only 3 milestones away from financial freedom. The roadmap made it so clear and achievable.', stars: 5 },
  { name: 'Rahul Verma', role: 'Software Engineer, Bangalore', avatar: 'RV', avatarColor: '#38bdf8', text: "I've tried every budgeting app. FinGPS is the only one that actually tells me what to DO next — not just what I spent. ARTH feels like a real financial advisor.", stars: 5 },
  { name: 'Ananya Iyer', role: 'Freelance Designer, Chennai', avatar: 'AI', avatarColor: '#4ade80', text: 'The What-If Engine is mind-blowing. I simulated buying a home, having a baby, and losing my job — all in 5 minutes. Now I feel actually prepared.', stars: 5 },
  { name: 'Vikram Nair', role: 'Startup Founder, Hyderabad', avatar: 'VN', avatarColor: '#fb923c', text: 'As a founder with irregular income, FinGPS was the first tool that actually handled my financial reality. The Safety Net bucket strategy alone saved me during a rough month.', stars: 5 },
  { name: 'Meera Joshi', role: 'Teacher, Pune', avatar: 'MJ', avatarColor: '#a78bfa', text: 'I used to feel so lost about money. After the 8-question quiz, I finally understood my finances. The score made it tangible. Now I check my roadmap every week.', stars: 5 },
  { name: 'Arjun Kapoor', role: 'CA, Delhi', avatar: 'AK', avatarColor: '#f472b6', text: 'Even as a finance professional, the Financial DNA Score surfaced blind spots in my personal finances. The India-first approach — PPF, NPS, SIPs — is spot on.', stars: 5 },
]

// ── STAR ROW ──
const Stars = ({ count }) => (
  <div className="flex gap-0.5 mb-4">
    {Array.from({ length: count }).map((_, i) => (
      // Each star scales in with a tiny stagger — subtle but premium
      <motion.svg
        key={i}
        width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: i * 0.05, ease: 'backOut' }}
        viewport={{ once: true }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </motion.svg>
    ))}
  </div>
)

// ── SINGLE CARD ──
// Separated so each card gets its own animation logic cleanly
const TestimonialCard = ({ t, index }) => {
  // ── 2D STAGGER CALCULATION ──
  // 3 columns → column = index % 3 (0,1,2,0,1,2...)
  // row within column = Math.floor(index / 3)
  // Final delay = column * 0.15 + row * 0.1
  // This makes col 0 appear first, then col 1, then col 2
  // and within each column, top card before bottom card
  const col = index % 3
  const row = Math.floor(index / 3)
  const delay = col * 0.15 + row * 0.1

  return (
    <motion.div
      // layout prop: if this card's position changes (e.g. on resize)
      // framer will smoothly animate it to the new position
      layout
      className="break-inside-avoid rounded-2xl p-7 mb-5 cursor-default"
      style={{
        background: 'rgba(8,13,36,0.52)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(79,111,241,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      // ── ENTRANCE ANIMATION ──
      // Cards come from slightly below + fade in
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}

      // ── HOVER: framer handles lift + glow ──
      // We use a custom boxShadow string for the glow effect
      whileHover={{
        y: -5,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(79,111,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: { duration: 0.2 }
      }}

      // ── HOVER: onMouseEnter only for border color ──
      // framer can't animate border shorthand directly
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(79,111,241,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(79,111,241,0.12)'
      }}
    >
      <Stars count={t.stars} />

      {/* Quote text fades in slightly after the card */}
      <motion.p
        className="text-sm leading-relaxed mb-6"
        style={{ color: 'rgba(255,255,255,0.7)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        viewport={{ once: true }}
      >
        "{t.text}"
      </motion.p>

      {/* Avatar + name row slides up last */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
        viewport={{ once: true }}
      >
        {/* ── AVATAR CIRCLE ──
            scale: 0 → 1 with backOut = satisfying pop
            Same pattern as the step number circles in HowItWorks */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            background: t.avatarColor + '22',
            color: t.avatarColor,
            border: `1px solid ${t.avatarColor}44`,
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.35, ease: 'backOut' }}
          viewport={{ once: true }}
        >
          {t.avatar}
        </motion.div>

        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.role}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-28 px-6 overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(26,70,200,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(26,70,200,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1200px] mx-auto">

        {/* ── SECTION HEADER ──
            Slides up + fades in as one block
            The heading and subtext animate together — no need
            to animate every line separately when they're this close */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Testimonials
          </span>
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Loved by Indians who{' '}
            <span className="text-gradient">took control</span>
          </h2>
          <p className="max-w-[460px] mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Join 20,000+ Indians who have mapped their financial future with FinGPS.
          </p>
        </motion.div>

        {/* ── MASONRY GRID ──
            CSS columns handles the masonry layout.
            Each card inside handles its own animation via TestimonialCard.
            We wrap in motion.div with layout so the whole grid
            can smoothly reflow if needed */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default Testimonials