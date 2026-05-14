import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import './HomePage.css'

const HERO_FRAMES = 568

type FrameScrubberProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  trackRef: RefObject<HTMLElement | null>
  totalFrames: number
  folder: string
}

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function useSectionProgress(sectionId: string) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = document.getElementById(sectionId)
        if (!el) return

        const total = Math.max(1, el.offsetHeight - window.innerHeight)
        const scrolled = Math.max(0, -el.getBoundingClientRect().top)
        setProgress(Math.min(1, Math.max(0, scrolled / total)))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [sectionId])

  return progress
}

function useHideNavbarWhileFramesScroll() {
  useEffect(() => {
    const updateNavbar = () => {
      const hero = document.getElementById('hero')
      if (!hero) return

      const top = hero.offsetTop
      const bottom = top + hero.offsetHeight
      const shouldHide = window.scrollY >= top + 8 && window.scrollY < bottom

      const navbar = document.querySelector('.navbar')
      navbar?.classList.toggle('navbar-hidden', shouldHide)
    }

    window.addEventListener('scroll', updateNavbar, { passive: true })
    updateNavbar()

    return () => {
      window.removeEventListener('scroll', updateNavbar)
      document.querySelector('.navbar')?.classList.remove('navbar-hidden')
    }
  }, [])
}

function useFrameScrubber({
  canvasRef,
  trackRef,
  totalFrames,
  folder,
}: FrameScrubberProps) {
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [ready, setReady] = useState(false)
  const [loadPct, setLoadPct] = useState(0)

  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current
      const img = imagesRef.current[idx]
      if (!canvas || !img) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      const scale = Math.max(cw / iw, ch / ih)
      const x = (cw - iw * scale) / 2
      const y = (ch - ih * scale) / 2

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, x, y, iw * scale, ih * scale)
    },
    [canvasRef],
  )

  useEffect(() => {
    let active = true

    const wait = (ms: number) =>
      new Promise((resolve) => window.setTimeout(resolve, ms))

    async function loadFrames() {
      try {
        const indexRes = await fetch(`/${folder}_index.json`)
        const index: [number, number][] = await indexRes.json()
        if (!active) return

        setLoadPct(18)

        const binRes = await fetch(`/${folder}_data.bin`)
        const buffer = await binRes.arrayBuffer()
        if (!active) return

        setLoadPct(52)

        const images: HTMLImageElement[] = []
        imagesRef.current = images

        for (let i = 0; i < index.length; i++) {
          const [offset, length] = index[i]

          const blob = new Blob([buffer.slice(offset, offset + length)], {
            type: 'image/jpeg',
          })

          const img = new Image()
          img.src = URL.createObjectURL(blob)
          images.push(img)

          if (i === 0) {
            await img.decode()
            if (!active) return

            setLoadPct(100)
            drawFrame(0)
            await wait(140)

            if (!active) return
            setReady(true)
          }

          if (i % 8 === 0 || i === index.length - 1) {
            const frameProgress = Math.round(((i + 1) / index.length) * 38)
            setLoadPct(Math.min(98, 52 + frameProgress))
          }
        }

        for (let i = 1; i < images.length; i++) {
          if (!active) return
          try {
            await images[i].decode()
          } catch {
            // skip damaged frame
          }
        }
      } catch (error) {
        console.error(`${folder} frame loading failed`, error)
      }
    }

    loadFrames()

    return () => {
      active = false
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.src))
    }
  }, [drawFrame, folder])

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      drawFrame(currentFrameRef.current)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [canvasRef, drawFrame])

  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)

  useEffect(() => {
    const animateFrame = () => {
      rafRef.current = null

      const frameCount = Math.max(1, imagesRef.current.length || totalFrames)
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const delta = target - current
      const next = Math.abs(delta) > 0.0005 ? current + delta * 0.16 : target

      currentProgressRef.current = next

      const frameIndex = Math.min(
        frameCount - 1,
        Math.round(next * (frameCount - 1)),
      )

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }

      if (Math.abs(delta) > 0.0005) {
        rafRef.current = requestAnimationFrame(animateFrame)
      }
    }

    const onScroll = () => {
      if (!ready) return

      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const trackHeight = Math.max(1, track.offsetHeight - window.innerHeight)
      const scrolled = Math.max(0, -rect.top)

      targetProgressRef.current = Math.min(1, scrolled / trackHeight)

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateFrame)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame, ready, totalFrames, trackRef])

  return { ready, loadPct }
}

type ScrollCanvasSectionProps = {
  id: string
  folder: string
  totalFrames: number
  scrollHeight?: number
  children?: ReactNode
}

function ScrollCanvasSection({
  id,
  folder,
  totalFrames,
  scrollHeight = 900,
  children,
}: ScrollCanvasSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const trackRef = useRef<HTMLElement | null>(null)

  const { ready, loadPct } = useFrameScrubber({
    canvasRef,
    trackRef,
    totalFrames,
    folder,
  })

  return (
    <section
      id={id}
      ref={trackRef}
      className="home-frame-section"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="home-sticky-panel">
        <canvas ref={canvasRef} className="home-frame-canvas" />
        <div className="home-vignette" />

        {!ready && (
          <div className="home-loading-overlay">
            <div className="home-loading-bar-track">
              <div
                className="home-loading-bar-fill"
                style={{ width: `${loadPct}%` }}
              />
            </div>
            <span>{loadPct}%</span>
          </div>
        )}

        {children}
      </div>
    </section>
  )
}

const RACK_UNITS = [
  { name: 'GPU Cluster', u: '1U', color: '#f472b6' },
  { name: 'Compute Blades', u: '2U', color: '#00d2ff' },
  { name: 'Cards', u: '3U', color: '#38bdf8' },
  { name: 'Core Switch', u: '4U', color: '#7dd3fc' },
  { name: 'Patch Panel', u: '5U', color: '#c084fc' },
  { name: 'Firewall', u: '6U', color: '#f87171' },
  { name: 'Load Balancer', u: '7U', color: '#fbbf24' },
  { name: 'Server', u: '8U', color: '#00d2ff' },
  { name: 'Storage Array', u: '9U', color: '#818cf8' },
  { name: 'Controller', u: '10U', color: '#a78bfa' },
  { name: 'Modem', u: '11U', color: '#fb923c' },
  { name: 'PDU', u: '12U', color: '#34d399' },
  { name: 'KVM Switch', u: '13U', color: '#38bdf8' },
  { name: 'PDU', u: '14U', color: '#34d399' },
]

const RU_START = 0.5
const RU_END = 0.96

function RackLabels() {
  const progress = useSectionProgress('hero')
  const half = Math.ceil(RACK_UNITS.length / 2)
  const leftItems = RACK_UNITS.slice(0, half)
  const rightItems = RACK_UNITS.slice(half)
  const range = RU_END - RU_START

  const renderItem = (
    item: { name: string; u: string; color: string },
    index: number,
    total: number,
    side: 'left' | 'right',
  ) => {
    const start = RU_START + (index / Math.max(total - 1, 1)) * range
    const visible = progress >= start

    return (
      <div
        key={`${side}-${item.name}-${item.u}`}
        className={`home-ru-item home-ru-${side} ${
          visible ? 'home-ru-visible' : ''
        }`}
        style={{
          borderColor: visible ? `${item.color}aa` : 'rgba(0,210,255,.14)',
          boxShadow: visible
            ? `0 0 18px ${item.color}44, 0 8px 24px rgba(0,0,0,.38)`
            : '0 8px 24px rgba(0,0,0,.28)',
          transitionDelay: `${index * 0.035}s`,
        }}
      >
        <span className="home-ru-accent" style={{ background: item.color }} />
        <strong style={{ color: item.color }}>{item.u}</strong>
        <span style={{ color: item.color }}>{item.name}</span>
        <i style={{ background: item.color }} />
      </div>
    )
  }

  return (
    <>
      <div className="home-ru-panel home-ru-panel-left">
        {leftItems.map((item, index) =>
          renderItem(item, index, leftItems.length, 'left'),
        )}
      </div>

      <div className="home-ru-panel home-ru-panel-right">
        {rightItems.map((item, index) =>
          renderItem(item, index, rightItems.length, 'right'),
        )}
      </div>
    </>
  )
}

