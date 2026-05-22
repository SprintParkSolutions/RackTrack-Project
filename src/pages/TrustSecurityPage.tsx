import { useEffect, useRef } from 'react'
import { ArrowRight, Database, Lock, MapPinned, ShieldCheck, Vault } from 'lucide-react'
import { Link } from 'react-router-dom'
import './TrustSecurityPage.css'

const securitySignals = [
  'SOC 2 Type II readiness program in progress',
  'Tenant isolation and customer-controlled data residency',
  'Encryption in transit and at rest',
  'Customer-controlled credential vaulting',
  'Role-based access control and audit logging',
] as const

const deploymentOptions = [
  { label: 'Cloud-hosted (default)' },
  { label: 'Private cloud / customer VPC' },
  { label: 'On-premise deployment for regulated environments' },
  { label: 'Air-gapped deployment for classified or restricted facilities' },
] as const

export default function TrustSecurityPage() {
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal-on-scroll') ?? []
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="trust-page" ref={pageRef}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="app-section trust-hero">

        {/* 3-D background scene */}
        <div className="trust-hero-3d" aria-hidden="true">
          <div className="trs-orb trs-orb-1" />
          <div className="trs-orb trs-orb-2" />
          <div className="trs-orbit trs-orbit-1" />
          <div className="trs-orbit trs-orbit-2" />
          <div className="trs-orbit trs-orbit-3" />
          <div className="trs-depth-grid" />
          <div className="trs-beam trs-beam-1" />
          <div className="trs-beam trs-beam-2" />
          {/* holographic shield node */}
          <div className="trs-shield-node">
            <span className="trs-shield-ring trs-shield-ring-1" />
            <span className="trs-shield-ring trs-shield-ring-2" />
            <ShieldCheck size={30} strokeWidth={1.5} />
          </div>
          {/* rotating cube */}
          <div className="trs-cube">
            <b className="tc tc-front" />
            <b className="tc tc-back" />
            <b className="tc tc-right" />
            <b className="tc tc-left" />
            <b className="tc tc-top" />
            <b className="tc tc-bottom" />
          </div>
          {/* node cluster */}
          <div className="trs-nodes">
            <i /><i /><i /><i /><i />
          </div>
        </div>

        <div className="trust-hero__grid" aria-hidden="true" />

        <div className="trust-hero__content">
          <span className="app-eyebrow">Trust & Security</span>
          <h1>
            <span className="trust-h1-line">Security posture,</span>
            <span className="trust-h1-line">data control, and</span>
            <span className="trust-h1-line">deployment flexibility</span>
            <span className="trust-h1-line trust-h1-grad">for enterprise environments.</span>
          </h1>
          <p>
            RackTrack fits how security and infrastructure teams evaluate
            platforms — clear controls, clear ownership, and deployment options
            that match your environment.
          </p>
          <div className="trust-hero__actions">
            <Link to="/contact-us" state={{ scrollTo: 'contact' }} className="app-primary-btn">
              Request a Security Brief
              <ArrowRight size={16} />
            </Link>
            <Link to="/solutions" className="app-ghost-btn">
              View Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECURITY POSTURE ──────────────────────────────────── */}
      <section className="app-section trust-posture reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Security Posture</span>
          <h2>Enterprise security expectations built into the platform.</h2>
          <p>
            RackTrack is built to support the controls enterprise buyers expect
            without putting sensitive infrastructure detail on the public site.
          </p>
        </div>

        <div className="trust-signal-grid">
          <article
            className="trust-signal-card trust-signal-card--featured"
            style={{ '--ci': 0 } as React.CSSProperties}
          >
            <div className="trust-signal-icon">
              <span className="trust-signal-icon-ring" />
              <ShieldCheck size={22} strokeWidth={1.8} />
            </div>
            <h3>Security signals</h3>
            <ul className="trust-signal-list">
              {securitySignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </article>

          <article
            className="trust-signal-card"
            style={{ '--ci': 1 } as React.CSSProperties}
          >
            <div className="trust-signal-icon">
              <span className="trust-signal-icon-ring" />
              <Vault size={22} strokeWidth={1.8} />
            </div>
            <h3>Credential control</h3>
            <p>
              RackTrack never stores production access keys directly.
              Customer-controlled vaulting keeps access management aligned with
              enterprise policy.
            </p>
          </article>

          <article
            className="trust-signal-card"
            style={{ '--ci': 2 } as React.CSSProperties}
          >
            <div className="trust-signal-icon">
              <span className="trust-signal-icon-ring" />
              <MapPinned size={22} strokeWidth={1.8} />
            </div>
            <h3>Data residency</h3>
            <p>
              Residency and tenant boundaries stay under customer control, so
              deployment can match regional, regulatory, and operational
              requirements.
            </p>
          </article>
        </div>
      </section>

      {/* ── DATA HANDLING ─────────────────────────────────────── */}
      <section className="app-section trust-data reveal-on-scroll">
        <div className="trust-data__layout">
          <div className="trust-data__panel">
            <div className="trust-data__badge">
              <Database size={18} />
              <span>Data Handling</span>
            </div>
            <h2>Your video, your control.</h2>
            <p>
              Rack video is processed in your tenant, structured into device and
              topology records, and retained per your data residency policy.
            </p>
            <p>
              The structured output is what powers downstream workflows. The raw
              footage is yours: delete it, retain it as evidence, or keep it for
              re-processing as the platform improves. It never leaves your
              control.
            </p>
          </div>

          <div className="trust-data__media">
            <img
              src="/solutions page images/Automated_Inventory.jpg"
              alt="Rack data processing visualization"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT ────────────────────────────────────────── */}
      <section className="app-section trust-deployment reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Deployment Options</span>
          <h2>Flexible deployment for regulated and restricted environments.</h2>
          <p>
            Buyers can evaluate RackTrack against the operating model they
            already use without exposing architecture diagrams on the public
            site.
          </p>
        </div>

        <div className="trust-deployment__grid">
          {deploymentOptions.map(({ label }, i) => (
            <article
              key={label}
              className="trust-deployment__card"
              style={{ '--ci': i } as React.CSSProperties}
            >
              <div className="trust-deployment__icon">
                <span className="trust-deployment__icon-ring" />
                <Lock size={20} strokeWidth={1.8} />
              </div>
              <h3>{label}</h3>
            </article>
          ))}
        </div>

        <div className="trust-deployment__cta">
          <p>
            Need architecture details for procurement diligence? RackTrack can
            share them during the evaluation process.
          </p>
          <Link
            to="/contact-us"
            state={{ scrollTo: 'contact' }}
            className="app-primary-btn"
          >
            Contact RackTrack
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  )
}
