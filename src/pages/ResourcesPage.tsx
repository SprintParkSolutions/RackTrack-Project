import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { resourcePosts } from '../data/resourcePosts'
import './ResourcesPage.css'

const featuredPost = resourcePosts[0]
const latestPosts = resourcePosts.slice(1)
const articleFilters = ['All', ...new Set(resourcePosts.map((post) => post.category))] as const

const editorialPillars = [
  {
    title: 'Operational Intelligence',
    description:
      'How teams reduce inventory drift, audit delays, and rack-level uncertainty.',
  },
  {
    title: 'Posture & Compliance Intelligence',
    description:
      'Why physical presence still matters in infrastructure security programs.',
  },
  {
    title: 'Infrastructure Strategy',
    description:
      'What accurate rack data changes for upgrades, migrations, and budgeting.',
  },
]

export default function ResourcesPage() {
  const pageRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<(typeof articleFilters)[number]>('All')

  const filteredPosts = useMemo(
    () =>
      activeFilter === 'All'
        ? latestPosts
        : latestPosts.filter((post) => post.category === activeFilter),
    [activeFilter]
  )

  const openArticle = (slug: string) => {
    navigate(`/resources/${slug}`)
  }

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal-on-scroll') ?? []
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="res-page" ref={pageRef}>
      <section className="app-section res-hero">
        <div className="res-hero__grid" aria-hidden="true" />

        <div className="res-hero__content">
          <span className="app-eyebrow">Resources</span>
          <h1>
            <span className="res-h1-line">RackTrack insights for</span>
            <span className="res-h1-line">infrastructure teams that</span>
            <span className="res-h1-line res-h1-grad">need better physical truth.</span>
          </h1>
          <p>
            Resources is now a focused editorial library. Explore practical blog
            content on rack inventory, audit readiness, infrastructure security,
            and physical layer intelligence.
          </p>

          <div className="res-hero-pills" aria-label="Editorial focus">
            {editorialPillars.map((pillar) => (
              <article key={pillar.title} className="res-hero-pill">
                <h2>{pillar.title}</h2>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section res-featured reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">Featured Article</span>
          <h2>Start with the biggest source of infrastructure confusion.</h2>
          <p>
            The most common breakdown is not missing tooling. It is teams making
            decisions from records that no longer match the rack.
          </p>
        </div>

        <article className="res-featured-card">
          <div className="res-featured-card__media">
            <img
              src={featuredPost.image}
              alt={featuredPost.imageAlt}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="res-featured-card__content">
            <span className="res-featured-card__category">{featuredPost.category}</span>
            <h3>{featuredPost.title}</h3>
            <p>{featuredPost.detailIntro}</p>
            <ul className="res-featured-card__points">
              {featuredPost.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              to={`/resources/${featuredPost.slug}`}
              className="res-primary-link"
              onClick={(event) => {
                event.preventDefault()
                openArticle(featuredPost.slug)
              }}
            >
              Read more
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      <section className="app-section res-blog reveal-on-scroll">
        <div className="app-section-heading">
          <span className="app-eyebrow">All Articles</span>
          <h2>Browse the RackTrack blog library.</h2>
          <p>
            Search-friendly, practical articles for infrastructure, operations,
            compliance, and security teams evaluating physical layer intelligence.
          </p>
        </div>

        <div className="res-blog-toolbar" aria-label="Article library summary">
          <div className="res-blog-controls">
            <p>
              Explore posts on CMDB drift, rack inventory accuracy, audit evidence,
              data center security, and infrastructure planning.
            </p>

            <div className="res-blog-filters" role="tablist" aria-label="Filter articles by category">
              {articleFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`res-blog-filter${activeFilter === filter ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <span className="res-blog-count">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} shown
          </span>
        </div>

        <div className="res-blog-grid">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="res-blog-card"
              style={{ '--ci': index } as CSSProperties}
            >
              <Link
                to={`/resources/${post.slug}`}
                className="res-blog-card__image"
                aria-label={`Read ${post.title}`}
                onClick={(event) => {
                  event.preventDefault()
                  openArticle(post.slug)
                }}
              >
                <img src={post.image} alt={post.imageAlt} loading="lazy" decoding="async" />
                <span className="res-blog-category">{post.category}</span>
              </Link>
              <div className="res-blog-card__body">
                <h3>
                  <Link
                    to={`/resources/${post.slug}`}
                    onClick={(event) => {
                      event.preventDefault()
                      openArticle(post.slug)
                    }}
                  >
                    {post.title}
                  </Link>
                </h3>
                <p>{post.excerpt}</p>
                <Link
                  to={`/resources/${post.slug}`}
                  className="res-blog-link"
                  onClick={(event) => {
                    event.preventDefault()
                    openArticle(post.slug)
                  }}
                >
                  Read more
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
