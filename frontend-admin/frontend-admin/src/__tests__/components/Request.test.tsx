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
vi.mock('react-icons/bi', () => ({
  BiMessageDetail: ({ size, className }: { size: number, className: string }) => (
    <svg data-testid="message-icon" data-size={size} className={className} />
  ),
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

      expect(container.querySelector('.small-order-container')).toBeInTheDocument()
    })

    it('renders message icon', () => {
      renderRequest()

      expect(screen.getByTestId('message-icon')).toBeInTheDocument()
    })

    it('renders message icon with correct size', () => {
      renderRequest()

      expect(screen.getByTestId('message-icon')).toHaveAttribute('data-size', '45')
    })

    it('renders message icon with correct class', () => {
      renderRequest()

      expect(screen.getByTestId('message-icon')).toHaveClass('app-icon')
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
    it('applies highlight background when is_new is true', () => {
      const { container } = renderRequest({ is_new: true })

      const requestContainer = container.querySelector('.small-order-container')
      expect(requestContainer).toHaveStyle({ backgroundColor: 'rgb(230, 238, 252)' })
    })

    it('does not apply highlight background when is_new is false', () => {
      const { container } = renderRequest({ is_new: false })

      const requestContainer = container.querySelector('.small-order-container')
      expect(requestContainer).not.toHaveStyle({ backgroundColor: 'rgb(230, 238, 252)' })
    })
  })

  describe('click interaction', () => {
    it('navigates to request detail page on click', () => {
      const { container } = renderRequest({ id: 100 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockNavigate).toHaveBeenCalledWith('/request/100')
    })

    it('calls toggleRequest on click', () => {
      const { container } = renderRequest({ id: 200 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockToggleRequest).toHaveBeenCalledWith(200)
    })

    it('calls both navigate and toggleRequest on single click', () => {
      const { container } = renderRequest({ id: 300 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockToggleRequest).toHaveBeenCalledTimes(1)
    })
  })

  describe('structure', () => {
    it('contains order-container-info section', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.order-container-info')).toBeInTheDocument()
    })

    it('contains order-header section', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.order-header')).toBeInTheDocument()
    })

    it('renders name with bold font weight', () => {
      renderRequest({ name: 'Test Name' })

      const nameElement = screen.getByText('Test Name')
      expect(nameElement).toHaveStyle({ fontWeight: 'bold' })
    })

    it('has order-customer-name class on email', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.order-customer-name')).toBeInTheDocument()
    })

    it('contains timestamp text with correct class', () => {
      const { container } = renderRequest()

      expect(container.querySelector('.order-timestamp-text')).toBeInTheDocument()
    })
  })
})
