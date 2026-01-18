import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// Create a mock for useAuthStore
const mockUseAuthStore = vi.fn()

vi.mock('../../zustand/useAuthStore', () => ({
  default: (selector?: (state: { isAuthenticated: boolean }) => boolean) => {
    const state = mockUseAuthStore()
    return selector ? selector(state) : state
  },
}))

import ProtectedRoute from '../../components/ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>
  const LoginPage = () => <div data-testid="login-page">Login Page</div>

  const renderWithRouter = (isAuthenticated: boolean) => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated })

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
