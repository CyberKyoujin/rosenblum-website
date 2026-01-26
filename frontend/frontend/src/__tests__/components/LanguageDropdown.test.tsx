import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageDropdown from '../../components/LanguageDropdown'

// Mock i18next
const mockChangeLanguage = vi.fn()
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'de',
      changeLanguage: mockChangeLanguage,
    },
  }),
}))

describe('LanguageDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the select component', () => {
      render(<LanguageDropdown />)

      // MUI Select renders a button with combobox role
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('displays default language (DE)', () => {
      render(<LanguageDropdown />)

      expect(screen.getByText('DE')).toBeInTheDocument()
    })

    it('renders language flags as images', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      // Open the dropdown
      await user.click(screen.getByRole('combobox'))

      // Check for flag images
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('language options', () => {
    it('shows all language options when opened', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('RU')).toBeInTheDocument()
        expect(screen.getAllByText('DE').length).toBeGreaterThanOrEqual(1)
        expect(screen.getByText('UA')).toBeInTheDocument()
      })
    })

    it('displays three language options', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(3)
      })
    })
  })

  describe('language selection', () => {
    it('calls changeLanguage when Russian is selected', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('RU')).toBeInTheDocument()
      })

      await user.click(screen.getByText('RU'))

      await waitFor(() => {
        expect(mockChangeLanguage).toHaveBeenCalledWith('ru')
      })
    })

    it('calls changeLanguage when Ukrainian is selected', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('UA')).toBeInTheDocument()
      })

      await user.click(screen.getByText('UA'))

      await waitFor(() => {
        expect(mockChangeLanguage).toHaveBeenCalledWith('ua')
      })
    })

    it('updates displayed value after selection', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('RU')).toBeInTheDocument()
      })

      await user.click(screen.getByText('RU'))

      // After selection, RU should be displayed
      await waitFor(() => {
        const combobox = screen.getByRole('combobox')
        expect(combobox).toHaveTextContent('RU')
      })
    })
  })

  describe('keyboard navigation', () => {
    it('opens dropdown on Enter key', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      const combobox = screen.getByRole('combobox')
      combobox.focus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('flag images', () => {
    it('renders flag images with alt text', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach((img) => {
          expect(img).toHaveAttribute('alt')
        })
      })
    })

    it('flag images have lazy loading', async () => {
      const user = userEvent.setup()
      render(<LanguageDropdown />)

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach((img) => {
          expect(img).toHaveAttribute('loading', 'lazy')
        })
      })
    })
  })
})
