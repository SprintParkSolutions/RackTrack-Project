import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type RouteState = {
  scrollTo?: string
}

export default function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    const state = location.state as RouteState | null

    if (state?.scrollTo || location.hash) {
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.hash, location.key, location.pathname, location.state])

  return null
}
