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
import datacenterBg from '../assets/datacenter-bg.jpg';
import phoneScanBefore from '../assets/phone-scan-before.jpg';
import portsScanOutput from '../assets/ports-scan-output.jpg';
import workflowAfter from '../assets/workflow-after.png';
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

const statCards = [
  { label: 'Rack inventory', value: 'Auto-built', icon: Cpu },
  { label: 'Port visibility', value: 'Live', icon: Gauge },
  { label: 'CMDB sync', value: 'ServiceNow', icon: Network },
  { label: 'Reports ready', value: 'HTML / CSV / JSON', icon: Sparkles },
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
        <div className="about-hero-visual__header">
          <div>
            <span className="about-eyebrow">AI Detection Active</span>
            <h2>Infrastructure Intelligence Mesh</h2>
          </div>
          <div className="about-status-pill">
            <span className="about-status-pill__dot" />
            Live topology
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

          <div className="about-hero-visual__cards">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: 0.66, ease: cinematicEase }}
              className="about-overlay-card"
            >
              <span className="about-eyebrow">Prediction layer</span>
              <strong>Failure path isolated 41 minutes before escalation</strong>
              <p>RackTrack fused power variance, airflow drift, and port instability into one intervention signal.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: 0.78, ease: cinematicEase }}
              className="about-overlay-card about-overlay-card--compact"
            >
              <div className="about-mini-stat">
                <span>Latency</span>
                <strong>1.8ms</strong>
              </div>
              <div className="about-mini-stat">
                <span>Thermal drift</span>
                <strong>Normal</strong>
              </div>
            </motion.div>
          </div>
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

function ProductImageShowcase() {
  return (
    <div className="about-image-showcase">
      <div className="about-image-card about-image-card--hero">
        <img src={datacenterBg} alt="Data center environment representing RackTrack deployment" />
        <div className="about-image-card__overlay">
          <span className="about-eyebrow">Environment</span>
          <strong>Built for real-world rack aisles, live infrastructure, and operational pressure</strong>
        </div>
      </div>

      <div className="about-image-card about-image-card--phone">
        <img src={phoneScanBefore} alt="RackTrack mobile rack scanning interface" />
        <div className="about-image-card__overlay">
          <span className="about-eyebrow">Capture</span>
          <strong>Live camera guidance for sharpness, lighting, and framing</strong>
        </div>
      </div>

      <div className="about-image-card about-image-card--results">
        <img src={portsScanOutput} alt="RackTrack scan results with detected ports and infrastructure details" />
        <div className="about-image-card__overlay">
          <span className="about-eyebrow">Results</span>
          <strong>Devices, ports, cables, and availability detected automatically</strong>
        </div>
      </div>
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
              <motion.span variants={reveal} className="about-eyebrow">
                AI Rack Intelligence for Data Center Teams
              </motion.span>
              <motion.h1 variants={reveal}>
                Point your phone at a rack and instantly know everything inside it.
              </motion.h1>
              <motion.p variants={reveal}>
                RackTrack helps data center technicians scan racks with a mobile camera, identify every device, port, and cable with AI, build a full inventory in seconds, and sync the result back to operational systems.
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
            <h2>Rack scanning, inventory, topology, and CMDB sync in one AI workflow.</h2>
            <p>
              The product is built around a real technician workflow: capture a rack photo, let AI identify devices and ports, compare with live network data, and push validated updates into the asset system.
            </p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="about-story__stats">
            {statCards.map(({ label, value, icon: Icon }) => (
              <motion.article key={label} variants={reveal} className="about-stat-card">
                <Icon className="about-card-icon" />
                <strong>{value}</strong>
                <span>{label}</span>
              </motion.article>
            ))}
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--split">
          <motion.div variants={reveal} className="about-section-copy">
            <span className="about-eyebrow">AI Rack Scanning</span>
            <h2>RackTrack reads the rack the way a technician sees it, only faster and with more context.</h2>
            <p>
              The app checks photo quality in real time, detects devices, ports, and cable colors automatically, reads labels with OCR, and turns one image into a structured rack inventory.
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
            <h2>From live camera capture to scan results, the product is designed as an end-to-end operational surface.</h2>
            <p>
              RackTrack combines guided mobile capture, device cards, port availability views, 2D and 3D topology, and actionable change workflows into one polished experience.
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
            <h2>RackTrack connects scan results to topology, incidents, firmware posture, and reporting.</h2>
            <p>
              Teams can see which ports are in use, discover network neighbors, compare physical findings to ServiceNow CMDB data, flag changes, and export or share results across Slack, Teams, or email.
            </p>
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--split">
          <motion.div variants={reveal} className="about-section-copy">
            <span className="about-eyebrow">Real App Experience</span>
            <h2>Mobile capture, annotated results, and workflow-ready outputs make the product feel usable immediately.</h2>
            <p>
              The website should show that RackTrack is not just analytics. It is a field-ready app for scanning racks, reviewing detections, checking available ports, and driving asset updates with confidence.
            </p>
          </motion.div>
          <motion.div variants={reveal} className="about-visual-card about-visual-card--images">
            <ProductImageShowcase />
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
            <h2>RackTrack reduces manual rack audits and turns physical infrastructure into live operational data.</h2>
            <p>
              Instead of relying on outdated spreadsheets or slow visual checks, teams get a camera-first workflow that maps what is physically present, validates it against network and asset systems, and makes that intelligence immediately useful.
            </p>
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-cta">
          <div className="about-cta__beam" />
          <div className="about-cta__content">
            <span className="about-eyebrow">The Next Move</span>
            <h2>Give your team a faster way to understand every rack they touch.</h2>
            <p>
              RackTrack brings mobile scanning, AI recognition, topology context, and system sync into one workflow built for real data center operations.
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
