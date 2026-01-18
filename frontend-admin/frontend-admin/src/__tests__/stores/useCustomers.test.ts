import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}))

import useCustomersStore from '../../zustand/useCustomers'
import axiosInstance from '../../zustand/axiosInstance'

describe('useCustomersStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCustomersStore.setState({
      customers: null,
      customerOrders: null,
      customerData: null,
      loading: false,
      error: null,
      filters: { search: '', ordering: '-date_joined' },
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useCustomersStore.getState()

      expect(state.customers).toBe(null)
      expect(state.customerOrders).toBe(null)
      expect(state.customerData).toBe(null)
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.filters).toEqual({ search: '', ordering: '-date_joined' })
    })
  })

  describe('setFilters', () => {
    it('updates filters and fetches customers', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useCustomersStore.getState().setFilters({ search: 'john' })
      })

      expect(useCustomersStore.getState().filters.search).toBe('john')
      expect(axiosInstance.get).toHaveBeenCalled()
    })

    it('merges filters with existing values', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useCustomersStore.getState().setFilters({ ordering: 'date_joined' })
      })

      const state = useCustomersStore.getState()
      expect(state.filters.search).toBe('')
      expect(state.filters.ordering).toBe('date_joined')
    })
  })

  describe('fetchCustomers', () => {
    it('fetches customers successfully', async () => {
      const mockCustomers = {
        results: [
          { id: 1, email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
          { id: 2, email: 'jane@example.com', first_name: 'Jane', last_name: 'Doe' },
        ],
        count: 2,
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockCustomers })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomers(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/user/users/', expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }))
      expect(useCustomersStore.getState().customers).toEqual(mockCustomers)
      expect(useCustomersStore.getState().loading).toBe(false)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringFetch = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringFetch = useCustomersStore.getState().loading
        return { data: { results: [] } }
      })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomers(1)
      })

      expect(loadingDuringFetch).toBe(true)
      expect(useCustomersStore.getState().loading).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomers(1)
      })

      expect(useCustomersStore.getState().error).not.toBe(null)
    })

    it('passes filter params to API', async () => {
      useCustomersStore.setState({
        filters: { search: 'test', ordering: 'date_joined' },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomers(2)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/user/users/', {
        params: {
          page: 2,
          search: 'test',
          ordering: 'date_joined',
        },
      })
    })
  })

  describe('fetchCustomerData', () => {
    it('fetches customer data by id', async () => {
      const mockCustomer = {
        id: 1,
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+123456789',
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockCustomer })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomerData(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/user/users/1')
      expect(useCustomersStore.getState().customerData).toEqual(mockCustomer)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404, data: { detail: 'Not found' } },
      })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomerData(999)
      })

      expect(useCustomersStore.getState().error).not.toBe(null)
    })
  })

  describe('fetchCustomerOrders', () => {
    it('fetches customer orders by id', async () => {
      const mockOrders = [
        { id: 1, status: 'pending', name: 'Order 1' },
        { id: 2, status: 'completed', name: 'Order 2' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockOrders })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomerOrders(5)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/orders/user/5/')
      expect(useCustomersStore.getState().customerOrders).toEqual(mockOrders)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useCustomersStore.getState().fetchCustomerOrders(5)
      })

      expect(useCustomersStore.getState().error).not.toBe(null)
    })
  })
})
