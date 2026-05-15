import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Environment } from '@react-three/drei';
import { ArrowRight, BarChart3, Cpu, Gauge, GitBranch, Network, Radar, Shield, Sparkles, Zap } from 'lucide-react';
import * as THREE from 'three';

const workflowAfter = "/assets/workflow-after.png";

import './AboutUsPage.css';

type IconType = React.ComponentType<{ className?: string }>;

const cinematicEase = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.24 };

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.86, ease: cinematicEase },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

const heroMetrics = [
  { label: 'Rack scan accuracy', value: '99.2%', detail: 'AI device and port recognition', icon: Shield },
  { label: 'Inventory speed', value: 'Seconds', detail: 'from photo to full rack context', icon: Radar },
  { label: 'Ops time saved', value: '34%', detail: 'less manual discovery and triage', icon: Zap },
];

const signalSteps = [
  { label: 'Capture', value: 'Phone-guided', icon: Cpu },
  { label: 'Detect', value: 'Ports and devices', icon: Gauge },
  { label: 'Sync', value: 'CMDB ready', icon: Network },
  { label: 'Share', value: 'Audit report', icon: Sparkles },
];

function RackCoreModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.6, 3.8, 1.2]} />
        <meshStandardMaterial
          color="#111d31"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.35}
        />
      </mesh>

      {[-1.2, -0.6, 0, 0.6, 1.2].map((y, index) => (
        <mesh key={y} position={[0, y, 0.68]}>
          <boxGeometry args={[2.1, 0.26, 0.08]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#7adfff' : '#5fa8ff'}
            emissive={index % 2 === 0 ? '#3bc6ff' : '#2a7dff'}
            emissiveIntensity={0.72}
            metalness={0.88}
            roughness={0.12}
            envMapIntensity={1.15}
          />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <torusGeometry args={[2.4, 0.04, 16, 120]} />
        <meshStandardMaterial
          color="#7adfff"
          emissive="#2fcbff"
          emissiveIntensity={0.52}
          metalness={0.86}
          roughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

function ThreeModelShell() {
  return (
    <div className="about-3d-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#07111d']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 6, 6]} intensity={1.65} color="#d7fbff" />
        <pointLight position={[-4, -3, 3]} intensity={1.55} color="#5fa8ff" />
        <Environment preset="city" />
        <RackCoreModel />
      </Canvas>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
}) {
  return (
    <motion.article
      layout
      variants={reveal}
      whileHover={{ y: -16, scale: 1.055 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20, mass: 0.55 }}
      className="about-metric-card"
    >
      <div className="about-metric-card__header">
        <span>{label}</span>
        <Icon className="about-card-icon" />
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </motion.article>
  );
}

function ScrollScene({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'end 20%'],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [reducedMotion ? 0 : 38, 0]), {
    stiffness: 120,
    damping: 24,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [reducedMotion ? 1 : 0.97, 1]), {
    stiffness: 120,
    damping: 24,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.45, 1, 1]);

  return (
    <motion.section ref={ref} style={{ y, scale, opacity }} className={`about-scroll-scene ${className}`.trim()}>
      {children}
    </motion.section>
  );
}

function ScanDemo({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <div className="about-demo-scan">
      <div className="about-demo-scan__rack">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={`scan-unit-${index}`} className="about-demo-scan__unit">
            <span className="about-demo-scan__light" />
            <strong>Port Group {index + 1}</strong>
            <small>{index % 2 === 0 ? 'Switches mapped' : 'Uplinks verified'}</small>
          </div>
        ))}
      </div>
      <motion.div
        className="about-demo-scan__beam"
        animate={reducedMotion ? { opacity: 0.65 } : { y: ['-12%', '108%'] }}
        transition={reducedMotion ? undefined : { duration: 4.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.7 }}
      />
      <div className="about-demo-scan__labels">
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.7, ease: cinematicEase }} className="about-floating-label about-floating-label--left">
          AI Port Match
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.7, delay: 0.1, ease: cinematicEase }} className="about-floating-label about-floating-label--right">
          Thermal Safe
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.7, delay: 0.2, ease: cinematicEase }} className="about-floating-label about-floating-label--bottom">
          Drift Risk Low
        </motion.div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="about-dashboard-preview">
      <div className="about-dashboard-preview__main">
        <div className="about-dashboard-preview__topline">
          <span className="about-eyebrow">Command dashboard</span>
          <div className="about-dashboard-preview__tabs">
            <span>Overview</span>
            <span>Topology</span>
            <span>Prediction</span>
          </div>
        </div>
        <div className="about-dashboard-grid">
          <div className="about-chart-card about-chart-card--large">
            <div className="about-chart-card__header">
              <strong>Infrastructure Stability</strong>
              <span>98.7%</span>
            </div>
            <div className="about-line-chart">
              <motion.svg viewBox="0 0 420 240" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M8 188 C58 164 92 182 132 128 C174 72 210 142 248 94 C294 36 330 80 412 24"
                  fill="none"
                  stroke="url(#aboutLineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
                  viewport={viewport}
                  transition={{ duration: 1.5, ease: cinematicEase }}
                />
                <defs>
                  <linearGradient id="aboutLineGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop stopColor="#7adfff" />
                    <stop offset="0.55" stopColor="#5fa8ff" />
                    <stop offset="1" stopColor="#a278ff" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </div>
          </div>
          <div className="about-chart-card">
            <div className="about-chart-card__header">
              <strong>Active Alerts</strong>
              <span>12</span>
            </div>
            <div className="about-bar-chart">
              {[58, 84, 44, 72].map((height, index) => (
                <motion.span
                  key={`dashboard-bar-${height}`}
                  initial={reducedMotion ? false : { scaleY: 0, opacity: 0.28 }}
                  whileInView={reducedMotion ? undefined : { scaleY: 1, opacity: 1 }}
                  viewport={viewport}
                  transition={{ duration: 0.82, delay: index * 0.08, ease: cinematicEase }}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="about-chart-card">
            <div className="about-chart-card__header">
              <strong>Power Risk</strong>
              <span>Low</span>
            </div>
            <div className="about-donut-chart">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient id="aboutDonutGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#7adfff" />
                    <stop offset="1" stopColor="#5fa8ff" />
                  </linearGradient>
                </defs>
                <circle className="about-donut-chart__track" cx="60" cy="60" r="43" />
                <motion.circle
                  className="about-donut-chart__value"
                  cx="60"
                  cy="60"
                  r="43"
                  initial={reducedMotion ? false : { pathLength: 0 }}
                  whileInView={reducedMotion ? undefined : { pathLength: 0.68 }}
                  viewport={viewport}
                  transition={{ duration: 1.1, ease: cinematicEase }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="about-dashboard-preview__float about-dashboard-preview__float--one">
        <BarChart3 className="about-card-icon" />
        <div>
          <strong>AI Detection</strong>
          <span>3 hidden anomalies surfaced</span>
        </div>
      </div>

      <div className="about-dashboard-preview__float about-dashboard-preview__float--two">
        <GitBranch className="about-card-icon" />
        <div>
          <strong>Topology Shift</strong>
          <span>north cluster rerouted automatically</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="about-analytics-preview">
      <div className="about-analytics-preview__metrics">
        <div className="about-analytics-chip">
          <span>Utilization</span>
          <strong>76%</strong>
        </div>
        <div className="about-analytics-chip">
          <span>Incident Trend</span>
          <strong>-18%</strong>
        </div>
        <div className="about-analytics-chip">
          <span>Prediction Lift</span>
          <strong>+31%</strong>
        </div>
      </div>
      <div className="about-analytics-preview__surface">
        <div className="about-analytics-bars">
          {[34, 62, 48, 88, 66, 94].map((height, index) => (
            <motion.span
              key={`analytics-bar-${height}`}
              initial={reducedMotion ? false : { scaleY: 0, opacity: 0.28 }}
              whileInView={reducedMotion ? undefined : { scaleY: 1, opacity: 1 }}
              viewport={viewport}
              transition={{ duration: 0.9, delay: index * 0.07, ease: cinematicEase }}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="about-analytics-recommendation">
          <Sparkles className="about-card-icon" />
          <div>
            <strong>AI Recommendation</strong>
            <span>Shift cooling allocation to Rack Corridor C for efficiency gain.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalBand() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="about-signal-band">
      <div className="about-signal-band__glow" />
      {signalSteps.map(({ label, value, icon: Icon }, index) => (
        <motion.article
          key={label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={
            reducedMotion
              ? { duration: 0.72, delay: index * 0.08, ease: cinematicEase }
              : {
                  y: {
                    duration: 4 + index * 0.22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.18,
                  },
                  opacity: { duration: 0.72, delay: index * 0.08, ease: cinematicEase },
                }
          }
          className="about-signal-card"
        >
          <div className="about-signal-card__icon">
            <Icon className="about-card-icon" />
          </div>
          <strong>{value}</strong>
          <span>{label}</span>
        </motion.article>
      ))}
    </div>
  );
}

export default function AboutUsPage() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(32);
  const lightX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.1 });
  const lightY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.1 });
  const spotlight = useMotionTemplate`radial-gradient(54rem circle at ${lightX}% ${lightY}%, rgba(122, 223, 255, 0.18), rgba(95, 168, 255, 0.08) 34%, transparent 68%)`;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroCopyY = useSpring(useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -28]), {
    stiffness: 100,
    damping: 26,
  });

  return (
    <div
      className="about-page"
      onMouseMove={(event) => {
        mouseX.set((event.clientX / window.innerWidth) * 100);
        mouseY.set((event.clientY / window.innerHeight) * 100);
      }}
    >
      <motion.div className="about-page__spotlight" style={{ backgroundImage: spotlight }} />
      <div className="about-page__backdrop">
        <div className="about-page__aurora about-page__aurora--teal" />
        <div className="about-page__aurora about-page__aurora--violet" />
        <div className="about-page__aurora about-page__aurora--blue" />
        <div className="about-page__beam about-page__beam--one" />
        <div className="about-page__beam about-page__beam--two" />
        <div className="about-page__glow-orb about-page__glow-orb--one" />
        <div className="about-page__glow-orb about-page__glow-orb--two" />
        <div className="about-page__wire about-page__wire--one" />
        <div className="about-page__wire about-page__wire--two" />
        <div className="about-page__wire about-page__wire--three" />
        <div className="about-page__frame about-page__frame--one" />
        <div className="about-page__frame about-page__frame--two" />
      </div>

      <main className="about-shell">
        <section ref={heroRef} className="about-hero">
          {/* Background Video */}
          <video
            className="about-hero__video"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
          >
            <source src="/media/AboutUsHero.mp4" type="video/mp4" />
          </video>
          {/* Dark Gradient Overlay for text contrast */}
          <div className="about-hero__video-overlay" />

          <motion.div style={{ y: heroCopyY }} className="about-hero__copy">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="about-hero__intro">
              <motion.h1 variants={reveal} className="about-hero-title">
                <span className="about-hero-title__line-1">Point your phone at a rack and</span>
                <span className="about-hero-title__line-2">
                  <span className="about-hero-title__accent">know what is</span>
                  {' '}
                  <span className="about-hero-title__accent about-hero-title__accent--secondary">inside in seconds.</span>
                </span>
              </motion.h1>

              <motion.p variants={reveal} className="about-hero-caption">
                RackTrack turns one rack scan into device visibility, port context, and inventory data your team can use immediately.
              </motion.p>

              <motion.div variants={reveal} className="about-hero__actions">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  href="/contact"
                  className="about-button about-button--primary"
                >
                  Book a Strategic Demo
                  <ArrowRight size={18} className="about-button__icon" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  href="/solutions"
                  className="about-button about-button--ghost"
                >
                  Explore the Platform
                </motion.a>
              </motion.div>

            </motion.div>
          </motion.div>
        </section>

        <section className="about-metrics-section" aria-label="RackTrack platform metrics">
          <LayoutGroup>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={stagger}
              className="about-hero__metrics"
            >
              {heroMetrics.map((item) => (
                <MetricCard key={item.label} {...item} />
              ))}
            </motion.div>
          </LayoutGroup>
        </section>

        <ScrollScene className="about-story">
          <div className="about-story__copy">
            <span className="about-eyebrow">What RackTrack Does</span>
            <h2>Rack scanning, inventory, and sync in one AI workflow.</h2>
            <p>
              Capture the rack once, let AI identify the hardware, then push the verified result into your operational systems.
            </p>
          </div>

          <motion.div variants={reveal} className="about-story__stats">
            <SignalBand />
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--split">
          <motion.div variants={reveal} className="about-section-copy">
            <span className="about-eyebrow">AI Rack Scanning</span>
            <h2>RackTrack reads the rack the way a technician does, only faster and with cleaner context.</h2>
            <p>
              The app checks framing, detects devices and ports, reads labels, and builds a structured rack inventory from one capture.
            </p>
          </motion.div>
          <motion.div variants={reveal} className="about-visual-card about-visual-card--scan">
            <div className="about-visual-stack">
              <ThreeModelShell />
              <ScanDemo reducedMotion={reducedMotion} />
            </div>
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-dashboard-section">
          <motion.div variants={reveal} className="about-section-heading">
            <span className="about-eyebrow">Product Screens</span>
            <h2>From live camera capture to scan results, the product stays clear, fast, and operational.</h2>
            <p>
              Guided capture, rack intelligence, topology, and reporting all stay inside one connected workflow.
            </p>
          </motion.div>
          <motion.div variants={reveal} className="about-dashboard-shell">
            <DashboardPreview />
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--reverse">
          <motion.div variants={reveal} className="about-visual-card about-visual-card--analytics">
            <AnalyticsPreview />
          </motion.div>
          <motion.div variants={reveal} className="about-section-copy">
            <span className="about-eyebrow">Operational Intelligence</span>
            <h2>RackTrack connects scan results to topology, incidents, and reporting.</h2>
            <p>
              Teams can review port usage, compare physical findings to CMDB data, and share the result without manual rework.
            </p>
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--reverse">
          <motion.div variants={reveal} className="about-visual-card about-visual-card--workflow-shot">
            <div className="about-workflow-shot">
              <motion.div
                className="about-workflow-shot__media"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.95, filter: 'blur(18px)' }}
                whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={viewport}
                transition={{ duration: 1.05, ease: cinematicEase }}
              >
                <img src={workflowAfter} alt="RackTrack workflow visualization" />
              </motion.div>
              <div className="about-image-card__overlay about-image-card__overlay--workflow">
                <span className="about-eyebrow">Workflow</span>
                <strong>Compare, approve, sync, and share the rack state across your operating stack</strong>
              </div>
            </div>
          </motion.div>
          <motion.div variants={reveal} className="about-section-copy">
            <span className="about-eyebrow">Why It Matters</span>
            <h2>Less manual audit work. More usable rack data.</h2>
            <p>
              RackTrack keeps physical rack data current, structured, and ready for the teams that operate it every day.
            </p>
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-cta">
          <div className="about-cta__beam" />
          <div className="about-cta__content">
            <span className="about-eyebrow">The Next Move</span>
            <h2>Give your team a faster way to understand every rack they touch.</h2>
            <p>
              RackTrack brings scanning, AI recognition, and system sync into one workflow built for real data center operations.
            </p>
            <div className="about-cta__actions">
              <motion.a
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                href="/contact"
                className="about-button about-button--primary"
              >
                Book a Demo
                <ArrowRight className="about-button__icon" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                href="/solutions"
                className="about-button about-button--ghost"
              >
                View Use Cases
              </motion.a>
            </div>
          </div>
        </ScrollScene>
      </main>
    </div>
  );
}