function HeroText() {
  const progress = useSectionProgress('hero')
  const opacity = Math.max(0, 1 - progress / 0.16)

  return (
    <div
      className="home-corner-text"
      style={{
        opacity,
        transform: `translate3d(0, ${-progress * 44}px, 0)`,
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
      }}
    >
      <span className="home-eyebrow">AI-Powered Rack Auditing</span>

      <h1 className="home-hero-title">
        One sweep.
        <br />
        <em>Full audit.</em>
      </h1>

      <p>
        Turn one walkthrough into a clean physical-layer audit.
        <br />
        Track devices, ports, panels, and cable paths instantly.
      </p>

      <a href="/contact-us" className="home-main-btn">
        Request Demo
      </a>
    </div>
  )
}

const FEATURES = [
  {
    img: '/Images/Video_Capture.png',
    title: 'Video Capture',
    text: 'Capture a rack sweep and extract clear frames automatically.',
  },
  {
    img: '/Images/Switch_Recognition.png',
    title: 'Switch Recognition',
    text: 'Identify switch vendor, model, and port layout.',
  },
  {
    img: '/Images/Port_Classification.png',
    title: 'Port Classification',
    text: 'Detect RJ45, SFP, QSFP, fiber, console, and empty ports.',
  },
  {
    img: '/Images/Cable_Mapping.png',
    title: 'Cable Mapping',
    text: 'Trace cables end-to-end and build connectivity visibility.',
  },
  {
    img: '/Images/Audit_Report.png',
    title: 'Audit Report',
    text: 'Generate a structured rack report for operations teams.',
  },
]

