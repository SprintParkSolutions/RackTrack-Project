import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LockKeyhole, Network, Rocket, ChevronRight } from 'lucide-react';
import './AboutUsPage.css';

const timeline = [
  { id: '01', icon: Rocket, title: 'Deploy Racks', text: 'Cluster deployment automation with seamless setup.' },
  { id: '02', icon: Activity, title: 'Monitor Health', text: 'AI-powered monitoring for system health and performance.' },
  { id: '03', icon: Network, title: 'Scale Network', text: 'Dynamic topology scaling with latency-aware routing.' },
  { id: '04', icon: LockKeyhole, title: 'Secure Vault', text: 'Zero-trust architecture with encrypted visibility.' },
];

const showcaseData = [
  {
    title: 'RT-800 Edge Compute Rack',
    desc: 'High-performance rack optimized for intelligent auditing.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Aqua-Chill Cooling Unit',
    desc: 'Energy-efficient liquid cooling system for high-density environments.',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Vector Edge Compute Node',
    desc: 'Scalable compute node with built-in neural processing units.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Titan Security Appliance',
    desc: 'Advanced rack security with biometric and zero-trust protocols.',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'SiteView Data Center IMS',
    desc: 'Intelligent management system for total infrastructure visibility.',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function AboutUsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeShowcase, setActiveShowcase] = useState(0);

  // Innovation Showcase Auto-Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % showcaseData.length);
    }, 4000); // Cycles every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Cinematic Horizontal Scroll Timeline
  useEffect(() => {
    const TOTAL = 4;
    const SENS = 0.0008;
    const TOUCH_SENS = 0.002;
    let progress = 0;
    let target = 0;
    let mode = 'timeline';
    let lastTouchY = 0;
    let rafId: number;

    const track = trackRef.current;
    const bar = barRef.current;
    const secs = document.querySelectorAll('.ab-section');
    const stns = document.querySelectorAll('.ab-station');

    function applyTimeline(p: number) {
      const vw = window.innerWidth;
      if (track) track.style.transform = `translateX(${-p * (TOTAL - 1) * vw}px)`;
      if (bar) bar.style.width = `${p * 100}%`;

      const idx = Math.round(p * (TOTAL - 1));
      secs.forEach((s, i) => s.classList.toggle('active', i === idx));
      stns.forEach((s, i) => s.classList.toggle('active', i <= idx));
    }

    function unlockPage() {
      mode = 'page';
      progress = 1;
      target = 1;
      applyTimeline(1);
      document.documentElement.classList.add('ab-unlocked');
    }

    function relockTimeline() {
      mode = 'timeline';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.classList.remove('ab-unlocked');
      progress = 1;
      target = 0.98;
    }

    function render() {
      if (mode === 'timeline') {
        progress += (target - progress) * 0.1;
        if (Math.abs(target - progress) < 0.0005) progress = target;
        applyTimeline(progress);
        if (target >= 1 && progress >= 0.995) unlockPage();
      }
      rafId = requestAnimationFrame(render);
    }
    render();

    const onWheel = (e: WheelEvent) => {
      if (mode === 'timeline') {
        e.preventDefault();
        target = Math.max(0, Math.min(1, target + e.deltaY * SENS));
      } else {
        if (window.scrollY <= 5 && e.deltaY < 0) {
          e.preventDefault();
          relockTimeline();
          target = Math.max(0, target + e.deltaY * SENS);
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => { lastTouchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = lastTouchY - y;
      if (mode === 'timeline') {
        e.preventDefault();
        target = Math.max(0, Math.min(1, target + delta * TOUCH_SENS));
      } else {
        if (window.scrollY <= 5 && delta < 0) {
          e.preventDefault();
          relockTimeline();
          target = Math.max(0, target + delta * TOUCH_SENS);
        }
      }
      lastTouchY = y;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.classList.remove('ab-unlocked');
    };
  }, []);

  return (
    <main className="about-page">
      {/* 1. HERO TIMELINE */}
      <div className="ab-hero-container" ref={heroRef}>
        <div ref={barRef} className="ab-progress-bar" />
        <div className="ab-grid-overlay" />
        
        {/* Global Ambient Lights */}
        <div className="ab-ambient-bg">
          <div className="ab-orb" id="ab-orb1" />
          <div className="ab-orb" id="ab-orb2" />
        </div>

        <div ref={trackRef} className="ab-h-track">
          
          {/* ZONE 1: Realistic Rack Scan */}
          <div className="ab-section active">
            <div className="ab-section-title">
              <div className="ab-pre-label">Zone 01 // Deploy Racks</div>
              <h1>Auto<br /><em>Audit</em></h1>
              <p className="ab-subtitle">Identify exact components, ports, and vendor models in seconds with intelligent visual sweeps.</p>
            </div>
            
            <div className="ab-section-visual cinematic-scanner-container">
              <div className="rack-visual-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" 
                  alt="Server Rack" 
                  className="rack-bg-img"
                />
                <div className="laser-beam"></div>
                <div className="laser-glow"></div>
                
                {/* Dynamic Holographic UI Labels */}
                <div className="pop-label left l-1">GPU CLUSTER</div>
                <div className="pop-label left l-2">COMPUTE BLADES</div>
                <div className="pop-label left l-3">CORE SWITCH</div>
                
                <div className="pop-label right r-1">STORAGE ARRAY</div>
                <div className="pop-label right r-2">MODEM / PDU</div>
                <div className="pop-label right r-3">FIREWALL</div>
              </div>
            </div>
          </div>

          {/* ZONE 2: Monitor */}
          <div className="ab-section">
            <div className="ab-section-title">
              <div className="ab-pre-label">Zone 02 // Monitor Health</div>
              <h1>Live<br /><em>Vitals</em></h1>
              <p className="ab-subtitle">AI-powered thermal mapping and performance diagnostics running 24/7.</p>
            </div>
            <div className="ab-section-visual cinematic-scanner-container">
              <div className="rack-visual-wrapper monitor-mode">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" 
                  alt="Data Center Corridor" 
                  className="rack-bg-img opacity-50" 
                />
                <div className="thermal-heatmap"></div>
                <div className="status-badge s-ok">THERMAL: NOMINAL</div>
                <div className="status-badge s-warn">I/O: PEAK LOAD</div>
              </div>
            </div>
          </div>

          {/* ZONE 3: Scale */}
          <div className="ab-section">
            <div className="ab-section-title">
              <div className="ab-pre-label">Zone 03 // Scale Network</div>
              <h1>Elastic<br /><em>Mesh</em></h1>
              <p className="ab-subtitle">Dynamic topology scaling with latency-aware routing and automatic failover.</p>
            </div>
            <div className="ab-section-visual cinematic-scanner-container">
              <div className="rack-visual-wrapper mesh-mode">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
                  alt="Motherboard" 
                  className="rack-bg-img opacity-30" 
                />
                <svg className="mesh-svg" width="100%" height="100%" viewBox="0 0 400 400" fill="none">
                  <circle cx="200" cy="200" r="140" fill="none" stroke="#06b6d4" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 6"/>
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#06b6d4" strokeWidth="1"/>
                  <circle cx="200" cy="200" r="24" fill="#0f1923" stroke="#06b6d4" strokeWidth="2"/>
                  <circle cx="200" cy="200" r="6" fill="#06b6d4" className="pulse-dot" />
                  <path d="M200 200 L100 100 M200 200 L300 100 M200 200 L100 300 M200 200 L300 300" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.5" className="mesh-lines"/>
                  <circle cx="100" cy="100" r="8" fill="#fff" />
                  <circle cx="300" cy="100" r="8" fill="#fff" />
                  <circle cx="100" cy="300" r="8" fill="#fff" />
                  <circle cx="300" cy="300" r="8" fill="#fff" />
                </svg>
              </div>
            </div>
          </div>

          {/* ZONE 4: Secure */}
          <div className="ab-section">
            <div className="ab-section-title">
              <div className="ab-pre-label">Zone 04 // Secure Vault</div>
              <h1>Zero<br /><em>Trust</em></h1>
              <p className="ab-subtitle">Encrypted infrastructure visibility with military-grade perimeter defense.</p>
            </div>
            <div className="ab-section-visual cinematic-scanner-container">
              <div className="rack-visual-wrapper secure-mode">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" 
                  alt="Security" 
                  className="rack-bg-img opacity-40" 
                />
                <div className="secure-vault-overlay">
                  <LockKeyhole size={80} className="vault-icon" />
                  <div className="shield-ring r-1"></div>
                  <div className="shield-ring r-2"></div>
                  <div className="status-badge s-ok centered-badge">ENCRYPTION ACTIVE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Bottom Nav (Fades out when unlocked) */}
        <div className="ab-timeline-nav">
          {timeline.map((item, i) => (
            <div key={i} className={`ab-station ${i === 0 ? 'active' : ''}`}>
              <div className="ab-station-dot"><item.icon size={18} /></div>
              <div className="ab-station-meta">Zone {item.id}</div>
            </div>
          ))}
        </div>
        
        <div className="ab-scroll-hint">
          <div className="ab-mouse" />
          <span>Scroll to explore</span>
        </div>
      </div>

      <div className="ab-hero-spacer" />

      {/* 2. MISSION / VISION / VALUES */}
      <div className="ab-below-fold">
        <section className="app-section about-mission">
          <motion.div
            className="about-mission-copy"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="app-eyebrow">◈ About RackTrack</span>
            <h1>Infrastructure that can<span> report itself.</span></h1>
            <p>RackTrack eliminates manual audits, reduces downtime, and ensures complete visibility of racks, devices, ports, and cables through AI.</p>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
            }}
          >
            {[
              { title: 'Mission', desc: 'Simplify and automate data center audits globally.' },
              { title: 'Vision', desc: 'A world where infrastructure is self-aware and self-reporting.' },
              { title: 'Values', desc: 'Accuracy, efficiency, security, and measurable operational impact.' },
            ].map((v, i) => (
              <motion.article 
                key={i} 
                variants={{ 
                  hidden: { opacity: 0, x: 40 }, 
                  visible: { opacity: 1, x: 0 } 
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="ai-glass-card"
              >
                <span>{v.title}</span>
                <p>{v.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* 3. INNOVATION SHOWCASE */}
        <section className="app-section about-showcase">
          <motion.div 
            className="app-section-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="app-eyebrow">◈ Innovation Showcase</span>
            <h2>A new paradigm of data<br/>infrastructure</h2>
            <p>RackTrack is designed for speed, accuracy, resilience, and scalable intelligence.</p>
          </motion.div>

          <div className="showcase-container">
            <div className="showcase-sidebar">
              {showcaseData.map((item, index) => (
                <button
                  key={index}
                  className={`showcase-nav-btn ${activeShowcase === index ? 'active' : ''}`}
                  onClick={() => setActiveShowcase(index)}
                >
                  <span className="showcase-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="showcase-title">{item.title}</span>
                  <ChevronRight size={16} className="showcase-chevron" />
                </button>
              ))}
            </div>

            <div className="showcase-visuals ai-glass-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcase}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="showcase-active-content"
                >
                  <img src={showcaseData[activeShowcase].img} alt={showcaseData[activeShowcase].title} className="showcase-img" />
                  <div className="showcase-overlay">
                    <h3>{showcaseData[activeShowcase].title}</h3>
                    <p>{showcaseData[activeShowcase].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 4. CTA SECTION */}
        <section className="app-section about-cta">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="app-eyebrow">◈ Get Started Free</span>
            <h2>Scale your<br /><em>infrastructure</em><br />intelligently.</h2>
            <p>Join elite teams using RackTrack to automate audits and secure operational visibility.</p>
          </motion.div>
          
          <motion.div 
            className="cta-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form className="about-access-form ai-glass-card-form">
              <input type="email" placeholder="Enter your enterprise email" aria-label="Work email" required />
              <button type="submit">Request Access</button>
            </form>
            <div className="cta-social-proof">
              <div className="avatars">
                <div className="av">R</div><div className="av">S</div><div className="av">K</div>
              </div>
              <span><strong>500+ teams</strong> already on RackTrack</span>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}