import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import './Navbar.css'

const navItems = [
  { label: 'Home', path: '/', plainActive: true },
  { label: 'Solutions', path: '/solutions', plainActive: true },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goToContact = () => {
    setMenuOpen(false)
    navigate('/contact-us')
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
            onClick={() => setMenuOpen(false)}
          >
            <span className="rt-nav-mark" aria-hidden="true">
              <span className="rt-nav-mark-core" />
            </span>
            <span className="rt-nav-wordmark">
              <span>Rack</span>
              <span>Track</span>
            </span>
          </NavLink>

          <div className="rt-nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rt-nav-link${isActive ? ' rt-nav-link-active' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !item.plainActive && (
                      <motion.span
                        className="rt-nav-active-pill"
                        layoutId="rt-nav-active-pill"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <span
                      className={
                        item.plainActive ? 'rt-nav-link-label rt-nav-link-label-plain' : 'rt-nav-link-label'
                      }
                    >
                      {item.label}
                    </span>
                  </>
                )}
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
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rt-mobile-link${isActive ? ' rt-mobile-link-active' : ''}`
                }
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
