import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './ContactUsPage.css'
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
  Home,
  Mail,
  MapPin,
  PhoneCall,
  Rocket,
  X,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  createRackTrackLead,
  type RackTrackLeadPayload,
} from '../services/salesforceApi'

const faqs = [
  ['Can we scan existing racks?', 'Yes, RackTrack identifies racks, switches, ports, and cables.'],
  ['Can we request a demo?', 'Yes, submit the form and our team will schedule a walkthrough.'],
  ['Is it useful for audits?', 'Yes, it helps maintain rack and port inventory visibility.'],
] as const

type SubmitState = 'idle' | 'sending' | 'sent' | 'error'

type SuccessModalData = {
  message: string
}

const initialFormData: RackTrackLeadPayload = {
  fullName: '',
  email: '',
  companyName: '',
  rackCount: '',
  requirement: '',
  description: '',
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function ContactUsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RackTrackLeadPayload>(initialFormData)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [formMessage, setFormMessage] = useState('')
  const [successModal, setSuccessModal] = useState<SuccessModalData | null>(null)

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null
    const sectionId = state?.scrollTo || location.hash.slice(1)

    if (!sectionId) {
      return
    }

    const target = document.getElementById(sectionId)

    if (!target) {
      return
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location])

  const scrollToForm = () => {
    const target = document.getElementById('contact')
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (submitState !== 'idle') {
      setSubmitState('idle')
      setFormMessage('')
    }
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Full Name is required.'
    }

    if (!formData.email.trim()) {
      return 'Email Address is required.'
    }

    if (!isValidEmail(formData.email)) {
      return 'Please enter a valid email address.'
    }

    if (!formData.requirement.trim()) {
      return 'Please select what you are trying to improve.'
    }

    if (!formData.description.trim()) {
      return 'Please tell us about your rack, audit, or workflow requirement.'
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationMessage = validateForm()
    if (validationMessage) {
      setSubmitState('error')
      setFormMessage(validationMessage)
      return
    }

    setSubmitState('sending')
    setFormMessage('')

    const response = await createRackTrackLead(formData)

    if (response.success) {
      setSubmitState('sent')
      setFormMessage(response.message || 'Your request has been submitted successfully.')
      setSuccessModal({
        message: response.message || 'Your demo request has been submitted successfully.',
      })
      setFormData(initialFormData)
      return
    }

    setSubmitState('error')
    setFormMessage(response.message || 'We could not submit your request right now.')
  }

  return (
    <main className="contact-page">
      {successModal ? (
        <div
          className="contact-success-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="contact-success-modal">
            <button
              type="button"
              className="contact-success-close"
              onClick={() => navigate('/')}
              aria-label="Close success popup and go to home page"
            >
              <X size={18} />
            </button>

            <div className="contact-success-badge" aria-hidden="true">
              <CircleCheckBig size={28} />
            </div>

            <p className="contact-success-eyebrow">Demo Request Submitted</p>
            <h2 id="contact-success-title">Your demo request has been submitted successfully.</h2>
            <p className="contact-success-copy">
              We have received your request and our team will review it shortly before
              reaching out with the next steps.
            </p>

            <p className="contact-success-message">{successModal.message}</p>

            <button
              type="button"
              className="contact-success-home"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              Close and Go Home
            </button>
          </div>
        </div>
      ) : null}

      <section className="contact-hero">
        <div className="hero-content">
          <h1>
            Talk to
            <span> RackTrack.</span>
          </h1>

          <p>
            Partner with RackTrack to simplify data center operations and accelerate
            decision-making. From real-time visibility to smarter workflows, we deliver
            the insights you need to build, manage, and scale with confidence.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={scrollToForm}>
              Start a Conversation <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="contact-stage contact-stage-showcase" aria-hidden="true">
          <div className="contact-glow" />

          <div className="contact-render-scene">
            <img
              src="/Images/racktrack-contact-hero.jpg"
              alt=""
              className="contact-render-image"
              draggable="false"
            />

          </div>
        </div>
      </section>

      <section id="contact-info" className="contact-info-section">
        <div className="info-card">
          <MapPin />
          <span>Office Address</span>
          <strong>85 Felt Rd, Suite #604</strong>
          <p>South Windsor, CT 06074</p>
        </div>

        <div className="info-card">
          <Mail />
          <span>Email</span>
          <strong>info@racktrack.ai</strong>
          <p>Share audit goals, rollout questions, or support requests.</p>
        </div>

        <div className="info-card">
          <PhoneCall />
          <span>Phone</span>
          <strong>+1 (860) 566 9894</strong>
          <p>Call our contact team for demos, support, and meeting schedules.</p>
        </div>

        <div className="info-card">
          <Clock3 />
          <span>Response Time</span>
          <strong>Within 1 business day</strong>
          <p>We respond quickly to demos, planning, and support conversations.</p>
        </div>
      </section>

      <section id="contact" className="contact-main-section">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <h2>
            Start your
            <span> conversation.</span>
          </h2>

          <p className="contact-form-intro">
            Tell us what you need and the RackTrack team will get back to you with the
            right next step.
          </p>

          <div className="form-row">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="rackCount"
              placeholder="Rack Count or Site Size"
              value={formData.rackCount}
              onChange={handleChange}
            />
          </div>

          <select
            name="requirement"
            required
            value={formData.requirement}
            onChange={handleChange}
            draggable="false"
          >
            <option value="" disabled>
              What are you trying to improve?
            </option>
            <option value="AR Rack Scanning">AR Rack Scanning</option>
            <option value="AI Device Detection">AI Device Detection</option>
            <option value="Port Tracking">Port Tracking</option>
            <option value="Network Topology">Network Topology</option>
            <option value="Automated Inventory">Automated Inventory</option>
            <option value="Security & Compliance">Security & Compliance</option>
          </select>

          <textarea
            name="description"
            placeholder="Tell us about your racks, switches, ports, or audit requirement."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className={`submit-rocket-btn is-${submitState}`}
            disabled={submitState === 'sending'}
          >
            <span className="rocket-flight" aria-hidden="true">
              <span className="rocket-icon">
                <Rocket size={18} />
              </span>
            </span>
            <span className="submit-label">
              {submitState === 'sent'
                ? 'Message Sent'
                : submitState === 'sending'
                  ? 'Sending'
                  : submitState === 'error'
                    ? 'Try Again'
                    : 'Submit Request'}
            </span>
            {submitState === 'sent' ? (
              <CheckCircle2 size={16} />
            ) : submitState === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </button>

          {formMessage ? (
            <p
              className={`contact-form-status contact-form-status--${submitState}`}
              role={submitState === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {formMessage}
            </p>
          ) : null}
        </form>

        <aside className="faq-panel">
          <h2>
            Before you
            <span> connect.</span>
          </h2>

          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
