/**
 * Preload Script
 * Exposes type-safe API to the renderer process via contextBridge
 */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FileSystemChannels } from '../shared/features/filesystem/fs.contract'
import { GitChannels } from '../shared/features/git/git.contract'
import type { IElectronApi } from '../shared/api'
import type { OpenFolderResult } from '../shared/features/filesystem/fs.contract'
import type { GetCommitsRequest, GetCommitsResult } from '../shared/features/git/git.contract'

// Type-safe API implementation
const api: IElectronApi = {
  // FileSystem API
  openFolderDialog: (): Promise<OpenFolderResult> => {
    return ipcRenderer.invoke(FileSystemChannels.OPEN_FOLDER_DIALOG)
  },

  // Git API
  getCommits: (request: GetCommitsRequest): Promise<GetCommitsResult> => {
    return ipcRenderer.invoke(GitChannels.GET_COMMITS, request)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose API:', error)
  }
} else {
  // Fallback for non-isolated context (not recommended for production)
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

