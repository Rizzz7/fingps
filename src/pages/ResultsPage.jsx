import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart, ArcElement, DoughnutController,
  BarElement, BarController, CategoryScale,
  LinearScale, Tooltip, Legend
} from "chart.js";

Chart.register(
  ArcElement, DoughnutController,
  BarElement, BarController,
  CategoryScale, LinearScale,
  Tooltip, Legend
);

const CSS = `
  .fp-root {
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #fff;
    background: #010204;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* ── orbs ── */
  .fp-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
  .fp-orb-1 {
    width: 700px; height: 600px;
    background: radial-gradient(ellipse at 30% 30%, rgba(26,80,220,0.38) 0%, rgba(0,123,227,0.18) 40%, transparent 70%);
    top: -180px; left: -120px; filter: blur(80px);
  }
  .fp-orb-2 {
    width: 600px; height: 500px;
    background: radial-gradient(ellipse at 60% 40%, rgba(79,79,241,0.20) 0%, rgba(0,123,227,0.10) 45%, transparent 72%);
    top: 10%; right: -100px; filter: blur(100px);
  }
  .fp-orb-3 {
    width: 700px; height: 600px;
    background: radial-gradient(ellipse at 40% 60%, rgba(14,11,14,0.95) 0%, rgba(1,2,4,0.80) 55%, transparent 75%);
    bottom: -120px; left: -80px; filter: blur(60px);
  }
  .fp-orb-4 {
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, rgba(59,147,206,0.12) 0%, transparent 70%);
    top: 40%; left: 30%; filter: blur(120px);
  }

  /* ── layout ── */
  .fp-page { position: relative; z-index: 1; max-width: 980px; margin: 0 auto; padding: 32px 24px 64px; }

  /* ── topbar ── */
  .fp-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:36px; animation: fpFadeDown 0.6s ease both; }
  .fp-logo-row { display:flex; align-items:center; gap:8px; }
  .fp-logo-icon {
    width:30px; height:30px;
    background: linear-gradient(135deg, #007be3, #4f4ff1);
    border-radius:8px; display:flex; align-items:center; justify-content:center;
    box-shadow: 0 0 16px rgba(0,123,227,0.45);
  }
  .fp-logo-text { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; color:#fff; letter-spacing:0.03em; }
  .fp-badge {
    font-family:'Be Vietnam Pro',sans-serif; font-size:13px; font-weight:600;
    color:#95d7e4; background:rgba(149,215,228,0.08);
    border:1px solid rgba(149,215,228,0.22); padding:6px 14px; border-radius:99px;
  }
  .fp-back-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px;
    font-family:'Be Vietnam Pro',sans-serif; font-size:13px; font-weight:600;
    color:rgba(255,255,255,0.55); background:rgba(255,255,255,0.04);
    border:1px solid #252525; cursor:pointer;
    transition:background 0.2s, border-color 0.2s, color 0.2s;
  }
  .fp-back-btn:hover { background:rgba(0,123,227,0.1); border-color:rgba(0,123,227,0.35); color:#fff; }

  /* ── hero ── */
  .fp-hero { text-align:center; margin-bottom:44px; animation: fpFadeUp 0.7s ease 0.1s both; }
  .fp-hero-label {
    display:inline-flex; align-items:center; gap:6px;
    font-size:11px; font-weight:600; color:#95d7e4;
    background:rgba(149,215,228,0.07); border:1px solid rgba(149,215,228,0.2);
    border-radius:99px; padding:5px 14px; margin-bottom:14px;
    letter-spacing:0.09em; text-transform:uppercase;
    font-family:'Space Grotesk',sans-serif;
  }
  .fp-hero h1 {
    font-family:'Space Grotesk',sans-serif;
    font-size:clamp(26px,4.5vw,40px); font-weight:700;
    letter-spacing:-0.04em; line-height:1.15; margin-bottom:10px;
  }
  .fp-plain { color:#fff; }
  .fp-grad-blue {
    background:linear-gradient(135deg,#fff 0%,#95d7e4 45%,#007be3 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .fp-grad-cyan {
    background:linear-gradient(135deg,#95d7e4,#3b93ce);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .fp-hero-sub { font-size:15px; color:rgba(255,255,255,0.38); line-height:1.6; }

  /* ── glass card ── */
  .fp-glass {
    background:rgba(14,11,14,0.75);
    border:1px solid #252525;
    border-radius:20px; padding:24px;
    backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    box-shadow:0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
    position:relative; overflow:hidden;
    transition:border-color 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, background 0.28s ease;
  }
  .fp-glass:hover {
    border-color:rgba(0,123,227,0.45);
    transform:translateY(-7px) scale(1.013);
    background:rgba(14,11,14,0.92);
    box-shadow:0 36px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,123,227,0.2), 0 0 50px rgba(79,79,241,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .fp-glass::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
    transition:background 0.28s; z-index:1;
  }
  .fp-glass:hover::before { background:linear-gradient(90deg,transparent,rgba(0,123,227,0.5),transparent); }
  .fp-glass::after {
    content:''; position:absolute; top:0; left:-110%; width:55%; height:100%;
    background:linear-gradient(105deg,transparent 40%,rgba(0,123,227,0.06) 50%,transparent 60%);
    transition:left 0.55s ease; pointer-events:none; z-index:0;
  }
  .fp-glass:hover::after { left:160%; }

  .fp-card-title {
    font-size:11px; font-weight:600; color:rgba(255,255,255,0.3);
    text-transform:uppercase; letter-spacing:0.1em; margin-bottom:20px;
    position:relative; z-index:1; font-family:'Space Grotesk',sans-serif;
  }

  /* ── row 1 ── */
  .fp-row-top { display:grid; grid-template-columns:280px 1fr; gap:18px; margin-bottom:18px; animation: fpFadeUp 0.7s ease 0.2s both; }
  @media(max-width:720px){ .fp-row-top{ grid-template-columns:1fr; } }

  .fp-score-card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0; min-height:280px; }
  .fp-circle-wrap { position:relative; width:170px; height:170px; margin-bottom:20px; z-index:1; }
  .fp-circle-inner {
    position:absolute; inset:22px; border-radius:50%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    background:rgba(1,2,4,0.92);
  }
  .fp-score-big {
    font-family:'Be Vietnam Pro',sans-serif; font-size:40px; font-weight:800;
    background:linear-gradient(135deg,#fff 0%,#95d7e4 45%,#007be3 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    line-height:1; letter-spacing:-0.04em;
  }
  .fp-score-denom { font-size:14px; color:rgba(255,255,255,0.35); font-weight:500; margin-top:2px; }
  .fp-score-grade {
    font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700;
    color:#95d7e4; margin-bottom:4px; position:relative; z-index:1;
  }
  .fp-score-desc { font-size:13px; color:rgba(255,255,255,0.38); text-align:center; line-height:1.5; max-width:180px; position:relative; z-index:1; }
  .fp-mini-stats { display:flex; gap:10px; margin-top:16px; width:100%; position:relative; z-index:1; }
  .fp-mini-stat {
    flex:1; background:rgba(255,255,255,0.03); border:1px solid #252525;
    border-radius:12px; padding:10px 12px; text-align:center;
    transition:background 0.2s, border-color 0.2s;
  }
  .fp-mini-stat:hover { background:rgba(0,123,227,0.08); border-color:rgba(0,123,227,0.3); }
  .fp-mini-stat-val { font-family:'Be Vietnam Pro',sans-serif; font-size:17px; font-weight:700; letter-spacing:-0.03em; margin-bottom:2px; }
  .fp-mini-stat-lbl { font-size:11px; color:rgba(255,255,255,0.28); text-transform:uppercase; letter-spacing:0.07em; font-family:'Space Grotesk',sans-serif; }

  /* ── pie ── */
  .fp-pie-card { display:flex; flex-direction:column; }
  .fp-pie-inner { display:flex; align-items:center; gap:24px; flex:1; position:relative; z-index:1; }
  .fp-pie-canvas-wrap { position:relative; width:210px; height:210px; flex-shrink:0; }
  .fp-pie-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; pointer-events:none; }
  .fp-pcl-val {
    font-family:'Be Vietnam Pro',sans-serif; font-size:28px; font-weight:800;
    background:linear-gradient(135deg,#fff 0%,#95d7e4 45%,#007be3 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    line-height:1; letter-spacing:-0.04em;
  }
  .fp-pcl-sub { font-size:11px; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em; margin-top:3px; font-family:'Space Grotesk',sans-serif; }
  .fp-pie-legend { display:flex; flex-direction:column; gap:10px; flex:1; }
  .fp-legend-row {
    display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:10px;
    background:rgba(255,255,255,0.02); border:1px solid #252525;
    transition:background 0.18s, border-color 0.18s, transform 0.18s;
  }
  .fp-legend-row:hover { background:rgba(0,123,227,0.07); border-color:rgba(0,123,227,0.22); transform:translateX(4px); }
  .fp-legend-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
  .fp-legend-name { font-size:13px; color:rgba(255,255,255,0.45); flex:1; font-family:'Be Vietnam Pro',sans-serif; }
  .fp-legend-bar-wrap { width:50px; height:3px; border-radius:99px; background:rgba(255,255,255,0.07); overflow:hidden; }
  .fp-legend-bar-fill { height:100%; border-radius:99px; transition:width 1s ease; }
  .fp-legend-val { font-family:'Be Vietnam Pro',sans-serif; font-size:14px; font-weight:700; }
  @media(max-width:500px){ .fp-pie-inner{flex-direction:column;} .fp-pie-canvas-wrap{width:160px;height:160px;} }

  /* ── row 2 ── */
  .fp-row-savings { margin-bottom:18px; animation: fpFadeUp 0.7s ease 0.3s both; }
  .fp-savings-wrap { height:180px; position:relative; z-index:1; }

  /* ── row 3 ── */
  .fp-row-insights { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:28px; animation: fpFadeUp 0.7s ease 0.4s both; }
  @media(max-width:600px){ .fp-row-insights{ grid-template-columns:1fr; } }

  .fp-insight-card { padding:22px 20px; }
  .fp-insight-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px; position:relative; z-index:1; }
  .fp-insight-title { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; margin-bottom:12px; position:relative; z-index:1; }
  .fp-insight-list { list-style:none; display:flex; flex-direction:column; gap:8px; position:relative; z-index:1; }
  .fp-insight-list li { display:flex; align-items:flex-start; gap:8px; font-size:14px; color:rgba(255,255,255,0.5); line-height:1.45; transition:color 0.15s,transform 0.15s; font-family:'Be Vietnam Pro',sans-serif; }
  .fp-insight-list li:hover { color:rgba(255,255,255,0.85); transform:translateX(2px); }
  .fp-bullet { width:5px; height:5px; border-radius:50%; flex-shrink:0; margin-top:6px; }

  .fp-strength .fp-insight-icon { background:rgba(74,222,128,0.1); }
  .fp-strength .fp-insight-title { color:#4ade80; }
  .fp-strength .fp-bullet { background:#4ade80; }
  .fp-strength.fp-glass { border-color:rgba(74,222,128,0.18); }
  .fp-strength.fp-glass:hover { border-color:rgba(74,222,128,0.42); box-shadow:0 36px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(74,222,128,0.15),0 0 50px rgba(74,222,128,0.12),inset 0 1px 0 rgba(255,255,255,0.07); }
  .fp-strength.fp-glass:hover::before { background:linear-gradient(90deg,transparent,rgba(74,222,128,0.4),transparent); }
  .fp-strength.fp-glass::after { background:linear-gradient(105deg,transparent 40%,rgba(74,222,128,0.05) 50%,transparent 60%); }

  .fp-weakness .fp-insight-icon { background:rgba(248,113,113,0.1); }
  .fp-weakness .fp-insight-title { color:#f87171; }
  .fp-weakness .fp-bullet { background:#f87171; }
  .fp-weakness.fp-glass { border-color:rgba(248,113,113,0.18); }
  .fp-weakness.fp-glass:hover { border-color:rgba(248,113,113,0.42); box-shadow:0 36px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(248,113,113,0.15),0 0 50px rgba(248,113,113,0.12),inset 0 1px 0 rgba(255,255,255,0.07); }
  .fp-weakness.fp-glass:hover::before { background:linear-gradient(90deg,transparent,rgba(248,113,113,0.4),transparent); }
  .fp-weakness.fp-glass::after { background:linear-gradient(105deg,transparent 40%,rgba(248,113,113,0.05) 50%,transparent 60%); }

  /* ── cta ── */
  .fp-cta-row { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; animation: fpFadeUp 0.7s ease 0.55s both; }
  .fp-cta-btn {
    display:inline-flex; align-items:center; gap:9px;
    padding:15px 32px; border-radius:14px;
    font-family:'Be Vietnam Pro',sans-serif; font-size:15px; font-weight:700;
    cursor:pointer; border:none;
    background:linear-gradient(135deg, #007be3, #4f4ff1);
    color:#fff;
    box-shadow:0 0 28px rgba(0,123,227,0.38), 0 6px 20px rgba(0,0,0,0.4);
    transition:transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s, filter 0.22s;
  }
  .fp-cta-btn:hover { transform:translateY(-5px) scale(1.05); box-shadow:0 0 56px rgba(0,123,227,0.65),0 12px 36px rgba(0,0,0,0.5); filter:brightness(1.1); }
  .fp-cta-btn:active { transform:scale(0.97); }

  @keyframes fpFadeDown { from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:translateY(0);} }
  @keyframes fpFadeUp   { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
`;

