import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Check,
  Clock,
  Crosshair,
  Database,
  DollarSign,
  Rocket,
  User,
  X,
  Zap,
} from 'lucide-react'
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
  const lastProgressRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = document.getElementById(sectionId)
        if (!el) return

        const total = Math.max(1, el.offsetHeight - window.innerHeight)
        const scrolled = Math.max(0, -el.getBoundingClientRect().top)
        const nextProgress = Math.min(1, Math.max(0, scrolled / total))
        if (Math.abs(nextProgress - lastProgressRef.current) > 0.0025) {
          lastProgressRef.current = nextProgress
          setProgress(nextProgress)
        }
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
  const frameIndexRef = useRef<[number, number][]>([])
  const frameBufferRef = useRef<ArrayBuffer | null>(null)
  const bitmapCacheRef = useRef<Map<number, ImageBitmap>>(new Map())
  const inflightFrameRef = useRef<Map<number, Promise<ImageBitmap | null>>>(new Map())
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const cacheLimit = 18

  const [ready, setReady] = useState(false)
  const [loadPct, setLoadPct] = useState(0)

  const trimCache = useCallback((protectedIndexes: number[]) => {
    const cache = bitmapCacheRef.current
    if (cache.size <= cacheLimit) return

    const protectedSet = new Set(protectedIndexes)
    for (const [key, bitmap] of cache) {
      if (cache.size <= cacheLimit) break
      if (protectedSet.has(key)) continue
      bitmap.close()
      cache.delete(key)
    }
  }, [])

  const loadFrameBitmap = useCallback(
    async (idx: number) => {
      const cache = bitmapCacheRef.current
      if (cache.has(idx)) return cache.get(idx) ?? null

      const inflight = inflightFrameRef.current.get(idx)
      if (inflight) return inflight

      const frameIndex = frameIndexRef.current[idx]
      const frameBuffer = frameBufferRef.current
      if (!frameIndex || !frameBuffer) return null

      const task = (async () => {
        try {
          const [offset, length] = frameIndex
          const blob = new Blob([frameBuffer.slice(offset, offset + length)], {
            type: 'image/jpeg',
          })
          const bitmap = await createImageBitmap(blob)
          cache.set(idx, bitmap)
          trimCache([idx, idx - 1, idx + 1, idx - 2, idx + 2])
          return bitmap
        } catch {
          return null
        } finally {
          inflightFrameRef.current.delete(idx)
        }
      })()

      inflightFrameRef.current.set(idx, task)
      return task
    },
    [trimCache],
  )

  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current
      const img = bitmapCacheRef.current.get(idx)
      if (!canvas || !img) return

      const ctx =
        contextRef.current ?? canvas.getContext('2d', { alpha: false })
      if (!ctx) return
      contextRef.current = ctx

      const cw = canvas.width
      const ch = canvas.height
      const iw = img.width
      const ih = img.height

      const isMobilePortrait = window.innerWidth <= 640 && window.innerHeight > window.innerWidth
      const coverScale = Math.max(cw / iw, ch / ih)
      const isWideDesktop = window.innerWidth >= 1280
      const heroScale =
        folder === 'RackTrack_Home' && isWideDesktop
          ? coverScale * 0.985
          : folder === 'RackTrack_Home' && isMobilePortrait
            ? Math.max(cw / iw, ch / ih * 0.9)
            : coverScale

      const shiftX =
        folder === 'RackTrack_Home'
          ? isMobilePortrait
            ? cw * -0.055
            : isWideDesktop
              ? cw * -0.018
              : 0
          : 0
      const shiftY =
        folder === 'RackTrack_Home' && isWideDesktop ? ch * 0.01 : 0

      const x = (cw - iw * heroScale) / 2 + shiftX
      const y = (ch - ih * heroScale) / 2 + shiftY

      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, x, y, iw * heroScale, ih * heroScale)
    },
    [canvasRef, folder],
  )

  const primeNearbyFrames = useCallback(
    (centerIndex: number) => {
      ;[centerIndex - 2, centerIndex - 1, centerIndex + 1, centerIndex + 2].forEach((idx) => {
        if (idx >= 0 && idx < totalFrames) {
          void loadFrameBitmap(idx)
        }
      })
    },
    [loadFrameBitmap, totalFrames],
  )

  const ensureFrameReady = useCallback(
    async (idx: number) => {
      const bitmap = await loadFrameBitmap(idx)
      if (!bitmap) return

      if (currentFrameRef.current === idx) {
        drawFrame(idx)
      }

      primeNearbyFrames(idx)
    },
    [drawFrame, loadFrameBitmap, primeNearbyFrames],
  )

  useEffect(() => {
    let active = true

    async function loadFrames() {
      try {
        const indexRes = await fetch(`/${folder}_index.json`)
        const index: [number, number][] = await indexRes.json()
        if (!active) return
        frameIndexRef.current = index

        setLoadPct(24)

        const binRes = await fetch(`/${folder}_data.bin`)
        const buffer = await binRes.arrayBuffer()
        if (!active) return
        frameBufferRef.current = buffer

        setLoadPct(62)
        currentFrameRef.current = 0
        await ensureFrameReady(0)
        if (!active) return

        setLoadPct(100)
        setReady(true)
      } catch (error) {
        console.error(`${folder} frame loading failed`, error)
      }
    }

    loadFrames()

    return () => {
      active = false
      inflightFrameRef.current.clear()
      bitmapCacheRef.current.forEach((bitmap) => bitmap.close())
      bitmapCacheRef.current.clear()
      frameBufferRef.current = null
      frameIndexRef.current = []
    }
  }, [ensureFrameReady, folder])

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const isMobile = window.innerWidth <= 640
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25)

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

      const frameCount = Math.max(1, frameIndexRef.current.length || totalFrames)
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const delta = target - current
      const next = Math.abs(delta) > 0.001 ? current + delta * 0.22 : target

      currentProgressRef.current = next

      const frameIndex = Math.min(
        frameCount - 1,
        Math.round(next * (frameCount - 1)),
      )

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        if (bitmapCacheRef.current.has(frameIndex)) {
          drawFrame(frameIndex)
          primeNearbyFrames(frameIndex)
        } else {
          void ensureFrameReady(frameIndex)
        }
      }

      if (Math.abs(delta) > 0.001) {
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
  }, [drawFrame, ensureFrameReady, primeNearbyFrames, ready, totalFrames, trackRef])

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

