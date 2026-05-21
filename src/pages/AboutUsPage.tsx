import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Gauge, Network, Radar, Search, Shield, Sparkles, Zap } from 'lucide-react';

import './AboutUsPage.css';

type IconType = React.ComponentType<{ className?: string }>;

const cinematicEase = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.24 };
const heroGridColumns = 18;
const heroGridRows = 10;
const heroGridCells = Array.from({ length: heroGridColumns * heroGridRows }, (_, index) => index);

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.86, ease: cinematicEase },
  },
};

const metricsStage = {
  hidden: {
    opacity: 0,
    y: 92,
    pointerEvents: 'none' as const,
    transition: { duration: 0.36, ease: cinematicEase },
  },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto' as const,
    transition: { duration: 0.86, ease: cinematicEase },
  },
};

const metricsCardsGroup = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.14,
    },
  },
};

const metricCardEntrance = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.94,
    filter: 'blur(16px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.86, ease: cinematicEase },
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

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  index = 0,
  shouldLoad = true,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
  index?: number;
  shouldLoad?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse interactivity for hover glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const runLoadingSequence = useCallback(() => {
    const duration = 700;
    const startedAt = performance.now();
    isLoadingRef.current = true;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setCount(Math.round(progress * 100));

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      setCount(100);
      setIsLoaded(true);
      isLoadingRef.current = false;
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const startLoading = useCallback(() => {
    if (isLoaded || isLoadingRef.current) return;
    runLoadingSequence();
  }, [isLoaded, runLoadingSequence]);

  const replayLoading = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isLoadingRef.current = false;
    setIsLoaded(false);
    setCount(0);
    runLoadingSequence();
  }, [runLoadingSequence]);

  useEffect(() => {
    if (isInView && shouldLoad) {
      startLoading();
    }
  }, [isInView, shouldLoad, startLoading]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return (
    <motion.article
      ref={ref}
      variants={metricCardEntrance}
      custom={index}
      className="about-metric-card"
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="about-metric-card__glow"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(122, 223, 255, 0.15), transparent 80%)`,
        }}
      />
      <div
        className="about-metric-card__inner"
        onClick={replayLoading}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            replayLoading();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: cinematicEase }}
              className="about-metric-card__counter"
            >
              {count}%
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.62, ease: cinematicEase }}
              className="about-metric-card__content"
            >
              <div className="about-metric-card__header">
                <Icon className="about-card-icon" />
                <span>{label}</span>
              </div>
              <strong>{value}</strong>
              <p>{detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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

export default function AboutUsPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [metricsShouldEnter, setMetricsShouldEnter] = useState(false);
  const [activeGridCell, setActiveGridCell] = useState<number | null>(null);
  
  // ================================================================
  // CINEMATIC HERO — ABSOLUTE-PIXEL SCRUBBED SCROLL (Lenis + FM)
  // ================================================================
  const { scrollY } = useScroll();

  // 0–30% (0–450px): Glass card drifts up and dissolves
  const cardOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const cardY = useTransform(scrollY, [0, 450], [0, -80]);
  const cardBlur = useTransform(scrollY, [0, 450], [16, 0]);
  const glassBackdropFilter = useMotionTemplate`blur(${cardBlur}px) saturate(1.2)`;
  const glassBgAlpha = useTransform(scrollY, [0, 450], [0.55, 0]);
  const glassBackground = useMotionTemplate`rgba(8, 12, 22, ${glassBgAlpha})`;
  const glassBorderAlpha = useTransform(scrollY, [0, 450], [0.08, 0]);
  const glassBorder = useMotionTemplate`1px solid rgba(255, 255, 255, ${glassBorderAlpha})`;
  const glassShadowAlpha1 = useTransform(scrollY, [0, 450], [0.6, 0]);
  const glassShadowAlpha2 = useTransform(scrollY, [0, 450], [0.12, 0]);
  const glassBoxShadow = useMotionTemplate`0 40px 100px rgba(0, 0, 0, ${glassShadowAlpha1}), inset 0 1px 0 rgba(255, 255, 255, ${glassShadowAlpha2})`;
  // Card becomes non-interactive once invisible
  const cardPointerEvents = useTransform(
    cardOpacity,
    (v: number): string => (v < 0.1 ? 'none' : 'auto'),
  );
  const gridOpacity = useTransform(scrollY, [0, 260, 600], [0.95, 0.58, 0]);

  // 0–40% (0–600px): clip-path polygon expands from center rect → full viewport
  // Two values drive the 4 polygon corners: clip1 = TL%, clip2 = BR%
  const clip1 = useTransform(scrollY, [0, 600], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 600], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  // 0–60% (0–900px): backgroundSize reverse-zoom on the window element
  // Animating backgroundSize (NOT a transform) is the "scale separation" trick:
  // the window expands outward while the image inside zooms inward simultaneously
  const bgSizePct = useTransform(scrollY, [0, 900], [170, 100]);
  const windowBackgroundSize = useMotionTemplate`${bgSizePct}% auto`;

  // Graceful handoff: entire sticky scene fades as it scrolls off screen
  const stickyOpacity = useTransform(scrollY, [1500, 2000], [1, 0]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setMetricsShouldEnter(latest >= 450);
  });

  // General Page Spotlight
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(32);
  const lightX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.1 });
  const lightY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.1 });
  const spotlight = useMotionTemplate`radial-gradient(54rem circle at ${lightX}% ${lightY}%, rgba(122, 223, 255, 0.18), rgba(95, 168, 255, 0.08) 34%, transparent 68%)`;

  // Workflow Image Parallax
  const workflowShotRef = useRef<HTMLDivElement>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const { scrollYProgress: workflowScrollYProgress } = useScroll({
    target: workflowShotRef,
    offset: ['start end', 'end start'],
  });
  const workflowParallaxY = useTransform(workflowScrollYProgress, [0, 1], [reducedMotion ? 0 : -24, reducedMotion ? 0 : 42]);
  const workflowMouseX = useMotionValue(0);
  const workflowMouseY = useMotionValue(0);
  const workflowCursorRawX = useMotionValue(0);
  const workflowCursorRawY = useMotionValue(0);
  const workflowImageX = useSpring(useTransform(workflowMouseX, [-1, 1], [26, -26]), {
    stiffness: 220, damping: 24, mass: 0.35,
  });
  const workflowHoverY = useSpring(useTransform(workflowMouseY, [-1, 1], [22, -22]), {
    stiffness: 220, damping: 24, mass: 0.35,
  });
  const workflowImageY = useTransform(() => workflowParallaxY.get() + workflowHoverY.get());
  const workflowCursorX = useSpring(workflowCursorRawX, { stiffness: 360, damping: 28, mass: 0.16 });
  const workflowCursorY = useSpring(workflowCursorRawY, { stiffness: 360, damping: 28, mass: 0.16 });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleHeroMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width - 1);
    const localY = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height - 1);
    const column = Math.floor((localX / bounds.width) * heroGridColumns);
    const row = Math.floor((localY / bounds.height) * heroGridRows);

    setActiveGridCell(row * heroGridColumns + column);
  };

  const resetHeroGridCursor = () => {
    setActiveGridCell(null);
  };

  const handleWorkflowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    const relativeX = ((localX / bounds.width) - 0.5) * 2;
    const relativeY = ((localY / bounds.height) - 0.5) * 2;
    workflowMouseX.set(relativeX);
    workflowMouseY.set(relativeY);
    workflowCursorRawX.set(localX);
    workflowCursorRawY.set(localY);
  };

  const resetWorkflowHover = () => {
    setIsHoveringImage(false);
    workflowMouseX.set(0);
    workflowMouseY.set(0);
  };

  return (
    <div
      className="about-page"
      onMouseMove={(event) => {
        mouseX.set((event.clientX / window.innerWidth) * 100);
        mouseY.set((event.clientY / window.innerHeight) * 100);
      }}
    >
      <motion.div className="about-page__spotlight" style={{ backgroundImage: spotlight }} />
      
      {/* Background Atmospherics (Z-Index: 0) */}
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
        {/* Scroll runway: 1500px pinned + 100vh for the handoff fade */}
        <section className="about-hero">
          {/* Sticky layer — stays locked to viewport until 1500px of scroll consumed */}
          <motion.div
            className="about-hero__sticky-container"
            style={{ opacity: stickyOpacity }}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={resetHeroGridCursor}
          >

            {/* Layer 1: Background dot / grid pattern */}
            <motion.div
              className="about-hero__pattern-grid"
              style={{
                opacity: gridOpacity,
                '--about-hero-grid-columns': heroGridColumns,
                '--about-hero-grid-rows': heroGridRows,
              } as unknown as CSSProperties}
              aria-hidden="true"
            >
              {heroGridCells.map((cell) => (
                <span
                  key={cell}
                  className={`about-hero__pattern-cell${activeGridCell === cell ? ' is-active' : ''}`}
                />
              ))}
            </motion.div>

            {/* Layer 2: Clipped image window (the SpaceX-style reveal)
                - clip-path polygon() starts as center 50% rect, expands to 100% (0–600px)
                - backgroundSize shrinks 170% → 100% on the SAME element (0–900px)
                - Both on one div = "scale separation": window opens while image zooms out */}
            <motion.div
              className="about-hero__window"
              style={{
                clipPath,
                backgroundSize: windowBackgroundSize,
              }}
            />

            {/* Layer 3: Edge vignette — keeps periphery dark as window expands */}
            <div className="about-hero__overlay" />

            {/* Layer 4: Glassmorphic card
                0–450px: y drifts -80px, opacity fades 1→0, blur collapses, border vanishes */}
            <motion.div
              className="about-hero__glass-box"
              style={{
                opacity: cardOpacity,
                y: cardY,
                background: glassBackground,
                border: glassBorder,
                boxShadow: glassBoxShadow,
                backdropFilter: glassBackdropFilter,
                WebkitBackdropFilter: glassBackdropFilter,
                pointerEvents: cardPointerEvents as unknown as 'none' | 'auto',
              }}
            >
              <div className="about-hero__intro">
                <motion.h1 variants={reveal} initial="hidden" animate="visible" className="about-hero-title">
                  <span className="about-hero-title__line-1">Scan the rack.</span>
                  <span className="about-hero-title__line-2">
                    <span className="about-hero-title__accent">Know the stack.</span>
                  </span>
                </motion.h1>

                <motion.p variants={reveal} initial="hidden" animate="visible" className="about-hero-caption">
                  RackTrack turns a quick phone sweep into verified devices, ports, topology, and inventory your team can trust.
                </motion.p>

                <motion.div variants={reveal} initial="hidden" animate="visible" className="about-hero__actions">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => navigate('/contact-us', { state: { scrollTo: 'contact' } })}
                    className="about-button about-button--primary"
                  >
                    Book a Demo
                    <ArrowRight size={18} className="about-button__icon" />
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    href="/solutions"
                    className="about-button about-button--ghost"
                  >
                    Explore Platform
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom gradient mask — blends the sticky scene into the next section */}
            <div className="about-hero__bottom-mask" />

            <motion.div
              className="about-hero__metrics-stage"
              initial="hidden"
              animate={metricsShouldEnter ? 'visible' : 'hidden'}
              variants={metricsStage}
              aria-label="RackTrack platform metrics"
            >
              <motion.div variants={metricsCardsGroup} className="about-hero__metrics">
                {heroMetrics.map((item, index) => (
                  <MetricCard key={item.label} index={index} shouldLoad={metricsShouldEnter} {...item} />
                ))}
              </motion.div>
            </motion.div>

          </motion.div>
        </section>

        {/* --- "WHAT RACKTRACK DOES" SECTION --- */}
        <ScrollScene className="about-story">
          <div className="about-story__copy">
            <span className="about-eyebrow">What RackTrack Does</span>
            <h2>Rack scanning, inventory, and sync in one AI workflow.</h2>
            <p>
              Capture the rack once, let AI identify the hardware, then push the verified result into your operational systems.
            </p>
          </div>

          <motion.div variants={reveal} className="about-story__stats">
            {signalSteps.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.label}
                  className="about-workflow-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="about-workflow-card__icon" />
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </ScrollScene>

        <ScrollScene className="about-visual-section about-visual-section--reverse">
          <motion.div variants={reveal} className="about-visual-card about-visual-card--workflow-shot">
            <div
              ref={workflowShotRef}
              className="about-workflow-shot"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={resetWorkflowHover}
              onMouseMove={handleWorkflowMouseMove}
            >
              <motion.div
                className="about-workflow-shot__media"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.95, filter: 'blur(18px)' }}
                whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={viewport}
                transition={{ duration: 1.05, ease: cinematicEase }}
              >
                <motion.img
                  src="/media/server.png"
                  alt="RackTrack workflow visualization"
                  style={{ x: workflowImageX, y: workflowImageY }}
                  animate={{ scale: isHoveringImage ? 1.2 : 1.08 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.55 }}
                />
                
                {/* Animation Overlays */}
                <div className="about-workflow-shot__grid" />
                <div className="about-workflow-shot__scanner" />
                
              </motion.div>
              <AnimatePresence>
                {!isHoveringImage && (
                  <motion.div
                    className="about-image-card__overlay about-image-card__overlay--workflow"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.34, ease: cinematicEase }}
                  >
                    <span className="about-eyebrow">Workflow</span>
                    <strong>Compare, approve, sync, and share the rack state across your operating stack</strong>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isHoveringImage && (
                  <motion.div
                    className="custom-lens-cursor"
                    style={{ left: workflowCursorX, top: workflowCursorY }}
                    initial={{ opacity: 0, scale: 0.72 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.72 }}
                    transition={{ duration: 0.2, ease: cinematicEase }}
                  >
                    <Search aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
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
          <video
            className="about-cta__video"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/media/background1.mp4" type="video/mp4" />
          </video>
          <div className="about-cta__beam" />
          <div className="about-cta__content">
            <span className="about-eyebrow">The Next Move</span>
            <h2>Give your team a faster way to understand every rack they touch.</h2>
            <p>
              RackTrack brings scanning, AI recognition, and system sync into one workflow built for real data center operations.
            </p>
            <div className="about-cta__actions">
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                onClick={() => navigate('/contact-us', { state: { scrollTo: 'contact' } })}
                className="about-button about-button--primary"
              >
                Book a Demo
                <ArrowRight className="about-button__icon" />
              </motion.button>
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
