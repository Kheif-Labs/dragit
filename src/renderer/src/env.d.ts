/**
 * Environment Type Definitions
 * Extends Window interface with type-safe API
 */

/// <reference types="vite/client" />

import type { IElectronApi } from '../../shared/api'

declare global {
  interface Window {
    api: IElectronApi
  }
}

export {}
