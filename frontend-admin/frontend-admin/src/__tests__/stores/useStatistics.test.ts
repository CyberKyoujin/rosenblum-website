import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}))

import useStatistics from '../../zustand/useStatistics'
import axiosInstance from '../../zustand/axiosInstance'

describe('useStatistics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStatistics.setState({
      baseStats: null,
      statusData: [],
      dynamicsData: [],
      typeData: [],
      geographyData: [],
      growthData: [],
      comparisonData: null,
      isBaseLoading: false,
      isStatusLoading: false,
      isDynamicsLoading: false,
      isTypeLoading: false,
      isGeographyLoading: false,
      isGrowthLoading: false,
      isComparisonLoading: false,
      baseError: null,
      statusError: null,
      dynamicsError: null,
      typeError: null,
      geographyError: null,
      growthError: null,
      comparisonError: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useStatistics.getState()

      expect(state.baseStats).toBe(null)
      expect(state.statusData).toEqual([])
      expect(state.dynamicsData).toEqual([])
      expect(state.isBaseLoading).toBe(false)
      expect(state.baseError).toBe(null)
    })
  })

  describe('fetchBaseStats', () => {
    it('fetches base stats successfully', async () => {
      const mockStats = {
        total_orders: 100,
        total_requests: 50,
        total_customers: 25,
        total_revenue: 10000,
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockStats })

      await act(async () => {
        await useStatistics.getState().fetchBaseStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/')
      expect(useStatistics.getState().baseStats).toEqual(mockStats)
      expect(useStatistics.getState().isBaseLoading).toBe(false)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringFetch = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringFetch = useStatistics.getState().isBaseLoading
        return { data: {} }
      })

      await act(async () => {
        await useStatistics.getState().fetchBaseStats()
      })

      expect(loadingDuringFetch).toBe(true)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useStatistics.getState().fetchBaseStats()
      })

      expect(useStatistics.getState().baseError).not.toBe(null)
    })
  })

  describe('fetchStatusStats', () => {
    it('fetches status distribution successfully', async () => {
      const mockData = [
        { status: 'pending', count: 10 },
        { status: 'completed', count: 20 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchStatusStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/status-distribution/')
      expect(useStatistics.getState().statusData).toEqual(mockData)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: {} },
      })

      await act(async () => {
        await useStatistics.getState().fetchStatusStats()
      })

      expect(useStatistics.getState().statusError).not.toBe(null)
    })
  })

  describe('fetchDynamicsStats', () => {
    it('fetches dynamics data successfully', async () => {
      const mockData = [
        { date: '2024-01', count: 15 },
        { date: '2024-02', count: 25 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchDynamicsStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/ordering-dynamics/')
      expect(useStatistics.getState().dynamicsData).toEqual(mockData)
    })
  })

  describe('fetchTypeStats', () => {
    it('fetches type distribution successfully', async () => {
      const mockData = [
        { type: 'translation', count: 30 },
        { type: 'notarization', count: 10 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchTypeStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/type-distribution/')
      expect(useStatistics.getState().typeData).toEqual(mockData)
    })
  })

  describe('fetchGeographyStats', () => {
    it('fetches geography data successfully', async () => {
      const mockData = [
        { city: 'Berlin', count: 50 },
        { city: 'Munich', count: 30 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchGeographyStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/customers-geography/')
      expect(useStatistics.getState().geographyData).toEqual(mockData)
    })
  })

  describe('fetchGrowthStats', () => {
    it('fetches growth data successfully', async () => {
      const mockData = [
        { month: '2024-01', customers: 10 },
        { month: '2024-02', customers: 15 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchGrowthStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/customers-growth/')
      expect(useStatistics.getState().growthData).toEqual(mockData)
    })
  })

  describe('fetchComparisonStats', () => {
    it('fetches comparison data successfully', async () => {
      const mockData = {
        orders: [10, 20, 15],
        requests: [5, 8, 12],
        labels: ['Jan', 'Feb', 'Mar'],
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData })

      await act(async () => {
        await useStatistics.getState().fetchComparisonStats()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/order-request-comparison/')
      expect(useStatistics.getState().comparisonData).toEqual(mockData)
    })
  })

  describe('fetchAllStats', () => {
    it('calls all fetch methods', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({ data: {} })

      await act(async () => {
        useStatistics.getState().fetchAllStats()
      })

      // Wait for all promises
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/status-distribution/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/ordering-dynamics/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/type-distribution/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/customers-geography/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/customers-growth/')
      expect(axiosInstance.get).toHaveBeenCalledWith('/statistics/order-request-comparison/')
    })
  })
})
