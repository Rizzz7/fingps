import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../lib/api";

// ── PERSONA ENGINE ──
const getPersonaProfile = (answers) => {
  if (!answers || answers.length === 0) return null;
  const p = answers[0];
  const personas = [
    { stage: "Student", emoji: "🎓", label: "The Ambitious Starter", color: "#95d7e4", accent: "rgba(149,215,228,0.12)", border: "rgba(149,215,228,0.28)", tagline: "Building foundations before the race begins" },
    { stage: "Early Career", emoji: "🚀", label: "The Rising Builder", color: "#4ade80", accent: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.28)", tagline: "Momentum is everything at this stage" },
    { stage: "Mid-Career", emoji: "⚡", label: "The Power Accumulator", color: "#fbbf24", accent: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.28)", tagline: "Prime years for compounding wealth" },
    { stage: "Pre-Retirement", emoji: "🏔️", label: "The Summit Approacher", color: "#c084fc", accent: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.28)", tagline: "Protecting and securing what you've built" },
  ];
  return personas[p] ?? personas[0];
};

const getScoreGrade = (score) => {
  if (score >= 88) return { grade: "Elite",       color: "#4ade80", percentile: "Top 5%"  };
  if (score >= 75) return { grade: "Strong",      color: "#95d7e4", percentile: "Top 20%" };
  if (score >= 60) return { grade: "Developing",  color: "#fbbf24", percentile: "Top 45%" };
  if (score >= 45) return { grade: "Building",    color: "#fb923c", percentile: "Top 65%" };
  return             { grade: "Starting Out", color: "#f87171", percentile: "Top 80%" };
};

// ── PRE-RECORDED INSIGHTS BY SCORE RANGE ──
const getInsightsByScore = (score) => {
  if (score >= 90) {
    return {
      strengths: [
        "Exceptional financial discipline — you consistently spend less than you earn and invest the difference with clear purpose",
        "Your emergency runway is solid, giving you the freedom to take calculated risks without fear of a single bad month derailing you",
        "You think in decades, not months — your compounding habits are already working silently and powerfully in your favour",
      ],
      growthAreas: [
        "At this level, tax optimisation (ELSS, NPS, HRA structuring) is your biggest untapped lever — most high scorers leave lakhs on the table here",
        "Consider diversifying into international index funds or REITs to reduce India-concentration risk in your portfolio",
        "Estate planning and nominee hygiene are often ignored at your stage — don't wait until it becomes urgent to address them",
      ],
    };
  }
  if (score >= 80) {
    return {
      strengths: [
        "You have a strong savings habit and your investments are already working — you're in the top tier of financial awareness for your age group",
        "Your debt-to-income relationship is healthy, which gives you significant room to accelerate wealth building without pressure",
        "You've moved past survival mode — you're making proactive, forward-looking financial decisions that most people never reach",
      ],
      growthAreas: [
        "Push your SIP amount up by even 10% this year — at your income stage, that compounding gap grows dramatically over a decade",
        "Review your insurance coverage carefully: term life and health policies often have gaps people discover only when they need to claim",
        "Build a secondary income stream — your financial base is stable enough to support that experiment now without real downside risk",
      ],
    };
  }
  if (score >= 70) {
    return {
      strengths: [
        "You're saving meaningfully and have begun investing — the vast majority of people your age haven't taken even this first step",
        "You demonstrate honest awareness of your financial gaps, which is genuinely half the battle already won",
        "Your cashflow is under reasonable control and you're not living paycheck to paycheck, which is a foundation worth protecting",
      ],
      growthAreas: [
        "Your investment portfolio likely needs diversification — being concentrated in FDs or a single asset class is a hidden and growing risk",
        "Build your emergency fund to a true 3–6 month runway before increasing any discretionary spending or lifestyle upgrades",
        "Start tracking your net worth monthly, not just income and expenses — the mindset shift alone will change how you make decisions",
      ],
    };
  }
  if (score >= 50) {
    return {
      strengths: [
        "You've completed a full financial self-assessment — that kind of honesty and initiative already sets you apart from most people",
        "You show clear awareness of your debts and liabilities, which means you're not in denial and you're ready to address them",
        "You have a foundation to build on — income, some savings intent, and the right questions finally being asked",
      ],
      growthAreas: [
        "High-interest debt (credit cards, BNPL) is silently consuming your future returns — clearing it beats any market investment right now",
        "No emergency fund means one unexpected expense could derail everything — even ₹5,000 set aside separately is a meaningful start",
        "You need a written budget, even a rough one — money without a clear plan always disappears faster than you expect it to",
      ],
    };
  }
  if (score >= 25) {
    return {
      strengths: [
        "Completing this quiz means you're aware that something needs to change — that self-awareness is genuinely uncommon and valuable",
        "You're early enough in your financial journey that every positive habit you build now will compound for the next three decades",
        "You have no deeply entrenched bad financial habits yet — you're starting with a relatively clean slate, which is a real advantage",
      ],
      growthAreas: [
        "You're very likely spending more than you track — the first step is a simple spending log kept honestly for just 30 days",
        "Any debt carrying interest above 12% per year is a financial emergency that must outrank every other financial goal right now",
        "Open a separate savings account today and set up an auto-transfer of even ₹500 every month — the habit matters far more than the amount",
      ],
    };
  }
  // 0–25
  return {
    strengths: [
      "You took this assessment — most people avoid looking at their finances entirely, so you're already ahead of those who don't",
      "A score this low means your upside is enormous — even small, consistent changes will show dramatic score improvement within months",
      "You have nothing to unlearn yet — building the right habits from zero is genuinely easier than breaking deeply ingrained bad ones",
    ],
    growthAreas: [
      "Your immediate priority is financial survival mode: track every rupee spent for the next 30 days with no exceptions or rounding",
      "Do not invest anything yet — clear any high-interest debt first and build a ₹5,000 emergency cushion before anything else",
      "Find one trusted source of financial education and commit to 20 minutes a week — consistency here will change your trajectory completely",
    ],
  };
};

