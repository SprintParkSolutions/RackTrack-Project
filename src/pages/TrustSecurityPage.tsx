import { type CSSProperties, useEffect, useRef } from 'react'
import {
  ArrowRight,
  Database,
  Lock,
  MapPinned,
  ShieldCheck,
  Vault,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './TrustSecurityPage.css'

const securitySignals = [
  'SOC 2 Type II readiness program in progress',
  'Tenant isolation and customer-controlled data residency',
  'Encryption in transit and at rest',
  'Customer-controlled credential vaulting',
  'Role-based access control and audit logging',
] as const

const heroPrinciples = [
  'Clear data ownership',
  'Flexible deployment',
  'Enterprise-ready controls',
] as const

const trustPillars = [
  {
    title: 'Credential control',
    description:
      'RackTrack does not ask teams to weaken existing policy. Customer-controlled vaulting keeps privileged access aligned with enterprise workflows.',
    icon: Vault,
  },
  {
    title: 'Data residency',
    description:
      'Tenant boundaries and residency controls stay under customer direction so regional, contractual, and regulatory requirements can be honored.',
    icon: MapPinned,
  },
  {
    title: 'Platform controls',
    description:
      'Encryption, access control, and auditability are treated as product fundamentals rather than add-on assurances for late-stage diligence.',
    icon: Lock,
  },
] as const

const deploymentOptions = [
  {
    label: 'Cloud-hosted',
    detail: 'Fastest path for standard enterprise teams that want managed infrastructure and quick rollout.',
  },
  {
    label: 'Private cloud / customer VPC',
    detail: 'A fit for teams that require tighter network boundaries or customer-managed cloud controls.',
  },
  {
    label: 'On-premise',
    detail: 'Designed for environments where data handling policies require infrastructure to stay inside the customer boundary.',
  },
  {
    label: 'Air-gapped',
    detail: 'Supports classified or highly restricted facilities that cannot depend on public connectivity.',
  },
] as const

const reviewSteps = [
  'Security teams review controls and ownership boundaries.',
  'Infrastructure teams validate deployment fit and operational flow.',
  'RackTrack shares deeper architecture details during formal evaluation.',
] as const

export default function TrustSecurityPage() {
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal-on-scroll') ?? []
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="trust-page" ref={pageRef}>
      <section className="app-section trust-hero">
        <div className="trust-hero-3d" aria-hidden="true">
          <div className="trs-orb trs-orb-1" />
          <div className="trs-orb trs-orb-2" />
          <div className="trs-orbit trs-orbit-1" />
          <div className="trs-orbit trs-orbit-2" />
          <div className="trs-orbit trs-orbit-3" />
          <div className="trs-depth-grid" />
          <div className="trs-beam trs-beam-1" />
          <div className="trs-beam trs-beam-2" />
          <div className="trs-shield-node">
            <span className="trs-shield-ring trs-shield-ring-1" />
            <span className="trs-shield-ring trs-shield-ring-2" />
            <ShieldCheck size={30} strokeWidth={1.5} />
          </div>
          <div className="trs-cube">
            <b className="tc tc-front" />
            <b className="tc tc-back" />
            <b className="tc tc-right" />
            <b className="tc tc-left" />
            <b className="tc tc-top" />
            <b className="tc tc-bottom" />
          </div>
          <div className="trs-nodes">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="trust-hero__grid" aria-hidden="true" />

        <div className="trust-hero__layout">
          <div className="trust-hero__content">
            <span className="app-eyebrow">Trust & Security</span>
            <h1>
              <span className="trust-h1-line">Clear controls.</span>
              <span className="trust-h1-line">Clear boundaries.</span>
              <span className="trust-h1-line trust-h1-grad">Built for enterprise review.</span>
            </h1>
            <p>
              RackTrack is designed to fit how security and infrastructure teams assess platforms.
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

            <div className="trust-hero__principles">
              {heroPrinciples.map((principle) => (
                <div key={principle} className="trust-hero__principle">
                  <span className="trust-hero__principle-dot" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trust-hero__visual" aria-hidden="true">
            <div className="trust-hero__backplate" />
            <div className="trust-hero__frame">
              <img
                src="/solutions page images/Security_Compliance.jpg"
                alt=""
                loading="eager"
                decoding="async"
              />
              <div className="trust-hero__frame-overlay" />
            </div>
            <div className="trust-hero__shield-chip">
              <ShieldCheck size={18} strokeWidth={1.8} />
            </div>
            <div className="trust-hero__dot-grid">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="app-section trust-posture reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Security Posture</span>
          <h2>Enterprise expectations built into the product story.</h2>
          <p>
            RackTrack is positioned to support formal enterprise diligence without exposing
            sensitive implementation detail on the public website.
          </p>
        </div>

        <div className="trust-signal-grid">
          <article
            className="trust-signal-card trust-signal-card--featured"
            style={{ '--ci': 0 } as CSSProperties}
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

          {trustPillars.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className="trust-signal-card"
              style={{ '--ci': index + 1 } as CSSProperties}
            >
              <div className="trust-signal-icon">
                <span className="trust-signal-icon-ring" />
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section trust-data reveal-on-scroll">
        <div className="trust-data__layout">
          <div className="trust-data__panel">
            <div className="trust-data__badge">
              <Database size={18} />
              <span>Data Handling</span>
            </div>
            <h2>Your rack data should remain under your terms.</h2>
            <p>
              Rack video is processed inside the customer tenant and turned into structured device
              and topology records that support downstream workflows. The handling model is built
              to preserve customer control rather than obscure it.
            </p>
            <p>
              Teams can retain raw footage as evidence, delete it based on policy, or preserve it
              for re-processing as the platform improves. The important point is that the customer
              defines that decision.
            </p>

            <div className="trust-data__review">
              <span>Evaluation flow</span>
              <div className="trust-data__review-list">
                {reviewSteps.map((step, index) => (
                  <div key={step} className="trust-data__review-item">
                    <strong>0{index + 1}</strong>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="trust-data__media">
            <img
              src="/solutions page images/Automated_Inventory.jpg"
              alt="Rack data processing visualization"
              loading="lazy"
              decoding="async"
            />
            <div className="trust-data__media-card">
              <span>Customer control</span>
              <strong>Retention, residency, and deployment choices stay aligned with policy.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section trust-deployment reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Deployment Options</span>
          <h2>Flexible enough for standard enterprise and restricted environments.</h2>
          <p>
            Buyers can assess RackTrack against the operating model they already use, from managed
            cloud to isolated environments with stricter boundary requirements.
          </p>
        </div>

        <div className="trust-deployment__grid">
          {deploymentOptions.map(({ label, detail }, index) => (
            <article
              key={label}
              className="trust-deployment__card"
              style={{ '--ci': index } as CSSProperties}
            >
              <div className="trust-deployment__icon">
                <span className="trust-deployment__icon-ring" />
                <Lock size={20} strokeWidth={1.8} />
              </div>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>

        <div className="trust-deployment__cta">
          <p>
            Need deeper architecture details for procurement or security review? RackTrack can
            share them during the formal evaluation process.
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
