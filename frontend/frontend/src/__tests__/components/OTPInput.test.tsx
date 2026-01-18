import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OTPInput from '../../components/OTPInput'

describe('OTPInput', () => {
  describe('rendering', () => {
    it('renders 6 input fields', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
    })

    it('renders separator between inputs', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      // Check for dash separators (5 dashes between 6 inputs)
      const separators = screen.getAllByText('-')
      expect(separators).toHaveLength(5)
    })

    it('displays current value in inputs', () => {
      const onChange = vi.fn()
      render(<OTPInput value="123456" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveValue('2')
      expect(inputs[2]).toHaveValue('3')
      expect(inputs[3]).toHaveValue('4')
      expect(inputs[4]).toHaveValue('5')
      expect(inputs[5]).toHaveValue('6')
    })

    it('displays partial value correctly', () => {
      const onChange = vi.fn()
      render(<OTPInput value="12" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveValue('2')
      expect(inputs[2]).toHaveValue('')
    })

    it('has proper aria labels', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      expect(screen.getByLabelText('Digit 1 of OTP')).toBeInTheDocument()
      expect(screen.getByLabelText('Digit 6 of OTP')).toBeInTheDocument()
    })
  })

  describe('input handling', () => {
    it('calls onChange when digit is entered', async () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '5' } })

      expect(onChange).toHaveBeenCalled()
    })

    it('rejects non-numeric input', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: 'a' } })

      // onChange shouldn't be called for non-numeric input
      expect(onChange).not.toHaveBeenCalled()
    })

    it('accepts numeric input', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '7' } })

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('prevents default for ArrowUp key', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      inputs[0].dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('prevents default for ArrowDown key', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      inputs[0].dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('prevents default for space key', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      inputs[0].dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('handles ArrowLeft navigation', () => {
      const onChange = vi.fn()
      render(<OTPInput value="12" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[1].focus()

      fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(inputs[0])
    })

    it('handles ArrowRight navigation', () => {
      const onChange = vi.fn()
      render(<OTPInput value="12" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()

      fireEvent.keyDown(inputs[0], { key: 'ArrowRight' })

      expect(document.activeElement).toBe(inputs[1])
    })

    it('does not navigate left from first input', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()

      fireEvent.keyDown(inputs[0], { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(inputs[0])
    })

    it('does not navigate right from last input', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[5].focus()

      fireEvent.keyDown(inputs[5], { key: 'ArrowRight' })

      expect(document.activeElement).toBe(inputs[5])
    })

    it('handles Delete key', () => {
      const onChange = vi.fn()
      render(<OTPInput value="123" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[1].focus()

      fireEvent.keyDown(inputs[1], { key: 'Delete' })

      expect(onChange).toHaveBeenCalled()
    })

    it('handles Backspace key', () => {
      const onChange = vi.fn()
      render(<OTPInput value="123" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      inputs[2].focus()

      fireEvent.keyDown(inputs[2], { key: 'Backspace' })

      expect(onChange).toHaveBeenCalled()
      expect(document.activeElement).toBe(inputs[1])
    })
  })

  describe('paste handling', () => {
    it('handles pasting numeric code', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')

      const clipboardData = {
        types: ['text/plain'],
        getData: () => '123456',
      }

      fireEvent.paste(inputs[0], { clipboardData })

      expect(onChange).toHaveBeenCalled()
    })

    it('filters non-numeric characters from paste', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')

      const clipboardData = {
        types: ['text/plain'],
        getData: () => '12ab34',
      }

      fireEvent.paste(inputs[0], { clipboardData })

      expect(onChange).toHaveBeenCalled()
    })

    it('truncates paste to length limit', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')

      const clipboardData = {
        types: ['text/plain'],
        getData: () => '123456789',
      }

      fireEvent.paste(inputs[0], { clipboardData })

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('click handling', () => {
    it('selects input content on click', async () => {
      const onChange = vi.fn()
      render(<OTPInput value="123456" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      const user = userEvent.setup()

      await user.click(inputs[2])

      // The input should be focused and selected
      expect(document.activeElement).toBe(inputs[2])
    })
  })

  describe('input attributes', () => {
    it('has inputMode numeric', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveAttribute('inputmode', 'numeric')
    })

    it('has numeric pattern', () => {
      const onChange = vi.fn()
      render(<OTPInput value="" onChange={onChange} />)

      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveAttribute('pattern', '[0-9]*')
    })
  })
})
