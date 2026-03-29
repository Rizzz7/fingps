import React from 'react';

const plans = [
  {
    name: 'Bucket 01',
    price: 'Safety Net',
    period: '',
    desc: "Build a strong financial base to protect yourself from life's uncertainties.",
    features: ['Emergency fund (3–6 months expenses)', 'Insurance coverage (health + life)', 'Low-risk savings'],
    cta: 'Secure Your Base',
    highlighted: false,
    accent: 'rgba(59,130,246,0.3)',
  },
  {
    name: 'Bucket 02',
    price: 'Wealth Engine',
    period: '',
    desc: 'Grow your money consistently through disciplined, long-term investments.',
    features: ['SIPs / Mutual funds / Stocks', 'Long-term compounding', 'Retirement planning'],
    cta: 'Start Growing Wealth',
    highlighted: true,
    accent: '#8b5cf6',
    badge: '★ Core Focus',
  },
  {
    name: 'Bucket 03',
    price: 'Dream Fund',
    period: '',
    desc: 'Save and spend guilt-free on things that bring you genuine joy.',
    features: ['Travel goals', 'Lifestyle upgrades', 'Personal dreams'],
    cta: 'Fund Your Dreams',
    highlighted: false,
    accent: 'rgba(167,139,250,0.3)',
  },
];

const FinancialArchitecture = () => {
  return (
    // Kept id="pricing" so your navbar link still scrolls to this section correctly
    <section id="pricing" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(79,79,241,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Financial Architecture
          </span>
          <h2 className="font-bold mb-5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Your Money, Structured{' '}
            <span className="text-gradient">the Right Way</span>
          </h2>
          <p className="max-w-[460px] mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            A simple 3-bucket system to secure, grow, and enjoy your finances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className="relative rounded-2xl p-8 flex flex-col transition-all duration-300"
              style={{
                background: plan.highlighted ? 'rgba(12, 20, 58, 0.80)' : 'rgba(8, 13, 36, 0.52)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: plan.highlighted ? '1px solid rgba(79,111,241,0.45)' : '1px solid rgba(79,111,241,0.12)',
                boxShadow: plan.highlighted ? '0 0 60px rgba(26,70,220,0.22), 0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #007be3, #4f4ff1)', color: '#fff' }}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-7">
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: plan.highlighted ? '#95d7e4' : 'rgba(255,255,255,0.4)' }}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="font-bold" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(38px, 4.5vw, 48px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-base mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>}
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{plan.desc}</p>
              </div>
              <div className="mb-6 h-px" style={{ background: plan.highlighted ? 'rgba(79,79,241,0.3)' : 'rgba(255,255,255,0.07)' }} />
              <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: plan.highlighted ? 'rgba(79,79,241,0.3)' : 'rgba(255,255,255,0.07)' }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={plan.highlighted ? '#95d7e4' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className={`w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                style={plan.highlighted ? {} : { display: 'block' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinancialArchitecture;