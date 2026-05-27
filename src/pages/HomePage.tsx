import "./HomePage.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Box,
  Cable,
  CheckCircle2,
  Clock,
  FileCheck,
  Network,
  PlayCircle,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

const capabilities = [
  [
    "Autonomous Asset Identification",
    "Computer vision identifies every device, port, label, and rack unit position — a continuously reconciled digital record from a single phone sweep.",
    "/solutions page images/Automated_Inventory.jpg",
    Box,
  ],
  [
    "Connectivity Intelligence",
    "Port-level mapping of active connections, unused interfaces, cable types, and physical paths — verified against live network telemetry.",
    "/solutions page images/Port_Tracking.jpg",
    Cable,
  ],
  [
    "Visual Rack Intelligence",
    "A continuously reconciled digital twin of your physical rack — topology, device posture, and connectivity — synced to your systems of record.",
    "/solutions page images/Network_Topology.jpg",
    Network,
  ],
  [
    "Posture & Vulnerability Intelligence",
    "Device-level firmware state, vulnerability exposure, and infrastructure posture surfaced per asset — not per fleet average.",
    "/solutions page images/Security_Compliance.jpg",
    ShieldCheck,
  ],
  [
    "Operational Resilience",
    "Spatial search from alert to physical row in seconds. Current device and port state without a detour through stale CMDB records.",
    "/solutions page images/Server_rack-scan.jpg",
    Activity,
  ],
  [
    "Capacity Intelligence",
    "Rack utilization, available slots, and power state mapped to current physical reality — not the last scheduled audit.",
    "/solutions page images/AR_Rack.jpg",
    BarChart3,
  ],
  [
    "Procurement Reconciliation",
    "Reconcile installed hardware against procurement records and asset databases with verified physical evidence.",
    "/solutions page images/AI_Device_Detection.jpg",
    ShoppingCart,
  ],
  [
    "Compliance Evidence Automation",
    "Continuously generated audit artifacts mapped to SOC 2, ISO 27001, HIPAA, and PCI-DSS Requirement 9 — ready before the auditor arrives.",
    "/solutions page images/datacenter-bg.jpg",
    FileCheck,
  ],
] as const;

const problemStats = [
  ["40-60%", "CMDB drift", "Physical reality and records do not match."],
  [
    "~30%",
    "Outage root cause",
    "Outages linked to inventory and config drift.",
  ],
  ["15-20%", "Ghost assets", "Assets still drawing power and license cost."],
  ["3-6 weeks", "Evidence prep", "Manual compliance work per cycle."],
  ["20-40 min", "Incident delay", "Time lost confirming rack truth."],
] as const;

const oldWay = [
  [
    "Manual infrastructure checks",
    "Teams walk the rack to confirm what exists.",
    Clock,
  ],
  [
    "Tool disagreement",
    "CMDB, DCIM, and asset registers drift apart.",
    AlertTriangle,
  ],
  [
    "Slow incidents",
    "Time disappears before the real device is found.",
    XCircle,
  ],
] as const;

const rackTrackWay = [
  [
    "Phone sweep",
    "Capture rack reality with a quick smartphone video.",
    PlayCircle,
  ],
  [
    "Verified output",
    "Inventory, port state, and topology become usable truth.",
    CheckCircle2,
  ],
  ["Operational confidence", "Teams act from current rack evidence.", Zap],
] as const;

const roles = [
  [
    "For Infrastructure Executives",
    "Track physical infrastructure truth with confidence.",
    "/home-role-images/role-infrastructure-leaders.webp",
  ],
  [
    "For Network Architecture",
    "Understand rack, port, and topology state faster.",
    "/home-role-images/role-network-architects.webp",
  ],
  [
    "For Security Posture",
    "Connect device posture to the physical asset.",
    "/home-role-images/role-security-teams.webp",
  ],
  [
    "For Audit & Compliance",
    "Reduce manual evidence collection and blind spots.",
    "/home-role-images/role-compliance-owners.webp",
  ],
  [
    "For Operational Resilience",
    "Find the right device before time is lost.",
    "/home-role-images/role-incident-responders.webp",
  ],
  [
    "For Transformation & M&A",
    "Baseline unknown environments before change.",
    "/home-role-images/role-ma-migration-teams.webp",
  ],
] as const;

