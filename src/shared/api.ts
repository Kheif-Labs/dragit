/**
 * Aggregated API Contract
 * Combines all feature APIs into a single interface exposed to the renderer
 */

import type { IFileSystemApi } from './features/filesystem/fs.contract';
import type { IGitApi } from './features/git/git.contract';

// ============================================================================
// Aggregated API Interface
// ============================================================================
export interface IElectronApi extends IFileSystemApi, IGitApi {}

// Re-export all feature contracts for convenience
export * from './features/filesystem/fs.contract';
export * from './features/git/git.contract';
