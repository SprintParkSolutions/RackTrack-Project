import { motion } from 'framer-motion'
import { BarChart3, Cable, Eye, LocateFixed, Radar, Thermometer } from 'lucide-react'
import './SolutionsPage.css'

const steps = [
  {
    title: 'Automatic Rack Identification',
    text: 'Point, sweep, and let the neural engine recognize rack elevations, brand footprints, and spatial boundaries.',
  },
  {
    title: 'Smart Asset Localization',
    text: 'Every hardware asset is localized to rack U-level with OCR-assisted serial and model identification.',
  },
  {
    title: 'Dynamic Connectivity Map',
    text: 'Copper, fiber, and power connections are traced into a visual physical-layer topology.',
  },
]

const solutions = [
  { icon: LocateFixed, title: 'Asset Tracking', text: 'Identify and locate hardware in seconds using OCR and visual matching.' },
  { icon: Cable, title: 'Cable Intelligence', text: 'Trace every cable path with type, color, and endpoint detection.' },
  { icon: Thermometer, title: 'Thermal Mapping', text: 'Visualize heat distribution and airflow risk with AI-assisted overlays.' },
  { icon: Radar, title: 'Instant Results', text: 'Convert rack video into inventory and audit evidence in minutes.' },
  { icon: Eye, title: 'Full Visibility', text: 'Give SRE, NOC, and data center teams one reliable source of truth.' },
  { icon: BarChart3, title: 'Enterprise Scale', text: 'Designed for distributed facilities, CMDB workflows, and large rack fleets.' },
]

export default function SolutionsPage() {
  return (
    <main className="solutions-page">
      <section className="solutions-hero app-section">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <span className="app-eyebrow">Intelligence First</span>
          <h1>
            Automated Narrative
            <span> Infrastructure</span>
          </h1>
          <p>
            Replace manual spreadsheets with real-time visual truth. RackTrack identifies, maps,
            and optimizes your data center with robotic precision.
          </p>
        </motion.div>
        <div className="solutions-stats" aria-label="RackTrack metrics">
          <div><strong>94%</strong><span>Audit time reduced</span></div>
          <div><strong>150k</strong><span>Units monitored</span></div>
          <div><strong>99.9%</strong><span>Detection accuracy</span></div>
        </div>
      </section>

      <section className="app-section solutions-steps">
        <div className="app-section-heading">
          <span className="app-eyebrow">How It Works</span>
          <h2>From rack sweep to verified infrastructure map</h2>
        </div>
        <div className="solution-step-grid">
          {steps.map((step, index) => (
            <article className="solution-step-card" key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section solutions-grid-section">
        <div className="app-section-heading">
          <span className="app-eyebrow">Services</span>
          <h2>Purpose-built for modern data center teams</h2>
        </div>
        <div className="solutions-grid">
          {solutions.map((item) => (
            <article className="solution-card" key={item.title}>
              <item.icon />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
