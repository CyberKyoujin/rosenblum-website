import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import useOrderStore from '../../zustand/useOrderStore'
import axiosInstance from '../../axios/axiosInstance'

describe('useOrderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({
      orders: null,
      ordersLoading: false,
      createOrderLoading: false,
      successfullyCreated: false,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useOrderStore.getState()

      expect(state.orders).toBe(null)
      expect(state.ordersLoading).toBe(false)
      expect(state.createOrderLoading).toBe(false)
      expect(state.successfullyCreated).toBe(false)
    })
  })

  describe('createOrder', () => {
    it('creates order successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { id: 1 } })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      const formData = new FormData()
      formData.append('name', 'Test Order')
      formData.append('email', 'test@example.com')

      await act(async () => {
        await useOrderStore.getState().createOrder(formData)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/orders/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      expect(useOrderStore.getState().successfullyCreated).toBe(true)
    })

    it('sets loading state during creation', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useOrderStore.getState().createOrderLoading
        return { data: { id: 1 } }
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [] })

      const formData = new FormData()

      await act(async () => {
        await useOrderStore.getState().createOrder(formData)
      })

      expect(loadingDuringCall).toBe(true)
      expect(useOrderStore.getState().createOrderLoading).toBe(false)
    })

    it('sets successfullyCreated to false on error', async () => {
      const apiError = { status: 400, code: 'validation_error', message: 'Invalid data' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      const formData = new FormData()

      try {
        await act(async () => {
          await useOrderStore.getState().createOrder(formData)
        })
      } catch {
        // Expected to throw
      }

      // After error, successfullyCreated should be false
      expect(useOrderStore.getState().successfullyCreated).toBe(false)
    })

    it('fetches orders after successful creation', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { id: 1 } })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { results: [{ id: 1, name: 'Test Order' }] },
      })

      const formData = new FormData()

      await act(async () => {
        await useOrderStore.getState().createOrder(formData)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/orders/')
      expect(useOrderStore.getState().orders).toEqual([{ id: 1, name: 'Test Order' }])
    })
  })

  describe('fetchOrders', () => {
    it('fetches orders with paginated response', async () => {
      const ordersData = [
        { id: 1, name: 'Order 1', status: 'review' },
        { id: 2, name: 'Order 2', status: 'completed' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { results: ordersData, count: 2 },
      })

      await act(async () => {
        await useOrderStore.getState().fetchOrders()
      })

      expect(useOrderStore.getState().orders).toEqual(ordersData)
      expect(useOrderStore.getState().ordersLoading).toBe(false)
    })

    it('fetches orders with non-paginated response', async () => {
      const ordersData = [
        { id: 1, name: 'Order 1' },
        { id: 2, name: 'Order 2' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: ordersData })

      await act(async () => {
        await useOrderStore.getState().fetchOrders()
      })

      expect(useOrderStore.getState().orders).toEqual(ordersData)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringCall = useOrderStore.getState().ordersLoading
        return { data: [] }
      })

      await act(async () => {
        await useOrderStore.getState().fetchOrders()
      })

      expect(loadingDuringCall).toBe(true)
      expect(useOrderStore.getState().ordersLoading).toBe(false)
    })

    it('throws error on fetch failure', async () => {
      const apiError = { status: 500, code: 'server_error', message: 'Server error' }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(apiError)

      let errorThrown = false
      try {
        await act(async () => {
          await useOrderStore.getState().fetchOrders()
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })

    it('handles empty orders response', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        await useOrderStore.getState().fetchOrders()
      })

      expect(useOrderStore.getState().orders).toEqual([])
    })
  })
})
