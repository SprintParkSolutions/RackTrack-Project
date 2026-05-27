import React, { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Database,
  FileClock,
  ScanSearch,
  Waypoints,
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
    title: 'Perceive',
    patent: 'patent-pending visual rack intelligence',
    description:
      'Visual rack capture identifies every device, port, label, and cable in the rack environment. The infrastructure becomes machine-readable.',
  },
  {
    num: '02',
    title: 'Reconcile',
    patent: 'patent-pending cable-to-port mapping',
    description:
      'Visual observations are validated against live switch data - CDP, LLDP, and neighbor information - to produce a single verified state.',
  },
  {
    num: '03',
    title: 'Cognize',
    patent: 'patent-pending infrastructure reconciliation methods',
    description:
      'Every change, drift, and dependency is reconciled across scans - surfaced to the operational systems that need it, when they need it.',
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
    desc: 'Each inventory record is tied back to the physical rack signal or live network signal that produced it.',
    tag: 'SOURCE-LINKED',
    image: '/WhyRackTrack/Source_Linked.webp',
    icon: ScanSearch,
    imageAlt: 'Physical evidence and inventory records connected to source devices',
  },
  {
    heading: 'Every device identification verified against the live network',
    desc: 'Physical rack observations are cross-checked against live identity before a device is treated as verified.',
    tag: 'NETWORK-VERIFIED',
    image: '/WhyRackTrack/Network_Verified.webp',
    icon: Waypoints,
    imageAlt: 'Network topology and rack connectivity verification view',
  },
  {
    heading: 'Every infrastructure change timestamped',
    desc: 'State changes, arrivals, moves, and departures are captured with timing that operations and compliance teams can defend.',
    tag: 'TIMESTAMPED',
    image: '/WhyRackTrack/Timestamped.webp',
    icon: FileClock,
    imageAlt: 'Timeline and CMDB drift visualization for timestamped changes',
  },
  {
    heading: 'Audit-ready data your compliance team can defend',
    desc: 'Built for evidence requests, audit follow-up, security reviews, and operational decisions that need a trusted chain of proof.',
    tag: 'AUDIT-READY',
    image: '/WhyRackTrack/Audit_Ready.webp',
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

/* Canvas Illustrations */

const RackIllustration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvasRef.current!
    const ctx = cv.getContext('2d')!
    cv.width = 220; cv.height = 240
    let t = 0, raf: number

    const S = 'rgba(79,142,247,'

    const rr = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke: string, sw: number) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fillStyle = fill; ctx.fill()
      ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke()
    }

    const draw = () => {
      t += 0.007
      ctx.clearRect(0, 0, 220, 240)
      const fy = Math.sin(t) * 2.5

      const lx = 8, cx2 = 78, rx2 = 148
      const top = 18 + fy, bot = top + 172
      const skX = 42, skY = -20

      ctx.beginPath()
      ctx.moveTo(rx2, top); ctx.lineTo(rx2 + skX, top + skY)
      ctx.lineTo(rx2 + skX, bot + skY); ctx.lineTo(rx2, bot)
      ctx.closePath()
      ctx.fillStyle = 'rgba(5,12,48,0.82)'; ctx.fill()
      ctx.strokeStyle = `${S}0.45)`; ctx.lineWidth = 1; ctx.stroke()
      for (let i = 1; i < 12; i++) {
        const ly = top + i * (172 / 12)
        ctx.beginPath(); ctx.moveTo(rx2, ly); ctx.lineTo(rx2 + skX, ly + skY)
        ctx.strokeStyle = `${S}0.12)`; ctx.lineWidth = 0.5; ctx.stroke()
      }
      for (let i = 0; i < 5; i++) {
        rr(rx2 + 4, top + 20 + i * 28 + 2, skX - 8, 10, 2, 'rgba(8,20,65,0.6)', `${S}0.2)`, 0.5)
      }

      ctx.beginPath()
      ctx.moveTo(lx, top); ctx.lineTo(lx + skX, top + skY)
      ctx.lineTo(rx2 + skX, top + skY); ctx.lineTo(rx2, top)
      ctx.closePath()
      ctx.fillStyle = 'rgba(12,28,88,0.55)'; ctx.fill()
      ctx.strokeStyle = `${S}0.6)`; ctx.lineWidth = 1.1; ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx2, top); ctx.lineTo(cx2 + skX, top + skY)
      ctx.strokeStyle = `${S}0.3)`; ctx.lineWidth = 0.7; ctx.stroke()

      ctx.fillStyle = 'rgba(4,10,42,0.95)'
      ctx.fillRect(lx, top, cx2 - lx, 172)
      ctx.strokeStyle = `${S}0.55)`; ctx.lineWidth = 1.1
      ctx.strokeRect(lx, top, cx2 - lx, 172)

      ctx.fillStyle = 'rgba(5,12,46,0.95)'
      ctx.fillRect(cx2, top, rx2 - cx2, 172)
      ctx.strokeStyle = `${S}0.55)`; ctx.lineWidth = 1.1
      ctx.strokeRect(cx2, top, rx2 - cx2, 172)

      const lw = cx2 - lx - 6, unitH = 172 / 14
      for (let i = 0; i < 14; i++) {
        const uy = top + i * unitH + 1
        const uh = unitH - 2
        rr(lx + 3, uy, lw, uh, 2, 'rgba(7,18,60,0.7)', `${S}0.18)`, 0.4)
        const lc = i === 2 ? '#4F8EF7' : i === 5 ? '#22C55E' : i === 8 ? '#f59e0b' : i === 11 ? '#4F8EF7' : `${S}0.15)`
        ctx.beginPath(); ctx.arc(lx + 8, uy + uh / 2, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = lc; ctx.fill()
        if (i === 2 || i === 5 || i === 8 || i === 11) {
          const bw = i === 2 ? 32 : i === 5 ? 28 : i === 8 ? 24 : 20
          const bc = i === 2 ? 'rgba(79,142,247,0.7)' : i === 5 ? 'rgba(34,197,94,0.65)' : i === 8 ? 'rgba(245,158,11,0.65)' : 'rgba(79,142,247,0.55)'
          ctx.fillStyle = bc; ctx.fillRect(lx + 13, uy + 2, bw, 2.2)
          ctx.fillStyle = 'rgba(79,142,247,0.12)'; ctx.fillRect(lx + 13, uy + 5, bw * 0.6, 1.5)
        } else {
          ctx.fillStyle = `${S}0.15)`; ctx.fillRect(lx + 13, uy + 2, 14, 2)
          ctx.fillStyle = `${S}0.08)`; ctx.fillRect(lx + 13, uy + 5, 9, 1.5)
        }
        if (i % 3 === 0) {
          rr(lx + 48, uy + 2, 12, uh - 4, 1, 'rgba(10,25,75,0.8)', `${S}0.2)`, 0.4)
          ctx.beginPath(); ctx.arc(lx + 58, uy + uh / 2, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `${S}0.4)`; ctx.fill()
        }
      }

      const cw = rx2 - cx2 - 6
      for (let i = 0; i < 14; i++) {
        const uy = top + i * unitH + 1
        const uh = unitH - 2
        rr(cx2 + 3, uy, cw, uh, 2, 'rgba(7,18,60,0.7)', `${S}0.18)`, 0.4)
        const lc = i === 1 ? '#4F8EF7' : i === 4 ? '#22C55E' : i === 7 ? '#f59e0b' : i === 10 ? '#4F8EF7' : `${S}0.15)`
        ctx.beginPath(); ctx.arc(cx2 + 8, uy + uh / 2, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = lc; ctx.fill()
        if (i === 1 || i === 4 || i === 7 || i === 10) {
          const bw = i === 1 ? 30 : i === 4 ? 26 : i === 7 ? 22 : 18
          const bc = i === 1 ? 'rgba(79,142,247,0.7)' : i === 4 ? 'rgba(34,197,94,0.65)' : i === 7 ? 'rgba(245,158,11,0.65)' : 'rgba(79,142,247,0.55)'
          ctx.fillStyle = bc; ctx.fillRect(cx2 + 13, uy + 2, bw, 2.2)
        } else {
          ctx.fillStyle = `${S}0.15)`; ctx.fillRect(cx2 + 13, uy + 2, 12, 2)
        }
        if (i % 2 === 0) {
          rr(cx2 + 46, uy + 1, cw - 50, uh - 2, 1, 'rgba(8,22,70,0.9)', `${S}0.25)`, 0.5)
          for (let d = 0; d < 3; d++) {
            ctx.fillStyle = `${S}0.2)`; ctx.fillRect(cx2 + 48 + d * 8, uy + 3, 6, uh - 6)
          }
        }
      }

      const scanY = top + ((Math.sin(t * 1.2) * 0.5 + 0.5) * 172)
      const sg = ctx.createLinearGradient(lx, scanY, rx2, scanY)
      sg.addColorStop(0, 'transparent'); sg.addColorStop(0.1, `${S}0.7)`)
      sg.addColorStop(0.9, `${S}0.7)`); sg.addColorStop(1, 'transparent')
      ctx.fillStyle = sg; ctx.fillRect(lx, scanY - 1, rx2 - lx, 2.5)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ width: '150px', height: '178px', flexShrink: 0 }} />
}

