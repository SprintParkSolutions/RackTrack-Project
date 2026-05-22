import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Network,
  Shield,
  X,
} from 'lucide-react'
import {
  createRackTrackLead,
  type RackTrackLeadPayload,
} from '../services/salesforceApi'
import './ResourcesPage.css'

const gatedAssets = [
  {
    id: 'roi-calculator',
    type: 'Interactive Calculator',
    title: 'ROI Calculator',
    description:
      'Estimate the operational value of RackTrack across audit readiness, time saved, and avoidable infrastructure waste.',
    tags: ['Finance', 'Business Case'],
    icon: Calculator,
    comingSoon: false,
  },
  {
    id: 'buyers-guide',
    type: 'Buyer Guide',
    title: "Buyer's Guide to Physical Intelligence",
    description:
      'A concise guide to physical layer intelligence, where current approaches fall short, and what enterprise teams should evaluate before buying.',
    tags: ['Strategy', 'Category'],
    icon: BookOpen,
    comingSoon: false,
  },
  {
    id: 'compliance-mapping',
    type: 'Reference Guide',
    title: 'Compliance Mapping',
    description:
      'See how RackTrack outputs support SOC 2, ISO 27001, HIPAA, and PCI-DSS Requirement 9 for compliance and audit teams.',
    tags: ['SOC 2', 'ISO 27001', 'HIPAA'],
    icon: Shield,
    comingSoon: false,
  },
  {
    id: 'integration-reference',
    type: 'Integration Guide',
    title: 'Integration Reference',
    description:
      'A high-level view of how RackTrack fits into CMDB, DCIM, and ITSM environments without changing existing operating models.',
    tags: ['CMDB', 'DCIM', 'ITSM'],
    icon: Network,
    comingSoon: false,
  },
  {
    id: 'case-studies',
    type: 'Customer Stories',
    title: 'Design Partner Case Studies',
    description:
      'Early outcomes and lessons from design partners. Register to get notified when approved customer stories are available.',
    tags: ['Results', 'Early Access'],
    icon: FileText,
    comingSoon: true,
  },
] as const

type Asset = (typeof gatedAssets)[number]

const blogPosts = [
  {
    id: 'cmdb-drift',
    category: 'Operations',
    title: 'The Cost of CMDB Drift',
    excerpt:
      'When the CMDB drifts from physical reality, every downstream decision built on it becomes less reliable.',
    readTime: '7 min',
    image: '/solutions page images/Automated_Inventory.jpg',
  },
  {
    id: 'manual-audit-failure',
    category: 'Infrastructure',
    title: 'The Failure Modes of Manual Rack Audits',
    excerpt:
      'Manual audits are slow, expensive, and often out of date before the work is complete.',
    readTime: '6 min',
    image: '/solutions page images/Server_rack-scan.jpg',
  },
  {
    id: 'evidence-grade',
    category: 'Strategy',
    title: 'The Case for Evidence-Grade Inventory',
    excerpt:
      'Defensible infrastructure inventory starts with traceable evidence, not static records or assumptions.',
    readTime: '8 min',
    image: '/solutions page images/Security_Compliance.jpg',
  },
  {
    id: 'missing-link',
    category: 'Security',
    title: 'Physical Layer: The Missing Link in Infrastructure Security',
    excerpt:
      'Network tools see what is active on the network, not what is physically in the rack. That gap is where risk accumulates.',
    readTime: '9 min',
    image: '/solutions page images/Network_Topology.jpg',
  },
  {
    id: 'soc2-readiness',
    category: 'Compliance',
    title: 'How Infrastructure Teams Prepare for SOC 2 Audits',
    excerpt:
      'SOC 2 Type II requires continuous evidence of asset control. Here is how teams can generate it systematically.',
    readTime: '10 min',
    image: '/solutions page images/AI_Device_Detection.jpg',
  },
  {
    id: 'dcim-vs-reality',
    category: 'Operations',
    title: 'DCIM vs. Physical Reality: Why the Gap Matters',
    excerpt:
      'DCIM platforms model intent. Understanding the gap between model and reality helps teams solve the right problem.',
    readTime: '7 min',
    image: '/solutions page images/Port_Tracking.jpg',
  },
  {
    id: 'hidden-cost',
    category: 'Finance',
    title: 'The Hidden Cost of Wrong Rack Inventory',
    excerpt:
      'Misidentified hardware, premature refreshes, and wasted capacity often go unmeasured until they become costly.',
    readTime: '8 min',
    image: '/solutions page images/Before_scan.jpg',
  },
  {
    id: 'network-verified',
    category: 'Infrastructure',
    title: 'What "Network-Verified" Actually Means',
    excerpt:
      'Reconciling physical presence with live network state is what makes infrastructure inventory trustworthy.',
    readTime: '6 min',
    image: '/Images/RackScan.jpg',
  },
] as const

