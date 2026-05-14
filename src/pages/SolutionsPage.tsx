import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SolutionsPage.css'

const solutionsImagePath = '/solutions%20page%20images'
const beforeScanImage = `${solutionsImagePath}/phone-scan-before.jpg`
const afterScanImage = `${solutionsImagePath}/ports-scan-output.jpg`
const bgImage = `${solutionsImagePath}/datacenter-bg.jpg`
const workflowBeforeImage = `${solutionsImagePath}/workflow-before.png`
const workflowAfterImage = `${solutionsImagePath}/workflow-after.png`
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

const principleCards = [
  {
    number: '01',
    title: 'Vision-first',
    description:
      'Camera is the input. Everything starts with a single photo of the rack.',
    icon: 'circle',
  },
  {
    number: '02',
    title: 'Data fusion',
    description:
      'Camera + switch telemetry + CMDB into one source of truth in seconds.',
    icon: 'diamond',
  },
  {
    number: '03',
    title: 'Floor-ready',
    description:
      'Mobile-first, dark-default, designed for noisy data center aisles.',
    icon: 'square',
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
    image: workflowBeforeImage,
  },
  {
    number: '02',
    badge: 'AI DETECT',
    title: 'AI Device Detection',
    description:
      'Detect switches, servers, patch panels, labels, and rack units from the captured frame.',
    image: afterScanImage,
  },
  {
    number: '03',
    badge: 'PORTS',
    title: 'Port Tracking',
    description:
      'Compare free, used, and reserved ports with live status mapped back to the rack image.',
    image: workflowAfterImage,
  },
  {
    number: '04',
    badge: 'TOPOLOGY',
    title: 'Network Topology',
    description:
      'Build 2D and 3D topology views that connect physical rack layout to network paths.',
    image: bgImage,
  },
  {
    number: '05',
    badge: 'INVENTORY',
    title: 'Automated Inventory',
    description:
      'Keep asset records, rack slots, device names, and ownership details current after each scan.',
    image: beforeScanImage,
  },
  {
    number: '06',
    badge: 'SECURITY',
    title: 'Security & Compliance',
    description:
      'Surface firmware drift, missing records, and vulnerability alerts before audit day arrives.',
    image: workflowAfterImage,
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function ScanVisual({
  progress,
  onReset,
}: {
  progress: number
  onReset: () => void
}) {
  const completed = progress > 0.98

  const beforeOpacity = clamp(1 - progress * 1.25, 0, 1)
  const afterOpacity = clamp((progress - 0.34) * 2.35, 0, 1)
  const targetOpacity = clamp(1 - progress * 1.35, 0, 1)
  const detectionOpacity = clamp((progress - 0.46) * 2.3, 0, 1)
  const scanBeamOpacity = clamp(1 - progress * 0.7, 0, 1)
  const orbitOpacity = clamp(0.25 + progress * 0.75, 0.25, 1)
  const scanLineTop = `${clamp(progress * 100, 8, 92)}%`

  const scanStyle = {
    '--scan-progress': progress,
    '--scan-line-top': scanLineTop,
    '--before-opacity': beforeOpacity,
    '--after-opacity': afterOpacity,
    '--target-opacity': targetOpacity,
    '--detection-opacity': detectionOpacity,
    '--scan-beam-opacity': scanBeamOpacity,
    '--orbit-opacity': orbitOpacity,
  } as CSSProperties

  return (
    <div
      className={`scan-stage ${completed ? 'is-complete' : ''}`}
      style={scanStyle}
    >
      <div className="orbit-ring orbit-one" />
      <div className="orbit-ring orbit-two" />

      <article
        className={`scan-card ${completed ? 'is-clickable' : ''}`}
        onClick={completed ? onReset : undefined}
        title={completed ? 'Click to scan again' : undefined}
      >
        <div className="scan-image-layer before-image">
          <img src={beforeScanImage} alt="RackTrack before rack scan" />
        </div>

        <div className="scan-image-layer after-image">
          <img src={afterScanImage} alt="RackTrack after rack scan output" />
        </div>

        <div className="scan-dark-overlay" />

        <div className="scan-top-meta">
          <span className="scan-status-text">
            {completed ? '• COMPLETE' : 'SCANNING…'}
          </span>
          <span>42U · 9 DEV</span>
        </div>

        <div className="scan-line" />
        <div className="scan-sweep" />
        <div className="scan-glow" />

        <div className="before-target target-one" />
        <div className="before-target target-two" />
        <div className="before-target target-three" />

        <div className="after-detections">
          {detectedRows.map((row) => (
            <div
              key={row.label}
              className="detected-row"
              style={{ top: row.top }}
            >
              <span>{row.label}</span>
            </div>
          ))}
        </div>

        <div className="detected-panel">
          <p>Detected</p>
          <h3>Cisco Nexus 9300</h3>
          <span>
            {completed
              ? '✓ 24 / 48 ports · CMDB synced'
              : 'Analyzing port layout…'}
          </span>
          {!completed && <small>Scanning rack unit position…</small>}
        </div>

        {completed && <div className="rescan-hint">Click to scan again</div>}
      </article>
    </div>
  )
}

function PrincipleIcon({ type }: { type: string }) {
  return (
    <div className={`principle-icon principle-icon-${type}`}>
      <span />
    </div>
  )
}

function PrinciplesBackground3D() {
  return (
    <div className="principles-3d-scene" aria-hidden="true">
      <div className="depth-grid depth-grid-one" />
      <div className="depth-grid depth-grid-two" />

      <div className="holo-orbit holo-orbit-one" />
      <div className="holo-orbit holo-orbit-two" />
      <div className="holo-orbit holo-orbit-three" />

      <div className="data-beam data-beam-one" />
      <div className="data-beam data-beam-two" />
      <div className="data-beam data-beam-three" />

      <div className="holo-rack-frame rack-frame-left">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="holo-rack-frame rack-frame-right">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="node-cloud node-cloud-left">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="node-cloud node-cloud-right">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="floating-panel floating-panel-left">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="floating-panel floating-panel-right">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="holo-cube cube-one">
        <i className="cube-face cube-front" />
        <i className="cube-face cube-back" />
        <i className="cube-face cube-right" />
        <i className="cube-face cube-left" />
        <i className="cube-face cube-top" />
        <i className="cube-face cube-bottom" />
      </div>

      <div className="holo-cube cube-two">
        <i className="cube-face cube-front" />
        <i className="cube-face cube-back" />
        <i className="cube-face cube-right" />
        <i className="cube-face cube-left" />
        <i className="cube-face cube-top" />
        <i className="cube-face cube-bottom" />
      </div>

      <div className="holo-core" />
    </div>
  )
}

function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardStageRef = useRef<HTMLDivElement | null>(null)
  const [isSplit, setIsSplit] = useState(false)

  useEffect(() => {
    let rafId: number | null = null

    const updateCards = () => {
      if (!sectionRef.current || !cardStageRef.current) return

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const cardRect = cardStageRef.current.getBoundingClientRect()

      const sectionIsActive =
        sectionRect.top <= window.innerHeight * 0.18 &&
        sectionRect.bottom >= window.innerHeight * 0.45

      const cardsReachedFocusZone =
        cardRect.top <= window.innerHeight * 0.62 &&
        cardRect.bottom >= window.innerHeight * 0.3

      const shouldSplit = sectionIsActive && cardsReachedFocusZone

      setIsSplit((current) => (current === shouldSplit ? current : shouldSplit))
    }

    const requestUpdate = () => {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        rafId = null
        updateCards()
      })
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    requestUpdate()

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`principles-section ${isSplit ? 'is-split' : 'is-stacked'}`}
    >
      <PrinciplesBackground3D />

      <div className="principles-bg-glow principles-bg-glow-one" />
      <div className="principles-bg-glow principles-bg-glow-two" />

      <div className="principles-header">
        <p className="section-kicker">PRINCIPLES</p>

        <h2>
          Built on three{' '}
          <span>
            non-
            <br />
            negotiables.
          </span>
        </h2>
      </div>

      <div ref={cardStageRef} className="principles-card-stage">
        {principleCards.map((card, index) => (
          <article
            key={card.number}
            className={`principle-card principle-card-${index + 1}`}
          >
            <div className="principle-card-depth">
              <PrincipleIcon type={card.icon} />

              <span className="principle-number">{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
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

function WorkflowScanPanel({
  progress,
  activeIndex,
  onReset,
}: {
  progress: number
  activeIndex: number
  onReset: () => void
}) {
  const completed = progress > 0.98
  const activeMoment = workflowCards[activeIndex]

  const beforeOpacity = clamp(1 - progress * 1.2, 0, 1)
  const afterOpacity = clamp((progress - 0.24) * 2.05, 0, 1)
  const scanLineTop = `${clamp(progress * 100, 7, 92)}%`

  const scanStyle = {
    '--workflow-progress': progress,
    '--workflow-line-top': scanLineTop,
    '--workflow-before-opacity': beforeOpacity,
    '--workflow-after-opacity': afterOpacity,
  } as CSSProperties

  return (
    <article
      className={`workflow-scan-panel ${completed ? 'is-complete' : ''}`}
      style={scanStyle}
      onClick={completed ? onReset : undefined}
      title={completed ? 'Click to scan again' : undefined}
    >
      <div className="workflow-phone-frame">
        <div className="workflow-scan-image workflow-before-image">
          <img src={workflowBeforeImage} alt="RackTrack workflow before scan" />
        </div>

        <div className="workflow-scan-image workflow-after-image">
          <img src={workflowAfterImage} alt="RackTrack workflow after scan" />
        </div>

        <div className="workflow-preview-overlay" />

        <div className="workflow-device-tag workflow-tag-device">DEVICE</div>
        <div className="workflow-device-tag workflow-tag-port">PORT</div>
        <div className="workflow-device-tag workflow-tag-cable">CABLE</div>

        <div className="workflow-scan-line" />
        <div className="workflow-scan-band" />
        <div className="workflow-scan-glow" />

        <div className="workflow-corner corner-one" />
        <div className="workflow-corner corner-two" />
      </div>

      <div className="workflow-scan-footer">
        <div className="workflow-active-copy">
          <span>ACTIVE MOMENT {activeMoment.number}</span>
          <h3>{activeMoment.title}</h3>
          <p>{activeMoment.description}</p>
        </div>

        <div className="workflow-dots">
          {workflowCards.map((card, index) => (
            <i
              key={card.number}
              className={index === activeIndex ? 'is-active' : ''}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

function WorkflowSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const hasStartedRef = useRef(false)
  const startTimeoutRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  const clearWorkflowTimers = useCallback(() => {
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const startWorkflowScan = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    const duration = 7000
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const rawProgress = clamp(elapsed / duration, 0, 1)
      const easedProgress = easeInOutCubic(rawProgress)

      setProgress(easedProgress)

      if (rawProgress < 1) {
        frameRef.current = window.requestAnimationFrame(animate)
      } else {
        frameRef.current = null
        setProgress(1)
      }
    }

    frameRef.current = window.requestAnimationFrame(animate)
  }, [])

  const resetWorkflowScan = useCallback(() => {
    hasStartedRef.current = true
    clearWorkflowTimers()
    setProgress(0)

    startTimeoutRef.current = window.setTimeout(() => {
      startTimeoutRef.current = null
      startWorkflowScan()
    }, 1300)
  }, [clearWorkflowTimers, startWorkflowScan])

  useEffect(() => {
    const section = sectionRef.current

    const scheduleScan = () => {
      if (hasStartedRef.current) return

      hasStartedRef.current = true
      clearWorkflowTimers()
      setProgress(0)

      startTimeoutRef.current = window.setTimeout(() => {
        startTimeoutRef.current = null
        startWorkflowScan()
      }, 250)
    }

    if (!section || !('IntersectionObserver' in window)) {
      scheduleScan()

      return () => {
        clearWorkflowTimers()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleScan()
        }
      },
      {
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.24,
      },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      clearWorkflowTimers()
    }
  }, [clearWorkflowTimers, startWorkflowScan])

  const activeIndex = hoveredIndex ?? carouselIndex

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (hoveredIndex !== null) return

      setCarouselIndex((current) => (current + 1) % workflowCards.length)
    }, 3800)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [hoveredIndex])

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
      </div>

      <div className="workflow-header">
        <p className="workflow-kicker">WORKFLOW</p>

        <h2>
          Six moments.
          <br />
          <span>One scan.</span>
        </h2>

        <p>
          Every screen of the RackTrack experience is visible upfront - tap any
          moment to preview the scan output.
        </p>
      </div>

      <div className="workflow-layout">
        <div className="workflow-sticky-preview">
          <WorkflowScanPanel
            progress={progress}
            activeIndex={activeIndex}
            onReset={resetWorkflowScan}
          />
        </div>

        <div
          className="workflow-card-carousel"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="workflow-carousel-orbit" aria-hidden="true" />
          <div className="workflow-carousel-stage">
            {workflowCards.map((card, index) => (
              <article
                key={card.number}
                className={`workflow-card ${
                  index === activeIndex ? 'is-active' : ''
                }`}
                style={
                  {
                    '--card-offset': index - activeIndex,
                    '--card-distance': Math.abs(index - activeIndex),
                  } as CSSProperties
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setCarouselIndex(index)}
              >
                <img src={card.image} alt={card.title} />

                <div className="workflow-card-shade" />

                <div className="workflow-card-top">
                  <span className="workflow-card-number">{card.number}</span>
                  <span className="workflow-card-badge">{card.badge}</span>
                </div>

                <div className="workflow-card-content">
                  <div className="workflow-progress-track">
                    <span
                      style={{
                        width: `${Math.max(
                          28,
                          ((index + 1) / workflowCards.length) * 100,
                        )}%`,
                      }}
                    />
                  </div>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SolutionsPage() {
  const [progress, setProgress] = useState(0)

  const startTimeoutRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const startAnimation = useCallback(() => {
    const duration = 7000
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const rawProgress = clamp(elapsed / duration, 0, 1)
      const easedProgress = easeInOutCubic(rawProgress)

      setProgress(easedProgress)

      if (rawProgress < 1) {
        frameRef.current = window.requestAnimationFrame(animate)
      } else {
        frameRef.current = null
        setProgress(1)
      }
    }

    frameRef.current = window.requestAnimationFrame(animate)
  }, [])

  const handleResetScan = useCallback(() => {
    clearTimers()
    setProgress(0)
    startAnimation()
  }, [clearTimers, startAnimation])

  useEffect(() => {
    startAnimation()

    return () => {
      clearTimers()
    }
  }, [clearTimers, startAnimation])

  return (
    <main className="solutions-page">
      <section className="solutions-hero">
        <div
          className="hero-bg-image"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="hero-noise" />
        <div className="hero-aurora hero-aurora-one" />
        <div className="hero-aurora hero-aurora-two" />

        <div className="solutions-copy">
          <h1 className="hero-title">
            <span className="title-line">One workflow.</span>
            <span className="title-line title-gradient">Every rack in your fleet.</span>
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

        <ScanVisual progress={progress} onReset={handleResetScan} />
      </section>

      <PrinciplesSection />

      <RackTopologySection />

      <WorkflowSection />
    </main>
  )
}
