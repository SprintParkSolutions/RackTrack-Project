import './UseCasePage.css'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const networkArticleSections = [
  {
    eyebrow: 'The challenge',
    title: 'Topology drifts away from the rack.',
    body: [
      'Network architects and engineers design the systems that keep every site connected. But the diagrams used to plan, troubleshoot, and defend those systems often drift away from the physical environment.',
      'Every switch port, patch panel connection, uplink, firewall interface, router link, and cable path matters. A single undocumented cable change can create confusion during troubleshooting, audits, migrations, and outage response.',
      'Diagrams are drawn once and updated later. Cable traces are documented during installation but forgotten during change windows. Switch telemetry may show port activity, but it does not always explain what the cable physically connects to.',
      'Over time, the network diagram and the rack reality stop matching. That gap creates risk.',
    ],
  },
  {
    eyebrow: 'Why this matters',
    title: 'Engineers lose time validating basics.',
    body: [
      'When port-level data is not accurate, engineers lose time validating basics before they can solve the actual issue.',
      'They may need to ask whether a cable is connected to the right switch, whether an uplink is patched correctly, whether the diagram matches the rack, whether the CMDB shows the correct port assignment, or which device is actually connected to a port.',
      'When the answer is unclear, troubleshooting slows down. Network architects also struggle during design reviews because the architecture being reviewed may not reflect the real physical network.',
    ],
  },
  {
    eyebrow: 'What RackTrack does',
    title: 'The rack becomes proof.',
    body: [
      'RackTrack gives network teams a visual-first way to verify rack and port-level infrastructure.',
      'Using a rack scan, RackTrack helps identify visible network devices, patch panels, ports, cables, labels, uplinks, and physical rack placement. This information can then be compared against expected topology, diagrams, CMDB records, and switch telemetry.',
      'Instead of relying only on a diagram, teams get a verified physical layer view. RackTrack helps turn the rack into proof.',
    ],
  },
  {
    eyebrow: 'Before RackTrack',
    title: 'Manual tracing slows the network team.',
    body: [
      'Network engineers often depend on manual tracing, outdated diagrams, screenshots, spreadsheets, and verbal knowledge from site teams.',
      'Topology diagrams rarely match the physical cabling. Port-level changes happen in the field but do not reach the system of record. Mis-cabled uplinks are discovered only after issues appear. Architecture reviews are based on expected design, not actual rack reality.',
      'Troubleshooting takes longer because engineers must first verify physical connections. Remote teams depend heavily on someone physically present at the site.',
    ],
  },
  {
    eyebrow: 'With RackTrack',
    title: 'Troubleshooting becomes evidence-based.',
    body: [
      'RackTrack helps network teams verify what is actually present inside the rack. Every rack scan can support port-level visibility, cable reconciliation, rack layout validation, and topology comparison.',
      'This helps engineers move from assumption-based troubleshooting to evidence-based troubleshooting. Instead of asking, "Is the diagram correct?", teams can ask, "What does the rack show right now?"',
    ],
  },
  {
    eyebrow: 'Example scenario',
    title: 'A cleaner core switch migration.',
    body: [
      'A network engineering team is preparing for a core switch migration across several data center rows. The official diagram shows redundant uplinks from each top-of-rack switch to the aggregation layer, but the team suspects some field changes were never updated in the documentation.',
      'Without RackTrack, engineers would need to manually inspect every rack, trace cables, compare switch port outputs, update diagrams, and verify everything with site technicians.',
      'With RackTrack, the site team scans the racks. RackTrack helps identify visible switches, patch panels, cable paths, port labels, and rack placement. The detected rack information can be compared with the expected topology.',
      'The team finds mismatched uplinks before the migration window begins. The result: fewer surprises, cleaner execution, and stronger confidence in the migration plan.',
    ],
  },
]

const networkArticleOutcomes = [
  'Fabric-to-floor agreement between logical network design and physical rack reality.',
  'Every cable run reconciled against expected documentation and operational records.',
  'Mis-cabled uplinks surfaced before they cause outages or delay change windows.',
  'Architecture reviews based on the topology that actually exists.',
  'Faster troubleshooting with less time spent manually tracing cables.',
  'Better collaboration between remote engineers and site technicians.',
]

const networkArticleWorkflow = [
  ['Capture', 'A technician records or photographs the rack using a mobile device.'],
  ['Detect', 'RackTrack identifies visible network devices, patch panels, ports, cables, labels, rack units, and connected infrastructure.'],
  ['Compare', 'The scanned rack data can be compared against network diagrams, CMDB records, switch telemetry, and expected topology.'],
  ['Validate', 'Engineers review mismatches, confirm correct connections, and flag unclear or risky changes.'],
  ['Update', 'Validated information supports updated documentation, better architecture reviews, and cleaner operational records.'],
]

export default function UseCaseNetworkArticlePage() {
  return (
    <main className="use-case-page use-case-article-page">
      <section className="use-case-roles-section use-case-article-route-section">
        <article
          className="use-case-full-article"
          id="network-full-case"
          aria-labelledby="network-full-case-title"
        >
          <div className="use-case-full-article-orbit" aria-hidden="true" />

          <Link className="use-case-article-back" to="/use-cases#network">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>

          <div className="use-case-article-hero">
            <span>Full Case</span>
            <h1 id="network-full-case-title">Network Architects & Engineers</h1>
            <p>
              Port-level topology that matches the cables you can actually
              touch. RackTrack helps network teams connect digital network
              design with physical rack reality.
            </p>
          </div>

          <div className="use-case-article-impact-grid">
            {['Ports verified', 'Cables reconciled', 'Topology trusted'].map((item) => (
              <div key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="use-case-article-body">
            {networkArticleSections.map((section) => (
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
              <h2>What network teams gain.</h2>
              <ul>
                {networkArticleOutcomes.map((outcome) => (
                  <li key={outcome}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span>How RackTrack Works</span>
              <h2>From scan to topology.</h2>
              <ol>
                {networkArticleWorkflow.map(([title, description]) => (
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
            <h2>Network reliability depends on physical truth.</h2>
            <p>
              RackTrack reduces the operational friction caused by unreliable
              network documentation. Engineers spend less time verifying
              physical connections and more time solving real problems.
              Architects make better design decisions from current
              infrastructure reality. Leadership gains fewer outages, faster
              changes, and a network environment that can be trusted from
              diagram to rack.
            </p>
            <Link to="/contact-us">
              Request platform brief
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <Link className="use-case-article-back" to="/use-cases#network">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>
        </article>
      </section>
    </main>
  )
}