const initialForm: RackTrackLeadPayload = {
  fullName: '',
  email: '',
  companyName: '',
  rackCount: '',
  requirement: '',
  description: '',
  mobileCountry: '+1',
  mobileNumber: '',
}

type SubmitState = 'idle' | 'sending' | 'sent' | 'error'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function ResourcesPage() {
  const pageRef = useRef<HTMLElement>(null)
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null)
  const [form, setForm] = useState<RackTrackLeadPayload>(initialForm)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal-on-scroll') ?? []
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!activeAsset) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeAsset])

  const openModal = (asset: Asset) => {
    setActiveAsset(asset)
    setSubmitState('idle')
    setFormMessage('')
    setForm({ ...initialForm, requirement: `Resource Access: ${asset.title}` })
  }

  const closeModal = () => {
    setActiveAsset(null)
    setSubmitState('idle')
    setFormMessage('')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (submitState !== 'idle') {
      setSubmitState('idle')
      setFormMessage('')
    }
  }

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()

    if (!form.fullName.trim()) {
      setSubmitState('error')
      setFormMessage('Please enter your full name.')
      return
    }

    if (!isValidEmail(form.email)) {
      setSubmitState('error')
      setFormMessage('Please enter a valid work email address.')
      return
    }

    if (!form.mobileNumber.trim()) {
      setSubmitState('error')
      setFormMessage('Please enter your mobile number.')
      return
    }

    setSubmitState('sending')
    setFormMessage('')

    const response = await createRackTrackLead(form)

    if (response.success) {
      setSubmitState('sent')
      setFormMessage(response.message || 'Your request has been submitted.')
      return
    }

    setSubmitState('error')
    setFormMessage(response.message || 'Could not submit right now. Please try again.')
  }

  return (
    <main className="res-page" ref={pageRef}>
      <section className="app-section res-hero">
        <div className="res-hero__grid" aria-hidden="true" />

        <div className="res-hero__content">
          <span className="app-eyebrow">Resources</span>
          <h1>
            <span className="res-h1-line">Research tools,</span>
            <span className="res-h1-line">evaluation guides,</span>
            <span className="res-h1-line res-h1-grad">and category insights.</span>
          </h1>
          <p>
            Practical resources for infrastructure, operations, and security teams
            evaluating physical layer intelligence.
          </p>
        </div>
      </section>

      <section className="app-section res-gated reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Gated Assets</span>
          <h2>Resources built for serious evaluation.</h2>
          <p>
            Practical evaluation materials for infrastructure, operations, and
            security teams. Request access and the RackTrack team will share the
            right asset directly.
          </p>
        </div>

        <div className="res-asset-grid">
          {gatedAssets.map((asset, index) => {
            const Icon = asset.icon

            return (
              <article
                key={asset.id}
                className={`res-asset-card${asset.comingSoon ? ' res-asset-card--soon' : ''}`}
                style={{ '--ci': index } as CSSProperties}
              >
                <div className="res-asset-card__top">
                  <span className="res-asset-type">{asset.type}</span>
                  <span className="res-asset-lock" aria-hidden="true">
                    <Lock size={14} strokeWidth={2} />
                  </span>
                </div>

                <div className="res-asset-icon">
                  <span className="res-asset-icon-ring" />
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <h3>{asset.title}</h3>
                <p>{asset.description}</p>

                <div className="res-asset-tags">
                  {asset.tags.map((tag) => (
                    <span key={tag} className="res-asset-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {asset.comingSoon ? (
                  <span className="res-asset-btn res-asset-btn--soon">Notify Me When Ready</span>
                ) : (
                  <button
                    type="button"
                    className="res-asset-btn"
                    onClick={() => openModal(asset)}
                  >
                    Get Access
                    <ArrowRight size={14} />
                  </button>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="app-section res-blog reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Thought Leadership</span>
          <h2>Insights on infrastructure accuracy and operational trust.</h2>
          <p>
            Public content on inventory drift, audit defensibility, and how
            teams can evaluate physical layer intelligence with more clarity.
          </p>
        </div>

        <div className="res-blog-grid">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className="res-blog-card"
              style={{ '--ci': index } as CSSProperties}
            >
              <div className="res-blog-card__image">
                <img src={post.image} alt="" loading="lazy" decoding="async" />
                <span className="res-blog-category">{post.category}</span>
              </div>
              <div className="res-blog-card__body">
                <div className="res-blog-meta">
                  <Clock size={12} />
                  <span>{post.readTime} read</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="res-blog-coming">Coming Soon</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeAsset && (
        <div
          className="res-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div
            className="res-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="res-modal-title"
          >
            <button type="button" className="res-modal-close" aria-label="Close" onClick={closeModal}>
              <X size={18} />
            </button>

            <div className="res-modal-header">
              <span className="res-modal-type">{activeAsset.type}</span>
              <h3 id="res-modal-title">{activeAsset.title}</h3>
              <p>{activeAsset.description}</p>
            </div>

            {submitState === 'sent' ? (
              <div className="res-modal-success">
                <div className="res-modal-success__icon">
                  <CheckCircle2 size={32} />
                </div>
                <h4>Request submitted.</h4>
                <p>
                  Our team will send access to <strong>{form.email}</strong> within one
                  business day.
                </p>
                <button type="button" className="res-modal-done" onClick={closeModal}>
                  Done
                </button>
              </div>
            ) : (
              <form className="res-modal-form" onSubmit={handleSubmit} noValidate>
                <div className="res-modal-row">
                  <label className="res-modal-label">
                    <span>Full name <em>*</em></span>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Jane Smith"
                      value={form.fullName}
                      autoComplete="name"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="res-modal-label">
                    <span>Work email <em>*</em></span>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      autoComplete="email"
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <div className="res-modal-row">
                  <label className="res-modal-label">
                    <span>Company <span className="res-modal-opt">(optional)</span></span>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Acme Corp"
                      value={form.companyName}
                      autoComplete="organization"
                      onChange={handleChange}
                    />
                  </label>
                  <label className="res-modal-label">
                    <span>Mobile number <em>*</em></span>
                    <div className="res-modal-phone">
                      <select
                        name="mobileCountry"
                        value={form.mobileCountry}
                        onChange={handleChange}
                        aria-label="Country code"
                      >
                        <option value="+1">US +1</option>
                        <option value="+44">UK +44</option>
                        <option value="+91">IN +91</option>
                        <option value="+61">AU +61</option>
                        <option value="+49">DE +49</option>
                      </select>
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="(555) 000-0000"
                        value={form.mobileNumber}
                        autoComplete="tel-national"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`app-primary-btn res-modal-submit is-${submitState}`}
                  disabled={submitState === 'sending'}
                >
                  {submitState === 'sending'
                    ? 'Sending...'
                    : submitState === 'error'
                      ? 'Try Again'
                      : 'Request Access'}
                  {submitState === 'error' ? <AlertCircle size={16} /> : <ArrowRight size={16} />}
                </button>

                {formMessage && (
                  <p
                    className={`res-modal-status res-modal-status--${submitState}`}
                    role={submitState === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    {formMessage}
                  </p>
                )}

                <p className="res-modal-disclaimer">
                  Your details go to the RackTrack team only. No third-party distribution.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
