import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { loginSchema } from '../../hooks/useLogin'

// Mock the auth store
const mockLoginUser = vi.fn()
vi.mock('../../zustand/useAuthStore', () => ({
  default: vi.fn(() => ({
    loginUser: mockLoginUser,
    loading: false,
  })),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { useLogin } from '../../hooks/useLogin'

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })

      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })

      expect(result.success).toBe(false)
    })

    it('rejects empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('useLogin hook', () => {
    it('returns form and utility functions', () => {
      const { result } = renderHook(() => useLogin())

      expect(result.current.form).toBeDefined()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.showPassword).toBe(false)
      expect(typeof result.current.togglePassword).toBe('function')
      expect(typeof result.current.handleVerificationRedirect).toBe('function')
      expect(typeof result.current.onSubmit).toBe('function')
    })

    it('toggles password visibility', () => {
      const { result } = renderHook(() => useLogin())

      expect(result.current.showPassword).toBe(false)

      act(() => {
        result.current.togglePassword()
      })

      expect(result.current.showPassword).toBe(true)

      act(() => {
        result.current.togglePassword()
      })

      expect(result.current.showPassword).toBe(false)
    })

    it('navigates to profile on successful login', async () => {
      mockLoginUser.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useLogin())

      // Set form values
      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('password', 'password123')
      })

      // Submit form
      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'password123')
        expect(mockNavigate).toHaveBeenCalledWith('/profile')
      })
    })

    it('sets error on login failure', async () => {
      const apiError = {
        status: 401,
        code: 'authentication_failed',
        message: 'Invalid credentials',
      }
      mockLoginUser.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('password', 'wrongpassword')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toContain('Неверный Email')
      })
    })

    it('maps account_disabled error correctly', async () => {
      const apiError = {
        status: 403,
        code: 'account_disabled',
        message: 'Account is disabled',
      }
      mockLoginUser.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('password', 'password123')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(result.current.error?.message).toContain('верифицирован')
      })
    })

    it('uses original message for unknown error codes', async () => {
      const apiError = {
        status: 500,
        code: 'unknown_code',
        message: 'Server error occurred',
      }
      mockLoginUser.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('password', 'password123')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(result.current.error?.message).toBe('Server error occurred')
      })
    })

    it('handleVerificationRedirect navigates with email', () => {
      const { result } = renderHook(() => useLogin())

      act(() => {
        result.current.form.setValue('email', 'user@example.com')
      })

      act(() => {
        result.current.handleVerificationRedirect()
      })

      expect(mockNavigate).toHaveBeenCalledWith('/email-verification', {
        state: { email: 'user@example.com' },
      })
    })
  })
})
