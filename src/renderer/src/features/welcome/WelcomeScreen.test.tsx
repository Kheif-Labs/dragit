/**
 * WelcomeScreen Integration Tests
 * Tests the WelcomeScreen component with useFolderOpen hook integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeScreen } from './WelcomeScreen'
import type { OpenFolderResult } from '../../../../shared/features/filesystem/fs.contract'

// Mock the window.api
const mockOpenFolderDialog = vi.fn<() => Promise<OpenFolderResult>>()
const mockGetRecentProjects = vi.fn()

beforeEach(() => {
  vi.stubGlobal('window', {
    api: {
      openFolderDialog: mockOpenFolderDialog,
      getRecentProjects: mockGetRecentProjects.mockResolvedValue([])
    }
  })
})

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('WelcomeScreen', () => {
  const defaultProps = {
    onFolderSelected: vi.fn(),
    onCloneRepository: vi.fn()
  }

  beforeEach(() => {
    defaultProps.onFolderSelected.mockClear()
    defaultProps.onCloneRepository.mockClear()
  })

  describe('rendering', () => {
    it('should render the welcome screen with header', () => {
      render(<WelcomeScreen {...defaultProps} />)

      expect(screen.getByText('Dragit')).toBeInTheDocument()
    })

    it('should render the Start section', () => {
      render(<WelcomeScreen {...defaultProps} />)

      expect(screen.getByText('START')).toBeInTheDocument()
      expect(screen.getByText('Open Folder')).toBeInTheDocument()
      expect(screen.getByText('Clone Git Repository')).toBeInTheDocument()
    })

    it('should render the Open Folder button with correct description', () => {
      render(<WelcomeScreen {...defaultProps} />)

      expect(screen.getByText('Browse to a local Git repository')).toBeInTheDocument()
    })
  })

  describe('folder selection integration', () => {
    it('should call onFolderSelected when a folder is successfully selected', async () => {
      const user = userEvent.setup()
      const expectedPath = 'C:\\Users\\test\\my-project'

      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: expectedPath,
        canceled: false
      })

      render(<WelcomeScreen {...defaultProps} />)

      const openFolderButton = screen.getByText('Open Folder').closest('button')!
      await user.click(openFolderButton)

      // Wait for the async operation to complete
      await vi.waitFor(() => {
        expect(defaultProps.onFolderSelected).toHaveBeenCalledWith(expectedPath)
      })
    })

    it('should not call onFolderSelected when dialog is canceled', async () => {
      const user = userEvent.setup()

      mockOpenFolderDialog.mockResolvedValueOnce({
        success: false,
        path: null,
        canceled: true
      })

      render(<WelcomeScreen {...defaultProps} />)

      const openFolderButton = screen.getByText('Open Folder').closest('button')!
      await user.click(openFolderButton)

      // Wait for the async operation to complete
      await vi.waitFor(() => {
        expect(mockOpenFolderDialog).toHaveBeenCalled()
      })

      expect(defaultProps.onFolderSelected).not.toHaveBeenCalled()
    })

    it('should show loading state while folder dialog is open', async () => {
      const user = userEvent.setup()

      // Create a controlled promise
      let resolveDialog: (value: OpenFolderResult) => void
      const dialogPromise = new Promise<OpenFolderResult>((resolve) => {
        resolveDialog = resolve
      })
      mockOpenFolderDialog.mockReturnValueOnce(dialogPromise)

      render(<WelcomeScreen {...defaultProps} />)

      const openFolderButton = screen.getByText('Open Folder').closest('button')!
      await user.click(openFolderButton)

      // Button should be disabled during loading
      expect(openFolderButton).toBeDisabled()

      // Resolve the dialog inside act to handle state updates
      await act(async () => {
        resolveDialog!({
          success: true,
          path: 'C:\\test',
          canceled: false
        })
      })

      await vi.waitFor(() => {
        expect(openFolderButton).not.toBeDisabled()
      })
    })

    it('should call openFolderDialog API when Open Folder is clicked', async () => {
      const user = userEvent.setup()

      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\test',
        canceled: false
      })

      render(<WelcomeScreen {...defaultProps} />)

      const openFolderButton = screen.getByText('Open Folder').closest('button')!
      await user.click(openFolderButton)

      expect(mockOpenFolderDialog).toHaveBeenCalledTimes(1)
    })
  })

  describe('clone repository', () => {
    it('should call onCloneRepository when Clone Git Repository is clicked', async () => {
      const user = userEvent.setup()

      render(<WelcomeScreen {...defaultProps} />)

      const cloneButton = screen.getByText('Clone Git Repository').closest('button')!
      await user.click(cloneButton)

      expect(defaultProps.onCloneRepository).toHaveBeenCalledTimes(1)
    })
  })
})
