import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { registerSchema } from '../../hooks/useRegister'

// Mock the auth store
const mockRegisterUser = vi.fn()
vi.mock('../../zustand/useAuthStore', () => ({
  default: vi.fn((selector) => {
    const state = {
      registerUser: mockRegisterUser,
      loading: false,
    }
    return selector ? selector(state) : state
  }),
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

import { useRegister } from '../../hooks/useRegister'

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Password123',
      })

      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'invalid',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Password123',
      })

      expect(result.success).toBe(false)
    })

    it('rejects empty firstName', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        firstName: '',
        lastName: 'Doe',
        password: 'Password123',
      })

      expect(result.success).toBe(false)
    })

    it('rejects empty lastName', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        firstName: 'John',
        lastName: '',
        password: 'Password123',
      })

      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('useRegister hook', () => {
    it('returns form and utility functions', () => {
      const { result } = renderHook(() => useRegister())

      expect(result.current.form).toBeDefined()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.showPassword).toBe(false)
      expect(result.current.passwordChecks).toBeDefined()
      expect(typeof result.current.togglePassword).toBe('function')
      expect(typeof result.current.onSubmit).toBe('function')
    })

    it('toggles password visibility', () => {
      const { result } = renderHook(() => useRegister())

      expect(result.current.showPassword).toBe(false)

      act(() => {
        result.current.togglePassword()
      })

      expect(result.current.showPassword).toBe(true)
    })

    describe('passwordChecks', () => {
      it('checks password length >= 8', async () => {
        const { result } = renderHook(() => useRegister())

        // Short password
        act(() => {
          result.current.form.setValue('password', 'Pass1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.length).toBe(false)
        })

        // Valid length password
        act(() => {
          result.current.form.setValue('password', 'Password1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.length).toBe(true)
        })
      })

      it('checks password contains number', async () => {
        const { result } = renderHook(() => useRegister())

        // No number
        act(() => {
          result.current.form.setValue('password', 'Password')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.number).toBe(false)
        })

        // With number
        act(() => {
          result.current.form.setValue('password', 'Password1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.number).toBe(true)
        })
      })

      it('checks password contains uppercase', async () => {
        const { result } = renderHook(() => useRegister())

        // No uppercase
        act(() => {
          result.current.form.setValue('password', 'password1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.uppercase).toBe(false)
        })

        // With uppercase
        act(() => {
          result.current.form.setValue('password', 'Password1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.uppercase).toBe(true)
        })
      })

      it('all checks pass for valid password', async () => {
        const { result } = renderHook(() => useRegister())

        act(() => {
          result.current.form.setValue('password', 'ValidPass1')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.length).toBe(true)
          expect(result.current.passwordChecks.number).toBe(true)
          expect(result.current.passwordChecks.uppercase).toBe(true)
        })
      })

      it('all checks fail for empty password', async () => {
        const { result } = renderHook(() => useRegister())

        act(() => {
          result.current.form.setValue('password', '')
        })

        await waitFor(() => {
          expect(result.current.passwordChecks.length).toBe(false)
          expect(result.current.passwordChecks.number).toBe(false)
          expect(result.current.passwordChecks.uppercase).toBe(false)
        })
      })
    })

    it('does not submit when password is invalid', async () => {
      const { result } = renderHook(() => useRegister())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('firstName', 'John')
        result.current.form.setValue('lastName', 'Doe')
        result.current.form.setValue('password', 'weak') // Invalid password
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      expect(mockRegisterUser).not.toHaveBeenCalled()
    })

    it('navigates to email verification on success', async () => {
      mockRegisterUser.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useRegister())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('firstName', 'John')
        result.current.form.setValue('lastName', 'Doe')
        result.current.form.setValue('password', 'ValidPass1')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalledWith(
          'test@example.com',
          'John',
          'Doe',
          'ValidPass1'
        )
        expect(mockNavigate).toHaveBeenCalledWith('/email-verification', {
          state: { email: 'test@example.com' },
        })
      })
    })

    it('sets error for 409 conflict (email exists)', async () => {
      const apiError = {
        status: 409,
        code: 'email_exists',
        message: 'Email already registered',
      }
      mockRegisterUser.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useRegister())

      act(() => {
        result.current.form.setValue('email', 'existing@example.com')
        result.current.form.setValue('firstName', 'John')
        result.current.form.setValue('lastName', 'Doe')
        result.current.form.setValue('password', 'ValidPass1')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toContain('userAlreadyExists')
      })
    })

    it('sets original error for non-409 errors', async () => {
      const apiError = {
        status: 500,
        code: 'server_error',
        message: 'Internal server error',
      }
      mockRegisterUser.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useRegister())

      act(() => {
        result.current.form.setValue('email', 'test@example.com')
        result.current.form.setValue('firstName', 'John')
        result.current.form.setValue('lastName', 'Doe')
        result.current.form.setValue('password', 'ValidPass1')
      })

      await act(async () => {
        await result.current.onSubmit()
      })

      await waitFor(() => {
        expect(result.current.error).toEqual(apiError)
      })
    })
  })
})
