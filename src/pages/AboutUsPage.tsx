import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Gauge, Network, Radar, Shield, Sparkles, Zap } from 'lucide-react';

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
  const ref = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
    if (isInView) {
      startLoading();
    }
  }, [isInView, startLoading]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return (
    <article ref={ref} className="about-metric-card">
      <motion.div
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
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
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
                <span>{label}</span>
                <Icon className="about-card-icon" />
              </div>
              <strong>{value}</strong>
              <p>{detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </article>
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
                <span className="about-hero-title__line-1">Scan the rack.</span>
                <span className="about-hero-title__line-2">
                  <span className="about-hero-title__accent">Know the stack.</span>
                </span>
              </motion.h1>

              <motion.p variants={reveal} className="about-hero-caption">
                RackTrack turns a quick phone sweep into verified devices, ports, topology, and inventory your team can trust.
              </motion.p>

              <motion.div variants={reveal} className="about-hero__actions">
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
            </motion.div>
          </motion.div>
        </section>

        <section className="about-metrics-section" aria-label="RackTrack platform metrics">
          <div className="about-metrics-console">
            <svg
              className="about-metrics-cables"
              viewBox="0 0 758 270"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                className="about-metrics-cable about-metrics-cable--body"
                x1="21%"
                y1="50%"
                x2="50%"
                y2="50%"
              />
              <motion.line
                className="about-metrics-cable about-metrics-cable--current"
                x1="21%"
                y1="50%"
                x2="50%"
                y2="50%"
                strokeDasharray="16 22"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -76 }}
                transition={{ duration: 1.15, ease: 'linear', repeat: Infinity }}
              />

              <line
                className="about-metrics-cable about-metrics-cable--body"
                x1="50%"
                y1="50%"
                x2="79%"
                y2="50%"
              />
              <motion.line
                className="about-metrics-cable about-metrics-cable--current"
                x1="50%"
                y1="50%"
                x2="79%"
                y2="50%"
                strokeDasharray="16 22"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -76 }}
                transition={{ duration: 1.15, ease: 'linear', repeat: Infinity, delay: 0.18 }}
              />
            </svg>

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
          </div>
        </section>

        {/* --- REDESIGNED "WHAT RACKTRACK DOES" SECTION --- */}
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
            <div className="about-workflow-shot">
              <motion.div
                className="about-workflow-shot__media"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.95, filter: 'blur(18px)' }}
                whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={viewport}
                transition={{ duration: 1.05, ease: cinematicEase }}
              >
                {/* Replace src with your generated image path */}
                <img src="/media/server.png" alt="RackTrack workflow visualization" />
                
                {/* NEW: Animation Overlays */}
                <div className="about-workflow-shot__grid" />
                <div className="about-workflow-shot__scanner" />
                
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
