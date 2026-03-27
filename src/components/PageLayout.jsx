import DarkVeil from '../components/DarkVeil'

const PageLayout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#03050f', color: '#fff', fontFamily: 'Be Vietnam Pro, sans-serif' }}>

      {/* ── DARK VEIL — fixed full screen background, behind everything ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        opacity: 0.35,
      }}>
        <DarkVeil
          speed={0.4}
          hueShift={210}
          noiseIntensity={0.02}
          scanlineIntensity={0}
          warpAmount={0.3}
          resolutionScale={0.8}
        />
      </div>

      {/* ── Dark overlay to keep text readable ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(3,5,15,0.55) 0%, rgba(1,2,4,0.65) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Dot grid — exact from index.css body::before but as a layer ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      {/* ── Page content sits above everything ── */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>

    </div>
  )
}

export default PageLayout