const NetworkIllustration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvasRef.current!
    const ctx = cv.getContext('2d')!
    const W = 220, H = 220
    cv.width = W; cv.height = H
    const cx = 105, cy = 100
    const nodes = [
      { angle: -100, dist: 72 }, { angle: -60, dist: 62 }, { angle: -20, dist: 76 },
      { angle: 20, dist: 60 }, { angle: 55, dist: 70 }, { angle: 100, dist: 62 },
      { angle: 140, dist: 72 }, { angle: 175, dist: 65 }, { angle: -140, dist: 70 },
    ].map(n => {
      const r = (n.angle * Math.PI) / 180
      return {
        x: cx + n.dist * Math.cos(r), y: cy + n.dist * Math.sin(r),
        pulse: Math.random(), speed: 0.004 + Math.random() * 0.003, sparkle: Math.random() * Math.PI * 2,
      }
    })
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 78)
      bg.addColorStop(0, 'rgba(79,142,247,0.14)'); bg.addColorStop(0.5, 'rgba(79,142,247,0.05)'); bg.addColorStop(1, 'transparent')
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, 78, 0, Math.PI * 2); ctx.fill()
      nodes.forEach(n => {
        n.pulse += n.speed; if (n.pulse > 1) n.pulse = 0; n.sparkle += 0.04
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = 'rgba(79,142,247,0.4)'; ctx.lineWidth = 1.2; ctx.stroke()
        const tp = n.pulse, px = cx + (n.x - cx) * tp, py = cy + (n.y - cy) * tp
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 7)
        pg.addColorStop(0, 'rgba(120,210,255,0.95)'); pg.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(200,240,255,0.98)'; ctx.fill()
        const shine = 0.5 + 0.5 * Math.sin(n.sparkle)
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16)
        halo.addColorStop(0, `rgba(79,142,247,${0.28 * shine})`); halo.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(79,142,247,${0.55 + 0.35 * shine})`; ctx.lineWidth = 1.8; ctx.stroke()
        ctx.fillStyle = 'rgba(5,14,50,0.95)'; ctx.fill()
        const dg = ctx.createRadialGradient(n.x - 2, n.y - 2, 0, n.x, n.y, 6)
        dg.addColorStop(0, `rgba(${Math.round(100 + 80 * shine)},${Math.round(180 + 50 * shine)},255,1)`); dg.addColorStop(1, '#4F8EF7')
        ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill()
        if (shine > 0.85) {
          const sp = (shine - 0.85) / 0.15; ctx.save(); ctx.globalAlpha = sp * 0.9
          ctx.strokeStyle = 'rgba(180,230,255,0.95)'; ctx.lineWidth = 1
          const sl = 8 * sp
          ctx.beginPath(); ctx.moveTo(n.x - sl, n.y); ctx.lineTo(n.x + sl, n.y); ctx.moveTo(n.x, n.y - sl); ctx.lineTo(n.x, n.y + sl); ctx.stroke()
          ctx.restore()
        }
      })
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
      cg.addColorStop(0, 'rgba(79,142,247,0.35)'); cg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(79,142,247,0.95)'; ctx.lineWidth = 2.2; ctx.stroke(); ctx.fillStyle = 'rgba(5,14,50,0.95)'; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fillStyle = 'rgba(79,142,247,0.22)'; ctx.fill()
      const wg = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 11)
      wg.addColorStop(0, 'rgba(220,245,255,1)'); wg.addColorStop(0.4, 'rgba(120,200,255,0.9)'); wg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fillStyle = wg; ctx.fill()
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ width: '175px', height: '175px', flexShrink: 0 }} />
}

const LayersIllustration = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvasRef.current!
    const ctx = cv.getContext('2d')!
    cv.width = 240; cv.height = 320
    let t = 0, raf: number

    const CYCLE = 5.5
    const restY = [54, 154, 254]
    const colors = [
      { c1: '#7B4FD4', c2: '#9B6FFF' },
      { c1: '#00BFFF', c2: '#00E5FF' },
      { c1: '#8B5CF6', c2: '#C084FC' },
    ]
    const dropStarts = [0, 0.18, 0.36]
    const dropDur = 0.16

    const easeOutBack = (x: number) => {
      const c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    }

    const diamond = (cx: number, cy: number, hw: number, hh: number) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy - hh); ctx.lineTo(cx + hw, cy)
      ctx.lineTo(cx, cy + hh); ctx.lineTo(cx - hw, cy)
      ctx.closePath()
    }

    const drawDoc = (cx: number, cy: number) => {
      const x = cx - 20, y = cy - 26, w = 40, h = 48, fold = 12
      ctx.beginPath()
      ctx.moveTo(x, y); ctx.lineTo(x + w - fold, y); ctx.lineTo(x + w, y + fold)
      ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath()
      ctx.fillStyle = 'rgba(20,12,65,0.75)'; ctx.fill()
      ctx.strokeStyle = 'rgba(190,160,255,0.95)'; ctx.lineWidth = 2; ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + w - fold, y); ctx.lineTo(x + w - fold, y + fold); ctx.lineTo(x + w, y + fold)
      ctx.strokeStyle = 'rgba(190,160,255,0.7)'; ctx.lineWidth = 1.3; ctx.stroke();
      ([[y + 22, w - 14], [y + 31, w - 18], [y + 40, w - 22]] as [number, number][]).forEach(([ly, lw]) => {
        ctx.beginPath(); ctx.moveTo(x + 7, ly); ctx.lineTo(x + 7 + lw, ly)
        ctx.strokeStyle = 'rgba(180,155,255,0.8)'; ctx.lineWidth = 1.8; ctx.stroke()
      })
    }

    const drawChart = (cx: number, cy: number) => {
      const bars = [{ dx: -24, h: 20 }, { dx: -9, h: 32 }, { dx: 6, h: 24 }, { dx: 21, h: 38 }]
      bars.forEach(b => {
        const bx = cx + b.dx - 5, by = cy + 20 - b.h
        ctx.fillStyle = 'rgba(0,200,255,0.12)'; ctx.fillRect(bx, by, 10, b.h)
        ctx.strokeStyle = 'rgba(0,225,255,0.95)'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 10, b.h)
        const gg = ctx.createLinearGradient(bx, by, bx, by + 6)
        gg.addColorStop(0, 'rgba(0,235,255,0.9)'); gg.addColorStop(1, 'transparent')
        ctx.fillStyle = gg; ctx.fillRect(bx, by, 10, 6)
      })
    }

    const drawShield = (cx: number, cy: number) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy - 26); ctx.lineTo(cx + 18, cy - 16); ctx.lineTo(cx + 18, cy + 2)
      ctx.quadraticCurveTo(cx + 18, cy + 18, cx, cy + 26)
      ctx.quadraticCurveTo(cx - 18, cy + 18, cx - 18, cy + 2); ctx.lineTo(cx - 18, cy - 16)
      ctx.closePath()
      ctx.fillStyle = 'rgba(18,12,65,0.7)'; ctx.fill()
      ctx.strokeStyle = 'rgba(190,155,255,0.95)'; ctx.lineWidth = 2; ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - 8, cy + 2); ctx.lineTo(cx - 1, cy + 9); ctx.lineTo(cx + 10, cy - 7)
      ctx.strokeStyle = 'rgba(200,165,255,0.98)'; ctx.lineWidth = 2.5
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
    }

    const iconFns = [drawDoc, drawChart, drawShield]

    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, 240, 320)

      const phase = (t % CYCLE) / CYCLE
      colors.forEach((col, i) => {
        const ds = dropStarts[i], de = ds + dropDur
        let cy: number, alpha: number

        if (phase < ds) {
          cy = -60; alpha = 0
        } else if (phase < de) {
          const p = (phase - ds) / dropDur
          cy = -60 + (restY[i] + 60) * easeOutBack(Math.min(p, 1))
          alpha = Math.min(p * 4, 1)
        } else {
          cy = restY[i]; alpha = 1
        }

        if (alpha < 0.01) return
        ctx.save(); ctx.globalAlpha = alpha

        const cx = 120, hw = 105, hh = 44
        diamond(cx, cy, hw, hh)
        ctx.fillStyle = 'rgba(7,14,50,0.88)'; ctx.fill()

        const grad = ctx.createLinearGradient(cx - hw, cy, cx + hw, cy)
        grad.addColorStop(0, col.c1); grad.addColorStop(1, col.c2)
        ctx.strokeStyle = grad; ctx.lineWidth = 2.2; ctx.stroke()

        const ig = ctx.createRadialGradient(cx, cy, 0, cx, cy, hw * 0.6)
        ig.addColorStop(0, 'rgba(80,60,200,0.07)'); ig.addColorStop(1, 'transparent')
        diamond(cx, cy, hw - 6, hh - 6); ctx.fillStyle = ig; ctx.fill()

        iconFns[i](cx, cy)
        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ width: '145px', height: '200px', flexShrink: 0 }} />
}

/* Feature Card Icons */

const FeatShield = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.6))' }}>
    <rect width="44" height="44" rx="10" fill="rgba(10,40,22,0.95)" stroke="rgba(34,197,94,0.70)" strokeWidth="1.2" />
    <path d="M22 9l11 5v8c0 7-4.5 11-11 13-6.5-2-11-6-11-13v-8l11-5z" stroke="#22C55E" strokeWidth="1.6" fill="rgba(34,197,94,0.15)" strokeLinejoin="round" />
    <path d="M17 22l3.5 3.5L27 18" stroke="#4ADE80" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FeatBolt = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.6))' }}>
    <rect width="44" height="44" rx="10" fill="rgba(40,28,6,0.95)" stroke="rgba(251,191,36,0.70)" strokeWidth="1.2" />
    <path d="M25 10l-9 13h8l-4 11 11-15h-8l2-9z" stroke="#FBBF24" strokeWidth="1.6" fill="rgba(251,191,36,0.18)" strokeLinejoin="round" />
  </svg>
)

const FeatChart = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.55))' }}>
    <rect width="44" height="44" rx="10" fill="rgba(10,30,50,0.95)" stroke="rgba(52,211,153,0.68)" strokeWidth="1.2" />
    <rect x="12" y="27" width="5" height="8" rx="1" fill="#60A5FA" />
    <rect x="20" y="21" width="5" height="14" rx="1" fill="#34D399" />
    <rect x="28" y="15" width="5" height="20" rx="1" fill="#4ADE80" />
  </svg>
)

/* Layout Helpers */

function Connector() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '56px' }}>
      <div style={{ width: '1px', flex: 1, borderLeft: '1.5px dashed rgba(79,142,247,0.4)' }} />
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F8EF7', boxShadow: '0 0 8px 3px rgba(79,142,247,0.5)', margin: '2px 0' }} />
      <div style={{ width: '1px', flex: 1, borderLeft: '1.5px dashed rgba(79,142,247,0.4)' }} />
    </div>
  )
}

function GlowCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const [hov, setHov] = useState(false)
  const [m, setM] = useState({ x: 50, y: 50 })
  return (
    <div
      className={className}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        setM({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
      }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '1rem', cursor: 'default',
        background: 'rgba(8,18,48,0.85)', backdropFilter: 'blur(14px)',
        border: hov ? '1px solid rgba(79,142,247,0.78)' : '1px solid rgba(79,142,247,0.2)',
        boxShadow: hov ? '0 18px 46px rgba(2,10,34,0.38), 0 0 36px rgba(79,142,247,0.26)' : '0 0 0 rgba(79,142,247,0)',
        transform: hov ? 'translateY(-5px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        willChange: 'transform, box-shadow',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', opacity: hov ? 1 : 0, transition: 'opacity 0.25s ease', background: `radial-gradient(circle at ${m.x}% ${m.y}%, rgba(103,213,255,0.22) 0%, rgba(79,142,247,0.12) 28%, transparent 68%)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: hov ? 'linear-gradient(90deg,transparent,#4F8EF7,transparent)' : 'linear-gradient(90deg,transparent,rgba(79,142,247,0.18),transparent)', transition: 'background 0.25s' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

