import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import axios from 'axios'

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
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = true
        return { data: {} }
      })

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      expect(result.current.loading).toBe(false)
    })

    it('updates attempts on failed verification', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            attempts: 2,
            message: 'Invalid code',
          },
        },
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(axiosError)
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('wrong', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.attempts).toBe(2)
        expect(result.current.error).toBe('Invalid code')
      })
    })

    it('sets error message from response detail', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            detail: 'Code expired',
          },
        },
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(axiosError)
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('expired', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toBe('Code expired')
      })
    })

    it('sets default error message when no specific message', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {},
        },
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(axiosError)
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.verifyEmail('123456', 'test@example.com')
      })

      await waitFor(() => {
        expect(result.current.error).toContain('Verifizierung')
      })
    })

    it('sets network error message for non-axios errors', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Network failed'))
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)

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
      const axiosError = {
        isAxiosError: true,
        response: { data: { attempts: 1, message: 'Wrong code' } },
      }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(axiosError)
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

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
