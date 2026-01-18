import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

// Mock the stores
const mockToggleMessages = vi.fn()
const mockFetchUserMessages = vi.fn()
const mockSendMessage = vi.fn()

vi.mock('../../zustand/useAuthStore', () => ({
  default: vi.fn((selector) => {
    const state = {
      user: { id: 1, email: 'test@example.com', first_name: 'John', last_name: 'Doe', profile_img_url: '' },
    }
    return selector ? selector(state) : state
  }),
}))

vi.mock('../../zustand/useMessageStore', () => ({
  default: vi.fn(() => ({
    messages: [
      { id: 1, message: 'First', sender: 1, receiver: 2, timestamp: '2024-01-01T10:00:00Z', files: [] },
      { id: 2, message: 'Second', sender: 2, receiver: 1, timestamp: '2024-01-01T11:00:00Z', files: [] },
      { id: 3, message: 'Third', sender: 1, receiver: 2, timestamp: '2024-01-01T09:00:00Z', files: [] },
    ],
    messagesLoading: false,
    sendMessagesLoading: false,
    fetchMessagesError: null,
    toggleMessages: mockToggleMessages,
    fetchUserMessages: mockFetchUserMessages,
    sendMessage: mockSendMessage,
  })),
}))

import { useMessages } from '../../hooks/useMessages'

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('returns user and message utilities', () => {
      const { result } = renderHook(() => useMessages())

      expect(result.current.user).toBeDefined()
      expect(result.current.messages).toBeDefined()
      expect(result.current.loading).toBe(false)
      expect(result.current.sending).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.messageState).toBeDefined()
      expect(result.current.fileState).toBeDefined()
    })

    it('calls toggleMessages on mount', () => {
      renderHook(() => useMessages())

      expect(mockToggleMessages).toHaveBeenCalledWith(46)
    })
  })

  describe('sortedMessages', () => {
    it('sorts messages by timestamp ascending', () => {
      const { result } = renderHook(() => useMessages())

      const timestamps = result.current.messages.map(m => m.timestamp)

      // Should be sorted: 09:00 < 10:00 < 11:00
      expect(timestamps[0]).toBe('2024-01-01T09:00:00Z')
      expect(timestamps[1]).toBe('2024-01-01T10:00:00Z')
      expect(timestamps[2]).toBe('2024-01-01T11:00:00Z')
    })
  })

  describe('message state', () => {
    it('updates message text', () => {
      const { result } = renderHook(() => useMessages())

      act(() => {
        result.current.messageState.setMessage('Hello world')
      })

      expect(result.current.messageState.message).toBe('Hello world')
    })
  })

  describe('file handling', () => {
    it('adds files to uploadedFiles', () => {
      const { result } = renderHook(() => useMessages())

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

      act(() => {
        result.current.fileState.handleFiles([file])
      })

      expect(result.current.fileState.uploadedFiles).toHaveLength(1)
      expect(result.current.fileState.uploadedFiles[0].name).toBe('test.pdf')
    })

    it('removes file by index', () => {
      const { result } = renderHook(() => useMessages())

      const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' })
      const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })

      act(() => {
        result.current.fileState.handleFiles([file1, file2])
      })

      expect(result.current.fileState.uploadedFiles).toHaveLength(2)

      act(() => {
        result.current.fileState.removeFile(0)
      })

      expect(result.current.fileState.uploadedFiles).toHaveLength(1)
      expect(result.current.fileState.uploadedFiles[0].name).toBe('test2.pdf')
    })

    it('sets uploadLimit when exceeding 3 files', () => {
      const { result } = renderHook(() => useMessages())

      const files = [
        new File(['1'], '1.pdf', { type: 'application/pdf' }),
        new File(['2'], '2.pdf', { type: 'application/pdf' }),
        new File(['3'], '3.pdf', { type: 'application/pdf' }),
        new File(['4'], '4.pdf', { type: 'application/pdf' }),
      ]

      act(() => {
        result.current.fileState.handleFiles(files)
      })

      expect(result.current.fileState.uploadLimit).toBe(true)
      // Files should not be added when limit exceeded
      expect(result.current.fileState.uploadedFiles).toHaveLength(0)
    })

    it('handles file input change', () => {
      const { result } = renderHook(() => useMessages())

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const mockEvent = {
        target: { files: [file], value: 'test.pdf' },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      act(() => {
        result.current.fileState.onFileInputChange(mockEvent)
      })

      expect(result.current.fileState.uploadedFiles).toHaveLength(1)
    })
  })

  describe('form submission', () => {
    it('does not submit when message is empty and no files', async () => {
      const { result } = renderHook(() => useMessages())

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

      await act(async () => {
        await result.current.messageState.onSubmit(mockEvent)
      })

      expect(mockSendMessage).not.toHaveBeenCalled()
    })

    it('submits message with text', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMessages())

      act(() => {
        result.current.messageState.setMessage('Hello')
      })

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

      await act(async () => {
        await result.current.messageState.onSubmit(mockEvent)
      })

      expect(mockSendMessage).toHaveBeenCalled()
      expect(mockFetchUserMessages).toHaveBeenCalled()
    })

    it('submits message with files only', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMessages())

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

      act(() => {
        result.current.fileState.handleFiles([file])
      })

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

      await act(async () => {
        await result.current.messageState.onSubmit(mockEvent)
      })

      expect(mockSendMessage).toHaveBeenCalled()
    })

    it('clears message and files after successful submission', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMessages())

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

      act(() => {
        result.current.messageState.setMessage('Hello')
        result.current.fileState.handleFiles([file])
      })

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

      await act(async () => {
        await result.current.messageState.onSubmit(mockEvent)
      })

      await waitFor(() => {
        expect(result.current.messageState.message).toBe('')
        expect(result.current.fileState.uploadedFiles).toHaveLength(0)
      })
    })

    it('sets error on submission failure', async () => {
      const apiError = { status: 500, code: 'server_error', message: 'Failed' }
      mockSendMessage.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useMessages())

      act(() => {
        result.current.messageState.setMessage('Hello')
      })

      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

      await act(async () => {
        await result.current.messageState.onSubmit(mockEvent)
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })
    })
  })
})
