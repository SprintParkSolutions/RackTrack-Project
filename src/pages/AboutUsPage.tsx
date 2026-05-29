import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
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
import {
  Cpu,
  Gauge,
  Network,
  Radar,
  Search,
  Shield,
  Sparkles,
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
  { label: 'Truth fidelity', value: '99.2%', detail: 'Verified device and port recognition', icon: Shield },
  { label: 'Time to verified state', value: 'Minutes', detail: 'from rack capture to operational context', icon: Radar },
  { label: 'Manual operations reduced', value: '34%', detail: 'less manual discovery and triage', icon: Zap },
];

const signalSteps = [
  { label: 'Capture', value: 'Phone-guided rack sensing', icon: Cpu },
  { label: 'Validate', value: 'Physical-to-network truth', icon: Gauge },
  { label: 'Reconcile', value: 'Structured intelligence', icon: Network },
  { label: 'Operationalize', value: 'Audit-ready artifacts', icon: Sparkles },
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
        RackTrack is built on patent-pending innovations for <strong>automated network cable mapping, visual rack intelligence, and physical infrastructure reconciliation</strong>. The architecture came out of eighteen months of engineering work, and is now the subject of a pending US utility patent application.
      </>
    ),
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

  useEffect(() => {
    if (!prefersLightMotion) return;

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isLoadingRef.current = false;
    setCount(100);
    setIsLoaded(true);
  }, [prefersLightMotion]);

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
    if (prefersLightMotion) return;

    if (isInView && shouldLoad) {
      startLoading();
    }
  }, [isInView, shouldLoad, startLoading, prefersLightMotion]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  if (prefersLightMotion) {
    return (
      <motion.article
        ref={ref}
        variants={variants}
        custom={index}
        className="about-metric-card"
      >
        <div className="about-metric-card__inner about-metric-card__inner--static">
          <div className="about-metric-card__content about-metric-card__content--static">
            <div className="about-metric-card__header">
              <Icon className="about-card-icon" />
              <span>{label}</span>
            </div>
            <strong>{value}</strong>
            <p>{detail}</p>
          </div>
        </div>
      </motion.article>
    );
  }

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
        onClick={prefersLightMotion ? undefined : replayLoading}
        onKeyDown={(event) => {
          if (prefersLightMotion) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            replayLoading();
          }
        }}
        role={prefersLightMotion ? undefined : 'button'}
        tabIndex={prefersLightMotion ? -1 : 0}
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




function FounderStorySection() {
  const isMobileViewport = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const stepRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (isMobileViewport) {
      setActiveIndex(0);
      return undefined;
    }

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
  }, [isMobileViewport]);

  return (
    <ScrollScene className="about-founder-story">
      <motion.aside className="about-founder-story__anchor" variants={reveal}>
        <span className="about-founder-story__eyebrow">Founder Narrative</span>
        <p className="about-founder-story__intro">
          The story behind <span className="about-founder-story__brand">RackTrack</span>.
        </p>
      </motion.aside>

      <motion.div className="about-founder-story__narrative" variants={reveal}>
        {founderNarrative.map((item, index) => (
          <article
            className={`about-founder-story__thought${isMobileViewport || activeIndex === index ? ' is-active' : ''}`}
            key={item.label}
          >
            <h3>{item.label}</h3>
            <div className="about-founder-story__body">
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </motion.div>
      {!isMobileViewport && (
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
      )}
    </ScrollScene>
  );
}

export default function AboutUsPage() {
  const reducedMotion = useReducedMotion();
  const isMobileViewport = useMediaQuery('(max-width: 768px)');
  const prefersLightMotion = reducedMotion || isMobileViewport;
  // General Page Spotlight
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(32);
  const lightX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.1 });
  const lightY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.1 });
  const spotlight = useMotionTemplate`radial-gradient(54rem circle at ${lightX}% ${lightY}%, rgba(122, 223, 255, 0.18), rgba(95, 168, 255, 0.08) 34%, transparent 68%)`;


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
          className="about-hero"
        >
          <div className="about-hero__content">
            <motion.span
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="about-founder-story__eyebrow"
            >
              Our Story
            </motion.span>

            <motion.h1
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="about-hero__story-title"
            >
              Why we built{' '}
              <span className="about-founder-story__brand">RackTrack</span>
            </motion.h1>

            <motion.blockquote
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="about-hero__quote"
            >
              Every system above the rack assumed the rack matched the record. No system could prove it.
            </motion.blockquote>

            <motion.p
              variants={reveal}
              initial="hidden"
              animate="visible"
              className="about-hero-caption"
            >
              Two decades of running enterprise infrastructure - and one problem that never went away. We stopped waiting for someone else to solve it.
            </motion.p>
          </div>

          <motion.div
            className="about-hero__images"
            variants={reveal}
            initial="hidden"
            animate="visible"
          >
            <img
              src="/Images/AboutUs_hero.png"
              alt="RackTrack infrastructure"
              className="about-hero__img"
            />
          </motion.div>
        </motion.section>

        {/* --- "WHAT RACKTRACK DOES" SECTION --- */}
        <ScrollScene className="about-story">
          <div className="about-story__copy">
            <span className="about-eyebrow">What RackTrack Does</span>
            <h2>Physical infrastructure intelligence - captured, validated, reconciled, and operationalized.</h2>
            <p>
              One phone sweep produces a continuously reconciled digital twin of your physical rack - inventory, topology, port state, and firmware posture synced to every system your teams already run.
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
          <div className="about-cta__beam" />
          <div className="about-cta__content">
            <span className="about-eyebrow">Our mission</span>
            <h2>Build the Physical Infrastructure Intelligence Platform for data centers.</h2>
            <p className="about-cta__lead">
              Not an audit tool. Not a DCIM replacement. The intelligence layer underneath both.
            </p>
            <div className="about-cta__signals" aria-label="Mission highlights">
              <span>Not an audit tool</span>
              <span>Not a DCIM replacement</span>
              <span>Patent pending platform</span>
            </div>
            <p className="about-cta__meta">
              Built to make physical infrastructure legible, trusted, and operational at enterprise scale. US Application 19/219,347.
            </p>
            <p>
              Not an audit tool. Not a DCIM replacement.
              The intelligence layer underneath both. Patent Pending - US Application 19/219,347.
            </p>
          </div>
        </ScrollScene>
      </main>
    </div>
  );
}




