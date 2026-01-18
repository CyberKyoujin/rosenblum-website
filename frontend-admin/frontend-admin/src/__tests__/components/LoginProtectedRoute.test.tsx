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

import LoginProtectedRoute from '../../components/LoginProtectedRoute'
import useAuthStore from '../../zustand/useAuthStore'

describe('LoginProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const LoginPage = () => <div data-testid="login-page">Login Page</div>
  const DashboardPage = () => <div data-testid="dashboard-page">Dashboard Page</div>

  const renderWithRouter = (isAuthenticated: boolean) => {
    vi.mocked(useAuthStore.getState).mockReturnValue({ isAuthenticated } as any)

    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/login"
            element={
              <LoginProtectedRoute>
                <LoginPage />
              </LoginProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
  }

  describe('when user is not authenticated', () => {
    it('renders children (login page)', () => {
      renderWithRouter(false)

      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument()
    })

    it('displays the login page content', () => {
      renderWithRouter(false)

      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  describe('when user is authenticated', () => {
    it('redirects to dashboard', () => {
      renderWithRouter(true)

      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    })

    it('displays dashboard content', () => {
      renderWithRouter(true)

      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })
  })
})
