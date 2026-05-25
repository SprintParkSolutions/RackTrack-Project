import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getResourcePostBySlug, resourcePosts } from '../data/resourcePosts'
import './ResourceArticlePage.css'

export default function ResourceArticlePage() {
  const { slug } = useParams()
  const post = slug ? getResourcePostBySlug(slug) : undefined

  if (!post) {
    return <Navigate to="/resources" replace />
  }

  const relatedPosts = resourcePosts
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3)

  return (
    <main className="resource-article-page">
      <section className="app-section resource-article-hero">
        <div className="resource-article-hero__copy">
          <div className="resource-article-topbar">
            <Link to="/resources" className="resource-article-back">
              <ArrowLeft size={18} />
              Back to Resources
            </Link>

            <div className="resource-article-breadcrumb" aria-label="Breadcrumb">
              <span>Resource Library</span>
              <span>/</span>
              <span>{post.category}</span>
            </div>
          </div>

          <span className="resource-article-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.detailIntro}</p>
        </div>

        <div className="resource-article-hero__media">
          <img src={post.image} alt={post.imageAlt} loading="eager" decoding="async" />
        </div>
      </section>

      <section className="app-section resource-article-body">
        <div className="resource-article-layout">
          <aside className="resource-article-summary">
            <span className="resource-article-summary__label">Article summary</span>
            <p>{post.detailSummary}</p>

            <div className="resource-article-points">
              <h2>Key points</h2>
              <ul>
                {post.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="resource-article-content">
            {post.sections.map((section) => (
              <section key={section.title} className="resource-article-section">
                <span>{section.eyebrow}</span>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <div className="resource-article-cta">
              <span>Want more?</span>
              <h2>Explore the rest of the RackTrack blog.</h2>
              <p>
                Each article focuses on the operational gap between documented
                infrastructure and verified physical reality.
              </p>
              <Link to="/resources">
                View all resources
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="app-section resource-related">
        <div className="app-section-heading">
          <span className="app-eyebrow">Related Articles</span>
          <h2>Keep reading.</h2>
          <p>More blog posts for teams building a cleaner source of infrastructure truth.</p>
        </div>

        <div className="resource-related-grid">
          {relatedPosts.map((related) => (
            <article key={related.slug} className="resource-related-card">
              <img src={related.image} alt={related.imageAlt} loading="lazy" decoding="async" />
              <div className="resource-related-card__body">
                <span>{related.category}</span>
                <h3>{related.title}</h3>
                <p>{related.excerpt}</p>
                <Link to={`/resources/${related.slug}`}>
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
