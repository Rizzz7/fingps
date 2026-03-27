import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(3,5,15,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(160%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(79,111,241,0.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 40px rgba(3,5,15,0.6)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #007be3, #4f4ff1)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-[17px] tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            FinGPS
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'Testimonials'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
          >
            Log in
          </Link>
          <Link to="/quiz" className="btn-primary text-sm py-2.5 px-5" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2" style={{ background: 'rgba(1,2,4,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Features', 'How it works', 'Pricing', 'Testimonials'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="block py-3 text-sm font-medium border-b"
              style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.06)' }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-5">
            <a href="#" className="btn-secondary text-sm justify-center">Log in</a>
            <a href="#" className="btn-primary text-sm justify-center">Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
