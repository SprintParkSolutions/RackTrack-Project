export const routePreloaders = {
  '/solutions': () => import('./pages/SolutionsPage'),
  '/use-cases': () => import('./pages/UseCasePage'),
  '/why-racktrack': () => import('./pages/WhyRackTrackPage'),
  '/trust-security': () => import('./pages/TrustSecurityPage'),
  '/resources': () => import('./pages/ResourcesPage'),
  '/about-us': () => import('./pages/AboutUsPage'),
  '/contact-us': () => import('./pages/ContactUsPage'),
}

export type PreloadableRoute = keyof typeof routePreloaders

const preloadCache = new Set<PreloadableRoute>()

export function preloadRoute(path: string) {
  const preloadPath = path as PreloadableRoute
  const preload = routePreloaders[preloadPath]

  if (!preload || preloadCache.has(preloadPath)) {
    return
  }

  preloadCache.add(preloadPath)
  void preload().catch(() => {
    preloadCache.delete(preloadPath)
  })
}
