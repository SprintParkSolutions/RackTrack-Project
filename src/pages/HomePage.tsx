import { useCallback, useEffect, useRef, useState } from 'react'
import './HomePage.css'

const HERO_FRAMES = 568
const SERVER_FRAMES = 685

type FrameScrubberProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  trackRef: React.RefObject<HTMLElement | null>
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

        const total = el.offsetHeight - window.innerHeight
        const scrolled = Math.max(0, -el.getBoundingClientRect().top)
        const nextProgress = Math.min(1, Math.max(0, scrolled / total))

        setProgress(nextProgress)
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
      const sections = ['hero']
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      const shouldHide = sections.some((section) => {
        const top = section.offsetTop
        const bottom = top + section.offsetHeight
        const scrollBuffer = 8

        return (
          window.scrollY >= top + scrollBuffer &&
          window.scrollY < bottom
        )
      })

      const navbar = document.querySelector('.navbar')

      if (navbar) {
        navbar.classList.toggle('navbar-hidden', shouldHide)
      }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true })
    updateNavbar()

    return () => {
      window.removeEventListener('scroll', updateNavbar)
      const navbar = document.querySelector('.navbar')
      navbar?.classList.remove('navbar-hidden')
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

    async function loadFrames() {
      try {
        const indexRes = await fetch(`/${folder}_index.json`)
        const index: [number, number][] = await indexRes.json()

        const binRes = await fetch(`/${folder}_data.bin`)
        const buffer = await binRes.arrayBuffer()

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

            drawFrame(0)
            setReady(true)
          }

          if (i % 12 === 0 || i === index.length - 1) {
            setLoadPct(Math.round(((i + 1) / index.length) * 100))
          }
        }

        for (let i = 1; i < images.length; i++) {
          if (!active) return

          try {
            await images[i].decode()
          } catch {
            // skip bad frame
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

      const track = trackRef.current
      if (!track) return

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
  children?: React.ReactNode
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

      <h1>
        One sweep.
        <br />
        <em>Full audit.</em>
      </h1>

      <p>
        Record one rack video. RackTrack detects devices, switches, ports, patch
        panels, cables, and connection state.
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
  return (
    <section className="home-features-section">
      <div className="home-section-heading">
        <span className="home-eyebrow">Detection Capabilities</span>
        <h2>
          AI that sees
          <br />
          <em>every component.</em>
        </h2>
      </div>

      <div className="home-feature-grid">
        {FEATURES.map((feature, index) => (
          <article className="home-feature-card" key={feature.title}>
            <img src={feature.img} alt={feature.title} />

            <div>
              <span>0{index + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const PIPELINE = [
  {
    num: '01',
    title: 'Server',
    sub: 'Identify rack units, device types, and server configurations.',
  },
  {
    num: '02',
    title: 'Patch Panel',
    sub: 'Map patch panel ports, labels, and cable assignments.',
  },
  {
    num: '03',
    title: 'Switch',
    sub: 'Detect vendor, model, port layout, and LED activity.',
  },
  {
    num: '04',
    title: 'Connectivity',
    sub: 'Trace every cable and build a complete connection map.',
  },
]

function PipelineChapters() {
  const progress = useSectionProgress('server')
  const index = Math.min(
    PIPELINE.length - 1,
    Math.floor(progress * PIPELINE.length),
  )

  const item = PIPELINE[index]

  return (
    <div className="home-pipeline">
      <div className="home-pipeline-num">{item.num}</div>
      <h2>{item.title}</h2>
      <p>{item.sub}</p>

      <div className="home-pipeline-dots">
        {PIPELINE.map((_, i) => (
          <span key={i} className={i === index ? 'active' : ''} />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  useHideNavbarWhileFramesScroll()

  return (
    <main className="home-page">
      <ScrollCanvasSection
        id="hero"
        folder="hero"
        totalFrames={HERO_FRAMES}
        scrollHeight={950}
      >
        <HeroText />
        <RackLabels />
        <div className="home-scroll-hint">Scroll</div>
      </ScrollCanvasSection>

      <FeatureSection />

      <ScrollCanvasSection
        id="server"
        folder="server"
        totalFrames={SERVER_FRAMES}
        scrollHeight={900}
      >
        <PipelineChapters />
      </ScrollCanvasSection>

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
