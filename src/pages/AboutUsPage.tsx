import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
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
        <meshStandardMaterial color="#0f1d33" metalness={0.75} roughness={0.28} />
      </mesh>

      {[-1.2, -0.6, 0, 0.6, 1.2].map((y, index) => (
        <mesh key={y} position={[0, y, 0.68]}>
          <boxGeometry args={[2.1, 0.26, 0.08]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#7adfff' : '#5fa8ff'}
            emissive={index % 2 === 0 ? '#3bc6ff' : '#2a7dff'}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <torusGeometry args={[2.4, 0.04, 16, 120]} />
        <meshStandardMaterial color="#7adfff" emissive="#2fcbff" emissiveIntensity={0.38} />
      </mesh>
    </group>
  );
}

function ThreeModelShell() {
  return (
    <div className="about-3d-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 38 }}>
        <color attach="background" args={['#07111d']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={1.2} color="#a3eeff" />
        <pointLight position={[-4, -3, 3]} intensity={1.1} color="#5fa8ff" />
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
    <motion.article variants={reveal} className="about-metric-card">
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

function HeroVisual({
  y,
  rotateX,
  rotateY,
  reducedMotion,
}: {
  y: ReturnType<typeof useSpring>;
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  reducedMotion: boolean | null;
}) {
  return (
    <motion.div
      className="about-hero-visual"
      style={{
        y,
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformPerspective: 1800,
      }}
      initial={{ opacity: 0, y: 36, scale: 0.986 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.06, ease: cinematicEase }}
    >
      <div className="about-hero-visual__ambient" />
      <div className="about-hero-visual__grid" />
      <motion.div
        className="about-hero-visual__scan"
        animate={reducedMotion ? { opacity: 0.68 } : { y: ['-10%', '112%'] }}
        transition={reducedMotion ? undefined : { duration: 5.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.8 }}
      />

      <div className="about-hero-visual__surface">
        <div className="about-hero-visual__header about-hero-visual__header--minimal">
          <div className="about-hero-visual__header-line" />
          <div className="about-status-pill about-status-pill--minimal">
            <span className="about-status-pill__dot" />
          </div>
        </div>

        <div className="about-hero-visual__body about-hero-visual__body--concept">
          <div className="about-concept-scene">
            <div className="about-concept-aura about-concept-aura--one" />
            <div className="about-concept-aura about-concept-aura--two" />
            <div className="about-concept-orbit about-concept-orbit--one" />
            <div className="about-concept-orbit about-concept-orbit--two" />
            <div className="about-concept-column" />
            <motion.div
              className="about-concept-phone"
              animate={reducedMotion ? { y: 0 } : { y: [0, -12, 0], rotateZ: [-5, -3, -5] }}
              transition={reducedMotion ? undefined : { duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="about-concept-phone__notch" />
              <div className="about-concept-phone__screen">
                <div className="about-concept-phone__grid" />
                <div className="about-concept-phone__rackframe">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={`phone-rack-${index}`} />
                  ))}
                </div>
                <motion.div
                  className="about-concept-phone__scanline"
                  animate={reducedMotion ? { opacity: 0.7 } : { y: ['-8%', '112%'] }}
                  transition={reducedMotion ? undefined : { duration: 3.6, ease: 'linear', repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.div
              className="about-concept-rack"
              animate={reducedMotion ? { y: 0 } : { y: [0, 10, 0] }}
              transition={reducedMotion ? undefined : { duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="about-concept-rack__header" aria-hidden="true">
                <span />
                <strong />
              </div>
              <div className="about-concept-rack__frame">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`rack-model-${index}`} className="about-concept-rack__unit">
                    <i />
                    <i />
                    <span />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="about-concept-stream"
              animate={reducedMotion ? { opacity: 0.8 } : { opacity: [0.6, 1, 0.6] }}
              transition={reducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span />
              <span />
              <span />
            </motion.div>

            <motion.div
              className="about-concept-card about-concept-card--inventory"
              animate={reducedMotion ? { y: 0 } : { y: [0, -8, 0] }}
              transition={reducedMotion ? undefined : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="about-concept-card about-concept-card--topology"
              animate={reducedMotion ? { x: 0 } : { x: [0, 8, 0] }}
              transition={reducedMotion ? undefined : { duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="about-concept-card__chips" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </motion.div>

            <motion.div
              className="about-concept-card about-concept-card--confidence"
              animate={reducedMotion ? { y: 0 } : { y: [0, 10, 0] }}
              transition={reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="about-concept-pulse about-concept-pulse--one" />
            <div className="about-concept-pulse about-concept-pulse--two" />
            <div className="about-concept-spark about-concept-spark--one" />
            <div className="about-concept-spark about-concept-spark--two" />
            <div className="about-concept-spark about-concept-spark--three" />
            <div className="about-concept-floor" />
          </div>
        </div>

        <div className="about-hero-visual__body">
          <div className="about-rack-stack">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`rack-${index}`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.72, delay: 0.2 + index * 0.07, ease: cinematicEase }}
                className="about-rack-unit"
              >
                <div className="about-rack-unit__lights">
                  <span />
                  <span />
                </div>
                <div className="about-rack-unit__copy">
                  <strong>Compute Cluster {index + 1}</strong>
                  <small>Inference routing · thermal aware · topology locked</small>
                </div>
                <div className="about-rack-unit__score">{96 + (index % 3)}%</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, delay: 0.62, ease: cinematicEase }}
            className="about-hero-visual__telemetry"
          >
            <div className="about-telemetry-panel">
              <div className="about-telemetry-panel__top">
                <div>
                  <span className="about-eyebrow">Scan confidence</span>
                  <strong>98.4%</strong>
                </div>
                <div className="about-telemetry-badge">Live validation</div>
              </div>

              <div className="about-telemetry-stats">
                <div className="about-telemetry-stat">
                  <span>Ports mapped</span>
                  <strong>184</strong>
                </div>
                <div className="about-telemetry-stat">
                  <span>Assets matched</span>
                  <strong>42</strong>
                </div>
              </div>

              <div className="about-telemetry-flow" aria-hidden="true">
                <motion.span
                  className="about-telemetry-flow__beam"
                  animate={reducedMotion ? { opacity: 0.7 } : { y: ['-12%', '112%'] }}
                  transition={reducedMotion ? undefined : { duration: 3.8, ease: 'linear', repeat: Infinity }}
                />
                <div className="about-telemetry-node about-telemetry-node--capture">
                  <strong>Capture</strong>
                  <small>Frame locked</small>
                </div>
                <div className="about-telemetry-node about-telemetry-node--parse">
                  <strong>AI Parse</strong>
                  <small>Labels + ports read</small>
                </div>
                <div className="about-telemetry-node about-telemetry-node--sync">
                  <strong>Sync Ready</strong>
                  <small>Inventory pushed cleanly</small>
                </div>
              </div>

              <div className="about-telemetry-footer">
                <div className="about-telemetry-footer__signal">
                  <span className="about-status-pill__dot" />
                  Topology verified
                </div>
                <div className="about-telemetry-bars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={`bar-${index}`} style={{ animationDelay: `${index * 0.18}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <svg className="about-hero-visual__paths" viewBox="0 0 700 520" fill="none" aria-hidden="true">
          <path d="M80 418C166 346 238 304 334 278C432 250 520 186 618 94" />
          <path d="M84 130C170 190 228 218 286 230C392 252 498 324 620 426" />
          <path d="M118 268H604" />
          <circle cx="80" cy="418" r="5" />
          <circle cx="334" cy="278" r="6" />
          <circle cx="618" cy="94" r="7" />
          <circle cx="84" cy="130" r="5" />
          <circle cx="620" cy="426" r="6" />
        </svg>
      </div>
    </motion.div>
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
              <span />
            </div>
          </div>
          <div className="about-chart-card">
            <div className="about-chart-card__header">
              <strong>Active Alerts</strong>
              <span>12</span>
            </div>
            <div className="about-bar-chart">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="about-chart-card">
            <div className="about-chart-card__header">
              <strong>Power Risk</strong>
              <span>Low</span>
            </div>
            <div className="about-donut-chart" />
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
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
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
  return (
    <div className="about-signal-band">
      <div className="about-signal-band__glow" />
      {signalSteps.map(({ label, value, icon: Icon }, index) => (
        <motion.article
          key={label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
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
  const lightX = useSpring(mouseX, { stiffness: 120, damping: 24, mass: 0.6 });
  const lightY = useSpring(mouseY, { stiffness: 120, damping: 24, mass: 0.6 });
  const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${lightX}% ${lightY}%, rgba(122, 223, 255, 0.15), transparent 60%)`;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroCopyY = useSpring(useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -28]), {
    stiffness: 100,
    damping: 26,
  });
  const heroVisualY = useSpring(useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -76]), {
    stiffness: 100,
    damping: 26,
  });
  const heroRotateX = useSpring(useTransform(lightY, [0, 100], [5, -5]), {
    stiffness: 88,
    damping: 22,
  });
  const heroRotateY = useSpring(useTransform(lightX, [0, 100], [-6, 6]), {
    stiffness: 88,
    damping: 22,
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
          <motion.div style={{ y: heroCopyY }} className="about-hero__copy">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="about-hero__intro">
              <motion.h1 variants={reveal} className="about-hero-title">
                <span>Point your phone at a rack and</span>
                <span className="about-hero-title__accent">know what is</span>
                <span className="about-hero-title__accent about-hero-title__accent--secondary">inside in seconds.</span>
              </motion.h1>
              <motion.p variants={reveal}>
                RackTrack turns one rack scan into device visibility, port context, and inventory data your team can use immediately.
              </motion.p>

              <motion.div variants={reveal} className="about-hero__actions">
                <motion.a
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  href="/contact"
                  className="about-button about-button--primary"
                >
                  Book a Strategic Demo
                  <ArrowRight className="about-button__icon" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  href="/solutions"
                  className="about-button about-button--ghost"
                >
                  Explore the Platform
                </motion.a>
              </motion.div>

              <motion.div variants={stagger} className="about-hero__metrics">
                {heroMetrics.map((item) => (
                  <MetricCard key={item.label} {...item} />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <HeroVisual y={heroVisualY} rotateX={heroRotateX} rotateY={heroRotateY} reducedMotion={reducedMotion} />
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
              <img src={workflowAfter} alt="RackTrack workflow visualization" />
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
