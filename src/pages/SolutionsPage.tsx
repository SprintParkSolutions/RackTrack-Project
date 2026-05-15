import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './SolutionsPage.css'

const solutionsImagePath = '/solutions%20page%20images'
const bgImage = `${solutionsImagePath}/network-topology-hero.png`
const workflowRackScanImage = `${solutionsImagePath}/Server_rack-scan.png`
const workflowArRackImage = `${solutionsImagePath}/AR_Rack.png`
const workflowAiDetectionImage = `${solutionsImagePath}/AI_Device_Detection.png`
const workflowPortTrackingImage = `${solutionsImagePath}/Port_Tracking.png`
const workflowNetworkTopologyImage = `${solutionsImagePath}/Network_Topology.png`
const workflowAutomatedInventoryImage = `${solutionsImagePath}/Automated_Inventory.png`
const workflowSecurityComplianceImage = `${solutionsImagePath}/Security_Compliance.png`
const rackVideo = `${solutionsImagePath}/server_rack.webm`

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

function HeroNetworkLines3D() {
  const nodeRows = [
    /* row 0 — far background, dim */ [
      { x: 582, y: 76 }, { x: 714, y: 56 }, { x: 846, y: 70 }, { x: 978, y: 56 }, { x: 1090, y: 72 },
    ],
    /* row 1 */ [
      { x: 548, y: 168 }, { x: 680, y: 150 }, { x: 812, y: 166 }, { x: 944, y: 152 }, { x: 1056, y: 168 },
    ],
    /* row 2 — mid */ [
      { x: 514, y: 265 }, { x: 646, y: 248 }, { x: 778, y: 263 }, { x: 910, y: 250 }, { x: 1022, y: 265 },
    ],
    /* row 3 */ [
      { x: 578, y: 365 }, { x: 712, y: 350 }, { x: 846, y: 363 }, { x: 980, y: 350 },
    ],
    /* row 4 — near foreground, bright */ [
      { x: 644, y: 468 }, { x: 780, y: 453 }, { x: 916, y: 466 },
    ],
  ]

  const nodeVisuals = [
    { r: 2.5,  coreOpacity: 0.55, haloR: 7 },
    { r: 3.0,  coreOpacity: 0.66, haloR: 8.5 },
    { r: 3.4,  coreOpacity: 0.78, haloR: 10 },
    { r: 3.8,  coreOpacity: 0.88, haloR: 11.5 },
    { r: 4.3,  coreOpacity: 0.96, haloR: 13.5 },
  ]

  const connections = [
    /* row-0 horizontals */
    'M 582 76 L 714 56', 'M 714 56 L 846 70', 'M 846 70 L 978 56', 'M 978 56 L 1090 72',
    /* row-1 horizontals */
    'M 548 168 L 680 150', 'M 680 150 L 812 166', 'M 812 166 L 944 152', 'M 944 152 L 1056 168',
    /* row-2 horizontals */
    'M 514 265 L 646 248', 'M 646 248 L 778 263', 'M 778 263 L 910 250', 'M 910 250 L 1022 265',
    /* row-3 horizontals */
    'M 578 365 L 712 350', 'M 712 350 L 846 363', 'M 846 363 L 980 350',
    /* row-4 horizontals */
    'M 644 468 L 780 453', 'M 780 453 L 916 466',
    /* row-0 → row-1 verticals */
    'M 582 76 L 548 168', 'M 714 56 L 680 150', 'M 846 70 L 812 166', 'M 978 56 L 944 152', 'M 1090 72 L 1056 168',
    /* row-1 → row-2 verticals */
    'M 548 168 L 514 265', 'M 680 150 L 646 248', 'M 812 166 L 778 263', 'M 944 152 L 910 250', 'M 1056 168 L 1022 265',
    /* row-2 → row-3 verticals */
    'M 646 248 L 578 365', 'M 778 263 L 712 350', 'M 910 250 L 846 363', 'M 1022 265 L 980 350',
    /* row-3 → row-4 verticals */
    'M 712 350 L 644 468', 'M 846 363 L 780 453', 'M 980 350 L 916 466',
    /* diagonal cross-links for visual richness */
    'M 714 56 L 812 166', 'M 846 70 L 944 152', 'M 680 150 L 778 263',
    'M 910 250 L 980 350', 'M 712 350 L 780 453',
  ]

  const beams = [
    { path: 'M 582 76 L 714 56 L 846 70 L 812 166 L 778 263 L 712 350 L 644 468', dur: '11s', begin: '0s' },
    { path: 'M 1090 72 L 978 56 L 944 152 L 910 250 L 980 350 L 916 466',          dur: '9.5s', begin: '-3s' },
    { path: 'M 514 265 L 646 248 L 778 263 L 846 363 L 780 453',                    dur: '13s',  begin: '-6s' },
    { path: 'M 1056 168 L 944 152 L 846 70 L 714 56 L 680 150 L 646 248',           dur: '10s',  begin: '-2s' },
    { path: 'M 644 468 L 712 350 L 778 263 L 812 166 L 846 70',                     dur: '12s',  begin: '-8s' },
    { path: 'M 582 76 L 548 168 L 514 265 L 578 365 L 644 468',                     dur: '8.5s', begin: '-5s' },
    { path: 'M 978 56 L 1056 168 L 1022 265 L 980 350',                             dur: '10.5s', begin: '-1s' },
  ]

  return (
    <div className="hero-3d-network" aria-hidden="true">
      <svg
        className="hero-3d-network-svg"
        viewBox="490 44 620 442"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="net3dLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="net3dBeamGlow" x="-100%" y="-100%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="net3dNodeGlow" x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <g filter="url(#net3dLineGlow)">
          {connections.map((d, i) => (
            <path
              key={i}
              d={d}
              className={`net3d-conn net3d-conn-v${(i % 5) + 1}`}
            />
          ))}
        </g>

        {/* Traveling beam packets */}
        {beams.map((b, i) => (
          <circle
            key={i}
            r={i < 4 ? 2.8 : 2.2}
            className={`net3d-packet net3d-packet-${i + 1}`}
            filter="url(#net3dBeamGlow)"
          >
            <animateMotion dur={b.dur} begin={b.begin} repeatCount="indefinite" path={b.path} />
          </circle>
        ))}

        {/* Network nodes — depth-graded size & brightness */}
        {nodeRows.map((row, rowIndex) => {
          const vis = nodeVisuals[rowIndex]
          return row.map((n, ni) => (
            <g key={`${rowIndex}-${ni}`} filter="url(#net3dNodeGlow)">
              <circle
                cx={n.x} cy={n.y} r={vis.haloR}
                fill={`rgba(19,245,255,${(vis.coreOpacity * 0.14).toFixed(3)})`}
                className={`net3d-halo net3d-halo-r${rowIndex}`}
              />
              <circle
                cx={n.x} cy={n.y} r={vis.r}
                fill={`rgba(19,245,255,${vis.coreOpacity})`}
                className={`net3d-node net3d-node-r${rowIndex}`}
              />
            </g>
          ))
        })}
      </svg>
    </div>
  )
}

