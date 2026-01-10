/**
 * FileSystem Feature Contract
 * Defines the IPC interface for file system operations
 */

// ============================================================================
// Channel Constants
// ============================================================================
export const FileSystemChannels = {
  OPEN_FOLDER_DIALOG: 'fs:openFolderDialog',
  GET_RECENT_PROJECTS: 'fs:getRecentProjects',
  CREATE_NEW_FILE: 'fs:createNewFile',
} as const;

// ============================================================================
// Types
// ============================================================================
export interface OpenFolderResult {
  success: boolean;
  path: string | null;
  canceled: boolean;
}

export interface RecentProject {
  name: string;
  path: string;
  lastOpened: string;
}

export interface GetRecentProjectsResult {
  success: boolean;
  projects: RecentProject[];
  error?: string;
}

export interface CreateNewFileResult {
  success: boolean;
  filePath: string | null;
  error?: string;
}

// ============================================================================
// API Contract
// ============================================================================
export interface IFileSystemApi {
  openFolderDialog(): Promise<OpenFolderResult>;
  getRecentProjects(): Promise<GetRecentProjectsResult>;
  createNewFile(): Promise<CreateNewFileResult>;
}
