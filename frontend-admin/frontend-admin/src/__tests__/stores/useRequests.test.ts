import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import useRequestsStore from '../../zustand/useRequests'
import axiosInstance from '../../zustand/axiosInstance'

describe('useRequestsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRequestsStore.setState({
      requests: null,
      request: null,
      requestAnswers: null,
      loading: false,
      sendAnswerLoading: false,
      sendAnswerSuccess: false,
      error: null,
      filters: { search: '', ordering: '-timestamp' },
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useRequestsStore.getState()

      expect(state.requests).toBe(null)
      expect(state.request).toBe(null)
      expect(state.requestAnswers).toBe(null)
      expect(state.loading).toBe(false)
      expect(state.sendAnswerLoading).toBe(false)
      expect(state.sendAnswerSuccess).toBe(false)
      expect(state.error).toBe(null)
      expect(state.filters).toEqual({ search: '', ordering: '-timestamp' })
    })
  })

  describe('setFilters', () => {
    it('updates filters and fetches requests', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useRequestsStore.getState().setFilters({ search: 'test' })
      })

      expect(useRequestsStore.getState().filters.search).toBe('test')
      expect(axiosInstance.get).toHaveBeenCalled()
    })

    it('merges filters with existing values', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useRequestsStore.getState().setFilters({ isNew: true })
      })

      const state = useRequestsStore.getState()
      expect(state.filters.search).toBe('')
      expect(state.filters.ordering).toBe('-timestamp')
      expect(state.filters.isNew).toBe(true)
    })
  })

  describe('fetchRequests', () => {
    it('fetches requests successfully', async () => {
      const mockRequests = {
        results: [
          { id: 1, name: 'Request 1', email: 'test1@example.com' },
          { id: 2, name: 'Request 2', email: 'test2@example.com' },
        ],
        count: 2,
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockRequests })

      await act(async () => {
        await useRequestsStore.getState().fetchRequests(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('requests/', expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }))
      expect(useRequestsStore.getState().requests).toEqual(mockRequests)
      expect(useRequestsStore.getState().loading).toBe(false)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringFetch = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringFetch = useRequestsStore.getState().loading
        return { data: { results: [] } }
      })

      await act(async () => {
        await useRequestsStore.getState().fetchRequests(1)
      })

      expect(loadingDuringFetch).toBe(true)
      expect(useRequestsStore.getState().loading).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useRequestsStore.getState().fetchRequests(1)
      })

      expect(useRequestsStore.getState().error).not.toBe(null)
    })

    it('passes filter params to API', async () => {
      useRequestsStore.setState({
        filters: { search: 'test', ordering: 'timestamp', isNew: true },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        await useRequestsStore.getState().fetchRequests(2)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('requests/', {
        params: {
          page: 2,
          search: 'test',
          ordering: 'timestamp',
          is_new: true,
        },
      })
    })
  })

  describe('fetchRequestData', () => {
    it('fetches request data by id', async () => {
      const mockRequest = { id: 1, name: 'Test Request', email: 'test@example.com' }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockRequest })

      await act(async () => {
        await useRequestsStore.getState().fetchRequestData(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/requests/1')
      expect(useRequestsStore.getState().request).toEqual(mockRequest)
    })

    it('resets sendAnswerSuccess on fetch', async () => {
      useRequestsStore.setState({ sendAnswerSuccess: true })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useRequestsStore.getState().fetchRequestData(1)
      })

      expect(useRequestsStore.getState().sendAnswerSuccess).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404, data: { detail: 'Not found' } },
      })

      await act(async () => {
        await useRequestsStore.getState().fetchRequestData(999)
      })

      expect(useRequestsStore.getState().error).not.toBe(null)
    })
  })

  describe('fetchRequestAnswers', () => {
    it('fetches answers for a request', async () => {
      const mockAnswers = [
        { id: 1, content: 'Answer 1', timestamp: '2024-01-01' },
        { id: 2, content: 'Answer 2', timestamp: '2024-01-02' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockAnswers })

      await act(async () => {
        await useRequestsStore.getState().fetchRequestAnswers(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/requests/1/answers/')
      expect(useRequestsStore.getState().requestAnswers).toEqual(mockAnswers)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useRequestsStore.getState().fetchRequestAnswers(1)
      })

      expect(useRequestsStore.getState().error).not.toBe(null)
    })
  })

  describe('sendRequestAnswer', () => {
    it('sends answer successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const formData = new FormData()
      formData.append('content', 'This is an answer')

      await act(async () => {
        await useRequestsStore.getState().sendRequestAnswer(1, formData)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/requests/1/answers/', formData)
      expect(useRequestsStore.getState().sendAnswerSuccess).toBe(true)
    })

    it('sets loading state during send', async () => {
      let loadingDuringSend = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringSend = useRequestsStore.getState().sendAnswerLoading
        return { data: {} }
      })

      const formData = new FormData()

      await act(async () => {
        await useRequestsStore.getState().sendRequestAnswer(1, formData)
      })

      expect(loadingDuringSend).toBe(true)
      expect(useRequestsStore.getState().sendAnswerLoading).toBe(false)
    })

    it('sets error on send failure', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 400, data: { detail: 'Invalid answer' } },
      })

      const formData = new FormData()

      await act(async () => {
        await useRequestsStore.getState().sendRequestAnswer(1, formData)
      })

      expect(useRequestsStore.getState().error).not.toBe(null)
      expect(useRequestsStore.getState().sendAnswerSuccess).toBe(false)
    })
  })

  describe('toggleRequest', () => {
    it('toggles request viewed status', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useRequestsStore.getState().toggleRequest(1)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/requests/1/toggle/')
    })

    it('sets error on toggle failure', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 400, data: { detail: 'Error' } },
      })

      await act(async () => {
        await useRequestsStore.getState().toggleRequest(1)
      })

      expect(useRequestsStore.getState().error).not.toBe(null)
    })
  })
})