/* ── COMPONENT 1: ScoreArc ── */
function ScoreArc({ scoreTarget }) {
  const canvasRef = useRef(null);
  const [scoreNum, setScoreNum] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 85, cy = 85, r = 68;
    let drawn = 0, raf;

    function drawArc(pct) {
      ctx.clearRect(0, 0, 170, 170);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0.75 * Math.PI, 2.25 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.stroke();
      const grad = ctx.createLinearGradient(0, 0, 170, 170);
      grad.addColorStop(0, "#007be3");
      grad.addColorStop(0.5, "#4f4ff1");
      grad.addColorStop(1, "#95d7e4");
      const start = 0.75 * Math.PI;
      const end = start + (pct / 100) * 1.5 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, end);
      ctx.strokeStyle = grad; ctx.lineWidth = 10; ctx.lineCap = "round";
      ctx.shadowColor = "#4f4ff1"; ctx.shadowBlur = 18;
      ctx.stroke(); ctx.shadowBlur = 0;
    }

    function animate() {
      if (drawn < scoreTarget) {
        drawn += 1.2;
        const v = Math.min(drawn, scoreTarget);
        drawArc(v); setScoreNum(Math.round(v));
        raf = requestAnimationFrame(animate);
      } else {
        drawArc(scoreTarget); setScoreNum(scoreTarget);
      }
    }

    const t = setTimeout(() => { raf = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [scoreTarget]);

  return (
    <div className="fp-circle-wrap">
      <canvas ref={canvasRef} width="170" height="170" style={{ position: "absolute", top: 0, left: 0 }} />
      <div className="fp-circle-inner">
        <div className="fp-score-big">{scoreNum}</div>
        <div className="fp-score-denom">/ 100</div>
      </div>
    </div>
  );
}

