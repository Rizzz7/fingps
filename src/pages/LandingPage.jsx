import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import FinancialArchitecture from '../components/FinancialArchitecture'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div style={{ background: '#010204', color: '#fff', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <FAQ />
      <FinancialArchitecture />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPage