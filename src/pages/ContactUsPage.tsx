import { useState } from 'react'
import type { FormEvent } from 'react'
import { CalendarDays, Headphones, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import './ContactUsPage.css'

const contactCards = [
  { icon: Phone, label: 'Call Us', value: '+1 (800) 555-1234' },
  { icon: Mail, label: 'Email', value: 'support@racktrack.com' },
  { icon: MapPin, label: 'Office', value: 'San Francisco, CA' },
]

const supportCards = [
  { icon: MessageCircle, label: 'Live Chat', value: 'Available 9 AM - 6 PM' },
  { icon: CalendarDays, label: 'Book a Demo', value: 'Schedule online instantly' },
  { icon: Headphones, label: 'Customer Support', value: '24/7 assistance' },
]

const faqs = [
  ['How quickly will I get a response?', 'Our team replies within 24 hours.'],
  ['Can I request a demo?', 'Yes, use the demo card or the contact form to request a walkthrough.'],
  ['Do you offer global support?', 'RackTrack provides support for distributed teams and global data center operations.'],
]

export default function ContactUsPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 3000)
  }

  return (
    <main className="contact-page">
      <section className="contact-hero app-section">
        <div>
          <span className="app-eyebrow">Get in Touch</span>
          <h1>
            We are here
            <span> to help.</span>
          </h1>
          <p>Connect with RackTrack for support, demos, enterprise inquiries, and audit automation guidance.</p>
        </div>
        <div className="contact-card-grid">
          {contactCards.map((card) => (
            <article className="contact-info-card" key={card.label}>
              <card.icon />
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section contact-support">
        <div className="support-card-grid">
          {supportCards.map((card) => (
            <article className="support-card" key={card.label}>
              <card.icon />
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="app-section contact-main-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <span className="app-eyebrow">Contact Form</span>
          <h2>Send us a message</h2>
          <label>
            Name
            <input type="text" placeholder="Enter your full name" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="Enter your email address" required />
          </label>
          <label>
            Subject
            <input type="text" placeholder="Enter subject" required />
          </label>
          <label>
            Message
            <textarea placeholder="Write your message here" required />
          </label>
          <button type="submit">{sent ? 'Message sent' : 'Submit'}</button>
        </form>

        <aside className="contact-faq">
          <span className="app-eyebrow">FAQ</span>
          <h2>Frequently asked questions</h2>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </aside>
      </section>
    </main>
  )
}
