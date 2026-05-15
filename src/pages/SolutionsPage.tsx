import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SolutionsPage.css'

const solutionsImagePath = '/solutions%20page%20images'
const beforeScanImage = `${solutionsImagePath}/Before_scan.png`
const afterScanImage = `${solutionsImagePath}/After_scan.png`
const bgImage = `${solutionsImagePath}/datacenter-bg.jpg`
const workflowRackScanImage = `${solutionsImagePath}/Server_rack-scan.png`
const workflowArRackImage = `${solutionsImagePath}/AR_Rack.png`
const workflowAiDetectionImage = `${solutionsImagePath}/AI_Device_Detection.png`
const workflowPortTrackingImage = `${solutionsImagePath}/Port_Tracking.png`
const workflowNetworkTopologyImage = `${solutionsImagePath}/Network_Topology.png`
const workflowAutomatedInventoryImage = `${solutionsImagePath}/Automated_Inventory.png`
const workflowSecurityComplianceImage = `${solutionsImagePath}/Security_Compliance.png`
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function fastStartScanEase(value: number) {
  return 1 - Math.pow(1 - value, 2.25)
}

function ScanVisual({
  progress,
  onReset,
}: {
  progress: number
  onReset: () => void
}) {
  const completed = progress > 0.98

  const beforeOpacity = clamp(1 - progress * 1.35, 0, 1)
  const afterOpacity = clamp((progress - 0.42) * 2.15, 0, 1)
  const scanBeamOpacity = completed ? 0 : clamp(1 - progress * 0.08, 0.25, 1)
  const networkOpacity = clamp(0.52 + progress * 0.48, 0.52, 1)
  const scanLineTop = `${clamp(progress * 100, 7, 93)}%`

  const scanStyle = {
    '--scan-progress': progress,
    '--scan-line-top': scanLineTop,
    '--before-opacity': beforeOpacity,
    '--after-opacity': afterOpacity,
    '--scan-beam-opacity': scanBeamOpacity,
    '--network-opacity': networkOpacity,
  } as CSSProperties

  return (
    <div
      className={`scan-stage hero-scan-stage ${completed ? 'is-complete' : ''}`}
      style={scanStyle}
    >
      <div className="hero-network-3d" aria-hidden="true">
        <svg
          className="hero-wire-svg"
          viewBox="0 0 720 660"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroWireGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(19, 245, 255, 0)" />
              <stop offset="18%" stopColor="rgba(19, 245, 255, 0.42)" />
              <stop offset="52%" stopColor="rgba(125, 211, 252, 0.92)" />
              <stop offset="82%" stopColor="rgba(19, 245, 255, 0.46)" />
              <stop offset="100%" stopColor="rgba(19, 245, 255, 0)" />
            </linearGradient>

            <filter id="heroWireGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            className="hero-wire-path hero-wire-path-one"
            d="M 20 120 C 130 40, 245 145, 355 92 S 570 38, 700 135"
          />
          <path
            className="hero-wire-path hero-wire-path-two"
            d="M 18 292 C 150 240, 230 326, 360 286 S 575 225, 704 304"
          />
          <path
            className="hero-wire-path hero-wire-path-three"
            d="M 28 520 C 150 430, 255 555, 370 492 S 570 440, 694 520"
          />
          <path
            className="hero-wire-path hero-wire-path-four"
            d="M 92 36 C 160 150, 125 270, 236 340 S 355 500, 280 630"
          />
          <path
            className="hero-wire-path hero-wire-path-five"
            d="M 632 42 C 560 160, 615 270, 502 350 S 390 508, 460 630"
          />

          <circle className="hero-wire-dot hero-wire-dot-one" r="4">
            <animateMotion
              dur="5.2s"
              repeatCount="indefinite"
              path="M 20 120 C 130 40, 245 145, 355 92 S 570 38, 700 135"
            />
          </circle>

          <circle className="hero-wire-dot hero-wire-dot-two" r="4">
            <animateMotion
              dur="6.4s"
              repeatCount="indefinite"
              path="M 18 292 C 150 240, 230 326, 360 286 S 575 225, 704 304"
            />
          </circle>

          <circle className="hero-wire-dot hero-wire-dot-three" r="4">
            <animateMotion
              dur="5.8s"
              repeatCount="indefinite"
              path="M 28 520 C 150 430, 255 555, 370 492 S 570 440, 694 520"
            />
          </circle>
        </svg>

        <span className="hero-network-grid hero-network-grid-one" />
        <span className="hero-network-grid hero-network-grid-two" />

        <span className="hero-network-orbit hero-network-orbit-one" />
        <span className="hero-network-orbit hero-network-orbit-two" />
        <span className="hero-network-orbit hero-network-orbit-three" />

        <span className="hero-network-beam hero-network-beam-one" />
        <span className="hero-network-beam hero-network-beam-two" />
        <span className="hero-network-beam hero-network-beam-three" />

        <span className="hero-network-node hero-network-node-one" />
        <span className="hero-network-node hero-network-node-two" />
        <span className="hero-network-node hero-network-node-three" />
        <span className="hero-network-node hero-network-node-four" />
        <span className="hero-network-node hero-network-node-five" />

        <span className="hero-network-cube hero-network-cube-one">
          <i />
          <i />
          <i />
        </span>

        <span className="hero-network-cube hero-network-cube-two">
          <i />
          <i />
          <i />
        </span>
      </div>

      <article
        className={`scan-card hero-scan-card ${completed ? 'is-clickable' : ''}`}
        onClick={completed ? onReset : undefined}
        title={completed ? 'Click to scan again' : undefined}
      >
        <div className="hero-scan-image-layer hero-before-scan">
          <img src={beforeScanImage} alt="RackTrack rack before scan" />
        </div>

        <div className="hero-scan-image-layer hero-after-scan">
          <img src={afterScanImage} alt="RackTrack rack after AI scan" />
        </div>

        <div className="hero-scan-vignette" />

        <div className="scan-top-meta hero-scan-top-meta">
          <span className="scan-status-text">
            {completed ? '• SCAN COMPLETE' : 'SCANNING RACK…'}
          </span>
          <span>42U · 9 DEVICES</span>
        </div>

        {!completed && (
          <>
            <div className="hero-scan-lens">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="scan-line hero-main-scan-line" />
            <div className="scan-sweep hero-main-scan-sweep" />
            <div className="scan-glow hero-main-scan-glow" />
          </>
        )}

        <div className="hero-scan-side-pill hero-pill-one">
          <small>SWITCH</small>
          <strong>24P</strong>
        </div>

        <div className="hero-scan-side-pill hero-pill-two">
          <small>SERVER</small>
          <strong>R740</strong>
        </div>

        <div className="hero-scan-side-pill hero-pill-three">
          <small>PORTS</small>
          <strong>ACTIVE</strong>
        </div>

        <div className="detected-panel hero-detected-panel">
          <p>{completed ? 'Detected' : 'Analyzing'}</p>
          <h3>{completed ? 'Rack inventory mapped' : 'Rack scan in progress'}</h3>
          <span>
            {completed
              ? '✓ Devices, ports, cables and labels recognized'
              : 'Reading switches, ports, servers and cable paths…'}
          </span>
          {!completed && <small>Scanning rack unit positions…</small>}
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
          Built on three
          <br />
          <span>non-negotiables.</span>
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

function WorkflowRackScanCenter({
  progress,
  scanDone,
  onReset,
}: {
  progress: number
  scanDone: boolean
  onReset: () => void
}) {
  const scanLineTop = `${clamp(progress * 100, 5, 95)}%`

  const scanStyle = {
    '--workflow-scan-progress': progress,
    '--workflow-scan-line-top': scanLineTop,
  } as CSSProperties

  return (
    <div className="workflow-rack-center-container" style={scanStyle}>
      <button
        className={`workflow-rack-frame ${scanDone ? 'is-complete' : ''}`}
        type="button"
        onClick={scanDone ? onReset : undefined}
        title={scanDone ? 'Click to replay scan' : undefined}
      >
        <img
          src={workflowRackScanImage}
          alt="RackTrack workflow rack scan"
          className="workflow-rack-image"
        />

        <div className="workflow-rack-overlay" />

        <div className="workflow-rack-status">
          <span>{scanDone ? 'SCAN COMPLETE' : 'SCANNING RACK'}</span>
          <strong>{Math.round(progress * 100)}%</strong>
        </div>

        <div className="workflow-rack-scan-line" />
        <div className="workflow-rack-scan-band" />
        <div className="workflow-rack-glow" />

        <div className="workflow-rack-corner workflow-rack-corner-one" />
        <div className="workflow-rack-corner workflow-rack-corner-two" />

        {scanDone && <div className="workflow-rack-rescan">Click to replay scan</div>}
      </button>
    </div>
  )
}

function WorkflowSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const [progress, setProgress] = useState(0)
  const [scanDone, setScanDone] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [activeRevealIndex, setActiveRevealIndex] = useState(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const hasStartedRef = useRef(false)
  const startTimeoutRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const revealTimersRef = useRef<number[]>([])

  const workflowPositions = [
    'left-top',
    'left-mid',
    'left-bottom',
    'right-top',
    'right-mid',
    'right-bottom',
  ]

  const workflowConnectorPaths = [
  {
    id: 'left-top',
    path: 'M 562 300 H 500 V 104 H 336',
    nodes: [
      [562, 300],
      [500, 300],
      [500, 104],
      [336, 104],
    ],
  },
  {
    id: 'left-mid',
    // Card 02: straight arrow from center rack to middle-left card
    path: 'M 548 410 H 372',
    nodes: [
      [548, 410],
      [372, 410],
    ],
  },
  {
    id: 'left-bottom',
    path: 'M 562 520 H 500 V 720 H 336',
    nodes: [
      [562, 520],
      [500, 520],
      [500, 720],
      [336, 720],
    ],
  },
  {
    id: 'right-top',
    path: 'M 758 300 H 820 V 104 H 984',
    nodes: [
      [758, 300],
      [820, 300],
      [820, 104],
      [984, 104],
    ],
  },
  {
    id: 'right-mid',
    // Card 05: straight arrow from center rack to middle-right card
    path: 'M 772 410 H 948',
    nodes: [
      [772, 410],
      [948, 410],
    ],
  },
  {
    id: 'right-bottom',
    path: 'M 758 520 H 820 V 720 H 984',
    nodes: [
      [758, 520],
      [820, 520],
      [820, 720],
      [984, 720],
    ],
  },
]

  const clearWorkflowTimers = useCallback(() => {
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    revealTimersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId)
    })

    revealTimersRef.current = []
  }, [])

  const revealWorkflowCards = useCallback(() => {
    setScanDone(true)
    setRevealedCount(0)
    setActiveRevealIndex(-1)
    setHoveredIndex(null)

    workflowCards.forEach((_, index) => {
      const timerId = window.setTimeout(() => {
        setRevealedCount(index + 1)
        setActiveRevealIndex(index)
      }, 420 + index * 540)

      revealTimersRef.current.push(timerId)
    })

    const finishTimerId = window.setTimeout(() => {
      setActiveRevealIndex(-1)
    }, 420 + workflowCards.length * 540 + 1100)

    revealTimersRef.current.push(finishTimerId)
  }, [])

  const startWorkflowScan = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    setProgress(0)
    setScanDone(false)
    setRevealedCount(0)
    setActiveRevealIndex(-1)
    setHoveredIndex(null)

    const duration = 4300
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const rawProgress = clamp(elapsed / duration, 0, 1)
      const easedProgress = easeInOutCubic(rawProgress)

      setProgress(easedProgress)

      if (rawProgress < 1) {
        frameRef.current = window.requestAnimationFrame(animate)
        return
      }

      frameRef.current = null
      setProgress(1)
      revealWorkflowCards()
    }

    frameRef.current = window.requestAnimationFrame(animate)
  }, [revealWorkflowCards])

  const replayWorkflowScan = useCallback(() => {
    clearWorkflowTimers()

    setProgress(0)
    setScanDone(false)
    setRevealedCount(0)
    setActiveRevealIndex(-1)
    setHoveredIndex(null)

    startTimeoutRef.current = window.setTimeout(() => {
      startTimeoutRef.current = null
      startWorkflowScan()
    }, 550)
  }, [clearWorkflowTimers, startWorkflowScan])

  useEffect(() => {
    const section = sectionRef.current

    const scheduleScan = () => {
      if (hasStartedRef.current) return

      hasStartedRef.current = true
      clearWorkflowTimers()

      startTimeoutRef.current = window.setTimeout(() => {
        startTimeoutRef.current = null
        startWorkflowScan()
      }, 450)
    }

    if (!section || !('IntersectionObserver' in window)) {
      startTimeoutRef.current = window.setTimeout(scheduleScan, 300)

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
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.16,
      },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      clearWorkflowTimers()
    }
  }, [clearWorkflowTimers, startWorkflowScan])

  const renderWorkflowCard = (
    card: (typeof workflowCards)[number],
    index: number,
  ) => {
    const isVisible = index < revealedCount
    const isAutoActive = activeRevealIndex === index
    const isHovered = hoveredIndex === index
    const position = workflowPositions[index]

    return (
      <article
        key={card.number}
        className={`workflow-card-new workflow-orbit-card ${
          isAutoActive ? 'is-auto-active' : ''
        } ${isHovered ? 'is-hovered' : ''}`}
        style={{ '--card-index': index } as CSSProperties}
        data-visible={isVisible}
        data-position={position}
        onMouseEnter={() => {
          if (isVisible) setHoveredIndex(index)
        }}
        onMouseLeave={() => setHoveredIndex(null)}
        onFocus={() => {
          if (isVisible) setHoveredIndex(index)
        }}
        tabIndex={isVisible ? 0 : -1}
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
    )
  }

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

      <div
        className={`workflow-new-layout ${
          scanDone ? 'has-cards' : 'is-scanning'
        }`}
      >
        <div className="workflow-callout-map">
          <div className="workflow-center-rack">
            <WorkflowRackScanCenter
              progress={progress}
              scanDone={scanDone}
              onReset={replayWorkflowScan}
            />
          </div>

          <svg
            className={`workflow-connector-svg ${scanDone ? 'is-visible' : ''}`}
            viewBox="0 0 1320 820"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="workflowConnectorGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="rgba(19, 245, 255, 0.08)" />
                <stop offset="45%" stopColor="rgba(19, 245, 255, 0.95)" />
                <stop offset="100%" stopColor="rgba(125, 211, 252, 0.22)" />
              </linearGradient>

              <filter
                id="workflowConnectorGlow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <marker
                id="workflowArrowHead"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill="rgba(19, 245, 255, 0.92)"
                />
              </marker>
            </defs>

            {workflowConnectorPaths.map((connector, index) => {
              const isVisible = index < revealedCount
              const isActive = activeRevealIndex === index || hoveredIndex === index
              const position = workflowPositions[index] ?? ''

              return (
                <g
                  key={connector.id}
                  data-position={position}
                  className={`workflow-connector-group ${
                    isVisible ? 'is-visible' : ''
                  } ${isActive ? 'is-active' : ''}`}
                  style={{ '--connector-index': index } as CSSProperties}
                >
                  <path
                    id={`workflow-network-path-${index}`}
                    className="workflow-connector-path workflow-connector-path-shadow"
                    d={connector.path}
                  />

                  <path
                    className="workflow-connector-path workflow-connector-path-main"
                    d={connector.path}
                    markerEnd="url(#workflowArrowHead)"
                  />

                  <path
                    className="workflow-connector-path workflow-connector-path-dash"
                    d={connector.path}
                  />

                  {connector.nodes.map((node, nodeIndex) => (
                    <circle
                      key={`${connector.id}-${nodeIndex}`}
                      className="workflow-connector-node"
                      cx={node[0]}
                      cy={node[1]}
                      r={nodeIndex === 0 ? 6 : 5}
                    />
                  ))}

                  <circle className="workflow-connector-packet" r="4">
                    <animateMotion
                      dur="2.7s"
                      begin={`${index * 0.16}s`}
                      repeatCount="indefinite"
                      path={connector.path}
                    />
                  </circle>
                </g>
              )
            })}
          </svg>

          <div className="workflow-callout-layer">
            {workflowCards.map((card, index) => renderWorkflowCard(card, index))}
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
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }

    /*
      Infinite hero scan loop:
      1. scanDuration  = scanning movement from top to bottom
      2. holdDuration  = small pause on completed result
      3. resetDuration = quick reset back to scan start
    */
    const scanDuration = 4200
    const holdDuration = 950
    const resetDuration = 300
    const cycleDuration = scanDuration + holdDuration + resetDuration

    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = (time - startTime) % cycleDuration

      if (elapsed <= scanDuration) {
        const rawProgress = clamp(elapsed / scanDuration, 0, 1)
        const easedProgress = fastStartScanEase(rawProgress)

        setProgress(easedProgress)
      } else if (elapsed <= scanDuration + holdDuration) {
        setProgress(1)
      } else {
        setProgress(0)
      }

      frameRef.current = window.requestAnimationFrame(animate)
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

        <ScanVisual progress={progress} onReset={handleResetScan} />
      </section>

      <PrinciplesSection />

      <RackTopologySection />

      <WorkflowSection />
    </main>
  )
}
