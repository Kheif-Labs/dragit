/**
 * useFolderOpen Hook Tests
 * Tests for folder selection functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFolderOpen } from './useFolderOpen'
import type { OpenFolderResult } from '../../../../shared/features/filesystem/fs.contract'

// Mock the window.api
const mockOpenFolderDialog = vi.fn<() => Promise<OpenFolderResult>>()

beforeEach(() => {
  // Setup global mock for window.api
  vi.stubGlobal('window', {
    api: {
      openFolderDialog: mockOpenFolderDialog
    }
  })
})

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe('useFolderOpen', () => {
  describe('initial state', () => {
    it('should have null selectedPath initially', () => {
      const { result } = renderHook(() => useFolderOpen())
      expect(result.current.selectedPath).toBeNull()
    })

    it('should have isLoading as false initially', () => {
      const { result } = renderHook(() => useFolderOpen())
      expect(result.current.isLoading).toBe(false)
    })

    it('should have null error initially', () => {
      const { result } = renderHook(() => useFolderOpen())
      expect(result.current.error).toBeNull()
    })

    it('should provide an openFolder function', () => {
      const { result } = renderHook(() => useFolderOpen())
      expect(typeof result.current.openFolder).toBe('function')
    })
  })

  describe('successful folder selection', () => {
    it('should set selectedPath when folder is selected successfully', async () => {
      const expectedPath = 'C:\\Users\\test\\project'
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: expectedPath,
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.selectedPath).toBe(expectedPath)
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should set isLoading to false after folder dialog completes', async () => {
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\test',
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should call openFolderDialog API', async () => {
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\test',
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(mockOpenFolderDialog).toHaveBeenCalledTimes(1)
    })
  })

  describe('canceled folder selection', () => {
    it('should not update selectedPath when dialog is canceled', async () => {
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: false,
        path: null,
        canceled: true
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.selectedPath).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should preserve previous selectedPath when dialog is canceled', async () => {
      // First select a folder successfully
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\first\\folder',
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.selectedPath).toBe('C:\\first\\folder')

      // Now cancel the dialog
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: false,
        path: null,
        canceled: true
      })

      await act(async () => {
        await result.current.openFolder()
      })

      // Previous path should be preserved
      expect(result.current.selectedPath).toBe('C:\\first\\folder')
    })
  })

  describe('failed folder selection', () => {
    it('should set error when selection fails (not canceled)', async () => {
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: false,
        path: null,
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBe('Failed to select folder')
      expect(result.current.selectedPath).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should clear previous error on new attempt', async () => {
      // First, trigger an error
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: false,
        path: null,
        canceled: false
      })

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBe('Failed to select folder')

      // Now make a successful selection
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\success',
        canceled: false
      })

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.selectedPath).toBe('C:\\success')
    })
  })

  describe('error handling', () => {
    it('should handle thrown Error with message', async () => {
      const errorMessage = 'Dialog failed to open'
      mockOpenFolderDialog.mockRejectedValueOnce(new Error(errorMessage))

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle thrown non-Error objects', async () => {
      mockOpenFolderDialog.mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBe('Unknown error')
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle thrown null/undefined', async () => {
      mockOpenFolderDialog.mockRejectedValueOnce(null)

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.error).toBe('Unknown error')
    })

    it('should set isLoading to false even when error occurs', async () => {
      mockOpenFolderDialog.mockRejectedValueOnce(new Error('Test error'))

      const { result } = renderHook(() => useFolderOpen())

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('multiple operations', () => {
    it('should handle multiple successful folder selections', async () => {
      const paths = ['C:\\first', 'C:\\second', 'C:\\third']

      const { result } = renderHook(() => useFolderOpen())

      for (const path of paths) {
        mockOpenFolderDialog.mockResolvedValueOnce({
          success: true,
          path,
          canceled: false
        })

        await act(async () => {
          await result.current.openFolder()
        })

        expect(result.current.selectedPath).toBe(path)
      }

      expect(mockOpenFolderDialog).toHaveBeenCalledTimes(3)
    })

    it('should update selectedPath with latest selection', async () => {
      const { result } = renderHook(() => useFolderOpen())

      // First selection
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\old\\path',
        canceled: false
      })

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.selectedPath).toBe('C:\\old\\path')

      // Second selection
      mockOpenFolderDialog.mockResolvedValueOnce({
        success: true,
        path: 'C:\\new\\path',
        canceled: false
      })

      await act(async () => {
        await result.current.openFolder()
      })

      expect(result.current.selectedPath).toBe('C:\\new\\path')
    })
  })

  describe('hook stability', () => {
    it('should return stable openFolder function reference', async () => {
      mockOpenFolderDialog.mockResolvedValue({
        success: true,
        path: 'C:\\test',
        canceled: false
      })

      const { result, rerender } = renderHook(() => useFolderOpen())

      const firstOpenFolder = result.current.openFolder

      // Trigger a rerender
      rerender()

      const secondOpenFolder = result.current.openFolder

      expect(firstOpenFolder).toBe(secondOpenFolder)
    })
  })
})
