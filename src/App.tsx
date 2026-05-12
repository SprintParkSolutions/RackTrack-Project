import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SolutionsPage from './pages/SolutionsPage'
import AboutUsPage from './pages/AboutUsPage'
import ContactUsPage from './pages/ContactUsPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
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
          <div>
            <strong>RACK<span>TRACK</span></strong>
            <p>One sweep. Full audit. AI-powered rack intelligence.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/solutions">Solutions</a>
            <a href="/about-us">About Us</a>
            <a href="/contact-us">Contact Us</a>
          </nav>
        </footer>
      </div>
    </BrowserRouter>
  )
}
