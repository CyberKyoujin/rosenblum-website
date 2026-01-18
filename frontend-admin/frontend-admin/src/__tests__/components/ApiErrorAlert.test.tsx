import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ApiErrorAlert from '../../components/ApiErrorAlert'

// Mock react-countdown-circle-timer
vi.mock('react-countdown-circle-timer', () => ({
  CountdownCircleTimer: ({ children, onComplete }: { children: (props: { remainingTime: number }) => React.ReactNode, onComplete: () => void }) => {
    // Simulate timer with remaining time
    return (
      <div data-testid="countdown-timer">
        {children({ remainingTime: 5 })}
        <button data-testid="trigger-complete" onClick={onComplete}>Complete</button>
      </div>
    )
  },
}))

describe('ApiErrorAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when no error or success message', () => {
    it('returns null', () => {
      const { container } = render(<ApiErrorAlert />)

      expect(container.firstChild).toBeNull()
    })

    it('returns null when error and successMessage are both null', () => {
      const { container } = render(<ApiErrorAlert error={null} successMessage={null} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('when error is provided', () => {
    it('displays error alert', () => {
      const error = {
        status: 400,
        code: 'bad_request',
        message: 'Something went wrong',
      }

      render(<ApiErrorAlert error={error} />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('displays error with validation message', () => {
      const error = {
        status: 422,
        code: 'validation_error',
        message: 'Validation failed',
      }

      render(<ApiErrorAlert error={error} />)

      expect(screen.getByText('Validation failed (Check fields)')).toBeInTheDocument()
    })

    it('renders with countdown timer', () => {
      const error = {
        status: 500,
        code: 'server_error',
        message: 'Server error',
      }

      render(<ApiErrorAlert error={error} />)

      expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
    })
  })

  describe('when successMessage is provided', () => {
    it('displays success alert', () => {
      render(<ApiErrorAlert successMessage="Operation successful" />)

      expect(screen.getByText('Operation successful')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders with countdown timer', () => {
      render(<ApiErrorAlert successMessage="Success!" />)

      expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
    })
  })

  describe('positioning classes', () => {
    it('applies fixed positioning class when fixed=true', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} fixed={true} />)

      const alertContainer = container.querySelector('.error-alert-container')
      expect(alertContainer).toHaveClass('error-alert-fixed')
    })

    it('applies relative positioning class when fixed=false', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} fixed={false} />)

      const alertContainer = container.querySelector('.error-alert-container')
      expect(alertContainer).toHaveClass('error-alert-relative')
    })

    it('applies below-navbar class when belowNavbar=true', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} belowNavbar={true} />)

      const alertContainer = container.querySelector('.error-alert-container')
      expect(alertContainer).toHaveClass('below-navbar')
    })

    it('does not apply below-navbar class when belowNavbar=false', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} belowNavbar={false} />)

      const alertContainer = container.querySelector('.error-alert-container')
      expect(alertContainer).not.toHaveClass('below-navbar')
    })

    it('applies show-alert class when visible', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} />)

      const alertContainer = container.querySelector('.error-alert-container')
      expect(alertContainer).toHaveClass('show-alert')
    })
  })

  describe('onClose callback', () => {
    it('calls onClose when timer completes', () => {
      const onClose = vi.fn()
      const error = { status: 400, code: 'error', message: 'Error' }

      render(<ApiErrorAlert error={error} onClose={onClose} />)

      // Trigger the complete callback
      act(() => {
        screen.getByTestId('trigger-complete').click()
      })

      expect(onClose).toHaveBeenCalled()
    })

    it('hides alert when timer completes', () => {
      const error = { status: 400, code: 'error', message: 'Error' }

      const { container } = render(<ApiErrorAlert error={error} />)

      expect(container.querySelector('.error-alert-container')).toBeInTheDocument()

      // Trigger the complete callback
      act(() => {
        screen.getByTestId('trigger-complete').click()
      })

      expect(container.querySelector('.error-alert-container')).not.toBeInTheDocument()
    })
  })

  describe('action prop', () => {
    it('renders custom action element', () => {
      const error = { status: 400, code: 'error', message: 'Error' }
      const customAction = <button data-testid="custom-action">Retry</button>

      render(<ApiErrorAlert error={error} action={customAction} />)

      expect(screen.getByTestId('custom-action')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  describe('visibility state changes', () => {
    it('shows alert when error changes from null to value', () => {
      const { rerender, container } = render(<ApiErrorAlert error={null} />)

      expect(container.firstChild).toBeNull()

      const error = { status: 400, code: 'error', message: 'New error' }
      rerender(<ApiErrorAlert error={error} />)

      expect(screen.getByText('New error')).toBeInTheDocument()
    })

    it('shows alert when successMessage changes from null to value', () => {
      const { rerender, container } = render(<ApiErrorAlert successMessage={null} />)

      expect(container.firstChild).toBeNull()

      rerender(<ApiErrorAlert successMessage="Success!" />)

      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
  })
})
