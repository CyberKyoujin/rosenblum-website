import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

// Mock axiosInstance
vi.mock('../../axios/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}))

import { useReviews } from '../../hooks/useReviews'
import axiosInstance from '../../axios/axiosInstance'

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('returns reviews, loading, and error state', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [] })

      const { result } = renderHook(() => useReviews())

      expect(result.current.reviews).toEqual([])
      expect(result.current.reviewsLoading).toBe(true)
      expect(result.current.reviewsError).toBe(null)

      await waitFor(() => {
        expect(result.current.reviewsLoading).toBe(false)
      })
    })
  })

  describe('fetching reviews', () => {
    it('fetches reviews on mount', async () => {
      const reviewsData = [
        {
          id: 1,
          author_name: 'John Doe',
          rating: 5,
          original_language: 'en',
          text: 'Great service!',
          review_timestamp: '2024-01-01',
          profile_photo_url: 'https://example.com/photo.jpg',
        },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: reviewsData })

      const { result } = renderHook(() => useReviews())

      await waitFor(() => {
        expect(result.current.reviews).toEqual(reviewsData)
        expect(result.current.reviewsLoading).toBe(false)
      })
    })

    it('passes language parameter to API', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: [] })

      renderHook(() => useReviews())

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith('/user/reviews/', expect.objectContaining({
          params: { lang: 'en' },
        }))
      })
    })

    it('sets error on fetch failure', async () => {
      const apiError = { status: 500, code: 'server_error', message: 'Server error' }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useReviews())

      await waitFor(() => {
        expect(result.current.reviewsError).toBeTruthy()
        expect(result.current.reviewsLoading).toBe(false)
      })
    })

    it('handles multiple reviews', async () => {
      const reviewsData = [
        { id: 1, author_name: 'User 1', rating: 5, original_language: 'en', text: 'Great!', review_timestamp: '2024-01-01', profile_photo_url: '' },
        { id: 2, author_name: 'User 2', rating: 4, original_language: 'de', text: 'Good!', review_timestamp: '2024-01-02', profile_photo_url: '' },
        { id: 3, author_name: 'User 3', rating: 5, original_language: 'en', text: 'Excellent!', review_timestamp: '2024-01-03', profile_photo_url: '' },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: reviewsData })

      const { result } = renderHook(() => useReviews())

      await waitFor(() => {
        expect(result.current.reviews).toHaveLength(3)
      })
    })
  })

  describe('abort controller', () => {
    it('does not set error when request is canceled', async () => {
      const cancelError = { code: 'canceled', message: 'Request Canceled' }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(cancelError)

      const { result, unmount } = renderHook(() => useReviews())

      unmount()

      // Error should not be set for canceled requests
      expect(result.current.reviewsError).toBe(null)
    })
  })
})