function FeatureSection() {
  const { ref: headingRevealRef, visible: headingRevealVisible } =
    useScrollReveal<HTMLDivElement>()
  const progress = useSectionProgress('features')
  const activeIndex = Math.min(
    FEATURES.length - 1,
    Math.floor(progress * FEATURES.length),
  )

  return (
    <section id="features" className="home-features-section">
      <div className="home-features-sticky">
        <div
          ref={headingReveal.ref}
          className={`home-section-heading home-reveal${
            headingReveal.visible ? ' is-visible' : ''
          }`}
        >
          <span className="home-eyebrow">Detection Capabilities</span>
          <h2>
            AI that sees
            <br />
            <em>every component.</em>
          </h2>

          <div className="home-feature-progress">
            <div className="home-feature-progress-dots">
              {FEATURES.map((feature, index) => (
                <span
                  key={feature.title}
                  className={
                    index < activeIndex
                      ? 'is-complete'
                      : index === activeIndex
                        ? 'is-active'
                        : ''
                  }
                />
              ))}
            </div>

            <strong>
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(FEATURES.length).padStart(2, '0')}
            </strong>
          </div>
        </div>

        <div className="home-feature-grid home-feature-grid-stepped">
          {FEATURES.map((feature, index) => (
            <article
              className={`home-feature-card ${
                index < activeIndex
                  ? 'is-complete'
                  : index === activeIndex
                    ? 'is-active'
                    : ''
              }`}
              key={feature.title}
              style={{
                transitionDelay: `${index * 90}ms`,
                ['--feature-progress' as string]: Math.max(
                  0,
                  Math.min(1, progress * FEATURES.length - index),
                ),
              }}
            >
              <img src={feature.img} alt={feature.title} />

              <div>
                <span>0{index + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const NETWORK_STEPS = [
  {
    id: 'patch',
    label: 'UNIT 01 - PATCH PANEL',
    title: 'Patch Panel',
    body: 'Patch panel type, labeling, and occupied ports are resolved into a clean physical record.',
  },
  {
    id: 'switch',
    label: 'UNIT 02 - NETWORK SWITCH',
    title: 'Network Switch',
    body: 'Vendor, model, uplinks, and active port posture become instantly visible for operations teams.',
  },
  {
    id: 'server',
    label: 'UNIT 03 - COMPUTER SERVER',
    title: 'Computer Server',
    body: 'Server identity, rack unit, and interface visibility are captured as structured inventory.',
  },
  {
    id: 'router',
    label: 'UNIT 04 - ROUTER',
    title: 'Router',
    body: 'Critical route devices and uplink paths are placed into one topology-aware operational view.',
  },
  {
    id: 'firewall',
    label: 'UNIT 05 - FIREWALL',
    title: 'Firewall',
    body: 'Security control points and protected paths are highlighted inside the same rack intelligence layer.',
  },
  {
    id: 'storage',
    label: 'UNIT 06 - STORAGE UNIT',
    title: 'Storage Unit',
    body: 'Storage arrays, capacity surfaces, and service dependencies roll into one live physical map.',
  },
]

const AUDIT_PROOF_POINTS = [
  {
    value: '24x7',
    label: 'Visibility',
    text: 'Turn one capture into a live physical-layer record your team can revisit any time.',
  },
  {
    value: '42U',
    label: 'Rack Context',
    text: 'Understand device order, port density, and cabling posture in one visual pass.',
  },
  {
    value: 'AI',
    label: 'Recognition',
    text: 'Map switches, servers, panels, and power gear into one operational workflow.',
  },
]

const AUDIT_PROOF_SIGNALS = [
  'Ports mapped',
  'Uplinks verified',
  'Device order locked',
  'Patch state matched',
]

function AuditDesignSection() {
  const progress = useSectionProgress('audit-design')

  const activeIndex = Math.min(
    NETWORK_STEPS.length - 1,
    Math.floor(progress * NETWORK_STEPS.length),
  )

  const current = NETWORK_STEPS[activeIndex]

  return (
    <section id="audit-design" className="rt-journey-section">
      <div className="rt-journey-sticky">
        <div className="rt-grid-floor" />
        <div className="rt-dark-vignette" />

        <div className={`rt-cinematic-scene scene-${activeIndex}`}>
          <div className="rt-scene-badge">
            <span className="rt-scene-badge-dot" />
            Rack intelligence graph
          </div>

          <div className="rt-scan-pulse rt-scan-pulse-one" />
          <div className="rt-scan-pulse rt-scan-pulse-two" />

          <div className="rt-ghost-fleet" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={`rt-ghost-rack ghost-${index + 1}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>

          <div className="rt-device-row">
            {NETWORK_STEPS.map((item, index) => (
              <article
                key={item.id}
                className={`rt-device ${item.id} ${
                  index === activeIndex ? 'active' : ''
                }`}
              >
                <div className="rt-device-side" />
                <div className="rt-device-face">
                  <div className="rt-device-top" />
                  <strong>{item.title}</strong>

                  <div className="rt-port-grid">
                    {Array.from({ length: item.id === 'patch' ? 72 : 108 }).map(
                      (_, portIndex) => (
                        <i
                          key={portIndex}
                          className={
                            portIndex % 13 === 0
                              ? 'gold'
                              : portIndex % 9 === 0
                                ? 'off'
                                : ''
                          }
                        />
                      ),
                    )}
                  </div>

                  <div className={`rt-device-detail ${item.id}`}>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="rt-device-shadow" />
              </article>
            ))}
          </div>

          <svg className="rt-network-arcs" viewBox="0 0 1300 620">
            <path d="M80 500 C260 150, 470 150, 650 500" />
            <path d="M250 520 C470 70, 780 70, 1030 520" />
            <path d="M450 500 C650 150, 900 150, 1190 500" />
            <path d="M120 560 C420 300, 840 300, 1220 560" />
            <path d="M360 560 C560 360, 760 360, 960 560" />
            <path d="M180 180 C420 20, 760 20, 1100 240" />
            <path d="M180 340 C520 120, 760 120, 1080 360" />
          </svg>

          <div className="rt-scene-hud rt-scene-hud-left">
            <span>Live capture</span>
            <strong>Structured rack focus</strong>
            <p>
              Every highlighted unit moves from visual detection into a
              queryable infrastructure object.
            </p>
          </div>

          <div className="rt-scene-hud rt-scene-hud-right">
            <span>Topology graph</span>
            <strong>Operational context online</strong>
            <p>
              Ports, devices, and rack positions roll into one physical-layer
              intelligence graph.
            </p>
          </div>
        </div>

        <div className="rt-caption">
          <span>{current.label}</span>
          <h2>{current.title}</h2>
          <p>{current.body}</p>
        </div>

        <div className="rt-step-rail">
          {NETWORK_STEPS.map((step, index) => (
            <i key={step.id} className={index === activeIndex ? 'active' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AuditProofSection() {
  const reveal = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={reveal.ref}
      className={`home-proof-section${reveal.visible ? ' is-visible' : ''}`}
    >
      <div className="home-proof-bg-orb home-proof-bg-orb-one" />
      <div className="home-proof-bg-orb home-proof-bg-orb-two" />

      <div className="home-proof-copy">
        <span className="home-eyebrow">Physical Layer Replay</span>
        <h2>
          Review the rack
          <br />
          <em>exactly as it happened.</em>
        </h2>
        <p>
          RackTrack preserves the real cabinet view, then layers intelligence on
          top so infrastructure teams can verify ports, devices, and layout
          decisions without repeating the audit walk.
        </p>

        <div className="home-proof-points">
          {AUDIT_PROOF_POINTS.map((point) => (
            <article key={point.label} className="home-proof-point">
              <strong>{point.value}</strong>
              <h3>{point.label}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="home-proof-stage">
        <div className="home-proof-stage-frame">
          <div className="home-proof-stage-topline">
            <span>RackTrack design</span>
            <i />
            <span>Static intelligence view</span>
          </div>

          <div className="home-proof-display" aria-hidden="true">
            <div className="home-proof-rack">
              <div className="home-proof-rack-header">
                <span />
                <span />
                <span />
              </div>

              <div className="home-proof-rack-body">
                {Array.from({ length: 7 }).map((_, rackIndex) => (
                  <div key={rackIndex} className="home-proof-rack-unit">
                    <b />
                    <div className="home-proof-rack-leds">
                      {Array.from({ length: 10 }).map((_, ledIndex) => (
                        <i
                          key={ledIndex}
                          className={ledIndex % 4 === 0 ? 'is-gold' : ''}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-proof-overlay-card home-proof-overlay-card-top">
              <span>Rack state</span>
              <strong>42U audit panel</strong>
              <p>Devices, ports, and panel layout merged into one clean operator view.</p>
            </div>

            <div className="home-proof-overlay-card home-proof-overlay-card-bottom">
              <span>Signal map</span>
              <div className="home-proof-signal-list">
                {AUDIT_PROOF_SIGNALS.map((signal) => (
                  <i key={signal}>{signal}</i>
                ))}
              </div>
            </div>

            <div className="home-proof-orbit home-proof-orbit-one" />
            <div className="home-proof-orbit home-proof-orbit-two" />
            <div className="home-proof-beam home-proof-beam-left" />
            <div className="home-proof-beam home-proof-beam-right" />
          </div>

          <div className="home-proof-scanline" aria-hidden="true" />
          <div className="home-proof-grid" aria-hidden="true" />

          <div className="home-proof-callout home-proof-callout-left">
            <span>Trace</span>
            <strong>Device position confirmed</strong>
          </div>

          <div className="home-proof-callout home-proof-callout-right">
            <span>Verify</span>
            <strong>Port state aligned with scan</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  useHideNavbarWhileFramesScroll()

  return (
    <main className="home-page">
      <ScrollCanvasSection
        id="hero"
        folder="RackTrack_Home"
        totalFrames={HERO_FRAMES}
        scrollHeight={950}
      >
        <HeroText />
        <RackLabels />
        <div className="home-scroll-hint">Scroll</div>
      </ScrollCanvasSection>

      <FeatureSection />

      <AuditDesignSection />

      <AuditProofSection />

      <section className="home-cta-section">
        <span className="home-eyebrow">Audit Engine Ready</span>

        <h2>
          One video.
          <br />
          <em>Complete inventory.</em>
        </h2>

        <p>Built for IT teams who manage data centers at scale.</p>

        <a href="/contact-us" className="home-main-btn">
          Book Consultation
        </a>
      </section>
    </main>
  )
}
