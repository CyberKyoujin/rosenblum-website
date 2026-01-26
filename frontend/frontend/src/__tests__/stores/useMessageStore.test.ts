import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import useMessageStore from '../../zustand/useMessageStore'
import axiosInstance from '../../axios/axiosInstance'

describe('useMessageStore', () => {
  beforeEach(() => {
    useMessageStore.setState({
      messages: null,
      messagesLoading: false,
      sendMessagesLoading: false,
      fetchMessagesError: null,
      requestLoading: false,
      sendRequestSuccess: false,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useMessageStore.getState()

      expect(state.messages).toBe(null)
      expect(state.messagesLoading).toBe(false)
      expect(state.sendMessagesLoading).toBe(false)
      expect(state.fetchMessagesError).toBe(null)
      expect(state.requestLoading).toBe(false)
      expect(state.sendRequestSuccess).toBe(false)
    })
  })

  describe('fetchUserMessages', () => {
    it('fetches messages with paginated response', async () => {
      const messagesData = [
        { id: 1, message: 'Hello', sender: 1, receiver: 2, timestamp: '2024-01-01T10:00:00Z' },
        { id: 2, message: 'Hi there', sender: 2, receiver: 1, timestamp: '2024-01-01T10:01:00Z' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { results: messagesData, count: 2 },
      })

      await act(async () => {
        await useMessageStore.getState().fetchUserMessages()
      })

      expect(axiosInstance.get).toHaveBeenCalledWith('/messages/')
      expect(useMessageStore.getState().messages).toEqual(messagesData)
      expect(useMessageStore.getState().messagesLoading).toBe(false)
    })

    it('fetches messages with non-paginated response', async () => {
      const messagesData = [{ id: 1, message: 'Test' }]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: messagesData })

      await act(async () => {
        await useMessageStore.getState().fetchUserMessages()
      })

      expect(useMessageStore.getState().messages).toEqual(messagesData)
    })

    it('sets loading state during fetch', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.get).mockImplementationOnce(async () => {
        loadingDuringCall = useMessageStore.getState().messagesLoading
        return { data: [] }
      })

      await act(async () => {
        await useMessageStore.getState().fetchUserMessages()
      })

      expect(loadingDuringCall).toBe(true)
      expect(useMessageStore.getState().messagesLoading).toBe(false)
    })

    it('sets error on fetch failure', async () => {
      const apiError = { status: 500, code: 'server_error', message: 'Server error' }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(apiError)

      let errorThrown = false
      try {
        await act(async () => {
          await useMessageStore.getState().fetchUserMessages()
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })

    it('clears error before fetching', async () => {
      useMessageStore.setState({ fetchMessagesError: { status: 500, code: 'error', message: 'Previous error' } })
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [] })

      await act(async () => {
        await useMessageStore.getState().fetchUserMessages()
      })

      expect(useMessageStore.getState().fetchMessagesError).toBe(null)
    })
  })

  describe('toggleMessages', () => {
    it('marks messages as viewed', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { status: 'success' } })

      await act(async () => {
        await useMessageStore.getState().toggleMessages(123)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/messages/toggle/', { sender_id: 123 })
    })

    it('throws error on failure', async () => {
      const apiError = { status: 400, code: 'bad_request', message: 'Invalid sender' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      await expect(
        act(async () => {
          await useMessageStore.getState().toggleMessages(999)
        })
      ).rejects.toBeTruthy()
    })
  })

  describe('sendMessage', () => {
    it('sends message with FormData', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { id: 1 } })

      const formData = new FormData()
      formData.append('message', 'Hello')

      await act(async () => {
        await useMessageStore.getState().sendMessage(formData)
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/messages/', expect.any(FormData))
      expect(useMessageStore.getState().sendMessagesLoading).toBe(false)
    })

    it('sets loading state during send', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useMessageStore.getState().sendMessagesLoading
        return { data: {} }
      })

      const formData = new FormData()

      await act(async () => {
        await useMessageStore.getState().sendMessage(formData)
      })

      expect(loadingDuringCall).toBe(true)
      expect(useMessageStore.getState().sendMessagesLoading).toBe(false)
    })

    it('throws error on send failure', async () => {
      const apiError = { status: 400, code: 'validation_error', message: 'Message too long' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      const formData = new FormData()

      let errorThrown = false
      try {
        await act(async () => {
          await useMessageStore.getState().sendMessage(formData)
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
    })
  })

  describe('sendRequest', () => {
    it('sends contact request successfully', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useMessageStore.getState().sendRequest('John Doe', 'john@example.com', '123456789', 'I need help')
      })

      expect(axiosInstance.post).toHaveBeenCalledWith('/requests/', {
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '123456789',
        message: 'I need help',
      })
      expect(useMessageStore.getState().sendRequestSuccess).toBe(true)
    })

    it('sets loading state during request', async () => {
      let loadingDuringCall = false
      vi.mocked(axiosInstance.post).mockImplementationOnce(async () => {
        loadingDuringCall = useMessageStore.getState().requestLoading
        return { data: {} }
      })

      await act(async () => {
        await useMessageStore.getState().sendRequest('Test', 'test@test.com', '123', 'Message')
      })

      expect(loadingDuringCall).toBe(true)
      expect(useMessageStore.getState().requestLoading).toBe(false)
    })

    it('sets sendRequestSuccess to false on error', async () => {
      const apiError = { status: 400, code: 'validation_error', message: 'Invalid email' }
      vi.mocked(axiosInstance.post).mockRejectedValueOnce(apiError)

      let errorThrown = false
      try {
        await act(async () => {
          await useMessageStore.getState().sendRequest('Test', 'invalid', '123', 'Message')
        })
      } catch {
        errorThrown = true
      }

      expect(errorThrown).toBe(true)
      expect(useMessageStore.getState().sendRequestSuccess).toBe(false)
    })

    it('sets sendRequestSuccess to true after successful request', async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: {} })

      await act(async () => {
        await useMessageStore.getState().sendRequest('Test', 'test@test.com', '123', 'Message')
      })

      expect(useMessageStore.getState().sendRequestSuccess).toBe(true)
    })
  })
})
