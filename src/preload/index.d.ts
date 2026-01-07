import { ElectronAPI } from '@electron-toolkit/preload'
import { IElectronApi } from '../shared/api'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronApi
  }
}

