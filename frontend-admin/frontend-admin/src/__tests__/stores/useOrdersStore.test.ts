import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import useOrdersStore from '../../zustand/useOrdersStore'
import axiosInstance from '../../zustand/axiosInstance'

describe('useOrdersStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useOrdersStore.setState({
      orders: null,
      order: null,
      loading: false,
      error: null,
      filters: { search: '', ordering: '-timestamp' },
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useOrdersStore.getState()

      expect(state.orders).toBe(null)
      expect(state.order).toBe(null)
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.filters).toEqual({ search: '', ordering: '-timestamp' })
    })
  })

  describe('setFilters', () => {
    it('updates filters and fetches orders', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [], count: 0 } })

      await act(async () => {
        useOrdersStore.getState().setFilters({ search: 'test' })
      })

      const state = useOrdersStore.getState()
      expect(state.filters.search).toBe('test')
      expect(axiosInstance.get).toHaveBeenCalled()
    })

    it('merges filters with existing values', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useOrdersStore.getState().setFilters({ status: 'completed' })
      })

      const state = useOrdersStore.getState()
      expect(state.filters.search).toBe('')
      expect(state.filters.ordering).toBe('-timestamp')
      expect(state.filters.status).toBe('completed')
    })
  })

  describe('fetchOrders', () => {
    it('fetches orders successfully', async () => {
      const mockOrders = {
        results: [
          { id: 1, name: 'Order 1', status: 'pending' },
          { id: 2, name: 'Order 2', status: 'completed' },
        ],
        count: 2,
        next: null,
        previous: null,
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockOrders })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/orders', expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }))
      expect(useOrdersStore.getState().orders).toEqual(mockOrders)
      expect(useOrdersStore.getState().loading).toBe(false)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringFetch = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringFetch = useOrdersStore.getState().loading
        return { data: { results: [] } }
      })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders(1)
      })

      expect(loadingDuringFetch).toBe(true)
      expect(useOrdersStore.getState().loading).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders(1)
      })

      expect(useOrdersStore.getState().error).not.toBe(null)
      expect(useOrdersStore.getState().loading).toBe(false)
    })

    it('passes filter params to API', async () => {
      useOrdersStore.setState({
        filters: { search: 'test', ordering: '-timestamp', status: 'pending', isNew: true },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders(2)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/orders', {
        params: {
          page: 2,
          search: 'test',
          ordering: '-timestamp',
          status: 'pending',
          is_new: true,
        },
      })
    })
  })

  describe('fetchOrder', () => {
    it('fetches single order by id', async () => {
      const mockOrder = { id: 1, name: 'Test Order', status: 'pending' }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockOrder })

      await act(async () => {
        await useOrdersStore.getState().fetchOrder(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/orders/1/')
      expect(useOrdersStore.getState().order).toEqual(mockOrder)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404, data: { detail: 'Not found' } },
      })

      await act(async () => {
        await useOrdersStore.getState().fetchOrder(999)
      })

      expect(useOrdersStore.getState().error).not.toBe(null)
    })
  })

  describe('toggleOrder', () => {
    it('toggles order viewed status', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useOrdersStore.getState().toggleOrder(1)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/orders/1/toggle/')
    })

    it('sets error on toggle failure', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 400, data: { detail: 'Error' } },
      })

      await act(async () => {
        await useOrdersStore.getState().toggleOrder(1)
      })

      expect(useOrdersStore.getState().error).not.toBe(null)
    })
  })

  describe('updateOrder', () => {
    it('updates order status and type', async () => {
      vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useOrdersStore.getState().updateOrder(1, 'completed', 'translation')
      })

      expect(axiosInstance.patch).toHaveBeenCalledWith('/orders/1/', {
        status: 'completed',
        order_type: 'translation',
      })
    })

    it('sets error on update failure', async () => {
      vi.mocked(axiosInstance.patch).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 400, data: { detail: 'Invalid status' } },
      })

      await act(async () => {
        await useOrdersStore.getState().updateOrder(1, 'invalid', 'type')
      })

      expect(useOrdersStore.getState().error).not.toBe(null)
    })
  })

  describe('deleteOrder', () => {
    it('deletes order by id', async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useOrdersStore.getState().deleteOrder(1)
      })

      expect(axiosInstance.delete).toHaveBeenCalledWith('/orders/1/')
    })

    it('sets error on delete failure', async () => {
      vi.mocked(axiosInstance.delete).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 403, data: { detail: 'Forbidden' } },
      })

      await act(async () => {
        await useOrdersStore.getState().deleteOrder(1)
      })

      expect(useOrdersStore.getState().error).not.toBe(null)
    })
  })
})
