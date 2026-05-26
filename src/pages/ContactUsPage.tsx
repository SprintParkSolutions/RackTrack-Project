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
  [
    'Can RackTrack scan existing racks and live environments?',
    'Yes. RackTrack is designed to work with real-world rack environments so teams can document devices, ports, cabling, and physical layout without starting from scratch.',
  ],
  [
    'Can we request a live demo tailored to our environment?',
    'Yes. Share your current challenges, rack count, or rollout goals in the form and our team can schedule a walkthrough focused on your environment and workflows.',
  ],
  [
    'What information should we prepare before contacting your team?',
    'Helpful details include your number of racks or sites, audit or migration goals, current inventory process, and any CMDB, DCIM, or network visibility gaps you want to solve.',
  ],
  [
    'Is RackTrack useful for audits, compliance, and evidence collection?',
    'Yes. RackTrack helps teams maintain trustworthy infrastructure records that support audit readiness, operational reviews, and validation of what is actually installed in the rack.',
  ],
  [
    'Can RackTrack support multi-site data centers or colocation environments?',
    'Yes. RackTrack can support teams that manage infrastructure across multiple rooms, buildings, or sites and need a more consistent way to capture and verify rack-level inventory.',
  ],
  [
    'How does RackTrack fit with our existing tools and workflows?',
    'RackTrack is built to complement existing operational processes by improving physical visibility and helping teams reconcile rack reality with the systems they already depend on.',
  ],
  [
    'Do you offer help with pilots, rollout planning, or next steps?',
    'Yes. Our team can help you evaluate fit, define a pilot scope, and plan the next steps for deployment, internal alignment, and broader rollout.',
  ],
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
  mobileCountry: '+1',
  mobileNumber: '',
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
    const missingFields: string[] = []

    if (!formData.fullName.trim()) {
      missingFields.push('Full Name')
    }

    if (!formData.email.trim()) {
      missingFields.push('Email Address')
    }

    if (formData.email.trim() && !isValidEmail(formData.email)) {
      return 'Please enter a valid email address.'
    }

    if (!formData.mobileNumber.trim()) {
      missingFields.push('Mobile Number')
    }

    if (missingFields.length > 0) {
      return `Please complete the required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}.`
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
              src="/Images/racktrack-contact-hero-v4.webp"
              alt=""
              className="contact-render-image"
              draggable="false"
            />
            <div className="contact-rack-dots">
              <span className="contact-rack-dot contact-rack-dot--1" />
              <span className="contact-rack-dot contact-rack-dot--2" />
              <span className="contact-rack-dot contact-rack-dot--3" />
              <span className="contact-rack-dot contact-rack-dot--4" />
              <span className="contact-rack-dot contact-rack-dot--5" />
              <span className="contact-rack-dot contact-rack-dot--6" />
              <span className="contact-rack-dot contact-rack-dot--7" />
              <span className="contact-rack-dot contact-rack-dot--8" />
              <span className="contact-rack-dot contact-rack-dot--9" />
              <span className="contact-rack-dot contact-rack-dot--10" />
              <span className="contact-rack-dot contact-rack-dot--11" />
              <span className="contact-rack-dot contact-rack-dot--12" />
            </div>
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
            <label className="form-field">
              <span className="form-field-label">
                Full Name <span aria-hidden="true" className="required-asterisk">*</span>
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-field">
              <span className="form-field-label">
                Email Address <span aria-hidden="true" className="required-asterisk">*</span>
              </span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span className="form-field-label">
                Company Name <span className="optional-label">(Optional)</span>
              </span>
              <input
                type="text"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </label>
            <label className="form-field">
              <span className="form-field-label">
                Mobile Number <span aria-hidden="true" className="required-asterisk">*</span>
              </span>
              <div className="phone-input-group">
                <select
                  name="mobileCountry"
                  value={formData.mobileCountry}
                  onChange={handleChange}
                  aria-label="Country code"
                  required
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter your mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>
          </div>

          <label className="form-field">
            <span className="form-field-label">
              Requirement <span className="optional-label">(Optional)</span>
            </span>
            <textarea
              name="requirement"
              placeholder="Enter your requirement or notes"
              value={formData.requirement}
              onChange={handleChange}
            />
          </label>

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
