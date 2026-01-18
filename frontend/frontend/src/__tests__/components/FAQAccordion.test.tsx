import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import FAQAccordion from '../../components/FAQAccordion'

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        accordionTitleFirst: 'How do I place an order?',
        accordionTextFirst: 'You can place an order through our website.',
        accordionTitleSecond: 'What languages do you support?',
        accordionTextSecond: 'We support multiple languages.',
        accordionTitleThird: 'Language support question',
        accordionTextThird: 'We offer many languages.',
        accordionTitleFourth: 'Pricing question',
        accordionTextFourth: 'Our pricing is competitive.',
        accordionTitleFifth: 'Sworn translations question',
        accordionTextFifth: 'We provide certified translations.',
        accordionTitleSixth: 'General question',
        accordionTextSixth: 'General answer.',
        accordionTitleSeventh: 'Another sworn question',
        accordionTextSeventh: 'Another answer.',
        accordionTitleEights: 'Contact question',
        accordionTextEights: 'Contact us for more info.',
        accordionTitleNinth: 'Final question',
        accordionTextNinth: 'Final answer.',
        offer: 'View Offer',
      }
      return translations[key] || key
    },
  }),
}))

const renderWithRouter = (component: React.ReactNode) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('FAQAccordion', () => {
  describe('rendering', () => {
    it('renders all accordion items', () => {
      renderWithRouter(<FAQAccordion />)

      expect(screen.getByText('How do I place an order?')).toBeInTheDocument()
      expect(screen.getByText('What languages do you support?')).toBeInTheDocument()
      expect(screen.getByText('Language support question')).toBeInTheDocument()
      expect(screen.getByText('Pricing question')).toBeInTheDocument()
      expect(screen.getByText('Sworn translations question')).toBeInTheDocument()
      expect(screen.getByText('General question')).toBeInTheDocument()
    })

    it('renders 9 accordion items total', () => {
      renderWithRouter(<FAQAccordion />)

      // Each accordion has faq-accordion class
      const accordions = document.querySelectorAll('.faq-accordion')
      expect(accordions).toHaveLength(9)
    })

    it('renders expand icons for all items', () => {
      renderWithRouter(<FAQAccordion />)

      // Each accordion has an expand icon
      const expandIcons = document.querySelectorAll('.app-icon')
      expect(expandIcons).toHaveLength(9)
    })
  })

  describe('accordion expansion', () => {
    it('expands accordion on click', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      const firstAccordion = screen.getByText('How do I place an order?')
      await user.click(firstAccordion)

      // After expansion, the content should be visible
      expect(
        screen.getByText('You can place an order through our website.')
      ).toBeVisible()
    })

    it('multiple accordions can be expanded', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      await user.click(screen.getByText('How do I place an order?'))
      await user.click(screen.getByText('What languages do you support?'))

      expect(
        screen.getByText('You can place an order through our website.')
      ).toBeVisible()
      expect(screen.getByText('We support multiple languages.')).toBeVisible()
    })
  })

  describe('special content', () => {
    it('displays email for first accordion item', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      await user.click(screen.getByText('How do I place an order?'))

      expect(screen.getByText('Email:')).toBeInTheDocument()
      expect(screen.getByText('olegrosenblum@freenet.de')).toBeInTheDocument()
    })

    it('email only appears within first accordion content', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      // Open only the second accordion - first should not be expanded
      await user.click(screen.getByText('What languages do you support?'))

      // Find the second accordion's content
      const secondAccordionText = screen.getByText('We support multiple languages.')
      const secondAccordionParent = secondAccordionText.closest('.faq-accordion')

      // The email should NOT be within the second accordion
      const emailInSecond = secondAccordionParent?.querySelector('p')?.textContent?.includes('olegrosenblum')
      expect(emailInSecond).toBeFalsy()
    })
  })

  describe('link buttons', () => {
    it('renders offer link for items with link property', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      // First item has link="order"
      await user.click(screen.getByText('How do I place an order?'))

      const offerLinks = screen.getAllByText('View Offer')
      expect(offerLinks.length).toBeGreaterThan(0)
    })

    it('links to correct paths', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      await user.click(screen.getByText('How do I place an order?'))

      const orderLink = screen.getAllByRole('link')[0]
      expect(orderLink).toHaveAttribute('href', '/order')
    })

    it('does not render link for items without link property', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQAccordion />)

      // Second item has no link
      await user.click(screen.getByText('What languages do you support?'))

      // The second accordion should not have a link
      const accordionContent = screen.getByText('We support multiple languages.')
      const parent = accordionContent.closest('.MuiTypography-root')

      // Check if there's no link within this specific accordion
      expect(parent?.querySelector('a.accordion-btn')).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('has proper aria controls', () => {
      renderWithRouter(<FAQAccordion />)

      const summaries = screen.getAllByRole('button')
      summaries.forEach((summary) => {
        expect(summary).toHaveAttribute('aria-controls')
      })
    })

    it('has proper panel ids', () => {
      renderWithRouter(<FAQAccordion />)

      const summaries = screen.getAllByRole('button')
      summaries.forEach((summary) => {
        expect(summary).toHaveAttribute('id')
      })
    })
  })
})
