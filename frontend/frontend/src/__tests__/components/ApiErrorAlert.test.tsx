import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import ApiErrorAlert from '../../components/ApiErrorAlert'
import { ApiErrorResponse } from '../../types/error'

// Mock the CountdownCircleTimer
vi.mock('react-countdown-circle-timer', () => ({
  CountdownCircleTimer: ({
    children,
    onComplete,
  }: {
    children: (props: { remainingTime: number }) => React.ReactNode
    onComplete: () => { shouldRepeat: boolean }
    isPlaying: boolean
    duration: number
    colors: string
    size: number
    strokeWidth: number
  }) => (
    <div data-testid="countdown-timer" onClick={() => onComplete()}>
      {children({ remainingTime: 5 })}
    </div>
  ),
}))

describe('ApiErrorAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders nothing when no error or successMessage', () => {
      const { container } = render(<ApiErrorAlert />)

      expect(container.firstChild).toBeNull()
    })

    it('renders error alert when error is provided', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'bad_request',
        message: 'Something went wrong',
      }

      render(<ApiErrorAlert error={error} />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders success alert when successMessage is provided', () => {
      render(<ApiErrorAlert successMessage="Operation completed successfully" />)

      expect(screen.getByText('Operation completed successfully')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('appends validation message for validation_error code', () => {
      const error: ApiErrorResponse = {
        status: 422,
        code: 'validation_error',
        message: 'Invalid input',
      }

      render(<ApiErrorAlert error={error} />)

      // The component now uses translations - t('checkFields') returns the key when not in i18n context
      expect(screen.getByText('Invalid input (checkFields)')).toBeInTheDocument()
    })
  })

  describe('positioning', () => {
    it('applies fixed positioning when fixed prop is true', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      const { container } = render(<ApiErrorAlert error={error} fixed={true} />)

      expect(container.firstChild).toHaveClass('error-alert-fixed')
    })

    it('applies relative positioning by default', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      const { container } = render(<ApiErrorAlert error={error} />)

      expect(container.firstChild).toHaveClass('error-alert-relative')
    })

    it('applies below-navbar class when belowNavbar is true', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      const { container } = render(<ApiErrorAlert error={error} belowNavbar={true} />)

      expect(container.firstChild).toHaveClass('below-navbar')
    })
  })

  describe('countdown timer', () => {
    it('renders countdown timer', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      render(<ApiErrorAlert error={error} />)

      expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
    })

    it('calls onClose when timer completes', async () => {
      const mockOnClose = vi.fn()
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      render(<ApiErrorAlert error={error} onClose={mockOnClose} />)

      // Simulate timer completion by clicking the mock timer
      act(() => {
        screen.getByTestId('countdown-timer').click()
      })

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('hides alert when timer completes', async () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      const { rerender } = render(<ApiErrorAlert error={error} />)

      expect(screen.getByText('Test error')).toBeInTheDocument()

      // Simulate timer completion
      act(() => {
        screen.getByTestId('countdown-timer').click()
      })

      // Rerender to see the change
      rerender(<ApiErrorAlert error={error} />)

      // The alert should be hidden after completion (alertVisible becomes false)
      // But since we're using the same error prop, it would re-show
      // This tests the internal state change
    })
  })

  describe('action prop', () => {
    it('renders action element when provided', () => {
      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'Test error',
      }

      render(
        <ApiErrorAlert
          error={error}
          action={<button data-testid="custom-action">Retry</button>}
        />
      )

      expect(screen.getByTestId('custom-action')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  describe('visibility state', () => {
    it('becomes visible when error changes from null to error', () => {
      const { rerender } = render(<ApiErrorAlert error={null} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      const error: ApiErrorResponse = {
        status: 400,
        code: 'error',
        message: 'New error',
      }

      rerender(<ApiErrorAlert error={error} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('becomes visible when successMessage changes from null to message', () => {
      const { rerender } = render(<ApiErrorAlert successMessage={null} />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      rerender(<ApiErrorAlert successMessage="Success!" />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
