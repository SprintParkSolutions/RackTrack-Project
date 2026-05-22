import { useEffect, useRef } from 'react'
import { ArrowRight, Check, ShieldCheck, Split, Waypoints } from 'lucide-react'
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

export default function WhyRackTrackPage() {
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
    <main className="why-page" ref={pageRef}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="app-section why-hero">

        {/* 3-D background scene */}
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
          {/* rotating cube */}
          <div className="why-cube">
            <b className="wc wc-front" />
            <b className="wc wc-back" />
            <b className="wc wc-right" />
            <b className="wc wc-left" />
            <b className="wc wc-top" />
            <b className="wc wc-bottom" />
          </div>
          {/* node cloud */}
          <div className="why-nodes">
            <i /><i /><i /><i /><i />
          </div>
        </div>

        <div className="why-hero__grid" aria-hidden="true" />

        <div className="why-hero__content">
          <span className="app-eyebrow">Why RackTrack</span>
          <h1>
            <span className="why-h1-line">Three things every</span>
            <span className="why-h1-line">infrastructure tool does.</span>
            <span className="why-h1-line why-h1-grad">Only one does all three.</span>
          </h1>
          <p>
            Existing tools sense the rack, read from the network, or track vendor
            and security data — but never all three. RackTrack does them in one
            pass and reconciles them into a single trusted output.
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
        </div>
      </section>

      {/* ── DIFFERENTIATORS ───────────────────────────────────── */}
      <section className="app-section why-differentiator reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">The Differentiator</span>
          <h2>The category gap is not visibility. It is reconciliation.</h2>
          <p>
            Most tools cover one part of the truth. RackTrack brings the physical,
            network, and vendor context together so teams can act with confidence.
          </p>
        </div>

        <div className="why-pillars">
          {differentiators.map(({ title, description, icon: Icon, num }, i) => (
            <article
              key={title}
              className="why-pillar-card"
              style={{ '--ci': i } as React.CSSProperties}
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

      {/* ── COMPARISON ────────────────────────────────────────── */}
      <section className="app-section why-comparison reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Category Comparison</span>
          <h2>RackTrack is built across all three layers.</h2>
          <p>
            This is a category view, not a named competitor matrix. It shows where
            infrastructure teams usually have to stitch multiple tools together.
          </p>
        </div>

        <div className="why-table-wrap">
          <div className="why-table" role="table" aria-label="RackTrack category comparison">
            <div className="why-table__header" role="row">
              <div className="why-table__cell why-table__cell--label" role="columnheader">
                Category
              </div>
              {comparisonColumns.map((col) => (
                <div key={col} className="why-table__cell" role="columnheader">
                  {col}
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
                {row.values.map((val, idx) => (
                  <div
                    key={`${row.category}-${comparisonColumns[idx]}`}
                    className="why-table__cell"
                    role="cell"
                  >
                    {val === 'Full' ? (
                      <span className="why-table__status why-table__status--full">
                        <Check size={14} /> Full
                      </span>
                    ) : val === 'Partial' ? (
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

      {/* ── EVIDENCE ──────────────────────────────────────────── */}
      <section className="app-section why-evidence reveal-on-scroll">
        <div className="why-evidence__layout">
          <div className="why-evidence__panel">
            <div className="why-evidence__badge">
              <ShieldCheck size={18} />
              <span>Evidence-Grade</span>
            </div>
            <h2>Built to be trusted by the people who carry the consequences.</h2>
            <p>
              Every data point in RackTrack is traceable to its source. Every device
              identification is verifiable against the live network. Every change is
              timestamped.
            </p>
            <p>
              Compliance owners, security teams, and on-call engineers do not need
              another dashboard. They need data they can defend. RackTrack is built
              for that bar.
            </p>
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
          </div>
        </div>
      </section>

    </main>
  )
}
