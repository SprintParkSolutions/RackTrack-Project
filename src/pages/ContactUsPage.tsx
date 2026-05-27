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
    'Can RackTrack scan existing racks without downtime?',
    'Yes. RackTrack uses a smartphone video sweep to capture rack state without agents, downtime, or disruption to production infrastructure.',
  ],
  [
    'What kind of infrastructure can RackTrack identify?',
    'RackTrack supports a broad and continuously expanding range of enterprise networking and data center infrastructure devices.',
  ],
  [
    'How does RackTrack verify inventory accuracy?',
    'RackTrack reconciles physical scan data against live infrastructure signals to maintain continuously verified inventory and topology records.',
  ],
  [
    'Does RackTrack replace our CMDB or DCIM?',
    'No. RackTrack acts as the physical intelligence layer underneath existing CMDB, DCIM, and ITSM platforms — helping reconcile what systems report against what is physically present in the rack.',
  ],
  [
    'Is RackTrack useful for compliance and audit preparation?',
    'Yes. RackTrack helps generate continuously updated inventory, topology, and infrastructure evidence that supports audit readiness and operational reviews.',
  ],
  [
    'Can RackTrack help during incidents and outages?',
    'Yes. RackTrack helps teams quickly identify devices, ports, and cable relationships so responders spend less time validating rack state during critical incidents.',
  ],
  [
    'Does RackTrack support security and vulnerability workflows?',
    'Yes. RackTrack provides device-level firmware and infrastructure posture visibility to help security teams identify operational and compliance risks faster.',
  ],
  [
    'How long does a baseline assessment take?',
    'Typically about twenty minutes for a single rack or row. The assessment compares your existing records against observed physical and network state.',
  ],
  [
    'Can we request a demo before committing?',
    'Yes. You can schedule a guided walkthrough against your own environment to see how RackTrack performs on real infrastructure.',
  ],
  [
    'Does RackTrack work with existing enterprise tools?',
    'Yes. RackTrack is designed to integrate with existing infrastructure, inventory, compliance, and operational workflows.',
  ],
  [
    'Where can RackTrack be deployed?',
    'RackTrack supports cloud-hosted, private cloud, on-premise, and air-gapped deployment models for regulated or restricted environments.',
  ],
  [
    'Who uses RackTrack?',
    'RackTrack is built for infrastructure leaders, network engineering teams, security operations, compliance owners, incident responders, and data center operators.',
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
            Engage the
            <span> platform team.</span>
          </h1>

          <p>
            Whether you're evaluating the platform, scoping a deployment, or designing a continuous reconciliation strategy across your fleet — our team is ready.
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
            Tell us about your
            <span> infrastructure.</span>
          </h2>

          <p className="contact-form-intro">
            Tell us about your infrastructure footprint and the RackTrack team will scope a guided demo against your environment.
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
