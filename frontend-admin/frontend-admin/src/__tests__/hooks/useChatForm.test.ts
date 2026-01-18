import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChatForm } from '../../hooks/useChatForm'

describe('useChatForm', () => {
  const mockSendMessage = vi.fn()
  const mockFetchUserMessages = vi.fn()
  const userId = 5

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderChatForm = (isLoading = false) => {
    return renderHook(() =>
      useChatForm(mockSendMessage, mockFetchUserMessages, userId, isLoading)
    )
  }

  describe('initial state', () => {
    it('returns correct initial values', () => {
      const { result } = renderChatForm()

      expect(result.current.message).toBe('')
      expect(result.current.uploadedFiles).toEqual([])
      expect(result.current.uploadLimit).toBe(false)
      expect(result.current.error).toBe(null)
      expect(typeof result.current.handleSubmit).toBe('function')
      expect(typeof result.current.handleFileInputChange).toBe('function')
      expect(typeof result.current.removeFile).toBe('function')
    })
  })

  describe('message handling', () => {
    it('updates message via setMessage', () => {
      const { result } = renderChatForm()

      act(() => {
        result.current.setMessage('Hello')
      })

      expect(result.current.message).toBe('Hello')
    })
  })

  describe('file handling', () => {
    it('adds files via handleFileInputChange', () => {
      const { result } = renderChatForm()

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      const event = {
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      act(() => {
        result.current.handleFileInputChange(event)
      })

      expect(result.current.uploadedFiles).toHaveLength(1)
      expect(result.current.uploadedFiles[0].name).toBe('test.pdf')
    })

    it('handles multiple files', () => {
      const { result } = renderChatForm()

      const files = [
        new File(['content1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'test2.pdf', { type: 'application/pdf' }),
      ]
      const event = {
        target: { files, value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      act(() => {
        result.current.handleFileInputChange(event)
      })

      expect(result.current.uploadedFiles).toHaveLength(2)
    })

    it('sets uploadLimit when more than 3 files', () => {
      const { result } = renderChatForm()

      const files = [
        new File(['1'], 'file1.pdf', { type: 'application/pdf' }),
        new File(['2'], 'file2.pdf', { type: 'application/pdf' }),
        new File(['3'], 'file3.pdf', { type: 'application/pdf' }),
        new File(['4'], 'file4.pdf', { type: 'application/pdf' }),
      ]
      const event = {
        target: { files, value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      act(() => {
        result.current.handleFileInputChange(event)
      })

      expect(result.current.uploadLimit).toBe(true)
      expect(result.current.uploadedFiles).toHaveLength(0) // Files not added
    })

    it('removes file by index', () => {
      const { result } = renderChatForm()

      // Add files
      const files = [
        new File(['1'], 'file1.pdf', { type: 'application/pdf' }),
        new File(['2'], 'file2.pdf', { type: 'application/pdf' }),
        new File(['3'], 'file3.pdf', { type: 'application/pdf' }),
      ]
      const event = {
        target: { files, value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      act(() => {
        result.current.handleFileInputChange(event)
      })

      expect(result.current.uploadedFiles).toHaveLength(3)

      // Remove first file
      act(() => {
        result.current.removeFile(0)
      })

      expect(result.current.uploadedFiles).toHaveLength(2)
      expect(result.current.uploadedFiles[0].name).toBe('file2.pdf')
    })

    it('clears uploadLimit when files reduced to 3 or less', () => {
      const { result } = renderChatForm()

      // First add exactly 3 files
      const files = [
        new File(['1'], 'file1.pdf', { type: 'application/pdf' }),
        new File(['2'], 'file2.pdf', { type: 'application/pdf' }),
        new File(['3'], 'file3.pdf', { type: 'application/pdf' }),
      ]
      act(() => {
        result.current.handleFileInputChange({
          target: { files, value: '' },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      // Try to add a 4th file to trigger limit
      act(() => {
        result.current.handleFileInputChange({
          target: { files: [new File(['4'], 'file4.pdf', { type: 'application/pdf' })], value: '' },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      expect(result.current.uploadLimit).toBe(true)

      // Remove a file to clear limit
      act(() => {
        result.current.removeFile(0)
      })

      expect(result.current.uploadLimit).toBe(false)
    })
  })

  describe('form submission', () => {
    it('submits message successfully', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      mockFetchUserMessages.mockResolvedValueOnce(undefined)

      const { result } = renderChatForm()

      act(() => {
        result.current.setMessage('Hello world')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(mockSendMessage).toHaveBeenCalledWith(expect.any(FormData), userId)
      expect(mockFetchUserMessages).toHaveBeenCalledWith(userId)
      expect(result.current.message).toBe('')
    })

    it('submits files successfully', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      mockFetchUserMessages.mockResolvedValueOnce(undefined)

      const { result } = renderChatForm()

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      act(() => {
        result.current.handleFileInputChange({
          target: { files: [file], value: '' },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(mockSendMessage).toHaveBeenCalled()
      const formData = mockSendMessage.mock.calls[0][0] as FormData
      expect(formData.get('uploaded_files')).toBeTruthy()
      expect(result.current.uploadedFiles).toHaveLength(0)
    })

    it('does not submit when message and files are empty', async () => {
      const { result } = renderChatForm()

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(mockSendMessage).not.toHaveBeenCalled()
    })

    it('does not submit when message is only whitespace', async () => {
      const { result } = renderChatForm()

      act(() => {
        result.current.setMessage('   ')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(mockSendMessage).not.toHaveBeenCalled()
    })

    it('does not submit when isLoading is true', async () => {
      const { result } = renderHook(() =>
        useChatForm(mockSendMessage, mockFetchUserMessages, userId, true)
      )

      act(() => {
        result.current.setMessage('Hello')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(mockSendMessage).not.toHaveBeenCalled()
    })

    it('sets error on submission failure', async () => {
      const error = { status: 500, code: 'server_error', message: 'Failed' }
      mockSendMessage.mockRejectedValueOnce(error)

      const { result } = renderChatForm()

      act(() => {
        result.current.setMessage('Hello')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      expect(result.current.error).toEqual(error)
    })

    it('prevents default form event', async () => {
      mockSendMessage.mockResolvedValueOnce(undefined)
      mockFetchUserMessages.mockResolvedValueOnce(undefined)

      const { result } = renderChatForm()
      const mockPreventDefault = vi.fn()

      act(() => {
        result.current.setMessage('Hello')
      })

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: mockPreventDefault,
        } as unknown as React.FormEvent<HTMLFormElement>)
      })

      expect(mockPreventDefault).toHaveBeenCalled()
    })
  })
})
