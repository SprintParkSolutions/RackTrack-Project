import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SolutionsPage.css'

const solutionsImagePath = '/solutions%20page%20images'
const heroBackgroundImages = [
  `${solutionsImagePath}/solutions-hero-bg-1-compressed.jpg`,
  `${solutionsImagePath}/solutions-hero-bg-2-compressed.jpg`,
]
const principleCardImages = [
  `${solutionsImagePath}/Principle_Vision.png`,
  `${solutionsImagePath}/Principle_Fusion.png`,
  `${solutionsImagePath}/Principle_Floor.png`,
]
const workflowArRackImage = `${solutionsImagePath}/AR_Rack.jpg`
const workflowAiDetectionImage = `${solutionsImagePath}/AI_Device_Detection.jpg`
const workflowPortTrackingImage = `${solutionsImagePath}/Port_Tracking.jpg`
const workflowNetworkTopologyImage = `${solutionsImagePath}/Network_Topology.jpg`
const workflowAutomatedInventoryImage = `${solutionsImagePath}/Automated_Inventory.jpg`
const workflowSecurityComplianceImage = `${solutionsImagePath}/Security_Compliance.jpg`
const topologySectionImage = `${solutionsImagePath}/topology-section-bg-compressed.jpg`

const stats = [
  { value: '10x', label: 'faster audits' },
  { value: '98%', label: 'scan accuracy' },
  { value: '0', label: 'manual entry' },
]

const detectedRows = [
  { label: 'SWITCH · 24P', top: '21%' },
  { label: 'SERVER · R740', top: '38%' },
  { label: 'PDU · 16A', top: '57%' },
  { label: 'SERVER · R650', top: '76%' },
]

void detectedRows

const principleCards = [
  {
    number: '01',
    title: 'Perceive',
    description:
      'AI-powered computer vision captures the physical reality with precision and scale.',
    features: ['AI Vision Scan'],
  },
  {
    number: '02',
    title: 'Reconcile',
    description:
      'We reconcile data from every source into one verified, living model of your infrastructure.',
    features: ['Data Fusion', 'De-duplication', 'Continuous Verification'],
  },
  {
    number: '03',
    title: 'Operationalize',
    description:
      'Actionable intelligence delivered anywhere, empowering your teams to move faster and operate with confidence.',
    features: ['Mobile-First', 'Real-Time', 'Workflow Automation'],
  },
]

const topologyFeatures = [
  {
    id: 'orbit',
    title: 'Rack sweep',
    description: 'Scan the full cabinet from top to bottom',
  },
  {
    id: 'drill',
    title: 'Port inspection',
    description: 'Detect switch ports, patch panels and device rows',
  },
  {
    id: 'status',
    title: 'Live LEDs',
    description: 'Read active links, blinking status and availability',
  },
  {
    id: 'pulse',
    title: 'Cable trace',
    description: 'Follow visible cable paths and rack connectivity',
  },
]

const workflowCards = [
  {
    number: '01',
    badge: 'PERCEIVE',
    title: 'Visual Rack Intelligence',
    description:
      'Capture rack-facing visual evidence that identifies device placement, rack-unit position, labels, visible ports, and front-panel state from a guided sweep.',
    image: workflowArRackImage,
  },
  {
    number: '02',
    badge: 'COGNIZE',
    title: 'Autonomous Asset Identification',
    description:
      'Classify switches, servers, patch panels, PDUs, controllers, and labels into structured asset records without manual transcription.',
    image: workflowAiDetectionImage,
  },
  {
    number: '03',
    badge: 'CONNECT',
    title: 'Connectivity Intelligence',
    description:
      'Map visible port usage, cable paths, link indicators, and active or unused connections against the physical rack evidence.',
    image: workflowPortTrackingImage,
  },
  {
    number: '04',
    badge: 'TWIN',
    title: 'Topology Intelligence',
    description:
      'Connect rack position, device relationships, ports, and cabling context into a verified topology view teams can inspect and reconcile.',
    image: workflowNetworkTopologyImage,
  },
  {
    number: '05',
    badge: 'RECONCILE',
    title: 'Continuous Reconciliation',
    description:
      'Compare every new scan with CMDB, DCIM, asset, and network records so changes, drift, and missing fields stay visible.',
    image: workflowAutomatedInventoryImage,
  },
  {
    number: '06',
    badge: 'POSTURE',
    title: 'Posture Intelligence',
    description:
      'Surface device-level risk signals, missing evidence, firmware context, and audit gaps from the verified infrastructure record.',
    image: workflowSecurityComplianceImage,
  },
]

