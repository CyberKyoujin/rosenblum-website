import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../zustand/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import useMessages from '../../zustand/useMessages'
import axiosInstance from '../../zustand/axiosInstance'

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMessages.setState({
      messages: null,
      userMessages: null,
      messagesLoading: false,
      fetchMessagesError: null,
      sendMessagesLoading: false,
      filters: { search: '', ordering: '-timestamp' },
    })
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useMessages.getState()

      expect(state.messages).toBe(null)
      expect(state.userMessages).toBe(null)
      expect(state.messagesLoading).toBe(false)
      expect(state.fetchMessagesError).toBe(null)
      expect(state.sendMessagesLoading).toBe(false)
      expect(state.filters).toEqual({ search: '', ordering: '-timestamp' })
    })
  })

  describe('setFilters', () => {
    it('updates filters and fetches messages', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useMessages.getState().setFilters({ search: 'test' })
      })

      expect(useMessages.getState().filters.search).toBe('test')
      expect(axiosInstance.get).toHaveBeenCalled()
    })

    it('merges filters with existing values', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        useMessages.getState().setFilters({ viewed: true })
      })

      const state = useMessages.getState()
      expect(state.filters.search).toBe('')
      expect(state.filters.ordering).toBe('-timestamp')
      expect(state.filters.viewed).toBe(true)
    })
  })

  describe('fetchMessages', () => {
    it('fetches messages successfully', async () => {
      const mockMessages = {
        results: [
          { id: 1, sender_id: 1, content: 'Hello', timestamp: '2024-01-01' },
          { id: 2, sender_id: 2, content: 'Hi', timestamp: '2024-01-02' },
        ],
        count: 2,
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockMessages })

      await act(async () => {
        await useMessages.getState().fetchMessages(1)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin-user/messages/', expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }))
      expect(useMessages.getState().messages).toEqual(mockMessages)
      expect(useMessages.getState().messagesLoading).toBe(false)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringFetch = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringFetch = useMessages.getState().messagesLoading
        return { data: { results: [] } }
      })

      await act(async () => {
        await useMessages.getState().fetchMessages(1)
      })

      expect(loadingDuringFetch).toBe(true)
      expect(useMessages.getState().messagesLoading).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 500, data: { detail: 'Server error' } },
      })

      await act(async () => {
        await useMessages.getState().fetchMessages(1)
      })

      expect(useMessages.getState().fetchMessagesError).not.toBe(null)
    })

    it('passes filter params to API', async () => {
      useMessages.setState({
        filters: { search: 'john', ordering: 'timestamp', viewed: false },
      })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { results: [] } })

      await act(async () => {
        await useMessages.getState().fetchMessages(2)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin-user/messages/', {
        params: {
          page: 2,
          search: 'john',
          viewed: false,
          ordering: 'timestamp',
        },
      })
    })
  })

  describe('fetchUserMessages', () => {
    it('fetches user messages with results array', async () => {
      const mockMessages = {
        results: [
          { id: 1, content: 'Message 1' },
          { id: 2, content: 'Message 2' },
        ],
      }
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockMessages })

      await act(async () => {
        await useMessages.getState().fetchUserMessages(5)
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages/', { params: { user_id: 5 } })
      expect(useMessages.getState().userMessages).toEqual(mockMessages.results)
    })

    it('fetches user messages without results wrapper', async () => {
      const mockMessages = [
        { id: 1, content: 'Message 1' },
        { id: 2, content: 'Message 2' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockMessages })

      await act(async () => {
        await useMessages.getState().fetchUserMessages(5)
      })

      expect(useMessages.getState().userMessages).toEqual(mockMessages)
    })

    it('sets error on fetch failure', async () => {
      vi.mocked(axiosInstance.get).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 404, data: { detail: 'User not found' } },
      })

      await act(async () => {
        await useMessages.getState().fetchUserMessages(999)
      })

      expect(useMessages.getState().fetchMessagesError).not.toBe(null)
    })
  })

  describe('sendMessage', () => {
    it('sends message successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      const formData = new FormData()
      formData.append('content', 'Hello!')

      await act(async () => {
        await useMessages.getState().sendMessage(formData, 5)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/messages/', formData)
      // Check that id was appended to formData
      expect(formData.get('id')).toBe('5')
    })

    it('sets loading state during send', async () => {
      let loadingDuringSend = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringSend = useMessages.getState().sendMessagesLoading
        return { data: {} }
      })

      const formData = new FormData()

      await act(async () => {
        await useMessages.getState().sendMessage(formData, 5)
      })

      expect(loadingDuringSend).toBe(true)
      expect(useMessages.getState().sendMessagesLoading).toBe(false)
    })

    it('sets error on send failure', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 400, data: { detail: 'Invalid message' } },
      })

      const formData = new FormData()

      await act(async () => {
        await useMessages.getState().sendMessage(formData, 5)
      })

      expect(useMessages.getState().fetchMessagesError).not.toBe(null)
    })
  })

  describe('toggleMessages', () => {
    it('toggles messages viewed status', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useMessages.getState().toggleMessages(5)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/messages/toggle/', { sender_id: 5 })
    })

    it('handles toggle failure silently', async () => {
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(new Error('Toggle failed'))

      // Should not throw
      await act(async () => {
        await useMessages.getState().toggleMessages(5)
      })

      // Error is only logged, not stored
      expect(useMessages.getState().fetchMessagesError).toBe(null)
    })
  })
})
