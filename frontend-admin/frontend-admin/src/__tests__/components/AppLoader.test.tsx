import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppLoader from '../../components/AppLoader'

// Mock MUI CircularProgress
vi.mock('@mui/material', () => ({
  CircularProgress: ({ size }: { size: number }) => (
    <div data-testid="circular-progress" data-size={size} role="progressbar" />
  ),
}))

describe('AppLoader', () => {
  it('renders main container', () => {
    const { container } = render(<AppLoader />)

    expect(container.querySelector('.main-container')).toBeInTheDocument()
  })

  it('renders app loader container', () => {
    const { container } = render(<AppLoader />)

    expect(container.querySelector('.app-loader-container')).toBeInTheDocument()
  })

  it('renders CircularProgress component', () => {
    render(<AppLoader />)

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
  })

  it('renders CircularProgress with size 60', () => {
    render(<AppLoader />)

    expect(screen.getByTestId('circular-progress')).toHaveAttribute('data-size', '60')
  })

  it('renders loading text in German', () => {
    render(<AppLoader />)

    expect(screen.getByText('Wird geladen...')).toBeInTheDocument()
  })

  it('renders h3 heading', () => {
    render(<AppLoader />)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Wird geladen...')
  })
})
