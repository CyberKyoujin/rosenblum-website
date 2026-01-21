import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import Cookies from 'js-cookie'

// Mock axiosInstance before importing store
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({
    id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    profile_img_url: '',
  })),
}))

import useAuthStore from '../../zustand/useAuthStore'
import axiosInstance from '../../axios/axiosInstance'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      authTokens: null,
      user: null,
      loading: false,
      userDataLoading: false,
      userDataError: null,
      isAuthenticated: false,
      userData: null,
      userMessages: null,
      isAuthLoading: true,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setTokens', () => {
    it('sets tokens and decodes user from access token', () => {
      const tokens = { access: 'test-access-token', refresh: 'test-refresh-token' }

      act(() => {
        useAuthStore.getState().setTokens(tokens)
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toEqual(tokens)
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual({
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        profile_img_url: '',
      })
    })

    it('clears tokens when null is passed', () => {
      // First set tokens
      useAuthStore.setState({
        authTokens: { access: 'token', refresh: 'refresh' },
        user: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', profile_img_url: '' },
        isAuthenticated: true,
      })

      act(() => {
        useAuthStore.getState().setTokens(null)
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toBe(null)
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets the user', () => {
      const user = { id: 2, email: 'new@example.com', first_name: 'Jane', last_name: 'Doe', profile_img_url: '' }

      act(() => {
        useAuthStore.getState().setUser(user)
      })

      expect(useAuthStore.getState().user).toEqual(user)
    })
  })

  describe('initAuth', () => {
    it('does nothing when no tokens in cookies', async () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as unknown as { [key: string]: string })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthLoading).toBe(false)
      expect(state.isAuthenticated).toBe(false)
    })

    it('initializes auth from cookies and fetches user data', async () => {
      vi.mocked(Cookies.get)
        .mockReturnValueOnce('access-token' as unknown as { [key: string]: string }) // first call for access
        .mockReturnValueOnce('refresh-token' as unknown as { [key: string]: string }) // second call for refresh

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: {
          date_joined: '2024-01-01',
          phone_number: '123456789',
          city: 'Berlin',
          street: 'Main St',
          zip: '12345',
          image_url: null,
        },
      })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.isAuthLoading).toBe(false)
      expect(state.userData).toBeTruthy()
    })

    it('logs out user on 401 error', async () => {
      vi.mocked(Cookies.get)
        .mockReturnValueOnce('access-token' as unknown as { [key: string]: string })
        .mockReturnValueOnce('refresh-token' as unknown as { [key: string]: string })

      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        status: 401,
        code: 'unauthorized',
        message: 'Token expired',
      })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      expect(Cookies.remove).toHaveBeenCalled()
    })
  })

  describe('loginUser', () => {
    it('successfully logs in and sets tokens', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { access: 'new-access', refresh: 'new-refresh' },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { date_joined: '2024-01-01', phone_number: null, city: null, street: null, zip: null, image_url: null },
      })

      await act(async () => {
        await useAuthStore.getState().loginUser('test@example.com', 'password123')
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(Cookies.set).toHaveBeenCalledWith('access', 'new-access', expect.any(Object))
      expect(Cookies.set).toHaveBeenCalledWith('refresh', 'new-refresh', expect.any(Object))
    })

    it('sets loading state during login', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useAuthStore.getState().loading
        return { data: { access: 'token', refresh: 'refresh' } }
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().loginUser('test@example.com', 'password')
      })

      expect(loadingDuringCall).toBe(true)
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('throws error on failed login', async () => {
      const apiError = { status: 401, code: 'authentication_failed', message: 'Invalid credentials' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      let errorThrown = false
      try {
        await act(async () => {
          await useAuthStore.getState().loginUser('test@example.com', 'wrongpassword')
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })
  })

  describe('registerUser', () => {
    it('successfully registers user', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().registerUser('test@example.com', 'John', 'Doe', 'password123')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('user/users/register/', {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
      })
    })

    it('throws error when email already exists', async () => {
      const apiError = { status: 409, code: 'email_exists', message: 'Email already registered' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      await expect(
        act(async () => {
          await useAuthStore.getState().registerUser('existing@example.com', 'John', 'Doe', 'password')
        })
      ).rejects.toEqual(apiError)
    })
  })

  describe('googleLogin', () => {
    it('successfully logs in with Google', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { access: 'google-access', refresh: 'google-refresh' },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().googleLogin('google-oauth-token')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/login/google/', { access_token: 'google-oauth-token' })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  describe('logoutUser', () => {
    it('clears all auth state and cookies', () => {
      useAuthStore.setState({
        authTokens: { access: 'token', refresh: 'refresh' },
        user: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', profile_img_url: '' },
        isAuthenticated: true,
        userData: { date_joined: '2024-01-01', phone_number: null, city: null, street: null, zip: null, image_url: null },
      })

      act(() => {
        useAuthStore.getState().logoutUser()
      })

      const state = useAuthStore.getState()
      expect(state.authTokens).toBe(null)
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
      expect(state.userData).toBe(null)
      expect(Cookies.remove).toHaveBeenCalledWith('access', expect.any(Object))
      expect(Cookies.remove).toHaveBeenCalledWith('refresh', expect.any(Object))
    })
  })

  describe('updateToken', () => {
    it('refreshes token successfully', async () => {
      vi.mocked(Cookies.get).mockReturnValueOnce('old-refresh-token' as unknown as { [key: string]: string })
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { access: 'new-access', refresh: 'new-refresh' },
      })

      await act(async () => {
        await useAuthStore.getState().updateToken()
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/token-refresh/', { refresh: 'old-refresh-token' })
      expect(Cookies.set).toHaveBeenCalledWith('access', 'new-access', expect.any(Object))
    })

    it('logs out when no refresh token', async () => {
      vi.mocked(Cookies.get).mockReturnValueOnce(undefined as unknown as { [key: string]: string })

      await expect(
        act(async () => {
          await useAuthStore.getState().updateToken()
        })
      ).rejects.toThrow('Refresh token not found')

      expect(Cookies.remove).toHaveBeenCalled()
    })

    it('logs out on refresh error', async () => {
      vi.mocked(Cookies.get).mockReturnValueOnce('refresh-token' as unknown as { [key: string]: string })
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({ status: 401, code: 'invalid_token', message: 'Invalid refresh token' })

      let errorThrown = false
      try {
        await act(async () => {
          await useAuthStore.getState().updateToken()
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })
  })

  describe('fetchUserData', () => {
    it('fetches and stores user data', async () => {
      const userData = {
        date_joined: '2024-01-01',
        phone_number: '123456789',
        city: 'Berlin',
        street: 'Main St',
        zip: '12345',
        image_url: 'http://example.com/image.jpg',
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: userData })

      await act(async () => {
        await useAuthStore.getState().fetchUserData()
      })

      expect(useAuthStore.getState().userData).toEqual(userData)
      expect(useAuthStore.getState().userDataLoading).toBe(false)
    })

    it('logs out on 401 error', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({ status: 401, code: 'unauthorized', message: 'Unauthorized' })

      let errorThrown = false
      try {
        await act(async () => {
          await useAuthStore.getState().fetchUserData()
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })
  })

  describe('sendResetLink', () => {
    it('sends password reset link', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().sendResetLink('test@example.com')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/users/reset-password-link/', { email: 'test@example.com' })
    })

    it('throws error when email not found', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({ status: 404, code: 'not_found', message: 'Email not found' })

      await expect(
        act(async () => {
          await useAuthStore.getState().sendResetLink('unknown@example.com')
        })
      ).rejects.toBeTruthy()
    })
  })

  describe('resetPassword', () => {
    it('resets password successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().resetPassword('uid123', 'token456', 'newpassword')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/users/reset-password-confirm/', {
        uid: 'uid123',
        token: 'token456',
        password: 'newpassword',
      })
    })
  })

  describe('updateUserProfile', () => {
    it('updates user profile', async () => {
      vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { date_joined: '2024-01-01', phone_number: '999', city: 'Munich', street: 'New St', zip: '54321', image_url: null },
      })

      const formData = new FormData()
      formData.append('city', 'Munich')

      await act(async () => {
        await useAuthStore.getState().updateUserProfile(formData)
      })

      expect(axiosInstance.patch).toHaveBeenCalledWith('/user/users/', formData)
    })
  })
})
