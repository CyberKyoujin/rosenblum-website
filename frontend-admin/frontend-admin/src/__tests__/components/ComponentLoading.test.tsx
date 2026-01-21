import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComponentLoading from '../../components/ComponentLoading'

// Mock MUI CircularProgress
vi.mock('@mui/material/CircularProgress', () => ({
  default: ({ size }: { size: number }) => (
    <div data-testid="circular-progress" data-size={size} role="progressbar" />
  ),
}))

describe('ComponentLoading', () => {
  it('renders spinner container', () => {
    const { container } = render(<ComponentLoading />)

    expect(container.querySelector('.spinner-container')).toBeInTheDocument()
  })

  it('renders CircularProgress component', () => {
    render(<ComponentLoading />)

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
  })

  it('renders CircularProgress with size 50', () => {
    render(<ComponentLoading />)

    expect(screen.getByTestId('circular-progress')).toHaveAttribute('data-size', '50')
  })

  it('renders progressbar role', () => {
    render(<ComponentLoading />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
