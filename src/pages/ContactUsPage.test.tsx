import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ContactUsPage from './ContactUsPage'

vi.mock('../services/salesforceApi', () => ({
  createRackTrackLead: vi.fn(),
}))

describe('ContactUsPage', () => {
  const getHeroCta = () => {
    const heroSection = document.querySelector('.contact-hero')

    if (!heroSection) {
      throw new Error('Contact hero section not found')
    }

    return within(heroSection).getByRole('button', {
      name: /request platform brief/i,
    })
  }

  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
  })

  it('renders a single hero CTA with the updated label', () => {
    render(
      <MemoryRouter>
        <ContactUsPage />
      </MemoryRouter>,
    )

    expect(getHeroCta()).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
  })

  it('scrolls to the form when the hero CTA is clicked without relying on a hash link', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ContactUsPage />
      </MemoryRouter>,
    )

    await user.click(getHeroCta())

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })

  it('scrolls to the form when navigation state requests the contact section', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/contact-us', state: { scrollTo: 'contact' } }]}>
        <ContactUsPage />
      </MemoryRouter>,
    )

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })
})
