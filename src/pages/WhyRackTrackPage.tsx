import { type CSSProperties, useEffect, useRef } from 'react'
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Split,
  Waypoints,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './WhyRackTrackPage.css'

const differentiators = [
  {
    title: 'Sense the rack',
    description:
      'Capture what is physically present in the rack, not what a spreadsheet says should be there.',
    icon: Split,
    num: '01',
  },
  {
    title: 'Verify against the network',
    description:
      'Confirm device identity and live state against the network so the result is operationally useful.',
    icon: Waypoints,
    num: '02',
  },
  {
    title: 'Enrich with vendor and security data',
    description:
      'Add the context infrastructure teams need for support, compliance, lifecycle, and risk decisions.',
    icon: ShieldCheck,
    num: '03',
  },
] as const

const comparisonRows = [
  { category: 'RackTrack', values: ['Full', 'Full', 'Full'] as const, isRackTrack: true },
  { category: 'DCIM platforms', values: ['Partial', 'Partial', 'Partial'] as const, isRackTrack: false },
  { category: 'Network discovery tools', values: ['None', 'Full', 'Partial'] as const, isRackTrack: false },
  { category: 'Manual rack audits', values: ['Partial', 'None', 'None'] as const, isRackTrack: false },
] as const

const comparisonColumns = [
  'Sense the rack',
  'Verify against the network',
  'Enrich with vendor and security data',
] as const

const heroSignals = [
  'Physical proof',
  'Network validation',
  'Security context',
] as const

const processSteps = [
  {
    title: 'Capture',
    detail: 'Rack video and imagery create a defensible physical baseline for every cabinet, device, and port.',
  },
  {
    title: 'Reconcile',
    detail: 'RackTrack compares physical findings to live network identity so mismatches surface immediately.',
  },
  {
    title: 'Operationalize',
    detail: 'The reconciled output flows into security, lifecycle, support, and audit workflows with usable context.',
  },
] as const

const evidenceStats = [
  { value: '1 pass', label: 'from scan to reconciled output' },
  { value: '3 layers', label: 'physical, network, and vendor context' },
  { value: '0 guesswork', label: 'for teams that need evidence they can defend' },
] as const

