import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideSocialRail from './components/SideSocialRail'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import SolutionsPage from './pages/SolutionsPage'
import AboutUsPage from './pages/AboutUsPage'
import ContactUsPage from './pages/ContactUsPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <ScrollToTop />
        <Navbar />
        <SideSocialRail />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="app-footer">
          <div className="app-footer-main">
            <div className="app-footer-brand">
              <Link to="/" className="app-footer-logo" aria-label="Go to RackTrack home">
                <img src="/RackTrack_Logo.png" alt="RackTrack" className="app-footer-logo-image" />
              </Link>
              <p>A True Physical Layer Inteligence</p>
            </div>
            <div className="app-footer-columns">
              <nav className="app-footer-nav" aria-label="Footer navigation">
                <span className="app-footer-heading">Explore</span>
                <Link to="/about-us">About Us</Link>
                <Link to="/solutions">Solutions</Link>
                <Link to="/contact-us">Contact Us</Link>
              </nav>

              <div className="app-footer-contact">
                <span className="app-footer-heading">Contact</span>
                <a href="mailto:info@racktrack.ai">info@racktrack.ai</a>
                <a href="tel:+18605669894">+1 (860) 566 9894</a>
                <p>85 Felt Rd, Suite #604, South Windsor, CT 06074</p>
              </div>
            </div>
          </div>
          <div className="app-footer-bottom">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