// ── SHARED TOOLTIP GENERATOR ──
const getArthInsight = (label, val) => {
  let level = val >= 75 ? "High" : val >= 45 ? "Mid" : "Low";
  const cat = label.toLowerCase();
  let action = "your financial standing";

  if (cat.includes("savings"))    action = val >= 75 ? "actively save money regularly"       : val >= 45 ? "sometimes save money"           : "don't save money";
  else if (cat.includes("investment")) action = val >= 75 ? "invest your wealth aggressively" : val >= 45 ? "invest occasionally"             : "haven't started investing yet";
  else if (cat.includes("debt"))  action = val >= 75 ? "manage your debt flawlessly"          : val >= 45 ? "are managing some liabilities"   : "have high-interest debt loads";
  else if (cat.includes("risk"))  action = val >= 75 ? "are perfectly prepared for emergencies" : val >= 45 ? "have some safety buffers"      : "lack a basic safety net";
  else if (cat.includes("retirement")) action = val >= 75 ? "are securing your future well"   : val >= 45 ? "have basic future plans"          : "haven't planned for the long term";

  return `ARTH Score is ${level}, as you ${action}.`;
};

const getAnswerContext = (answers) => {
  if (!answers) return [];
  const p = answers[0];
  const q = (step) => {
    switch (step) {
      case 0: return { cat: "Life Stage", icon: "👤", opts: ["Student / Just starting out", "Early career (Renting/Building)", "Mid-career (Homeowner/Family)", "Approaching retirement"] };
      case 1:
        if (p === 0) return { cat: "Funding Source", icon: "🏦", opts: ["Pocket money", "Part-time job", "Scholarships / Grants", "Freelance / Side-hustle"] };
        return { cat: "Income Stream", icon: "🏦", opts: ["Highly variable", "Fixed salary (<₹50k)", "Fixed salary (₹50k–₹1.5L)", "High earner (>₹1.5L)"] };
      case 2:
        if (p === 0) return { cat: "Spending Tracking", icon: "💸", opts: ["Don't track at all", "Mental math", "App / Spreadsheet", "Parents manage it"] };
        return { cat: "Monthly Margin", icon: "💸", opts: ["Paycheck to paycheck", "0–10% saved", "10–30% saved", "30%+ saved"] };
      case 3:
        if (p === 0) return { cat: "Debt Status", icon: "⚖️", opts: ["Student loans", "Credit cards / BNPL", "Borrowed from family", "Completely debt-free"] };
        return { cat: "Biggest Liability", icon: "⚖️", opts: ["Credit card balances", "Personal/Student loans", "Home/Car EMI", "Completely debt-free"] };
      case 4:
        if (p === 0) return { cat: "Main Anxiety", icon: "🛡️", opts: ["Finding a good job", "Paying student loans", "FOMO spending", "Not knowing how to invest"] };
        return { cat: "Emergency Runway", icon: "🛡️", opts: ["< 1 month", "1–3 months", "3–6 months", "6+ months"] };
      case 5:
        if (p === 0) return { cat: "Saving Approach", icon: "📈", opts: ["Just surviving", "Spare change", "Small SIPs / Crypto", "Actively learning & investing"] };
        return { cat: "Wealth Location", icon: "📈", opts: ["Savings Account", "Fixed Deposits", "Mutual Funds & SIPs", "Diversified portfolio"] };
      case 6:
        if (p === 0) return { cat: "₹10k Windfall", icon: "🧠", opts: ["Spend on lifestyle", "Buy a course", "Put into savings", "Invest in market"] };
        return { cat: "₹50k Windfall", icon: "🧠", opts: ["Pay off debt", "Invest it all", "Save half, spend half", "Vacation / Gadget"] };
      case 7:
        if (p === 0) return { cat: "12-Month Goal", icon: "🎯", opts: ["Graduate debt-free", "Land high-paying job", "Build emergency fund", "Start investing"] };
        return { cat: "Money Anxiety", icon: "🌩️", opts: ["Medical emergencies", "Never retiring", "Drowning in debt", "Not enjoying life today"] };
      case 8:
        if (p === 0) return { cat: "Goal by Age 30", icon: "🌟", opts: ["100% financially independent", "6-figure monthly salary", "Own a house", "Run a business"] };
        return { cat: "3-Year Goal", icon: "🌟", opts: ["Buy a home", "Clear all debt", "Build wealth portfolio", "Major lifestyle upgrade"] };
      default: return { cat: "", icon: "", opts: [] };
    }
  };
  return answers.map((ans, i) => {
    if (ans === null || ans === undefined) return null;
    const ctx = q(i);
    if (!ctx.opts[ans]) return null;
    const tier = i === 0 ? "#95d7e4" : ans <= 1 ? "#f87171" : ans === 2 ? "#fbbf24" : "#4ade80";
    return { ...ctx, answer: ctx.opts[ans], ansIndex: ans, tier };
  }).filter(Boolean);
};

// ── PAGE REGISTRY ──
const PAGES = [
  { label: 'Dashboard',    path: '/dashboard' },
  { label: 'Roadmap',      path: '/roadmap' },
  { label: 'Quiz',         path: '/quiz' },
  { label: 'Results',      path: '/results' },
  { label: 'What-If',      path: '/whatif' },
  { label: 'Talk to ARTH', path: '/chat' },
  { label: 'Analysis',     path: '/analysis' },
]

function PageJump({ navigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button whileHover={{ borderColor: '#95d7e4', color: '#95d7e4' }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid #252525', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
      >⌘ Jump <span style={{ fontSize: '10px', opacity: 0.5 }}>{open ? '▲' : '▼'}</span></motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: 'absolute', top: '42px', right: 0, width: '180px', background: 'rgba(14,11,14,0.97)', backdropFilter: 'blur(18px)', border: '1px solid #252525', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.7)', zIndex: 999 }}
          >
            {PAGES.map((p, i) => (
              <motion.div key={p.path} whileHover={{ background: 'rgba(149,215,228,0.08)', color: '#95d7e4' }}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', borderBottom: i < PAGES.length - 1 ? '1px solid #252525' : 'none', transition: 'all 0.15s' }}
              >{p.label}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── CSS ──
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #fff;
    background: #010204;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  .rp-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
  .rp-orb-1 { width:700px;height:600px;background:radial-gradient(ellipse at 30% 30%,rgba(26,80,220,0.35) 0%,rgba(0,123,227,0.15) 40%,transparent 70%);top:-180px;left:-120px;filter:blur(80px); }
  .rp-orb-2 { width:600px;height:500px;background:radial-gradient(ellipse at 60% 40%,rgba(79,79,241,0.18) 0%,rgba(0,123,227,0.08) 45%,transparent 72%);top:10%;right:-100px;filter:blur(100px); }
  .rp-orb-3 { width:500px;height:500px;background:radial-gradient(ellipse at 50% 50%,rgba(14,11,14,0.9) 0%,transparent 75%);bottom:-100px;left:-80px;filter:blur(60px); }

  .rp-page { position:relative;z-index:1;max-width:1020px;margin:0 auto;padding:28px 22px 80px; }

  .rp-topbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;animation:rpDown 0.6s ease both; }
  .rp-logo-row { display:flex;align-items:center;gap:8px; }
  .rp-logo-icon { width:30px;height:30px;background:linear-gradient(135deg,#007be3,#4f4ff1);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(0,123,227,0.45); }
  .rp-logo-text { font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700; }
  .rp-badge { font-size:12px;font-weight:600;color:#95d7e4;background:rgba(149,215,228,0.08);border:1px solid rgba(149,215,228,0.2);padding:5px 13px;border-radius:99px;font-family:'Space Grotesk',sans-serif; }
  .rp-back { display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:10px;font-family:'Be Vietnam Pro',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.04);border:1px solid #252525;cursor:pointer;transition:all 0.2s; }
  .rp-back:hover { background:rgba(0,123,227,0.1);border-color:rgba(0,123,227,0.35);color:#fff; }

  .rp-glass {
    background:rgba(14,11,14,0.78);border:1px solid #252525;border-radius:20px;
    backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
    box-shadow:0 20px 50px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04);
    position:relative;overflow:hidden;
    transition:border-color 0.28s,transform 0.28s cubic-bezier(0.22,1,0.36,1),box-shadow 0.28s,background 0.28s;
  }
  .rp-glass:hover { border-color:rgba(0,123,227,0.38);transform:translateY(-5px) scale(1.01);background:rgba(14,11,14,0.92);box-shadow:0 36px 80px rgba(0,0,0,0.65),0 0 50px rgba(79,79,241,0.14),inset 0 1px 0 rgba(255,255,255,0.07); }

  .rp-card-lbl { font-size:10px;font-weight:700;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:18px;position:relative;z-index:1;font-family:'Space Grotesk',sans-serif; }

  .rp-hero { margin-bottom:20px;padding:28px 32px;animation:rpUp 0.7s ease 0.1s both; }
  .rp-hero-grid { display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center; }
  @media(max-width:600px){ .rp-hero-grid{grid-template-columns:1fr;} .rp-hero-right{display:none!important;} }
  .rp-pill { display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;color:#95d7e4;background:rgba(149,215,228,0.08);border:1px solid rgba(149,215,228,0.2);border-radius:99px;padding:4px 12px;margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;font-family:'Space Grotesk',sans-serif;position:relative;z-index:1; }
  .rp-hero-name { font-family:'Space Grotesk',sans-serif;font-size:clamp(20px,3.5vw,32px);font-weight:700;letter-spacing:-0.04em;line-height:1.18;margin-bottom:8px;position:relative;z-index:1; }
  .rp-grad { background:linear-gradient(135deg,#fff 0%,#95d7e4 45%,#007be3 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .rp-hero-sub { font-size:13px;color:rgba(255,255,255,0.36);line-height:1.6;position:relative;z-index:1;max-width:460px;margin-bottom:14px; }
  .rp-persona-tag { display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;position:relative;z-index:1;font-family:'Be Vietnam Pro',sans-serif; }
  .rp-hero-right { display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;z-index:1; }
  .rp-score-big { font-family:'Space Grotesk',sans-serif;font-size:60px;font-weight:700;letter-spacing:-0.05em;line-height:1;background:linear-gradient(135deg,#fff 0%,#95d7e4 50%,#007be3 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .rp-score-grade-hero { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600; }
  .rp-score-pct { font-size:11px;color:rgba(255,255,255,0.3); }

  .rp-row1 { display:grid;grid-template-columns:240px 1fr;gap:18px;margin-bottom:18px;animation:rpUp 0.7s ease 0.2s both; }
  @media(max-width:680px){ .rp-row1{grid-template-columns:1fr;} }

  .rp-arc-card { padding:26px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:270px; }
  .rp-arc-wrap { position:relative;width:150px;height:150px;margin-bottom:14px;z-index:1;cursor:help; }
  .rp-arc-inner { position:absolute;inset:18px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(1,2,4,0.9); }
  .rp-arc-num { font-family:'Be Vietnam Pro',sans-serif;font-size:34px;font-weight:800;background:linear-gradient(135deg,#fff 0%,#95d7e4 45%,#007be3 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
  .rp-arc-denom { font-size:11px;color:rgba(255,255,255,0.25);margin-top:1px; }
  .rp-grade-lbl { font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px;position:relative;z-index:1; }
  .rp-tagline { font-size:11px;color:rgba(255,255,255,0.28);text-align:center;position:relative;z-index:1; }

  .rp-radar-card { padding:26px 22px;display:flex;flex-direction:column; }
  .rp-radar-inner { display:flex;align-items:center;gap:20px;flex:1;position:relative;z-index:1; }
  .rp-radar-legend { display:flex;flex-direction:column;gap:9px;flex:1; }
  .rp-rl { display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid #252525;transition:all 0.18s;cursor:help; }
  .rp-rl:hover { background:rgba(0,123,227,0.07);border-color:rgba(0,123,227,0.22);transform:translateX(4px); }
  .rp-rl-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
  .rp-rl-name { font-size:12px;color:rgba(255,255,255,0.42);flex:1; }
  .rp-rl-track { width:48px;height:3px;border-radius:99px;background:rgba(255,255,255,0.06);overflow:hidden; }
  .rp-rl-fill { height:100%;border-radius:99px;transition:width 1.1s ease; }
  .rp-rl-val { font-size:13px;font-weight:700;min-width:24px;text-align:right; }

  .rp-row2 { margin-bottom:18px;animation:rpUp 0.7s ease 0.3s both; }
  .rp-timeline-card { padding:26px; }
  .rp-tgrid { display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:11px;position:relative;z-index:1; }
  .rp-tcard { background:rgba(255,255,255,0.02);border:1px solid #1e1e1e;border-radius:13px;padding:13px 15px;transition:all 0.22s; }
  .rp-tcard:hover { background:rgba(255,255,255,0.05);transform:translateY(-3px); }
  .rp-thead { display:flex;align-items:center;gap:6px;margin-bottom:7px; }
  .rp-ticon { font-size:13px; }
  .rp-tcat { font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;flex:1;font-family:'Space Grotesk',sans-serif; }
  .rp-tdot { width:6px;height:6px;border-radius:50%;flex-shrink:0; }
  .rp-tans { font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;line-height:1.4; }

  .rp-row3 { display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;animation:rpUp 0.7s ease 0.38s both; }
  @media(max-width:580px){ .rp-row3{grid-template-columns:1fr;} }
  .rp-ins-card { padding:22px 20px;min-height:140px; }
  .rp-ins-icon { font-size:20px;margin-bottom:6px;position:relative;z-index:1; }
  .rp-ins-title { font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:14px;position:relative;z-index:1; }
  .rp-ins-list { list-style:none;display:flex;flex-direction:column;gap:11px;position:relative;z-index:1; }
  .rp-ins-list li { display:flex;align-items:flex-start;gap:9px;font-size:13px;color:rgba(255,255,255,0.52);line-height:1.55; }
  .rp-bullet { width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px; }

  .rp-row4 { margin-bottom:18px;animation:rpUp 0.7s ease 0.45s both; }
  .rp-bd-card { padding:26px; }
  .rp-bd-list { display:flex;flex-direction:column;gap:15px;position:relative;z-index:1; }
  .rp-bd-row { display:grid;grid-template-columns:155px 1fr 44px;align-items:center;gap:14px;cursor:help;padding:4px 8px;border-radius:8px;transition:background 0.2s; }
  .rp-bd-row:hover { background:rgba(255,255,255,0.03); }
  .rp-bd-lbl { font-size:13px;color:rgba(255,255,255,0.52);font-weight:500; }
  .rp-bd-track { height:7px;background:rgba(255,255,255,0.05);border-radius:99px;overflow:hidden; }
  .rp-bd-fill { height:100%;border-radius:99px;transition:width 1.2s cubic-bezier(0.16,1,0.3,1); }
  .rp-bd-val { font-size:13px;font-weight:700;text-align:right; }

  .rp-cta-row { display:flex;gap:12px;flex-wrap:wrap;animation:rpUp 0.7s ease 0.52s both; }
  .rp-btn-primary { flex:1;min-width:180px;padding:14px 24px;border-radius:12px;font-family:'Be Vietnam Pro',sans-serif;font-size:14px;font-weight:700;color:#fff;background:linear-gradient(135deg,#007be3,#4f4ff1);border:none;cursor:pointer;transition:all 0.22s;box-shadow:0 8px 24px rgba(0,123,227,0.3); }
  .rp-btn-primary:hover { transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,123,227,0.45); }
  .rp-btn-sec { flex:1;min-width:180px;padding:14px 24px;border-radius:12px;font-family:'Be Vietnam Pro',sans-serif;font-size:14px;font-weight:700;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.04);border:1px solid #252525;cursor:pointer;transition:all 0.22s; }
  .rp-btn-sec:hover { background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2);color:#fff;transform:translateY(-2px); }

  @keyframes rpDown  { from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes rpUp    { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes rpFadeIn{ from{opacity:0;transform:translateY(10px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);} }
`;

// ── COMPONENT: ARTH Tooltip ──
const ArthTooltip = ({ show, x, y, color, content }) => {
  if (!show) return null;
  return (
    <div style={{
      position:'fixed', top:y-85, left:x+20, pointerEvents:'none', zIndex:1000,
      background:'rgba(13,15,26,0.96)', border:`1px solid ${color}44`, borderRadius:'12px',
      padding:'10px 14px', boxShadow:`0 10px 30px rgba(0,0,0,0.5),0 0 20px ${color}22`,
      backdropFilter:'blur(12px)', maxWidth:'220px', animation:'rpFadeIn 0.2s ease-out'
    }}>
      <p style={{fontSize:'10px',color,textTransform:'uppercase',fontWeight:'800',letterSpacing:'0.08em',marginBottom:'4px'}}>ARTH Insight</p>
      <p style={{fontSize:'12px',color:'#e8edf4',lineHeight:'1.4',fontWeight:'500'}}>{content}</p>
    </div>
  );
};

// ── COMPONENT: Score Arc ──
function ScoreArc({ scoreTarget, color }) {
  const canvasRef = useRef(null);
  const [scoreNum, setScoreNum] = useState(0);
  const [tooltip, setTooltip] = useState({ show:false, x:0, y:0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 75, cy = 75, r = 58;
    let drawn = 0, raf;

    function drawArc(pct) {
      ctx.clearRect(0,0,150,150);
      ctx.beginPath();
      ctx.arc(cx,cy,r,0.75*Math.PI,2.25*Math.PI);
      ctx.strokeStyle="rgba(255,255,255,0.05)"; ctx.lineWidth=8; ctx.lineCap="round"; ctx.stroke();
      const grad = ctx.createLinearGradient(0,0,150,150);
      grad.addColorStop(0,"#007be3"); grad.addColorStop(0.5,"#4f4ff1"); grad.addColorStop(1,"#95d7e4");
      const start=0.75*Math.PI, end=start+(pct/100)*1.5*Math.PI;
      ctx.beginPath(); ctx.arc(cx,cy,r,start,end);
      ctx.strokeStyle=grad; ctx.lineWidth=8; ctx.lineCap="round";
      ctx.shadowColor="#4f4ff1"; ctx.shadowBlur=14; ctx.stroke(); ctx.shadowBlur=0;
    }

    function animate() {
      if (drawn < scoreTarget) {
        drawn += 1.5;
        const v = Math.min(drawn, scoreTarget);
        drawArc(v); setScoreNum(Math.round(v));
        raf = requestAnimationFrame(animate);
      } else { drawArc(scoreTarget); setScoreNum(scoreTarget); }
    }
    const t = setTimeout(() => { raf = requestAnimationFrame(animate); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [scoreTarget]);

  const insight = `Your Overall Score is ${scoreTarget>=75?'High':scoreTarget>=50?'Mid':'Low'}. Financial health is at a ${getScoreGrade(scoreTarget).grade} level.`;

  return (
    <div className="rp-arc-wrap"
      onMouseMove={(e) => setTooltip({ show:true, x:e.clientX, y:e.clientY })}
      onMouseLeave={() => setTooltip({ show:false, x:0, y:0 })}
    >
      <canvas ref={canvasRef} width="150" height="150" style={{ position:"absolute", top:0, left:0 }} />
      <div className="rp-arc-inner">
        <div className="rp-arc-num">{scoreNum}</div>
        <div className="rp-arc-denom">/ 100</div>
      </div>
      <ArthTooltip show={tooltip.show} x={tooltip.x} y={tooltip.y} color={color} content={insight} />
    </div>
  );
}

// ── COMPONENT: SVGRadar ──
function SVGRadar({ categories }) {
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState({ show:false, x:0, y:0, index:null });
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);

  const size=200, cx=100, cy=100, maxR=78, n=categories.length;
  const toXY = (idx, pct) => {
    const angle = (idx/n)*2*Math.PI - Math.PI/2;
    const r = (pct/100)*maxR;
    return { x: cx+r*Math.cos(angle), y: cy+r*Math.sin(angle) };
  };

  const dataPath = categories.map((c,i) => {
    const {x,y} = toXY(i, animated ? c.val : 0);
    return `${i===0?"M":"L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ") + "Z";

  return (
    <div style={{ position:'relative' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="200" height="200" style={{ overflow:"visible", flexShrink:0 }}>
        {[25,50,75,100].map(pct => (
          <polygon key={pct} points={Array.from({length:n},(_,i)=>`${toXY(i,pct).x},${toXY(i,pct).y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {categories.map((_,i) => {
          const {x,y} = toXY(i,100);
          return <line key={i} x1={cx} y1={cy} x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}
        <path d={dataPath} fill="rgba(0,123,227,0.15)" stroke="rgba(0,123,227,0.75)" strokeWidth="2" style={{transition:"all 1s ease"}} />
        {categories.map((c,i) => {
          const p = toXY(i, animated ? c.val : 0);
          return (
            <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="5" fill={c.color} stroke="rgba(1,2,4,0.9)" strokeWidth="2"
              onMouseEnter={(e) => setTooltip({ show:true, x:e.clientX, y:e.clientY, index:i })}
              onMouseLeave={() => setTooltip({ show:false, x:0, y:0, index:null })}
              style={{ cursor:'help' }}
            />
          );
        })}
      </svg>
      {tooltip.show && (
        <ArthTooltip show={true} x={tooltip.x} y={tooltip.y} color={categories[tooltip.index].color} content={getArthInsight(categories[tooltip.index].label, categories[tooltip.index].val)} />
      )}
    </div>
  );
}

// ── MAIN PAGE COMPONENT ──
export default function ResultsPage() {
  const navigate = useNavigate();

  const [scoreTarget,    setScoreTarget]    = useState(0);
  const [categories,     setCategories]     = useState([
    { label:"Savings Rate",        val:0, color:"#4ade80" },
    { label:"Investment Score",    val:0, color:"#95d7e4" },
    { label:"Debt Management",     val:0, color:"#3b93ce" },
    { label:"Risk Preparedness",   val:0, color:"#fbbf24" },
    { label:"Retirement Planning", val:0, color:"#f87171" },
  ]);
  const [insights,       setInsights]       = useState({ strengths:[], growthAreas:[] });
  const [answerTimeline, setAnswerTimeline] = useState([]);
  const [persona,        setPersona]        = useState(null);
  const [scoreGrade,     setScoreGrade]     = useState({ grade:"—", color:"#95d7e4", percentile:"—" });
  const [hoveredMetric,  setHoveredMetric]  = useState({ index:null, x:0, y:0 });

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('finGpsResults')
    navigate('/login')
  }

 useEffect(() => {
    let isMounted = true; // Prevents state updates if user leaves page early

    const loadResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let parsedData = null;
      const stored = localStorage.getItem('finGpsResults');

      // 1. Resolve Data Safely
      if (stored) {
        try {
          parsedData = JSON.parse(stored);
        } catch (e) {
          console.error("Local storage corrupted, will fetch fresh.");
        }
      }

      // If no local storage (new device or corrupted), fetch from backend!
      if (!parsedData || !parsedData.rawAnswers) {
        try {
          const res = await fetch(`${API}/api/quiz/results`, {
            headers: { 'x-auth-token': token }
          });
          if (!res.ok) throw new Error("No data found in DB");
          parsedData = await res.json();
          localStorage.setItem('finGpsResults', JSON.stringify(parsedData)); 
        } catch (err) {
          console.error("No results found, redirecting to quiz.");
          if (isMounted) navigate('/quiz');
          return;
        }
      }

      if (!isMounted) return;

      // 2. Set Basic Stats & INSTANT RICH FALLBACK
      if (parsedData && parsedData.totalScore !== undefined) {
        setScoreTarget(parsedData.totalScore);
        setScoreGrade(getScoreGrade(parsedData.totalScore));
        
        // ⚡ INSTANT FALLBACK: Load pre-recorded data immediately
        setInsights(getInsightsByScore(parsedData.totalScore));
      }

      const bc = parsedData.scores || parsedData.categories; 
      if (bc) {
        setCategories([
          { label:"Savings Rate",        val:bc.savingsRate        ?? 0, color:"#4ade80" },
          { label:"Investment Score",    val:bc.investmentHealth   ?? 0, color:"#95d7e4" },
          { label:"Debt Management",     val:bc.debtManagement     ?? 0, color:"#3b93ce" },
          { label:"Risk Preparedness",   val:bc.riskPreparedness   ?? 0, color:"#fbbf24" },
          { label:"Retirement Planning", val:bc.retirementPlanning ?? 0, color:"#f87171" },
        ]);
      }

      // 3. FETCH REAL AI INSIGHTS (Smart Overwrite)
      if (parsedData && parsedData.rawAnswers) {
        setPersona(getPersonaProfile(parsedData.rawAnswers));
        setAnswerTimeline(getAnswerContext(parsedData.rawAnswers));
        
        try {
           const insightsRes = await fetch(`${API}/api/chat`, {
             method: 'POST',
             headers: { 
               'Content-Type': 'application/json',
               'x-auth-token': token 
             },
             body: JSON.stringify({ answers: parsedData.rawAnswers })
           });
           
           if (insightsRes.ok && isMounted) {
             const aiInsights = await insightsRes.json();
             
             // Check if it's the generic fallback sent by the backend catch block
             const isBackendFallback = aiInsights.strengths && aiInsights.strengths[0] === "Completing assessment";
             
             // Only overwrite if we got genuine, newly generated AI data
             if (aiInsights.strengths && aiInsights.strengths.length > 0 && !isBackendFallback) {
               setInsights(aiInsights);
             } else {
               console.log("AI returned generic fallback. Keeping rich frontend fallback.");
             }
           }
        } catch (err) {
           console.error("AI Insights fetch failed, relying on fallback.", err);
        }
      }
    };

    loadResults();

    // Cleanup function
    return () => {
      isMounted = false; 
    };
  }, [navigate]);

  return (
    <>
      <style>{CSS}</style>
      <div className="rp-root">
        <div className="rp-orb rp-orb-1" />
        <div className="rp-orb rp-orb-2" />
        <div className="rp-orb rp-orb-3" />

        <div className="rp-page">

          {/* TOPBAR */}
          <div className="rp-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="rp-back" onClick={() => navigate(-1)}>
                <svg width="13" height="13" fill="none" viewBox="0 0 16 16"><path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </button>
              <div className="rp-logo-row">
                <div className="rp-logo-icon">📍</div>
                <div className="rp-logo-text">Fin<span style={{color:"#95d7e4"}}>GPS</span></div>
              </div>
              <div className="rp-badge">Financial Report · 2026</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PageJump navigate={navigate} />
              <motion.button whileHover={{ borderColor: '#f87171', color: '#f87171' }} whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                style={{ padding: '7px 14px', borderRadius: '9px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
              >Log Out</motion.button>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f4ff1, #007be3)', border: '2px solid rgba(149,215,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>P</div>
            </div>
          </div>

          {/* HERO */}
          <div className="rp-glass rp-hero" style={persona ? { borderColor:persona.border } : {}}>
            <div className="rp-hero-grid">
              <div>
                <div className="rp-pill">✦ Analysis Complete</div>
                <h1 className="rp-hero-name">DNA Report: <span className="rp-grad">{persona?.label}</span></h1>
                <p className="rp-hero-sub">Decoding your financial blueprint using behavioral indicators and cashflow mapping.</p>
                {persona && (
                  <div className="rp-persona-tag" style={{ background:persona.accent, border:`1px solid ${persona.border}`, color:persona.color }}>
                    <span>{persona.emoji}</span> <span>{persona.stage} · {persona.tagline}</span>
                  </div>
                )}
              </div>
              <div className="rp-hero-right">
                <div className="rp-score-big">{scoreTarget}</div>
                <div className="rp-score-grade-hero" style={{ color:scoreGrade.color }}>{scoreGrade.grade}</div>
                <div className="rp-score-pct">{scoreGrade.percentile} Nationally</div>
              </div>
            </div>
          </div>

          {/* ROW 1: ARC + RADAR */}
          <div className="rp-row1">
            <div className="rp-glass rp-arc-card">
              <div className="rp-card-lbl">DNA Score Index</div>
              <ScoreArc scoreTarget={scoreTarget} color={scoreGrade.color} />
              <div className="rp-grade-lbl" style={{ color:scoreGrade.color }}>{scoreGrade.grade} Standing</div>
              <div className="rp-tagline">Better than {scoreGrade.percentile.split(' ')[1]} of users in your bracket.</div>
            </div>
            <div className="rp-glass rp-radar-card">
              <div className="rp-card-lbl">Financial Health Radar</div>
              <div className="rp-radar-inner">
                <SVGRadar categories={categories} />
                <div className="rp-radar-legend">
                  {categories.map((c,i) => (
                    <div className="rp-rl" key={i}
                      onMouseMove={(e) => setHoveredMetric({ index:i, x:e.clientX, y:e.clientY })}
                      onMouseLeave={() => setHoveredMetric({ index:null, x:0, y:0 })}
                    >
                      <span className="rp-rl-dot" style={{ background:c.color }} />
                      <span className="rp-rl-name">{c.label}</span>
                      <div className="rp-rl-track"><div className="rp-rl-fill" style={{ width:`${c.val}%`, background:c.color }} /></div>
                      <span className="rp-rl-val" style={{ color:c.color }}>{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: ANSWER TIMELINE */}
          <div className="rp-row2">
            <div className="rp-glass rp-timeline-card">
              <div className="rp-card-lbl">Your Input Sequence — Profile Timeline</div>
              <div className="rp-tgrid">
                {answerTimeline.map((item,i) => (
                  <div className="rp-tcard" key={i} style={{ borderColor:`${item.tier}22` }}>
                    <div className="rp-thead">
                      <span className="rp-ticon">{item.icon}</span>
                      <span className="rp-tcat">{item.cat}</span>
                      <span className="rp-tdot" style={{ background:item.tier }} />
                    </div>
                    <div className="rp-tans">{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: INSIGHTS — score-range based, renders instantly */}
          <div className="rp-row3">
            <div className="rp-glass rp-ins-card">
              <div className="rp-ins-icon">💪</div>
              <div className="rp-ins-title">Your Strengths</div>
              <ul className="rp-ins-list">
                {insights.strengths.map((s,i) => (
                  <li key={i}><span className="rp-bullet" style={{ background:"#4ade80" }} />{s}</li>
                ))}
              </ul>
            </div>
            <div className="rp-glass rp-ins-card">
              <div className="rp-ins-icon">⚠️</div>
              <div className="rp-ins-title">Growth Opportunities</div>
              <ul className="rp-ins-list">
                {insights.growthAreas.map((g,i) => (
                  <li key={i}><span className="rp-bullet" style={{ background:"#f87171" }} />{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ROW 4: DIMENSION BREAKDOWN */}
          <div className="rp-row4">
            <div className="rp-glass rp-bd-card">
              <div className="rp-card-lbl">Breakdown by Dimension</div>
              <div className="rp-bd-list">
                {categories.map((c,i) => (
                  <div className="rp-bd-row" key={i}
                    onMouseMove={(e) => setHoveredMetric({ index:i, x:e.clientX, y:e.clientY })}
                    onMouseLeave={() => setHoveredMetric({ index:null, x:0, y:0 })}
                  >
                    <div className="rp-bd-lbl">{c.label}</div>
                    <div className="rp-bd-track"><div className="rp-bd-fill" style={{ width:`${c.val}%`, background:c.color }} /></div>
                    <div className="rp-bd-val" style={{ color:c.color }}>{c.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA ROW */}
          <div className="rp-cta-row">
            <button className="rp-btn-primary" onClick={() => navigate("/roadmap")}>📍 Generate My Roadmap</button>
            <button className="rp-btn-sec"     onClick={() => navigate("/chat")}>🤖 Chat with ARTH</button>
          </div>

          {/* UNIFIED TOOLTIP OVERLAY */}
          {hoveredMetric.index !== null && (
            <ArthTooltip
              show={true}
              x={hoveredMetric.x}
              y={hoveredMetric.y}
              color={categories[hoveredMetric.index].color}
              content={getArthInsight(categories[hoveredMetric.index].label, categories[hoveredMetric.index].val)}
            />
          )}
        </div>
      </div>
    </>
  );
}