import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Cable, Cpu, FileText, Layers3, ScanLine, Server } from 'lucide-react'
import './HomePage.css'

const capabilities = [
  {
    icon: ScanLine,
    title: 'Rack Type Classification',
    text: 'Identifies enclosed, open-frame, and wall-mount racks with vendor footprints, rack boundaries, and unit count.',
  },
  {
    icon: Server,
    title: 'Switch Vendor Recognition',
    text: 'Uses OCR and visual matching to identify chassis markings, labels, port layouts, vendors, and models.',
  },
  {
    icon: Cpu,
    title: 'Port Classification',
    text: 'Maps RJ45, SFP, QSFP, console, USB, fiber, occupancy, position, and active LED status.',
  },
  {
    icon: Cable,
    title: 'Cable Identification',
    text: 'Tracks each cable by type, color, connector, and end-to-end physical connection.',
  },
  {
    icon: Layers3,
    title: 'Confidence Fusion',
    text: 'Combines detections across video frames to reduce false positives and increase audit confidence.',
  },
  {
    icon: FileText,
    title: 'Audit Reports',
    text: 'Generates structured UI reports with PDF, CSV, Excel, JSON, API, and CMDB export paths.',
  },
]

const pipeline = ['Server', 'Patch Panel', 'Switch', 'Connectivity']

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero app-section">
        <motion.div
          className="home-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="app-eyebrow">AI-Powered Rack Auditing</span>
          <h1>
            One sweep.
            <span> Full audit.</span>
          </h1>
          <p>
            Record a single video of your rack. RackTrack detects every component in seconds and turns
            visual infrastructure into verified audit intelligence.
          </p>
          <div className="home-hero-actions">
            <a className="app-primary-btn" href="/contact-us">Get a Demo</a>
            <a className="app-ghost-btn" href="/solutions">Explore Solutions</a>
          </div>
        </motion.div>

        <motion.div
          className="home-rack-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          aria-hidden="true"
        >
          {['GPU', 'CORE', 'PATCH', 'SERVER', 'PDU', 'KVM', 'STORAGE'].map((label, index) => (
            <div className="rack-unit" key={label} style={{ '--delay': `${index * 0.12}s` } as CSSProperties}>
              <span>{label}</span>
              <i />
              <i />
            </div>
          ))}
        </motion.div>
      </section>

      <section className="app-section home-capabilities">
        <div className="app-section-heading">
          <span className="app-eyebrow">Detection Capabilities</span>
          <h2>Rack intelligence from video</h2>
          <p>
            RackTrack identifies rack structure, devices, ports, cables, labels, LED states, and
            connection paths from a single guided rack sweep.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="capability-card" key={item.title}>
              <item.icon />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section home-pipeline">
        <div className="app-section-heading">
          <span className="app-eyebrow">Audit Pipeline</span>
          <h2>Every frame. Zero guesswork.</h2>
        </div>
        <div className="pipeline-row">
          {pipeline.map((step, index) => (
            <article className="pipeline-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
              <p>
                {step === 'Server' && 'Identify rack units, device types, and server configurations.'}
                {step === 'Patch Panel' && 'Map patch panel ports, zone labels, and cable assignments.'}
                {step === 'Switch' && 'Detect vendor, model, port layout, connection state, and LEDs.'}
                {step === 'Connectivity' && 'Trace every cable end-to-end into a complete connection map.'}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
