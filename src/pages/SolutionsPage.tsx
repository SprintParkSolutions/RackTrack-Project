import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SolutionsPage.css'

const solutionsImagePath = '/solutions%20page%20images'
const heroVideo = `${solutionsImagePath}/hero_video.mp4`
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
const rackVideo = `${solutionsImagePath}/server_rack.mp4`

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
    title: 'Vision-first',
    description:
      'Camera is the input. Everything starts with a single photo of the rack.',
  },
  {
    number: '02',
    title: 'Data fusion',
    description:
      'Camera + switch telemetry + CMDB into one source of truth in seconds.',
  },
  {
    number: '03',
    title: 'Floor-ready',
    description:
      'Mobile-first, dark-default, designed for noisy data center aisles.',
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
    badge: 'AR SCAN',
    title: 'AR Rack Scanning',
    description:
      'Open the mobile scanner, align the rack, and capture device positions with guided AR overlays.',
    image: workflowArRackImage,
  },
  {
    number: '02',
    badge: 'AI DETECT',
    title: 'AI Device Detection',
    description:
      'Detect switches, servers, patch panels, labels, and rack units from the captured frame.',
    image: workflowAiDetectionImage,
  },
  {
    number: '03',
    badge: 'PORTS',
    title: 'Port Tracking',
    description:
      'Compare free, used, and reserved ports with live status mapped back to the rack image.',
    image: workflowPortTrackingImage,
  },
  {
    number: '04',
    badge: 'TOPOLOGY',
    title: 'Network Topology',
    description:
      'Build 2D and 3D topology views that connect physical rack layout to network paths.',
    image: workflowNetworkTopologyImage,
  },
  {
    number: '05',
    badge: 'INVENTORY',
    title: 'Automated Inventory',
    description:
      'Keep asset records, rack slots, device names, and ownership details current after each scan.',
    image: workflowAutomatedInventoryImage,
  },
  {
    number: '06',
    badge: 'SECURITY',
    title: 'Security & Compliance',
    description:
      'Surface firmware drift, missing records, and vulnerability alerts before audit day arrives.',
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

      <div className="principles-header">
        <p className="section-kicker">PRINCIPLES</p>

        <h2>
          Built on three
          <br />
          <span>non-negotiables.</span>
        </h2>
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
            <div className="principle-card-content">
              <span className="principle-number">{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className="principle-card-visual" aria-hidden="true">
              <img src={principleCardImages[index]} alt="" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function RackTopologySection() {
  const [activeFeature, setActiveFeature] = useState('orbit')

  return (
    <section className="rack-topology-section" id="rack-3d">
      <div className="topology-bg topology-bg-one" />
      <div className="topology-bg topology-bg-two" />
      <div className="topology-stars" />

      <div className="topology-copy">
        <p className="topology-kicker">3D TOPOLOGY</p>

        <h2>
          A rack you can <span>scan,</span>
          <br />
          <strong>trace & verify.</strong>
        </h2>

        <p className="topology-description">
          RackTrack reads live rack footage to identify switches, patch panels,
          servers, port activity, LEDs and cable routes, turning one cabinet video
          into a verified rack inventory.
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

      <div className={`topology-stage active-${activeFeature}`}>
        <div className="topology-stage-label">
          <span />
          LIVE RACK · VIDEO AUDIT
        </div>

        <div className="topology-scene-glow" />

        <div className="rack-viewer-orbits" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="sketchfab-rack-shell">
          <div className="sketchfab-glow-ring" />

          <video
            className="rack-video-frame"
            src={rackVideo}
            aria-label="RackTrack 3D server rack rotation"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          <div className="rack-ui-overlay">
            <div className="rack-scan-line rack-scan-line-one" />
            <div className="rack-scan-line rack-scan-line-two" />
            <div className="rack-scan-line rack-scan-line-three" />

            <div className="rack-floating-tag rack-floating-tag-one">
              <span>SCAN</span>
              <strong>RACK</strong>
            </div>

            <div className="rack-floating-tag rack-floating-tag-two">
              <span>LEDs</span>
              <strong>LIVE</strong>
            </div>

            <div className="rack-floating-tag rack-floating-tag-three">
              <span>PORTS</span>
              <strong>ACTIVE</strong>
            </div>
          </div>
        </div>

        <div className="topology-status-pill">
          <span>RACK.42U</span>
          <i />
          <span>DEVICES 9</span>
        </div>

        <div className="topology-floor-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
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
          Six moments.
          <br />
          <span>One scan.</span>
        </h2>

        <p>
          Every step of the RackTrack workflow is powered by one rack scan —
          capture, detect, track, map, inventory, and secure.
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
        <video
          className="hero-bg-video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div className="solutions-copy">
          <h1 className="hero-title">
            <span className="title-line">One workflow.</span>
            <span className="title-line title-gradient">
              Every rack in your fleet.
            </span>
          </h1>

          <p className="hero-description">
            From one rack scan to a synced CMDB record, RackTrack turns audits
            into one clear mobile workflow.
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

