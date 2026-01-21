import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MessageItem from '../../components/MessageItem'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useAuthStore
vi.mock('../../zustand/useAuthStore', () => ({
  default: (selector: (state: any) => any) => {
    const state = { user: { id: 1 } }
    return selector(state)
  },
}))

// Mock default avatar
vi.mock('../../assets/default_avatar.webp', () => ({
  default: 'default-avatar.webp',
}))

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoCheckmarkDoneSharp: ({ size, className }: { size: number, className: string }) => (
    <svg data-testid="checkmark-done-icon" data-size={size} className={className} />
  ),
  IoCheckmarkSharp: ({ size, className }: { size: number, className: string }) => (
    <svg data-testid="checkmark-icon" data-size={size} className={className} />
  ),
}))

describe('MessageItem', () => {
  const mockCustomerData = {
    id: 2,
    date_joined: '2024-01-01',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+49123456789',
    city: 'Berlin',
    street: 'Main St',
    zip: '12345',
    profile_img: '',
    profile_img_url: '',
    image_url: 'https://example.com/avatar.jpg',
  }

  const defaultProps = {
    id: 1,
    formatted_timestamp: '15.01.2024 10:30',
    message: 'Hello, this is a test message',
    partner_data: mockCustomerData,
    sender_data: mockCustomerData,
    receiver_data: { ...mockCustomerData, id: 1 },
    files: [],
    viewed: true,
    sender: 2,
    receiver: 1,
    timestamp: '2024-01-15T10:30:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderMessageItem = (props = {}) => {
    return render(
      <MemoryRouter>
        <MessageItem {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  describe('rendering', () => {
    it('renders message item container', () => {
      const { container } = renderMessageItem()

      expect(container.querySelector('.message-item-container')).toBeInTheDocument()
    })

    it('renders partner name', () => {
      renderMessageItem({
        partner_data: { ...defaultProps.partner_data, first_name: 'Jane', last_name: 'Smith' },
      })

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('renders message text', () => {
      renderMessageItem({ message: 'Short message' })

      expect(screen.getByText('Short message')).toBeInTheDocument()
    })

    it('truncates long messages', () => {
      const longMessage = 'This is a very long message that should be truncated because it exceeds fifty characters'
      renderMessageItem({ message: longMessage })

      // Message is truncated at 48 chars + "..."
      expect(screen.getByText('This is a very long message that should be trunc...')).toBeInTheDocument()
    })

    it('renders formatted timestamp', () => {
      renderMessageItem({ formatted_timestamp: '20.12.2023 14:00' })

      expect(screen.getByText('20.12.2023 14:00')).toBeInTheDocument()
    })

    it('renders avatar image', () => {
      renderMessageItem()

      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('avatar image source', () => {
    it('uses image_url when available', () => {
      renderMessageItem({
        partner_data: {
          ...defaultProps.partner_data,
          image_url: 'https://example.com/photo.jpg',
        },
      })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/photo.jpg')
    })

    it('uses profile_img_url when image_url is empty', () => {
      renderMessageItem({
        partner_data: {
          ...defaultProps.partner_data,
          image_url: '',
          profile_img_url: 'https://example.com/profile.jpg',
        },
      })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/profile.jpg')
    })

    it('uses default avatar when no image url provided', () => {
      renderMessageItem({
        partner_data: {
          ...defaultProps.partner_data,
          image_url: '',
          profile_img_url: '',
        },
      })

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'default-avatar.webp')
    })

    it('has correct class on avatar', () => {
      renderMessageItem()

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('message-item-avatar')
    })

    it('has no-referrer policy', () => {
      renderMessageItem()

      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('referrerPolicy', 'no-referrer')
    })
  })

  describe('new message styling', () => {
    it('applies highlight background for unviewed message received by current user', () => {
      const { container } = renderMessageItem({
        receiver: 1, // current user id
        viewed: false,
      })

      const messageContainer = container.querySelector('.message-item-container')
      expect(messageContainer).toHaveStyle({ backgroundColor: '#e7efffff' })
    })

    it('does not apply highlight for viewed messages', () => {
      const { container } = renderMessageItem({
        receiver: 1,
        viewed: true,
      })

      const messageContainer = container.querySelector('.message-item-container')
      expect(messageContainer).not.toHaveStyle({ backgroundColor: '#e7efffff' })
    })

    it('does not apply highlight when sender is current user', () => {
      const { container } = renderMessageItem({
        sender: 1,
        receiver: 2,
        viewed: false,
      })

      const messageContainer = container.querySelector('.message-item-container')
      expect(messageContainer).not.toHaveStyle({ backgroundColor: '#e7efffff' })
    })
  })

  describe('sent message indicators', () => {
    it('shows single checkmark for unviewed sent message', () => {
      renderMessageItem({
        sender: 46, // admin user id in component
        viewed: false,
        message: 'Sent message',
      })

      expect(screen.getByTestId('checkmark-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('checkmark-done-icon')).not.toBeInTheDocument()
    })

    it('shows double checkmark for viewed sent message', () => {
      renderMessageItem({
        sender: 46, // admin user id in component
        viewed: true,
        message: 'Sent message',
      })

      expect(screen.getByTestId('checkmark-done-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('checkmark-icon')).not.toBeInTheDocument()
    })

    it('shows "Sie:" prefix for sent messages', () => {
      renderMessageItem({
        sender: 46,
        viewed: true,
        message: 'Test message',
      })

      expect(screen.getByText(/Sie:/)).toBeInTheDocument()
    })

    it('does not show "Sie:" prefix for received messages', () => {
      renderMessageItem({
        sender: 2,
        viewed: true,
        message: 'Test message',
      })

      expect(screen.queryByText(/Sie:/)).not.toBeInTheDocument()
    })
  })

  describe('click interaction', () => {
    it('navigates to messages page on click', () => {
      const { container } = renderMessageItem({
        partner_data: { ...defaultProps.partner_data, id: 42 },
      })

      fireEvent.click(container.querySelector('.message-item-container')!)

      expect(mockNavigate).toHaveBeenCalledWith('/user/42/messages')
    })
  })

  describe('structure', () => {
    it('contains message-item__info section', () => {
      const { container } = renderMessageItem()

      expect(container.querySelector('.message-item__info')).toBeInTheDocument()
    })

    it('contains message-item__message-info section', () => {
      const { container } = renderMessageItem()

      expect(container.querySelector('.message-item__message-info')).toBeInTheDocument()
    })

    it('contains timestamp-container section', () => {
      const { container } = renderMessageItem()

      expect(container.querySelector('.timestamp-container')).toBeInTheDocument()
    })

    it('renders name in h3 heading', () => {
      renderMessageItem()

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('John Doe')
    })
  })
})
