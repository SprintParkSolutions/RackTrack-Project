import type { SVGProps } from 'react'
import './SideSocialRail.css'

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.03 2.03 0 0 0 3.2 5.03c0 1.1.9 2 2.01 2h.03a2.03 2.03 0 1 0 0-4.06ZM20.8 13.05c0-3.43-1.83-5.03-4.27-5.03-1.97 0-2.86 1.08-3.36 1.84V8.5H9.8c.04.9 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.12-.93.27-.68.88-1.39 1.9-1.39 1.35 0 1.89 1.04 1.89 2.56V20H20.8v-6.95Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.15 5.15 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
    </svg>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.05h2.37l.35-2.75H13.5V9.44c0-.8.22-1.34 1.37-1.34h1.47V5.64c-.26-.03-1.13-.11-2.15-.11-2.13 0-3.59 1.3-3.59 3.68v2h-2.4v2.75h2.4V21h2.9Z" />
    </svg>
  )
}

const socialItems = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/racktrack/',
    className: 'side-social-rail-link-linkedin',
    icon: LinkedInIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/racktrack_inc/',
    className: 'side-social-rail-link-instagram',
    icon: InstagramIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18depF5xzA/',
    className: 'side-social-rail-link-facebook',
    icon: FacebookIcon,
  },
]

export default function SideSocialRail() {
  return (
    <aside className="side-social-rail side-social-rail-visible" aria-label="Social links">
      <div className="side-social-rail-links">
        {socialItems.map((item) => {
          const Icon = item.icon

          return (
            <a
              key={item.label}
              href={item.href}
              className={`side-social-rail-link ${item.className}`}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
            >
              <span className="side-social-rail-icon-shell">
                <Icon />
              </span>
            </a>
          )
        })}
      </div>
    </aside>
  )
}
