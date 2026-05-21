import "./HomePage.css";
import { useEffect, useRef } from "react";
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
    "Physical Inventory",
    "Every device in every rack, identified and verified continuously.",
    "/solutions page images/Automated_Inventory.jpg",
    Box,
  ],
  [
    "Port & Cable Intelligence",
    "Every port, cable, and connection mapped and searchable.",
    "/solutions page images/Port_Tracking.jpg",
    Cable,
  ],
  [
    "Topology & 3D Twin",
    "A living visual view of your data center infrastructure.",
    "/solutions page images/Network_Topology.jpg",
    Network,
  ],
  [
    "Security Posture",
    "Firmware and vulnerability posture surfaced per device.",
    "/solutions page images/Security_Compliance.jpg",
    ShieldCheck,
  ],
  [
    "Incident Response",
    "Find the right device and port before opening the rack.",
    "/solutions page images/Server_rack-scan.jpg",
    Activity,
  ],
  [
    "Capacity Planning",
    "Plan against measured physical reality, not old spreadsheets.",
    "/solutions page images/AR_Rack.jpg",
    BarChart3,
  ],
  [
    "Procurement Guidance",
    "Identify compatible parts and modules with confidence.",
    "/solutions page images/AI_Device_Detection.jpg",
    ShoppingCart,
  ],
  [
    "Compliance Evidence",
    "Generate audit-ready artifacts continuously.",
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
  ["Manual tracing", "Teams walk the rack to confirm what exists.", Clock],
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
    "Infrastructure Leaders",
    "Track physical infrastructure truth with confidence.",
    "/solutions page images/datacenter-bg.jpg",
  ],
  [
    "Network Architects",
    "Understand rack, port, and topology state faster.",
    "/solutions page images/Network_Topology.jpg",
  ],
  [
    "Security Teams",
    "Connect device posture to the physical asset.",
    "/solutions page images/Security_Compliance.jpg",
  ],
  [
    "Compliance Owners",
    "Reduce manual evidence collection and blind spots.",
    "/solutions page images/Automated_Inventory.jpg",
  ],
  [
    "Incident Responders",
    "Find the right device before time is lost.",
    "/solutions page images/Server_rack-scan.jpg",
  ],
  [
    "M&A and Migration Teams",
    "Baseline unknown environments before change.",
    "/solutions page images/Port_Tracking.jpg",
  ],
] as const;

const heroSignals = [
  "Rack captured",
  "Ports verified",
  "Topology trusted",
] as const;

export default function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const truthSectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video) {
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
  }, []);

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
          <video
            ref={heroVideoRef}
            className="home-hero-bg-video"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/Images/racktrack-home-hero-generated.png"
          >
            <source
              src="/solutions page images/server_rack.mp4"
              type="video/mp4"
            />
            <source src="/media/server_rack.mp4" type="video/mp4" />
          </video>
          <div className="home-hero-video-fade" />
          <div className="home-hero-scan-sweep" />
        </div>

        <div className="home-hero-copy home-animate-in is-visible">
          <span className="home-eyebrow">Physical Intelligence Layer</span>
          <h1>
            <span className="home-hero-line home-hero-line-one">
              Point your phone at the rack.
            </span>
            <em className="home-hero-line home-hero-line-three">
              Get a network you can trust.
            </em>
          </h1>
          <p className="home-hero-copy-text">
            RackTrack is the Physical Intelligence Layer for the modern data
            center. Verified inventory, port-level topology, firmware posture,
            and compliance evidence — from a smartphone video sweep.
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
              Book a demo <ArrowRight size={18} />
            </Link>

            <a
              href="#home-truth"
              className="home-secondary-btn"
              onClick={handleWatchTour}
            >
              <PlayCircle size={18} />
              Watch tour
            </a>
          </div>
        </div>
      </section>

      <section className="home-section home-problem-section home-animate-in">
        <div className="home-section-header">
          <span>Problem</span>
          <h2>Your CMDB lies. Your DCIM guesses. Nobody owns the truth.</h2>
          <p>
            Every system above the rack describes what should be there. Neither
            describes what is actually in the rack right now.
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
              <img
                src="/Images/racktrack-home-truth-generated.png"
                alt="RackTrack truth layer visualization"
                className="home-truth-fallback"
                loading="lazy"
              />
              <div className="home-truth-scan-line" />
            </div>
            <div className="home-truth-corner home-truth-corner-tl" aria-hidden="true" />
            <div className="home-truth-corner home-truth-corner-tr" aria-hidden="true" />
            <div className="home-truth-corner home-truth-corner-bl" aria-hidden="true" />
            <div className="home-truth-corner home-truth-corner-br" aria-hidden="true" />
            <div className="home-truth-badge home-truth-badge-inv" aria-hidden="true">
              <span className="home-truth-badge-dot" />
              <div>
                <small>Inventory</small>
                <strong>Verified</strong>
              </div>
            </div>
            <div className="home-truth-badge home-truth-badge-topo" aria-hidden="true">
              <span className="home-truth-badge-dot" />
              <div>
                <small>Topology</small>
                <strong>Mapped</strong>
              </div>
            </div>
            <div className="home-truth-badge home-truth-badge-posture" aria-hidden="true">
              <span className="home-truth-badge-dot" />
              <div>
                <small>Posture</small>
                <strong>Current</strong>
              </div>
            </div>
            <div className="home-truth-glow" aria-hidden="true" />
          </div>
        </div>

        <div className="home-truth-copy">
          <span>What RackTrack Is</span>
          <h2>The Physical Intelligence Layer for the modern data center.</h2>
          <p>
            RackTrack captures physical rack state, verifies it against your
            live network, and turns it into a continuously reconciled truth
            layer.
          </p>

          <div className="home-truth-note">
            Not an audit tool. Not a DCIM replacement. The truth layer
            underneath both.
          </div>
        </div>
      </section>

      <section className="home-section home-capabilities-section home-animate-in">
        <div className="home-section-header">
          <span>Capabilities</span>
          <h2>One sweep. Eight infrastructure outcomes.</h2>
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
          <h2>From manual rack validation to minutes.</h2>
        </div>

        <div className="home-proof-compare">
          <article className="home-proof-panel">
            <div className="home-proof-title">
              <XCircle size={28} />
              <div>
                <h3>Without RackTrack</h3>
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
                <h3>With RackTrack</h3>
                <p>Automated. Fast. Verified.</p>
              </div>
            </div>

            <div className="home-proof-image home-proof-image-new">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/solutions page images/Server_rack-scan.jpg"
              >
                <source
                  src="/solutions page images/server_rack.mp4"
                  type="video/mp4"
                />
                <source src="/media/server_rack.mp4" type="video/mp4" />
              </video>

              <div className="home-proof-scan-box" />
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
          <span>Baseline Assessment</span>
          <h2>
            <span>See your rack.</span>
            <em>RackTrack sees it.</em>
          </h2>
          <p>
            Twenty minutes. One rack or one row. Compare CMDB truth, network
            truth, and what RackTrack actually finds.
          </p>

          <Link
            to="/contact-us"
            state={{ scrollTo: "contact" }}
            className="home-primary-btn home-final-btn"
          >
            Book a baseline assessment <Rocket size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
