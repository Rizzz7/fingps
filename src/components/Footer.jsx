import { motion } from 'framer-motion'

// ─────────────────────────────────────────────
// ANIMATION THEORY FOR THIS FILE:
//
// CONCEPT: REVEAL FROM BORDER UP
// The footer sits at the very bottom of the page.
// Instead of a simple fade, we use a combination of
// the border-top line "drawing" in + content fading.
// This makes the footer feel like it's being revealed
// as you reach the bottom — a satisfying page ending.
//
// CONCEPT: LINK HOVER WITH COLOR TRANSITION
// Footer links use CSS transition for color change.
// We don't use framer here — CSS is better for
// simple color/opacity transitions on text.
// Rule of thumb: framer for transforms (move, scale, rotate)
//                CSS for color, opacity, text changes
//
// CONCEPT: STATUS INDICATOR PULSE
// The green "operational" dot uses Tailwind's
// animate-ping (CSS) not framer — it's already
// built-in and perfect for this use case.
// ─────────────────────────────────────────────

const Footer = () => {
  const links = {
    Product: ['Features', 'How it works', 'Pricing', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security'],
    Support: ['Help Centre', 'Community', 'ARTH AI'],
  }

  // ── VARIANTS for link columns ──
  // Each column fades + rises in sequence
  const colVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  }
  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <footer className="relative px-6 pt-16 pb-10" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>

      {/* ── BORDER LINE DRAWS IN ──
          scaleX: 0 → 1 with originX: 0 draws the line left to right
          This is the same technique as the connector lines in HowItWorks
          but horizontal instead of vertical */}
      <motion.div
        className="mb-16"
        style={{ borderTop: '1px solid rgba(79,111,241,0.12)' }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      />

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

          {/* ── BRAND COLUMN ──
              Slides up as one block — brand + description + socials */}
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #007be3, #4f4ff1)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white font-bold text-[17px] tracking-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                FinGPS
              </span>
            </a>

            <p className="text-sm leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '240px' }}>
              India's first AI-powered financial mentor. Know where you are. Build where you're going.
            </p>

            {/* Social icons — stagger in with scale pop */}
            <div className="flex gap-3">
              {[
                { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.735l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LI', path: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.5 6.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1 2.5v4h2V9h-2zm3 0v4h2v-2c0-.828.672-1.5 1.5-1.5S12.5 10.172 12.5 11v2h2v-2a3.5 3.5 0 0 0-3.5-3.5c-.695 0-1.34.205-1.88.557A.5.5 0 0 0 9 8.5h-2a.5.5 0 0 0-.5.5z' },
                { label: 'GH', path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' },
              ].map((s, i) => (
                <motion.a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08, ease: 'backOut' }}
                  viewport={{ once: true }}
                  // CSS handles the color change on hover — framer for scale
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(79,79,241,0.2)' }}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="rgba(255,255,255,0.6)">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── LINK COLUMNS ──
              Each column uses variants for stagger
              Columns themselves stagger via delay based on index */}
          {Object.entries(links).map(([group, items], colIndex) => (
            <motion.div
              key={group}
              variants={colVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              // Each column starts slightly after the previous
              transition={{ delayChildren: 0.2 + colIndex * 0.07 }}
            >
              <motion.p
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                variants={linkVariants}
              >
                {group}
              </motion.p>
              <ul className="space-y-3">
                {items.map(item => (
                  <motion.li key={item} variants={linkVariants}>
                    {/* CSS transition for color — framer not needed here */}
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── BOTTOM BAR ──
            Fades in last — after all the columns above */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 FinGPS. Made for Bharat 🇮🇳
          </p>

          {/* ── STATUS INDICATOR ──
              Two layered dots: outer ping (Tailwind animate-ping)
              creates a ripple, inner dot is solid.
              This is a pure CSS animation — no framer needed.
              Great example of knowing WHEN NOT to use framer. */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"
                style={{ boxShadow: '0 0 6px #4ade80' }} />
            </span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer