import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RequirementItem from '../../components/RequirementItem'

// Mock the image imports
vi.mock('../../assets/tick.svg', () => ({ default: 'tick.svg' }))
vi.mock('../../assets/cross.svg', () => ({ default: 'cross.svg' }))

describe('RequirementItem', () => {
  describe('rendering', () => {
    it('renders the text', () => {
      render(<RequirementItem isValid={true} text="At least 8 characters" />)

      expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    })

    it('renders an image', () => {
      render(<RequirementItem isValid={true} text="Test text" />)

      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  describe('when valid', () => {
    it('displays tick icon when isValid is true', () => {
      render(<RequirementItem isValid={true} text="Valid requirement" />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'tick.svg')
    })
  })

  describe('when invalid', () => {
    it('displays cross icon when isValid is false', () => {
      render(<RequirementItem isValid={false} text="Invalid requirement" />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'cross.svg')
    })
  })

  describe('styling', () => {
    it('uses flexbox layout', () => {
      render(<RequirementItem isValid={true} text="Test" />)

      const paragraph = screen.getByText('Test').closest('p')
      expect(paragraph).toHaveStyle({ display: 'flex' })
    })

    it('aligns items center', () => {
      render(<RequirementItem isValid={true} text="Test" />)

      const paragraph = screen.getByText('Test').closest('p')
      expect(paragraph).toHaveStyle({ alignItems: 'center' })
    })

    it('has gap between icon and text', () => {
      render(<RequirementItem isValid={true} text="Test" />)

      const paragraph = screen.getByText('Test').closest('p')
      expect(paragraph).toHaveStyle({ gap: '8px' })
    })

    it('icon has correct width', () => {
      render(<RequirementItem isValid={true} text="Test" />)

      const img = screen.getByRole('img')
      expect(img).toHaveStyle({ width: '25px' })
    })
  })

  describe('different text content', () => {
    it('renders password length requirement', () => {
      render(<RequirementItem isValid={true} text="Password must be at least 8 characters" />)

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })

    it('renders uppercase requirement', () => {
      render(<RequirementItem isValid={false} text="Must contain uppercase letter" />)

      expect(screen.getByText('Must contain uppercase letter')).toBeInTheDocument()
    })

    it('renders number requirement', () => {
      render(<RequirementItem isValid={true} text="Must contain a number" />)

      expect(screen.getByText('Must contain a number')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has empty alt text for decorative image', () => {
      render(<RequirementItem isValid={true} text="Test" />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('prop changes', () => {
    it('updates icon when isValid changes', () => {
      const { rerender } = render(<RequirementItem isValid={false} text="Test" />)

      expect(screen.getByRole('img')).toHaveAttribute('src', 'cross.svg')

      rerender(<RequirementItem isValid={true} text="Test" />)

      expect(screen.getByRole('img')).toHaveAttribute('src', 'tick.svg')
    })

    it('updates text when text prop changes', () => {
      const { rerender } = render(<RequirementItem isValid={true} text="Original text" />)

      expect(screen.getByText('Original text')).toBeInTheDocument()

      rerender(<RequirementItem isValid={true} text="Updated text" />)

      expect(screen.getByText('Updated text')).toBeInTheDocument()
      expect(screen.queryByText('Original text')).not.toBeInTheDocument()
    })
  })
})
