import { useState } from 'react'
import type { FormEvent } from 'react'
import './ContactUsPage.css'
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  PhoneCall,
  Rocket,
} from 'lucide-react'

const faqs = [
  ['Can we scan existing racks?', 'Yes, RackTrack identifies racks, switches, ports, and cables.'],
  ['Can we request a demo?', 'Yes, submit the form and our team will schedule a walkthrough.'],
  ['Is it useful for audits?', 'Yes, it helps maintain rack and port inventory visibility.'],
]

export default function ContactUsPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitState('sending')
    setTimeout(() => setSubmitState('sent'), 2400)
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <span className="eyebrow">DATA CENTER CONTACT</span>

          <h1>
            Talk to
            <span> RackTrack.</span>
          </h1>

          <p>
            Connect with RackTrack for customer inquiries, demo requests, audit planning,
            and deployment discussions. We help infrastructure teams move from manual
            rack reviews to reliable visibility across devices, ports, and cables.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="primary-btn">
              Get a Demo <ArrowUpRight size={16} />
            </a>

            <a href="#contact" className="secondary-btn">
              Contact Us
            </a>
          </div>
        </div>

        <div className="contact-stage" aria-hidden="true">
          <div className="contact-glow" />
          <div className="contact-orbit contact-orbit-one" />
          <div className="contact-orbit contact-orbit-two" />

          <div className="contact-visual">
            <div className="contact-visual__aura contact-visual__aura--one" />
            <div className="contact-visual__aura contact-visual__aura--two" />
            <div className="contact-visual__spine" />
            <div className="contact-hub">
              <div className="contact-hub__header" aria-hidden="true">
                <span />
                <strong />
              </div>

              <div className="contact-hub__screen">
                <div className="contact-hub__signal" />
                <div className="contact-hub__grid" />
                <div className="contact-hub__rack">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={`contact-rack-${index}`} />
                  ))}
                </div>
                <div className="contact-hub__beam" />
              </div>
            </div>

            <div className="contact-node contact-node-phone">
              <PhoneCall size={22} />
              <div className="contact-node__lines" aria-hidden="true">
                <small />
                <span />
              </div>
            </div>

            <div className="contact-node contact-node-mail">
              <Mail size={20} />
              <div className="contact-node__lines" aria-hidden="true">
                <small />
                <span />
              </div>
            </div>

            <div className="contact-node contact-node-response">
              <Clock3 size={20} />
              <div className="contact-node__lines" aria-hidden="true">
                <small />
                <span />
              </div>
            </div>

            <div className="contact-mini-card contact-mini-card-one" aria-hidden="true">
              <strong />
              <span />
            </div>

            <div className="contact-mini-card contact-mini-card-two" aria-hidden="true">
              <strong />
              <span />
            </div>

            <div className="signal-ring ring-one" />
            <div className="signal-ring ring-two" />
            <div className="signal-ring ring-three" />
            <div className="signal-dot dot-one" />
            <div className="signal-dot dot-two" />
            <div className="signal-dot dot-three" />
            <div className="signal-link signal-link-one" />
            <div className="signal-link signal-link-two" />
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="info-card">
          <Building2 />
          <span>Office Address</span>
          <strong>Asian Sun City, Block B, Kondapur</strong>
          <p>Unit No 1204, Forest Department, Hyderabad 500084.</p>
        </div>

        <div className="info-card">
          <Mail />
          <span>Email</span>
          <strong>support@racktrack.com</strong>
          <p>Share audit goals, rollout questions, or support requests.</p>
        </div>

        <div className="info-card">
          <PhoneCall />
          <span>Phone Numbers</span>
          <strong>+91 93985 85511</strong>
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
        <form className="contact-form" onSubmit={handleSubmit}>
          <span className="eyebrow">CONTACT FORM</span>

          <h2>
            Start your
            <span> conversation.</span>
          </h2>

          <p className="contact-form-intro">
            Tell us what you need and the RackTrack team will get back to you with the
            right next step.
          </p>

          <div className="form-row">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
          </div>

          <div className="form-row">
            <input type="text" placeholder="Company Name" required />
            <input type="text" placeholder="Rack Count or Site Size" />
          </div>

          <input type="text" placeholder="Subject" required />

          <textarea
            placeholder="Tell us about your racks, switches, ports, or audit requirement."
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
                  : 'Submit Request'}
            </span>
            {submitState === 'sent' ? <CheckCircle2 size={16} /> : <ArrowUpRight size={16} />}
          </button>
        </form>

        <aside className="faq-panel">
          <span className="eyebrow">FAQ</span>

          <h2>Before you connect</h2>

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
