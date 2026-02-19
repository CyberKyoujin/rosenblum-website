import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Order from '../../components/Order'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useOrdersStore
const mockToggleOrder = vi.fn()
vi.mock('../../zustand/useOrdersStore', () => ({
  default: (selector: (state: any) => any) => {
    const state = { toggleOrder: mockToggleOrder }
    return selector(state)
  },
}))

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoDocumentTextOutline: () => <svg data-testid="file-icon" />,
  IoChevronForward: () => <svg data-testid="chevron-icon" />,
}))

describe('Order', () => {
  const defaultProps = {
    id: 123,
    name: 'John Doe',
    formatted_timestamp: '15.01.2024 10:30',
    status: 'review',
    is_new: false,
    payment_status: "not paid",
    payment_type: "stripe"
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderOrder = (props = {}) => {
    return render(
      <MemoryRouter>
        <Order {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  describe('rendering', () => {
    it('renders order container', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.oi')).toBeInTheDocument()
    })

    it('renders file icon', () => {
      renderOrder()

      expect(screen.getByTestId('file-icon')).toBeInTheDocument()
    })

    it('renders order ID with prefix', () => {
      renderOrder({ id: 456 })

      expect(screen.getByText('#ro-456')).toBeInTheDocument()
    })

    it('renders customer name', () => {
      renderOrder({ name: 'Jane Smith' })

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('renders formatted timestamp', () => {
      renderOrder({ formatted_timestamp: '20.12.2023 14:00' })

      expect(screen.getByText('20.12.2023 14:00')).toBeInTheDocument()
    })

    it('renders status badge', () => {
      const { container } = renderOrder({ status: 'review' })

      expect(container.querySelector('.oi__status-badge')).toBeInTheDocument()
    })

    it('renders status text', () => {
      renderOrder({ status: 'review' })

      expect(screen.getByText('Wird überprüft')).toBeInTheDocument()
    })
  })

  describe('new order styling', () => {
    it('applies oi--new class when is_new is true', () => {
      const { container } = renderOrder({ is_new: true })

      expect(container.querySelector('.oi--new')).toBeInTheDocument()
    })

    it('does not apply oi--new class when is_new is false', () => {
      const { container } = renderOrder({ is_new: false })

      expect(container.querySelector('.oi--new')).not.toBeInTheDocument()
    })
  })

  describe('click interaction', () => {
    it('navigates to order detail page on click', () => {
      const { container } = renderOrder({ id: 100 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledWith('/order/100')
    })

    it('calls toggleOrder on click', () => {
      const { container } = renderOrder({ id: 200 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockToggleOrder).toHaveBeenCalledWith(200)
    })

    it('calls both navigate and toggleOrder on single click', () => {
      const { container } = renderOrder({ id: 300 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockToggleOrder).toHaveBeenCalledTimes(1)
    })
  })

  describe('structure', () => {
    it('contains icon container', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.oi__icon')).toBeInTheDocument()
    })

    it('contains content section', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.oi__content')).toBeInTheDocument()
    })

    it('contains right section with status', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.oi__right')).toBeInTheDocument()
    })

    it('contains timestamp', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.oi__timestamp')).toBeInTheDocument()
    })
  })
})
