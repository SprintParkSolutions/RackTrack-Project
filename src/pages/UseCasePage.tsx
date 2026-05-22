import './UseCasePage.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BellRing,
  Building2,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Network,
  Sparkles,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'

const useCaseHeroImage = '/use-case-images/use-case-hero.png'

const roleCards = [
  {
    id: 'infra-leaders',
    navLabel: 'Infra Leaders',
    number: '01',
    icon: Building2,
    title: 'Infrastructure & Data Center Leaders',
    pain:
      "You can't manage what you can't measure, and what you measure today is months old. Every leadership review starts with a footnote on data quality.",
    racktrack:
      'One source of truth across every site, every row, every rack, continuously reconciled. Budget conversations move from spreadsheet arguments to capacity planning.',
    signal: '100%',
    signalLabel: 'Sites on one source of truth',
    outcomes: [
      'Multi-site rollouts complete in a quarter, not a fiscal year',
      'Capacity planning runs against current state, not the last audit',
      'CapEx defenses backed by evidence the CFO accepts the first time',
    ],
  },
  {
    id: 'network',
    navLabel: 'Network',
    number: '02',
    icon: Network,
    title: 'Network Architects & Engineers',
    pain:
      'The diagram you draw and the cable you trace rarely match. Port-level changes happen in the field and never make it back to the system of record.',
    racktrack:
      'Port-level topology that matches the cables you can actually touch, and stays current because verification happens every time a phone walks the row.',
    signal: '99.6%',
    signalLabel: 'Fabric to floor agreement',
    outcomes: [
      'Every cable run reconciled against LLDP/CDP within the change window',
      'Mis-cabled uplinks surfaced before they become an outage',
      'Architecture reviews run against the topology that exists, not the one you drew',
    ],
  },
  {
    id: 'security',
    navLabel: 'Security',
    number: '03',
    icon: ShieldCheck,
    title: 'Security & Vulnerability Teams',
    pain:
      "Your vulnerability management starts from incomplete inventory. Agents don't run on switches, patch panels, or PDUs. The CMDB lags. By the time you have a clean asset list, the CVE is two months old.",
    racktrack:
      "Start from a complete inventory of every physical device, including the ones agents can't reach. Firmware posture and vulnerability state, surfaced per device, in real time.",
    signal: '0',
    signalLabel: 'Agent blind spots in scope',
    outcomes: [
      'Patch panels, PDUs, OOB controllers all visible to the program',
      'Firmware posture per device, not per fleet average',
      'CVE triage starts from a list you can defend, not one you are still building',
    ],
  },
  {
    id: 'compliance',
    navLabel: 'Compliance',
    number: '04',
    icon: FileCheck2,
    title: 'Compliance & Audit Owners',
    pain:
      "Three to six weeks of evidence prep, every cycle, and the auditor still finds gaps. Half your team's quarter disappears into screenshots and spreadsheets.",
    racktrack:
      'Audit-ready evidence generated continuously, mapped to SOC 2, ISO 27001, HIPAA, and PCI-DSS Requirement 9. The day the auditor arrives, the artifact already exists.',
    signal: '<1 day',
    signalLabel: 'Evidence prep, end-to-end',
    outcomes: [
      'Continuous mapping to SOC 2, ISO 27001, HIPAA, PCI-DSS Req 9',
      'Variance surfaced before the auditor finds it',
      'Every record carries a timestamped verification with a citable source',
    ],
  },
  {
    id: 'incident',
    navLabel: 'Incident',
    number: '05',
    icon: BellRing,
    title: 'Incident Responders & On-Call',
    pain:
      "Twenty to forty minutes of every incident lost confirming what's actually in the rack, before the real work starts.",
    racktrack:
      'Find the device, find the port, before you open the door. Spatial search, current state, no detour through three other systems.',
    signal: '-35 min',
    signalLabel: 'Median MTTL recovered',
    outcomes: [
      'Spatial search from page-out to physical row in seconds',
      'Current device state without a detour through DCIM and CMDB',
      'Runbooks that start at the rack, not at the asset tag',
    ],
  },
  {
    id: 'ma',
    navLabel: 'M&A',
    number: '06',
    icon: GitBranch,
    title: 'M&A & Migration Teams',
    pain:
      'You inherit an unknown footprint with no current documentation. Characterizing it the old way means quarters of work before the integration plan can start.',
    racktrack:
      'Walk the rows with a phone. Days later, you have the inventory, topology, and posture you would otherwise spend a quarter assembling.',
    signal: '10 days',
    signalLabel: 'From sweep to defensible plan',
    outcomes: [
      "Diligence runs against ground truth, not the seller's spreadsheet",
      'Integration plans built on the inventory that exists today',
      'Migration risk surfaced before close, not after',
    ],
  },
]

