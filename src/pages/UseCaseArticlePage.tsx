import './UseCasePage.css'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const infrastructureArticleSections = [
  {
    eyebrow: 'The challenge',
    title: 'The problem is trust.',
    body: [
      'Infrastructure leaders are responsible for keeping the data center estate accurate, scalable, compliant, and ready for every business demand. But most teams still depend on fragmented spreadsheets, outdated rack diagrams, manual audits, and scattered site reports.',
      'Modern infrastructure teams manage hundreds or thousands of assets across multiple rooms, floors, and sites. Every rack contains critical details: servers, switches, patch panels, PDUs, storage devices, ports, serial numbers, labels, and cable connections.',
      'Most inventory records become outdated the moment equipment is moved, replaced, patched, or decommissioned. A small change inside one rack can create confusion across capacity planning, compliance reviews, budgeting, incident response, and audits.',
      'When leadership asks, "What do we actually have?", teams often need days or weeks to confirm the truth.',
    ],
  },
  {
    eyebrow: 'What RackTrack does',
    title: 'Rack reality becomes structured intelligence.',
    body: [
      'RackTrack gives infrastructure leaders a visual-first way to understand the real condition of their data center.',
      'Instead of manually checking every rack and updating multiple systems, teams can capture a single rack image or video. RackTrack analyzes the physical rack and identifies key infrastructure components, including servers, switches, routers, firewalls, patch panels, storage devices, PDUs, load balancers, controllers, rack units, ports, labels, LED status, cables, vendor models, and serial numbers.',
      'This scanned data is then transformed into a clean, searchable source of truth that can be used by network, infrastructure, security, compliance, and operations teams.',
    ],
  },
  {
    eyebrow: 'Why it matters',
    title: 'Leaders can make decisions from evidence.',
    body: [
      'Infrastructure leaders need confidence before making decisions. RackTrack helps them answer which racks are fully utilized, where space is available, which devices are missing from the CMDB, which sites have outdated inventory records, which rack changes happened recently, and whether physical assets match what the team reports.',
      'Instead of relying on assumptions, RackTrack gives leadership a clear view of what is physically present in the rack.',
    ],
  },
  {
    eyebrow: 'Before RackTrack',
    title: 'Manual truth is slow truth.',
    body: [
      'Teams usually manage rack inventory through manual inspections, shared spreadsheets, outdated diagrams, and separate CMDB entries.',
      'This creates common problems: inventory records are months old, rack diagrams do not match the real rack, budget planning is based on incomplete data, multi-site rollouts are delayed by manual verification, audit preparation takes too much time, and leadership cannot quickly confirm infrastructure readiness.',
    ],
  },
  {
    eyebrow: 'With RackTrack',
    title: 'The rack becomes a live data source.',
    body: [
      'RackTrack turns the rack into a live data source. A single scan can help teams detect assets, validate rack layouts, compare physical infrastructure against expected records, and surface missing or mismatched equipment.',
      'The result is faster planning, cleaner reporting, and stronger operational confidence. Infrastructure teams can move from "We think this is accurate" to "We have visual proof."',
    ],
  },
  {
    eyebrow: 'Example scenario',
    title: 'A faster refresh across multiple sites.',
    body: [
      'A global company is preparing for a major infrastructure refresh across multiple data center sites. The infrastructure team needs to confirm available rack space, current device inventory, and outdated hardware before approving the budget.',
      'Before RackTrack, the team would depend on site engineers to manually inspect racks, update spreadsheets, take photos, compare diagrams, and report back. This process could take weeks.',
      'With RackTrack, each site team scans the racks. RackTrack identifies the visible infrastructure, highlights mismatches, and creates a structured view of the rack environment. Leadership can now compare every site using the same data format.',
      'The result: faster planning, fewer surprises, and a stronger business case for infrastructure investment.',
    ],
  },
]

const infrastructureArticleOutcomes = [
  'One source of truth across data centers, remote sites, branch offices, and colocation environments.',
  'Faster multi-site rollouts with clearer site readiness.',
  'Better capacity planning around rack space, power, device density, and hardware refresh cycles.',
  'Stronger budget conversations backed by visual and structured evidence.',
  'Improved audit readiness with scanned rack evidence instead of last-minute proof collection.',
  'A repeatable process for keeping rack data accurate across distributed environments.',
]

const infrastructureArticleWorkflow = [
  ['Capture', 'A technician records a rack using a mobile device or uploads rack images from the site.'],
  ['Detect', 'RackTrack identifies infrastructure components, rack positions, ports, labels, device types, and visible asset details.'],
  ['Reconcile', 'Detected rack data can be compared with CMDB records, switch telemetry, inventory sheets, or existing diagrams.'],
  ['Verify', 'Teams review the detected output, confirm accuracy, and flag missing or mismatched items.'],
  ['Report', 'RackTrack converts rack-level visibility into useful reports for planning, compliance, budgeting, and operations.'],
]

export default function UseCaseArticlePage() {
  return (
    <main className="use-case-page use-case-article-page">
      <section className="use-case-roles-section use-case-article-route-section">
        <article
          className="use-case-full-article"
          id="infrastructure-full-case"
          aria-labelledby="infrastructure-full-case-title"
        >
          <div className="use-case-full-article-orbit" aria-hidden="true" />

          <Link className="use-case-article-back" to="/use-cases#infra-leaders">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>

          <div className="use-case-article-hero">
            <span>Full Case</span>
            <h1 id="infrastructure-full-case-title">
              Infrastructure & Data Center Leaders
            </h1>
            <p>
              One source of truth for every site, every row, every rack.
              RackTrack turns physical rack reality into structured, trusted,
              and continuously updated inventory intelligence.
            </p>
          </div>

          <div className="use-case-article-impact-grid">
            {['Every rack verified', 'Every site reconciled', 'Every plan defensible'].map(
              (item) => (
                <div key={item}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>

          <div className="use-case-article-body">
            {infrastructureArticleSections.map((section) => (
              <section className="use-case-article-section" key={section.title}>
                <span>{section.eyebrow}</span>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="use-case-article-split">
            <div>
              <span>Key Outcomes</span>
              <h2>What leaders gain.</h2>
              <ul>
                {infrastructureArticleOutcomes.map((outcome) => (
                  <li key={outcome}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span>How RackTrack Works</span>
              <h2>From scan to report.</h2>
              <ol>
                {infrastructureArticleWorkflow.map(([title, description]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="use-case-article-final">
            <span>Business Impact</span>
            <h2>Infrastructure leadership depends on accuracy.</h2>
            <p>
              RackTrack is designed to reduce the time and effort required to
              understand physical infrastructure. For infrastructure leaders,
              this means fewer manual audits, fewer data quality debates, and
              faster decision-making. When every site, row, and rack is aligned
              to one trusted source of truth, teams can plan faster, respond
              better, and scale with confidence.
            </p>
            <Link to="/contact-us">
              Talk to our team
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <Link className="use-case-article-back" to="/use-cases#infra-leaders">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>
        </article>
      </section>
    </main>
  )
}
