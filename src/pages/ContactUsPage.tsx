import { useState } from 'react'
import type { FormEvent } from 'react'
import './ContactUsPage.css'
import {
  ArrowUpRight,
  Cable,
  Mail,
  MapPin,
  Phone,
  Server,
  ShieldCheck,
} from 'lucide-react'

const faqs = [
  ['Can we scan existing racks?', 'Yes, RackTrack identifies racks, switches, ports, and cables.'],
  ['Can we request a demo?', 'Yes, submit the form and our team will schedule a walkthrough.'],
  ['Is it useful for audits?', 'Yes, it helps maintain rack and port inventory visibility.'],
]

const rackRows = Array.from({ length: 9 })

export default function ContactUsPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="hero-content">
          <span className="eyebrow">DATA CENTER CONTACT</span>

          <h1>
            Smarter rack
            <span> visibility.</span>
          </h1>

          <p>
            Identify racks, switches, ports, cables, and available capacity with RackTrack.
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

        <div className="rack-stage">
          <div className="rack-glow" />

          <div className="rack-visual">
            <div className="rack-top">
              <Server size={16} />
              <span>RackTrack Node</span>
            </div>

            <div className="rack-body">
              {rackRows.map((_, rowIndex) => (
                <div className="rack-row" key={rowIndex}>
                  <div className="rack-label" />

                  <div className="ports">
                    {Array.from({ length: 20 }).map((_, portIndex) => (
                      <span
                        key={portIndex}
                        className={
                          portIndex % 5 === 0 || portIndex % 7 === 0
                            ? 'port active'
                            : 'port'
                        }
                      />
                    ))}
                  </div>

                  <div className="leds">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              ))}

              <div className="server-blocks">
                <div />
                <div />
                <div />
                <div />
              </div>

              <div className="cable-bundle cable-one" />
              <div className="cable-bundle cable-two" />
              <div className="cable-bundle cable-three" />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="info-card">
          <Phone />
          <span>Phone</span>
          <strong>+1 (800) 555-1234</strong>
        </div>

        <div className="info-card">
          <Mail />
          <span>Email</span>
          <strong>support@racktrack.com</strong>
        </div>

        <div className="info-card">
          <MapPin />
          <span>Location</span>
          <strong>San Francisco, CA</strong>
        </div>
      </section>

      <section id="contact" className="contact-main-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <span className="eyebrow">CONTACT FORM</span>

          <h2>
            Let’s discuss your
            <span> data center.</span>
          </h2>

          <div className="form-row">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
          </div>

          <input type="text" placeholder="Subject" required />

          <textarea
            placeholder="Tell us about your racks, switches, ports, or audit requirement."
            required
          />

          <button type="submit">
            {sent ? 'Message Sent' : 'Submit Request'} <ArrowUpRight size={16} />
          </button>
        </form>

        <aside className="faq-panel">
          <span className="eyebrow">FAQ</span>

          <h2>Before you connect</h2>

          <div className="quick-points">
            <div>
              <ShieldCheck />
              <span>Audit-ready rack visibility</span>
            </div>
            <div>
              <Cable />
              <span>Switch, port, and cable tracking</span>
            </div>
          </div>

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