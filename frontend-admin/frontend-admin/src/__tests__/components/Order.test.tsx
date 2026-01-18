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
vi.mock('react-icons/fa6', () => ({
  FaRegFileLines: ({ size, className }: { size: number, className: string }) => (
    <svg data-testid="file-icon" data-size={size} className={className} />
  ),
}))

describe('Order', () => {
  const defaultProps = {
    id: 123,
    name: 'John Doe',
    formatted_timestamp: '15.01.2024 10:30',
    status: 'pending',
    is_new: false,
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

      expect(container.querySelector('.small-order-container')).toBeInTheDocument()
    })

    it('renders file icon', () => {
      renderOrder()

      expect(screen.getByTestId('file-icon')).toBeInTheDocument()
    })

    it('renders file icon with correct size', () => {
      renderOrder()

      expect(screen.getByTestId('file-icon')).toHaveAttribute('data-size', '45')
    })

    it('renders order ID with prefix', () => {
      renderOrder({ id: 456 })

      expect(screen.getByText('# ro-456')).toBeInTheDocument()
    })

    it('renders customer name', () => {
      renderOrder({ name: 'Jane Smith' })

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('renders formatted timestamp', () => {
      renderOrder({ formatted_timestamp: '20.12.2023 14:00' })

      expect(screen.getByText('20.12.2023 14:00')).toBeInTheDocument()
    })

    it('renders order status indicator', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.order-status')).toBeInTheDocument()
    })
  })

  describe('new order styling', () => {
    it('applies highlight background when is_new is true', () => {
      const { container } = renderOrder({ is_new: true })

      const orderContainer = container.querySelector('.small-order-container')
      expect(orderContainer).toHaveStyle({ backgroundColor: 'rgb(230, 238, 252)' })
    })

    it('does not apply highlight background when is_new is false', () => {
      const { container } = renderOrder({ is_new: false })

      const orderContainer = container.querySelector('.small-order-container')
      expect(orderContainer).not.toHaveStyle({ backgroundColor: 'rgb(230, 238, 252)' })
    })

    it('applies blue color to order ID when is_new is true', () => {
      renderOrder({ is_new: true, id: 789 })

      const orderIdElement = screen.getByText('# ro-789')
      expect(orderIdElement).toHaveStyle({ fontWeight: 'bold', color: 'RGB(68 113 203)' })
    })

    it('applies black color to order ID when is_new is false', () => {
      renderOrder({ is_new: false, id: 789 })

      const orderIdElement = screen.getByText('# ro-789')
      expect(orderIdElement).toHaveStyle({ fontWeight: 'bold' })
      // Color can be 'black' or 'rgb(0, 0, 0)' depending on browser
      const style = window.getComputedStyle(orderIdElement)
      expect(['black', 'rgb(0, 0, 0)']).toContain(style.color)
    })
  })

  describe('click interaction', () => {
    it('navigates to order detail page on click', () => {
      const { container } = renderOrder({ id: 100 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockNavigate).toHaveBeenCalledWith('/order/100')
    })

    it('calls toggleOrder on click', () => {
      const { container } = renderOrder({ id: 200 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockToggleOrder).toHaveBeenCalledWith(200)
    })

    it('calls both navigate and toggleOrder on single click', () => {
      const { container } = renderOrder({ id: 300 })

      fireEvent.click(container.querySelector('.small-order-container')!)

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockToggleOrder).toHaveBeenCalledTimes(1)
    })
  })

  describe('structure', () => {
    it('contains order info container', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.order-container-info')).toBeInTheDocument()
    })

    it('contains order header', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.order-header')).toBeInTheDocument()
    })

    it('contains order status container', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.order-status-container')).toBeInTheDocument()
    })

    it('contains timestamp text with correct class', () => {
      const { container } = renderOrder()

      expect(container.querySelector('.order-timestamp-text')).toBeInTheDocument()
    })
  })
})