const OLD_WAY_ITEMS = [
  {
    title: 'Hours or Days',
    text: 'to find a single port',
    icon: Clock,
  },
  {
    title: 'High Manual Effort',
    text: 'more technicians, more human hours',
    icon: User,
  },
  {
    title: 'More Errors',
    text: 'inaccurate or incomplete data',
    icon: AlertTriangle,
  },
  {
    title: 'Higher Costs',
    text: 'wasted time, resources, and operational cost',
    icon: DollarSign,
  },
]

const RACKTRACK_WAY_ITEMS = [
  {
    title: 'Seconds to Find',
    text: 'any port in any rack',
    icon: Zap,
  },
  {
    title: 'Accurate Detection',
    text: 'AI identifies ports, devices, and connections',
    icon: Crosshair,
  },
  {
    title: 'Complete Inventory',
    text: 'structured, accurate, and up-to-date data',
    icon: Database,
  },
  {
    title: 'Lower Costs',
    text: 'save time and reduce operational expense',
    icon: DollarSign,
  },
]

const COMPARISON_METRICS = [
  {
    value: '10x Faster',
    text: 'Find ports in seconds, not hours',
    icon: Clock,
  },
  {
    value: '99%+ Accuracy',
    text: 'AI-powered detection you can trust',
    icon: Crosshair,
  },
  {
    value: '100% Visibility',
    text: 'Every rack. Every port. Every connection.',
    icon: Database,
  },
  {
    value: 'Lower TCO',
    text: 'Reduce costs and improve efficiency',
    icon: DollarSign,
  },
]

function NetworkTopologyImageSection() {
  return (
    <section className="home-network-image-section">
      <h2 className="home-network-heading">Turn Physical <span className="home-network-heading-accent">Infrastructure Into Live Intelligence</span></h2>
      <div className="home-network-gif-stage">
        <img
          src="/Images/network-connectivity.gif"
          alt="Animated rack connectivity visualization"
          className="home-network-gif"
          loading="lazy"
        />
        <div className="home-network-gif-text-mask" aria-hidden="true" />
      </div>
    </section>
  )
}

function ScanReportSection() {
  const progress = useSectionProgress('scan-report')
  const introProgress = Math.max(0, Math.min(1, progress / 0.22))
  const scanRevealProgress = Math.max(0, Math.min(1, (progress - 0.24) / 0.08))
  const scanProgress = Math.max(0, Math.min(1, (progress - 0.26) / 0.48))
  const reportProgress = Math.max(0, Math.min(1, (progress - 0.78) / 0.18))
  const activeIndex = Math.min(
    SCAN_FLOW_ITEMS.length - 1,
    Math.floor(scanProgress * SCAN_FLOW_ITEMS.length),
  )

  const renderFlowItem = (
    item: { label: string; value: string; color: string },
    index: number,
    side: 'left' | 'right',
  ) => {
    const visible = scanProgress > 0.08 + index * 0.12

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
            opacity: Math.max(0, 1 - introProgress),
            transform: `translate3d(-50%, ${-introProgress * 92}px, 0) scale(${
              1 - introProgress * 0.04
            })`,
          }}
        >
          <span className="home-eyebrow">How It Works</span>
          <h2>
            Components become
            <br />
            <em>reports.</em>
          </h2>
        </div>

        <div
          className="home-scan-flow home-scan-flow-left"
          style={{
            opacity: scanRevealProgress,
            transform: `translate3d(0, ${24 - scanRevealProgress * 24}px, 0)`,
          }}
        >
          {SCAN_FLOW_ITEMS.slice(0, 3).map((item, index) =>
            renderFlowItem(item, index, 'left'),
          )}
        </div>

        <div
          className="home-scan-flow home-scan-flow-right"
          style={{
            opacity: scanRevealProgress,
            transform: `translate3d(0, ${24 - scanRevealProgress * 24}px, 0)`,
          }}
        >
          {SCAN_FLOW_ITEMS.slice(3).map((item, index) =>
            renderFlowItem(item, index + 3, 'right'),
          )}
        </div>

        <div
          className="home-scan-core"
          aria-hidden="true"
          style={{
            opacity: scanRevealProgress,
            transform: `scale(${0.92 + scanRevealProgress * 0.08})`,
          }}
        >
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

