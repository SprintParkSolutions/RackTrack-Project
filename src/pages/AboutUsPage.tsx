import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  type MotionStyle,
  type Variants,
  useAnimationControls,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Cpu,
  Gauge,
  GraduationCap,
  Handshake,
  Network,
  Radar,
  Search,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import './AboutUsPage.css';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

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

const metricsCardsGroup = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.14,
    },
  },
};

const mobileMetricsCardsGroup = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
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

const mobileMetricCardEntrance = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.56, ease: cinematicEase },
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

const founderNarrative: Array<{ label: string; body: React.ReactNode }> = [
  {
    label: 'The moment',
    body: (
      <>
        RackTrack became obvious during a rack audit where the <strong>spreadsheet, switch labels, and live ports</strong> all told different stories. A team that should have been planning a change was crouched in front of cabinets, reading tiny labels, taking photos, and cross-checking ports by hand.
      </>
    ),
  },
  {
    label: 'The reason',
    body: (
      <>
        One missed cable could delay a migration or send someone back into the data hall after hours. The physical layer deserved the same confidence teams already expect from <strong>cloud dashboards and enterprise systems</strong>.
      </>
    ),
  },
  {
    label: 'The team',
    body: (
      <>
        Our founding team brings <strong>enterprise architecture leadership, Salesforce and MuleSoft integration depth, networking operations experience,</strong> and product design discipline from complex infrastructure environments.
      </>
    ),
  },
  {
    label: 'The build',
    body: (
      <>
        We are building a practical system of record for the rack: fast capture, AI-assisted verification, and clean sync into the tools operations, audit, and service teams already run.
      </>
    ),
  },
];

const teamMembers = [
  {
    name: 'Co-Founder, Enterprise Architecture',
    role: 'Founder',
    credential: 'Enterprise architecture leadership across integration-heavy operating environments.',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Co-Founder, Network Intelligence',
    role: 'Founder',
    credential: 'Networking expertise with hands-on physical infrastructure and port-level workflow depth.',
    icon: Network,
  },
  {
    name: 'Senior Architecture Advisors',
    role: 'Advisors',
    credential: 'Guidance from leaders with Salesforce, MuleSoft, CMDB, and enterprise platform experience.',
    icon: Award,
  },
  {
    name: 'Academic & Technical Fellows',
    role: 'Advisors',
    credential: 'Academic and fellowship credentials including IET Fellow and Senior IEEE Member experience.',
    icon: GraduationCap,
  },
  {
    name: 'Design Partners',
    role: 'Partners',
    credential: 'Infrastructure teams shaping scan flows, audit outputs, and operational handoffs.',
    icon: Handshake,
  },
  {
    name: 'Product & Engineering Hires',
    role: 'Team',
    credential: 'Specialists in applied AI, product design, and production-grade systems integration.',
    icon: Users,
  },
];

