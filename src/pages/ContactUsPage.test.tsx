import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ContactUsPage from './ContactUsPage'

vi.mock('../services/salesforceApi', () => ({
  createRackTrackLead: vi.fn(),
}))

describe('ContactUsPage', () => {
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

    expect(
      screen.getByRole('button', {
        name: /start a conversation/i,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
  })

  it('scrolls to the form when the hero CTA is clicked without relying on a hash link', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ContactUsPage />
      </MemoryRouter>,
    )

    await user.click(
      screen.getByRole('button', {
        name: /start a conversation/i,
      }),
    )

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
