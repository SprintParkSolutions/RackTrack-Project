import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { useLocation } from 'react-router-dom'

type RouteState = {
  scrollTo?: string
}

export default function ScrollToTop() {
  const location = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    const state = location.state as RouteState | null

    if (state?.scrollTo || location.hash) {
      return
    }

    const resetScroll = () => {
      lenis?.scrollTo(0, { immediate: true, force: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    resetScroll()

    const frame = window.requestAnimationFrame(resetScroll)
    return () => window.cancelAnimationFrame(frame)
  }, [lenis, location.hash, location.key, location.pathname, location.state])

  return null
}
