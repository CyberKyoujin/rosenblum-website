import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Customer from '../../components/Customer'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock default avatar
vi.mock('../../assets/default_avatar.png', () => ({
  default: 'default-avatar-path.png',
}))

describe('Customer', () => {
  const defaultProps = {
    id: 1,
    profile_img_url: 'https://example.com/avatar.jpg',
    profile_img: '',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    orders: '5',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderCustomer = (props = {}) => {
    return render(
      <MemoryRouter>
        <Customer {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  describe('rendering', () => {
    it('renders customer container with oi class', () => {
      const { container } = renderCustomer()

      expect(container.querySelector('.oi')).toBeInTheDocument()
    })

    it('renders customer full name', () => {
      renderCustomer({ first_name: 'Jane', last_name: 'Smith' })

      expect(screen.getByText(/Jane/)).toBeInTheDocument()
      expect(screen.getByText(/Smith/)).toBeInTheDocument()
    })

    it('renders customer email', () => {
      renderCustomer({ email: 'test@example.com' })

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('renders order count with label', () => {
      renderCustomer({ orders: '10' })

      expect(screen.getByText('10 Aufträge')).toBeInTheDocument()
    })

    it('renders orders label in German', () => {
      renderCustomer()

      expect(screen.getByText('5 Aufträge')).toBeInTheDocument()
    })
  })

  describe('avatar image', () => {
    it('renders avatar with profile_img_url', () => {
      renderCustomer({ profile_img_url: 'https://example.com/photo.jpg' })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/photo.jpg')
    })

    it('renders avatar with profile_img when profile_img_url is empty', () => {
      renderCustomer({ profile_img_url: '', profile_img: 'local-avatar.jpg' })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'local-avatar.jpg')
    })

    it('renders default avatar when both urls are empty', () => {
      renderCustomer({ profile_img_url: '', profile_img: '' })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'default-avatar-path.png')
    })

    it('has oi__avatar class', () => {
      renderCustomer()

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('oi__avatar')
    })

    it('has no-referrer policy', () => {
      renderCustomer()

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('referrerPolicy', 'no-referrer')
    })
  })

  describe('click interaction', () => {
    it('navigates to customer detail page on click', () => {
      const { container } = renderCustomer({ id: 42 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledWith('/user/42')
    })

    it('uses correct id in navigation path', () => {
      const { container } = renderCustomer({ id: 999 })

      fireEvent.click(container.querySelector('.oi')!)

      expect(mockNavigate).toHaveBeenCalledWith('/user/999')
    })
  })

  describe('structure', () => {
    it('contains oi__content section', () => {
      const { container } = renderCustomer()

      expect(container.querySelector('.oi__content')).toBeInTheDocument()
    })

    it('contains oi__right section', () => {
      const { container } = renderCustomer()

      expect(container.querySelector('.oi__right')).toBeInTheDocument()
    })

    it('renders name in oi__id span', () => {
      renderCustomer({ first_name: 'Test', last_name: 'User' })

      const nameEl = document.querySelector('.oi__id')
      expect(nameEl).toBeInTheDocument()
      expect(nameEl).toHaveTextContent('Test User')
    })

    it('has oi__name class on email', () => {
      const { container } = renderCustomer()

      expect(container.querySelector('.oi__name')).toBeInTheDocument()
    })

    it('has oi__order-count class on orders label', () => {
      const { container } = renderCustomer()

      expect(container.querySelector('.oi__order-count')).toBeInTheDocument()
    })
  })
})