const investors: Array<{ name: string; logo?: string }> = [];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  ));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQueryList.matches);

    updateMatches();

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateMatches);
    } else {
      mediaQueryList.addListener(updateMatches);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', updateMatches);
      } else {
        mediaQueryList.removeListener(updateMatches);
      }
    };
  }, [query]);

  return matches;
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  index = 0,
  shouldLoad = true,
  prefersLightMotion = false,
  variants = metricCardEntrance,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
  index?: number;
  shouldLoad?: boolean;
  prefersLightMotion?: boolean;
  variants?: Variants;
}) {
  const ref = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clickSequenceRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const pressControls = useAnimationControls();

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

  const replayLoading = useCallback(async () => {
    if (clickSequenceRef.current) return;
    clickSequenceRef.current = true;

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isLoadingRef.current = false;
    await pressControls.start({ scale: 0.96, transition: { duration: 0.08, ease: 'easeOut' } });
    await pressControls.start({ scale: 1, transition: { duration: 0.18, ease: cinematicEase } });
    setIsLoaded(false);
    setCount(0);
    runLoadingSequence();
    clickSequenceRef.current = false;
  }, [pressControls, runLoadingSequence]);

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
      variants={variants}
      custom={index}
      className="about-metric-card"
      onMouseMove={prefersLightMotion ? undefined : handleMouseMove}
      whileHover={prefersLightMotion ? undefined : { y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="about-metric-card__glow"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(122, 223, 255, 0.15), transparent 80%)`,
        }}
      />
      <motion.div
        className="about-metric-card__inner"
        animate={pressControls}
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
              exit={prefersLightMotion ? { opacity: 0, scale: 1.04 } : { opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: cinematicEase }}
              className="about-metric-card__counter"
            >
              {count}%
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={prefersLightMotion ? { opacity: 0, y: 14 } : { opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={prefersLightMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
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
      </motion.div>
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

function TeamCard({
  name,
  role,
  credential,
  icon: Icon,
}: {
  name: string;
  role: string;
  credential: string;
  icon: IconType;
}) {
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty('--about-card-x', `${x}%`);
    event.currentTarget.style.setProperty('--about-card-y', `${y}%`);
  };

  return (
    <motion.article
      className="about-team-card"
      variants={reveal}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      onPointerMove={handlePointerMove}
    >
      <div className="about-team-card__icon">
        <Icon aria-hidden="true" />
      </div>
      <div>
        <span>{role}</span>
        <h3>{name}</h3>
        <p>{credential}</p>
      </div>
    </motion.article>
  );
}

function FounderStorySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const stepRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const steps = stepRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!steps.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!activeEntry) return;

        const nextIndex = Number(activeEntry.target.getAttribute('data-story-index'));
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root: null,
        rootMargin: '-46% 0px -46% 0px',
        threshold: [0, 0.35, 0.7, 1],
      },
    );

    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  return (
    <ScrollScene className="about-founder-story">
      <motion.aside className="about-founder-story__anchor" variants={reveal}>
        <span className="about-founder-story__eyebrow">Founder Narrative</span>
        <h2>
          Why We Built <span className="about-founder-story__brand">RackTrack</span>
        </h2>
      </motion.aside>

      <motion.div className="about-founder-story__narrative" variants={reveal}>
        {founderNarrative.map((item, index) => (
          <article
            className={`about-founder-story__thought${activeIndex === index ? ' is-active' : ''}`}
            key={item.label}
          >
            <h3>{item.label}</h3>
            <div className="about-founder-story__body">
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </motion.div>
      <div className="about-founder-story__scroll-steps" aria-hidden="true">
        {founderNarrative.map((item, index) => (
          <span
            ref={(node) => {
              stepRefs.current[index] = node;
            }}
            className="about-founder-story__scroll-step"
            data-story-index={index}
            key={item.label}
          />
        ))}
      </div>
    </ScrollScene>
  );
}

export default function AboutUsPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const isMobileViewport = useMediaQuery('(max-width: 768px)');
  const prefersLightMotion = reducedMotion || isMobileViewport;
  // General Page Spotlight
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(32);
  const lightX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.1 });
  const lightY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.1 });
  const spotlight = useMotionTemplate`radial-gradient(54rem circle at ${lightX}% ${lightY}%, rgba(122, 223, 255, 0.18), rgba(95, 168, 255, 0.08) 34%, transparent 68%)`;

  // Workflow Image Parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });
  const heroParallaxY = useTransform(heroScrollYProgress, [0, 1], [prefersLightMotion ? 0 : -90, prefersLightMotion ? 0 : 120]);
  const heroImageY = useMotionTemplate`${heroParallaxY}px`;

  const workflowShotRef = useRef<HTMLDivElement>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const { scrollYProgress: workflowScrollYProgress } = useScroll({
    target: workflowShotRef,
    offset: ['start end', 'end start'],
  });
  const workflowParallaxY = useTransform(workflowScrollYProgress, [0, 1], [prefersLightMotion ? 0 : -24, prefersLightMotion ? 0 : 42]);
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

  const handleWorkflowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersLightMotion) return;
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
      onMouseMove={prefersLightMotion ? undefined : (event) => {
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
        <motion.section
          ref={heroRef}
          className="about-hero"
          style={{ '--about-hero-image-y': heroImageY } as MotionStyle}
        >
          <div className="about-hero__content">
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
        </motion.section>

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

        <FounderStorySection />

        <ScrollScene className="about-visual-section about-visual-section--reverse">
          <motion.div variants={reveal} className="about-visual-card about-visual-card--workflow-shot">
            <div
              ref={workflowShotRef}
              className="about-workflow-shot"
              onMouseEnter={prefersLightMotion ? undefined : () => setIsHoveringImage(true)}
              onMouseLeave={prefersLightMotion ? undefined : resetWorkflowHover}
              onMouseMove={prefersLightMotion ? undefined : handleWorkflowMouseMove}
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
                {isHoveringImage && !prefersLightMotion && (
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

        <motion.div
          className="about-hero__metrics"
          variants={isMobileViewport ? mobileMetricsCardsGroup : metricsCardsGroup}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          aria-label="RackTrack platform metrics"
        >
          {heroMetrics.map((item, index) => (
            <MetricCard
              key={item.label}
              index={index}
              prefersLightMotion={prefersLightMotion}
              variants={isMobileViewport ? mobileMetricCardEntrance : metricCardEntrance}
              {...item}
            />
          ))}
        </motion.div>

        <ScrollScene className="about-team-section">
          <div className="about-team-section__header">
            <span className="about-eyebrow">Team</span>
            <h2>Built by operators who understand both the rack and the systems around it.</h2>
            <p>
              RackTrack combines infrastructure operations, enterprise integration, and applied AI experience so scan output can become trusted operational data.
            </p>
          </div>
          <motion.div
            className="about-team-grid"
            variants={metricsCardsGroup}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {teamMembers.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </motion.div>
        </ScrollScene>

        {investors.length > 0 && (
          <ScrollScene className="about-backers-section">
            <div className="about-backers-section__header">
              <span className="about-eyebrow">Investors & Backers</span>
              <h2>Backed by teams who understand infrastructure operations.</h2>
            </div>
            <div className="about-backers-grid">
              {investors.map((investor) => (
                <article className="about-backer-card" key={investor.name}>
                  {investor.logo ? <img src={investor.logo} alt={`${investor.name} logo`} /> : <span>{investor.name}</span>}
                </article>
              ))}
            </div>
          </ScrollScene>
        )}

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