export default function WhyRackTrackPage() {
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
    <main className="why-page" ref={pageRef}>
      <section className="app-section why-hero">
        <div className="why-hero-3d" aria-hidden="true">
          <div className="why-orb why-orb-1" />
          <div className="why-orb why-orb-2" />
          <div className="why-orbit why-orbit-1" />
          <div className="why-orbit why-orbit-2" />
          <div className="why-orbit why-orbit-3" />
          <div className="why-depth-grid" />
          <div className="why-beam why-beam-1" />
          <div className="why-beam why-beam-2" />
          <div className="why-beam why-beam-3" />
          <div className="why-cube">
            <b className="wc wc-front" />
            <b className="wc wc-back" />
            <b className="wc wc-right" />
            <b className="wc wc-left" />
            <b className="wc wc-top" />
            <b className="wc wc-bottom" />
          </div>
          <div className="why-nodes">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="why-hero__grid" aria-hidden="true" />

        <div className="why-hero__layout">
          <div className="why-hero__content">
            <span className="app-eyebrow">Why RackTrack</span>
            <h1>
              <span className="why-h1-line">Rack truth.</span>
              <span className="why-h1-line">Network truth.</span>
              <span className="why-h1-line why-h1-grad">One reconciled view.</span>
            </h1>
            <p>
              RackTrack connects what is in the rack, what is live on the network, and what
              matters for operations.
            </p>

            <div className="why-hero__actions">
              <Link to="/contact-us" state={{ scrollTo: 'contact' }} className="app-primary-btn">
                See It in Action
                <ArrowRight size={16} />
              </Link>
              <Link to="/solutions" className="app-ghost-btn">
                Explore Solutions
              </Link>
            </div>

            <div className="why-hero__signal-strip">
              {heroSignals.map((signal) => (
                <div key={signal} className="why-hero__signal-item">
                  <span className="why-hero__signal-dot" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="why-hero__visual" aria-hidden="true">
            <div className="why-hero__backplate" />
            <div className="why-hero__frame">
              <img
                src="/solutions page images/Network_Topology.jpg"
                alt=""
                loading="eager"
                decoding="async"
              />
              <div className="why-hero__frame-overlay" />
              <div className="why-hero__scanline" />
            </div>
            <div className="why-hero__micro-chip">
              <span />
              <span />
              <span />
            </div>

            <div className="why-hero__grid-card">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </section>

      <section className="app-section why-differentiator reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">The Differentiator</span>
          <h2>The real gap is not visibility. It is reconciliation.</h2>
          <p>
            Teams already have fragments of the truth. What they usually do not have is one
            trusted system that ties those fragments together cleanly enough to support action.
          </p>
        </div>

        <div className="why-pillars">
          {differentiators.map(({ title, description, icon: Icon, num }, index) => (
            <article
              key={title}
              className="why-pillar-card"
              style={{ '--ci': index } as CSSProperties}
            >
              <div className="why-pillar-icon">
                <span className="why-pillar-icon-ring" />
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <span className="why-pillar-num">{num}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section why-process reveal-on-scroll">
        <div className="why-process__intro">
          <span className="app-eyebrow">How It Works</span>
          <h2>RackTrack turns raw discovery into operational truth.</h2>
          <p>
            The platform is designed as a chain of evidence, not just a chain of screens.
            Every step strengthens confidence before the result reaches engineering,
            compliance, or security workflows.
          </p>
        </div>

        <div className="why-process__rail">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="why-process__step"
              style={{ '--ci': index } as CSSProperties}
            >
              <span className="why-process__index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section why-comparison reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Category Comparison</span>
          <h2>RackTrack is built across all three layers.</h2>
          <p>
            This is a category view, not a named competitor matrix. It highlights why teams
            often end up stitching multiple products and manual processes together.
          </p>
        </div>

        <div className="why-table-wrap">
          <div className="why-table" role="table" aria-label="RackTrack category comparison">
            <div className="why-table__header" role="row">
              <div className="why-table__cell why-table__cell--label" role="columnheader">
                Category
              </div>
              {comparisonColumns.map((column) => (
                <div key={column} className="why-table__cell" role="columnheader">
                  {column}
                </div>
              ))}
            </div>

            {comparisonRows.map((row) => (
              <div
                key={row.category}
                className={`why-table__row${row.isRackTrack ? ' why-table__row--featured' : ''}`}
                role="row"
              >
                <div className="why-table__cell why-table__cell--label" role="cell">
                  {row.category}
                </div>
                {row.values.map((value, index) => (
                  <div
                    key={`${row.category}-${comparisonColumns[index]}`}
                    className="why-table__cell"
                    role="cell"
                  >
                    {value === 'Full' ? (
                      <span className="why-table__status why-table__status--full">
                        <Check size={14} />
                        Full
                      </span>
                    ) : value === 'Partial' ? (
                      <span className="why-table__status why-table__status--partial">Partial</span>
                    ) : (
                      <span className="why-table__status why-table__status--none">None</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section why-evidence reveal-on-scroll">
        <div className="why-evidence__layout">
          <div className="why-evidence__panel">
            <div className="why-evidence__badge">
              <ShieldCheck size={18} />
              <span>Evidence-Grade</span>
            </div>

            <h2>Built for the teams who have to defend the answer.</h2>
            <p>
              Every inventory claim becomes more useful when the team behind it can explain where
              it came from, what confirmed it, and when it changed. RackTrack is designed for that
              standard.
            </p>

            <div className="why-evidence__stats">
              {evidenceStats.map((stat) => (
                <div key={stat.label} className="why-evidence__stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="why-evidence__quote">
              <Zap size={18} />
              <p>
                Infrastructure, security, and audit teams do not need another dashboard.
                They need output they can operationalize with confidence.
              </p>
            </div>

            <Link
              to="/contact-us"
              state={{ scrollTo: 'contact' }}
              className="app-primary-btn why-evidence__cta"
            >
              Talk to RackTrack
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="why-evidence__media">
            <img
              src="/solutions page images/Security_Compliance.jpg"
              alt="Security and compliance operations view"
              loading="lazy"
              decoding="async"
            />
            <div className="why-evidence__overlay-card">
              <span>Trusted output</span>
              <strong>Physical proof + live verification + decision context</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
