import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsAtTop } from '../../hooks/useIsAtTop'

describe('useIsAtTop', () => {
  let originalScrollY: number

  beforeEach(() => {
    originalScrollY = window.scrollY
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: originalScrollY,
    })
  })

  describe('initial state', () => {
    it('returns true when at top of page', () => {
      window.scrollY = 0

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(true)
    })

    it('returns false when scrolled past threshold', () => {
      window.scrollY = 50

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(false)
    })
  })

  describe('default threshold', () => {
    it('uses default threshold of 10', () => {
      window.scrollY = 5

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(true)
    })

    it('returns false when scrollY equals threshold', () => {
      window.scrollY = 10

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(false)
    })

    it('returns false when scrollY exceeds threshold', () => {
      window.scrollY = 15

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(false)
    })
  })

  describe('custom threshold', () => {
    it('respects custom threshold', () => {
      window.scrollY = 50

      const { result } = renderHook(() => useIsAtTop(100))

      expect(result.current).toBe(true)
    })

    it('returns false when scrollY exceeds custom threshold', () => {
      window.scrollY = 150

      const { result } = renderHook(() => useIsAtTop(100))

      expect(result.current).toBe(false)
    })

    it('handles threshold of 0', () => {
      window.scrollY = 0

      const { result } = renderHook(() => useIsAtTop(0))

      expect(result.current).toBe(false) // 0 is not less than 0
    })
  })

  describe('scroll event handling', () => {
    it('updates state on scroll event', () => {
      window.scrollY = 0
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      const { result } = renderHook(() => useIsAtTop())

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

      // Simulate scroll
      window.scrollY = 50
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current).toBe(false)
    })

    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useIsAtTop())

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('updates when scrolling back to top', () => {
      window.scrollY = 50

      const { result } = renderHook(() => useIsAtTop())

      expect(result.current).toBe(false)

      // Scroll back to top
      window.scrollY = 0
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      expect(result.current).toBe(true)
    })
  })

  describe('threshold changes', () => {
    it('re-evaluates when threshold changes', () => {
      window.scrollY = 50

      const { result, rerender } = renderHook(
        ({ threshold }) => useIsAtTop(threshold),
        { initialProps: { threshold: 100 } }
      )

      expect(result.current).toBe(true) // 50 < 100

      rerender({ threshold: 30 })

      expect(result.current).toBe(false) // 50 >= 30
    })
  })
})