/* ── COMPONENT 2: PieChart ── */
function PieChart({ categories, scoreTarget }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const shadowPlugin = {
      id: "fpPieShadow",
      beforeDraw(chart) {
        chart.ctx.save();
        chart.ctx.shadowOffsetX = 0; chart.ctx.shadowOffsetY = 4;
        chart.ctx.shadowBlur = 16; chart.ctx.shadowColor = "rgba(0,0,0,0.5)";
      },
      afterDraw(chart) { chart.ctx.restore(); }
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      plugins: [shadowPlugin],
      data: {
        labels: categories.map(c => c.label),
        datasets: [{
          data: categories.map(c => c.val),
          backgroundColor: categories.map(c => c.color + "cc"),
          borderColor: "rgba(1,2,4,0.9)",
          borderWidth: 3, hoverOffset: 10,
          hoverBorderColor: categories.map(c => c.color),
          hoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true, cutout: "65%", spacing: 4,
        animation: { animateRotate: true, animateScale: true, duration: 900, easing: "easeInOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(1,2,4,0.95)", borderColor: "#252525",
            borderWidth: 1, titleColor: "#fff", bodyColor: "rgba(255,255,255,0.5)",
            padding: 12, cornerRadius: 10,
            callbacks: { label: ctx => `  Score: ${ctx.raw} / 100` }
          }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [categories]);

  return (
    <div className="fp-pie-canvas-wrap">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <div className="fp-pie-center">
        <div className="fp-pcl-val">{scoreTarget}</div>
        <div className="fp-pcl-sub">Overall</div>
      </div>
    </div>
  );
}

/* ── COMPONENT 3: PieLegend ── */
function PieLegend({ categories }) {
  const [bars, setBars] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBars(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="fp-pie-legend">
      {categories.map((c, i) => (
        <div className="fp-legend-row" key={i}>
          <span className="fp-legend-dot" style={{ background: c.color, boxShadow: `0 0 7px ${c.color}99` }} />
          <span className="fp-legend-name">{c.label}</span>
          <div className="fp-legend-bar-wrap">
            <div className="fp-legend-bar-fill" style={{ width: bars ? `${c.val}%` : "0%", background: c.color }} />
          </div>
          <span className="fp-legend-val" style={{ color: c.color }}>{c.val}</span>
        </div>
      ))}
    </div>
  );
}

/* ── COMPONENT 4: SavingsChart ── */
function SavingsChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        datasets: [
          {
            label: "Savings", data: [28, 32, 25, 38, 35, 41],
            backgroundColor: "rgba(74,222,128,0.7)", borderColor: "rgba(74,222,128,1)",
            borderWidth: 0, borderRadius: 5, borderSkipped: false
          },
          {
            label: "Expenses", data: [67, 71, 74, 65, 68, 62],
            backgroundColor: "rgba(248,113,113,0.65)", borderColor: "rgba(248,113,113,1)",
            borderWidth: 0, borderRadius: 5, borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: "rgba(255,255,255,0.4)", boxWidth: 8, boxHeight: 8, padding: 14, font: { size: 12, family: "Be Vietnam Pro" } }
          },
          tooltip: {
            backgroundColor: "rgba(1,2,4,0.95)", borderColor: "#252525",
            borderWidth: 1, titleColor: "#fff", bodyColor: "rgba(255,255,255,0.5)",
            padding: 12, cornerRadius: 10,
            callbacks: { label: c => `  ${c.dataset.label}: ₹${c.raw}K` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "rgba(255,255,255,0.28)", font: { size: 12, family: "Be Vietnam Pro" } } },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "rgba(255,255,255,0.28)", font: { size: 12, family: "Be Vietnam Pro" }, callback: v => "₹" + v + "K" }
          }
        }
      }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return (
    <div className="fp-savings-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── MAIN PAGE EXPORT ── */
export default function ResultsPage() {
  const navigate = useNavigate();

  // 1. Setup states for your dynamic data
  const [scoreTarget, setScoreTarget] = useState(72); // Default fallback
  const [dynamicCategories, setDynamicCategories] = useState([
    { label: "Savings Rate",        val: 34, color: "#4ade80" },
    { label: "Investment Score",    val: 61, color: "#95d7e4" },
    { label: "Debt Management",     val: 82, color: "#3b93ce" },
    { label: "Risk Preparedness",   val: 54, color: "#fbbf24" },
    { label: "Retirement Planning", val: 42, color: "#f87171" },
  ]);

  // 2. Fetch the data your backend saved after the Quiz!
  useEffect(() => {
    const storedResults = localStorage.getItem('finGpsResults');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        
        // Update the big score
        if (parsed.totalScore) {
          setScoreTarget(parsed.totalScore);
        }

        // Map the backend object into the exact array your Chart.js expects
        if (parsed.categories) {
          const backendData = parsed.categories;
          setDynamicCategories([
            { label: "Savings Rate",        val: backendData.savingsRate || 0,        color: "#4ade80" },
            { label: "Investment Score",    val: backendData.investmentHealth || 0,   color: "#95d7e4" },
            { label: "Debt Management",     val: backendData.debtManagement || 0,     color: "#3b93ce" },
            { label: "Risk Preparedness",   val: backendData.riskPreparedness || 0,   color: "#fbbf24" },
            { label: "Retirement Planning", val: backendData.retirementPlanning || 0, color: "#f87171" },
          ]);
        }
      } catch (error) {
        console.error("Error parsing stored results:", error);
      }
    }
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="fp-root">
        <div className="fp-orb fp-orb-1" />
        <div className="fp-orb fp-orb-2" />
        <div className="fp-orb fp-orb-3" />
        <div className="fp-orb fp-orb-4" />

        <div className="fp-page">

          {/* Topbar */}
          <div className="fp-topbar">
            <button className="fp-back-btn" onClick={() => navigate(-1)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div className="fp-logo-row">
              <div className="fp-logo-icon">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path d="M3 13L7 9L10 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="fp-logo-text">FinGPS</div>
            </div>
            <div className="fp-badge">Financial Report · 2026</div>
          </div>

          {/* Hero */}
          <div className="fp-hero">
            <div className="fp-hero-label">✦ Analysis Complete</div>
            <h1>
              <span className="fp-plain">Congrats! You scored </span>
              <span className="fp-grad-blue">{scoreTarget}/100</span>
              <br />
              <span className="fp-plain">in finance </span>
              <span className="fp-grad-cyan">nationally</span>
            </h1>
            <p className="fp-hero-sub">Based on your quiz responses — here's a breakdown of your financial health</p>
          </div>

          {/* Row 1: Score + Pie */}
          <div className="fp-row-top">
            <div className="fp-glass fp-score-card">
              <div className="fp-card-title">Overall Score</div>
              {/* Pass the dynamic target down */}
              <ScoreArc scoreTarget={scoreTarget} />
              <div className="fp-score-grade">Good Standing</div>
              <div className="fp-score-desc">You're ahead of 68% of users in your income bracket</div>
              <div className="fp-mini-stats">
                <div className="fp-mini-stat">
                  <div className="fp-mini-stat-val" style={{ color: "#4ade80" }}>↑12%</div>
                  <div className="fp-mini-stat-lbl">vs last quiz</div>
                </div>
                <div className="fp-mini-stat">
                  <div className="fp-mini-stat-val" style={{ color: "#95d7e4" }}>Top 32%</div>
                  <div className="fp-mini-stat-lbl">Nationally</div>
                </div>
              </div>
            </div>

            <div className="fp-glass fp-pie-card">
              <div className="fp-card-title">Score Breakdown by Category</div>
              <div className="fp-pie-inner">
                {/* Pass the dynamic categories and target down */}
                <PieChart categories={dynamicCategories} scoreTarget={scoreTarget} />
                <PieLegend categories={dynamicCategories} />
              </div>
            </div>
          </div>

          {/* Row 2: Savings Chart */}
          <div className="fp-row-savings">
            <div className="fp-glass" style={{ padding: "24px" }}>
              <div className="fp-card-title">Savings vs Expenses — Last 6 Months</div>
              <SavingsChart />
            </div>
          </div>

          {/* Row 3: Strengths + Weaknesses */}
          <div className="fp-row-insights">
            <div className="fp-glass fp-insight-card fp-strength">
              <div className="fp-insight-icon">💪</div>
              <div className="fp-insight-title">Strengths</div>
              <ul className="fp-insight-list">
                {[
                  "Consistent savings habit above 20%",
                  "No high-interest consumer debt",
                  "Emergency fund covers 4+ months",
                  "Active SIP investments running",
                ].map(item => (
                  <li key={item}><span className="fp-bullet" />{item}</li>
                ))}
              </ul>
            </div>

            <div className="fp-glass fp-insight-card fp-weakness">
              <div className="fp-insight-icon">⚠️</div>
              <div className="fp-insight-title">Growth Areas</div>
              <ul className="fp-insight-list">
                {[
                  "No term life insurance coverage",
                  "Investment portfolio under-diversified",
                  "Monthly expenses creeping up 8%",
                  "No clear retirement corpus target",
                ].map(item => (
                  <li key={item}><span className="fp-bullet" />{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTAs */}
          <div className="fp-cta-row">
            <button className="fp-cta-btn" onClick={() => navigate("/roadmap")}>
              🗺️ Show My Roadmap
            </button>
            <button className="fp-cta-btn" onClick={() => navigate("/chat")}>
              🤖 Talk to ARTH
            </button>
          </div>

        </div>
      </div>
    </>
  );
}