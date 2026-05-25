import { type CSSProperties, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  FileText,
  FileClock,
  ScanSearch,
  ShieldCheck,
  Waypoints,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './WhyRackTrackPage.css'

const heroSignals = [
  'Data center inventory',
  'Live network validation',
  'Audit-ready evidence',
] as const

const pillars = [
  {
    num: '01',
    title: 'Sense',
    description:
      'Computer vision captures device position, labels, ports, cable state, and visual evidence directly from the rack.',
    visual: 'sense',
  },
  {
    num: '02',
    title: 'Verify',
    description:
      'Observed state is checked against live network identity and existing records so drift is exposed immediately.',
    visual: 'verify',
  },
  {
    num: '03',
    title: 'Enrich',
    description:
      'RackTrack turns findings into exports, reports, and workflows each team can use without manual translation.',
    visual: 'enrich',
  },
] as const

const featureCards = [
  {
    title: 'Audit-ready',
    description: 'Defensible in any compliance review.',
    icon: ShieldCheck,
    tone: 'success',
  },
  {
    title: 'Incident-speed',
    description: 'Fast enough for a live outage.',
    icon: Zap,
    tone: 'warning',
  },
  {
    title: 'Decision-grade',
    description: 'Drives capacity and procurement.',
    icon: BarChart3,
    tone: 'teal',
  },
] as const

const comparisonHeaders = [
  'Physical Sensing',
  'Network Identification',
  'Enrich Data',
  'Single Source of Truth',
] as const

const comparisonRows = [
  {
    name: 'RackTrack',
    featured: true,
    cells: ['full', 'full', 'full', 'full'] as const,
  },
  {
    name: 'DCIM Platforms',
    featured: false,
    cells: ['partial', 'partial', 'none', 'none'] as const,
  },
  {
    name: 'Network Discovery',
    featured: false,
    cells: ['full', 'partial', 'none', 'none'] as const,
  },
  {
    name: 'Manual Rack Audits',
    featured: false,
    cells: ['full', 'none', 'none', 'none'] as const,
  },
  {
    name: 'CMDB',
    featured: false,
    cells: ['none', 'none', 'full', 'none'] as const,
  },
] as const

const toolHighlights = [
  {
    heading: 'Every asset record traceable to its source',
    desc:
      'Each inventory record is tied back to the physical rack signal or live network signal that produced it.',
    tag: 'SOURCE-LINKED',
    image: '/solutions page images/Automated_Inventory.jpg',
    icon: ScanSearch,
    imageAlt: 'Physical evidence and inventory records connected to source devices',
  },
  {
    heading: 'Every device identification verified against the live network',
    desc:
      'Physical rack observations are cross-checked against live identity before a device is treated as verified.',
    tag: 'NETWORK-VERIFIED',
    image: '/solutions page images/Network_Topology.jpg',
    icon: Waypoints,
    imageAlt: 'Network topology and rack connectivity verification view',
  },
  {
    heading: 'Every infrastructure change timestamped',
    desc:
      'State changes, arrivals, moves, and departures are captured with timing that operations and compliance teams can defend.',
    tag: 'TIMESTAMPED',
    image: '/resource-thought-images/blog-cmdb-drift.webp',
    icon: FileClock,
    imageAlt: 'Timeline and CMDB drift visualization for timestamped changes',
  },
  {
    heading: 'Audit-ready data your compliance team can defend',
    desc:
      'Built for evidence requests, audit follow-up, security reviews, and operational decisions that need a trusted chain of proof.',
    tag: 'AUDIT-READY',
    image: '/solutions page images/Security_Compliance.jpg',
    icon: Database,
    imageAlt: 'Security and compliance evidence review interface',
  },
] as const

function ComparisonStatus({
  status,
  featured,
}: {
  status: (typeof comparisonRows)[number]['cells'][number]
  featured: boolean
}) {
  if (status === 'full') {
    return (
      <span className={`why-matrix__status why-matrix__status--full${featured ? ' is-featured' : ''}`}>
        <Check size={14} />
      </span>
    )
  }

  if (status === 'partial') {
    return <span className="why-matrix__status why-matrix__status--partial">P</span>
  }

  return <span className="why-matrix__status why-matrix__status--none" />
}

function WhyPillarVisual({
  visual,
}: {
  visual: (typeof pillars)[number]['visual']
}) {
  if (visual === 'sense') {
    return (
      <div className="why-flow__rack-visual">
        <span className="why-flow__rack-face why-flow__rack-face--front">
          {Array.from({ length: 7 }).map((_, index) => (
            <i key={index} />
          ))}
        </span>
        <span className="why-flow__rack-face why-flow__rack-face--side">
          {Array.from({ length: 6 }).map((_, index) => (
            <i key={index} />
          ))}
        </span>
        <span className="why-flow__rack-face why-flow__rack-face--top" />
      </div>
    )
  }

  if (visual === 'verify') {
    return (
      <div className="why-flow__network-visual">
        <span className="why-flow__network-core" />
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className={`why-flow__network-node why-flow__network-node--${index + 1}`} />
        ))}
        <span className="why-flow__network-shield">
          <ShieldCheck size={22} strokeWidth={2} />
        </span>
      </div>
    )
  }

  return (
    <div className="why-flow__enrich-visual">
      <span className="why-flow__enrich-diamond why-flow__enrich-diamond--violet">
        <FileText size={24} strokeWidth={1.9} />
      </span>
      <span className="why-flow__enrich-diamond why-flow__enrich-diamond--cyan">
        <BarChart3 size={24} strokeWidth={1.9} />
      </span>
      <span className="why-flow__enrich-diamond why-flow__enrich-diamond--violet">
        <ShieldCheck size={24} strokeWidth={1.9} />
      </span>
    </div>
  )
}