/* Animated canvas overlay for first carousel card */
function SourceImageAnimated({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current!
    const ctx = cv.getContext('2d')!
    let raf: number
    let t = 0

    const resize = () => {
      cv.width  = cv.offsetWidth  || 500
      cv.height = cv.offsetHeight || 300
    }

    const bz = (u: number, a: number, b: number, c: number, d: number) => {
      const v = 1 - u
      return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d
    }

    const parts = Array.from({ length: 15 }, (_, i) => ({
      progress: i / 15,
      speed: 0.003 + (i % 5) * 0.0004,
      stream: i % 5,
    }))

    const draw = () => {
      t += 0.016
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)

      const nX   = W * 0.13
      const hubX = W * 0.50, hubY = H * 0.50
      const nodeYs = [H * 0.20, H * 0.34, H * 0.50, H * 0.66, H * 0.80]

      const hg = ctx.createRadialGradient(hubX, hubY, 0, hubX, hubY, W * 0.12)
      hg.addColorStop(0, `rgba(0,207,255,${0.22 + 0.13 * Math.sin(t * 0.8)})`)
      hg.addColorStop(1, 'transparent')
      ctx.fillStyle = hg
      ctx.beginPath(); ctx.arc(hubX, hubY, W * 0.12, 0, Math.PI * 2); ctx.fill()

      ;[0, 0.9, 1.8].forEach(off => {
        const ph = (t * 0.38 + off) % 1
        ctx.beginPath()
        ctx.arc(hubX, hubY, W * 0.04 + ph * W * 0.12, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,207,255,${(1 - ph) * 0.60})`
        ctx.lineWidth = 1.4; ctx.stroke()
      })

      nodeYs.forEach((ny, i) => {
        const ph = (t * 0.36 + i * 0.22) % 1
        ctx.beginPath()
        ctx.arc(nX, ny, W * 0.018 + ph * W * 0.055, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${i % 2 === 0 ? '79,142,247' : '0,207,255'},${(1 - ph) * 0.55})`
        ctx.lineWidth = 1; ctx.stroke()
      })

      parts.forEach(p => {
        p.progress = (p.progress + p.speed) % 1
        const u = p.progress, si = p.stream
        const y0 = nodeYs[si]
        const px = bz(u, nX, nX + (hubX - nX) * 0.45, nX + (hubX - nX) * 0.55, hubX)
        const py = bz(u, y0, y0, hubY, hubY)
        const al = Math.sin(u * Math.PI) * 0.90
        const rgb = si % 2 === 0 ? '79,142,247' : '0,207,255'
        const gg = ctx.createRadialGradient(px, py, 0, px, py, 9)
        gg.addColorStop(0, `rgba(${rgb},${al})`)
        gg.addColorStop(1, 'transparent')
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${Math.min(al * 1.3, 1)})`; ctx.fill()
      })

      ;([[0.26, 0.26], [0.38, 0.13], [0.44, 0.82], [0.57, 0.44]] as [number, number][])
        .forEach(([xf, yf], i) => {
          const ax = xf * W, ay = (yf + Math.sin(t * 0.42 + i) * 0.025) * H
          const oa = 0.15 + 0.32 * Math.abs(Math.sin(t * 0.5 + i * 1.1))
          ctx.beginPath(); ctx.arc(ax, ay, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${i % 2 === 0 ? '79,142,247' : '0,207,255'},${oa})`; ctx.fill()
        })

      raf = requestAnimationFrame(draw)
    }

    const t0 = setTimeout(() => { resize(); draw() }, 120)
    window.addEventListener('resize', resize)
    return () => { clearTimeout(t0); cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', animation: 'cardImgFloat 5s ease-in-out infinite' }}>
      <img src={src} alt={alt} className="tool-highlight-image" style={{ animation: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
    </div>
  )
}

/* Horizontal scroll carousel */
type CarouselItem = {
  heading: string
  desc: string
  tag: string
  image: string
  imageAlt: string
  icon: React.ComponentType<{ size?: number }>
}

function ToolHighlightCarousel({ items }: { items: readonly CarouselItem[] }) {
  const targetRef   = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })
  const [maxTranslate, setMaxTranslate] = useState(0)
  const [activeIndex, setActiveIndex]   = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const measure = () => {
      const track    = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      setMaxTranslate(Math.max(0, track.scrollWidth - viewport.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items.length])

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isMobile) return
    const clamped = Math.max(0, Math.min(1, latest))
    setActiveIndex(Math.round(clamped * (items.length - 1)))
  })

  if (isMobile) {
    return (
      <div className="tool-highlight-mobile-list">
        {items.map((item, i) => (
          <article key={i} className="tool-highlight-mobile-card">
            <div className="tool-highlight-inner">
              <div className="tool-highlight-content">
                <div className="tool-highlight-icon"><item.icon size={22} /></div>
                <div className="tool-highlight-tag">{item.tag}</div>
                <h3 className="tool-highlight-heading">{item.heading}</h3>
                <p className="tool-highlight-desc">{item.desc}</p>
              </div>
              <div className="tool-highlight-media">
                {i === 0
                  ? <SourceImageAnimated src={item.image} alt={item.imageAlt} />
                  : <img src={item.image} alt={item.imageAlt} className="tool-highlight-image" />
                }
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={targetRef}
      className="tool-highlight-scroll-section"
      style={{ height: `${items.length * 100}vh` }}
    >
      <div ref={viewportRef} className="tool-highlight-sticky">
        <motion.div ref={trackRef} style={{ x }} className="tool-highlight-track">
          {items.map((item, i) => (
            <article key={i} className="tool-highlight-card">
              <div className="tool-highlight-inner">
                <div className="tool-highlight-content">
                  <div className="tool-highlight-icon"><item.icon size={22} /></div>
                  <div className="tool-highlight-tag">{item.tag}</div>
                  <h3 className="tool-highlight-heading">{item.heading}</h3>
                  <p className="tool-highlight-desc">{item.desc}</p>
                </div>
                <div className="tool-highlight-media">
                  {i === 0
                    ? <SourceImageAnimated src={item.image} alt={item.imageAlt} />
                    : <img src={item.image} alt={item.imageAlt} className="tool-highlight-image" />
                  }
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="tool-highlight-dots" aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={`tool-highlight-dot${i === activeIndex ? ' active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WhyRackTrackPage() {
  const pageRef = useRef<HTMLElement>(null)

  const rackDots = useMemo(() => [
    { top: '18%', left: '6%',  color: '#4F8EF7' },
    { top: '31%', left: '9%',  color: '#22C55E' },
    { top: '44%', left: '7%',  color: '#4F8EF7' },
    { top: '58%', left: '11%', color: '#f59e0b' },
    { top: '70%', left: '8%',  color: '#4F8EF7' },
    { top: '24%', left: '24%', color: '#22C55E' },
    { top: '38%', left: '21%', color: '#4F8EF7' },
    { top: '52%', left: '27%', color: '#f59e0b' },
    { top: '65%', left: '23%', color: '#4F8EF7' },
    { top: '20%', left: '44%', color: '#4F8EF7' },
    { top: '35%', left: '48%', color: '#22C55E' },
    { top: '50%', left: '42%', color: '#4F8EF7' },
    { top: '63%', left: '46%', color: '#f59e0b' },
    { top: '22%', left: '66%', color: '#22C55E' },
    { top: '37%', left: '70%', color: '#4F8EF7' },
    { top: '51%', left: '63%', color: '#4F8EF7' },
    { top: '67%', left: '68%', color: '#f59e0b' },
    { top: '28%', left: '84%', color: '#4F8EF7' },
    { top: '43%', left: '88%', color: '#22C55E' },
    { top: '57%', left: '82%', color: '#4F8EF7' },
  ], [])

  const [litDots, setLitDots] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    const scheduleDot = (i: number) => {
      const delay = 400 + Math.random() * 3100
      const t = setTimeout(() => {
        setLitDots((prev) => new Set([...prev, i]))
        const onDuration = 120 + Math.random() * 380
        const t2 = setTimeout(() => {
          setLitDots((prev) => {
            const next = new Set(prev)
            next.delete(i)
            return next
          })
          scheduleDot(i)
        }, onDuration)
        timers.push(t2)
      }, delay)
      timers.push(t)
    }

    rackDots.forEach((_, i) => {
      const t = setTimeout(() => scheduleDot(i), Math.random() * 2000)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [rackDots.length])

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

  const getIllustration = (index: number) => {
    switch (index) {
      case 0: return <RackIllustration />
      case 1: return <NetworkIllustration />
      case 2: return <LayersIllustration />
      default: return null
    }
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
              <span className="why-h1-line">Three layers of</span>
              <span className="why-h1-line why-h1-grad">infrastructure intelligence.</span>
            </h1>
            <p>
              RackTrack doesn't audit. It perceives, reconciles, and reasons about your physical infrastructure - continuously.
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
              Three intelligence layers.
              <span className="why-flow__title-accent"> One reconciled platform.</span>
            </h2>
            <p>
              Most tools do one piece well. RackTrack combines visual rack intelligence, cable-to-port mapping,
              and infrastructure reconciliation in one workflow - so every team gets inventory they can trust for
              audits, incidents, capacity planning, and compliance.
            </p>
          </div>

          {/* 3 PILLAR CARDS with canvas animations */}
          <div className="why-card-grid" style={{ marginTop: 'clamp(1.5rem, 4vw, 4.5rem)' }}>
            {pillars.map((p, index) => (
              <GlowCard key={p.num} className="why-pillar-card" style={{ borderRadius: '1.5rem' }}>
                <div className="why-pillar-card-content">
                  <div className="why-pillar-copy">
                    <div className="why-pillar-number">{p.num}</div>
                    <h3 className="why-pillar-title">{p.title}</h3>
                    {'patent' in p && p.patent && (
                      <span className="why-pillar-patent">{p.patent}</span>
                    )}
                    <p className="why-pillar-desc">{p.description}</p>
                  </div>
                  <div className="why-pillar-visual">
                    {getIllustration(index)}
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>

          {/* CONNECTORS */}
          <div className="why-connector-grid" aria-hidden="true">
            <Connector /><Connector /><Connector />
          </div>

          {/* FEATURE CARDS */}
          <div className="why-card-grid">
            {[
              { Icon: FeatShield, title: 'Audit-ready', desc: 'Defensible in any compliance review.' },
              { Icon: FeatBolt, title: 'Incident-speed', desc: 'Fast enough for a live outage.' },
              { Icon: FeatChart, title: 'Decision-grade', desc: 'Drives capacity and procurement.' },
            ].map(f => (
              <GlowCard key={f.title} className="why-feature-card">
                <div className="why-feature-card-inner">
                  <div className="why-feature-icon"><f.Icon /></div>
                  <div className="why-feature-text">
                    <div className="why-feature-title">{f.title}</div>
                    <p className="why-feature-desc">{f.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section why-matrix reveal-on-scroll">
        <div className="why-matrix__hero">
          <img
            src="/WhyRackTrack/Rack_BG.webp"
            alt=""
            aria-hidden="true"
            className="why-matrix__hero-image"
          />
          <div className="why-matrix__hero-overlay" />
          {rackDots.map((dot, i) => (
            <div
              key={i}
              className="why-matrix__rack-dot"
              aria-hidden="true"
              style={{
                top: dot.top,
                left: dot.left,
                '--dot-color': dot.color,
                opacity: litDots.has(i) ? 1 : 0,
                transform: litDots.has(i) ? 'scale(1)' : 'scale(0.4)',
                boxShadow: litDots.has(i) ? `0 0 6px 2px ${dot.color}` : 'none',
              } as CSSProperties}
            />
          ))}
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
          <span className="app-eyebrow">Evidence &amp; Trust</span>
          <h2>
            Infrastructure evidence
            <span className="why-trust__title-accent"> every team can trust.</span>
          </h2>
          <p>
            RackTrack produces traceable, network-verified, and timestamped infrastructure records  - 
            the kind of evidence security, compliance, and operations teams can export, defend, and act on.
          </p>
        </div>

        <div className="why-trust__carousel">
          <ToolHighlightCarousel items={toolHighlights} />
        </div>
      </section>
    </main>
  )
}




