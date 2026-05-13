import { useState } from 'react'
import type { FormEvent } from 'react'
import './ContactUsPage.css'
import {
  ArrowUpRight,
  Building2,
  Cable,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  RadioTower,
  Server,
  ShieldCheck,
} from 'lucide-react'

const faqs = [
  ['Can we scan existing racks?', 'Yes, RackTrack identifies racks, switches, ports, and cables.'],
  ['Can we request a demo?', 'Yes, submit the form and our team will schedule a walkthrough.'],
  ['Is it useful for audits?', 'Yes, it helps maintain rack and port inventory visibility.'],
]

const rackRows = Array.from({ length: 9 })

const contactStats = [
  ['Response Window', '1 business day'],
  ['Consultation Mode', 'Demo + discovery'],
  ['Office Base', 'Hyderabad'],
]

const engagementSteps = [
  {
    icon: Server,
    title: 'Share your environment',
    text: 'Tell us about rack count, switch density, and audit goals.',
  },
  {
    icon: RadioTower,
    title: 'We scope the workflow',
    text: 'Our team maps the rollout, coverage needs, and reporting flow.',
  },
  {
    icon: CheckCircle2,
    title: 'Launch the demo',
    text: 'See RackTrack identify ports, cables, and device inventory live.',
  },
]

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
            Talk to
            <span> RackTrack.</span>
          </h1>

          <p>
            Connect with RackTrack for customer inquiries, demo requests, audit planning,
            and deployment discussions. We help infrastructure teams move from manual
            rack reviews to reliable visibility across devices, ports, and cables.
          </p>

          <div className="hero-address-card">
            <MapPin size={18} />
            <div>
              <span>Registered Office</span>
              <strong>
                Unit No 1204, Forest Department,
                <br />
                Asian Sun City, Block B, Kondapur,
                <br />
                Hyderabad 500084
              </strong>
            </div>
          </div>

          <div className="hero-stat-row">
            {contactStats.map(([label, value]) => (
              <div key={label} className="hero-stat-card">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <a href="#contact" className="primary-btn">
              Get a Demo <ArrowUpRight size={16} />
            </a>

            <a href="#contact" className="secondary-btn">
              Contact Us
            </a>
          </div>

          <div className="hero-trust-strip">
            <div>
              <ShieldCheck size={18} />
              <span>Customer-first onboarding</span>
            </div>
            <div>
              <Cable size={18} />
              <span>Infrastructure workflow expertise</span>
            </div>
          </div>
        </div>

        <div className="rack-stage">
          <div className="rack-glow" />
          <div className="rack-orbit rack-orbit-one" />
          <div className="rack-orbit rack-orbit-two" />

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
          <Building2 />
          <span>Office Address</span>
          <strong>Asian Sun City, Block B, Kondapur</strong>
          <p>
            Unit No 1204, Forest Department, Hyderabad 500084. Best for customer
            visits, partnership discussions, and scheduled meetings.
          </p>
        </div>

        <div className="info-card">
          <Mail />
          <span>Email</span>
          <strong>support@racktrack.com</strong>
          <p>
            Share your audit goals, rollout questions, or customer requirements and
            our team will route your request quickly.
          </p>
        </div>

        <div className="info-card">
          <Clock3 />
          <span>Response Time</span>
          <strong>Within 1 business day</strong>
          <p>
            We aim to respond promptly to customer contact requests for demos,
            implementation planning, and general support conversations.
          </p>
        </div>
      </section>

      <section className="contact-process-section">
        <div className="process-copy">
          <span className="eyebrow">ENGAGEMENT FLOW</span>
          <h2>
            A clear route from
            <span> inquiry to rollout.</span>
          </h2>
          <p>
            Whether you need a first conversation, a customer demo, or deployment
            planning, RackTrack keeps the process clear, practical, and fast.
          </p>
        </div>

        <div className="process-grid">
          {engagementSteps.map((step, index) => (
            <article className="process-card" key={step.title}>
              <div className="process-index">0{index + 1}</div>
              <step.icon size={20} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
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

          <button type="submit" className={sent ? 'is-sent' : ''}>
            {sent ? 'Message Sent' : 'Submit Request'} <ArrowUpRight size={16} />
          </button>
        </form>

        <aside className="faq-panel">
          <span className="eyebrow">FAQ</span>

          <h2>Before you connect</h2>

          <div className="quick-points">
            <div>
              <ShieldCheck />
              <span>Customer-ready product walkthroughs</span>
            </div>
            <div>
              <Cable />
              <span>Switch, port, and cable intelligence</span>
            </div>
            <div>
              <RadioTower />
              <span>Fast planning and response</span>
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
