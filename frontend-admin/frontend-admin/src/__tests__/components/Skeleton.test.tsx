import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppSkeleton from '../../components/Skeleton'

// Mock MUI components
vi.mock('@mui/material', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('@mui/material/Skeleton', () => ({
  default: ({ variant, className, height, width, animation }: {
    variant?: string,
    className?: string,
    height?: number,
    width?: number,
    animation?: string
  }) => (
    <div
      data-testid="skeleton"
      data-variant={variant}
      data-animation={animation}
      data-height={height}
      data-width={width}
      className={className}
    />
  ),
}))

describe('AppSkeleton', () => {
  it('renders skeleton container', () => {
    const { container } = render(<AppSkeleton />)

    expect(container.querySelector('.dashboard-skeleton-container')).toBeInTheDocument()
  })

  it('renders 8 skeleton cards', () => {
    render(<AppSkeleton />)

    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(8)
  })

  it('renders cards with correct class', () => {
    render(<AppSkeleton />)

    const cards = screen.getAllByTestId('card')
    cards.forEach(card => {
      expect(card).toHaveClass('dashboard-skeleton-item')
    })
  })

  it('renders circular skeleton for avatar', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const circularSkeletons = skeletons.filter(s => s.getAttribute('data-variant') === 'circular')

    expect(circularSkeletons).toHaveLength(8)
  })

  it('renders circular skeletons with correct dimensions', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const circularSkeletons = skeletons.filter(s => s.getAttribute('data-variant') === 'circular')

    circularSkeletons.forEach(skeleton => {
      expect(skeleton).toHaveAttribute('data-height', '80')
      expect(skeleton).toHaveAttribute('data-width', '80')
    })
  })

  it('renders circular skeletons with wave animation', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const circularSkeletons = skeletons.filter(s => s.getAttribute('data-variant') === 'circular')

    circularSkeletons.forEach(skeleton => {
      expect(skeleton).toHaveAttribute('data-animation', 'wave')
    })
  })

  it('renders circular skeletons with avatar class', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const circularSkeletons = skeletons.filter(s => s.getAttribute('data-variant') === 'circular')

    circularSkeletons.forEach(skeleton => {
      expect(skeleton).toHaveClass('dashboard-avatar-skeleton')
    })
  })

  it('renders 2 text skeletons per card (16 total)', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const textSkeletons = skeletons.filter(s => s.getAttribute('data-variant') !== 'circular')

    expect(textSkeletons).toHaveLength(16)
  })

  it('renders text skeletons with wave animation', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const textSkeletons = skeletons.filter(s => s.getAttribute('data-variant') !== 'circular')

    textSkeletons.forEach(skeleton => {
      expect(skeleton).toHaveAttribute('data-animation', 'wave')
    })
  })

  it('renders text skeletons with height 40', () => {
    render(<AppSkeleton />)

    const skeletons = screen.getAllByTestId('skeleton')
    const textSkeletons = skeletons.filter(s => s.getAttribute('data-variant') !== 'circular')

    textSkeletons.forEach(skeleton => {
      expect(skeleton).toHaveAttribute('data-height', '40')
    })
  })

  it('renders info container inside each card', () => {
    const { container } = render(<AppSkeleton />)

    const infoContainers = container.querySelectorAll('.dashboard-skeleton-item-info')
    expect(infoContainers).toHaveLength(8)
  })
})
