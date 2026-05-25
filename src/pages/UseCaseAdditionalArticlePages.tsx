import './UseCasePage.css'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

type ArticleSection = {
  eyebrow: string
  title: string
  body: string[]
}

type ArticleConfig = {
  id: string
  backHash: string
  title: string
  subtitle: string
  impact: string[]
  sections: ArticleSection[]
  outcomesTitle: string
  outcomes: string[]
  workflowTitle: string
  workflow: [string, string][]
  finalTitle: string
  finalBody: string
}

function UseCaseArticleTemplate({ article }: { article: ArticleConfig }) {
  return (
    <main className="use-case-page use-case-article-page">
      <section className="use-case-roles-section use-case-article-route-section">
        <article
          className="use-case-full-article"
          id={article.id}
          aria-labelledby={`${article.id}-title`}
        >
          <div className="use-case-full-article-orbit" aria-hidden="true" />

          <Link className="use-case-article-back" to={`/use-cases#${article.backHash}`}>
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>

          <div className="use-case-article-hero">
            <span>Full Case</span>
            <h1 id={`${article.id}-title`}>{article.title}</h1>
            <p>{article.subtitle}</p>
          </div>

          <div className="use-case-article-impact-grid">
            {article.impact.map((item) => (
              <div key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="use-case-article-body">
            {article.sections.map((section) => (
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
              <h2>{article.outcomesTitle}</h2>
              <ul>
                {article.outcomes.map((outcome) => (
                  <li key={outcome}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span>How RackTrack Works</span>
              <h2>{article.workflowTitle}</h2>
              <ol>
                {article.workflow.map(([title, description]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="use-case-article-final">
            <span>Final Message</span>
            <h2>{article.finalTitle}</h2>
            <p>{article.finalBody}</p>
            <Link to="/contact-us">
              Talk to our team
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <Link className="use-case-article-back" to={`/use-cases#${article.backHash}`}>
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Roles
          </Link>
        </article>
      </section>
    </main>
  )
}

const securityArticle: ArticleConfig = {
  id: 'security-full-case',
  backHash: 'security',
  title: 'Security & Vulnerability Teams',
  subtitle:
    'Vulnerability management starts with complete inventory. RackTrack helps security teams close blind spots by starting from the physical rack itself.',
  impact: ['Inventory complete', 'Blind spots surfaced', 'Risk in scope'],
  sections: [
    {
      eyebrow: 'The challenge',
      title: 'Security teams cannot protect assets they cannot see.',
      body: [
        'Every vulnerability program depends on one basic truth: the asset list must be complete. But in real data center environments, that truth is often difficult to maintain.',
        'Agents do not run on every device. Switches, patch panels, PDUs, firewalls, controllers, appliances, and out-of-band devices can be missed by traditional scanning tools.',
        'A vulnerability team may believe they are working from a complete asset list while critical physical infrastructure remains outside the scope.',
      ],
    },
    {
      eyebrow: 'Why this matters',
      title: 'Incomplete inventory means incomplete vulnerability management.',
      body: [
        'If an asset is missing from inventory, it may also be missing from vulnerability scans, firmware tracking, patch planning, and risk reporting.',
        'Teams may not know which physical devices lack agent coverage, which switches or appliances are running outdated firmware, which rack-level devices are missing from the CMDB, or whether reported vulnerability scope matches the data center floor.',
      ],
    },
    {
      eyebrow: 'What RackTrack does',
      title: 'A physical-first view of infrastructure.',
      body: [
        'Using rack images or video, RackTrack helps identify visible devices inside the rack, including switches, servers, firewalls, routers, patch panels, PDUs, controllers, storage devices, labels, ports, and rack positions.',
        'This physical inventory can be compared against the CMDB, vulnerability scanner scope, agent coverage, firmware records, and device ownership data.',
        'The result is a clearer view of what exists, what is missing, and what needs to be brought into scope.',
      ],
    },
    {
      eyebrow: 'Before RackTrack',
      title: 'Digital-only visibility leaves gaps.',
      body: [
        'Agent-based tools miss devices that cannot run agents. Network scans may not identify all physical infrastructure correctly. Patch panels, PDUs, and OOB controllers are often excluded from normal visibility.',
        'The CMDB may lag behind actual rack changes, firmware posture is tracked inconsistently, and CVE triage starts before the team has a complete asset list.',
      ],
    },
    {
      eyebrow: 'With RackTrack',
      title: 'Start from verified physical inventory.',
      body: [
        'Instead of assuming the asset list is complete, teams can scan the rack and compare visible infrastructure against systems of record.',
        'RackTrack helps teams move from "these are the assets our tools found" to "these are the assets physically present and in scope."',
      ],
    },
    {
      eyebrow: 'Example scenario',
      title: 'Critical CVE response with fewer blind spots.',
      body: [
        'A security team receives a critical CVE affecting a specific firewall and network appliance firmware version. The scanner shows several impacted devices, but the team is unsure whether all physical appliances are included in scan scope.',
        'With RackTrack, the site team scans the racks. RackTrack helps identify visible devices, labels, rack locations, and infrastructure components that may not be fully represented in the vulnerability system.',
        'The team quickly finds devices that were physically present but missing from scan scope, resulting in faster triage and a vulnerability response based on real infrastructure coverage.',
      ],
    },
  ],
  outcomesTitle: 'What security teams gain.',
  outcomes: [
    'Zero agent blind spots in scope for devices traditional agent tools may miss.',
    'Complete rack-level asset visibility across physical infrastructure.',
    'Firmware posture per device rather than incomplete fleet averages.',
    'Better CVE triage from a trusted asset list.',
    'Visual proof for audits, compliance reviews, and leadership reporting.',
    'Better collaboration with infrastructure and network teams.',
  ],
  workflowTitle: 'From scan to prioritized risk.',
  workflow: [
    ['Capture', 'A technician scans or photographs the rack using a mobile device.'],
    ['Detect', 'RackTrack identifies devices, rack positions, labels, ports, patch panels, PDUs, and rack-level details.'],
    ['Compare', 'Detected physical inventory is compared with CMDB records, scanner scope, agent coverage, and firmware data.'],
    ['Surface gaps', 'RackTrack highlights assets that are physically present but missing from security workflows.'],
    ['Prioritize', 'Security teams use verified inventory to improve CVE triage, firmware reviews, and remediation planning.'],
  ],
  finalTitle: 'Security starts with visibility.',
  finalBody:
    'A vulnerability program is only as strong as the inventory behind it. If devices are missing from scope, risk is missing from the report. RackTrack helps security and vulnerability teams bring physical infrastructure into view, close agent blind spots, and build vulnerability decisions on complete rack-level truth.',
}

const complianceArticle: ArticleConfig = {
  id: 'compliance-full-case',
  backHash: 'compliance',
  title: 'Compliance & Audit Owners',
  subtitle:
    'Audit-ready evidence generated continuously. RackTrack helps compliance teams move from last-minute evidence collection to rack-level proof.',
  impact: ['Evidence ready', 'Variance surfaced', 'Proof traceable'],
  sections: [
    {
      eyebrow: 'The challenge',
      title: 'Evidence is prepared after the fact.',
      body: [
        'Compliance teams do not fail audits only because controls are missing. They often struggle because evidence is scattered across screenshots, spreadsheets, ticket comments, rack photos, CMDB exports, and manual confirmations.',
        'Compliance owners need evidence that is accurate, timestamped, traceable, and easy to defend. But evidence preparation still often takes weeks.',
        'By the time the audit begins, the team is forced to reconstruct what happened instead of showing a clean, continuous record of what exists.',
      ],
    },
    {
      eyebrow: 'Why this matters',
      title: 'Physical infrastructure changes often.',
      body: [
        'Frameworks like SOC 2, ISO 27001, HIPAA, and PCI-DSS require organizations to prove that assets, controls, access, changes, and infrastructure records are properly managed.',
        'Devices are added, cables are moved, hardware is replaced, patch panels are updated, and CMDB records may lag behind actual rack reality.',
        'When evidence is not continuously maintained, compliance teams spend too much time chasing proof.',
      ],
    },
    {
      eyebrow: 'What RackTrack does',
      title: 'Visual scans become audit-ready evidence.',
      body: [
        'Using rack images or video, RackTrack captures the physical state of infrastructure and turns it into structured, reviewable evidence.',
        'This helps teams document what devices exist, where they are located, whether records match the rack, and when verification occurred.',
        'Instead of waiting until audit season, teams can continuously build a reliable evidence trail.',
      ],
    },
    {
      eyebrow: 'Before RackTrack',
      title: 'Audit prep is manual and reactive.',
      body: [
        'Evidence preparation takes three to six weeks every cycle. Teams rely on screenshots and spreadsheets that are hard to verify. Auditors find gaps between CMDB records and physical infrastructure.',
        'Infrastructure teams are interrupted repeatedly, records lack clear timestamps or visual proof, and audit readiness depends on memory, manual effort, and last-minute cleanup.',
      ],
    },
    {
      eyebrow: 'With RackTrack',
      title: 'Evidence becomes part of normal operations.',
      body: [
        'Every scan creates a clearer view of rack-level infrastructure. Each verified record can carry timestamp, physical location, asset identity, rack position, and visual source context.',
        'The team can show what exists, when it was verified, and how it maps to compliance requirements.',
      ],
    },
    {
      eyebrow: 'Example scenario',
      title: 'SOC 2 evidence without the scramble.',
      body: [
        'A compliance team preparing for a SOC 2 audit needs proof that physical infrastructure inventory is accurate, current, and mapped to control requirements.',
        'With RackTrack, the team already has recent rack scans and verified asset evidence. They can show which devices were identified, when the rack was verified, and where records match or differ from the system of record.',
        'The result is faster evidence preparation, fewer surprises, and a stronger audit response.',
      ],
    },
  ],
  outcomesTitle: 'What compliance teams gain.',
  outcomes: [
    'Evidence preparation in less than one day.',
    'Continuous mapping to SOC 2, ISO 27001, HIPAA, and PCI-DSS.',
    'Variance surfaced before the auditor finds it.',
    'Timestamped verification for every rack record.',
    'Citable visual source for every inventory claim.',
    'A repeatable process for control evidence collection.',
  ],
  workflowTitle: 'From scan to audit evidence.',
  workflow: [
    ['Capture', 'A technician scans or photographs the rack during normal site operations.'],
    ['Detect', 'RackTrack identifies devices, rack positions, labels, patch panels, PDUs, ports, and infrastructure details.'],
    ['Verify', 'Teams review detected output and confirm whether rack data is accurate.'],
    ['Map', 'Verified evidence is aligned to internal controls and frameworks like SOC 2, ISO 27001, HIPAA, and PCI-DSS.'],
    ['Report', 'Compliance teams use verified records as audit-ready evidence with timestamps and source context.'],
  ],
  finalTitle: 'Audit confidence starts before the audit.',
  finalBody:
    'When every rack record has a source, a timestamp, and a verified connection to the physical environment, compliance becomes easier to prove. RackTrack helps compliance and audit owners move from reactive evidence collection to continuous audit readiness.',
}

const incidentArticle: ArticleConfig = {
  id: 'incident-full-case',
  backHash: 'incident',
  title: 'Incident Responders & On-Call',
  subtitle:
    'Find the device. Find the port. Before you open the door. RackTrack gives responders current rack-level visibility before they reach the aisle.',
  impact: ['Device located', 'Port identified', 'Runbook started'],
  sections: [
    {
      eyebrow: 'The challenge',
      title: 'Incident response should begin with action.',
      body: [
        'During an incident, every minute matters. But responders often lose the first twenty to forty minutes confirming basic physical details.',
        'When an alert fires, the responder may know the hostname, IP address, switch name, or asset tag, but that does not always translate into a clear physical location.',
        'They still need to know which rack the device is in, which row to walk to, which port is connected, whether the CMDB location is correct, and whether the diagram is still accurate.',
      ],
    },
    {
      eyebrow: 'Why this matters',
      title: 'Searching delays recovery.',
      body: [
        'A simple hardware issue, failed uplink, mispatched cable, offline device, or power problem can take longer to resolve because the physical location is unclear.',
        'Responders often jump between DCIM, CMDB, monitoring tools, spreadsheets, old diagrams, and messaging threads before they can start real work.',
        'That delay increases mean time to locate, mean time to respond, and mean time to recover.',
      ],
    },
    {
      eyebrow: 'What RackTrack does',
      title: 'A spatial view of the rack environment.',
      body: [
        'Using visual rack scans, RackTrack helps identify devices, rack positions, visible ports, labels, cables, and current physical placement.',
        'Responders can quickly locate the device, understand rack context, and begin the runbook from the correct physical point.',
        'RackTrack helps answer the most important first question: where exactly do I need to go?',
      ],
    },
    {
      eyebrow: 'Before RackTrack',
      title: 'Urgent situations start with verification.',
      body: [
        'The CMDB says one location, but the device is somewhere else. Rack diagrams are not updated after field changes. Asset tags do not quickly map to physical rack position.',
        'Responders lose time asking site teams to confirm basic details, moving between tools and racks before real troubleshooting begins.',
      ],
    },
    {
      eyebrow: 'With RackTrack',
      title: 'Start from current rack truth.',
      body: [
        'A responder can search by device, rack, port, row, asset label, or site context and quickly understand where the issue is located.',
        'This reduces detours through multiple systems and helps the team move directly from alert to action. Instead of starting at the asset tag, responders can start at the rack.',
      ],
    },
    {
      eyebrow: 'Example scenario',
      title: 'Packet loss response without tool-hopping.',
      body: [
        'A monitoring alert shows packet loss from a critical application server connected through a top-of-rack switch. The on-call engineer needs to confirm switch, port, cable path, and physical rack location.',
        'With RackTrack, the engineer searches the device or switch context, sees the current rack location, identifies the related physical area, and starts the runbook from the correct rack.',
        'The result is faster location, fewer detours, and quicker recovery.',
      ],
    },
  ],
  outcomesTitle: 'What incident teams gain.',
  outcomes: [
    'Faster mean time to locate affected devices and ports.',
    'Spatial search from page-out to physical row.',
    'Current device state without tool-hopping.',
    'Runbooks that start at the rack.',
    'Better confidence during high-pressure incidents.',
    'Shorter path from alert to action.',
  ],
  workflowTitle: 'From alert to rack-level clarity.',
  workflow: [
    ['Capture', 'Site teams scan racks during normal operations or after infrastructure changes.'],
    ['Detect', 'RackTrack identifies devices, rack positions, labels, ports, cables, and physical rack context.'],
    ['Search', 'Responders search for a device, port, rack, row, asset label, or related infrastructure detail.'],
    ['Locate', 'RackTrack shows where the device is physically located and the surrounding rack context.'],
    ['Respond', 'The incident runbook begins from the real rack location, reducing wasted time.'],
  ],
  finalTitle: 'Incident response should not begin with a search party.',
  finalBody:
    'When every device, port, and rack location is easier to find, responders can act faster and recover faster. RackTrack helps on-call teams move from alert to rack-level clarity in seconds.',
}

const migrationArticle: ArticleConfig = {
  id: 'ma-full-case',
  backHash: 'ma',
  title: 'M&A & Migration Teams',
  subtitle:
    'Turn an unknown footprint into a defensible migration plan. RackTrack helps teams understand inherited infrastructure by starting from the rack itself.',
  impact: ['Footprint known', 'Risk surfaced', 'Plan defensible'],
  sections: [
    {
      eyebrow: 'The challenge',
      title: 'Inherited environments are rarely clean.',
      body: [
        'Mergers, acquisitions, consolidations, and migrations often begin with one major problem: nobody fully trusts the infrastructure documentation.',
        'The acquired site may have old spreadsheets, partial rack diagrams, missing CMDB records, unclear device ownership, and network details that no longer match the physical floor.',
        'Before a migration plan can begin, teams must first build trust in the inventory. That process can take weeks or even months.',
      ],
    },
    {
      eyebrow: 'Why this matters',
      title: 'Migration planning depends on accurate data.',
      body: [
        'If the team does not know what exists, they cannot confidently decide what to keep, replace, move, retire, secure, or integrate.',
        'Teams need to know which assets are installed, which devices are active, which systems are undocumented, which network paths are critical, which hardware is risky, and where the biggest migration risks are.',
        'Without clear rack-level visibility, the integration plan becomes guesswork.',
      ],
    },
    {
      eyebrow: 'What RackTrack does',
      title: 'Rapidly characterize inherited infrastructure.',
      body: [
        'Using rack scans, RackTrack identifies visible devices, rack positions, labels, ports, cables, patch panels, PDUs, switches, servers, firewalls, routers, storage units, and other physical components.',
        'This gives migration teams a current, visual, and structured understanding of the environment.',
        'Instead of waiting months to manually assemble inventory and topology, RackTrack helps teams build a defensible plan in days.',
      ],
    },
    {
      eyebrow: 'Before RackTrack',
      title: 'Planning starts from uncertain assumptions.',
      body: [
        'Due diligence depends on seller-provided spreadsheets. Inventory is incomplete or outdated. Teams discover risks late in the integration process.',
        'Network and security teams spend weeks validating basic rack details, budget estimates are uncertain, and leadership cannot confidently approve the migration plan.',
      ],
    },
    {
      eyebrow: 'With RackTrack',
      title: 'Walk the rows with a phone.',
      body: [
        'RackTrack helps teams scan the environment, identify what exists today, compare it against available records, and surface unknowns early.',
        'Instead of asking, "Can we trust the seller’s spreadsheet?", teams can ask, "What does the floor actually show?"',
      ],
    },
    {
      eyebrow: 'Example scenario',
      title: 'A clearer inherited data center footprint.',
      body: [
        'A company acquires a regional business with multiple data center rooms and inherited network environments. Seller spreadsheets, rack diagrams, and CMDB exports may not match the floor.',
        'With RackTrack, site teams scan rows using mobile devices. RackTrack helps identify visible assets, rack positions, labels, patch panels, PDUs, switches, servers, and network equipment.',
        'Within days, the migration team has a clearer picture of what exists, what is missing from documentation, and where the highest risks are.',
      ],
    },
  ],
  outcomesTitle: 'What migration teams gain.',
  outcomes: [
    'From sweep to defensible plan in 10 days.',
    'Diligence runs against ground truth, not seller spreadsheets.',
    'Integration plans built on current inventory.',
    'Migration risk surfaced before close.',
    'Faster cross-team alignment across infrastructure, network, security, compliance, and finance.',
    'Stronger confidence in budget and timeline estimates.',
  ],
  workflowTitle: 'From unknown footprint to plan.',
  workflow: [
    ['Capture', 'Site teams walk rows and scan racks using a mobile device.'],
    ['Detect', 'RackTrack identifies infrastructure components, rack positions, labels, cables, ports, patch panels, PDUs, and device types.'],
    ['Compare', 'Scanned rack data is compared with seller spreadsheets, CMDB exports, diagrams, DCIM records, and migration inventories.'],
    ['Surface risk', 'RackTrack highlights missing records, unknown assets, mismatched rack data, unclear topology, and review areas.'],
    ['Plan', 'Migration teams use verified inventory and topology context to build a phased, defensible integration plan.'],
  ],
  finalTitle: 'Migration success depends on knowing what you inherited.',
  finalBody:
    'RackTrack helps M&A and migration teams turn unknown infrastructure into verified inventory, topology context, and practical migration intelligence. When the plan is built on ground truth, the migration becomes faster, cleaner, and easier to defend.',
}

export function UseCaseSecurityArticlePage() {
  return <UseCaseArticleTemplate article={securityArticle} />
}

export function UseCaseComplianceArticlePage() {
  return <UseCaseArticleTemplate article={complianceArticle} />
}

export function UseCaseIncidentArticlePage() {
  return <UseCaseArticleTemplate article={incidentArticle} />
}

export function UseCaseMigrationArticlePage() {
  return <UseCaseArticleTemplate article={migrationArticle} />
}
