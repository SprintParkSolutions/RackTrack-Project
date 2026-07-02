import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { preloadRoute } from '../routePreload'
import './Navbar.css'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Why RackTrack', path: '/why-racktrack' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Use Cases', path: '/use-cases' },
  { label: 'Trust & Security', path: '/trust-security' },
  { label: 'Resources', path: '/resources' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
]

const getActiveNavPath = (pathname: string) => {
  if (pathname === '/') {
    return '/'
  }

  return (
    navItems
      .filter((item) => item.path !== '/')
      .sort((first, second) => second.path.length - first.path.length)
      .find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
      ?.path ?? '/'
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [optimisticNav, setOptimisticNav] = useState<{
    path: string
    pathnameAtSelection: string
  } | null>(null)
  const activePath = getActiveNavPath(location.pathname)
  const highlightedPath =
    optimisticNav?.pathnameAtSelection === location.pathname ? optimisticNav.path : activePath

  const handleNavIntent = (path: string) => {
    preloadRoute(path)
  }

  const handleNavClick = (path: string) => {
    setOptimisticNav({ path, pathnameAtSelection: location.pathname })
    setMenuOpen(false)
    preloadRoute(path)
  }

  const goToContact = () => {
    setOptimisticNav({ path: '/contact-us', pathnameAtSelection: location.pathname })
    preloadRoute('/contact-us')
    setMenuOpen(false)
    navigate('/contact-us', { state: { scrollTo: 'contact' } })
  }

  return (
    <>
      <header className="rt-nav-shell navbar">
        <motion.nav
          id="main-nav"
          className="rt-nav"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <NavLink
            to="/"
            className="rt-nav-logo"
            aria-label="Go to RackTrack home"
            onClick={() => handleNavClick('/')}
          >
            <img
              src="/RackTrack_Logo.png"
              alt="RackTrack"
              className="rt-nav-logo-image"
            />
          </NavLink>

          <div className="rt-nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onPointerEnter={() => handleNavIntent(item.path)}
                onFocus={() => handleNavIntent(item.path)}
                onClick={() => handleNavClick(item.path)}
                className={`rt-nav-link${highlightedPath === item.path ? ' rt-nav-link-active' : ''}`}
              >
                <span className="rt-nav-link-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="rt-nav-actions">
            <motion.button
              className="rt-nav-cta"
              onClick={goToContact}
              whileHover={{
                y: -2,
                boxShadow: '0 0 34px rgba(0,210,255,0.55)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              Get a Demo
              <ArrowUpRight aria-hidden="true" />
            </motion.button>
            <button
              className="rt-nav-menu-btn"
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="rt-mobile-panel"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onPointerEnter={() => handleNavIntent(item.path)}
                onFocus={() => handleNavIntent(item.path)}
                onClick={() => handleNavClick(item.path)}
                className={`rt-mobile-link${highlightedPath === item.path ? ' rt-mobile-link-active' : ''}`}
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" size={16} />
              </NavLink>
            ))}
            <motion.button
              className="rt-nav-cta rt-mobile-cta"
              onClick={goToContact}
              whileTap={{ scale: 0.98 }}
            >
              Get a Demo
              <ArrowUpRight aria-hidden="true" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