function HeroNetworkBackdrop() {
  const links = [
    'M 70 470 C 220 350, 360 400, 500 285 C 650 165, 790 220, 930 120',
    'M 110 560 C 260 450, 410 500, 560 365 C 690 250, 790 345, 930 260',
    'M 150 330 C 320 240, 440 315, 590 210 C 720 118, 850 170, 965 92',
    'M 280 590 C 420 490, 560 545, 700 430 C 810 340, 900 382, 980 310',
  ]

  return (
    <div className="hero-network-backdrop hero-network-backdrop-clean" aria-hidden="true">
      <svg
        className="hero-network-backdrop-svg"
        viewBox="0 0 1000 620"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroBackdropLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(19, 245, 255, 0)" />
            <stop offset="35%" stopColor="rgba(19, 245, 255, 0.16)" />
            <stop offset="52%" stopColor="rgba(125, 211, 252, 0.48)" />
            <stop offset="72%" stopColor="rgba(19, 245, 255, 0.14)" />
            <stop offset="100%" stopColor="rgba(19, 245, 255, 0)" />
          </linearGradient>

          <filter id="heroBackdropGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {links.map((path, index) => (
          <path
            key={path}
            className={`hero-network-backdrop-link hero-network-backdrop-link-${index + 1}`}
            d={path}
          />
        ))}

        <circle className="hero-network-backdrop-packet packet-one" r="3.2">
          <animateMotion dur="10s" repeatCount="indefinite" path={links[0]} />
        </circle>

        <circle className="hero-network-backdrop-packet packet-two" r="2.8">
          <animateMotion dur="12s" repeatCount="indefinite" path={links[1]} />
        </circle>

        <circle className="hero-network-backdrop-packet packet-three" r="2.8">
          <animateMotion dur="14s" repeatCount="indefinite" path={links[2]} />
        </circle>
      </svg>

      <div className="hero-network-backdrop-plane" />
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
  return (
    <main className="solutions-page">
      <section className="solutions-hero">
        <div className="hero-bg-cinema" aria-hidden="true">
          <div
            className="hero-bg-image hero-bg-image--animated hero-bg-image-hd"
            style={{ backgroundImage: `url(${bgImage})` }}
          />

          <div className="hero-bg-cinema-glow" />
          <div className="hero-bg-cinema-sweep" />
          <div className="hero-bg-cinema-depth" />
        </div>

        <HeroNetworkLines3D />

        <HeroNetworkBackdrop />

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