const heroStats = [
  { value: '6', label: 'Roles, one platform' },
  { value: '<10 days', label: 'Time to defensible inventory' },
  { value: '99.6%', label: 'Fabric to floor agreement' },
]

const fullCaseRoutes = [
  '/use-cases/infrastructure-data-center-leaders',
  '/use-cases/network-architects-engineers',
  '/use-cases/security-vulnerability-teams',
  '/use-cases/compliance-audit-owners',
  '/use-cases/incident-responders-on-call',
  '/use-cases/ma-migration-teams',
]

export default function UseCasePage() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.use-case-role-card'))

    if (!cards.length) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -10% 0px' },
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="use-case-page">
      <section className="use-case-hero">
        <div
          className="use-case-hero-bg"
          style={{ backgroundImage: `url(${useCaseHeroImage})` }}
          aria-hidden="true"
        />
        <div className="use-case-hero-grid" aria-hidden="true" />

        <div className="use-case-hero-copy">
          <span className="use-case-eyebrow">Use Cases</span>

          <h1>
            <span>Six roles. One</span>
            <strong>source of truth.</strong>
          </h1>

          <p>
            How RackTrack lands for the people who own the rack, framed in the
            language they already use in the room.
          </p>

          <div className="use-case-role-tabs" aria-label="Use case roles">
            <span className="use-case-role-indicator" aria-hidden="true" />
            {roleCards.map((role) => (
              <a href={`#${role.id}`} key={role.id}>
                {role.navLabel}
              </a>
            ))}
          </div>

          <div className="use-case-hero-stats">
            {heroStats.map((stat) => (
              <div className="use-case-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="use-case-roles-section" aria-labelledby="use-case-roles-title">
        <div className="use-case-roles-header">
          <span>By Role</span>
          <h2 id="use-case-roles-title">
            The people who own the <strong>rack.</strong>
          </h2>
          <p>
            Each role lives with a specific failure mode of the current stack.
            Each one gets a specific surface.
          </p>
        </div>

        <div className="use-case-role-card-list">
          {roleCards.map((role, index) => {
            const Icon = role.icon

            return (
              <article className="use-case-role-card" id={role.id} key={role.id}>
                <div className="use-case-role-icon" aria-hidden="true">
                  <Icon size={28} strokeWidth={2.1} />
                </div>

                <div className="use-case-role-main">
                  <span className="use-case-role-kicker">/{role.number} - Role</span>
                  <h3>{role.title}</h3>

                  <div className="use-case-role-columns">
                    <div className="use-case-role-story-panel use-case-role-story-panel-pain">
                      <span>
                        <TriangleAlert aria-hidden="true" size={15} />
                        Pain
                      </span>
                      <p>{role.pain}</p>
                    </div>
                    <div className="use-case-role-story-bridge" aria-hidden="true">
                      <i />
                    </div>
                    <div className="use-case-role-story-panel use-case-role-story-panel-solution">
                      <span>
                        <Sparkles aria-hidden="true" size={15} />
                        With RackTrack
                      </span>
                      <p>{role.racktrack}</p>
                    </div>
                  </div>

                  <ul className="use-case-role-outcomes">
                    {role.outcomes.map((outcome) => (
                      <li key={outcome}>
                        <CheckCircle2 aria-hidden="true" size={17} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="use-case-role-actions">
                    <Link to={fullCaseRoutes[index]}>Read the full case</Link>
                    <a href="/contact-us">Talk to our team</a>
                  </div>
                </div>

                <aside className="use-case-role-signal">
                  <span>Signal</span>
                  <strong>{role.signal}</strong>
                  <p>{role.signalLabel}</p>
                </aside>
              </article>
            )
          })}
        </div>
      </section>

      <section className="use-case-next-step" aria-labelledby="use-case-next-step-title">
        <div className="use-case-next-step-card">
          <span>Next Step</span>
          <h2 id="use-case-next-step-title">
            Bring the role you
            <br />
            own into the room.
          </h2>
          <p>
            We'll scope the sweep, the reconciliation, and the artifact your
            stakeholder needs, in the language of the role you actually work in.
          </p>
          <Link to="/contact-us" className="use-case-next-step-button">
            Talk to our team
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
