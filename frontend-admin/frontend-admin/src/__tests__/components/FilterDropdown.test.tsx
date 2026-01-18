import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterDropdown from '../../components/FilterDropdown'

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoFilter: ({ size }: { size: number }) => (
    <svg data-testid="filter-icon" data-size={size} />
  ),
}))

describe('FilterDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial rendering', () => {
    it('renders filter button', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders filter icon in button', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      expect(screen.getByTestId('filter-icon')).toBeInTheDocument()
    })

    it('renders filter icon with correct size', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      expect(screen.getByTestId('filter-icon')).toHaveAttribute('data-size', '25')
    })

    it('does not show popover initially', () => {
      render(
        <FilterDropdown>
          <div data-testid="filter-content">Filter content</div>
        </FilterDropdown>
      )

      expect(screen.queryByTestId('filter-content')).not.toBeInTheDocument()
    })
  })

  describe('popover interaction', () => {
    it('opens popover when button is clicked', () => {
      render(
        <FilterDropdown>
          <div data-testid="filter-content">Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByTestId('filter-content')).toBeInTheDocument()
    })

    it('displays default title "Filters"', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('displays custom title', () => {
      render(
        <FilterDropdown title="Custom Filters">
          <div>Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByText('Custom Filters')).toBeInTheDocument()
    })

    it('renders children in popover', () => {
      render(
        <FilterDropdown>
          <input data-testid="filter-input" placeholder="Search" />
          <select data-testid="filter-select">
            <option>Option 1</option>
          </select>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByTestId('filter-input')).toBeInTheDocument()
      expect(screen.getByTestId('filter-select')).toBeInTheDocument()
    })

    it('closes popover when close button is clicked', () => {
      render(
        <FilterDropdown>
          <div data-testid="filter-content">Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByTestId('filter-content')).toBeInTheDocument()

      // Find and click close button (the IconButton with CloseIcon)
      const closeButtons = screen.getAllByRole('button')
      const closeButton = closeButtons.find(btn => btn.querySelector('[data-testid="CloseIcon"]') || btn.classList.contains('MuiIconButton-root'))
      if (closeButton) {
        fireEvent.click(closeButton)
      }
    })
  })

  describe('reset button', () => {
    it('does not show reset button when onReset is not provided', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.queryByText('Reset Filters')).not.toBeInTheDocument()
    })

    it('shows reset button when onReset is provided', () => {
      const onReset = vi.fn()

      render(
        <FilterDropdown onReset={onReset}>
          <div>Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByText('Reset Filters')).toBeInTheDocument()
    })

    it('calls onReset when reset button is clicked', () => {
      const onReset = vi.fn()

      render(
        <FilterDropdown onReset={onReset}>
          <div>Filter content</div>
        </FilterDropdown>
      )

      fireEvent.click(screen.getByRole('button'))
      fireEvent.click(screen.getByText('Reset Filters'))

      expect(onReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('button styling', () => {
    it('has btn class', () => {
      render(
        <FilterDropdown>
          <div>Filter content</div>
        </FilterDropdown>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn')
    })
  })
})
