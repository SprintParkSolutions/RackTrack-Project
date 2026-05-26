import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import Navbar from './components/Navbar'
import SideSocialRail from './components/SideSocialRail'
import ScrollToTop from './components/ScrollToTop'
import { getResourcePostBySlug } from './data/resourcePosts'
import HomePage from './pages/HomePage'
import './App.css'

const SolutionsPage = lazy(() => import('./pages/SolutionsPage'))
const UseCasePage = lazy(() => import('./pages/UseCasePage'))
const UseCaseArticlePage = lazy(() => import('./pages/UseCaseArticlePage'))
const UseCaseNetworkArticlePage = lazy(() => import('./pages/UseCaseNetworkArticlePage'))
const UseCaseSecurityArticlePage = lazy(() =>
  import('./pages/UseCaseAdditionalArticlePages').then((module) => ({
    default: module.UseCaseSecurityArticlePage,
  })),
)
const UseCaseComplianceArticlePage = lazy(() =>
  import('./pages/UseCaseAdditionalArticlePages').then((module) => ({
    default: module.UseCaseComplianceArticlePage,
  })),
)
const UseCaseIncidentArticlePage = lazy(() =>
  import('./pages/UseCaseAdditionalArticlePages').then((module) => ({
    default: module.UseCaseIncidentArticlePage,
  })),
)
const UseCaseMigrationArticlePage = lazy(() =>
  import('./pages/UseCaseAdditionalArticlePages').then((module) => ({
    default: module.UseCaseMigrationArticlePage,
  })),
)
const WhyRackTrackPage = lazy(() => import('./pages/WhyRackTrackPage'))
const TrustSecurityPage = lazy(() => import('./pages/TrustSecurityPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const ResourceArticlePage = lazy(() => import('./pages/ResourceArticlePage'))
// const ProductPage = lazy(() => import('./pages/ProductPage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'))

const SEO_BY_PATH: Record<
  string,
  { title: string; description: string; canonicalPath: string }
> = {
  '/': {
    title: 'RackTrack | Scan Any Rack. Find Any Port. Instantly.',
    description:
      'RackTrack turns physical layer infrastructure into live intelligence with AI-powered rack scans, port identification, cable mapping, and audit-ready reports.',
    canonicalPath: '/',
  },
  '/about-us': {
    title: 'About RackTrack | Physical Layer Intelligence',
    description:
      'Learn how RackTrack helps teams modernize rack audits, cable mapping, and infrastructure visibility with AI-powered physical layer intelligence.',
    canonicalPath: '/about-us',
  },
  // '/product': {
  //   title: 'RackTrack Product | Verified Physical Infrastructure Inventory',
  //   description:
  //     'See how RackTrack turns a smartphone video into verified physical infrastructure inventory for security, capacity, compliance, and operations.',
  //   canonicalPath: '/product',
  // },
  '/solutions': {
    title: 'RackTrack Solutions | Rack Audits, Cable Mapping, Port Visibility',
    description:
      'Explore RackTrack solutions for rack inventory, switch recognition, cable tracing, free-port discovery, and audit-ready infrastructure reporting.',
    canonicalPath: '/solutions',
  },
  '/use-cases': {
    title: 'RackTrack Use Cases | One Source of Truth for Every Role',
    description:
      'See how RackTrack gives infrastructure, network, security, compliance, incident, and M&A teams one verified source of physical infrastructure truth.',
    canonicalPath: '/use-cases',
  },
  '/use-cases/infrastructure-data-center-leaders': {
    title: 'Infrastructure & Data Center Leaders | RackTrack Use Case',
    description:
      'Read how RackTrack helps infrastructure and data center leaders create one source of truth for every site, row, and rack.',
    canonicalPath: '/use-cases/infrastructure-data-center-leaders',
  },
  '/use-cases/network-architects-engineers': {
    title: 'Network Architects & Engineers | RackTrack Use Case',
    description:
      'Read how RackTrack helps network architects and engineers verify port-level topology against physical rack reality.',
    canonicalPath: '/use-cases/network-architects-engineers',
  },
  '/use-cases/security-vulnerability-teams': {
    title: 'Security & Vulnerability Teams | RackTrack Use Case',
    description:
      'Read how RackTrack helps security and vulnerability teams start from complete physical rack inventory.',
    canonicalPath: '/use-cases/security-vulnerability-teams',
  },
  '/use-cases/compliance-audit-owners': {
    title: 'Compliance & Audit Owners | RackTrack Use Case',
    description:
      'Read how RackTrack helps compliance teams generate continuous rack-level audit evidence.',
    canonicalPath: '/use-cases/compliance-audit-owners',
  },
  '/use-cases/incident-responders-on-call': {
    title: 'Incident Responders & On-Call | RackTrack Use Case',
    description:
      'Read how RackTrack helps incident responders find devices, ports, and rack locations faster.',
    canonicalPath: '/use-cases/incident-responders-on-call',
  },
  '/use-cases/ma-migration-teams': {
    title: 'M&A & Migration Teams | RackTrack Use Case',
    description:
      'Read how RackTrack helps M&A and migration teams turn unknown infrastructure into defensible plans.',
    canonicalPath: '/use-cases/ma-migration-teams',
  },
  '/why-racktrack': {
    title: 'Why RackTrack | Infrastructure Truth Across Rack, Network, and Security',
    description:
      'See why RackTrack stands apart by sensing the rack, verifying against the network, and enriching with vendor and security data in one reconciled workflow.',
    canonicalPath: '/why-racktrack',
  },
  '/trust-security': {
    title: 'Trust & Security | RackTrack Enterprise Security and Deployment',
    description:
      'Review RackTrack security posture, data handling approach, and deployment options for enterprise and regulated environments.',
    canonicalPath: '/trust-security',
  },
  '/resources': {
    title: 'Resources | RackTrack Blog and Infrastructure Insights',
    description:
      'Browse RackTrack blog content on CMDB drift, rack audits, infrastructure security, audit readiness, and physical layer intelligence.',
    canonicalPath: '/resources',
  },
  '/contact-us': {
    title: 'Contact RackTrack | Book a Demo',
    description:
      'Contact RackTrack to book a demo, discuss rollout planning, and explore AI-powered rack scanning, cable mapping, and audit workflows.',
    canonicalPath: '/contact-us',
  },
}

function AppSeo() {
  const location = useLocation()

  useEffect(() => {
    const resourceSlugMatch = location.pathname.match(/^\/resources\/([^/]+)$/)
    const resourcePost = resourceSlugMatch
      ? getResourcePostBySlug(resourceSlugMatch[1])
      : undefined

    const seo = resourcePost
      ? {
          title: `${resourcePost.title} | RackTrack Resources`,
          description: resourcePost.excerpt,
          canonicalPath: `/resources/${resourcePost.slug}`,
        }
      : (SEO_BY_PATH[location.pathname] ?? SEO_BY_PATH['/'])

    document.title = seo.title

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://racktrack.ai${seo.canonicalPath}`)

    setMeta('description', seo.description)
    setMeta('og:title', seo.title, 'property')
    setMeta('og:description', seo.description, 'property')
    setMeta('twitter:title', seo.title)
    setMeta('twitter:description', seo.description)
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ReactLenis root options={{ lerp: 0.05 }}>
      <div className="app-shell">
        <AppSeo />
        <ScrollToTop />
        <Navbar />
        <SideSocialRail />
        <Suspense
          fallback={
            <div className="app-route-loading" role="status" aria-live="polite">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/product" element={<ProductPage />} /> */}
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/use-cases" element={<UseCasePage />} />
            <Route path="/use-cases/infrastructure-data-center-leaders" element={<UseCaseArticlePage />} />
            <Route path="/use-cases/network-architects-engineers" element={<UseCaseNetworkArticlePage />} />
            <Route path="/use-cases/security-vulnerability-teams" element={<UseCaseSecurityArticlePage />} />
            <Route path="/use-cases/compliance-audit-owners" element={<UseCaseComplianceArticlePage />} />
            <Route path="/use-cases/incident-responders-on-call" element={<UseCaseIncidentArticlePage />} />
            <Route path="/use-cases/ma-migration-teams" element={<UseCaseMigrationArticlePage />} />
            <Route path="/why-racktrack" element={<WhyRackTrackPage />} />
            <Route path="/trust-security" element={<TrustSecurityPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:slug" element={<ResourceArticlePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/about" element={<Navigate to="/about-us" replace />} />
            <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <footer className="app-footer">
          <div className="app-footer-main">
            <div className="app-footer-brand">
              <Link to="/" className="app-footer-logo" aria-label="Go to RackTrack home">
                <img src="/RackTrack_Logo.png" alt="RackTrack" className="app-footer-logo-image" />
              </Link>
              <p>A True Physical Layer Inteligence</p>
            </div>
            <div className="app-footer-columns">
              <nav className="app-footer-nav" aria-label="Footer navigation">
                <span className="app-footer-heading">Explore</span>
                {/* <Link to="/product">Product</Link> */}
                <Link to="/why-racktrack">Why RackTrack</Link>
                <Link to="/solutions">Solutions</Link>
                <Link to="/use-cases">Use Cases</Link>
                <Link to="/trust-security">Trust & Security</Link>
                <Link to="/resources">Resources</Link>
                <Link to="/about-us">About Us</Link>
                <Link to="/contact-us">Contact Us</Link>
              </nav>

              <div className="app-footer-contact">
                <span className="app-footer-heading">Contact</span>
                <a href="mailto:info@racktrack.ai">info@racktrack.ai</a>
                <a href="tel:+18605669894">+1 (860) 566 9894</a>
                <p>85 Felt Rd, Suite #604, South Windsor, CT 06074</p>
              </div>
            </div>
          </div>
          <div className="app-footer-bottom">All rights reserved</div>
        </footer>
      </div>
      </ReactLenis>
    </BrowserRouter>
  )
}
