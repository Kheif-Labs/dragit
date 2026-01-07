/**
 * Git Feature Contract
 * Defines the IPC interface for Git operations
 */

// ============================================================================
// Channel Constants
// ============================================================================
export const GitChannels = {
  GET_COMMITS: 'git:getCommits',
} as const;

// ============================================================================
// Types
// ============================================================================
export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface GetCommitsRequest {
  repoPath: string;
  limit?: number;
}

export interface GetCommitsResult {
  success: boolean;
  commits: GitCommit[];
  error?: string;
}

// ============================================================================
// API Contract
// ============================================================================
export interface IGitApi {
  getCommits(request: GetCommitsRequest): Promise<GetCommitsResult>;
}
