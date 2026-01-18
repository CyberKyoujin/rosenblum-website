import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsGrid from '../../components/StatsGrid'

// Mock MUI components
vi.mock('@mui/material/Box', () => ({
  default: ({ children, sx }: { children: React.ReactNode, sx: object }) => (
    <div data-testid="box" data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  ),
}))

vi.mock('@mui/material/Grid', () => ({
  default: ({ children, container, spacing, columns }: {
    children: React.ReactNode,
    container?: boolean,
    spacing?: object,
    columns?: object
  }) => (
    <div
      data-testid="grid"
      data-container={container}
      data-spacing={JSON.stringify(spacing)}
      data-columns={JSON.stringify(columns)}
    >
      {children}
    </div>
  ),
}))

describe('StatsGrid', () => {
  it('renders children', () => {
    render(
      <StatsGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </StatsGrid>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('renders Box component', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    expect(screen.getByTestId('box')).toBeInTheDocument()
  })

  it('renders Grid component', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    expect(screen.getByTestId('grid')).toBeInTheDocument()
  })

  it('passes flexGrow style to Box', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    const box = screen.getByTestId('box')
    const sx = JSON.parse(box.getAttribute('data-sx') || '{}')
    expect(sx.flexGrow).toBe(1)
  })

  it('renders Grid as container', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    const grid = screen.getByTestId('grid')
    expect(grid).toHaveAttribute('data-container', 'true')
  })

  it('applies correct responsive spacing', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    const grid = screen.getByTestId('grid')
    const spacing = JSON.parse(grid.getAttribute('data-spacing') || '{}')
    expect(spacing.xs).toBe(2)
    expect(spacing.md).toBe(3)
  })

  it('applies correct responsive columns', () => {
    render(
      <StatsGrid>
        <div>Content</div>
      </StatsGrid>
    )

    const grid = screen.getByTestId('grid')
    const columns = JSON.parse(grid.getAttribute('data-columns') || '{}')
    expect(columns.xs).toBe(4)
    expect(columns.sm).toBe(8)
    expect(columns.md).toBe(12)
  })

  it('renders multiple children correctly', () => {
    render(
      <StatsGrid>
        <div data-testid="stat-1">Stat 1</div>
        <div data-testid="stat-2">Stat 2</div>
        <div data-testid="stat-3">Stat 3</div>
        <div data-testid="stat-4">Stat 4</div>
      </StatsGrid>
    )

    expect(screen.getByTestId('stat-1')).toBeInTheDocument()
    expect(screen.getByTestId('stat-2')).toBeInTheDocument()
    expect(screen.getByTestId('stat-3')).toBeInTheDocument()
    expect(screen.getByTestId('stat-4')).toBeInTheDocument()
  })

  it('renders text content in children', () => {
    render(
      <StatsGrid>
        <span>Test content</span>
      </StatsGrid>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
