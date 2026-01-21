import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import Cookies from 'js-cookie'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({
    id: 1,
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    profile_img_url: '',
  })),
}))

import useAuthStore from '../../zustand/useAuthStore'
import axiosInstance from '../../zustand/axiosInstance'

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the store state
    useAuthStore.setState({
      authTokens: null,
      isAuthenticated: false,
      user: null,
      loading: false,
      loginError: null,
      loginSuperuserError: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useAuthStore.getState()

      expect(state.authTokens).toBe(null)
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.loading).toBe(false)
      expect(state.loginError).toBe(null)
    })
  })

  describe('setTokens', () => {
    it('sets tokens and marks user as authenticated', () => {
      const tokens = { access: 'access-token', refresh: 'refresh-token' }

      act(() => {
        useAuthStore.getState().setTokens(tokens)
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toEqual(tokens)
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).not.toBe(null)
    })

    it('clears state when tokens are null', () => {
      // First set tokens
      const tokens = { access: 'access-token', refresh: 'refresh-token' }
      act(() => {
        useAuthStore.getState().setTokens(tokens)
      })

      // Then clear them
      act(() => {
        useAuthStore.getState().setTokens(null as any)
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toBe(null)
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
    })
  })

  describe('setUser', () => {
    it('sets user data', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        profile_img_url: 'https://example.com/photo.jpg',
      }

      act(() => {
        useAuthStore.getState().setUser(user)
      })

      expect(useAuthStore.getState().user).toEqual(user)
    })
  })

  describe('loginUser', () => {
    it('logs in successfully and sets tokens', async () => {
      const mockResponse = {
        data: {
          access: 'new-access-token',
          refresh: 'new-refresh-token',
        },
      }
      vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse)

      const formData = new FormData()
      formData.append('email', 'admin@example.com')
      formData.append('password', 'password123')

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/admin-user/login/', formData)
      expect(Cookies.set).toHaveBeenCalledWith('access', 'new-access-token', expect.any(Object))
      expect(Cookies.set).toHaveBeenCalledWith('refresh', 'new-refresh-token', expect.any(Object))
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('sets loading state during login', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useAuthStore.getState().loading
        return { data: { access: 'token', refresh: 'token' } }
      })

      const formData = new FormData()

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(loadingDuringCall).toBe(true)
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('sets 401 error message for wrong credentials', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 401, data: { detail: 'Invalid credentials' } },
      })

      const formData = new FormData()

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(useAuthStore.getState().loginError?.message).toBe('E-Mail oder Passwort ist falsch')
    })

    it('sets 403 error message for non-admin users', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 403, data: { detail: 'Not authorized' } },
      })

      const formData = new FormData()

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(useAuthStore.getState().loginError?.message).toBe('Nur Admin-Nutzer können sich einloggen')
    })

    it('clears error before login attempt', async () => {
      // Set an existing error
      useAuthStore.setState({ loginError: { status: 400, code: 'error', message: 'Old error' } })

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { access: 'token', refresh: 'token' },
      })

      const formData = new FormData()

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      // Error should be cleared (null) on success
      expect(useAuthStore.getState().loginError).toBe(null)
    })
  })

  describe('logoutUser', () => {
    it('clears tokens and user data', () => {
      // First login
      useAuthStore.setState({
        authTokens: { access: 'token', refresh: 'token' },
        isAuthenticated: true,
        user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', profile_img_url: '' },
      })

      act(() => {
        useAuthStore.getState().logoutUser()
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toBe(null)
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
    })

    it('removes cookies on logout', () => {
      act(() => {
        useAuthStore.getState().logoutUser()
      })

      expect(Cookies.remove).toHaveBeenCalledWith('access', expect.any(Object))
      expect(Cookies.remove).toHaveBeenCalledWith('refresh', expect.any(Object))
    })
  })

  describe('refreshToken', () => {
    it('refreshes tokens successfully', async () => {
      vi.mocked(Cookies.get).mockReturnValue('valid-refresh-token' as unknown as { [key: string]: string })
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { access: 'new-access', refresh: 'new-refresh' },
      })

      await act(async () => {
        await useAuthStore.getState().refreshToken()
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/token-refresh/', { refresh: 'valid-refresh-token' })
      expect(Cookies.set).toHaveBeenCalledWith('access', 'new-access', expect.any(Object))
      expect(Cookies.set).toHaveBeenCalledWith('refresh', 'new-refresh', expect.any(Object))
    })

    it('logs out when no refresh token exists', async () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as unknown as { [key: string]: string })

      let errorThrown = false
      await act(async () => {
        try {
          await useAuthStore.getState().refreshToken()
        } catch {
          errorThrown = true
        }
      })

      expect(errorThrown).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('throws error on refresh failure', async () => {
      vi.mocked(Cookies.get).mockReturnValue('valid-refresh-token' as unknown as { [key: string]: string })
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Refresh failed'))

      let errorThrown = false
      await act(async () => {
        try {
          await useAuthStore.getState().refreshToken()
        } catch {
          errorThrown = true
        }
      })

      expect(errorThrown).toBe(true)
    })
  })
})