function RackTrackComparisonSection() {
  const progress = useSectionProgress('racktrack-comparison')
  const headerProgress = Math.max(0, Math.min(1, (progress + 0.08) / 0.16))
  const panelProgress = Math.max(0, Math.min(1, (progress + 0.04) / 0.2))
  const detailProgress = Math.max(0, Math.min(1, (progress - 0.18) / 0.34))
  const metricProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.22))

  return (
    <section id="racktrack-comparison" className="home-comparison-section">
      <div className="home-comparison-sticky">
        <div className="home-comparison-bg" />

        <div
          className="home-comparison-header"
          style={{
            opacity: headerProgress,
            transform: `translate3d(-50%, ${28 - headerProgress * 28}px, 0)`,
          }}
        >
          <span className="home-eyebrow">Port-Level Intelligence</span>
          <h2>From rack scan to port-level intelligence in minutes.</h2>
        </div>

        <div
          className="home-comparison-board"
          style={{
            opacity: panelProgress,
            transform: `translate3d(-50%, ${54 - panelProgress * 54}px, 0) scale(${
              0.96 + panelProgress * 0.04
            })`,
          }}
        >
          <article className="home-comparison-panel home-comparison-panel-old">
            <div className="home-comparison-title">
              <span className="home-comparison-mark">
                <X size={34} strokeWidth={2.4} />
              </span>
              <div>
                <h3>Without RackTrack</h3>
                <p>Manual. Slow. Error-prone.</p>
              </div>
            </div>

            <div className="home-comparison-old-grid">
              <div className="home-comparison-list">
                {OLD_WAY_ITEMS.map((item, index) => {
                  const Icon = item.icon
                  const visible = detailProgress > index * 0.14

                  return (
                    <div
                      className={`home-comparison-row ${visible ? 'is-visible' : ''}`}
                      key={item.title}
                    >
                      <span>
                        <Icon size={24} strokeWidth={2.2} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="home-comparison-old-visual" aria-hidden="true">
                <img src="/solutions page images/Before_scan.png" alt="" />
                <span>Manual trace</span>
              </div>
            </div>

            <div className="home-comparison-warning">
              <BarChart3 size={38} strokeWidth={2.2} />
              <p>
                Finding a port the old way?
                <strong>Slow. Costly. Frustrating.</strong>
              </p>
            </div>
          </article>

          <div className="home-comparison-vs">VS</div>

          <article className="home-comparison-panel home-comparison-panel-new">
            <div className="home-comparison-title">
              <span className="home-comparison-mark">
                <Check size={34} strokeWidth={2.4} />
              </span>
              <div>
                <h3>With RackTrack</h3>
                <p>Automated. Fast. Accurate.</p>
              </div>
            </div>

            <div className="home-comparison-new-grid">
              <div className="home-comparison-list">
                {RACKTRACK_WAY_ITEMS.map((item, index) => {
                  const Icon = item.icon
                  const visible = detailProgress > index * 0.14

                  return (
                    <div
                      className={`home-comparison-row ${visible ? 'is-visible' : ''}`}
                      key={item.title}
                    >
                      <span>
                        <Icon size={24} strokeWidth={2.2} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="home-comparison-product">
                <div className="home-product-top">
                  <strong>RackTrack</strong>
                  <span>AI Scan Complete</span>
                </div>
                <div className="home-product-frame">
                  <img
                    src="/solutions page images/Server_rack-scan.png"
                    alt="RackTrack AI rack scan interface"
                  />
                  <div className="home-product-scan-box" />
                  <div className="home-product-card">
                    <small>Port Identified</small>
                    <strong>U42 - P17</strong>
                    <span>Core-SW-01</span>
                    <span>SFP+</span>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <a href="/contact-us" className="home-comparison-cta">
              <Rocket size={38} strokeWidth={2.2} />
              <span>
                Scan. Search. Find.
                <strong>Any Rack. Any Port. Instantly.</strong>
              </span>
            </a>
          </article>
        </div>

        <div
          className="home-comparison-metrics"
          style={{
            opacity: metricProgress,
            transform: `translate3d(-50%, ${38 - metricProgress * 38}px, 0)`,
          }}
        >
          {COMPARISON_METRICS.map((metric, index) => {
            const Icon = metric.icon

            return (
              <article
                className="home-comparison-metric"
                key={metric.value}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <Icon size={34} strokeWidth={2.1} />
                <div>
                  <strong>{metric.value}</strong>
                  <span>{metric.text}</span>
                </div>
              </article>
            )
          })}
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
      </ScrollCanvasSection>

      <ScanReportSection />

      <NetworkTopologyImageSection />

      <RackTrackComparisonSection />
    </main>
  )
}
