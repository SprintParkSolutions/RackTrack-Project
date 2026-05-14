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

function HeroIntroText() {
  const progress = useSectionProgress('hero')
  const hideProgress = Math.min(1, progress / 0.12)

  return (
    <section
      className="home-hero-copy"
      style={{
        opacity: 1 - hideProgress,
        transform: `translate3d(0, ${hideProgress * -42}px, 0)`,
        pointerEvents: hideProgress > 0.85 ? 'none' : 'auto',
      }}
    >
      <h1>
        <span className="hero-line hero-line-white">
          Scan Any Rack.
        </span>
        <span className="hero-line hero-line-gradient">
          Find Any Port. 
        </span>
        <span className="hero-line hero-line-gradient">
          Instantly.
        </span>
      </h1>
    </section>
  )
}

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

const SCAN_FLOW_ITEMS = [
  { label: 'Capture', value: 'Video sweep', color: '#00d2ff' },
  { label: 'Identify', value: '14 rack units', color: '#7dd3fc' },
  { label: 'Classify', value: 'Ports + cables', color: '#a78bfa' },
  { label: 'Map', value: 'Connections', color: '#34d399' },
  { label: 'Verify', value: 'Exceptions', color: '#fbbf24' },
  { label: 'Report', value: 'Audit pack', color: '#fb7185' },
]

const REPORT_CARDS = [
  {
    title: 'Rack Inventory',
    value: '14U mapped',
    meta: 'Devices, models, unit positions',
  },
  {
    title: 'Port Report',
    value: '186 ports',
    meta: 'Used, empty, cable state',
  },
  {
    title: 'Cable Audit',
    value: '42 links',
    meta: 'Trace paths and mismatches',
  },
]

function NetworkTopologyImageSection() {
  return (
    <section className="home-network-image-section">
      <div className="home-network-content">
        <span className="home-network-eyebrow">Live Network Visibility</span>

        <h2>
          See how every rack
          <br />
          connects in real time.
        </h2>

        <p>
          RackTrack converts rack scans into a visual network map, helping teams
          understand device relationships, cable paths, and connectivity faster.
        </p>
      </div>

      <div className="home-network-visual">
        <img
          src="/Images/rack-network-topology.png"
          alt="Rack Network Topology"
          className="home-network-image"
          loading="lazy"
        />
        <div className="home-network-image-glow" />
      </div>
    </section>
  )
}

function ScanReportSection() {
  const progress = useSectionProgress('scan-report')
  const reportProgress = Math.max(0, Math.min(1, (progress - 0.68) / 0.28))
  const scanProgress = Math.max(0, Math.min(1, progress / 0.7))
  const activeIndex = Math.min(
    SCAN_FLOW_ITEMS.length - 1,
    Math.floor(scanProgress * SCAN_FLOW_ITEMS.length),
  )

  const renderFlowItem = (
    item: { label: string; value: string; color: string },
    index: number,
    side: 'left' | 'right',
  ) => {
    const visible = progress > 0.08 + index * 0.075

    return (
      <article
        key={`${side}-${item.label}`}
        className={`home-scan-chip home-scan-chip-${side} ${
          visible ? 'is-visible' : ''
        }`}
        style={{
          borderColor: visible ? `${item.color}aa` : 'rgba(0, 210, 255, 0.14)',
          boxShadow: visible
            ? `0 0 24px ${item.color}33, 0 18px 44px rgba(0, 0, 0, 0.34)`
            : '0 14px 34px rgba(0, 0, 0, 0.24)',
          transitionDelay: `${index * 45}ms`,
          ['--scan-color' as string]: item.color,
        }}
      >
        <i />
        <div>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.label}</strong>
          <small>{item.value}</small>
        </div>
      </article>
    )
  }

  return (
    <section id="scan-report" className="home-scan-report-section">
      <div className="home-scan-report-sticky">
        <div className="home-scan-bg" />
        <div className="home-scan-grid-lines" />

        <div
          className="home-scan-intro"
          style={{
            opacity: Math.max(0, 1 - progress / 0.18),
            transform: `translate3d(-50%, ${-progress * 70}px, 0)`,
          }}
        >
          <span className="home-eyebrow">Post Scan Intelligence</span>
          <h2>
            Components become
            <br />
            <em>reports.</em>
          </h2>
        </div>

        <div className="home-scan-flow home-scan-flow-left">
          {SCAN_FLOW_ITEMS.slice(0, 3).map((item, index) =>
            renderFlowItem(item, index, 'left'),
          )}
        </div>

        <div className="home-scan-flow home-scan-flow-right">
          {SCAN_FLOW_ITEMS.slice(3).map((item, index) =>
            renderFlowItem(item, index + 3, 'right'),
          )}
        </div>

        <div className="home-scan-core" aria-hidden="true">
          <div className="home-scan-frame">
            <span style={{ height: `${Math.max(12, scanProgress * 100)}%` }} />
            <div className="home-scan-beam" />
            <strong>{SCAN_FLOW_ITEMS[activeIndex].label}</strong>
            <small>{Math.round(scanProgress * 100)}%</small>
          </div>
        </div>

        <div
          className="home-report-stage"
          style={{
            opacity: reportProgress,
            transform: `translate3d(-50%, ${42 - reportProgress * 42}px, 0) scale(${
              0.96 + reportProgress * 0.04
            })`,
            pointerEvents: reportProgress > 0.9 ? 'auto' : 'none',
          }}
        >
          <div className="home-report-header">
            <span className="home-eyebrow">Final Reports</span>
            <h3>Audit package ready</h3>
            <p>
              Inventory, port classification, cable mapping, and exceptions in
              one export-ready view.
            </p>
          </div>

          <div className="home-report-grid">
            {REPORT_CARDS.map((report, index) => (
              <article
                className="home-report-card"
                key={report.title}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span>0{index + 1}</span>
                <strong>{report.title}</strong>
                <h4>{report.value}</h4>
                <p>{report.meta}</p>
              </article>
            ))}
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
        <HeroIntroText />
        <RackLabels />
        <div className="home-scroll-hint">Scroll</div>
      </ScrollCanvasSection>

      <NetworkTopologyImageSection />

      <ScanReportSection />

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
