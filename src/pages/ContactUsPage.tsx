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
            <a href="#contact" className="primary-btn">
              Get a Demo <ArrowUpRight size={16} />
            </a>

            <a href="#contact" className="secondary-btn">
              Contact Us
            </a>
          </div>
        </div>

        <div className="contact-stage contact-stage-showcase" aria-hidden="true">
          <div className="contact-glow" />

          <div className="contact-render-scene">
            <img
              src="/Images/racktrack-contact-hero.png"
              alt=""
              className="contact-render-image"
              draggable="false"
            />

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

          <select required defaultValue="" draggable="false">
            <option value="" disabled hidden>What are you trying to improve?</option>
            <option value="AR Rack Scanning">AR Rack Scanning</option>
            <option value="AI Device Detection">AI Device Detection</option>
            <option value="Port Tracking">Port Tracking</option>
            <option value="Network Topology">Network Topology</option>
            <option value="Automated Inventory">Automated Inventory</option>
            <option value="Security & Compliance">Security & Compliance</option>
          </select>

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
