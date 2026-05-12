import { motion } from 'framer-motion'
import { Activity, LockKeyhole, Network, Rocket } from 'lucide-react'
import './AboutUsPage.css'

const timeline = [
  { icon: Rocket, title: 'Deploy Racks', text: 'Cluster deployment automation with seamless setup.' },
  { icon: Activity, title: 'Monitor Health', text: 'AI-powered monitoring for system health and performance.' },
  { icon: Network, title: 'Scale Network', text: 'Dynamic topology scaling with latency-aware routing and automatic failover.' },
  { icon: LockKeyhole, title: 'Secure Vault', text: 'Zero-trust architecture with encrypted infrastructure visibility.' },
]

const showcase = [
  'RT-800 Edge Compute Rack',
  'Aqua-Chill Cooling Unit',
  'Vector Edge Compute Node',
  'Titan Security Appliance',
  'SiteView Data Center IMS',
]

export default function AboutUsPage() {
  return (
    <main className="about-page">
      <section className="about-mission app-section">
        <motion.div
          className="about-mission-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <span className="app-eyebrow">About RackTrack</span>
          <h1>
            Infrastructure that can
            <span> report itself.</span>
          </h1>
          <p>
            RackTrack eliminates manual audits, reduces downtime, and ensures complete visibility
            of racks, devices, ports, and cables.
          </p>
        </motion.div>
        <div className="values-grid">
          <article><span>Mission</span><p>Simplify and automate data center audits.</p></article>
          <article><span>Vision</span><p>A world where infrastructure is self-aware and self-reporting.</p></article>
          <article><span>Values</span><p>Accuracy, efficiency, security, and measurable operational impact.</p></article>
        </div>
      </section>

      <section className="about-timeline app-section">
        <div className="app-section-heading">
          <span className="app-eyebrow">Hero Timeline</span>
          <h2>Four pillars of intelligent infrastructure</h2>
        </div>
        <div className="timeline-grid">
          {timeline.map((item, index) => (
            <article className="timeline-card" key={item.title}>
              <item.icon />
              <span>Zone {String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-showcase app-section">
        <div className="app-section-heading">
          <span className="app-eyebrow">Innovation Showcase</span>
          <h2>A new paradigm of data infrastructure</h2>
          <p>RackTrack is designed for speed, accuracy, resilience, and scalable infrastructure intelligence.</p>
        </div>
        <div className="showcase-strip">
          {showcase.map((item, index) => (
            <article className="showcase-card" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta app-section">
        <div>
          <span className="app-eyebrow">Get Started Free</span>
          <h2>Scale your infrastructure intelligently.</h2>
          <p>Join teams using RackTrack to automate audits and secure operational visibility.</p>
        </div>
        <form className="about-access-form">
          <input type="email" placeholder="Enter your work email" aria-label="Work email" />
          <button type="submit">Request Access</button>
        </form>
      </section>
    </main>
  )
}