export default function WhyRackTrackPage() {
  const pageRef = useRef<HTMLElement>(null)
  const [activeTrustCard, setActiveTrustCard] = useState<string | null>(null)
  const [isTouchFlipMode, setIsTouchFlipMode] = useState(false)

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

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const syncMode = () => {
      const isTouch = media.matches
      setIsTouchFlipMode(isTouch)
      if (!isTouch) {
        setActiveTrustCard(null)
      }
    }

    syncMode()
    media.addEventListener('change', syncMode)
    return () => media.removeEventListener('change', syncMode)
  }, [])

  const toggleTrustCard = (heading: string) => {
    if (!isTouchFlipMode) return
    setActiveTrustCard((current) => (current === heading ? null : heading))
  }

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
              <span className="why-h1-line">See what&apos;s in the rack.</span>
              <span className="why-h1-line">Verify what&apos;s on the network.</span>
              <span className="why-h1-line why-h1-grad">Trust one source of truth.</span>
            </h1>
            <p>
              RackTrack unifies physical discovery, live network validation, and evidence-ready
              reporting in one platform.
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
        </div>
      </section>

      <section className="app-section why-flow reveal-on-scroll">
        <div className="why-flow__frame">
          <div className="why-flow__intro">
            <span className="app-eyebrow">Why RackTrack</span>
            <h2>
              Three things every tool does.
              <span className="why-flow__title-accent"> Only one does all three.</span>
            </h2>
            <p>
              Existing tools sense the rack. Or they read from the network. Or they track vendor
              and security data. RackTrack does all three in the same pass and reconciles them,
              which is why the output is trustworthy enough to defend in an audit, fast enough to
              use in an incident, and complete enough to drive capacity and procurement decisions.
            </p>
          </div>

          <div className="why-flow__pillars">
            {pillars.map(({ num, title, description, visual }, index) => (
              <article
                key={title}
                className="why-flow__pillar-card"
                style={{ '--ci': index } as CSSProperties}
              >
                <div className="why-flow__pillar-layout">
                  <div className="why-flow__pillar-copy">
                    <span className="why-flow__pillar-num">{num}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <div className="why-flow__pillar-visual" aria-hidden="true">
                    <WhyPillarVisual visual={visual} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="why-flow__connectors" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="why-flow__connector">
                <span />
              </div>
            ))}
          </div>

          <div className="why-flow__features">
            {featureCards.map(({ title, description, icon: Icon, tone }, index) => (
              <article
                key={title}
                className={`why-flow__feature-card why-flow__feature-card--${tone}`}
                style={{ '--ci': index + 3 } as CSSProperties}
              >
                <div className="why-flow__feature-icon">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <div className="why-flow__feature-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section why-matrix reveal-on-scroll">
        <div className="why-matrix__hero">
          <img
            src="/solutions page images/WhyRackTrackMatrixHero-v2.png"
            alt=""
            aria-hidden="true"
            className="why-matrix__hero-image"
          />
          <div className="why-matrix__hero-overlay" />
          <h2 className="why-comparison-headline">
            <span className="why-headline-white">Most tools report what they</span>
            <br />
            <span className="why-headline-gradient">find. RackTrack knows</span>
            <br />
            <span className="why-headline-gradient">what&apos;s actually there.</span>
          </h2>
        </div>

        <div className="why-matrix__panel">
          <div className="why-matrix__grid why-matrix__grid--head">
            <div className="why-matrix__cell why-matrix__cell--label" />
            {comparisonHeaders.map((header) => (
              <div key={header} className="why-matrix__cell why-matrix__cell--head">
                {header}
              </div>
            ))}
          </div>

          {comparisonRows.map((row, rowIndex) => (
            <div
              key={row.name}
              className={`why-matrix__grid why-matrix__row${row.featured ? ' is-featured' : ''}`}
              style={{ '--ci': rowIndex } as CSSProperties}
            >
              <div className="why-matrix__cell why-matrix__cell--label">
                <span className={`why-matrix__row-dot${row.featured ? ' is-featured' : ''}`} />
                <span>{row.name}</span>
              </div>
              {row.cells.map((cell, index) => (
                <div key={`${row.name}-${comparisonHeaders[index]}`} className="why-matrix__cell">
                  <ComparisonStatus status={cell} featured={row.featured} />
                </div>
              ))}
            </div>
          ))}

          <div className="why-matrix__stats">
            <div className="why-matrix__stat">
              <span>Full Coverage</span>
              <strong>4 / 4</strong>
            </div>
            <div className="why-matrix__stat">
              <span>Competitors Avg</span>
              <strong>1.3 / 4</strong>
            </div>
            <div className="why-matrix__stat why-matrix__stat--legend">
              <span>Legend</span>
              <div className="why-matrix__legend">
                <div>
                  <ComparisonStatus status="full" featured={false} />
                  <small>Full support</small>
                </div>
                <div>
                  <ComparisonStatus status="partial" featured={false} />
                  <small>Partial support</small>
                </div>
                <div>
                  <ComparisonStatus status="none" featured={false} />
                  <small>Not available</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section why-trust reveal-on-scroll">
        <div className="why-trust__intro">
          <span className="app-eyebrow">Evidence & Trust</span>
          <h2>
            Evidence your
            <span className="why-trust__title-accent"> infrastructure, security,</span>
            <br />
            <span className="why-trust__title-accent">and compliance teams can trust.</span>
          </h2>
          <p>
            RackTrack creates traceable asset inventory, network-verified device identification,
            and timestamped infrastructure change history. Security teams, compliance owners, and
            operations engineers get audit-ready evidence they can validate, export, and defend.
          </p>
        </div>
        <div className="why-trust__cards">
          {toolHighlights.map(({ heading, desc, tag, image, icon: Icon, imageAlt }, index) => (
            <article
              key={heading}
              className={`why-trust__card${activeTrustCard === heading ? ' is-flipped' : ''}`}
              style={{ '--ci': index } as CSSProperties}
              onClick={() => toggleTrustCard(heading)}
              onKeyDown={(event) => {
                if (!isTouchFlipMode) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleTrustCard(heading)
                }
              }}
              tabIndex={isTouchFlipMode ? 0 : -1}
              aria-label={isTouchFlipMode ? `${heading} card. Tap to flip.` : undefined}
            >
              <div className="why-trust__flip">
                <div className="why-trust__face why-trust__face--front">
                  <div className="why-trust__media">
                    <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
                    <button
                      type="button"
                      className="why-trust__media-icon"
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleTrustCard(heading)
                      }}
                      aria-label={activeTrustCard === heading ? `Show front of ${heading}` : `Flip ${heading} card`}
                    >
                      <Icon size={24} strokeWidth={1.8} />
                    </button>
                  </div>
                  <div className="why-trust__card-copy">
                    <span className="why-trust__tag">{tag}</span>
                    <h3>{heading}</h3>
                  </div>
                </div>

                <div className="why-trust__face why-trust__face--back">
                  <span className="why-trust__tag">{tag}</span>
                  <div className="why-trust__back-icon">
                    <Icon size={26} strokeWidth={1.9} />
                  </div>
                  <h3>{heading}</h3>
                  <p>{desc}</p>
                  <button
                    type="button"
                    className="why-trust__flip-back"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleTrustCard(heading)
                    }}
                    aria-label={`Return to front of ${heading}`}
                  >
                    Back to image
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
