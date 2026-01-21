import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorView from '../../components/ErrorView'

// Mock react-icons
vi.mock('react-icons/bi', () => ({
  BiSolidError: ({ size, className }: { size: number, className: string }) => (
    <svg data-testid="error-icon" data-size={size} className={className} />
  ),
}))

describe('ErrorView', () => {
  describe('default rendering', () => {
    it('renders with default error message', () => {
      render(<ErrorView />)

      expect(screen.getByText('Es ist ein Fehler aufgetreten. Versuchen Sie es bitte später.')).toBeInTheDocument()
    })

    it('renders error icon', () => {
      render(<ErrorView />)

      expect(screen.getByTestId('error-icon')).toBeInTheDocument()
    })

    it('renders icon with correct size', () => {
      render(<ErrorView />)

      expect(screen.getByTestId('error-icon')).toHaveAttribute('data-size', '100')
    })

    it('renders icon with correct class', () => {
      render(<ErrorView />)

      expect(screen.getByTestId('error-icon')).toHaveClass('app-icon')
    })
  })

  describe('custom message', () => {
    it('renders custom error message', () => {
      render(<ErrorView message="Custom error message" />)

      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('does not render default message when custom provided', () => {
      render(<ErrorView message="Custom error" />)

      expect(screen.queryByText('Es ist ein Fehler aufgetreten. Versuchen Sie es bitte später.')).not.toBeInTheDocument()
    })
  })

  describe('styling variations', () => {
    it('applies default margin when statsError is false', () => {
      const { container } = render(<ErrorView statsError={false} />)

      const errorContainer = container.querySelector('.error-view-container')
      expect(errorContainer).toHaveStyle({ marginTop: '5rem', marginLeft: '0rem' })
    })

    it('applies stats-specific margin when statsError is true', () => {
      const { container } = render(<ErrorView statsError={true} />)

      const errorContainer = container.querySelector('.error-view-container')
      expect(errorContainer).toHaveStyle({ marginTop: '0rem', marginLeft: '1.5rem' })
    })

    it('applies default margin when statsError is not provided', () => {
      const { container } = render(<ErrorView />)

      const errorContainer = container.querySelector('.error-view-container')
      expect(errorContainer).toHaveStyle({ marginTop: '5rem', marginLeft: '0rem' })
    })
  })

  describe('container structure', () => {
    it('has error-view-container class', () => {
      const { container } = render(<ErrorView />)

      expect(container.querySelector('.error-view-container')).toBeInTheDocument()
    })

    it('contains h3 heading with message', () => {
      render(<ErrorView message="Test message" />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Test message')
    })
  })
})
