/**
 * FileSystem Feature Contract
 * Defines the IPC interface for file system operations
 */

// ============================================================================
// Channel Constants
// ============================================================================
export const FileSystemChannels = {
  OPEN_FOLDER_DIALOG: 'fs:openFolderDialog',
} as const;

// ============================================================================
// Types
// ============================================================================
export interface OpenFolderResult {
  success: boolean;
  path: string | null;
  canceled: boolean;
}

// ============================================================================
// API Contract
// ============================================================================
export interface IFileSystemApi {
  openFolderDialog(): Promise<OpenFolderResult>;
}
