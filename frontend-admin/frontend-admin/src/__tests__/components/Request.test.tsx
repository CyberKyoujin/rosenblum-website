import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Request from '../../components/Request'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useRequestsStore
const mockToggleRequest = vi.fn()
vi.mock('../../zustand/useRequests', () => ({
  default: (selector: (state: any) => any) => {
    const state = { toggleRequest: mockToggleRequest }
    return selector(state)
  },
}))

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoChatbubbleOutline: () => <svg data-testid="message-icon" />,
  IoChevronForward: () => <svg data-testid="chevron-icon" />,
}))

describe('Request', () => {
  const defaultProps = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone_number: '+49123456789',
    message: 'Hello, I need help',
    formatted_timestamp: '15.01.2024 10:30',
    is_new: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderRequest = (props = {}) => {
    return render(
      <MemoryRouter>
        <Request {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  describe('rendering', () => {
    it('renders request container', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.oi')).toBeInTheDocument()
    })

    it('renders message icon', () => {
      renderRequest()

      expect(screen.getByTestId('message-icon')).toBeInTheDocument()
    })

    it('renders customer name', () => {
      renderRequest({ name: 'Jane Smith' })

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('renders customer email', () => {
      renderRequest({ email: 'jane@example.com' })

      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('renders formatted timestamp', () => {
      renderRequest({ formatted_timestamp: '20.12.2023 14:00' })

      expect(screen.getByText('20.12.2023 14:00')).toBeInTheDocument()
    })
  })

  describe('new request styling', () => {
    it('applies oi--new class when is_new is true', () => {
      const { container } = renderRequest({ is_new: true })

      expect(container.querySelector('.oi--new')).toBeInTheDocument()
    })

    it('does not apply oi--new class when is_new is false', () => {
      const { container } = renderRequest({ is_new: false })

      expect(container.querySelector('.oi--new')).not.toBeInTheDocument()
    })
  })

  describe('click interaction', () => {
    it('navigates to request detail page on click', () => {
      const { container } = renderRequest({ id: 100 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledWith('/request/100')
    })

    it('calls toggleRequest on click', () => {
      const { container } = renderRequest({ id: 200 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockToggleRequest).toHaveBeenCalledWith(200)
    })

    it('calls both navigate and toggleRequest on single click', () => {
      const { container } = renderRequest({ id: 300 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockToggleRequest).toHaveBeenCalledTimes(1)
    })
  })

  describe('structure', () => {
    it('contains icon container', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.oi__icon')).toBeInTheDocument()
    })

    it('contains content section', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.oi__content')).toBeInTheDocument()
    })

    it('contains right section', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.oi__right')).toBeInTheDocument()
    })

    it('contains timestamp', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.oi__timestamp')).toBeInTheDocument()
    })
  })
})
