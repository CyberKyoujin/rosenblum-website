import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { orderSchema } from '../../hooks/useOrder'

// Mock the stores
const mockCreateOrder = vi.fn()
vi.mock('../../zustand/useAuthStore', () => ({
  default: vi.fn(() => ({
    user: {
      id: 1,
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      profile_img_url: '',
    },
    userData: {
      phone_number: '+491234567890',
      city: 'Berlin',
      street: 'Main St 1',
      zip: '12345',
    },
  })),
}))

vi.mock('../../zustand/useOrderStore', () => ({
  default: vi.fn(() => ({
    createOrder: mockCreateOrder,
    createOrderLoading: false,
  })),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { useOrder } from '../../hooks/useOrder'

describe('useOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('orderSchema', () => {
    it('validates correct order data', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '12345',
        message: 'Please handle with care',
      })

      expect(result.success).toBe(true)
    })

    it('validates order without optional message', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '12345',
      })

      expect(result.success).toBe(true)
    })

    it('rejects missing name', () => {
      const result = orderSchema.safeParse({
        name: '',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '12345',
      })

      expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'invalid',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '12345',
      })

      expect(result.success).toBe(false)
    })

    it('rejects short phone number', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '123',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '12345',
      })

      expect(result.success).toBe(false)
    })

    it('rejects missing city', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: '',
        street: 'Main Street 1',
        zip: '12345',
      })

      expect(result.success).toBe(false)
    })

    it('rejects missing street', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: '',
        zip: '12345',
      })

      expect(result.success).toBe(false)
    })

    it('rejects missing zip', () => {
      const result = orderSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+491234567890',
        city: 'Berlin',
        street: 'Main Street 1',
        zip: '',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('useOrder hook', () => {
    it('returns form methods and file utilities', () => {
      const { result } = renderHook(() => useOrder())

      expect(result.current.methods).toBeDefined()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.files).toBeDefined()
      expect(result.current.files.list).toEqual([])
      expect(typeof result.current.files.remove).toBe('function')
      expect(typeof result.current.files.onDrop).toBe('function')
      expect(typeof result.current.onSubmit).toBe('function')
    })

    it('initializes form with user data', () => {
      const { result } = renderHook(() => useOrder())

      const values = result.current.methods.getValues()
      expect(values.name).toBe('John Doe')
      expect(values.email).toBe('test@example.com')
      expect(values.phone_number).toBe('+491234567890')
      expect(values.city).toBe('Berlin')
      expect(values.street).toBe('Main St 1')
      expect(values.zip).toBe('12345')
    })

    describe('phone validation', () => {
      it('returns false for valid phone number', async () => {
        const { result } = renderHook(() => useOrder())

        act(() => {
          result.current.methods.setValue('phone_number', '+491234567890')
        })

        await waitFor(() => {
          expect(result.current.isPhoneInvalid).toBe(false)
        })
      })

      it('returns true for invalid phone number', async () => {
        const { result } = renderHook(() => useOrder())

        act(() => {
          result.current.methods.setValue('phone_number', 'invalid')
        })

        await waitFor(() => {
          expect(result.current.isPhoneInvalid).toBe(true)
        })
      })

      it('returns true for empty phone number', async () => {
        const { result } = renderHook(() => useOrder())

        act(() => {
          result.current.methods.setValue('phone_number', '')
        })

        await waitFor(() => {
          expect(result.current.isPhoneInvalid).toBe(true)
        })
      })
    })

    describe('file handling', () => {
      it('adds files on handleInputChange', () => {
        const { result } = renderHook(() => useOrder())

        const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
        const mockEvent = {
          target: { files: [mockFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        act(() => {
          result.current.files.handleInputChange(mockEvent)
        })

        expect(result.current.files.list).toHaveLength(1)
        expect(result.current.files.list[0].name).toBe('test.pdf')
      })

      it('removes file by index', () => {
        const { result } = renderHook(() => useOrder())

        const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' })
        const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })

        act(() => {
          result.current.files.handleInputChange({
            target: { files: [file1, file2] },
          } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        expect(result.current.files.list).toHaveLength(2)

        act(() => {
          result.current.files.remove(0)
        })

        expect(result.current.files.list).toHaveLength(1)
        expect(result.current.files.list[0].name).toBe('test2.pdf')
      })

      it('handles drag and drop', () => {
        const { result } = renderHook(() => useOrder())

        const mockFile = new File(['dropped'], 'dropped.pdf', { type: 'application/pdf' })
        const mockDropEvent = {
          preventDefault: vi.fn(),
          dataTransfer: { files: [mockFile] },
        } as unknown as React.DragEvent

        act(() => {
          result.current.files.setDragging(true)
        })

        expect(result.current.files.dragging).toBe(true)

        act(() => {
          result.current.files.onDrop(mockDropEvent)
        })

        expect(result.current.files.dragging).toBe(false)
        expect(result.current.files.list).toHaveLength(1)
        expect(mockDropEvent.preventDefault).toHaveBeenCalled()
      })
    })

    describe('form submission', () => {
      it('creates order and navigates on success', async () => {
        mockCreateOrder.mockResolvedValueOnce(undefined)
        const { result } = renderHook(() => useOrder())

        act(() => {
          result.current.methods.setValue('name', 'John Doe')
          result.current.methods.setValue('email', 'john@example.com')
          result.current.methods.setValue('phone_number', '+491234567890')
          result.current.methods.setValue('city', 'Berlin')
          result.current.methods.setValue('street', 'Main St')
          result.current.methods.setValue('zip', '12345')
        })

        await act(async () => {
          await result.current.onSubmit()
        })

        await waitFor(() => {
          expect(mockCreateOrder).toHaveBeenCalled()
          expect(mockNavigate).toHaveBeenCalledWith('/profile', {
            state: { orderCreateSuccess: true },
          })
        })
      })

      it('includes files in FormData', async () => {
        mockCreateOrder.mockResolvedValueOnce(undefined)
        const { result } = renderHook(() => useOrder())

        const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })

        act(() => {
          result.current.files.handleInputChange({
            target: { files: [mockFile] },
          } as unknown as React.ChangeEvent<HTMLInputElement>)
        })

        act(() => {
          result.current.methods.setValue('name', 'John Doe')
          result.current.methods.setValue('email', 'john@example.com')
          result.current.methods.setValue('phone_number', '+491234567890')
          result.current.methods.setValue('city', 'Berlin')
          result.current.methods.setValue('street', 'Main St')
          result.current.methods.setValue('zip', '12345')
        })

        await act(async () => {
          await result.current.onSubmit()
        })

        await waitFor(() => {
          expect(mockCreateOrder).toHaveBeenCalled()
          const formData = mockCreateOrder.mock.calls[0][0] as FormData
          expect(formData.get('uploaded_files')).toBeTruthy()
        })
      })

      it('sets error on create failure', async () => {
        const apiError = {
          status: 400,
          code: 'validation_error',
          message: 'Invalid order data',
        }
        mockCreateOrder.mockRejectedValueOnce(apiError)

        const { result } = renderHook(() => useOrder())

        act(() => {
          result.current.methods.setValue('name', 'John Doe')
          result.current.methods.setValue('email', 'john@example.com')
          result.current.methods.setValue('phone_number', '+491234567890')
          result.current.methods.setValue('city', 'Berlin')
          result.current.methods.setValue('street', 'Main St')
          result.current.methods.setValue('zip', '12345')
        })

        await act(async () => {
          await result.current.onSubmit()
        })

        await waitFor(() => {
          expect(result.current.error).toEqual(apiError)
        })
      })
    })
  })
})
