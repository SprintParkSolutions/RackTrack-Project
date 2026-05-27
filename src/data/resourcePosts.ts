export type ResourcePostSection = {
  eyebrow: string
  title: string
  body: string[]
}

export type ResourcePost = {
  id: string
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
  imageAlt: string
  detailIntro: string
  detailSummary: string
  keyPoints: string[]
  sections: ResourcePostSection[]
}

export const resourcePosts: ResourcePost[] = [
  {
    id: 'cmdb-drift',
    slug: 'the-cost-of-cmdb-drift',
    category: 'Operations',
    title: 'The Cost of CMDB Drift',
    excerpt:
      'When the CMDB drifts from physical reality, every downstream decision built on it becomes less reliable.',
    image: '/resource-thought-images/blog-cmdb-drift.webp',
    imageAlt: 'Rack blueprint diagrams compared with a live network rack',
    detailIntro:
      'CMDB drift is not just a documentation problem. It quietly degrades planning, troubleshooting, security reviews, and investment decisions across the infrastructure team.',
    detailSummary:
      'This article explains why physical verification matters when the system of record no longer matches what is really installed in the rack.',
    keyPoints: [
      'Configuration systems decay faster than most teams expect.',
      'Operational risk compounds when asset records are assumed to be correct.',
      'Visual verification gives teams a defensible way to close the gap.',
    ],
    sections: [
      {
        eyebrow: 'Why drift happens',
        title: 'Change moves faster than documentation.',
        body: [
          'Rack environments are dynamic. Hardware gets replaced, labels change, uplinks move, and temporary fixes often become permanent. In many teams, those changes are documented later, if they are documented at all.',
          'The result is a CMDB that still looks complete on paper while slowly diverging from what engineers would find if they walked the room today.',
        ],
      },
      {
        eyebrow: 'Why it matters',
        title: 'Bad inventory creates expensive decisions.',
        body: [
          'Capacity planning, incident response, refresh forecasting, compliance reviews, and vulnerability scoping all depend on accurate infrastructure records. Once the source of truth drifts, every downstream workflow inherits uncertainty.',
          'That uncertainty turns into wasted time, avoidable hardware purchases, longer outages, and difficult audit conversations.',
        ],
      },
      {
        eyebrow: 'What good teams do differently',
        title: 'They verify the rack, not just the record.',
        body: [
          'High-trust infrastructure programs treat physical verification as part of operational hygiene. They compare what is documented against what is visible in the rack and use that evidence to reconcile the system of record.',
          'This approach turns the CMDB from a best-effort spreadsheet into something teams can rely on under pressure.',
        ],
      },
    ],
  },
  {
    id: 'manual-audit-failure',
    slug: 'the-failure-modes-of-manual-rack-audits',
    category: 'Infrastructure',
    title: 'The Failure Modes of Manual Rack Audits',
    excerpt:
      'Manual audits are slow, expensive, and often out of date before the work is complete.',
    image: '/resource-thought-images/blog-manual-rack-audits.webp',
    imageAlt: 'Audit toolkit beside data center rack equipment',
    detailIntro:
      'Manual rack audits feel safe because they are familiar, but they break down quickly once teams operate across many rows, rooms, and sites.',
    detailSummary:
      'This piece outlines the common failure modes that make spreadsheet-first rack validation hard to trust at scale.',
    keyPoints: [
      'Manual audits introduce delay before accuracy is achieved.',
      'Human transcription creates inconsistent records and missed exceptions.',
      'Teams need repeatable capture, not one-time cleanup efforts.',
    ],
    sections: [
      {
        eyebrow: 'The hidden problem',
        title: 'Manual audits are snapshots with a long lag.',
        body: [
          'By the time a team completes a manual audit, reviews notes, fixes labels, and updates the inventory system, the environment has usually changed again.',
          'That means the record is already aging before it is even approved as complete.',
        ],
      },
      {
        eyebrow: 'Where they fail',
        title: 'The weak point is consistency.',
        body: [
          'Different engineers capture different levels of detail. Some log serial numbers. Some stop at device class. Some note cables. Others focus only on occupied rack units.',
          'This inconsistency makes cross-site comparison difficult and turns every audit cycle into a fresh data-cleaning project.',
        ],
      },
      {
        eyebrow: 'A better pattern',
        title: 'Standardized evidence beats handwritten interpretation.',
        body: [
          'A modern audit workflow starts from structured capture and repeatable evidence. Teams should be able to inspect the same rack later and arrive at the same core result.',
          'That is how inventory validation becomes scalable instead of heroic.',
        ],
      },
    ],
  },
  {
    id: 'evidence-grade',
    slug: 'the-case-for-evidence-grade-inventory',
    category: 'Strategy',
    title: 'The Case for Evidence-Grade Inventory',
    excerpt:
      'Defensible infrastructure inventory starts with traceable evidence, not static records or assumptions.',
    image: '/resource-thought-images/blog-evidence-grade-inventory.webp',
    imageAlt: 'Tagged hardware and audit evidence laid out beside a rack',
    detailIntro:
      'Evidence-grade inventory means every important infrastructure record can be traced back to something verifiable, not just something entered into a form.',
    detailSummary:
      'The strongest inventory programs do not stop at asset lists. They preserve the proof behind the list.',
    keyPoints: [
      'Trust improves when records are tied to visible evidence.',
      'Audit readiness depends on traceability, not just completeness.',
      'Evidence-first inventory supports both operations and governance.',
    ],
    sections: [
      {
        eyebrow: 'What it means',
        title: 'Evidence-grade is inventory you can defend.',
        body: [
          'An evidence-grade record is not just a row in a database. It is a row that can be tied back to visual proof, capture context, and a clear verification step.',
          'That makes it useful in executive review, incident analysis, and external audit conversations alike.',
        ],
      },
      {
        eyebrow: 'Why it matters',
        title: 'Static records age, evidence holds up.',
        body: [
          'Most infrastructure systems assume records stay true until someone updates them. Evidence-grade workflows reverse that assumption. They ask teams to prove what is there when it matters most.',
          'This makes the inventory base more reliable for planning, risk review, and cross-functional decision making.',
        ],
      },
      {
        eyebrow: 'What changes',
        title: 'Teams move from opinion to proof.',
        body: [
          'With evidence attached to physical inventory, reconciliation becomes simpler. Disagreements can be resolved by checking the source, not by debating who last edited a record.',
          'That shift reduces friction across infrastructure, security, and compliance teams.',
        ],
      },
    ],
  },
  {
    id: 'missing-link',
    slug: 'physical-layer-the-missing-link-in-infrastructure-security',
    category: 'Security',
    title: 'Physical Layer: The Missing Link in Infrastructure Security',
    excerpt:
      'Network tools see what is active on the network, not what is physically in the rack. That gap is where risk accumulates.',
    image: '/resource-thought-images/blog-physical-layer-security.webp',
    imageAlt: 'Rack door secured with a visible lock in a server room',
    detailIntro:
      'Security programs often assume inventory starts from the network, but many infrastructure risks begin before a device is properly classified or monitored there.',
    detailSummary:
      'This article looks at the blind spots created when security teams cannot reliably connect physical presence to logical visibility.',
    keyPoints: [
      'Network visibility does not equal physical completeness.',
      'Untracked physical devices create real security exposure.',
      'Security posture improves when rack-level truth is part of inventory.',
    ],
    sections: [
      {
        eyebrow: 'The security gap',
        title: 'If it is not in inventory, it is hard to govern.',
        body: [
          'Switches, appliances, patch equipment, out-of-band systems, and legacy devices can all fall outside traditional endpoint-centered tooling.',
          'If a security team cannot confirm what is physically present, vulnerability prioritization starts on an incomplete foundation.',
        ],
      },
      {
        eyebrow: 'Why teams miss it',
        title: 'Logical tools answer a different question.',
        body: [
          'Most security tooling is excellent at showing what is reachable, active, scanned, or authenticated. It is not designed to prove what is physically installed in each rack location.',
          'That distinction matters whenever ownership, firmware posture, or unauthorized hardware is in question.',
        ],
      },
      {
        eyebrow: 'What improves',
        title: 'Physical awareness strengthens security operations.',
        body: [
          'When security teams can reconcile physical presence with network state, they gain a cleaner inventory baseline for remediation programs, exception handling, and audit preparation.',
          'The outcome is not just more data. It is better scoping.',
        ],
      },
    ],
  },
  {
    id: 'soc2-readiness',
    slug: 'how-infrastructure-teams-prepare-for-soc-2-audits',
    category: 'Compliance',
    title: 'How Infrastructure Teams Prepare for SOC 2 Audits',
    excerpt:
      'SOC 2 Type II requires continuous evidence of asset control. Here is how teams can generate it systematically.',
    image: '/resource-thought-images/blog-soc2-readiness.webp',
    imageAlt: 'Secured infrastructure aisle with rack access controls',
    detailIntro:
      'SOC 2 readiness is difficult when teams collect proof manually at the end of the cycle instead of building evidence throughout the year.',
    detailSummary:
      'Infrastructure organizations can reduce audit stress by treating physical asset verification as a recurring control activity.',
    keyPoints: [
      'Auditors care about control evidence, not just policy statements.',
      'Continuous verification reduces the scramble before review.',
      'Physical inventory evidence supports broader asset-control claims.',
    ],
    sections: [
      {
        eyebrow: 'What auditors ask',
        title: 'Control claims need supporting evidence.',
        body: [
          'SOC 2 does not reward confidence alone. Teams need to show how they know where assets are, how access is controlled, and how exceptions are identified and handled.',
          'That becomes difficult when physical infrastructure records are fragmented or stale.',
        ],
      },
      {
        eyebrow: 'What slows teams down',
        title: 'Preparation becomes a project instead of a process.',
        body: [
          'Many teams treat audit readiness as a seasonal cleanup effort. They gather screenshots, spreadsheets, emails, and exported lists shortly before the auditor arrives.',
          'This creates rushed validation work and leaves little confidence that the evidence reflects normal operations.',
        ],
      },
      {
        eyebrow: 'What works better',
        title: 'Build a repeatable evidence trail.',
        body: [
          'The strongest teams produce audit support from day-to-day operating processes. They verify assets regularly, preserve proof, and make exceptions visible early.',
          'That approach shortens the audit cycle and improves control credibility.',
        ],
      },
    ],
  },
  {
    id: 'dcim-vs-reality',
    slug: 'dcim-vs-physical-reality-why-the-gap-matters',
    category: 'Operations',
    title: 'DCIM vs. Physical Reality: Why the Gap Matters',
    excerpt:
      'DCIM platforms model intent. Understanding the gap between model and reality helps teams solve the right problem.',
    image: '/resource-thought-images/blog-dcim-vs-reality.webp',
    imageAlt: 'Two adjacent racks showing different cabling states in a data center',
    detailIntro:
      'DCIM is valuable, but only when teams understand where the model ends and physical verification must begin.',
    detailSummary:
      'This article explains why the difference between planned infrastructure and installed infrastructure is operationally important.',
    keyPoints: [
      'DCIM often reflects expected state, not confirmed state.',
      'Reality gaps distort capacity, dependency, and risk analysis.',
      'Verification should complement DCIM, not replace it.',
    ],
    sections: [
      {
        eyebrow: 'The model',
        title: 'DCIM is strongest when it captures intent.',
        body: [
          'Planning systems help teams document expected layouts, power relationships, rack occupancy, and deployment standards. That structure is useful and necessary.',
          'The problem begins when teams assume the model is automatically true in the room.',
        ],
      },
      {
        eyebrow: 'The gap',
        title: 'Physical environments drift from planned layouts.',
        body: [
          'Moves, additions, emergency swaps, patch changes, and label decay all create divergence. Over time, the planned state and the installed state are no longer the same thing.',
          'When teams ignore that difference, they troubleshoot and plan against fiction.',
        ],
      },
      {
        eyebrow: 'The right approach',
        title: 'Use DCIM as structure and verification as proof.',
        body: [
          'The most effective programs combine planning systems with physical validation. DCIM holds the operating model. Verification confirms whether the environment still matches it.',
          'That combination creates a stronger source of truth than either system alone.',
        ],
      },
    ],
  },
  {
    id: 'hidden-cost',
    slug: 'the-hidden-cost-of-wrong-rack-inventory',
    category: 'Finance',
    title: 'The Hidden Cost of Wrong Rack Inventory',
    excerpt:
      'Misidentified hardware, premature refreshes, and wasted capacity often go unmeasured until they become costly.',
    image: '/resource-thought-images/blog-hidden-cost-inventory.webp',
    imageAlt: 'Servers and equipment staged in a row of data center racks',
    detailIntro:
      'Inventory inaccuracy creates financial waste in quiet ways. Teams often feel the cost long before they measure it directly.',
    detailSummary:
      'Better rack visibility improves budget quality by reducing avoidable purchases, bad assumptions, and preventable rework.',
    keyPoints: [
      'Wrong inventory distorts investment decisions.',
      'Overbuying often starts as an accuracy problem.',
      'Verified rack data makes business cases easier to defend.',
    ],
    sections: [
      {
        eyebrow: 'Where the cost hides',
        title: 'Waste usually looks like uncertainty.',
        body: [
          'When teams cannot trust what is already installed, they buy defensively. They reserve extra hardware, overestimate risk, or accelerate refresh decisions before they are necessary.',
          'That caution may feel responsible, but it increases spend.',
        ],
      },
      {
        eyebrow: 'Operational fallout',
        title: 'Bad inventory also burns labor.',
        body: [
          'Finance impact is not limited to equipment purchases. Engineers lose time validating rack state during planning, migrations, and incident response.',
          'That hidden labor cost compounds across every major infrastructure project.',
        ],
      },
      {
        eyebrow: 'What changes with better visibility',
        title: 'Confidence improves the quality of spend.',
        body: [
          'When teams can confirm what exists, what is available, and what has changed, budgets become more precise. Capacity conversations shift from assumption to evidence.',
          'That makes both finance and engineering teams more effective.',
        ],
      },
    ],
  },
  {
    id: 'network-verified',
    slug: 'what-network-verified-actually-means',
    category: 'Infrastructure',
    title: 'What "Network-Verified" Actually Means',
    excerpt:
      'Reconciling physical presence with live network state is what makes infrastructure inventory trustworthy.',
    image: '/resource-thought-images/blog-network-verified.webp',
    imageAlt: 'Dense patch cabling connected to a switch panel',
    detailIntro:
      'Network-verified inventory is more than device discovery. It is the process of proving that the physical rack and the logical network perspective support the same story.',
    detailSummary:
      'This article breaks down why physical evidence and network telemetry are most useful when they are reconciled together.',
    keyPoints: [
      'Physical and logical views each answer different questions.',
      'Trust improves when both views align.',
      'Reconciliation turns discovery into usable infrastructure intelligence.',
    ],
    sections: [
      {
        eyebrow: 'The phrase',
        title: 'Network-verified should mean reconciled, not assumed.',
        body: [
          'Many tools claim network verification when they discover active devices and collect telemetry. That is useful, but it does not confirm that the physical rack inventory is complete or correctly labeled.',
          'Verification is stronger when network data is matched against what is physically visible and installed.',
        ],
      },
      {
        eyebrow: 'Why the distinction matters',
        title: 'Telemetry alone cannot resolve every ambiguity.',
        body: [
          'A live network can tell you what is speaking. It cannot always tell you what is missing from the rack record, what was swapped without documentation, or how the physical layout has changed.',
          'That is why physical context still matters.',
        ],
      },
      {
        eyebrow: 'What good looks like',
        title: 'One inventory story from two evidence sources.',
        body: [
          'When physical capture and network discovery agree, teams can trust the output more deeply. When they disagree, the gap becomes a clear action item instead of a hidden risk.',
          'That is the real value of network-verified infrastructure intelligence.',
        ],
      },
    ],
  },
  {
    id: 'free-port-capacity',
    slug: 'free-port-discovery-and-rack-capacity-planning',
    category: 'Infrastructure',
    title: 'Free Port Discovery and Rack Capacity Planning',
    excerpt:
      'Teams plan capacity better when they can see which switch ports are truly available instead of relying on outdated assumptions.',
    image: '/resource-thought-images/blog-free-port-capacity.webp',
    imageAlt: 'Enterprise switch panels showing active patch cables and visibly open ethernet ports',
    detailIntro:
      'Free port discovery sounds simple, but it becomes difficult when rack documentation, switch usage, and physical cabling no longer tell the same story. Good capacity planning starts by resolving that gap.',
    detailSummary:
      'This article explains why visually verified port availability helps infrastructure teams plan growth, reduce wasted time, and avoid avoidable deployment delays.',
    keyPoints: [
      'Available switch capacity is often overstated or understated in static records.',
      'Physical port visibility helps teams plan adds, moves, and expansions faster.',
      'Capacity conversations improve when port availability is verified, not guessed.',
    ],
    sections: [
      {
        eyebrow: 'The planning problem',
        title: 'Port availability is rarely as clear as it looks in the spreadsheet.',
        body: [
          'Many teams assume they know how much switch capacity is available because a diagram, spreadsheet, or DCIM record says a set of ports is still open. In reality, field changes, patch updates, temporary links, and incomplete documentation can make those records unreliable.',
          'That means a port that looks available in the system may already be in use, while a port that appears occupied may no longer serve a production workload.',
        ],
      },
      {
        eyebrow: 'Why it matters',
        title: 'Capacity planning depends on the physical truth of the rack.',
        body: [
          'Free port discovery affects more than cable work. It impacts deployment speed, expansion planning, migration readiness, and refresh timelines. When teams cannot confidently identify spare switch capacity, every new project starts with extra validation effort.',
          'That slows down implementation and creates avoidable uncertainty during change windows.',
        ],
      },
      {
        eyebrow: 'What strong teams do',
        title: 'They verify physical port state before they promise capacity.',
        body: [
          'The most effective infrastructure teams compare logical switch data with visible rack conditions. They confirm which ports are patched, which are unused, and whether cabling matches the expected topology before committing new capacity to a project.',
          'This approach reduces surprises and turns port planning into a faster, more defensible workflow.',
        ],
      },
      {
        eyebrow: 'Operational impact',
        title: 'Accurate port visibility saves time across every rack change.',
        body: [
          'When port availability is clear, engineers spend less time tracing cables, second-guessing diagrams, or reopening change plans. New installs move faster because the team starts from a verified view of the rack instead of a debated one.',
          'That creates smoother provisioning, cleaner rack layouts, and more reliable infrastructure planning over time.',
        ],
      },
    ],
  },
]

export function getResourcePostBySlug(slug: string) {
  return resourcePosts.find((post) => post.slug === slug)
}
