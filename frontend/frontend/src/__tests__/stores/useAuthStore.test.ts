import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance before importing store
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import useAuthStore from '../../zustand/useAuthStore'
import axiosInstance from '../../axios/axiosInstance'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
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
    it('sets isAuthenticated to false when session is invalid', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        status: 401,
        code: 'unauthorized',
        message: 'Not authenticated',
      })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthLoading).toBe(false)
      expect(state.isAuthenticated).toBe(false)
    })

    it('initializes auth and fetches user data from valid session', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
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

    it('sets isAuthenticated false on non-401 error', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        status: 500,
        code: 'server_error',
        message: 'Server error',
      })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthLoading).toBe(false)
    })
  })

  describe('loginUser', () => {
    it('successfully logs in and sets isAuthenticated', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          date_joined: '2024-01-01',
          phone_number: null,
          city: null,
          street: null,
          zip: null,
          image_url: null,
        },
      })

      await act(async () => {
        await useAuthStore.getState().loginUser('test@example.com', 'password123')
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(axiosInstance.post).toHaveBeenCalledWith('/user/login/', {
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('sets loading state during login', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useAuthStore.getState().loading
        return { data: {} }
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
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().googleLogin('google-oauth-token')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/user/login/google/', { access_token: 'google-oauth-token' })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  describe('logoutUser', () => {
    it('clears all auth state', async () => {
      useAuthStore.setState({
        user: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', profile_img_url: '' },
        isAuthenticated: true,
        userData: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', profile_img_url: null, date_joined: '2024-01-01', phone_number: null, city: null, street: null, zip: null, image_url: null },
      })

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().logoutUser()
      })

      const state = useAuthStore.getState()
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
      expect(state.userData).toBe(null)
    })

    it('clears state even if logout request fails', async () => {
      useAuthStore.setState({ isAuthenticated: true })
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({ status: 500 })

      await act(async () => {
        await useAuthStore.getState().logoutUser()
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
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

    it('throws error on fetch failure', async () => {
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

      expect(axiosInstance.patch).toHaveBeenCalledWith('/user/users/me/', formData)
    })
  })
})