function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`principles-section${revealed ? ' is-revealed' : ''}`}
    >
      <div className="principles-bg-glow principles-bg-glow-one" />
      <div className="principles-bg-glow principles-bg-glow-two" />
      <div className="principles-wave" aria-hidden="true" />

      <div className="principles-header">
        <div className="principles-header-main">
          <p className="section-kicker principles-kicker">
            <span aria-hidden="true" />
            PRINCIPLES
          </p>

          <h2>
            Built on three
            <br />
            <span>non-negotiables.</span>
          </h2>
        </div>

        <p className="principles-intro">
          RackTrack unifies the physical and digital layers of your infrastructure,
          delivering trusted, real-time intelligence you can act on.
        </p>
      </div>

      <div className="principles-card-row">
        {principleCards.map((card, index) => (
          <article
            key={card.number}
            className={`principle-card principle-card-${index + 1}${
              hoveredIndex === index ? ' is-hovered' : ''
            }${
              hoveredIndex !== null && hoveredIndex !== index ? ' is-dimmed' : ''
            }`}
            style={{ '--card-index': index } as CSSProperties}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
          >
            <div className="principle-card-visual" aria-hidden="true">
              <img src={principleCardImages[index]} alt="" />
            </div>
            <div className="principle-card-content">
              <span className="principle-number">{card.number}</span>
              <h3>{card.title}</h3>
              <i aria-hidden="true" />
              <p>{card.description}</p>
            </div>

            <div className="principle-feature-strip" aria-hidden="true">
              {card.features.map((feature) => (
                <span key={feature}>
                  <i />
                  {feature}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="principles-footer-line">
        <span aria-hidden="true" />
        One Platform. Complete Confidence.
      </div>
    </section>
  )
}

function RackTopologySection() {
  const [activeFeature, setActiveFeature] = useState('orbit')

  return (
    <section className="rack-topology-section" id="rack-3d">
      <img
        className="topology-section-bg-image"
        src={topologySectionImage}
        alt=""
        aria-hidden="true"
      />
      <div className="topology-bg topology-bg-one" />
      <div className="topology-bg topology-bg-two" />
      <div className="topology-stars" />

      <div className="topology-copy">
        <p className="topology-kicker">3D TOPOLOGY</p>

        <h2>
          A rack you can <span>perceive,</span>
          <br />
          <strong>reconcile & operationalize.</strong>
        </h2>

        <p className="topology-description">
          RackTrack reads rack imagery to build a continuously reconciled digital twin — switches, patch panels,
          servers, port activity, LED state, and cable routes — turning one cabinet sweep
          into verified infrastructure intelligence.
        </p>

        <div className="topology-feature-list">
          {topologyFeatures.map((feature) => (
            <button
              key={feature.id}
              className={`topology-feature ${
                activeFeature === feature.id ? 'is-active' : ''
              }`}
              type="button"
              aria-pressed={activeFeature === feature.id}
              onPointerEnter={() => setActiveFeature(feature.id)}
              onPointerDown={() => setActiveFeature(feature.id)}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onFocus={() => setActiveFeature(feature.id)}
              onClick={() => setActiveFeature(feature.id)}
            >
              <span className="feature-dot">
                <i />
              </span>

              <span>
                <strong>{feature.title}</strong>
                <small>{feature.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`topology-stage active-${activeFeature}`}
        aria-label="Exploded 3D rack topology stack"
      />
    </section>
  )
}

function WorkflowSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="workflow-section" id="workflow">
      <div className="workflow-bg-grid" />
      <div className="workflow-bg-orbit workflow-bg-orbit-one" />
      <div className="workflow-bg-orbit workflow-bg-orbit-two" />
      <div className="workflow-bg-glow workflow-bg-glow-one" />
      <div className="workflow-bg-glow workflow-bg-glow-two" />

      <div className="workflow-ambient-3d" aria-hidden="true">
        <span className="workflow-ambient-plane workflow-ambient-plane-one" />
        <span className="workflow-ambient-plane workflow-ambient-plane-two" />
        <span className="workflow-ambient-plane workflow-ambient-plane-three" />
        <span className="workflow-ambient-plane workflow-ambient-plane-four" />

        <span className="workflow-ambient-cube workflow-ambient-cube-one" />
        <span className="workflow-ambient-cube workflow-ambient-cube-two" />
        <span className="workflow-ambient-cube workflow-ambient-cube-three" />

        <span className="workflow-ambient-thread workflow-ambient-thread-one" />
        <span className="workflow-ambient-thread workflow-ambient-thread-two" />
        <span className="workflow-ambient-thread workflow-ambient-thread-three" />

        <span className="workflow-ambient-orbit workflow-ambient-orbit-one" />
        <span className="workflow-ambient-orbit workflow-ambient-orbit-two" />

        <span className="workflow-ambient-rail workflow-ambient-rail-one" />
        <span className="workflow-ambient-rail workflow-ambient-rail-two" />

        <span className="workflow-ambient-node workflow-node-one" />
        <span className="workflow-ambient-node workflow-node-two" />
        <span className="workflow-ambient-node workflow-node-three" />
        <span className="workflow-ambient-node workflow-node-four" />

        <span className="workflow-holo-stack workflow-holo-stack-one">
          <i />
          <i />
          <i />
          <i />
        </span>

        <span className="workflow-holo-stack workflow-holo-stack-two">
          <i />
          <i />
          <i />
          <i />
        </span>

        <span className="workflow-data-ribbon workflow-data-ribbon-one" />
        <span className="workflow-data-ribbon workflow-data-ribbon-two" />
        <span className="workflow-data-ribbon workflow-data-ribbon-three" />
      </div>

      <div className="workflow-header">
        <p className="workflow-kicker">WORKFLOW</p>

        <h2>
          One platform.
          <br />
          <span>Six intelligence surfaces.</span>
        </h2>

        <p>
          Every intelligence surface in RackTrack is powered by one continuous workflow —
          perceive, cognize, connect, twin, reconcile, and secure.
        </p>
      </div>

      <div className={`workflow-grid-layout ${revealed ? 'is-revealed' : ''}`}>
        {workflowCards.map((card, index) => (
          <article
            key={card.number}
            className={`workflow-grid-card${hoveredIndex === index ? ' is-hovered' : ''}${hoveredIndex !== null && hoveredIndex !== index ? ' is-dimmed' : ''}`}
            style={{ '--card-index': index } as CSSProperties}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
          >
            <div className="workflow-card-new-surface">
              <div className="workflow-card-image-container">
                <img src={card.image} alt={card.title} />
                <div className="workflow-card-image-overlay" />
              </div>

              <div className="workflow-card-content-new">
                <div className="workflow-card-header">
                  <span className="workflow-card-number">{card.number}</span>
                  <span className="workflow-card-badge">{card.badge}</span>
                </div>

                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>

              <div className="workflow-card-scan-pulse" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function SolutionsPage() {
  return (
    <main className="solutions-page">
      <section className="solutions-hero">
        <div className="hero-bg-flip" aria-hidden="true">
          {heroBackgroundImages.map((image, index) => (
            <div
              className={`hero-bg-flip__image hero-bg-flip__image--${index + 1}`}
              key={image}
              style={{ backgroundImage: `url("${image}")` }}
            />
          ))}
        </div>

        <div className="solutions-copy">
          <h1 className="hero-title">
            <span className="title-line">One platform.</span>
            <span className="title-line title-gradient">
              Six intelligence surfaces.
            </span>
          </h1>

          <p className="hero-description">
            From physical perception to continuous reconciliation, RackTrack turns rack data into verified infrastructure intelligence — synced to every system your teams already use.
          </p>

          <p className="hero-patent-sublabel">
            Built on patent-pending innovations for automated network cable mapping.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#rack-3d">
              Explore the 3D rack {'->'}
            </a>
            <a className="secondary-action" href="#workflow">
              See the workflow
            </a>
          </div>

          <div className="hero-stats">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/*
          Hero side scanning visual temporarily disabled for layout review.
          Kept in place intentionally so it can be restored quickly.

          <ScanVisual progress={progress} onReset={handleResetScan} />
        */}
      </section>

      <PrinciplesSection />

      <RackTopologySection />

      <WorkflowSection />
    </main>
  )
}

