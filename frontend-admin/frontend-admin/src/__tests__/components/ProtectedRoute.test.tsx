import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Mock useAuthStore
vi.mock('../../zustand/useAuthStore', () => ({
  default: {
    getState: vi.fn(() => ({ isAuthenticated: false })),
    setState: vi.fn(),
    subscribe: vi.fn(),
  },
}))

import ProtectedRoute from '../../components/ProtectedRoute'
import useAuthStore from '../../zustand/useAuthStore'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>
  const LoginPage = () => <div data-testid="login-page">Login Page</div>

  const renderWithRouter = (isAuthenticated: boolean) => {
    vi.mocked(useAuthStore.getState).mockReturnValue({ isAuthenticated } as any)

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
  }

  describe('when user is authenticated', () => {
    it('renders children', () => {
      renderWithRouter(true)

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    })

    it('displays the protected content text', () => {
      renderWithRouter(true)

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('when user is not authenticated', () => {
    it('redirects to login page', () => {
      renderWithRouter(false)

      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('displays login page content', () => {
      renderWithRouter(false)

      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })
})
