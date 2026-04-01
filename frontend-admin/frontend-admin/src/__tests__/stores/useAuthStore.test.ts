import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import useAuthStore from '../../zustand/useAuthStore'
import axiosInstance from '../../zustand/axiosInstance'

const mockAdminUser = {
  id: 1,
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  profile_img_url: null,
  is_staff: true,
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      isAuthenticated: false,
      isAuthLoading: true,
      user: null,
      loading: false,
      loginError: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useAuthStore.getState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.loading).toBe(false)
      expect(state.loginError).toBe(null)
    })
  })

  describe('initAuth', () => {
    it('sets authenticated and user when staff session is valid', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockAdminUser })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockAdminUser)
      expect(state.isAuthLoading).toBe(false)
    })

    it('sets isAuthenticated false when user is not staff', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { ...mockAdminUser, is_staff: false },
      })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.isAuthLoading).toBe(false)
    })

    it('sets isAuthenticated false on error', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({ status: 401, code: 'unauthorized' })

      await act(async () => {
        await useAuthStore.getState().initAuth()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isAuthLoading).toBe(false)
    })
  })

  describe('loginUser', () => {
    it('logs in successfully and authenticates', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockAdminUser })

      const formData = new FormData()
      formData.append('email', 'admin@example.com')
      formData.append('password', 'password123')

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/admin-user/login/', formData)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('sets loading state during login', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useAuthStore.getState().loading
        return { data: {} }
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockAdminUser })

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
      useAuthStore.setState({ loginError: { status: 400, code: 'error', message: 'Old error' } })

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockAdminUser })

      const formData = new FormData()

      await act(async () => {
        await useAuthStore.getState().loginUser(formData)
      })

      expect(useAuthStore.getState().loginError).toBe(null)
    })
  })

  describe('logoutUser', () => {
    it('clears user and isAuthenticated', async () => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: mockAdminUser,
      })

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useAuthStore.getState().logoutUser()
      })

      const state = useAuthStore.getState()
      expect(state.user).toBe(null)
      expect(state.isAuthenticated).toBe(false)
    })

    it('clears state even if logout request fails', async () => {
      useAuthStore.setState({ isAuthenticated: true, user: mockAdminUser })
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({ status: 500 })

      await act(async () => {
        await useAuthStore.getState().logoutUser()
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