const heroSignals = [
  "Infrastructure digitized",
  "Connectivity intelligence",
  "Source of truth, continuously",
] as const;

export default function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const proofVideoRef = useRef<HTMLVideoElement | null>(null);
  const truthVideoRef = useRef<HTMLVideoElement | null>(null);
  const truthSectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(false);
  const [shouldLoadProofVideo, setShouldLoadProofVideo] = useState(false);
  const [shouldLoadTruthVideo, setShouldLoadTruthVideo] = useState(false);
  const [shouldAutoplayTruthVideo, setShouldAutoplayTruthVideo] =
    useState(false);
  const [hasTruthVideoStarted, setHasTruthVideoStarted] = useState(false);
  const [isTruthVideoPlaying, setIsTruthVideoPlaying] = useState(false);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".home-animate-in"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleWatchTour = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    truthSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleTruthVideoPlay = () => {
    setShouldLoadTruthVideo(true);
    setShouldAutoplayTruthVideo(true);
    setHasTruthVideoStarted(true);
  };

  const resetTruthVideoPlayback = () => {
    setShouldAutoplayTruthVideo(false);
    setHasTruthVideoStarted(false);
    setIsTruthVideoPlaying(false);
  };

  useEffect(() => {
    const scheduleIdleLoad = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(callback, { timeout: 1200 });

        return () => window.cancelIdleCallback(id);
      }

      const id = globalThis.setTimeout(callback, 900);

      return () => globalThis.clearTimeout(id);
    };

    const scheduleVideoLoad = () => setShouldLoadHeroVideo(true);

    if (document.readyState === "complete") {
      return scheduleIdleLoad(scheduleVideoLoad);
    }

    let cleanup = () => {};

    const handleWindowLoad = () => {
      cleanup = scheduleIdleLoad(scheduleVideoLoad);
    };

    window.addEventListener("load", handleWindowLoad, { once: true });

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      cleanup();
    };
  }, [shouldLoadHeroVideo]);

  useEffect(() => {
    const video = proofVideoRef.current;

    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setShouldLoadProofVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video || !shouldLoadHeroVideo) {
      return;
    }

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [shouldLoadHeroVideo]);

  useEffect(() => {
    const section = truthSectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setShouldLoadTruthVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAutoplayTruthVideo || !shouldLoadTruthVideo) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const video = truthVideoRef.current;

      if (!video) {
        return;
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setShouldAutoplayTruthVideo(false);
          setHasTruthVideoStarted(false);
          setIsTruthVideoPlaying(false);
        });
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [shouldAutoplayTruthVideo, shouldLoadTruthVideo]);

  return (
    <main className="home-page">
      <section className="home-hero-section">
        <div className="home-grid-bg" />
        <div
          className="home-hero-ambient-orb home-hero-ambient-orb-one"
          aria-hidden="true"
        />
        <div
          className="home-hero-ambient-orb home-hero-ambient-orb-two"
          aria-hidden="true"
        />

        <div
          id="home-tour"
          className="home-hero-bg-video-layer"
          aria-hidden="true"
        >
          {shouldLoadHeroVideo ? (
            <video
              ref={heroVideoRef}
              className="home-hero-bg-video"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
            >
              <source
                src="/solutions page images/server_rack.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              className="home-hero-bg-video"
              src="/solutions page images/Server_rack-scan.jpg"
              alt=""
            />
          )}
          <div className="home-hero-video-fade" />
          <div className="home-hero-scan-sweep" />
        </div>

        <div className="home-hero-copy home-animate-in is-visible">
          <span className="home-eyebrow">
            THE PHYSICAL INFRASTRUCTURE INTELLIGENCE PLATFORM
          </span>
          <h1>
            <span className="home-hero-line home-hero-line-one">
              Your infrastructure,
            </span>
            <em className="home-hero-line home-hero-line-three">
              finally knowable.
            </em>
          </h1>
          <p className="home-hero-copy-text">
            RackTrack transforms rack images and network signals into verified
            infrastructure intelligence — helping teams understand every device,
            port, cable, and physical-to-logical relationship across the rack
            environment. Built on patent-pending innovations for automated
            network cable mapping.
          </p>

          <div className="home-hero-signal-rail" aria-hidden="true">
            {heroSignals.map((signal, index) => (
              <div
                className="home-hero-signal-item"
                key={signal}
                style={{ animationDelay: `${index * 0.6}s` }}
              >
                <span className="home-hero-signal-dot" />
                <span className="home-hero-signal-line" />
                <small>{signal}</small>
              </div>
            ))}
          </div>

          <div className="home-hero-actions home-hero-actions-animated">
            <Link
              to="/contact-us"
              state={{ scrollTo: "contact" }}
              className="home-primary-btn"
            >
              SEE THE PLATFORM <ArrowRight size={18} />
            </Link>

            <a
              href="#home-truth"
              className="home-secondary-btn"
              onClick={handleWatchTour}
            >
              <PlayCircle size={18} />
              REQUEST PLATFORM BRIEF
            </a>
          </div>
        </div>
      </section>

      <section className="home-section home-problem-section home-animate-in">
        <div className="home-section-header">
          <span>Problem</span>
          <h2>
            Your CMDB is outdated. Your DCIM is incomplete. RackTrack is the
            intelligence layer that closes the gap.
          </h2>
          <p>
            Every infrastructure record drifts. Every CMDB lies. Every DCIM has
            blind spots. RackTrack delivers continuous reconciliation between
            the physical world and your operational systems — autonomous,
            verifiable, defensible.
          </p>
        </div>

        <div className="home-problem-timeline">
          {problemStats.map(([value, label, text], index) => (
            <article className="home-problem-card" key={label}>
              <div className="home-problem-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <strong>{value}</strong>
              <h3>{label}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="home-truth"
        ref={truthSectionRef}
        className="home-section home-truth-section home-animate-in"
      >
        <div className="home-truth-visual">
          <div className="home-truth-canvas">
            <div className="home-truth-img-wrap">
              {!isTruthVideoPlaying ? (
                <button
                  type="button"
                  className="home-truth-play-btn"
                  onClick={handleTruthVideoPlay}
                  aria-label="Play RackTrack video"
                >
                  <span className="home-truth-play-icon">
                    <PlayCircle size={32} />
                  </span>
                  <span className="home-truth-play-label">Play video</span>
                </button>
              ) : null}
              <video
                ref={truthVideoRef}
                className="home-truth-video"
                controls={hasTruthVideoStarted}
                playsInline
                preload="none"
                poster="/RackTrack-poster.jpg"
                onPlay={() => {
                  setShouldAutoplayTruthVideo(false);
                  setHasTruthVideoStarted(true);
                  setIsTruthVideoPlaying(true);
                }}
                onPause={() => setIsTruthVideoPlaying(false)}
                onEnded={() => {
                  const video = truthVideoRef.current;
                  if (video) {
                    video.currentTime = 0;
                  }
                  resetTruthVideoPlayback();
                }}
              >
                {shouldLoadTruthVideo ? (
                  <>
                    <source src="/RackTrack-web.mp4" type="video/mp4" />
                  </>
                ) : null}
              </video>
            </div>
          </div>
        </div>

        <div className="home-truth-copy">
          <span>What RackTrack Is</span>
          <h2>
            Physical Infrastructure Intelligence — continuously reconciled
            across your entire footprint.
          </h2>
          <p>
            RackTrack combines computer vision, network telemetry, vendor data,
            and security intelligence into a single platform. One phone sweep
            produces a verified infrastructure digital twin — inventory,
            topology, port state, and firmware posture synced to your
            operational stack.
          </p>

          <div className="home-truth-note">
            From physical rack perception to continuous reconciliation,
            RackTrack gives every team one verified source of infrastructure
            truth.
          </div>
        </div>
      </section>

      <section className="home-section home-capabilities-section home-animate-in">
        <div className="home-section-header">
          <span>Capabilities</span>
          <h2>One platform. Every infrastructure outcome.</h2>
        </div>

        <div className="home-capability-image-grid">
          {capabilities.map(([title, text, image, Icon]) => (
            <article className="home-capability-image-card" key={title}>
              <img src={image} alt={title} loading="lazy" />
              <div className="home-capability-overlay" />
              <div className="home-capability-content">
                <div className="home-capability-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-proof-section home-animate-in">
        <div className="home-section-header">
          <span>Proof</span>
          <h2>
            From manual rack audits to AI-powered infrastructure validation.
          </h2>
        </div>

        <div className="home-proof-compare">
          <article className="home-proof-panel">
            <div className="home-proof-title">
              <XCircle size={28} />
              <div>
                <h3>Legacy infrastructure operations</h3>
                <p>Manual. Slow. Error-prone.</p>
              </div>
            </div>

            <div className="home-proof-image home-proof-image-old">
              <img
                src="/solutions page images/Before_scan.jpg"
                alt="Manual rack scan before RackTrack"
                loading="lazy"
              />
            </div>

            <div className="home-proof-list">
              {oldWay.map(([title, text, Icon]) => (
                <div key={title}>
                  <Icon size={18} />
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                </div>
              ))}
            </div>
          </article>

          <div className="home-proof-vs">VS</div>

          <article className="home-proof-panel home-proof-panel-active">
            <div className="home-proof-title">
              <CheckCircle2 size={28} />
              <div>
                <h3>The intelligence layer</h3>
                <p>Automated. Fast. Verified.</p>
              </div>
            </div>

            <div className="home-proof-image home-proof-image-new">
              <video
                ref={proofVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/solutions page images/Server_rack-scan.jpg"
              >
                {shouldLoadProofVideo ? (
                  <>
                    <source
                      src="/solutions page images/server_rack.mp4"
                      type="video/mp4"
                    />
                    <source
                      src="/solutions page images/server_rack.mp4"
                      type="video/mp4"
                    />
                  </>
                ) : null}
              </video>

              <div className="home-proof-hud">
                <small>Output Ready</small>
                <strong>Rack verified</strong>
                <span>Inventory - Ports - Evidence</span>
              </div>
            </div>

            <div className="home-proof-list">
              {rackTrackWay.map(([title, text, Icon]) => (
                <div key={title}>
                  <Icon size={18} />
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="home-proof-metrics">
          <article>
            <small>Time to characterize a rack</small>
            <strong>2-5 days</strong>
            <p>Manual process without RackTrack</p>
          </article>

          <article className="active">
            <small>With RackTrack</small>
            <strong>Minutes</strong>
            <p>From a smartphone video sweep</p>
          </article>

          <article>
            <small>Modeled annual value</small>
            <strong>$1M-$2.5M</strong>
            <p>Per 500-rack footprint*</p>
          </article>
        </div>
      </section>

      <section className="home-section home-roles-section home-animate-in">
        <div className="home-section-header">
          <span>Who It's For</span>
          <h2>Built for teams responsible for infrastructure truth.</h2>
        </div>

        <div className="home-role-strip">
          {roles.map(([title, text, image]) => (
            <article className="home-role-card" key={title}>
              <img src={image} alt={title} loading="lazy" />
              <div className="home-role-glass">
                <Users size={18} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-final-cta home-animate-in">
        <div className="home-final-orbit" />

        <div className="home-final-bg-art" aria-hidden="true">
          <img
            src="/Images/racktrack-home-truth-generated.png"
            alt=""
            loading="lazy"
          />
          <div className="home-final-bg-fade" />
        </div>

        <div className="home-final-copy">
          <span>See RackTrack In Action</span>
          <h2>
            <span>Begin with one rack. Build toward</span>
            <em>continuous infrastructure intelligence.</em>
          </h2>
          <p>
            Start with a guided assessment on a single rack or row. In minutes,
            see your physical infrastructure reconciled against CMDB and network
            records.
          </p>

          <Link
            to="/contact-us"
            state={{ scrollTo: "contact" }}
            className="home-primary-btn home-final-btn"
          >
            RUN A TOPOLOGY DIAGNOSTIC <Rocket size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
