import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ReactLenis } from 'lenis/react'
import Navbar from './components/Navbar'
import SideSocialRail from './components/SideSocialRail'
import ScrollToTop from './components/ScrollToTop'
import { getResourcePostBySlug } from './data/resourcePosts'
import { routePreloaders } from './routePreload'
import HomePage from './pages/HomePage'
import './App.css'

const SolutionsPage = lazy(routePreloaders['/solutions'])
const UseCasePage = lazy(routePreloaders['/use-cases'])
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
const WhyRackTrackPage = lazy(routePreloaders['/why-racktrack'])
const TrustSecurityPage = lazy(routePreloaders['/trust-security'])
const ResourcesPage = lazy(routePreloaders['/resources'])
const ResourceArticlePage = lazy(() => import('./pages/ResourceArticlePage'))
// const ProductPage = lazy(() => import('./pages/ProductPage'))
const AboutUsPage = lazy(routePreloaders['/about-us'])
const ContactUsPage = lazy(routePreloaders['/contact-us'])

const SEO_BY_PATH: Record<
  string,
  { title: string; description: string; canonicalPath: string }
> = {
  '/': {
    title: 'RackTrack | The Infrastructure Digital Twin Platform',
    description:
      'RackTrack transforms rack images and network signals into verified infrastructure intelligence for rack inventory, topology reconciliation, connectivity intelligence, and audit-ready reporting.',
    canonicalPath: '/',
  },
  '/about-us': {
    title: 'About RackTrack | Physical Layer Intelligence',
    description:
      'Learn how RackTrack is building the Physical Infrastructure Intelligence Platform for data centers - the intelligence layer underneath audits, DCIM, and rack operations.',
    canonicalPath: '/about-us',
  },
  // '/product': {
  //   title: 'RackTrack Product | Verified Physical Infrastructure Inventory',
  //   description:
  //     'See how RackTrack turns a smartphone video into verified physical infrastructure inventory for security, capacity, compliance, and operations.',
  //   canonicalPath: '/product',
  // },
  '/solutions': {
    title: 'RackTrack Platform | Infrastructure Intelligence Capabilities',
    description:
      'Explore RackTrack platform capabilities: Visual Rack Intelligence, Connectivity Intelligence, Infrastructure Digital Twin, Security Posture Intelligence, and Continuous Reconciliation.',
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
      'See how RackTrack perceives, reconciles, and reasons about physical infrastructure through visual rack intelligence, cable-to-port mapping, and continuous reconciliation.',
    canonicalPath: '/why-racktrack',
  },
  '/trust-security': {
    title: 'Trust & Security | RackTrack Enterprise Security and Deployment',
    description:
      'Review RackTrack security posture, data handling approach, and deployment options for enterprise and regulated environments.',
    canonicalPath: '/trust-security',
  },
  '/resources': {
    title: 'Infrastructure Intelligence | Research, Frameworks & Insights',
    description:
      'Browse RackTrack research, frameworks, and insights on CMDB drift, infrastructure digital twins, topology reconciliation, audit readiness, and physical infrastructure intelligence.',
    canonicalPath: '/resources',
  },
  '/contact-us': {
    title: 'Contact RackTrack | Request Platform Brief',
    description:
      'Contact RackTrack to request a platform brief, scope a deployment, and explore continuous reconciliation across your infrastructure.',
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

function useNativeMobileScroll() {
  const getShouldUseNativeScroll = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 860px), (pointer: coarse)').matches

  const [useNativeScroll, setUseNativeScroll] = useState(getShouldUseNativeScroll)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 860px), (pointer: coarse)')
    const update = () => setUseNativeScroll(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return useNativeScroll
}

export default function App() {
  const useNativeScroll = useNativeMobileScroll()

  const appContent = (
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
              <p>Physical Infrastructure Intelligence for Data Centers</p>
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
                <a href="tel:+18608782448">+1 (860) 878 2448</a>
                <p>85 Felt Rd, Suite #604, South Windsor, CT 06074</p>
              </div>
            </div>
          </div>
          <div className="app-footer-bottom">© 2026 RackTrack Inc. · Physical Infrastructure Intelligence for Data Centers · Patent Pending</div>
        </footer>
      </div>
  )

  return (
    <BrowserRouter>
      {useNativeScroll ? (
        appContent
      ) : (
        <ReactLenis root options={{ lerp: 0.05 }}>
          {appContent}
        </ReactLenis>
      )}
    </BrowserRouter>
  )
}




