# FinGPS — Your Financial Life, Mapped Like GPS

> India's first AI-powered personal finance mentor. Know where you are. Build where you're going.

![FinGPS Dashboard](https://img.shields.io/badge/Status-Active-4ade80?style=flat-square) ![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

---

## What is FinGPS?

FinGPS is a premium dark-theme fintech web app that gives everyday Indians a personalised **Financial DNA Score**, a **3-bucket wealth roadmap**, and an **AI advisor (ARTH)** — all from a 9-question quiz.

Built for the **ET AI National Level Hackathon**.

---

## Features

- **Dynamic Branching Quiz** — 9 questions that adapt based on your life stage (Student / Early Career / Mid-Career / Retirement)
- **Financial DNA Score** — A personalised 0–100 score calculated from your answers
- **Interactive Dashboard** — Live score ring, ARTH Actions, weakness detection, and wealth simulation
- **ARTH AI Advisor** — Powered by Gemini API, knows your score and gives India-specific advice
- **WHATif Engine** - A complete multiverse timeline where you can simulate multiple outcomes based on current actions.
- **Financial Roadmap** — A visual GPS-style milestone map across 3 buckets: Safety Net → Wealth Engine → Dream Fund
- **Simulate Feature** — See Elite, Good, and Slow wealth paths projected 20 years ahead with compound interest math
- **Premium Dark UI** — Glassmorphism, Framer Motion animations, twinkling starfield, cinematic fog

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS 3 + inline styles |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router DOM v6 |
| Fonts | Be Vietnam Pro, Inter, Space Grotesk |
| Background | OGL (WebGL Dark Veil) |

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/fingps-frontend.git
cd fingps-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Environment

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to your deployed backend URL.

---

## Project Structure

```
src/
  components/
    Navbar.jsx          # Scroll-aware sticky navbar
    Hero.jsx            # Landing hero with starfield + typewriter
    Features.jsx        # 6 feature cards with stagger animation
    HowItWorks.jsx      # 4-step numbered guide
    Stats.jsx           # Animated count-up stats
    Testimonials.jsx    # Masonry testimonial grid
    Pricing.jsx         # 3-tier pricing cards
    CTA.jsx             # Call-to-action section
    Footer.jsx          # Footer with live status indicator
    DarkVeil.jsx        # WebGL animated background (OGL)
    PageLayout.jsx      # Global layout wrapper
  pages/
    LandingPage.jsx     # Public homepage
    LoginPage.jsx       # Sign in with mouse-tracking inputs
    SignUpPage.jsx      # Registration
    QuizPage.jsx        # 9-question branching quiz
    AnalysisPage.jsx    # Loading screen with DNA animation
    ResultsPage.jsx     # Score reveal + insights
    DashboardPage.jsx   # Main user dashboard (post-login)
    RoadmapPage.jsx     # Visual milestone roadmap
    ChatPage.jsx        # ARTH AI chat interface
    WhatIfEngine.jsx    # Scenario simulator
  lib/
    utils.js
  App.jsx
  main.jsx
  index.css             # Global styles + glass card utilities
```

---

## User Flow

```
Landing Page
    ↓
Sign Up / Login
    ↓
9-Question Quiz (branching by life stage)
    ↓
Analysis Loading Screen (DNA animation)
    ↓
Results Page (Financial DNA Score)
    ↓
Dashboard (Actions, Leaks, Simulate)
    ↓
Roadmap (12 milestones across 3 sectors)
    ↓
ARTH Chat (Gemini-powered AI advisor)
```

---

## Colour Palette

| Token | Value | Usage |
|---|---|---|
| `primary` | `#010204` | Page background |
| `surface` | `#0e0b0e` | Card surfaces |
| `accent` | `#007be3` | Primary blue |
| `accent2` | `#4f4ff1` | Purple accent |
| `cyan` | `#95d7e4` | Highlights / ARTH |
| `blue2` | `#3b93ce` | Secondary blue |

---

## Backend

This frontend connects to the **FinGPS Backend API**.
→ [fingps-backend](https://github.com/YOUR_USERNAME/fingps-backend)

---

## Team

Built with ❤️ for Bharat 🇮🇳

---

## License

MIT
