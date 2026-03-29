import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import PageLayout from './components/PageLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
// 👇 1. Import your newly created SignUpPage
import SignUpPage from './pages/SignUpPage' 
import QuizPage from './pages/QuizPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'
import RoadmapPage from './pages/Roadmap'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import WhatIfEngine from './pages/WhatIfEngine'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout><LandingPage /></PageLayout>} />
        <Route path="/login" element={<LoginPage />} />
        {/* 👇 2. Add the route for /signup */}
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/chat" element={<ChatPage />} />
       

       <Route path="/dashboard" element={<DashboardPage />} />
       <Route path="/whatif" element={<WhatIfEngine />} />
       
       
      </Routes>
    </BrowserRouter>
  )
}

export default App