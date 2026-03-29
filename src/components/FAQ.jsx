import React from 'react';
import { motion } from 'framer-motion';

const faqs = [
  { question: 'What is FinGPS?', answer: 'FinGPS is an intelligent financial navigation system designed to give you complete clarity over your money. It transforms complex financial data into a simple, guided journey—so you always know where you stand and where you\'re headed.', avatar: 'Q1', avatarColor: '#38bdf8' },
  { question: 'How does FinGPS work?', answer: 'FinGPS securely connects to your financial ecosystem, analyzes your transactions in real time, and uses AI to deliver personalized insights, forecasts, and recommendations tailored to your financial behavior.', avatar: 'Q2', avatarColor: '#4ade80' },
  { question: 'What value does it provide?', answer: 'FinGPS goes beyond tracking—it helps you make better decisions. From identifying hidden spending patterns to optimizing savings and forecasting future balances, it empowers you to take control with precision.', avatar: 'Q3', avatarColor: '#fb923c' },
  { question: 'Is my data secure?', answer: 'Absolutely. FinGPS is built on a privacy-first architecture with bank-grade encryption, ensuring your data remains protected, confidential, and fully under your control.', avatar: 'Q4', avatarColor: '#f87171' },
  { question: 'Different from other apps?', answer: 'FinGPS doesn\'t just show your data—it guides you. Like a GPS for your finances, it provides direction, adapts to your behavior, and continuously optimizes your path toward financial goals.', avatar: 'Q5', avatarColor: '#a78bfa' },
  { question: 'Who is FinGPS built for?', answer: 'FinGPS is built for individuals who want more than basic tracking—those who seek clarity, control, and intelligent guidance in managing their financial future.', avatar: 'Q6', avatarColor: '#22d3ee' },
];

// ── SINGLE CARD ──
const FAQCard = ({ q, index }) => {
  // ── 2D STAGGER CALCULATION ──
  const col = index % 3;
  const row = Math.floor(index / 3);
  const delay = col * 0.15 + row * 0.1;

  return (
    <motion.div
      layout
      // 👇 Changed to flex column and h-full so all cards stretch to equal height in the grid
      className="rounded-2xl p-7 flex flex-col h-full cursor-default"
      style={{
        background: 'rgba(8,13,36,0.52)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(79,111,241,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{
        y: -5,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(79,111,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: { duration: 0.2 }
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(79,111,241,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(79,111,241,0.12)';
      }}
    >
      <motion.p
        className="text-sm leading-relaxed mb-6 mt-2"
        style={{ color: 'rgba(255,255,255,0.7)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        viewport={{ once: true }}
      >
        {q.answer}
      </motion.p>

      {/* 👇 Added mt-auto (margin-top: auto) to push this block to the absolute bottom of the card */}
      <motion.div
        className="flex items-center gap-3 pt-4 mt-auto"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: q.avatarColor + '22',
            color: q.avatarColor,
            border: `1px solid ${q.avatarColor}44`,
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.35, ease: 'backOut' }}
          viewport={{ once: true }}
        >
          {q.avatar}
        </motion.div>

        <div>
          <p className="text-sm font-semibold">{q.question}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Frequently Asked Question</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(26,70,200,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(26,70,200,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1200px] mx-auto">
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
            FAQ
          </span>
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Common questions{' '}
            <span className="text-gradient">answered</span>
          </h2>
          <p className="max-w-[460px] mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Everything you need to know about FinGPS and how it can transform your financial life.
          </p>
        </motion.div>

        {/* 👇 Changed from columns to a true CSS Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {faqs.map((q, i) => (
            <FAQCard key={i} q={q} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;