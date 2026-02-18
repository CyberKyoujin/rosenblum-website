import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    post: vi.fn(),
  },
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

import useEmailVerification from '../../hooks/useEmailVerification'
import axiosInstance from '../../axios/axiosInstance'

describe('useEmailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('returns initial state values', () => {
      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.attempts).toBe(3)
      expect(result.current.error).toBe('')
      expect(result.current.loading).toBeUndefined()
      expect(typeof result.current.verifyEmail).toBe('function')
      expect(typeof result.current.resendVerification).toBe('function')
    })
  })

  describe('verifyEmail', () => {
    it('navigates to success page on successful verification', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/users/verify-email/', {
        code: '123456',
        email: 'test@example.com',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/verification-success', {
        state: { successMessage: 'Ihr Konto wurde erfolgreich verifiziert' },
      })
    })

    it('clears error on successful verification', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      expect(result.current.error).toBe('')
    })

    it('sets loading state during verification', async () => {
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        return { data: {} }
      })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      expect(result.current.loading).toBe(false)
    })

    it('updates attempts on failed verification', async () => {
      // Hook accesses err?.errors.detail and err?.errors.attempts
      const error = {
        errors: {
          detail: 'invalid_verification_code',
          attempts: 2,
        },
        message: 'Invalid code',
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('wrong', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.attempts).toBe(2)
        expect(result.current.error).toBe('Der Code ist nicht korrekt')
      })
    })

    it('sets error message from errorMessages map', async () => {
      const error = {
        errors: {
          detail: 'verification_code_expired',
        },
        message: undefined,
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('expired', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Der Code ist abgelaufen')
      })
    })

    it('falls back to err.message when detail not in errorMessages', async () => {
      const error = {
        errors: {
          detail: 'some_unknown_code',
        },
        message: 'Custom error message',
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Custom error message')
      })
    })

    it('sets default error message when no specific message', async () => {
      // No errors property, no response → falls through to network/default error
      const error = {
        response: { status: 500 },
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toContain('Verifizierung')
      })
    })

    it('sets network error message when no response', async () => {
      const error = {} // no errors, no response, no message
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toContain('Netzwerkfehler')
      })
    })
  })

  describe('resendVerification', () => {
    it('resets attempts to 3 on successful resend', async () => {
      const { result } = renderHook(() => useEmailVerification())

      // First simulate failed verification to reduce attempts
      const error = {
        errors: {
          detail: 'invalid_verification_code',
          attempts: 1,
        },
        message: 'Wrong code',
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(error)

      await act(async () => {
        await result.current.verifyEmail('wrong', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.attempts).toBe(1)
      })

      // Now resend - mock for successful resend
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await result.current.resendVerification('test@example.com')
      })

      await waitFor(() => {
        expect(result.current.attempts).toBe(3)
        expect(result.current.error).toBe('')
      })
    })

    it('clears error on successful resend', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.resendVerification('test@example.com')
      })

      expect(result.current.error).toBe('')
    })

    it('calls resend endpoint with email', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.resendVerification('test@example.com')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/users/resend-code/', {
        email: 'test@example.com',
      })
    })

    it('sets network error on resend failure', async () => {
      const { result } = renderHook(() => useEmailVerification())

      vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Failed'))

      await act(async () => {
        await result.current.resendVerification('test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toContain('Netzwerkfehler')
      })
    })
  })
})
